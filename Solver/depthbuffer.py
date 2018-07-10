#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: DepthBuffer
   :synopsis: A rendering DepthBuffer created from a Model3d and a Camera.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import math
import os
import sys
import numpy as np

from typing import List, Tuple

from camera import Camera
from filemanager import FileManager
from gradient import Gradient 
from mask import Mask
from services import Services

class TestDepthBuffer:
    """
    A simple model that provides easy inspection of intermedite results.
    Used for testing the solution pipeline.
    """
    def __init__(self):
        """
        Initialize an instancee of a DepthBuffer.
        """
        dimensions = 8
        self.width  = dimensions
        self.height = dimensions
        
        data = np.array(
        [  0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,
           0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,
           0.0,   0.0,   5.0,   6.0,   7.0,   8.0,   0.0,   0.0,
           0.0,   0.0,   5.0,   6.0,   7.0,   8.0,   0.0,   0.0,
           0.0,   0.0,   5.0,   6.0,   7.0,   8.0,   0.0,   0.0,
           0.0,   0.0,   5.0,   6.0,   7.0,   8.0,   0.0,   0.0,
           0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,
           0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0]
        )
        self.floats = data.reshape((dimensions, dimensions))

class DepthBuffer:
    """
    A rendering DepthBuffer created from a Model3d and a Camera.
    """
    SINGLE_PRECISION = 4

    def __init__(self, settings: dict, working_folder: str, services : Services) -> None:
        """
        Initialize an instancee of a DepthBuffer.
        Parameters:
        ----------
        setting
            The path of the DepthBuffer JSON file.
        working_folder
            The temp folder used for intermediate results.
        services
            Service support for logging, timers, etc.
        """
        self.debug = True

        self.settings = settings
        self.working_folder = working_folder
        self.services = services

        self.path = os.path.abspath(settings['FileName'])
        self._width = int(settings['Width'])
        self._height = int(settings['Height'])
        self.format = settings['Format']

        self.camera = Camera(settings['Camera'])

        self._floats_unit_differential : List[float] = []
        self._floats : np.ndarray = [] 
        self._gradients : List[np.ndarray] = [] 

    @property
    def name(self):
        """
        Returns the base name of the DepthBuffer.
        """
        return os.path.basename(self.path)

    @property
    def width(self):
        """
        Returns the width of the DB.
        """
        return self._width

    @width.setter
    def width(self, value):
        """
        Sets the width of the DB.
        """
        self._width = value

    @property
    def height(self):
        """
        Returns the height of the DB.
        """
        return self._height

    @height.setter
    def height(self, value):
        """
        Sets the height of the DB.
        """
        self._height = value

    @property
    def bytes_raw(self) -> bytes:
        """
        Constructs a list of bytes from the DepthBuffer.
        """
        # read raw bytes
        return FileManager().read__binary(self.path)

    @property
    def floats_raw(self) -> List[float]:
        """
        Constructs a list of floats that are in raw normalized DB format [0,1] from the DepthBuffer.
        """
        # convert to floats
        floats = FileManager().unpack_floats(self.bytes_raw)

        return floats

    @property
    def floats_model(self) -> List[float]:
        """
        Constructs a list of floats that are in model units.
        """
        floats_array = np.array(self.floats_raw)
        floats_array = self.normalized_to_model_depth(floats_array)
        floats = floats_array.tolist()       

        return floats

    @property
    def floats_unit_differential(self) -> List[float]:
        """
        Constructs a list of floats from the DepthBuffer.
        """
        # cached?
        if (len(self._floats_unit_differential) > 0):
            return self._floats_unit_differential

        floats_step = self.services.stopwatch.mark("floats")

        # now scale to map to a 2D array with unit steps between rows and columns
        extents = self.camera.near_plane_extents()
        xScale = self.width / extents[0]
        yScale = self.width / extents[1]
        assert math.fabs(xScale - yScale) < sys.float_info.epsilon, "Asymmetric scaling in mesh"

        scale_step = self.services.stopwatch.mark("scale floats")
        floats_raw = self.floats_raw

        floats_array = np.array(floats_raw)
        scaler = lambda v: self.normalized_to_model_depth_unit_differential(v, xScale)
        floats_array = scaler(floats_array)
        floats = floats_array.tolist()       

        self.services.stopwatch.log_time(scale_step)

        self._floats_unit_differential = floats
        
        self.services.stopwatch.log_time(floats_step)
        return self._floats_unit_differential

    @property
    def floats(self) -> np.ndarray:
        """
        Returns an np 2D array that holds the depths (model units).
        N.B. The model depths are scaled to match a unit differential grid.
        """
        if self.debug:
            test_depth_buffer = TestDepthBuffer()
            self._floats = test_depth_buffer.floats
            self._width = test_depth_buffer.width
            self._height = test_depth_buffer.height

        # cached?
        if (len(self._floats) > 0):
            return self._floats

        floats = np.array(self.floats_unit_differential)

        # transform 1D -> 2D
        a = np.array(floats)
        a = np.reshape(a, (self.height, self.width))

        self._floats = a       

        return self._floats

    @property
    def gradients(self) -> List[np.ndarray]:
        """
        Returns the XY gradients of the DB.
        """
        # cached?
        if (len(self._gradients) > 0):
            return self._gradients

        floats_array = self.floats
        gradient = Gradient(self.services)
        self._gradients = gradient.calculate(floats_array)

        return self._gradients

    @property
    def gradient_x(self):
        """
        Returns the X gradient of the DB.
        """
        return self.gradients[1]

    @property
    def gradient_y(self):
        """
        Returns the Y gradient of the DB.
        """
        return self.gradients[0]

    @property
    def background_mask(self) -> np.ndarray:
        """
        Retureens the background mask of the DepthBuffer.
        """
        mask = Mask(self.services)
        b_mask = mask.background_from_depth_buffer(self.floats)

        return b_mask

    def normalized_to_model_depth_unit_differential (self, value, scale):
        """
        Scales a normalized depth buffer value to scaled model units such that the differential step size (dx or dy) = 1.
        This scales the value such that gradient computation can ignore dx or dy.
        """
        # first scale to original model depth
        value_model_depth = self.normalized_to_model_depth(value)

        value = value_model_depth * scale
        return value

    def normalized_to_model_depth(self, normalized):
        """
        Convert a normalized depth [0,1] to depth in model units.
        https://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
        """
        normalized = 2.0 * normalized - 1.0

        z_linear = (2.0 * self.camera.near * self.camera.far) / (self.camera.far + self.camera.near - (normalized * (self.camera.far - self.camera.near)))

        # z_linear is the distance from the camera; adjust to yield height from mesh plane
        z_linear = self.camera.far - z_linear

        return z_linear

    def model_depth_to_normalized (self, z : float):
        """
        Returns the normalized depth buffer value of a model depth.
        """

        # distance from camera
        z = self.camera.far - z

        normalized = (self.camera.far + self.camera.near - 2.0 * self.camera.near * self.camera.far / z) / (self.camera.far - self.camera.near)
        normalized = (normalized + 1.0) / 2.0

        return normalized

    def scale_model_depth_normalized (self, normalized : float, scale : float):
        """
        Scales the model depth of a normalized depth value and returns the normalized value.

        Parameters
        ----------
        normalized
            A normalized depth buffer value.
        scale
            Scale factor to apply.
        
        Returns
        ----------
            Normalized scaled value.
        """
        scaled = self.scale_model_depth(normalized, scale)
        scaled_normalized = self.model_depth_to_normalized(scaled)

        return scaled_normalized

    def scale_model_depth (self, normalized : float, scale : float):
        """
        Scales the model depth of a normalized depth value.
        https://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer

        Parameters
        ----------
        normalized
            A normalized depth buffer value.
        scale
            Scale factor to apply.
        
        Returns
        ----------
            Scaled value in <model units>.

        """
        # distance from mesh plane
        z = self.normalized_to_model_depth(normalized)

        # scaled distance from mesh plane
        z = scale * z

        return z

    def scale_floats(self, scale: float) -> List[float]:
        """
        Transforms the depth buffer values (model units) by a scale factor.

        Parameters
        ----------
        scale
            Scale factor to be applied.

        Returns
        -------
            A List of floats in <model units>.
        """
        event = self.services.stopwatch.mark("scale floats")

        float_array = np.array(self.floats_raw)
        
        # scale
        scaler = lambda v: self.scale_model_depth(v, scale)        
        float_array = scaler(float_array)
        float_list = float_array.tolist()

        if self.debug:
            # write original floats
            unscaled_path = '%s/%s.floats.%f' % (self.working_folder, self.name, 1.0)
            FileManager().write_floats(unscaled_path, self.floats_model)

            # write transformed floats
            scaled_path = '%s/%s.floatsPrime.%f' % (self.working_folder, self.name, scale)
            FileManager().write_floats(scaled_path, float_list)

            self.verify_scale_buffer((unscaled_path, scaled_path), scale)
        
        self.services.stopwatch.log_time(event)
        return float_list

    def verify_scale_buffer(self, files : Tuple[str, str], scale : float) -> bool:
        """
        Compares the baseline floats with the scaled floats.

        Parameters:
        ----------
        files : tuple
            A tuple of the original, unscaled float file and the scaled float file.
        scale : float
            The scale factor applied to the depths.
        """
        unscaled_path, scaled_path = files
        print ("Unscaled : %s" % unscaled_path)
        print ("Scaled : %s" % scaled_path)

        unscaled = FileManager().read_floats(unscaled_path)
        scaled   = FileManager().read_floats(scaled_path)

        tolerance = 1e-6
        for index in range(0, len(unscaled)):
            try:    
                unscaled_value = unscaled[index]
                scaled_value   = scaled[index]

                equal = math.isclose(unscaled_value * scale, scaled_value, abs_tol=tolerance)
                if not equal:
                    print ("Values differ: %f != %f at index %d" % (unscaled_value, scaled_value, index))
                    return False

            except Exception:
                print ("An exception occurred validating the scaled DepthBuffer.")     
                return False

        print ("Scale verified.")
        return True

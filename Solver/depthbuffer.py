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
from services import Services

class DepthBuffer:
    """
    A rendering DepthBuffer created from a Model3d and a Camera.
    """
    SINGLE_PRECISION = 4

    def __init__(self, settings: str, working_folder: str, services : Services):
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
        self.debug = False
        self.settings = settings
        self.working_folder = working_folder
        self.services = services

        self.path = os.path.abspath(settings['FileName'])
        self._width = int(settings['Width'])
        self._height = int(settings['Height'])
        self.format = settings['Format']

        self.camera = Camera(settings['Camera'])

        self._floats   = None
        self._np_array = None

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
    def bytes_raw(self) -> List[bytes]:
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
    def floats(self) -> List[float]:
        """
        Constructs a list of floats from the DepthBuffer.
        """
        # cached?
        if (self._floats is not None):
            return self._floats

        floats_step = self.services.stopwatch.mark("floats")

        # convert to floats
        unpack_step = self.services.stopwatch.mark("unpack floats")
        floats = FileManager().unpack_floats(self.bytes_raw)
        self.services.stopwatch.log_time(unpack_step)

        # now scale to map to a 2D array with unit steps between rows and columns
        extents = self.camera.near_plane_extents()
        xScale = self.width / extents[0]
        yScale = self.width / extents[1]
        assert math.fabs(xScale - yScale) < sys.float_info.epsilon, "Asymmetric scaling in mesh"

        scale_step = self.services.stopwatch.mark("scale floats")
        floats_array = np.array(floats)
        scaler = lambda v: self.normalized_to_model_depth_unit_differential(v, xScale)
        floats_array = scaler(floats_array)
        floats = floats_array.tolist()       
        self.services.stopwatch.log_time(scale_step)

        self._floats = floats
        
        self.services.stopwatch.log_time(floats_step)
        return floats

    @property
    def np_array(self):
        """
        Returns a np array.
        The
        """
        # cached?
        if (self._np_array is not None):
            return self._np_array

        floats = np.array(self.floats)

        # transform 1D -> 2D
        a = np.array(floats)
        a = np.reshape(a, (self.height, self.width))

        self._np_array = a
        return a

    @property
    def gradients(self):
        """
        Returns the XY gradients of the DB.
        """
        floats_array = self.np_array
        result = np.gradient(floats_array)

        return result

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

    def scale_model_depth(self, normalized, scale):
        """
        Scales the model depth of a normalized depth value.
        https://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
        """
        # distance from mesh plane
        z = self.normalized_to_model_depth(normalized)
        # scaled distance from mesh plane
        z = scale * z

        # distance from camera
        z = self.camera.far - z

        scaled_normalized = (self.camera.far + self.camera.near - 2.0 * self.camera.near * self.camera.far / z) / (self.camera.far - self.camera.near)
        scaled_normalized = (scaled_normalized + 1.0) / 2.0

        return scaled_normalized

    def scale_floats(self, scale: float) -> List[float]:
        """
        Transforms the depth buffer (model units) by a scale factor.
        Returns a List of floats.
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
            FileManager().write_floats(unscaled_path, self.floats_raw)

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
                unscaled_value = self.normalized_to_model_depth(unscaled[index])
                scaled_value   = self.normalized_to_model_depth(scaled[index])

                equal = math.isclose(unscaled_value * scale, scaled_value, abs_tol=tolerance)
                if not equal:
                    print ("Values differ: %f != %f at index %d" % (unscaled_value, scaled_value, index))
                    return False

            except Exception:
                print ("An exception occurred validating the scaled DepthBuffer.")     
                return False

        print ("Scale verified.")
        return True

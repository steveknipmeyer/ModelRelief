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

import os
import struct
import numpy as np
import time
from typing import List, Tuple

from camera import Camera

class DepthBuffer:
    """
    A rendering DepthBuffer created from a Model3d and a Camera.
    """
    SINGLE_PRECISION = 4

    def __init__(self, settings):
        """
        Iniitalize an instancee of a DepthBuffer.
        """
        self.settings = settings
        self.path = os.path.abspath(settings['FileName'])
        self.width = int(settings['Width'])
        self.height = int(settings['Height'])
        self.format = settings['Format']

        self.camera = Camera(settings['Camera'])

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
    def byte_depths(self) -> List[bytes]:
        """
        Constructs a list of floats from the DepthBuffer.
        """
        # read raw bytes
        return self.read__binary(self.path)

    @property
    def floats(self) -> List[float]:
        """
        Constructs a list of floats from the DepthBuffer.
        """   
        # convert to floats
        floats = self.unpack_floats(self.byte_depths)

        # scale to a regular array with unit steps
        floats = [self.normalized_to_model_depth_unit_differential(value) for value in floats]
        
        return floats

    @property
    def np_array(self):
        """
        Returns a np array.
        The 
        """
        floats = np.array(self.floats)

        # transform 1D -> 2D        
        a = np.array(floats)
        a = np.reshape(a, (self.height, self.width))
        shape = a.shape
        
        return a
    
    @property
    def gradient_x(self):
        """
        Returns the X gradient of the DB.
        """

        floats = self.floats

        def exclude (index):
            """ Exclusion filter. """
            # skip first column
            if index % self.width == 0:
                return True

        previous_offset = 1
        grad_x = [self.gradient(floats, index, value, exclude, previous_offset) for index, value in enumerate(floats)]
        return grad_x

    @property
    def gradient_y(self):
        """
        Returns the Y gradient of the DB.
        """

        floats = self.floats

        def exclude (index):
            """ Exclusion filter. """
            # skip first row
            if index < self.width:
                return True

        previous_offset = self.width
        grad_y = [self.gradient(floats, index, value, exclude, previous_offset) for index, value in enumerate(floats)]
        return grad_y

    def gradient (self, floats, index, value, exclude, previous_offset):
        """
        Calculates the finite difference between two function values.
        """
        if exclude(index):
            return 0.0

        # convert to model space
        v          = value
        v_previous = floats[index - previous_offset]

        return v - v_previous

    def normalized_to_model_depth_unit_differential (self, value):
        """
        Scales a normalized depth buffer value to scaled model units such that the differential step size (dx or dy) = 1.
        This scales the value such that gradient computation can ignore dx or dy.       
        """
        # first scale to original model depth
        value_model_depth = self.normalized_to_model_depth(value)

        # now scale to map to a 2D array with unit steps between rows and columns
        extents = self.camera.near_plane_extents()
        
        valueX = value_model_depth * self.width / extents[0]
        valueY = value_model_depth * self.height / extents[1]

        return value_model_depth

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

    def read__binary(self, path):
        """
        Reads a raw depth buffer.
        A raw depth buffer is a binary stream of single precision four byte floats.
        This method returns a list of bytes.
        """
        with open(file=path, mode='rb') as file:
            byte_list = bytearray(file.read())
            return byte_list

    def write_binary(self, path, byte_values):
        """
        Writes a raw depth buffer.
        A raw depth buffer is a binary stream of single precision four byte floats.
        """
        with open(file=path, mode='wb') as file:
            file.write(byte_values)

    def unpack_floats(self, byte_depths, floats_per_unpack=None):
        """
        Returns a list of float tuples from a byte sequence.
        The length of the tuple is controlled by the floats_per_unpack parameter.

        The default is to return a single tuple containing all floats as performance testing
        shows that this is the most efficient.
        """
        if floats_per_unpack is None:
            floats_per_unpack = int(len(byte_depths) / DepthBuffer.SINGLE_PRECISION)

        float_count = len(byte_depths) / DepthBuffer.SINGLE_PRECISION
        unpack_steps = int(float_count / floats_per_unpack)

        float_tuples= []
        span = DepthBuffer.SINGLE_PRECISION * floats_per_unpack
        for value in range(unpack_steps):
            lower = value * span
            upper = lower + span
            unpack_format = '%df' % floats_per_unpack
            depth_tuple = struct.unpack(unpack_format, byte_depths[lower:upper])
            float_tuples.append(depth_tuple)

        # unpack list of tuples into a list of single float values
        floats = []
        for depth_tuple in float_tuples:
            for depth in depth_tuple:
                floats.append(depth)

        return floats

    def pack_floats(self, floats):
        """
        Packs a list of single precision (32 bit) floats into a byte sequence.
        """
        float_count = len(floats)

        pack_format = '%df' % float_count
        byte_values = struct.pack(pack_format, *floats)

        return byte_values

    def read_floats(self, path):
        """
        Reads a file into a list of floats.
        """
        with open(file=path, mode='r') as file:
            float_list = list(map(float, file))
            return float_list

    def write_floats(self, path, floats):
        """
        Writes a file from a list of floats.
        """
        with open(file=path, mode='w') as file:
            for value in floats:
                file.write(str(value) + '\n')


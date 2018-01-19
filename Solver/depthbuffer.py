#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: DepthBuffer
   :synopsis: A rendering DepthBuffer created from a Model3d and a Camera.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import struct

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
        self.format = settings['Format']

    @property
    def name(self):
        """
            Returns the base name of the DepthBuffer.
        """
        return os.path.basename(self.path)

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

        float_list = []
        span = DepthBuffer.SINGLE_PRECISION * floats_per_unpack
        for value in range(unpack_steps):
            lower = value * span
            upper = lower + span
            unpack_format = '%df' % floats_per_unpack
            depth = struct.unpack(unpack_format, byte_depths[lower:upper])
            float_list.append(depth)

        return float_list

    def pack_floats(self, floats):
        """
            Packs a list of single precision (32 bit) floats into a byte sequence.
        """
        float_count = len(floats)

        pack_format = '%df' % float_count
        byte_values = struct.pack(pack_format, *floats)

        return byte_values

    def write_floats(self, path, floats):
        """
            Writes a depth buffer from a list of floats.
        """
        with open(file=path, mode='w') as file:
            for depth_tuple in floats:
                for depth in depth_tuple:
                    file.write(str(depth) + '\n')

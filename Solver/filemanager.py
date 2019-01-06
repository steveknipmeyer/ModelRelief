#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: FileManager
   :synopsis: General support for file conversion and input/output.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import math
import struct
import numpy as np

from typing import List

class FileManager:
    """
    A class for general support for file conversion and input/output.
    """
    SINGLE_PRECISION = 4
    UNSIGNED_INTEGER = 4
    RGBA = 4

    def __init__(self) -> None:
        """
        Initialize an instancee of a FileManager.
        """
        self.debug = True

    def read_binary(self, path: str) -> bytearray:
        """
        Reads a raw stream of bytes.
        Note: A raw depth buffer is a binary stream of single precision four byte floats.
        """
        with open(file=path, mode='rb') as file:
            byte_list = bytearray(file.read())
            return byte_list

    def write_binary(self, path: str, byte_list: bytes):
        """
        Writes a raw stream of bytes.
        """
        with open(file=path, mode='wb') as file:
            file.write(byte_list)

    def unpack_floats(self, byte_list: bytes, floats_per_unpack=None) ->List[float]:
        """
        Returns a list of floats from a byte sequence.
        """

        # The default is to unpack in a single tuple containing all floats as performance testing
        # shows that this is the most efficient.
        float_count = int(len(byte_list) / FileManager.SINGLE_PRECISION)
        if floats_per_unpack is None:
            floats_per_unpack = float_count

        unpack_steps = int(float_count / floats_per_unpack)

        float_tuples= []
        span = FileManager.SINGLE_PRECISION * floats_per_unpack
        unpack_format = '%df' % floats_per_unpack
        for value in range(unpack_steps):
            lower = value * span
            upper = lower + span
            float_tuple = struct.unpack(unpack_format, byte_list[lower:upper])
            float_tuples.append(float_tuple)

        # unpack list of tuples into a list of single float values
        floats:List[float] = []
        for float_tuple in float_tuples:
            for value in float_tuple:
                floats.append(value)

        return floats

    def pack_floats(self, floats: List[float]) -> bytes:
        """
        Packs a list of single precision (32 bit) floats into a byte sequence.
        """
        float_count = len(floats)

        pack_format = '%df' % float_count
        byte_values = struct.pack(pack_format, *floats)

        return byte_values

    def read_floats(self, path: str) ->List[float]:
        """
        Reads a file into a list of floats.
        """
        with open(file=path, mode='r') as file:
            float_list = list(map(float, file))
            return float_list

    def write_floats(self, path: str, floats: List[float]) -> None:
        """
        Writes a file from a list of floats.
        """
        with open(file=path, mode='w') as file:
            for value in floats:
                file.write(str(value) + '\n')

    def unpack_integer32(self, byte_list: bytes, integers_per_unpack=None) ->List[int]:
        """
        Returns a list of 32-bit integer from a byte sequence.
        """

        # The default is to unpack in a single tuple containing all integets as performance testing
        # shows that this is the most efficient.
        integer_count = int(len(byte_list) / FileManager.UNSIGNED_INTEGER)
        if integers_per_unpack is None:
            integers_per_unpack = integer_count

        unpack_steps = int(integer_count / integers_per_unpack)

        integer_tuples= []
        span = FileManager.UNSIGNED_INTEGER * integers_per_unpack
        unpack_format = '%dI' % integers_per_unpack
        for value in range(unpack_steps):
            lower = value * span
            upper = lower + span
            integer_tuple = struct.unpack(unpack_format, byte_list[lower:upper])
            integer_tuples.append(integer_tuple)

        # unpack list of tuples into a list of single integer values
        integers:List[int] = []
        for integer_tuple in integer_tuples:
            for value in integer_tuple:
                integers.append(value)

        return integers

    def unpack_rgba(self, byte_list: bytes) ->List[np.ndarray]:
        """
        Returns a list of NumPy arrays representing the RGBA planes.
        """
        elements = len(byte_list) / FileManager.RGBA
        dimensions = int(math.sqrt(elements))

        # convert to 32 bit unsigned integers
        int32_list = FileManager().unpack_integer32(byte_list)
        int32_array = np.reshape(int32_list, [dimensions, dimensions])
        int32_array = int32_array.astype(np.uint32)
        int32_array = np.flipud(int32_array)

        # RGBA
        rgba_array = np.zeros((dimensions, dimensions, FileManager.RGBA), dtype=np.uint8)
        for color_index in range(FileManager.RGBA):
            bit_shift = 8 * color_index
            mask = 0xFF << bit_shift
            component_array = (int32_array[:,:] & mask) >> bit_shift
            rgba_array[:,:, color_index] = component_array

        return rgba_array
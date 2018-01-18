#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Scalar
   :synopsis: Multiplies a depth buffer by a constant.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

import struct
import os

def read__binary(path):
    """
        Reads a raw depth buffer.
        A raw depth buffer is a binary stream of 4 byte floats.
        This method returns a list of bytes.
    """
    with open(file=path, mode='rb') as file:
        byte_list = bytearray(file.read())
        return byte_list

def unpack_floats(byte_depths, floats_per_unpack=1):
    """
        Returns a list of floats from a byte sequence.
    """
    float_count = len(byte_depths) / 4
    unpack_steps = int(float_count / floats_per_unpack)

    float_list = []
    span = 4 * floats_per_unpack
    for value in range(unpack_steps):
        lower = value * span
        upper = lower + span
        unpack_format = '%df' % floats_per_unpack
        depth = struct.unpack(unpack_format, byte_depths[lower:upper])
        float_list.append(depth)
    return float_list

def write_buffer(path, float_list, scale):
    """
        Writes a depth buffer from a list of floats.
    """
    with open(file=path, mode='w') as file:
        for depth_tuple in float_list:
            for depth in depth_tuple:
                file.write(str(depth * scale) + '\n')

def main():
    """
        Main entry point.
    """
    file_name = 'Lucy.raw'
    byte_depths = read__binary(file_name)

    byte_count = len(byte_depths)
    float_count = int(byte_count / 4)
    print("The total number of bytes in %s = %d." % (file_name, byte_count))

    float_list = unpack_floats(byte_depths, float_count)
    write_buffer('Lucy.float', float_list, 1)
    write_buffer('Lucy.2Xfloat', float_list, 2)

if __name__ == "__main__":

    os.chdir('./Notebooks')
    main()

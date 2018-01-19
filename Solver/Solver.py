#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Solver
   :synopsis: Generates a mesh from a DepthBuffer and a MeshTransform.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

import argparse
import json
import os
import struct
import sys

from depthbuffer import DepthBuffer
from meshtransform import MeshTransform

class Solver:
    """
    Transforms a DepthBuffer to create a new DepthBuffer based on a MeshTransform.
    """

    SINGLE_PRECISION = 4

    def __init__(self, settings, working):
        """
            Iniitalize an instane of the Solver.
            settings : path to JSON settings
        """
        with open(settings) as json_file:
            self.settings = json.load(json_file)

        self.initialize_settings()
        self.working_folder = os.path.abspath(working)

    def initialize_settings(self):
        """
            Unpack the JSON settings file and initialie Solver properties.
        """
        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'])
        self.mesh_transform = MeshTransform(self.settings['MeshTransform'])

    def read__binary(self, path):
        """
            Reads a raw depth buffer.
            A raw depth buffer is a binary stream of single precision byte floats.
            This method returns a list of bytes.
        """
        with open(file=path, mode='rb') as file:
            byte_list = bytearray(file.read())
            return byte_list

    def unpack_floats(self, byte_depths, floats_per_unpack=None):
        """
            Returns a list of float tuples from a byte sequence.
            The length of the tuple is controlled by the floats_per_unpack parameter.

            The default is to return a single tuple containing all floats as performance testing
            shows that this is the most efficient.
        """
        if floats_per_unpack is None:
            floats_per_unpack = int(len(byte_depths) / Solver.SINGLE_PRECISION)

        float_count = len(byte_depths) / Solver.SINGLE_PRECISION
        unpack_steps = int(float_count / floats_per_unpack)

        float_list = []
        span = Solver.SINGLE_PRECISION * floats_per_unpack
        for value in range(unpack_steps):
            lower = value * span
            upper = lower + span
            unpack_format = '%df' % floats_per_unpack
            depth = struct.unpack(unpack_format, byte_depths[lower:upper])
            float_list.append(depth)

        return float_list

    def write_buffer(self, float_list, scale):
        """
            Writes a depth buffer from a list of floats.
        """

        file_path = '%s.%f' % (self.depth_buffer.path, scale)

        with open(file=file_path, mode='w') as file:
            for depth_tuple in float_list:
                for depth in depth_tuple:
                    file.write(str(depth * scale) + '\n')

    def transform_buffer(self):
        """
            Transforms a DepthBuffer by a MeshTransform
        """

        byte_depths = self.read__binary(self.depth_buffer.path)
        float_list = self.unpack_floats(byte_depths)

        self.write_buffer(float_list, 1.0)
        self.write_buffer(float_list, self.mesh_transform.scale)

def main():
    """
        Main entry point.
    """
    options_parser = argparse.ArgumentParser()
    options_parser.add_argument('--settings', '-s', description='Mesh JSON settings file that defines the associated DepthBuffer and MeshTransform.', required=True)
    options_parser.add_argument('--working', '-w', description='Temporary working folder.', required=True)
    arguments = options_parser.parse_args()

    solver = Solver(arguments.settings, arguments.working)
    solver.transform_buffer()

if __name__ == '__main__':
    main()

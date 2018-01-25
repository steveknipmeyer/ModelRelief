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

from depthbuffer import DepthBuffer
from mesh import Mesh
from meshtransform import MeshTransform

class Solver:
    """
    Transforms a DepthBuffer to create a new DepthBuffer based on a MeshTransform.
    """
    def __init__(self, settings, working):
        """
            Iniitalize an instane of the Solver.
            settings : path to JSON settings
        """
        with open(settings) as json_file:
            self.settings = json.load(json_file)

        self.initialize_settings()

        working_folder = os.path.abspath(working)
        self.working_folder = working_folder
        if not os.path.exists(working_folder):
            os.makedirs(working_folder)

    def initialize_settings(self):
        """
            Unpack the JSON settings file and initialie Solver properties.
        """
        self.mesh = Mesh(self.settings)
        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'])
        self.mesh_transform = MeshTransform(self.settings['MeshTransform'])

    def transform_buffer(self):
        """
            Transforms a DepthBuffer by a MeshTransform
        """

        byte_depths = self.depth_buffer.read__binary(self.depth_buffer.path)
        floats = self.depth_buffer.unpack_floats(byte_depths)

        file_path = '%s/%s.%f' % (self.working_folder, self.depth_buffer.name, 1.0)
        self.depth_buffer.write_floats(file_path, floats)

        scaled_floats = [depth * self.mesh_transform.scale for depth in floats]

        scale = self.mesh_transform.scale
        file_path = '%s/%s.%f' % (self.working_folder, self.depth_buffer.name, scale)
        self.depth_buffer.write_floats(file_path, scaled_floats)

        file_path = '%s/%s' % (self.working_folder, self.mesh.name)
        self.depth_buffer.write_binary(file_path, self.depth_buffer.pack_floats(scaled_floats))

def main():
    """
        Main entry point.
    """
    os.chdir(os.path.dirname(__file__))

    options_parser = argparse.ArgumentParser()
    options_parser.add_argument('--settings', '-s',
                                help='Mesh JSON settings file that defines the associated DepthBuffer and MeshTransform.', required=True)
    options_parser.add_argument('--working', '-w',
                                help='Temporary working folder.', required=True)
    arguments = options_parser.parse_args()

    solver = Solver(arguments.settings, arguments.working)
    solver.transform_buffer()

if __name__ == '__main__':
    main()

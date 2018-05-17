#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Solver
   :synopsis: Generates a mesh from a DepthBuffer and a MeshTransform.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""

import argparse
import colorama
import json
import os

from filemanager import FileManager
from logger import Logger
from services import Services

from depthbuffer import DepthBuffer
from mesh import Mesh
from meshtransform import MeshTransform

from attenuation import Attenuation
from gradient import Gradient
from meshscale import MeshScale
from poisson import Poisson
from threshold import Threshold
from unsharpmask import UnsharpMask

class Solver:
    """
    Transforms a DepthBuffer to create a Mesh (raw float format) based on a MeshTransform.
    """
    def __init__(self, settings: str, working: str):
        """
        Initialize an instance of the Solver.

        Parameters
        ----------
        settings
            Path to JSON Mesh settings file.
        working
            Working folder path for intermediate files.
        """
        # Windows only
        colorama.init()

        working_folder = os.path.abspath(working)
        self.working_folder = working_folder
        if not os.path.exists(working_folder):
            os.makedirs(working_folder)

        self.services = Services(self.working_folder, Logger())

        # solver classes
        self.attenuation = Attenuation(self.services)
        self.gradient = Gradient(self.services)
        self.meshscale = MeshScale(self.services)
        self.poisson = Poisson(self.services)
        self.threshold = Threshold(self.services)
        self.unsharpmask = UnsharpMask(self.services)

        with open(settings) as json_file:
            self.settings = json.load(json_file)
        self.initialize_settings()

    def initialize_settings(self):
        """
        Unpack the JSON settings file and initialie Solver properties.
        """
        self.mesh = Mesh(self.settings)
        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'], self.working_folder, self.services)
        self.mesh_transform = MeshTransform(self.settings['MeshTransform'])

    def transform(self):
        """
        Transforms a DepthBuffer by a MeshTransform
        """
        self.services.logger.logDebug("Solver transform begin")

        buffer = self.depth_buffer
        scaled_floats = buffer.scale_floats(self.mesh_transform.lambda_scale)

        # write final raw bytes
        file_path = '%s/%s' % (self.working_folder, self.mesh.name)
        FileManager().write_binary(file_path, FileManager().pack_floats(scaled_floats))

        self.services.logger.logDebug("Solver transform end")

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
    solver.transform()

if __name__ == '__main__':
    main()

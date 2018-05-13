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
import json
import math
import os
import time
import numpy as np
from typing import List, Tuple

from depthbuffer import DepthBuffer
from mesh import Mesh
from meshtransform import MeshTransform

DEBUG = False

class Solver:
    """
    Transforms a DepthBuffer to create a Mesh (raw float format) based on a MeshTransform.
    """
    def __init__(self, settings: str, working: str):
        """
        Initialize an instance of the Solver.

        Parameters
        ----------
        settings : str
            Path to JSON Mesh settings file.
        working
            Working folder path for intermediate files.
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

    def transform_floats(self, floats : List[float], scale):
        """
        Transforms a list of floats by a scale factor using numpy.
        """
        float_array = np.array(floats)
        
        # scale
        scaler = lambda v: self.depth_buffer.scale_model_depth(v, scale)        
        float_array = scaler(float_array)
        
        return float_array.tolist()

    def transform_buffer(self):
        """
        Transforms a DepthBuffer by a MeshTransform
        """
        floats = self.depth_buffer.floats_raw

        # numpy (40X faster)
        start_time = time.time()
        scale = self.mesh_transform.scale
        scaled_floats = self.transform_floats (floats, scale)
        print ("transform_floats_np = %s" % (time.time() - start_time))

        # write final raw bytes
        file_path = '%s/%s' % (self.working_folder, self.mesh.name)
        self.depth_buffer.write_binary(file_path, self.depth_buffer.pack_floats(scaled_floats))

        if DEBUG:
            # write original floats
            unscaled_path = '%s/%s.floats.%f' % (self.working_folder, self.depth_buffer.name, 1.0)
            self.depth_buffer.write_floats(unscaled_path, floats)

            # write transformed floats
            scaled_path = '%s/%s.floatsPrime.%f' % (self.working_folder, self.depth_buffer.name, scale)
            self.depth_buffer.write_floats(scaled_path, scaled_floats)

            self.verify_transform((unscaled_path, scaled_path), self.mesh_transform.scale)
    
    def verify_transform(self, files : Tuple[str, str], scale : float) -> None:
        """
        Compares the baseline float file with the scaled float file.

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

        unscaled = self.depth_buffer.read_floats(unscaled_path)
        scaled   = self.depth_buffer.read_floats(scaled_path)

        tolerance = 1e-6
        for index in range(0, len(unscaled)):
            try:    
                unscaled_value = self.depth_buffer.normalized_to_model_depth(unscaled[index])
                scaled_value   = self.depth_buffer.normalized_to_model_depth(scaled[index])

                equal = math.isclose(unscaled_value * scale, scaled_value, abs_tol=tolerance)
                if not equal:
                    print ("Values differ: %f != %f at index %d" % (unscaled_value, scaled_value, index))
                    break
            except Exception:
                print ("An exception occurred validating the scaled DepthBuffer.")     
                break

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

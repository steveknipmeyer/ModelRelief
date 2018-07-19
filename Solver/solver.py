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
import numpy as np
import time
from shutil import copyfile

from filemanager import FileManager 
from logger import Logger 
from mathtools import MathTools
from services import Services 

from depthbuffer import DepthBuffer
from mesh import Mesh
from meshtransform import MeshTransform

from attenuation import Attenuation
from difference import Difference, FiniteDifference, Axis
from gradient import Gradient
from mask import Mask
from meshscale import MeshScale
from poisson import Poisson
from threshold import Threshold
from unsharpmask import UnsharpMask, UnsharpMaskParameters

class Solver:
    """
    Transforms a DepthBuffer to create a Mesh (raw float format) based on a MeshTransform.
    """
    def __init__(self, settings: str, working: str) -> None:
        """
        Initialize an instance of the Solver.

        Parameters
        ----------
        settings
            Path to JSON Mesh settings file.
        working
            Working folder path for intermediate files.
        """
        self.debug = False

        # Windows only
        colorama.init()

        working_folder = os.path.abspath(working)
        self.working_folder = working_folder
        if not os.path.exists(working_folder):
            os.makedirs(working_folder)

        self.root_folder = os.path.abspath('../ModelRelief/wwwroot')

        self.services = Services(self.root_folder, self.working_folder, Logger())

        # solver classes
        self.attenuation = Attenuation(self.services)
        self.difference = Difference(self.services)
        self.gradient = Gradient(self.services)
        self.mask = Mask(self.services) 
        self.meshscale = MeshScale(self.services)
        self.poisson = Poisson(self.services) 
        self.threshold = Threshold(self.services)
        self.unsharpmask = UnsharpMask(self.services)

        # image arrays
        self.depth_buffer_floats: np.ndarray = None
        self.depth_buffer_mask: np.ndarray = None
        self.gradient_x: np.ndarray = None
        self.gradient_x_mask: np.ndarray = None
        self.gradient_y: np.ndarray = None
        self.gradient_y_mask: np.ndarray = None
        self.combined_mask: np.ndarray = None
        self.gradient_x_unsharp: np.ndarray = None
        self.gradient_y_unsharp: np.ndarray = None

        # mesh arrays
        self.mesh_result: np.ndarray = None

        with open(settings) as json_file:
            self.settings = json.load(json_file)
        self.initialize_settings()

    def initialize_settings(self):
        """
        Unpack the JSON settings file and initialie Solver properties.
        """
        self.mesh = Mesh(self.settings, self.services)
        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'], self.services)
        self.mesh_transform = MeshTransform(self.settings['MeshTransform'])

    def scale_mesh(self):
        """
        Scales a DepthBuffer by the scale factor in MeshTransform.P1.
        """
        self.services.logger.logDebug("Solver: scale_mesh begin")

        buffer = self.depth_buffer
        scaled_floats = buffer.scale_floats(self.mesh_transform.p1)

        # write final raw bytes
        file_path = '%s/%s' % (self.working_folder, self.mesh.name)
        FileManager().write_binary(file_path, FileManager().pack_floats(scaled_floats))

        self.services.logger.logDebug("Solver: scale_mesh end")

    def transform_mesh(self):
        """
        Transforms a DepthBuffer by the MeshTransform settings.
        """
        self.services.logger.logDebug("Solver: transform begin")

        # destination_file = '%s/%s' % (self.working_folder, self.mesh.name)
        # # copyfile does not overwrite...
        # if os.path.isfile(destination_file):
        #     os.remove(destination_file)

        # copyfile(__file__, destination_file)

        # depth buffer
        self.depth_buffer_floats = self.depth_buffer.floats
        self.depth_buffer_mask = self.depth_buffer.background_mask

        self.gradient_x = self.depth_buffer.gradient_x
        self.gradient_y = self.depth_buffer.gradient_y

        # Apply threshold to <entire> calculated gradient to find gradient masks.
        threshold = float(self.mesh_transform.gradient_threshold) if True else float("inf")
        self.gradient_x_mask = self.mask.mask_threshold(self.gradient_x, threshold)
        self.gradient_y_mask = self.mask.mask_threshold(self.gradient_y, threshold)

        # Modify gradient by applying threshold, setting values above threshold to zero.
        self.gradient_x = self.threshold.apply(self.gradient_x, threshold)
        self.gradient_y = self.threshold.apply(self.gradient_y, threshold)

        # Composite mask: Values are processed only if they pass all three masks.
        #    A value must have a 1 in the background mask.
        #    A value must have both dI/dx <and> dI/dy that are 1 in the respective gradient masks.
        self.combined_mask = self.gradient_x_mask * self.gradient_y_mask
        # N.B. Including the background result in the mask causes the "leading" derivatives along +X, +Y to be excluded.
        #      The derivates are forward differences so they are defined (along +X, +Y) in the XY region <outside> the background mask.
        # self.combined_mask = self.combined_mask * self.depth_buffer_mask

        # Mask the thresholded gradients.
        self.gradient_x = self.gradient_x * self.combined_mask
        self.gradient_y = self.gradient_y * self.combined_mask

        # Attenuate the gradient to reduce high values and boost small values (acceuntuating some detail.)
        if True:
            self.gradient_x = self.attenuation.apply(self.gradient_x, self.mesh_transform.attenuation_parameters)
            self.gradient_y = self.attenuation.apply(self.gradient_y, self.mesh_transform.attenuation_parameters)

        # unsharp masking
        self.gradient_x_unsharp = self.gradient_x
        self.gradient_y_unsharp = self.gradient_y
        if True:
            gaussian_low = float(self.mesh_transform.unsharpmask_parameters.gaussian_low) if True else 0.0
            gaussian_high = float(self.mesh_transform.unsharpmask_parameters.gaussian_high) if True else 0.0
            high_frequency_scale = float(self.mesh_transform.unsharpmask_parameters.high_frequency_scale) if True else 1.0
            parameters = UnsharpMaskParameters(gaussian_low, gaussian_high, high_frequency_scale)

            self.gradient_x_unsharp = self.unsharpmask.apply(self.gradient_x, self.combined_mask, parameters)
            self.gradient_y_unsharp = self.unsharpmask.apply(self.gradient_y, self.combined_mask, parameters)

        dGxdx = self.difference.difference_x(self.gradient_x_unsharp, FiniteDifference.Backward)
        dGydy = self.difference.difference_y(self.gradient_y_unsharp, FiniteDifference.Backward)
        divG = dGxdx + dGydy

        self.mesh_result = self.poisson.solve(divG)

        # apply offset
        offset = np.min(self.mesh_result)
        self.mesh_result = self.mesh_result - offset

        # apply background mask to reset background to zero
        self.mesh_result = self.mesh_result * self.depth_buffer_mask

        if (self.debug):
            (rows, _) = self.depth_buffer.floats.shape
            maximum_rows = 16
            if rows <= maximum_rows:
                print ("Results")
                print ("------------------------------------------------------------")
                MathTools.print_array("I", self.depth_buffer.floats)
                MathTools.print_array("Gx", self.gradient_x)
                MathTools.print_array("dGxdx", dGxdx)
                MathTools.print_array("Gy", self.gradient_y)
                MathTools.print_array("dGydy", dGydy)
                MathTools.print_array("divG", divG)
                MathTools.print_array("Poisson Solution", self.mesh_result)
        self.services.logger.logDebug("Solver: transform_mesh end")

        # write final mesh
        file_path = '%s/%s' % (self.working_folder, self.mesh.name)
        (width, height) = self.mesh_result.shape
        mesh_list = self.mesh_result.reshape(width * height, 1)
        FileManager().write_binary(file_path, FileManager().pack_floats(mesh_list))

    def transform(self):
        """
        Transforms a DepthBuffer by the MeshTransform settings.
        """
        if (float(self.mesh_transform.p1) > 0.0):
            self.scale_mesh()
            return

        self.transform_mesh()            

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

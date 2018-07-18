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

from filemanager import FileManager 
from logger import Logger 
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
from unsharpmask import UnsharpMask

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
        self.depth_buffer: np.ndarray = None
        self.depth_buffer_mask: np.ndarray = None
        self.gradient_x: np.ndarray = None
        self.gradient_x_mask: np.ndarray = None
        self.gradient_y: np.ndarray = None
        self.gradient_y_mask: np.ndarray = None
        self.combined_mask: np.ndarray = None
        self.gradient_x_unsharp: np.ndarray = None
        self.gradient_y_unsharp: np.ndarray = None

        # mesh arrays
        self.mesh: np.ndarray = None

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

    # def calculate_images(self) -> None:
    #     """
    #     Updates the image view data : DepthBuffer and the supporting gradients and masks.
    #     """
    #     # background mask
    #     self.depth_buffer = self.solver.depth_buffer.floats
    #     self.depth_buffer_mask = self.solver.depth_buffer.background_mask

    #     self.gradient_x = self.solver.depth_buffer.gradient_x
    #     self.gradient_y = self.solver.depth_buffer.gradient_y

    #     # Apply threshold to <entire> calculated gradient to find gradient masks.
    #     threshold = self.solver.mesh_transform.gradient_threshold if self.ui.gradientThresholdCheckBox.isChecked() else float("inf")
    #     self.gradient_x_mask = self.solver.mask.mask_threshold(self.gradient_x, threshold)
    #     self.gradient_y_mask = self.solver.mask.mask_threshold(self.gradient_y, threshold)

    #     # Modify gradient by applying threshold, setting values above threshold to zero.
    #     self.gradient_x = self.solver.threshold.apply(self.gradient_x, threshold)
    #     self.gradient_y = self.solver.threshold.apply(self.gradient_y, threshold)

    #     # Composite mask: Values are processed only if they pass all three masks.
    #     #    A value must have a 1 in the background mask.
    #     #    A value must have both dI/dx <and> dI/dy that are 1 in the respective gradient masks.
    #     self.combined_mask = self.gradient_x_mask * self.gradient_y_mask
    #     # N.B. Including the background result in the mask causes the "leading" derivatives along +X, +Y to be excluded.
    #     #      The derivates are forward differences so they are defined (along +X, +Y) in the XY region <outside> the background mask.
    #     # self.combined_mask = self.combined_mask * self.depth_buffer_mask

    #     # Mask the thresholded gradients.
    #     self.gradient_x = self.gradient_x * self.combined_mask
    #     self.gradient_y = self.gradient_y * self.combined_mask

    #     # Attenuate the gradient to reduce high values and boost small values (acceuntuating some detail.)
    #     if self.ui.attenuationCheckBox.isChecked():
    #         self.gradient_x = self.solver.attenuation.apply(self.gradient_x, self.solver.mesh_transform.attenuation_parameters)
    #         self.gradient_y = self.solver.attenuation.apply(self.gradient_y, self.solver.mesh_transform.attenuation_parameters)

    #     # unsharp masking
    #     self.gradient_x_unsharp = self.gradient_x
    #     self.gradient_y_unsharp = self.gradient_y
    #     if (self.ui.unsharpMaskingCheckBox.isChecked()):
    #         gaussian_low = self.solver.mesh_transform.unsharpmask_parameters.gaussian_low if self.ui.unsharpGaussianLowCheckBox.isChecked() else 0.0
    #         gaussian_high = self.solver.mesh_transform.unsharpmask_parameters.gaussian_high if self.ui.unsharpGaussianHighCheckBox.isChecked() else 0.0
    #         high_frequency_scale = self.solver.mesh_transform.unsharpmask_parameters.high_frequency_scale if self.ui.unsharpHFScaleCheckBox.isChecked() else 1.0
    #         parameters = UnsharpMaskParameters(gaussian_low, gaussian_high, high_frequency_scale)

    #         self.gradient_x_unsharp = self.solver.unsharpmask.apply(self.gradient_x, self.combined_mask, parameters)
    #         self.gradient_y_unsharp = self.solver.unsharpmask.apply(self.gradient_y, self.combined_mask, parameters)

    # def calculate_meshes(self, preserve_camera: bool = True) -> None:
    #     """
    #     Updates the meshes.
    #     """
    #     # calculate divergence
    #     dGxdx = self.solver.difference.difference_x(self.gradient_x_unsharp, FiniteDifference.Backward)
    #     dGydy = self.solver.difference.difference_y(self.gradient_y_unsharp, FiniteDifference.Backward)
    #     divG = dGxdx + dGydy

    #     mesh = self.solver.poisson.solve(divG)

    #     # apply offset
    #     offset = np.min(mesh)
    #     mesh = mesh - offset

    #     # apply background mask to reset background to zero
    #     mesh = mesh * self.depth_buffer_mask

    #     if (self.debug):
    #         (rows, _) = self.solver.depth_buffer.floats.shape
    #         maximum_rows = 16
    #         if rows <= maximum_rows:
    #             print ("Results")
    #             print ("------------------------------------------------------------")
    #             MathTools.print_array("I", self.solver.depth_buffer.floats)
    #             MathTools.print_array("Gx", self.gradient_x)
    #             MathTools.print_array("dGxdx", dGxdx)
    #             MathTools.print_array("Gy", self.gradient_y)
    #             MathTools.print_array("dGydy", dGydy)
    #             MathTools.print_array("divG", divG)
    #             MathTools.print_array("Poisson Solution", mesh)
        self.services.logger.logDebug("Solver: transform_mesh end")

    def transform(self):
        """
        Transforms a DepthBuffer by the MeshTransform settings.
        """
        if (self.mesh_transform.p1 > 0.0):
            self.scale_mesh()

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

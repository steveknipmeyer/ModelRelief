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

        # processing steps
        self.enable_gradient_threshold = True
        self.enable_attenuation = True
        self.enable_unsharpmask = True
        self.enable_unsharpmask_gaussian_high = True
        self.enable_unsharpmask_gaussian_low = True
        self.enable_unsharpmask_high_frequence_scale = True

        # image arrays
        self.depth_buffer_model: np.ndarray = None                      # DepthBuffer : Z coordinated in model units
        self.depth_buffer_mask: np.ndarray = None                       # DepthBuffer : background bit mask of complete model
        self.dGxdx = None                                               # dGradientX(x,y) / dx
        self.dGydy = None                                               # dGradientY(x,y) / dy
        self.divG = None                                                # div Gradient(x,y)
        self.gradient_x: np.ndarray = None                              # GradientX (thresholded)
        self.gradient_x_mask: np.ndarray = None                         # GradientY (thresholded)
        self.gradient_y: np.ndarray = None                              # GradientX bit mask (thresholded)
        self.gradient_y_mask: np.ndarray = None                         # GradientX bit mask (thresholded)
        self.combined_mask: np.ndarray = None                           # final bit mask : compostite 
        self.gradient_x_unsharp: np.ndarray = None                      # GradientX : (unsharp masked)
        self.gradient_y_unsharp: np.ndarray = None                      # GradientY : (unsharp masked)

        # final result
        self.mesh_scaled: np.ndarray = None
        self.mesh_transformed: np.ndarray = None

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

    def process_depth_buffer(self):
        """
            Process the depth buffer.
            The depth buffer is converted into model units.
            The background bit mask is calculated.
        """
        self.depth_buffer_model = self.depth_buffer.floats
        self.depth_buffer_mask = self.depth_buffer.background_mask

    def process_gradients(self):
        """
            Calculate the X and Y gradients.
            The gradients are thresholded to remove high values such as at the model edges.
            The gradients are filtered by applying the composite mask.
        """
        self.gradient_x = self.depth_buffer.gradient_x
        self.gradient_y = self.depth_buffer.gradient_y

        # Modify gradient by applying threshold, setting values above threshold to zero.
        threshold = self.mesh_transform.gradient_threshold if self.enable_gradient_threshold else float("inf")
        self.gradient_x = self.threshold.apply(self.gradient_x, threshold)
        self.gradient_y = self.threshold.apply(self.gradient_y, threshold)

        # Composite mask: Values are processed only if they pass all three masks.
        #    A value must have a 1 in the background mask.
        #    A value must have both dI/dx <and> dI/dy that are 1 in the respective gradient masks.
        self.gradient_x_mask = self.mask.mask_threshold(self.gradient_x, threshold)
        self.gradient_y_mask = self.mask.mask_threshold(self.gradient_y, threshold)
        self.combined_mask = self.gradient_x_mask * self.gradient_y_mask
        # N.B. Including the background result in the mask causes the "leading" derivatives along +X, +Y to be excluded.
        #      The derivates are forward differences so they are defined (along +X, +Y) in the XY region <outside> the background mask.
        # self.combined_mask = self.combined_mask * self.depth_buffer_mask

        # Mask the thresholded gradients.
        self.gradient_x = self.gradient_x * self.combined_mask
        self.gradient_y = self.gradient_y * self.combined_mask

    def process_attenuation(self):
        """
            Attenuate the gradients to dampen large values.
        """
        if self.enable_attenuation:
            self.gradient_x = self.attenuation.apply(self.gradient_x, self.mesh_transform.attenuation_parameters)
            self.gradient_y = self.attenuation.apply(self.gradient_y, self.mesh_transform.attenuation_parameters)

    def process_unsharpmask(self):
        """
            Apply unsharp masking to amplify details.
            The high frequency features are obtained from the image, scaled and the added back.
        """
        self.gradient_x_unsharp = self.gradient_x
        self.gradient_y_unsharp = self.gradient_y

        if self.enable_unsharpmask:
            gaussian_low = self.mesh_transform.unsharpmask_parameters.gaussian_low if self.enable_unsharpmask_gaussian_high else 0.0
            gaussian_high = self.mesh_transform.unsharpmask_parameters.gaussian_high if self.enable_unsharpmask_gaussian_low else 0.0
            high_frequency_scale = self.mesh_transform.unsharpmask_parameters.high_frequency_scale if self.enable_unsharpmask_high_frequence_scale else 1.0
            parameters = UnsharpMaskParameters(gaussian_low, gaussian_high, high_frequency_scale)

            self.gradient_x_unsharp = self.unsharpmask.apply(self.gradient_x, self.combined_mask, parameters)
            self.gradient_y_unsharp = self.unsharpmask.apply(self.gradient_y, self.combined_mask, parameters)

    def process_poisson(self):
        """
            Solve the Poisson equation that returns the final reconstructed mesh from the modified gradients.
        """
        self.dGxdx = self.difference.difference_x(self.gradient_x_unsharp, FiniteDifference.Backward)
        self.dGydy = self.difference.difference_y(self.gradient_y_unsharp, FiniteDifference.Backward)
        self.divG = self.dGxdx + self.dGydy

        self.mesh_transformed = self.poisson.solve(self.divG)

        # apply offset
        offset = np.min(self.mesh_transformed)
        self.mesh_transformed = self.mesh_transformed - offset

        # apply background mask to reset background to zero
        self.mesh_transformed = self.mesh_transformed * self.depth_buffer_mask
        self.mesh_scaled = self.mesh_transformed

    def process_scale(self):
        """
            Scales the mesh to the final dimensions.
        """
        # linear scale
        # self.mesh_scaled = self.meshscale.scale_linear(self.depth_buffer, self.mesh_transform.p1)
        self.mesh_scaled = self.depth_buffer_model * self.mesh_transform.p1

        if False:
            float_list = self.mesh_scaled.tolist()
            file_path = '%s/%s' % (self.working_folder, self.mesh.name)
            FileManager().write_binary(file_path, FileManager().pack_floats(float_list))

        # relief scale
        target_height = np.max(self.mesh_scaled)
        current_height = np.max(self.mesh_transformed)
        factor = target_height / current_height
        self.mesh_transformed = self.mesh_transformed * factor

    def write_mesh(self):
        """
            Write the final calculated mesh.
        """
        file_path = '%s/%s' % (self.working_folder, self.mesh.name)
        (width, height) = self.mesh_transformed.shape
        mesh_list = self.mesh_transformed.reshape(width * height, 1)
        FileManager().write_binary(file_path, FileManager().pack_floats(mesh_list))

    def debug_results(self):
        """
            Output final results for debugging.
        """
        if (self.debug):
            (rows, _) = self.depth_buffer.floats.shape
            maximum_rows = 16
            if rows <= maximum_rows:
                print ("Results")
                print ("------------------------------------------------------------")
                MathTools.print_array("I", self.depth_buffer.floats)
                MathTools.print_array("Gx", self.gradient_x)
                MathTools.print_array("dGxdx", self.dGxdx)
                MathTools.print_array("Gy", self.gradient_y)
                MathTools.print_array("dGydy", self.dGydy)
                MathTools.print_array("divG", self.divG)
                MathTools.print_array("Poisson Solution", self.mesh_transformed)

    def transform(self):
        """
        Transforms a DepthBuffer by the MeshTransform settings.
        """
        transform_step = self.services.stopwatch.mark("transform")

        self.process_depth_buffer()
        self.process_gradients()
        self.process_attenuation()
        self.process_unsharpmask()
        self.process_poisson()
        self.process_scale()
        self.write_mesh()

        self.debug_results()
        self.services.stopwatch.log_time(transform_step)

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

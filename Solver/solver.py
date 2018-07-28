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
from objwriter import OBJWriter
from services import Services 
from stopwatch import benchmark

from depthbuffer import DepthBuffer
from mesh import Mesh
from meshtransform import MeshTransform

from attenuation import Attenuation
from difference import Difference, FiniteDifference, Axis
from mask import Mask
from meshscale import MeshScale
from poisson import Poisson
from silhouette import Silhouette
from threshold import Threshold
from unsharpmask import UnsharpMask, UnsharpMaskParameters

class Results:
    """
    Holds the results of the Solver solution including the intermediate values.
    """
    def __init__(self):
        # image arrays
        self.depth_buffer_model: np.ndarray = None                      # DepthBuffer : Z coordinates in model units
        self.depth_buffer_mask: np.ndarray = None                       # DepthBuffer : background bit mask of complete model
        self.dGxdx: np.ndarray = None                                   # 1st derivative of Gradient wrt X: dGradientX(x,y) / dx
        self.dGydy: np.ndarray = None                                   # 1st derivative of Gradient wrt Y: dGradientY(x,y) / dy
        self.divG: np.ndarray = None                                    # div Gradient(x,y)
        self.gradient_x: np.ndarray = None                              # GradientX (thresholded)
        self.gradient_x_mask: np.ndarray = None                         # GradientY (thresholded)
        self.gradient_y: np.ndarray = None                              # GradientX bit mask (thresholded)
        self.gradient_y_mask: np.ndarray = None                         # GradientX bit mask (thresholded)
        self.combined_mask: np.ndarray = None                           # final bit mask : compostite 
        self.gradient_x_unsharp: np.ndarray = None                      # GradientX : (unsharp masked)
        self.gradient_y_unsharp: np.ndarray = None                      # GradientY : (unsharp masked)

        # final result
        self.mesh_scaled: np.ndarray = None                             # Mesh: scaled linearly
        self.mesh_transformed: np.ndarray = None                        # Mesh: complete solution

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

        # processing steps
        self.enable_gradient_threshold = True
        self.enable_attenuation = True
        self.enable_unsharpmask = True
        self.enable_unsharpmask_gaussian_high = True
        self.enable_unsharpmask_gaussian_low = True
        self.enable_unsharpmask_high_frequence_scale = True

        # experimental
        self.enable_p1 = True
        self.enable_p2 = True
        self.enable_p3 = True
        self.enable_p4 = True
        self.enable_p5 = True
        self.enable_p6 = True
        self.enable_p7 = True
        self.enable_p8 = True

        # results collection
        self.results = Results()

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
        print("%r" % self.mesh_transform)

    @benchmark()
    def process_depth_buffer(self):
        """
            Process the depth buffer.
            The depth buffer is converted into model units.
            The background bit mask is calculated.
        """
        self.results.depth_buffer_model = self.depth_buffer.floats
        self.results.depth_buffer_mask = self.depth_buffer.background_mask

    @benchmark()
    def process_gradients(self):
        """
            Calculate the X and Y gradients.
            The gradients are thresholded to remove high values such as at the model edges.
            The gradients are filtered by applying the composite mask.
        """

        self.results.gradient_x = self.depth_buffer.gradient_x
        self.results.gradient_y = self.depth_buffer.gradient_y

        # Composite mask: Values are processed only if they pass all three masks.
        #    A value must have a 1 in the background mask.
        #    A value must have both dI/dx <and> dI/dy that are 1 in the respective gradient masks.
        mask = Mask(self.services) 
        threshold_value = self.mesh_transform.gradient_threshold if self.enable_gradient_threshold else float("inf")
        self.results.gradient_x_mask = mask.threshold(self.results.gradient_x, threshold_value)
        self.results.gradient_y_mask = mask.threshold(self.results.gradient_y, threshold_value)
        self.results.combined_mask = self.results.gradient_x_mask * self.results.gradient_y_mask
        # N.B. Including the background result in the mask causes the "leading" derivatives along +X, +Y to be excluded.
        #      The derivates are forward differences so they are defined (along +X, +Y) in the XY region <outside> the background mask.
        # self.combined_mask = self.combined_mask * self.depth_buffer_mask

        # Modify gradient by applying threshold, setting values above threshold to zero.
        self.results.gradient_x = self.results.gradient_x * self.results.combined_mask
        self.results.gradient_y = self.results.gradient_y * self.results.combined_mask

    def process_attenuation(self):
        """
            Attenuate the gradients to dampen large values.
        """
        if self.enable_attenuation:
            attenuation = Attenuation(self.services)
            self.results.gradient_x = attenuation.apply(self.results.gradient_x, self.mesh_transform.attenuation_parameters)
            self.results.gradient_y = attenuation.apply(self.results.gradient_y, self.mesh_transform.attenuation_parameters)

    def process_unsharpmask(self):
        """
            Apply unsharp masking to amplify details.
            The high frequency features are obtained from the image, scaled and the added back.
        """
        self.results.gradient_x_unsharp = self.results.gradient_x
        self.results.gradient_y_unsharp = self.results.gradient_y

        if self.enable_unsharpmask:
            gaussian_low = self.mesh_transform.unsharpmask_parameters.gaussian_low if self.enable_unsharpmask_gaussian_high else 0.0
            gaussian_high = self.mesh_transform.unsharpmask_parameters.gaussian_high if self.enable_unsharpmask_gaussian_low else 0.0
            high_frequency_scale = self.mesh_transform.unsharpmask_parameters.high_frequency_scale if self.enable_unsharpmask_high_frequence_scale else 1.0
            parameters = UnsharpMaskParameters(gaussian_low, gaussian_high, high_frequency_scale)

            unsharpmask = UnsharpMask(self.services)
            self.results.gradient_x_unsharp = unsharpmask.apply(self.results.gradient_x, self.results.combined_mask, parameters)
            self.results.gradient_y_unsharp = unsharpmask.apply(self.results.gradient_y, self.results.combined_mask, parameters)

    def process_poisson(self):
        """
            Solve the Poisson equation that returns the final reconstructed mesh from the modified gradients.
        """
        difference = Difference(self.services)        
        self.results.dGxdx = difference.difference_x(self.results.gradient_x_unsharp, FiniteDifference.Backward)
        self.results.dGydy = difference.difference_y(self.results.gradient_y_unsharp, FiniteDifference.Backward)
        self.results.divG = self.results.dGxdx + self.results.dGydy

        poisson = Poisson(self.services) 
        self.results.mesh_transformed = poisson.solve(self.results.divG)

        # apply offset
        offset = np.min(self.results.mesh_transformed)
        self.results.mesh_transformed = self.results.mesh_transformed - offset

        # apply background mask to reset background to zero
        self.results.mesh_transformed = self.results.mesh_transformed * self.results.depth_buffer_mask

    def process_silhouette(self):
        """
            Process the silhouettes in the image.
        """
        if self.enable_p2:
            silhouette = Silhouette(self.services)        
            self.results.mesh_transformed = silhouette.process(self.results.mesh_transformed, self.results.depth_buffer_mask, self.mesh_transform.p2)

    def process_scale(self):
        """
            Scales the mesh to the final dimensions.
        """
        # linear scale original mesh
        self.results.mesh_scaled = self.results.depth_buffer_model * self.mesh_transform.p1

        write_file = False
        if write_file:
            float_list = self.results.mesh_scaled.tolist()
            file_path = '%s/%s' % (self.working_folder, self.mesh.name)
            FileManager().write_binary(file_path, FileManager().pack_floats(float_list))

        # scale relief
        target_height = np.max(self.results.mesh_scaled)
        current_height = np.max(self.results.mesh_transformed)
        factor = target_height / current_height
        self.results.mesh_transformed = self.results.mesh_transformed * factor

    def write_mesh(self):
        """
            Write the final calculated mesh float file.
        """
        file_path = os.path.join(self.working_folder, self.mesh.name)

        (width, height) = self.results.mesh_transformed.shape
        mesh_list = self.results.mesh_transformed.reshape(width * height, 1)
        FileManager().write_binary(file_path, FileManager().pack_floats(mesh_list))

    def write_obj(self):
        """
            Write the final calculated mesh OBJ file.
        """
        filename, _ = os.path.splitext(self.mesh.name)        
        file_path = os.path.join(self.working_folder, filename + ".obj")
        
        filewriter = OBJWriter(self.services, self.results.mesh_transformed, file_path)
        filewriter.write()

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
                MathTools.print_array("Gx", self.results.gradient_x)
                MathTools.print_array("dGxdx", self.results.dGxdx)
                MathTools.print_array("Gy", self.results.gradient_y)
                MathTools.print_array("dGydy", self.results.dGydy)
                MathTools.print_array("divG", self.results.divG)
                MathTools.print_array("Poisson Solution", self.results.mesh_transformed)

    @benchmark()
    def transform(self):
        """
        Transforms a DepthBuffer by the MeshTransform settings.
        """
        self.process_depth_buffer()
        self.process_gradients()
        self.process_attenuation()
        self.process_unsharpmask()
        self.process_poisson()
        self.process_silhouette()
        self.process_scale()
        self.write_mesh()
        self.write_obj()

        self.debug_results()
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


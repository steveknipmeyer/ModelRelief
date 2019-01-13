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
from scipy.ndimage import gaussian_filter
from shutil import copyfile
from typing import Any, Callable, Dict, Optional

from experiments import Experiments
from filemanager import FileManager
from logger import Logger
from mathtools import MathTools
from objwriter import OBJWriter
from results import Results
from services import Services
from stopwatch import benchmark
from tools import Colors, Tools

from depthbuffer import DepthBuffer
from mesh import Mesh
from meshtransform import MeshTransform
from normalmap import NormalMap

from attenuation import Attenuation
from difference import Difference, FiniteDifference, Axis
from integrator import Integrator
from mask import Mask
from meshscale import MeshScale
from poisson import Poisson
from silhouette import Silhouette
from threshold import Threshold
from unsharpmask import UnsharpMask, UnsharpMaskParameters

import relief

class Solver:
    """
    Transforms a DepthBuffer to create a Mesh (raw float format) based on a MeshTransform.
    """
    def __init__(self, settings_file: str, working: str) -> None:
        """
        Initialize an instance of the Solver.

        Parameters
        ----------
        settings_file
            Path to JSON Mesh settings file.
        working
            Working folder path for intermediate files.
        """
        self.debug = False

        # Windows only
        colorama.init()

        # results collection
        self.results = Results()

        working_folder = os.path.abspath(working)
        self.working_folder = working_folder
        if not os.path.exists(working_folder):
            os.makedirs(working_folder)

        self.services = Services(self.content_folder, self.working_folder, Logger(), self.results)

        # processing steps
        self.enable_gradient_threshold = True
        self.enable_attenuation = True
        self.enable_unsharpmask = True
        self.enable_unsharpmask_gaussian_high = True
        self.enable_unsharpmask_gaussian_low = True
        self.enable_unsharpmask_high_frequence_scale = True

        # experimental
        self.enable_p1 = True                # scale relief
        self.enable_p2 = False               # silhoutte processing, sigma gaussian
        self.enable_p3 = False               # silhouette processing, blurring passes
        self.enable_p4 = True                # use composite mask in gaussian blur
        self.enable_p5 = False               # use Numpy gradients, not Difference class
        self.enable_p6 = False               # translate mesh Z to positive values
        self.enable_p7 = False               # force planar by zeroing with background mask
        self.enable_p8 = True                # use NormalMap gradients (not DepthBuffer heightfields)

        # file output
        self.enable_obj = True

        self.settings_file = ''
        self.settings: dict = {}
        self.mesh: Optional[Mesh] = None
        self.depth_buffer: Optional[DepthBuffer] = None
        self.mesh_transform: Optional[MeshTransform] = None
        self.normal_map: Optional[NormalMap] = None

        self.initialize(settings_file)

    @property
    def content_folder(self):
        """
        Returns the absolute path of ContentRootPath.
        In Production, the Solver folder is at the same level as ContentRootPath.
        In Development, Test environments, the Solver folder is one level above at the Solution root.
        """
        if Tools.is_production():
            return os.path.abspath('..')

        return os.path.abspath('../ModelRelief')

    def load_settings(self, settings_file: str):
        """
        Unpack the JSON settings file and initialize Solver properties.
        """
        self.settings_file = settings_file
        with open(settings_file) as json_file:
            self.settings = json.load(json_file)

    def initialize(self, settings_file: str):
        """
        Initialize the Solver.
        """
        self.load_settings(settings_file)

        self.mesh = Mesh(self.settings, self.services)
        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'], self.services, self.enable_p5)
        self.normal_map = NormalMap(self.settings['NormalMap'], self.services)

        self.mesh_transform = MeshTransform(self.settings['MeshTransform'])
        # print("%r" % self.mesh_transform)

    @benchmark()
    def process_depth_buffer(self):
        """
        Process the depth buffer.
        The depth buffer is converted into model units.
        The background bit mask is calculated.
        """
        self.results.depth_buffer_model.image = self.depth_buffer.floats
        self.results.depth_buffer_mask.image = self.depth_buffer.background_mask

    @benchmark()
    def process_gradients(self):
        """
        Calculate the X and Y gradients.
        The gradients are thresholded to remove high values such as at the model edges.
        The gradients are filtered by applying the composite mask.
        """
        # NormalMap gradients
        if self.enable_p8:
            self.results.gradient_x.image = self.normal_map.gradient_x
            self.results.gradient_y.image = self.normal_map.gradient_y
        # DepthBuffer (heighfield) gradients
        else:
            self.results.gradient_x.image = self.depth_buffer.gradient_x
            self.results.gradient_y.image = self.depth_buffer.gradient_y

        # experimental

        # Composite mask: Values are processed only if they pass all three masks.
        #    A value must have a 1 in the background mask.
        #    A value must have both dI/dx <and> dI/dy that are 1 in the respective gradient masks.
        mask = Mask(self.services)
        threshold_value = self.mesh_transform.gradient_threshold if self.enable_gradient_threshold else float("inf")
        self.results.gradient_x_mask.image = mask.threshold(self.results.gradient_x.image, threshold_value)
        self.results.gradient_y_mask.image = mask.threshold(self.results.gradient_y.image, threshold_value)

        self.results.combined_mask.image = self.results.gradient_x_mask.image * self.results.gradient_y_mask.image
        # N.B. Including the background result in the mask causes the "leading" derivatives along +X, +Y to be excluded.
        #      The derivates are forward differences so they are defined (along +X, +Y) in the XY region <outside> the background mask.
        # WIP: What is the impact? If gradients typically span many pixels, what is the significance of omitting the first gradient in a range?
        #      If the gradient is purely vertical (one pixel span) then it should be skipped.
        self.results.combined_mask.image = self.results.combined_mask.image * self.depth_buffer.background_mask

        # Modify gradient by applying threshold, setting values above threshold to zero.
        self.results.gradient_x.image = self.results.gradient_x.image * self.results.combined_mask.image
        self.results.gradient_y.image = self.results.gradient_y.image * self.results.combined_mask.image

    def process_attenuation(self):
        """
        Attenuate the gradients to dampen large values.
        """
        if self.enable_attenuation:
            attenuation = Attenuation(self.services)
            self.results.gradient_x.image = attenuation.apply(self.results.gradient_x.image, self.mesh_transform.attenuation_parameters)
            self.results.gradient_y.image = attenuation.apply(self.results.gradient_y.image, self.mesh_transform.attenuation_parameters)

    def process_unsharpmask(self):
        """
        Apply unsharp masking to amplify details.
        The high frequency features are obtained from the image, scaled and the added back.
        """
        self.results.gradient_x_unsharp.image = self.results.gradient_x.image
        self.results.gradient_y_unsharp.image = self.results.gradient_y.image

        if self.enable_unsharpmask:
            gaussian_low = self.mesh_transform.unsharpmask_parameters.gaussian_low if self.enable_unsharpmask_gaussian_low else 0.0
            gaussian_high = self.mesh_transform.unsharpmask_parameters.gaussian_high if self.enable_unsharpmask_gaussian_high else 0.0
            high_frequency_scale = self.mesh_transform.unsharpmask_parameters.high_frequency_scale if self.enable_unsharpmask_high_frequence_scale else 1.0
            parameters = UnsharpMaskParameters(gaussian_low, gaussian_high, high_frequency_scale)

            unsharpmask = UnsharpMask(self.services)
            self.results.gradient_x_unsharp.image = unsharpmask.apply(self.results.gradient_x.image, self.results.combined_mask.image, parameters, self.enable_p4)
            self.results.gradient_y_unsharp.image = unsharpmask.apply(self.results.gradient_y.image, self.results.combined_mask.image, parameters, self.enable_p4)

    def process_poisson(self):
        """
        Solve the Poisson equation that returns the final reconstructed mesh from the modified gradients.
        http://people.mpi-inf.mpg.de/~kerber/publications/Jens_Kerber_Masterthesis.pdf
        Due to the discrete case which we are in, they are obtained by a finite difference again like in Chapter 3.1.3, but here it has to be
        the backward difffernce in order to produce a central difference like it is defined for the Laplacian.
        """
        #if self.enable_pX:
        #    integrator = Integrator(self.services)
        #    self.results.mesh_transformed.image = integrator.integrate_x(self.results.gradient_x_unsharp.image)
        #    self.results.mesh_transformed.image = integrator.integrate_y(self.results.gradient_y_unsharp.image)
        #    return

        difference = Difference(self.services)
        self.results.dGxdx.image = difference.difference_x(self.results.gradient_x_unsharp.image, FiniteDifference.Backward)
        self.results.dGydy.image = difference.difference_y(self.results.gradient_y_unsharp.image, FiniteDifference.Backward)
        self.results.divG.image = self.results.dGxdx.image + self.results.dGydy.image

        poisson = Poisson(self.services)
        self.results.mesh_transformed.image = poisson.solve(self.results.divG.image)

        # apply offset
        if self.enable_p6:
            offset = np.min(self.results.mesh_transformed.image)
            self.results.mesh_transformed.image = self.results.mesh_transformed.image - offset

        # apply background mask to reset background to zero
        if self.enable_p7:
            self.results.mesh_transformed.image = self.results.mesh_transformed.image * self.results.depth_buffer_mask.image

    def process_silhouette(self):
        """
        Process the silhouettes in the image.
        """
        if self.enable_p2:
            silhouette = Silhouette(self.services)
            self.results.mesh_transformed.image = silhouette.process(self.results.mesh_transformed.image, self.results.depth_buffer_mask.image, self.mesh_transform.p2, int(self.mesh_transform.p3))

    def process_scale(self):
        """
        Scales the mesh to the final dimensions.
        """
        # linear scale original mesh
        self.results.mesh_scaled.image = self.results.depth_buffer_model.image * self.mesh_transform.p1

        write_file = False
        if write_file:
            float_list = self.results.mesh_scaled.image.tolist()
            file_path = '%s/%s' % (self.working_folder, self.mesh.name)
            FileManager().write_binary(file_path, FileManager().pack_floats(float_list))

        # scale relief
        target_height = np.max(self.results.mesh_scaled.image)
        current_height = np.max(self.results.mesh_transformed.image)

        # N.B. Some final meshes may be flat.
        #   There are no gradients because all surfaces are orthogonal to the camera sight line.
        #   All gradients are masked because they are too large.
        validMeshHeight: bool = current_height > 0.0
        if not validMeshHeight:
            self.services.logger.logError (f"{self.depth_buffer.camera.projection} camera generated a flat mesh of height {current_height}.")
        factor = 1.0 if not validMeshHeight else (target_height / current_height)

        self.results.mesh_transformed.image = self.results.mesh_transformed.image * factor

    def write_mesh(self):
        """
        Write the final calculated mesh float file.
        """
        file_path = os.path.join(self.working_folder, self.mesh.name)

        (width, height) = self.results.mesh_transformed.image.shape
        mesh_list = self.results.mesh_transformed.image.reshape(width * height, 1)
        FileManager().write_binary(file_path, FileManager().pack_floats(mesh_list))

    def write_obj(self):
        """
        Write the final calculated mesh OBJ file.
        """
        if self.enable_obj:
            filename, _ = os.path.splitext(self.mesh.name)
            file_path = os.path.join(self.working_folder, filename + ".obj")

            filewriter = OBJWriter(self.services, self.results.mesh_transformed.image, file_path)
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
                MathTools.print_array("Gx", self.results.gradient_x.image)
                MathTools.print_array("dGxdx", self.results.dGxdx.image)
                MathTools.print_array("Gy", self.results.gradient_y.image)
                MathTools.print_array("dGydy", self.results.dGydy.image)
                MathTools.print_array("divG", self.results.divG.image)
                MathTools.print_array("Poisson Solution", self.results.mesh_transformed.image)

    @benchmark()
    def transform(self):
        """
        Transforms a DepthBuffer by the MeshTransform settings.
        """
        self.results.initialize(self.depth_buffer.height, self.depth_buffer.width)

        self.process_depth_buffer()
        self.process_gradients()
        self.process_attenuation()
        self.process_unsharpmask()
        self.process_poisson()
        self.process_silhouette()
        self.process_scale()
        self.write_mesh()
        self.write_obj()

        # experimental tools
        experiments = Experiments(self.results, self.services.logger, self.mesh_transform)
        experiments.gaussian_filter()

        # debug results
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


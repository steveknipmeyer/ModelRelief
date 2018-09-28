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

from attenuation import Attenuation
from difference import Difference, FiniteDifference, Axis
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
        self.enable_p1 = True
        self.enable_p2 = True
        self.enable_p3 = True
        self.enable_p4 = True
        self.enable_p5 = True
        self.enable_p6 = True
        self.enable_p7 = True
        self.enable_p8 = True

        # file output
        self.enable_obj = True

        self.settings = None
        self._settings_file = ''
        self.mesh = None
        self.depth_buffer: Optional[DepthBuffer] = None
        self.mesh_transform: Optional[MeshTransform] = None

        self.settings_file = settings

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

    @property
    def settings_file(self):
        """
        Returns the absolute path of the Mesh settings file.
        """
        return self._settings_file

    @settings_file.setter
    def settings_file(self, settings):
        with open(settings) as json_file:
            self.settings = json.load(json_file)
        self.initialize_settings()
        self._settings_file = settings

    def initialize_settings(self):
        """
        Unpack the JSON settings file and initialize Solver properties.
        """
        self.mesh = Mesh(self.settings, self.services)
        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'], self.services)
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

        self.results.gradient_x.image = self.depth_buffer.gradient_x
        self.results.gradient_y.image = self.depth_buffer.gradient_y

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
        # self.combined_mask = self.combined_mask * self.depth_buffer_mask

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
            self.results.gradient_x_unsharp.image = unsharpmask.apply(self.results.gradient_x.image, self.results.combined_mask.image, parameters)
            self.results.gradient_y_unsharp.image = unsharpmask.apply(self.results.gradient_y.image, self.results.combined_mask.image, parameters)

    def process_poisson(self):
        """
        Solve the Poisson equation that returns the final reconstructed mesh from the modified gradients.
        """
        difference = Difference(self.services)
        self.results.dGxdx.image = difference.difference_x(self.results.gradient_x_unsharp.image, FiniteDifference.Backward)
        self.results.dGydy.image = difference.difference_y(self.results.gradient_y_unsharp.image, FiniteDifference.Backward)
        self.results.divG.image = self.results.dGxdx.image + self.results.dGydy.image

        poisson = Poisson(self.services)
        self.results.mesh_transformed.image = poisson.solve(self.results.divG.image)

        # apply offset
        offset = np.min(self.results.mesh_transformed.image)
        self.results.mesh_transformed.image = self.results.mesh_transformed.image - offset

        # apply background mask to reset background to zero
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
        factor = target_height / current_height
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

    @benchmark()
    def scipy_filter(self):
        """
        SciPy Gaussian filter.
        """
        self.services.results.i3.image = gaussian_filter(self.services.results.depth_buffer_model.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, order=0, output=None, mode='nearest', cval=0.0, truncate=4.0)
        self.services.results.i3.title = "SciPy gaussian_filter"

    @benchmark()
    def GaussianCached(self):
        """
        Relief C++ Gaussian filter.
        """
        self.services.results.i4.image = relief.gaussian_filter(self.services.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, 11)
        self.services.results.i4.title = "GaussianCached"
        self.services.logger.logInformation (f"GaussianCached MSE = {Tools.MSE(self.services.results.i3.image, self.services.results.i4.image)}", Colors.BrightMagenta)

    @benchmark()
    def Box(self):
        """
        Relief C++ Gaussian filter.
        """
        self.services.results.i5.image = relief.gaussian_filter(self.services.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, 2)
        self.services.results.i5.title = "Box"
        self.services.logger.logInformation (f"Box MSE = {Tools.MSE(self.services.results.i3.image, self.services.results.i5.image)}", Colors.BrightMagenta)

    @benchmark()
    def BoxIndependent(self):
        """
        Relief C++ Gaussian filter.
        """
        self.services.results.i6.image = relief.gaussian_filter(self.services.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, 3)
        self.services.results.i6.title = "BoxIndependent"
        self.services.logger.logInformation (f"BoxIndependent MSE = {Tools.MSE(self.services.results.i3.image, self.services.results.i6.image)}", Colors.BrightMagenta)

    @benchmark()
    def BoxIndependentDelta(self):
        """
        Relief C++ Gaussian filter.
        """
        self.services.results.i7.image = relief.gaussian_filter(self.services.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, 4)
        self.services.results.i7.title = "BoxIndependentDelta"
        self.services.logger.logInformation (f"BoxIndependentDelta MSE = {Tools.MSE(self.services.results.i3.image, self.services.results.i7.image)}", Colors.BrightMagenta)

    @benchmark()
    def relief_filter(self):
        """
        Relief C++ Gaussian filter.
        """
        self.GaussianCached()
        self.Box()
        self.BoxIndependent()
        self.BoxIndependentDelta()

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

        if self.enable_p8:
            self.scipy_filter()
            self.relief_filter()

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


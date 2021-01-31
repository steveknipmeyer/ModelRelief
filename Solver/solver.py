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
import os
import numpy as np
import time
from scipy.ndimage import gaussian_filter
from shutil import copyfile
from typing import Any, Callable, Dict, Optional

from environment import EnvironmentNames
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
    def __init__(self, settings_file: str, working: str)-> None:
        """
        Initialize an instance of the Solver.

        Parameters
        ----------
        settings_file
            Path to JSON Mesh settings file.
        working
            Working folder path for intermediate files.
        """
        self.debug = True

        # results collection
        self.results = Results()

        working_folder = os.path.abspath(working)
        self.working_folder = working_folder
        if not os.path.exists(working_folder):
            os.makedirs(working_folder)

        self.services = Services(self.content_folder, self.working_folder, Logger(), self.results)

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
        In deployed Production, the Solver folder is at the same level as ContentRootPath.
        In Development, Production (development) environments, the Solver folder is one level above at the Solution root.
        """
        # -- Production (Deployed)
        # (ContentRootPath)
        #     Solver
        #         solver.py (this)
        #     wwwroot

        # -- Development, Production (local)
        # Solver
        #     solver.py (this)
        # ModelRelief (ContentRootPath)
        #     wwwroot

        if os.path.exists('../wwwroot'):
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

        self.mesh_transform = MeshTransform(self.settings['MeshTransform'])
        self.mesh = Mesh(self.settings, self.services)
        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'], self.services)
        self.normal_map = NormalMap(self.settings['NormalMap'], self.services)

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
        if self.mesh_transform.p8.enabled:
            self.results.gradient_x.image = self.normal_map.gradient_x
            self.results.gradient_y.image = self.normal_map.gradient_y
        # DepthBuffer (heightfield) gradients
        else:
            self.results.gradient_x.image = self.depth_buffer.gradient_x(self.mesh_transform.p5.enabled)
            self.results.gradient_y.image = self.depth_buffer.gradient_y(self.mesh_transform.p5.enabled)

        # experimental

        # Composite mask: Values are processed only if they pass all three masks.
        #    A value must have a 1 in the background mask.
        #    A value must have both dI/dx <and> dI/dy that are 1 in the respective gradient masks.
        mask = Mask(self.services)
        parameters = self.mesh_transform.gradient_threshold_parameters
        threshold_value = parameters.threshold if parameters.enabled else float("inf")
        self.results.gradient_x_mask.image = mask.threshold(self.results.gradient_x.image, threshold_value)
        self.results.gradient_y_mask.image = mask.threshold(self.results.gradient_y.image, threshold_value)

        self.results.combined_mask.image = self.results.gradient_x_mask.image * self.results.gradient_y_mask.image
        # N.B. Including the background result in the mask causes the "leading" derivatives along +X, +Y to be excluded.
        #      The derivates are forward differences so they are defined (along +X, +Y) in the XY region <outside> the background mask.
        # WIP: What is the impact? If gradients typically span many pixels, what is the significance of omitting the first gradient in a range?
        #      If the gradient is purely vertical (one pixel span) then it should be skipped.
        # self.results.combined_mask.image = self.results.combined_mask.image * self.depth_buffer.background_mask

        # Modify gradient by applying threshold, setting values above threshold to zero.
        self.results.gradient_x.image = self.results.gradient_x.image * self.results.combined_mask.image
        self.results.gradient_y.image = self.results.gradient_y.image * self.results.combined_mask.image

    def process_attenuation(self):
        """
        Attenuate the gradients to dampen large values.
        """
        if self.mesh_transform.attenuation_parameters.enabled:
            attenuation = Attenuation(self.services)
            parameters = self.mesh_transform.attenuation_parameters
            self.results.gradient_x.image = attenuation.apply(self.results.gradient_x.image, parameters)
            self.results.gradient_y.image = attenuation.apply(self.results.gradient_y.image, parameters)

    def process_unsharpmask(self):
        """
        Apply unsharp masking to amplify details.
        The high frequency features are obtained from the image, scaled and the added back.
        """
        self.results.gradient_x_unsharp.image = self.results.gradient_x.image
        self.results.gradient_y_unsharp.image = self.results.gradient_y.image

        if self.mesh_transform.unsharpmask_parameters.enabled:
            parameters = self.mesh_transform.unsharpmask_parameters
            unsharpmask = UnsharpMask(self.services)
            self.results.gradient_x_unsharp.image = unsharpmask.apply(self.results.gradient_x.image, self.results.combined_mask.image, parameters, self.mesh_transform.p4.enabled)
            self.results.gradient_y_unsharp.image = unsharpmask.apply(self.results.gradient_y.image, self.results.combined_mask.image, parameters, self.mesh_transform.p4.enabled)

    def process_poisson(self):
        """
        Solve the Poisson equation that returns the final reconstructed mesh from the modified gradients.
        http://people.mpi-inf.mpg.de/~kerber/publications/Jens_Kerber_Masterthesis.pdf
        Due to the discrete case which we are in, they are obtained by a finite difference again like in Chapter 3.1.3, but here it has to be
        the backward difffernce in order to produce a central difference like it is defined for the Laplacian.
        """
        #if self.mesh_transform.pX.enabled:
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
        if self.mesh_transform.p6.enabled:
            offset = np.min(self.results.mesh_transformed.image)
            self.results.mesh_transformed.image = self.results.mesh_transformed.image - offset

        # apply background mask to reset background to zero
        if self.mesh_transform.p7.enabled:
            self.results.mesh_transformed.image = self.results.mesh_transformed.image * self.results.depth_buffer_mask.image

    def process_silhouette(self):
        """
        Process the silhouettes in the image.
        """
        if self.mesh_transform.p2.enabled:
            silhouette = Silhouette(self.services)
            self.results.mesh_transformed.image = silhouette.process(self.results.mesh_transformed.image, self.results.depth_buffer_mask.image, self.mesh_transform.p2, int(self.mesh_transform.p3))

    def process_scale(self):
        """
        Scales the mesh to the final dimensions.
        """
        # linear scale original mesh
        self.results.mesh_scaled.image = self.results.depth_buffer_model.image * self.mesh_transform.relief_scale

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
            self.services.logger.logError (f"Solver: A mesh of height {current_height} was generated.")
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

            # copy to  file system for access by graphical applications (e.g. MeshLab)
            mr_temp = os.getenv(EnvironmentNames.MRTemp)
            if (mr_temp is None):
                return

            file_temp_path = os.path.join(mr_temp, filename + ".obj")
            Tools.copy_file(file_path, file_temp_path)

    def debug_results(self):
        """
        Output final results for debugging.
        """
        if (self.debug):
            (rows, _) = self.depth_buffer.floats.shape
            maximum_rows = 16
            if rows <= maximum_rows:
                self.services.logger.logDebug ("\nResults", Colors.BrightYellow)
                self.services.logger.logDebug  ("------------------------------------------------------------", Colors.BrightYellow)
                MathTools.print_array("I", self.depth_buffer.floats)
                MathTools.print_array("Gx", self.results.gradient_x.image)
                MathTools.print_array("dGxdx", self.results.dGxdx.image)
                MathTools.print_array("Gy", self.results.gradient_y.image)
                MathTools.print_array("dGydy", self.results.dGydy.image)
                MathTools.print_array("divG", self.results.divG.image)
                MathTools.print_array("Poisson Solution", self.results.mesh_transformed.image)

            # skip if TestDepthBuffer is active; TestDepthBuffer has overridden DepthBuffer.floats property but not floats_raw
            if not self.depth_buffer.use_test_buffer:
                self.depth_buffer.scale_floats(1.0)

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


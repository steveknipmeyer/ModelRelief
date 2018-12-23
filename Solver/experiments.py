    #!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: experiments
   :synopsis: Experimental techniques.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import os
from scipy.ndimage import gaussian_filter
from typing import Any, Callable, Dict, Optional

import relief

from logger import Logger
from imagetransform import ImageTransform
from meshtransform import MeshTransform
from results import Results
from stopwatch import benchmark, StopWatch
from tools import Colors, Tools

class Experiments():

    def __init__(self, results: Results, logger: Logger, mesh_transform: MeshTransform) -> None:
        """
        Perform class initialization.
        Parameters
        ----------
        results
            Image results from solver.
        logger
            Logger.
        mesh_transform
            Active MeshTransform.
        """
        self.debug = True

        self.results = results
        self.logger = logger
        self.mesh_transform = mesh_transform

    @benchmark()
    def scipy_filter(self):
        """
        SciPy Gaussian filter.
        """
        self.results.i3.image = gaussian_filter(self.results.depth_buffer_model.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, order=0, output=None, mode='nearest', cval=0.0, truncate=4.0)
        self.results.i3.title = "SciPy gaussian_filter"

    @benchmark()
    def GaussianCached(self):
        """
        Relief C++ Gaussian filter.
        """
        self.results.i4.image = relief.gaussian_filter(self.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, 11)
        self.results.i4.title = "GaussianCached"
        self.logger.logInformation (f"GaussianCached MSE = {Tools.MSE(self.results.i3.image, self.results.i4.image)}", Colors.BrightMagenta)

    @benchmark()
    def Box(self):
        """
        Relief C++ Gaussian filter.
        """
        self.results.i5.image = relief.gaussian_filter(self.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, 2)
        self.results.i5.title = "Box"
        self.logger.logInformation (f"Box MSE = {Tools.MSE(self.results.i3.image, self.results.i5.image)}", Colors.BrightMagenta)

    @benchmark()
    def BoxIndependent(self):
        """
        Relief C++ Gaussian filter.
        """
        self.results.i6.image = relief.gaussian_filter(self.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, 3)
        self.results.i6.title = "BoxIndependent"
        self.logger.logInformation (f"BoxIndependent MSE = {Tools.MSE(self.results.i3.image, self.results.i6.image)}", Colors.BrightMagenta)

    @benchmark()
    def BoxIndependentDelta(self):
        """
        Relief C++ Gaussian filter.
        """
        self.results.i7.image = ImageTransform.gaussian(self.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, True)
        self.results.i7.title = "BoxIndependentDelta"
        self.logger.logInformation (f"BoxIndependentDelta MSE = {Tools.MSE(self.results.i3.image, self.results.i7.image)}", Colors.BrightMagenta)

    @benchmark()
    def BoxIndependentMask(self):
        """
        Relief C++ Gaussian filter.
        """
        self.results.i8.image = ImageTransform.gaussian(self.results.depth_buffer_model.image, self.results.combined_mask.image, self.mesh_transform.unsharpmask_parameters.gaussian_low, True)
        self.results.i8.title = "BoxIndependentMask"

    @benchmark()
    def relief_filter(self):
        """
        Relief C++ Gaussian filter.
        """
        self.GaussianCached()
        self.Box()
        self.BoxIndependent()
        self.BoxIndependentDelta()
        self.BoxIndependentMask()

    def gaussian_filter(self):
        """
        Run the experimental Gaussian filter tests.
        """
        #self.scipy_filter()
        #self.relief_filter()

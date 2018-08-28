#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Silhouette
   :synopsis: Support for processing relief silhouettes.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np
from scipy.ndimage import gaussian_filter

from mask import Mask
from services import Services
from results import Results

class Silhouette:
    """
    A class for processing image silhouettes.
    """
    def __init__(self, services : Services) -> None:
        """
        Initialize an instance of Silhouette.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)
        """
        self.debug = True
        self.services = services

    def process (self, image: np.ndarray, background_mask: np.ndarray, sigma: float, iterations: int) -> np.ndarray:
        """
        Process the silhouette of an mesh image array.

        Parameters
        ----------
        image
            The image array to process the silhouettes.
        background_mask
            The image background mask.
        sigma:
            The standard deviation used in the Gaussian blur of the image.            
        iterations:
            The number of time to apply the blur.
        """
        # blur entire image to blend the image edges with the background
        blurred_all = image
        for _ in range(iterations):
            blurred_all = gaussian_filter(blurred_all, sigma, order=0, output=None, mode='reflect', cval=0.0, truncate=4.0)
        
        # isolate only the portion of the blend that extends into the background mask
        mask = Mask (self.services)
        mask_inverted = mask.invert(background_mask)
        blurred_edges = blurred_all * mask_inverted

        # add blurred edges to final image
        result = image + blurred_edges

        # workbench
        self.services.results.i1 = blurred_all
        self.services.results.i2 = blurred_edges

        return result
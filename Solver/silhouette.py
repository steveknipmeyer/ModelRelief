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
import cv2
import numpy as np
from scipy.ndimage import gaussian_filter

from mask import Mask
from services import Services
from results import Results
class SilhouetteParameters:

    """
    A class for holding the parameters supporting silhoette processing.
    """
    def __init__(self, enabled: bool, sigma: float, passes: int) -> None:
        """
        Initialize an instance of SilhouetteParameters.
        Parameters
        ----------
        enabled
            Apply gradient thresholding.
        sigma
            The gaussian distribution for the blurring operation.
        passes
            The number of blurring passes.

        """
        self.enabled = enabled
        self.sigma = sigma
        self.passes = passes

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

    def processX (self, image: np.ndarray, background_mask: np.ndarray, sigma: float, iterations: int) -> np.ndarray:
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
            blurred_all = gaussian_filter(blurred_all, sigma, order=0, output=None, mode='nearest', cval=0.0, truncate=4.0)

        # isolate only the portion of the blend that extends into the background mask
        mask = Mask (self.services)
        mask_inverted = mask.invert(background_mask)
        blurred_edges = blurred_all * mask_inverted

        # add blurred edges to final image
        result = image + blurred_edges

        # workbench
        self.services.results.i1.image = blurred_all
        self.services.results.i1.title = "Blurred All"

        self.services.results.i2.image = blurred_edges
        self.services.results.i2.title = "Blurred Edges"

        return result

    def process (self, image: np.ndarray, background_mask: np.ndarray, sigma: float, iterations: int) -> np.ndarray:
        """
        Process the silhouette of an mesh image array.
        https://docs.opencv.org/master/d4/d73/tutorial_py_contours_begin.html

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
        kernel = (11, 11)
        image_blurred = cv2.GaussianBlur(image, kernel, 0)

        image_gray = np.zeros((image.shape[0], image.shape[1]), 'uint8')
        image_gray[:,:] = image*255

        contours, hierarchy = cv2.findContours(image_gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        edge_width = 5
        mask = np.zeros((image.shape[0], image.shape[1], 3), np.uint8)
        cv2.drawContours(mask, contours, -1, (255,255,255), edge_width)

        image_blurred_rgb = np.zeros((image.shape[0], image.shape[1], 3), 'uint32')
        image_blurred_rgb[:,:,:] = 255
        image_blurred_rgb[:,:,0] = image_blurred[:,:]*255
        image_blurred_rgb[:,:,1] = image_blurred[:,:]*255
        image_blurred_rgb[:,:,2] = image_blurred[:,:]*255

        image_rgb = np.zeros((image.shape[0], image.shape[1], 3), 'uint32')
        image_rgb[:,:,:] = 255
        image_rgb[:,:,0] = image[:,:]*255
        image_rgb[:,:,1] = image[:,:]*255
        image_rgb[:,:,2] = image[:,:]*255

        result_rgb = np.where(mask==np.array([255, 255, 255]), image_blurred_rgb, image_rgb)

        result = np.zeros(image.shape, 'float64')
        result = result_rgb[:, :, 0] / 255

        # workbench
        self.services.results.i1.image = image
        self.services.results.i1.title = "Image"

        self.services.results.i2.image = mask
        self.services.results.i2.title = "Mask"

        self.services.results.i3.image = result
        self.services.results.i3.title = "Result"

        return result
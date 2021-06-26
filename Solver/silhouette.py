#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Silhouette
   :synopsis: Support for processing relief silhouettes.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import cv2
import numpy as np
from scipy.ndimage import gaussian_filter
from imagetransform import ImageTransform

from mask import Mask
from services import Services
from stopwatch import benchmark, StopWatch
from results import Results
class SilhouetteParameters:

    """
    A class for holding the parameters supporting silhoette processing.
    """
    def __init__(self, enabled: bool, edge_width: int, sigma: float) -> None:
        """
        Initialize an instance of SilhouetteParameters.
        Parameters
        ----------
        enabled
            Apply gradient thresholding.
        edge_width
            Edge width (pixels) for contour processing
        sigma
            The gaussian distribution for the blurring operation.

        """
        self.enabled = enabled
        self.edge_width = edge_width
        self.sigma = sigma
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

    def process (self, image: np.ndarray, background: np.ndarray, edge_width: int, sigma: float) -> np.ndarray:
        """
        Process the silhouette of an mesh image array.
                    sudo apt-get install python3-tk
        https://stackoverflow.com/questions/55066764/how-to-blur-feather-the-edges-of-an-object-in-an-image-using-opencv
        https://docs.opencv.org/master/d4/d73/tutorial_py_contours_begin.html

        Parameters
        ----------
        image
            The image array to process the silhouettes.
        background
            The image background mask.
        edge_width
            Countour edge width (pixels)
        sigma:
            The standard deviation used in the Gaussian blur of the image.
        """
        edge_width = max(1, edge_width)

        # 8 bit grayscale -> contours
        background_gray = np.zeros(background.shape, 'uint8')
        background_gray[:,:] = background * 255
        contours, hierarchy = cv2.findContours(background_gray, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

        # draw contours into RGB mask
        mask = np.zeros((image.shape[0], image.shape[1], 3), np.uint8)
        cv2.drawContours(mask, contours, -1, (255,255,255), edge_width)

        image_grayscale = ImageTransform.normalize(image)
        image_rgb = ImageTransform.grayscale_to_rgb(image_grayscale)

        kernel_size = (2 * edge_width) + 1
        kernel = (kernel_size, kernel_size)
        image_blurred = cv2.GaussianBlur(image, kernel, 0)
        image_blurred_grayscale = ImageTransform.normalize(image_blurred)
        image_blurred_rgb = ImageTransform.grayscale_to_rgb(image_blurred_grayscale)

        # result = blurred image where mask (contours) else original image
        result_rgb = np.where(mask==np.array([255, 255, 255]), image_blurred_rgb, image_rgb)

        result = ImageTransform.rgb_to_grayscale(result_rgb)
        result *= image.max()

        # workbench
        self.services.results.i1.image = image
        self.services.results.i1.title = "Image"

        self.services.results.i2.image = mask
        self.services.results.i2.title = "Mask"

        mask_grayscale = ImageTransform.rgb_to_grayscale(mask)
        blurred_edges = image_blurred * mask_grayscale
        self.services.results.i3.image = blurred_edges
        self.services.results.i3.title = "Blurred Image * Mask"

        self.services.results.i4.image = result
        self.services.results.i4.title = "Result"

        return result

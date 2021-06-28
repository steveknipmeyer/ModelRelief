#!/usr/bin/env python
"""
.. module:: ImageTransform
   :synopsis: Toolbox of image processing transforms.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import numpy as np
from numpy.core.defchararray import array
from numpy.lib.index_tricks import nd_grid
from scipy.ndimage import gaussian_filter

import relief

class ImageTransform:
    """
    Toolbox of image processing transforms.
    """
    def __init__(self) -> None:
        """
        Initialize an instance of ImageTransform.
        """

    @staticmethod
    def gaussian (image: np.ndarray, sigma: float, mask: np.ndarray, use_mask: bool)->np.ndarray:
        """
        image
            Input image.
        sigma
            Standard deviation of gaussian blur.
        mask
            Mask of valid image elements.
        use_mask
            Use composite mask to exclude thresholded elements and background
        """
        use_relief_extensions = True

        if use_relief_extensions:
            # algorithm = BoxIndependent (4) or BoxIndependentMask (5)
            algorithm = 5 if use_mask else 4
            result = relief.gaussian_filter(image, sigma, mask, algorithm)
        else:
            # SciPy
            result = gaussian_filter(image, sigma, order=0, output=None, mode='nearest', cval=0.0, truncate=4.0)

        return result

    @staticmethod
    def normalize (a: np.ndarray)->np.ndarray:
        """
        Normalize a positive 2D array to [0..1]
        Parameters
        ----------
        a
            2D float array
        """
        max = a.max()
        normalized = a / max

        return normalized

    @staticmethod
    def grayscale_to_rgb (grayscale: np.ndarray)->np.ndarray:
        """
        Convert a 2D array of (grayscale [0..1]) floats to RGB triplets
            0.0 -> [0, 0, 0]
            1.0 -> [255, 255, 255]
        Parameters
        ----------
        grayscale
            Input image.
        """
        rgb = np.zeros((grayscale.shape[0], grayscale.shape[1], 3), 'uint32')
        rgb[:,:,0] = grayscale[:,:] * 255
        rgb[:,:,1] = grayscale[:,:] * 255
        rgb[:,:,2] = grayscale[:,:] * 255

        return rgb

    @staticmethod
    def rgb_to_grayscale (rgb: np.ndarray)->np.ndarray:
        """
        Convert a 2D array of grayscale RGB triplets to floats
            [0, 0, 0] -> 0.0
            [255, 255, 255] -> 1.0
        Parameters
        ----------
        rgb
            Input image.
        """
        grayscale = np.zeros(rgb.shape, 'float64')
        grayscale = rgb[:, :, 0] / 255

        return grayscale

#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: ImageTransform
   :synopsis: Toolbox of image processing transforms.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np
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


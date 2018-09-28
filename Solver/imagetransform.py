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
    def gaussian (image: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray:
        """
        image
            Input image.
        mask
            Mask of valid image elements.
        sigma
            Standard deviation of gaussian blur.
        """
        if True:
            # algorithm = BoxIndependentDelta
            result = relief.gaussian_filter(image, mask, sigma, 4)
        else:
            result = gaussian_filter(image, sigma, order=0, output=None, mode='nearest', cval=0.0, truncate=4.0)

        return result
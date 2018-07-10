#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: UnsharpMask
   :synopsis: Support for unsharp masking of images.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np
from scipy.ndimage import gaussian_filter

from services import Services

class UnsharpMask:
    """
    A class for calculating unsharp masks of images.
    """

    def __init__(self, services : Services) -> None: 
        """
        Initialize an instance of an UnsharpMask.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)
        """
        self.debug = True
        self.services = services

    def apply (self, original: np.ndarray, combined_mask: np.ndarray, gaussian_low : float, gaussian_high: float, lambda_scale: float) -> np.ndarray:
        """
        Applies unsharp masking to the input image.
        After the high frequencies components are extracted, they are scaled and then added back.

        Parameters
        ----------
        original
            The target image to process.
        combined_mask
            The combined mask (Background * GradientXMask * GradientYMAsk) to be applied to the target image.
        gaussian_low
            The standard deviation of the low frequency Gaussian filter.
        gaussian_high
            The standard deviation of the high frequency Gaussian filter.
        lambda_scale
            The scaling factor applied to the high frequency components before adding back to the original image.

        """
        # copy
        original_prime = np.array(original)
        original_prime= original_prime * combined_mask

        low = gaussian_filter(original_prime, gaussian_low, order=0, output=None, mode='reflect', cval=0.0, truncate=4.0)
        
        # subtract low frequency from original to yield the high frequency components
        high = original_prime - low
        high = gaussian_filter(high, gaussian_high, order=0, output=None, mode='reflect', cval=0.0, truncate=4.0)

        # add back the scaled high frequency components to generate the final results
        final = original_prime + (lambda_scale * high)

        return final

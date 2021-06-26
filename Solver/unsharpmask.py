#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: UnsharpMask
   :synopsis: Support for unsharp masking of images.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import numpy as np
from scipy.ndimage import gaussian_filter

import relief
from imagetransform import ImageTransform
from services import Services

class UnsharpMaskParameters:

    """
    A class for holding the parameters supporting unsharp masking.
    """
    def __init__(self, enabled: bool, gaussian_low: float, gaussian_high: float, high_frequency_scale: float) -> None:
        """
        Initialize an instance of UnsharpMaskParameters.
        Parameters
        ----------
        enabled
            Enable unsharp mask processing.
        gaussian_low
            The Gaussian standard deviation for the low frequency pass.
        gaussian_high
            The Gaussian standard deviation for the high frequency pass.
        high_frequency_scale
            The scaling factor for the high frequence component when added back to the low component.

        """
        self.enabled: bool = enabled
        self.gaussian_low = gaussian_low
        self.gaussian_high = gaussian_high
        self.high_frequency_scale = high_frequency_scale

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

    def apply (self, original: np.ndarray, combined_mask: np.ndarray, parameters : UnsharpMaskParameters, use_mask: bool = False) -> np.ndarray:
        """
        Applies unsharp masking to the input image.
        After the high frequencies components are extracted, they are scaled and then added back.

        Parameters
        ----------
        original
            The target image to process.
        combined_mask
            The combined mask (Background * GradientXMask * GradientYMAsk) to be applied to the target image.
        parameters
            The UnsharpMaskParamnter structure (gaussian_low, gaussian_high, high_frequency_scale)
        use_mask
            Use composite mask to exclude thresholded elements and background
        """
        # N.B. The Gaussian blur used in Kerber's paper ignores pixels that have been masked.

        original_prime= original * combined_mask

        low = ImageTransform.gaussian(original_prime, parameters.gaussian_low, combined_mask, use_mask)
        low = low * combined_mask

        # subtract low frequency from original to yield the high frequency components
        high = original_prime - low
        high = ImageTransform.gaussian(high, parameters.gaussian_high, combined_mask, use_mask)

        # add back the scaled high frequency components to generate the final results
        final = original_prime + (parameters.high_frequency_scale * high)
        final = final * combined_mask

        return final

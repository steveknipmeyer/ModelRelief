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

import relief
from services import Services

class UnsharpMaskParameters:

    """
    A class for holding the parameters supporting unsharp masking.
    """
    def __init__(self, gaussian_low: float, gaussian_high: float, high_frequency_scale: float) -> None:
        """
        Initialize an instance of UnsharpMaskParameters.
        Parameters
        ----------
        gaussian_low
            The Gaussian standard deviation for the low frequency pass.
        gaussian_high
            The Gaussian standard deviation for the high frequency pass.
        high_frequency_scale
            The scaling factor for the high frequence component when added back to the low component.

        """
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

    def apply (self, original: np.ndarray, combined_mask: np.ndarray, parameters : UnsharpMaskParameters) -> np.ndarray:
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
        """
        # N.B. The Gaussian blur used in Kerber's paper ignores pixels that have been masked. 
        # The implementation here does include them. It seems a custom kernel (ndimage "generic filter") may be required that takes into consideration the overall mask.
        # https://dsp.stackexchange.com/questions/10057/gaussian-blur-standard-deviation-radius-and-kernel-size
        # https://stackoverflow.com/questions/23208232/image-filtering-with-scikit-image
        # https://docs.scipy.org/doc/scipy/reference/tutorial/ndimage.html

        filter = relief.GaussianFilter(original, combined_mask, parameters.gaussian_low)

        original_prime= original * combined_mask

        low = gaussian_filter(original_prime, parameters.gaussian_low, order=0, output=None, mode='reflect', cval=0.0, truncate=4.0)
        low = low * combined_mask

        # subtract low frequency from original to yield the high frequency components
        high = original_prime - low
        high = gaussian_filter(high, parameters.gaussian_high, order=0, output=None, mode='reflect', cval=0.0, truncate=4.0)

        # add back the scaled high frequency components to generate the final results
        final = original_prime + (parameters.high_frequency_scale * high)
        final = final * combined_mask

        return final

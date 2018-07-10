#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Mask
   :synopsis: Support for masking of image arrays.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np

from services import Services

class Mask:
    """
    A class for masking image arrays.
    """
    EPSILON = 1.0e-5    

    def __init__(self, services : Services) -> None:
        """
        Initialize an instance of a Mask.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)
        """
        self.debug = True
        self.services = services

    def background_from_depth_buffer(self, original: np.ndarray) -> np.ndarray:
        """
        Masks a depth buffer array to create a background mask.
        Values below EPSILON are cleared; values > EPSILON are set to 1;
        Parameters
        ----------
        original
            The ndarray from which to create a background mask.
            The array consists of positive float values such as created in a depth buffer.
        Returns
        -------
            A background mask.
        """
        # copy
        mask = np.array(original)
        mask[mask < Mask.EPSILON] = 0
        mask[mask > Mask.EPSILON] = 1
        return mask

    def mask_threshold (self, original: np.ndarray, threshold: float) -> np.ndarray:
        """
        Masks an image array by setting array elements with an absolute value below the threshold to 1.
        N.B. This produces a different result than self.background_from_depth+buffer which expects to operate on only <positive> image values such as from a depth_buffer.
        Parameters 
        ----------
        original
            The ndarray from which to create a mask.
            The array may contain positive or negative values such as from a gradient array.
        threshold
            Absolute values below the the threshold are set to 1.
            Absolute values above the the threshold are set to 0.
        Returns
        -------
            A mask where all 1 elements had an absolute value below the threshold in the source array..
        """            
        
        def f(x):
            return 1 if (abs(x) < threshold) else 0

        f_vectorized = np.vectorize(f)
        return f_vectorized(original)
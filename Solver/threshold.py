#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Threshold
   :synopsis: Support for applying thresholds to image components.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import numpy as np

from services  import Services

class Threshold:
    """
    A class for Support for applying thresholds to image components.
    """

    def __init__(self, services : Services) -> None:
        """
        Initialize an instance of a Threshold.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)
        """
        self.debug = True
        self.services = services

    def apply (self, original: np.ndarray, limit : float) -> np.ndarray:
        """
        Applies a threshold to all elements in an ndarray.
        All absolute values above the threshold are set to 0.

        Parameters
        ----------
        original
            The array to apply the threshold against.
        limit
            The highest value above which an element will be filtered.
        """
        # copy
        threshold_array = np.array(original)
        threshold_array[np.abs(threshold_array) > limit] = 0

        return threshold_array

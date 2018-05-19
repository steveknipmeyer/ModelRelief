#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Threshold
   :synopsis: Support for applying thresholds to image components.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np

from services  import Services

class Threshold:
    """
    A class for Support for applying thresholds to image components.
    """

    def __init__(self, services : Services):
        """
        Initialize an instance of a Threshold.
        Parameters
        ----------
        services
            Service provider (loggins, timers, etc.)
        """
        self.debug = True
        self.services = services

    def apply (self, array, limit : float):
        """
        Applies a threshold to all elements in an ndarray.
        All values above the threshold are set to 0.

        Parameters
        ----------
        array
            The array to apply the threshold against.
        limit
            The highest value above which an element will be filtered.
        """
        array[np.abs(array) > limit] = 0

        return array

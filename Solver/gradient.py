#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Gradient
   :synopsis: Support for calculating image gradients.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np
from typing import List

from difference import Difference, FiniteDifference, Axis
from services import Services

class Gradient:
    """
    A class for calculating image gradients.
    """

    def __init__(self, services : Services) -> None:
        """
        Initialize an instance of a Gradient.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)e
        """
        self.debug = True
        self.services = services

    def calculate(self, array: np.ndarray, use_np_gradient: bool) -> List[np.ndarray]:
        """
        Calculates the gradients of an ndarray.
        Parameters
        ----------
        array
            The ndarray for which the gradients will be calculated.
        use_np_gradient
            Use Numpy gradient method not Difference class.
        Returns
        -------
        An ndarray for each dimension.
        The gradients are returned in Numpy axis order (row, column, ...) therefore:
            results[0] = Y gradient
            results[1] = X gradient
        """
        if use_np_gradient:
            result = np.gradient(array)
            return result

        difference = Difference(self.services)
        gradient_x = difference.difference_x(array, FiniteDifference.Forward)
        gradient_y = difference.difference_y(array, FiniteDifference.Forward)

        result = [gradient_y, gradient_x]
        return result
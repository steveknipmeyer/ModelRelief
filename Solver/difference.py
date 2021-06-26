#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Difference
   :synopsis: Support for calculating array finite differences.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import numpy as np
from enum import Enum
from typing import List

from services import Services
from stopwatch import benchmark

class FiniteDifference(Enum):
    """
    A class representing the types of finite differences.
    """
    Forward = 1,
    Backward = 2

class Axis(Enum):
    """
    A class representing the axes of an array.
    """
    X = 1,
    Y = 2

class Difference:
    """
    A class for calculating array finite differences.
    """

    def __init__(self, services : Services) -> None:
        """
        Initialize a Difference instance.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)
        """
        self.debug = True
        self.services = services

    def difference_x(self, a: np.ndarray, direction:FiniteDifference) -> np.ndarray:
        """
        Calculates the finite dfferences along the X axis.
        Parameters
        ----------
        a
            The array from which to calculate the finite differences.
        direction
            The direction of the finite difference (forward, backward).
        Returns
        -------
        An ndarray containing the finite differences.
        """
        (_, columns) = a.shape
        if direction == FiniteDifference.Forward:
            shift = -1
            duplicated_column = columns - 1
        elif direction == FiniteDifference.Backward:
            shift = +1
            duplicated_column = 0
        else:
            raise ValueError("Invalid FiniteDifference")

        a_prime = np.roll(a, shift, 1)
        a_prime[:, duplicated_column] = a[:, duplicated_column]

        f_plus_delta = a_prime if direction == FiniteDifference.Forward else a
        f = a if direction == FiniteDifference.Forward else a_prime

        difference = f_plus_delta - f
        return difference

    def difference_y(self, a: np.ndarray, direction:FiniteDifference) -> np.ndarray:
        """
        Calculates the finite dfferences along the Y axis.
        Parameters
        ----------
        a
            The array from which to calculate the finite differences.
        direction
            The direction of the finite difference (forward, backward).
        Returns
        -------
        An ndarray containing the finite differences.
        """
        at = a.transpose()
        at_difference_x = self.difference_x(at, direction)
        return at_difference_x.transpose()

    def calculate(self, a: np.ndarray, direction:FiniteDifference, axis:Axis) -> np.ndarray:
        """
        Calculates the finite dfferences along an axis.
        Parameters
        ----------
        a
            The array from which to calculate the finite differences.
        direction
            The direction of the finite difference (forward, backward).
        axis
            The axis along which the finite difference will be computed.
        Returns
        -------
        An ndarray containing the finite differences.
        """
        if axis == Axis.X:
            return self.difference_x(a, direction)
        if axis == Axis.Y:
            return self.difference_y(a, direction)

        return None
#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Difference
   :synopsis: Support for calculating array finite differences.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np
from enum import Enum
from typing import List

from services import Services

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
        (rows, columns) = a.shape
        difference = np.zeros((rows, columns))

        if direction == FiniteDifference.Forward:
            first_offset  = +1
            second_offset =  0
        if direction == FiniteDifference.Backward:
            first_offset  =  0
            second_offset = -1

        for row in range (rows):
            for column in range(columns):
                if (direction == FiniteDifference.Backward) and (column == 0):
                    continue
                if (direction == FiniteDifference.Forward) and (column == (columns - 1)):
                    continue
                difference[row, column] = a[row, column + first_offset] - a[row, column + second_offset]

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
        (rows, columns) = a.shape
        difference = np.zeros((rows, columns))

        if direction == FiniteDifference.Forward:
            first_offset  = +1
            second_offset =  0
        if direction == FiniteDifference.Backward:
            first_offset  =  0
            second_offset = -1

        for column in range(columns):
            for row in range (rows):
                if (direction == FiniteDifference.Backward) and (row == 0):
                    continue
                if (direction == FiniteDifference.Forward) and (row == (rows - 1)):
                    continue
                difference[row, column] = a[row + first_offset, column] - a[row + second_offset, column]
        
        return difference

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
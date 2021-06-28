#!/usr/bin/env python
"""
.. module:: MathTools
   :synopsis: General utilities and helpers.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import numpy as np

from logger import Logger
from numpy.core.fromnumeric import nonzero
from stopwatch import StopWatch
from tools import Colors
class MathTools:
    """
    A class providing general support for math and linear algebra.
    """
    PRECISION: int = 2
    NONZERO_TOLERANCE: float = 1E-2

    def __init__(self) -> None:
        """
        Initialize an instance of MathTools.
        """

    @staticmethod
    def print_array(name: str, a: np.ndarray)-> None:
        """
        Print a NumPy array.
        Parameters
        ----------
        name
            Array name
        a
            NumPy array
        """
        logger = Logger()
        logger.logDebug(f"\n{name}", Colors.BrightCyan)

        logger.logDebug("", Colors.BrightWhite)
        (rows, columns) = a.shape
        for row in range(rows):
            for column in range(columns):
                value = '{:.2f}'.format(a[row, column])
                print ('{:>8s}'.format(value), end="")
            print ('')
        logger.logDebug("", Colors.Reset)

    @staticmethod
    def analyze_array(name: str, a: np.ndarray, epsilon: float = NONZERO_TOLERANCE, precision: int = PRECISION, color: Colors = Colors.BrightWhite)-> None:
        """
        Analyze a NumPy array.
        Parameters
        ----------
        name
            Array name
        a
            NumPy array
        epsilon
            Non-zero tolerance
        precision
            Format precision for properties
        """
        logger = Logger()
        logger.logDebug(f"\n{name}", color)

        absolute = np.absolute(a)

        # properties
        mean = absolute[absolute > epsilon].mean()
        median = np.median(absolute[absolute > epsilon])
        min = absolute[absolute > epsilon].min()
        max= absolute[absolute > epsilon].max()

        precision = 2
        logger.logDebug(f"  mean =   {round(mean, precision)}", color)
        logger.logDebug(f"  median = {round(median, precision)}", color)
        logger.logDebug(f"  min =    {round(min, precision)}", color)
        logger.logDebug(f"  max =    {round(max, precision)}", color)

#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: MathTools
   :synopsis: General utilities and helpers.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np
from stopwatch import StopWatch

class MathTools:
    """
    A class providing genera support for math and linear algebra.
    """

    def __init__(self) -> None:
        """
        Initialize an instance of MathTools.
        """

    @staticmethod
    def print_array(name: str, a: np.ndarray)-> None:
        print(name)
        (rows, columns) = a.shape
        for row in range(rows):
            for column in range(columns):
                value = '{:.2f}'.format(a[row, column])
                print ('{:>8s}'.format(value), end="")
            print('')                 


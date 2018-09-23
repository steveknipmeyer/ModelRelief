#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: benchmark
   :synopsis: Benchmark tests for relief Pyhon C++ extensions.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import colorama
import math
import numpy as np
import unittest
import os
from scipy.ndimage import gaussian_filter

import relief
from logger import Logger
from stopwatch import benchmark
from tools import Colors, Tools

ARRAY_SIZE = 2048

@benchmark()
def relief_filter(a: np.ndarray, mask: np.ndarray, sigma: float)->None :
    """
    Relief C++ Gaussian filter.
    Parameters
    ----------
    a
        Array to process.
    mask
        Element mask. Only mask elements are included in the Gaussian filter.
    sigma
        Standard deviation.
    """
    relief.gaussian_filter(a, mask, sigma)

@benchmark()
def scipy_filter(a: np.ndarray, sigma: float)->None :
    """
    SciPy Gaussian filter.
    Parameters
    ----------
    a
        Array to process.
    mask
        Element mask. Only mask elements are included in the Gaussian filter.
    sigma
        Standard deviation.
    """
    gaussian_filter(a, sigma, order=0, output=None, mode='reflect', cval=0.0, truncate=4.0)

def array_filter()->None :
    """
    Gaussian filters.
    """
    sigma = 4.0
    a = np.random.rand(ARRAY_SIZE, ARRAY_SIZE)
    mask = np.full((ARRAY_SIZE, ARRAY_SIZE), 1)

    scipy_filter(a, sigma)
    relief_filter(a, mask, sigma)

@benchmark()
def relief_fill(a: np.ndarray, value: float)-> None :
    """
    Fill an array with a constant value.
    Parameters
    a
        Numpy array to fill.
    value
        Constant to fill array.
    """
    filled = relief.fill(a, value)

    middle = int(ARRAY_SIZE / 2)
    assert filled[middle, middle] == value, f'relief_fill: Filled array value {filled[middle, middle]} is not equal to {value}'

@benchmark()
def np_fill(a: np.ndarray, value: float)-> None :
    """
    Fill an array with a constant value.
    Parameters
    a
        Numpy array to fill.
    value
        Constant to fill array.
    """
    #a[:] = value
    a.fill(value)

    middle = int(ARRAY_SIZE / 2)
    assert a[middle, middle] == value*1, f'np_fill: Filled array value {a[middle, middle]} is not equal to {value}'

def array_fill()->None :
    """
    Fill an array with a constant value.
    """
    value = 1.0

    b = np.zeros((ARRAY_SIZE, ARRAY_SIZE))
    relief_fill(b, value)

    a = np.zeros((ARRAY_SIZE, ARRAY_SIZE))
    np_fill(a, value)

@benchmark()
def pad_array()->None :
    """
    Pad an array with a border.
    """
    a = np.zeros((ARRAY_SIZE, ARRAY_SIZE))

    border_size = 16
    b = np.zeros((ARRAY_SIZE + (2 * border_size), ARRAY_SIZE + (2 * border_size)))
    b[16:(ARRAY_SIZE + border_size), 16:(ARRAY_SIZE + border_size)] = a

def main()->None :
    """
    Run benchmark tests.
    """
    #array_fill()
    array_filter()
    #pad_array()

if __name__ == '__main__':
    input("Attach debugger and press <Enter>:")
    main()

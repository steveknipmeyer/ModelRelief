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
from scipy.ndimage import gaussian_filter, imread

import relief
from logger import Logger
from stopwatch import benchmark
from tools import Colors, Tools

class Benchmark:

    def __init__(self, array_size: int, trials: int)-> None:
        """
        Perform initialization.
        Parameters
        ----------
        array_size
            Dimensions of test aray.
        trials
            Number of execution pass per test.
        """
        self.array_size = array_size
        self.trials = trials

        self.logger = Logger()

    @benchmark()
    def GaussianFilter(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 0)
        return result

    @benchmark()
    def GaussianBlur(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 1)
        return result

    @benchmark()
    def GaussianBlurCachedKernel(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 11)
        return result

    @benchmark()
    def GaussianBlurBox(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 2)
        return result

    @benchmark()
    def GaussianBlurBoxIndependent(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 3)
        return result

    @benchmark()
    def GaussianBlurBoxIndependentOptimized(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 4)
        return result

    def relief_filter(self, a: np.ndarray, mask: np.ndarray, sigma: float)->None :
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
        reference = self.scipy_filter(a, sigma)

        #result = self.GaussianFilter(a, mask, sigma)
        #self.logger.logInformation (f"GaussianFilter MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        #result = self.GaussianBlur(a, mask, sigma)
        #self.logger.logInformation (f"GaussianBlur MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        #result = self.GaussianBlurCachedKernel(a, mask, sigma)
        #self.logger.logInformation (f"GaussianBlurCachedKernel MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        #result = self.GaussianBlurBox(a, mask, sigma)
        #self.logger.logInformation (f"GaussianBlurBox MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        result = self.GaussianBlurBoxIndependent(a, mask, sigma)
        self.logger.logInformation (f"GaussianBlurBoxIndependent MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        result = self.GaussianBlurBoxIndependentOptimized(a, mask, sigma)
        self.logger.logInformation (f"GaussianBlurBoxIndependentOptimized MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

    @benchmark()
    def scipy_filter(self, a: np.ndarray, sigma: float)->np.ndarray :
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
        for _ in range(self.trials):
            result = gaussian_filter(a, sigma, order=0, output=None, mode='nearest', cval=0.0, truncate=4.0)
        return result

    def array_filter(self, )->None :
        """
        Gaussian filters.
        """
        sigma = 4.0

        a = np.random.rand(self.array_size, self.array_size)
        a = a * 255
        mask = np.full((self.array_size, self.array_size), 1)

        result = self.scipy_filter(a, sigma)
        self.logger.logInformation (f"scipy MSE = {Tools.MSE(result, result)}\n", Colors.Magenta)

        self.relief_filter(a, mask, sigma)

    @benchmark()
    def relief_fill(self, a: np.ndarray, value: float)-> None :
        """
        Fill an array with a constant value.
        Parameters
        a
            Numpy array to fill.
        value
            Constant to fill array.
        """
        filled = relief.fill(a, value)

        middle = int(self.array_size / 2)
        assert filled[middle, middle] == value, f'relief_fill: Filled array value {filled[middle, middle]} is not equal to {value}'

    @benchmark()
    def np_fill(self, a: np.ndarray, value: float)-> None :
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

        middle = int(self.array_size / 2)
        assert a[middle, middle] == value*1, f'np_fill: Filled array value {a[middle, middle]} is not equal to {value}'

    def array_fill(self)->None :
        """
        Fill an array with a constant value.
        """
        value = 1.0

        b = np.zeros((self.array_size, self.array_size))
        self.relief_fill(b, value)

        a = np.zeros((self.array_size, self.array_size))
        self.np_fill(a, value)

    @benchmark()
    def pad_array(self)->None :
        """
        Pad an array with a border.
        """
        a = np.zeros((self.array_size, self.array_size))

        border_size = 16
        b = np.zeros((self.array_size + (2 * border_size), self.array_size + (2 * border_size)))
        b[16:(self.array_size + border_size), 16:(self.array_size + border_size)] = a

def main()->None :
    """
    Run benchmark tests.
    """
    input("Attach debugger and press <Enter>:")
    benchmarkRunner = Benchmark(array_size = 400, trials = 4)

    #benchmarkRunner.array_fill()
    benchmarkRunner.array_filter()
    #benchmarkRunner.pad_array()

if __name__ == '__main__':
    main()

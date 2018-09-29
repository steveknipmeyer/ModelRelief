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
from imagetransform import ImageTransform
from logger import Logger
from stopwatch import benchmark
from tools import Colors, Tools

class Benchmark:

    def __init__(self, rows: int, columns: int, trials: int)-> None:
        """
        Perform initialization.
        Parameters
        ----------
        rows
            Rows in test array.
        columns
            Rows in test array.
        trials
            Columns in test arrray.
        """
        self.rows = rows
        self.columns = columns
        self.trials = trials

        self.logger = Logger()

    @benchmark()
    def Baseline(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 0)
        return result

    @benchmark()
    def Gaussian(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 1)
        return result

    @benchmark()
    def GaussianCached(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 11)
        return result

    @benchmark()
    def Box(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 2)
        return result

    @benchmark()
    def BoxIndependent(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = relief.gaussian_filter(a, mask, sigma, 3)
        return result

    @benchmark()
    def BoxIndependentDelta(self, a: np.ndarray, mask: np.ndarray, sigma: float)->np.ndarray :
        """
        Relief C++ Gaussian filter.
        """
        for _ in range(self.trials):
            result = ImageTransform.gaussian(a, mask, sigma)
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

        #result = self.Baseline(a, mask, sigma)
        #self.logger.logInformation (f"Baseliner MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        #result = self.Gaussian(a, mask, sigma)
        #self.logger.logInformation (f"Gaussian MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        result = self.GaussianCached(a, mask, sigma)
        self.logger.logInformation (f"GaussianCached MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        #result = self.Box(a, mask, sigma)
        #self.logger.logInformation (f"Box MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        #result = self.BoxIndependent(a, mask, sigma)
        #self.logger.logInformation (f"BoxIndependent MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

        result = self.BoxIndependentDelta(a, mask, sigma)
        self.logger.logInformation (f"BoxIndependentDelta MSE = {Tools.MSE(reference, result)}\n", Colors.BrightMagenta)

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

        a = np.random.rand(self.rows, self.columns)
        a = a * 255
        mask = np.full((self.rows, self.columns), 1)

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
        for _ in range(self.trials):
            filled = relief.fill(a, value)

            middle_row = int(self.rows / 2)
            middle_column = int(self.columns / 2)
            assert filled[middle_row, middle_column] == value, f'relief_fill: Filled array value {filled[middle, middle]} is not equal to {value}'

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
        for _ in range(self.trials):
            #a[:] = value
            a.fill(value)

            middle_row = int(self.rows / 2)
            middle_column = int(self.columns / 2)
            assert a[middle_row, middle_column] == value*1, f'np_fill: Filled array value {a[middle, middle]} is not equal to {value}'

    def array_fill(self)->None :
        """
        Fill an array with a constant value.
        """
        value = 1.0

        b = np.zeros((self.rows, self.columns))
        self.relief_fill(b, value)

        a = np.zeros((self.rows, self.columns))
        self.np_fill(a, value)

    @benchmark()
    def pad_array(self)->None :
        """
        Pad an array with a border.
        """
        for _ in range(self.trials):
            a = np.zeros((self.rows, self.columns))

            border_size = 16
            b = np.zeros((self.rows + (2 * border_size), self.columns + (2 * border_size)))
            b[border_size:(self.rows + border_size), 16:(self.columns + border_size)] = a

def main()->None :
    """
    Run benchmark tests.
    """
    input("Attach debugger and press <Enter>:")
    benchmarkRunner = Benchmark(rows=512, columns = 1024, trials = 10)

    #benchmarkRunner.array_fill()
    benchmarkRunner.array_filter()
    #benchmarkRunner.pad_array()

if __name__ == '__main__':
    main()

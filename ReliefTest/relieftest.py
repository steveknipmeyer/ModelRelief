#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: relieftest
   :synopsis: C++ extensions for Python image processing.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import pyamg
import numpy as np

import os
import sys
import relief

from stopwatch import benchmark

@benchmark()
def fill_cplusplus(a: np.ndarray, value: float)-> np.ndarray:
    filled = relief.fill(a, value)    
    return filled

array = np.ones((512, 512))
v= 3.0
fill_cplusplus(array, v)

relief.kernelTest()


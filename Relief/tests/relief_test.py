#!/usr/bin/env python 
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: relief_test
   :synopsis: Unit tests for relief Pyhon C++ extensions.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import math
import unittest

from relief import GaussianKernel

class ReliefTest(unittest.TestCase):

    def test_GaussianKernelOriginEquals1(self):
        """ Verifies the origin (center) of the kernel is equal to 1.0"""
        k = GaussianKernel(1.0)
        self.assertAlmostEqual(k.Element(0, 0), 0.16210282163712664, places = 6)

if __name__ == '__main__':
    unittest.main()

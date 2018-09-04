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
import os
import subprocess
import unittest

from relief import GaussianKernel
from tools import Tools

class ReliefTest(unittest.TestCase):

    def test_GaussianKernelOriginEquals1(self):
        """ Verifies the origin (center) of the kernel is equal to 1.0."""
        k = GaussianKernel(1.0)
        self.assertAlmostEqual(k.Element(0, 0), 0.16210282163712664, places = 6)
    
    def test_RunCPlusPlusUnitTests(self):
        """ Executes the C++ unit tests."""
        root = os.path.dirname(os.path.realpath(__file__))
        executable = os.path.join(root, '..', 'bin', 'reliefUnitTests.exe')
        status = Tools.exec(executable)
        self.assertEqual(status, 0)
    
if __name__ == '__main__':
    unittest.main()

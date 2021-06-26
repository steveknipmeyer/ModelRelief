#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: relief_test
   :synopsis: Unit tests for relief Pyhon C++ extensions.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import math
import numpy as np
import os
import subprocess
import unittest
from functools import wraps

import relief
from logger import Logger
from stopwatch import benchmark
from tools import Colors, Tools

class ReliefTestResult(unittest.TextTestResult):
    """
    Custom test result to suppress standard error reporting.
    https://stackoverflow.com/questions/8518043/turn-some-print-off-in-python-unittest
    """
    def addSuccess(self, test):
        unittest.TestResult.addSuccess(self, test)

    def addError(self, test, err):
        unittest.TestResult.addError(self, test, err)

    def addFailure(self, test, err):
        unittest.TestResult.addFailure(self, test, err)

    def printErrors(self):
        if self.dots or self.showAll:
            self.stream.writeln()
        self.printErrorList('ERROR', self.errors)
        self.printErrorList('FAIL', self.failures)

    def printErrorList(self, flavour, errors):
        if not errors:
            return
        self.stream.writeln(self.separator1)
        for test, _ in errors:
            self.stream.writeln(f"{Colors.BrightRed}{flavour}: {self.getDescription(test)}{Colors.Reset}\n\n")

class ReliefTestRunner(unittest.TextTestRunner):
    """
    Custom test runner to suppress standard error reporting.
    https://stackoverflow.com/questions/8518043/turn-some-print-off-in-python-unittest
    """
    def _makeResult(self):
        return ReliefTestResult(self.stream, self.descriptions, self.verbosity)

def display_tag(tag_name: str = None, color: str = Colors.BrightCyan):
    """ A decorator for displaying the active test name.
    N.B. These arguments are available to the wrapped method through closure.
    Parameters
    ----------
    tag_name
        Tag to display.
    color
        Color for the logger message.
    """
    def decorator_maker(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            tag = fn.__name__ if tag_name is None else tag_name
            # *args is the argument list to the wrapped function. For a class method, the first argument is 'self'.
            function_self = args[0]
            function_self.logger.logInformation(tag, color)
            result = fn(*args, **kwargs)
            return result
        return wrapped
    return decorator_maker

class ReliefTest(unittest.TestCase):

    def __init__(self, methodName='runTest'):
        """ Initialize an instance of ReliefTest. """
        super().__init__(methodName)

        self.logger = Logger()

    def tearDown(self):
        """
        This method is called by the test runner after the execution of each test.
        The results are inspected and a log message is created if the test was not successful.
        # https://stackoverflow.com/questions/4414234/getting-pythons-unittest-results-in-a-teardown-method
        """

        # populate result
        result = self.defaultTestResult()
        self._feedErrorsToResult(result, self._outcome.errors)

        # errors   = runtime errors (invalid method execution)
        # failures = unsuccessful test results
        error = self.get_exception_list(result.errors)
        failure = self.get_exception_list(result.failures)
        ok = not error and not failure

        if not ok:
            result_type, result_text = ('ERROR', error) if error else ('FAIL', failure)
            # take last line that does not begin with a space, skipping first line
            result_reason = [x for x in result_text.split('\n')[1:] if not x.startswith(' ')][0]
            message = f"{result_type}: {self.id()}\n     {result_reason}"
            self.logger.logError(message)

    def get_exception_list(self, cumulative_exception_list):
        """
        Returns the exception list associated with an unsuccessful result of a test method.
        unittest accumulates the test case results into a list. So, for the current test we check if the last method matches ourselves.
        Parameters
        ---------
        cumulative_exception_list
            <Cumulative> list of tuples (method, exception list) for all the test methods that have been executed.
        """
        # last entry is ourselves?
        if cumulative_exception_list and cumulative_exception_list[-1][0] is self:
            # return the exception list
            return cumulative_exception_list[-1][1]

    @display_tag('\nMiscellaneous', Colors.BrightMagenta)
    @display_tag()
    def test_FillNumpyArray(self):
        """ Fills a Numpy array with a constant value."""
        a = np.zeros((512, 512))
        value = 1.0
        filled = relief.fill(a, value)
        self.assertEqual(filled[256, 256], 1)

    @display_tag('\nGaussianKernel', Colors.BrightMagenta)
    @display_tag()
    def test_GaussianKernelOriginEqualsExpectedValue(self):
        """ Verifies the origin (center) of the normlized kernel is the expected value."""
        """ See MATLAB/GaussianFilter"""
        k = relief.GaussianKernel(1.0)
        self.assertAlmostEqual(k.Element(0, 0), 0.1592, places = 4)

    @display_tag('\nC++', Colors.BrightMagenta)
    @display_tag()
    def test_RunCPlusPlusUnitTests(self):
        """ Executes the C++ unit tests."""
        root = os.path.dirname(os.path.realpath(__file__))
        executable = os.path.join(root, '..', 'bin', 'reliefUnitTests')
        status = Tools.exec(executable)
        self.assertEqual(status, 0)

if __name__ == '__main__':
    unittest.main(testRunner=ReliefTestRunner())

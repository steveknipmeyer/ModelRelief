#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: pybind11test
   :synopsis: Experiments in Python.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import sys                                   
import python_example

class Harness:

    def __init__(self):
        pass

    def run(self):
        result = python_example.add(1, 2)
        print (f"result = {result}")

harness = Harness()
harness.run()
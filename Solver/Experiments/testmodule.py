#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: testmodule
   :synopsis: Experiments in Python.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import sys                                      # We need sys so that we can pass argv to QApplication

class Timer:

    def __init__(self):
        self.value = 10

timer = Timer()
#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: test
   :synopsis: Experiments in Python.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import sys                                      # We need sys so that we can pass argv to QApplication
from testmodule import Timer, timer

def main():
    print (f"timer.value = {timer.value}")    

if __name__ == '__main__':              # if we're running file directly and not importing it
    main()                              # run the main function

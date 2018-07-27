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

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from stopwatch import benchmark

class Widget:
    @benchmark("Widget.adder")
    def adder (self, firstTerm: float, secondTerm: float)-> float :
        return firstTerm + secondTerm

@benchmark()
def multiplier (firstTerm: float, secondTerm: float)-> float :
    return firstTerm * secondTerm

x = benchmark (multiplier)

def main():
    result = multiplier(1.0, 3.0)
    print (f"result = {result}")

    # result = x(1.0, 3.0)
    # print (f"result = {result}")

    widget = Widget()
    result = widget.adder(2.0, 4.0)
    print (f"result = {result}")

if __name__ == '__main__':              # if we're running file directly and not importing it
    main()                              # run the main function

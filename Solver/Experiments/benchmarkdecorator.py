#!/usr/bin/env python
"""
.. module:: test
   :synopsis: Experiments in Python.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>

"""
from stopwatch import benchmark

class Widget:
    @benchmark("Widget.adder")
    def adder (self, firstTerm: float, secondTerm: float)-> float :
        return firstTerm + secondTerm

@benchmark()
def multiplier (firstTerm: float, secondTerm: float)-> float :
    return firstTerm * secondTerm


def main():
    result = multiplier(1.0, 3.0)
    print (f"result = {result}")

    widget = Widget()
    result = widget.adder(2.0, 4.0)
    print (f"result = {result}")


main()

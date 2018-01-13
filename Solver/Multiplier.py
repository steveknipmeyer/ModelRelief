#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved. 
#

"""

.. module:: Multiplier
   :synopsis: Multiplies the command line arguments.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

import os
import sys
import math
import time

class Multiplier:

    def __init__(self): 
        return

    def multiply (self, firstTerm, secondTerm):
        """
            Multiples the method arguments.
        """
        return firstTerm * secondTerm
    
if __name__ == "__main__":
    
    firstTerm = 2
    secondTerm = 4
    multiplier = Multiplier()
    result = multiplier.multiply(firstTerm, secondTerm)
    time.sleep(5)
    print ("%s = %s x %s" % (result, firstTerm, secondTerm))
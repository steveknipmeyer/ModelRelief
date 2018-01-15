#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Multiplier
   :synopsis: Multiplies two numbers.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

import time

class Multiplier:
    """
        Multiples two numbers.
    """

    def __init__(self):
        """
            Perform initialization.
        """
        pass

    def multiply_terms (self, first_term, second_term):
        """
            Multiples the method arguments.
        """
        return first_term * second_term

def main():
    """
        Main entry point.
    """
    first_term = 2
    second_term = 4
    multiplier = Multiplier()
    result = multiplier.multiply_terms(first_term, second_term)
    time.sleep(5)
    print ("%s = %s x %s" % (result, first_term, second_term))

if __name__ == "__main__":

    main()

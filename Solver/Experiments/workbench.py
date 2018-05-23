#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""

.. module:: workbench
   :synopsis: Experiments in Python.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import collections.abc

def main():
    """
        Main entry point.
    """
    matplotlib.use('qt5agg')
    plt.imshow(np.random.rand(10, 10), interpolation='none')
    plt.show()

if __name__ == '__main__':
    main()

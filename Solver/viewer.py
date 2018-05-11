#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""

.. module:: viewer
   :synopsis: Experiments in image display of depth buffers.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""

import argparse
import json
import math
import matplotlib.pyplot as plt
import numpy as np
import os
from typing import Tuple

class Viewer:
    """
    Displays a depth buffer as an image.
    """
    def __init__(self):
        """
            Initialize an instance of the Viewer.
        """

    def show_image(self, a, color_map: str):
        """
        Display a buffer of floats as an image.
        """

        # flip; first DB row is at minimum Y
        a = np.flipud(a)
        
        # invert depths; brighter values are higher offsets from mesh plane
        inverter = lambda v: abs(1 - v)
        a = inverter(a)

        # display
        plt.figure(figsize=(10, 10))
        plt.imshow(a, cmap=color_map)
        plt.title("Model Relief")
        plt.show()

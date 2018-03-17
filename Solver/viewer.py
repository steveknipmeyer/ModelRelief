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

from depthbuffer import DepthBuffer

class Viewer:
    """
    Displays a depth buffer as an image.
    """
    def __init__(self, settings, working):
        """
            Iniitalize an instance of the Viewer.
        """
        with open(settings) as json_file:
            self.settings = json.load(json_file)
        
        working_folder = os.path.abspath(working)
        self.working_folder = working_folder
        if not os.path.exists(working_folder):
            os.makedirs(working_folder)

        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'])

    def show_image(self, depth_buffer):
        """
        Display a depth buffer as an iamge.
        """
        # read raw bytes
        byte_depths = self.depth_buffer.read__binary(self.depth_buffer.path)
        # convert to floats
        floats = self.depth_buffer.unpack_floats(byte_depths)
 
        # transform 2D        
        a = np.array(floats)
        shape = a.shape
        a = np.reshape(a, (512, 512))
        shape = a.shape
        
        # flip; first DB row is at minimum Y
        a = np.flipud(a)
        
        # invert depths; brighter values are higher offsets from mesh plane
        inverter = lambda v: abs(1 - v)
        a = inverter(a)

        # display
        plt.figure(figsize=(10, 10))
        plt.imshow(a, cmap="gray")
        plt.title("Model Relief DepthBuffer")
        plt.show()

        pass

def main():
    """
        Main entry point.
    """
    os.chdir(os.path.dirname(__file__))

    options_parser = argparse.ArgumentParser()
    options_parser.add_argument('--settings', '-s',
                                help='Mesh JSON settings file that defines the associated DepthBuffer and MeshTransform.', required=True)
    options_parser.add_argument('--working', '-w',
                                help='Temporary working folder.', required=True)
    arguments = options_parser.parse_args()

    viewer = Viewer(arguments.settings, arguments.working)
    viewer.show_image(viewer.depth_buffer)

    noop = 1

if __name__ == '__main__':
    main()

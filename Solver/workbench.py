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
import numpy as np
import os
import time

from depthbuffer import DepthBuffer
from mesh import Mesh
from viewer import Viewer

class Workbench:
    """
    Drives various image processing experiments.
    """
    def __init__(self, settings, scale):
        """
            Iniitalize an instance of the Workbench.
        """
        with open(settings) as json_file:
            self.settings = json.load(json_file)

        self.depth_buffer = DepthBuffer(self.settings['DepthBuffer'])
        self.mesh = Mesh(self.settings)

        self.scale = float(scale) if scale is not None else 1.0

    def show_depth_buffer(self, a, title):
        """
        Displays a depth buffer array.
        Inverts the image.
        """
        viewer = Viewer()

        # invert DB depths; brighter values are higher offsets from mesh plane
        inverter = lambda v: abs(1 - v)
        a = inverter(a)       

        viewer.show_image(a, "gray", title)

    def show_gradient_prime(self, gradient_list, title):
        """
        Displays a list of gradients as an inage.
        Preforms thresholding to eliminate extreme values.
        """
        viewer = Viewer()
    
        grad = np.array(gradient_list)
        grad = np.reshape(grad, (self.depth_buffer.height, self.depth_buffer.height))

        # apply thresholding
        threshold = 3
        grad[np.abs(grad) > threshold] = 0
    
        viewer.show_image(grad, "Blues_r", title)

    def show_gradient(self, gradient, title):
        """
        Displays an array of gradients.
        Preforms thresholding to eliminate extreme values.
        """
        viewer = Viewer()
    
        # apply thresholding
        threshold = 3
        gradient[np.abs(gradient) > threshold] = 0
    
        viewer.show_image(gradient, "Blues_r", title)

    def run(self):
        """
            Perform processing.
        """
        a = self.depth_buffer.np_array

        # scale
        print ("scale = %f" % self.scale)
        a *= self.scale

        self.show_depth_buffer(a, "DepthBuffer")

        results = self.depth_buffer.gradients

        start_time = time.time()        
        gradient_x = self.depth_buffer.gradient_x
        gradient_y = self.depth_buffer.gradient_y
        print ("Python gradients = %s" % (time.time() - start_time))
        
        #gradient_list = self.depth_buffer.gradient_x
        self.show_gradient_prime(gradient_x, "dI(x,y)/dx MR")
        self.show_gradient(results[1], "dI(x,y)/dx")

        #gradient_list = self.depth_buffer.gradient_y
        self.show_gradient_prime(gradient_y, "dI(x,y)/dy MR")
        self.show_gradient(results[0], "dI(x,y)/dy")

def main():
    """
        Main entry point.
    """
    os.chdir(os.path.dirname(__file__))

    options_parser = argparse.ArgumentParser()
    options_parser.add_argument('--settings', '-s',
                                help='Mesh JSON settings file that defines the associated DepthBuffer and MeshTransform.', required=True)
    options_parser.add_argument('--multiplier', '-m',
                                help='Scale multiplier. Applied to all depth buffer values', required=False)
    arguments = options_parser.parse_args()

    workbench = Workbench(arguments.settings, arguments.multiplier)
    workbench.run()

if __name__ == '__main__':
    main()

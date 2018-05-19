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
import numpy as np
import os

from solver import Solver
from viewer import Viewer

class Workbench:
    """
    Drives various image processing experiments.
    """
    def __init__(self, settings, working):
        """
        Iniitalize an instance of the Workbench.
        """
        self.solver = Solver(settings, working)
        self.viewer = Viewer()

    def run(self):
        """
        Perform processing.
        """
        depth_buffer = self.solver.depth_buffer.np_array

        gradients = self.solver.depth_buffer.gradients       
        gradient_x = gradients[1]
        gradient_y = gradients[0]

        threshold = self.solver.mesh_transform.tau
        gradient_x[np.abs(gradient_x) > threshold] = 0
        gradient_y[np.abs(gradient_y) > threshold] = 0

        images = [depth_buffer, gradient_x, gradient_y]
        titles = ["DepthBuffer", "dI(x,y)/dx", "dI(x,y)/dy"]        
        cmaps  = ["gray", "summer", "Blues_r"]
        rows = 1
        self.viewer.show_images(images, rows, titles, cmaps)

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
    workbench = Workbench(arguments.settings, arguments.working)

    workbench.run()

if __name__ == '__main__':
    main()

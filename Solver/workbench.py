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
import os
import numpy as np

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
        depth_buffer_mask = self.solver.mask.background_from_depth_buffer(depth_buffer)
  
        gradients = self.solver.depth_buffer.gradients
        gradient_x = gradients[1]
        gradient_y = gradients[0]
        
        threshold = self.solver.mesh_transform.tau
        gradient_x_threshold = self.solver.threshold.apply(gradient_x, threshold)
        gradient_y_threshold = self.solver.threshold.apply(gradient_y, threshold)

        gradient_x_mask = self.solver.mask.mask_nonzeo(gradient_x_threshold)
        gradient_y_mask = self.solver.mask.mask_nonzeo(gradient_y_threshold)

        combined_mask = depth_buffer_mask * gradient_x_mask * gradient_y_mask
        images = [depth_buffer, depth_buffer_mask, gradient_x_threshold, gradient_x_mask, gradient_y_threshold, gradient_y_mask, combined_mask]
        titles = ["DepthBuffer", "Background Mask", "Gradient X: dI(x,y)/dx", "Gradient X Mask", "Gradient Y: dI(x,y)/dy", "Gradient Y Mask", "Composite Mask"]
        cmaps  = ["gray", "gray", "Blues_r", "gray", "Blues_r", "gray", "gray"]
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

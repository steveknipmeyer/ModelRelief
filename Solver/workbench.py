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

import matplotlib
matplotlib.use('Qt5Agg')
import matplotlib.pyplot as plt
from PyQt5 import QtWidgets 

from solver import Solver
from explorer import Explorer

class Workbench:
    """
    Drives various image processing experiments.
    """
    def __init__(self, settings, working):
        """
        Iniitalize an instance of the Workbench.
        """
        self.solver = Solver(settings, working)
        self.qapp = QtWidgets.QApplication([])       

    def construct_figure(self) -> plt.Figure:
        """
        Construct a Figure consisting of the image set and legends.
        """ 
        depth_buffer = self.solver.depth_buffer.floats
        depth_buffer_mask = self.solver.depth_buffer.background_mask
  
        gradient_x = self.solver.depth_buffer.gradient_x
        gradient_y = self.solver.depth_buffer.gradient_y
        
        threshold = self.solver.mesh_transform.tau
        gradient_x_mask = self.solver.mask.mask_threshold(gradient_x, threshold)
        gradient_y_mask = self.solver.mask.mask_threshold(gradient_y, threshold)

        gradient_x = self.solver.threshold.apply(gradient_x, threshold)
        gradient_y = self.solver.threshold.apply(gradient_y, threshold)

        combined_mask = depth_buffer_mask * gradient_x_mask * gradient_y_mask

        images = [depth_buffer, depth_buffer_mask, gradient_x, gradient_x_mask, gradient_y, gradient_y_mask, combined_mask]
        titles = ["DepthBuffer", "Background Mask", "Gradient X: dI(x,y)/dx", "Gradient X Mask", "Gradient Y: dI(x,y)/dy", "Gradient Y Mask", "Composite Mask"]
        cmaps  = ["gray", "gray", "Blues_r", "gray", "Blues_r", "gray", "gray"]
        rows = 1

        return Explorer.construct_figure(images, rows, titles, cmaps)

    def run(self):
        """
        Open the application.
        """ 
        figure = self.construct_figure()
        
        explorer = Explorer(figure)
        explorer.show_window()

        exit(self.qapp.exec_()) 

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

#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: workbench
   :synopsis: Experiments in image processing of depth buffers.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import argparse
import qdarkstyle
import os

from PyQt5 import QtWidgets 

from explorer import Explorer

class Workbench:
    """
    Drives various image processing experiments.
    """
    def __init__(self, settings: str, working: str) -> None:
        """
        Initialize an instance of the Workbench.
        Parameters
        ----------
        settings
            The JSON settings file for a Mesh.
        working
            The working folder to be used for intermediate results.
        """
        self.qapp = QtWidgets.QApplication([])       
        self.qapp.setStyleSheet(qdarkstyle.load_stylesheet_pyqt5())

        self.explorer = Explorer(settings, working, self.qapp)

    def run(self):
        """
        Run the application.
        """ 
        self.explorer.update_figure()
        self.explorer.show()

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

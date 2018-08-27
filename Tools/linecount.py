#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: LineCount
   :synopsis: Counts lines of source by language type.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import colorama
import os
import sys
from enum import Enum

from environment import EnvironmentNames, Environment
from logger import Logger
from tools import Colors, Tools

class LineCount:
    """
    Counts lines of source by language type.
    """

    def __init__(self):
        """
        Performs initialization.
        """
        colorama.init()        
        self.logger = Logger()
        self.environment:Environment = Environment()


    def run (self):
        """
        """
        self.logger.logInformation("<LineCount>", Colors.BrightCyan)

        root = os.environ[EnvironmentNames.MRSolution]
        os.chdir(root)

        excluded_folders = {"bin", "devenv", ".git", "node_modules", "obj", "store", "Test", "wwwroot"}
        def directory_filter(directory: str)->bool:
            """
            Filters the current directory.
            Parameters
            ----------
            directory
                Current directory name to test.
            """
            basename = os.path.basename(directory)
            # print(f"Testing {basename} for exclusion")
            process = False if basename in excluded_folders else True
            if not process:
                # self.logger.logInformation(f"Skipping {directory}", Colors.BrightYellow)
                pass

            return process

        tools = Tools()
        tools.recurse_folder('D:/Github/ModelRelief/Solver', directory_filter)

        self.logger.logInformation("</LineCount>", Colors.BrightCyan) 

def main():
    """
    Main entry point.
    """
    linecount = LineCount()
    linecount.run()

if __name__ == "__main__":
    main()
 
#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Builder
   :synopsis: Builds ModelRelief.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import subprocess
import sys
from enum import Enum

from logger import Logger
from tools import Colors

class EnvironmentSettings(Enum):
    """
    A class representing the MR environment variables.
    """
    MR = "MR"
    MRSOLUTION = "MRSolution"

class Builder:
    """
    Builds the ModelRelief application.
    """

    def __init__(self):
        """
        Performs initialization.
        """
        self.logger = Logger()

    def run (self):
        """
        Sequence the build steps.
        """
        self.logger.logInformation("\n<ModelRelief>", Colors.BrightCyan)

        self.logger.logInformation("\nBuilding wwwroot", Colors.BrightMagenta)
        subprocess.run ("gulp.cmd", shell=True)

        self.logger.logInformation("\nTypeScript compilation", Colors.BrightMagenta)
        subprocess.run ("tsc -p ./ModelRelief", shell=True)

        self.logger.logInformation("\nPython virtual environment", Colors.BrightMagenta)
        subprocess.run ("BuildPythonEnvironment Production", shell=True)

        self.logger.logInformation("\n<ModelRelief>", Colors.BrightCyan)

def main():
    """
        Main entry point.
    """
    # run from solution root
    print (EnvironmentSettings.MRSOLUTION.value)
    root = os.environ[EnvironmentSettings.MRSOLUTION.value]
    os.chdir(root)

    builder = Builder()
    builder.run()

if __name__ == "__main__":
    main()  

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
import shutil
import subprocess
import sys
from enum import Enum

from logger import Logger
from tools import Colors, Tools

class EnvironmentSettings(Enum):
    """
    A class representing the MR environment variables.
    """
    MR = "MR"
    MRSOLUTION = "MRSolution"
    MRPUBLISH = "MRPublish"

class Builder:
    """
    Builds the ModelRelief application.
    """

    def __init__(self):
        """
        Performs initialization.
        """
        self.logger = Logger()

    def exec (self, command_line:str)-> int:
        """
        Execute a shell tool.
        Parameters
        ----------
        command_line
            The command line to execute.
        """
        status:subprocess.CompletedProcess = subprocess.run (command_line, shell=True)
        return status.returncode

    def run (self):
        """
        Sequence the build steps.
        """
        self.logger.logInformation("\n<ModelRelief>", Colors.BrightCyan)

        # folders
        project = os.environ[EnvironmentSettings.MR.value]
        publish = os.environ[EnvironmentSettings.MRPUBLISH.value]
        solution = os.environ[EnvironmentSettings.MRSOLUTION.value]
        solver_folder = "Solver"
        tools_folder  = "Tools"

        os.chdir(solution)

        # wwwroot
        self.logger.logInformation("\nBuilding wwwroot", Colors.BrightMagenta)
        self.exec("gulp.cmd")

        # TypeScript
        self.logger.logInformation("\nTypeScript compilation", Colors.BrightMagenta)
        self.exec("tsc -p {}".format(project))        

        # remove Publish folder
        if os.path.exists(publish):
            self.logger.logInformation("\nDelete output folder", Colors.Red)
            if Tools.confirm("Delete {}?".format(publish)):
                shutil.rmtree(publish)
            else:
                self.logger.logInformation("Exiting", Colors.Red)
                sys.exit(1)            

        # ASP.NET Core Publish
        self.logger.logInformation("\nASP.NET Core Publish", Colors.BrightMagenta)
        os.chdir(project)
        self.exec("dotnet publish -c Release -o {}".format(publish))        

        # Python virtual environment
        self.logger.logInformation("\nPython virtual environment", Colors.BrightMagenta)
        os.chdir(publish)
        self.exec("BuildPythonEnvironment Production")        

        # Python source
        self.logger.logInformation("\nPython source", Colors.BrightMagenta)
        os.chdir(publish)

        Tools.copy_folder(os.path.join(solution, solver_folder), os.path.join(publish, solver_folder))
        Tools.copy_folder(os.path.join(solution, tools_folder), os.path.join(publish, tools_folder))

        self.logger.logInformation("\n<ModelRelief>", Colors.BrightCyan)

def main():
    """
        Main entry point.
    """
    builder = Builder()
    builder.run()

if __name__ == "__main__":
    main()  

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
import argparse
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
    MRPORT = "MRPort"
    MRINITIALIZEDATABASE = "MRInitializeDatabase"
    ASPNETCORE_ENVIRONMENT = "ASPNETCORE_ENVIRONMENT"

class Builder:
    """
    Builds the ModelRelief application.
    """

    def __init__(self, arguments):
        """
        Performs initialization.
        """
        self.logger = Logger()
        self.arguments = arguments

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

    def delete_folder (self, folder: str)->None:
        """
        Deletes a build folder after prompting for confirmation.
        """
        if os.path.exists(folder):
            self.logger.logInformation(f"\nDelete {folder}", Colors.Red)
            if Tools.confirm(f"Delete {folder}?"):
                shutil.rmtree(folder)
            else:
                self.logger.logInformation("Exiting", Colors.Red)
                sys.exit(1)            

    def initialize (self, wwwroot: str, publish: str)->None :
        """
        Perform initialization including removing build targets.
        Parameters
        ----------
        wwwroot
            wwwroot output folder
        publish
            publish output folder
        """
        self.delete_folder(wwwroot)
        self.delete_folder(publish)

    def run (self):
        """
        Sequence the build steps.
        """
        self.logger.logInformation("\n<ModelRelief>", Colors.BrightCyan)

        # folders
        project = os.environ[EnvironmentSettings.MR.value]
        solution = os.environ[EnvironmentSettings.MRSOLUTION.value]
        wwwroot = os.path.join(project, 'wwwroot')
        publish = os.environ[EnvironmentSettings.MRPUBLISH.value]
        solver_folder = "Solver"
        tools_folder = "Tools"
        test_folder = "Test"

        os.chdir(solution)
        self.initialize(wwwroot, publish)

        # wwwroot
        self.logger.logInformation("\nBuilding wwwroot", Colors.BrightMagenta)
        os.chdir(solution)
        self.exec("gulp.cmd")

        # TypeScript
        self.logger.logInformation("\nTypeScript compilation", Colors.BrightMagenta)
        os.chdir(solution)
        self.exec("tsc -p {}".format(project))        

        # database initialization and user store
        if self.arguments.initialize:
            self.logger.logInformation("\nInitialize database and user store", Colors.BrightMagenta)
            os.chdir(project)
            # N.B. ASPNETCORE_ENVIRONMENT cannot be overridden as a 'dotnet run' command line argument.
            # So, override (and restore) the current settings.
            environment = os.environ[EnvironmentSettings.ASPNETCORE_ENVIRONMENT.value]
            initialize_database = os.environ[EnvironmentSettings.MRINITIALIZEDATABASE.value]
            os.environ[EnvironmentSettings.ASPNETCORE_ENVIRONMENT.value] = "Production"
            os.environ[EnvironmentSettings.MRINITIALIZEDATABASE.value] = "False"
            self.exec("dotnet run --no-launch-profile  --MRForceInitializeAll=True")        
            os.environ[EnvironmentSettings.ASPNETCORE_ENVIRONMENT.value] = environment
            os.environ[EnvironmentSettings.MRINITIALIZEDATABASE.value] = initialize_database

        # ASP.NET Core Publish
        self.logger.logInformation("\nASP.NET Core Publish", Colors.BrightMagenta)
        os.chdir(project)
        self.exec("dotnet publish -c Release -o {}".format(publish))        

        # Python virtual environment
        if self.arguments.python:
            self.logger.logInformation("\nPython virtual environment", Colors.BrightMagenta)
            os.chdir(publish)
            self.exec("BuildPythonEnvironment Production")        

        # Python source
        self.logger.logInformation("\nPython source", Colors.BrightMagenta)
        os.chdir(solution)
        Tools.copy_folder(os.path.join(solution, solver_folder), os.path.join(publish, solver_folder))
        Tools.copy_folder(os.path.join(solution, tools_folder), os.path.join(publish, tools_folder))

        # test models
        self.logger.logInformation("\nTest models", Colors.BrightMagenta)
        os.chdir(project)
        Tools.copy_folder(os.path.join(project, test_folder), os.path.join(publish, test_folder))

        # Docker image
        if self.arguments.docker:
            self.logger.logInformation("\nDocker image", Colors.BrightMagenta)
            os.chdir(solution)
            port = os.environ[EnvironmentSettings.MRPORT.value]
            self.exec(f"docker build -t modelrelief --build-arg MRPORT={port} -f Build\\DockerFile.modelrelief  .")        

        self.logger.logInformation("\n<ModelRelief>", Colors.BrightCyan)

def main():
    """
        Main entry point.
    """
    options_parser = argparse.ArgumentParser()
    options_parser.add_argument('--docker', '-d',
                                help='Build the Docker image.', required=False, default=True)
    options_parser.add_argument('--python', '-p',
                                help='Build the Python virtual environment.', required=False, default=True)
    options_parser.add_argument('--initialize', '-i',
                                help='Initialize the database and the user store.', required=False, default=True)
    arguments = options_parser.parse_args()

    builder = Builder(arguments)
    builder.run()

if __name__ == "__main__":
    main()  

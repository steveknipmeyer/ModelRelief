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
import ast
import os
import shutil
import subprocess
import sys
from enum import Enum

from environment import EnvironmentNames, Environment
from logger import Logger
from tools import Colors, Tools

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
        self.environment:Environment = Environment() 

        # folders
        self.project = os.environ[EnvironmentNames.MR]
        self.solution = os.environ[EnvironmentNames.MRSolution]
        self.wwwroot = os.path.join(self.project, 'wwwroot')
        self.publish = os.environ[EnvironmentNames.MRPublish]
        self.solver_folder = "Solver"
        self.sqlserver_folder = "DatabaseStore/SQLServer"
        self.test_folder = "Test"
        self.tools_folder = "Tools"

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

    def delete_folder (self, folder: str, confirm=False)->None:
        """
        Deletes a build folder after prompting for confirmation.
        Parameters
        ----------
        folder
            The absolute path to the folder to be deleted.
        confirm
            Prompt to confirm the deletion.
        """
        if os.path.exists(folder):
            self.logger.logInformation(f"\nDeleting {folder}", Colors.Red)
            if not confirm or Tools.confirm(f"Delete {folder}?"):
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

    def build (self):
        """
        Core build.
        """
        self.logger.logInformation("\n<Build>", Colors.BrightYellow)

        os.chdir(self.solution)
        self.initialize(self.wwwroot, self.publish)

        # gulp
        self.logger.logInformation("\nBuilding wwwroot", Colors.BrightMagenta)
        os.chdir(self.solution)
        self.exec("gulp.cmd")

        # TypeScript
        self.logger.logInformation("\nTypeScript compilation", Colors.BrightMagenta)
        os.chdir(self.solution)
        self.exec("tsc -p {}".format(self.project))       

        # ASP.NET Core build
        self.logger.logInformation("\nASP.NET Core compilation", Colors.BrightMagenta)
        os.chdir(self.project)
        self.exec("dotnet build")

        # database initialization and user store
        if self.arguments.initialize:
            self.logger.logInformation("\nInitialize database and user store", Colors.BrightMagenta)
            os.chdir(self.project)
            # N.B. ASPNETCORE_ENVIRONMENT cannot be overridden as a 'dotnet run' command line argument.
            # So, override (and restore) the current settings.
            self.environment.push()
            os.environ[EnvironmentNames.ASPNETCORE_ENVIRONMENT] = "ProductionBuild"
            os.environ[EnvironmentNames.MRExitAfterInitialization] = "True"
            os.environ[EnvironmentNames.MRInitializeUserStore] = "True"
            os.environ[EnvironmentNames.MRInitializeDatabase] = "True"
            os.environ[EnvironmentNames.MRSeedDatabase] = "True"

            self.exec("dotnet run --no-launch-profile")
            self.environment.pop()

        self.logger.logInformation("\n</Build>", Colors.BrightYellow)

    def webpublish (self):
        """
        Publish web site.
        """
        self.logger.logInformation("\n<Publish>", Colors.BrightCyan)

        os.chdir(self.solution)
        # ASP.NET Core Publish
        self.logger.logInformation("\nASP.NET Core Publish", Colors.BrightMagenta)
        os.chdir(self.project)
        self.exec("dotnet publish -c Release -o {}".format(self.publish))        

        # Strip TypeScript source map
        self.logger.logInformation("\nRemoving TypeScript source map", Colors.BrightMagenta)
        source_map = os.path.join(self.publish, 'wwwroot/js/modelrelief.js.map')
        self.logger.logInformation(f"Deleting {source_map}", Colors.BrightWhite)
        os.remove(source_map)

        # Python virtual environment
        if self.arguments.python:
            self.logger.logInformation("\nPython virtual environment", Colors.BrightMagenta)
            os.chdir(self.publish)
            self.exec("BuildPythonEnvironment Production")        

        # Python source
        self.logger.logInformation("\nPython source", Colors.BrightMagenta)
        os.chdir(self.solution)
        Tools.copy_folder(os.path.join(self.solution, self.solver_folder), os.path.join(self.publish, self.solver_folder))
        Tools.copy_folder(os.path.join(self.solution, self.tools_folder), os.path.join(self.publish, self.tools_folder))

        # test models
        self.logger.logInformation("\nTest models", Colors.BrightMagenta)
        os.chdir(self.project)
        Tools.copy_folder(os.path.join(self.project, self.test_folder), os.path.join(self.publish, self.test_folder))

        # database
        self.logger.logInformation("SQLServer database", Colors.BrightMagenta)
        os.chdir(self.solution)
        sqlserver_files = ['ModelReliefProduction.mdf', 'ModelReliefProduction_log.ldf']
        for file in sqlserver_files:
            source = os.path.join(self.environment.sqlserver_folder, file)
            destination = os.path.join(self.publish, self.sqlserver_folder, file)
            Tools.copy_file(source, destination)

        # Docker image
        if self.arguments.docker:
            self.logger.logInformation("\nDocker ModelRelief image", Colors.BrightMagenta)
            os.chdir(self.solution)
            port = os.environ[EnvironmentNames.MRPort]
            self.exec(f"docker build -t modelrelief --build-arg MRPORT={port} -f Build\\DockerFile.modelrelief  .")        

            self.logger.logInformation("\nDocker ModelRelief Databsae image", Colors.BrightMagenta)
            self.exec(f"docker build -t modelreliefdatabase -f Build\\DockerFile.modelreliefdatabase  .")        

        self.logger.logInformation("\n</Publish>", Colors.BrightYellow)

    def run (self):
        """
        Sequence the build steps.
        """
        self.logger.logInformation("\n<ModelRelief>", Colors.BrightCyan)

        # build
        self.build()

        # publish
        if self.arguments.webpublish:
            self.webpublish()

        self.logger.logInformation("\n</ModelRelief>", Colors.BrightCyan)

def main():
    """
        Main entry point.
    """
    options_parser = argparse.ArgumentParser()
    options_parser.add_argument('--docker', '-d',
                                help='Build the Docker image.', type=ast.literal_eval, required=False, default=False)
    options_parser.add_argument('--initialize', '-i',
                                help='Initialize the database and the user store.', type=ast.literal_eval, required=False, default=True)
    options_parser.add_argument('--python', '-p',
                                help='Build the runtime Python virtual environment.', type=ast.literal_eval, required=False, default=True)
    options_parser.add_argument('--webpublish', '-w',
                                help='Publish the web site.', type=ast.literal_eval, required=False, default=False)
    arguments = options_parser.parse_args()

    builder = Builder(arguments)
    builder.run()

if __name__ == "__main__":
    main()  

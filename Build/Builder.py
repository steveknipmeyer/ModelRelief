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

class PublishTarget(Enum):
    iis = 'IIS'
    docker = 'Docker'

    def __str__(self):
        return self.value

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
        self.wwwroot = "wwwroot"
        self.modelrelief_folder = os.environ[EnvironmentNames.MR]
        self.solution_folder = os.environ[EnvironmentNames.MRSolution]
        self.source_wwwroot_folder = os.path.join(self.modelrelief_folder, self.wwwroot)
        self.publish_folder = os.environ[EnvironmentNames.MRPublish]
        self.publish_wwwroot_folder = os.path.join(self.publish_folder, self.wwwroot)

        self.build_folder = "Build"
        self.iis_deploy_folder = os.path.join("C:/", "modelrelief")
        self.logs_folder = "logs"
        self.solver_folder = "Solver"
        self.sqlserver_folder = os.path.join("store", "production", "database", "SQLServer")
        self.store_folder = "store"
        self.test_folder = "Test"
        self.tools_folder = "Tools"

        # files
        self.build_explorer = "BuildExplorerUI.bat"
        self.modelrelief_map = "modelrelief.js.map"
        self.settings_production = "appsettings.Production.json"
        self.settings_production_docker = "appsettings.ProductionDocker.json"
        self.settings_production_iis = "appsettings.ProductionIIS.json"
        self.web_config = "web.config"

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

        os.chdir(self.solution_folder)
        self.initialize(self.source_wwwroot_folder, self.publish_folder)

        # gulp (wwwroot)
        self.logger.logInformation("\nBuilding wwwroot", Colors.BrightMagenta)
        os.chdir(self.solution_folder)
        self.exec("gulp.cmd")

        # TypeScript
        self.logger.logInformation("\nTypeScript compilation", Colors.BrightMagenta)
        os.chdir(self.solution_folder)
        self.exec("tsc -p {}".format(self.modelrelief_folder))       

        # Explorer UI
        self.logger.logInformation("\nExplorer UI", Colors.BrightMagenta)
        os.chdir(self.solution_folder)
        self.exec(os.path.join(self.build_folder, self.build_explorer))

        # ASP.NET Core build
        self.logger.logInformation("\nASP.NET Core compilation", Colors.BrightMagenta)
        os.chdir(self.modelrelief_folder)
        self.exec("dotnet build")

        # database initialization and user store
        if self.arguments.initialize:
            self.logger.logInformation("\nInitialize database and user store", Colors.BrightMagenta)
            os.chdir(self.modelrelief_folder)
            # N.B. ASPNETCORE_ENVIRONMENT cannot be overridden as a 'dotnet run' command line argument.
            # So, override (and restore) the current settings.
            self.environment.push()          
            if self.arguments.webpublish:
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

        os.chdir(self.solution_folder)
        # ASP.NET Core Publish
        self.logger.logInformation("\nASP.NET Core Publish", Colors.BrightMagenta)
        os.chdir(self.modelrelief_folder)
        self.exec("dotnet publish -c Release -o {}".format(self.publish_folder))
        self.logger.logInformation("\nUpdating web.config", Colors.Cyan)
        Tools.copy_file(os.path.join(self.solution_folder, self.web_config), os.path.join(self.publish_folder, self.web_config))

        # Strip TypeScript source map
        self.logger.logInformation("\nRemoving TypeScript source map", Colors.BrightMagenta)
        source_map = os.path.join(self.publish_wwwroot_folder, "js", self.modelrelief_map)
        self.logger.logInformation(f"Deleting {source_map}", Colors.BrightWhite)
        os.remove(source_map)

        # Python virtual environment
        if self.arguments.python:
            self.logger.logInformation("\nPython virtual environment", Colors.BrightMagenta)
            os.chdir(self.publish_folder)
            self.exec("BuildPythonEnvironment Production")        

        # Python source
        self.logger.logInformation("\nPython source", Colors.BrightMagenta)
        os.chdir(self.solution_folder)
        Tools.copy_folder(os.path.join(self.solution_folder, self.solver_folder), os.path.join(self.publish_folder, self.solver_folder))
        Tools.copy_folder(os.path.join(self.solution_folder, self.tools_folder), os.path.join(self.publish_folder, self.tools_folder))

        # test models
        self.logger.logInformation("\nTest models", Colors.BrightMagenta)
        os.chdir(self.modelrelief_folder)
        Tools.copy_folder(os.path.join(self.modelrelief_folder, self.test_folder), os.path.join(self.publish_folder, self.test_folder))

        # create logs folder
        self.logger.logInformation("\nCreating logs folder", Colors.BrightMagenta)
        logs_folder = os.path.join(self.publish_folder, self.logs_folder)
        self.logger.logInformation(f"{logs_folder} created", Colors.BrightWhite)
        os.makedirs(logs_folder)

        # store
        self.logger.logInformation("\nCopying web store", Colors.BrightMagenta)
        os.chdir(self.modelrelief_folder)
        Tools.copy_folder(os.path.join(self.modelrelief_folder, self.store_folder), os.path.join(self.publish_folder, self.store_folder))

        # SQLServer seed database
        self.logger.logInformation("\nSQLServer database", Colors.BrightMagenta)
        os.chdir(self.solution_folder)
        sqlserver_files = ['ModelReliefProduction.mdf', 'ModelReliefProduction_log.ldf']
        for file in sqlserver_files:
            source = os.path.join(self.environment.sqlserver_folder, file)
            destination = os.path.join(self.publish_folder, self.sqlserver_folder, file)
            Tools.copy_file(source, destination)

        # IIS
        if self.arguments.target == PublishTarget.iis:
            self.logger.logInformation("\nIIS-specific deployment", Colors.BrightMagenta)
            self.logger.logInformation(f"\nUpdating {self.settings_production}", Colors.Cyan)
            Tools.copy_file(os.path.join(self.modelrelief_folder, self.settings_production_iis), os.path.join(self.publish_folder, self.settings_production))

            if self.arguments.deploy:
                self.logger.logInformation("\nDeploying to local IIS server", Colors.BrightMagenta)
                self.delete_folder(self.iis_deploy_folder, confirm=True)
                Tools.copy_folder(self.publish_folder, self.iis_deploy_folder)

        # Docker
        if self.arguments.target == PublishTarget.docker:
            self.logger.logInformation("\nDocker-specific deployment", Colors.BrightMagenta)
            self.logger.logInformation(f"\nUpdating {self.settings_production}", Colors.Cyan)
            Tools.copy_file(os.path.join(self.modelrelief_folder, self.settings_production_docker), os.path.join(self.publish_folder, self.settings_production))

            self.logger.logInformation("Docker ModelRelief image", Colors.Cyan)
            os.chdir(self.solution_folder)
            port = os.environ[EnvironmentNames.MRPort]
            self.exec(f"docker build -t modelrelief --build-arg MRPORT={port} -f Build\\DockerFile.modelrelief  .")        

            self.logger.logInformation("\nDocker ModelRelief Database image", Colors.Cyan)
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
    # Build
    options_parser.add_argument('--initialize', '-i',
                                help='Initialize the database and the user store.', type=ast.literal_eval, required=False, default=True)
    options_parser.add_argument('--python', '-p',
                                help='Build the runtime Python virtual environment.', type=ast.literal_eval, required=False, default=True)
    #Publish
    options_parser.add_argument('--webpublish', '-w',
                                help='Publish the web site.', type=ast.literal_eval, required=False, default=False)
    options_parser.add_argument('--deploy', '-d',
                                help='Deploy the published content to the local IIS web folder.', type=ast.literal_eval, required=False, default=False)
    options_parser.add_argument('--target', '-t',
                                help='Deployment target for the published web site.', type=PublishTarget, required=False, default=PublishTarget.iis)
    arguments = options_parser.parse_args()

    builder = Builder(arguments)
    builder.run()

if __name__ == "__main__":
    main()  

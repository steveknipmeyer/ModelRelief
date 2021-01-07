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
import shlex
import os
import pprint
import shutil
import subprocess
import sys
from enum import Enum

from environment import DatabaseProvider, EnvironmentNames, Environment, RuntimeEnvironment
from logger import Logger
from tools import Colors, Tools

class Target(Enum):
    """ Target runtime environments. """
    local = 'local'
    nginx = 'Nginx'

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
        self.publish = self.arguments.publish
        self.deploy = self.arguments.deploy

        # folder names
        self.wwwroot_folder = "wwwroot"
        self.build_folder = "Build"
        self.logs_folder = "logs"
        self.solver_folder = "Solver"
        self.store_folder = "store"
        self.test_folder = "Test"
        self.tools_folder = "Tools"

        # folder paths
        self.nginx_deploy_path = "/var/www/html"
        self.modelrelief_path = os.environ[EnvironmentNames.MR]
        self.publish_path = os.environ[EnvironmentNames.MRPublish]
        self.publish_wwwroot_path = os.path.join(self.publish_path, self.wwwroot_folder)
        self.solution_path = os.environ[EnvironmentNames.MRSolution]
        self.source_wwwroot_path = os.path.join(self.modelrelief_path, self.wwwroot_folder)
        self.source_store_path = os.path.join(self.modelrelief_path, self.store_folder)

        # files
        self.build_explorer = "BuildExplorerUI.sh"
        self.settings_production = "appsettings.Production.json"
        self.file_exclusions = [
            "wwwroot/js/modelrelief.js", "wwwroot/js/modelrelief.js.map", "wwwroot/js/shaders.js",
            "appsettings.Development.json",
            "tsconfig.json","js.config", "stylecop.json"
        ]

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

    def set_environment (self)->None :
        """
        ASPNETCORE_ENVIRONMENT cannot be overridden as a 'dotnet run' command line argument.
        So, the environment settings are overridden and then restored.
        """
        if self.publish:
            os.environ[EnvironmentNames.ASPNETCORE_ENVIRONMENT] = RuntimeEnvironment.production.value

        os.environ[EnvironmentNames.MRUpdateSeedData] = "False"
        os.environ[EnvironmentNames.MRInitializeDatabase] = "True"
        os.environ[EnvironmentNames.MRSeedDatabase] = "True"
        os.environ[EnvironmentNames.MRExitAfterInitialization] = "True"

        self.logger.logInformation("Build environment initialized; original popped at completion.", Colors.BrightCyan)
        self.environment.show(color=Colors.BrightWhite)

    def initialize (self, wwwroot: str, store: str, publish: str)->None :
        """
        Perform initialization including removing build targets.
        Parameters
        ----------
        wwwroot
            wwwroot output folder
        store
            web store folder
        publish
            publish output folder
        """
        self.set_environment()

        self.delete_folder(wwwroot)
        self.delete_folder(store)
        if self.publish:
            self.delete_folder(publish)

    def build (self):
        """
        Core build.
        """
        self.logger.logInformation("\n<Build>", Colors.BrightYellow)
        os.chdir(self.solution_path)

        # gulp (wwwroot)
        self.logger.logInformation("\nBuilding wwwroot", Colors.BrightMagenta)
        os.chdir(self.solution_path)
        Tools.exec("gulp")

        # TypeScript
        self.logger.logInformation("\nTypeScript compilation", Colors.BrightMagenta)
        os.chdir(self.solution_path)
        Tools.exec("npx tsc -p {}".format(self.modelrelief_path))

        self.logger.logInformation("\nTypeScript Circular Dependencies", Colors.BrightMagenta)
        os.chdir(self.solution_path)
        Tools.exec("madge --warning --circular --extensions ts ModelRelief/Scripts")

        # minification
        self.logger.logInformation("\nMinifying JavaScript", Colors.BrightMagenta)
        os.chdir(self.solution_path)
        Tools.exec("gulp compressJS")

        # Explorer UI
        self.logger.logInformation("\nExplorer UI", Colors.BrightMagenta)
        os.chdir(self.solution_path)
        Tools.exec(os.path.join(self.build_folder, self.build_explorer))

        # ASP.NET Core build
        self.logger.logInformation("\nASP.NET Core compilation", Colors.BrightMagenta)
        os.chdir(self.modelrelief_path)
        Tools.exec("dotnet build")

        # Python virtual environment
        if self.arguments.python:
            os.chdir(self.solution_path)
            if self.publish:
                self.logger.logInformation("\nPython virtual environment", Colors.BrightMagenta)
                os.makedirs(self.publish_path)
                Tools.exec(f"BuildPythonEnvironment.sh Production {os.path.join(self.publish_path, 'mrenv')}")
            else:
                if not os.path.exists("devenv"):
                    Tools.exec("BuildPythonEnvironment.sh Development devenv")

        # Python C++ extensions
        self.logger.logInformation("\nPython C++ extensions", Colors.BrightMagenta)
        environment = RuntimeEnvironment.production.value if self.publish else RuntimeEnvironment.development.value
        os.chdir(self.solution_path)
        Tools.exec(f"BuildReliefPythonExtensions.sh {environment}")

        # database initialization and user store
        if self.arguments.initialize:
            self.logger.logInformation("\nInitialize database and user store", Colors.BrightMagenta)
            os.chdir(self.modelrelief_path)
            Tools.exec("dotnet run --no-launch-profile")

        self.logger.logInformation("\n</Build>", Colors.BrightYellow)

    def publish_seed_database (self):
        """
        Publish seed database.
        """
        os.chdir(self.solution_path)
        database = os.environ[EnvironmentNames.MRDatabaseProvider]

        # SQLite
        if database == DatabaseProvider.sqlite.value:
            self.logger.logInformation("\nSQLite database", Colors.BrightMagenta)
            database_publish_path = self.environment.database_relative_path(DatabaseProvider.sqlite.value)
            database_files = ['ModelReliefProduction.db']
            database_path = self.environment.sqlite_path
        else:
            self.logger.logError("Invalid MRDatabaseProvider", Colors.Red)
            return

        for file in database_files:
            source = os.path.join(database_path, file)
            destination = os.path.join(self.publish_path, database_publish_path, file)
            Tools.copy_file(source, destination)

    def publish_site (self):
        """
        Publish web site.
        """
        self.logger.logInformation("\n<Publish>", Colors.BrightCyan)
        os.chdir(self.solution_path)

        # ASP.NET Core Publish
        self.logger.logInformation("\nASP.NET Core Publish", Colors.BrightMagenta)
        os.chdir(self.modelrelief_path)
        Tools.exec("dotnet publish -c Release -o {}".format(self.publish_path))

        # file exclusions
        self.logger.logInformation("\nRemoving source files that have been minified", Colors.BrightMagenta)
        for file in self.file_exclusions:
            file_path = os.path.join(self.publish_path, file)
            self.logger.logInformation(f"Deleting {file_path}", Colors.BrightWhite)
            os.remove(file_path)

        # Python source
        self.logger.logInformation("\nPython source", Colors.BrightMagenta)
        os.chdir(self.solution_path)
        Tools.copy_folder_root(os.path.join(self.solution_path, self.solver_folder), os.path.join(self.publish_path, self.solver_folder))
        Tools.copy_folder_root(os.path.join(self.solution_path, self.tools_folder), os.path.join(self.publish_path, self.tools_folder))

        # create logs folder
        self.logger.logInformation("\nCreating logs folder", Colors.BrightMagenta)
        logs_folder = os.path.join(self.publish_path, self.logs_folder)
        self.logger.logInformation(f"{logs_folder} created", Colors.BrightCyan)
        os.makedirs(logs_folder)

        # store
        self.logger.logInformation("\nCopying web store", Colors.BrightMagenta)
        os.chdir(self.modelrelief_path)
        Tools.copy_folder(os.path.join(self.modelrelief_path, self.store_folder), os.path.join(self.publish_path, self.store_folder))

        # Seed Database
        self.publish_seed_database()

        self.logger.logInformation("\n</Publish>", Colors.BrightYellow)

    def deploy_site (self):
        """
        Deploy web site.
        """
        self.logger.logInformation("\n<Deploy>", Colors.BrightCyan)
        os.chdir(self.solution_path)

        # Nginx
        if self.arguments.target == Target.nginx:
            self.logger.logInformation("\nDeploying to local Nginx server", Colors.BrightMagenta)
            self.delete_folder(self.nginx_deploy_path)
            Tools.copy_folder(self.publish_path, self.nginx_deploy_path)

        self.logger.logInformation("\n</Deploy>", Colors.BrightYellow)

    def run (self):
        """
        Sequence the build steps.
        """
        self.logger.logInformation("\n<ModelRelief>", Colors.BrightCyan)
        os.chdir(self.solution_path)
        self.environment.push()

        self.initialize(self.source_wwwroot_path, self.source_store_path, self.publish_path)

        # build
        self.build()

        # publish
        if self.publish:
            self.publish_site()

        # deploy
        if self.deploy:
            self.deploy_site()

        self.environment.pop()
        self.logger.logInformation("\n</ModelRelief>", Colors.BrightCyan)

def main():
    """
    Main entry point.
    """
    options_parser = argparse.ArgumentParser()

    # Target
    options_parser.add_argument('--target', '-t',
                                help='Runtime target for the build.', type=Target, required=False, default=Target.local)
    # Build
    options_parser.add_argument('--initialize', '-i',
                                help='Initialize the database and the user store.', type=ast.literal_eval, required=False, default=True)
    options_parser.add_argument('--python', '-P',
                                help='Build the runtime Python virtual environment.', type=ast.literal_eval, required=False, default=True)
    # Publish
    options_parser.add_argument('--publish', '-p',
                                help='Publish the deployable web site package in a local staging folder.', type=ast.literal_eval, required=False, default=False)
    # Deploy
    options_parser.add_argument('--deploy', '-d',
                                help='Deploy the web content to a local web server folder.', type=ast.literal_eval, required=False, default=False)

    arguments = options_parser.parse_args()

    builder = Builder(arguments)
    builder.run()

if __name__ == "__main__":
    main()
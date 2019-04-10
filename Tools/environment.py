#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Environment
   :synopsis: Manages the ModelRelief environment settings.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import json
import io
import os

from enum import Enum
from typing import Any, Callable, Dict, List, Optional

from tools import Colors, Tools

class EnvironmentNames:

    # folders
    MRSolution = "MRSolution"
    MR = "MR"
    MRPublish = "MRPublish"

    # intialization
    MRUpdateSeedData = "MRUpdateSeedData"
    MRInitializeDatabase = "MRInitializeDatabase"
    MRSeedDatabase = "MRSeedDatabase"

    MRExitAfterInitialization = "MRExitAfterInitialization"

    # runtime
    MRPort = "MRPort"
    MRPortSecure = "MRPortSecure"
    MRDatabaseProvider = "MRDatabaseProvider"
    ASPNETCORE_ENVIRONMENT = "ASPNETCORE_ENVIRONMENT"

class RuntimeEnvironment(Enum):
    """ ASPNETCORE_ENVIRONMENT """
    development = 'Development'
    test = 'Test'
    production = 'Production'

    def __str__(self):
        return self.value

class DatabaseProvider(Enum):
    """ Database providers. """
    sqlserver = 'SQLServer'
    sqlite = 'SQLite'

    def __str__(self):
        return self.value

class Environment:
    """
    ModelRelief folder locations and environment settings.
    """
    def __init__(self):
        self.values = {
            # folders
            EnvironmentNames.MRSolution : os.environ[EnvironmentNames.MRSolution],
            EnvironmentNames.MR : os.environ[EnvironmentNames.MR],
            EnvironmentNames.MRPublish : os.environ[EnvironmentNames.MRPublish],

            # intialization
            EnvironmentNames.MRUpdateSeedData : os.environ[EnvironmentNames.MRUpdateSeedData],
            EnvironmentNames.MRInitializeDatabase : os.environ[EnvironmentNames.MRInitializeDatabase],
            EnvironmentNames.MRSeedDatabase : os.environ[EnvironmentNames.MRSeedDatabase],
            EnvironmentNames.MRExitAfterInitialization : os.environ[EnvironmentNames.MRExitAfterInitialization],

            # runtime
            EnvironmentNames.MRPort : os.environ[EnvironmentNames.MRPort],
            EnvironmentNames.MRPortSecure : os.environ[EnvironmentNames.MRPortSecure],
            EnvironmentNames.MRDatabaseProvider : os.environ[EnvironmentNames.MRDatabaseProvider],
            EnvironmentNames.ASPNETCORE_ENVIRONMENT : os.environ[EnvironmentNames.ASPNETCORE_ENVIRONMENT],
        }

        self.stack:List[Dict] = []

        self.sqlite_path = os.path.join(os.environ[EnvironmentNames.MR], self.database_relative_path(DatabaseProvider.sqlite.value))
        self.sqlserver_path = os.environ["HOME"]

    def show (self, color=Colors.Magenta):
        """
        Displays the environment table.
        """
        print (color)
        for key, _ in self.values.items():
            print (f"{key} = {os.environ[key]}")
        print (Colors.Reset)

    def push(self):
        """
        Save the current environment.
        """
        state = {}
        for key, _ in self.values.items():
            state[key] = os.environ[key]

        self.stack.append(state)

    def pop(self):
        """
        Restore the original environment.
        """
        state = self.stack.pop()
        for key, value in state.items():
            os.environ[key] = value

    def database_relative_path(self, provider:str = None):
        """
        Returns the relative path (to ContentRootPath) of the database storage folder.
        Parameters
        ----------
        provider
            The database provider (SQLServer, SQLite)
        """
        provider = provider if provider else os.environ[EnvironmentNames.MRDatabaseProvider]

        appsettings_name = f"appsettings.{os.environ[EnvironmentNames.ASPNETCORE_ENVIRONMENT]}.json"
        appsettings_path = os.path.join(os.environ[EnvironmentNames.MR], appsettings_name)
        # https://stackoverflow.com/questions/13156395/python-load-json-file-with-utf-8-bom-header
        settings = json.load(io.open(appsettings_path, 'r', encoding='utf-8-sig'))

        paths = settings['Paths']
        database_path = os.path.join(paths['StoreDatabase'], provider)
        return database_path

    def test_stack(self):
        """
        Test the push/pop stack of environment states.
        """
        self.show(Colors.BrightCyan)
        self.push()

        for key, _ in self.values.items():
            os.environ[key] = Tools.id_generator()
        self.show()

        self.pop()
        self.show(Colors.BrightCyan)

def main():
    e = Environment()
    e.test_stack()

if __name__ == "__main__":
    main()

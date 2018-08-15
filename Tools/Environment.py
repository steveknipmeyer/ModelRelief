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

import os
import colorama

from enum import Enum
from typing import Any, Callable, Dict, List, Optional

from tools import Colors, Tools

class EnvironmentNames:

    # folders
    MRSolution = "MRSolution"
    MR = "MR"
    MRPublish = "MRPublish"

    # intialization
    MRExitAfterInitialization = "MRExitAfterInitialization"

    MRInitializeDatabase = "MRInitializeDatabase"
    MRSeedDatabase = "MRSeedDatabase"
    MRInitializeUserStore = "MRInitializeUserStore"

    # runtime
    MRPort = "MRPort"
    MRDatabaseProvider = "MRDatabaseProvider"
    ASPNETCORE_ENVIRONMENT = "ASPNETCORE_ENVIRONMENT"

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
            EnvironmentNames.MRExitAfterInitialization : os.environ[EnvironmentNames.MRExitAfterInitialization],

            EnvironmentNames.MRInitializeUserStore : os.environ[EnvironmentNames.MRInitializeUserStore],
            EnvironmentNames.MRInitializeDatabase : os.environ[EnvironmentNames.MRInitializeDatabase],
            EnvironmentNames.MRSeedDatabase : os.environ[EnvironmentNames.MRSeedDatabase],

            # runtime
            EnvironmentNames.MRPort : os.environ[EnvironmentNames.MRPort],
            EnvironmentNames.MRDatabaseProvider : os.environ[EnvironmentNames.MRDatabaseProvider],
            EnvironmentNames.ASPNETCORE_ENVIRONMENT : os.environ[EnvironmentNames.ASPNETCORE_ENVIRONMENT],
        }

        self.stack:List[Dict] = []

        self.tools_folder = os.path.join(os.environ[EnvironmentNames.MR], "Tools")
        self.sqlite_folder = os.path.join(os.environ[EnvironmentNames.MR], "DatabaseStore/SQLite")
        self.sqlserver_folder = os.environ["USERPROFILE"]

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
    colorama.init()
    e = Environment()
    e.test_stack()

if __name__ == "__main__":
    main()

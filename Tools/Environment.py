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
from enum import Enum
from typing import Any, Callable, Dict, List, Optional

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

            EnvironmentNames.MRInitializeDatabase : os.environ[EnvironmentNames.MRInitializeDatabase],
            EnvironmentNames.MRSeedDatabase : os.environ[EnvironmentNames.MRSeedDatabase],
            EnvironmentNames.MRInitializeUserStore : os.environ[EnvironmentNames.MRInitializeUserStore],

            # runtime
            EnvironmentNames.MRPort : os.environ[EnvironmentNames.MRPort],
            EnvironmentNames.MRDatabaseProvider : os.environ[EnvironmentNames.MRDatabaseProvider],
            EnvironmentNames.ASPNETCORE_ENVIRONMENT : os.environ[EnvironmentNames.ASPNETCORE_ENVIRONMENT],
        }

        self.stack:List[Dict] = []

        self.tools_folder = os.path.join(os.environ[EnvironmentNames.MR], "Tools")
        self.sqlite_folder = os.path.join(os.environ[EnvironmentNames.MR], "Database")
        self.sqlserver_folder = os.environ["USERPROFILE"]
        
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

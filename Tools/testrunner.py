#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: TestRunner
   :synopsis: Runs the unit test suite.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import subprocess
import sys
from enum import Enum

from baseline import BaseLine 
from environment import EnvironmentNames, Environment
from logger import Logger
from tools import Colors

class TestRunner:
    """
    Executes the available unit tests.
    """

    def __init__(self):
        """
        Performs initialization.
        """
        self.logger = Logger()
        self.environment:Environment = Environment()

    def initialize_database(self, database: str):
        """
        Initialize the database.

        Parameters
        ----------
        database
            The database provider (SQLServer | SQLite)
        """            
        self.logger.logInformation("\nBegin initialize database for {}".format(database), Colors.BrightYellow)

        subprocess.run ("dotnet run --no-launch-profile -p ModelRelief --MRExitAfterInitialization=True --MRInitializeUserStore=True --MRInitializeDatabase=True --MRSeedDatabase=True --MRDatabaseProvider={}".format(database))

        self.logger.logInformation("End initialize database for {}".format(database), Colors.BrightYellow)

    def create_baseline(self, database: str):
        """
        Create the unit test database baseline.

        Parameters
        ----------
        database
            The database provider (SQLServer | SQLite)
        """            
        baseline = BaseLine(self.logger, database)
        baseline.create_baseline_database()

    def execute_tests(self, database: str):
        """
        Execute the unit tests for the given database provider.

        Parameters
        ----------
        database
            The database provider (SQLServer | SQLite)
        """            
        self.logger.logInformation("\nBegin test execution for {}".format(database), Colors.BrightGreen)

        os.environ[EnvironmentNames.MRDatabaseProvider] = database
        subprocess.run ("dotnet test --results-directory Results --logger trx;LogFileName={}TestResults.trx ModelRelief.test".format(database))

        self.logger.logInformation("End test execution for {}".format(database), Colors.BrightGreen)

    def run (self):
        """
        For all databases:
            1) Initialize database and user store.
            2) Create clean unit test database.
            3) Execute unit tests.
        """
        self.logger.logInformation("\nTestRunner start", Colors.BrightCyan)

        # save environment
        self.environment.push()

        databases = ["SQLite", "SQLServer"]
        for database in databases:
            
            # initialize database and user store
            self.initialize_database(database)
            
            # execute unit tests
            self.execute_tests(database)  

        # restore environment
        self.environment.pop()

        self.logger.logInformation("\nTestRunner end", Colors.BrightCyan)

def main():
    """
        Main entry point.
    """
    # run from solution root
    root = os.environ[EnvironmentNames.MRSolution]
    os.chdir(root)

    testrunner = TestRunner()
    testrunner.run()

if __name__ == "__main__":
    print (sys.version)
    main()

#!/usr/bin/env python
"""

.. module:: TestRunner
   :synopsis: Runs the unit test suite.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>

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

    def initialize_database(self, database: str)-> bool:
        """
        Initialize the database.

        Parameters
        ----------
        database
            The database provider (SQLite | TBD)
        """
        self.logger.logInformation("\nBegin initialize database for {}".format(database), Colors.BrightYellow)
        status = subprocess.call (["dotnet", "run", "--no-launch-profile", "-p", "ModelRelief", "--MRExitAfterInitialization=True", "--MRUpdateSeedData=False", "--MRInitializeDatabase=True", "--MRSeedDatabase=True", "--MRDatabaseProvider={}".format(database)])
        self.logger.logInformation("End initialize database for {}".format(database), Colors.BrightYellow)

        return status == 0

    def create_baseline(self, database: str):
        """
        Create the unit test database baseline.

        Parameters
        ----------
        database
            The database provider (SQLite | TBD)
        """
        baseline = BaseLine(self.logger, database)
        baseline.create_baseline_database()

    def execute_database_tests(self, database: str):
        """
        Execute the unit tests for the given database provider.

        Parameters
        ----------
        database
            The database provider (SQLite | TBD)
        """
        self.logger.logInformation("\nBegin test execution for {}".format(database), Colors.BrightGreen)

        os.environ[EnvironmentNames.MRDatabaseProvider] = database
        subprocess.call (["dotnet", "test", "--results-directory", "ModelRelief.Test/TestResults", "--logger", "trx;LogFileName={}TestResults.trx".format(database), "ModelRelief.Test"])

        self.logger.logInformation("End test execution for {}".format(database), Colors.BrightGreen)

    def execute_relief_tests(self ):
        """
        Execute the Relief C++ extension unit tests.
        """
        self.logger.logInformation("\nBegin Relief C++ extension tests", Colors.BrightGreen)

        relief_executable = os.path.join (os.environ[EnvironmentNames.MRSolution], "Relief/tests/bin/reliefUnitTests")
        print (relief_executable)
        subprocess.run (relief_executable)

        self.logger.logInformation("End Relief C++ extension tests.", Colors.BrightGreen)

    def run (self):
        """
        For all databases:
            1) Initialize database and user store.
            2) Create clean unit test database.
            3) Execute unit tests.
        """
        os.system('clear')
        self.logger.logInformation("\nTestRunner start", Colors.BrightCyan)

        # save environment
        self.environment.push()

        # database
        databases = ["SQLite"]
        for database in databases:

            # initialize database and user store
            if not self.initialize_database(database):
                return

            # unit tests
            self.execute_database_tests(database)

        # Relief C++ extension
        self.execute_relief_tests()

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

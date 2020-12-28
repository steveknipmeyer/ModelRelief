#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Baseline
   :synopsis: Creates the baseline database for integration testing.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import time

from environment import Environment
from logger import Logger
from tools import Colors, Tools

class BaseLine:
    """
    Copies the test database to create the baseline database used for integration testing.
    """

    def __init__(self, logger: Logger, database: str) ->None :
        """
        Performs initialization.
        Parameters
        ----------
        logger
            Logger instance.
        database
            Database provider.
        """
        self.logger = logger
        self.database = database
        self.environment = Environment()

    def show_folder_locations (self):
        """
        Displays the resolved values of key folders.
        """
        print (Colors.Magenta)
        print("SQLite path = %s" % self.environment.sqlite_path)
        print (Colors.Reset)

    def create_baseline_database (self):
        """
            Creates the baseline test database by copying the primary test database.
        """
        self.logger.logInformation ("\nCreating baseline for %s." % self.database, Colors.BrightBlue)

        self.show_folder_locations()

        if self.database == "SQLite":
            database_folder = self.environment.sqlite_path
            file_list = [
                ("ModelReliefDevelopment.db", "ModelReliefBaseline.db")
            ]
        else:
            self.logger.logError("invalid database: %s" % self.database)
            return

        for file_pair in file_list:
            source_file = os.path.join(database_folder, file_pair[0])
            destination_file = os.path.join(database_folder, file_pair[1])
            try:
                Tools.copy_file(source_file, destination_file)
            except IOError as ex:
                self.logger.logError("Error copying {} to {}: {}".format(source_file, destination_file, ex))

        self.logger.logInformation ("Baseline created for %s." % self.database, Colors.BrightBlue)

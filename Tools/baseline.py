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

    def __init__(self, logger: Logger, database: str):
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
        self._database = database
        return

    @property
    def database(self):
        """
        Gets the type of the active database.
        """
        return self._database

    def show_folder_locations (self):
        """
            Displays the resolved values of key folders.
        """
        print (Colors.Magenta)
        print("sqliteFolder = %s" % Environment.sqliteFolder)
        print("sqlserverFolder = %s" % Environment.sqlserverFolder)
        print (Colors.Reset)

    def create_baseline_database (self): 
        """
            Creates the baseline test database by copying the primary test database.
        """

        if self.database == "SQLite":
            database_folder = Environment.sqliteFolder
            file_list = [
                ("ModelReliefTest.db", "ModelReliefBaseline.db")
            ]
        elif self.database == "SQLServer":
            database_folder = Environment.sqlserverFolder
            file_list = [
                ("ModelReliefTest.mdf",     "ModelReliefBaseline.mdf"),
                ("ModelReliefTest_log.ldf", "ModelReliefBaseline_log.ldf")
            ]
            time.sleep(5)
        else:
            self.logger.logError("invalid database: %s" % self.database)
            return

        self.logger.logInformation ("Creating baseline for %s." % self.database, Colors.Red)

        for file_pair in file_list:
            source_file = os.path.join(database_folder, file_pair[0])
            destination_file = os.path.join(database_folder, file_pair[1])
            try:
                Tools.copy_file(source_file, destination_file)
            except IOError as ex:
                self.logger.logError("Error copying {} to {}: {}".format(source_file, destination_file, ex))

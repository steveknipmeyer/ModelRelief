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
import sys
import math

from Environment import Environment
from Tools import Colors, Tools

class Baseline:

    def __init__(self, database): 
        _potato = 'SLK'
        self._database = database
        return

    @property
    def database(self):
        return self._database

    def showFolderLocations (self):
        """
            Displays the resolved values of key folders.
        """
        print (Colors.Magenta)
        print("sqliteFolder = %s" % Environment.sqliteFolder)
        print("sqlserverFolder = %s" % Environment.sqlserverFolder)
        print (Colors.Reset)

    def createBaselineDatabase (self):
        """
            Creates the baseline test database by copying the primary test database.
        """ 

        if (self.database == "SQLite"):
            databaseFolder = Environment.sqliteFolder
            fileList = [
                ("ModelReliefTest.db", "ModelReliefBaseline.db")
            ]
        elif (self.database == "SQLServer"):
            databaseFolder = Environment.sqlserverFolder
            fileList = [
                ("ModelReliefTest.mdf",     "ModelReliefBaseline.mdf"),
                ("ModelReliefTest_log.ldf", "ModelReliefBaseline_log.ldf")
            ]
        else:
            print (Colors.Red, "invalid database: %s" % self.database)
            return

        print ("Creating baseline for %s." % self.database)        
        for filePair in fileList:
            sourceFile = os.path.join(databaseFolder, filePair[0])
            destinationFile = os.path.join(databaseFolder, filePair[1])
            Tools.copyFile(sourceFile, destinationFile)
    
if __name__ == "__main__":
    
    print (sys.version)

    database = os.environ["ModelReliefDatabase"] if (len(sys.argv) <= 1) else sys.argv[1]
    baseline = Baseline(database)

    baseline.showFolderLocations()
    baseline.createBaselineDatabase()

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

from shutil import copyfile

class Baseline:

    toolsFolder   = os.path.dirname(os.path.realpath(__file__))
    solutionRoot    = os.path.abspath(os.path.join(toolsFolder, os.pardir))
    modelReliefRoot = os.path.join(solutionRoot, "ModelRelief")

    sqliteFolder    = os.path.join(modelReliefRoot, "Database")
    sqlserverFolder = os.environ["USERPROFILE"]

    def __init__(self): 
        
        return

    def showFolderLocations (self):
        """
            Displays the resolved values of key folders.
        """

        #print("solutionRoot = %s" % Baseline.solutionRoot)
        #print("modelReliefRoot = %s" % Baseline.modelReliefRoot)

        print("sqliteFolder = %s" % Baseline.sqliteFolder)
        print("sqlserverFolder = %s\n" % Baseline.sqlserverFolder)

    def copyDatabaseFile (self, sourceFile, destinationFile):
        """
            Copy a single file. The destination is overwritten if it exists.
        """ 

        # copyfile does not overwrite...
        if os.path.isfile(destinationFile):
            os.remove(destinationFile)    

        print ("%s -> %s" % (sourceFile, destinationFile))
        copyfile(sourceFile, destinationFile)

    def createBaselineDatabase (self):
        """
            Creates the baseline test database by copying the primary test database.
        """ 
        database = os.environ["ModelReliefDatabase"]

        if (database == "SQLite"):
            databaseFolder = Baseline.sqliteFolder
            fileList = [
                ("ModelReliefTest.db", "ModelReliefBaseline.db")
            ]
        else:
            databaseFolder = Baseline.sqlserverFolder
            fileList = [
                ("ModelReliefTest.mdf",     "ModelReliefBaseline.mdf"),
                ("ModelReliefTest_log.ldf", "ModelReliefBaseline_log.ldf")
            ]
        
        print ("The active database is %s." % database)        
        for filePair in fileList:
            sourceFile = os.path.join(databaseFolder, filePair[0])
            destinationFile = os.path.join(databaseFolder, filePair[1])
            self.copyDatabaseFile(sourceFile, destinationFile)

    def recurseFolder(self, folder):
        """
            Recurse a folder and process each file.
        """
        rootdir = folder
        for root, subfolders, files in os.walk(rootdir):
            currentFolder = os.path.basename(root)

            for file in files:
                fileName, fileExtension = os.path.splitext(file)

                if (fileExtension.lower() == ".obj"):
                    modelPath = os.path.join(root, file)
                    print (modelPath)

if __name__ == "__main__":

    print (sys.version)

    baseline = Baseline()
    baseline.showFolderLocations()
    baseline.createBaselineDatabase()

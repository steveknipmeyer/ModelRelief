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

    solutionRoot = os.path.normpath(r"D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief")
    modelReliefRoot = os.path.join(solutionRoot, os.path.normpath("ModelRelief"))
    wwwwRoot = os.path.join(modelReliefRoot, os.path.normpath("wwwroot"))
    store = os.path.join(wwwwRoot, os.path.normpath("store"))

    def __init__(self): 
        
        return

    @property
    def scene(self):
        """
            Returns the active scene.
        """

        return modo.scene.current()
        
    def imageMapName(self, imageMapPrefix, imageMapResolution):
        """
            Constructs the name of an Image map given the root prefix and resolution.
        """

        name = "%s%s" % (imageMapPrefix, str(imageMapResolution))
        return name

    def getTargetImageRelativeFolder (self, modelPath):
        """
            Constructs the relative output folder of a model image.
        """
        # https://metarabbit.wordpress.com/2013/09/25/removing-a-string-prefix-in-python/
        modelFolder  = os.path.dirname(modelPath)

        # up one level
        modelFolder = modelFolder[:-len(os.path.normpath("\Rhino"))]

        # strip common root + trailing slash
        relativePath = modelFolder[len(Baseline.bandElementsRoot) + 1:]

        return relativePath

    def copyImage (self, relativePath, model, imageName):
        """
            Copy a single image to the export folder.
        """

        # create complete target path
        targetFolder = os.path.join(Baseline.exportRoot, relativePath)
        if not os.path.exists(targetFolder):
            os.makedirs(targetFolder)

        source = os.path.join(Baseline.bakeFactoryRoot, imageName)
        target = os.path.join(targetFolder, model + imageName)

        # copyfile does not overwrite...
        if os.path.isfile(target):
            os.remove(target)    

        copyfile(source, target)

    def copyImages (self, relativePath, model):
        """
            Copy all images to the export folder.
        """
        self.copyImage (relativePath, model, self.normalMapFileName)
        self.copyImage (relativePath, model, self.displacementlMapFileName)
        self.copyImage (relativePath, model, self.renderFileName)

    def walkModels(self):
        """
            Recurse the project folder and process each model.
        """
        rootdir = Baseline.store
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
    baseline.walkModels();
    input("Press Enter to continue...")
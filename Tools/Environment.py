#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Environment
   :synopsis: Defines common project folder locations.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

import os

class Environment:
    """
    Definitions of project folders.
    """

    toolsFolder     = os.path.dirname(os.path.realpath(__file__))
    solutionRoot    = os.path.abspath(os.path.join(toolsFolder, os.pardir))
    modelReliefRoot = os.path.join(solutionRoot, "ModelRelief")

    sqliteFolder    = os.path.join(modelReliefRoot, "Database")
    sqlserverFolder = os.environ["USERPROFILE"]

    def __init__(self):
        pass

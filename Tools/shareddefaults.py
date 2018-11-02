#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: shareddefaults
   :synopsis: Generates source code for default settings shared between C# and TypeScript.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import argparse
import ast
import json
import os
import subprocess
import sys
from enum import Enum

from environment import EnvironmentNames, Environment
from logger import Logger
from tools import Colors

class SettingsGroup:
    """
    A group of shared settings that are used in the backend and the front end.
    """
    def __init__(self, name, json_file, backend_file, frontend_file):
        """
        Performs initialization.
        Parameters
        ---------
        name
            Name of the settings group.
        json_file
            The JSON definitions.
        backend_file
            C# output file.
        frontend_file
            TypeScript output file.
        """

        self.name = name
        self.json = os.path.join(os.environ[EnvironmentNames.MRSolution], json_file)
        self.backend = os.path.join(os.environ[EnvironmentNames.MRSolution], backend_file)
        self.frontend = os.path.join(os.environ[EnvironmentNames.MRSolution], frontend_file)

class SharedDefaults:
    """
    Generates source code for default settings shared between C# and TypeScript.
    """

    def __init__(self, arguments):
        """
        Performs initialization.
        """
        self.logger = Logger()
        self.environment:Environment = Environment()

        self.settings_groups = [
            SettingsGroup("Camera", "ModelRelief/Settings/CameraSettings.json", "ModelRelief/Domain/CameraSettings.cs", "ModelRelief/Scripts/Models/Camera/CameraSettings.ts")
        ]

    def process_group(self, group: SettingsGroup)->None:
        """
        Process a settings group.
        Parameters
        ----------
        group
            SettingsGroup to process.
        """
        self.logger.logInformation(f"group = {group.name}", Colors.BrightMagenta)
        with open(group.json) as json_file:
            settings = json.load(json_file)

    def run (self):
        """
        For each settings group:
            1) Read the definitions in the JSON file.
            2) Write the backend (C#) settings file.
            3) Write the frontend (TypeScript) settings file.
        """
        self.logger.logInformation("\nSharedDefaults", Colors.BrightCyan)
        for group in self.settings_groups:
            self.process_group (group)

def main():
    """
    Main entry point.
    """
    # run from solution root
    root = os.environ[EnvironmentNames.MRSolution]
    os.chdir(root)

    options_parser = argparse.ArgumentParser()
    arguments = options_parser.parse_args()

    defaults = SharedDefaults(arguments)
    defaults.run()

if __name__ == "__main__":
    main()

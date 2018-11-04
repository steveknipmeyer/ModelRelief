#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""
.. module:: UpdateSeedDatabase
   :synopsis: Update the JSON

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import argparse
import ast
import json
import os
import subprocess
import sys
from enum import Enum
from typing import List

from environment import EnvironmentNames, Environment
from logger import Logger
from tools import Colors, Tools

class UpdateSeedDatabase:
    """
    Update the JSON and relief files (Mesh, DepthBuffer) used to create the initial test database.
    The Working folder contents are scanned to <incrementally> update the files.
    """

    def __init__(self, arguments):
        """
        Performs initialization.
        """
        self.logger = Logger()
        self.environment:Environment = Environment()

        self.tools = Tools()
        self.meshes: List[dict] = []

        # folders
        self.project_path = os.path.normpath(os.environ[EnvironmentNames.MR])
        self.store_test_path = os.path.normpath(os.path.join(self.project_path, "store/test/users/7ab4676b-563b-4c42-b6f9-27c11208f33f"))
        self.working_path = os.path.join(self.store_test_path, "working")
        self.test_json_path = os.path.normpath(os.path.join(self.project_path, "Test/Data/JSON"))

    def get_modified_meshes(self)->List[dict]:
        """
        Scan the working folder and construct a list of modified Mesh models.
        """
        self.logger.logInformation (f"store/test = {self.store_test_path}", Colors.BrightMagenta)
        self.logger.logInformation (f"working = {self.working_path}", Colors.BrightMagenta)
        self.logger.logInformation (f"Test/JSON = {self.test_json_path}", Colors.BrightMagenta)

        meshes: List[dict] = []
        def find_json(file: str)->None:
            """
            Callback used to identify the JSON files in the working folder.
            Parameters
            ----------
            file
                Absolute path of file.
            """
            json_extensions = {".JSON", ".json"}

            _, file_extension = os.path.splitext(file)
            if file_extension in json_extensions:
                mesh_json: dict = {}
                with open(file) as json_file:
                    mesh_json = json.load(json_file)
                meshes.append(mesh_json)

        self.tools.recurse_folder(self.working_path, [], find_json)
        return meshes

    def write_json(self, json_object: dict, root_name: str):
        """
        Writes a JSON file.
        Parameters
        ----------
        json_object
            JSON object extracted from Mesh JSON.
        root_name
            Root name of JSON (e.g. "Camera")
        """

        object_id = json_object["Id"]
        file = f"{root_name}{object_id}.json"
        file_path = os.path.join(self.test_json_path, file)
        with open(file_path, 'w') as outfile:
            json.dump(json_object, outfile, indent=4, sort_keys=True)

    def write_camera_json_files(self):
        """
        Extract the DepthBuffer Camera models from the Mesh JSON.
        Write to separate JSON files.
        """
        for mesh in self.meshes:
            depthbuffer: dict = mesh["DepthBuffer"]
            camera = depthbuffer["Camera"]
            self.write_json(camera, "Camera")

    def write_meshtransform_json_files(self):
        """
        Extract the MeshTransform models from the Mesh JSON.
        Write to separate JSON files.
        """
        for mesh in self.meshes:
            meshtransform: dict = mesh["MeshTransform"]
            self.write_json(meshtransform, "MeshTransform" )

    def run (self)->None:
        """
        Process the modified models in the working folder.
        """
        # determine changed Mesh models
        self.meshes = self.get_modified_meshes()

        for mesh in self.meshes:
            mesh_name = mesh["Name"]
            self.logger.logInformation (f"{mesh_name}", Colors.BrightYellow)

            # write Camera JSON
            self.write_camera_json_files()

            # write MeshTransform JSON
            self.write_meshtransform_json_files()

def main():
    """
    Main entry point.
    """
    # run from solution root
    root = os.environ[EnvironmentNames.MRSolution]
    os.chdir(root)

    options_parser = argparse.ArgumentParser()
    arguments = options_parser.parse_args()

    defaults = UpdateSeedDatabase(arguments)
    defaults.run()

if __name__ == "__main__":
    main()

#!/usr/bin/env python
#
#   Copyright (c) 2021
#   All Rights Reserved.
#

"""
.. module:: generate
   :synopsis: Tool for automatically generating all example Meshes.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>

"""
import argparse
import json
import os
import requests

from typing import List, TypedDict

from enum import Enum
from pathlib import Path

class Mesh(TypedDict):

    id: int
    name: str
    fileIsSynchronized: bool

MeshList = List[Mesh]

class MeshQuery(TypedDict):

    results: MeshList

class Generator:
    """
    Generates all sample Meshes.
    """
    meshes_endpoint = "https://localhost:5001/api/v1/meshes"
    # The Bearer token is generated in PostMan using the Tokens/Password Grant request.
    headers = {
        "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik4wRXdNa1pFUWpBeFF6Y3pOVE5FT1VSRE9VUkJNMEUzTXpZMU5qQTFPVGhFTmpBMU1FTTNOdyJ9.eyJpc3MiOiJodHRwczovL21vZGVscmVsaWVmLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1YmVkYWI1OGFhMjM3ZTA3ODYwMDUzMGIiLCJhdWQiOiJodHRwczovL21vZGVscmVsaWVmL2FwaSIsImlhdCI6MTYxOTA4NTc3MSwiZXhwIjoxNjE5MTcyMTcxLCJhenAiOiJ1emNVVG9NTlduSGI5NFR6S0pSb1JIQTdXcHZTaUpzViIsImd0eSI6InBhc3N3b3JkIn0.VDjVmxmDsHKYVY6MIaBYtEfW5T09tHcNgXsuYEJNB2meGASeS_nZ5bKFwJKaa8l7DIYqP9SJmn0Hok7Irl7CD6hsktUTIsLh_DByT1bKlZlAxBSXzPohR7bJ_X0QNF1mhUa1xK9ChRok7_afdU6VjtybA6ZN2iqZjIEMsllPL3w_dxfyC8WJW8qlCgDwcAicIzQ8ZYssBiD8TSSDY4IfErGQUNGm6-7DQ1Mt2jZRzxsB_1krHHYKdNYKDU-0ueLYE_0MG4oxDshTFnwRF_N1BJEFwSk2jOdxQwxLTjhYShRFuCyxIDSt3hI41EQ9W5HEdbVW48j8Q3bfuMCvGojaSQ",
        "Content-Type": "application/json"
        }

    def __init__(self, arguments):
        """
        Performs initialization.
        """
        self.arguments = arguments

    def query_meshes(self)-> MeshQuery:
        """
        Return the collection of all Mesh objects.
        """
        meshes = requests.get(self.meshes_endpoint, headers=self.headers, verify=False).json()
        return meshes

    def display_meshes(self, meshes: MeshList)-> None:
        """
        Display a Mesh collection.
        """
        for mesh in meshes:
            print (f"{mesh['name']}: fileIsSynchronized = {mesh['fileIsSynchronized']}")

    def patch_mesh(self, mesh: Mesh)->None:
        """
        Patch a Mesh.
        """
        patch_endpoint = f"{self.meshes_endpoint}/{mesh['id']}"
        response = requests.patch( patch_endpoint, data=json.dumps(mesh), headers=self.headers, verify=False)
        pass

    def generate_mesh(self, mesh: Mesh)-> None:
        """
        Trigger generation of a Mesh.
        """
        modified_mesh = Mesh()
        modified_mesh["id"] = mesh["id"]

        modified_mesh["FileIsSynchronized"] = False
        self.patch_mesh(modified_mesh)

        modified_mesh["FileIsSynchronized"] = True
        self.patch_mesh(modified_mesh)

    def generate_meshes(self)-> None:
        """
        Trigger generation of all Meshes.
        """
        meshes = self.query_meshes()["results"]
        self.display_meshes(meshes)
        for mesh in meshes:
            self.generate_mesh(mesh)

        self.display_meshes(meshes)

def main():
    """
    Main entry point.
    """
    os.chdir(os.path.dirname(__file__))

    # command line options
    options_parser = argparse.ArgumentParser()
    arguments = options_parser.parse_args()

    generator = Generator(arguments)
    generator.generate_meshes()

if __name__ == '__main__':
    main()



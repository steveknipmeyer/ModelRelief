#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: LineCount
   :synopsis: Counts lines of source by language type.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import sys
from enum import Enum

from environment import EnvironmentNames, Environment
from logger import Logger
from tools import Colors, Tools

class LineCount:
    """
    Counts lines of source by language type.
    """

    def __init__(self):
        """
        Performs initialization.
        """
        self.logger = Logger()
        self.environment:Environment = Environment()

    def run (self):
        """
        """
        self.logger.logInformation("<LineCount>\n", Colors.BrightCyan)

        root = os.getcwd()

        excluded_folders = {"bin", "devenv", ".git", "mrenv", "node_modules", "obj", "Publish", "store", "Test", "typings", ".vscode", "wwwroot"}
        source_extensions = {".cs", ".cpp", ".ts", ".py"}
        counts = dict()
        tools = Tools()

        def count_lines(file: str)->int:
            """
            Counts the number of lines in a file.
            Parameters
            ----------
            file
                Absolute path of file.
            """
            index = 0
            with open(file) as f:
                for index, _ in enumerate(f):
                    pass
            return index + 1

        def process_file(file: str)->None:
            """
            Processes a given file.
            Parameters
            ----------
            file
                Absolute path of file.
            """
            _, file_extension = os.path.splitext(file)
            if file_extension in source_extensions:
                print (f"{file}")
                lines = count_lines(file)
                if file_extension in counts:
                    counts[file_extension] += lines
                else:
                    counts[file_extension] = lines

        tools.recurse_folder(root, excluded_folders, process_file)

        total_lines = 0
        for key, value in counts.items():
            self.logger.logInformation(f"{key} = {value}", Colors.BrightMagenta)
            total_lines = total_lines + value
        self.logger.logInformation(f"Total lines = {total_lines}", Colors.BrightYellow)

        self.logger.logInformation("\n</LineCount>", Colors.BrightCyan)

def main():
    """
    Main entry point.
    """
    linecount = LineCount()
    linecount.run()

if __name__ == "__main__":
    main()

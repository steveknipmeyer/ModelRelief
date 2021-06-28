#!/usr/bin/env python
"""
.. module:: Tools
   :synopsis: Utilities and tools for scripting support.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>

"""
import os
import subprocess
import sys
import string
import random
import numpy as np

from typing import Any, Callable, Dict, List, Optional, Set

# N.B. copytree requires the target directory be empty. It always creates the target.
# copy_tree works with an existing directory.
from distutils.dir_util import copy_tree
from shutil import copyfile, copytree

class Colors:
    """
    Provides ANSI constants for colored text in console output.
    """

    # https://stackoverflow.com/questions/287871/print-in-terminal-with-colors/3332860#3332860
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

    def print_format_table(self):
        """
        prints table of formatted text format options
        """
        for style_group in range(8):
            for foreground in range(30,38):
                style = ''
                for background in range(40,48):
                    style_format = ';'.join([str(style_group), str(foreground), str(background)])
                    style += '\x1b[%sm %s \x1b[0m' % (style_format, style_format)
                print(style)
            print('\n')

    # http://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html
    Black =   '\u001b[30m'
    Red =     '\u001b[31m'
    Green =   '\u001b[32m'
    Yellow =  '\u001b[33m'
    Blue =    '\u001b[34m'
    Magenta = '\u001b[35m'
    Cyan =    '\u001b[36m'
    White =   '\u001b[37m'
    Reset =   '\u001b[0m'

    BrightBlack =   '\u001b[30;1m'
    BrightRed =     '\u001b[31;1m'
    BrightGreen =   '\u001b[32;1m'
    BrightYellow =  '\u001b[33;1m'
    BrightBlue =    '\u001b[34;1m'
    BrightMagenta = '\u001b[35;1m'
    BrightCyan =    '\u001b[36;1m'
    BrightWhite =   '\u001b[37;1m'
    Reset =         '\u001b[0m'

    def print_ansi16_colors(self):
        """
            Print the color styles based on Ansi 16 color mode.
        """
        print (Colors.Black, 'Black', Colors.Reset)
        print (Colors.Red, 'Red', Colors.Reset)
        print (Colors.Green, 'Green', Colors.Reset)
        print (Colors.Yellow, 'Yellow', Colors.Reset)
        print (Colors.Blue, 'Blue', Colors.Reset)
        print (Colors.Magenta, 'Magenta', Colors.Reset)
        print (Colors.Cyan, 'Cyan', Colors.Reset)
        print (Colors.White, 'White', Colors.Reset)
        print (Colors.BrightBlack, 'BrightBlack', Colors.Reset)
        print (Colors.BrightRed, 'BrightRed', Colors.Reset)
        print (Colors.BrightGreen, 'BrightGreen', Colors.Reset)
        print (Colors.BrightYellow, 'BrightYellow', Colors.Reset)
        print (Colors.BrightBlue, 'BrightBlue', Colors.Reset)
        print (Colors.BrightMagenta, 'BrightMagenta', Colors.Reset)
        print (Colors.BrightCyan, 'BrightCyan', Colors.Reset)
        print (Colors.BrightWhite, 'BrightWhite', Colors.Reset)

    def print_ansi256_colors(self):
        """
            Print the color styles based on Ansi 256 color mode.
        """
        for i in range(0, 16):
            for j in range(0, 16):
                code = str(i * 16 + j)
                sys.stdout.write(u"\u001b[38;5;" + code + "m " + code.ljust(4))
            print (u"\u001b[0m")

class Tools:
    """
    General support for Python tools.
    """

    def __init__(self) -> None:
        """
            Perform class initialization.
        """

    @staticmethod
    def copy_file (source_file, destination_file):
        """
        Copy a single file. The destination is overwritten if it exists.
        """
        # create destination folder if necessary
        folder = os.path.dirname(destination_file)
        if not os.path.exists(folder):
            os.makedirs(folder)

        # copyfile does not overwrite...
        if os.path.isfile(destination_file):
            os.remove(destination_file)

        print ("%s -> %s" % (source_file, destination_file))
        copyfile(source_file, destination_file)

    @staticmethod
    def copy_folder (source_folder, destination_folder):
        """
        Copy a folder. Recursive.
        """
        print ("%s -> %s" % (source_folder, destination_folder))
        copy_tree(source_folder, destination_folder)

    @staticmethod
    def copy_folder_root (source_folder, destination_folder):
        """
        Copy a folder. Not Recursive.
        """
        print ("%s -> %s" % (source_folder, destination_folder))
        command = f"mkdir -p {destination_folder} && cp {source_folder}/* {destination_folder} >/dev/null 2>&1"
        Tools.exec(command)

    @staticmethod
    def delete_files(files: List[str])->None:
        """ Deletes a list of files. Checks for existence.
        """
        for file in files:
            if os.path.isfile(file):
                os.remove(file)

    def recurse_folder(self, folder: str, excluded_folders: Set[str], process_file: Callable[[str], None])->None:
        """
        Recurse a folder and process each file.
        Parameters
        ----------
        folder
            Base directory.
        excluded_folders
            Set of folders to exclude from processing.
        process_file
            Callback to process a file.
        """
        for dirpath, dirnames, filenames in os.walk(folder, topdown=True):
            dirnames[:] = [d for d in dirnames if d not in excluded_folders]

            for file in filenames:
                process_file(os.path.join(dirpath, file))

    @staticmethod
    def confirm(answer: str)-> bool:
        """
        Prompt the user for confirmation.
        Parameters
        ----------
        answer
            The question for confirmation.
        """
        yes = set(['yes', 'ye', 'y'])
        no  = set(['no','n', ''])

        while True:
            choice = input(answer).lower()
            if choice in yes:
                return True
            elif choice in no:
                return False
            else:
                print ("Please respond with 'yes' or 'no'\n")

    @staticmethod
    def is_production():
        """
        Returns whether the current environment is Production.
        """
        if not "ASPNETCORE_ENVIRONMENT" in os.environ:
            return True

        if os.environ['ASPNETCORE_ENVIRONMENT'] == 'Production':
            return True

        return False

    @staticmethod
    def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
        """
        Generate a random string.
        https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits-in-python
        """
        return ''.join(random.choice(chars) for _ in range(size))

    @staticmethod
    def exec (command_line:str)-> int:
        """
        Execute a shell tool.
        Parameters
        ----------
        command_line
            The command line to execute.
        """
        status:subprocess.CompletedProcess = subprocess.run (command_line, shell=True)
        return status.returncode

    @staticmethod
    def MSE(image1: np.ndarray, image2: np.ndarray)-> float:
        """
        Calculates the Mean Squared Error between two NumPy images.
        Parameters
        ----------
        image1
            First image.
        image2
            Second image.
        Returns
        -------
        Mean squared error between the two images.
        """
        squared_difference = (image1 - image2) ** 2
        summed = np.sum(squared_difference)
        pixels = image1.shape[0] * image1.shape[1]
        error = summed / pixels

        precision = 8
        error = round(error, precision)

        return error

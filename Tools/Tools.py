#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Tools
   :synopsis: Utilities and tools for scripting support.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

import os
import sys
import string
import random

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
        pass

    @staticmethod
    def copy_file (source_file, destination_file):
        """
            Copy a single file. The destination is overwritten if it exists.
        """

        # copyfile does not overwrite...
        if os.path.isfile(destination_file):
            os.remove(destination_file)

        print ("%s -> %s" % (source_file, destination_file))
        copyfile(source_file, destination_file)

    @staticmethod
    def copy_folder (source_folder, destination_folder):
        """
            Copy a single folder. Not recursive.
        """

        print ("%s -> %s" % (source_folder, destination_folder))
        copytree(source_folder, destination_folder)

    def recurse_folder(self, folder):
        """
            Recurse a folder and process each file.
        """
        rootdir = folder
        for root, files in os.walk(rootdir):
            # current_folder = os.path.basename(root)

            for file in files:
                root, file_extension = os.path.splitext(file)

                if file_extension.lower() == ".obj":
                    model_path = os.path.join(root, file)
                    print (model_path)

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
    def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
        """
        Generate a random string.
        https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits-in-python
        """
        return ''.join(random.choice(chars) for _ in range(size))                
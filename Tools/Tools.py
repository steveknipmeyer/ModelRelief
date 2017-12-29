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

from shutil import copyfile

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

    def print_format_table():
        """
        prints table of formatted text format options
        """
        for style in range(8):
            for fg in range(30,38):
                s1 = ''
                for bg in range(40,48):
                    format = ';'.join([str(style), str(fg), str(bg)])
                    s1 += '\x1b[%sm %s \x1b[0m' % (format, format)
                print(s1)
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

    def printAnsi16Colors():
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

    def printAnsi256Colors():
        for i in range(0, 16):
            for j in range(0, 16):
                code = str(i * 16 + j)
                sys.stdout.write(u"\u001b[38;5;" + code + "m " + code.ljust(4))
            print (u"\u001b[0m")

class Tools:
    def __init__(self): 
        
        return

    def copyFile (sourceFile, destinationFile):
        """
            Copy a single file. The destination is overwritten if it exists.
        """ 

        # copyfile does not overwrite...
        if os.path.isfile(destinationFile):
            os.remove(destinationFile)    

        print ("%s -> %s" % (sourceFile, destinationFile))
        copyfile(sourceFile, destinationFile)

    def recurseFolder(folder):
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

#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: pngfloat
   :synopsis: Support for writing PNG image files.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import argparse
import os
import sys
import math
import numpy as np
import imageio
from enum import Enum
from pathlib import Path

from filemanager import FileManager

class Format(Enum):
    """ PNG file formats. """
    grayscale = 'grayscale'
    rgba = 'rgba'

    def __str__(self):
        return self.value

class PngWriter:
    """
    Creates PNG files.
    """
    BytesPerSinglePrecisionFloat = 4
    BytesPerRGBA = 4

    def __init__(self, arguments):
        """
        Performs initialization.
        """
        self.arguments = arguments
        self.source_file = self.arguments.file

    def write_grayscale(self)->None:
        """
        Writes the single precision float source file as a 16-bit grayscale PNG.
        """

        filename = Path(self.source_file)
        png_filename = filename.with_suffix('.png')

        raw_bytes = FileManager().read__binary( self.source_file)
        elements = len(raw_bytes) / PngWriter.BytesPerSinglePrecisionFloat
        dimensions = int(math.sqrt(elements))

        image_array = FileManager().unpack_floats(raw_bytes)
        image_array = np.reshape(image_array, [dimensions, dimensions])

        # convert to 16 bit unsigned integers
        image_array = (65535 * ((image_array - image_array.min()) / image_array.ptp())).astype(np.uint16)

        # invert
        image_array = 65535 - image_array

        image_array = np.flipud(image_array)

        imageio.imwrite(png_filename, image_array)

    def write_rgba(self)->None:
        """
        Writes the RGBA source file as an RGBA PNG.
        """

        filename = Path(self.source_file)
        png_filename = filename.with_suffix('.png')

        raw_bytes = FileManager().read__binary(self.source_file)
        elements = len(raw_bytes) / PngWriter.BytesPerRGBA
        dimensions = int(math.sqrt(elements))

        image_array = FileManager().unpack_integer32(raw_bytes)
        image_array = np.reshape(image_array, [dimensions, dimensions])

        # convert to 32 bit unsigned integers
        image_array = image_array.astype(np.uint32)

        image_array = np.flipud(image_array)

        imageio.imwrite(png_filename, image_array, format="RGBA")

def main():
    """
    Main entry point.
    """
    os.chdir(os.path.dirname(__file__))

    # command line options
    options_parser = argparse.ArgumentParser()
    options_parser.add_argument('--file', '-f',
                                help='Source file', required=True)

    # Format
    options_parser.add_argument('--format', '-t',
                                help='File format', type=Format, required=True)

    arguments = options_parser.parse_args()

    writer = PngWriter(arguments)
    if arguments.format == Format.rgba:
        writer.write_rgba()
    else:
        writer.write_grayscale()

if __name__ == '__main__':
    main()



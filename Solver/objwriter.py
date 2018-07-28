#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: OBJWriter
   :synopsis: Support for writing a WaveFront OBJ file.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np
from typing import TextIO

from services import Services
from mathtools import MathTools
from stopwatch import benchmark

class OBJWriter:
    """
    A class for writing a WaveFront OBJ file from a single precision float array.
    """
    def __init__(self, services : Services, array: np.ndarray, path: str) -> None:
        """
        Initialize an instance of OBJWriter.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)
        array
            The floating point 2D array to convert to an OBJ file.
        path
            The path of the final OBJ file.            
        """
        self.debug = True
        self.services = services
        self.array = np.flipud(array)
        self.columns, self.rows = self.array.shape

        self.path = path

    def write_header(self, file: TextIO) -> None:
        """
        Write the OBJ header
        Parameters
        ----------
        """
        file.write('# ModelRelief\n')
        file.write('\n')

    @benchmark()
    def write_vertices(self, file: TextIO) -> None:
        """
        Write the vertex list.
        Parameters
        ----------
        """
        file.write('# Vertices\n')
        for row in range(self.rows):
            for column in range(self.columns):
                x = column
                y = self.rows -1 - row
                z = self.array[row, column]
                file.write(f'v {x} {y} {z}\n')
        file.write('\n')

    @benchmark()
    def write_faces(self, file: TextIO) -> None:
        """
        Write the face list.
        Parameters
        ----------
        """
        file.write('# Faces\n')
        for row in range(self.rows - 1):
            for column in range(self.columns - 1):

                left_tri_top_left = (row * self.columns) + column + 1
                left_tri_bottom_left = left_tri_top_left + self.columns
                left_tri_top_right = left_tri_top_left + 1
                file.write(f'f {left_tri_top_left} {left_tri_bottom_left} {left_tri_top_right}\n')

                right_tri_bottom_left = left_tri_bottom_left
                right_tri_bottom_right = right_tri_bottom_left + 1
                right_tri_upper_right = right_tri_bottom_right - self.columns
                file.write(f'f {right_tri_bottom_left} {right_tri_bottom_right} {right_tri_upper_right}\n')

        file.write('\n')

    @benchmark()
    def write(self) -> None:
        """
        Writes the OBJ file.
        """
        with open(file=self.path, mode='w') as file:
            self.write_header(file)
            self.write_vertices(file)
            self.write_faces(file)

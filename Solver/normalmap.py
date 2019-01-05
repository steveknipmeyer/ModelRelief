#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
# 

"""
.. module:: NormalMap
   :synopsis: A rendering NormalMap created from a Model3d and a Camera.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import math
import os
import sys
import numpy as np

from pathlib import Path
from typing import List, Tuple, Union

from filemanager import FileManager
from services import Services

class NormalMap:
    """
    A rendering NormalMap created from a Model3d and a Camera.
    """

    def __init__(self, settings: dict, services : Services) -> None:
        """
        Initialize an instance of a NormalMap.
        Parameters:
        ----------
        setting
            The NormalMap JSON definition.
        services
            Service support for logging, timers, etc.
        """
        self.debug = False

        self.settings = settings
        self.services = services

        self.path = os.path.join(self.services.content_folder,  settings['RelativeFileName'])
        self._width = int(settings['Width'])
        self._height = int(settings['Height'])
        self.format = settings['Format']

        self._components : List[np.ndarray] = []

    @property
    def name(self):
        """
        Returns the base name of the NormalMap.
        """
        return os.path.basename(self.path)

    @property
    def width(self):
        """
        Returns the width of the NormalMap.
        """
        return self._width

    @width.setter
    def width(self, value):
        """
        Sets the width of the NormalMap.
        """
        self._width = value

    @property
    def height(self):
        """
        Returns the height of the NormalMap.
        """
        return self._height

    @height.setter
    def height(self, value):
        """
        Sets the height of the NormalMap.
        """
        self._height = value

    @property
    def components(self) -> List[np.ndarray]:
        """
        Returns the vector components of the NormalMap.
        """
        # cached?
        if (len(self._components) > 0):
            return self._components

        # read NormalMap image
        filename = Path(self.path)

        file_manager = FileManager()
        raw_bytes = file_manager.read__binary(filename)
        rgba_array = file_manager.unpack_rgba(raw_bytes)

        return self._components

    @property
    def normal_x(self):
        """
        Returns the X component.
        """
        return self.components[0]

    @property
    def normal_y(self):
        """
        Returns the Y component.
        """
        return self.components[1]

    @property
    def normal_z(self):
        """
        Returns the Z component.
        """
        return self.components[2]

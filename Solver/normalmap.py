#!/usr/bin/env python
"""
.. module:: NormalMap
   :synopsis: A rendering NormalMap created from a Model3d and a Camera.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import math
import os
import sys
import numpy as np

from pathlib import Path
from typing import Dict, List, Tuple, Union

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

        self._components : Dict[Tuple[int, int], float] = {}

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
    def components(self) -> np.ndarray:
        """
        Returns the vector components of the NormalMap.
        """
        # cached?
        if (len(self._components) > 0):
            return self._components

        rgba_planes = FileManager().read_rgba(self.path, np.float)

        self._components = rgba_planes
        return self._components

    def rg_to_xy(self, component: np.ndarray)-> np.ndarray:
        """
        Converts a Red/Green value to the normalized XY vector component.
        """
        component = (component - 127.0) / 127.0
        return component

    @property
    def x(self)-> np.ndarray:
        """
        Returns the X component.
        """
        x_plane = self.components[:, :, 0]
        normal_x = self.rg_to_xy(x_plane)
        return normal_x

    @property
    def y(self)-> np.ndarray:
        """
        Returns the Y component.
        """
        y_plane = self.components[:, :, 1]
        normal_y = self.rg_to_xy(y_plane)
        return normal_y

    @property
    def z(self)-> np.ndarray:
        """
        Returns the Z component.
        """
        z_plane: np.ndarray = self.components[:, :, 2]

        # WIP: prevent unbounded gradients (division by zero)
        z_plane[z_plane == 0] = 1
        # WIP: flip
        z_plane = -1.0 * z_plane / 255.0

        return z_plane

    @property
    def gradient_x(self):
        """
        Returns the X gradient of the NormalMap.
        """
        gradient = self.x / self.z
        return gradient

    @property
    def gradient_y(self):
        """
        Returns the Y gradient of the NormalMap.
        """
        gradient = self.y / self.z
        return gradient

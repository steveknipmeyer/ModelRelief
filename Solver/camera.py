#!/usr/bin/env python
"""
.. module:: Camera
   :synopsis: A camera.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>

"""
import math

from abc import ABC, abstractmethod
from typing import List
class Camera(ABC):
    """
    A base camera.
    """

    def __init__(self, settings):
        """
        Initialize an instance of a Camera.
        """
        super().__init__()

        self.settings = settings

        self.name           = settings['Name']
        self.perspective    = settings['IsPerspective']

        self.near           = settings['Near']
        self.far            = settings['Far']

    @abstractmethod
    def near_plane_extents (self)-> List[float]:
        """
        Returns the extents (model units) of the near clipping plane.
        """
        pass

    @property
    def projection(self)-> str:
        """
        Returns the projection type of the camera.
        """
        return "Perspective" if self.perspective else "Orthographic"
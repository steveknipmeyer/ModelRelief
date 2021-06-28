#!/usr/bin/env python
import math
from typing import List

from camera import Camera

"""
.. module:: OrthographicCamera
   :synopsis: An orthographic camera.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>

"""

class OrthographicCamera(Camera):
    """
    An orthographic camera.
    """

    def __init__(self, settings):
        """
        Initialize an instance of an Orthographic Camera.
        """
        super().__init__(settings)

        self.left  = settings['Left']
        self.right = settings['Right']
        self.top = settings['Top']
        self.bottom = settings['Bottom']

    def near_plane_extents (self)-> List[float]:
        """
        Returns the extents (model units) of the near clipping plane.
        """
        near_width  = self.right - self.left
        near_height = self.top - self.bottom
        extents = [near_width, near_height]

        return extents

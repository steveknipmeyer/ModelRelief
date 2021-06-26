#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
import math
from typing import List

from camera import Camera

"""
.. module:: PerspectiveCamera
   :synopsis: A perspective camera.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>

"""

class PerspectiveCamera(Camera):
    """
    A perspective camera.
    """

    def __init__(self, settings):
        """
        Initialize an instance of a PerspectiveCamera.
        """
        super().__init__(settings)

        self.aspect = settings['AspectRatio']
        self.fov    = settings['FieldOfView']

    def near_plane_extents (self)-> List[float]:
        """
        Returns the extents (model units) of the near clipping plane.
        """
        fov_radians = self.fov * (math.pi / 180)

        near_height = 2 * math.tan(fov_radians / 2) * self.near
        near_width  = self.aspect * near_height
        extents = [near_width, near_height]

        return extents

#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
import math
from typing import List

"""
.. module:: Camera
   :synopsis: A perspective camera.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

class Camera:
    """
    A perspective camera.
    """

    def __init__(self, settings):
        """
        Initialize an instance of a Camera.
        """
        self.settings = settings

        self.name   = settings['Name']
        self.aspect = settings['AspectRatio']        
        self.fov    = settings['FieldOfView']        
        self.near   = settings['Near']        
        self.far    = settings['Far']        

    def near_plane_extents (self)-> List[float]: 
        """
        Returns the extents (model units) of the near clipping plane.
        """
        fov_radians = self.fov * (math.pi / 180)
    
        near_height = 2 * math.tan(fov_radians / 2) * self.near
        near_width  = self.aspect * near_height
        extents = [near_width, near_height]
        
        return extents     

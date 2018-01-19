#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: DepthBuffer
   :synopsis: A rendering DepthBuffer created from a Model3d and a Camera.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os

class DepthBuffer:
    """
    A rendering DepthBuffer created from a Model3d and a Camera.
    """

    def __init__(self, settings):
        """
            Iniitalize an instancee of a DepthBuffer.
        """
        self.settings = settings
        self.path = os.path.abspath(settings['FileName'])
        self.format = settings['Format']

    @property
    def name(self):
        return os.path.basename(self.path)

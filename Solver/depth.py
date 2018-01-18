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

class DepthBuffer:
    """
    A rendering DepthBuffer created from a Model3d and a Camera.
    """

    def __init__(self, path):
        """
            Iniitalize an instancee of a MeshTransform.
        """
        self.path = path


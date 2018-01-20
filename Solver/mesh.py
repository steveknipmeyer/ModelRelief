#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Mesh
   :synopsis: A low relief mesh created by applying a MeshTransform to a DepthBuffer.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""

class Mesh:
    """
    A low relief mesh created by applying a MeshTransform to a DepthBuffer.
    """

    def __init__(self, settings):
        """
        Iniitalize an instance of a Mesh.
        """
        self.settings = settings
        self.name = settings['Name']

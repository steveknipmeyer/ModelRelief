#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: MeshScale
   :synopsis: Support for scaling meshes.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""

class MeshScale: 
    """
    A class for scaling meshes.
    """

    def __init__(self, working_folder):
        """
        Initialize an instance of a MeshScale.
        """
        self.debug = True
        self.working_folder = working_folder


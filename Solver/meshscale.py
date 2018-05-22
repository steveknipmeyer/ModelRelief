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
from services import Services 

class MeshScale: 
    """
    A class for scaling meshes.
    """

    def __init__(self, services : Services) -> None:
        """
        Initialize an instance of a MeshScale.
        Parameters
        ----------
        services
            Service provider (loggins, timers, etc.)
        """
        self.debug = True
        self.services = services

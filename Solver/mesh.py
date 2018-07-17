#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
import os
from services import Services

"""
.. module:: Mesh
   :synopsis: A low relief mesh created by applying a MeshTransform to a DepthBuffer.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""

class Mesh:
    """
    A low relief mesh created by applying a MeshTransform to a DepthBuffer.
    """

    def __init__(self, settings: dict, services : Services) -> None:
        """
        Initialize an instancee of a Mesh.
        Parameters:
        ----------
        settings
            The Mesh JSON settings.
        services
            Service support for logging, timers, etc.
        """
        self.settings = settings
        self.services = services
        
        self.name = settings['Name']
        self.path = os.path.join(self.services.root_folder,  os.path.abspath(settings['RelativeFileName']))
        

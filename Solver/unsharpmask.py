#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: UnsharpMask
   :synopsis: Support for unsharp masking of images.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
from services import Services

class UnsharpMask:
    """
    A class for calculating unsharp masks of images.
    """

    def __init__(self, services : Services) -> None: 
        """
        Initialize an instance of an UnsharpMask.
        Parameters
        ----------
        services
            Service provider (loggins, timers, etc.)
        """
        self.debug = True
        self.services = services


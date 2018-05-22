#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Attenutation
   :synopsis: Support for attenuation of image components.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
from services import Services

class Attenuation:
    """
    A class for attenuating image components.
    """

    def __init__(self, services : Services) -> None:
        """
        Initialize an instance of a Attenuation.
        Parameters
        ----------
        services
            Service provider (loggins, timers, etc.)
        """
        self.debug = True
        self.services = services


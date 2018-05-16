#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Poisson
   :synopsis: Support for solving Poisson's equation for images.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
from services import Services

class Poisson:
    """
    A class for solving Poisson's equation for images.
    """

    def __init__(self, services : Services):
        """
        Initialize an instance of a Poisson.
        Parameters
        ----------
        services
            Service provider (loggins, timers, etc.)
        """
        self.debug = True
        self.services = services



#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Gradient
   :synopsis: Support for calculating image gradients.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
from services import Services

class Gradient:
    """
    A class for calculating image gradients.
    """

    def __init__(self, services : Services):
        """
        Initialize an instance of a Gradient.
        Parameters
        ----------
        services
            Service provider (loggins, timers, etc.)
        """
        self.debug = True
        self.services = services



#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Threshold
   :synopsis: Support for applying thresholds to image components.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
from services  import Services

class Threshold:
    """
    A class for Support for applying thresholds to image components.
    """

    def __init__(self, services : Services):
        """
        Initialize an instance of a Threshold.
        Parameters
        ----------
        services
            Service provider (loggins, timers, etc.)
        """
        self.debug = True
        self.services = services



#!/usr/bin/env python
"""
.. module:: Integrator
   :synopsis: Support for integrating array finite differences.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import numpy as np
from enum import Enum
from typing import List

from services import Services
from stopwatch import benchmark

class Integrator:
    """
    A class for integrating array finite differences.
    """

    def __init__(self, services : Services) -> None:
        """
        Initialize an Integrator instance.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)
        """
        self.debug = True
        self.services = services

    def integrate_x(self, a: np.ndarray) -> np.ndarray:
        """
        Integrates along the X axis.
        Parameters
        ----------
        a
            The array holding the finite differences.
        Returns
        -------
        An ndarray containing the integration sums.
        """
        (rows, columns) = a.shape
        integration = np.zeros((rows, columns))
        for row in range(rows):
            for column in range(columns - 1):
                integration[row, column + 1] = integration[row, column] + a[row, column + 1]

        return integration

    def integrate_y(self, a: np.ndarray) -> np.ndarray:
        """
        Integrates along the Y axis.
        Parameters
        ----------
        a
            The array holding the finite differences.
        Returns
        -------
        An ndarray containing the integration sums.
        """
        at = a.transpose()
        at_integration_x = self.integrate_x(at)
        return at_integration_x.transpose()

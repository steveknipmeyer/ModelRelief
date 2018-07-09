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
import pyamg
import numpy as np

from services import Services
from mathtools import MathTools

class Poisson:
    """
    A class for solving Poisson's equation for images.
    """

    def __init__(self, services : Services) -> None:
        """
        Initialize an instance of a Poisson.
        Parameters
        ----------
        services
            Service provider (loggins, timers, etc.)
        """
        self.debug = True
        self.services = services

    def solve(self, divG: np.ndarray) -> np.ndarray:
        """
        Solves the Poisson equation: 
            Laplacian (I) = div (G)
            Ax = b
        where 
            I = image in the spatial domain
            G = vector gradient of the image after pre-processing (attenuation, unsharp masking)
        Parameters
        ----------
        digG
            Divervence of the gradient field.
        """
        dimensions = np.shape(divG)
        n = dimensions[0]
        A = pyamg.gallery.poisson((n, n), format='csr')      # 2D Poisson problem on 4x4 grid
        ml = pyamg.ruge_stuben_solver(A)                                            # construct the multigrid hierarchy

        b = divG.reshape(A.shape[0])                                                  # vectorize

        x = ml.solve(b, tol=1e-10)                                                  # solve Ax=b to a tolerance of 1e-10
        I = x.reshape((n, n))
       
        return I
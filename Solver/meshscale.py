#!/usr/bin/env python
"""
.. module:: MeshScale
   :synopsis: Support for scaling meshes.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>
"""
import numpy as np

from depthbuffer import DepthBuffer
from services import Services
from stopwatch import benchmark

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
            Service provider (logging, timers, etc.)
        """
        self.debug = True
        self.services = services

    @benchmark()
    def scale_linear(self, buffer: DepthBuffer, factor: float) -> np.ndarray:
        """
        Performs a DepthBuffer by a linear scale (only) a mesh. There is no relief processing.
        Parameters
        ----------
        mesh
            The 2D ndarray to scale.
        factor
            The scale factor.
        Returns
            A 2D ndarray
        """
        scaled_floats = buffer.scale_floats(factor)

        return scaled_floats

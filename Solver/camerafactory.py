#!/usr/bin/env python
"""
.. module:: CameraFactory
   :synopsis: A camera factory returning specialized instances (PerspectiveCamera, OrthographicCamera) of Camera.

.. moduleauthor:: Steve Knipmeyer <steve@modelrelief.org>

"""
import math
from typing import List

from camera import Camera
from perspectivecamera import PerspectiveCamera
from orthographiccamera import OrthographicCamera
class CameraFactory():
    """
    A camera factory returning specialized instances (PerspectiveCamera, OrthographicCamera) of Camera.
    """

    @staticmethod
    def construct (camera_settings: dict)-> Camera:
        """
        Returns a subclass of Camera.
        Parameters
        ----------
        camera_settings
            JSON camera settings.
        """
        perspective: bool = camera_settings["IsPerspective"]
        return PerspectiveCamera(camera_settings) if perspective else OrthographicCamera(camera_settings)
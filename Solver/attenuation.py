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
import numpy as np

from mathtools import MathTools
from logger import Logger
from services import Services
from tools import Colors
class AttenuationParameters:

    """
    A class for holding the parameters of an attenuation function.
    """
    def __init__(self, factor: float, decay: float) -> None:
        """
        Initialize an instance of AttenuationParameters.
        Parameters
        ----------
        factor
            This is the percentage of the mean absolute value of the gradient.
            a = factor * mean(|gradient|)
            a determines the point where amplification becomes reduction.
                v < a, v is amplified.
                v = a, v is unchanged.
                v > a, v is reduced.
        b
            Controls the rate at which the attenuation curve decays.
        """
        self.factor = factor
        self.decay  = decay

class Attenuation:
    """
    A class for attenuating image components.
    """
    def __init__(self, services : Services) -> None:
        """
        Initialize an instance of Attenuation.
        Parameters
        ----------
        services
            Service provider (logging, timers, etc.)
        """
        self.debug = True
        self.services = services

    def apply (self, array: np.ndarray, parameters: AttenuationParameters) -> np.ndarray:
        """
        N.B. See Jupyter notebook Attenuation.ipynb for a test workbench.
        Applies the attenuation function to all elements in an ndarray.

        Parameters
        ----------
        original
            The array to apply the attenuation function against.
        parameters
            The AttenuationParameters (factor, decay):
            factor -> boundary between amplication and reduction; percentage of mean absolute value of gradient
            decay  -> rate of decay of attenuation curve
        """
        epsilon = 1E-4

        # average of absolute value of non-zero elements
        absolute = np.absolute(array)
        mean = absolute[absolute > epsilon].mean()

        a = (parameters.factor / 100.0) * mean
        b = parameters.decay

        def generate_weights (v, a, b):
            # weight = (a / abs(v)) * (abs(v) / a)**b
            weight = 0 if abs(v) < epsilon else (a ** (1 - b)) * (abs(v) ** (b - 1))

            return float(weight)

        vgenerate_weights = np.vectorize(generate_weights)
        weights: np.ndarray = vgenerate_weights(np.copy(array), a, b)

        if self.debug:
            MathTools.analyze_array("Gradient", array, color = Colors.BrightCyan)
            MathTools.analyze_array("Attenuation Weights", weights, color = Colors.BrightMagenta)

        attenuated_array = weights * array

        return attenuated_array

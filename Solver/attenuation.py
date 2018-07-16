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

from services import Services

class AttenuationParameters:

    DEFAULT_A = 10.0
    DEFAULT_B =  0.6

    """
    A class for holding the parameters of an attenuation function.
    """
    def __init__(self, a: float, b: float) -> None:
        """
        Initialize an instance of AttenuationParameters.
        Parameters
        ----------
        a
            Determines the point where amplification becomes reduction.
                v < a, v is amplified.
                v = a, v is unchanged.
                v > a, v is reduced.
        b       
            Controls the rate at which the attenuation curve decays.     
        """
        self.a = a
        self.b = b
    
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

    def apply (self, original: np.ndarray, parameters: AttenuationParameters) -> np.ndarray:
        """
        Applies the attenuation function to all elements in an ndarray.

        Parameters
        ----------
        original
            The array to apply the attenuation function against.
        parameters
            The AttenuationParameters (a, b):
            a = boundary between amplication and reduction; percent of mean absolute value of gradient
            b = rate of decay of attenuation curve
        """
        # copy
        attenuated_array = np.array(original)

        absolute_value = np.absolute(original)
        mean_absolute_value = np.mean(absolute_value)
        a = (parameters.a / 100.0) * mean_absolute_value
        b = parameters.b

        def attenuator (v, a, b):
            weight = 0 if v == 0 else (a / abs(v)) * (abs(v) / a)**b
            value = weight * v
            return value

        vattenuator = np.vectorize(attenuator)
        attenuated_array = vattenuator(attenuated_array, a, b)

        return attenuated_array

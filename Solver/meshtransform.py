#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: MeshTransform
   :synopsis: A collection of settings that control how a DepthBuffer is transformed
              to create a relief DepthBuffer.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
from attenuation import AttenuationParameters

class MeshTransform:
    """
    Settings used to control a transform of a DepthBuffer to create a (relief) Mesh.
    """

    def __init__(self, settings):
        """
        Initialize an instance of a MeshTransform.
        """
        self.settings = settings

        self.gradient_threshold     = settings['GradientThreshold']
        self.attenuation_parameters = AttenuationParameters(settings['AttenationFactor'], settings['AttenuationDecay'])
        self.unsharp_gaussian_low   = settings['UnsharpGaussianLow']
        self.unsharp_gaussian_high  = settings['UnsharpGaussianHigh']
        self.unsharp_hf_scale       = settings['UnsharpHighFrequencyScale']
        self.p1                     = settings['P1']
        self.p2                     = settings['P2']

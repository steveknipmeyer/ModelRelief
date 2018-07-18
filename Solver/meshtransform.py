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
from unsharpmask import UnsharpMaskParameters

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
        self.attenuation_parameters: AttenuationParameters = AttenuationParameters(settings['AttenuationFactor'], settings['AttenuationDecay'])
        self.unsharpmask_parameters:UnsharpMaskParameters  = UnsharpMaskParameters(settings['UnsharpGaussianLow'], settings['UnsharpGaussianHigh'], settings['UnsharpHighFrequencyScale'])
        self.p1                     = settings['P1']
        self.p2                     = settings['P2']

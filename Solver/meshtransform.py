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
        self.debug = True

        self.gradient_threshold     = float(settings['GradientThreshold'])
        self.attenuation_parameters: AttenuationParameters = AttenuationParameters(float(settings['AttenuationFactor']), float(settings['AttenuationDecay']))
        self.unsharpmask_parameters:UnsharpMaskParameters  = UnsharpMaskParameters(float(settings['UnsharpGaussianLow']), float(settings['UnsharpGaussianHigh']), float(settings['UnsharpHighFrequencyScale']))
        self.p1                     = float(settings['P1'])
        self.p2                     = float(settings['P2'])
        self.p3                     = float(settings['P3'])
        self.p4                     = float(settings['P4'])
        self.p5                     = float(settings['P5'])
        self.p6                     = float(settings['P6'])

    def __repr__(self):
        return f'Gradient Threshold = {self.gradient_threshold},  Attenuation: Factor = {self.attenuation_parameters.factor} Decay = {self.attenuation_parameters.decay} UnsharpMask: Low = {self.unsharpmask_parameters.gaussian_low} High = {self.unsharpmask_parameters.gaussian_high}, HF = {self.unsharpmask_parameters.high_frequency_scale}, P1 = {self.p1}, P2 = {self.p2}'
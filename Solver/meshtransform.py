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

        self.tau             = settings['Tau']
        self.gaussian_low    = settings['SigmaGaussianBlur']
        self.gaussian_high   = settings['SigmaGaussianSmooth']
        self.lambda_scale    = settings['LambdaLinearScaling']

        # not (yet) persisted
        self.attenuation_parameters = AttenuationParameters(AttenuationParameters.DEFAULT_A, AttenuationParameters.DEFAULT_B)

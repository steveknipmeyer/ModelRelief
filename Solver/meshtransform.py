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
        self.gaussian_blur   = settings['SigmaGaussianBlur']
        self.gaussian_smooth = settings['SigmaGaussianSmooth']
        self.lambda_scale    = settings['LambdaLinearScaling']

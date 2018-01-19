#!/usr/bin/env python
#
#   Copyright (c) 2017
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
    Settings used to contral a transform of a DepthBuffer to create a new (relief) DepthBuffer.
    """

    def __init__(self, settings):
        """
        Iniitalize an instance of a MeshTransform.
        """
        self.settings = settings
        self.scale = settings['LambdaLinearScaling']

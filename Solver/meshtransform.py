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
from gradient import GradientThresholdParameters
from attenuation import AttenuationParameters
from unsharpmask import UnsharpMaskParameters

class ExperimentalParameter:

    """
    A class for holding an experimental mesh processing parameter.
    """
    def __init__(self, enabled: bool, value: float, label: str = '', ui_type: type = float, property_name: str = '') -> None:
        """
        Initialize an instance of ExperimentalParameter.
        Parameters
        ----------
        enabled
            Enable the setting.
        value
            The value of the setting.
        label
            Setting label.
        ui_type
            Type of the setting.
        property_name
            MeshTransform property name.

        """
        self.enabled: bool = enabled
        self.value: float = value

        # UI descriptors
        self.label: str = label
        self.property_name: str = property_name
        self.ui_type: type = ui_type
        self.ui_checkbox: str = f"{self.property_name}CheckBox"
        self.ui_field: str =  f"{self.property_name}LineEdit"
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

        self.gradient_threshold_parameters: GradientThresholdParameters = GradientThresholdParameters(True, float(settings['GradientThreshold']))
        self.attenuation_parameters:        AttenuationParameters       = AttenuationParameters(True, float(settings['AttenuationFactor']), float(settings['AttenuationDecay']))
        self.unsharpmask_parameters:        UnsharpMaskParameters       = UnsharpMaskParameters(True, float(settings['UnsharpGaussianLow']), float(settings['UnsharpGaussianHigh']), float(settings['UnsharpHighFrequencyScale']))
        self.relief_scale :                 float                       = float(settings['ReliefScale'])

        # -------------------------------------- Experimenta; --------------------------------------
        # The Solver can be configured with several optional experimental processing steps.
        #
        # There is no web UI to control these steps however the Explorer workbench UI does expose these settings.
        # N.B. The values below are the web defaults. The Explorer settings will override these values.
        # -----------------------------------------------------------------------------------------------

        # scale relief
        self.p1: ExperimentalParameter = ExperimentalParameter(False, float(settings['P1']), '', float, 'p1')

        # silhoutte processing, sigma gaussian
        self.p2: ExperimentalParameter = ExperimentalParameter(False, float(settings['P2']), 'Silhouette: Sigma', float, 'p2')
        # silhouette processing, blurring passes
        self.p3: ExperimentalParameter = ExperimentalParameter(False, float(settings['P3']), '', int, 'p3')

        # use composite mask in unsharp gaussian blur
        self.p4: ExperimentalParameter = ExperimentalParameter(True, float(settings['P4']), 'Composite Mask', float, 'p4')

        # use Numpy gradients, not Difference class
        self.p5: ExperimentalParameter = ExperimentalParameter(False, float(settings['P5']), 'Numpy Gradients', bool, 'p5')

        # translate mesh Z to positive values
        self.p6: ExperimentalParameter = ExperimentalParameter(False, float(settings['P6']), 'Translate Mesh Z+', bool, 'p6')

        # force planar background by zeroing with background mask
        self.p7: ExperimentalParameter = ExperimentalParameter(False, float(settings['P7']), 'Planar Background', bool, 'p7')

        # use NormalMap gradients (not DepthBuffer heightfields)
        self.p8: ExperimentalParameter = ExperimentalParameter(False, float(settings['P8']), 'NormalMap Gradients', bool, 'p8')

    def __repr__(self):
        return f'Gradient Threshold = {self.gradient_threshold_parameters.value},  Attenuation: Factor = {self.attenuation_parameters.factor} Decay = {self.attenuation_parameters.decay} UnsharpMask: Low = {self.unsharpmask_parameters.gaussian_low} High = {self.unsharpmask_parameters.gaussian_high}, HF = {self.unsharpmask_parameters.high_frequency_scale}, P1 = {self.p1}, P2 = {self.p2}'

    def update_settings(self):
        """
        Update the backing settings structure.
        """

        self.settings['GradientThreshold'] = self.gradient_threshold_parameters.threshold

        self.settings['AttenuationFactor'] = self.attenuation_parameters.factor
        self.settings['AttenuationDecay'] = self.attenuation_parameters.decay

        self.settings['UnsharpGaussianLow'] = self.unsharpmask_parameters.gaussian_low
        self.settings['UnsharpGaussianHigh'] = self.unsharpmask_parameters.gaussian_high
        self.settings['UnsharpHighFrequencyScale'] = self.unsharpmask_parameters.high_frequency_scale

        self.settings['ReliefScale'] = self.relief_scale

        self.settings['P1'] = self.p1.value
        self.settings['P2'] = self.p2.value
        self.settings['P3'] = self.p3.value
        self.settings['P4'] = self.p4.value
        self.settings['P5'] = self.p5.value
        self.settings['P6'] = self.p6.value
        self.settings['P7'] = self.p7.value
        self.settings['P8'] = self.p8.value

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
from silhouette import SilhouetteParameters
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

        self.gradient_threshold_parameters: GradientThresholdParameters = GradientThresholdParameters(bool(settings['GradientThresholdEnabled']), float(settings['GradientThreshold']))
        self.attenuation_parameters:        AttenuationParameters       = AttenuationParameters(bool(settings['AttenuationEnabled']), float(settings['AttenuationFactor']), float(settings['AttenuationDecay']))
        self.unsharpmask_parameters:        UnsharpMaskParameters       = UnsharpMaskParameters(bool(settings['UnsharpMaskingEnabled']), float(settings['UnsharpGaussianLow']), float(settings['UnsharpGaussianHigh']), float(settings['UnsharpHighFrequencyScale']))
        self.planarBackground:              bool                        = bool(settings['PlanarBackground'])
        self.translateMeshZPositive:        bool                        = bool(settings['TranslateMeshZPositive'])
        self.silhouette_parameters:         SilhouetteParameters        = SilhouetteParameters(bool(settings['SilhouetteEnabled']), float(settings['SilhouetteSigma']), int(settings['SilhouettePasses']))
        self.relief_scale :                 float                       = float(settings['ReliefScale'])

        # -------------------------------------- Experimenta; --------------------------------------
        # The Solver can be configured with several optional experimental processing steps.
        #
        # There is no web UI to control these steps however the Explorer workbench UI does expose these settings.
        # N.B. The values below are the web defaults. The Explorer settings will override these values.
        # -----------------------------------------------------------------------------------------------

        self.p1: ExperimentalParameter = ExperimentalParameter(bool(settings['P1Enabled']), float(settings['P1']), '', bool, 'p1')
        self.p2: ExperimentalParameter = ExperimentalParameter(bool(settings['P2Enabled']), float(settings['P2']), '', bool, 'p2')
        self.p3: ExperimentalParameter = ExperimentalParameter(bool(settings['P3Enabled']), float(settings['P3']), '', bool, 'p3')

        # use composite mask in unsharp gaussian blur
        self.p4: ExperimentalParameter = ExperimentalParameter(bool(settings['P4Enabled']), float(settings['P4']), 'Composite Mask', float, 'p4')

        # use Numpy gradients, not Difference class
        self.p5: ExperimentalParameter = ExperimentalParameter(bool(settings['P5Enabled']), float(settings['P5']), 'Numpy Gradients', bool, 'p5')

        self.p6: ExperimentalParameter = ExperimentalParameter(bool(settings['P6Enabled']), float(settings['P6']), '', bool, 'p6')
        self.p7: ExperimentalParameter = ExperimentalParameter(bool(settings['P7Enabled']), float(settings['P7']), '', bool, 'p7')

        # use NormalMap gradients (not DepthBuffer heightfields)
        self.p8: ExperimentalParameter = ExperimentalParameter(bool(settings['P8Enabled']), float(settings['P8']), 'NormalMap Gradients', bool, 'p8')

    def __repr__(self):
        return f'Gradient Threshold = {self.gradient_threshold_parameters.value},  Attenuation: Factor = {self.attenuation_parameters.factor} Decay = {self.attenuation_parameters.decay} UnsharpMask: Low = {self.unsharpmask_parameters.gaussian_low} High = {self.unsharpmask_parameters.gaussian_high}, HF = {self.unsharpmask_parameters.high_frequency_scale}, P1 = {self.p1}, P2 = {self.p2}'

    def update_json_settings(self):
        """
        Update the backing settings structure.
        """

        self.settings['GradientThresholdEnabled'] = self.gradient_threshold_parameters.enabled
        self.settings['GradientThreshold'] = self.gradient_threshold_parameters.threshold

        self.settings['AttenuationEnabled'] = self.attenuation_parameters.enabled
        self.settings['AttenuationFactor'] = self.attenuation_parameters.factor
        self.settings['AttenuationDecay'] = self.attenuation_parameters.decay

        self.settings['UnsharpMaskingEnabled'] = self.unsharpmask_parameters.enabled
        self.settings['UnsharpGaussianLow'] = self.unsharpmask_parameters.gaussian_low
        self.settings['UnsharpGaussianHigh'] = self.unsharpmask_parameters.gaussian_high
        self.settings['UnsharpHighFrequencyScale'] = self.unsharpmask_parameters.high_frequency_scale

        self.settings['PlanarBackground'] = self.planarBackground
        self.settings['TranslateMeshZPositive'] = self.translateMeshZPositive

        self.settings['SilhouetteEnabled'] = self.silhouette_parameters.enabled
        self.settings['SilhouetteSigma'] = self.silhouette_parameters.sigma
        self.settings['SilhouettePasses'] = self.silhouette_parameters.passes

        self.settings['ReliefScale'] = self.relief_scale

        self.settings['P1Enabled'] = self.p1.enabled
        self.settings['P1'] = self.p1.value
        self.settings['P2Enabled'] = self.p2.enabled
        self.settings['P2'] = self.p2.value
        self.settings['P3Enabled'] = self.p3.enabled
        self.settings['P3'] = self.p3.value
        self.settings['P4Enabled'] = self.p4.enabled
        self.settings['P4'] = self.p4.value
        self.settings['P5Enabled'] = self.p5.enabled
        self.settings['P5'] = self.p5.value
        self.settings['P6Enabled'] = self.p6.enabled
        self.settings['P6'] = self.p6.value
        self.settings['P7Enabled'] = self.p7.enabled
        self.settings['P7'] = self.p7.value
        self.settings['P8Enabled'] = self.p8.enabled
        self.settings['P8'] = self.p8.value

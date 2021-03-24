// -----------------------------------------------------------------------
// <copyright file="DefaultMeshTransformSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain
{
    /// <summary>
    /// Default mesh transformsettings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public class DefaultMeshTransformSettings
    {
        public double Width { get; set; }
        public double Height { get; set; }
        public double Depth { get; set; }

        public bool GradientThresholdEnabled { get; set; }
        public double GradientThreshold { get; set; }

        public bool AttenuationEnabled { get; set; }
        public double AttenuationFactor { get; set; }
        public double AttenuationDecay { get; set; }

        public bool UnsharpMaskingEnabled { get; set; }
        public double UnsharpGaussianLow { get; set; }
        public double UnsharpGaussianHigh { get; set; }
        public double UnsharpHighFrequencyScale { get; set; }

        public bool PlanarBackground { get; set; }
        public bool TranslateMeshZPositive { get; set; }

        public bool SilhouetteEnabled { get; set; }
        public int SilhouetteEdgeWidth { get; set; }
        public double SilhouetteSigma { get; set; }

        public double ReliefScale { get; set; }

        /// <summary>
        /// Initialize the settings from JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public void Initialize(dynamic settingsJson)
        {
            Width = settingsJson.MeshTransform.Width;
            Height = settingsJson.MeshTransform.Height;
            Depth = settingsJson.MeshTransform.Depth;

            GradientThresholdEnabled = settingsJson.MeshTransform.GradientThresholdEnabled;
            GradientThreshold = settingsJson.MeshTransform.GradientThreshold;

            AttenuationEnabled = settingsJson.MeshTransform.AttenuationEnabled;
            AttenuationFactor = settingsJson.MeshTransform.AttenuationFactor;
            AttenuationDecay = settingsJson.MeshTransform.AttenuationDecay;

            UnsharpMaskingEnabled = settingsJson.MeshTransform.UnsharpMaskingEnabled;
            UnsharpGaussianLow = settingsJson.MeshTransform.UnsharpGaussianLow;
            UnsharpGaussianHigh = settingsJson.MeshTransform.UnsharpGaussianHigh;
            UnsharpHighFrequencyScale = settingsJson.MeshTransform.UnsharpHighFrequencyScale;

            PlanarBackground = settingsJson.MeshTransform.PlanarBackground;
            TranslateMeshZPositive = settingsJson.MeshTransform.TranslateMeshZPositive;

            SilhouetteEnabled = settingsJson.MeshTransform.SilhouetteEnabled;
            SilhouetteEdgeWidth = settingsJson.MeshTransform.SilhouetteEdgeWidth;
            SilhouetteSigma = settingsJson.MeshTransform.SilhouetteSigma;

            ReliefScale = settingsJson.MeshTransform.ReliefScale;
        }
    }
}

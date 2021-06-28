// -----------------------------------------------------------------------
// <copyright file="MeshTransform.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.Collections.Generic;
    using ModelRelief.Services.Relationships;
    [DependentFiles(typeof(Mesh))]
    public class MeshTransform : DomainModel, IProjectModel
    {
        [DependentFileProperty]
        public double Width { get; set; }
        [DependentFileProperty]
        public double Height { get; set; }
        [DependentFileProperty]
        public double Depth { get; set; }

        [DependentFileProperty]
        public bool GradientThresholdEnabled { get; set; }
        [DependentFileProperty]
        public double GradientThreshold { get; set; }

        [DependentFileProperty]
        public bool AttenuationEnabled { get; set; }
        [DependentFileProperty]
        public double AttenuationFactor { get; set; }
        [DependentFileProperty]
        public double AttenuationDecay { get; set; }

        [DependentFileProperty]
        public bool UnsharpMaskingEnabled { get; set; }
        [DependentFileProperty]
        public double UnsharpGaussianLow { get; set; }
        [DependentFileProperty]
        public double UnsharpGaussianHigh { get; set; }
        [DependentFileProperty]
        public double UnsharpHighFrequencyScale { get; set; }

        [DependentFileProperty]
        public bool PlanarBackground { get; set; }
        [DependentFileProperty]
        public bool TranslateMeshZPositive { get; set; }

        [DependentFileProperty]
        public bool SilhouetteEnabled { get; set; }
        [DependentFileProperty]
        public int SilhouetteEdgeWidth { get; set; }
        [DependentFileProperty]
        public double SilhouetteSigma { get; set; }

        public double ReliefScale { get; set; }

        [DependentFileProperty]
        public bool P1Enabled { get; set; }
        [DependentFileProperty]
        public double P1 { get; set; }
        [DependentFileProperty]
        public bool P2Enabled { get; set; }
        [DependentFileProperty]
        public double P2 { get; set; }
        [DependentFileProperty]
        public bool P3Enabled { get; set; }
        [DependentFileProperty]
        public double P3 { get; set; }
        [DependentFileProperty]
        public bool P4Enabled { get; set; }
        [DependentFileProperty]
        public double P4 { get; set; }
        [DependentFileProperty]
        public bool P5Enabled { get; set; }
        [DependentFileProperty]
        public double P5 { get; set; }
        [DependentFileProperty]
        public bool P6Enabled { get; set; }
        [DependentFileProperty]
        public double P6 { get; set; }
        [DependentFileProperty]
        public bool P7Enabled { get; set; }
        [DependentFileProperty]
        public double P7 { get; set; }
        [DependentFileProperty]
        public bool P8Enabled { get; set; }
        [DependentFileProperty]
        public double P8 { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }
        public ICollection<Mesh> Meshes { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransform"/> class.
        /// Default constructor.
        /// </summary>
        public MeshTransform()
        {
            Name = "Default MeshTransform";

            Width = Defaults.MeshTransform.Width;
            Height = Defaults.MeshTransform.Height;
            Depth = Defaults.MeshTransform.Depth;

            GradientThresholdEnabled = Defaults.MeshTransform.GradientThresholdEnabled;
            GradientThreshold = Defaults.MeshTransform.GradientThreshold;

            AttenuationEnabled = Defaults.MeshTransform.AttenuationEnabled;
            AttenuationFactor = Defaults.MeshTransform.AttenuationFactor;
            AttenuationDecay = Defaults.MeshTransform.AttenuationDecay;

            UnsharpMaskingEnabled = Defaults.MeshTransform.UnsharpMaskingEnabled;
            UnsharpGaussianLow = Defaults.MeshTransform.UnsharpGaussianLow;
            UnsharpGaussianHigh = Defaults.MeshTransform.UnsharpGaussianHigh;
            UnsharpHighFrequencyScale = Defaults.MeshTransform.UnsharpHighFrequencyScale;

            PlanarBackground = Defaults.MeshTransform.PlanarBackground;
            TranslateMeshZPositive = Defaults.MeshTransform.TranslateMeshZPositive;

            SilhouetteEnabled = Defaults.MeshTransform.SilhouetteEnabled;
            SilhouetteEdgeWidth = Defaults.MeshTransform.SilhouetteEdgeWidth;
            SilhouetteSigma = Defaults.MeshTransform.SilhouetteSigma;

            ReliefScale = Defaults.MeshTransform.ReliefScale;
        }
    }
}

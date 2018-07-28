// -----------------------------------------------------------------------
// <copyright file="MeshTransform.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using ModelRelief.Services.Relationships;

    [DependentFiles(typeof(Mesh))]
    public class MeshTransform : DomainModel
    {
        [DependentFileProperty]
        public double Width { get; set; }
        [DependentFileProperty]
        public double Height { get; set; }
        [DependentFileProperty]
        public double Depth { get; set; }

        [DependentFileProperty]
        public double GradientThreshold { get; set; }

        [DependentFileProperty]
        public double AttenuationFactor { get; set; }
        [DependentFileProperty]
        public double AttenuationDecay { get; set; }

        [DependentFileProperty]
        public double UnsharpGaussianLow { get; set; }
        [DependentFileProperty]
        public double UnsharpGaussianHigh { get; set; }
        [DependentFileProperty]
        public double UnsharpHighFrequencyScale { get; set; }

        [DependentFileProperty]
        public double P1 { get; set; }
        [DependentFileProperty]
        public double P2 { get; set; }
        [DependentFileProperty]
        public double P3 { get; set; }
        [DependentFileProperty]
        public double P4 { get; set; }
        [DependentFileProperty]
        public double P5 { get; set; }
        [DependentFileProperty]
        public double P6 { get; set; }
        [DependentFileProperty]
        public double P7 { get; set; }
        [DependentFileProperty]
        public double P8 { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransform"/> class.
        /// Default constructor.
        /// </summary>
        public MeshTransform()
        {
        }
    }
}

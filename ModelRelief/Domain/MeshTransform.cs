// -----------------------------------------------------------------------
// <copyright file="MeshTransform.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using ModelRelief.Services;

    [DependentFiles(typeof(Mesh))]
    public class MeshTransform : DomainModel
    {
        [DependentFileProperty]
        public double Depth { get; set; }
        [DependentFileProperty]
        public double Width { get; set; }

        [DependentFileProperty]
        public double Tau { get; set; }
        [DependentFileProperty]
        public double SigmaGaussianBlur { get; set; }
        [DependentFileProperty]
        public double SigmaGaussianSmooth { get; set; }
        [DependentFileProperty]
        public double LambdaLinearScaling { get; set; }

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

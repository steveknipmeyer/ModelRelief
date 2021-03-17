// -----------------------------------------------------------------------
// <copyright file="MeshTransform.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a MeshTransform.
    /// </summary>
    public class MeshTransform : IModel, IProjectModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "MeshTransform Name")]
        public string Name { get; set; }
        public string Description { get; set; }

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

        public bool P1Enabled { get; set; }
        public double P1 { get; set; }
        public bool P2Enabled { get; set; }
        public double P2 { get; set; }
        public bool P3Enabled { get; set; }
        public double P3 { get; set; }
        public bool P4Enabled { get; set; }
        public double P4 { get; set; }
        public bool P5Enabled { get; set; }
        public double P5 { get; set; }
        public bool P6Enabled { get; set; }
        public double P6 { get; set; }
        public bool P7Enabled { get; set; }
        public double P7 { get; set; }
        public bool P8Enabled { get; set; }
        public double P8 { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        [IgnoreMap]
        public ICollection<Mesh> Meshes { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransform"/> class.
        /// Constructor.
        /// </summary>
        public MeshTransform()
        {
        }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class MeshTransformValidator : AbstractValidator<MeshTransform>
    {
        public MeshTransformValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");

            RuleFor(m => m.Width)
                .GreaterThan(0.0).WithMessage("The Width property must be greater than zero.");

            RuleFor(m => m.Height)
                .GreaterThan(0.0).WithMessage("The Height property must be greater than zero.");

            RuleFor(m => m.Depth)
                .GreaterThan(0.0).WithMessage("The Depth property must be greater than zero.");

            RuleFor(m => m.GradientThreshold)
                .GreaterThan(0.0).WithMessage("The Gradient Threshold property must be greater than zero.");

            RuleFor(m => m.UnsharpGaussianLow)
                .GreaterThan(0.0).WithMessage("The Unsharp Gaussian Low property must be greater than zero.");
            RuleFor(m => m.UnsharpGaussianHigh)
                .GreaterThan(0.0).WithMessage("The Unsharp Gaussian High property must be greater than zero.");
            RuleFor(m => m.UnsharpHighFrequencyScale)
                .GreaterThan(0.0).WithMessage("The Unsharp HighFrequency Scale property must be greater than zero.");

            RuleFor(m => m.SilhouetteEdgeWidth)
                .GreaterThan(0).WithMessage("The Silhouette Edge Width property must be greater than zero.");
            RuleFor(m => m.SilhouetteSigma)
                .GreaterThan(0.0).WithMessage("The Silhouette Sigma property must be greater than zero.");

            RuleFor(m => m.ReliefScale)
                .GreaterThan(0.0).WithMessage("The Relief Scale property must be greater than zero.");
        }
    }

    /// <summary>
    /// AutoMapper mapping profile.
    /// </summary>
    public class MeshTransformMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransformMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public MeshTransformMappingProfile()
        {
            CreateMap<Domain.MeshTransform, MeshTransform>().ReverseMap();
        }
    }
}

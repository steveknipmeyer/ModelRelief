// -----------------------------------------------------------------------
// <copyright file="MeshTransform.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;
    using ModelRelief.Api.V1.Shared.Rest;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a MeshTransform.
    /// </summary>
    public class MeshTransform : IModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "MeshTransform Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public double Width { get; set; }
        public double Height { get; set; }
        public double Depth { get; set; }

        public double GradientThreshold { get; set; }

        public double AttenuationFactor { get; set; }
        public double AttenuationDecay { get; set; }

        public double UnsharpGaussianLow { get; set; }
        public double UnsharpGaussianHigh { get; set; }
        public double UnsharpHighFrequencyScale { get; set; }

        public double P1 { get; set; }
        public double P2 { get; set; }
        public double P3 { get; set; }
        public double P4 { get; set; }
        public double P5 { get; set; }
        public double P6 { get; set; }
        public double P7 { get; set; }
        public double P8 { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class MeshTransformValidator : AbstractValidator<Dto.MeshTransform>
    {
        public MeshTransformValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");

            RuleFor(m => m.Width)
                .GreaterThan(0.0).WithMessage("The Width property must be greated than zero.");

            RuleFor(m => m.Height)
                .GreaterThan(0.0).WithMessage("The Height property must be greated than zero.");

            RuleFor(m => m.Depth)
                .GreaterThan(0.0).WithMessage("The Depth property must be greated than zero.");
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
        CreateMap<Domain.MeshTransform, Dto.MeshTransform>().ReverseMap();
        }
    }
}

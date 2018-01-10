﻿// -----------------------------------------------------------------------
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
    public class MeshTransform : ITGetModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "MeshTransform Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public double Depth { get; set; }
        public double Width { get; set; }

        public double Tau { get; set; }
        public double SigmaGaussianBlur { get; set; }
        public double SigmaGaussianSmooth { get; set; }
        public double LambdaLinearScaling { get; set; }

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

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.");
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
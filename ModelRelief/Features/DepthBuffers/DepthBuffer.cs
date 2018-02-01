// -----------------------------------------------------------------------
// <copyright file="DepthBuffer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a DepthBuffer.
    /// </summary>
    public class DepthBuffer : IGeneratedFileModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "DepthBuffer Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public double Width { get; set; }
        public double Height { get; set; }
        public DepthBufferFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        public int? Model3dId { get; set; }
        public Dto.Model3d Model3d { get; set; }

        public int? CameraId { get; set; }
        public Dto.Camera Camera { get; set; }

        // not exposed in UX; API only
        public DateTime? FileTimeStamp { get; set; }
        public bool FileIsSynchronized { get; set; }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class DepthBufferValidator : AbstractValidator<Dto.DepthBuffer>
    {
        public DepthBufferValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.");

            RuleFor(m => m.Width)
                .GreaterThan(0.0).WithMessage("The Width property must be greated than zero.");

            RuleFor(m => m.Height)
                .GreaterThan(0.0).WithMessage("The Height property must be greated than zero.");

            RuleFor(m => m.Format)
                .NotEmpty().WithMessage("The file format must be provided.");
        }
    }

    /// <summary>
    /// AutoMapper mapping profile.
    /// </summary>
    public class DepthBufferMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBufferMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public DepthBufferMappingProfile()
        {
        CreateMap<Domain.DepthBuffer, Dto.DepthBuffer>().ReverseMap();
        }
    }
}

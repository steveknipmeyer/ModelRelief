// -----------------------------------------------------------------------
// <copyright file="NormalMap.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;
    using ModelRelief.Domain;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a NormalMap.
    /// </summary>
    public class NormalMap : IGeneratedFileModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "NormalMap Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public double Width { get; set; }
        public double Height { get; set; }
        public NormalMapFormat Format { get; set; }
        public NormalMapSpace Space { get; set; }

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
    public class NormalMapValidator : AbstractValidator<Dto.NormalMap>
    {
        public NormalMapValidator()
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
    public class NormalMapMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public NormalMapMappingProfile()
        {
            CreateMap<Domain.NormalMap, Dto.NormalMap>().ReverseMap();
        }
    }
}

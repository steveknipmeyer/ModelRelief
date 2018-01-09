// -----------------------------------------------------------------------
// <copyright file="MappingProfile.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using FluentValidation;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Domain;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a Model3d.
    /// </summary>
public class Model3d : ITGetModel
    {
        public int Id { get; set; }

        [Display(Name = "Model Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public Model3dFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        public int? CameraId { get; set; }
        public Dto.Camera Camera { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Model3d"/> class.
        /// Constructor.
        /// </summary>
        public Model3d()
        {
        }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
public class Model3dValidator : AbstractValidator<Dto.Model3d>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Model3dValidator"/> class.
        /// Constructor.
        /// </summary>
        public Model3dValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property must be defined.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.")
                .MinimumLength(3).WithMessage("The Description must be three or more characters.");

            RuleFor(m => m.Format)
                .NotEmpty().WithMessage("The file format must be provided.");
        }
    }
}

namespace ModelRelief.Features.Models
{
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using FluentValidation;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Domain;

    /// <summary>
    /// AutoMapper mapping profile.
    /// </summary>
public class MappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public MappingProfile()
            {
                CreateMap<Domain.Model3d, Dto.Model3d>().ReverseMap();
            }
    }
}

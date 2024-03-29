﻿// -----------------------------------------------------------------------
// <copyright file="Model3d.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;
    using Microsoft.AspNetCore.Http;
    using ModelRelief.Domain;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a Model3d.
    /// </summary>
    public class Model3d : IFileModel, IProjectModel
    {
        public int Id { get; set; }

        [Display(Name = "Model Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public Model3dFormat Format { get; set; }

        [IgnoreMap]
        [JsonIgnore]
        [Display(Name = "OBJ File (Upload)")]
        public IFormFile FormFile { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        public int? CameraId { get; set; }
        public Camera Camera { get; set; }

        [IgnoreMap]
        public ICollection<DepthBuffer> DepthBuffers { get; set; }
        [IgnoreMap]
        public ICollection<NormalMap> NormalMaps { get; set; }

        // not exposed in UX; API only
        public DateTime? FileTimeStamp { get; set; }

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
    public class Model3dValidator : AbstractValidator<Model3d>
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
        }
    }

    /// <summary>
    /// AutoMapper mapping profile.
    /// </summary>
    public class Model3dMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Model3dMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public Model3dMappingProfile()
        {
            CreateMap<Domain.Model3d, Model3d>().ReverseMap();
        }
    }
}

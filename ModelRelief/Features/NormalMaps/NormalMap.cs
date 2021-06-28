// -----------------------------------------------------------------------
// <copyright file="NormalMap.cs" company="ModelRelief">
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
    /// Represents a DataTransferObject (DTO) for a NormalMap.
    /// </summary>
    public class NormalMap : IGeneratedFileModel, IProjectModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "NormalMap Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }
        public NormalMapFormat Format { get; set; }
        public NormalMapSpace Space { get; set; }

        [IgnoreMap]
        [JsonIgnore]
        [Display(Name = "File (Upload)")]
        public IFormFile FormFile { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        public int? Model3dId { get; set; }
        public Model3d Model3d { get; set; }

        public int? CameraId { get; set; }
        public Camera Camera { get; set; }
        public ICollection<Mesh> Meshes { get; set; }

        // not exposed in UX; API only
        public DateTime? FileTimeStamp { get; set; }
        public bool FileIsSynchronized { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMap"/> class.
        /// Constructor.
        /// </summary>
        public NormalMap()
        {
        }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class NormalMapValidator : AbstractValidator<NormalMap>
    {
        public NormalMapValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.");

            RuleFor(m => m.Width)
                .GreaterThan(0).WithMessage("The Width property must be greater than zero.");

            RuleFor(m => m.Height)
                .GreaterThan(0).WithMessage("The Height property must be greater than zero.");

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
            CreateMap<Domain.NormalMap, NormalMap>().ReverseMap();
        }
    }
}

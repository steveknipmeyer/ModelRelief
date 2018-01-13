// -----------------------------------------------------------------------
// <copyright file="Mesh.cs" company="ModelRelief">
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
    /// Represents a DataTransferObject (DTO) for a Mesh.
    /// </summary>
    public class Mesh : ITGetModel, IGeneratedFile
    {
        public int Id { get; set; }

        [Display(Name = "Mesh Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public MeshFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        public int? CameraId { get; set; }
        public Dto.Camera Camera { get; set; }

        public int? DepthBufferId { get; set; }
        public Dto.DepthBuffer DepthBuffer { get; set; }

        public int? MeshTransformId { get; set; }
        public Dto.MeshTransform MeshTransform { get; set; }

        // not exposed in UX; API only
        public DateTime? FileTimeStamp { get; set; }
        public bool FileIsSynchronized { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Mesh"/> class.
        /// Constructor.
        /// </summary>
        public Mesh()
        {
        }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class MeshValidator : AbstractValidator<Dto.Mesh>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshValidator"/> class.
        /// Constructor.
        /// </summary>
        public MeshValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.")
                .MinimumLength(3).WithMessage("The Description must be three or more characters.");
//              .Must(description => "SLK".Equals(description)).WithMessage("The Description absolutely must be SLK.");

            RuleFor(m => m.Format)
                .NotEmpty().WithMessage("The file format must be provided.");
        }
    }

    /// <summary>
    /// AutoMapper mapping profile.
    /// </summary>
    public class MeshMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public MeshMappingProfile()
        {
            CreateMap<Domain.Mesh, Dto.Mesh>().ReverseMap();
        }
    }
}

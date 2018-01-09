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

    public class DepthBuffer : ITGetModel, IGeneratedFile
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "DepthBuffer Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public DepthBufferFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        public int? ModelId { get; set; }
        public Dto.Model3d Model { get; set; }

        public int? CameraId { get; set; }
        public Dto.Camera Camera { get; set; }

        // not exposed in UX; API only
        public bool FileIsSynchronized { get; set; }
    }

    public class DepthBufferValidator : AbstractValidator<Dto.DepthBuffer>
    {
        public DepthBufferValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.");

            RuleFor(m => m.Format)
                .NotEmpty().WithMessage("The file format must be provided.");
        }
    }
}

namespace ModelRelief.Features.DepthBuffers
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
        CreateMap<Domain.DepthBuffer, Dto.DepthBuffer>().ReverseMap();
        }
    }
}

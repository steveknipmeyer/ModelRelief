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

    public class Project : ITGetModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Project Name")]
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class ProjectValidator : AbstractValidator<Dto.Project>
    {
        public ProjectValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.");
        }
    }
}

namespace ModelRelief.Features.Projects
{
    using AutoMapper;

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
        CreateMap<Domain.Project, Dto.Project>().ReverseMap();
        }
    }
}

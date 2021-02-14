// -----------------------------------------------------------------------
// <copyright file="Project.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a Project.
    /// </summary>
    public class Project : IModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Project Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation Properties
        public int? SettingsId { get; set; }
        public Settings Settings { get; set; }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class ProjectValidator : AbstractValidator<Project>
    {
        public ProjectValidator()
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
    public class ProjectMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProjectMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public ProjectMappingProfile()
        {
        CreateMap<Domain.Project, Project>().ReverseMap();
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="Settings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for Settings.
    /// </summary>
    public class Settings : IModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Settings Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public bool LoggingEnabled { get; set; }
        public bool DevelopmentUI { get; set; }

        public bool ModelViewerExtendedControls { get; set; }
        public bool MeshViewerExtendedControls { get; set; }
        public bool ExtendedCameraControls { get; set; }

        public bool DepthBufferViewVisible { get; set; }
        public bool NormalMapViewVisible { get; set; }

        // Navigation Propertiesa
        [IgnoreMap]
        public ICollection<Project> Projects { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Settings"/> class.
        /// Constructor.
        /// </summary>
        public Settings()
        {
        }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class SettingsValidator : AbstractValidator<Settings>
    {
        public SettingsValidator()
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
    public class SettingsMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public SettingsMappingProfile()
        {
            CreateMap<Domain.Settings, Settings>().ReverseMap();
        }
    }
}

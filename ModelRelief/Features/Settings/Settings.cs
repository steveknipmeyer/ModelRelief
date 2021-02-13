// -----------------------------------------------------------------------
// <copyright file="Settings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
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
        [Display(Name = "Setings Name")]
        public string Name { get; set; }
        public string Description { get; set; }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class SettingsValidator : AbstractValidator<Dto.Settings>
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
        CreateMap<Domain.Settings, Dto.Settings>().ReverseMap();
        }
    }
}

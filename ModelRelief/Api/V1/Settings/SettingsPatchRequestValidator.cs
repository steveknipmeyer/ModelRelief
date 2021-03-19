// -----------------------------------------------------------------------
// <copyright file="SettingsPatchRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Settings
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Settings PatchRequest.
    /// </summary>
    public class SettingsPatchRequestValidator : RequestValidator<PatchRequest<Domain.Settings, Dto.Settings>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsPatchRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public SettingsPatchRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new SettingsValidator());
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="SettingsPostRequestValidator.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Settings
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Settings PostRequest.
    /// </summary>
    public class SettingsPostRequestValidator : RequestValidator<PostRequest<Domain.Settings, Dto.Settings, Dto.Settings>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsPostRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public SettingsPostRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(r => r.NewModel).SetValidator(new SettingsValidator());
        }
    }
}

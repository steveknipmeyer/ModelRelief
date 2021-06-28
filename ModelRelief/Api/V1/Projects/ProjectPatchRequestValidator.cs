// -----------------------------------------------------------------------
// <copyright file="ProjectPatchRequestValidator.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Projects
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Project PatchRequest.
    /// </summary>
    public class ProjectPatchRequestValidator : RequestValidator<PatchRequest<Domain.Project, Dto.Project>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProjectPatchRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ProjectPatchRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new ProjectValidator());
        }
    }
}

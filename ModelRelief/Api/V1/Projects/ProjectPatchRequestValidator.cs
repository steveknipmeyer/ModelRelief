// -----------------------------------------------------------------------
// <copyright file="ProjectPatchRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Projects
{
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Api.V1.Shared.Rest;
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

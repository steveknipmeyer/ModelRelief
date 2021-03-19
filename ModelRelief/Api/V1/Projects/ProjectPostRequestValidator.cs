// -----------------------------------------------------------------------
// <copyright file="ProjectPostRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Projects
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Project PostRequest.
    /// </summary>
    public class ProjectPostRequestValidator : RequestValidator<PostRequest<Domain.Project, Dto.Project, Dto.Project>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProjectPostRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ProjectPostRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(r => r.NewModel).SetValidator(new ProjectValidator());
        }
    }
}

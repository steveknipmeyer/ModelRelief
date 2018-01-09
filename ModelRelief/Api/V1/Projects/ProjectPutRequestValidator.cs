// -----------------------------------------------------------------------
// <copyright file="ProjectPutRequestValidator.cs" company="ModelRelief">
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
    /// Represents a validator for a Project PutRequest.
    /// </summary>
    public class ProjectPutRequestValidator : RequestValidator<PutRequest<Domain.Project, Dto.Project, Dto.Project>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProjectPutRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ProjectPutRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new ProjectValidator());
        }
    }
}

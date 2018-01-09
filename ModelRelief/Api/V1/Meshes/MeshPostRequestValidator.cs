// -----------------------------------------------------------------------
// <copyright file="MeshPostRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Meshes
{
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Mesh PostRequest.
    /// </summary>
    public class MeshPostRequestValidator : RequestValidator<PostRequest<Domain.Mesh, Dto.Mesh, Dto.Mesh>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshPostRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshPostRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(r => r.NewModel).SetValidator(new MeshValidator());
        }
    }
}

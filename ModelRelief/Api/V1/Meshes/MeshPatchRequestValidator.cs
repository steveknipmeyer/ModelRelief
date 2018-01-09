// -----------------------------------------------------------------------
// <copyright file="MeshPatchRequestValidator.cs" company="ModelRelief">
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
    /// Represents a validator for a Mesh PatchRequest.
    /// </summary>
    public class MeshPatchRequestValidator : RequestValidator<PatchRequest<Domain.Mesh, Dto.Mesh>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshPatchRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshPatchRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new MeshValidator());
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="MeshTransformPatchRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.MeshTransforms
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a MeshTransform PatchRequest.
    /// </summary>
    public class MeshTransformPatchRequestValidator : RequestValidator<PatchRequest<Domain.MeshTransform, Dto.MeshTransform>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransformPatchRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshTransformPatchRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new MeshTransformValidator());
        }
    }
}

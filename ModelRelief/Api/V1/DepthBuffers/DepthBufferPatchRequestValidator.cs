// -----------------------------------------------------------------------
// <copyright file="DepthBufferPatchRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.DepthBuffers
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a DepthBuffer PatchRequest.
    /// </summary>
    public class DepthBufferPatchRequestValidator : RequestValidator<PatchRequest<Domain.DepthBuffer, Dto.DepthBuffer>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBufferPatchRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public DepthBufferPatchRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new DepthBufferValidator());
        }
    }
}

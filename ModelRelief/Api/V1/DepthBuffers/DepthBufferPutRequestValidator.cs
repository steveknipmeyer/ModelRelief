// -----------------------------------------------------------------------
// <copyright file="DepthBufferPutRequestValidator.cs" company="ModelRelief">
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
    /// Represents a validator for a DepthBuffer PutRequest.
    /// </summary>
    public class DepthBufferPutRequestValidator : RequestValidator<PutRequest<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBufferPutRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public DepthBufferPutRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new DepthBufferValidator());
        }
    }
}

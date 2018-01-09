// -----------------------------------------------------------------------
// <copyright file="DepthBufferPostRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.DepthBuffers
{
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a DepthBuffer PostRequest.
    /// </summary>
    public class DepthBufferPostRequestValidator : RequestValidator<PostRequest<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBufferPostRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public DepthBufferPostRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(m => m.NewModel).SetValidator(new DepthBufferValidator());
        }
    }
}

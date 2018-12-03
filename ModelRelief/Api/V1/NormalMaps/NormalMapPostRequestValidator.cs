// -----------------------------------------------------------------------
// <copyright file="NormalMapPostRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.NormalMaps
{
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a NormalMap PostRequest.
    /// </summary>
    public class NormalMapPostRequestValidator : RequestValidator<PostRequest<Domain.NormalMap, Dto.NormalMap, Dto.NormalMap>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapPostRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public NormalMapPostRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(m => m.NewModel).SetValidator(new NormalMapValidator());
        }
    }
}

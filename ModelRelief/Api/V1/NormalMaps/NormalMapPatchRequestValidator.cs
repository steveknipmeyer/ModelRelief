// -----------------------------------------------------------------------
// <copyright file="NormalMapPatchRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.NormalMaps
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a NormalMap PatchRequest.
    /// </summary>
    public class NormalMapPatchRequestValidator : RequestValidator<PatchRequest<Domain.NormalMap, Dto.NormalMap>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapPatchRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public NormalMapPatchRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new NormalMapValidator());
        }
    }
}

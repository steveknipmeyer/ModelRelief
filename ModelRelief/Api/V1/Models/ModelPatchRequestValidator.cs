// -----------------------------------------------------------------------
// <copyright file="ModelPatchRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Models
{
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Model3d PatchRequest.
    /// </summary>
    public class ModelPatchRequestValidator : RequestValidator<PatchRequest<Domain.Model3d, Dto.Model3d>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelPatchRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ModelPatchRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new Model3dValidator());
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="CameraPatchRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Cameras
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Camera PatchRequest.
    /// </summary>
    public class CameraPatchRequestValidator : RequestValidator<PatchRequest<Domain.Camera, Dto.Camera>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CameraPatchRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public CameraPatchRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new CameraValidator());
        }
    }
}

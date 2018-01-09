// -----------------------------------------------------------------------
// <copyright file="CameraPutRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Cameras
{
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Camera PutRequest.
    /// </summary>
    public class CameraPutRequestValidator : RequestValidator<PutRequest<Domain.Camera, Dto.Camera, Dto.Camera>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CameraPutRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public CameraPutRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new CameraValidator());
        }
    }
}

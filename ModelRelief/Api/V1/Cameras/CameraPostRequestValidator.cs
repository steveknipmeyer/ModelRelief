// -----------------------------------------------------------------------
// <copyright file="CameraPostRequestValidator.cs" company="ModelRelief">
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
    /// Represents a validator for a Camera PostRequest.
    /// </summary>
    public class CameraPostRequestValidator : RequestValidator<PostRequest<Domain.Camera, Dto.Camera, Dto.Camera>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CameraPostRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public CameraPostRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(r => r.NewModel).SetValidator(new CameraValidator());
        }
    }
}

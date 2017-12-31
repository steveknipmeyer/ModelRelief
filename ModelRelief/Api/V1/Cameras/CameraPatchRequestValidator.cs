// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using FluentValidation;
using FluentValidation.Validators;
using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V1.Cameras
{
    /// <summary>
    /// Represents a validator for a Camera PatchRequest.
    /// </summary>
    public class CameraPatchRequestValidator : RequestValidator<PatchRequest<Domain.Camera, Dto.Camera>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public CameraPatchRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new CameraValidator());
        }
    }
}
 
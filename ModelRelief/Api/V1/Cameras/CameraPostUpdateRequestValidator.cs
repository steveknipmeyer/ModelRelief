// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V1.Cameras
{
    /// <summary>
    /// Represents a validator for a Camera PostUpdateRequest.
    /// </summary>
    public class CameraPostUpdateRequestValidator : RequestValidator<PostUpdateRequest<Domain.Camera, Dto.Camera, Dto.Camera>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public CameraPostUpdateRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new CameraValidator());
        }
    }
}
 
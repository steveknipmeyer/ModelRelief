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
    /// Represents a validator for a Camera PostAddRequest.
    /// </summary>
    public class CameraPostAddRequestValidator : RequestValidator<PostAddRequest<Domain.Camera, Dto.Camera, Dto.Camera>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public CameraPostAddRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(r=> r.NewModel).SetValidator(new CameraValidator());
        }
    }
}
 
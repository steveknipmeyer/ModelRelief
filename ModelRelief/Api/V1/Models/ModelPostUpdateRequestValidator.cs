// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V1.Models
{
    /// <summary>
    /// Represents a validator for a Model3d PostUpdateRequest.
    /// </summary>
    public class ModelPostUpdateRequestValidator : RequestValidator<PostUpdateRequest<Domain.Model3d, Dto.Model3d, Dto.Model3d>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ModelPostUpdateRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new Model3dValidator());
        }
    }
}
 
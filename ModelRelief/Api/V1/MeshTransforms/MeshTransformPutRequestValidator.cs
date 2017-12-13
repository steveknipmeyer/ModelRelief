// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V1.MeshTransforms
{
    /// <summary>
    /// Represents a validator for a MeshTransform PutRequest.
    /// </summary>
    public class MeshTransformPutRequestValidator : RequestValidator<PutRequest<Domain.MeshTransform, Dto.MeshTransform>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshTransformPutRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new MeshTransformValidator());
        }
    }
}
 
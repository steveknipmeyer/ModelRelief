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
    /// Represents a validator for a MeshTransform PostAddRequest.
    /// </summary>
    public class MeshTransformPostAddRequestValidator : RequestValidator<PostAddRequest<Domain.MeshTransform, Dto.MeshTransform, Dto.MeshTransform>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshTransformPostAddRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(r=> r.NewModel).SetValidator(new MeshTransformValidator());
        }
    }
}
 
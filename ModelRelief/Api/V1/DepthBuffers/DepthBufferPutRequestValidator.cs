// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V1.DepthBuffers
{
    /// <summary>
    /// Represents a validator for a DepthBuffer PutRequest.
    /// </summary>
    public class DepthBufferPutRequestValidator : RequestValidator<PutRequest<Domain.DepthBuffer, Dto.DepthBuffer>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public DepthBufferPutRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new DepthBufferValidator());
        }
    }
}
 
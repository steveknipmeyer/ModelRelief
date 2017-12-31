// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V1.DepthBuffers
{
    /// <summary>
    /// Represents a validator for a DepthBuffer PostRequest.
    /// </summary>
    public class DepthBufferPostRequestValidator : RequestValidator<PostRequest<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public DepthBufferPostRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(m => m.NewModel).SetValidator(new DepthBufferValidator());
        }
    }
}
 
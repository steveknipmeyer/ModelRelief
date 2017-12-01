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
    /// Represents a validator for a DepthBuffer PostAddRequest.
    /// </summary>
    public class DepthBufferPostAddRequestValidator : RequestValidator<PostAddRequest<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public DepthBufferPostAddRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(m => m.NewModel).SetValidator(new DepthBufferValidator());
        }
    }
}
 
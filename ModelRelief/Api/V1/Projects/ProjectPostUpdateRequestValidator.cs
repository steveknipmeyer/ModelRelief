// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V1.Projects
{
    /// <summary>
    /// Represents a validator for a Project PostUpdateRequest.
    /// </summary>
    public class ProjectPostUpdateRequestValidator : RequestValidator<PostUpdateRequest<Domain.Project, Dto.Project, Dto.Project>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ProjectPostUpdateRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new ProjectValidator());
        }
    }
}
 
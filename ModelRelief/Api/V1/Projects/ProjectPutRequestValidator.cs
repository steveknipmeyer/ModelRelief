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
    /// Represents a validator for a Project PutRequest.
    /// </summary>
    public class ProjectPutRequestValidator : RequestValidator<PutRequest<Domain.Project, Dto.Project>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ProjectPutRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new ProjectValidator());
        }
    }
}
 
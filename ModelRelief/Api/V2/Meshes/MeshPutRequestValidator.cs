// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using FluentValidation;
using FluentValidation.Validators;
using ModelRelief.Api.V2.Shared;
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V2.Meshes
{
    /// <summary>
    /// Represents a validator for a Mesh PutRequest.
    /// </summary>
    public class MeshPutRequestValidator : RequestValidator<PutRequest<Domain.Mesh, Dto.Mesh>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshPutRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
           RuleFor(m => m.UpdatedModel).SetValidator(new MeshValidator());
        }
    }
}
 
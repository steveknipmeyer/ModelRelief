// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Dto;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Meshes
{
    /// <summary>
    /// Represents a validator for a Mesh PostAddRequest.
    /// </summary>
    public class MeshPostAddRequestValidator : RequestValidator<PostAddRequest<Domain.Mesh, Dto.Mesh, Dto.Mesh>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshPostAddRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(r=> r.NewModel).SetValidator(new MeshValidator());
        }
    }
}
 
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using FluentValidation;
using ModelRelief.Api.V2.Shared;
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Database;

namespace ModelRelief.Api.V2.Meshes
{
    /// <summary>
    /// Represents a validator for a Mesh PostRequest.
    /// </summary>
    public class MeshPostRequestValidator : RequestValidator<PostRequest<Domain.Mesh, Dto.Mesh, Dto.Mesh>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshPostRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(m => m.NewEntity.Name)
                .NotNull().WithMessage("The very important Name property is required.");
         
            RuleFor(m => m.NewEntity.Description)
                .NotNull().WithMessage("The Description property is required.")
                .MinimumLength(3).WithMessage("The Description must be three or more characters.");
//              .Must(description => "SLK".Equals(description)).WithMessage("The Description absolutely must be SLK.");

            RuleFor(m => m.NewEntity.Format)
                .NotEmpty().WithMessage("The file format must be provided.");
        }
    }
}
 
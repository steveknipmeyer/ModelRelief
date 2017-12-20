﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using ModelRelief.Api.V1.Shared;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Dto;

namespace ModelRelief.Api.V1.Models
{
    /// <summary>
    /// Represents a validator for a Model3d PostRequest.
    /// </summary>
    public class ModelPostRequestValidator : RequestValidator<PostRequest<Domain.Model3d, Dto.Model3d, Dto.Model3d>>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ModelPostRequestValidator (ModelReliefDbContext dbContext)
            : base (dbContext)
        {
            RuleFor(r=> r.NewModel).SetValidator(new Model3dValidator());
        }
    }
}
 
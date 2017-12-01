// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ModelRelief.Dto
{
    /// <summary>
    /// POST file model.
    /// </summary>
    public class PostFile
    {
        public byte[] Raw { get; set;}
        
        /// <summary>
        /// Constructor
        /// </summary>
        public PostFile ()
        {
        }
    }

    public class PostFileValidator : AbstractValidator<Dto.PostFile>
    {
        public PostFileValidator()
        {
            RuleFor(m => m.Raw)
                .NotNull().WithMessage("An array of bytes is required..");
        }
    }
}

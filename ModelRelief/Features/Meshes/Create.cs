// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using FluentValidation.Attributes;
using MediatR;
using Microsoft.AspNetCore.Mvc.Rendering;
using ModelRelief.Database;
using ModelRelief.Domain;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    public class Create
    {
        public class Command : Dto.Mesh, IRequest
        {
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
            RuleFor(m => m.Description).NotEqual("Stephen").WithMessage("The Description cannot be Stephen.");
            }
        }

        public class CommandHandler : IAsyncRequestHandler<Command>
        {
            private readonly ModelReliefDbContext _dbContext;

            public CommandHandler(ModelReliefDbContext dbContext)
                {
                _dbContext = dbContext;
            }

            public async Task Handle(Command message)
            {
                var mesh = Mapper.Map<Dto.Mesh, Domain.Mesh>(message);

                await _dbContext.Meshes.AddAsync(mesh);
            }
        }
     }
}

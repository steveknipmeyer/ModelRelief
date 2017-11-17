﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
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
        public class Command : IRequest
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public MeshFormat Format { get; set; }

            // Navigation Properties
            public int? ProjectId { get; set; }
            public Project Project { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
            RuleFor(m => m.Name).NotNull().MinimumLength(4).WithMessage("The Name property is required..");
            RuleFor(m => m.Description).NotNull().WithMessage("The Description property is required.");
            RuleFor(m => m.Format).NotEmpty().WithMessage("Choose a file format value from the list.");
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
                var mesh = Mapper.Map<Command, Domain.Mesh>(message);

                await _dbContext.Meshes.AddAsync(mesh);
            }
        }
     }
}

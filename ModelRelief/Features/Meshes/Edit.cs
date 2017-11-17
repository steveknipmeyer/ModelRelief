// ------------------------------------------------------------------------// 
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
    public class Edit
    {
        public class Query : IRequest<Edit.Command>
        {
            public int? Id { get; set; }
        }

        public class Command : IRequest
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public MeshFormat Format { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(m => m.Id).NotNull().WithMessage("The Id property is required..");
            }
        }

        public class QueryHandler : IAsyncRequestHandler<Query, Edit.Command>
        {
            private readonly ModelReliefDbContext _dbContext;

            public QueryHandler(ModelReliefDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<Edit.Command>  Handle(Query message)
            {
                var mesh =  await _dbContext.Meshes.FindAsync (message.Id);               
                return Mapper.Map<Domain.Mesh, Edit.Command> (mesh);
            }
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

        public class CommandHandler : IRequestHandler<Command>
        {
            private readonly ModelReliefDbContext _dbContext;

            public CommandHandler(ModelReliefDbContext dbContext)
                {
                _dbContext = dbContext;
            }

            public void Handle(Edit.Command message)
            {
                var mesh = Mapper.Map<Edit.Command, Domain.Mesh>(message);

                _dbContext.Meshes.Update(mesh);
            }
        }
     }
}

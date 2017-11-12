// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    public class Delete
    {
        public class Query : IRequest<Delete.Command>
        {
            public int? Id {get; set;}
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(m => m.Id).NotNull();
            }
        }

        public class QueryHandler : IAsyncRequestHandler<Query, Delete.Command>
        {           
            private readonly ModelReliefDbContext _dbContext;
            private readonly IMapper _mapper;

            public QueryHandler(ModelReliefDbContext dbContext, IMapper mapper)
            {
                _dbContext = dbContext;
                _mapper    = mapper;
            }

            public async Task<Delete.Command> Handle (Query message)
            {
                var mesh = await _dbContext.Meshes.Where (m => m.Id == message.Id).FirstOrDefaultAsync();
                return _mapper.Map<Domain.Mesh, Delete.Command>(mesh);
            }
        }

        public class Command : IRequest
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }

            public MeshFormat Format { get; set; }      
            public string Path { get; set; }
        }

        public class CommandHandler : IAsyncRequestHandler<Delete.Command>
        {
            private readonly ModelReliefDbContext _dbContext;

            public CommandHandler(ModelReliefDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task Handle(Command message)
            {
                var mesh = await _dbContext.Meshes.FindAsync(message.Id);

                _dbContext.Meshes.Remove(mesh);
            }
        }
    }
}
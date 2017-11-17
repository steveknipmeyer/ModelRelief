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
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    public class Details
    {
        public class Query : IRequest<Details.Mesh>
        {
            public int? Id { get; set; }
        }
    
        public class Mesh
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }

            public MeshFormat Format { get; set; }      
            public string Path { get; set; }

            // Navigation Properties
            public Project Project { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(m => m.Id).NotNull();
            }
        }

        public class QueryHandler : IAsyncRequestHandler<Query, Details.Mesh>
        {
            private readonly ModelReliefDbContext _dbContext;

            public QueryHandler(ModelReliefDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<Details.Mesh> Handle(Query message)
            {
                var mesh =  await _dbContext.Meshes
                    .Include(m => m.Project)
                    .SingleOrDefaultAsync (m => m.Id == message.Id);

                return Mapper.Map<Domain.Mesh, Details.Mesh> (mesh);
            }
        }
    }
}
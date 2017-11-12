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
        }

        public class Validator : AbstractValidator<Query>
        {
            public Validator()
            {
                RuleFor(m => m.Id).NotNull();
            }
        }

        public class Handler : IAsyncRequestHandler<Query, Details.Mesh>
        {
            private readonly ModelReliefDbContext _dbContext;
            private readonly IMapper _mapper;

            public Handler(ModelReliefDbContext dbContext, IMapper mapper)
            {
                _dbContext = dbContext;
                _mapper = mapper;
            }

            public async Task<Details.Mesh> Handle(Query message)
            {
                var mesh =  await _dbContext.Meshes.FindAsync (message.Id);               
                return _mapper.Map<Domain.Mesh, Details.Mesh> (mesh);
            }
        }
    }
}
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    public class Index
    {
        public class Query : IRequest<List<Mesh>>
        {
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

        public class QueryHandler : IAsyncRequestHandler<Query, List<Mesh>>
        {
            private readonly ModelReliefDbContext _dbContext;

            public QueryHandler(ModelReliefDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<List<Mesh>> Handle(Query message)
            {
                var meshes =  await _dbContext.Meshes
                    .Include(m => m.Project).ToListAsync();

                var meshList = new List<Mesh>();
                foreach (Domain.Mesh mesh in meshes)
                    {
                    meshList.Add( Mapper.Map<Domain.Mesh, Index.Mesh> (mesh));
                    }
                
                return meshList;
            }
        }
    }
}
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Features.Models
{
    public class Index
    {
        public class Query : IRequest<List<Dto.Model3d>>
        {
        }

        public class QueryHandler : IAsyncRequestHandler<Query, List<Dto.Model3d>>
        {
            private readonly ModelReliefDbContext _dbContext;

            public QueryHandler(ModelReliefDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<List<Dto.Model3d>> Handle(Query message)
            {
                var models =  await _dbContext.Models
                    .Include(m => m.Project)
                    .Include(m => m.Camera)
                    .ToListAsync();

                var modelsList = new List<Dto.Model3d>();
                foreach (Domain.Model3d model in models)
                    {
                    modelsList.Add( Mapper.Map<Domain.Model3d, Dto.Model3d> (model));
                    }
                
                return modelsList;
            }
        }
    }
}
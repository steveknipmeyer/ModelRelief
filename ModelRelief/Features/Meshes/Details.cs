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
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    public class Details
    {
        public class Query : IRequest<Dto.Mesh>
        {
            public int? Id { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(m => m.Id).NotNull();
            }
        }

        public class QueryHandler : IAsyncRequestHandler<Query, Dto.Mesh>
        {
            private readonly ModelReliefDbContext _dbContext;

            public QueryHandler(ModelReliefDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<Dto.Mesh> Handle(Query message)
            {
                var mesh =  await _dbContext.Meshes
                    .Include(m => m.Project)
                    .Include(m => m.Camera)
                    .Include(m => m.DepthBuffer)
                    .Include(m => m.MeshTransform)
                    .SingleOrDefaultAsync (m => m.Id == message.Id);

                return Mapper.Map<Domain.Mesh, Dto.Mesh> (mesh);
            }
        }
    }
}
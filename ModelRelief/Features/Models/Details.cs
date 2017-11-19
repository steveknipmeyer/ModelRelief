// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using FluentValidation;
using FluentValidation.Attributes;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using System.Threading.Tasks;

namespace ModelRelief.Features.Models
{
    public class Details
    {
        public class Query : IRequest<Dto.Model3d>
        {
            public int? Id { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(m => m.Id).NotNull().WithMessage("Model ID cannot be null.");
            }
        }

        public class QueryHandler : IAsyncRequestHandler<Query, Dto.Model3d>
        {
            private readonly ModelReliefDbContext _dbContext;

            public QueryHandler(ModelReliefDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<Dto.Model3d> Handle(Query message)
            {
                var model =  await _dbContext.Models
                    .Include(m => m.Project)
                    .Include(m => m.Camera)
                    .SingleOrDefaultAsync (m => m.Id == message.Id);

                return Mapper.Map<Domain.Model3d, Dto.Model3d> (model);
            }
        }
    }
}
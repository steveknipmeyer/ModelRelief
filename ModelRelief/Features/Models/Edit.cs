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

namespace ModelRelief.Features.Models
{
    public class Edit
    {
        public class Query : IRequest<Dto.Model3d>
        {
            public int? Id { get; set; }
        }

        public class Command : Dto.Model3d, IRequest
        {
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(m => m.Id).NotNull().WithMessage("The Id property is required..");
            }
        }

        public class QueryHandler : IAsyncRequestHandler<Query, Dto.Model3d>
        {
            private readonly ModelReliefDbContext _dbContext;

            public QueryHandler(ModelReliefDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<Dto.Model3d>  Handle(Query message)
            {
                var model =  await _dbContext.Models
                    .Include(m => m.Project)
                    .Include(m => m.Camera)
                    .SingleOrDefaultAsync (m => m.Id == message.Id);

                return Mapper.Map<Domain.Model3d, Dto.Model3d> (model);
            }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
            // chain rules from base class
            Include( new Dto.Model3dValidator());
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
                var model =  await _dbContext.Models.FindAsync (message.Id);               
                Mapper.Map<Dto.Model3d, Domain.Model3d>(message, model);

                _dbContext.Models.Update(model);
            }
        }
     }
}

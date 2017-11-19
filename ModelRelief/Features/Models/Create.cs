// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using MediatR;
using ModelRelief.Database;
using System.Threading.Tasks;

namespace ModelRelief.Features.Models
{
    public class Create
    {
        public class Command : Dto.Model3d, IRequest
        {
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
                var model = Mapper.Map<Dto.Model3d, Domain.Model3d>(message);

                await _dbContext.Models.AddAsync(model);
            }
        }
     }
}

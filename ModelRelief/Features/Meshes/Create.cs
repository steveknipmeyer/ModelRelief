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

namespace ModelRelief.Features.Meshes
{
    public class Create
    {
        public class Command : Dto.Mesh, IRequest
        {
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
            // chain rules from base class
            // https://stackoverflow.com/questions/30730937/c-sharp-fluentvalidation-for-a-hierarchy-of-classes
            Include( new Dto.MeshValidator());
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
                var mesh = Mapper.Map<Dto.Mesh, Domain.Mesh>(message);

                await _dbContext.Meshes.AddAsync(mesh);
            }
        }
     }
}

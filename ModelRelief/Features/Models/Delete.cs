// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ModelRelief.Database;
using ModelRelief.Infrastructure;
using System;
using System.Threading.Tasks;

namespace ModelRelief.Features.Models
{
    public class Delete
    {
        public class Query : IRequest<Dto.Model3d>
        {
            public int? Id {get; set;}
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(m => m.Id).NotNull().WithMessage("Model ID cannot be null");
            }
        }

        public class QueryHandler : IAsyncRequestHandler<Query, Dto.Model3d>
        {           
            private readonly ModelReliefDbContext _dbContext;
            private readonly IMapper _mapper;

            public QueryHandler(ModelReliefDbContext dbContext, IMapper mapper)
            {
                _dbContext = dbContext;
                _mapper    = mapper;
            }

            public async Task<Dto.Model3d> Handle (Query message)
            {
                var model =  await _dbContext.Models
                    .Include(m => m.Project)
                    .Include(m => m.Camera)
                    .SingleOrDefaultAsync (m => m.Id == message.Id);

                return _mapper.Map<Domain.Model3d, Dto.Model3d>(model);
            }
        }

        public class Command : IRequest
        {
            public int Id { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(m => m.Id).NotNull().WithMessage("Model ID cannot be null");
            }
        }

        public class CommandHandler : IAsyncRequestHandler<Command>
        {
            private readonly ModelReliefDbContext    _dbContext;
            private readonly ILogger<Delete.Command> _logger;
            private readonly IHostingEnvironment     _hostingEnvironment;

            public CommandHandler(ModelReliefDbContext dbContext, ILogger<Delete.Command> logger, IHostingEnvironment hostingEnvironment)
            {
                _dbContext = dbContext;
                _logger = logger;
                _hostingEnvironment = hostingEnvironment;
            }

            public async Task Handle(Command message)
            {
                var model = await _dbContext.Models.FindAsync(message.Id);
                if (model == null)
                    return;

                try
                {
                    if (String.IsNullOrEmpty(model.Path))
                        return;
#if false
                    // N.B. verify that model.Path is <below> store/user!
                    var absolutePath = $"{_hostingEnvironment.WebRootPath}{model.Path}";
                    Files.DeleteFolder(absolutePath, true);
#endif
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An exception occurred deleting a folder: {0}", model.Path);
                }

                _dbContext.Models.Remove(model);
            }
        }
    }
}
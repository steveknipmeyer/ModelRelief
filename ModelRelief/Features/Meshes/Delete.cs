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
using ModelRelief.Domain;
using ModelRelief.Infrastructure;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    public class Delete
    {
        public class Query : IRequest<Dto.Mesh>
        {
            public int? Id {get; set;}
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
            private readonly IMapper _mapper;

            public QueryHandler(ModelReliefDbContext dbContext, IMapper mapper)
            {
                _dbContext = dbContext;
                _mapper    = mapper;
            }

            public async Task<Dto.Mesh> Handle (Query message)
            {
                var mesh =  await _dbContext.Meshes
                    .Include(m => m.Project)
                    .Include(m => m.Camera)
                    .Include(m => m.DepthBuffer)
                    .Include(m => m.MeshTransform)
                    .SingleOrDefaultAsync (m => m.Id == message.Id);

                return _mapper.Map<Domain.Mesh, Dto.Mesh>(mesh);
            }
        }

        public class Command : IRequest
        {
            public int Id { get; set; }
        }

        public class CommandHandler : IAsyncRequestHandler<Command>
        {
            private readonly ModelReliefDbContext _dbContext;
            private readonly ILogger<PipelineLogger> _logger;
            private readonly IHostingEnvironment _hostingEnvironment;

            public CommandHandler(ModelReliefDbContext dbContext, ILogger<PipelineLogger> logger, IHostingEnvironment hostingEnvironment)
            {
                _dbContext = dbContext;
                _logger = logger;
                _hostingEnvironment = hostingEnvironment;
            }

            public async Task Handle(Command message)
            {
                var mesh = await _dbContext.Meshes.FindAsync(message.Id);
                if (mesh == null)
                    return;

                try
                {
                    if (String.IsNullOrEmpty(mesh.Path))
                        return;
#if false
                    // N.B. verify that mesh.Path is <below> store/user!
                    var absolutePath = $"{_hostingEnvironment.WebRootPath}{mesh.Path}";
                    Files.DeleteFolder(absolutePath, true);
#endif
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An exception occurred deleting a folder: {0}", mesh.Path);
                }

                _dbContext.Meshes.Remove(mesh);
            }
        }
    }
}
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
            private readonly IModelsProvider _modelsProvider;
            private readonly IMapper _mapper;

            public Handler(IModelsProvider modelsProvider, IMapper mapper)
            {
                _modelsProvider = modelsProvider;
                _mapper = mapper;
            }

            public async Task<Details.Mesh> Handle(Query message)
            {
                // prevent async (no await) warning
                //https://stackoverflow.com/questions/44096253/await-task-completedtask-for-what
                await Task.CompletedTask;

                var mesh =  _modelsProvider.Meshes.Find (message.Id?? 0);               
                return _mapper.Map<Domain.Mesh, Details.Mesh> (mesh);
            }
        }
    }
}
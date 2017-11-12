﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    public class Index
    {
        public class Query : IRequest<List<Mesh>>
        {
        // How is the model binding done?
        }
    
        public class Mesh
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }

            public MeshFormat Format { get; set; }      
            public string Path { get; set; }
        }

        public class Handler : IAsyncRequestHandler<Query, List<Mesh>>
        {
            private readonly IModelsProvider _modelsProvider;
            private readonly IMapper _mapper;

            public Handler(IModelsProvider modelsProvider, IMapper mapper)
            {
                _modelsProvider = modelsProvider;
                _mapper = mapper;
            }

            public async Task<List<Mesh>> Handle(Query message)
            {
                // prevent async (no await) warning
                //https://stackoverflow.com/questions/44096253/await-task-completedtask-for-what
                await Task.CompletedTask;

                var meshes =  _modelsProvider.Meshes.GetAll();
                var meshList = new List<Mesh>();
                foreach (Domain.Mesh mesh in meshes)
                    {
                    meshList.Add( _mapper.Map<Domain.Mesh, Index.Mesh> (mesh));
                    }
                
                return meshList;
            }
        }
    }
}
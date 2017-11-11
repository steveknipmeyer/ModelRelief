// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using ModelRelief.Database;
using ModelRelief.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Services;

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

            public Handler(IModelsProvider modelsProvider)
            {
                _modelsProvider = modelsProvider;
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
                    meshList.Add (new Mesh() {Id = mesh.Id, Name = mesh.Name, Description = mesh.Description, Format = mesh.Format, Path = mesh.Path});
                    }
                return meshList;
            }
        }
    }
}
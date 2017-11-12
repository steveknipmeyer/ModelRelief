﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using ModelRelief.Api.V1.DepthBuffers;
using ModelRelief.Api.V1.Meshes;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1.Meshes
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<MeshPutModel, Domain.Mesh>(MemberList.Source);
        }
    }
}
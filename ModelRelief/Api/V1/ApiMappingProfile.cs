// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using ModelRelief.Api.V1.DepthBuffers;
using ModelRelief.Api.V1.Meshes;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1
{
    public class ApiMappingProfile : Profile
    {
        public ApiMappingProfile()
        {
            CreateMap<MeshPutModel,        Mesh>(MemberList.Source);
            CreateMap<DepthBufferPutModel, DepthBuffer>(MemberList.Source);
        }
    }
}
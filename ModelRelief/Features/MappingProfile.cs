// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using ModelRelief.Api.V1;
using ModelRelief.Domain;

namespace ModelRelief.Features
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<MeshPutModel,        Mesh>(MemberList.Source);
            CreateMap<DepthBufferPutModel, DepthBuffer>(MemberList.Source);
        }
    }
}
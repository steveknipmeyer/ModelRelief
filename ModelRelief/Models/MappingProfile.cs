// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using ModelRelief.Models;

namespace ModelRelief.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<MeshPutRequest, Mesh>(MemberList.Source);
        }
    }
}
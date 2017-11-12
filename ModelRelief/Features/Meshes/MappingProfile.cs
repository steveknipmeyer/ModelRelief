// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using ModelRelief.Domain;

namespace ModelRelief.Features.Meshes
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
            {
            CreateMap<Domain.Mesh, Details.Mesh>().ReverseMap();
            CreateMap<Domain.Mesh, Index.Mesh>().ReverseMap();
            }
    }
}

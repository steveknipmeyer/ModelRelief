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
            CreateMap<Domain.Mesh, Index.Mesh>();
            CreateMap<Domain.Mesh, Details.Mesh>();
            CreateMap<Create.Command, Domain.Mesh>(MemberList.Source);
            CreateMap<Domain.Mesh, Edit.Command>().ReverseMap();
            CreateMap<Domain.Mesh, Delete.Command>();
        }
    }
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using ModelRelief.Domain;

namespace ModelRelief.Features.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
            {
            CreateMap<Domain.Model3d, Model3dEditViewModel>().ReverseMap();
            }
    }
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;

using ModelRelief.Domain;
using ModelRelief.Features.Model;

namespace ModelRelief.Services
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
            {
            CreateMap<Model3d, Model3dEditViewModel>().ReverseMap();
            }
    }
}

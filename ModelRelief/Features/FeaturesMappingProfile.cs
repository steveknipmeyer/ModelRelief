// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;

using ModelRelief.Domain;
using ModelRelief.Features.Model;

namespace ModelRelief.Features
{
    public class FeaturesMappingProfile : Profile
    {
        public FeaturesMappingProfile() 
            {
            CreateMap<Model3d, Model3dEditViewModel>().ReverseMap();
            }
    }
}

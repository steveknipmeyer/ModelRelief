using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using AutoMapper;

using ModelRelief.Entities;
using ModelRelief.ViewModels;

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

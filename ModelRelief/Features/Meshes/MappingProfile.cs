// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Dto
{
    public class Mesh : IIdModel
    {
        public int Id { get; set; }

        [Display (Name = "Mesh Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public MeshFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        public int? CameraId { get; set; }
        public Dto.Camera Camera { get; set; }

        public int? DepthBufferId { get; set; }
        public Dto.DepthBuffer DepthBuffer { get; set; }

        public int? MeshTransformId { get; set; }
        public Dto.MeshTransform MeshTransform { get; set; }
    }

    public class MeshValidator : AbstractValidator<Dto.Mesh>
    {
        public MeshValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");
         
            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.")
                .MinimumLength(3).WithMessage("The Description must be three or more characters.");
//              .Must(description => "SLK".Equals(description)).WithMessage("The Description absolutely must be SLK.");

            RuleFor(m => m.Format)
                .NotEmpty().WithMessage("The file format must be provided.");
        }

        private async Task<bool> IsOwned<TEntity> (ModelReliefDbContext dbContext, int id, string userId)
            where TEntity : DomainModel
        {
            var domainModel = await dbContext.Set<TEntity>()
                        .Where(m => (m.Id == id) && 
                                    (m.UserId == userId))
                        .SingleOrDefaultAsync();
            return domainModel != null;
        }
    }
}

namespace ModelRelief.Features.Meshes
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<Domain.Mesh, Dto.Mesh>().ReverseMap();
        }
    }
}

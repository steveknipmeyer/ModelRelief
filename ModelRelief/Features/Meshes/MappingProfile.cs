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
    /// <summary>
    /// Common interface for all TGetModel types.
    /// </summary>
    public interface ITGetModel
    {
        int Id { get; set; }

        string Name { get; set; }
        string Description { get; set; }
    }

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a Mesh.
    /// </summary>
    public class Mesh : IIdModel, ITGetModel
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

        /// <summary>
        /// Constructor.
        /// </summary>
        public Mesh()
        {
        }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class MeshValidator : AbstractValidator<Dto.Mesh>
    {
        /// <summary>
        /// Constructor.
        /// </summary>
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
    }
}

namespace ModelRelief.Features.Meshes
{
    /// <summary>
    /// AutoMapper mapping profile.
    /// </summary>
    public class MappingProfile : Profile
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        public MappingProfile() 
        {
            CreateMap<Domain.Mesh, Dto.Mesh>().ReverseMap();
        }
    }
}

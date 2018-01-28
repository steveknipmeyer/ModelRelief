// -----------------------------------------------------------------------
// <copyright file="Camera.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentValidation;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a Camera.
    /// </summary>
    public class Camera : IModel
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Camera Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public StandardView StandardView { get; set; }
        public double FieldOfView { get; set; }

        public double Near { get; set; }
        public double Far { get; set; }
        [Display(Name = "Bounded")]
        public bool BoundClippingPlanes { get; set; }

        [Display(Name = "P(x)")]
        public double PositionX { get; set; }
        [Display(Name = "P(y)")]
        public double PositionY { get; set; }
        [Display(Name = "P(z)")]
        public double PositionZ { get; set; }

        [Display(Name = "Target(x)")]
        public double LookAtX { get; set; }
        [Display(Name = "Target(y)")]
        public double LookAtY { get; set; }
        [Display(Name = "Target(z)")]
        public double LookAtZ { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Camera"/> class.
        /// Constructor.
        /// </summary>
        public Camera()
        {
        }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class CameraValidator : AbstractValidator<Dto.Camera>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CameraValidator"/> class.
        /// Constructor.
        /// </summary>
        public CameraValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property is required.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.");
        }
    }

    /// <summary>
    /// AutoMapper mapping profile.
    /// </summary>
    public class CameraMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CameraMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public CameraMappingProfile()
        {
            CreateMap<Domain.Camera, Dto.Camera>().ReverseMap();
        }
    }
}

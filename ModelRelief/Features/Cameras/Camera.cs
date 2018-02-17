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

        public double FieldOfView { get; set; }
        [Display(Name = "Aspect Ratio")]
        public double AspectRatio { get; set; }
        public double Near { get; set; }
        public double Far { get; set; }

        [Display(Name = "Px")]
        public double PositionX { get; set; }
        [Display(Name = "Py")]
        public double PositionY { get; set; }
        [Display(Name = "Pz")]
        public double PositionZ { get; set; }

        [Display(Name = "Ex")]
        public double EulerX { get; set; }
        [Display(Name = "Ey")]
        public double EulerY { get; set; }
        [Display(Name = "Ez")]
        public double EulerZ { get; set; }
        [Display(Name = "Theta")]
        public double Theta { get; set; }

        [Display(Name = "Sx")]
        public double ScaleX { get; set; }
        [Display(Name = "Sy")]
        public double ScaleY { get; set; }
        [Display(Name = "Sz")]
        public double ScaleZ { get; set; }

        [Display(Name = "Ux")]
        public double UpX { get; set; }
        [Display(Name = "Uy")]
        public double UpY { get; set; }
        [Display(Name = "Uz")]
        public double UpZ { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Camera"/> class.
        /// Constructor.
        /// </summary>
        public Camera()
        {
            ScaleX = 1.0;
            ScaleY = 1.0;
            ScaleZ = 1.0;

            UpX = 1.0;
            UpY = 1.0;
            UpZ = 1.0;
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

            RuleFor(m => m.FieldOfView)
                .NotNull().WithMessage("The FieldOfView property is required.");
            RuleFor(m => m.AspectRatio)
                .NotNull().WithMessage("The AspectRatio property is required.");
            RuleFor(m => m.Near)
                .NotNull().WithMessage("The Near clipping plane property is required.");
            RuleFor(m => m.Far)
                .NotNull().WithMessage("The Far clipping plane property is required.");

            RuleFor(m => m.PositionX)
                .NotNull().WithMessage("The PositionX property is required.");
            RuleFor(m => m.PositionY)
                .NotNull().WithMessage("The PositionY property is required.");
            RuleFor(m => m.PositionX)
                .NotNull().WithMessage("The PositionZ property is required.");

            RuleFor(m => m.EulerX)
                .NotNull().WithMessage("The quaternion EulerX property is required.");
            RuleFor(m => m.EulerY)
                .NotNull().WithMessage("The quaternion EulerY property is required.");
            RuleFor(m => m.EulerZ)
                .NotNull().WithMessage("The quaternion EulerZ property is required.");
            RuleFor(m => m.Theta)
                .NotNull().WithMessage("The quaternion Theta property is required.");
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

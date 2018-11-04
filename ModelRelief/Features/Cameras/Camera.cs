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
    using ModelRelief.Features.Settings;

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

        [Display(Name = "Perspective Camera")]
        public bool IsPerspective { get; set; }

        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double Near { get; set; }
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double Far { get; set; }

        [Display(Name = "Px")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double PositionX { get; set; }
        [Display(Name = "Py")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double PositionY { get; set; }
        [Display(Name = "Pz")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double PositionZ { get; set; }

        [Display(Name = "Ex")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double EulerX { get; set; }
        [Display(Name = "Ey")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double EulerY { get; set; }
        [Display(Name = "Ez")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double EulerZ { get; set; }
        [Display(Name = "Theta")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double Theta { get; set; }

        [Display(Name = "Sx")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double ScaleX { get; set; }
        [Display(Name = "Sy")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double ScaleY { get; set; }
        [Display(Name = "Sz")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double ScaleZ { get; set; }

        [Display(Name = "Ux")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double UpX { get; set; }
        [Display(Name = "Uy")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double UpY { get; set; }
        [Display(Name = "Uz")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double UpZ { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Dto.Project Project { get; set; }

        // Perspective
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double FieldOfView { get; set; }
        [Display(Name = "Aspect Ratio")]
        [DisplayFormat(DataFormatString = "{0:N2}", ApplyFormatInEditMode = true)]
        public double AspectRatio { get; set; }

        // Orthographic
        public double Left { get; set; }
        public double Right { get; set; }
        public double Top { get; set; }
        public double Bottom { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Camera"/> class.
        /// Constructor.
        /// </summary>
        public Camera()
        {
            IsPerspective = true;

            ScaleX = 1.0;
            ScaleY = 1.0;
            ScaleZ = 1.0;

            UpX = 0.0;
            UpY = 1.0;
            UpZ = 0.0;

            // Perspective
            FieldOfView = DefaultCameraSettings.FieldOfView;
            AspectRatio = 1.0;

            // Orthographic
            Left    = DefaultCameraSettings.LeftPlane;
            Right   = DefaultCameraSettings.RightPlane;
            Top     = DefaultCameraSettings.TopPlane;
            Bottom  = DefaultCameraSettings.BottomPlane;
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

            // Perspective
            RuleFor(m => m.FieldOfView)
                .NotNull().WithMessage("The FieldOfView property is required.")
                .When(m => m.IsPerspective);
            RuleFor(m => m.AspectRatio)
                .NotNull().WithMessage("The AspectRatio property is required.")
                .When(m => m.IsPerspective);

            // Orthographic
            RuleFor(m => m.Left)
                .NotNull().WithMessage("The Left plane property is required.")
                .When(m => !m.IsPerspective);
            RuleFor(m => m.Right)
                .NotNull().WithMessage("The Right plane property is required.")
                .When(m => !m.IsPerspective);
            RuleFor(m => m.Top)
                .NotNull().WithMessage("The Top plane property is required.")
                .When(m => !m.IsPerspective);
            RuleFor(m => m.Bottom)
                .NotNull().WithMessage("The Bottom plane property is required.")
                .When(m => !m.IsPerspective);
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

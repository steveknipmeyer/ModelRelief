// -----------------------------------------------------------------------
// <copyright file="Camera.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using ModelRelief.Services.Relationships;

    public enum StandardView
    {
        None,
        Front,
        Back,
        Top,
        Bottom,
        Left,
        Right,
        Isometric,
    }

    [DependentFiles(typeof(DepthBuffer))]
    public class Camera : DomainModel
    {
        public const double DefaultNearClippingPlane  =     0.1;
        public const double DefaultFarClippingPlane   = 10000.0;

        [DependentFileProperty]
        public bool IsPerspective { get; set; }

        [DependentFileProperty]
        public double Near { get; set; }
        [DependentFileProperty]
        public double Far { get; set; }

        [DependentFileProperty]
        public double PositionX { get; set; }
        [DependentFileProperty]
        public double PositionY { get; set; }
        [DependentFileProperty]
        public double PositionZ { get; set; }

        [DependentFileProperty]
        public double EulerX { get; set; }
        [DependentFileProperty]
        public double EulerY { get; set; }
        [DependentFileProperty]
        public double EulerZ { get; set; }
        [DependentFileProperty]
        public double Theta { get; set; }

        [DependentFileProperty]
        public double ScaleX { get; set; }
        [DependentFileProperty]
        public double ScaleY { get; set; }
        [DependentFileProperty]
        public double ScaleZ { get; set; }

        [DependentFileProperty]
        public double UpX { get; set; }
        [DependentFileProperty]
        public double UpY { get; set; }
        [DependentFileProperty]
        public double UpZ { get; set; }

        // Perspective
        public const double DefaultFieldOfView  =  37.0;

        [DependentFileProperty]
        public double FieldOfView { get; set; }
        [DependentFileProperty]
        public double AspectRatio { get; set; }

        // Orthographic
        private const double OrthographicFrustrumPlaneOffset = 100;
        public const double DefaulLeftPlane   = -OrthographicFrustrumPlaneOffset;
        public const double DefaulRightPlane  = +OrthographicFrustrumPlaneOffset;
        public const double DefaulTopPlane    = +OrthographicFrustrumPlaneOffset;
        public const double DefaulBottomPlane = -OrthographicFrustrumPlaneOffset;

        [DependentFileProperty]
        public double Left { get; set; }
        [DependentFileProperty]
        public double Right { get; set; }
        [DependentFileProperty]
        public double Top { get; set; }
        [DependentFileProperty]
        public double Bottom { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Camera"/> class.
        /// Default constructor.
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
            FieldOfView = Camera.DefaultFieldOfView;
            AspectRatio = 1.0;

            // Orthographic
            Left    = Camera.DefaulLeftPlane;
            Right   = Camera.DefaulRightPlane;
            Top     = Camera.DefaulTopPlane;
            Bottom  = Camera.DefaulBottomPlane;
        }
    }
}

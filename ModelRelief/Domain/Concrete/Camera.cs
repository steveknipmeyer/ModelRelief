// -----------------------------------------------------------------------
// <copyright file="Camera.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.Collections.Generic;
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

    [DependentFiles(typeof(DepthBuffer), typeof(NormalMap))]
    public class Camera : DomainModel, IProjectModel
    {
        // Properties
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
        [DependentFileProperty]
        public double FieldOfView { get; set; }
        [DependentFileProperty]
        public double AspectRatio { get; set; }

        // Orthographic
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

        public ICollection<DepthBuffer> DepthBuffers { get; set; }
        public ICollection<Mesh> Meshes { get; set; }
        public ICollection<Model3d> Models { get; set; }
        public ICollection<NormalMap> NormalMaps { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Camera"/> class.
        /// Default constructor.
        /// </summary>
        public Camera()
        {
            Name = "Default Camera";

            IsPerspective = true;

            // Clipping Planes
            Near = Defaults.Camera.NearClippingPlane;
            Far = Defaults.Camera.FarClippingPlane;

            ScaleX = 1.0;
            ScaleY = 1.0;
            ScaleZ = 1.0;

            PositionX = 0.0;
            PositionY = 0.0;
            PositionZ = 100.0;

            UpX = 0.0;
            UpY = 1.0;
            UpZ = 0.0;

            // Perspective
            FieldOfView = Defaults.Camera.FieldOfView;
            AspectRatio = 1.0;

            // Orthographic
            Left    = Defaults.Camera.LeftPlane;
            Right   = Defaults.Camera.RightPlane;
            Top     = Defaults.Camera.TopPlane;
            Bottom  = Defaults.Camera.BottomPlane;
        }
    }
}

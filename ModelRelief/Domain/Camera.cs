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
        public StandardView StandardView { get; set; }

        [DependentFileProperty]
        public double PositionX { get; set; }
        [DependentFileProperty]
        public double PositionY { get; set; }
        [DependentFileProperty]
        public double PositionZ { get; set; }

        [DependentFileProperty]
        public double LookAtX { get; set; }
        [DependentFileProperty]
        public double LookAtY { get; set; }
        [DependentFileProperty]
        public double LookAtZ { get; set; }

        [DependentFileProperty]
        public double FieldOfView { get; set; }
        [DependentFileProperty]
        public double Near { get; set; }
        [DependentFileProperty]
        public double Far { get; set; }
        [DependentFileProperty]
        public bool BoundClippingPlanes { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Camera"/> class.
        /// Default constructor.
        /// </summary>
        public Camera()
        {
        }
    }
}

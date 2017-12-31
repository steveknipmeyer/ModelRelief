// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using ModelRelief.Services;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Domain
{
    public enum StandardView 
    {
        None,
        Front,
        Back,
        Top,
        Bottom,
        Left,
        Right,
        Isometric
    }

    [DependentFiles(nameof(DepthBuffer))]
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
        public double Near{ get; set; }
        [DependentFileProperty]
        public double Far{ get; set; }
        [DependentFileProperty]
        public double FieldOfView { get; set; }
        [DependentFileProperty]
        public bool BoundClippingPlanes { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public Camera()
        {
        }
    }
}

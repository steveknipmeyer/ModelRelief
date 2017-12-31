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

    [Dependents(nameof(DepthBuffer))]
    public class Camera : DomainModel
    {
        public StandardView StandardView { get; set; }

        public double PositionX { get; set; }
        public double PositionY { get; set; }
        public double PositionZ { get; set; }

        public double LookAtX { get; set; }
        public double LookAtY { get; set; }
        public double LookAtZ { get; set; }

        public double Near{ get; set; }
        public double Far{ get; set; }
        public double FieldOfView { get; set; }
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

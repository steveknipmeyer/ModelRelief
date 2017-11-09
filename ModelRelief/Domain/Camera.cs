// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
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

    public class Camera : ModelReliefModel
    {
        [Required, Display (Name = "Camera Name")]
        public override string Name { get; set; }

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
        public Project Project { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public Camera()
        {
        }
    }
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Models;

namespace ModelRelief.Models
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

    public class Camera : ModelReliefEntity
    {
        [Required, Display (Name = "Camera Name")]
        public string Name { get; set; }
        public string Description { get; set; }

        public StandardView StandardView { get; set; }

        public float PositionX { get; set; }
        public float PositionY { get; set; }
        public float PositionZ { get; set; }

        public float LookAtX { get; set; }
        public float LookAtY { get; set; }
        public float LookAtZ { get; set; }

        public float Near{ get; set; }
        public float Far{ get; set; }
        public float FieldOfView { get; set; }
        public bool BoundClippingPlanes { get; set; }

        // Navigation Properties
        public User User { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public Camera()
        {
        }
    }
}

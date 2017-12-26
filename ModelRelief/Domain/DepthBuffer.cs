// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Domain
{
    public enum DepthBufferFormat
    {
        None,       // unknown
        Raw,        // floating point array
        PNG,        // PNG format
        JPG         // JPG format
    }

    public class DepthBuffer  : FileDomainModel
    {       
        public DepthBufferFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        public int? ModelId { get; set; }
        public Model3d Model { get; set; }

        public int? CameraId { get; set; }
        public Camera Camera { get; set; }

        public DepthBuffer()
        {
        }
    }
}

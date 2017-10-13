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

namespace ModelRelief.Models
    {
    public enum Model3dFormat
        {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL             // Stereolithography
        }

    public class Model3d : ModelReliefEntity
        {       
        [Required, Display (Name = "Model Name")]
        public string Name { get; set; }
        public string Description { get; set; }
        public Model3dFormat Format { get; set; }
        public string Path { get; set; }

        // Navigation Properties
        public User User { get; set; }
        public Project Project { get; set; }
        public Camera Camera { get; set; }

        public Model3d()
            {
            }

        public Model3d(int id, string name, string description, Model3dFormat format, string path,
                       string userId, int projectId, int cameraId)
            {
            Id          = id;
            Name        = name;
            Description = description;
            Format      = format;
            Path        = path;
/*
            UserId    = userId
            ProjectId = projectId;
            CameraId = cameraId;
*/
            }
        }
    }

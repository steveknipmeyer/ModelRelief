// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace ModelRelief.Domain
{
    public enum MeshFormat
        {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL             // Stereolithography
        }

    public class Mesh  : ModelReliefModel, IFileResource
    {
        [Required, Display (Name = "Mesh Name")]
        public override string Name { get; set; }

        public MeshFormat Format { get; set; }      
        public string Path { get; set; }

        // Navigation Properties
        public Project Project { get; set; }

        public DepthBuffer DepthBuffer { get; set; }
        public MeshTransform MeshTransform { get; set; }

        public Camera Camera { get; set; }

        public Mesh()
        {
        }
    }
}

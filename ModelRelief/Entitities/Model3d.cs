// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Entitities
    {
    public enum Format3d
        {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL             // Stereolithography
        }

    public class Model3d
        {
        public int Id { get; set; }
        
        [Required, Display (Name = "Model Name")]
        [MaxLength(64)]
        public string Name { get; set; }

        public Format3d Format { get; set; }
        
        // https://stackoverflow.com/questions/25604894/do-we-really-need-a-table-in-database-to-store-file-path-of-image-if-images-are
        public string Path { get; set; }

        public Model3d()
            {
            }

        public Model3d(int id, string name, Format3d format, string path)
            {
            Id     = id;
            Name   = name;
            Format = format;
            Path   = path;
            }
        }
    }

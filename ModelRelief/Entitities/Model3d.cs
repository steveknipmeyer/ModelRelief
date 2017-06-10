using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Entitities
    {
    public enum Format3d
        {
        None,           // unknown
        OBJ,            // Wavefront OBJT
        STL             // Stereolithography
        }

    public class Model3d
        {
        public int Id { get; set; }
        public string Name { get; set; }
        public Format3d Format { get; set; }
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

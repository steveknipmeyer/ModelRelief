using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Entitities
    {
    public class Model3d
        {
        public int Id { get; set; }
        public string Path { get; set; }
        public string Name { get; set; }

        public Model3d()
            {
            }

        public Model3d(int id, string path, string name)
            {
            Id = id;
            Path = path;
            Name = name;
            }
        }
    }

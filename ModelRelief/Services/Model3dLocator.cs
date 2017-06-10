using ModelRelief.Entitities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Services
    {
    public interface IModel3dLocator
        {
        IEnumerable<Model3d> GetAll();
        Model3d Find (int id);
        Model3d Add (Model3d model);
        }

    public class InMemoryModel3dLocator : IModel3dLocator
        {
        static List<Model3d> _models;

        static InMemoryModel3dLocator()
            {
            _models = new List<Model3d>
                {
                new Model3d {Id = 1, Name = "armadillo.obj", Format = Format3d.OBJ, Path = "/models/1/"},
                new Model3d {Id = 2, Name = "bunny.obj", Format = Format3d.OBJ, Path = "/models/2/"},
                new Model3d {Id = 3, Name = "dragon.obj", Format = Format3d.OBJ, Path = "/models/3/"},
                new Model3d {Id = 4, Name = "lucy.obj", Format = Format3d.OBJ, Path = "/models/4/"},
                new Model3d {Id = 5, Name = "tyrannosaurus.obj", Format = Format3d.OBJ, Path = "/models/5/"},
                };
            }

        IEnumerable<Model3d> IModel3dLocator.GetAll()
            {
            return _models;            
            }

        public Model3d Find (int id)
            {
            return _models.FirstOrDefault(m => m.Id == id);
            }

        public Model3d Add(Model3d model)
            {
            model.Id = _models.Max(m => m.Id) + 1;

            _models.Add(model);
            return model;
            }
        }
    }

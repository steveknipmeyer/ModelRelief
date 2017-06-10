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
        }

    public class InMemoryModel3dLocator : IModel3dLocator
        {
        List<Model3d> _models;

        public InMemoryModel3dLocator()
            {
            _models = new List<Model3d>
                {
                new Model3d {Id = 1, Path = "/models/1/", Name = "armadillo.obj"},
                new Model3d {Id = 2, Path = "/models/2/", Name = "bunny.obj"},
                new Model3d {Id = 3, Path = "/models/3/", Name = "dragon.obj"},
                new Model3d {Id = 4, Path = "/models/4/", Name = "lucy.obj"},
                new Model3d {Id = 5, Path = "/models/5/", Name = "tyrannosaurus.obj"},
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
        }
    }

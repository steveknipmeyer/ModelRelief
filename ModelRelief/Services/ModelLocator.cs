using ModelRelief.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Services
    {
    public interface IModelLocator
        {
        IEnumerable<Model3d> GetAll();
        Model3d Find (int id);
        }

    public class InMemoryModelLocator : IModelLocator
        {
        List<Model3d> _models;

        public InMemoryModelLocator()
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

        IEnumerable<Model3d> IModelLocator.GetAll()
            {
            return _models;            
            }

        public Model3d Find (int id)
            {
            Model3d model = new Model3d();
            try
                {
                model = _models.First(m => m.Id == id);
                }
            catch(Exception)
                {
                }
            return model;
            }
        }
    }

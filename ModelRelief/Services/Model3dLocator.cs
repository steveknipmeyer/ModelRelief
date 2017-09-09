// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
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
        void Commit ();
        }

    public class SqlModel3dLocator : IModel3dLocator
        {
        private ModelReliefDbContext _context;

        public SqlModel3dLocator(ModelReliefDbContext context)
            {
            _context = context;
            }

        public IEnumerable<Model3d> GetAll()
            {
            return _context.Models;
            }

        public Model3d Find(int id)
            {
            return _context.Models.FirstOrDefault (m => m.Id == id);
            }

        public Model3d Add(Model3d newModel)
            {
            _context.Add (newModel);
            _context.SaveChanges();
            return newModel;
            }

        public void Commit()
            {
            _context.SaveChanges();
            }
        }

    public class InMemoryModel3dLocator : IModel3dLocator
        {
        static List<Model3d> _models;

        static InMemoryModel3dLocator()
            {
            _models = new List<Model3d>
                {
                new Model3d {Id = 1, Name = "armadillo.obj",    Format = Format3d.OBJ, Path = "/models/1/"},
                new Model3d {Id = 2, Name = "bunny.obj",        Format = Format3d.OBJ, Path = "/models/3/"},
                new Model3d {Id = 3, Name = "dragon.obj",       Format = Format3d.OBJ, Path = "/models/4/"},
                new Model3d {Id = 4, Name = "lucy.obj",         Format = Format3d.OBJ, Path = "/models/5/"},
                new Model3d {Id = 5, Name = "tyrannosaurus.obj",Format = Format3d.OBJ, Path = "/models/6/"},
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

        public void Commit()
            {
            // NOOP
            }
        }
    }

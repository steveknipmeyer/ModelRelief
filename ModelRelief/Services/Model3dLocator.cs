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
    public class SqlModel3dLocator : IResourceLocator<Model3d>
        {
        private ModelReliefDbContext _context;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">Database context.</param>
        public SqlModel3dLocator(ModelReliefDbContext context)
            {
            _context = context;
            }

        /// <summary>
        /// Return all models.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Model3d> GetAll()
            {
            return _context.Models;
            }

        /// <summary>
        /// Find a specific model by Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Model3d Find(int id)
            {
            return _context.Models.FirstOrDefault (m => m.Id == id);
            }

        /// <summary>
        /// Add a new model.
        /// </summary>
        /// <param name="newModel"></param>
        /// <returns></returns>
        public Model3d Add(Model3d newModel)
            {
            _context.Add (newModel);
            _context.SaveChanges();
            return newModel;
            }

        /// <summary>
        /// Commit all pending changes.
        /// </summary>
        public void Commit()
            {
            _context.SaveChanges();
            }
        }
    }

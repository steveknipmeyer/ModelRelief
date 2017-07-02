using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Entitities
    {
    public class ModelReliefDbContext : Microsoft.EntityFrameworkCore.DbContext
        {
        public ModelReliefDbContext (DbContextOptions options) : base (options)
            {
            }

        public DbSet<Model3d> Models 
            { get ; set; }
        }          
    }

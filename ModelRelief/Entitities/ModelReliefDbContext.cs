using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ModelRelief.Entitities
    {
    public class ModelReliefDbContext : IdentityDbContext<User>
        {
        public ModelReliefDbContext (DbContextOptions options) : base (options)
            {
            }

        public DbSet<Model3d> Models 
            { get ; set; }
        }          
    }

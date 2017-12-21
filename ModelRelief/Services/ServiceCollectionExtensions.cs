// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using ModelRelief.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ModelRelief.Domain;
using Microsoft.Extensions.Configuration;

namespace ModelRelief.Services
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Extension method to add the database services.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        /// <param name="configuration">IConfiguration</param>
        public static void AddDatabaseServices (this IServiceCollection services, IConfiguration configuration)
        {
#if !SQLServer
            services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("SQLServer")));
#else
            services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlite(configuration.GetConnectionString("SQLite")));
#endif
            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<ModelReliefDbContext>();
        }            
    }
}

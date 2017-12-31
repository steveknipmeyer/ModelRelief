// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
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
        public static void AddDatabaseServices (this IServiceCollection services)
        {
            // build the intermediate service provider
            var serviceProvider = services.BuildServiceProvider();
            var configurationProvider = serviceProvider.GetService<Services.IConfigurationProvider>();

            switch (configurationProvider.Database)
            {
                case RelationalDatabaseProvider.SQLite:
                    services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlite(configurationProvider.Configuration.GetConnectionString("SQLite")));
                    break;

                case RelationalDatabaseProvider.SQLServer:
                default:
                    services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlServer(configurationProvider.Configuration.GetConnectionString("SQLServer")));
                    break;
            }
            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<ModelReliefDbContext>();
        }            
    }
}

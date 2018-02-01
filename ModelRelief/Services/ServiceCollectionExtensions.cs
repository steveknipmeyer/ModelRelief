// -----------------------------------------------------------------------
// <copyright file="ServiceCollectionExtensions.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Extension method to add the database services.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        public static void AddDatabaseServices(this IServiceCollection services)
        {
            // build the intermediate service provider
            var serviceProvider = services.BuildServiceProvider();
            var configurationProvider = serviceProvider.GetService<Services.IConfigurationProvider>();

            switch (configurationProvider.Database)
            {
                case RelationalDatabaseProvider.SQLite:
                    services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlite(configurationProvider.Configuration.GetConnectionString(ConfigurationSettings.SQLite)));
                    break;

                case RelationalDatabaseProvider.SQLServer:
                default:
                    services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlServer(configurationProvider.Configuration.GetConnectionString(ConfigurationSettings.SQLServer)));
                    break;
            }
            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<ModelReliefDbContext>();
        }
    }
}

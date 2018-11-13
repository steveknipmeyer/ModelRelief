// -----------------------------------------------------------------------
// <copyright file="ServiceCollectionExtensions.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    using FluentValidation.AspNetCore;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Errors;
    using ModelRelief.Infrastructure;
    using ModelRelief.Services.Jobs;
    using ModelRelief.Services.Relationships;

    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Extension method to conmfigure cookie policy.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        public static void ConfigureCookies(this IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
        }

        /// <summary>
        /// Extension method to add the MVC services.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        public static void AddCustomMvc(this IServiceCollection services)
        {
            services.AddMvc(options =>
            {
                options.InputFormatters.Insert(0, new RawRequestBodyFormatter());
                // N.B. Order matters!
                //                  options.Filters.Add(typeof(DbContextTransactionFilter));
                options.Filters.Add(typeof(GlobalExceptionFilter));
                //                  options.Filters.Add(typeof(ValidatorActionFilter));
            })
                .AddFeatureFolders()
                // automatically register all validators within this assembly
                .AddFluentValidation(config => { config.RegisterValidatorsFromAssemblyContaining<Startup>(); })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        /// <summary>
        /// Extension method to add ModelRelief services.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        public static void AddModelReliefServices(this IServiceCollection services)
        {
            services.AddSingleton<Services.IConfigurationProvider, Services.ConfigurationProvider>();
            services.AddSingleton<IStorageManager, StorageManager>();
            services.AddSingleton<IDependencyManager, DependencyManager>();
            services.AddSingleton<IDispatcher, Dispatcher>();
        }

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

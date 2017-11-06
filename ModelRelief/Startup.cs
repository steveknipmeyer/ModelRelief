// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Infrastructure;
using ModelRelief.Services;
using ModelRelief.Workbench;
using System;
using System.Collections.Generic;

namespace ModelRelief
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="configuration">Configuration service</param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            
        }

        /// <summary>
        /// Registers types with Autofac to be used for DI.
        /// </summary>
        /// <param name="services">Existing service collection.</param>
        /// <returns>IServiceProvider to provide DI support.</returns>
        private IServiceProvider ConfigureAutoServices(IServiceCollection services)
        {
            var builder = new ContainerBuilder();
            builder.Populate(services);

            // module scanning: all types are registered for each interrace supported
            builder.RegisterAssemblyTypes(typeof(IMediator).Assembly).AsImplementedInterfaces();
            builder.RegisterAssemblyTypes(typeof(Startup).Assembly).AsImplementedInterfaces();

            // generic types
            builder.RegisterGeneric(typeof(F<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(F<,>));

            builder.RegisterType<F<int, double>>().As<IFunctionOne<int>>();
            builder.RegisterType<FConcrete>().As<IFunctionTwo<double>>();

            // MediatR
            builder.Register<SingleInstanceFactory>(context =>
            {
                var componentContext = context.Resolve<IComponentContext>();
                return t => componentContext.Resolve(t);
            });
            builder.Register<MultiInstanceFactory>(context =>
            {
                var componentContext = context.Resolve<IComponentContext>();
                return t => (IEnumerable<object>)componentContext.Resolve(typeof(IEnumerable<>).MakeGenericType(t));
            });

            var container = builder.Build();
            return container.Resolve<IServiceProvider>();
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container. 
        /// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        /// </summary>
        /// <param name="services"></param>
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(Configuration);
            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddMvc(
                options => options.InputFormatters.Insert(0, new RawRequestBodyFormatter()));

            services.AddSingleton<Services.IConfigurationProvider, Services.ConfigurationProvider>();
            services.AddScoped<IModelsProvider, SqlModelsProvider>();
#if SQLServer
            services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("SQLServer")));
#else
            services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlite(Configuration.GetConnectionString("SQLite")));
#endif
            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<ModelReliefDbContext>();
            
            services.AddAutoMapper(typeof(Startup));
            Mapper.AssertConfigurationIsValid();

            return ConfigureAutoServices (services);
        }

        // 
        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline. 
        /// </summary>
        /// <param name="app">DI IApplicationBuilder</param>
        /// <param name="env">DI IHostingEnvironment</param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
            app.UseExceptionHandler(new ExceptionHandlerOptions
                {
                    ExceptionHandler = context => context.Response.WriteAsync("Application error")
                });
            }

            // Set up custom content types, associating file extension to MIME type
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".obj"] = "text/plain";
            provider.Mappings[".mtl"] = "text/plain";
            app.UseStaticFiles(new StaticFileOptions {  
                ContentTypeProvider = provider
            });

            app.AddStaticFilePaths(env.ContentRootPath, new string[] {"node_modules", "Scripts"});
            app.UseAuthentication();
            app.UseMvc(ConfigureRoutes);

            #if false
            app.Run((context) => context.Response.WriteAsync("Invalid route"));
            #endif
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="obj"></param>
        private void ConfigureRoutes(IRouteBuilder routeBuilder)
        {
            routeBuilder.MapRoute(name: RouteNames.Default, template: "{controller=Home}/{action=Index}/{id?}");

            routeBuilder.MapAreaRoute(name: RouteNames.DefaultApi, areaName: "Api", template: "api/{controller}/{id?}");
            routeBuilder.MapRoute(name: RouteNames.ApiDocumentation, template: "api/documentation/{controller}/{id?}");
        }
    }
}

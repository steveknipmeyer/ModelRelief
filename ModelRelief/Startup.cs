// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Autofac;
using Autofac.Extensions.DependencyInjection;
using MediatR;

using ModelRelief.Entities;
using ModelRelief.Services;
using ModelRelief.Workbench;

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
            services.AddMvc();
            services.AddSingleton<Services.IConfigurationProvider, Services.ConfigurationProvider>();
            services.AddScoped<IResourcesProvider, SqlResourcesProvider>();
            services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("ModelRelief")));
            services.AddIdentity<User, IdentityRole>()
                    .AddEntityFrameworkStores<ModelReliefDbContext>();

            return ConfigureAutoServices (services);
        }


        // 
        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline. 
        /// </summary>
        /// <param name="app">DI IApplicationBuilder</param>
        /// <param name="env">DI IHostingEnvironment</param>
        /// <param name="configurationProvider">DI IConfigurationProvider</param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Services.IConfigurationProvider configurationProvider)
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
            routeBuilder.MapAreaRoute(name: "Api", areaName: "Api", template: "api/{controller}/{id?}");
            routeBuilder.MapRoute(name: "Default", template: "{controller=Home}/{action=Index}/{id?}");
        }
    }
}

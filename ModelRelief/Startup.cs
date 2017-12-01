// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Autofac.Features.Variance;
using AutoMapper;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ModelRelief.Api.V2.Shared.Rest;
using ModelRelief.Infrastructure;
using ModelRelief.Services;
using ModelRelief.Workbench;
using System;
using System.Reflection;
using System.Collections.Generic;
using ModelRelief.Features.Errors;

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
        private IServiceProvider ConfigureAutofacServices(IServiceCollection services)
        {
            var builder = new ContainerBuilder();
            builder.Populate(services);

            // generics with <in> contravariant parameter
            builder.RegisterSource(new ContravariantRegistrationSource());

            // module scanning: all types are registered for each interface supported
            builder.RegisterAssemblyTypes(typeof(IMediator).Assembly).AsImplementedInterfaces();
            builder.RegisterAssemblyTypes(typeof(Startup).Assembly).AsImplementedInterfaces();

#if !AutofacExperiments
#if false
            // generic types: Are these needed? It seems AF will discover all implmentations of interfaces in a module.
            builder.RegisterGeneric(typeof(F<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(F<,>));
#endif
            builder.RegisterType<F<int, double>>().As<IFunctionOne<int>>();         // provide F<int, double> instance when an IFunctionOne<int> is required
            builder.RegisterType<FConcretePrime>().As<IFunctionTwo<double>>();      // provide FConcrete instance when an IFunctionTwo<double> is required
#endif
            // generics
            // WIP Why is AsImplementedInterfaces required for the Handlers?
            builder.RegisterGeneric(typeof(GetSingleRequest<,>));
            builder.RegisterGeneric(typeof(GetSingleRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(GetListRequest<,>));
            builder.RegisterGeneric(typeof(GetListRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostAddRequest<,,>));
            builder.RegisterGeneric(typeof(PostAddRequestHandler<,,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostUpdateRequest<,,>));
            builder.RegisterGeneric(typeof(PostUpdateRequestHandler<,,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostFileRequest<,>));
            builder.RegisterGeneric(typeof(PostFileRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PutRequest<,>));
            builder.RegisterGeneric(typeof(PutRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(DeleteRequest<>));
            builder.RegisterGeneric(typeof(DeleteRequestHandler<>)).AsImplementedInterfaces();

            // MediatR : register delegates as SingleInstanceFactory and MultiInstanceFactory types
            builder.Register<SingleInstanceFactory>(context =>
            {
                // https://github.com/jbogard/MediatR/issues/123
                var c = context.Resolve<IComponentContext>();
                return t =>
                {
                    object o;
                    return c.TryResolve(t, out o) ? o : null;
                };
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

            services.AddMvc(options => 
                { 
                    options.InputFormatters.Insert(0, new RawRequestBodyFormatter());
                    // N.B. Order matters!    
                    options.Filters.Add(typeof(GlobalExceptionFilter));
                    options.Filters.Add(typeof(DbContextTransactionFilter));
//                  options.Filters.Add(typeof(ValidatorActionFilter));
                })
                .AddFeatureFolders()
                // automatically register all validators within this assembly
                .AddFluentValidation(config => { config.RegisterValidatorsFromAssemblyContaining<Startup>(); });

            // ModelRelief                                
            services.AddSingleton<Services.IConfigurationProvider, Services.ConfigurationProvider>();
            services.AddDatabaseServices(Configuration);
            
            services.AddAutoMapper(typeof(Startup));
            Mapper.AssertConfigurationIsValid();

#if false
            // WIP This leads to a runtime error during where the type GetSingleRequestHandler cannot be used with service ICancellableAsynRequestHandler.
            //     The error happens in ConfigureAutofacServices when builder.Build is called.
            //     AddMediatR is used in CUC but not in OAPI.
            //     This method requires MediatR.Extensions.Microsoft.DependencyInjection
            services.AddMediatR(typeof(Startup));
#endif

            return ConfigureAutofacServices (services);
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
                app.UseDeveloperExceptionPage();

            app.UseStatusCodePagesWithReExecute("/Errors/Error/{0}");

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
        }

        /// <summary>
        /// Configures the routes and their associated route templates.
        /// </summary>
        /// <param name="routeBuilder">IRouterBuilder.</param>
        private void ConfigureRoutes(IRouteBuilder routeBuilder)
        {
            routeBuilder.MapRoute(name: RouteNames.Default, template: "{controller=Home}/{action=Index}/{id?}");

            routeBuilder.MapRoute(name: RouteNames.DefaultApiV1, template: "api/v1/{controller}/{id?}");
            routeBuilder.MapRoute(name: RouteNames.DefaultApiV2, template: "api/v2/{controller}/{id?}");
            routeBuilder.MapRoute(name: RouteNames.ApiDocumentation, template: "api/v1/documentation/{controller}/{id?}");
        }
    }
}

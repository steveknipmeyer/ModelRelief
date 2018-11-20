﻿// -----------------------------------------------------------------------
// <copyright file="Startup.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Autofac;
    using Autofac.Extensions.DependencyInjection;
    using Autofac.Features.Variance;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Routing;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Infrastructure;
    using ModelRelief.Services;

    using ModelRelief.Workbench;

    public class Startup
    {
        public IConfiguration Configuration { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
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
#if true
            // generic types: Are these needed? It seems AF will discover all implmentations of interfaces in a module.
            builder.RegisterGeneric(typeof(F<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(F<,>));
#endif
            builder.RegisterType<F<int, double>>().As<IFunctionOne<int>>();         // provide F<int, double> instance when an IFunctionOne<int> is required
            builder.RegisterType<FConcretePrime>().As<IFunctionTwo<double>>();      // provide FConcrete instance when an IFunctionTwo<double> is required
#endif
            // generics
            // WIP Why is AsImplementedInterfaces required for the Handlers?
            builder.RegisterGeneric(typeof(FileRequest<>));
            builder.RegisterGeneric(typeof(FileRequestHandler<>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(GetSingleRequest<,>));
            builder.RegisterGeneric(typeof(GetSingleRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(GetListRequest<,>));
            builder.RegisterGeneric(typeof(GetListRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(GetFileRequest<>));
            builder.RegisterGeneric(typeof(GetFileRequestHandler<>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostRequest<,,>));
            builder.RegisterGeneric(typeof(PostRequestHandler<,,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PutRequest<,,>));
            builder.RegisterGeneric(typeof(PutRequestHandler<,,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostFileRequest<,>));
            builder.RegisterGeneric(typeof(PostFileRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PatchRequest<,>));
            builder.RegisterGeneric(typeof(PatchRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(DeleteRequest<>));
            builder.RegisterGeneric(typeof(DeleteRequestHandler<>)).AsImplementedInterfaces();

            // MediatR : register delegates as SingleInstanceFactory and MultiInstanceFactory types
            builder.Register<SingleInstanceFactory>(context =>
            {
                // https://github.com/jbogard/MediatR/issues/123
                var c = context.Resolve<IComponentContext>();
                return t =>
                {
                    return c.TryResolve(t, out object o) ? o : null;
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
        /// <param name="services">DI Service collection.</param>
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // cache for use outside controllers (e.g. FileDomainModel)
            // N.B. ContentRootPath contains a trailing slash when running the integration tests.
            // The normal runtime mode (web host) does not include a slash. Strip, if present.
            var env = services.BuildServiceProvider().GetService<IHostingEnvironment>();
            StorageManager.ContentRootPath = env.ContentRootPath.TrimEnd(Path.DirectorySeparatorChar);

            services.AddSingleton(Configuration);
            services.AddRouting(options => options.LowercaseUrls = true);
            services.ConfigureCookies();
            services.AddConfigurationTypes(Configuration);
            services.AddAuth0Authentication(Configuration);
            services.AddCustomMvc();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddModelReliefServices();
            services.AddDatabaseServices(env);
            services.AddAutoMapper(typeof(Startup));
            Mapper.AssertConfigurationIsValid();

            return ConfigureAutofacServices(services);
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">DI IApplicationBuilder</param>
        /// <param name="env">DI IHostingEnvironment</param>
        /// <param name="configurationProvider">Configuration provider.</param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Services.IConfigurationProvider configurationProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }
            // HttpsRedirection: XUnit TestServer not compatible
            if (!env.IsDevelopment())
                app.UseHttpsRedirection();

            // https://andrewlock.net/re-execute-the-middleware-pipeline-with-the-statuscodepages-middleware-to-create-custom-error-pages/
            app.UseStatusCodePagesWithReExecute("/Errors/Error", "?statusCode={0}");

            app.ConfigureStaticFiles();
            app.AddStaticFilePaths(env.ContentRootPath, new string[] { "Scripts" });
            app.UseCookiePolicy();
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
            routeBuilder.MapRoute(name: RouteNames.ApiDocumentation, template: "api/v1/documentation/{controller}/{id?}");
        }
    }
}

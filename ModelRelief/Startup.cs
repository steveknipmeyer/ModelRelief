// -----------------------------------------------------------------------
// <copyright file="Startup.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief
{
    using System;
    using Autofac;
    using Autofac.Extensions.DependencyInjection;
    using Autofac.Features.Variance;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.HttpOverrides;
    using Microsoft.AspNetCore.Routing;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.OpenApi.Models;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Infrastructure;
    using ModelRelief.Services;

    using ModelRelief.Workbench;

    public class Startup
    {
        public IConfiguration Configuration { get; set; }
        public IWebHostEnvironment Env { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// Constructor
        /// </summary>
        /// <param name="configuration">DI Configuration service</param>
        /// <param name="env">DI IWebHostEnvironment</param>
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
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
            builder.RegisterGeneric(typeof(GetQueryRequest<,>));
            builder.RegisterGeneric(typeof(GetQueryRequestHandler<,>)).AsImplementedInterfaces();
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

            // MediatR : register delegates
            builder.Register<ServiceFactory>(ctx =>
            {
                var c = ctx.Resolve<IComponentContext>();
                return t => c.Resolve(t);
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
            services.AddSingleton(Configuration);
            services.AddRouting(options => options.LowercaseUrls = true);
            services.ConfigureCookies();
            services.AddConfigurationTypes(Configuration);
            services.AddAuth0Authentication(Configuration);
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddMvc(options => options.EnableEndpointRouting = false);
            services.AddMvc().AddNewtonsoftJson();                                          // disable Core 3.1 System.Text.Json in middleware
            services.AddCustomMvc();
            services.AddModelReliefServices(Configuration);
            services.AddDatabaseServices(Env);
            services.AddAutoMapper(typeof(Startup));

            // https://stackoverflow.com/questions/56234504/migrating-to-swashbuckle-aspnetcore-version-5
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ModelRelief API",
                    Version = "v1",
                    Description = "Low relief generation from 3D models",
                    Contact = new OpenApiContact
                    {
                        Name = "Steve Knipmeyer",
                        Email = string.Empty,
                    },
                });

                //First we define the security scheme
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme.",
                    Type = SecuritySchemeType.Http,         // set the scheme type to http since we're using bearer authentication
                    Scheme = "bearer",                      // name of the HTTP Authorization scheme to be used in the Authorization header. In this case "bearer".
                });
            });

            var serviceProvider = ConfigureAutofacServices(services);
            IMapper mapper = serviceProvider.GetRequiredService<IMapper>();
            mapper.ConfigurationProvider.AssertConfigurationIsValid();

            // service provider for contexts without DI
            ApplicationServices.StorageManager = serviceProvider.GetRequiredService<IStorageManager>();

            return serviceProvider;
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">DI IApplicationBuilder</param>
        /// <param name="env">DI IWebHostEnvironment</param>
        /// <param name="configurationProvider">Configuration provider.</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, Services.IConfigurationProvider configurationProvider)
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
            // https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-3.1
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
            });
            app.UseAuthentication();
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ModelRelief API V1");
            });

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

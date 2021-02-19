// -----------------------------------------------------------------------
// <copyright file="Startup.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief
{
    using System;
    using Autofac;
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
        /// <param name="configuration">IConfiguration [from DI]</param>
        /// <param name="env">IWebHostEnvironment [from DI]</param>
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }
        public void ConfigureContainer(ContainerBuilder builder)
        {
            // Add any Autofac modules or registrations.
            // This is called AFTER ConfigureServices so things you
            // register here OVERRIDE things registered in ConfigureServices.
            //
            // You must have the call to `UseServiceProviderFactory(new AutofacServiceProviderFactory())`
            // when building the host or this won't be called.

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

            AutofacExperiments.Register(builder);

            // If you want to enable diagnostics, you can do that via a build
            // callback. Diagnostics aren't free, so you shouldn't just do this
            // by default. Note: since you're diagnosing the container you can't
            // ALSO resolve the logger to which the diagnostics get written, so
            // writing directly to the log destination is the way to go.
            /*
            var tracer = new DefaultDiagnosticTracer();
            tracer.OperationCompleted += (sender, args) =>
            {
                Console.WriteLine(args.TraceContent);
            };

            builder.RegisterBuildCallback(c =>
            {
                var container = c as IContainer;
                container.SubscribeToDiagnostics(tracer);
            });
            */
        }

        /// <summary>
        /// Configures MediatR.
        /// </summary>
        /// <param name="services">Existing service collection.</param>
        private void ConfigureMediatR(IServiceCollection services)
        {
            services.AddMediatR(typeof(Startup));
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        /// </summary>
        /// <param name="services">DI Service collection.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(Configuration);
            services.AddRouting(options => options.LowercaseUrls = true);
            services.ConfigureCookies();
            services.AddConfigurationTypes(Configuration);
            services.AddAuth0Authentication(Configuration);
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddMvc(options => options.EnableEndpointRouting = false);
            services.AddCustomMvc();
            services.AddDistributedMemoryCache();
            services.AddSession();
            services.AddModelReliefServices(Configuration);
            services.AddDatabaseServices(Configuration, Env);
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

            ConfigureMediatR(services);
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">DI IApplicationBuilder</param>
        /// <param name="env">DI IWebHostEnvironment</param>
        /// <param name="mapper">DI IMapper.</param>
        /// <param name="storageManager">DI IStorageManager.</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IMapper mapper, IStorageManager storageManager)
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

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
            app.UseSwagger(o =>
               {
                   o.RouteTemplate = "api/{documentName}/documentation/api.json";
               });
            app.UseSwaggerUI(c =>
            {
                c.RoutePrefix = "api/v1/documentation";
                c.SwaggerEndpoint("/api/v1/documentation/api.json", "ModelRelief API V1");
            });

            app.UseSession();
            app.UseMvc(ConfigureRoutes);

            // validate AutoMapper configuration
            mapper.ConfigurationProvider.AssertConfigurationIsValid();

            // service provider for contexts without DI
            ServicesRepository.StorageManager = storageManager;
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

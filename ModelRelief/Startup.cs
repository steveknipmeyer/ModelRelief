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
            builder.RegisterGeneric(typeof(GetSingleRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(GetMultipleRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(GetFileRequestHandler<>)).AsImplementedInterfaces();

            builder.RegisterGeneric(typeof(PutRequestHandler<,,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PatchRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(DeleteRequestHandler<>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostRequestHandler<,,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostFileRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostPreviewRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterGeneric(typeof(PostFormRequestHandler<,,>)).AsImplementedInterfaces();

            builder.RegisterGeneric(typeof(FileRequestHandler<>)).AsImplementedInterfaces();

            AutofacExperiments.Register(builder);
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
            services.AddCustomMvc();
            services.AddDistributedMemoryCache();
            services.AddSession();
            services.AddModelReliefServices(Configuration);
            services.AddDatabaseServices(Configuration, Env);
            services.AddAutoMapper(typeof(Startup));
            services.AddSwaggerGen(c =>
            {
                // https://stackoverflow.com/questions/56234504/migrating-to-swashbuckle-aspnetcore-version-5
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
            services.AddMediatR(typeof(Startup));
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
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                // View default
                endpoints.MapControllerRoute(
                    name: RouteNames.Default,
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                endpoints.MapControllerRoute(
                    name: RouteNames.Details,
                    pattern: "{controller}/{id}",
                    defaults: new { controller = "{controller}", action = "Details" });

                // File
                endpoints.MapControllerRoute(
                    name: RouteNames.File,
                    pattern: "{controller}/{id}/file",
                    defaults: new { controller = "{controller}", action = "File" });

                // Preview
                endpoints.MapControllerRoute(
                    name: RouteNames.Preview,
                    pattern: "{controller}/{id}/preview",
                    defaults: new { controller = "{controller}", action = "Preview" });

                // View compound names
                endpoints.MapControllerRoute(
                    name: RouteNames.DepthBuffers,
                    pattern: "depth-buffers/{action=Index}/{id?}",
                    defaults: new { controller = "DepthBuffers" });
                endpoints.MapControllerRoute(
                    name: RouteNames.NormalMaps,
                    pattern: "normal-maps/{action=Index}/{id?}",
                    defaults: new { controller = "NormalMaps" });
                endpoints.MapControllerRoute(
                    name: RouteNames.MeshTransforms,
                    pattern: "mesh-transforms/{action=Index}/{id?}",
                    defaults: new { controller = "MeshTransforms" });

                // API
                endpoints.MapControllerRoute(
                    name: RouteNames.DefaultApiV1,
                    pattern: "api/v1/{controller}/{id?}");
                endpoints.MapControllerRoute(
                    name: RouteNames.ApiDocumentation,
                    pattern: "api/v1/documentation/{controller}/{id?}");

                // special
                endpoints.MapControllerRoute(
                      name: "special",
                      pattern: "special/{id?}",
                      defaults: new { controller = "Home" });
            });

            // validate AutoMapper configuration
            mapper.ConfigurationProvider.AssertConfigurationIsValid();
        }
    }
}

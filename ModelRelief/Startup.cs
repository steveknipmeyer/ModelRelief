// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using ModelRelief.Entitities;
using ModelRelief.Services;

namespace ModelRelief
    {
    public class Startup
        {
        public IConfiguration Configuration { get; set; }

        public Startup(IHostingEnvironment env)
            {
            var builder = new ConfigurationBuilder()
                          .SetBasePath(env.ContentRootPath)
                          .AddJsonFile("appsettings.json")
                          .AddEnvironmentVariables();

            Configuration = builder.Build();
            }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
            {
            services.AddSingleton(Configuration);
            services.AddMvc();
            services.AddSingleton<Services.IConfigurationProvider, Services.ConfigurationProvider>();
            services.AddScoped<IResourcesProvider, SqlResourcesProvider>();
            services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("ModelRelief")));
            services.AddIdentity<User, IdentityRole>()
                    .AddEntityFrameworkStores<ModelReliefDbContext>();
            }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, Services.IConfigurationProvider greeter)
            {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
                {
                app.UseDeveloperExceptionPage();
                }
            else
                {
                app.UseExceptionHandler(new ExceptionHandlerOptions
                    {
                    ExceptionHandler = context => context.Response.WriteAsync("Application error")
                    }
                    );
                }

            // Set up custom content types -associating file extension to MIME type
            var provider = new FileExtensionContentTypeProvider();
            // Add new mappings
            provider.Mappings[".obj"] = "text/plain";
            provider.Mappings[".mtl"] = "text/plain";
            app.UseStaticFiles(new StaticFileOptions {  
                ContentTypeProvider = provider
            });
            app.AddStaticFilePaths(env.ContentRootPath, new string[] {"node_modules", "Scripts"});

            app.UseIdentity();
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
            routeBuilder.MapRoute("Default", "{controller=Home}/{action=Index}/{id?}");
            }

#if false
            // N.B. Remove in production!
            app.UseDirectoryBrowser();

            app.UseWelcomePage("/welcome");

            app.Run(async (context) =>
                {
                var message = greeter.GetGreeting();
                await context.Response.WriteAsync(message);
                });
#endif
        }
    }

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.StaticFiles;

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
            services.AddSingleton<IGreeter, Greeter>();
            }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IGreeter greeter)
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
            app.UseStaticFiles(new StaticFileOptions() {   
                ContentTypeProvider = provider
            });

            // N.B. Remove in production!
            app.UseDirectoryBrowser();

#if false
            app.UseWelcomePage("/welcome");

            app.Run(async (context) =>
                {
                var message = greeter.GetGreeting();
                await context.Response.WriteAsync(message);
                });
#endif
            }
        }
    }

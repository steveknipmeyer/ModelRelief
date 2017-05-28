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
                {
                app.UseExceptionHandler(new ExceptionHandlerOptions
                    {
                    ExceptionHandler = context => context.Response.WriteAsync("Application error")
                    }
                    );
                }

            app.UseFileServer();
            app.UseWelcomePage("/welcome");

 #if false
            app.Run(async (context) =>
                {
                var message = greeter.GetGreeting();
                await context.Response.WriteAsync(message);
                });
#endif
            }
        }
    }

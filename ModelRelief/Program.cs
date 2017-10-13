// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

using Serilog;
using Serilog.Events;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using ModelRelief.Database;
using ModelRelief.Models;
using Microsoft.AspNetCore.Identity;

namespace ModelRelief
{
    public class Program
    {
        /// <summary>
        /// Main entry point.
        /// </summary>
        /// <param name="args">Arguments</param>
        public static void Main(string[] args)
        {   
            ConfigureLogging();

            var host = BuildWebHost(args);
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var logger  = services.GetRequiredService<ILogger<Program>>();
                    logger.LogInformation("Preparing to initialize database.");
  
                    var initializer = new DbInitializer(services);
                    initializer.Populate();
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }

            host.Run();
        }

        /// <summary>
        /// Configure (Serilog) Logging
        /// </summary>
        private static void ConfigureLogging()
        {
            var configuration = new ConfigurationBuilder()
                          .SetBasePath(Directory.GetCurrentDirectory())
                          .AddJsonFile("appsettings.json", optional:false, reloadOnChange:true)
                          .Build();

            Log.Logger = new LoggerConfiguration()
                        .ReadFrom.Configuration(configuration)
                        .CreateLogger();
        }

        /// <summary>
        /// Construct the web host.
        /// </summary>
        /// <param name="args">Arguments.</param>
        /// <returns>IWebHost</returns>
        public static IWebHost BuildWebHost(string[] args)
        {
            try
            {
                Log.Information("Starting web host");
                var webHost = WebHost.CreateDefaultBuilder(args)
                                     .UseStartup<Startup>()
                                     .UseSerilog()
                                     .Build();

                return webHost;            
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
                Log.CloseAndFlush();
                return null;
            }
        }
    }
}

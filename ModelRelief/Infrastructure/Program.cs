// -----------------------------------------------------------------------
// <copyright file="Program.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Infrastructure
{
    using System;
    using System.IO;
    using System.Reflection;
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Database;
    using Serilog;
    using Serilog.Events;

    public class Program
    {
        /// <summary>
        /// Main entry point.
        /// </summary>
        /// <param name="args">Arguments</param>
        public static void Main(string[] args)
        {
            ProcessCommandLine(args);

            ConfigureLogging();

            var host = BuildWebHost(args);
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var initializer = new DbInitializer(services);
            }

            host.Run();
        }

        /// <summary>
        /// Process the command line arguments.
        /// </summary>
        /// <param name="args">Arguments from command line.</param>
        private static void ProcessCommandLine(string[] args)
        {
        }

        /// <summary>
        /// Configure (Serilog) Logging
        /// </summary>
        private static void ConfigureLogging()
        {
            var configuration = new ConfigurationBuilder()
                          .SetBasePath(Directory.GetCurrentDirectory())
                          .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                          .Build();

            Log.Logger = new LoggerConfiguration()
                        .ReadFrom.Configuration(configuration)
                        // suppress all Microsoft messages unless they are >- Error
                        // https://github.com/serilog/serilog-extensions-logging/issues/78
                        .MinimumLevel.Override("Microsoft", LogEventLevel.Error)
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
                                     .ConfigureAppConfiguration((builderContext, config) =>
                                     {
                                         // WIP: Implement secret store for Production environments. Azure?
                                         // https://joonasw.net/view/aspnet-core-2-configuration-changes
                                         var env = builderContext.HostingEnvironment;
                                         var appAssembly = Assembly.Load(new AssemblyName(env.ApplicationName));
                                         if (appAssembly != null)
                                         {
                                             config.AddUserSecrets(appAssembly, optional: true);
                                         }
                                     })
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

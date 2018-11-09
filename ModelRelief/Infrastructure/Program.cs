﻿// -----------------------------------------------------------------------
// <copyright file="Program.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Infrastructure
{
    using System;
    using System.IO;
    using System.Reflection;
    using CommandLine;
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Database;
    using ModelRelief.Services;
    using Serilog;
    using Serilog.Events;

    public class Program
    {
        private static bool ExitAfterInitialization { get; set; }

        /// <summary>
        /// Main entry point.
        /// </summary>
        /// <param name="args">Arguments</param>
        public static void Main(string[] args)
        {
            ConfigureLogging();

            var host = CreateWebHostBuilder(args).Build();

            ProcessConfiguration(host);

            PerformInitialization(host);

            if (ExitAfterInitialization)
                return;

            host.Run();
        }

        /// <summary>
        /// Perform general initialization including seeding the database.
        /// </summary>
        /// <param name="host">Web host.</param>
        private static void PerformInitialization(IWebHost host)
        {
            var services = (IServiceScopeFactory)host.Services.GetService(typeof(IServiceScopeFactory));
            using (var scope = services.CreateScope())
            {
                var initializer = new Initializer(scope);
                initializer.Initialize();

                var dbInitializer = new DbInitializer(scope, ExitAfterInitialization);
                dbInitializer.Initialize();
            }
        }

        /// <summary>
        /// Process key configuration settings.
        /// </summary>
        private static void ProcessConfiguration(IWebHost host)
        {
            Services.IConfigurationProvider configurationProvider = host.Services.GetRequiredService<Services.IConfigurationProvider>();
            configurationProvider.LogConfigurationSettings();
            ExitAfterInitialization = configurationProvider.ParseBooleanSetting(ConfigurationSettings.MRExitAferInitialization);
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
        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            try
            {
                Log.Information("Starting web host");
                var webHostBuilder = WebHost.CreateDefaultBuilder(args)
                                     .ConfigureAppConfiguration((builderContext, config) =>
                                     {
                                         // WIP: Implement secret store for Production environments. Azure?
                                         // https://joonasw.net/view/aspnet-core-2-configuration-changes
                                         var env = builderContext.HostingEnvironment;
                                         Log.Information($"Runtime environment (ASPNETCORE_ENVIRONMENT) = {env.EnvironmentName}");
                                         var appAssembly = Assembly.Load(new AssemblyName(env.ApplicationName));
                                         if (appAssembly != null)
                                         {
                                             config.AddUserSecrets(appAssembly, optional: true);
                                         }
                                     })
                                     .UseStartup<Startup>()
                                     .UseSerilog();

                return webHostBuilder;
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

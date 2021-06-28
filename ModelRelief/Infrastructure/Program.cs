// -----------------------------------------------------------------------
// <copyright file="Program.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Infrastructure
{
    using System;
    using System.IO;
    using Autofac.Extensions.DependencyInjection;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using ModelRelief.Database;
    using ModelRelief.Services;
    using Serilog;
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

            var host = CreateHostBuilder(args).Build();

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
        private static void PerformInitialization(IHost host)
        {
            var services = (IServiceScopeFactory)host.Services.GetService(typeof(IServiceScopeFactory));
            using (var scope = services.CreateScope())
            {
                var serviceProvider = scope.ServiceProvider;

                var initializer = serviceProvider.GetRequiredService<IInitializer>();
                initializer.Initialize();

                var dbInitializer = serviceProvider.GetRequiredService<IDbInitializer>();
                dbInitializer.Initialize();
            }
        }

        /// <summary>
        /// Process key configuration settings.
        /// </summary>
        private static void ProcessConfiguration(IHost host)
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
                        // suppress all Microsoft messages unless they are >= Error
                        // https://github.com/serilog/serilog-extensions-logging/issues/78
                        //.MinimumLevel.Override("Microsoft", LogEventLevel.Error)
                        .CreateLogger();
        }

        /// <summary>
        /// Construct the web host.
        /// </summary>
        /// <param name="args">Arguments.</param>
        /// <returns>IHostBuilder</returns>
        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            try
            {
                Log.Information("Starting web host");
                var hostBuilder = Host.CreateDefaultBuilder(args)
                    .UseServiceProviderFactory(new AutofacServiceProviderFactory())
                    .ConfigureAppConfiguration((builderContext, config) =>
                    {
                        var env = builderContext.HostingEnvironment;
                        Log.Information($"Runtime environment (ASPNETCORE_ENVIRONMENT) = {env.EnvironmentName}");

                        config.AddJsonFile("azurekeyvault.json", optional: false);
                        var builtConfig = config.Build();

                        config.AddAzureKeyVault(
                            $"https://{builtConfig["AzureKeyVault:Vault"]}.vault.azure.net/",
                            builtConfig["AzureKeyVault:ApplicationId"],
                            builtConfig["AzureKeyVault:ModelReliefKVKey"]);
                    })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                    //  .UseUrls(Environment.GetEnvironmentVariable("ASPNETCORE_URLS"))
                    .UseSerilog();
                return hostBuilder;
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

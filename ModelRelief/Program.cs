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
            BuildWebHost(args).Run();
        }

        /// <summary>
        /// Configure (Serilog) Logging
        /// </summary>
        private static void ConfigureLogging()
        {
            Log.Logger = new LoggerConfiguration()
                        .MinimumLevel.Debug()
                        .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                        .Enrich.FromLogContext()
                        .WriteTo.Console()
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

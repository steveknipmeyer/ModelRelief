// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace Microsoft.AspNetCore.Builder
    {
    public static class ApplicationBuilderExtensions
        {
        /// <summary>
        /// Include the target folders in the list of valid static file folders.
        /// </summary>
        /// <param name="app">IApplicationBuilder.</param>
        /// <param name="root">Root (parent of wwwwroot) of the file server.</param>
        /// <param name="staticFilePath">Folder path to allow static files to be served.</param>
        /// /// <returns>IApplicationBuilder</returns>
        public static IApplicationBuilder AddStaticFilePath (this IApplicationBuilder app, string root, string staticFilePath)
            {
            var path = Path.Combine(root, staticFilePath);
            if (!Directory.Exists(path))
                return app;

            var provider = new PhysicalFileProvider(path);

            var options = new StaticFileOptions();
            options.RequestPath  = "/" + staticFilePath;     // process only this path
            options.FileProvider = provider;

            app.UseStaticFiles(options);

            return app;
            }

        /// <summary>
        /// Include the given folders in the list of valid static file folders.
        /// </summary>
        /// <param name="app">IApplicationBuilder</param>
        /// <param name="root">Root (parent of wwwwroot) of the file server</param>
        /// <param name="paths">Folder paths to allow static files to be served.</param>
        /// <returns>IApplicationBuilder</returns>
        public static IApplicationBuilder AddStaticFilePaths (this IApplicationBuilder app, string root, string[] paths)
            {
            foreach (string path in paths)
                {
                app = AddStaticFilePath(app, root, path);
                }
            return app;
            }
        }
    }

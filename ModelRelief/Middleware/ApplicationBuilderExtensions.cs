// -----------------------------------------------------------------------
// <copyright file="ApplicationBuilderExtensions.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Microsoft.AspNetCore.Builder
{
    using System.IO;
    using Microsoft.Extensions.FileProviders;

    public static class ApplicationBuilderExtensions
        {
        /// <summary>
        /// Include the target folders in the list of valid static file folders.
        /// </summary>
        /// <param name="app">IApplicationBuilder.</param>
        /// <param name="root">Root (parent of wwwwroot) of the file server.</param>
        /// <param name="staticFilePath">Folder path to allow static files to be served.</param>
        /// /// <returns>IApplicationBuilder</returns>
        public static IApplicationBuilder AddStaticFilePath(this IApplicationBuilder app, string root, string staticFilePath)
            {
            var path = Path.Combine(root, staticFilePath);
            if (!Directory.Exists(path))
                return app;

            var provider = new PhysicalFileProvider(path);

            var options = new StaticFileOptions
            {
                RequestPath = "/" + staticFilePath,     // process only this path
                FileProvider = provider,
            };

            app.UseStaticFiles(options);

            return app;
            }

        /// <summary>
        /// Include the given folders in the list of valid static file folders.
        /// </summary>
        /// <param name="app">IApplicationBuilder</param>
        /// <param name="root">Root (parent of wwwwroot) of the file server</param>
        /// <param name="paths">Folder paths to allow static files to be served.</param>
        /// <returns>IApplicationBuilder instance.</returns>
        public static IApplicationBuilder AddStaticFilePaths(this IApplicationBuilder app, string root, string[] paths)
            {
            foreach (string path in paths)
                {
                app = AddStaticFilePath(app, root, path);
                }
            return app;
            }
        }
    }

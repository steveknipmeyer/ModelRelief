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
        /// Include the node_modules folder in the list of valid static file folders.
        /// </summary>
        /// <param name="app">IApplicationBuilder</param>
        /// <param name="root">Root (parent of wwwwroot) of the file server</param>
        /// <returns>IApplicationBuilder</returns>
        public static IApplicationBuilder AddNodeModules (this IApplicationBuilder app, string root)
            {
            var path = Path.Combine(root, "node_modules");
            var provider = new PhysicalFileProvider(path);

            var options = new StaticFileOptions();
            options.RequestPath  = "/node_modules";     // process only this path
            options.FileProvider = provider;

            app.UseStaticFiles(options);

            return app;
            }
        }
    }

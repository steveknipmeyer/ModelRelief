// -----------------------------------------------------------------------
// <copyright file="Settings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System.IO;
    using Microsoft.Extensions.Configuration;

    /// <summary>
    /// Unit test settings that describe the host and runtime environment.
    /// These should be mocked.
    /// </summary>
    public class Settings
    {
        public const string Environment = "Development";
        public const string Scheme = "http";
        public const string Host   = "localhost";

        public const string ContentRootFolder = "ModelRelief";
        public const string TestFilesFolder   = "Test/Data/Files";

        /// <summary>
        /// Returns the root of the content folder. wwwroot is below this folder.
        /// </summary>
        /// <returns>Content folder root.</returns>
        public static string GetContentRootPath()
        {
            // e.g. ModelRelief/ModelRelief.Test/bin/Debug/netcoreapp3.1
            var currentDirectory = Directory.GetCurrentDirectory();

            // reset path from <top> down
            var contentRootPath = currentDirectory.Remove(currentDirectory.IndexOf(Settings.ContentRootFolder) + Settings.ContentRootFolder.Length);
            contentRootPath = Path.Combine(contentRootPath, Settings.ContentRootFolder) + @"/";

            return contentRootPath;
        }

        /// <summary>
        /// Returns the root of the test files folder.
        /// </summary>
        /// <returns>Test files folder.</returns>
        public static string GetTestFilesPath()
        {
            var contentRootPath = GetContentRootPath();
            var testFilesFolder = $"{contentRootPath}/{Settings.TestFilesFolder}";

            return testFilesFolder;
        }
        /// <summary>
        /// Constructs a test ConfigurationProvider.
        /// </summary>
        /// <param name="configurationBuilder">ConfigurationBuilder instance.</param>
        /// <returns></returns>
        public static IConfigurationRoot ConfigurationProvider(IConfigurationBuilder configurationBuilder)
        {
            var configurationProvider = configurationBuilder.SetBasePath(Settings.GetContentRootPath())
                .Build();

            return configurationProvider;
        }
    }
}

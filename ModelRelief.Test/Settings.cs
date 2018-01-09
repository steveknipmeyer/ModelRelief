// -----------------------------------------------------------------------
// <copyright file="Settings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System.IO;

    /// <summary>
    /// Unit test settings that describe the host and runtime environment.
    /// These should be mocked.
    /// </summary>
    public class Settings
    {
        public static readonly string Scheme = "http";
        public static readonly string Host   = "localhost";
        public static readonly int Port      = 60655;

        public static string ContentRootFolder = "ModelRelief";
        public static string TestFilesFolder   = "Test/Data/Files";

        public static string SQLiteDatabaseFolder   = $"{GetContentRootPath()}Database";
        public static string SQLiteConnectionString = $"Data Source={SQLiteDatabaseFolder}\\ModelReliefTest.db";

        /// <summary>
        /// Returns the root of the content folder. wwwroot is below this folder.
        /// </summary>
        /// <returns>Content folder root.</returns>
        public static string GetContentRootPath()
        {
            // e.g. D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\ModelRelief.Test\bin\Debug\netcoreapp2.0
            var currentDirectory = Directory.GetCurrentDirectory();

            // reset path from <top> down
            var contentRootPath = currentDirectory.Remove(currentDirectory.IndexOf(Settings.ContentRootFolder) + Settings.ContentRootFolder.Length);
            contentRootPath = Path.Combine(contentRootPath, Settings.ContentRootFolder) + @"\";

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
    }
}

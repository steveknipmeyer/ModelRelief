// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Dto;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration
{
    /// <summary>
    /// Represents the shared setup for all classes (of the same collection name).
    /// This is run once for every collection.
    /// </summary>
    public class CollectionFixture : IDisposable
    {
        public Framework Framework { get; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public CollectionFixture()
        {
            RefreshTestDatabase();
        }

        /// <summary>
        /// Dispose of unmanaged resources.
        /// </summary>
        public void Dispose()
        {
        }

        /// <summary>
        /// Replaces the test database with a fresh baseline copy.
        /// </summary>
        public void RefreshTestDatabase()
        {
#if !SQLServer
            var databaseFolder = Environment.ExpandEnvironmentVariables("%USERPROFILE%");
            var fileList = new Dictionary<string, string>
            {
                {"ModelReliefBaseline.mdf",     "ModelReliefTest.mdf" },
                {"ModelReliefBaseline_log.ldf", "ModelReliefTest_log.ldf" }
            };
            try
            {
                foreach (KeyValuePair<string, string> entry in fileList)
                {
                    var sourcePath = Path.Combine(databaseFolder, entry.Key);
                    var targetPath = Path.Combine(databaseFolder, entry.Value);
                    File.Copy(sourcePath, targetPath, overwrite: true);
                }
            }
            catch (Exception ex)
            {
                Debug.Assert(false, $"RefreshTestDatabase: {ex.Message}");
            }
#else
            var contentRootPath = GetContentRootPath();
            var databaseFolder = $"{contentRootPath}/{Settings.DatabaseFolder}";

            var sourceDatabase = "ModelReliefBaseline.db";
            var targetDatabase = "ModelReliefTest.db";

            var sourceDatbasePath = Path.Combine(databaseFolder, sourceDatabase);
            var targetDatbasePath = Path.Combine(databaseFolder, targetDatabase);

            File.Copy(sourceDatbasePath, targetDatbasePath, overwrite: true);
#endif
        }
    }

    [CollectionDefinition("Integration")]
    public class IntegrationTestCollection : ICollectionFixture<CollectionFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}

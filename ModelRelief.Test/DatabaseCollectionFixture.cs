// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
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

namespace ModelRelief.Test
{
    /// <summary>
    /// Represents the shared setup for all classes (of the same collection name).
    /// This is run once for every collection.
    /// </summary>
    public class DatabaseCollectionFixture : IDisposable
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        public DatabaseCollectionFixture()
        {
            var serverFramework = new ServerFramework();
            var serviceProvider = serverFramework.Server.Host.Services;

            var dbInitializer = new DbInitializer(serviceProvider);
            dbInitializer.SynchronizeTestDatabase(restore: true);
        }

        /// <summary>
        /// Dispose of owned managed resources.
        /// </summary>
        public void Dispose()
        {
        }
    }

    [CollectionDefinition("Database")]
    public class DatabaseCollection : ICollectionFixture<DatabaseCollectionFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}

// -----------------------------------------------------------------------
// <copyright file="DatabaseCollectionFixture.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System;
    using ModelRelief.Database;
    using Xunit;

    /// <summary>
    /// Represents the shared setup for all classes (of the same collection name).
    /// This is run once for every collection.
    /// </summary>
    public class DatabaseCollectionFixture : IDisposable
    {
        public ServerFramework ServerFramework { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DatabaseCollectionFixture"/> class.
        /// Constructor.
        /// </summary>
        public DatabaseCollectionFixture()
        {
            ServerFramework = new ServerFramework();
            var serviceProvider = ServerFramework.Server.Host.Services;

            var dbInitializer = new DbInitializer(serviceProvider, forceInitializeAll: false);
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

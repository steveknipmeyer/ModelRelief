// -----------------------------------------------------------------------
// <copyright file="DatabaseCollectionFixture.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System;
    using Microsoft.Extensions.DependencyInjection;
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
            ServerFramework.Initialize().Wait();

            // create a scope to get scoped services
            // https://stackoverflow.com/questions/59774559/how-do-i-get-a-instance-of-a-service-in-asp-net-core-3-1
            using (var scope = ServerFramework.Server.Services.CreateScope())
            {
                // N.B. XUnit ICollectionFixture cannot use DI.
                var serviceProvider = scope.ServiceProvider;

                var initializer = serviceProvider.GetRequiredService<IInitializer>();
                initializer.Initialize();

                var dbFactory = serviceProvider.GetRequiredService<IDbFactory>();
                dbFactory.SynchronizeTestDatabase(restore: true);
            }
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
        // This class has no code and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}

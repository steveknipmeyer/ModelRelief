// -----------------------------------------------------------------------
// <copyright file="ClassFixture.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System;

    /// <summary>
    /// Represents the shared instance of the TestServer to support multiple tests.
    /// This is run once for every class.
    /// </summary>
    public class ClassFixture : IDisposable
    {
        public ServerFramework ServerFramework { get; }
        public DatabaseCollectionFixture CollectionFixture { get; set; }
        public IServiceProvider ServiceProvider { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ClassFixture"/> class.
        /// </summary>
        /// <param name="collectionFixture">Database collection fixture instantiated before any test methods are executed.</param>
        public ClassFixture(DatabaseCollectionFixture collectionFixture)
        {
            CollectionFixture = collectionFixture;

            // WIP: Only the integration tests directly require the TestServer. However, all tests (integration, unit) require IServiceProvider.
            // The TestServer provides access to IServiceProvider through Server.Host so the ServerFramework is present in all tests.
            ServerFramework = collectionFixture.ServerFramework;

            ServiceProvider = ServerFramework.Server.Services;
        }

        /// <summary>
        /// Dispose of owned managed resources.
        /// </summary>
        public void Dispose()
        {
        }
    }
}

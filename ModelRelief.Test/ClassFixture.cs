// -----------------------------------------------------------------------
// <copyright file="ClassFixture.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
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
        public IServiceProvider ServiceProvider { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ClassFixture"/> class.
        /// Constructor.
        /// </summary>
        public ClassFixture()
        {
            // WIP: Only the integration tests directly require the TestServer. However, all tests (integration, unit) require IServiceProvider.
            // The TestServer provides access to IServiceProvider through Server.Host so the ServerFramework is present in all tests.
            ServerFramework = new ServerFramework();

            ServiceProvider = ServerFramework.Server.Host.Services;
        }

        /// <summary>
        /// Dispose of owned managed resources.
        /// </summary>
        public void Dispose()
        {
        }
    }
}

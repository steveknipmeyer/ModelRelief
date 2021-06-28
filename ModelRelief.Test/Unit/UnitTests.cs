// -----------------------------------------------------------------------
// <copyright file="UnitTests.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Unit
{
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using ModelRelief.Database;
    using ModelRelief.Services;
    using Xunit;

    /// <summary>
    /// Base class for unit tests.
    /// </summary>
    [Collection("Database")]
    public abstract class UnitTests : IClassFixture<ClassFixture>, IAsyncLifetime
    {
        public ClassFixture ClassFixture { get; set; }

        /// <summary>
        /// Gets or sets the primary database context.
        ///     It is difficult to mock extensions methods such as the EF ToListAsync.
        ///     Jimmy Bogard and K. Scott Allen do not recommend mocking a DbContext.
        /// </summary>
        public ModelReliefDbContext DbContext { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="UnitTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public UnitTests(ClassFixture classFixture)
        {
            ClassFixture = classFixture;

            Services.IConfigurationProvider configurationProvider = classFixture.ServerFramework.ConfigurationProvider;
            var database = configurationProvider.Database;

            DbContextOptionsBuilder optionsBuilder;
            switch (database)
            {
                case RelationalDatabaseProvider.SQLite:
                default:
                    optionsBuilder = new DbContextOptionsBuilder()
                                            .UseSqlite(configurationProvider.Configuration.GetConnectionString(ConfigurationSettings.SQLite));
                    break;
            }
            DbContext = new ModelReliefDbContext(optionsBuilder.Options);
        }

        /// <summary>
        /// Called before class is used. Opportunity to use an async method for setup.
        /// </summary>
        public Task InitializeAsync()
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Dispose of managed resources (e.g. DbContext).
        /// http://blog.stephencleary.com/2009/08/second-rule-of-implementing-idisposable.html
        /// Called before class is destroyed. Opportunity to use an async method for teardown.
        /// </summary>
        public Task DisposeAsync()
        {
            DbContext.Dispose();
            return Task.CompletedTask;
        }
    }
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Test.TestModels;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Unit
{
    /// <summary>
    /// Base class for unit tests.
    /// </summary>
    [Collection("Database")]
    public abstract class UnitTests: IClassFixture<ClassFixture>, IAsyncLifetime
    {
        public ClassFixture ClassFixture { get; set; }

        /// <summary>
        /// Returns the primary database context.
        ///     It is difficult to mock extensions methods such as the EF ToListAsync.
        //      Jimmy Bogard and K. Scott Allen do not recommend mocking a DbContext. 
        /// </summary>
        public ModelReliefDbContext DbContext { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public UnitTests(ClassFixture classFixture)
        {
            ClassFixture = classFixture;

            var optionsBuilder = new DbContextOptionsBuilder()
                                        .UseSqlite(Settings.SQLiteConnectionString);
            DbContext = new ModelReliefDbContext(optionsBuilder.Options);
        }

        /// <summary>
        /// Called before class is used. Opportunity to use an async method for setup.
        /// </summary>
        /// <returns></returns>
        public Task InitializeAsync()
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Dispose of managed resources (e.g. DbContext).
        /// http://blog.stephencleary.com/2009/08/second-rule-of-implementing-idisposable.html
        /// Called before class is destroyed. Opportunity to use an async method for teardown.
        /// </summary>
        /// <returns></returns>
        public Task DisposeAsync()
        {
            DbContext.Dispose();
            return Task.CompletedTask;
        }
    }
}

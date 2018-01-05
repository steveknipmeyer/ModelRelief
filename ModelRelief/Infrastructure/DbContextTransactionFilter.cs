﻿// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using ModelRelief.Database;
using ModelRelief.Services;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace ModelRelief.Infrastructure

{
    /// <summary>
    /// Wraps each Action in a database transaction.
    /// </summary>
    public class DbContextTransactionFilter : IAsyncActionFilter
    {
        private readonly ModelReliefDbContext    _dbContext;
        private IDependencyManager               _dependencyManager;
        private readonly ILogger<DatabaseLogger> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="dependencyManager">Services for persistence and dependency manager.</param>
        /// <param name="logger">ILogger.</param>
        public DbContextTransactionFilter(ModelReliefDbContext dbContext, IDependencyManager dependencyManager, ILogger<DatabaseLogger> logger)
        {
            _dbContext = dbContext;
            _dependencyManager = dependencyManager;
            _logger = logger;
        }

        /// <summary>
        /// Action filter; wraps each Action in a database transaction.
        /// </summary>
        /// <param name="context">Context</param>
        /// <param name="next">Action delegate</param>
        /// <returns></returns>
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            try
            {
               using (var transaction = _dbContext.Database.BeginTransaction())
               {
                    // WIP: This filter is disabled. It is generally not necessary to use explicit transactions as DbContext.SaveChanges(Async) employs transactions internally.
                    //      So, all database operations succees or fail.
                    //      Moreover, exceptions thrown by asynchronous tasks below here (e.g. await next()) are swallowed so the catch block is never reached here.
                    await next();

                    await _dependencyManager.PersistChangesAsync(null);
                    transaction.Commit();
                }
            }
            catch (Exception ex)
            {
                _dbContext.Database.RollbackTransaction();

                var message = $"A transaction error occurred for controller: {context.HttpContext.Request.Path}.";
                _logger.LogError(ex, message);

                // WIP: Debug.Assert does not open a dialog. It also causes the TestRunner to abort the active test run.
                Debug.WriteLine(message);
            }
        }
    }
}
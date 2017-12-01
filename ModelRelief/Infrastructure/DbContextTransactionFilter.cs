// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using ModelRelief.Database;
using System;
using System.Threading.Tasks;

namespace ModelRelief.Infrastructure

{
    /// <summary>
    /// Wraps each Action in a database transaction.
    /// </summary>
    public class DbContextTransactionFilter : IAsyncActionFilter
    {
        private readonly ModelReliefDbContext _dbContext;
        private readonly ILogger<DatabaseLogger> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="logger">ILogger.</param>
        public DbContextTransactionFilter(ModelReliefDbContext dbContext, ILogger<DatabaseLogger> logger)
        {
            _dbContext = dbContext;
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
                    await next();

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "A transaction error occurred for controller: {0}.", context.HttpContext.Request.Path);
            }
        }
    }
}
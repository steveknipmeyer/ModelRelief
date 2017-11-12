// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc.Filters;
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

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        public DbContextTransactionFilter(ModelReliefDbContext dbContext)
        {
            _dbContext = dbContext;
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
               using (var transaction =  _dbContext.Database.BeginTransaction())
               {
                    await next();

                    _dbContext.SaveChanges();
                    transaction.Commit();
                }
            }
            catch (Exception)
            {
                _dbContext.Database.RollbackTransaction();
            }
        }
    }
}
// -----------------------------------------------------------------------
// <copyright file="ModelsUnitTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Unit
{
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Features.Models;
    using Xunit;

    public class ModelsUnitTests
    {
        /// <summary>
        /// Test that a Models Index returns a ViewResult.
        /// </summary>
        // [Fact]
        // This is disabled for two reasons.
        // 1) It is difficult to mock extensions methods such as the EF ToListAsync.
        // 2) Jimmy Bogard and K. Scott Allen do not recommend mocking a DbContext.
        // Instead, use integration tests such as those in ContosoUniversityCore.
        public void Index__returns_models()
        {
            // Arrange
            var optionsBuilder = new DbContextOptionsBuilder()
                .UseSqlite("Data Source=Database\\ModelRelief.db");
            ModelReliefDbContext            dbContext             = new ModelReliefDbContext(optionsBuilder.Options);
            UserManager<ApplicationUser>    userManager           = null;        // ?
            ILoggerFactory                  loggerFactory         = null;
            IMapper                         mapper                = null;        // AutoMapper must be initialized with all the MappingProfiles.
            IMediator                       mediator              = null;        // Mediator requires all the Request/Handler types to be registered for DI.
            Services.IConfigurationProvider configurationProvider = null;

            var controller = new ModelsController(dbContext, userManager, loggerFactory, mapper, mediator, configurationProvider);

            // Act
            var result = controller.Index(new GetListRequest());

            // Assert
            Assert.IsType<ViewResult>(result);
        }
    }
}

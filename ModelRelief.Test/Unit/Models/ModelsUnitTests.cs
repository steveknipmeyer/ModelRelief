// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Features.Models;
using Moq;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace ModelRelief.Test.Unit.Models
{
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
            ModelReliefDbContext  dbContext  = new ModelReliefDbContext(optionsBuilder.Options);

            IMapper               mapper     = null;        // AutoMapper must be initialized with all the MappingProfiles.
            IMediator             mediator   = null;        // Mediator requires all the Request/Handler types to be registered for DI.

            var controller = new ModelsController(dbContext, mapper, mediator);

            // Act
            var result = controller.Index(new GetRequest());

            // Assert
            Assert.IsType<ViewResult>(result);
        }
    }
}

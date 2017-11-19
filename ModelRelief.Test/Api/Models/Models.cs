// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Features.Models;
using ModelRelief.Domain;
using ModelRelief.Services;
using Moq;
using System.Collections.Generic;
using Xunit;
using ModelRelief.Database;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using MediatR;

namespace ModelRelief.Test.Api.Models
{
    public class Models
    {
        /// <summary>
        /// Test that a Models Index returns a ViewResult.
        /// </summary>
        // [Fact]
        // This is disabled for two reasons.
        // 1) It is difficult to mock extensions methods such as the EF ToListAsync.
        // 2) Jimmy Bogard and K. Scott Allen do not recommend mocking a DbContext. 
        // Instead, use integration tests such as those in ContosoUniversityCore.
        public void Index_ReturnsModels()
        {
            // Arrange
//          ModelReliefDbContext        dbContext          = null;
            ILogger<ModelsController>   logger             = null;
            IMapper                     mapper             = null;
            IMediator                   mediator           = null;
            var dbContextMock = new Mock<ModelReliefDbContext>();
            dbContextMock.Setup(mock => mock.Models.ToList()).Returns(new List<Model3d>() 
                    {
                        new Model3d() { Id = 1, Name = "M1", Description = "Model One"},
                        new Model3d() { Id = 2, Name = "M2", Description = "Model Two"}
                    }
            );

            var controller = new ModelsController(dbContextMock.Object, logger, mapper, mediator);

            // Act
            var result = controller.Index(new Index.Query());

            // Assert
            Assert.IsType<ViewResult>(result);
        }
    }
}

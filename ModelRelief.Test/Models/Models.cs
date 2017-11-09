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

namespace ModelRelief.Test.Models
{
    public class Models
    {
        /// <summary>
        /// Test that a Models Index returns a ViewResult.
        /// </summary>
        [Fact]
        public void Index_ReturnsModels()
        {
            // Arrange
            IHostingEnvironment         hostingEnvironment = null;
//          IModelsProvider             modelsProvider     = null;
            ILogger<ModelsController>   logger             = null;
            IMapper                     mapper             = null;

            var modelsProviderMock = new Mock<IModelsProvider>();
            modelsProviderMock.Setup(provider => provider.Model3ds.GetAll()).Returns(new List<Model3d>() 
                    {
                        new Model3d() { Id = 1, Name = "M1", Description = "Model One"},
                        new Model3d() { Id = 2, Name = "M2", Description = "Model Two"}
                    }
            );

            var controller = new ModelsController(hostingEnvironment, modelsProviderMock.Object, logger, mapper);

            // Act
            var result = controller.Index();

            // Assert
            Assert.IsType<ViewResult>(result);
        }
    }
}

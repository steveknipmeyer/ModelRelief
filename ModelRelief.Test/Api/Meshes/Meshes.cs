// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Logging;
using ModelRelief.Api.V1;
using ModelRelief.Api.V1.Meshes;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Features.Meshes;
using ModelRelief.Infrastructure;
using ModelRelief.Services;
using ModelRelief.Utility;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

using ApiV1Meshes =  ModelRelief.Api.V1.Meshes;

namespace ModelRelief.Test.Api.Meshes
{
    public class Meshes
    {
        /// <summary>
        /// Test that an invalid PutMeshModel returns BadRequest.
        /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
        /// http://blogs.clariusconsulting.net/kzu/how-to-design-a-unit-testable-domain-model-with-entity-framework-code-first/
        /// </summary>
        // [Fact]
        // This is disabled for two reasons.
        // 1) It is difficult to mock extensions methods such as the EF ToListAsync.
        // 2) Jimmy Bogard and K. Scott Allen do not recommend mocking a DbContext. 
        // Instead, use integration tests such as those in ContosoUniversityCore.
        public void PUT_WithInvalidData_ReturnsBadRequest()
        {
            // Arrange
            IHostingEnvironment             hostingEnvironment     = null;
//          UserManager<User>               userManager            = null;
//          ModelReliefDBContext            dbContext              = null;
            ILogger<Mesh>                   logger                 = null;
            Services.IConfigurationProvider configurationProvider  = null;
            IMapper                         mapper                 = null;
           
            // Arrange
            var userStoreMock   = new Mock<IUserStore<ApplicationUser>>();
            var userManagerMock = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
            userManagerMock.Setup(userManager => userManager.FindByIdAsync(It.IsAny<string>()))
                           .Returns(Task.FromResult<ApplicationUser>(new ApplicationUser() { Id = Identity.MockUserId }));

            var dbContextMock = new Mock<ModelReliefDbContext>();
            dbContextMock.Setup(mock => mock.Meshes.ToList()).Returns(new List<Mesh>() 
                    {
                        new Mesh() { Id = 1, Name = "", Description = "Mesh One", User = new ApplicationUser() {Id = Identity.MockUserId}},
                        new Mesh() { Id = 2, Name = "M2", Description = "Mesh Two", User = new ApplicationUser() {Id = ""}}
                    }
            );

            var controller = new ApiV1Meshes.MeshesController(hostingEnvironment, userManagerMock.Object, dbContextMock.Object, logger, configurationProvider, mapper);
            var mockUrlHelper = new Mock<IUrlHelper>();

            var apiReferenceRelative = $"{Settings.ApiDocumentatioRelative}/meshes/{(int) ApiStatusCode.MeshPutValidationError}";
            // https://stackoverflow.com/questions/45855999/mocking-url-routeurl
            mockUrlHelper
                .Setup(x => x.RouteUrl(It.IsAny<UrlRouteContext>()))
                .Returns(apiReferenceRelative);

            controller.Url                           = mockUrlHelper.Object;
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.Request.Scheme                = Settings.Scheme;
            controller.Request.Host                  = new HostString(Settings.Host, Settings.Port);

            var meshId = 1;
            var meshPutModel = new MeshPutModel() { Name = "", Description = "meshPutModel with an empty Name"};

            // Act
            var result = controller.Put(meshPutModel, meshId);

            // Assert
            Assert.IsType<Task<ObjectResult>>(result);

            var apiResult = result.Result.Value as ApiResult;
            Assert.Equal(apiResult.HttpStatusCode, StatusCodes.Status400BadRequest);
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Logging;
using ModelRelief.Controllers.Api;
using ModelRelief.Infrastructure;
using ModelRelief.Models;
using ModelRelief.Services;
using ModelRelief.Utility;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Api
{
    public class Meshes
    {

        [Fact]
        public void PUT_WithInvalidData_ReturnsBadRequest()
        {
            // Arrange
            IHostingEnvironment             hostingEnvironment     = null;
//          UserManager<User>               userManager            = null;
//          IModelsProvider                 modelsProvider         = null;
            ILogger<Mesh>                   logger                 = null;
            Services.IConfigurationProvider configurationProvider  = null;
            IMapper                         mapper                 = null;
           
            // Arrange
            var userStoreMock   = new Mock<IUserStore<ApplicationUser>>();
            var userManagerMock = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
            userManagerMock.Setup(userManager => userManager.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
                           .Returns(Task.FromResult<ApplicationUser>(new ApplicationUser() { Id = Identity.MockUserId }));

            var meshProviderMock = new Mock<IModelProvider<Mesh>>();
            meshProviderMock.Setup(provider => provider.GetAll()).Returns(new List<Mesh>() 
                    {
                        new Mesh() { Id = 1, Name = "", Description = "Mesh One", User = new ApplicationUser() {Id = Identity.MockUserId}},
                        new Mesh() { Id = 2, Name = "M2", Description = "Mesh Two", User = new ApplicationUser() {Id = ""}}
                    }
            );

            var modelsProviderMock = new Mock<IModelsProvider>();
            // https://stackoverflow.com/questions/20170600/returning-moq-instance-from-another-mock
            modelsProviderMock.SetupGet<IModelProvider<Mesh>>(provider => provider.Meshes)
                              .Returns(meshProviderMock.Object);


            var controller = new MeshesController(hostingEnvironment, userManagerMock.Object, modelsProviderMock.Object, logger, configurationProvider, mapper);
            var mockUrlHelper = new Mock<IUrlHelper>();
            mockUrlHelper
                .Setup(x => x.Action(It.IsAny<UrlActionContext>()))
                .Returns("PUT");

            controller.Url = mockUrlHelper.Object;
            controller.ControllerContext.HttpContext = new DefaultHttpContext();

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

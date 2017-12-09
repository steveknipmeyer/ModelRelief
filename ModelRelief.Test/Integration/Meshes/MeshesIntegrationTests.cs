// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1;
using ModelRelief.Api.V1.Meshes;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Test.Integration;
using Newtonsoft.Json;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration.Meshes
{
    public class DatabaseFixture
    {

    }

    public class MeshesIntegrationTests
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    {
        private const string MeshesUrl = "/api/v1/meshes";

        /// <summary>
        /// Constructor
        /// </summary>
        public MeshesIntegrationTests()
        {
            Framework.RefreshTestDatabase();
        }

        /// <summary>
        /// Test that a valid Mesh can be created through POST.
        /// </summary>
        [Fact]
        public async Task POST_CanCreateNewMesh()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh() 
                {
                Name = "Test Mesh",
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.STL
                };

            // Act
            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Post, MeshesUrl, meshPostModel);

            // Assert
            requestResponse.Message.EnsureSuccessStatusCode();

            var newMesh = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            newMesh.Name.Should().Be("Test Mesh");
        }
    
        /// <summary>
        /// Test that an invalid Mesh POST returns BadRequest.
        /// </summary>
        [Fact]
        public async Task POST_InvalidPropertyValueReturnsBadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh() 
                {
                Name = ""
                };

            // Act
            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Post, MeshesUrl, meshPostModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Mesh PUT updates the target property.
        /// </summary>
        [Fact]
        public async Task PUT_TargetPropertyIsUpdated()
        {
            // Arrange
            var meshId = 1;
            var updatedDescription = "This description has been updated.";
            var meshPutModel = new 
                {
                Description = updatedDescription,
                };

            // Act
            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Put, $"{MeshesUrl}/{meshId}", meshPutModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedMesh = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            updatedMesh.Description.Should().Be(updatedDescription);
        }

        /// <summary>
        /// Test that a Mesh PUT with an invalid Id returns NotFound.
        /// </summary>
        [Fact]
        public async Task PUT_InvalidIdPropertyReturnsNotFound()
        {
            // Arrange
            var meshId = 100;
            var updatedDescription = "This description has been updated.";
            var meshPutModel = new 
                {
                Description = updatedDescription,
                };

            // Act
            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Put, $"{MeshesUrl}/{meshId}", meshPutModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that an invalid Mesh PUT with an umknown property returns BadRequest.
        /// </summary>
        [Fact]
        public async Task PUT_InvalidPropertyNameReturnsBadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh
                {
                Name = "Test Mesh",
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.OBJ,
                };

            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Post, MeshesUrl, meshPostModel);
            var newModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);

            var invalidMeshPostModel = new
                {
                InvalidProperty = "NonExistent"
                };

            // Act
            requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Put, $"{MeshesUrl}/{newModel.Id}", invalidMeshPostModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that an invalid Mesh PUT with an invalid enum property value returns BadRequest.
        /// </summary>
        [Fact]
        public async Task PUT_InvalidEnumPropertyValueReturnsBadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh
                {
                Name = "Test Mesh",
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.OBJ,
                };

            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Post, MeshesUrl, meshPostModel);
            var newModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);

            var invalidMeshPostModel = new
                {
                Format = "ABC"
                };

            // Act
            requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Put, $"{MeshesUrl}/{newModel.Id}", invalidMeshPostModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Mesh GET with an valid Id property value returns correct model.
        /// </summary>
        [Fact]
        public async Task GET_ValidIdPropertyValueReturnsOk()
        {
            // Arrange
            // Test user owns Mesh resources [1,3].
            var meshId = 1;

            // Act
            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Get, $"{MeshesUrl}/{meshId}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var mesh = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            mesh.Name.Should().Be("Lucy");
        }

        /// <summary>
        /// Test that a Mesh GET with an invalid Id property value returns NotFound.
        /// </summary>
        [Fact]
        public async Task GET_InvalidIdPropertyValueReturnsNotFound()
        {
            // Arrange
            // Test user owns Mesh resources [1,3].
            var meshId = 4;

            // Act
            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Get, $"{MeshesUrl}/{meshId}");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Mesh GET (List) returns the correct count of meshes.
        /// </summary>
        [Fact]
        public async Task GET_ListReturnsCorrectCount()
        {
            // Arrange

            // Act
            var requestResponse = await Framework.SubmitHttpRequest(HttpRequestType.Get, MeshesUrl);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var pagedResults = JsonConvert.DeserializeObject<PagedResults<Dto.Mesh>>(requestResponse.ContentString);
            pagedResults.Results.Count().Should().Be(3);
        }
    }
}

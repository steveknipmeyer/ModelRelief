
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
    /// <summary>
    /// Represents the shared instance of the TestServer to support multiple tests.
    /// </summary>
    public class ServerFixture
    {
        public Framework Framework { get; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public ServerFixture()
        {
            Framework = new Framework();
        }
    }

    /// <summary>
    /// Meshes Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshesIntegrationTests : IClassFixture<ServerFixture>
    {
        private const string ApiMeshesUrl = "/api/v1/meshes";
        private const string UxMeshesUrl  = "/meshes";

        private ServerFixture ServerFixture { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public MeshesIntegrationTests(ServerFixture serverFixture)
        {
            ServerFixture = serverFixture;
            ServerFixture.Framework.RefreshTestDatabase();
        }
#region Get
        /// <summary>
        /// Test that a Mesh GET with an valid Id property value returns correct model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task GetSingle_ValidIdPropertyValueReturnsOk()
        {
            // Arrange
            // Test user owns Mesh resources [1,3].
            var meshId = 1;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiMeshesUrl}/{meshId}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var mesh = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            mesh.Name.Should().Be("Lucy");
        }

        /// <summary>
        /// Test that a Mesh GET with an invalid Id property value returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task GetSingle_InvalidIdPropertyValueReturnsNotFound()
        {
            // Arrange
            // Test user owns Mesh resources [1,3].
            var meshId = 4;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiMeshesUrl}/{meshId}");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Mesh GET (List) returns the correct count of meshes.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task GetList_ListReturnsCorrectCount()
        {
            // Arrange

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, ApiMeshesUrl);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var pagedResults = JsonConvert.DeserializeObject<PagedResults<Dto.Mesh>>(requestResponse.ContentString);
            pagedResults.Results.Count().Should().Be(3);
        }
#endregion
#region Post
        /// <summary>
        /// Test that a valid Mesh can be created through POST.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostAdd_CanCreateNewMesh()
        {
            // Arrange
            var meshName = "Api Test Mesh";
            var meshPostModel = new Dto.Mesh() 
                {
                Name = meshName,
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.STL
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiMeshesUrl, meshPostModel);

            // Assert
            requestResponse.Message.EnsureSuccessStatusCode();

            var newMesh = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            newMesh.Name.Should().Be(meshName);
        }
    
        /// <summary>
        /// Test that an invalid Mesh POST returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostAdd_InvalidPropertyValueReturnsBadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh() 
                {
                Name = ""
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiMeshesUrl, meshPostModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a valid Mesh can be updated through a POST.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostUpdate_CanUpdateModel()
        {
            // Arrange
            var meshName = "Api Test Mesh";
            var meshId = 1;
            var meshPostModel = new  
                {
                Id = meshId,
                Name = meshName,
                Description = "This mesh was updated through an integration test.",
                Format = Domain.MeshFormat.STL
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{ApiMeshesUrl}/{meshId}", meshPostModel);

            // Assert
            requestResponse.Message.EnsureSuccessStatusCode();

            var newMesh = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            newMesh.Name.Should().Be(meshName);
        }

        /// <summary>
        /// Test that a Mesh with an invalid ID returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostUpdate_InvalidIdPropertyReturnsNotFound()
        {
            // Arrange
            var meshName = "Api Test Mesh";
            var meshId = 100;
            var meshPostModel = new  
                {
                Id = meshId,
                Name = meshName,
                Description = "This mesh has an invalid ID.",
                Format = Domain.MeshFormat.STL
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{ApiMeshesUrl}/{meshId}", meshPostModel);

            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }

#endregion
#region Put
        /// <summary>
        /// Test that a Mesh PUT updates the target property.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_TargetPropertyIsUpdated()
        {
            // Arrange
            var meshId = 1;
            var updatedDescription = "This description has been updated.";
            var meshPutModel = new 
                {
                Description = updatedDescription,
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{meshId}", meshPutModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedMesh = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            updatedMesh.Description.Should().Be(updatedDescription);
        }

        /// <summary>
        /// Test that a Mesh PUT with an invalid Id returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_InvalidIdPropertyReturnsNotFound()
        {
            // Arrange
            var meshId = 100;
            var updatedDescription = "This description has been updated.";
            var meshPutModel = new 
                {
                Description = updatedDescription,
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{meshId}", meshPutModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that an invalid Mesh PUT with an umknown property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_InvalidPropertyNameReturnsBadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh
                {
                Name = "Api Test Mesh",
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.OBJ,
                };

            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiMeshesUrl, meshPostModel);
            var newModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);

            var invalidMeshPostModel = new
                {
                InvalidProperty = "NonExistent"
                };

            // Act
            requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{newModel.Id}", invalidMeshPostModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that an invalid Mesh PUT with an invalid enum property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_InvalidEnumPropertyValueReturnsBadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh
                {
                Name = "Api Test Mesh",
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.OBJ,
                };

            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiMeshesUrl, meshPostModel);
            var newModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);

            var invalidMeshPostModel = new
                {
                Format = "WavefrontOBJ"
                };

            // Act
            requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{newModel.Id}", invalidMeshPostModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }
        #endregion

#region Delete
        /// <summary>
        /// Test that a Mesh DELETE deletes the target model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Delete_TargetModelIsDeleted()
        {
            // Arrange
            var meshId = 1;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Delete, $"{ApiMeshesUrl}/{meshId}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            // Now attempt to access the deleted model.....
            requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiMeshesUrl}/{meshId}");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Mesh DELETE with an invalid Id property value returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Delete_InvalidIdPropertyValueReturnsNotFound()
        {
            // Arrange
            // Test user owns Mesh resources [1,3].
            var meshId = 4;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Delete, $"{ApiMeshesUrl}/{meshId}");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }
#endregion
    }
}

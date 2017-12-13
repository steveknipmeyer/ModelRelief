// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
        private static IEnumerable<int> IdRange = Enumerable.Range(1, 3);

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

        /// <summary>
        /// Finds an existing model.
        /// </summary>
        /// <param name="id">Id of model to retrieve.</param>
        /// <returns>Existing model.</returns>
        private async Task<Dto.Mesh> FindModel(int modelId)
        {
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiMeshesUrl}/{modelId}");

            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var existingModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            return existingModel;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        private Dto.Mesh ConstructValidModel()
        {
            var validModel = new Dto.Mesh()
            {
                Name = "Test Mesh",
                Description = "This mesh was updated through automated testing.",
                Format = Domain.MeshFormat.OBJ
            };
            return validModel;
        }

        /// <summary>
        /// Constructs an invalid model.
        /// </summary>
        /// <returns>Invalid model.</returns>
        private Dto.Mesh ConstructInvalidModel()
        {
            // Required properties are missing.
            //  Name 
            //  Description 
            //  Format 
            var invalidModel = new Dto.Mesh()
            {
            };
            return invalidModel;
        }

        /// <summary>
        /// Asserts that the request returned a specific HTTP status code.
        /// </summary>
        /// <param name="requestResponse">Response.</param>
        /// <param name="statusCode">Expected status code.</param>
        private void AssertHttpStatusCode(RequestResponse requestResponse, HttpStatusCode statusCode)
        {
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be(( int )statusCode);
        }

#region Get
        /// <summary>
        /// Test that a GetSingle request with an valid Id property value returns correct model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task GetSingle_ValidIdPropertyValueReturnsCorrectModel()
        {
            var modelId = IdRange.Min();
            var existingModel = await FindModel(modelId);

            existingModel.Name.Should().Be("Lucy");
        }

        /// <summary>
        /// Test that a GetSingle request with an invalid Id property value returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task GetSingle_InvalidIdPropertyValueReturnsNotFound()
        {
            // Arrange
            var modelId = IdRange.Max() + 1;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiMeshesUrl}/{modelId}");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a GetList request returns the correct count of models.
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
            var expectedCount = IdRange.Max() - IdRange.Min() + 1;
            pagedResults.Results.Count().Should().Be(expectedCount);
        }
#endregion
#region Post
        /// <summary>
        /// Test that a PostAdd request can create a model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostAdd_CanCreateNewModel()
        {
            // Arrange
            var validModel = ConstructValidModel();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiMeshesUrl, validModel);

            // Assert
            requestResponse.Message.EnsureSuccessStatusCode();

            var newModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            newModel.Name.Should().Be(validModel.Name);
        }
    
        /// <summary>
        /// Test that an PostAdd request returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostAdd_InvalidPropertyValueReturnsBadRequest()
        {
            // Arrange
            var invalidModel = ConstructInvalidModel();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiMeshesUrl, invalidModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a PostAdd request with a valid reference property creates the model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostAdd_ValidReferencePropertyCreatesModel()
        {
            // Arrange
            var validModel = ConstructValidModel();
            var projectId = 1;
            validModel.ProjectId = projectId;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiMeshesUrl, validModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var newModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            newModel.ProjectId.Should().Be(projectId);
        }

        /// <summary>
        /// Test that an model PostAdd with an invalid reference property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostAdd_InvalidReferencePropertyReturnsBadRequest()
        {
            // Arrange
            var invalidModel = ConstructValidModel();
            invalidModel.ProjectId = 0;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiMeshesUrl, invalidModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a PostUpdate can update a model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostUpdate_CanUpdateModel()
        {
            // Arrange
            var modelId = IdRange.Min();
            var existingModel = await FindModel(modelId);

            var updatedName = "Updated Name Property";
            existingModel.Name = updatedName;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{ApiMeshesUrl}/{modelId}", existingModel);

            // Assert
            requestResponse.Message.EnsureSuccessStatusCode();
            
            var updatedModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            updatedModel.Name.Should().Be(updatedName);
        }

        /// <summary>
        /// Test that a PostUpdate request with an invalid Id returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostUpdate_InvalidIdReturnsNotFound()
        {
            // Arrange
            var modelId = IdRange.Max();
            var existingModel = await FindModel (modelId);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{ApiMeshesUrl}/{modelId + 1}", existingModel);

            // Assert    
            AssertHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a PostUpdate a valid reference property can be updated.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostUpdate_ValidReferencePropertyUpdatesModel()
        {
            // Arrange
            var modelId = IdRange.Max();
            var existingModel = await FindModel (modelId);

            var projectId = 1;
            existingModel.ProjectId = 1;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{ApiMeshesUrl}/{modelId}", existingModel);

            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            updatedModel.ProjectId.Should().Be(projectId);
        }

        /// <summary>
        /// Test that a PostUpdate with an invalid reference property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task PostUpdate_InvalidReferencePropertyReturndBadRequest()
        {
            // Arrange
            var modelId = IdRange.Max();
            var existingModel = await FindModel (modelId);

            existingModel.ProjectId = 0;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{ApiMeshesUrl}/{modelId}", existingModel);
            
            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

#endregion
#region Put
        /// <summary>
        /// Test that a Put request updates the target property.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_TargetPropertyIsUpdated()
        {
            // Arrange
            var modelId = IdRange.Min();
            var updatedName = "Updated Name Property";
            var putModel = new 
            {
                Name = updatedName
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", putModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            updatedModel.Name.Should().Be(updatedName);
        }

        /// <summary>
        /// Test that a Put request with an invalid Id returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_InvalidIdPropertyReturnsNotFound()
        {
            // Arrange
            var modelId = IdRange.Max() + 1;
            var updatedName = "Updated Name Property";
            var putModel = new 
            {
                Name = updatedName
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", putModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Put request with an umknown property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_InvalidPropertyNameReturnsBadRequest()
        {
            // Arrange
            var modelId = IdRange.Max();
            var invalidPutModel = new
                {
                InvalidProperty = "NonExistent"
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", invalidPutModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Put request with an invalid enum property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_InvalidEnumPropertyValueReturnsBadRequest()
        {
            // Arrange
            var modelId = IdRange.Max();
            var invalidPutModel = new
                {
                Format = "Invalid Format"
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", invalidPutModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Put request with an invalid reference property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_InvalidReferencePropertyReturnsBadRequest()
        {
            // Arrange
            var modelId = IdRange.Max();
            var invalidPutModel = new
            {
                ProjectId = 0
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", invalidPutModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Put request with two invalid reference properties returns BadRequest and two validation errors.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_MultipleInvalidReferencePropertiesReturnsMultipleValidationErrorsAndBadRequest()
        {
            // Arrange
            var modelId = IdRange.Max();
            var invalidReferenceProperties = 3;
            var invalidPutModel = new
            {
                ProjectId = 0,
                CameraId  = 0,
                DepthBufferId = 0
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", invalidPutModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.Errors.Count().Should().Be(invalidReferenceProperties);

        }

        /// <summary>
        /// Test that an Put request with an invalid reference property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_ValidReferencePropertyUpdatesModel()
        {
            // Arrange
            var modelId = IdRange.Max();
            var projectId = 1;
            var validPutModel = new
                {
                ProjectId = projectId
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", validPutModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            updatedModel.ProjectId.Should().Be(projectId);
        }
        #endregion

#region Delete
        /// <summary>
        /// Test that a Delete request deletes the target model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Delete_TargetModelIsDeleted()
        {
            // Arrange
            var modelId = IdRange.Min();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Delete, $"{ApiMeshesUrl}/{modelId}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            // Now attempt to access the deleted model.....
            requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiMeshesUrl}/{modelId}");

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Delete request with an invalid Id property value returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Delete_InvalidIdPropertyValueReturnsNotFound()
        {
            // Arrange
            var modelId = IdRange.Max() + 1;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Delete, $"{ApiMeshesUrl}/{modelId}");

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }
#endregion
    }
}

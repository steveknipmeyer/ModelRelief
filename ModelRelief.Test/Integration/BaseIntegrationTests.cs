// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Dto;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration
{
    /// <summary>
    /// Represents the shared instance of the TestServer to support multiple tests.
    /// </summary>
    public class ServerFixture : IDisposable
    {
        public Framework Framework { get; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public ServerFixture()
        {
            Framework = new Framework();
        }

        /// <summary>
        /// Dispose of unmanaged resources.
        /// </summary>
        public void Dispose()
        {
        }
    }

    /// <summary>
    /// Base Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public abstract class BaseIntegrationTests <TGetModel>: IClassFixture<ServerFixture>, IAsyncLifetime
        where TGetModel : class, ITGetModel, new()
    {
        private ServerFixture ServerFixture { get; set; }

        public static IEnumerable<int> IdRange  { get; set; }
        public string ApiUrl { get; set; }
        public string UxUrl  {get; set; }
        public string FirstModelName { get; set; }
        
        public int? InvalidReferenceProperty { get; set; }
        public int? ValidReferenceProperty { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public BaseIntegrationTests(ServerFixture serverFixture)
        {
            ServerFixture = serverFixture;

            Initialize();
        }

        /// <summary>
        /// Called before class is used. Opportunity to use an async method for setup.
        /// </summary>
        /// <returns></returns>
        public Task InitializeAsync()
        {
            ServerFixture.Framework.RefreshTestDatabase();
            return Task.CompletedTask;
        }

        /// <summary>
        /// Called before class is destroyed. Opportunity to use an async method for teardown.
        /// </summary>
        /// <returns></returns>
        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public virtual void Initialize()
        {
            ApiUrl = "";
            UxUrl  = "";
            
            IdRange = Enumerable.Range(0, 0);
            FirstModelName = "";

            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = null;
        }

        /// <summary>
        /// Finds an existing model.
        /// </summary>
        /// <param name="id">Id of model to retrieve.</param>
        /// <returns>Existing model.</returns>
        private async Task<TGetModel> FindModel(int modelId)
        {
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiUrl}/{modelId}");

            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var existingModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            return existingModel;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public  virtual TGetModel ConstructValidModel()
        {
            var validModel = new TGetModel()
            {
                Name = "Test Model",
                Description = "This model was constructed through automated testing.",
            };
            return validModel;
        }

        /// <summary>
        /// Constructs an invalid model.
        /// </summary>
        /// <returns>Invalid model.</returns>
        private TGetModel ConstructInvalidModel()
        {
            // Required properties are missing.
            //  Name 
            //  Description 
            //  Format 
            var invalidModel = new TGetModel()
            {
            };
            return invalidModel;
        }

        /// <summary>
        /// Sets a valid reference property.
        /// </summary>
        /// <param name="model">Model to update.</param>
        /// <returns>Model with valid reference property.</returns>
        public virtual TGetModel  SetValidReferenceProperty(TGetModel model)
        {
            return model;
        }

        /// <summary>
        /// Tests the value of a reference property.
        /// </summary>
        /// <param name="model">MOdel</param>
        /// <returns>True if valid.</returns>
        public virtual bool ReferencePropertyIsValid (TGetModel model)
        {
            return true;
        }

        /// <summary>
        /// Sets an invalid reference property.
        /// </summary>
        /// <param name="model">Model to update.</param>
        /// <returns>Model with invalid reference property.</returns>
        public virtual TGetModel  SetInvalidReferenceProperty(TGetModel model)
        {
            return model;
        }

        /// <summary>
        /// Asserts that the request returned a specific HTTP status code.
        /// </summary>
        /// <param name="requestResponse">Response.</param>
        /// <param name="statusCode">Expected status code.</param>
        private void AssertApiErrorResultHttpStatusCode(RequestResponse requestResponse, HttpStatusCode statusCode)
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
        [Trait ("Category", "Api GetSingle")]
        public virtual async Task GetSingle_ValidIdPropertyValueReturnsCorrectModel()
        {
            // Arrange
            var modelId = IdRange.Min();

            // Act
            var existingModel = await FindModel(modelId);

            // Assert
            existingModel.Name.Should().Be(FirstModelName);
        }

        /// <summary>
        /// Test that a GetSingle request with an invalid Id property value returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api GetSingle")]
        public async Task GetSingle_InvalidIdPropertyValueReturnsNotFound()
        {
            // Arrange
            var modelId = IdRange.Max() + 1;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiUrl}/{modelId}");

            // Assert
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a GetList request returns the correct count of models.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api GetList")]
        public async Task GetList_ListReturnsCorrectCount()
        {
            // Arrange

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, ApiUrl);

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
        [Trait ("Category", "Api PostAdd")]
        public async Task PostAdd_CanCreateNewModel()
        {
            // Arrange
            var validModel = ConstructValidModel();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiUrl, validModel);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var newModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            newModel.Name.Should().Be(validModel.Name);
        }

        /// <summary>
        /// Test that an PostAdd request returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PostAdd")]
        public async Task PostAdd_InvalidPropertyValueReturnsBadRequest()
        {
            // Arrange
            var invalidModel = ConstructInvalidModel();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiUrl, invalidModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a PostAdd request with a valid reference property creates the model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PostAdd")]
        public async Task PostAdd_ValidReferencePropertyCreatesModel()
        {
            // Arrange
            var validModel = ConstructValidModel();
            SetValidReferenceProperty(validModel);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiUrl, validModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var newModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            Assert.True(ReferencePropertyIsValid(newModel));
        }

        /// <summary>
        /// Test that an model PostAdd with an invalid reference property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PostAdd")]
        public async Task PostAdd_InvalidReferencePropertyReturnsBadRequest()
        {
            // Arrange
            var invalidModel = ConstructValidModel();
            SetInvalidReferenceProperty(invalidModel);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiUrl, invalidModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }
#if false
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
#endif
#endregion
#region Put
#endregion

#region Delete
        /// <summary>
        /// Test that a Delete request deletes the target model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Delete")]
        public async Task Delete_TargetModelIsDeleted()
        {
            // Arrange
            var modelId = IdRange.Min();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Delete, $"{ApiUrl}/{modelId}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            // Now attempt to access the deleted model...
            requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiUrl}/{modelId}");

            // Assert
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }
        #endregion
    }
}

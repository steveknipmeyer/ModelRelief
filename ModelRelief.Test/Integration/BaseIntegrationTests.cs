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
using System.Reflection;
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

        public List<string> ReferencePropertyNames  { get; set; }
        public int? InvalidReferenceProperty { get; set; }
        public int? ValidReferenceProperty { get; set; }
        
        public string EnumPropertyName { get; set; }

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

            ReferencePropertyNames = new List<string>();
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = null;

            EnumPropertyName = null;
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
        /// Returns the reference property.
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Reference property for testing.</returns>
        private PropertyInfo GetReferencePropertyPropertyInfo (TGetModel model)
        {
            Type type = model.GetType();
            PropertyInfo[] properties = type.GetProperties();

            var referenceProperty  = type.GetProperty(ReferencePropertyNames.FirstOrDefault());
            return referenceProperty;
        }

        /// <summary>
        /// Gets the reference property.
        /// </summary>
        /// <param name="model">Model to query.</param>
        /// <returns>Reference property value.</returns>
        public int?  GetReferenceProperty(TGetModel model)
        {           
            var referenceProperty  = GetReferencePropertyPropertyInfo(model);
            var propertyValue = (int?) referenceProperty.GetValue(model, null);

            return propertyValue;
        }

        /// <summary>
        /// Sets the reference property.
        /// </summary>
        /// <param name="model">Model to update.</param>
        /// <returns>Model with updated reference property.</returns>
        public TGetModel  SetReferenceProperty(TGetModel model, int? value)
        {
            var referenceProperty  = GetReferencePropertyPropertyInfo(model);
            referenceProperty.SetValue(model, value);

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

            var apiErrorResult = JsonConvert.DeserializeObject<ApiError>(requestResponse.ContentString);
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

            var pagedResults = JsonConvert.DeserializeObject<PagedResults<TGetModel>>(requestResponse.ContentString);
            var expectedCount = IdRange.Max() - IdRange.Min() + 1;
            pagedResults.Results.Count().Should().Be(expectedCount);
        }

#endregion
#region Post
        /// <summary>
        /// Test that a Post request can create a model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Post")]
        public async Task Post_CanCreateNewModel()
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
        /// Test that an Post request returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Post")]
        public async Task Post_InvalidPropertyValueReturnsBadRequest()
        {
            // Arrange
            var invalidModel = ConstructInvalidModel();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiUrl, invalidModel);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Post request with a valid reference property creates the model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Post")]
        public async Task Post_ValidReferencePropertyCreatesModel()
        {
            // early exit if model has no reference properties properties
            if (ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var validModel = ConstructValidModel();
            SetReferenceProperty(validModel, ValidReferenceProperty);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiUrl, validModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var newModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            GetReferenceProperty(newModel).Should().Be(ValidReferenceProperty);
        }

        /// <summary>
        /// Test that an model Post with an invalid reference property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Post")]
        public async Task Post_InvalidReferencePropertyReturnsBadRequest()
        {
            // early exit if model has no reference properties properties
            if (ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var invalidModel = ConstructValidModel();
            SetReferenceProperty(invalidModel, InvalidReferenceProperty);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, ApiUrl, invalidModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Put can update a model.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Put")]
        public async Task Put_CanUpdateModel()
        {
            // Arrange
            var modelId = IdRange.Min();
            var existingModel = await FindModel(modelId);

            var updatedName = "Updated Name Property";
            existingModel.Name = updatedName;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}", existingModel);

            // Assert
            requestResponse.Message.EnsureSuccessStatusCode();
            
            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            updatedModel.Name.Should().Be(updatedName);
        }

        /// <summary>
        /// Test that a Put request with an invalid Id returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Put")]
        public async Task Put_InvalidIdReturnsNotFound()
        {
            // Arrange
            var modelId = IdRange.Max();
            var existingModel = await FindModel (modelId);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId + 1}", existingModel);

            // Assert    
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.NotFound);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Put a valid reference property can be updated.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Put")]
        public async Task Put_ValidReferencePropertyUpdatesModel()
        {
            // early exit if model has no reference properties properties
            if (ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = IdRange.Max();
            var existingModel = await FindModel (modelId);
            SetReferenceProperty(existingModel, ValidReferenceProperty);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}", existingModel);

            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            GetReferenceProperty(updatedModel).Should().Be(ValidReferenceProperty);
        }

        /// <summary>
        /// Test that a Put with an invalid reference property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Put")]
        public async Task Put_InvalidReferencePropertyReturndBadRequest()
        {
            // early exit if model has no reference properties properties
            if (ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = IdRange.Max();
            var existingModel = await FindModel (modelId);
            SetReferenceProperty(existingModel, InvalidReferenceProperty);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}", existingModel);
            
            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }
#endregion
#region Patch
        // N.B. The ASP.NET Core TestServer does not support HTTP PATCH.
        //      So, the request is packaged as a PUT request to the <resource>/id/patch endpoint.
        //      Applications that can generate PATCH can use the conventional endpoint <resource>/id.

        /// <summary>
        /// Test that a Patch request updates the target property.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Patch")]
        public async Task Patch_TargetPropertyIsUpdated()
        {
            // Arrange
            var modelId = IdRange.Min();
            var updatedName = "Updated Name Property";
            var patchModel = new 
            {
                Name = updatedName
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}/patch", patchModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            updatedModel.Name.Should().Be(updatedName);
        }

        /// <summary>
        /// Test that a Patch request with an invalid Id returns NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Patch")]
        public async Task Patch_InvalidIdPropertyReturnsNotFound()
        {
            // Arrange
            var modelId = IdRange.Max() + 1;
            var updatedName = "Updated Name Property";
            var patchModel = new 
            {
                Name = updatedName
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}/patch", patchModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Patch request with an umknown property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Patch")]
        public async Task Patch_InvalidPropertyNameReturnsBadRequest()
        {
            // Arrange
            var modelId = IdRange.Max();
            var invalidPatchModel = new
                {
                InvalidProperty = "NonExistent"
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}/patch", invalidPatchModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Patch request with an invalid enum property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Patch")]
        public async Task Patch_InvalidEnumPropertyValueReturnsBadRequest()
        {
            // early exit if model has no enum properties
            if (String.IsNullOrEmpty(EnumPropertyName))
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = IdRange.Max();
            var invalidPatchModel = new Dictionary<string, string>
            {
                { EnumPropertyName, "Invalid Enum" }
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}/patch", invalidPatchModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Patch request with an invalid reference property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Patch")]
        public async Task Patch_InvalidReferencePropertyReturnsBadRequest()
        {
            // early exit if model has no reference properties properties
            if (ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = IdRange.Max();
            var invalidPatchModel = await FindModel(modelId);
            SetReferenceProperty(invalidPatchModel, InvalidReferenceProperty);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}/patch", invalidPatchModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Patch request with two invalid reference properties returns BadRequest and two validation errors.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Patch")]
        public async Task Patch_MultipleInvalidReferencePropertiesReturnsMultipleValidationErrorsAndBadRequest()
        {
            // early exit if model has no reference properties properties
            if (ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = IdRange.Max();
            var invalidPatchModel = new Dictionary<string, int?>();
            foreach (var propertyName in ReferencePropertyNames)
                invalidPatchModel.Add(propertyName, 0);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}/patch", invalidPatchModel);

            // Assert
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiError>(requestResponse.ContentString);
            apiErrorResult.Errors.Count().Should().Be(ReferencePropertyNames.Count());

        }

        /// <summary>
        /// Test that an Patch request with an invalid reference property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Patch")]
        public async Task Patch_ValidReferencePropertyUpdatesModel()
        {
            // early exit if model has no reference properties properties
            if (ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = IdRange.Max();
            // https://stackoverflow.com/questions/6044482/setting-anonymous-type-property-name
            var validPatchModel = new Dictionary<string, int?>
            {
                { ReferencePropertyNames.FirstOrDefault(), ValidReferenceProperty }
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}/patch", validPatchModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            GetReferenceProperty(updatedModel).Should().Be(ValidReferenceProperty);
        }
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
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorResultHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }
        #endregion
    }
}
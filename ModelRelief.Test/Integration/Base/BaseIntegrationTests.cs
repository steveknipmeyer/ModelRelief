// -----------------------------------------------------------------------
// <copyright file="BaseIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;
    using ModelRelief.Test.TestModels;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// Base Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public abstract class BaseIntegrationTests<TEntity, TGetModel> : IntegrationTests<TEntity, TGetModel>
        where TEntity   : DomainModel
        where TGetModel : class, ITGetModel, new()
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="BaseIntegrationTests{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        /// <param name="testModel">A test model under integration testing.</param>
        public BaseIntegrationTests(ClassFixture classFixture, TestModelFactory<TEntity, TGetModel> testModel)
            : base(classFixture, testModel)
        {
        }

        #region Get
        /// <summary>
        /// Test that a GetSingle request with an valid Id property value returns correct model.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetSingle")]
        public virtual async Task GetSingle_ValidIdPropertyValueReturnsCorrectModel()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Min();

            // Act
            var existingModel = await TestModelFactory.FindModel(ClassFixture, modelId);

            // Assert
            existingModel.Name.Should().Be(TestModelFactory.FirstModelName);
        }

        /// <summary>
        /// Test that a GetSingle request with an invalid Id property value returns NotFound.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetSingle")]
        public async Task GetSingle_InvalidIdPropertyValueReturnsNotFound()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Max() + 1;

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{modelId}");

            // Assert
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a GetList request returns the correct count of models.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetList")]
        public async Task GetList_ListReturnsCorrectCount()
        {
            // Arrange

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Get, TestModelFactory.ApiUrl);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var pagedResults = JsonConvert.DeserializeObject<PagedResults<TGetModel>>(requestResponse.ContentString);
            var expectedCount = TestModelFactory.IdRange.Max() - TestModelFactory.IdRange.Min() + 1;
            pagedResults.Results.Count().Should().Be(expectedCount);
        }

        #endregion
        #region Post
        /// <summary>
        /// Test that a Post request can create a model.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Post")]
        public async Task Post_CanCreateNewModel()
        {
            // Arrange
            var newModel = TestModelFactory.ConstructValidModel();

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Post, TestModelFactory.ApiUrl, newModel);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var addedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            addedModel.Name.Should().Be(newModel.Name);

            // Rollback
            await DeleteModel(addedModel);
        }

        /// <summary>
        /// Test that an invalid Post request returns BadRequest.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Post")]
        public async Task Post_InvalidPropertyValueReturnsBadRequest()
        {
            // Arrange
            var invalidModel = TestModelFactory.ConstructInvalidModel();

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Post, TestModelFactory.ApiUrl, invalidModel);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Post request with a valid reference property creates the model.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Post")]
        public async Task Post_ValidReferencePropertyCreatesModel()
        {
            // early exit if model has no reference properties properties
            if (TestModelFactory.ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var newModel = TestModelFactory.ConstructValidModel();
            TestModelFactory.SetReferenceProperty(newModel, TestModelFactory.ValidReferenceProperty);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Post, TestModelFactory.ApiUrl, newModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var addedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            TestModelFactory.GetReferenceProperty(addedModel).Should().Be(TestModelFactory.ValidReferenceProperty);

            // Rollback
            await DeleteModel(addedModel);
        }

        /// <summary>
        /// Test that an model Post with an invalid reference property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Post")]
        public async Task Post_InvalidReferencePropertyReturnsBadRequest()
        {
            // early exit if model has no reference properties properties
            if (TestModelFactory.ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var invalidModel = TestModelFactory.ConstructValidModel();
            TestModelFactory.SetReferenceProperty(invalidModel, TestModelFactory.InvalidReferenceProperty);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Post, TestModelFactory.ApiUrl, invalidModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }
        #endregion
        #region Put
        /// <summary>
        /// Test that a Put can update a model.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Put")]
        public async Task Put_CanUpdateModel()
        {
            // Arrange
            var newModel = await PostNewModel();
            var updatedDescription = "Updated Description Property";
            newModel.Description = updatedDescription;

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{newModel.Id}", newModel);

            // Assert
            requestResponse.Message.EnsureSuccessStatusCode();

            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            updatedModel.Description.Should().Be(updatedDescription);

            // Rollback
            await DeleteModel(newModel);
        }

        /// <summary>
        /// Test that a Put request with an invalid Id returns NotFound.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Put")]
        public async Task Put_InvalidIdReturnsNotFound()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Max();
            var existingModel = await TestModelFactory.FindModel(ClassFixture, modelId);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{modelId + 1}", existingModel);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.NotFound);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Put a valid reference property can be updated.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Put")]
        public async Task Put_ValidReferencePropertyUpdatesModel()
        {
            // early exit if model has no reference properties properties
            if (TestModelFactory.ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var newModel = await PostNewModel();
            TestModelFactory.SetReferenceProperty(newModel, TestModelFactory.ValidReferenceProperty);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{newModel.Id}", newModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            TestModelFactory.GetReferenceProperty(updatedModel).Should().Be(TestModelFactory.ValidReferenceProperty);

            // Rollback
            await DeleteModel(newModel);
        }

        /// <summary>
        /// Test that a Put with an invalid reference property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Put")]
        public async Task Put_InvalidReferencePropertyReturndBadRequest()
        {
            // early exit if model has no reference properties properties
            if (TestModelFactory.ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = TestModelFactory.IdRange.Max();
            var existingModel = await TestModelFactory.FindModel(ClassFixture, modelId);
            TestModelFactory.SetReferenceProperty(existingModel, TestModelFactory.InvalidReferenceProperty);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{modelId}", existingModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
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
        [Trait("Category", "Api Patch")]
        public async Task Patch_TargetPropertyIsUpdated()
        {
            // Arrange
            var newModel = await PostNewModel();
            var updatedDescription = "Updated Description Property";
            var patchModel = new
            {
                Description = updatedDescription,
            };

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{newModel.Id}/patch", patchModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            updatedModel.Description.Should().Be(updatedDescription);

            // Rollback
            await DeleteModel(newModel);
        }

        /// <summary>
        /// Test that a Patch request with an invalid Id returns NotFound.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Patch")]
        public async Task Patch_InvalidIdPropertyReturnsNotFound()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Max() + 1;
            var updatedName = "Updated Name Property";
            var patchModel = new
            {
                Name = updatedName,
            };

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{modelId}/patch", patchModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Test that a Patch request with an umknown property returns BadRequest.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Patch")]
        public async Task Patch_InvalidPropertyNameReturnsBadRequest()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Max();
            var invalidPatchModel = new
                {
                InvalidProperty = "NonExistent",
                };

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{modelId}/patch", invalidPatchModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Patch request with an invalid enum property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Patch")]
        public async Task Patch_InvalidEnumPropertyValueReturnsBadRequest()
        {
            // early exit if model has no enum properties
            if (string.IsNullOrEmpty(TestModelFactory.EnumPropertyName))
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = TestModelFactory.IdRange.Max();
            var invalidPatchModel = new Dictionary<string, string>
            {
                { TestModelFactory.EnumPropertyName, "Invalid Enum" },
            };

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{modelId}/patch", invalidPatchModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Patch request with an invalid reference property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Patch")]
        public async Task Patch_InvalidReferencePropertyReturnsBadRequest()
        {
            // early exit if model has no reference properties properties
            if (TestModelFactory.ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = TestModelFactory.IdRange.Max();
            var invalidPatchModel = await TestModelFactory.FindModel(ClassFixture, modelId);
            TestModelFactory.SetReferenceProperty(invalidPatchModel, TestModelFactory.InvalidReferenceProperty);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{modelId}/patch", invalidPatchModel);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Patch request with two invalid reference properties returns BadRequest and two validation errors.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Patch")]
        public async Task Patch_MultipleInvalidReferencePropertiesReturnsMultipleValidationErrorsAndBadRequest()
        {
            // early exit if model has no reference properties properties
            if (TestModelFactory.ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var modelId = TestModelFactory.IdRange.Max();
            var invalidPatchModel = new Dictionary<string, int?>();
            foreach (var propertyName in TestModelFactory.ReferencePropertyNames)
                invalidPatchModel.Add(propertyName, 0);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{modelId}/patch", invalidPatchModel);

            // Assert
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiError>(requestResponse.ContentString);
            apiErrorResult.Errors.Count().Should().Be(TestModelFactory.ReferencePropertyNames.Count());
        }

        /// <summary>
        /// Test that an Patch request with an invalid reference property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Patch")]
        public async Task Patch_ValidReferencePropertyUpdatesModel()
        {
            // early exit if model has no reference properties properties
            if (TestModelFactory.ReferencePropertyNames.Count() <= 0)
            {
                Assert.True(true);
                return;
            }

            // Arrange
            var newModel = await PostNewModel();
            // https://stackoverflow.com/questions/6044482/setting-anonymous-type-property-name
            var validPatchModel = new Dictionary<string, int?>
            {
                { TestModelFactory.ReferencePropertyNames.FirstOrDefault(), TestModelFactory.ValidReferenceProperty },
            };

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{newModel.Id}/patch", validPatchModel);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            TestModelFactory.GetReferenceProperty(updatedModel).Should().Be(TestModelFactory.ValidReferenceProperty);

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion
        #region Delete
        /// <summary>
        /// Test that a Delete request deletes the target model.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Delete")]
        public async Task Delete_TargetModelIsDeleted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Delete, $"{TestModelFactory.ApiUrl}/{newModel.Id}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            // Now attempt to access the deleted model...
            requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{newModel.Id}");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
        }
        #endregion
    }
}
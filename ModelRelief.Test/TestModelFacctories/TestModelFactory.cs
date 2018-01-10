// -----------------------------------------------------------------------
// <copyright file="TestModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Reflection;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;
    using ModelRelief.Test.Integration;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// Represents a test model under integration testing.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public abstract class TestModelFactory<TEntity, TGetModel>
        where TEntity : DomainModel
        where TGetModel : class, ITGetModel, new()
    {
        public IEnumerable<int> IdRange  { get; set; }

        public string ApiUrl { get; set; }
        public string UxUrl  { get; set; }
        public string FirstModelName { get; set; }

        public List<string> ReferencePropertyNames  { get; set; }
        public int? InvalidReferenceProperty { get; set; }
        public int? ValidReferenceProperty { get; set; }

        public string EnumPropertyName { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="TestModelFactory{TEntity, TGetModel}"/> class.
        /// Constructor.
        /// </summary>
        public TestModelFactory()
        {
            Initialize();
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public virtual void Initialize()
        {
            ApiUrl = string.Empty;
            UxUrl  = string.Empty;

            IdRange = Enumerable.Range(0, 0);
            FirstModelName = string.Empty;

            ReferencePropertyNames = new List<string>();
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = null;

            EnumPropertyName = null;
        }

        /// <summary>
        /// Finds an existing model.
        /// </summary>
        /// <param name="classFixture">Class fixture.</param>
        /// <param name="modelId">Id of model to retrieve.</param>
        /// <returns>Existing model.</returns>
        public async Task<TGetModel> FindModel(ClassFixture classFixture, int modelId)
        {
            var requestResponse = await classFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiUrl}/{modelId}");

            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var existingModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            return existingModel;
        }

        /// <summary>
        /// Returns the reference property.
        /// </summary>
        /// <param name="model">DTO Get model.</param>
        /// <returns>Reference property for testing.</returns>
        private PropertyInfo GetReferencePropertyPropertyInfo(TGetModel model)
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
            var propertyValue = (int?)referenceProperty.GetValue(model, null);

            return propertyValue;
        }

        /// <summary>
        /// Sets the reference property.
        /// </summary>
        /// <param name="model">Model to update.</param>
        /// <param name="value">Property value to set.</param>
        /// <returns>Model with updated reference property.</returns>
        public TGetModel  SetReferenceProperty(TGetModel model, int? value)
        {
            var referenceProperty  = GetReferencePropertyPropertyInfo(model);
            referenceProperty.SetValue(model, value);

            return model;
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
        public TGetModel ConstructInvalidModel()
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
        /// Creates a new resource.
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        /// <param name="model">New model to POST.</param>
        public virtual async Task<TGetModel> PostNewModel(ClassFixture classFixture, TGetModel model)
        {
            // Arrange

            // Act
            var requestResponse = await classFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Post, ApiUrl, model);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var newModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            newModel.Name.Should().Be(model.Name);

            return newModel;
        }

        /// <summary>
        /// Creates a new resource.
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public virtual async Task<TGetModel> PostNewModel(ClassFixture classFixture)
        {
            return await PostNewModel(classFixture, ConstructValidModel());
        }

        /// <summary>
        /// Delete an existing model.
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        /// <param name="existingModel">Model to delete.</param>
        public virtual async Task DeleteModel(ClassFixture classFixture, TGetModel existingModel)
        {
            // Arrange

            // Act
            var requestResponse = await classFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Delete, $"{ApiUrl}/{existingModel.Id}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
        }

        /// <summary>
        /// Posts a new file.
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the file to POST.</param>
        public virtual async Task<RequestResponse> PostNewFile(ClassFixture classFixture, int modelId, string fileName)
        {
            // Arrange
            var byteArray = Utility.ByteArrayFromFile(fileName);

            // Act
            var requestResponse = await classFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Post, $"{ApiUrl}/{modelId}/file", byteArray, binaryContent: true);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            return requestResponse;
        }

        /// <summary>
        /// Puts a file.
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the file to PUT.</param>
        public virtual async Task<RequestResponse> PutFile(ClassFixture classFixture, int modelId, string fileName)
        {
            // Arrange
            var byteArray = Utility.ByteArrayFromFile(fileName);

            // Act
            var requestResponse = await classFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiUrl}/{modelId}/file", byteArray, binaryContent: true);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            return requestResponse;
        }
    }
}

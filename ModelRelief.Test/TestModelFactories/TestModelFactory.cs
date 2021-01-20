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
    using ModelRelief.Dto;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// Represents a factory that creates test models for integration testing.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public abstract class TestModelFactory<TEntity, TGetModel> : ITestModelFactory
        where TEntity : DomainModel
        where TGetModel : class, IModel, new()
    {
        public const string RootApi = "/api/v1/";

        public ClassFixture ClassFixture { get; }

        public Type TEntityType => typeof(TEntity);
        public Type TGetModelType => typeof(TGetModel);

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
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public TestModelFactory(ClassFixture classFixture)
        {
            ClassFixture = classFixture;

            Initialize();
            InitializeByQuery();
        }

        /// <summary>
        /// Initialize the table-dependent properties such as model counts, first model, etc.
        /// </summary>
        public virtual void InitializeByQuery()
        {
            // N.B. This method uses async methods to query the database.
            //      The helper async methods are called synchronously because this method is called from the constructor.
            // https://stackoverflow.com/questions/5095183/how-would-i-run-an-async-taskt-method-synchronously

            // first model
            var requestResponse = ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{ApiUrl}/1").GetAwaiter().GetResult();
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
            var firstModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            FirstModelName = firstModel.Name;

            // range of model IDs
            requestResponse = ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{ApiUrl}").GetAwaiter().GetResult();
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
            var queryList = JsonConvert.DeserializeObject<PagedResults<TEntity>>(requestResponse.ContentString);
            var totalNumberOfRecords = queryList.TotalNumberOfRecords;
            IdRange = Enumerable.Range(1, totalNumberOfRecords);
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
        /// <param name="modelId">Id of model to retrieve.</param>
        /// <returns>Existing model.</returns>
        public async Task<IModel> FindModel(int modelId)
        {
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{ApiUrl}/{modelId}");

            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var model = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            return model;
        }

        /// <summary>
        /// Find a model by name.
        /// </summary>
        /// <param name="name">Name pattern</param>
        public async Task<IModel> FindModelByName(string name)
        {
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{ApiUrl}/?name={name}");
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var pagedResults = JsonConvert.DeserializeObject<PagedResults<TGetModel>>(requestResponse.ContentString);
            var model = pagedResults.Results.First();
            return model;
        }

        /// <summary>
        /// Returns the reference property.
        /// </summary>
        /// <param name="model">DTO Get model.</param>
        /// <returns>Reference property for testing.</returns>
        private PropertyInfo GetReferencePropertyPropertyInfo(IModel model)
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
        public int?  GetReferenceProperty(IModel model)
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
        public IModel  SetReferenceProperty(IModel model, int? value)
        {
            var referenceProperty  = GetReferencePropertyPropertyInfo(model);
            referenceProperty.SetValue(model, value);

            return model;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public  virtual IModel ConstructValidModel()
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
        public IModel ConstructInvalidModel()
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
        /// <param name="model">New model to POST.</param>
        public virtual async Task<IModel> PostNewModel(IModel model)
        {
            // Arrange

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Post, ApiUrl, model);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var newModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            newModel.Name.Should().Be(model.Name);

            return newModel;
        }

        /// <summary>
        /// Creates a new resource.
        /// </summary>
        public virtual async Task<IModel> PostNewModel()
        {
            return await PostNewModel(ConstructValidModel());
        }

        /// <summary>
        /// Updates a resource.
        /// </summary>
        /// <param name="model">Updated model to PUT.</param>
        public virtual async Task<IModel> PutModel(IModel model)
        {
            // Arrange

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Put, $"{ApiUrl}/{model.Id}", model);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.OK);

            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            updatedModel.Name.Should().Be(model.Name);

            return updatedModel;
        }

        /// <summary>
        /// Delete an existing model.
        /// </summary>
        /// <param name="existingModel">Model to delete.</param>
        public virtual async Task DeleteModel(IModel existingModel)
        {
            // Arrange

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Delete, $"{ApiUrl}/{existingModel.Id}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
        }
    }
}

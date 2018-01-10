// -----------------------------------------------------------------------
// <copyright file="TestModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Threading.Tasks;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// Represents a test model under integration testing.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public abstract class TestModel<TEntity, TGetModel>
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
        /// Initializes a new instance of the <see cref="TestModel{TEntity, TGetModel}"/> class.
        /// Constructor.
        /// </summary>
        public TestModel()
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
    }
}
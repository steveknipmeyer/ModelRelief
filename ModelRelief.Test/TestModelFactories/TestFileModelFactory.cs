// -----------------------------------------------------------------------
// <copyright file="TestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a factory that creates test models for integration testing.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public abstract class TestFileModelFactory<TEntity, TGetModel> : TestModelFactory<TEntity, TGetModel>, ITestFileModelFactory
        where TEntity   : FileDomainModel
        where TGetModel : class, IModel, new()
    {
        public string BackingFile { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="TestFileModelFactory{TEntity, TGetModel}"/> class.
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public TestFileModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            base.Initialize();

            BackingFile = string.Empty;
        }

        /// <summary>
        /// Posts a new file.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the file to POST.</param>
        public virtual async Task<IModel> PostNewFile(int modelId, string fileName)
        {
            // Arrange
            var byteArray = Utility.ByteArrayFromFile(fileName);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Post, $"{ApiUrl}/{modelId}/file", byteArray, binaryContent: true);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var model = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            return model;
        }

        /// <summary>
        /// Puts a file.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the file to PUT.</param>
        public virtual async Task<IModel> PutFile(int modelId, string fileName)
        {
            // Arrange
            var byteArray = Utility.ByteArrayFromFile(fileName);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Put, $"{ApiUrl}/{modelId}/file", byteArray, binaryContent: true);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var model = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            return model;
        }
    }
}

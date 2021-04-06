// -----------------------------------------------------------------------
// <copyright file="TestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System.IO;
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using Microsoft.AspNetCore.Http;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Test;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a factory that creates test models for integration testing.
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public abstract class TestFileModelFactory<TEntity, TGetModel> : TestModelFactory<TEntity, TGetModel>, ITestFileModelFactory
        where TEntity   : FileDomainModel
        where TGetModel : class, IFileModel, new()
    {
        public string BackingFile { get; set; }
        public string InvalidBackingFile { get; set; }

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
            InvalidBackingFile = string.Empty;
        }

        /// <summary>
        /// Posts a new file.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the file to POST.</param>
        public virtual async Task<IModel> PostNewFile(int modelId, string fileName)
        {
            // Act
            var requestResponse = await Post(modelId, fileName);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var model = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            return model;
        }

        /// <summary>
        /// Posts an invalid new file.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the invalid file to POST.</param>
        public virtual async Task PostInvalidNewFile(int modelId, string fileName)
        {
            // Act
            var requestResponse = await Post(modelId, fileName);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Posts a new model and file together to the PostForm endpoint ([multipart/form-data] PostForm).
        /// </summary>
        /// <param name="fileName">Name of the file to POST.</param>
        public virtual async Task<IModel> PostForm(string fileName)
        {
            // Arrange
            var fileModel = ConstructValidModel() as IFileModel;

            // Act
            var requestResponse = await PostForm(fileModel, fileName);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var model = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            return model;
        }

        /// <summary>
        /// Posts a model and file together to the PostForm endpoint.
        /// </summary>
        /// <param name="model">Model to POST.</param>
        /// <param name="fileName">Name of the file to POST.</param>
        public async Task<RequestResponse> PostForm(IFileModel model, string fileName)
        {
            var fileNamePath = ModelRelief.Test.Settings.GetTestFilePath(fileName);
            if (fileNamePath == null)
                return null;

            var content = ClassFixture.ServerFramework.CreateMultipartFormDataContent(model, fileNamePath);

            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Post, ApiUrl, content, HttpMimeType.MultiPartFormData);
            return requestResponse;
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
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Put, $"{ApiUrl}/{modelId}/file", byteArray, HttpMimeType.OctetStream);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var model = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            return model;
        }

        /// <summary>
        /// Posts a file.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the file to POST.</param>
        private async Task<RequestResponse> Post(int modelId, string fileName)
        {
            var byteArray = Utility.ByteArrayFromFile(fileName);
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Post, $"{ApiUrl}/{modelId}/file", byteArray, HttpMimeType.OctetStream);

            return requestResponse;
        }
    }
}

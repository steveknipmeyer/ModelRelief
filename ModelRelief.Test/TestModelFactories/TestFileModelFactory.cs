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
        /// Posts a new model and file together to the Ux Create endpoint.
        /// </summary>
        /// <param name="fileName">Name of the file to POST.</param>
        public virtual async Task<IModel> PostUxCreate(string fileName)
        {
            // Act
            var requestResponse = await PostCreate(fileName);

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

        /// <summary>
        /// Posts a model and file together to the Create endpoint.
        /// </summary>
        /// <param name="fileName">Name of the file to POST.</param>
        private async Task<RequestResponse> PostCreate(string fileName)
        {
            var fileNamePath = ModelRelief.Test.Settings.GetTestFilePath(fileName);
            if (fileNamePath == null)
                return null;

            using (var stream = File.OpenRead(fileNamePath))
            {
                // https://stackoverflow.com/questions/51704805/how-to-instantiate-an-instance-of-formfile-in-c-sharp-without-moq
                var formFile = new FormFile(stream, 0, stream.Length, null, Path.GetFileName(stream.Name))
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/octet-stream",
                };

                var fileModel = ConstructValidModel() as IFileModel;
                fileModel.FormFile = formFile;

                var request = new PostWithFileRequest<TEntity, TGetModel, TGetModel>()
                {
                    User = null,
                    FileModel = fileModel,
                };

                // WIP: content-type = "multipart/form-data; boundary=----WebKitFormBoundaryNmAHwOtiyVAhKTjF"
                var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Post, $"{UxUrl}/create", request);
                return requestResponse;
            }
        }
    }
}

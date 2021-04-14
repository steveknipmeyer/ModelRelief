// -----------------------------------------------------------------------
// <copyright file="FileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Api.V1.Shared.Errors;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Test.TestModels;
    using ModelRelief.Utility;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// Base Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    public abstract class FileIntegrationTests<TEntity, TGetModel> : IntegrationTests<TEntity, TGetModel>
        where TEntity   : FileDomainModel
        where TGetModel : class, IFileModel, new()
    {
        public TestFileModelFactory<TEntity, TGetModel> TestFileModelFactory => TestModelFactory as TestFileModelFactory<TEntity, TGetModel>;

        /// <summary>
        /// Initializes a new instance of the <see cref="FileIntegrationTests{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        /// <param name="testModel">A test model under integration testing.</param>
        public FileIntegrationTests(ClassFixture classFixture, TestFileModelFactory<TEntity, TGetModel> testModel)
            : base(classFixture, testModel)
        {
        }

        /// <summary>
        /// Posts a new file.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the file to POST.</param>
        public virtual async Task<IModel> PostNewFile(int modelId,  string fileName)
        {
            return await TestFileModelFactory.PostNewFile(modelId, fileName);
        }

        /// <summary>
        /// Posts an invalid new file.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the invalid file to POST.</param>
        public virtual async Task PostInvalidNewFile(int modelId, string fileName)
        {
            await TestFileModelFactory.PostInvalidNewFile(modelId, fileName);
        }

        /// <summary>
        /// Posts a file preview.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the preview to POST.</param>
        public virtual async Task<IModel> PostPreview(int modelId, string fileName)
        {
            return await TestFileModelFactory.PostPreview(modelId, fileName);
        }

        /// <summary>
        /// Posts a new model and file together to the PostForm endpoint([multipart/form-data] PostForm).
        /// </summary>
        /// <param name="fileName">Name of the file to POST.</param>
        public virtual async Task<IModel> PostForm(string fileName)
        {
            return await TestFileModelFactory.PostForm(fileName);
        }

        /// <summary>
        /// Posts a new model and file together to the PostForm endpoint([multipart/form-data] PostForm).
        /// </summary>
        /// <param name="model">New model to POST.</param>
        /// <param name="fileName">Name of the file to POST.</param>
        public virtual async Task<RequestResponse> PostForm(IFileModel model, string fileName)
        {
            return await TestFileModelFactory.PostForm(model, fileName);
        }

        /// <summary>
        /// Puts a file.
        /// </summary>
        /// <param name="modelId">Id of the backing metadata model.</param>
        /// <param name="fileName">Name of the file to PUT.</param>
        public virtual async Task<IModel> PutFile(int modelId, string fileName)
        {
            return await TestFileModelFactory.PutFile(modelId, fileName);
        }

        #region GetFile
        /// <summary>
        /// Tests whether an existing file can be returned.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetFile")]
        public virtual async Task GetFile_ExistingFileReturnsSuccess()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Min();

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{modelId}/file");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
        }

        /// <summary>
        /// Tests whether a non-existent file return NotFound.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetFile")]
        public virtual async Task GetFile_NonExistentFileReturnsNotFound()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Max() + 1;

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{modelId}/file");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
            AssertApiErrorCode(requestResponse, ApiErrorCode.NotFound);
        }

        /// <summary>
        /// Tests whether a file can be roundtripped to an endpoint.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetFile")]
        public virtual async Task GetFile_FileCanBeRoundTripped()
        {
            // Arrange
            var newModel = await PostNewModel();
            var fileName = TestFileModelFactory.BackingFile;
            newModel = await PostNewFile(newModel.Id, fileName);
            var writtenByteArray = Utility.ByteArrayFromFile(fileName);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{newModel.Id}/file");
            var fileContentResult = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(requestResponse.ContentString);
            var encodedString = fileContentResult.GetValue("fileContents");
            var readByteArray = Convert.FromBase64String(encodedString.ToString());

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
            Assert.True(Utility.EqualByteArrays(writtenByteArray, readByteArray));

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion

        #region GetPreview
        /// <summary>
        /// Tests whether an existing file can be returned.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetPreview")]
        public virtual async Task GetPreview_ExistingPreviewReturnsSuccess()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Min();

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{modelId}/preview");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
        }
        #endregion

        #region PostFile
        /// <summary>
        /// Tests whether a file can be posted to the resource.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostFile")]
        public virtual async Task PostFile_NewFileCanBePosted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act
            newModel = await PostNewFile(newModel.Id, TestFileModelFactory.BackingFile);

            // Assert
            // performed in PostNewFile

            // Rollback
            await DeleteModel(newModel);
        }

        /// <summary>
        /// Tests whether the FileIsSynchronized property is updated correctly after a file POST.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostFile")]
        public virtual async Task PostFile_FileIsSynchronizedIsUpdatedAfterFileIsPosted()
        {
            // Arrange
            var newModel = await PostNewModel();
            var newGeneratedFileModel = newModel as IGeneratedFileModel;

            // Act
            var updatedModel = await PostNewFile(newModel.Id, TestFileModelFactory.BackingFile);

            // Assert
            // before PostFile
            newGeneratedFileModel.FileIsSynchronized.Should().Be(false);

            // after PostFile
            var updatedGeneratedFileModel = updatedModel as IGeneratedFileModel;
            updatedGeneratedFileModel.FileIsSynchronized.Should().Be(true);

            // Rollback
            await DeleteModel(newModel);
        }

        /// <summary>
        /// Tests whether the FileTimeStamp property is updated correctly after a file POST.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostFile")]
        public virtual async Task PostFile_FileTimeStampIsUpdatedAfterFileIsPosted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act
            var modelAfterFirstPost   = await PostNewFile(newModel.Id, TestFileModelFactory.BackingFile);
            Files.SleepForTimeStamp();
            var modelAfterSecondPost = await PostNewFile(newModel.Id, TestFileModelFactory.BackingFile);

            // Assert
            var originalModel = modelAfterFirstPost as IGeneratedFileModel;
            var updatedModel  = modelAfterSecondPost as IGeneratedFileModel;

            originalModel.FileTimeStamp.Should().NotBeNull();
            updatedModel.FileTimeStamp.Should().NotBeNull();
            updatedModel.FileTimeStamp.Should().BeAfter(originalModel.FileTimeStamp.Value);

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion

        #region PostPreview
        /// <summary>
        /// Tests whether a preview can be posted to the resource.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostPreview")]
        public virtual async Task PostPreview_PreviewCanBePosted()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Min();

            // Act
            var result = await PostPreview(modelId, TestFileModelFactory.PreviewFile);

            // Assert
            // performed in PostPreview
        }
        #endregion

        #region PutFile
        /// <summary>
        /// Tests whether a new file can be PUT to the resource.
        /// N.B. PUT and POST are equivalent for files. Both replace the destination completely.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PutFile")]
        public virtual async Task PutFile_NewFileCanBePut()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act
            newModel = await PutFile(newModel.Id, TestFileModelFactory.BackingFile);

            // Assert
            // performed in PutFile

            // Rollback
            await DeleteModel(newModel);
        }

        /// <summary>
        /// Tests whether a file can be updated through a PUT.
        /// N.B. PUT and POST are equivalent for files. Both replace the destination completely.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PutFile")]
        public virtual async Task PutFile_FileCanBeUpdated()
        {
            // Arrange
            var newModel = await PostNewModel();
            // initial create
            newModel = await PostNewFile(newModel.Id, TestFileModelFactory.BackingFile);
            // update
            var fileName = TestFileModelFactory.BackingFile;
            newModel = await PutFile(newModel.Id, fileName);
            var writtenByteArray = Utility.ByteArrayFromFile(fileName);

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{newModel.Id}/file");
            var fileContentResult = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(requestResponse.ContentString);
            var encodedString = fileContentResult.GetValue("fileContents");
            var readByteArray = Convert.FromBase64String(encodedString.ToString());

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
            Assert.True(Utility.EqualByteArrays(writtenByteArray, readByteArray));

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion

        #region FileOperation
        /// <summary>
        /// Tests whether a GET succeeds after a file has been renamed.
        /// </summary>
        [Fact]
        [Trait("Category", "Api FileRequest")]
        public virtual async Task FileRequest_FileCanBeReadAfterRename()
        {
            // Arrange
            var newModel = await PostNewModel();
            newModel = await PostNewFile(newModel.Id, TestFileModelFactory.BackingFile);

            // rename model (and file)
            newModel.Name = "New Name";
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Put, $"{TestModelFactory.ApiUrl}/{newModel.Id}", newModel);
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            // Act
            requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{newModel.Id}/file");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion
    }
}

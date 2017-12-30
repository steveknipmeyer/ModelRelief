// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Domain;
using ModelRelief.Dto;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration
{
    /// <summary>
    /// Base Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public abstract class FileIntegrationTests <TEntity, TGetModel>: IntegrationTests<TEntity, TGetModel>
        where TEntity   : FileDomainModel
        where TGetModel : class, ITGetModel, IFileIsSynchronized, new()
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public FileIntegrationTests(ClassFixture serverFixture, TestModel<TEntity, TGetModel> testModel) :
            base (serverFixture, testModel)
        {
        }

        /// <summary>
        /// Returns a byte array from a file. The file must exist in Test\Data\Files.
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public byte[] ByteArrayFromFile(string fileName)
        {
            var fileNamePath = $"{ServerFixture.Framework.GetTestFilesPath()}/{fileName}";
            if (!File.Exists(fileNamePath))
                return null;

            var byteArray = File.ReadAllBytes(fileNamePath);

            return byteArray;
        }

        /// <summary>
        /// Posts a new new file.
        /// </summary>
        public virtual async Task<RequestResponse> PostNewFile(int modelId,  string fileName)
        {
            // Arrange
            var byteArray = ByteArrayFromFile (fileName);

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{TestModel.ApiUrl}/{modelId}/file", byteArray, binaryContent: true);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            return requestResponse;
        }
        /// <summary>
        /// Compare two byte arrays for equslity.
        /// http://www.techmikael.com/2009/01/fast-byte-array-comparison-in-c.html
        /// </summary>
        /// <param name="first">First array to compare.</param>
        /// <param name="second">Second array to compare.</param>
        /// <returns>True if identical.</returns>
        private static bool EqualByteArrays(byte[] first, byte[] second)
            {
                int length = first.Length;
                if (length != second.Length)
                    return false;

                for (int i = 0; i < length; i++)
                {
                    if( first[i] != second[i] ) 
                        return false;
                }
                return true;
            }

        #region GetFile
        /// <summary>
        /// Tests whether an existing file can be returned.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api GetFile")]
        public virtual async Task GetFile_ExistingFileReturnsSuccess()
        {
            // Arrange
            var modelId = TestModel.IdRange.Min();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModel.ApiUrl}/{modelId}/file");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
        }

        /// <summary>
        /// Tests whether a non-existent file return NotFound.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api GetFile")]
        public virtual async Task GetFile_NonExistentFileReturnsNotFound()
        {
            // Arrange
            var modelId = TestModel.IdRange.Max() + 1;

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModel.ApiUrl}/{modelId}/file");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
            AssertApiErrorCode(requestResponse, ApiErrorCode.NotFound);
        }

        /// <summary>
        /// Tests whether a file can be roundtripped to an endpoint.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api GetFile")]
        public virtual async Task GetFile_FileCanBeRoundTripped()
        {
            // Arrange
            var fileName = "ModelRelief.txt";
            var newModel = await PostNewModel();
            var requestResponse = await PostNewFile(newModel.Id, fileName);
            var writtenByteArray = ByteArrayFromFile (fileName);

            // Act            
            requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModel.ApiUrl}/{newModel.Id}/file");
            var fileContentResult = (Newtonsoft.Json.Linq.JObject) JsonConvert.DeserializeObject(requestResponse.ContentString);
            var encodedString = fileContentResult.GetValue("fileContents");
            var readByteArray = Convert.FromBase64String(encodedString.ToString());

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
            Assert.True (EqualByteArrays(writtenByteArray, readByteArray));

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion

        #region PostFile
        /// <summary>
        /// Tests whether a file can be posted to the resource.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PostFile")]
        public virtual async Task PostFile_NewFileCanBePosted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act            
            var requestResponse = await PostNewFile(newModel.Id, "UnitCube.obj");

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            // Rollback
            await DeleteModel(newModel);
        }

        /// <summary>
        /// Tests whether the file metadata is updated correctly after a file POST.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PostFile")]
        public virtual async Task PostFile_MetadataIsUpdatedAfterFileIsPosted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act            
            var requestResponse = await PostNewFile(newModel.Id, "UnitCube.obj");

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            // before PostFile
            newModel.FileIsSynchronized.Should().Be(false);

            // after PostFile
            var updatedModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            updatedModel.FileIsSynchronized.Should().Be(true);
            
            // Rollback
            await DeleteModel(newModel);
        }
        #endregion

        #region PutFile
        /// <summary>
        /// Tests whether a file can be PUT to the resource.
        /// N.B. PUT and POST are equivalent for files. Both replace the destination completely.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PutFile")]
        public virtual async Task PutFile_NewFileCanBePosted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act            
            var requestResponse = await PostNewFile(newModel.Id, "UnitCube.obj");

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion
    }
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
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
        where TEntity   : DomainModel
        where TGetModel : class, ITGetModel, new()
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public FileIntegrationTests(ServerFixture serverFixture, TestModel<TEntity, TGetModel> testModel) :
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
        /// Creates a new resource.
        /// </summary>
        public virtual async Task<TGetModel> CreateNewModel()
        {
            // Arrange
            var validModel = TestModel.ConstructValidModel();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, TestModel.ApiUrl, validModel);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);

            var newModel = JsonConvert.DeserializeObject<TGetModel>(requestResponse.ContentString);
            newModel.Name.Should().Be(validModel.Name);

            return newModel;
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
            AssertApiErrorApiStatusCode(requestResponse, ApiStatusCode.NotFound);
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
            var newModel = await CreateNewModel();

            // Act            
            var byteArray = ByteArrayFromFile ("UnitCube.obj");
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{TestModel.ApiUrl}/{newModel.Id}/file", byteArray, binaryContent: true);

            // Assert
            requestResponse.Message.StatusCode.Should().Be(HttpStatusCode.Created);
        }
        #endregion
    }
}

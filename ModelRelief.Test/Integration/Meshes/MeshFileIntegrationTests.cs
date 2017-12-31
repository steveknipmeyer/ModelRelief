// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration.Meshes
{
    /// <summary>
    /// DepthBuffer integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshesFileIntegrationTests : FileIntegrationTests<Domain.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public MeshesFileIntegrationTests(ClassFixture serverFixture) :
            base (serverFixture, new MeshTestModel())
        {
        }

        #region GetFile
        [Fact]
        [Trait ("Category", "Api GetFile")]
        public override async Task GetFile_FileCanBeRoundTripped()
        {
            // N.B. POST is disallowed for Meshes. This condition is tested by PostFile_NewFileCanBePosted.
            // Assert
            Assert.True(true);

            await Task.CompletedTask;
        }
        #endregion

        #region PostFile
        /// <summary>
        /// Tests whether the file metadata is updated correctly after a file POST.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PostFile")]
        public override  async Task PostFile_MetadataIsUpdatedAfterFileIsPosted()
        {
            // N.B. POST is disallowed for Meshes. This condition is tested by PostFile_NewFileCanBePosted.
            // Assert
            Assert.True(true);

            await Task.CompletedTask;
        }

        /// <summary>
        /// Tests whether a file can be posted to the resource.
        /// Mesh files are generated from their dependencies. They are not posted.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PostFile")]
        public override async Task PostFile_NewFileCanBePosted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act            
            var byteArray = ByteArrayFromFile ("UnitCube.obj");
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{TestModel.ApiUrl}/{newModel.Id}/file", byteArray, binaryContent: true);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorCode(requestResponse, ApiErrorCode.FileCreation);

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion

        #region PutFile
        /// <summary>
        /// Tests whether a file can be PUT to the resource.
        /// Mesh files are generated from their dependencies. They are not posted.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PutFile")]
        public override async Task PutFile_NewFileCanBePosted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act            
            var byteArray = ByteArrayFromFile ("UnitCube.obj");
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{TestModel.ApiUrl}/{newModel.Id}/file", byteArray, binaryContent: true);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorCode(requestResponse, ApiErrorCode.FileCreation);

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion

    }
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
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
        public MeshesFileIntegrationTests(ServerFixture serverFixture) :
            base (serverFixture, new MeshTestModel())
        {
        }

        #region GetFile
        #endregion

        #region PostFile
        /// <summary>
        /// Tests whether a file can be posted to the resource.
        /// Mesh files are generated from their dependents. They are not posted.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api PostFile")]
        public override async Task PostFile_NewFileCanBePosted()
        {
            // Arrange
            var newModel = CreateNewModel();

            // Act            
            var byteArray = ByteArrayFromFile ("UnitCube.obj");
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Post, $"{TestModel.ApiUrl}/{newModel.Id}/file", byteArray, binaryContent: true);

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorApiStatusCode(requestResponse, ApiStatusCode.FileCreation);
        }
        #endregion
    }
}

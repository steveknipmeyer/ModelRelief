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
        /// <summary>
        /// Tests whether the POST endpoint is disallowed.
        /// Mesh files are generated from their dependents.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api GetFile")]
        public override async Task GetFile_ReturnsTheEntireFile()
        {
            // Arrange
            var modelId = TestModel.IdRange.Min();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModel.ApiUrl}/{modelId}/file");

            // Assert
            Assert.False(requestResponse.Message.IsSuccessStatusCode);
            AssertApiErrorHttpStatusCode(requestResponse, HttpStatusCode.NotFound);
            AssertApiErrorApiStatusCode(requestResponse, ApiStatusCode.NotFound);
        }
        #endregion

    }

}

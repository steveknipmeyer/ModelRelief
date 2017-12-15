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
#if true
namespace ModelRelief.Test.Integration.Meshes.Baseline
{
    /// <summary>
    /// Represents the shared instance of the TestServer to support multiple tests.
    /// </summary>
    public class ServerFixture
    {
        public Framework Framework { get; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public ServerFixture()
        {
            Framework = new Framework();
        }
    }

    /// <summary>
    /// Meshes Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshesIntegrationTests : IClassFixture<ServerFixture>
    {
        private static IEnumerable<int> IdRange = Enumerable.Range(1, 3);

        private const string ApiMeshesUrl = "/api/v1/meshes";
        private const string UxMeshesUrl  = "/meshes";

        private ServerFixture ServerFixture { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public MeshesIntegrationTests(ServerFixture serverFixture)
        {
            ServerFixture = serverFixture;
            ServerFixture.Framework.RefreshTestDatabase();
        }

        /// <summary>
        /// Finds an existing model.
        /// </summary>
        /// <param name="id">Id of model to retrieve.</param>
        /// <returns>Existing model.</returns>
        private async Task<Dto.Mesh> FindModel(int modelId)
        {
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{ApiMeshesUrl}/{modelId}");

            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var existingModel = JsonConvert.DeserializeObject<Dto.Mesh>(requestResponse.ContentString);
            return existingModel;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        private Dto.Mesh ConstructValidModel()
        {
            var validModel = new Dto.Mesh()
            {
                Name = "Test Mesh",
                Description = "This mesh was constructed through automated testing.",
                Format = Domain.MeshFormat.OBJ
            };
            return validModel;
        }

        /// <summary>
        /// Constructs an invalid model.
        /// </summary>
        /// <returns>Invalid model.</returns>
        private Dto.Mesh ConstructInvalidModel()
        {
            // Required properties are missing.
            //  Name 
            //  Description 
            //  Format 
            var invalidModel = new Dto.Mesh()
            {
            };
            return invalidModel;
        }

        /// <summary>
        /// Asserts that the request returned a specific HTTP status code.
        /// </summary>
        /// <param name="requestResponse">Response.</param>
        /// <param name="statusCode">Expected status code.</param>
        private void AssertHttpStatusCode(RequestResponse requestResponse, HttpStatusCode statusCode)
        {
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.HttpStatusCode.Should().Be(( int )statusCode);
        }

#region Get
#endregion Get

#region Post
#endregion Post

#region Put

        /// <summary>
        /// Test that a Put request with an invalid enum property value returns BadRequest.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_InvalidEnumPropertyValueReturnsBadRequest()
        {
            // Arrange
            var modelId = IdRange.Max();
            var invalidPutModel = new
                {
                Format = "Invalid Format"
                };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", invalidPutModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that a Put request with two invalid reference properties returns BadRequest and two validation errors.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api Mesh")]
        public async Task Put_MultipleInvalidReferencePropertiesReturnsMultipleValidationErrorsAndBadRequest()
        {
            // Arrange
            var modelId = IdRange.Max();
            var invalidReferenceProperties = 3;
            var invalidPutModel = new
            {
                ProjectId = 0,
                CameraId  = 0,
                DepthBufferId = 0
            };

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Put, $"{ApiMeshesUrl}/{modelId}", invalidPutModel);

            // Assert
            AssertHttpStatusCode(requestResponse, HttpStatusCode.BadRequest);

            var apiErrorResult = JsonConvert.DeserializeObject<ApiErrorResult>(requestResponse.ContentString);
            apiErrorResult.Errors.Count().Should().Be(invalidReferenceProperties);

        }
#endregion

#region Delete
#endregion
    }
}
#endif
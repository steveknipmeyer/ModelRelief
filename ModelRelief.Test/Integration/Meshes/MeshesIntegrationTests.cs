// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1;
using ModelRelief.Api.V1.Meshes;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Test.Integration;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration.Meshes
{
    public class MeshesIntegrationTests
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    {
        private const string MeshesUrl = "/api/v1/meshes";

        /// <summary>
        /// Test that a valid Mesh can be created through POST.
        /// </summary>
        [Fact]
        public async Task POST_can_create_a_mesh()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh() 
                {
                Name = "Test Mesh",
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.STL
                };

            // Act
            var responseString = await Framework.SubmitHttpRequest(HttpRequestType.Post, MeshesUrl, meshPostModel);

            // Assert
            var newMesh = JsonConvert.DeserializeObject<Dto.Mesh>(responseString);
            newMesh.Name.Should().Be("Test Mesh");
        }
    
        /// <summary>
        /// Test that an invalid Mesh POST returns BadRequest.
        /// </summary>
        [Fact]
        public async Task POST_with_invalid_data_returns_BadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh() 
                {
                Name = ""
                };

            // Act
            var responseString = await Framework.SubmitHttpRequest(HttpRequestType.Post, MeshesUrl, meshPostModel);

            // Assert
            var apiResult = JsonConvert.DeserializeObject<ApiResult>(responseString);
            apiResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that an invalid Mesh PUT with an umknown property returns BadRequest.
        /// </summary>
        [Fact]
        public async Task PUT_with_invalid_property_name_returns_BadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh
                {
                Name = "Test Mesh",
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.OBJ,
                };

            var responseString = await Framework.SubmitHttpRequest(HttpRequestType.Post, MeshesUrl, meshPostModel);
            var newModel = JsonConvert.DeserializeObject<Dto.Mesh>(responseString);

            var invalidMeshPostModel = new
                {
                InvalidProperty = "NonExistent"
                };

            // Act
            responseString = await Framework.SubmitHttpRequest(HttpRequestType.Put, $"{MeshesUrl}/{newModel.Id}", invalidMeshPostModel);

            // Assert
            var apiResult = JsonConvert.DeserializeObject<ApiResult>(responseString);
            apiResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Test that an invalid Mesh PUT with an invalid enum property value returns BadRequest.
        /// </summary>
        [Fact]
        public async Task PUT_with_invalid_enum_property_value_returns_BadRequest()
        {
            // Arrange
            var meshPostModel = new Dto.Mesh
                {
                Name = "Test Mesh",
                Description = "This mesh was created through an integration test.",
                Format = Domain.MeshFormat.OBJ,
                };

            var responseString = await Framework.SubmitHttpRequest(HttpRequestType.Post, MeshesUrl, meshPostModel);
            var newModel = JsonConvert.DeserializeObject<Dto.Mesh>(responseString);

            var invalidMeshPostModel = new
                {
                Format = "ABC"
                };

            // Act
            responseString = await Framework.SubmitHttpRequest(HttpRequestType.Put, $"{MeshesUrl}/{newModel.Id}", invalidMeshPostModel);

            // Assert
            var apiResult = JsonConvert.DeserializeObject<ApiResult>(responseString);
            apiResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }
    }
}

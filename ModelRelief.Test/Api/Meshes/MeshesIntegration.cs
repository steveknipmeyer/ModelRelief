// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1;
using ModelRelief.Api.V1.Meshes;
using ModelRelief.Test.Api;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Api.Meshes
{
    public class MeshesIntegration
    {
        /// <summary>
        /// Test that an invalid PutMeshModel returns BadRequest.
        /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
        /// </summary>
        [Fact]
        public async Task PUT_WithInvalidData_ReturnsBadRequest()
        {
            // Arrange
            var framework = new Framework();

            var meshPutModel = new MeshPutModel() 
                {
                Name = ""
                };

            var content = JsonConvert.SerializeObject(meshPutModel);
            var stringContent = new StringContent(content, Encoding.UTF8, "application/json");

            // Act
            var response = await framework.Client.PutAsync("/api/v1/meshes/0", stringContent);
            var responseString = await response.Content.ReadAsStringAsync();

            // Assert
            var apiResult = JsonConvert.DeserializeObject<ApiResult>(responseString);
            apiResult.HttpStatusCode.Should().Be((int) HttpStatusCode.BadRequest);
        }
    }
}
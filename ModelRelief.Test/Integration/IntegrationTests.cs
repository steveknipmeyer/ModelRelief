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
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration
{
    /// <summary>
    /// Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    [Collection("Integration")]
    public abstract class IntegrationTests <TEntity, TGetModel>: IClassFixture<ClassFixture>, IAsyncLifetime
        where TEntity   : DomainModel
        where TGetModel : class, ITGetModel, new()
    {
        public ClassFixture ServerFixture { get; set; }
        public TestModel<TEntity, TGetModel> TestModel { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public IntegrationTests(ClassFixture serverFixture, TestModel<TEntity, TGetModel> testModel)
        {
            ServerFixture = serverFixture;
            TestModel     = testModel;

            TestModel.Initialize();
        }

        /// <summary>
        /// Called before class is used. Opportunity to use an async method for setup.
        /// </summary>
        /// <returns></returns>
        public Task InitializeAsync()
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Called before class is destroyed. Opportunity to use an async method for teardown.
        /// </summary>
        /// <returns></returns>
        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Unpacks the ApiError from a response.
        /// </summary>
        /// <param name="requestResponse">Response.</param>
        private ApiError UnpackApiError(RequestResponse requestResponse)
        {
            Assert.False(requestResponse.Message.IsSuccessStatusCode);

            var apiError = new ApiError();
            try
            {
                apiError = JsonConvert.DeserializeObject<ApiError>(requestResponse.ContentString);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"JSON Deserialization: {ex.Message}");
            }
            return apiError;
        }

        /// <summary>
        /// Asserts that the request returned a specific HTTP status code.
        /// </summary>
        /// <param name="requestResponse">Response.</param>
        /// <param name="statusCode">Expected status code.</param>
        public void AssertApiErrorHttpStatusCode(RequestResponse requestResponse, HttpStatusCode statusCode)
        {
            var apiError = UnpackApiError(requestResponse);
            apiError.HttpStatusCode.Should().Be(( int )statusCode);
        }

        /// <summary>
        /// Asserts that the request returned a specific API status code.
        /// </summary>
        /// <param name="requestResponse">Response.</param>
        /// <param name="statusCode">Expected status code.</param>
        public void AssertApiErrorApiStatusCode(RequestResponse requestResponse, ApiStatusCode statusCode)
        {
            var apiError = UnpackApiError(requestResponse);
            apiError.ApiStatusCode.Should().Be(( int )statusCode);
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

        /// <summary>
        /// Delete an existing model.
        /// </summary>
        public virtual async Task DeleteModel(TGetModel existingModel)
        {
            // Arrange

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Delete, $"{TestModel.ApiUrl}/{existingModel.Id}");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
        }
    }
}

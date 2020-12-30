// -----------------------------------------------------------------------
// <copyright file="IntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration
{
    using System;
    using System.Diagnostics;
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Test.TestModels;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    /// <typeparam name="TEntity">Domain model.</typeparam>
    /// <typeparam name="TGetModel">DTO Get model.</typeparam>
    [Collection("Database")]
    public abstract class IntegrationTests<TEntity, TGetModel> : IClassFixture<ClassFixture>, IAsyncLifetime
        where TEntity   : DomainModel
        where TGetModel : class, IModel, new()
    {
        public ClassFixture ClassFixture { get; set; }
        public TestModelFactory<TEntity, TGetModel> TestModelFactory { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="IntegrationTests{TEntity, TGetModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        /// <param name="testModel">A test model under integration testing.</param>
        public IntegrationTests(ClassFixture classFixture, TestModelFactory<TEntity, TGetModel> testModel)
        {
            ClassFixture      = classFixture;
            TestModelFactory  = testModel;

            TestModelFactory.Initialize();
        }

        /// <summary>
        /// Called before class is used. Opportunity to use an async method for setup.
        /// </summary>
        public async Task InitializeAsync()
        {
            await Task.CompletedTask;
        }

        /// <summary>
        /// Called before class is destroyed. Opportunity to use an async method for teardown.
        /// </summary>
        public async Task DisposeAsync()
        {
            await Task.CompletedTask;
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
            apiError.HttpStatusCode.Should().Be((int)statusCode);
        }

        /// <summary>
        /// Asserts that the request returned a specific API error code.
        /// </summary>
        /// <param name="requestResponse">Response.</param>
        /// <param name="statusCode">Expected error code.</param>
        public void AssertApiErrorCode(RequestResponse requestResponse, ApiErrorCode statusCode)
        {
            var apiError = UnpackApiError(requestResponse);
            apiError.ApiErrorCode.Should().Be((int)statusCode);
        }

        /// <summary>
        /// Creates a new resource.
        /// </summary>
        public virtual async Task<IModel> PostNewModel()
        {
            return await TestModelFactory.PostNewModel();
        }

        /// <summary>
        /// Delete an existing model.
        /// </summary>
        /// <param name="existingModel">Model to delete.</param>
        public virtual async Task DeleteModel(IModel existingModel)
        {
            await TestModelFactory.DeleteModel(existingModel);
        }
    }
}

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

        #region GetFile
        /// <summary>
        /// Tests whether the entire file is returned from the request.
        /// </summary>
        [Fact]
        [Trait ("Category", "Api GetFile")]
        public virtual async Task GetFile_ReturnsTheEntireFile()
        {
            // Arrange
            var modelId = TestModel.IdRange.Min();

            // Act
            var requestResponse = await ServerFixture.Framework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModel.ApiUrl}/{modelId}/file");

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);
        }
        #endregion
    }
}

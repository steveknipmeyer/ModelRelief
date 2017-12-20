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

        /// <summary>
        /// Tests whether the entire file is returned from the request.
        /// </summary>
        /// <returns></returns>
        [Fact]
        [Trait ("Category", "Api GetFile")]
        public async Task GetFile_FileIsReturned()
        {
            // Arrange
            var modelId = TestModel.IdRange.Min();

            // Act
            var existingModel = await TestModel.FindModel(ServerFixture, modelId);

            // Assert
            existingModel.Name.Should().Be(TestModel.FirstModelName);
       }
    }
}

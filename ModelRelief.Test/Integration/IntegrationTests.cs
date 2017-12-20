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
    /// Integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public abstract class IntegrationTests <TEntity, TGetModel>: IClassFixture<ServerFixture>, IAsyncLifetime
        where TEntity   : DomainModel
        where TGetModel : class, ITGetModel, new()
    {
        public ServerFixture ServerFixture { get; set; }
        public TestModel<TEntity, TGetModel> TestModel { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public IntegrationTests(ServerFixture serverFixture, TestModel<TEntity, TGetModel> testModel)
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
            ServerFixture.Framework.RefreshTestDatabase();
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
    }
}

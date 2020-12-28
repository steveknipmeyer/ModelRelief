// -----------------------------------------------------------------------
// <copyright file="Workbench.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Test.TestModels;
    using ModelRelief.Utility;
    using Newtonsoft.Json;
    using Xunit;

    public class Workbench
    {
        /// <summary>
        /// Workbench
        /// </summary>
        [Fact]
        public async Task Test()
        {
            await Task.CompletedTask;

            // Assert
            Assert.True(true);
        }
    }
}
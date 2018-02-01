// -----------------------------------------------------------------------
// <copyright file="AutoMapperUnitTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Unit.Infrastructure
{
    using System.IO;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Moq;
    using Xunit;

    public class AutoMapperUnitTests
    {
        [Fact]
        [Trait("Category", "Infrastructure")]
        public void AutoMapperConfigurationIsValid()
        {
            var serverFramework = new ServerFramework();

            Mapper.AssertConfigurationIsValid();
        }
    }
}

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
            var hostMock = new Mock<IHostingEnvironment>();
            hostMock.Setup(mock => mock.ContentRootPath).Returns(Directory.GetCurrentDirectory());

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, true)
                .AddEnvironmentVariables();

            var configuration = builder.Build();

            var startup = new Startup(configuration);
            var services = new ServiceCollection();
            startup.ConfigureServices(services);

            // https://stackoverflow.com/questions/42221895/how-to-get-an-instance-of-iserviceprovider-in-net-core
            var servicesProvider = services.BuildServiceProvider();

            Mapper.AssertConfigurationIsValid();
        }
    }
}

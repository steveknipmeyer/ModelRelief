// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ModelRelief.Database;
using Moq;
using System.IO;
using Xunit;

namespace ModelRelief.Test.Unit.Infrastructure
{
    public class AutoMapperUnitTests
    {
        [Fact]
        [Trait ("Category", "Infrastructure")]
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

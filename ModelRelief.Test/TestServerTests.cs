// -----------------------------------------------------------------------
// <copyright file="TestServerTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System;
    using System.Net;
    using System.Threading.Tasks;
    using Autofac.Extensions.DependencyInjection;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.TestHost;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Net.Http.Headers;
    using Xunit;
    public class TestServerTests
    {
        public TestServerTests()
        {
        }
        public async Task GenericCreateAndStartHost_GetTestServer()
        {
            using var host = await new HostBuilder()
                .UseServiceProviderFactory(new AutofacServiceProviderFactory())
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureWebHost(webBuilder =>
                {
                    webBuilder
                        .UseTestServer();
                })
                .StartAsync();

            var server = host.GetTestServer();
            var client = server.CreateClient();

            var response = await client.GetAsync("/");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
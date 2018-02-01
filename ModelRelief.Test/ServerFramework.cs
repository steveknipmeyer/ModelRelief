// -----------------------------------------------------------------------
// <copyright file="ServerFramework.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System.IO;
    using System.Net.Http;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.TestHost;
    using Microsoft.Extensions.Configuration;
    using ModelRelief.Services;
    using Newtonsoft.Json;

    /// <summary>
    /// Sets up a test server and HTTP client for integration testing.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class ServerFramework
    {
        public TestServer Server { get; set; }
        public HttpClient Client { get; set; }

        public string Environment { get; set; }
        public Services.IConfigurationProvider ConfigurationProvider { get; set; }

        public ServerFramework()
        {
            var contentRootPath = Settings.GetContentRootPath();
            Directory.SetCurrentDirectory(contentRootPath);

            Environment = "Test";
            Server = new TestServer(WebHost.CreateDefaultBuilder(null)
                                            .UseEnvironment(Environment)
                                            .UseContentRoot(contentRootPath)
                                            .ConfigureAppConfiguration((builderContext, config) =>
                                            {
                                                // WIP: Implement secret store for Production environments. Azure?
                                                // https://joonasw.net/view/aspnet-core-2-configuration-changes
                                                var env = builderContext.HostingEnvironment;
                                                var appAssembly = Assembly.Load(new AssemblyName(env.ApplicationName));
                                                if (appAssembly != null)
                                                {
                                                    config.AddUserSecrets(appAssembly, optional: true);
                                                }

                                                var standardConfigurationProvider = config.SetBasePath(contentRootPath)
                                                .AddJsonFile($"appsettings.json", optional: false, reloadOnChange: false)
                                                .AddJsonFile($"appsettings.{Environment}.json", optional: false, reloadOnChange: false)
                                                .Build();

                                                this.ConfigurationProvider = new Services.ConfigurationProvider(standardConfigurationProvider);
                                            })
                                            .UseStartup<Startup>());

            Client = Server.CreateClient();
        }

        /// <summary>
        /// Submits an object to a given endpoint using the HTTP method.
        /// </summary>
        /// <param name="requestType">HTTP request type.</param>
        /// <param name="endPoint">Endpoint.</param>
        /// <param name="contentObject">Object to serlize and send in the body of the request.</param>
        /// <param name="binaryContent">File content for the requwst.</param>
        /// <returns></returns>
        public async Task<RequestResponse> SubmitHttpRequest(HttpRequestType requestType, string endPoint, object contentObject = null, bool binaryContent = false)
        {
            HttpContent content = null;
            if (!binaryContent)
            {
                var jsonContent = JsonConvert.SerializeObject(contentObject);
                content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            }
            else
            {
                content = new ByteArrayContent(contentObject as byte[]);
            }

            HttpResponseMessage response = null;
            switch (requestType)
            {
                case HttpRequestType.Get:
                    response = await Client.GetAsync(endPoint);
                    break;

                case HttpRequestType.Post:
                    response = await Client.PostAsync(endPoint, content);
                    break;

                case HttpRequestType.Put:
                    response = await Client.PutAsync(endPoint, content);
                    break;

                case HttpRequestType.Delete:
                    response = await Client.DeleteAsync(endPoint);
                    break;
            }
            var responseString = await response.Content.ReadAsStringAsync();

            return new RequestResponse { Message = response, ContentString = responseString };
        }
    }
}

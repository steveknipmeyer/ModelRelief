// -----------------------------------------------------------------------
// <copyright file="ServerFramework.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.TestHost;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ModelRelief.Settings;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// Sets up a test server and HTTP client for integration testing.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class ServerFramework
    {
        public TestServer Server { get; set; }
        public HttpClient Client { get; set; }

        public Services.IConfigurationProvider ConfigurationProvider { get; set; }

        public ServerFramework()
        {
            var contentRootPath = Settings.GetContentRootPath();
            Directory.SetCurrentDirectory(contentRootPath);

            Server = new TestServer(WebHost.CreateDefaultBuilder(null)
                                            .UseEnvironment(Settings.Environment)
                                            .UseContentRoot(contentRootPath)
                                            .ConfigureAppConfiguration((builderContext, config) =>
                                            {
                                                var loggerFactory = new LoggerFactory();
                                                var logger = loggerFactory.CreateLogger<Services.ConfigurationProvider>();

                                                config.AddJsonFile("azurekeyvault.json", optional: false);
                                                var builtConfig = config.Build();

                                                config.AddAzureKeyVault(
                                                    $"https://{builtConfig["AzureKeyVault:Vault"]}.vault.azure.net/",
                                                    builtConfig["AzureKeyVault:ApplicationId"],
                                                    builtConfig["AzureKeyVault:ModelReliefKVKey"]);

                                                var configurationProvider = Settings.ConfigurationProvider(config);
                                                this.ConfigurationProvider = new Services.ConfigurationProvider(configurationProvider, logger);
                                            })
                                            .UseStartup<Startup>());

            Client = Server.CreateClient();
            SetAuthorizationHeaderAsync().Wait();
        }

        /// <summary>
        /// Requests an API JWT Bearer token from Auth0.
        /// The token is set as the default Authorization for all client requests.
        /// </summary>
        /// <returns></returns>
        private async Task<bool> SetAuthorizationHeaderAsync()
        {
            var accounts = Server.Host.Services.GetRequiredService<IOptions<AccountsSettings>>().Value as AccountsSettings;
            var auth0    = Server.Host.Services.GetRequiredService<IOptions<Auth0Settings>>().Value as Auth0Settings;

            var configuration = ConfigurationProvider.Configuration;
            var passwordGrantRequest = new
            {
                grant_type      = "password",
                username        = accounts.Development.Name,
                password        = accounts.Development.Password,
                audience        = auth0.ApiAudience,
                client_id       = auth0.ApiClientId,
                client_secret   = auth0.ApiClientSecret,
            };

            var client = new HttpClient();
            var endpoint = "https://modelrelief.auth0.com/oauth/token";
            var requestResponse = await SubmitHttpRequestAsync(client, HttpRequestType.Post, endpoint, passwordGrantRequest);
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var passwordGrant = JsonConvert.DeserializeObject<PasswordGrant>(requestResponse.ContentString);
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passwordGrant.Access_token);

            return true;
        }

        /// <summary>
        /// Submits an object to a given endpoint using the HTTP method.
        /// </summary>
        /// <param name="client">HTTP client to send request..</param>
        /// <param name="requestType">HTTP request type.</param>
        /// <param name="endPoint">Endpoint.</param>
        /// <param name="contentObject">Object to serlize and send in the body of the request.</param>
        /// <param name="binaryContent">File content for the requwst.</param>
        /// <returns></returns>
        public async Task<RequestResponse> SubmitHttpRequestAsync(HttpClient client, HttpRequestType requestType, string endPoint, object contentObject = null, bool binaryContent = false)
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

            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                switch (requestType)
                {
                    case HttpRequestType.Get:
                        response = await client.GetAsync(endPoint);
                        break;

                    case HttpRequestType.Post:
                        response = await client.PostAsync(endPoint, content);
                        break;

                    case HttpRequestType.Put:
                        response = await client.PutAsync(endPoint, content);
                        break;

                    case HttpRequestType.Delete:
                        response = await client.DeleteAsync(endPoint);
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"HTTP request {endPoint} threw an exception: {ex.Message}");
                return new RequestResponse { Message = response, ContentString = string.Empty };
            }

            var responseString = await response.Content.ReadAsStringAsync();
            return new RequestResponse { Message = response, ContentString = responseString };
        }

        /// <summary>
        /// Submits an object to a given endpoint using the HTTP method.
        /// </summary>
        /// <param name="requestType">HTTP request type.</param>
        /// <param name="endPoint">Endpoint.</param>
        /// <param name="contentObject">Object to serlize and send in the body of the request.</param>
        /// <param name="binaryContent">File content for the requwst.</param>
        /// <returns></returns>
        public async Task<RequestResponse> SubmitHttpRequestAsync(HttpRequestType requestType, string endPoint, object contentObject = null, bool binaryContent = false)
        {
            // use TestServer HTTPClient
            return await SubmitHttpRequestAsync(Client, requestType, endPoint, contentObject, binaryContent);
        }
    }
}
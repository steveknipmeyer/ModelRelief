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
    using Autofac.Extensions.DependencyInjection;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.TestHost;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ModelRelief.Dto;
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

            var host = Host.CreateDefaultBuilder()
                .UseServiceProviderFactory(new AutofacServiceProviderFactory())
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
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    // N.B. <Must> precede UseTestServer or a Kestrel server is created
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureWebHost(webBuilder =>
                {
                    webBuilder.UseTestServer();
                })
                .Build();

            host.StartAsync().Wait();

            Server = host.GetTestServer();
            Client = Server.CreateClient();
        }

        /// <summary>
        /// Perform server initialization.
        /// </summary>
        /// <returns>true if successful.</returns>
        public async Task<bool> Initialize()
        {
            await SetAuthorizationHeaderAsync();
            return true;
        }

        /// <summary>
        /// Submits an object to a given endpoint using the HTTP method.
        /// </summary>
        /// <param name="requestType">HTTP request type.</param>
        /// <param name="endPoint">Endpoint.</param>
        /// <param name="contentObject">Object to serlize and send in the body of the request.</param>
        /// <param name="mimeType">HTTP Mime type.</param>
        public async Task<RequestResponse> SubmitHttpRequestAsync(HttpRequestType requestType, string endPoint, object contentObject = null, string mimeType = HttpMimeType.Json)
        {
            // use TestServer HTTPClient
            return await SubmitHttpRequestAsync(Client, requestType, endPoint, contentObject, mimeType);
        }

        /// <summary>
        /// Constructs content for a multipart-formdata request.
        /// </summary>
        /// <param name="model">Model to POST.</param>
        /// <param name="fileName">Full path filename for request.</param>
        public MultipartFormDataContent CreateMultipartFormDataContent(IFileModel model, string fileName)
        {
            // https://codeburst.io/upload-download-files-using-httpclient-in-c-f29051dea40c

            var form = new MultipartFormDataContent();

            form.Add(new StringContent(model.Name), "Name");
            form.Add(new StringContent(model.Description), "Description");

            var fileContent = new ByteArrayContent(File.ReadAllBytes(fileName));
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("multipart/form-data");
            form.Add(fileContent, "FormFile", Path.GetFileName(fileName));

            return form;
        }

        /// <summary>
        /// Submits an object to a given endpoint using the HTTP method.
        /// </summary>
        /// <param name="client">HTTP client to send request..</param>
        /// <param name="requestType">HTTP request type.</param>
        /// <param name="endPoint">Endpoint.</param>
        /// <param name="contentObject">Object to serlize and send in the body of the request.</param>
        /// <param name="mimeType">HTTP Mime type.</param>
        private async Task<RequestResponse> SubmitHttpRequestAsync(HttpClient client, HttpRequestType requestType, string endPoint, object contentObject = null, string mimeType = HttpMimeType.Json)
        {
            HttpContent content = null;
            switch (mimeType)
            {
                case HttpMimeType.Json:
                    var jsonContent = JsonConvert.SerializeObject(contentObject);
                    content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
                    break;

                case HttpMimeType.OctetStream:
                    content = new ByteArrayContent(contentObject as byte[]);
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    break;

                case HttpMimeType.MultiPartFormData:
                    content = contentObject as HttpContent;
                    break;
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
        /// Requests an API JWT Bearer token from Auth0.
        /// The token is set as the default Authorization for all client requests.
        /// </summary>
        /// <returns>True</returns>
        private async Task<bool> SetAuthorizationHeaderAsync()
        {
            var accounts = Server.Services.GetRequiredService<IOptions<AccountsSettings>>().Value as AccountsSettings;
            var auth0 = Server.Services.GetRequiredService<IOptions<Auth0Settings>>().Value as Auth0Settings;
            var passwordGrantRequest = new
            {
                grant_type      = "password",
                username        = accounts.Development.Name,
                password        = accounts.Development.Password,
                audience        = auth0.ApiAudience,
                client_id       = auth0.ApiClientId,
                client_secret   = auth0.ApiClientSecret,
            };

            // construct a regular HttpClient (not TestServer) as the endpoint is on the Auth0 server
            var endpoint = "https://modelrelief.auth0.com/oauth/token";
            var client = new HttpClient();
            var requestResponse = await SubmitHttpRequestAsync(new HttpClient(), HttpRequestType.Post, endpoint, passwordGrantRequest);
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var passwordGrant = JsonConvert.DeserializeObject<PasswordGrant>(requestResponse.ContentString);
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passwordGrant.Access_token);

            return true;
        }
   }
}
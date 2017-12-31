// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ModelRelief.Test.Integration
{
    /// <summary>
    /// HTTP request types.
    /// </summary>
    public enum HttpRequestType
    {
        Get,
        Post,
        Put,
        Delete
    }

    /// <summary>
    /// Represents the result of a client request.
    /// </summary>
    public class RequestResponse
    {
        public HttpResponseMessage Message { get; set; }
        public string              ContentString { get; set; }
    }

    /// <summary>
    /// Sets up a test server and HTTP client for integration testing.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class Framework
    {
        public TestServer Server { get; set; }
        public HttpClient Client { get; set; }
        public IServiceProvider ServiceProvider { get; set; }

        public Framework()
        {
            var contentRootPath = GetContentRootPath();           
            Directory.SetCurrentDirectory(contentRootPath);

            Server = new TestServer(WebHost.CreateDefaultBuilder(null)
                                            .UseEnvironment("Test")
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
                                             })
                                            .UseStartup<Startup>());

            Client = Server.CreateClient();
            ServiceProvider = Server.Host.Services;
        }

        /// <summary>
        /// Returns the root of the content folder. wwwroot is below this folder.
        /// </summary>
        /// <returns>Content folder root.</returns>
        public string GetContentRootPath()
        {
            // e.g. D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\ModelRelief.Test\bin\Debug\netcoreapp2.0
            var currentDirectory = Directory.GetCurrentDirectory();

            // reset path from <top> down
            var contentRootPath = currentDirectory.Remove (currentDirectory.IndexOf(Settings.ContentRootFolder) + Settings.ContentRootFolder.Length);
            contentRootPath = Path.Combine (contentRootPath, Settings.ContentRootFolder) + @"\";

            return contentRootPath;
        }

        /// <summary>
        /// Returns the root of the test files folder. 
        /// </summary>
        /// <returns>Test files folder.</returns>
        public string GetTestFilesPath()
        {
            var contentRootPath = GetContentRootPath();
            var testFilesFolder = $"{contentRootPath}/{Settings.TestFilesFolder}";

            return testFilesFolder;
        }

        /// <summary>
        /// Submits an object to a given endpoint using the HTTP method.
        /// </summary>
        /// <param name="requestType">HTTP request type.</param>
        /// <param name="endPoint">Endpoint.</param>
        /// <param name="contentObject">Object to serlize and send in the body of the request.</param>
        /// <returns></returns>
        public async Task<RequestResponse> SubmitHttpRequest (HttpRequestType requestType, string endPoint, object contentObject = null, bool binaryContent = false)
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

            HttpResponseMessage response = null;;
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

            return new RequestResponse { Message = response, ContentString = responseString};
        }
    }
}

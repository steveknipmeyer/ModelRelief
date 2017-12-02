// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Newtonsoft.Json;
using System.IO;
using System.Net.Http;
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
    /// Sets up a test server and HTTP client for integration testing.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class Framework
    {
        public TestServer Server { get; set; }
        public HttpClient Client { get; set; }

        public Framework()
        {
          // Arrange

          // e.g. D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\ModelRelief.Test\bin\Debug\netcoreapp2.0
          var currentDirectory = Directory.GetCurrentDirectory();

          // reset path from <top> down
          var contentRootPath = currentDirectory.Remove (currentDirectory.IndexOf(Settings.ContentRootFolder) + Settings.ContentRootFolder.Length);
          contentRootPath = Path.Combine (contentRootPath, Settings.ContentRootFolder) + @"\";

          Directory.SetCurrentDirectory(contentRootPath);

          Server = new TestServer(WebHost.CreateDefaultBuilder(null)
                                         .UseContentRoot(contentRootPath)
                                         .UseStartup<Startup>());

          Client = Server.CreateClient();
        }
    
        /// <summary>
        /// Submits an object to a given endpoint using the HTTP method.
        /// </summary>
        /// <param name="requestType">HTTP request type.</param>
        /// <param name="endPoint">Endpoint.</param>
        /// <param name="contentObject">Object to serlize and send in the body of the request.</param>
        /// <returns></returns>
        public static async Task<string> SubmitHttpRequest (HttpRequestType requestType, string endPoint, object contentObject = null)
        {
            var framework = new Framework();

            var jsonContent = JsonConvert.SerializeObject(contentObject);
            var stringContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            HttpResponseMessage response = null;;
            switch (requestType)
            {
                case HttpRequestType.Get:
                    response = await framework.Client.GetAsync(endPoint);
                    break;
                    
                case HttpRequestType.Post:
                    response = await framework.Client.PostAsync(endPoint, stringContent);
                    break;

                case HttpRequestType.Put:
                    response = await framework.Client.PutAsync(endPoint, stringContent);
                    break;

                case HttpRequestType.Delete:
                    response = await framework.Client.DeleteAsync(endPoint);
                    break;
            }
            var responseString = await response.Content.ReadAsStringAsync();

            return responseString;
        }
    }
}

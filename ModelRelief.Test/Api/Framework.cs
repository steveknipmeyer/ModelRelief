// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using System.IO;
using System.Net.Http;

namespace ModelRelief.Test.Api
{
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
    }
}

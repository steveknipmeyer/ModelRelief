// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

using Serilog;
using Serilog.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

using ModelRelief.Database;
using ModelRelief.Models;
using System.Net;

namespace ModelRelief.Infrastructure
{
    public class RouteNames
    {
        public const string Default          = "Default";
        public const string DefaultApi       = "DefaultApi";
        public const string ApiDocumentation = "ApiDocumentation";
    }
}
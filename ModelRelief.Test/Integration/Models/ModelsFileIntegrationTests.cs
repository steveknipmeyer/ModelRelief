// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration.Models
{
    /// <summary>
    /// DepthBuffer integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class ModelsFileIntegrationTests : FileIntegrationTests<Domain.Model3d, Dto.Model3d>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public ModelsFileIntegrationTests(ServerFixture serverFixture) :
            base (serverFixture, new Model3dTestModel())
        {
        }
    }
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Test.TestModels.DepthBuffers;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration.DepthBuffers
{
    /// <summary>
    /// DepthBuffer integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class DepthBuffersFileIntegrationTests : FileIntegrationTests<Domain.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public DepthBuffersFileIntegrationTests(ClassFixture classFixture) :
            base (classFixture, new DepthBufferTestModel())
        {
        }
    }
}

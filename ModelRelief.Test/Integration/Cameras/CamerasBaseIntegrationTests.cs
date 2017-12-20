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

#if true
namespace ModelRelief.Test.Integration.Cameras
{
    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class CamerasBaseIntegrationTests : BaseIntegrationTests<Domain.Camera, Dto.Camera>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public CamerasBaseIntegrationTests(ServerFixture serverFixture) :
            base (serverFixture, new CameraTestModel())
        {
        }

#region Get
#endregion

#region Post
#endregion

#region Put
#endregion

#region Delete
#endregion
    }
}
#endif
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using ModelRelief.Test.TestModels.MeshTransforms;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration.MeshTransforms
{
    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshTransformsBaseIntegrationTests : BaseIntegrationTests<Domain.MeshTransform, Dto.MeshTransform>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public MeshTransformsBaseIntegrationTests(ClassFixture classFixture) :
            base (classFixture, new MeshTransformTestModel())
        {
        }

#region Get
#endregion

#region Post
#endregion

#region Put
#endregion

#region Patch
#endregion

#region Delete
#endregion
    }
}

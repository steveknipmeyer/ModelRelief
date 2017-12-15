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
namespace ModelRelief.Test.Integration.DepthBuffers
{
    /// <summary>
    /// DepthBuffer integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class DepthBuffersIntegrationTests : BaseIntegrationTests<Dto.DepthBuffer>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public DepthBuffersIntegrationTests(ServerFixture serverFixture) :
            base (serverFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/depth-buffers";
            UxUrl  = "/depthbuffers";
            
            IdRange = Enumerable.Range(1, 3);
            FirstModelName = "Lucy";
            
            ReferencePropertyNames = new List<string> {"ProjectId", "ModelId", "CameraId"};
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "Format";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override Dto.DepthBuffer ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();
            validModel.Format = Domain.DepthBufferFormat.Raw;

            return validModel;
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
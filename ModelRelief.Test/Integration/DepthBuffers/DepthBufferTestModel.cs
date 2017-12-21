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

namespace ModelRelief.Test.Integration.DepthBuffers
{
    /// <summary>
    /// DepthBuffer test model.
    /// </summary>
    public class DepthBufferTestModel : TestModel<Domain.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public DepthBufferTestModel() :
            base ()
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
            FirstModelName = "lucy.raw";
            
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
    }
}

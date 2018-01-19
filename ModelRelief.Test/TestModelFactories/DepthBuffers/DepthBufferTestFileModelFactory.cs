// -----------------------------------------------------------------------
// <copyright file="DepthBufferTestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.DepthBuffers
{
    using System.Collections.Generic;
    using System.Linq;
    using ModelRelief.Api.V1.Shared.Rest;

    /// <summary>
    /// DepthBuffer test model.
    /// </summary>
    public class DepthBufferTestFileModelFactory : TestFileModelFactory<Domain.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBufferTestFileModelFactory"/> class.
        /// Constructor
        /// </summary>
        public DepthBufferTestFileModelFactory()
            : base()
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

            ReferencePropertyNames = new List<string> { "ProjectId", "Model3dId", "CameraId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "Format";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override ITGetModel ConstructValidModel()
        {
            var validModel = base.ConstructValidModel() as Dto.DepthBuffer;
            validModel.Name = "TestDepthBuffer.raw";
            validModel.Format = Domain.DepthBufferFormat.RAW;

            return validModel;
        }
    }
}

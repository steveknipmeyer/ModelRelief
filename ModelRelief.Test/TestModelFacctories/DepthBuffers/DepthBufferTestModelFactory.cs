// -----------------------------------------------------------------------
// <copyright file="DepthBufferTestModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.DepthBuffers
{
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// DepthBuffer test model.
    /// </summary>
    public class DepthBufferTestModelFactory : TestModelFactory<Domain.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBufferTestModelFactory"/> class.
        /// Constructor
        /// </summary>
        public DepthBufferTestModelFactory()
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

            ReferencePropertyNames = new List<string> { "ProjectId", "ModelId", "CameraId" };
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

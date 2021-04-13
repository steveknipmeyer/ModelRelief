// -----------------------------------------------------------------------
// <copyright file="DepthBufferTestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.DepthBuffers
{
    using System.Collections.Generic;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    /// <summary>
    /// DepthBuffer test model.
    /// </summary>
    public class DepthBufferTestFileModelFactory : TestFileModelFactory<Domain.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBufferTestFileModelFactory"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public DepthBufferTestFileModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = $"{RootApi}depth-buffers";
            UxUrl = "/depthbuffers";

            ReferencePropertyNames = new List<string> { "ProjectId", "Model3dId", "CameraId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "Format";

            BackingFile = "depthbuffer.sdb";
            PreviewFile = "depthbufferPreview.png";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override IModel ConstructValidModel()
        {
            var depthBuffer = base.ConstructValidModel() as Dto.DepthBuffer;

            depthBuffer.Name   = BackingFile;
            depthBuffer.Width  = Defaults.Resolution.Image;
            depthBuffer.Height = Defaults.Resolution.Image;
            depthBuffer.Format = Domain.DepthBufferFormat.SDB;

            return depthBuffer;
        }
    }
}

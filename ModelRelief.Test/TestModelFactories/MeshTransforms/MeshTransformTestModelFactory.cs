// -----------------------------------------------------------------------
// <copyright file="MeshTransformTestModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.MeshTransforms
{
    using System.Collections.Generic;
    using System.Linq;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Dto;

    /// <summary>
    /// MeshTransform test model.
    /// </summary>
    public class MeshTransformTestModelFactory : TestModelFactory<Domain.MeshTransform, Dto.MeshTransform>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransformTestModelFactory"/> class.
        /// Constructor
        /// </summary>
        public MeshTransformTestModelFactory()
            : base()
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/meshtransforms";
            UxUrl  = "/meshtransforms";

            IdRange = Enumerable.Range(1, 6);
            FirstModelName = "Identity";

            ReferencePropertyNames = new List<string> { "ProjectId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = null;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override IModel ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();
            validModel.Name = "TestMeshTransform";

            var meshModel = validModel as Dto.MeshTransform;
            meshModel.Width = 100;
            meshModel.Height = 100;
            meshModel.Depth = 1.0;
            meshModel.UnsharpHighFrequencyScale = 1.0;

            return meshModel;
        }
    }
}

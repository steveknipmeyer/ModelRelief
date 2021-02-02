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
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public MeshTransformTestModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = $"{RootApi}mesh-transforms";
            UxUrl = "/meshtransforms";

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

            var meshTransformModel = validModel as Dto.MeshTransform;
            meshTransformModel.Width = 100;
            meshTransformModel.Height = 100;
            meshTransformModel.Depth = 1.0;

            meshTransformModel.GradientThresholdEnabled = true;
            meshTransformModel.GradientThreshold = 5.0;

            meshTransformModel.UnsharpMaskingEnabled = true;
            meshTransformModel.UnsharpGaussianLow = 4.0;
            meshTransformModel.UnsharpGaussianHigh = 1.0;
            meshTransformModel.UnsharpHighFrequencyScale = 1.0;

            meshTransformModel.SilhouetteEnabled = true;
            meshTransformModel.SilhouetteSigma = 4.0;
            meshTransformModel.SilhouettePasses = 2;

            meshTransformModel.ReliefScale = 0.03;

            return meshTransformModel;
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="MeshTestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Meshes
{
    using System.Collections.Generic;
    using System.Linq;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Dto;

    /// <summary>
    /// Mesh test model.
    /// </summary>
    public class MeshTestFileModelFactory : TestFileModelFactory<Domain.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTestFileModelFactory"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public MeshTestFileModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/meshes";
            UxUrl  = "/meshes";

            IdRange = Enumerable.Range(1, 14);
            FirstModelName = "armadillo.sfp";

            ReferencePropertyNames = new List<string> { "ProjectId", "CameraId", "DepthBufferId", "MeshTransformId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "Format";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override IModel ConstructValidModel()
        {
            var validModel = base.ConstructValidModel() as Dto.Mesh;
            validModel.Name = "TestMesh.sfp";
            validModel.Format = Domain.MeshFormat.SFP;

            return validModel;
        }
    }
}

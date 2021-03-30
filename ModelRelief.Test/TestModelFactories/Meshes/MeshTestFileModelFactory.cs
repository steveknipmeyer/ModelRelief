// -----------------------------------------------------------------------
// <copyright file="MeshTestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Meshes
{
    using System.Collections.Generic;
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
            ApiUrl = $"{RootApi}meshes";
            UxUrl = "/meshes";

            ReferencePropertyNames = new List<string> { "ProjectId", "CameraId", "DepthBufferId", "NormalMapId", "MeshTransformId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "Format";

            BackingFile = "mesh.sfp";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override IModel ConstructValidModel()
        {
            var validModel = base.ConstructValidModel() as Dto.Mesh;

            validModel.Name   = BackingFile;
            validModel.Format = Domain.MeshFormat.SFP;

            return validModel;
        }
    }
}

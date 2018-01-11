// -----------------------------------------------------------------------
// <copyright file="MeshTestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Meshes
{
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Mesh test model.
    /// </summary>
    public class MeshTestFileModelFactory : TestFileModelFactory<Domain.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTestFileModelFactory"/> class.
        /// Constructor
        /// </summary>
        public MeshTestFileModelFactory()
            : base()
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/meshes";
            UxUrl  = "/meshes";

            IdRange = Enumerable.Range(1, 3);
            FirstModelName = "lucy.obj";

            ReferencePropertyNames = new List<string> { "ProjectId", "CameraId", "DepthBufferId", "MeshTransformId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "Format";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override Dto.Mesh ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();
            validModel.Format = Domain.MeshFormat.OBJ;

            return validModel;
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="Model3dTestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Models
{
    using System.Collections.Generic;
    using System.Linq;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Dto;

    /// <summary>
    /// Model3d test model.
    /// </summary>
    public class Model3dTestFileModelFactory : TestFileModelFactory<Domain.Model3d, Dto.Model3d>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Model3dTestFileModelFactory"/> class.
        /// Constructor
        /// </summary>
        public Model3dTestFileModelFactory()
            : base()
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/models";
            UxUrl  = "/models";

            IdRange = Enumerable.Range(1, 6);
            FirstModelName = "lucy.obj";

            ReferencePropertyNames = new List<string> { "ProjectId", "CameraId" };
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
            var validModel = base.ConstructValidModel() as Dto.Model3d;
            validModel.Name = "TestModel3d.obj";
            validModel.Format = Domain.Model3dFormat.OBJ;

            return validModel;
        }
    }
}

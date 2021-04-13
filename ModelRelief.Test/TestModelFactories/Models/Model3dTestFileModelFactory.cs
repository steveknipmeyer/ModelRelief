// -----------------------------------------------------------------------
// <copyright file="Model3dTestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Models
{
    using System.Collections.Generic;
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
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public Model3dTestFileModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = $"{RootApi}models";
            UxUrl = "/models";

            ReferencePropertyNames = new List<string> { "ProjectId", "CameraId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "Format";

            BackingFile = "unitcube.obj";
            InvalidBackingFile = "invalid.obj";
            PreviewFile = "modelPreview.png";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override IModel ConstructValidModel()
        {
            var model = base.ConstructValidModel() as Dto.Model3d;

            model.Name   = BackingFile;
            model.Format = Domain.Model3dFormat.OBJ;

            return model;
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="Model3dTestModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Models
{
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Model3d test model.
    /// </summary>
    public class Model3dTestModel : TestModel<Domain.Model3d, Dto.Model3d>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Model3dTestModel"/> class.
        /// Constructor
        /// </summary>
        public Model3dTestModel()
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

            IdRange = Enumerable.Range(1, 5);
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
        public override Dto.Model3d ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();
            validModel.Format = Domain.Model3dFormat.OBJ;

            return validModel;
        }
    }
}
// -----------------------------------------------------------------------
// <copyright file="CameraTestModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Cameras
{
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Camera test model.
    /// </summary>
    public class CameraTestModel : TestModel<Domain.Camera, Dto.Camera>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CameraTestModel"/> class.
        /// Constructor
        /// </summary>
        public CameraTestModel()
            : base()
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/cameras";
            UxUrl  = "/cameras";

            IdRange = Enumerable.Range(1, 2);
            FirstModelName = "Top Camera";

            ReferencePropertyNames = new List<string> { "ProjectId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "StandardView";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override Dto.Camera ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();

            return validModel;
        }
    }
}

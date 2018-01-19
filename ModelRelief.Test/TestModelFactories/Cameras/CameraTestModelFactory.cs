// -----------------------------------------------------------------------
// <copyright file="CameraTestModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Cameras
{
    using System.Collections.Generic;
    using System.Linq;
    using ModelRelief.Api.V1.Shared.Rest;

    /// <summary>
    /// Camera test model.
    /// </summary>
    public class CameraTestModelFactory : TestModelFactory<Domain.Camera, Dto.Camera>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CameraTestModelFactory"/> class.
        /// Constructor
        /// </summary>
        public CameraTestModelFactory()
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
        public override ITGetModel ConstructValidModel()
        {
            var validModel = base.ConstructValidModel() as ITGetModel;
            validModel.Name = "TestCamera";
            return validModel;
        }
    }
}

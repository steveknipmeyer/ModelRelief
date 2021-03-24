// -----------------------------------------------------------------------
// <copyright file="CameraTestModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Cameras
{
    using System.Collections.Generic;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    /// <summary>
    /// Camera test model.
    /// </summary>
    public class CameraTestModelFactory : TestModelFactory<Domain.Camera, Dto.Camera>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CameraTestModelFactory"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public CameraTestModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = $"{RootApi}cameras";
            UxUrl  = $"{RootApi}cameras";

            ReferencePropertyNames = new List<string> { "ProjectId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override IModel ConstructValidModel()
        {
            var validModel = base.ConstructValidModel() as Dto.Camera;
            validModel.Name = "TestCamera";

            validModel.FieldOfView = Defaults.Camera.FieldOfView;
            validModel.AspectRatio = 1.0;
            validModel.Near = Defaults.Camera.NearClippingPlane;
            validModel.Far =  Defaults.Camera.FarClippingPlane;

            validModel.PositionX = 0.0;
            validModel.PositionY = 0.0;
            validModel.PositionZ = 0.0;

            validModel.EulerX =  0.0;
            validModel.EulerY =  0.0;
            validModel.EulerZ = -1.0;
            validModel.Theta = 0.0;

            return validModel;
        }
    }
}

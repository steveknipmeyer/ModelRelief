// -----------------------------------------------------------------------
// <copyright file="NormalMapTestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.NormalMaps
{
    using System.Collections.Generic;
    using ModelRelief.Dto;

    /// <summary>
    /// NormalMap test model.
    /// </summary>
    public class NormalMapTestFileModelFactory : TestFileModelFactory<Domain.NormalMap, Dto.NormalMap>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapTestFileModelFactory"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public NormalMapTestFileModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = $"{RootApi}normal-maps";
            UxUrl = "/normalmaps";

            ReferencePropertyNames = new List<string> { "ProjectId", "Model3dId", "CameraId" };
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
            var normalMap = base.ConstructValidModel() as Dto.NormalMap;

            normalMap.Name = "testnormalmap.sdb";
            normalMap.Width  = 512;
            normalMap.Height = 512;
            normalMap.Format = Domain.NormalMapFormat.NMAP;

            return normalMap;
        }
    }
}

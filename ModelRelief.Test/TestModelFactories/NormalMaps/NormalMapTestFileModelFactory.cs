// -----------------------------------------------------------------------
// <copyright file="NormalMapTestFileModelFactory.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.NormalMaps
{
    using System.Collections.Generic;
    using ModelRelief.Domain;
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

            BackingFile = "normalmap.nmap";
            PreviewFile = "normalmapPreview.png";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override IModel ConstructValidModel()
        {
            var normalMap = base.ConstructValidModel() as Dto.NormalMap;

            normalMap.Name   = BackingFile;
            normalMap.Width  = Defaults.Resolution.Image;
            normalMap.Height = Defaults.Resolution.Image;
            normalMap.Format = Domain.NormalMapFormat.NMAP;

            return normalMap;
        }
    }
}

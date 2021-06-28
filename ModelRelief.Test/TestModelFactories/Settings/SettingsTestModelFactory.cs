// -----------------------------------------------------------------------
// <copyright file="SettingsTestModelFactory.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Settings
{
    using System.Collections.Generic;
    using ModelRelief.Dto;

    /// <summary>
    /// Settings test model.
    /// </summary>
    public class SettingsTestModelFactory : TestModelFactory<Domain.Settings, Dto.Settings>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsTestModelFactory"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public SettingsTestModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = $"{RootApi}settings";
            UxUrl = "/settings";

            ReferencePropertyNames = new List<string>();
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = null;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override IModel ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();
            validModel.Name = "TestSettings";

            return validModel;
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="ProjectTestModelFactory.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Projects
{
    using System.Collections.Generic;
    using ModelRelief.Dto;

    /// <summary>
    /// Project test model.
    /// </summary>
    public class ProjectTestModelFactory : TestModelFactory<Domain.Project, Dto.Project>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProjectTestModelFactory"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public ProjectTestModelFactory(ClassFixture classFixture)
            : base(classFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = $"{RootApi}projects";
            UxUrl = "/projects";

            ReferencePropertyNames = new List<string> { "SettingsId" };
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
            validModel.Name = "TestProject";

            return validModel;
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="ProjectTestModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.Projects
{
    using System.Collections.Generic;
    using System.Linq;
    using ModelRelief.Api.V1.Shared.Rest;

    /// <summary>
    /// Project test model.
    /// </summary>
    public class ProjectTestModelFactory : TestModelFactory<Domain.Project, Dto.Project>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProjectTestModelFactory"/> class.
        /// Constructor
        /// </summary>
        public ProjectTestModelFactory()
            : base()
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/projects";
            UxUrl  = "/projects";

            IdRange = Enumerable.Range(1, 3);
            FirstModelName = "ModelRelief";

            ReferencePropertyNames = new List<string>();
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = null;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override ITGetModel ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();

            return validModel;
        }
    }
}

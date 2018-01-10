// -----------------------------------------------------------------------
// <copyright file="MeshTransformTestModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels.MeshTransforms
{
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// MeshTransform test model.
    /// </summary>
    public class MeshTransformTestModel : TestModel<Domain.MeshTransform, Dto.MeshTransform>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransformTestModel"/> class.
        /// Constructor
        /// </summary>
        public MeshTransformTestModel()
            : base()
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/meshtransforms";
            UxUrl  = "/meshtransforms";

            IdRange = Enumerable.Range(1, 2);
            FirstModelName = "Identity";

            ReferencePropertyNames = new List<string> { "ProjectId" };
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = null;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override Dto.MeshTransform ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();

            return validModel;
        }
    }
}
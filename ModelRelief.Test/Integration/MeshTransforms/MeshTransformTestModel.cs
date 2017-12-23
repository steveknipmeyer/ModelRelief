// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using FluentAssertions;
using ModelRelief.Api.V1.Shared.Rest;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Integration.MeshTransforms
{
    /// <summary>
    /// MeshTransform test model.
    /// </summary>
    public class MeshTransformTestModel : TestModel<Domain.MeshTransform, Dto.MeshTransform>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public MeshTransformTestModel() :
            base ()
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

            ReferencePropertyNames = new List<string> {"ProjectId"};
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
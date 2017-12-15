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

#if true
namespace ModelRelief.Test.Integration.Meshes
{
    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshesIntegrationTests : BaseIntegrationTests<Dto.Mesh>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public MeshesIntegrationTests(ServerFixture serverFixture) :
            base (serverFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/meshes";
            UxUrl  = "/meshes";
            
            IdRange = Enumerable.Range(1, 3);
            FirstModelName = "Lucy";

            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override Dto.Mesh ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();
            validModel.Format = Domain.MeshFormat.OBJ;

            return validModel;
        }

        /// <summary>
        /// Sets a valid reference property.
        /// </summary>
        /// <param name="model">Model to update.</param>
        /// <returns>Model with valid reference property.</returns>
        public override Dto.Mesh  SetValidReferenceProperty(Dto.Mesh model)
        {
            model.ProjectId = ValidReferenceProperty;

            return model;
        }

        /// <summary>
        /// Sets an invalid reference property.
        /// </summary>
        /// <param name="model">Model to update.</param>
        /// <returns>Model with invalid reference property.</returns>
        public override Dto.Mesh  SetInvalidReferenceProperty(Dto.Mesh model)
        {
            model.ProjectId = InvalidReferenceProperty;

            return model;
        }

#region Get
#endregion

#region Post
#endregion

#region Put
#endregion

#region Delete
#endregion
    }
}
#endif
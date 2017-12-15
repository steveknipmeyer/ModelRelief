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
    public class ModelsIntegrationTests : BaseIntegrationTests<Dto.Model3d>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public ModelsIntegrationTests(ServerFixture serverFixture) :
            base (serverFixture)
        {
        }

        /// <summary>
        /// Initialize the model-specific settings such as the API endpoints.
        /// </summary>
        public override void Initialize()
        {
            ApiUrl = "/api/v1/models";
            UxUrl  = "/models";
            
            IdRange = Enumerable.Range(1, 5);
            FirstModelName = "lucy";

            ReferencePropertyNames = new List<string> {"ProjectId", "CameraId"};
            InvalidReferenceProperty = 0;
            ValidReferenceProperty   = 1;

            EnumPropertyName = "Format";
        }

        /// <summary>
        /// Constructs a valid model.
        /// </summary>
        /// <returns>Valid model.</returns>
        public override Dto.Model3d ConstructValidModel()
        {
            var validModel = base.ConstructValidModel();
            validModel.Format = Domain.Model3dFormat.OBJ;

            return validModel;
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
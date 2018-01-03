// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using ModelRelief.Test.TestModels.Meshes;

namespace ModelRelief.Test.Integration.Meshes
{
    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshesBaseIntegrationTests : BaseIntegrationTests<Domain.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public MeshesBaseIntegrationTests(ClassFixture classFixture) :
            base (classFixture, new MeshTestModel())
        {
        }

#region Get
#endregion

#region Post
#endregion

#region Put
#endregion

#region Patch
#endregion

#region Delete
#endregion
    }
}

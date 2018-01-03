// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using ModelRelief.Test.TestModels.Meshes;

namespace ModelRelief.Test.Integration.Meshes
{
    /// <summary>
    /// DepthBuffer integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshesFileIntegrationTests : FileIntegrationTests<Domain.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public MeshesFileIntegrationTests(ClassFixture classFixture) :
            base (classFixture, new MeshTestModel())
        {
        }
    }
}

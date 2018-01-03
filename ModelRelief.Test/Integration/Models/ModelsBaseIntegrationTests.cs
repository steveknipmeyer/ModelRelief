// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using ModelRelief.Test.TestModels.Models;

namespace ModelRelief.Test.Integration.Models
{
    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class ModelsBaseIntegrationTests : BaseIntegrationTests<Domain.Model3d, Dto.Model3d>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public ModelsBaseIntegrationTests(ClassFixture classFixture) :
            base (classFixture, new Model3dTestModel())
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

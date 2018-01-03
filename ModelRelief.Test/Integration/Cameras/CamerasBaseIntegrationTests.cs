// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using ModelRelief.Test.TestModels.Cameras;

namespace ModelRelief.Test.Integration.Cameras
{
    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class CamerasBaseIntegrationTests : BaseIntegrationTests<Domain.Camera, Dto.Camera>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public CamerasBaseIntegrationTests(ClassFixture classFixture) :
            base (classFixture, new CameraTestModel())
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

// -----------------------------------------------------------------------
// <copyright file="CamerasBaseIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Cameras
{
    using ModelRelief.Test.TestModels.Cameras;

    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class CamerasBaseIntegrationTests : BaseIntegrationTests<Domain.Camera, Dto.Camera>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CamerasBaseIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public CamerasBaseIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new CameraTestModel())
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

// -----------------------------------------------------------------------
// <copyright file="DepthBuffersFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.DepthBuffers
{
    using ModelRelief.Test.TestModels.DepthBuffers;

    /// <summary>
    /// DepthBuffer integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class DepthBuffersFileIntegrationTests : FileIntegrationTests<Domain.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBuffersFileIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public DepthBuffersFileIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new DepthBufferTestModel())
        {
        }
    }
}

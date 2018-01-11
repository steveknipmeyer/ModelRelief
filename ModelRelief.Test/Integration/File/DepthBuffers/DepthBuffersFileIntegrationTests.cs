// -----------------------------------------------------------------------
// <copyright file="DepthBuffersFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.DepthBuffers
{
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Test.TestModels.Cameras;
    using ModelRelief.Test.TestModels.DepthBuffers;
    using ModelRelief.Test.TestModels.Models;
    using Xunit;

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
            : base(classFixture, new DepthBufferTestFileModelFactory())
        {
        }

        #region FileOperation
        private async Task ConstructDepthBufferWithDependencies()
        {
            var model3dFactory = new Model3dTestFileModelFactory();
            var model3d = await model3dFactory.PostNewModel(ClassFixture);
            await model3dFactory.PostNewFile(ClassFixture, model3d.Id, "UnitCube.obj");

            var cameraFactory = new CameraTestModelFactory();
            var camera = await cameraFactory.PostNewModel(ClassFixture);

            var depthBufferFactory = new DepthBufferTestFileModelFactory();
            var depthBuffer = depthBufferFactory.ConstructValidModel();
            depthBuffer.ModelId  = model3d.Id;
            depthBuffer.CameraId = camera.Id;
            await depthBufferFactory.PostNewModel(ClassFixture, depthBuffer);
            await model3dFactory.PostNewFile(ClassFixture, depthBuffer.Id, "UnitCube.obj");

            // connect dependencies

            await Task.CompletedTask;
        }

        /// <summary>
        /// Tests whether a DepthBuffer generated file is invalidated after a change to the dependent Camera metadata.
        /// </summary>
        [Fact]
        [Trait("Category", "Api FileRequest")]
        public virtual async Task FileRequest_DepthBufferIsInvalidatedAfterCameraDependencyPropertyChange()
        {
            // Arrange

            // Act

            // Assert

            // Rollback

            await Task.CompletedTask;
        }
        #endregion

    }
}

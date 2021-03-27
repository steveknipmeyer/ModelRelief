// -----------------------------------------------------------------------
// <copyright file="DepthBuffersFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.DepthBuffers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Test.TestModels;
    using ModelRelief.Test.TestModels.Cameras;
    using ModelRelief.Test.TestModels.DepthBuffers;
    using Xunit;

    /// <summary>
    /// DepthBuffer file integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class DepthBuffersFileIntegrationTests : FileIntegrationTests<Domain.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Represents a graph of a DepthBuffer and its dependencies.
        /// </summary>
        public class DepthBufferDependencyGraph : DependencyGraph
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="DepthBufferDependencyGraph"/> class.
            /// </summary>
            /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
            /// <param name="factories">List of test model factories.</param>
            public DepthBufferDependencyGraph(ClassFixture classFixture, List<ITestModelFactory> factories)
                : base(classFixture, factories)
            {
            }

            /// <summary>
            /// Constructs the graph of a DepthBuffer and its dependencies.
            /// </summary>
            public override async Task ConstructGraph()
            {
                // Camera
                var cameraNode = NodeCollection[typeof(Domain.Camera)];
                await cameraNode.FromExistingModel("lucy.MeshTransform");

                // DepthBuffer
                var depthBufferNode = NodeCollection[typeof(Domain.DepthBuffer)];
                await depthBufferNode.FromExistingModel("lucy.sdb");
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBuffersFileIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public DepthBuffersFileIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new DepthBufferTestFileModelFactory(classFixture))
        {
        }

        /// <summary>
        /// Constructs a DepthBuffer and its dependent models.
        /// </summary>
        private async Task<DependencyGraph> InitializeDependencyGraph()
        {
            var dependencyGraph = new DepthBufferDependencyGraph(ClassFixture, new List<ITestModelFactory>
            {
                // N.B. In order of dependencies.
                // DependencyGraph.Rollback must restore dependents last to avoid triggering unwanted file operations.

                new CameraTestModelFactory(ClassFixture),
                new DepthBufferTestFileModelFactory(ClassFixture),
            });
            await dependencyGraph.ConstructGraph();

            return dependencyGraph;
        }

        #region FileOperation
        /// <summary>
        /// Tests whether a DepthBuffer generated file is invalidated after a change to the dependent Camera metadata.
        /// </summary>
        [Fact]
        [Trait("Category", "Api FileRequest")]
        public async Task FileRequest_DepthBufferIsInvalidatedAfterCameraDependencyPropertyChange()
        {
            // Arrange
            var dependencyGraph = await InitializeDependencyGraph();
            try
            {
                var depthBufferNode    = dependencyGraph.NodeCollection[typeof(Domain.DepthBuffer)];
                var depthBufferModel   = depthBufferNode.Model as Dto.DepthBuffer;
                var depthBufferFactory = depthBufferNode.Factory as ITestFileModelFactory;
                depthBufferModel       = await depthBufferFactory.FindModel(depthBufferModel.Id) as Dto.DepthBuffer;
                depthBufferModel.FileIsSynchronized.Should().Be(true);

                // Act
                var cameraNode    = dependencyGraph.NodeCollection[typeof(Domain.Camera)];
                var cameraModel   = cameraNode.Model as Dto.Camera;
                var cameraFactory = cameraNode.Factory;
                cameraModel       = await cameraFactory.FindModel(cameraModel.Id) as Dto.Camera;
                cameraModel.PositionX += 1.0;
                await cameraFactory.PutModel(cameraModel);

                // Assert
                depthBufferModel = await depthBufferFactory.FindModel(depthBufferModel.Id) as Dto.DepthBuffer;
                depthBufferModel.FileIsSynchronized.Should().Be(false);
            }
            finally
            {
                // Rollback
                await dependencyGraph.Rollback();
            }
        }
        #endregion
    }
}

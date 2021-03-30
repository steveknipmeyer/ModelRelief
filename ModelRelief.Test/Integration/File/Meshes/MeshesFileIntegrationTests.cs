// -----------------------------------------------------------------------
// <copyright file="MeshesFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Meshes
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Test.TestModels;
    using ModelRelief.Test.TestModels.Cameras;
    using ModelRelief.Test.TestModels.DepthBuffers;
    using ModelRelief.Test.TestModels.Meshes;
    using ModelRelief.Test.TestModels.MeshTransforms;
    using ModelRelief.Utility;
    using Xunit;

    /// <summary>
    /// Mesh file integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshesFileIntegrationTests : FileIntegrationTests<Domain.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Represents a graph of a Mesh and its dependencies.
        /// </summary>
        public class MeshDependencyGraph : DependencyGraph
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="MeshDependencyGraph"/> class.
            /// </summary>
            /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
            /// <param name="factories">List of test model factories.</param>
            public MeshDependencyGraph(ClassFixture classFixture, List<ITestModelFactory> factories)
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

                // MeshTransform
                var meshTransformNode = NodeCollection[typeof(Domain.MeshTransform)];
                await meshTransformNode.FromExistingModel("lucy");

                // DepthBuffer
                var depthBufferNode = NodeCollection[typeof(Domain.DepthBuffer)];
                await depthBufferNode.FromExistingModel("lucy.sdb");

                // Mesh
                var meshNode = NodeCollection[typeof(Domain.Mesh)];
                await meshNode.FromExistingModel("lucy.sfp");
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MeshesFileIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public MeshesFileIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new MeshTestFileModelFactory(classFixture))
        {
        }

        /// <summary>
        /// Constructs a Mesh and its dependent models.
        /// </summary>
        private async Task<DependencyGraph> InitializeDependencyGraph()
        {
            var dependencyGraph = new MeshDependencyGraph(ClassFixture, new List<ITestModelFactory>
            {
                // N.B. In order of dependencies.
                // DependencyGraph.Rollback must restore dependents last to avoid triggering unwanted file operations.

                new CameraTestModelFactory(ClassFixture),
                new MeshTransformTestModelFactory(ClassFixture),
                new DepthBufferTestFileModelFactory(ClassFixture),
                new MeshTestFileModelFactory(ClassFixture),
            });
            await dependencyGraph.ConstructGraph();

            return dependencyGraph;
        }

        /// <summary>
        /// Initializes the Mesh to the baseline FileIsSynchronized state.
        /// </summary>
        /// <param name="dependencyGraph">DependencyGraph</param>
        /// <param name="fileIsSynchronized">Initial state of FileIsSynchronized property.</param>
        /// <returns>Initialized Mesh.</returns>
        private async Task<Dto.Mesh> InitializeMesh(DependencyGraph dependencyGraph, bool fileIsSynchronized)
        {
            var meshNode = dependencyGraph.NodeCollection[typeof(Domain.Mesh)];
            var meshModel = meshNode.Model as Dto.Mesh;
            var meshFactory = meshNode.Factory;
            meshModel = await meshFactory.FindModel(meshModel.Id) as Dto.Mesh;
            meshModel.FileIsSynchronized.Should().Be(true);

            // reset FileIsSynchronized so GenerateFileRequest will fire on next FileIsSynchronized property change
            if (!fileIsSynchronized)
            {
                meshModel.FileIsSynchronized = false;
                meshModel = await TestModelFactory.PutModel(meshModel) as Dto.Mesh;
            }
            return meshModel;
        }

        #region FileOperation
        /// <summary>
        /// Tests whether a DepthBuffer generated file is invalidated after a change to the dependent Camera metadata.
        /// </summary>
        [Fact]
        [Trait("Category", "Api FileRequest")]
        public async Task FileRequest_MeshIsInvalidatedAfterDepthBufferFileBecomesUnsynchronized()
        {
            var dependencyGraph = await InitializeDependencyGraph();
            try
            {
                // Arrange
                Dto.Mesh meshModel = await InitializeMesh(dependencyGraph, fileIsSynchronized: true);

                // Act
                // This ensures that the FileTimeStamp will change on the DepthBuffer and therefore trigger the DependencyManager to invalidate the Mesh.
                Files.SleepForTimeStamp();

                var depthBufferNode     = dependencyGraph.NodeCollection[typeof(Domain.DepthBuffer)];
                var depthBufferModel    = depthBufferNode.Model as Dto.DepthBuffer;
                var depthBufferFactory  = depthBufferNode.Factory as ITestFileModelFactory;
                await depthBufferFactory.PostNewFile(depthBufferModel.Id, TestFileModelFactory.BackingFile);

                // Assert
                meshModel = await TestModelFactory.FindModel(meshModel.Id) as Dto.Mesh;
                meshModel.FileIsSynchronized.Should().Be(false);
            }
            finally
            {
                // Rollback
                await dependencyGraph.Rollback();
            }
        }

        /// <summary>
        /// Verifies that a GenerateFileRequest sets FileIsSynchronized.
        /// </summary>
        [Fact]
        [Trait("Category", "Api FileRequest")]
        public async Task FileRequest_MeshGenerateSetsFileIsSynchronized()
        {
            var dependencyGraph = await InitializeDependencyGraph();
            try
            {
                // Arrange
                Dto.Mesh meshModel = await InitializeMesh(dependencyGraph, fileIsSynchronized: false);

                // Act
                // GenerateFile is triggered by the state change of FileIsSynchronized.
                meshModel.FileIsSynchronized = true;
                meshModel = await TestModelFactory.PutModel(meshModel) as Dto.Mesh;

                // Assert
                meshModel.FileIsSynchronized.Should().BeTrue();
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

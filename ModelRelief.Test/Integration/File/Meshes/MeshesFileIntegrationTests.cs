// -----------------------------------------------------------------------
// <copyright file="MeshesFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Meshes
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Threading;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Test.TestModels;
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
                // DepthBuffer
                var depthBufferNode    = NodeCollection[typeof(Domain.DepthBuffer)];
                var depthBufferFactory = depthBufferNode.Factory as ITestFileModelFactory;
                depthBufferNode.Model  = await depthBufferFactory.PostNewModel(ClassFixture);
                depthBufferNode.Model  = await depthBufferFactory.PostNewFile(ClassFixture, depthBufferNode.Model.Id, "UnitCube.obj");

                // MeshTransform
                var meshTransformNode    = NodeCollection[typeof(Domain.MeshTransform)];
                var meshTransformFactory = meshTransformNode.Factory as ITestModelFactory;
                meshTransformNode.Model  = await meshTransformFactory.PostNewModel(ClassFixture);

                // Mesh
                var meshNode    = NodeCollection[typeof(Domain.Mesh)];
                var meshFactory = meshNode.Factory as ITestFileModelFactory;
                meshNode.Model  = meshFactory.ConstructValidModel();

                var mesh             = meshNode.Model as Dto.Mesh;
                mesh.DepthBufferId   = depthBufferNode.Model.Id;
                mesh.MeshTransformId = meshTransformNode.Model.Id;
                meshNode.Model       = await meshFactory.PostNewModel(ClassFixture, mesh);
                meshNode.Model       = await meshFactory.PostNewFile(ClassFixture, meshNode.Model.Id, "UnitCube.obj");
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MeshesFileIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public MeshesFileIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new MeshTestFileModelFactory())
        {
        }

        /// <summary>
        /// Constructs a Mesh and its dependent models.
        /// </summary>
        /// <returns></returns>
        private async Task<DependencyGraph> InitializeDependencyGraph()
        {
            var dependencyGraph = new MeshDependencyGraph(ClassFixture, new List<ITestModelFactory>
            {
                new MeshTestFileModelFactory(),
                new DepthBufferTestFileModelFactory(),
                new MeshTransformTestModelFactory(),
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
        public async Task FileRequest_MeshIsInvalidatedAfterDepthBufferFileBecomesUnsynchronized()
        {
            // Arrange
            var dependencyGraph = await InitializeDependencyGraph();
            try
            {
                var meshNode    = dependencyGraph.NodeCollection[typeof(Domain.Mesh)];
                var meshModel   = meshNode.Model as Dto.Mesh;
                var meshFactory = meshNode.Factory;
                meshModel       = await meshFactory.FindModel(ClassFixture, meshModel.Id) as Dto.Mesh;
                meshModel.FileIsSynchronized.Should().Be(true);

                // Act

                Files.SleepForTimeStamp();

                var depthBufferNode    = dependencyGraph.NodeCollection[typeof(Domain.DepthBuffer)];
                var depthBufferModel   = depthBufferNode.Model as Dto.DepthBuffer;
                var depthBufferFactory = depthBufferNode.Factory as ITestFileModelFactory;
                await depthBufferFactory.PostNewFile(ClassFixture, depthBufferModel.Id, "ModelRelief.txt");

                // Assert
                meshModel = await meshFactory.FindModel(ClassFixture, meshModel.Id) as Dto.Mesh;
                meshModel.FileIsSynchronized.Should().Be(false);
            }
            finally
            {
                // Rollback
                await dependencyGraph.Rollback();
            }
        }

        /// <summary>
        /// Verifies that a FileRequestGenerate updates sets FileIsSynchronized.
        /// </summary>
        [Fact]
        [Trait("Category", "Api FileRequest")]
        public async Task FileRequest_GenerateSetsFileIsSynchronized()
        {
            // Arrange
            var newModel = await PostNewModel();
            var modelAfterPost = await PostNewFile(newModel.Id, "UnitCube.obj");

            // reset FileIsSynchronized so FileRequestGenerate will fire on next FileIsSynchronized property changes
            (modelAfterPost as IGeneratedFile).FileIsSynchronized = false;
            modelAfterPost = await TestModelFactory.PutModel(ClassFixture, modelAfterPost);

            Files.SleepForTimeStamp();

            // Act
            (modelAfterPost as IGeneratedFile).FileIsSynchronized = true;
            modelAfterPost = await TestModelFactory.PutModel(ClassFixture, modelAfterPost);

            // Assert
            (modelAfterPost as IGeneratedFile).FileIsSynchronized.Should().BeTrue();

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion
    }
}

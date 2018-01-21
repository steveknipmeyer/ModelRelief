// -----------------------------------------------------------------------
// <copyright file="MeshesFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Meshes
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Test.TestModels;
    using ModelRelief.Test.TestModels.DepthBuffers;
    using ModelRelief.Test.TestModels.Meshes;
    using ModelRelief.Test.TestModels.MeshTransforms;
    using ModelRelief.Utility;
    using Newtonsoft.Json;
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
                var depthBufferNode = NodeCollection[typeof(Domain.DepthBuffer)];
                var depthBufferFactory = depthBufferNode.Factory as ITestFileModelFactory;
                depthBufferNode.Model = await depthBufferFactory.PostNewModel(ClassFixture);
                depthBufferNode.Model = await depthBufferFactory.PostNewFile(ClassFixture, depthBufferNode.Model.Id, "DepthBuffer.raw");

                // MeshTransform
                var meshTransformNode = NodeCollection[typeof(Domain.MeshTransform)];
                var meshTransformFactory = meshTransformNode.Factory as ITestModelFactory;
                meshTransformNode.Model = await meshTransformFactory.PostNewModel(ClassFixture);

                // Mesh
                var meshNode = NodeCollection[typeof(Domain.Mesh)];
                var meshFactory = meshNode.Factory as ITestFileModelFactory;
                meshNode.Model = meshFactory.ConstructValidModel();

                var mesh = meshNode.Model as Dto.Mesh;
                mesh.DepthBufferId = depthBufferNode.Model.Id;
                mesh.MeshTransformId = meshTransformNode.Model.Id;
                meshNode.Model = await meshFactory.PostNewModel(ClassFixture, mesh);
                meshNode.Model = await meshFactory.PostNewFile(ClassFixture, meshNode.Model.Id, "DepthBuffer.raw");
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
            meshModel = await meshFactory.FindModel(ClassFixture, meshModel.Id) as Dto.Mesh;
            meshModel.FileIsSynchronized.Should().Be(true);

            // reset FileIsSynchronized so GenerateFileRequest will fire on next FileIsSynchronized property changes
            if (!fileIsSynchronized)
            {
                meshModel.FileIsSynchronized = false;
                meshModel = await TestModelFactory.PutModel(ClassFixture, meshModel) as Dto.Mesh;
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
                await depthBufferFactory.PostNewFile(ClassFixture, depthBufferModel.Id, "ModelRelief.txt");

                // Assert
                meshModel = await TestModelFactory.FindModel(ClassFixture, meshModel.Id) as Dto.Mesh;
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
                meshModel = await TestModelFactory.PutModel(ClassFixture, meshModel) as Dto.Mesh;

                // Assert
                meshModel.FileIsSynchronized.Should().BeTrue();
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
        public async Task FileRequest_MeshGenerateScalesDepthBufferByLambdaLinearScaling()
        {
            var dependencyGraph = await InitializeDependencyGraph();
            try
            {
                // Arrange
                Dto.Mesh meshModel = await InitializeMesh(dependencyGraph, fileIsSynchronized: false);

                // set MeshTransform scale factor
                var meshTransformNode = dependencyGraph.NodeCollection[typeof(Domain.MeshTransform)];
                var meshTransformModel = meshTransformNode.Model as Dto.MeshTransform;
                var meshTransformFactory = meshTransformNode.Factory as ITestModelFactory;

                var scaleFactor = 5.0;
                meshTransformModel.LambdaLinearScaling = scaleFactor;
                meshTransformModel = await meshTransformFactory.PutModel(ClassFixture, meshTransformModel) as Dto.MeshTransform;

                var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{meshModel.Id}/file");
                var fileContentResult = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(requestResponse.ContentString);
                var encodedString = fileContentResult.GetValue("fileContents");
                var initialByteArray = Convert.FromBase64String(encodedString.ToString());

                // Act
                // GenerateFile is triggered by the state change of FileIsSynchronized.
                meshModel.FileIsSynchronized = true;
                meshModel = await TestModelFactory.PutModel(ClassFixture, meshModel) as Dto.Mesh;

                // Assert
                requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{meshModel.Id}/file");
                fileContentResult = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(requestResponse.ContentString);
                encodedString = fileContentResult.GetValue("fileContents");
                var scaledByteArray = Convert.FromBase64String(encodedString.ToString());

                int decimalPlaces = 5;
                var initialFloat = BitConverter.ToSingle(initialByteArray, 0);
                var scaledFloat  = BitConverter.ToSingle(scaledByteArray, 0);
                Assert.Equal(initialFloat * scaleFactor, scaledFloat, decimalPlaces);
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

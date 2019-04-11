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
    using ModelRelief.Test.TestModels.Cameras;
    using ModelRelief.Test.TestModels.DepthBuffers;
    using ModelRelief.Test.TestModels.Meshes;
    using ModelRelief.Test.TestModels.MeshTransforms;
    using ModelRelief.Test.TestModels.NormalMaps;
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
                // Camera
                var cameraNode = NodeCollection[typeof(Domain.Camera)];
                var cameraFactory = cameraNode.Factory as ITestModelFactory;
                cameraNode.Model = cameraFactory.ConstructValidModel();

                var camera = cameraNode.Model as Dto.Camera;
                cameraNode.Model = await cameraFactory.PostNewModel(camera);

                // DepthBuffer
                var depthBufferNode = NodeCollection[typeof(Domain.DepthBuffer)];
                var depthBufferFactory = depthBufferNode.Factory as ITestFileModelFactory;
                depthBufferNode.Model = depthBufferFactory.ConstructValidModel();

                var depthBuffer = depthBufferNode.Model as Dto.DepthBuffer;
                depthBuffer.CameraId = cameraNode.Model.Id;
                depthBufferNode.Model = await depthBufferFactory.PostNewModel(depthBuffer);
                depthBufferNode.Model = await depthBufferFactory.PostNewFile(depthBufferNode.Model.Id, "depthbuffer.sdb");

                // NormalMap
                var normalMapNode = NodeCollection[typeof(Domain.NormalMap)];
                var normalMapFactory = normalMapNode.Factory as ITestFileModelFactory;
                normalMapNode.Model = normalMapFactory.ConstructValidModel();

                var normalMap = normalMapNode.Model as Dto.NormalMap;
                normalMap.CameraId = cameraNode.Model.Id;
                normalMapNode.Model = await normalMapFactory.PostNewModel(normalMap);
                normalMapNode.Model = await normalMapFactory.PostNewFile(normalMapNode.Model.Id, "normalmap.nmap");

                // MeshTransform
                var meshTransformNode = NodeCollection[typeof(Domain.MeshTransform)];
                var meshTransformFactory = meshTransformNode.Factory as ITestModelFactory;
                meshTransformNode.Model = await meshTransformFactory.PostNewModel();

                // Mesh
                var meshNode = NodeCollection[typeof(Domain.Mesh)];
                var meshFactory = meshNode.Factory as ITestFileModelFactory;
                meshNode.Model = meshFactory.ConstructValidModel();

                var mesh = meshNode.Model as Dto.Mesh;
                mesh.DepthBufferId = depthBufferNode.Model.Id;
                mesh.NormalMapId   = normalMapNode.Model.Id;
                mesh.MeshTransformId = meshTransformNode.Model.Id;
                meshNode.Model = await meshFactory.PostNewModel(mesh);
                meshNode.Model = await meshFactory.PostNewFile(meshNode.Model.Id, "mesh.sfp");
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
        /// <returns></returns>
        private async Task<DependencyGraph> InitializeDependencyGraph()
        {
            var dependencyGraph = new MeshDependencyGraph(ClassFixture, new List<ITestModelFactory>
            {
                new MeshTestFileModelFactory(ClassFixture),
                new DepthBufferTestFileModelFactory(ClassFixture),
                new NormalMapTestFileModelFactory(ClassFixture),
                new MeshTransformTestModelFactory(ClassFixture),
                new CameraTestModelFactory(ClassFixture),
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
                await depthBufferFactory.PostNewFile(depthBufferModel.Id, "ModelRelief.txt");

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
        // WIP: This test has been deprecated since the Solver now returns the fully transformed mesh instead of only scaling the depth buffer values.
        // New tests need to be created that directly test the contents of the transformed mesh.
        #if false
        /// <summary>
        /// Verifies that a GenerateFileRequest sets FileIsSynchronized.
        /// </summary>
        [Fact]
        [Trait("Category", "Api FileRequest")]
        public async Task FileRequest_MeshGenerateScalesDepthBufferByP1Scale()
        {
            var dependencyGraph = await InitializeDependencyGraph();
            try
            {
                // Arrange
                Dto.Mesh meshModel = await InitializeMesh(dependencyGraph, fileIsSynchronized: false);

                // set MeshTransform scale factor
                var meshTransformNode    = dependencyGraph.NodeCollection[typeof(Domain.MeshTransform)];
                var meshTransformModel   = meshTransformNode.Model as Dto.MeshTransform;
                var meshTransformFactory = meshTransformNode.Factory as ITestModelFactory;

                var scaleFactor = 0.5;
                meshTransformModel.P1 = scaleFactor;
                meshTransformModel = await meshTransformFactory.PutModel(ClassFixture, meshTransformModel) as Dto.MeshTransform;

                // Act
                // GenerateFile is triggered by the state change of FileIsSynchronized.
                meshModel.FileIsSynchronized = true;
                meshModel = await TestModelFactory.PutModel(ClassFixture, meshModel) as Dto.Mesh;

                // Assert
                var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequest(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{meshModel.Id}/file");
                var fileContentResult = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(requestResponse.ContentString);
                var encodedString = fileContentResult.GetValue("fileContents");
                var scaledByteArray = Convert.FromBase64String(encodedString.ToString());

                // compare to reference
                var referenceScaledFloats = Utility.FloatListFromFile("depthbuffer.sdb.Scale05");

                int numberFloats = referenceScaledFloats.Count;
                for (int iFloat = 0; iFloat < numberFloats; iFloat++)
                {
                    int floatIndex = iFloat * 4;
                    var scaledFloat          = BitConverter.ToDouble(scaledByteArray, floatIndex);
                    var referenceScaledFloat = referenceScaledFloats[floatIndex];

                    double tolerance = 1.0E-5;
                    bool equalValues = Math.Abs(scaledFloat - referenceScaledFloat) <= tolerance;
                    if (!equalValues)
                        Assert.True(false);
                }
            }
            finally
            {
                // Rollback
                await dependencyGraph.Rollback();
            }
        }
        #endif
        #endregion
    }
}

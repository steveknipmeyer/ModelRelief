// -----------------------------------------------------------------------
// <copyright file="NormalMapsFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.NormalMaps
{
    using System.Collections.Generic;
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Domain;
    using ModelRelief.Test.TestModels;
    using ModelRelief.Test.TestModels.Cameras;
    using ModelRelief.Test.TestModels.Models;
    using ModelRelief.Test.TestModels.NormalMaps;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// NormalMap file integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class NormalMapsFileIntegrationTests : FileIntegrationTests<Domain.NormalMap, Dto.NormalMap>
    {
        /// <summary>
        /// Represents a graph of a NormalMap and its dependencies.
        /// </summary>
        public class NormalMapDependencyGraph : DependencyGraph
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="NormalMapDependencyGraph"/> class.
            /// </summary>
            /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
            /// <param name="factories">List of test model factories.</param>
            public NormalMapDependencyGraph(ClassFixture classFixture, List<ITestModelFactory> factories)
                : base(classFixture, factories)
            {
            }

            /// <summary>
            /// Constructs the graph of a NormalMap and its dependencies.
            /// </summary>
            public override async Task ConstructGraph()
            {
                // Model
                var modelNode      = NodeCollection[typeof(Domain.Model3d)];
                var model3dFactory = modelNode.Factory as ITestFileModelFactory;
                modelNode.Model    = await model3dFactory.PostNewModel();
                modelNode.Model    = await model3dFactory.PostNewFile(modelNode.Model.Id, "UnitCube.obj");

                // Camera
                var cameraNode    = NodeCollection[typeof(Domain.Camera)];
                var cameraFactory = cameraNode.Factory as ITestModelFactory;
                cameraNode.Model  = await cameraFactory.PostNewModel();

                // NormalMap
                var normalMapNode    = NodeCollection[typeof(Domain.NormalMap)];
                var normalMapFactory = normalMapNode.Factory as ITestFileModelFactory;
                normalMapNode.Model  = normalMapFactory.ConstructValidModel();

                var normalMap       = normalMapNode.Model as Dto.NormalMap;
                normalMap.Model3dId = modelNode.Model.Id;
                normalMap.CameraId  = cameraNode.Model.Id;
                normalMapNode.Model = await normalMapFactory.PostNewModel(normalMap);
                normalMapNode.Model = await normalMapFactory.PostNewFile(normalMapNode.Model.Id, "NormalMap.sdb");
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapsFileIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public NormalMapsFileIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new NormalMapTestFileModelFactory(classFixture))
        {
        }

        /// <summary>
        /// Constructs a NormalMap and its dependent models.
        /// </summary>
        /// <returns></returns>
        private async Task<DependencyGraph> InitializeDependencyGraph()
        {
            var dependencyGraph = new NormalMapDependencyGraph(ClassFixture, new List<ITestModelFactory>
            {
                new NormalMapTestFileModelFactory(ClassFixture),
                new Model3dTestFileModelFactory(ClassFixture),
                new CameraTestModelFactory(ClassFixture),
            });
            await dependencyGraph.ConstructGraph();

            return dependencyGraph;
        }

        #region FileOperation
        #endregion
    }
}

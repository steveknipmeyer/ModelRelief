// -----------------------------------------------------------------------
// <copyright file="NormalMapsFileIntegrationTests.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.NormalMaps
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ModelRelief.Test.TestModels;
    using ModelRelief.Test.TestModels.Cameras;
    using ModelRelief.Test.TestModels.NormalMaps;

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
                // Camera
                var cameraNode = NodeCollection[typeof(Domain.Camera)];
                await cameraNode.FromExistingModel("lucy.MeshTransform");

                // NormalMap
                var normalMapNode = NodeCollection[typeof(Domain.NormalMap)];
                await normalMapNode.FromExistingModel("lucy.nmap");
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
        private async Task<DependencyGraph> InitializeDependencyGraph()
        {
            var dependencyGraph = new NormalMapDependencyGraph(ClassFixture, new List<ITestModelFactory>
            {
                // N.B. In order of dependencies.
                // DependencyGraph.Rollback must restore dependents last to avoid triggering unwanted file operations.

                new CameraTestModelFactory(ClassFixture),
                new NormalMapTestFileModelFactory(ClassFixture),
            });
            await dependencyGraph.ConstructGraph();

            return dependencyGraph;
        }

        #region FileOperation
        #endregion
    }
}

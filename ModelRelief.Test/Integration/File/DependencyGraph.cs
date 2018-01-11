// -----------------------------------------------------------------------
// <copyright file="DependencyGraph.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Test.TestModels;

    /// <summary>
    /// Represents a graph of dependent models for integration testing.
    /// </summary>
    public class DependencyGraph
    {
        /// <summary>
        /// Represents a node in the dependency graph.
        /// A node is a model with a supporting factory for model operations.
        /// </summary>
        public class Node
        {
            public ITestModelFactory Factory { get; set; }
            public ITGetModel Model { get; set; }
        }

        /// <summary>
        /// Represents a collection of Nodes.
        /// </summary>
        public class GraphNodes
        {
            public List<Node> Nodes { get; }
            public Node this[Type type]
            {
                get => Nodes.Where(n => (n.Factory.Type == type)).SingleOrDefault();
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="GraphNodes"/> class.
            /// </summary>
            /// <param name="factories">List of test model factories.</param>
            public GraphNodes(List<ITestModelFactory> factories)
            {
                Nodes = new List<Node>();
                foreach (var factory in factories)
                {
                    Nodes.Add(new Node()
                    {
                        Factory = factory,
                        Model   = factory.ConstructValidModel(),
                    });
                }
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DependencyGraph"/> class.
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        /// <param name="factories">List of test model factories.</param>
        public DependencyGraph(ClassFixture classFixture, List<ITestModelFactory> factories)
        {
            ClassFixture = classFixture;
            Factories = factories;

            NodeCollection = new GraphNodes(factories);
        }

        public GraphNodes NodeCollection { get; set; }
        public ClassFixture ClassFixture { get; }
        public List<ITestModelFactory> Factories { get; }

        /// <summary>
        /// Constructs a graph of the dependencies.
        /// </summary>
        public virtual async Task ConstructGraph()
        {
            await Task.CompletedTask;
        }

        /// <summary>
        /// Rolls back the models created during use.
        /// </summary>
        public async virtual Task Rollback()
        {
            foreach (var node in NodeCollection.Nodes)
            {
                // model persisted?
                if (node.Model.Id != default)
                    await node.Factory.DeleteModel(ClassFixture, node.Model);
            }
        }
    }
}

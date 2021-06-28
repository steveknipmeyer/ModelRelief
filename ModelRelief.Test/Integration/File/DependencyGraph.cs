// -----------------------------------------------------------------------
// <copyright file="DependencyGraph.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Dto;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Test.TestModels;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a graph of dependent models for integration testing.
    /// </summary>
    public class DependencyGraph
    {
        /// <summary>
        /// Represents the baseline of a node in the dependency graph.
        /// Used for a rollback operation to restore state after a test.
        /// </summary>
        public class NodeBaseline
        {
            public IModel Model { get; set; }
            public byte[] File { get; set; }
        }

        /// <summary>
        /// Represents a node in the dependency graph.
        /// A node is a model with a supporting factory for model operations.
        /// </summary>
        public class Node : IComparable<Node>
        {
            public ITestModelFactory Factory { get; set; }
            public IModel Model { get; set; }
            public NodeBaseline Baseline { get; set; }

            /// <summary>
            /// Initializes a new instance of the <see cref="Node"/> class.
            /// </summary>
            public Node()
            {
                Baseline = new NodeBaseline();
            }
            /// <summary>
            /// Comparator to sort a collection of Nodes.
            /// Designed to place the dependent instances last in the collection so their rollback
            /// processing always follow their dependencies. Otherwise, processing the dependencies triggers
            /// changes in the dependent Node such as clearing FileIsSynchronized.
            /// </summary>
            /// <param name="other">The other Node to compare against.</param>
            public int CompareTo(Node other)
            {
                var thisDependencyTypes = DependencyManager.GetAllDependencyTypes(this.Factory.TEntityType);
                var otherDependencyTypes = DependencyManager.GetAllDependencyTypes(other.Factory.TEntityType);

                // this dependent on other
                if (thisDependencyTypes.Contains(other.Factory.TEntityType))
                    return 1;

                // other dependent on this
                if (otherDependencyTypes.Contains(this.Factory.TEntityType))
                    return -1;

                return 0;
            }

            /// <summary>
            /// Initializes a Node to an existing database instance/> class.
            /// </summary>
            /// <param name="name">Name of existing instance.</param>
            public async Task<IModel> FromExistingModel(string name)
            {
                var model = await Factory.FindModelByName(name);
                Model = model;

                // save baseline to support rollback
                var serialized = JsonConvert.SerializeObject(model);
                var objectCopy = JsonConvert.DeserializeObject(serialized, Factory.TGetModelType);
                Baseline.Model = objectCopy as IModel;

                if (Model is IFileModel)
                {
                    var requestResponse = await Factory.ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{Factory.ApiUrl}/{model.Id}/file");
                    Baseline.File = await requestResponse.GetBytesAsync();
                }

                return model;
            }
        }

        /// <summary>
        /// Represents a collection of Nodes.
        /// </summary>
        public class GraphNodes
        {
            public List<Node> Nodes { get; }
            public Node this[Type type]
            {
                get => Nodes.Where(n => (n.Factory.TEntityType == type)).SingleOrDefault();
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
                {
                    try
                    {
                        // restore backing file
                        if (node.Model is IFileModel)
                        {
                            if (node.Baseline.File != null)
                            {
                                var requestResponse = await node.Factory.ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Put, $"{node.Factory.ApiUrl}/{node.Model.Id}/file", node.Baseline.File, HttpMimeType.OctetStream);
                            }
                        }
                        // restore database model
                        var model = await node.Factory.PutModel(node.Baseline.Model);
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"DependencyGraph: Rollback: {ex.Message}");
                    }
                }
            }
        }
    }
}

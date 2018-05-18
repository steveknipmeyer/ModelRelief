// -----------------------------------------------------------------------
// <copyright file="DependencyManagerTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Unit.DependencyManager
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using FluentAssertions;
    using MediatR;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Domain;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;
    using Xunit;

    public class DependencyManagerTests : UnitTests
    {
        private DependencyManager Manager { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DependencyManagerTests"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated for a class before any test methods execute.</param>
        public DependencyManagerTests(ClassFixture classFixture)
            : base(classFixture)
        {
            ILogger<DependencyManager> logger = ClassFixture.ServiceProvider.GetRequiredService<ILogger<DependencyManager>>();
            IMediator mediator = ClassFixture.ServiceProvider.GetRequiredService<IMediator>();
            Manager = new DependencyManager(DbContext, logger, mediator);
        }

        /// <summary>
        /// Find the dependent models of a given model.
        /// </summary>
        /// <param name="rootType">Type of root.</param>
        /// <param name="rootPrimaryKey">Prinary key of root.</param>
        /// <returns></returns>
        private async Task<List<DomainModel>> FindDependentModels(Type rootType, int rootPrimaryKey)
        {
            var rootModel = DbContext.Models
                            .Where(m => (m.Id == rootPrimaryKey))
                            .FirstOrDefault();

            var dependentTypes  = DependencyManager.GetClassDependentFiles(rootType);
            var dependentModels = await Manager.FindDependentModels(Identity.MockUserId, rootType, rootPrimaryKey, dependentTypes);

            return dependentModels;
        }

        /// <summary>
        /// Verifies that the target model exists in the given list.
        /// </summary>
        /// <param name="modelList">List of models.</param>
        /// <param name="dependentType">Type of target model.</param>
        /// <param name="dependentName">Name of target model</param>
        private void AssertModelExists(List<DomainModel> modelList, Type dependentType, string dependentName)
        {
            var model = modelList
                                .Where(m => ((m.GetType() == dependentType) &&
                                             (m.Name == dependentName)))
                                .SingleOrDefault();
            model.Should().NotBeNull();
        }

        /// <summary>
        /// Assert a given class has the expected DependentFile classes.
        /// </summary>
        /// <param name="rootClass">Type of root class.</param>
        /// <param name="dependentClasses">List of dependent classes.</param>
        private void AssertClassHasExpectedDependentFiles(Type rootClass, params Type[] dependentClasses)
        {
            var dependentFiles = DependencyManager.GetClassDependentFiles(rootClass);
            dependentFiles.Count.Should().Be(dependentClasses.Count());

            foreach (var dependentFile in dependentFiles)
            {
                var dependentType = dependentFiles
                    .Where(f => (f.Name == dependentFile.Name))
                    .SingleOrDefault();
                dependentType.Should().NotBeNull();
            }
        }

        /// <summary>
        /// Finds all dependents of the Lucy Camera.
        /// </summary>
        [Fact]
        [Trait("Category", "DependencyManager")]
        public async Task LucyCameraFindsAllDependents()
        {
            // Arrange
            var lucyCameraPrimaryKey = 3;

            // Act
            var dependentModels = await FindDependentModels(typeof(Camera), lucyCameraPrimaryKey);

            // Assert
            dependentModels.Count.Should().Be(2);

            // TopCamera <= DepthBuffer("lucy.sdb") <= Mesh("lucy.sfp")
            AssertModelExists(dependentModels, typeof(Domain.DepthBuffer), "lucy.sdb");
            AssertModelExists(dependentModels, typeof(Domain.Mesh), "lucy.sfp");
        }

        /// <summary>
        /// Finds all dependents of the Armadillo DepthBuffer.
        /// </summary>
        [Fact]
        [Trait("Category", "DependencyManager")]
        public async Task LucyDepthBufferFindsOneDependent()
        {
            // Arrange
            var lucyDepthBufferPrimaryKey = 1;

            // Act
            var dependentModels = await FindDependentModels(typeof(DepthBuffer), lucyDepthBufferPrimaryKey);

            // Assert
            dependentModels.Count.Should().Be(1);

            // DepthBuffer("lucy.sdb") <= Mesh("lucy.sfp")
            AssertModelExists(dependentModels, typeof(Domain.Mesh), "lucy.sfp");
        }

        /// <summary>
        /// Finds two dependents on the Lucy Model3d.
        /// Mesh(DepthBuffer(Model)
        /// </summary>
        [Fact]
        [Trait("Category", "DependencyManager")]
        public async Task LucyModel3dHasTwoDependents()
        {
            // Arrange
            var lucyPrimaryKey = 1;

            // Act
            var dependentModels = await FindDependentModels(typeof(Model3d), lucyPrimaryKey);

            // Assert
            dependentModels.Count.Should().Be(2);
        }

        /// <summary>
        /// Test whether the Camera class has the exepected dependent types.
        /// </summary>
        [Fact]
        [Trait("Category", "DependencyManager")]
        public void CameraHasExpectedDependentFiles()
        {
            // Assert
            AssertClassHasExpectedDependentFiles(typeof(Domain.Camera), typeof(Domain.DepthBuffer));
        }

        /// <summary>
        /// Test whether the DepthBuffer class has the exepected dependent types.
        /// </summary>
        [Fact]
        [Trait("Category", "DependencyManager")]
        public void DepthBufferHasExpectedDependentFiles()
        {
            // Assert
            AssertClassHasExpectedDependentFiles(typeof(Domain.DepthBuffer), typeof(Domain.Mesh));
        }

        /// <summary>
        /// Test whether the MeshTransform class has the exepected dependent types.
        /// </summary>
        [Fact]
        [Trait("Category", "DependencyManager")]
        public void MeshTransformHasExpectedDependentFiles()
        {
            // Assert
            AssertClassHasExpectedDependentFiles(typeof(Domain.MeshTransform), typeof(Domain.Mesh));
        }

        /// <summary>
        /// Test whether the Model3d class has the exepected dependent types.
        /// </summary>
        [Fact]
        [Trait("Category", "DependencyManager")]
        public void Model3dHasExpectedDependentFiles()
        {
            // Assert
            AssertClassHasExpectedDependentFiles(typeof(Domain.Model3d), typeof(Domain.DepthBuffer));
        }
    }
}

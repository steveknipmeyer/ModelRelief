// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ModelRelief.Test.Unit.DependencyManager
{
    public class DependencyManagerTests : UnitTests
    {
        Services.DependencyManager Manager { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="classFixture"></param>
        public DependencyManagerTests(ClassFixture classFixture) :
            base (classFixture)
        {
            ILogger<Services.DependencyManager> logger = ClassFixture.ServiceProvider.GetRequiredService<ILogger<Services.DependencyManager>>();
            Manager = new Services.DependencyManager(DbContext, logger);
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

            var dependentTypes = Services.DependencyManager.GetClassDependentFiles(rootType);
            var dependentModels = await Manager.FindDependentModels(Identity.MockUserId, rootType, rootPrimaryKey, dependentTypes);

            return dependentModels;
        }

        /// <summary>
        /// Verifies that the target model exists in the given list.
        /// </summary>
        /// <param name="modelList">List of models.</param>
        /// <param name="dependentType">Type of target model.</param>
        /// <param name="dependentName">Name of target model</param>
        private void AssertModelExists (List<DomainModel> modelList, Type dependentType, string dependentName)
        {
            var model = modelList
                                .Where (m => ((m.GetType() == dependentType) &&
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
            var dependentFiles = Services.DependencyManager.GetClassDependentFiles(rootClass);
            dependentFiles.Count.Should().Be(dependentClasses.Count());

            foreach (var dependentFile in dependentFiles)
            {
                var dependentType = dependentFiles
                    .Where( f => (f.Name == dependentFile.Name))
                    .SingleOrDefault();
                dependentType.Should().NotBeNull();
            }
        }

        /// <summary>
        /// Finds all dependents of the TopCamera.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public async Task TopCameraFindsAllDependents() 
        {
            // Arrange
            var topCameraPrimaryKey = 1;

            // Act
            var dependentModels = await FindDependentModels(typeof(Camera), topCameraPrimaryKey);

            // Assert
            dependentModels.Count.Should().Be(2);

            // TopCamera <= DepthBuffer("lucy.raw") <= Mesh("lucy.obj")
            AssertModelExists(dependentModels, typeof(Domain.DepthBuffer), "lucy.raw");
            AssertModelExists(dependentModels, typeof(Domain.Mesh), "lucy.obj");
        }

        /// <summary>
        /// Finds all dependents of the IsometricCamera.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public async Task IsometricCameraFindsAllDependents()
        {
            // Arrange
            var isometricCameraPrimaryKey = 2;

            // Act
            var dependentModels = await FindDependentModels(typeof(Camera), isometricCameraPrimaryKey);

            // Assert
            dependentModels.Count.Should().Be(4);

            // IsometricCamera <= DepthBuffer("bunny.raw") <= Mesh("bunny.ob")
            AssertModelExists(dependentModels, typeof(Domain.DepthBuffer), "bunny.raw");
            AssertModelExists(dependentModels, typeof(Domain.Mesh), "bunny.obj");

            // IsometricCamera <= DepthBuffer("armadillo.raw") <= Mesh("armadillo.obj")
            AssertModelExists(dependentModels, typeof(Domain.DepthBuffer), "armadillo.raw");
            AssertModelExists(dependentModels, typeof(Domain.Mesh), "armadillo.obj");
        }

        /// <summary>
        /// Finds all dependents of the Armadillo DepthBuffer.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public async Task LucyDepthBufferFindsOneDependent()
        {
            // Arrange
            var lucyDepthBufferPrimaryKey = 1;

            // Act
            var dependentModels = await FindDependentModels(typeof(DepthBuffer), lucyDepthBufferPrimaryKey);

            // Assert
            dependentModels.Count.Should().Be(1);

            // DepthBuffer("lucy.raw") <= Mesh("lucy.ob")
            AssertModelExists(dependentModels, typeof(Domain.Mesh), "lucy.obj");
        }

        /// <summary>
        /// Finds no dependents on the Lucy Model3d.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public async Task LucyModel3dHasNoDependents()
        {
            // Arrange
            var lucyPrimaryKey = 1;

            // Act
            var dependentModels = await FindDependentModels(typeof(Model3d), lucyPrimaryKey);

            // Assert
            dependentModels.Count.Should().Be(0);
        }

        /// <summary>
        /// Test whether the Camera class has the exepected dependent types.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public void CameraHasExpectedDependentFiles()
        {
            // Assert
            AssertClassHasExpectedDependentFiles(typeof(Domain.Camera), typeof(Domain.DepthBuffer));
        }

        /// <summary>
        /// Test whether the DepthBuffer class has the exepected dependent types.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public void DepthBufferHasExpectedDependentFiles()
        {
            // Assert
            AssertClassHasExpectedDependentFiles(typeof(Domain.DepthBuffer), typeof(Domain.Mesh));
        }

        /// <summary>
        /// Test whether the MeshTransform class has the exepected dependent types.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public void MeshTransformHasExpectedDependentFiles()
        {
            // Assert
            AssertClassHasExpectedDependentFiles(typeof(Domain.MeshTransform), typeof(Domain.Mesh));
        }

        /// <summary>
        /// Test whether the Model3d class has the exepected dependent types.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public void Model3dHasExpectedDependentFiles()
        {
            // Assert
            AssertClassHasExpectedDependentFiles(typeof(Domain.Model3d), typeof(Domain.DepthBuffer));
        }
    }
}

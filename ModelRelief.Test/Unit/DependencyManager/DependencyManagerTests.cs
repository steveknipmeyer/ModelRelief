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
        /// Finds all dependencies of the TopCamera.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public async Task TopCameraFindsAllDependencies() 
        {
            // Arrange

            // Act
            var model = DbContext.Models
                            .Where(m => (m.Id == 1))
                            .FirstOrDefault();
            var dependentTypes = Services.DependencyManager.GetClassDependentTypes(typeof(Camera));
            var dependentModels = await Manager.FindDependentModels(Identity.MockUserId, rootType: typeof(Camera), rootPrimaryKey: 1, dependentTypes: dependentTypes);

            // Assert
            dependentModels.Count.Should().Be(2);
        }

        /// <summary>
        /// Finds all dependencies of the IsometricCamera.
        /// </summary>
        [Fact]
        [Trait ("Category", "DependencyManager")]
        public async Task IsometricCameraFindsAllDependencies() 
        {
            // Arrange

            // Act
            var model = DbContext.Models
                            .Where(m => (m.Id == 1))
                            .FirstOrDefault();
            var dependentTypes = Services.DependencyManager.GetClassDependentTypes(typeof(Camera));
            var dependentModels = await Manager.FindDependentModels(Identity.MockUserId, rootType: typeof(Camera), rootPrimaryKey: 2, dependentTypes: dependentTypes);

            // Assert
            dependentModels.Count.Should().Be(4);
        }

    }
}

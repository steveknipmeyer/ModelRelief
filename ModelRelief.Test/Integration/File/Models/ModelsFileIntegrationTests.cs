// -----------------------------------------------------------------------
// <copyright file="ModelsFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Models
{
    using System.Threading.Tasks;
    using ModelRelief.Test.TestModels.Models;
    using Xunit;

    /// <summary>
    /// DepthBuffer integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class ModelsFileIntegrationTests : FileIntegrationTests<Domain.Model3d, Dto.Model3d>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelsFileIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public ModelsFileIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new Model3dTestFileModelFactory())
        {
        }

        #region PostFile
        /// <summary>
        /// Tests whether the FileIsSynchronized property is updated correctly after a file POST.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostFile")]
        public override  async Task PostFile_FileIsSynchronizedIsUpdatedAfterFileIsPosted()
        {
            // N.B. A Model is not a generated file so it does not support IGeneratedFile.
            // Assert
            Assert.True(true);

            await Task.CompletedTask;
        }

        /// <summary>
        /// Tests whether the FileTimeStamp property is updated correctly after a file POST.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostFile")]
        public override async Task PostFile_FileTimeStampIsUpdatedAfterFileIsPosted()
        {
            // N.B. A Model is not a generated file so it does not support IGeneratedFile.
            // Assert
            Assert.True(true);

            await Task.CompletedTask;
        }
        #endregion
    }
}

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
    /// Model3d integration Tests.
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
            : base(classFixture, new Model3dTestFileModelFactory(classFixture))
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
            // N.B. A Model is not a generated file so it does not support IGeneratedFileModel.
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
            // N.B. A Model is not a generated file so it does not support IGeneratedFileModel.
            // Assert
            Assert.True(true);

            await Task.CompletedTask;
        }

        /// <summary>
        /// Tests whether an invalid file can be posted to the resource.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostFile")]
        public virtual async Task PostFile_InvalidFileCannotBePosted()
        {
            // Arrange
            var newModel = await PostNewModel();

            // Act
            await PostInvalidNewFile(newModel.Id, "invalidOBJ.obj");

            // Assert
            // performed in PostInvalidNewFile

            // Rollback
            await DeleteModel(newModel);
        }

        /// <summary>
        /// Tests whether a valid model and file can be successfully posted in a Form.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostForm")]
        public virtual async Task PostForm_ValidModelandFileCanBePosted()
        {
#if false
            // Arrange
            var newModel = await PostForm(TestFileModelFactory.BackingFile);

            // Act

            // Assert

            // Rollback
            await DeleteModel(newModel);
            // Camera Model3d
            // Camera Mesh
            // Camera Meshtransform
            // Mesh
            // DepthBuffer
            // NormalMap
#endif
            await Task.CompletedTask;
        }
        #endregion
    }
}

// -----------------------------------------------------------------------
// <copyright file="ModelsFileIntegrationTests.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Models
{
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Dto;
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
            await PostInvalidNewFile(newModel.Id, TestFileModelFactory.InvalidBackingFile);

            // Assert
            // performed in PostInvalidNewFile

            // Rollback
            await DeleteModel(newModel);
        }
        #endregion

        #region PostForm
        /// <summary>
        /// Tests whether a valid model and file can be successfully posted in a Form.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostForm")]
        public virtual async Task PostForm_ValidModelandFileCanBePosted()
        {
#if false
            // Arrange
            var validModel = TestModelFactory.ConstructValidModel() as IFileModel;

            // Act
            RequestResponse requestResponse = await PostForm(validModel, TestFileModelFactory.BackingFile);

            // Assert
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            // Rollback
            await DeleteModel(validModel);

            // WIP: Add support for deleting the related resources added when a new Model3d is created.

            // Camera Model3d
            // Camera Mesh
            // Camera Meshtransform
            // Mesh
            // DepthBuffer
            // NormalMap
#endif
            await Task.CompletedTask;
        }

        /// <summary>
        /// Tests whether an invalid model cannot be posted to PostForm.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostForm")]
        public virtual async Task PostForm_InValidModelReturnsBadRequest()
        {
            // Arrange
            int originalModelCount = await TestModelFactory.QueryModelCountAsync();
            var invalidModel = TestModelFactory.ConstructInvalidModel() as IFileModel;

            // Act
            RequestResponse requestResponse = await PostForm(invalidModel, TestFileModelFactory.BackingFile);
            int modelCount = await TestModelFactory.QueryModelCountAsync();

            // Assert
            requestResponse.Response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// Tests whether an invalid file cannot be posted to PostForm.
        /// </summary>
        [Fact]
        [Trait("Category", "Api PostForm")]
        public virtual async Task PostForm_InValidFileReturnsBadRequest()
        {
            // Arrange
            int originalModelCount = await TestModelFactory.QueryModelCountAsync();
            var validModel = TestModelFactory.ConstructValidModel() as IFileModel;

            // Act
            RequestResponse requestResponse = await PostForm(validModel, TestFileModelFactory.InvalidBackingFile);
            int modelCount = await TestModelFactory.QueryModelCountAsync();

            // Assert
            requestResponse.Response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            Assert.True(modelCount == originalModelCount);
        }
#endregion
    }
}

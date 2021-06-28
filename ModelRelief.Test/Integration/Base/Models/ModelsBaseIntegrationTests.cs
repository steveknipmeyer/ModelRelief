// -----------------------------------------------------------------------
// <copyright file="ModelsBaseIntegrationTests.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Models
{
    using System.Threading.Tasks;

    using ModelRelief.Test.TestModels.Models;
    using Xunit;

    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class ModelsBaseIntegrationTests : BaseIntegrationTests<Domain.Model3d, Dto.Model3d>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelsBaseIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public ModelsBaseIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new Model3dTestFileModelFactory(classFixture))
        {
        }
        #region Get
        #endregion

        #region Post
        #endregion

        #region Put
        #endregion

        #region Patch
        #endregion

        #region Delete

        /// <summary>
        /// N.B. This is a wrapper to permit CodeLens test debugging. CodeLens does not work with inherited test methods.
        /// Test that a Delete request deletes the target model.
        /// </summary>
        [Fact]
        [Trait("Category", "Api Delete")]
        public override async Task Delete_TargetModelIsDeleted()
        {
            await base.Delete_TargetModelIsDeleted();
            await Task.CompletedTask;
        }
#endregion
    }
}

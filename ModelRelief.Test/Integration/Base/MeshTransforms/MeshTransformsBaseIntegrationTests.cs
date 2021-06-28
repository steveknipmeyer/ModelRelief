// -----------------------------------------------------------------------
// <copyright file="MeshTransformsBaseIntegrationTests.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.MeshTransforms
{
    using ModelRelief.Test.TestModels.MeshTransforms;

    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class MeshTransformsBaseIntegrationTests : BaseIntegrationTests<Domain.MeshTransform, Dto.MeshTransform>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransformsBaseIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public MeshTransformsBaseIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new MeshTransformTestModelFactory(classFixture))
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
#endregion
    }
}

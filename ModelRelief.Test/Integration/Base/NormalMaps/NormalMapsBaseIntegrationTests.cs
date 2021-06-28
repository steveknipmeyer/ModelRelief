// -----------------------------------------------------------------------
// <copyright file="NormalMapsBaseIntegrationTests.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.NormalMaps
{
    using ModelRelief.Test.TestModels.NormalMaps;

    /// <summary>
    /// NormalMap integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class NormalMapsBaseIntegrationTests : BaseIntegrationTests<Domain.NormalMap, Dto.NormalMap>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapsBaseIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public NormalMapsBaseIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new NormalMapTestFileModelFactory(classFixture))
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

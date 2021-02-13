// -----------------------------------------------------------------------
// <copyright file="SettingsBaseIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Settings
{
    using ModelRelief.Test.TestModels.Settings;

    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class SettingsBaseIntegrationTests : BaseIntegrationTests<Domain.Settings, Dto.Settings>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsBaseIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public SettingsBaseIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new SettingsTestModelFactory(classFixture))
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

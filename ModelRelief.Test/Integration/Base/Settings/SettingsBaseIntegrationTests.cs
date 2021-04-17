// -----------------------------------------------------------------------
// <copyright file="SettingsBaseIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Settings
{
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Database;
    using ModelRelief.Features.Settings;
    using ModelRelief.Test.TestModels.Settings;
    using Newtonsoft.Json;
    using Xunit;

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
        /// <summary>
        /// Test that the default settings resource can be retrieved.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetSingle")]
        public virtual async Task DefaultSettingsExist()
        {
            // Arrange

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/default");
            Assert.True(requestResponse.Response.IsSuccessStatusCode);

            dynamic defaultSettings = await requestResponse.GetFromJsonAsync<object>();

            // Assert
            Assert.True(defaultSettings.Camera.NearClippingPlane > 0.0);
            Assert.True(defaultSettings.Camera.FarClippingPlane > 0.0);
            Assert.True(defaultSettings.Camera.FieldOfView > 0.0);
        }

        /// <summary>
        /// Test that the active user settings resource can be retrieved.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetSingle")]
        public virtual async Task ActiveProjectUserSettingsExist()
        {
            // Arrange

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/user");
            Assert.True(requestResponse.Response.IsSuccessStatusCode);

            var userSettings = await requestResponse.GetFromJsonAsync<Dto.Settings>();

            // Assert
            userSettings.Name.Should().Be(DbFactory.SettingsNames.Project);
        }

        /// <summary>
        /// Test that the session settings resource can be retrieved.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetSingle")]
        public virtual async Task SessionSettingsExist()
        {
            // Arrange

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/session");
            Assert.True(requestResponse.Response.IsSuccessStatusCode);

            var sessionSettings = await requestResponse.GetFromJsonAsync<Dto.Session>();

            // Assert
            sessionSettings.Name.Should().Be(DbFactory.SettingsNames.Session);
            sessionSettings.Project.Name.Should().Be(DbFactory.ProjectNames.Examples);
        }
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

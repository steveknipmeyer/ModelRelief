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
        /// Test that the default camera settings resource can be retrieved.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetSingle")]
        public virtual async Task DefaultCameraSettingsExist()
        {
            // Arrange

            // Act
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/camera");
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var defaultCameraSettings = JsonConvert.DeserializeObject<DefaultCameraSettingsJson>(requestResponse.ContentString);

            // Assert
            Assert.True(defaultCameraSettings.NearClippingPlane > 0.0);
            Assert.True(defaultCameraSettings.FarClippingPlane > 0.0);
            Assert.True(defaultCameraSettings.FieldOfView > 0.0);
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
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var userSettings = JsonConvert.DeserializeObject<Dto.Settings>(requestResponse.ContentString);

            // Assert
            userSettings.Name.Should().Be(DbInitializer.SettingsNames.Project);
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
            Assert.True(requestResponse.Message.IsSuccessStatusCode);

            var sessionSettings = JsonConvert.DeserializeObject<Dto.Session>(requestResponse.ContentString);

            // Assert
            sessionSettings.Name.Should().Be(DbInitializer.SettingsNames.Session);
            sessionSettings.Project.Name.Should().Be(DbInitializer.ProjectNames.Examples);
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

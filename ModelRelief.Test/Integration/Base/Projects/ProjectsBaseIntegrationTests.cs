// -----------------------------------------------------------------------
// <copyright file="ProjectsBaseIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.Projects
{
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Test.TestModels.Projects;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// Base integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class ProjectsBaseIntegrationTests : BaseIntegrationTests<Domain.Project, Dto.Project>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProjectsBaseIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public ProjectsBaseIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new ProjectTestModelFactory(classFixture))
        {
        }

        #region Get
        /// <summary>
        /// Test that the "?relations=Models" parameter populates the Models collection.
        /// </summary>
        [Fact]
        [Trait("Category", "Api GetSingle")]
        public async Task GetSingle_RelationsQueryParameterReturnsCollection()
        {
            // Arrange
            var modelId = TestModelFactory.IdRange.Min();

            // Act
            var queryParameter = "?relations=Models";
            var requestResponse = await ClassFixture.ServerFramework.SubmitHttpRequestAsync(HttpRequestType.Get, $"{TestModelFactory.ApiUrl}/{modelId}{queryParameter}");

            // Assert
            Assert.True(requestResponse.Response.IsSuccessStatusCode);

            var project = await requestResponse.GetFromJsonAsync<Dto.Project>();
            project.Models.Count().Should().NotBe(0);
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

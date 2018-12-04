// -----------------------------------------------------------------------
// <copyright file="NormalMapsFileIntegrationTests.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration.NormalMaps
{
    using System.Collections.Generic;
    using System.Net;
    using System.Threading.Tasks;
    using FluentAssertions;
    using ModelRelief.Domain;
    using ModelRelief.Test.TestModels;
    using ModelRelief.Test.TestModels.Cameras;
    using ModelRelief.Test.TestModels.Models;
    using ModelRelief.Test.TestModels.NormalMaps;
    using Newtonsoft.Json;
    using Xunit;

    /// <summary>
    /// NormalMap file integration Tests.
    /// http://asp.net-hacker.rocks/2017/09/27/testing-aspnetcore.html
    /// </summary>
    public class NormalMapsFileIntegrationTests : FileIntegrationTests<Domain.NormalMap, Dto.NormalMap>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapsFileIntegrationTests"/> class.
        /// Constructor
        /// </summary>
        /// <param name="classFixture">Test fixture instantiated before any test methods are executed.</param>
        public NormalMapsFileIntegrationTests(ClassFixture classFixture)
            : base(classFixture, new NormalMapTestFileModelFactory(classFixture))
        {
        }

        #region FileOperation
        #endregion
    }
}

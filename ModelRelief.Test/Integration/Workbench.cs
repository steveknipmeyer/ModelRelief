// -----------------------------------------------------------------------
// <copyright file="Workbench.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.Integration
{
    using System.Threading.Tasks;
    using Xunit;

    public class Workbench
    {
        /// <summary>
        /// Workbench
        /// </summary>
        [Fact]
        public async Task Test()
        {
            await Task.CompletedTask;

            // Assert
            Assert.True(true);
        }
    }
}
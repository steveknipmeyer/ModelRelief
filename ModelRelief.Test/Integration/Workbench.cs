// -----------------------------------------------------------------------
// <copyright file="Workbench.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
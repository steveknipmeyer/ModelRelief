// -----------------------------------------------------------------------
// <copyright file="SeedProject.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database.Seed
{
    using System.Collections.Generic;

    /// <summary>
    /// Represents a seed project used to provide example/test data in the database.
    /// </summary>
    public class SeedProject
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public List<SeedModel> Models { get; set; }
    }
}

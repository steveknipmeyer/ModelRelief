// -----------------------------------------------------------------------
// <copyright file="SeedContent.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database.Seed
{
    using System.Collections.Generic;

    /// <summary>
    /// Represents a test model used to provide example/test data in the database.
    /// </summary>
    public class SeedContent
    {
        public const string ContentFile = "SeedContent.json";
        public List<SeedProject> Projects { get; set; }
    }
}

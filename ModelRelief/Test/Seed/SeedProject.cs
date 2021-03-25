// -----------------------------------------------------------------------
// <copyright file="SeedProject.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
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

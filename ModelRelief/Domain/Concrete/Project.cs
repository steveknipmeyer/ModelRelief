// -----------------------------------------------------------------------
// <copyright file="Project.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain
{
    using System.Collections.Generic;
    public class Project : DomainModel
    {
        // Navigation Properties
        public int? SettingsId { get; set; }
        public Settings Settings { get; set; }
        public ICollection<Model3d> Models { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Project"/> class.
        /// Default constructor.
        /// </summary>
        public Project()
        {
        }
    }
}

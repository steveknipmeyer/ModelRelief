// -----------------------------------------------------------------------
// <copyright file="Project.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    public class Project : DomainModel
    {
        // Navigation Properties
        public int? SettingsId { get; set; }
        public Settings Settings { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Project"/> class.
        /// Default constructor.
        /// </summary>
        public Project()
        {
        }
    }
}

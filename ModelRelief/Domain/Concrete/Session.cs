// -----------------------------------------------------------------------
// <copyright file="Session.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    public class Session : DomainModel
    {
        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Session"/> class.
        /// Session holds (global) settings that are cross-Project.
        /// Settings resources are specific to a Project.
        /// Default constructor.
        /// </summary>
        public Session()
        {
            Name = "Default Session";
        }
    }
}

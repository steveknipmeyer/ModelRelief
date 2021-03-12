// -----------------------------------------------------------------------
// <copyright file="Session.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    public class Session : DomainModel
    {
        // active project
        public int? ProjectId { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Session"/> class.
        /// Session holds (global) settings that are cross-Project.
        /// Settings resources are specific to a Project.
        /// Default constructor.
        /// </summary>
        public Session()
        {
        }
    }
}

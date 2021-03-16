// -----------------------------------------------------------------------
// <copyright file="IProjectModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    /// <summary>
    /// Interface for a resource (model) that has a parent Project.
    /// </summary>
    public interface IProjectModel
    {
        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }
    }
}

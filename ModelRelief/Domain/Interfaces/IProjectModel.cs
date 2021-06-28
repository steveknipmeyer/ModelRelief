// -----------------------------------------------------------------------
// <copyright file="IProjectModel.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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

// -----------------------------------------------------------------------
// <copyright file="IProjectModel.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    /// <summary>
    /// Interface for model with a parent Project.
    /// </summary>
    public interface IProjectModel
    {
        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }
    }
}

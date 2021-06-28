// -----------------------------------------------------------------------
// <copyright file="DomainModel.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.ComponentModel.DataAnnotations;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents the base class for a model that is not file-backed.
    /// </summary>
    public abstract class DomainModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        // These properties are common to all models.
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation Properties
        [JsonIgnore]
        public string UserId { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DomainModel"/> class.
        /// Constructor
        /// </summary>
        public DomainModel()
        {
        }
    }
}

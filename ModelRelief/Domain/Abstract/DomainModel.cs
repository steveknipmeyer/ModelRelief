// -----------------------------------------------------------------------
// <copyright file="DomainModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.IO;
    using ModelRelief.Services;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Utility;
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
    }
}

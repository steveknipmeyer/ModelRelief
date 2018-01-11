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
    using ModelRelief.Services.Relationships;

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
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }

    /// <summary>
    /// Represents the base class for a file-backed model resource.
    /// </summary>
    public abstract class FileDomainModel : DomainModel
    {
        [DependentFileProperty]
        public DateTime? FileTimeStamp  { get; set; }           // time of last update; used to trigger updates in dependents
        public string Path { get; set; }                        // associated file absolute path

        public FileDomainModel()
        {
        }

        /// <summary>
        /// Returns the relative path of the model file.
        /// </summary>
        /// <param name="storeRoot">Store users root.</param>
        /// <returns>Path of model file relative to wwwroot.</returns>
        public string GetRelativePath(string storeRoot)
        {
            if (string.IsNullOrEmpty(Path))
                return string.Empty;

            // https://stackoverflow.com/questions/7772520/removing-drive-or-network-name-from-path-in-c-sharp
            // form absolute path; normalizing directory separator characters
            var normalizedStoreRoot = System.IO.Path.GetFullPath(storeRoot);
            // strip drive or network share
            normalizedStoreRoot = normalizedStoreRoot.Substring(System.IO.Path.GetPathRoot(normalizedStoreRoot).Length);

            // include leading directory separator
            var relativePathIndex = Path.IndexOf(normalizedStoreRoot) - 1;
            if (relativePathIndex < 0)
                return string.Empty;

            return Path.Substring(relativePathIndex);
        }

        /// <summary>
        /// Gets the model storage folder for a given model instance.
        /// </summary>
        /// <returns>Storage folder.</returns>
        public string StorageFolder
        {
            get
            {
                DirectoryInfo directoryInfo = Directory.GetParent(FileName);

                // path convention: always include trailing delimiter
                var storageFolder = directoryInfo.FullName + System.IO.Path.DirectorySeparatorChar;

                return storageFolder;
            }
        }

        /// <summary>
        /// Gets the associated disk file for a given model instance.
        /// </summary>
        /// <returns>Disk file name.</returns>
        public string FileName
        {
            get
            {
                var path = System.IO.Path.Combine(Path ?? string.Empty, Name);
                return System.IO.Path.GetFullPath(path);
            }
        }
    }

    /// <summary>
    /// Represents a file-backed model that is generated from dependencies.
    /// </summary>
    public abstract class GeneratedFileDomainModel : FileDomainModel
    {
        [DependentFileProperty]
        public bool FileIsSynchronized { get; set; }       // associated file is synchronized with the model (AND all of the the model's dependencies)

        /// <summary>
        /// Initializes a new instance of the <see cref="GeneratedFileDomainModel"/> class.
        /// Constructor
        /// </summary>
        public GeneratedFileDomainModel()
        {
        }
    }
}

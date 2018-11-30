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

    /// <summary>
    /// Represents the base class for a file-backed model resource.
    /// </summary>
    public abstract class FileDomainModel : DomainModel
    {
        [DependentFileProperty]
        public DateTime? FileTimeStamp  { get; set; }           // time of last update; used to trigger updates in dependents
        [JsonIgnore]
        public string Path { get; set; }                        // associated file absolute path

        public FileDomainModel()
        {
        }

        [JsonIgnore]
        protected IStorageManager StorageManager
        {
            get
            {
                return ApplicationServices.StorageManager;
            }
        }
        /// <summary>
        /// Gets the model storage folder for a given model instance.
        /// </summary>
        /// <returns>Storage folder.</returns>
        [JsonIgnore]
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
        /// Gets the relative path of the model file.
        /// The path is relative to ContentRootPath.
        /// </summary>
        /// <returns>Path of model file relative to ContentRootPath.</returns>
        public string RelativeFileName
        {
            get
            {
                return StorageManager.GetRelativePath(FileName);
            }
        }

        /// <summary>
        /// Gets the associated disk file for a given model instance.
        /// </summary>
        /// <returns>Disk file name.</returns>
        [JsonIgnore]
        public string FileName
        {
            get
            {
                var path = System.IO.Path.Combine(Path ?? string.Empty, Name);

                // now combime relative path with ContentRootPath to yield the complete absolute path
                var fullPath = StorageManager.GetAbsolutePath(path);
                return System.IO.Path.GetFullPath(fullPath);
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

        /// <summary>
        /// Updates the generated file backing a model.
        /// </summary>
        /// <param name="generatedFile">Generated file.</param>
        /// <param name="defaultStorageFolder">Storage Manager</param>
        /// <returns>True if successful.</returns>
        public bool SynchronizeGeneratedFile(string generatedFile, string defaultStorageFolder)
        {
            // no file may exist yet; initialize Path
            if (string.IsNullOrEmpty(Path))
                Path = StorageManager.GetRelativePath(defaultStorageFolder);

            Files.EnsureDirectoryExists(StorageManager.GetAbsolutePath(Path));
            File.Copy(generatedFile, FileName, overwrite: true);

            FileIsSynchronized = true;

            return true;
        }
    }
}

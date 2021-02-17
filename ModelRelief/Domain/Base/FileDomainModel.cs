// -----------------------------------------------------------------------
// <copyright file="FileDomainModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System;
    using System.IO;
    using ModelRelief.Services;
    using ModelRelief.Services.Relationships;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents the base class for a file-backed model resource.
    /// </summary>
    public abstract class FileDomainModel : DomainModel
    {
        [DependentFileProperty]
        public DateTime? FileTimeStamp  { get; set; }           // time of last update; used to trigger updates in dependents
        [JsonIgnore]
        public string Path { get; set; }                        // associated file absolute path

        /// <summary>
        /// Initializes a new instance of the <see cref="FileDomainModel"/> class.
        /// Constructor
        /// </summary>
        public FileDomainModel()
        {
        }

        [JsonIgnore]
        protected IStorageManager StorageManager
        {
            get
            {
                return ServicesRepository.StorageManager;
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
}

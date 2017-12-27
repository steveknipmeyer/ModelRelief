// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using ModelRelief.Domain;
using System.ComponentModel.DataAnnotations;
using System.IO;

namespace ModelRelief.Domain
{
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
        // absolute file path
        public string Path { get; set; }

        /// <summary>
        /// Returns the relative path of the model file.
        /// </summary>
        /// <param name="storeRoot">Store users root.</param>
        /// <returns>Path of model file relative to wwwroot.</returns>
        public string GetRelativePath (string storeRoot)
        {
            if (string.IsNullOrEmpty(Path))
                return "";

            return Path.Substring(Path.IndexOf(storeRoot));
        }

        /// <summary>
        /// Returns the model storage folder for a given model instance.
        /// </summary>
        /// <returns>Storage folder.</returns>
        public string StorageFolder
        {
            get 
            {
                if (string.IsNullOrEmpty(Path))
                    return "";

                DirectoryInfo directoryInfo = Directory.GetParent(FileName);

                // path convention: always include trailing delimiter
                var storageFolder = directoryInfo.FullName + System.IO.Path.DirectorySeparatorChar;

                return storageFolder;
            }
        }

        /// <summary>
        /// Returns the associated disk file for a given model instance.
        /// </summary>
        /// <returns>Disk file name.</returns>
        public string FileName
        {
            get
            {
                if (string.IsNullOrEmpty(Path))
                    return "";

                var path = System.IO.Path.Combine (Path, Name);
                return System.IO.Path.GetFullPath (path);
            }
        }
    }
}

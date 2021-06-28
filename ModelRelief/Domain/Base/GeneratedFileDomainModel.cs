// -----------------------------------------------------------------------
// <copyright file="GeneratedFileDomainModel.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
            if (!File.Exists(generatedFile))
                return false;

            // initialize Path; Path set only after backing file Post
            Path = StorageManager.GetRelativePath(defaultStorageFolder);

            Files.EnsureDirectoryExists(FileName);
            File.Copy(generatedFile, FileName, overwrite: true);

            FileIsSynchronized = true;

            return true;
        }

        /// <summary>
        /// Creates the default element of a GeneratedFileDomainModel.
        /// </summary>
        /// <returns>Byte array of default element.</returns>
        public virtual byte[] CreateDefaultElement()
        {
            return default;
        }

        /// <summary>
        /// Creates a byte array representing the default GeneratedFileDomainModel.
        /// </summary>
        /// <param name="width">Width.</param>
        /// <param name="height">Height.</param>
        /// <returns>Byte array of default content.</returns>
        public virtual byte[] CreateDefaultContent(int width, int height)
        {
            var numberElements = width * height;
            var defaultElement = CreateDefaultElement();
            var sizeDefaultElement = defaultElement.Length;

            var content = new byte[numberElements * sizeDefaultElement];
            for (int element = 0; element < numberElements; element++)
            {
                Buffer.BlockCopy(defaultElement, 0, content, element * sizeDefaultElement, sizeDefaultElement);
            }
            return content;
        }
    }
}

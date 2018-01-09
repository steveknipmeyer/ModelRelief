// -----------------------------------------------------------------------
// <copyright file="ModelFileNotFoundException.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using System;

    /// <summary>
    ///  Represents an exception when a disk file backing a model cannot be found.
    /// </summary>
    public class ModelFileNotFoundException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelFileNotFoundException"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="entityType">Type of entity.</param>
        /// <param name="fileName">Name of file.</param>
        public ModelFileNotFoundException(Type entityType, string fileName)
            : base($"{entityType.Name} file {fileName} was not found.")
        {
        }
    }
}

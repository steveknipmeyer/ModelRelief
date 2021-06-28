// -----------------------------------------------------------------------
// <copyright file="ModelNotBackedByFileException.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using System;

    /// <summary>
    ///  Represents an exception when a disk file backing a model cannot be found.
    /// </summary>
    public class ModelNotBackedByFileException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelNotBackedByFileException"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="entityType">Type of entity.</param>
        public ModelNotBackedByFileException(Type entityType)
            : base($"{entityType.Name} resources are not backed by files.")
        {
        }
    }
}

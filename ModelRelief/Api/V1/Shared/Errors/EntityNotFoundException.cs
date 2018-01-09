// -----------------------------------------------------------------------
// <copyright file="EntityNotFoundException.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using System;

    /// <summary>
    ///  Represents an exception when a given entity cannot be found in the database.
    /// </summary>
    public class EntityNotFoundException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="EntityNotFoundException"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="entityType">Type of entity.</param>
        /// <param name="id">Unique Id of entity.</param>
        public EntityNotFoundException(Type entityType, int id)
            : base($"A {entityType.Name} with Id {id} was not found.")
        {
        }
    }
}

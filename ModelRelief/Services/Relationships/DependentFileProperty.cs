// -----------------------------------------------------------------------
// <copyright file="DependentFileProperty.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Relationships
{
    using System;

    /// <summary>
    /// Represents a property on which a dependent file is partially based.
    /// When this property changes, the dependent files must be regenerated.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class DependentFileProperty : Attribute
    {
        public DependentFileProperty()
        {
        }
    }
}

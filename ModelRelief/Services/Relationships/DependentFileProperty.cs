// -----------------------------------------------------------------------
// <copyright file="DependentFileProperty.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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

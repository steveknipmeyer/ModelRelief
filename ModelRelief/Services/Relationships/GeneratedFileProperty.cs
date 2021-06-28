// -----------------------------------------------------------------------
// <copyright file="GeneratedFileProperty.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Relationships
{
    using System;

    /// <summary>
    /// Represents a required property for generating a backing file for a GeneratedFileDomainModel.
    /// This property must be defined to allow the backing file to be generated.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class GeneratedFileProperty : Attribute
    {
        public GeneratedFileProperty()
        {
        }
    }
}

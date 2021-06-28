// -----------------------------------------------------------------------
// <copyright file="DependentFiles.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Relationships
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Represents a class that has dependents.
    /// WHen this class has a key property change (FileProperty) the dependent classes must re-generate their file-backed resources.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class DependentFiles : Attribute
    {
        public List<Type> Classes { get; }

        public DependentFiles(params Type[] classes)
        {
            Classes = classes.ToList();
        }
    }
}

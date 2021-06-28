// -----------------------------------------------------------------------
// <copyright file="PropertyModification.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Relationships
{
    using System;
    using Microsoft.EntityFrameworkCore.ChangeTracking;
    using Microsoft.EntityFrameworkCore.Metadata;

    /// <summary>
    /// Represents the difference in a property state.
    /// </summary>
    public class PropertyModification
    {
        public EntityEntry ModifiedEntity { get; set; }
        public IProperty Property { get; }

        public Type PropertyType { get; set; }
        public object OriginalValue { get; set; }
        public object ModifiedValue { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PropertyModification"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="modifiedEntity">Entity that has changed.</param>
        /// <param name="property">Property that has changed.</param>
        public PropertyModification(EntityEntry modifiedEntity, IProperty property)
        {
            ModifiedEntity = modifiedEntity;
            Property = property;

            Initialize();
        }

        private void Initialize()
        {
            OriginalValue = ModifiedEntity.GetDatabaseValues().GetValue<object>(Property);
            ModifiedValue = ModifiedEntity.CurrentValues[Property];
        }

        /// <summary>
        /// Gets a value indicating whether the property has changed.
        /// </summary>
        public bool Changed
        {
            get
            {
                // convert to string for comparison
                var originalValueString = OriginalValue?.ToString();
                var modifiedValueString = ModifiedValue?.ToString();
                return !string.Equals(originalValueString, modifiedValueString);
            }
        }
    }
}

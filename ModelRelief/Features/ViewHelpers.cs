// -----------------------------------------------------------------------
// <copyright file="ViewHelpers.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using ModelRelief.Database;
    using ModelRelief.Domain;

    /// <summary>
    /// MVC Controller extensions.
    /// ContosoUniverityCore
    /// </summary>
    public static class ViewHelpers
    {
        /// <summary>
        /// Create a SelectList from an enum.
        /// Note: None is skipped.
        /// </summary>
        /// <typeparam name="TEnum">The enum type of the list.</typeparam>
        /// <param name="prompt">Control selection prompt</param>
        public static List<SelectListItem> PopulateEnumDropDownList<TEnum>(string prompt)
            where TEnum : struct,  IComparable, IFormattable, IConvertible
        {
            var enumSelectList = new List<SelectListItem>
            {
                new SelectListItem
                {
                    Text = prompt,
                    Value = string.Empty,
                },
            };
            foreach (TEnum enumValue in Enum.GetValues(typeof(TEnum)))
            {
                string enumText = Enum.GetName(typeof(TEnum), enumValue);
                if (!string.Equals(enumText, "None", StringComparison.CurrentCultureIgnoreCase))
                    enumSelectList.Add(new SelectListItem { Text = Enum.GetName(typeof(TEnum), enumValue), Value = enumValue.ToString() });
            }
            return enumSelectList;
        }

        /// <summary>
        /// Creates a SelectListModel from the Name properties in a database table.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="dbContext">Database context.</param>
        /// <param name="userId">Owning User Id; permit only authorized models.</param>
        /// <param name="prompt">Control selection prompt</param>
        /// <param name="selectedRow">(Optional) Primary key of selected row</param>
        public static List<SelectListItem> PopulateModelDropDownList<TEntity>(ModelReliefDbContext dbContext, string userId, string prompt, int? selectedRow = 0)
            where TEntity : DomainModel
        {
            var modelSelectList = new List<SelectListItem>
            {
                new SelectListItem
                {
                    Text = prompt,
                    Value = string.Empty,
                },
            };

            var models = dbContext.Set<TEntity>()
                .Where(m => (m.UserId == userId));

            foreach (TEntity model in models)
            {
                string modelText = model.Name;
                bool selectedState = model.Id == (selectedRow ?? 0);
                modelSelectList.Add(new SelectListItem { Text = modelText, Value = model.Id.ToString(), Selected = selectedState });
            }
            return modelSelectList;
        }
    }
}
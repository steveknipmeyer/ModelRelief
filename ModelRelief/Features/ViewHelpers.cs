// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ModelRelief.Features
{
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
        /// <param name="prompt">Control selection prompt</param>
        /// <returns></returns>
        public static List<SelectListItem> PopulateEnumDropDownList<TEnum>(string prompt)
            where TEnum : struct,  IComparable, IFormattable, IConvertible
        {
            var enumSelectList = new List<SelectListItem>();
            enumSelectList.Add(new SelectListItem
            {
                Text = prompt,
                Value = ""
            });
            foreach (TEnum enumValue in Enum.GetValues(typeof(TEnum)))
            {
                string enumText = Enum.GetName(typeof(TEnum), enumValue);
                if (!String.Equals(enumText, "None", StringComparison.CurrentCultureIgnoreCase))
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
        /// <returns></returns>
        public static List<SelectListItem> PopulateModelDropDownList<TEntity>(ModelReliefDbContext dbContext, string userId, string prompt, int? selectedRow = 0)
            where TEntity : DomainModel
        {
            var modelSelectList = new List<SelectListItem>();
            modelSelectList.Add(new SelectListItem
            {
                Text = prompt,
                Value = ""
            });

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
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Domain;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

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
        /// Create a SelectList from a model.
        /// Note: None is skipped.
        /// </summary>
        public static List<SelectListItem> PopulateModelDropDownList<TModel>(DbSet<TModel> models, string prompt)
            where TModel : ModelReliefModel
        {
            var modelSelectList = new List<SelectListItem>();
            modelSelectList.Add(new SelectListItem
            {
                Text = prompt,
                Value = ""
            });
            foreach (TModel model in models)
            {
                string modelText = model.Name;
                modelSelectList.Add(new SelectListItem { Text = modelText, Value = model.Id.ToString() });
            }
            return modelSelectList;
        }

    }
}
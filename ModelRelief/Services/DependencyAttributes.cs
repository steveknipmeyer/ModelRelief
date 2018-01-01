// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using ModelRelief.Database;
using ModelRelief.Domain;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ModelRelief.Services
{
    /// <summary>
    /// Reprsents a class that has dependents.
    /// WHen this class had a key property change (FileProperty) the dependent classes must re-generate their file-backed resources.
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

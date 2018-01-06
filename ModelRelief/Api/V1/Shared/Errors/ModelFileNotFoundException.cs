// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Errors
{
    /// <summary>
    ///  Represents an exception when a disk file backing a model cannot be found.
    /// </summary>
    public class ModelFileNotFoundException : Exception
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="entityType">Type of entity.</param>
        /// <param name="fileName">Name of file.</param>
        public ModelFileNotFoundException(Type entityType, string fileName) 
            : base($"{entityType.Name} file {fileName} was not found.") {}
    }
}

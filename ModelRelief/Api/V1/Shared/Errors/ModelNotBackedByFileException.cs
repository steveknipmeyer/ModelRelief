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
    public class ModelNotBackedByFileException : Exception
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="entityType">Type of entity.</param>
        public ModelNotBackedByFileException(Type entityType) 
            : base($"{entityType.Name} resources are not backed by files.") {}
    }
}

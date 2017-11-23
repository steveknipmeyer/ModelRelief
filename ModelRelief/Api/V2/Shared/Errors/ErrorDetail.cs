// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V2.Shared.Errors
{
    /// <summary>
    /// Represents a specific error in a collection of API errors.
    /// </summary>
    public class ErrorDetail
    {
        /// <summary>
        /// Gets or sets the target (e.g. property, condition) of the error.
        /// </summary>
        public string Target { get; set; }

        /// <summary>
        /// Gets or sets the specific error message for the Target.
        /// </summary>
        public string Message { get; set; }
    }
}

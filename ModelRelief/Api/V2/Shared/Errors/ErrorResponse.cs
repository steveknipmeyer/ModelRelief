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
    /// Represents an API Error result.
    /// </summary>
    public class ErrorResponse
    {
        /// <summary>
        /// Gets or sets the error value.
        /// WIP Why is Error nested in ErrorResult?
        /// </summary>
        public Error Error { get; set; }
    }
}

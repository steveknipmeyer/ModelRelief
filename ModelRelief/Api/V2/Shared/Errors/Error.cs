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
    /// Represents the body of an API ErrorResult.
    /// WIP Replace Error with a form of V1.ApiResult.
    ///     The FV ValidationException can be caught and then re-packaged into a broader exceptiopn that contains the additional fields.
    /// </summary>
    public class Error
    {
        /// <summary>
        /// Gets or sets the primary error message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Gets of sets an array of specific error details.
        /// </summary>
        public ErrorDetail[] Details { get; set; }
    }
}

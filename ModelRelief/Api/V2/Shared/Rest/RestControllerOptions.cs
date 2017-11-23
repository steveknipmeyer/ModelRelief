﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    /// Represents the options for an instance of a RestController.
    /// </summary>
    public class RestControllerOptions
    {
        /// <summary>
        /// Gets or sets whether to page a collection of results.
        /// </summary>
        public bool UsePaging { get; set; }
    }
}
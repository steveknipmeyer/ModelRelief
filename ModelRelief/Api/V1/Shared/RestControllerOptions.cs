// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

namespace ModelRelief.Api.V1.Shared
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
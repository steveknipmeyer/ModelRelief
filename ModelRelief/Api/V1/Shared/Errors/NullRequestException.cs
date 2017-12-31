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
    ///  Represents an exception when a CQRS request is null.
    /// </summary>
    public class NullRequestException : Exception
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        public NullRequestException(string requestPath, Type request) 
            : base($"{requestPath} received an empty {request.Name}.") {}
    }
}

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
    ///  Represents an exception when the active User (ClaimsPrincipal) is invalid or not authenticated.
    /// </summary>
    public class UserAuthenticationException : Exception
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        public UserAuthenticationException() 
            : base("The current user is invalid or has not been authenticated.") {}
    }
}

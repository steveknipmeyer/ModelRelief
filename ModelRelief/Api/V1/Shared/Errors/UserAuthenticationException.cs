// -----------------------------------------------------------------------
// <copyright file="UserAuthenticationException.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using System;

    /// <summary>
    ///  Represents an exception when the active User (ClaimsPrincipal) is invalid or not authenticated.
    /// </summary>
    public class UserAuthenticationException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UserAuthenticationException"/> class.
        /// Constructor.
        /// </summary>
        public UserAuthenticationException()
            : base("The current user is invalid or has not been authenticated.")
        {
        }
    }
}

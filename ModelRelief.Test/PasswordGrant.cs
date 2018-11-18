// -----------------------------------------------------------------------
// <copyright file="PasswordGrant.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    /// <summary>
    /// Represents the format of a password grant from Auth0.
    /// </summary>
    public class PasswordGrant
    {
        public string Access_token { get; set; }
        public string Token_type { get; set; }
        public int Expires_in { get; set; }
        public string Scope { get; set; }
    }
}
// -----------------------------------------------------------------------
// <copyright file="PasswordGrant.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
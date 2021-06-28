// -----------------------------------------------------------------------
// <copyright file="Auth0Settings.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Settings
{
    /// <summary>
    /// Represents Auth0 credentials in a configuration provider such as Azure Key Vault.
    /// </summary>
    public class Auth0Settings
    {
        public string Domain { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }

        public string ApiAudience { get; set; }
        public string ApiClientId { get; set; }
        public string ApiClientSecret { get; set; }
    }
}

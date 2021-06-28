// -----------------------------------------------------------------------
// <copyright file="ReCAPTCHASettings.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Settings
{
    /// <summary>
    /// Represents Google reCAPTCHA keys in a configuration provider such as Azure Key Vault.
    /// </summary>
    public class ReCAPTCHASettings
    {
        public ReCAPTCHAKeys ModelRelief { get; set; }
        public ReCAPTCHAKeys localhostModelRelief { get; set; }
    }
}

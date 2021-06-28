// -----------------------------------------------------------------------
// <copyright file="ReCAPTCHAKeys.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Settings
{
    /// <summary>
    /// Represents reCAPTCHA keys in a configuration provider such as Azure Key Vault.
    /// </summary>
    public class ReCAPTCHAKeys
    {
    public string Site { get; set; }
    public string Secret { get; set; }
    }
}

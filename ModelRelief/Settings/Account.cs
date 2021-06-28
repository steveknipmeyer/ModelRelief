// -----------------------------------------------------------------------
// <copyright file="Account.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Settings
{
    /// <summary>
    /// Represents account credentials in a configuration provider such as Azure Key Vault.
    /// </summary>
    public class Account
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string NameIdentifier { get; set; }
    }
}

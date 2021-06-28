// -----------------------------------------------------------------------
// <copyright file="AnalyticsSettings.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Settings
{
    /// <summary>
    /// Represents Google Analytics settings in a configuration provider such as Azure Key Vault.
    /// </summary>
    public class AnalyticsSettings
    {
        public string PropertyId { get; set; }
    }
}
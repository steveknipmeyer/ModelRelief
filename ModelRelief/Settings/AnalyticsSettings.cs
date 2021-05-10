// -----------------------------------------------------------------------
// <copyright file="AnalyticsSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
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
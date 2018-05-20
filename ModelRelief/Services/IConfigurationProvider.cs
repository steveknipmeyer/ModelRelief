// -----------------------------------------------------------------------
// <copyright file="IConfigurationProvider.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    using Microsoft.Extensions.Configuration;

    /// <summary>
    /// Interface for providing configuration services.
    /// </summary>
    public interface IConfigurationProvider
    {
        IConfiguration Configuration { get; }
        RelationalDatabaseProvider Database { get; }

        string GetSetting(string settingName, bool throwIfNotFound = true);
        bool ParseBooleanSetting(string settingName);
        void LogConfigurationSettings();
    }
}

// -----------------------------------------------------------------------
// <copyright file="ConfigurationProvider.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    using System;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;

    /// <summary>
    /// Provides configuration services.
    /// Wraps IConfigurationProvider.
    /// </summary>
    public class ConfigurationProvider : IConfigurationProvider
    {
        public IConfiguration Configuration { get; private set; }
        public ILogger<ConfigurationProvider> Logger { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ConfigurationProvider"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="configuration">Default IConfiguration.</param>
        /// <param name="logger">ILogger.</param>
        public ConfigurationProvider(IConfiguration configuration, ILogger<ConfigurationProvider> logger)
        {
            Configuration = configuration;
            Logger = logger;
        }

        /// <summary>
        /// Logs the primary configuration settings.
        /// </summary>
        public void LogConfigurationSettings()
        {
            Logger.LogInformation($"{ConfigurationSettings.MRPort} = {GetSetting(ConfigurationSettings.MRPort)}");
            Logger.LogInformation($"{ConfigurationSettings.MRDatabaseProvider} = {GetSetting(ConfigurationSettings.MRDatabaseProvider)}");
            Logger.LogInformation($"{ConfigurationSettings.MRForceInitializeAll} = {GetSetting(ConfigurationSettings.MRForceInitializeAll)}");
            Logger.LogInformation($"{ConfigurationSettings.MRInitializeDatabase} = {GetSetting(ConfigurationSettings.MRInitializeDatabase)}");
            Logger.LogInformation($"{ConfigurationSettings.MRInitializeUserStore} = {GetSetting(ConfigurationSettings.MRInitializeUserStore)}");
        }

        /// <summary>
        /// Returns a given setting.
        /// </summary>
        /// <param name="settingName">Configuration setting to lookup.</param>
        /// <param name="throwIfNotFound">Throw an exception if the setting is not found.</param>
        /// <returns></returns>
        public string GetSetting(string settingName, bool throwIfNotFound = true)
        {
            var setting = Configuration[settingName];

            if (throwIfNotFound && string.IsNullOrEmpty(setting))
                throw new Exception($"Configuration setting {settingName} not found");

            return setting;
        }

        /// <summary>
        /// Parses a boolean configuration variable.
        /// </summary>
        /// <param name="variableName">Name of configuration variable.</param>
        /// <returns></returns>
        public bool ParseBooleanSetting(string variableName)
        {
            var variableValue = GetSetting(variableName, throwIfNotFound: false);
            bool.TryParse(variableValue, out bool result);
            return result;
        }

        /// <summary>
        /// Gets the active database provider based on the configuration.
        /// </summary>
        public RelationalDatabaseProvider Database
        {
            get
            {
                var provider = GetSetting(ConfigurationSettings.MRDatabaseProvider, false);
                return DatabaseFromSetting(provider);
            }
        }

        /// <summary>
        /// Returns the relational database to be used based on the given setting.
        /// </summary>
        /// <param name="databaseProvider">Database setting.</param>
        /// <returns></returns>
        public static RelationalDatabaseProvider DatabaseFromSetting(string databaseProvider)
        {
            var provider = (databaseProvider ?? ConfigurationSettings.SQLServer).ToLower();

            if (string.Equals(provider, ConfigurationSettings.SQLite.ToLower()))
                return RelationalDatabaseProvider.SQLite;

            return RelationalDatabaseProvider.SQLServer;
        }
    }

    /// <summary>
    /// Configuration settings.
    /// </summary>
    public class ConfigurationSettings
    {
        // configuration settings
        public const string MRPort                = "MRPort";
        public const string MRForceInitializeAll  = "MRForceInitializeAll";
        public const string MRDatabaseProvider    = "MRDatabaseProvider";
        public const string MRInitializeDatabase  = "MRInitializeDatabase";
        public const string MRInitializeUserStore = "MRInitializeUserStore";

        // database providers
        public const string SQLServer = "SQLServer";
        public const string SQLite    = "SQLite";
    }

    /// <summary>
    /// Configuration resource paths.
    /// </summary>
    public class Paths
    {
        public const string TestDataUsers = "Paths:TestDataUsers";
        public const string TestDataFiles = "Paths:TestDataFiles";
        public const string StoreUsers    = "Paths:StoreUsers";
        public const string Working       = "Paths:Working";
    }

    /// <summary>
    /// Represents the active relational database.
    /// </summary>
    public enum RelationalDatabaseProvider
    {
        None,
        SQLServer,
        SQLite,
    }
}

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
        /// Log a configuration setting.
        /// </summary>
        /// <param name="message">Message to display</param>
        /// <param name="alsoConsole">Display the message on the console</param>
        public void LogConfigurationSetting(string message, bool alsoConsole = true)
        {
            Logger.LogInformation(message);
            if (alsoConsole)
                Console.WriteLine(message);
        }

        /// <summary>
        /// Logs the primary configuration settings.
        /// </summary>
        public void LogConfigurationSettings()
        {
            LogConfigurationSetting(string.Empty);
            LogConfigurationSetting("<---- ModelRelief Configuration Settings ---->");
            Console.ForegroundColor = ConsoleColor.Cyan;

            LogConfigurationSetting($"{ConfigurationSettings.ENVIRONMENT} = {GetSetting(ConfigurationSettings.ENVIRONMENT)}");
            LogConfigurationSetting($"{ConfigurationSettings.URLS} = {GetSetting(ConfigurationSettings.URLS)}");
            LogConfigurationSetting(string.Empty);

            Console.ForegroundColor = ConsoleColor.Magenta;
            LogConfigurationSetting($"{ConfigurationSettings.MRDatabaseProvider} = {GetSetting(ConfigurationSettings.MRDatabaseProvider)}");
            LogConfigurationSetting($"{ConfigurationSettings.MRUpdateSeedData} = {GetSetting(ConfigurationSettings.MRUpdateSeedData)}");
            LogConfigurationSetting($"{ConfigurationSettings.MRInitializeDatabase} = {GetSetting(ConfigurationSettings.MRInitializeDatabase)}");
            LogConfigurationSetting($"{ConfigurationSettings.MRSeedDatabase} = {GetSetting(ConfigurationSettings.MRSeedDatabase)}");
            LogConfigurationSetting($"{ConfigurationSettings.MRExitAferInitialization} = {GetSetting(ConfigurationSettings.MRExitAferInitialization)}");
            Console.ForegroundColor = ConsoleColor.White;
            LogConfigurationSetting("<-------------------------------------------->");
            LogConfigurationSetting(string.Empty);
        }

        /// <summary>
        /// Returns a given setting.
        /// </summary>
        /// <param name="settingName">Configuration setting to lookup.</param>
        /// <param name="throwIfNotFound">Throw an exception if the setting is not found.</param>
        /// <returns>Setting string</returns>
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
        /// <returns>Boolean value</returns>
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
        public static RelationalDatabaseProvider DatabaseFromSetting(string databaseProvider)
        {
            var provider = (databaseProvider ?? ConfigurationSettings.SQLite).ToLower();

            if (string.Equals(provider, ConfigurationSettings.SQLite.ToLower()))
                return RelationalDatabaseProvider.SQLite;

            return RelationalDatabaseProvider.SQLite;
        }
    }

    /// <summary>
    /// Configuration settings.
    /// </summary>
    public class ConfigurationSettings
    {
        // configuration settings
        public const string ENVIRONMENT                 = "ASPNETCORE_ENVIRONMENT";
        public const string URLS                        = "ASPNETCORE_URLS";
        public const string MRDatabaseProvider          = "MRDatabaseProvider";

        public const string MRUpdateSeedData            = "MRUpdateSeedData";
        public const string MRInitializeDatabase        = "MRInitializeDatabase";
        public const string MRSeedDatabase              = "MRSeedDatabase";
        public const string MRExitAferInitialization    = "MRExitAfterInitialization";

        // database providers
        public const string SQLite = "SQLite";
    }

    /// <summary>
    /// Configuration resource paths.
    /// </summary>
    public class Paths
    {
        public const string Settings      = "Paths:Settings";
        public const string TestDataUser = "Paths:TestDataUser";
        public const string TestDataIntegration = "Paths:TestDataIntegration";
        public const string TestSeed = "Paths:TestSeed";
        public const string StoreDatabase = "Paths:StoreDatabase";
        public const string StoreUsers    = "Paths:StoreUsers";
        public const string Working       = "Paths:Working";
    }

    /// <summary>
    /// Represents the active relational database.
    /// </summary>
    public enum RelationalDatabaseProvider
    {
        None,
        SQLite,
    }
}

// -----------------------------------------------------------------------
// <copyright file="ConfigurationProvider.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    using System;
    using Microsoft.Extensions.Configuration;

    /// <summary>
    /// Provides configuration services.
    /// Wraps IConfigurationProvider.
    /// </summary>
    public class ConfigurationProvider : IConfigurationProvider
    {
        public IConfiguration Configuration { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ConfigurationProvider"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="configuration">Default IConfiguration.</param>
        public ConfigurationProvider(IConfiguration configuration)
        {
            Configuration = configuration;
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
        /// Gets the active database provider based on the configuration.
        /// </summary>
        public RelationalDatabaseProvider Database
        {
            get
            {
                var modelReliefDatabase = GetSetting(ConfigurationSettings.ModelReliefDatabase, false);
                switch ((modelReliefDatabase ?? "SqlServer").ToLower())
                {
                    case "sqlite":
                        return RelationalDatabaseProvider.SQLite;

                    case "sqlserver":
                    default:
                        return RelationalDatabaseProvider.SQLServer;
                }
            }
        }
    }

    /// <summary>
    /// Configuration settings.
    /// </summary>
    public class ConfigurationSettings
    {
        public static string ModelReliefDatabase = "ModelReliefDatabase";
    }

    /// <summary>
    /// Configuration resource paths.
    /// </summary>
    public class ResourcePaths
    {
        public static string TestDataUsers      = "ResourcePaths:TestDataUsers";
        public static string TestDataFiles      = "ResourcePaths:TestDataFiles";
        public static string StoreUsers         = "ResourcePaths:StoreUsers";
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

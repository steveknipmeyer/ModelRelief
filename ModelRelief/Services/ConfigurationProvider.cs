// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Services
{
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
        SQLite
    }

    /// <summary>
    /// Interface for providing configuration services.
    /// </summary>
    public interface IConfigurationProvider
    {
        IConfiguration Configuration { get; }
        string GetSetting(string settingName, bool throwIfNotFound = true);
        RelationalDatabaseProvider Database  { get; }
    }

    /// <summary>
    /// Provides configuration services.
    /// Wraps IConfigurationProvider.
    /// </summary>
    public class ConfigurationProvider : IConfigurationProvider
    {
        public IConfiguration Configuration { get; private set; }

        /// <summary>
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
        /// <param name="settingName"></param>
        /// <param name="throwIfNotFound">Throw an exception if the setting is not found.</param>
        /// <returns></returns>
        public string GetSetting(string settingName, bool throwIfNotFound = true)
        {
            var setting = Configuration[settingName];

            if (throwIfNotFound && String.IsNullOrEmpty(setting))
                throw new Exception ($"Configuration setting {settingName} not found");

            return setting;
        }

        /// <summary>
        /// Returns the active database provider based on the configuration.
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
}

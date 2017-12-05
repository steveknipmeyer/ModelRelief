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
    /// Configuration resource paths.
    /// </summary>
    public class ResourcePaths 
    {
        public static string StoreUsers   = "ResourcePaths:StoreUsers";
        public static string TestDataUser = "ResourcePaths:TestDataUser";
        public static string ModelFolders = "ResourcePaths:ModelFolders";
    }

    /// <summary>
    /// User secret configuration settings.
    /// </summary>
    public class UserSecrets
    {
        public static string TestAccountUserName = "TestAccount:UserName";
        public static string TestAccountPassword = "TestAccount:Password";
    }

    public interface IConfigurationProvider
    {
       string GetSetting(string settingName);
    }
    
    public class ConfigurationProvider : IConfigurationProvider
    {
        public IConfiguration _configuration { get; private set; }

        public ConfigurationProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GetSetting(string settingName)
        {
            var setting = _configuration[settingName];
            if (String.IsNullOrEmpty(setting))
                throw new Exception ($"Configuration setting {settingName} not found");

            return setting;
        }
    }
}

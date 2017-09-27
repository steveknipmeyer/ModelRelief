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
            return _configuration[settingName];
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="IConfigurationProvider.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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

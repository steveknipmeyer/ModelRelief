// -----------------------------------------------------------------------
// <copyright file="DefaultNormalMapSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain
{
    /// <summary>
    /// Default normal map settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public class DefaultNormalMapSettings
    {
        public NormalMapFormat Format { get; set; }

        /// <summary>
        /// Initialize the settings from JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public void Initialize(dynamic settingsJson)
        {
            Format = settingsJson.NormalMap.Format;
        }
    }
}

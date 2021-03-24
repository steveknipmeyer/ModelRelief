// -----------------------------------------------------------------------
// <copyright file="DefaultResolutionSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain
{
    /// <summary>
    /// Default resolution settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public class DefaultResolutionSettings
    {
        public int Image { get; set; }

        /// <summary>
        /// Initialize the settings from JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public void Initialize(dynamic settingsJson)
        {
            Image = settingsJson.Resolution.Image;
        }
    }
}

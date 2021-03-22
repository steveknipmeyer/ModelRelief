// -----------------------------------------------------------------------
// <copyright file="DefaultSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Features.Settings
{
    /// <summary>
    /// Default settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public static class DefaultSettings
    {
        /// <summary>
        /// Initializes static members of the <see cref="DefaultSettings"/>  class.
        /// Constructor
        /// </summary>
        static DefaultSettings()
        {
            Camera = new DefaultCameraSettings();
        }

        public static DefaultCameraSettings Camera { get; set; }

        /// <summary>
        /// Initialize the settings from the JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public static void Initialize(dynamic settingsJson)
        {
            Camera.Initialize(settingsJson);
        }
    }
}

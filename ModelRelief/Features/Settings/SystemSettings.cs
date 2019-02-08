// -----------------------------------------------------------------------
// <copyright file="SystemSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    /// <summary>
    /// Shared system settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public static class SystemSettings
    {
        // console logging
        public static bool LoggingEnabled { get; set; }

        // development UI (extended Composer controls, resource pages, etc.)
        public static bool DevelopmentUI { get; set; }

        /// <summary>
        /// Assign the system settings from JSON definitions.
        /// </summary>
        /// <param name="settings">System settings read from JSON.</param>
        public static void Initialize(SystemSettingsJson settings)
        {
            LoggingEnabled = settings.LoggingEnabled;
            DevelopmentUI  = settings.DevelopmentUI;
        }
    }
}

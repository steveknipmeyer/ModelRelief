// -----------------------------------------------------------------------
// <copyright file="SystemSettingsJson.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    /// <summary>
    /// Shared system settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// N.B. Newtonsoft.JSON cannot deserialize into an interface so this is a concrete class.
    ///      The front end (FE) uses an intefrace ISystemSettings with JSON.parse.
    /// </summary>
    public class SystemSettingsJson
    {
        public bool LoggingEnabled { get; set; }
        public bool DevelopmentUI { get; set; }
    }
}

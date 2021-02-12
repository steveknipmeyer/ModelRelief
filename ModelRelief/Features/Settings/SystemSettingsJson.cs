// -----------------------------------------------------------------------
// <copyright file="SystemSettingsJson.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    /// <summary>
    /// User settings.
    /// N.B. Newtonsoft.JSON cannot deserialize using an interface so this is a concrete class.
    ///      The front end (FE) uses an interface ISystemSettings with JSON.parse.
    /// </summary>
    public class SystemSettingsJson
    {
        public bool LoggingEnabled { get; set; }
        public bool DevelopmentUI { get; set; }

        public bool ModelViewerExtendedControls { get; set; }
        public bool MeshViewerExtendedControls { get; set; }
        public bool ExtendedCameraControls { get; set; }

        public bool DepthBufferViewVisible { get; set; }
        public bool NormalMapViewVisible { get; set; }
    }
}

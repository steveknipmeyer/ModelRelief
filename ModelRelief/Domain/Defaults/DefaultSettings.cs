// -----------------------------------------------------------------------
// <copyright file="DefaultSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain.Defaults
{
    /// <summary>
    /// Default camera settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public class DefaultSettings
    {
        public bool LoggingEnabled { get; set; }
        public bool DevelopmentUI { get; set; }

        public bool ModelViewerExtendedControls { get; set; }
        public bool MeshViewerExtendedControls { get; set; }
        public bool ExtendedCameraControls { get; set; }

        public bool DepthBufferViewVisible { get; set; }
        public bool NormalMapViewVisible { get; set; }

        /// <summary>
        /// Initialize the settings from JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public void Initialize(dynamic settingsJson)
        {
            LoggingEnabled = settingsJson.Settings.LoggingEnabled;
            DevelopmentUI = settingsJson.Settings.DevelopmentUI;

            ModelViewerExtendedControls = settingsJson.Settings.ModelViewerExtendedControls;
            MeshViewerExtendedControls = settingsJson.Settings.MeshViewerExtendedControls;
            ExtendedCameraControls = settingsJson.Settings.ExtendedCameraControls;

            DepthBufferViewVisible = settingsJson.Settings.DepthBufferViewVisible;
            NormalMapViewVisible = settingsJson.Settings.NormalMapViewVisible;
        }
    }
}

// -----------------------------------------------------------------------
// <copyright file="Default.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain.Defaults
{
    /// <summary>
    /// Default settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public static class Default
    {
        public const string SettingsFile = "Defaults.json";

        public static DefaultCameraSettings Camera { get; set; }
        public static DefaultSettings ProjectSettings { get; set; }
        public static DefaultMeshSettings Mesh { get; set; }

        /// <summary>
        /// Initializes static members of the <see cref="Default"/>  class.
        /// Constructor
        /// </summary>
        static Default()
        {
            Camera = new DefaultCameraSettings();
            Mesh = new DefaultMeshSettings();
            ProjectSettings = new DefaultSettings();
        }

        /// <summary>
        /// Initialize the settings from the JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public static void Initialize(dynamic settingsJson)
        {
            Camera.Initialize(settingsJson);
            Mesh.Initialize(settingsJson);
            ProjectSettings.Initialize(settingsJson);
        }
    }
}

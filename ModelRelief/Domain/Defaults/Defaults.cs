// -----------------------------------------------------------------------
// <copyright file="Defaults.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain
{
    /// <summary>
    /// Default settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public static class Defaults
    {
        public const string SettingsFile = "Defaults.json";

        public static DefaultCameraSettings Camera { get; set; }
        public static DefaultSettings ProjectSettings { get; set; }
        public static DefaultMeshSettings Mesh { get; set; }
        public static DefaultMeshTransformSettings MeshTransform { get; set; }
        public static DefaultModel3dSettings Model3d { get; set; }

        /// <summary>
        /// Initializes static members of the <see cref="Defaults"/>  class.
        /// Constructor
        /// </summary>
        static Defaults()
        {
            Camera = new DefaultCameraSettings();
            Mesh = new DefaultMeshSettings();
            MeshTransform = new DefaultMeshTransformSettings();
            Model3d = new DefaultModel3dSettings();
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
            MeshTransform.Initialize(settingsJson);
            Model3d.Initialize(settingsJson);
            ProjectSettings.Initialize(settingsJson);
        }
    }
}

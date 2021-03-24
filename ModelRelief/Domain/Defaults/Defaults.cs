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
        public static DefaultDepthBufferSettings DepthBuffer { get; set; }
        public static DefaultSettings ProjectSettings { get; set; }
        public static DefaultMeshSettings Mesh { get; set; }
        public static DefaultMeshTransformSettings MeshTransform { get; set; }
        public static DefaultModel3dSettings Model3d { get; set; }
        public static DefaultNormalMapSettings NormalMap { get; set; }
        public static DefaultResolutionSettings Resolution { get; set; }

        /// <summary>
        /// Initializes static members of the <see cref="Defaults"/>  class.
        /// Constructor
        /// </summary>
        static Defaults()
        {
            Camera = new DefaultCameraSettings();
            DepthBuffer = new DefaultDepthBufferSettings();
            Mesh = new DefaultMeshSettings();
            MeshTransform = new DefaultMeshTransformSettings();
            Model3d = new DefaultModel3dSettings();
            NormalMap = new DefaultNormalMapSettings();
            ProjectSettings = new DefaultSettings();
            Resolution = new DefaultResolutionSettings();
        }

        /// <summary>
        /// Initialize the settings from the JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public static void Initialize(dynamic settingsJson)
        {
            Camera.Initialize(settingsJson);
            DepthBuffer.Initialize(settingsJson);
            Mesh.Initialize(settingsJson);
            MeshTransform.Initialize(settingsJson);
            Model3d.Initialize(settingsJson);
            NormalMap.Initialize(settingsJson);
            ProjectSettings.Initialize(settingsJson);
            Resolution.Initialize(settingsJson);
        }
    }
}

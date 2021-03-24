// -----------------------------------------------------------------------
// <copyright file="DefaultMeshSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain.Defaults
{
    using ModelRelief.Domain;

    /// <summary>
    /// Default mesh settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public class DefaultMeshSettings
    {
        public MeshFormat Format { get; set; }

        /// <summary>
        /// Initialize the settings from JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public void Initialize(dynamic settingsJson)
        {
            Format = settingsJson.Mesh.Format;
        }
    }
}

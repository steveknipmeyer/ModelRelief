// -----------------------------------------------------------------------
// <copyright file="Settings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.Collections.Generic;

    public class Settings : DomainModel
    {
        public bool LoggingEnabled { get; set; }
        public bool DevelopmentUI { get; set; }

        public bool ModelViewerExtendedControls { get; set; }
        public bool MeshViewerExtendedControls { get; set; }
        public bool ExtendedCameraControls { get; set; }

        public bool DepthBufferViewVisible { get; set; }
        public bool NormalMapViewVisible { get; set; }

        // Navigation Propertiesa
        public ICollection<Project> Projects { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Settings"/> class.
        /// Default constructor.
        /// </summary>
        public Settings()
        {
        Name = "Default Settings";

        LoggingEnabled  = Defaults.ProjectSettings.LoggingEnabled;
        DevelopmentUI = Defaults.ProjectSettings.DevelopmentUI;

        ModelViewerExtendedControls = Defaults.ProjectSettings.ModelViewerExtendedControls;
        MeshViewerExtendedControls = Defaults.ProjectSettings.MeshViewerExtendedControls;
        ExtendedCameraControls = Defaults.ProjectSettings.ExtendedCameraControls;

        DepthBufferViewVisible = Defaults.ProjectSettings.DepthBufferViewVisible;
        NormalMapViewVisible = Defaults.ProjectSettings.NormalMapViewVisible;
        }
    }
}

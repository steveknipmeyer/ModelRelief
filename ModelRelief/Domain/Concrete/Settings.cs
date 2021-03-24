// -----------------------------------------------------------------------
// <copyright file="Settings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.Collections.Generic;
    using ModelRelief.Domain.Defaults;

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
        this.LoggingEnabled  = Default.ProjectSettings.LoggingEnabled;
        this.DevelopmentUI = Default.ProjectSettings.DevelopmentUI;

        this.ModelViewerExtendedControls = Default.ProjectSettings.ModelViewerExtendedControls;
        this.MeshViewerExtendedControls = Default.ProjectSettings.MeshViewerExtendedControls;
        this.ExtendedCameraControls = Default.ProjectSettings.ExtendedCameraControls;

        this.DepthBufferViewVisible = Default.ProjectSettings.DepthBufferViewVisible;
        this.NormalMapViewVisible = Default.ProjectSettings.NormalMapViewVisible;
        }
    }
}

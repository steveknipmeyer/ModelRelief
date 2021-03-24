﻿// -----------------------------------------------------------------------
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
        this.LoggingEnabled  = Defaults.ProjectSettings.LoggingEnabled;
        this.DevelopmentUI = Defaults.ProjectSettings.DevelopmentUI;

        this.ModelViewerExtendedControls = Defaults.ProjectSettings.ModelViewerExtendedControls;
        this.MeshViewerExtendedControls = Defaults.ProjectSettings.MeshViewerExtendedControls;
        this.ExtendedCameraControls = Defaults.ProjectSettings.ExtendedCameraControls;

        this.DepthBufferViewVisible = Defaults.ProjectSettings.DepthBufferViewVisible;
        this.NormalMapViewVisible = Defaults.ProjectSettings.NormalMapViewVisible;
        }
    }
}

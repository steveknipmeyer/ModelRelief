// -----------------------------------------------------------------------
// <copyright file="SystemSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Features.Settings
{
    using System.Security.Claims;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Database;

    /// <summary>
    /// User settings.
    /// </summary>
    public class SystemSettings
    {
        // browser console logging
        public bool LoggingEnabled { get; set;  }
        // development UI (extended menus, resource pages, etc.)
        public bool DevelopmentUI { get; set; }

        // extended ModelViewer controls (e.g. grid)
        public bool ModelViewerExtendedControls { get; set; }
        // extended MeshViewer controls
        public bool MeshViewerExtendedControls { get; set; }
        // extended camera controls
        public bool ExtendedCameraControls { get; set; }

        // DepthBufferView visible in Composer
        public bool DepthBufferViewVisible { get; set; }
        // NormalMapView visible in Composer
        public bool NormalMapViewVisible { get; set; }

        public SystemSettings(ClaimsPrincipal user)
        {
            // var applicationUser = await IdentityUtility.FindApplicationUserAsync(message.User);

            var services = new ServiceCollection();
            var provider = services.BuildServiceProvider();
            var dbContext = provider.GetService<ModelReliefDbContext>();

            var systemSettings = SettingsManager.GetSettings(SettingsManager.SystemType) as SystemSettingsJson;
            this.Initialize(systemSettings);
        }

        /// <summary>
        /// Assign the default user settings from JSON definitions.
        /// </summary>
        /// <param name="settings">Default user settings read from JSON.</param>
        public void Initialize(SystemSettingsJson settings)
        {
            this.LoggingEnabled = settings.LoggingEnabled;
            this.DevelopmentUI  = settings.DevelopmentUI;

            this.ModelViewerExtendedControls = settings.ModelViewerExtendedControls;
            this.MeshViewerExtendedControls = settings.MeshViewerExtendedControls;
            this.ExtendedCameraControls = settings.ExtendedCameraControls;

            this.DepthBufferViewVisible = settings.DepthBufferViewVisible;
            this.NormalMapViewVisible = settings.NormalMapViewVisible;
        }
    }
}

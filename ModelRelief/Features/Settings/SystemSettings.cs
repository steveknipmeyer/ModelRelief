// -----------------------------------------------------------------------
// <copyright file="SystemSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Features.Settings
{
    using System.Security.Claims;
    using ModelRelief.Database;
    using ModelRelief.Utility;

    /// <summary>
    /// User settings.
    /// </summary>
    public class SystemSettings : ISystemSettings
    {
        private ModelReliefDbContext DbContext { get; set; }

        // browser console logging
        public bool LoggingEnabled { get; set; }
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

        /// <summary>
        /// Initializes a new instance of the <see cref="SystemSettings"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">DBContext (from DI) </param>
        public SystemSettings(ModelReliefDbContext dbContext)
        {
            this.DbContext = dbContext;
        }

        /// <summary>
        /// Assign the default user settings from JSON definitions.
        /// </summary>
        public void InitializeFromJsonDefaults()
        {
            var settings = SettingsManager.GetSettings(SettingsManager.SystemType) as SystemSettingsJson;

            this.LoggingEnabled = settings.LoggingEnabled;
            this.DevelopmentUI = settings.DevelopmentUI;

            this.ModelViewerExtendedControls = settings.ModelViewerExtendedControls;
            this.MeshViewerExtendedControls = settings.MeshViewerExtendedControls;
            this.ExtendedCameraControls = settings.ExtendedCameraControls;

            this.DepthBufferViewVisible = settings.DepthBufferViewVisible;
            this.NormalMapViewVisible = settings.NormalMapViewVisible;
        }

        /// <summary>
        /// Assign the user settings from the active user (if defined)
        /// </summary>
        /// <param name="user">Active user</param>
        public void InitializeFromUser(ClaimsPrincipal user)
        {
            var applicationUser =  IdentityUtility.FindApplicationUserAsync(user).GetAwaiter().GetResult();
        }
    }
}

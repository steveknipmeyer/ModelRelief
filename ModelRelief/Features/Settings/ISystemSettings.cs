// -----------------------------------------------------------------------
// <copyright file="ISystemSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Features.Settings
{
    using System.Security.Claims;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Database;

    /// <summary>
    /// Interface for User settings.
    /// </summary>
    public interface ISystemSettings
    {
        bool LoggingEnabled { get; set; }
        bool DevelopmentUI { get; set; }

        bool ModelViewerExtendedControls { get; set; }
        bool MeshViewerExtendedControls { get; set; }
        bool ExtendedCameraControls { get; set; }

        bool DepthBufferViewVisible { get; set; }
        bool NormalMapViewVisible { get; set; }

        void InitializeFromUser(ClaimsPrincipal user);
    }
}

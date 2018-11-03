// -----------------------------------------------------------------------
// <copyright file="DefaultCameraSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    /// <summary>
    /// Shared camera settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public class DefaultCameraSettings
    {
        public double DefaultNearClippingPlane { get; set; }
        public double DefaultFarClippingPlane { get; set; }
        public double DefaultFieldOfView { get; set; }
        public double OrthographicFrustrumPlaneOffset { get; set; }
    }
}

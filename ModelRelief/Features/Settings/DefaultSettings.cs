// -----------------------------------------------------------------------
// <copyright file="DefaultSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    /// <summary>
    /// Shared camera settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public static class DefaultSettings
    {
        public static double NearClippingPlane { get; set; }
        public static double FarClippingPlane { get; set; }

        // Perspective
        public static double FieldOfView { get; set; }

        // Orthographic
        public static double OrthographicFrustrumPlaneOffset { get; set; }
        public static double LeftPlane { get; set; }
        public static double RightPlane { get; set; }
        public static double TopPlane { get; set; }
        public static double BottomPlane { get; set; }

        /// <summary>
        /// Assign the shared settings from JSON definitions.
        /// </summary>
        /// <param name="settings">Camera settings read from JSON.</param>
        public static void Initialize(DefaultSettingsJson settings)
        {
            NearClippingPlane               = settings.NearClippingPlane;
            FarClippingPlane                = settings.FarClippingPlane;

            // Perspective
            FieldOfView                     = settings.FieldOfView;

            // Orthographic
            OrthographicFrustrumPlaneOffset = settings.OrthographicFrustrumPlaneOffset;
            LeftPlane   = -OrthographicFrustrumPlaneOffset;
            RightPlane  = +OrthographicFrustrumPlaneOffset;
            TopPlane    = +OrthographicFrustrumPlaneOffset;
            BottomPlane = -OrthographicFrustrumPlaneOffset;
        }
    }
}

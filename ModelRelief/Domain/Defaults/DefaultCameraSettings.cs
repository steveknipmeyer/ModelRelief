// -----------------------------------------------------------------------
// <copyright file="DefaultCameraSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain
{
    /// <summary>
    /// Default camera settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public class DefaultCameraSettings
    {
        public double NearClippingPlane { get; set; }
        public double FarClippingPlane { get; set; }

        // Perspective
        public double FieldOfView { get; set; }

        // Orthographic
        public double OrthographicFrustrumPlaneOffset { get; set; }

        public double LeftPlane { get; set; }
        public double RightPlane { get; set; }
        public double TopPlane { get; set; }
        public double BottomPlane { get; set; }

        /// <summary>
        /// Initialize the settings from JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public void Initialize(dynamic settingsJson)
        {
            NearClippingPlane = settingsJson.Camera.NearClippingPlane;
            FarClippingPlane = settingsJson.Camera.FarClippingPlane;

            // Perspective
            FieldOfView = settingsJson.Camera.FieldOfView;

            // Orthographic
            OrthographicFrustrumPlaneOffset = settingsJson.Camera.OrthographicFrustrumPlaneOffset;

            // Orthographic
            LeftPlane = -OrthographicFrustrumPlaneOffset;
            RightPlane = +OrthographicFrustrumPlaneOffset;
            TopPlane = +OrthographicFrustrumPlaneOffset;
            BottomPlane = -OrthographicFrustrumPlaneOffset;
        }
    }
}

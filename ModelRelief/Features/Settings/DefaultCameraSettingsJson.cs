﻿// -----------------------------------------------------------------------
// <copyright file="DefaultCameraSettingsJson.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    /// <summary>
    /// Shared defaul camera settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// N.B. Newtonsoft.JSON cannot deserialize using an interface so this is a concrete class.
    ///      The front end (FE) uses an interface IDefaultCameraSettings with JSON.parse.
    /// </summary>
    public class DefaultCameraSettingsJson
    {
         public double NearClippingPlane { get; set; }
         public double FarClippingPlane { get; set; }
         public double FieldOfView { get; set; }
         public double OrthographicFrustrumPlaneOffset { get; set; }
    }
}

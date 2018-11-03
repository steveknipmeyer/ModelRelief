// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { HttpLibrary, MethodType, ContentType } from "Scripts/System/Http";

/**
 * @description The frustum planes of an orthographic camera.
 * @export
 * @interface IOrthographicFrustum
 */
export interface IOrthographicFrustum {
    left: number;
    right: number;
    top: number;
    bottom: number;
}


/**
 * @description JSON default camera settings.
  * @interface IDefaultCameraSettings
 */
export interface IDefaultCameraSettings {

    DefaultNearClippingPlane: number;
    DefaultFarClippingPlane: number;
    DefaultFieldOfView: number;
    OrthographicFrustrumPlaneOffset: number;
}

/**
 * @description CameraSettings
 * @export
 * @class CameraSettings
 */
export class CameraSettings  {
    // N.B. These settings are held in a separate class (rather than OrthographicCamera, PerspectiveCamera) to avoid circular dependencies between BaseCamera and its derived classes.
    public static DefaultNearClippingPlane: number;
    public static DefaultFarClippingPlane: number;

    // Perspective
    public static DefaultFieldOfView: number;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables

    // Orthographic
    public static OrthographicFrustumPlaneOffset: number;
    public static DefaultLeftPlane: number;
    public static DefaultRightPlane: number;
    public static DefaultTopPlane: number;
    public static DefaultBottomPlane: number;

    /**
     * @description Initialize the default settings from the common JSON file used to share settings between the front end (FE) and back end (BE).
     * @static
     */
    public static async initialize(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}settings/camera`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const defaultCameraSettings: IDefaultCameraSettings = JSON.parse(result.contentString) as unknown as IDefaultCameraSettings;

        // Clipping Planes
        CameraSettings.DefaultNearClippingPlane = defaultCameraSettings.DefaultNearClippingPlane;
        CameraSettings.DefaultFarClippingPlane = defaultCameraSettings.DefaultFarClippingPlane;

        // Perspective
        CameraSettings.DefaultFieldOfView = defaultCameraSettings.DefaultFieldOfView;

        // Orthographic
        CameraSettings.OrthographicFrustumPlaneOffset = defaultCameraSettings.OrthographicFrustrumPlaneOffset;
        CameraSettings.DefaultLeftPlane    = -CameraSettings.OrthographicFrustumPlaneOffset;
        CameraSettings.DefaultRightPlane   = +CameraSettings.OrthographicFrustumPlaneOffset;
        CameraSettings.DefaultTopPlane     = +CameraSettings.OrthographicFrustumPlaneOffset;
        CameraSettings.DefaultBottomPlane  = -CameraSettings.OrthographicFrustumPlaneOffset;
    }
}

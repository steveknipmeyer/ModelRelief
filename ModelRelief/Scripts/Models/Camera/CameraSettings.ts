// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

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
    public static initialize() {

        // Populate the shared settings from the JSON file.
        const DefaultCameraSettings = {
            DefaultNearClippingPlane:           0.1,
            DefaultFarClippingPlane:        10000.0,
            DefaultFieldOfView:                37.0,
            OrthographicFrustrumPlaneOffset:  100,
        };

        // Clipping Planes
        CameraSettings.DefaultNearClippingPlane = DefaultCameraSettings.DefaultNearClippingPlane;
        CameraSettings.DefaultFarClippingPlane = DefaultCameraSettings.DefaultFarClippingPlane;

        // Perspective
        CameraSettings.DefaultFieldOfView = DefaultCameraSettings.DefaultFieldOfView;

        // Orthographic
        CameraSettings.OrthographicFrustumPlaneOffset = DefaultCameraSettings.OrthographicFrustrumPlaneOffset;
        CameraSettings.DefaultLeftPlane    = -CameraSettings.OrthographicFrustumPlaneOffset;
        CameraSettings.DefaultRightPlane   = +CameraSettings.OrthographicFrustumPlaneOffset;
        CameraSettings.DefaultTopPlane     = +CameraSettings.OrthographicFrustumPlaneOffset;
        CameraSettings.DefaultBottomPlane  = -CameraSettings.OrthographicFrustumPlaneOffset;
    }
}

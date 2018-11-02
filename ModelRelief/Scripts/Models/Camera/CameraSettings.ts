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
    public static DefaultNearClippingPlane: number =    0.1;
    public static DefaultFarClippingPlane: number = 10000;

    // Perspective
    public static DefaultFieldOfView: number =   37;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables

    // Orthographic
    public static OrthographicFrustumPlaneOffset: number = 100;
    public static DefaultLeftPlane: number     = -CameraSettings.OrthographicFrustumPlaneOffset;
    public static DefaultRightPlane: number    = +CameraSettings.OrthographicFrustumPlaneOffset;
    public static DefaultTopPlane: number      = +CameraSettings.OrthographicFrustumPlaneOffset;
    public static DefaultBottomPlane: number   = -CameraSettings.OrthographicFrustumPlaneOffset;

}

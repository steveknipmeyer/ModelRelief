// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description CameraSettings
 * @export
 * @class CameraSettings
 * @extends {Model}
 */
export class CameraSettings  {
    // N.B. These settings are held in a separate class (rather than OrthographicCamera, PerspectiveCamera) to avoid circular dependencies between BaseCamera and its derived classes.
    static DefaultNearClippingPlane : number =    0.1;
    static DefaultFarClippingPlane  : number = 1000;

    // Perspective
    static DefaultFieldOfView  : number =   37;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables

    // Orthographics
    static FrustrumPlaneOffset : number = 100;
    static DefaultLeftPlane : number     = -CameraSettings.FrustrumPlaneOffset;
    static DefaultRightPlane : number    = +CameraSettings.FrustrumPlaneOffset;
    static DefaultTopPlane : number      = +CameraSettings.FrustrumPlaneOffset;
    static DefaultBottomPlane : number   = -CameraSettings.FrustrumPlaneOffset;
}
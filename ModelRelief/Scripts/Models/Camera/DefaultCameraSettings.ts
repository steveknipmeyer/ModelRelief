// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {ContentType, HttpLibrary, MethodType, ServerEndPoints } from "Scripts/System/Http";
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

    NearClippingPlane: number;
    FarClippingPlane: number;
    FieldOfView: number;
    OrthographicFrustrumPlaneOffset: number;
}

/**
 * @description DefaultCameraSettings
 * @export
 * @class DefaultCameraSettings
 */
export class DefaultCameraSettings  {
    // N.B. These settings are held in a separate class (rather than OrthographicCamera, PerspectiveCamera) to avoid circular dependencies between BaseCamera and its derived classes.
    public static NearClippingPlane: number;
    public static FarClippingPlane: number;

    // Perspective
    public static FieldOfView: number;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables

    // Orthographic
    public static OrthographicFrustumPlaneOffset: number;
    public static LeftPlane: number;
    public static RightPlane: number;
    public static TopPlane: number;
    public static BottomPlane: number;

    /**
     * @description Initialize the default settings from the common JSON file used to share settings between the front end (FE) and back end (BE).
     * @static
     */
    public static async initialize(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettings}/camera`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const defaultCameraSettings: IDefaultCameraSettings = JSON.parse(result.contentString) as unknown as IDefaultCameraSettings;

        // Clipping Planes
        DefaultCameraSettings.NearClippingPlane = defaultCameraSettings.NearClippingPlane;
        DefaultCameraSettings.FarClippingPlane  = defaultCameraSettings.FarClippingPlane;

        // Perspective
        DefaultCameraSettings.FieldOfView = defaultCameraSettings.FieldOfView;

        // Orthographic
        DefaultCameraSettings.OrthographicFrustumPlaneOffset = defaultCameraSettings.OrthographicFrustrumPlaneOffset;
        DefaultCameraSettings.LeftPlane    = -DefaultCameraSettings.OrthographicFrustumPlaneOffset;
        DefaultCameraSettings.RightPlane   = +DefaultCameraSettings.OrthographicFrustumPlaneOffset;
        DefaultCameraSettings.TopPlane     = +DefaultCameraSettings.OrthographicFrustumPlaneOffset;
        DefaultCameraSettings.BottomPlane  = -DefaultCameraSettings.OrthographicFrustumPlaneOffset;
    }
}

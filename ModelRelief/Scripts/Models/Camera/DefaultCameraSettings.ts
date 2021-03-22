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

    nearClippingPlane: number;
    farClippingPlane: number;
    fieldOfView: number;
    orthographicFrustrumPlaneOffset: number;
}

/**
 * @description DefaultCameraSettings
 * @export
 * @class DefaultCameraSettings
 */
export class DefaultCameraSettings  {
    // N.B. These settings are held in a separate class (rather than OrthographicCamera, PerspectiveCamera) to avoid circular dependencies between BaseCamera and its derived classes.
    public static nearClippingPlane: number;
    public static FarClippingPlane: number;

    // Perspective
    public static fieldOfView: number;       // 35mm vertical : https://www.nikonians.org/reviews/fov-tables

    // Orthographic
    public static orthographicFrustumPlaneOffset: number;
    public static leftPlane: number;
    public static rightPlane: number;
    public static topPlane: number;
    public static bottomPlane: number;

    /**
     * @description Initialize the default settings from the common JSON file used to share settings between the front end (FE) and back end (BE).
     * @static
     */
    public static async initialize(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettingsDefault}`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const defaultCameraSettings: IDefaultCameraSettings = JSON.parse(result.contentString) as unknown as IDefaultCameraSettings;

        // Clipping Planes
        DefaultCameraSettings.nearClippingPlane = defaultCameraSettings.nearClippingPlane;
        DefaultCameraSettings.FarClippingPlane  = defaultCameraSettings.farClippingPlane;

        // Perspective
        DefaultCameraSettings.fieldOfView = defaultCameraSettings.fieldOfView;

        // Orthographic
        DefaultCameraSettings.orthographicFrustumPlaneOffset = defaultCameraSettings.orthographicFrustrumPlaneOffset;
        DefaultCameraSettings.leftPlane    = -DefaultCameraSettings.orthographicFrustumPlaneOffset;
        DefaultCameraSettings.rightPlane   = +DefaultCameraSettings.orthographicFrustumPlaneOffset;
        DefaultCameraSettings.topPlane     = +DefaultCameraSettings.orthographicFrustumPlaneOffset;
        DefaultCameraSettings.bottomPlane  = -DefaultCameraSettings.orthographicFrustumPlaneOffset;
    }
}

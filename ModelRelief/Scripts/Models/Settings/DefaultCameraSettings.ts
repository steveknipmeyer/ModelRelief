// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
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
 * @description DefaultCameraSettings
 * @export
 * @class DefaultCameraSettings
 */
export class DefaultCameraSettings  {

    // N.B. These settings are held in a separate class (rather than OrthographicCamera, PerspectiveCamera) to avoid circular dependencies between BaseCamera and its derived classes.
    public nearClippingPlane: number;
    public farClippingPlane: number;

    // Perspective
    public fieldOfView: number;             // 35mm vertical : https://www.nikonians.org/reviews/fov-tables

    // Orthographic
    public orthographicFrustumPlaneOffset: number;
    public leftPlane: number;
    public rightPlane: number;
    public topPlane: number;
    public bottomPlane: number;

    /**
     * Creates an instance of DefaultCameraSettings.
     */
    constructor() {
        // NOP
    }

    /**
     * @description Initialize the default settings from the common JSON file used to share settings between the front end (FE) and back end (BE).
     * @static
     */
    // N.B. defaultSettings is dynamic (and intentially un-typed) as it assigned from the JSON settings
    //eslint-disable-next-line
    public async initialize(defaultSettings): Promise<void> {

        // Clipping Planes
        this.nearClippingPlane = defaultSettings.Camera.NearClippingPlane;
        this.farClippingPlane  = defaultSettings.Camera.FarClippingPlane;

        // Perspective
        this.fieldOfView = defaultSettings.Camera.FieldOfView;

        // Orthographic
        this.orthographicFrustumPlaneOffset = defaultSettings.Camera.OrthographicFrustrumPlaneOffset;
        this.leftPlane    = -this.orthographicFrustumPlaneOffset;
        this.rightPlane  = +this.orthographicFrustumPlaneOffset;
        this.topPlane    = +this.orthographicFrustumPlaneOffset;
        this.bottomPlane = -this.orthographicFrustumPlaneOffset;
    }
}

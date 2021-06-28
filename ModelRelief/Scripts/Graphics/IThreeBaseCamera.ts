// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description IThreeBaseCamera
 * @export
 * @class ITHREEBaseCamera
 * @extends {THREE.Camera}
 */
export interface IThreeBaseCamera extends THREE.Camera {
    // THREE.PerspectiveCamera and THREE.OrthographicCamera are derived from abstract THREE.Camera.
    //  However, the base class does not contain several members that are common to the derived classes.
    //  This interface represents the union of the common members in PerspectiveCamera and OrthographicCamera
    //  that are <not> in THREE.Camera.
    near: number;
    far: number;
    zoom: number;

    updateProjectionMatrix(): void;
}

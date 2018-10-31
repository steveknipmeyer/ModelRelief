// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";
import * as THREE from "three";

import {Format} from "Scripts/System/Format";
import {ConsoleLogger} from "Scripts/System/Logger";

/**
 * @description Input Controller
 * @export
 * @interface IInputController
 */
export interface IInputController {
    target: THREE.Vector3;          // target point of controller
    target0: THREE.Vector3;         // reset value
}

/**
 * Input Control Helper
 * General input controller utility methods.
 * @class
 */
export class InputControllerHelper {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @description Set the target point of the input controller to the default value.
     * @static
     * @param {IInputController} controller Input controller.
     * @param {THREE.Vector3} targetPoint Target point.
     * @param {boolean} [setReset=false] Also set the reset point used when resetting the controller.
     */
    public static setTarget(controller: IInputController, targetPoint: THREE.Vector3, setReset: boolean = false): void {

        controller.target = targetPoint;

        if (setReset)
            controller.target0 = targetPoint;
    }

    /**
     * @description Set the target point of the input controller to the default value.
     * @static
     * @param {IInputController} controller Input controller.
     * @param {THREE.Camera} camera Active camera.
     * @param {boolean} [setReset=false] Also set the reset point used when resetting the controller.
     */
    public static setDefaultTarget(controller: IInputController, camera: THREE.Camera, setReset: boolean = false): void {

        // Default camera view: -Z
        const unitTarget = new THREE.Vector3(0, 0, -1);

        // apply camera rotation
        unitTarget.applyQuaternion(camera.quaternion);

        // The target is not a direction vector it is a point in world space so the unitTarget must be translated to the camera position.
        const translatedUnitTarget = unitTarget.add(camera.position);

        InputControllerHelper.setTarget(controller, translatedUnitTarget, setReset);
    }

}

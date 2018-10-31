// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";
import * as THREE from "three";

import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";
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

    /**
     * @description Diagnostic tool for the input controller.
     * @static
     * @param {string} controllerName Controller name.
     * @param {IInputController} controller Active controller.
     * @param {THREE.Scene} scene Active scene.
     * @param {THREE.Camera} camera Active camera.
     */
    public static debugInputControllerProperties(controllerName: string, controller: IInputController, scene: THREE.Scene, camera: THREE.Camera): void {

        const consoleLogger: ConsoleLogger = new ConsoleLogger();
        const headerStyle   = "font-family : monospace; font-weight : bold; color : cyan; font-size : 14px";
        const messageStyle  = "font-family : monospace; color : white; font-size : 12px";

        consoleLogger.addMessage(`${controllerName}: Input Controller Properties`, headerStyle);
        consoleLogger.addMessage(`${Format.formatVector3("Camera Position", camera.position)}`, messageStyle);
        consoleLogger.addMessage(`${Format.formatVector3("Target", controller.target)}`, messageStyle);

        // construct root object of the helper
        const controllerHelper  = new THREE.Group();
        controllerHelper.name = ObjectNames.ControllerHelper;
        controllerHelper.visible = true;

        // remove existing
        Graphics.removeAllByName(scene, ObjectNames.ControllerHelper);

        // position
        const position = Graphics.createSphereMesh(camera.position, 3);
        controllerHelper.add(position);

        scene.add(controllerHelper);
    }
}

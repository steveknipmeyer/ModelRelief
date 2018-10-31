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

    eye: THREE.Vector3;             // eye
    lookAt: THREE.Vector3;          // camera lookat point
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
        consoleLogger.addMessage(`${Format.formatVector3("LookAt", controller.lookAt)}`, messageStyle);
        consoleLogger.addMessage(`${Format.formatVector3("Eye", controller.eye)}`, messageStyle);

        // construct root object of the helper
        const controllerHelper  = new THREE.Group();
        controllerHelper.name = ObjectNames.ControllerHelper;
        controllerHelper.visible = true;

        const redMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, opacity: 1.0} );
        const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, opacity: 1.0} );
        const sphereSize = 5;

        // remove existing graphics
        Graphics.removeAllByName(scene, ObjectNames.ControllerHelper);

        // position
        const eyeSphere = Graphics.createSphereMesh(camera.position, sphereSize, redMaterial);
        controllerHelper.add(eyeSphere);

        // lookAt
        const lookAtSphere = Graphics.createSphereMesh(controller.lookAt, sphereSize, blueMaterial);
        controllerHelper.add(lookAtSphere);

        scene.add(controllerHelper);
    }
}

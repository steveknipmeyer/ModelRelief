// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";
import * as THREE from "three";

import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";
import {Format} from "Scripts/System/Format";
import {ILogger} from "Scripts/System/Logger";

/**
 * @description Input Controller
 * @export
 * @interface IInputController
 */
export interface IInputController {
    target: THREE.Vector3;          // target point of controller
    target0: THREE.Vector3;         // reset value

    eye: THREE.Vector3;             // eye
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
            // NOP
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
     * @param {ILogger} logger Logger to use.
     * @param {string} controllerName Controller name.
     * @param {IInputController} controller Active controller.
     * @param {THREE.Scene} scene Active scene.
     * @param {THREE.Camera} camera Active camera.
     */
    public static debugInputControllerProperties(logger: ILogger, controllerName: string, controller: IInputController, scene: THREE.Scene, camera: THREE.Camera): void {

        const headerStyle   = "font-family : monospace; font-weight : bold; color : cyan; font-size : 14px";
        const messageStyle  = "font-family : monospace; color : white; font-size : 12px";

        logger.addMessage(`${controllerName}: Input Controller Properties`, headerStyle);
        logger.addMessage(`${Format.formatVector3("Target", controller.target)}`, messageStyle);
        logger.addMessage(`${Format.formatVector3("Eye", controller.eye)}`, messageStyle);
        logger.addMessage("Note: Target + Eye = Camera.Position", messageStyle);
        logger.addMessage(`${Format.formatVector3("Camera.Position", camera.position)}`, messageStyle);

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

        // target
        const targetSphere = Graphics.createSphereMesh(controller.target, sphereSize, blueMaterial);
        controllerHelper.add(targetSphere);

        scene.add(controllerHelper);
    }
}

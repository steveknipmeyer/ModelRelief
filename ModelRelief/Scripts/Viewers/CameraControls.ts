// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import { StandardView } from "Scripts/Api/V1/Interfaces/ICamera";
import { Graphics, ObjectNames } from "Scripts/Graphics/Graphics";
import { IThreeBaseCamera } from "Scripts/Graphics/IThreeBaseCamera";
import { BaseCamera } from "Scripts/Models/Camera/BaseCamera";
import { CameraFactory } from "Scripts/Models/Camera/CameraFactory";
import { CameraHelper } from "Scripts/Models/Camera/CameraHelper";
import { DefaultCameraSettings } from "Scripts/Models/Camera/DefaultCameraSettings";
import { EventType, IMREvent } from "Scripts/System/EventManager";
import { ElementAttributes, ElementIds } from "Scripts/System/Html";
import { Viewer } from "Scripts/Viewers/Viewer";

/**
 * @description CameraControls
 * @class CameraControlsSettings
 */
class CameraControlsSettings {

    public near: number;
    public far: number;
    public isPerspective: boolean;
    public fieldOfView: number;

    public standardView: StandardView = StandardView.Front;

    /**
     * Creates an instance of CameraControlsSettings.
     * @param {Camera} camera Perspective camera.
     */
    constructor(camera: THREE.Camera) {

        const baseCamera: IThreeBaseCamera = camera as IThreeBaseCamera;

        this.near = baseCamera.near;
        this.far = baseCamera.far;
        this.isPerspective = camera instanceof THREE.PerspectiveCamera;
        this.fieldOfView = this.isPerspective ? (camera as THREE.PerspectiveCamera).fov : DefaultCameraSettings.FieldOfView;

        this.standardView = StandardView.None;
    }
}
/**
 * @description UI options to expose camera settings controls.
 * @export
 * @interface CameraControlsOptions
 */
export interface ICameraControlsOptions {

    cameraHelper?: boolean;
    fieldOfView?: boolean;
    clippingControls?: boolean;
}

/**
 * @description Camera UI controls.
 * @export
 * @class CameraControls
 */
export class CameraControls {

    public viewer: Viewer;                          // associated viewer
    public settings: CameraControlsSettings;        // UI settings

    /**
     * Creates an instance of CameraControls.
     * @param {Viewer} viewer Associated viewer.
     * @param {ICameraControlsOptions} [controlOptions] Options to include/exclude specialized controls.
     */
    constructor(viewer: Viewer, controlOptions?: ICameraControlsOptions) {

        this.viewer = viewer;

        // UI Controls
        this.initializeControls(controlOptions);

        // Events
        this.initializeViewerEventListeners();
    }

    //#region Event Handlers
    /**
     * @description Initialize event listeners for controlled Viewer.
     * @private
     */
    private initializeViewerEventListeners(): void {

        // Camera
        this.viewer.eventManager.addEventListener(EventType.ViewerCameraProperties, (event: IMREvent, camera: IThreeBaseCamera) => {
            this.synchronizeSettingsFromViewCamera(camera);
        });

        // Camera Standard View
        this.viewer.eventManager.addEventListener(EventType.ViewerCameraStandardView, (event: IMREvent, standardView: StandardView) => {
            this.settings.standardView = standardView;
        });
    }

    /**
     * @description Fits the active view.
     */
    private fitView(): void {

        this.viewer.fitView();
    }

    /**
     * @description Adds a camera visualization graphic to the scene.
     */
    private addCameraHelper(): void {

        // remove existing
        Graphics.removeAllByName(this.viewer.scene, ObjectNames.CameraHelper);

        // World
        Graphics.addCameraHelper(this.viewer.camera, this.viewer.scene, this.viewer.modelGroup);

        // View
        const modelView = Graphics.cloneAndTransformObject(this.viewer.modelGroup, this.viewer.camera.matrixWorldInverse);
        const modelViewGroup = new THREE.Group();
        modelViewGroup.name = ObjectNames.ModelViewGroup;
        modelViewGroup.add(modelView);

        const cameraView = CameraHelper.getDefaultCamera(this.viewer.aspectRatio, this.viewer.camera instanceof THREE.PerspectiveCamera);
        Graphics.addCameraHelper(cameraView, this.viewer.scene, modelViewGroup);
    }

    /**
     * @description Force the far clipping plane to the model extents.
     */
    private boundClippingPlanes(): void {

        const baseCamera: BaseCamera = CameraFactory.constructFromViewCamera({}, this.viewer.camera);
        const clippingPlanes = baseCamera.getBoundingClippingPlanes(this.viewer.modelGroup);

        // camera
        this.viewer.camera.near = clippingPlanes.near;
        this.viewer.camera.far = clippingPlanes.far;
        this.viewer.camera.updateProjectionMatrix();

        // synchronize UI controls
        // WIP
    }
    //#endregion

    /**
     * @description Initialize the view settings that are controllable by the user
     * @param {ICameraControlsOptions} [controlOptions] Options to include/exclude specialized controls.
     */
    private initializeControls(controlOptions: ICameraControlsOptions = {}) {

        const {
            cameraHelper: showCameraHelper = true,
            fieldOfView: showFieldOfView = true,
            clippingControls: showClippingControls = true,
        } = controlOptions;

        this.settings = new CameraControlsSettings(this.viewer.camera);

        // Fit View
        const fitViewControl = document.querySelector(`#${this.viewer.viewContainerId} #${ElementIds.FitView}`);
        fitViewControl.addEventListener("click", (clickevent) => {
            this.fitView();
        });

        // Standard View
        const viewer = this.viewer;
        const standardViewControl = document.querySelector(`#${this.viewer.viewContainerId} #${ElementIds.StandardView}`);
        [].forEach.call(standardViewControl.children, (element) => {
            element.addEventListener('click', (clickEvent) => {

                const viewValue = element.text;
                var standardView = StandardView.None;
                switch (viewValue) {
                    case "Front":
                        standardView = StandardView.Front;
                        break;
                    case "Back":
                        standardView = StandardView.Back;
                        break;
                    case "Top":
                        standardView = StandardView.Top;
                        break;
                    case "Isometric":
                        standardView = StandardView.Isometric;
                        break;
                    case "Left":
                        standardView = StandardView.Left;
                        break;
                    case "Right":
                        standardView = StandardView.Right;
                        break;
                    case "Bottom":
                        standardView = StandardView.Bottom;
                        break;
                    default:
                        return;
                }
                viewer.setCameraToStandardView(standardView);
            }, false)
        });
    }

    /**
     * @description Update a UI control with a setting.
     * @param control Control to update.
     * @param value New setting.
     */
    private updateUIControl(control: dat.GUIController, value: any): void {
        // N.B. Not all UI controls may be present depending on the CameraControlsOptions.
        //      So, every UI control is tested for existence before being synchronized.

        if (!control)
            return;

        if (control.getValue() !== value)
            control.setValue(value);
    }

    /**
     * @description Synchronize the camera settings from an external camera.
     * @private
     * @param {IThreeBaseCamera} camera External camera.
     */
    private synchronizeSettingsFromViewCamera(camera: IThreeBaseCamera): void {

        this.settings.near = camera.near;
        this.settings.far = camera.far;

        this.settings.isPerspective = camera instanceof THREE.PerspectiveCamera;
        if (this.settings.isPerspective) {
            const perspectiveCamera = camera as THREE.PerspectiveCamera;
            this.settings.fieldOfView = perspectiveCamera.fov;
        }

        this.settings.standardView = StandardView.None;

        // synchronize UI controls
        // WIP
    }
}

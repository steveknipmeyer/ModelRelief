// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import * as dat from "dat.gui";
import * as THREE from "three";

import { StandardView } from "Scripts/Api/V1/Interfaces/ICamera";
import { Graphics, ObjectNames } from "Scripts/Graphics/Graphics";
import { IThreeBaseCamera } from "Scripts/Graphics/IThreeBaseCamera";
import { BaseCamera } from "Scripts/Models/Camera/BaseCamera";
import { CameraFactory } from "Scripts/Models/Camera/CameraFactory";
import { CameraHelper } from "Scripts/Models/Camera/CameraHelper";
import { DefaultSettings } from "Scripts/Models/Settings/DefaultSettings";
import { EventType, IMREvent } from "Scripts/System/EventManager";
import { ElementAttributes, ElementClasses, ElementIds } from "Scripts/System/Html";
import {SettingsManager} from "Scripts/System/SettingsManager";
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
    public cameraHelper: boolean;

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
        this.fieldOfView = this.isPerspective ? (camera as THREE.PerspectiveCamera).fov : DefaultSettings.camera.fieldOfView;
        this.cameraHelper = false;

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
    // N.B. Controls are instance members so they can be explicitly synchronized when an associated setting has changed.
    //      The dat.GUI API listen method can synchronize a control with it's setting data structure
    //      however it blocks the text field of a slider from being updated manually so listen is not used.
    //      https://github.com/dataarts/dat.gui/issues/179
    private _controlNearClippingPlane: dat.GUIController;
    private _controlFarClippingPlane: dat.GUIController;
    private _controlIsPerspective: dat.GUIController;
    private _controlFieldOfView: dat.GUIController;
    private _controlCameraHelper: dat.GUIController;

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
        if (!this.settings.cameraHelper)
            return;

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

        // UI controls
        this._controlNearClippingPlane.setValue(clippingPlanes.near);
        this._controlFarClippingPlane.setValue(clippingPlanes.far);
    }

    //#endregion

    /**
     * @description Initialize the StandardrView (Camera) control.
     * @private
     */
    private initializeStandardView(): void {

        const viewer = this.viewer;
        const standardViewControl = document.querySelector(`#${this.viewer.viewContainerId} .${ElementClasses.StandardViewMenu}`);

        for (const enumMember in StandardView) {

            const isValueProperty = parseInt(enumMember, 10) >= 0;
            if (!isValueProperty) {
                const viewName = enumMember;
                const viewValue = StandardView[enumMember];
                if (viewName === "None")
                    continue;

                const anchorElement: HTMLAnchorElement = document.createElement("a");
                anchorElement.text = viewName;
                anchorElement.setAttribute("data-view", viewValue);
                anchorElement.className = "dropdown-item";
                anchorElement.addEventListener("click", (clickEvent) => {
                    const targetElement : HTMLElement = <HTMLElement> clickEvent.target;
                    const standardView = parseInt(targetElement.getAttribute("data-view"), 10);
                    const newCamera = viewer.setCameraToStandardView(standardView);

                    this.synchronizeSettingsFromViewCamera(newCamera);
                }, false);

                standardViewControl.appendChild(anchorElement) ;
            }
        }
    }

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
        const fitViewControl = document.querySelector(`#${this.viewer.viewContainerId} .${ElementClasses.FitViewButton}`);
        fitViewControl.addEventListener("click", (clickevent) => {
            this.fitView();
        });

        // Standard View
        this.initializeStandardView();

        // Extended Controls
        if (SettingsManager.userSettings.extendedCameraControls) {

            // Init dat.gui and controls for the UI
            const gui = new dat.GUI({
                autoPlace: false,
                width: ElementAttributes.DatGuiWidth,
            });
            gui.domElement.id = ElementIds.CameraControls;

            let minimum: number;
            let maximum: number;
            let stepSize: number;

            // insert controls <after> Viewer container; class 'container-fluid' impacts layout
            const viewContainerDiv = document.getElementById(this.viewer.viewContainerId);
            viewContainerDiv.parentNode.insertBefore(gui.domElement, viewContainerDiv.nextSibling);

            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            //                                                                     Camera                                                                   //
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            const cameraOptions = gui.addFolder("Camera Options");

            // Clipping
            if (showClippingControls) {
                // Near Clipping Plane
                minimum = 0.1;
                maximum = DefaultSettings.camera.farClippingPlane;
                stepSize = 0.1;
                this._controlNearClippingPlane = cameraOptions.add(this.settings, "near").name("Near Clipping Plane").min(minimum).max(maximum).step(stepSize);
                this._controlNearClippingPlane.onChange((value) => {

                    this.viewer.camera.near = value;
                    this.viewer.camera.updateProjectionMatrix();
                });

                // Far Clipping Plane
                minimum = 1;
                maximum = DefaultSettings.camera.farClippingPlane;
                stepSize = 0.1;
                this._controlFarClippingPlane = cameraOptions.add(this.settings, "far").name("Far Clipping Plane").min(minimum).max(maximum).step(stepSize);
                this._controlFarClippingPlane.onChange((value) => {

                    this.viewer.camera.far = value;
                    this.viewer.camera.updateProjectionMatrix();
                });

                // Bound Clipping Planes
                const controlBoundClippingPlanes = cameraOptions.add(this, "boundClippingPlanes").name("Bound Clipping Planes");
            }

            // Perspective
            this._controlIsPerspective = cameraOptions.add(this.settings, "isPerspective").name("Perspective");
            this._controlIsPerspective.onChange((value) => {

                // toggle projection
                const newCamera: IThreeBaseCamera = CameraFactory.constructViewCameraOppositeProjection(this.viewer.camera);

                // update Viewer
                this.viewer.camera = newCamera;
                this.viewer.fitView();

                // synchronize UI settings
                this.synchronizeSettingsFromViewCamera(newCamera);
            });

            // Field of View
            if (showFieldOfView) {
                minimum = 25;
                maximum = 75;
                stepSize = 1;
                this._controlFieldOfView = cameraOptions.add(this.settings, "fieldOfView").name("Field of View").min(minimum).max(maximum).step(stepSize);
                this._controlFieldOfView.onChange((value) => {
                    if (this.viewer.camera instanceof THREE.PerspectiveCamera) {
                        this.viewer.camera.fov = value;
                        this.viewer.camera.updateProjectionMatrix();
                    }
                });
            }

            // CameraHelper
            if (showCameraHelper) {
                this._controlCameraHelper = cameraOptions.add(this.settings, "cameraHelper").name("Camera Helper");
                this._controlCameraHelper.onChange((value) => {
                    this.addCameraHelper();
                });
            }

            cameraOptions.open();
        }
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
        control.updateDisplay();
    }

    /**
     * @description Synchronize the camera settings from an external camera.
     * @private
     * @param {IThreeBaseCamera} camera External camera.
     */
    private synchronizeSettingsFromViewCamera(camera: IThreeBaseCamera): void {

        this.settings.near = camera.near;
        this.updateUIControl(this._controlNearClippingPlane, this.settings.near);

        this.settings.far = camera.far;
        this.updateUIControl(this._controlFarClippingPlane, this.settings.far);

        this.settings.isPerspective = camera instanceof THREE.PerspectiveCamera;
        this.updateUIControl(this._controlIsPerspective, this.settings.isPerspective);

        if (this.settings.isPerspective) {
            const perspectiveCamera = camera as THREE.PerspectiveCamera;
            this.settings.fieldOfView = perspectiveCamera.fov;
            this.updateUIControl(this._controlFieldOfView, this.settings.fieldOfView);
        }
        this.settings.standardView = StandardView.None;

        // synchronize UI controls
        // WIP
    }
}

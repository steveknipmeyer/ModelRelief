﻿// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto from "Scripts/Api/V1//Models/DtoModels";
import * as THREE from "three";

import {assert} from "chai";
import {DepthBufferFormat} from "Scripts/Api/V1/Interfaces/IDepthBuffer";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {DefaultCameraSettings} from "Scripts/Models/Camera/DefaultCameraSettings";
import {CameraHelper} from "Scripts/Models/Camera/CameraHelper";
import {PerspectiveCamera} from "Scripts/Models/Camera/PerspectiveCamera";
import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {Image} from "Scripts/System/Image";
import {Services} from "Scripts/System/Services";
import {InputControllerHelper} from "Scripts/Viewers/InputControllerHelper";
import {Viewer} from "Scripts/Viewers/Viewer";

/**
 * @description Unit test harness.
 * @export
 * @class UnitTests
 */
export class UnitTests {

    private static DefaultTolerance = 0.001;

    private static _passStyle = "font-family : monospace; color : SpringGreen; font-size : 12px";
    private static _failStyle = "font-family : monospace; color : Red; font-size : 12px";

    /**
     * @description Logs a test result.
     * @private
     * @static
     * @param {string} test Name of the test.
     * @param {boolean} result Test result.
     */
    private static logResult (test: string, result: boolean): void {

        const message = `${test}: ${result ? "Pass" : "Fail"}`;
        const style = result ? this._passStyle : this._failStyle;
        Services.defaultLogger.addMessage(message, style);
    }

    /**
     * @description Determines whether two matrices are equal within the given tolerance.
     * @static
     * @param {number} m1 First matrix to compare.
     * @param {number} m2 Second matrix to compare.
     * @param {string} property Property name.
     * @param {number} [tolerance=UnitTests.DefaultVectorTolerance] Tolerance.
     */
    private static matricesEqualWithinTolerance(m1: THREE.Matrix, m2: THREE.Matrix, property: string, tolerance = UnitTests.DefaultTolerance): void {

        const formatTag = "TAG";
        const errorMessage = `${property}: M[${formatTag}] of the matrices are not equal within ${tolerance}`;

        const m1Elements = m1.elements;
        const m2Elements = m2.elements;
        assert.equal(m1Elements.length, m2Elements.length);

        const length = m1Elements.length;
        for (let iElement = 0; iElement < length; iElement++) {
            assert.closeTo(m1Elements[iElement], m2Elements[iElement], tolerance, errorMessage.replace(formatTag, iElement.toString()));
        }
    }

    /**
     * @description Determines whether two scalars are equal within the given tolerance.
     * @static
     * @param {number} s1 First scalar to compare.
     * @param {number} s2 Second scalar to compare.
     * @param {string} property Property name.
     * @param {number} [tolerance=UnitTests.DefaultVectorTolerance] Tolerance.
     */
    private static scalarsEqualWithinTolerance(s1: number, s2: number, property: string, tolerance = UnitTests.DefaultTolerance): void {

        assert.closeTo(s1, s2, tolerance, `${property}: The values of the scalars are not equal within ${tolerance}`);
    }

    /**
     * @description Determines whether two vectors are equal within the given tolerance.
     * @static
     * @param {THREE.Vector3} v1 First vector to compare.
     * @param {THREE.Vector3} v2 Second vector to compare.
     * @param {string} property Property name.
     * @param {number} [tolerance=UnitTests.DefaultVectorTolerance] Tolerance.
     */
    private  static vectorsEqualWithinTolerance(v1: THREE.Vector3, v2: THREE.Vector3, property: string, tolerance = UnitTests.DefaultTolerance): void {

        const formatTag = "TAG";
        const errorMessage = `${property}: The ${formatTag} values of the vectors are not equal within ${tolerance}`;
        assert.closeTo(v1.x, v2.x, tolerance, errorMessage.replace(formatTag, "X"));
        assert.closeTo(v1.y, v2.y, tolerance, errorMessage.replace(formatTag, "Y"));
        assert.closeTo(v1.z, v2.z, tolerance, errorMessage.replace(formatTag, "Z"));
    }

    /**
     * @description Determines whether two quaternions are equal within the given tolerance.
     * @static
     * @param {THREE.Quaternion} q1 First quaternion to compare.
     * @param {THREE.Quaternion} q2 Second quaternion to compare.
     * @param {string} property Property name.
     * @param {number} [tolerance=UnitTests.DefaultVectorTolerance] Tolerance.
     */
    private static quaternionsEqualWithinTolerance(q1: THREE.Quaternion, q2: THREE.Quaternion, property: string, tolerance = UnitTests.DefaultTolerance): void {

        const formatTag = "TAG";
        const errorMessage = `${property}: The ${formatTag} values of the quaternions are not equal within ${tolerance}`;
        assert.closeTo(q1.x, q2.x, tolerance, errorMessage.replace(formatTag, "X"));
        assert.closeTo(q1.y, q2.y, tolerance, errorMessage.replace(formatTag, "Y"));
        assert.closeTo(q1.z, q2.z, tolerance, errorMessage.replace(formatTag, "Z"));
        assert.closeTo(q1.w, q2.w, tolerance, errorMessage.replace(formatTag, "W"));
    }

    /**
     * @description Returns a random scalar within the given range.
     * @static
     * @param {number} scale The range of the scalar. (default = 1).
     * @returns {number}
     */
    private static generateScalar(scale = 1): number {

        const scalar = Math.random() * scale;
        return scalar;
    }

    /**
     * @description Returns a 3D vector with random coordinates.
     * @static
     * @param {number} scale The range of a coordinate. (default = 1).
     * @returns {THREE.Vector3}
     */
    private static generateVector3(scale: number = 1): THREE.Vector3 {

        const vector = new THREE.Vector3(Math.random() * scale, Math.random() * scale, Math.random() * scale);
        return vector;
    }

    /**
     * @description Returns a quaternion with random values.
     * @static
     * @returns {THREE.Quaternion}
     */
    private static generateQuaternion(): THREE.Quaternion {

        const quaternion = new THREE.Quaternion(Math.random(), Math.random(), Math.random(), Math.random());
        return quaternion;
    }

    /**
     * @description Compares the settings of two perspective cameras.
     * @static
     * @param {THREE.PerspectiveCamera} c1 First camera to compare.
     * @param {THREE.PerspectiveCamera} c2 Second camera to compare.
     */
    private static comparePerspectiveCameras(c1: THREE.PerspectiveCamera, c2: THREE.PerspectiveCamera): boolean {

        try {
            this.scalarsEqualWithinTolerance(c1.fov, c2.fov, "fov");
            this.scalarsEqualWithinTolerance(c1.aspect, c2.aspect, "aspect");
            this.scalarsEqualWithinTolerance(c1.near, c2.near, "near");
            this.scalarsEqualWithinTolerance(c1.far, c2.far, "far");

            this.vectorsEqualWithinTolerance(c1.position, c2.position, "position");

            this.matricesEqualWithinTolerance(c1.matrix, c2.matrix, "matrix");
            this.matricesEqualWithinTolerance(c1.projectionMatrix, c2.projectionMatrix, "projectionMatrix");

            this.vectorsEqualWithinTolerance(c1.scale, c2.scale, "scale");

            this.vectorsEqualWithinTolerance(c1.up, c2.up, "up");

            // WIP: These camera properties do not roundtrip however the matrix and projectionMatrix do roundtrip correctly.
            // this.quaternionsEqualWithinTolerance(c1.quaternion, c2.quaternion, 'quaternion');
            // this.vectorsEqualWithinTolerance(c1.getWorldDirection(), c2.getWorldDirection(), 'worldDirection');
            return true;
        }
        catch (exception) {
            Services.defaultLogger.addMessage(`Cameras are not equal: ${exception.message}`, this._failStyle);
            return false;
        }
    }

    /**
     * @description Round trip an array of bytes.
     * @static
     */
    public static async binaryRoundtripAsync(): Promise<void> {

        // Arrange
        const originalByteArray = new Uint8Array(256);
        for (let iByte = 0; iByte < 256; iByte++) {
            originalByteArray[iByte] = iByte;
        }

        const depthBuffer = new Dto.DepthBuffer({
            name : "DepthBuffer",
            description: "Unit Test",
            format: DepthBufferFormat.SDB,
            width: 16,
            height: 16,
        });
        const depthBufferModel = await depthBuffer.postFileAsync(originalByteArray);

        // Act
        const readByteArray = await depthBufferModel.getFileAsync();

        // Assert
        assert.deepEqual(originalByteArray, readByteArray, "Byte arrays are equal.");
    }

    public static vertexMapping(depthBuffer: DepthBuffer, mesh: THREE.Mesh): void {

        const image = new Image(depthBuffer.width, depthBuffer.height, depthBuffer.rgbaArray);

        const meshGeometry: THREE.Geometry = mesh.geometry as THREE.Geometry;
        meshGeometry.computeBoundingBox();
        const boundingBox = meshGeometry.boundingBox;

        // width  = 3              3   4   5
        // column = 2              0   1   2
        // buffer length = 6

        // Test Points
        const lowerLeft  = boundingBox.min;
        const lowerRight = new THREE.Vector3 (boundingBox.max.x, boundingBox.min.y, 0);
        const upperRight = boundingBox.max;
        const upperLeft  = new THREE.Vector3 (boundingBox.min.x, boundingBox.max.y, 0);
        const center     = boundingBox.getCenter(new THREE.Vector3());

        // Expected Values
        const bufferLength: number = (depthBuffer.width * depthBuffer.height);

        const firstColumn: number = 0;
        const lastColumn: number = depthBuffer.width - 1;
        const centerColumn: number = Math.round(depthBuffer.width / 2);
        const firstRow: number = 0;
        const lastRow: number = depthBuffer.height - 1;
        const centerRow: number = Math.round(depthBuffer.height / 2);

        const lowerLeftIndex: number = 0;
        const lowerRightIndex: number = depthBuffer.width - 1;
        const upperRightIndex: number = bufferLength - 1;
        const upperLeftIndex: number = bufferLength - depthBuffer.width;
        const centerIndex: number = (centerRow * depthBuffer.width) +  Math.round(depthBuffer.width / 2);

        const lowerLeftIndices: THREE.Vector2 = new THREE.Vector2(firstRow, firstColumn);
        const lowerRightIndices: THREE.Vector2 = new THREE.Vector2(firstRow, lastColumn);
        const upperRightIndices: THREE.Vector2 = new THREE.Vector2(lastRow, lastColumn);
        const upperLeftIndices: THREE.Vector2 = new THREE.Vector2(lastRow, firstColumn);
        const centerIndices: THREE.Vector2 = new THREE.Vector2(centerRow, centerColumn);

        let index: number;
        let indices: THREE.Vector2;

        // Lower Left
        indices = image.getModelVertexIndices(lowerLeft, boundingBox);
        assert.deepEqual(indices, lowerLeftIndices);

        index   = image.getModelVertexIndex(lowerLeft, boundingBox);
        assert.equal(index, lowerLeftIndex);

        // Lower Right
        indices = image.getModelVertexIndices(lowerRight, boundingBox);
        assert.deepEqual(indices, lowerRightIndices);

        index = image.getModelVertexIndex(lowerRight, boundingBox);
        assert.equal(index, lowerRightIndex);

        // Upper Right
        indices = image.getModelVertexIndices(upperRight, boundingBox);
        assert.deepEqual(indices, upperRightIndices);

        index = image.getModelVertexIndex(upperRight, boundingBox);
        assert.equal(index, upperRightIndex);

        // Upper Left
        indices = image.getModelVertexIndices(upperLeft, boundingBox);
        assert.deepEqual(indices, upperLeftIndices);

        index = image.getModelVertexIndex(upperLeft, boundingBox);
        assert.equal(index, upperLeftIndex);

        // Center
        indices = image.getModelVertexIndices(center, boundingBox);
        assert.deepEqual(indices, centerIndices);

        index = image.getModelVertexIndex(center, boundingBox);
        assert.equal(index, centerIndex);
    }

    /**
     * @description Debug a camera.
     */
    public static debugCamera(viewer: Viewer): void {
        CameraHelper.debugCameraProperties(viewer.camera, viewer.modelGroup, "debugCamera");
    }

    /**
     * @description Debug an IInputController.
     */
    public static debugInputController(viewer: Viewer): void {
        InputControllerHelper.debugInputControllerProperties(viewer.name, viewer.controls, viewer.scene, viewer.camera);
    }

    /**
     * @description Tests whether a Perspective camera can be re-constructed from the DTO Camera properties.
     * @static
     */
    public static randomizedRoundTripCamera(): void {

        // WIP: Randomly generated cameras do not roundtrip the matrix property. However, cameras created and manipulated through views work fine.

        const trials = 5;
        for (let iTrial = 0; iTrial < trials; iTrial++) {

            // construct random PerspectiveCamera
            const fieldOfView = this.generateScalar(50);
            const aspect = this.generateScalar(1.0);
            const nearClippingPlane = this.generateScalar(10);
            const farClippingPlane = nearClippingPlane + this.generateScalar(DefaultCameraSettings.FarClippingPlane);

            const perspectiveCamera = new THREE.PerspectiveCamera(fieldOfView, aspect, nearClippingPlane, farClippingPlane);

            const position = this.generateVector3(500);
            const quaternion = this.generateQuaternion();
            const scale = this.generateVector3();
            const up = this.generateVector3();
            perspectiveCamera.matrix.compose(position, quaternion, scale);
            perspectiveCamera.up.copy(up);

            // set position/rotation/scale attributes
            perspectiveCamera.matrix.decompose(perspectiveCamera.position, perspectiveCamera.quaternion, perspectiveCamera.scale);

            perspectiveCamera.updateMatrix();
            perspectiveCamera.updateMatrixWorld(true);
            perspectiveCamera.updateProjectionMatrix();

            // constructor
            const camera = new PerspectiveCamera({
                id: 1,
                name: "Perspective Camera",
                description: "This camera has random properties.",
            }, perspectiveCamera);

            const cameraModel = camera.toDtoModel();
            CameraFactory.constructFromDtoModelAsync(cameraModel).then((cameraRoundtrip) => {
                const c1 = camera.viewCamera;
                const c2 = cameraRoundtrip.viewCamera as THREE.PerspectiveCamera;

                const result = this.comparePerspectiveCameras(c1, c2);
                this.logResult("Randomized Round Trip Camera", result);
            });
        }
    }

    /**
     * @description Roundtrip a PerspectiveCamera through the DTO model.
     */
    public static roundTripCamera(viewer: Viewer): void {

        if (viewer.camera instanceof THREE.PerspectiveCamera) {

            const camera = new PerspectiveCamera({}, viewer.camera as THREE.PerspectiveCamera);
            const cameraModel = camera.toDtoModel();

            CameraFactory.constructFromDtoModelAsync(cameraModel).then((cameraRoundtrip) => {
                const perspectiveCameraRoundTrip = cameraRoundtrip.viewCamera as THREE.PerspectiveCamera;

                const distortCamera = false;
                if (distortCamera) {
                    const deltaPosition: THREE.Vector3 = new THREE.Vector3();
                    deltaPosition.copy(perspectiveCameraRoundTrip.position);
                    const delta = 0.5;
                    perspectiveCameraRoundTrip.position.set(deltaPosition.x + delta, deltaPosition.y, deltaPosition.z);
                }
                const result = this.comparePerspectiveCameras(camera.viewCamera, perspectiveCameraRoundTrip);
                viewer.camera = cameraRoundtrip.viewCamera;

                this.logResult("Round Trip Camera Z", result);
            });
        }
    }

    /**
     * @description Roundtrip a PerspectiveCamera through matrix copy.
     */
    public static roundTripCameraX(viewer: Viewer): void {

        // https://stackoverflow.com/questions/29221795/serializing-camera-state-in-threejs

        const originalCamera = viewer.camera as THREE.PerspectiveCamera;
        const newCamera = new THREE.PerspectiveCamera();

        // directly copy original camera matrix
        const originalCameraMatrixArray = originalCamera.matrix.toArray();
        newCamera.matrix.fromArray(originalCameraMatrixArray);


        // set attributes
        newCamera.matrix.decompose(newCamera.position, newCamera.quaternion, newCamera.scale);

        newCamera.up.copy(originalCamera.up);
        newCamera.fov = originalCamera.fov;
        newCamera.near = originalCamera.near;
        newCamera.far = originalCamera.far;

        newCamera.updateProjectionMatrix();

        const result = this.comparePerspectiveCameras(originalCamera, newCamera);
        viewer.camera = newCamera;

        this.logResult("Round Trip Camera X", result);
    }

    /**
     * @description Roundtrip a PerspectiveCamera through matrix reconstruction.
     */
    public static roundTripCameraY(viewer: Viewer): void {

        // https://stackoverflow.com/questions/29221795/serializing-camera-state-in-threejs

        const originalCamera = viewer.camera as THREE.PerspectiveCamera;
        const newCamera = new THREE.PerspectiveCamera();

        // construct viewing matrix from original camera properties
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        originalCamera.matrix.decompose(position, quaternion, scale);
        newCamera.matrix.compose(position, quaternion, scale);


        // set attributes
        newCamera.matrix.decompose(newCamera.position, newCamera.quaternion, newCamera.scale);

        newCamera.up.copy(originalCamera.up);
        newCamera.fov = originalCamera.fov;
        newCamera.near = originalCamera.near;
        newCamera.far = originalCamera.far;

        newCamera.updateProjectionMatrix();

        const result = this.comparePerspectiveCameras(originalCamera, newCamera);
        viewer.camera = newCamera;

        this.logResult("Round Trip Camera Y", result);
    }

    /**
     * Default constructor
     * @class UnitTests
     * @constructor
     */
    constructor() {
        // NOP
    }
}


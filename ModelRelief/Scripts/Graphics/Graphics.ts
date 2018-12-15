// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {Services} from "Scripts/System/Services";

/**
 * @description Default names of graphics objects.
 * @export
 * @enum {number}
 */
export enum ObjectNames {

    Root                    =  "Root",

    BoundingBox             = "Bounding Box",
    Box                     = "Box",
    CameraHelper            = "CameraHelper",
    ControllerHelper        = "ControllerHelper",
    ImageFactoryModelGroup  = "ImageFactoryModelGroup",             // collection of THREE.Mesh in an ImageFactory
    ImagePlane              = "ImagePlane",                         // ImageFactory
    MeshGroup               = "MeshGroup",                          // single THREE.Mesh such as a constructed relief
    ModelGroup              = "ModelGroup",                         // collection of THREE.Mesh
    ModelViewGroup          = "ModelViewGroup",                     // CameraHelper
    ModelClone              = "Model Clone",
    OBJModelGroup           = "OBJModelGroup",                      // collection of THREE.Mesh from an OBJ model
    Plane                   = "Plane",
    Sphere                  = "Sphere",
    Triad                   = "Triad",
}

/**
 * @description General THREE.js/WebGL support routines
 * @export
 * @class Graphics
 */
export class Graphics {

//#region Geometry
    /* --------------------------------------------------------------------------------------------------------------------------------------//
    //          Geometry
    // --------------------------------------------------------------------------------------------------------------------------------------*/
    private static logger  = Services.defaultLogger;

    /**
     * @description Dispose of resources held by a graphical object.
     * @static
     * @param {any} object3d Object to process.
     * https://stackoverflow.com/questions/18357529/threejs-remove-object-from-scene
     */
    private static disposeResources(object3d): void {

        if (!object3d.isMesh)
            return;

        Graphics.logger.addInfoMessage ("Disposing Mesh: " + object3d.name);

        const disposeMaterial = (material) => {
            //Graphics.logger.addInfoMessage ("\tdispose Material: " + material.name);
            material.dispose();

            // dispose textures
            for (const key of Object.keys(material)) {
                const value = material[key];
                // property of type Texture?
                if (value && typeof value === "object" && "minFilter" in value) {
                    //Graphics.logger.addInfoMessage ("\tdispose Texture: " + value.name);
                    value.dispose();
                }
            }
        };

        //Graphics.logger.addInfoMessage ("\tdispose Geometry: " + object3d.geometry.name);
        object3d.geometry.dispose();

        // single material
        if (object3d.material.isMaterial) {
            disposeMaterial(object3d.material);
        // array of materials
        } else {
            for (const material of object3d.material)
                disposeMaterial(material);
        }
    }

    /**
     * @description Removes an object and all children from a scene.
     * @static
     * @param {THREE.Object3D} rootObject Parent object (possibly with children).
     * @param {boolean} removeRoot Remove root object itself.
     * @returns
     */
    public static removeObjectChildren(rootObject: THREE.Object3D, removeRoot: boolean) {

        if (!rootObject)
            return;

        // dispose of resources
        const disposer = (object3d) => {

            if (object3d === rootObject) {
                return;
            }
            Graphics.disposeResources(object3d);
        };
        rootObject.traverse(disposer);

        // remove root children from rootObject (backwards!)
        for (let iChild: number = (rootObject.children.length - 1); iChild >= 0; iChild--) {

            const child: THREE.Object3D = rootObject.children[iChild];
            rootObject.remove (child);
        }

        // finally, remove root also?
        if (removeRoot && rootObject.parent)
            rootObject.parent.remove(rootObject);
    }

    /**
     * @description Remove all objects of a given name from the scene.
     * @static
     * @param {THREE.Scene} scene Scene to process.
     * @param {string} objectName Object name to find.
     */
    public static removeAllByName(scene: THREE.Scene, objectName: string): void {

        let object: THREE.Object3D = scene.getObjectByName(objectName);
        while (object != null) {

            Graphics.disposeResources(object);
            object.parent.remove(object);
            object = scene.getObjectByName(objectName);
        }
    }

    /**
     * @description Clone and transform an object.
     * @static
     * @param {THREE.Object3D} object Object to clone and transform.
     * @param {THREE.Matrix4} [matrix] Transformation matrix.
     * @returns {THREE.Object3D}
     */
    public static cloneAndTransformObject(object: THREE.Object3D, matrix?: THREE.Matrix4): THREE.Object3D {

        const methodTag: string = Services.timer.mark("cloneAndTransformObject");
        if (!matrix)
            matrix = new THREE.Matrix4();

        // clone object (and geometry!)
        const cloneTag: string = Services.timer.mark("clone");
        const objectClone: THREE.Object3D = object.clone();
        objectClone.traverse((traversalObject) => {
            if (traversalObject instanceof (THREE.Mesh)) {
                traversalObject.geometry = traversalObject.geometry.clone();
            }
        });
        Services.timer.logElapsedTime(cloneTag);

        // N.B. Important! The postion, rotation (quaternion) and scale are correct but the matrix has not been updated.
        // THREE.js updates the matrix in the render() loop.
        const transformTag: string = Services.timer.mark("transform");
        objectClone.updateMatrixWorld(true);

        // transform
        objectClone.applyMatrix(matrix);
        Services.timer.logElapsedTime(transformTag);

        Services.timer.logElapsedTime(methodTag);
        return objectClone;
    }

    /**
     * @description Gets the bounding box of a transformed object.
     * @static
     * @param {THREE.Object3D} object Object to transform.
     * @param {THREE.Matrix4} matrix Transformation matrix.
     * @returns {THREE.Box3}
     */
    public static getTransformedBoundingBox(object: THREE.Object3D, matrix: THREE.Matrix4): THREE.Box3 {

        const methodTag: string = Services.timer.mark("getTransformedBoundingBox");

        object.updateMatrixWorld(true);
        object.applyMatrix(matrix);
        const boundingBox: THREE.Box3 = Graphics.getBoundingBoxFromObject(object);

        // restore object
        const matrixIdentity = new THREE.Matrix4();
        const matrixInverse = matrixIdentity.getInverse(matrix, true);
        object.applyMatrix(matrixInverse);

        Services.timer.logElapsedTime(methodTag);
        return boundingBox;
    }

    /**
     * @description Create a bounding box from a geometry object.
     * @static
     * @param {THREE.Vector3} position Location of bounding box.
     * @param {THREE.Geometry} geometry Source geometry object.
     * @param {THREE.Material} material Material of the bounding box.
     * @returns {THREE.Mesh}
     */
    public static createBoundingBoxMeshFromGeometry(position: THREE.Vector3, geometry: THREE.Geometry, material: THREE.Material): THREE.Mesh {

        let boundingBox: THREE.Box3;
        let boxMesh: THREE.Mesh;

        geometry.computeBoundingBox();
        boundingBox = geometry.boundingBox;

        boxMesh = this.createBoundingBoxMeshFromBoundingBox (position, boundingBox, material);

        return boxMesh;
    }

    /**
     * @description Creates a bounding box mesh from a bounding box object.
     * @static
     * @param {THREE.Vector3} position Location of box.
     * @param {THREE.Box3} boundingBox Geometry Box from which to create box mesh.
     * @param {THREE.Material} material Material of the box.
     * @returns {THREE.Mesh}
     */
    public static createBoundingBoxMeshFromBoundingBox(position: THREE.Vector3, boundingBox: THREE.Box3, material: THREE.Material): THREE.Mesh {

        const width  = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth  = boundingBox.max.z - boundingBox.min.z;

        const boxMesh = this.createBoxMesh (position, width, height, depth, material);
        boxMesh.name = ObjectNames.BoundingBox;

        return boxMesh;
    }

    /**
     * @description Gets the extents of an object optionally including all children.
     * @static
     * @param {THREE.Object3D} rootObject Object to process.
     * @returns {THREE.Box3}
     */
    public static getBoundingBoxFromObject(rootObject: THREE.Object3D): THREE.Box3 {

        const timerTag = Services.timer.mark(`${rootObject.name}: BoundingBox`);

        // https://stackoverflow.com/questions/15492857/any-way-to-get-a-bounding-box-from-a-three-js-object3d
        let boundingBox: THREE.Box3 = new THREE.Box3();
        boundingBox = boundingBox.setFromObject(rootObject);

        Services.timer.logElapsedTime(timerTag);
        return boundingBox;
        }

    /**
     * @description Creates a box mesh.
     * @static
     * @param {THREE.Vector3} position Location of the box.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {number} depth Depth.
     * @param {THREE.Material} [material] Optional material.
     * @returns {THREE.Mesh}
     */
    public static createBoxMesh(position: THREE.Vector3, width: number, height: number, depth: number, material?: THREE.Material): THREE.Mesh {

        const boxGeometry = new THREE.BoxGeometry(width, height, depth);
        boxGeometry.computeBoundingBox();

        const boxMaterial = material || new THREE.MeshPhongMaterial( { color: 0x0000ff, opacity: 1.0} );

        const box = new THREE.Mesh( boxGeometry, boxMaterial);
        box.name = ObjectNames.Box;
        box.position.copy(position);

        return box;
    }

    /**
     * @description Creates a plane mesh.
     * @static
     * @param {THREE.Vector3} position Location of the plane.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {THREE.Material} [material] Optional material.
     * @returns {THREE.Mesh}
     */
    public static createPlaneMesh(position: THREE.Vector3, width: number, height: number, material?: THREE.Material): THREE.Mesh {

        const planeGeometry = new THREE.PlaneGeometry(width, height);
        const planeMaterial = material || new THREE.MeshPhongMaterial( { color: 0x0000ff, opacity: 1.0} );
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.name = ObjectNames.Plane;
        plane.position.copy(position);

        return plane;
    }

    /**
     * @description Creates a sphere mesh.
     * @static
     * @param {THREE.Vector3} position Origin of the sphere.
     * @param {number} radius Radius.
     * @param {THREE.Material} [material] Optional material.
     * @returns {THREE.Mesh}
     */
    public static createSphereMesh(position: THREE.Vector3, radius: number, material?: THREE.Material): THREE.Mesh {

        const segmentCount: number = 32;
        const sphereGeometry = new THREE.SphereGeometry(radius, segmentCount, segmentCount);
        sphereGeometry.computeBoundingBox();

        const sphereMaterial = material || new THREE.MeshPhongMaterial({ color: 0xff0000, opacity: 1.0} );

        const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        sphere.name = ObjectNames.Sphere;
        sphere.position.copy(position);

        return sphere;
    }

    /**
     * @description Creates a line object.
     * @static
     * @param {THREE.Vector3} startPosition Start point.
     * @param {THREE.Vector3} endPosition End point.
     * @param {number} color Color.
     * @returns {THREE.Line}
     */
    public static createLine(startPosition: THREE.Vector3, endPosition: THREE.Vector3, color: number): THREE.Line {

        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push (startPosition, endPosition);

        const material = new THREE.LineBasicMaterial( { color} );
        const line = new THREE.Line(lineGeometry, material);

        return line;
    }

    /**
     * @description Creates an axes triad.
     * @static
     * @param {THREE.Vector3} [position] Origin of the triad.
     * @param {number} [length] Length of the coordinate arrow.
     * @param {number} [headLength] Length of the arrow head.
     * @param {number} [headWidth] Width of the arrow head.
     * @returns {THREE.Object3D}
     */
    public static createWorldAxesTriad(position?: THREE.Vector3, length?: number, headLength?: number, headWidth?: number): THREE.Object3D {

        const triadGroup: THREE.Object3D = new THREE.Object3D();
        const arrowPosition: THREE.Vector3  = position || new THREE.Vector3();
        const arrowLength: number = length     || 15;
        const arrowHeadLength: number = headLength || 1;
        const arrowHeadWidth: number = headWidth  || 1;

        triadGroup.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), arrowPosition, arrowLength, 0xff0000, arrowHeadLength, arrowHeadWidth));
        triadGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), arrowPosition, arrowLength, 0x00ff00, arrowHeadLength, arrowHeadWidth));
        triadGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), arrowPosition, arrowLength, 0x0000ff, arrowHeadLength, arrowHeadWidth));

        return triadGroup;
    }

    /**
     * @description Creates an axes grid.
     * @static
     * @param {THREE.Vector3} [position] Origin of the axes grid.
     * @param {number} [size] Size of the grid.
     * @param {number} [step] Grid line intervals.
     * @returns {THREE.Object3D} Grid object.
     */
    public static createWorldAxesGrid(position?: THREE.Vector3, size?: number, step?: number): THREE.Object3D {

        const gridGroup: THREE.Object3D = new THREE.Object3D();
        const gridPosition: THREE.Vector3  = position || new THREE.Vector3();
        const gridSize: number = size || 10;
        const gridStep: number = step || 1;
        const colorCenterline: number =  0xff000000;

        const xyGrid = new THREE.GridHelper(gridSize, gridStep);
        xyGrid.setColors(colorCenterline, 0xff0000);
        xyGrid.position.copy(gridPosition.clone());
        xyGrid.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        xyGrid.position.x += gridSize;
        xyGrid.position.y += gridSize;
        gridGroup.add(xyGrid);

        const yzGrid = new THREE.GridHelper(gridSize, gridStep);
        yzGrid.setColors(colorCenterline, 0x00ff00);
        yzGrid.position.copy(gridPosition.clone());
        yzGrid.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        yzGrid.position.y += gridSize;
        yzGrid.position.z += gridSize;
        gridGroup.add(yzGrid);

        const zxGrid = new THREE.GridHelper(gridSize, gridStep);
        zxGrid.setColors(colorCenterline, 0x0000ff);
        zxGrid.position.copy(gridPosition.clone());
        zxGrid.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        zxGrid.position.z += gridSize;
        zxGrid.position.x += gridSize;
        gridGroup.add(zxGrid);

        return gridGroup;
    }

    /**
     * @description Adds a camera helper to a scene to visualize the camera position.
     * @static
     * @param {THREE.Camera} camera Camera to construct helper (may be null).
     * @param {THREE.Scene} scene Scene to annotate.
     * @param {THREE.Group} modelGroup Model geoemetry.
     * @returns {void}
     */
    public static addCameraHelper(camera: THREE.Camera, scene: THREE.Scene, modelGroup: THREE.Group): void {

        if (!camera)
            return;

        // camera properties
        const cameraMatrixWorld: THREE.Matrix4 = camera.matrixWorld;
        const cameraMatrixWorldInverse: THREE.Matrix4 = camera.matrixWorldInverse;

        // construct root object of the helper
        const cameraHelper  = new THREE.Group();
        cameraHelper.name = ObjectNames.CameraHelper;
        cameraHelper.visible = true;

        // model bounding box (View coordinates)
        const boundingBoxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: true, transparent: false, opacity: 0.2 });
        const boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(modelGroup, cameraMatrixWorldInverse);
        const boundingBoxViewMesh = Graphics.createBoundingBoxMeshFromBoundingBox(boundingBoxView.getCenter(new THREE.Vector3()), boundingBoxView, boundingBoxMaterial);

        const boundingBoxWorldMesh = Graphics.cloneAndTransformObject(boundingBoxViewMesh, cameraMatrixWorld);
        cameraHelper.add(boundingBoxWorldMesh);

        // position
        const position = Graphics.createSphereMesh(camera.position, 3);
        cameraHelper.add(position);

        // camera target line
        const unitTarget = new THREE.Vector3(0, 0, -1);
        unitTarget.applyQuaternion(camera.quaternion);
        let scaledTarget: THREE.Vector3;
        scaledTarget = unitTarget.multiplyScalar(-boundingBoxView.max.z);

        const startPoint: THREE.Vector3 = camera.position;
        const endPoint: THREE.Vector3 = new THREE.Vector3();
        endPoint.addVectors(startPoint, scaledTarget);
        const targetLine: THREE.Line = Graphics.createLine(startPoint, endPoint, 0x00ff00);
        cameraHelper.add(targetLine);

        scene.add(cameraHelper);
    }

    /**
     * @description Adds a coordinate axis helper to a scene to visualize the world axes.
     * @static
     * @param {THREE.Scene} scene Scene to annotate.
     * @param {number} size Size of axes.
     */
    public static addAxisHelper(scene: THREE.Scene, size: number): void {

        const axisHelper = new THREE.AxesHelper(size);
        axisHelper.visible = true;
        scene.add(axisHelper);
    }
//#endregion

//#region Coordinate Conversion
    /*
    // --------------------------------------------------------------------------------------------------------------------------------------//
    //  Coordinate Systems
    // --------------------------------------------------------------------------------------------------------------------------------------//
    FRAME	            EXAMPLE										SPACE                      UNITS                       NOTES

    Model               Catalog WebGL: Model, BandElement Block     object                      mm                          Rhino definitions
    World               Design Model								world                       mm
    View                Camera                                      view                        mm
    Device              Normalized view							    device                      [(-1, -1), (1, 1)]
    Screen.Page         HTML page									screen                      px                          0,0 at Top Left, +Y down    HTML page
    Screen.Client       Browser view port 						    screen                      px                          0,0 at Top Left, +Y down    browser window
    Screen.Container    DOM container								screen                      px                          0,0 at Top Left, +Y down    HTML canvas

    Mouse Event Properties
    http://www.jacklmoore.com/notes/mouse-position/
    */

    // --------------------------------------------------------------------------------------------------------------------------------------//
    // 			World Coordinates
    // --------------------------------------------------------------------------------------------------------------------------------------//
    /**
     * @description Converts a JQuery event to world coordinates.
     * @static
     * @param {JQueryEventObject} event Event.
     * @param {JQuery} container DOM container.
     * @param {THREE.Camera} camera Camera.
     * @returns {THREE.Vector3}
     */
    public static worldCoordinatesFromJQEvent(event: JQueryEventObject, container: JQuery, camera: THREE.Camera): THREE.Vector3 {

        const deviceCoordinates2D = this.deviceCoordinatesFromJQEvent(event, container);
        const deviceZ = (camera instanceof THREE.PerspectiveCamera) ? 0.5 : 1.0;
        const deviceCoordinates3D = new THREE.Vector3(deviceCoordinates2D.x, deviceCoordinates2D.y, deviceZ);
        const worldCoordinates = deviceCoordinates3D.unproject(camera);

        return worldCoordinates;
    }

    // --------------------------------------------------------------------------------------------------------------------------------------//
    // 			View Coordinates
    // --------------------------------------------------------------------------------------------------------------------------------------//
    /**
     * @description Converts world coordinates to view coordinates.
     * @static
     * @param {THREE.Vector3} vector World coordinate vector to convert.
     * @param {THREE.Camera} camera Camera.
     * @returns {THREE.Vector3}
     */
    public static viewCoordinatesFromWorldCoordinates(vector: THREE.Vector3, camera: THREE.Camera): THREE.Vector3 {

        const position: THREE.Vector3 = vector.clone();
        const viewCoordinates = position.applyMatrix4(camera.matrixWorldInverse);

        return viewCoordinates;
    }

    // --------------------------------------------------------------------------------------------------------------------------------------//
    // 			Device Coordinates
    // --------------------------------------------------------------------------------------------------------------------------------------//
    /**
     * @description Converts a JQuery event to normalized device coordinates.
     * @static
     * @param {JQueryEventObject} event JQuery event.
     * @param {JQuery} container DOM container.
     * @returns {THREE.Vector2}
     */
    public static deviceCoordinatesFromJQEvent(event: JQueryEventObject, container: JQuery): THREE.Vector2 {

        const screenContainerCoordinates = this.screenContainerCoordinatesFromJQEvent(event, container);
        const ratioX = screenContainerCoordinates.x / container.width();
        const ratioY = screenContainerCoordinates.y / container.height();

        const deviceX = +((ratioX * 2) - 1);                 // [-1, 1]
        const deviceY = -((ratioY * 2) - 1);                 // [-1, 1]
        const deviceCoordinates = new THREE.Vector2(deviceX, deviceY);

        return deviceCoordinates;
    }

    /**
     * @description Converts world coordinates to device coordinates [-1, 1].
     * @static
     * @param {THREE.Vector3} vector World coordinates vector.
     * @param {THREE.Camera} camera Camera.
     * @returns {THREE.Vector2}
     */
    public static deviceCoordinatesFromWorldCoordinates(vector: THREE.Vector3, camera: THREE.Camera): THREE.Vector2 {

        // https://github.com/mrdoob/three.js/issues/78
        const position: THREE.Vector3 = vector.clone();
        const deviceCoordinates3D = position.project(camera);
        const deviceCoordinates2D = new THREE.Vector2(deviceCoordinates3D.x, deviceCoordinates3D.y);

        return deviceCoordinates2D;
    }

    // --------------------------------------------------------------------------------------------------------------------------------------//
    // 			Screen Coordinates
    // --------------------------------------------------------------------------------------------------------------------------------------//
    /**
     * @description Page coordinates from a JQuery event.
     * @static
     * @param {JQueryEventObject} event JQuery event.
     * @returns {THREE.Vector2} Screen (page) coordinates.
     */
    public static screenPageCoordinatesFromJQEvent(event: JQueryEventObject): THREE.Vector2 {

        const screenPageCoordinates: THREE.Vector2 = new THREE.Vector2();

        screenPageCoordinates.x = event.pageX;
        screenPageCoordinates.y = event.pageY;

        return screenPageCoordinates;
    }

    /**
     * @description
     * Client coordinates from a JQuery event.
     * Client coordinates are relative to the <browser> view port. If the document has been scrolled it will
     * be different than the page coordinates which are always relative to the top left of the <entire> HTML page document.
     * http://www.bennadel.com/blog/1869-jquery-mouse-events-pagex-y-vs-clientx-y.htm
     * @static
     * @param {JQueryEventObject} event JQuery event.
     * @returns {THREE.Vector2} Screen client coordinates.
     */
    public static screenClientCoordinatesFromJQEvent(event: JQueryEventObject): THREE.Vector2 {

        const screenClientCoordinates: THREE.Vector2 = new THREE.Vector2();

        screenClientCoordinates.x = event.clientX;
        screenClientCoordinates.y = event.clientY;

        return screenClientCoordinates;
    }

    /**
     * @description Converts JQuery event coordinates to screen container coordinates.
     * @static
     * @param {JQueryEventObject} event JQuery event.
     * @param {JQuery} container DOM container.
     * @returns {THREE.Vector2} Screen container coordinates.
     */
    public static screenContainerCoordinatesFromJQEvent(event: JQueryEventObject, container: JQuery): THREE.Vector2 {

        const screenContainerCoordinates: THREE.Vector2 = new THREE.Vector2();
        const containerOffset = container.offset();

        // JQuery does not set pageX/pageY for Drop events. They are defined in the originalEvent member.
        const pageX = event.pageX || ((event.originalEvent) as any).pageX;
        const pageY = event.pageY || ((event.originalEvent) as any).pageY;

        screenContainerCoordinates.x = pageX - containerOffset.left;
        screenContainerCoordinates.y = pageY - containerOffset.top;

        return screenContainerCoordinates;
    }

    /**
     * @description Converts world coordinates to screen container coordinates.
     * @static
     * @param {THREE.Vector3} vector World vector.
     * @param {JQuery} container DOM container.
     * @param {THREE.Camera} camera Camera.
     * @returns {THREE.Vector2} Screen container coordinates.
     */
    public static screenContainerCoordinatesFromWorldCoordinates(vector: THREE.Vector3, container: JQuery, camera: THREE.Camera): THREE.Vector2 {

        // https://github.com/mrdoob/three.js/issues/78
        const position: THREE.Vector3 = vector.clone();

        // [(-1, -1), (1, 1)]
        const deviceCoordinates = this.deviceCoordinatesFromWorldCoordinates(position, camera);
        const left = ((+deviceCoordinates.x + 1) / 2) * container.width();
        const top  = ((-deviceCoordinates.y + 1) / 2) * container.height();

        const screenContainerCoordinates = new THREE.Vector2(left, top);
        return screenContainerCoordinates;
    }
//#endregion

//#region Intersections
    /* --------------------------------------------------------------------------------------------------------------------------------------//
    //  Intersections
    // --------------------------------------------------------------------------------------------------------------------------------------*/
    /**
     * @description Creates a Raycaster through the mouse world position.
     * @static
     * @param {THREE.Vector3} mouseWorld World coordinates.
     * @param {THREE.Camera} camera Camera.
     * @returns {THREE.Raycaster}
     */
    public static raycasterFromMouse(mouseWorld: THREE.Vector3, camera: THREE.Camera): THREE.Raycaster {

        const rayOrigin: THREE.Vector3 = new THREE.Vector3 (mouseWorld.x, mouseWorld.y, camera.position.z);
        const worldPoint: THREE.Vector3 = new THREE.Vector3(mouseWorld.x, mouseWorld.y, mouseWorld.z);

        // Tools.consoleLog('World mouse coordinates: ' + worldPoint.x + ', ' + worldPoint.y);

        // construct ray from camera to mouse world
        const raycaster = new THREE.Raycaster (rayOrigin, worldPoint.sub (rayOrigin).normalize());

        return raycaster;
    }
    /**
     * @description Returns the first Intersection located by the cursor.
     * @static
     * @param {JQueryEventObject} event JQuery event.
     * @param {JQuery} container DOM container.
     * @param {THREE.Camera} camera Camera.
     * @param {THREE.Object3D[]} sceneObjects Array of scene objects.
     * @param {boolean} recurse Recurse through objects.
     * @returns {THREE.Intersection} First intersection with screen objects.
     */
    public static getFirstIntersection(event: JQueryEventObject, container: JQuery, camera: THREE.Camera, sceneObjects: THREE.Object3D[], recurse: boolean): THREE.Intersection {

        // construct ray from camera to mouse world
        const mouseWorld = Graphics.worldCoordinatesFromJQEvent(event, container, camera);
        const raycaster  = Graphics.raycasterFromMouse (mouseWorld, camera);

        // find all object intersections
        const intersects: THREE.Intersection[] = raycaster.intersectObjects (sceneObjects, recurse);

        // no intersection?
        if (intersects.length === 0) {
            return null;
        }

        // use first; reject lines (Transform Frame)
        let iIntersection: number;
        for (iIntersection = 0; iIntersection < intersects.length; iIntersection++) {

            const intersection = intersects[iIntersection];
            if (!(intersection.object instanceof THREE.Line))
                return intersection;
            }

        return null;
    }
//#endregion

//#region Helpers
    /* --------------------------------------------------------------------------------------------------------------------------------------//
    //  Helpers
    // --------------------------------------------------------------------------------------------------------------------------------------*/
    /**
     * @description Constructs a WebGL target canvas.
     * @static
     * @param {string} id DOM id for canvas.
     * @param {number} [width] Width of canvas.
     * @param {number} [height] Height of canvas.
     * @returns {HTMLCanvasElement}
     */
    public static initializeCanvas(id: string, width?: number, height?: number): HTMLCanvasElement {

        const canvas: HTMLCanvasElement = document.querySelector(`#${id}`) as HTMLCanvasElement;
        if (!canvas) {
            Services.defaultLogger.addErrorMessage(`Canvas element id = ${id} not found`);
            return null;
            }

        // CSS controls the size
        if (!width || !height)
            return canvas;

        // render dimensions
        canvas.width  = width;
        canvas.height = height;

        // DOM element dimensions (may be different than render dimensions)
        canvas.style.width  = `${width}px`;
        canvas.style.height = `${height}px`;

        return canvas;
    }

    /**
     * Creates an instance of Graphics.
     */
    constructor() {
    }
//#endregion

//#region WebGL
    /* --------------------------------------------------------------------------------------------------------------------------------------//
    //  WebGL
    // --------------------------------------------------------------------------------------------------------------------------------------*/
    /**
     * @description Display WebGLProgram properties.
     */
    public static showWebGLPrograms(renderer: THREE.WebGLRenderer) {

        const info = renderer.info;
        const gl = renderer.context;

        for (const iProgram of info.programs) {
            const threeProgram: THREE.WebGLProgram = iProgram;
            console.log(threeProgram.vertexShader);
            console.log(threeProgram.fragmentShader);
            const program = threeProgram.program;

            const numberAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (let iAttribute = 0; iAttribute < numberAttributes; ++iAttribute) {
                const attributeInfo = gl.getActiveAttrib(program, iAttribute);
                const index = gl.getAttribLocation(program, attributeInfo.name);
                console.log(index, attributeInfo.name);
            }
            console.log();
        }
    }

    /**
     * @description Reset all WebGL vertex attributes.
     * @param renderer WebGLRenderer
     */
    public static resetWebGLVertexAttributes(renderer: THREE.WebGLRenderer) {

        // https://github.com/stackgl/gl-reset/blob/master/state.js
        // https://stackoverflow.com/questions/12427880/is-it-important-to-call-gldisablevertexattribarray
        const gl = renderer.context;

        const numberAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        const temporaryBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, temporaryBuffer);

        for (let iAttribute = 0; iAttribute < numberAttributes; ++iAttribute) {

            gl.disableVertexAttribArray(iAttribute);
            gl.vertexAttribPointer(iAttribute, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttrib1f(iAttribute, 0);
        }
        gl.deleteBuffer(temporaryBuffer);
    }
}

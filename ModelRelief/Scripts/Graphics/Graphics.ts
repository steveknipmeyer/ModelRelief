// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE               from 'three';

import {ILogger, ConsoleLogger} from 'Logger';
import {Services}               from 'Services';

/**
 * @description Default names of graphics objects.
 * @export
 * @enum {number}
 */
export enum ObjectNames {

    Root          =  'Root',

    BoundingBox   = 'Bounding Box',
    Box           = 'Box',
    CameraHelper  = 'CameraHelper',
    ModelClone    = 'Model Clone',
    Plane         = 'Plane',
    Sphere        = 'Sphere',
    Triad         = 'Triad'
}

/**
 * @description General THREE.js/WebGL support routines
 * @export
 * @class Graphics
 */
export class Graphics {

    /**
     * Creates an instance of Graphics.
     */
    constructor() {
    }

//#region Geometry
    /* --------------------------------------------------------------------------------------------------------------------------------------//
    //			Geometry
    // --------------------------------------------------------------------------------------------------------------------------------------*/

    /** 
     * @description Dispose of resources held by a graphical object.
     * @static
     * @param {any} object3d Object to process.
     * https://stackoverflow.com/questions/18357529/threejs-remove-object-from-scene
     */
    static disposeResources(object3d) : void {
 
        // logger.addInfoMessage ('Removing: ' + object3d.name);
        if (object3d.hasOwnProperty('geometry')) {
            object3d.geometry.dispose();
        }

        if (object3d.hasOwnProperty('material')) {

            var material = object3d.material;
            if (material.hasOwnProperty('materials')) {

                var materials = material.materials;
                for (var iMaterial in materials) {
                    if (materials.hasOwnProperty(iMaterial)) {
                        materials[iMaterial].dispose();
                    }
                }
            }
        }

        if (object3d.hasOwnProperty('texture')) {
            object3d.texture.dispose();
        }
    }

    /**
     * @description Removes an object and all children from a scene.
     * @static
     * @param {THREE.Object3D} rootObject Parent object (possibly with children).
     * @param {boolean} removeRoot Remove root object itself.
     * @returns 
     */
    static removeObjectChildren(rootObject : THREE.Object3D, removeRoot : boolean) {

        if (!rootObject)
            return;

        let logger  = Services.defaultLogger;
        let remover = function (object3d) {
            
            if (object3d === rootObject) {
                return;
            }
            Graphics.disposeResources(object3d);
        };

        rootObject.traverse(remover);

        // remove root children from rootObject (backwards!)
        for (let iChild : number = (rootObject.children.length - 1); iChild >= 0; iChild--) {

            let child : THREE.Object3D = rootObject.children[iChild];
            rootObject.remove (child);
        }

        if (removeRoot && rootObject.parent)
            rootObject.parent.remove(rootObject);
    } 

    /**
     * @description Remove all objects of a given name from the scene.
     * @static
     * @param {THREE.Scene} scene Scene to process.
     * @param {string} objectName Object name to find.
     */
    static removeAllByName (scene : THREE.Scene, objectName : string) : void {

        let object: THREE.Object3D;
        while (object = scene.getObjectByName(objectName)) {

            Graphics.disposeResources(object);
            object.parent.remove(object);
        }
    }

    /**
     * @description Clone and transform an object.
     * @static
     * @param {THREE.Object3D} object Object to clone and transform.
     * @param {THREE.Matrix4} [matrix] Transformation matrix.
     * @returns {THREE.Object3D} 
     */
    static cloneAndTransformObject (object : THREE.Object3D, matrix? : THREE.Matrix4) : THREE.Object3D {

        let methodTag : string = Services.timer.mark('cloneAndTransformObject');
        if (!matrix)
            matrix = new THREE.Matrix4();

        // clone object (and geometry!)
        let cloneTag: string = Services.timer.mark('clone');
        let objectClone : THREE.Object3D = object.clone();
        objectClone.traverse(object => {
            if (object instanceof(THREE.Mesh))
                object.geometry = object.geometry.clone();
        });
        Services.timer.logElapsedTime(cloneTag);
        
        // N.B. Important! The postion, rotation (quaternion) and scale are correct but the matrix has not been updated.
        // THREE.js updates the matrix in the render() loop.
        let transformTag: string = Services.timer.mark('transform');
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
    static getTransformedBoundingBox(object: THREE.Object3D, matrix: THREE.Matrix4): THREE.Box3 {

        let methodTag: string = Services.timer.mark('getTransformedBoundingBox');

        object.updateMatrixWorld(true);
        object.applyMatrix(matrix);
        let boundingBox: THREE.Box3 = Graphics.getBoundingBoxFromObject(object);

        // restore object
        let matrixIdentity = new THREE.Matrix4();
        let matrixInverse = matrixIdentity.getInverse(matrix, true);
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
    static createBoundingBoxMeshFromGeometry(position : THREE.Vector3, geometry : THREE.Geometry, material : THREE.Material) : THREE.Mesh{

        var boundingBox     : THREE.Box3,
            width           : number,
            height          : number,
            depth           : number,
            boxMesh         : THREE.Mesh;

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
    static createBoundingBoxMeshFromBoundingBox(position : THREE.Vector3, boundingBox : THREE.Box3, material : THREE.Material) : THREE.Mesh {

        var width           : number,
            height          : number,
            depth           : number,
            boxMesh         : THREE.Mesh;

        width  = boundingBox.max.x - boundingBox.min.x;
        height = boundingBox.max.y - boundingBox.min.y;
        depth  = boundingBox.max.z - boundingBox.min.z;

        boxMesh = this.createBoxMesh (position, width, height, depth, material);
        boxMesh.name = ObjectNames.BoundingBox;

        return boxMesh;
    }

    /**
     * @description Gets the extents of an object optionally including all children.
     * @static
     * @param {THREE.Object3D} rootObject Object to process.
     * @returns {THREE.Box3} 
     */
    static getBoundingBoxFromObject(rootObject : THREE.Object3D) : THREE.Box3 {

        let timerTag = Services.timer.mark(`${rootObject.name}: BoundingBox`);              
        
        // https://stackoverflow.com/questions/15492857/any-way-to-get-a-bounding-box-from-a-three-js-object3d
        let boundingBox : THREE.Box3 = new THREE.Box3();
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
    static createBoxMesh(position : THREE.Vector3, width : number, height : number, depth : number, material? : THREE.Material) : THREE.Mesh {

        var 
            boxGeometry  : THREE.BoxGeometry,
            boxMaterial  : THREE.Material,
            box          : THREE.Mesh;

        boxGeometry = new THREE.BoxGeometry(width, height, depth);
        boxGeometry.computeBoundingBox();

        boxMaterial = material || new THREE.MeshPhongMaterial( { color: 0x0000ff, opacity: 1.0} );

        box = new THREE.Mesh( boxGeometry, boxMaterial);
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
    static createPlaneMesh(position : THREE.Vector3, width : number, height : number, material? : THREE.Material) : THREE.Mesh {
        
        var 
            planeGeometry  : THREE.PlaneGeometry,
            planeMaterial  : THREE.Material,
            plane          : THREE.Mesh;

        planeGeometry = new THREE.PlaneGeometry(width, height);       
        planeMaterial = material || new THREE.MeshPhongMaterial( { color: 0x0000ff, opacity: 1.0} );

        plane = new THREE.Mesh(planeGeometry, planeMaterial);
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
    static createSphereMesh(position : THREE.Vector3, radius : number, material? : THREE.Material) : THREE.Mesh {
        var sphereGeometry  : THREE.SphereGeometry,
            segmentCount    : number = 32,
            sphereMaterial  : THREE.Material,
            sphere          : THREE.Mesh;

        sphereGeometry = new THREE.SphereGeometry(radius, segmentCount, segmentCount);
        sphereGeometry.computeBoundingBox();

        sphereMaterial = material || new THREE.MeshPhongMaterial({ color: 0xff0000, opacity: 1.0} );

        sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
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
    static createLine(startPosition : THREE.Vector3, endPosition : THREE.Vector3, color : number) : THREE.Line {

        var line            : THREE.Line,
            lineGeometry    : THREE.Geometry,
            material        : THREE.LineBasicMaterial;
            
        lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push (startPosition, endPosition);

        material = new THREE.LineBasicMaterial( { color: color} );
        line = new THREE.Line(lineGeometry, material);

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
    static createWorldAxesTriad(position? : THREE.Vector3, length? : number, headLength? : number, headWidth? : number) : THREE.Object3D {
            
        var triadGroup      : THREE.Object3D = new THREE.Object3D(),
            arrowPosition   : THREE.Vector3  = position ||new THREE.Vector3(),
            arrowLength     : number = length     || 15,
            arrowHeadLength : number = headLength || 1,
            arrowHeadWidth  : number = headWidth  || 1;

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
    static createWorldAxesGrid(position? : THREE.Vector3, size? : number, step? : number) : THREE.Object3D {
            
        var gridGroup       : THREE.Object3D = new THREE.Object3D(),
            gridPosition    : THREE.Vector3  = position ||new THREE.Vector3(),
            gridSize        : number = size || 10,
            gridStep        : number = step || 1,
            colorCenterline : number =  0xff000000,
            xyGrid           : THREE.GridHelper,
            yzGrid           : THREE.GridHelper,
            zxGrid           : THREE.GridHelper;
            
        xyGrid = new THREE.GridHelper(gridSize, gridStep);
        xyGrid.setColors(colorCenterline, 0xff0000);
        xyGrid.position.copy(gridPosition.clone());
        xyGrid.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        xyGrid.position.x += gridSize;
        xyGrid.position.y += gridSize;
        gridGroup.add(xyGrid);

        yzGrid = new THREE.GridHelper(gridSize, gridStep);
        yzGrid.setColors(colorCenterline, 0x00ff00);
        yzGrid.position.copy(gridPosition.clone());
        yzGrid.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        yzGrid.position.y += gridSize;
        yzGrid.position.z += gridSize;
        gridGroup.add(yzGrid);

        zxGrid = new THREE.GridHelper(gridSize, gridStep);
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
    static addCameraHelper (camera : THREE.Camera, scene : THREE.Scene, modelGroup : THREE.Group) : void {

        if (!camera)
            return;

        // camera properties
        let cameraMatrixWorld        : THREE.Matrix4 = camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = camera.matrixWorldInverse;
        
        // construct root object of the helper
        let cameraHelper  = new THREE.Group();
        cameraHelper.name = ObjectNames.CameraHelper;       
        cameraHelper.visible = true;

        // model bounding box (View coordinates)
        let boundingBoxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: true, transparent: false, opacity: 0.2 })
        let boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(modelGroup, cameraMatrixWorldInverse);        
        let boundingBoxViewMesh = Graphics.createBoundingBoxMeshFromBoundingBox(boundingBoxView.getCenter(), boundingBoxView, boundingBoxMaterial);

        let boundingBoxWorldMesh = Graphics.cloneAndTransformObject(boundingBoxViewMesh, cameraMatrixWorld);
        cameraHelper.add(boundingBoxWorldMesh);

        // position
        let position = Graphics.createSphereMesh(camera.position, 3);
        cameraHelper.add(position);

        // camera target line
        let unitTarget = new THREE.Vector3(0, 0, -1);
        unitTarget.applyQuaternion(camera.quaternion);
        let scaledTarget : THREE.Vector3;
        scaledTarget = unitTarget.multiplyScalar(-boundingBoxView.max.z);

        let startPoint : THREE.Vector3 = camera.position;
        let endPoint   : THREE.Vector3 = new THREE.Vector3();
        endPoint.addVectors(startPoint, scaledTarget);
        let targetLine : THREE.Line = Graphics.createLine(startPoint, endPoint, 0x00ff00);
        cameraHelper.add(targetLine);

        scene.add(cameraHelper);
    }

    /**
     * @description Adds a coordinate axis helper to a scene to visualize the world axes.
     * @static
     * @param {THREE.Scene} scene Scene to annotate.
     * @param {number} size Size of axes.
     */
    static addAxisHelper (scene : THREE.Scene, size : number) : void{

        let axisHelper = new THREE.AxisHelper(size);
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
    //			World Coordinates
    // --------------------------------------------------------------------------------------------------------------------------------------//
    /**
     * @description Converts a JQuery event to world coordinates.
     * @static
     * @param {JQueryEventObject} event Event.
     * @param {JQuery} container DOM container.
     * @param {THREE.Camera} camera Camera.
     * @returns {THREE.Vector3} 
     */
    static worldCoordinatesFromJQEvent (event : JQueryEventObject, container : JQuery, camera : THREE.Camera) : THREE.Vector3 {

        var worldCoordinates    : THREE.Vector3,
            deviceCoordinates2D : THREE.Vector2,
            deviceCoordinates3D : THREE.Vector3,
            deviceZ             : number;

        deviceCoordinates2D = this.deviceCoordinatesFromJQEvent(event, container);

        deviceZ = (camera instanceof THREE.PerspectiveCamera) ? 0.5 : 1.0;
        deviceCoordinates3D = new THREE.Vector3(deviceCoordinates2D.x, deviceCoordinates2D.y, deviceZ);

        worldCoordinates = deviceCoordinates3D.unproject(camera);

        return worldCoordinates;
    }

    // --------------------------------------------------------------------------------------------------------------------------------------//
    //			View Coordinates
    // --------------------------------------------------------------------------------------------------------------------------------------// 
    /**
     * @description Converts world coordinates to view coordinates.
     * @static
     * @param {THREE.Vector3} vector World coordinate vector to convert.
     * @param {THREE.Camera} camera Camera.
     * @returns {THREE.Vector3} 
     */
    static viewCoordinatesFromWorldCoordinates (vector : THREE.Vector3, camera : THREE.Camera) : THREE.Vector3 {

        var position          : THREE.Vector3 = vector.clone(),  
            viewCoordinates   : THREE.Vector3;

        viewCoordinates = position.applyMatrix4(camera.matrixWorldInverse);

        return viewCoordinates;
    }

    // --------------------------------------------------------------------------------------------------------------------------------------//
    //			Device Coordinates
    // --------------------------------------------------------------------------------------------------------------------------------------//
    /**
     * @description Converts a JQuery event to normalized device coordinates.
     * @static
     * @param {JQueryEventObject} event JQuery event.
     * @param {JQuery} container DOM container.
     * @returns {THREE.Vector2} 
     */
    static deviceCoordinatesFromJQEvent (event : JQueryEventObject, container : JQuery) : THREE.Vector2 {

        var deviceCoordinates           : THREE.Vector2,
            screenContainerCoordinates  : THREE.Vector2,
            ratioX,  ratioY              : number,
            deviceX, deviceY             : number;

        screenContainerCoordinates = this.screenContainerCoordinatesFromJQEvent(event, container);
        ratioX = screenContainerCoordinates.x / container.width();
        ratioY = screenContainerCoordinates.y / container.height();

        deviceX = +((ratioX * 2) - 1);                 // [-1, 1]
        deviceY = -((ratioY * 2) - 1);                 // [-1, 1]
        deviceCoordinates = new THREE.Vector2(deviceX, deviceY);

        return deviceCoordinates;
    }

    /**
     * @description Converts world coordinates to device coordinates [-1, 1].
     * @static
     * @param {THREE.Vector3} vector World coordinates vector.
     * @param {THREE.Camera} camera Camera.
     * @returns {THREE.Vector2} 
     */
    static deviceCoordinatesFromWorldCoordinates (vector : THREE.Vector3, camera : THREE.Camera) : THREE.Vector2 {
            
        // https://github.com/mrdoob/three.js/issues/78
        var position                   : THREE.Vector3 = vector.clone(),  
            deviceCoordinates2D        : THREE.Vector2,
            deviceCoordinates3D        : THREE.Vector3;

        deviceCoordinates3D = position.project(camera);
        deviceCoordinates2D = new THREE.Vector2(deviceCoordinates3D.x, deviceCoordinates3D.y);

        return deviceCoordinates2D;
    }

    // --------------------------------------------------------------------------------------------------------------------------------------//
    //			Screen Coordinates
    // --------------------------------------------------------------------------------------------------------------------------------------//
    /**
     * @description Page coordinates from a JQuery event.
     * @static
     * @param {JQueryEventObject} event JQuery event.
     * @returns {THREE.Vector2} Screen (page) coordinates.
     */
    static screenPageCoordinatesFromJQEvent(event : JQueryEventObject) : THREE.Vector2 {
        
        var screenPageCoordinates : THREE.Vector2 = new THREE.Vector2();

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
    static screenClientCoordinatesFromJQEvent(event : JQueryEventObject) : THREE.Vector2 {
        
        var screenClientCoordinates : THREE.Vector2 = new THREE.Vector2();

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
    static screenContainerCoordinatesFromJQEvent(event : JQueryEventObject, container : JQuery) : THREE.Vector2 {
        
        var screenContainerCoordinates : THREE.Vector2 = new THREE.Vector2(),
            containerOffset            : JQueryCoordinates,
            pageX, pageY               : number;
                        
        containerOffset = container.offset();

        // JQuery does not set pageX/pageY for Drop events. They are defined in the originalEvent member.
        pageX = event.pageX || (<any>(event.originalEvent)).pageX;
        pageY = event.pageY || (<any>(event.originalEvent)).pageY;

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
    static screenContainerCoordinatesFromWorldCoordinates (vector : THREE.Vector3, container : JQuery, camera : THREE.Camera) : THREE.Vector2 {
            
        //https://github.com/mrdoob/three.js/issues/78
        var position                   : THREE.Vector3 = vector.clone(),
            deviceCoordinates          : THREE.Vector2,
            screenContainerCoordinates : THREE.Vector2,
            left                       : number,
            top                        : number;

        // [(-1, -1), (1, 1)]
        deviceCoordinates = this.deviceCoordinatesFromWorldCoordinates(position, camera);
        left = ((+deviceCoordinates.x + 1) / 2) * container.width();
        top  = ((-deviceCoordinates.y + 1) / 2) * container.height();

        screenContainerCoordinates = new THREE.Vector2(left, top);
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
    static raycasterFromMouse (mouseWorld : THREE.Vector3, camera : THREE.Camera) : THREE.Raycaster{

        var rayOrigin  : THREE.Vector3 = new THREE.Vector3 (mouseWorld.x, mouseWorld.y, camera.position.z),
            worldPoint : THREE.Vector3 = new THREE.Vector3(mouseWorld.x, mouseWorld.y, mouseWorld.z);

            // Tools.consoleLog('World mouse coordinates: ' + worldPoint.x + ', ' + worldPoint.y);

        // construct ray from camera to mouse world
        var raycaster = new THREE.Raycaster (rayOrigin, worldPoint.sub (rayOrigin).normalize());

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
    static getFirstIntersection(event : JQueryEventObject, container : JQuery, camera : THREE.Camera, sceneObjects : THREE.Object3D[], recurse : boolean) : THREE.Intersection {

        var raycaster          : THREE.Raycaster,
            mouseWorld         : THREE.Vector3,
            iIntersection      : number,
            intersection       : THREE.Intersection;
                
        // construct ray from camera to mouse world
        mouseWorld = Graphics.worldCoordinatesFromJQEvent(event, container, camera);
        raycaster  = Graphics.raycasterFromMouse (mouseWorld, camera);

        // find all object intersections
        var intersects : THREE.Intersection[] = raycaster.intersectObjects (sceneObjects, recurse);

        // no intersection?
        if (intersects.length === 0) {
            return null;
        }

        // use first; reject lines (Transform Frame)
        for (iIntersection = 0; iIntersection < intersects.length; iIntersection++) {

            intersection = intersects[iIntersection];
            if (!(intersection.object instanceof THREE.Line))
                return intersection;
            };

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
    static initializeCanvas(id : string, width? : number, height? : number) : HTMLCanvasElement {
    
        let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.querySelector(`#${id}`);
        if (!canvas)
            {
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
//#endregion
}
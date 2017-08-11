// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE               from 'three'

import {Logger, ConsoleLogger}  from 'Logger'
import {ModelRelief}            from 'ModelRelief'
import {Services}               from 'Services'

/**
 *  General THREE.js/WebGL support routines
 *  Graphics Library
 *  @class
 */
export class Graphics {

    static BoundingBoxName     : string = 'Bounding Box';

    /**
     * @constructor
     */
    constructor() {
    }

//#region Geometry
    // --------------------------------------------------------------------------------------------------------------------------------------//
    //			Geometry
    // --------------------------------------------------------------------------------------------------------------------------------------//

    /**
     * Removes an object and all children from a scene.
     * @param scene Scene holding object to be removed.
     * @param rootObject Parent object (possibly with children).
     */
    static removeSceneObjectChildren(scene : THREE.Scene, rootObject : THREE.Object3D, removeRoot : boolean) {

        if (!scene || !rootObject)
            return;

        let logger  = Services.consoleLogger;
        let remover = function (object3d) {
            
            if (object3d === rootObject) {
                return;
            }

            logger.addInfoMessage ('Removing: ' + object3d.name);
            scene.remove(object3d);

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
        };
        // remove root children from scene
        rootObject.traverse(remover);

        // remove root children from root
        for (let iChild : number = 0; iChild < rootObject.children.length; iChild++) {

            let child : THREE.Object3D = rootObject.children[iChild];
            rootObject.remove (child);
        }

        if (removeRoot)
            scene.remove(rootObject);
    } 

    /**
     * @param position Location of bounding box.
     * @param mesh Mesh from which to create bounding box.
     * @ returns Mesh of the bounding box.
     */
    static createTransparentBoundingBox(position : THREE.Vector3, mesh : THREE.Mesh) : THREE.Mesh{

        var targetGeometry  : THREE.Geometry,
            boundingBox     : THREE.Box3,
            width           : number,
            height          : number,
            depth           : number,
            material        : THREE.MeshBasicMaterial,
            box             : THREE.Mesh;

        targetGeometry = <THREE.Geometry> mesh.geometry;
        targetGeometry.computeBoundingBox();

        boundingBox = targetGeometry.boundingBox;
        width  = boundingBox.max.x - boundingBox.min.x;
        height = boundingBox.max.y - boundingBox.min.y;
        depth  = boundingBox.max.z - boundingBox.min.z;

        material = new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 1.0, transparent: true, wireframe: true} );
        box = this.createBox (position, width, height, depth, material);

        box.name    = Graphics.BoundingBoxName;
        box.visible = false;

        return box;
    }

    /**
     * Creates a box mesh.
     * @param position Location of the box.
     * @param width Width.
     * @param height Height.
     * @param depth Depth.
     * @param material Optional material.
     * @returns Box mesh.
     */
    static createBox(position : THREE.Vector3, width : number, height : number, depth : number, material? : THREE.Material) : THREE.Mesh {

        var 
            boxGeometry  : THREE.BoxGeometry,
            boxMaterial  : THREE.Material,
            box          : THREE.Mesh;

        boxGeometry = new THREE.BoxGeometry(width, height, depth);
        boxGeometry.computeBoundingBox();

        boxMaterial = material || new THREE.MeshPhongMaterial( { color: 0x0000ff, opacity: 1.0} );

        box = new THREE.Mesh( boxGeometry, boxMaterial);
        box.position.copy(position);

        return box;
    }

    /**
     * Creates a sphere mesh.
     * @param position Origin of the sphere.
     * @param radius Radius.
     * @param color Color.
     * @param segments Mesh segments.
     */
    static createSphere(position : THREE.Vector3, radius : number, color : number, segments? : number) : THREE.Mesh {
        var sphereGeometry  : THREE.SphereGeometry,
            material        : THREE.MeshBasicMaterial,
            segmentCount    : number = segments || 32,
            sphere          : THREE.Mesh;
         Graphics.createBox       
        sphereGeometry = new THREE.SphereGeometry(radius, segmentCount, segmentCount);
        sphereGeometry.computeBoundingBox();

        material = new THREE.MeshPhongMaterial( { color: color, opacity: 1.0, transparent: false, wireframe: false} );

        sphere = new THREE.Mesh( sphereGeometry, material );
        sphere.position.copy(position);

        return sphere;
    }

        /**
     * Creates a line object.
     * @param startPosition Start point.
     * @param endPosition End point.
     * @param color Color.
     * @returns Line element.
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
     * Creates an axes triad.
     * @param position Origin of the triad.
     * @param length Length of the coordinate arrow.
     * @param headLength Length of the arrow head.
     * @param headWidth Width of the arrow head.
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
     * Creates an axes grid.
     * @param position  Origin of the axes grid.
     * @param size Size of the grid.
     * @param step Grid line intervals.
     * @returns Grid object.
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
//#endregion

//#region Coordinate Conversion
    /*
    // --------------------------------------------------------------------------------------------------------------------------------------//
    //			Coordinate Systems
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
     * Converts a JQuery event to world coordinates.
     * @param event Event.
     * @param container DOM container.
     * @param camera Camera.
     * @returns World coordinates.
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
     * Converts world coordinates to view coordinates.
     * @param vector World coordinate vector to convert.
     * @param camera Camera.
     * @returns View coordinates.
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
     * Converts a JQuery event to normalized device coordinates.
     * @param event JQuery event.
     * @param container DOM container.
     * @returns Normalized device coordinates.
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
     * Converts world coordinates to device coordinates [-1, 1].
     * @param vector  World coordinates vector.
     * @param camera Camera.
     * @preturns Device coorindates.
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
     * Page coordinates from a JQuery event.
     * @param event JQuery event.
     * @returns Screen (page) coordinates.
     */
    static screenPageCoordinatesFromJQEvent(event : JQueryEventObject) : THREE.Vector2 {
        
        var screenPageCoordinates : THREE.Vector2 = new THREE.Vector2();

        screenPageCoordinates.x = event.pageX;
        screenPageCoordinates.y = event.pageY;

        return screenPageCoordinates;
    }
    
    /**
     * Client coordinates from a JQuery event.
     * Client coordinates are relative to the <browser> view port. If the document has been scrolled it will
     * be different than the page coordinates which are always relative to the top left of the <entire> HTML page document.
     * http://www.bennadel.com/blog/1869-jquery-mouse-events-pagex-y-vs-clientx-y.htm
     * @param event JQuery event.
     * @returns Screen client coordinates.
     */
    static screenClientCoordinatesFromJQEvent(event : JQueryEventObject) : THREE.Vector2 {
        
        var screenClientCoordinates : THREE.Vector2 = new THREE.Vector2();

        screenClientCoordinates.x = event.clientX;
        screenClientCoordinates.y = event.clientY;

        return screenClientCoordinates;
    }

    /**
     * Converts JQuery event coordinates to screen container coordinates.
     * @param event JQuery event.
     * @param container DOM container.
     * @returns Screen container coordinates.
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
     * Converts world coordinates to screen container coordinates.
     * @param vector World vector.
     * @param container DOM container.
     * @param camera Camera.
     * @returns Screen container coordinates.
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

//#region Helpers
    // --------------------------------------------------------------------------------------------------------------------------------------//
    //			Helpers
    // --------------------------------------------------------------------------------------------------------------------------------------//
    /**
     * Creates a Raycaster through the mouse world position.
     * @param mouseWorld World coordinates.
     * @param camera Camera.
     * @returns THREE.Raycaster.
     */
    static raycasterFromMouse (mouseWorld : THREE.Vector3, camera : THREE.Camera) : THREE.Raycaster{

        var rayOrigin  : THREE.Vector3 = new THREE.Vector3 (mouseWorld.x, mouseWorld.y, camera.position.z),
            worldPoint : THREE.Vector3 = new THREE.Vector3(mouseWorld.x, mouseWorld.y, mouseWorld.z);

//          Tools.consoleLog('World mouse coordinates: ' + worldPoint.x + ', ' + worldPoint.y);

        // construct ray from camera to mouse world
        var raycaster = new THREE.Raycaster (rayOrigin, worldPoint.sub (rayOrigin).normalize());

        return raycaster;
    }
    /**
     * Returns the first Intersection located by the cursor.
     * @param event JQuery event.
     * @param container DOM container.
     * @param camera Camera.
     * @param sceneObjects Array of scene objects.
     * @param recurse Recurse through objects.
     * @returns First intersection with screen objects.
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
}
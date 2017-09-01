var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("System/Logger", ["require", "exports"], function (require, exports) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageClass;
    (function (MessageClass) {
        MessageClass["Error"] = "logError";
        MessageClass["Warning"] = "logWarning";
        MessageClass["Info"] = "logInfo";
        MessageClass["None"] = "logNone";
    })(MessageClass || (MessageClass = {}));
    /**
     * Console logging
     * @class
     */
    var ConsoleLogger = (function () {
        /**
         * @constructor
         */
        function ConsoleLogger() {
        }
        /**
         * Construct a general message and add to the log.
         * @param message Message text.
         * @param messageClass Message class.
         */
        ConsoleLogger.prototype.addMessageEntry = function (message, messageClass) {
            var prefix = 'ModelRelief: ';
            var logMessage = "" + prefix + message;
            switch (messageClass) {
                case MessageClass.Error:
                    console.error(logMessage);
                    break;
                case MessageClass.Warning:
                    console.warn(logMessage);
                    break;
                case MessageClass.Info:
                    console.info(logMessage);
                    break;
                case MessageClass.None:
                    console.log(logMessage);
                    break;
            }
        };
        /**
         * Add an error message to the log.
         * @param errorMessage Error message text.
         */
        ConsoleLogger.prototype.addErrorMessage = function (errorMessage) {
            this.addMessageEntry(errorMessage, MessageClass.Error);
        };
        /**
         * Add a warning message to the log.
         * @param warningMessage Warning message text.
         */
        ConsoleLogger.prototype.addWarningMessage = function (warningMessage) {
            this.addMessageEntry(warningMessage, MessageClass.Warning);
        };
        /**
         * Add an informational message to the log.
         * @param infoMessage Information message text.
         */
        ConsoleLogger.prototype.addInfoMessage = function (infoMessage) {
            this.addMessageEntry(infoMessage, MessageClass.Info);
        };
        /**
         * Add a message to the log.
         * @param message Information message text.
         * @param style Optional style.
         */
        ConsoleLogger.prototype.addMessage = function (message, style) {
            this.addMessageEntry(message, MessageClass.None);
        };
        /**
         * Adds an empty line
         */
        ConsoleLogger.prototype.addEmptyLine = function () {
            console.log('');
        };
        /**
         * Clears the log output
         */
        ConsoleLogger.prototype.clearLog = function () {
            console.clear();
        };
        return ConsoleLogger;
    }());
    exports.ConsoleLogger = ConsoleLogger;
    /**
     * HTML logging
     * @class
     */
    var HTMLLogger = (function () {
        /**
         * @constructor
         */
        function HTMLLogger() {
            this.rootId = 'loggerRoot';
            this.rootElementTag = 'ul';
            this.messageTag = 'li';
            this.baseMessageClass = 'logMessage';
            this.rootElement = document.querySelector("#" + this.rootId);
            if (!this.rootElement) {
                this.rootElement = document.createElement(this.rootElementTag);
                this.rootElement.id = this.rootId;
                document.body.appendChild(this.rootElement);
            }
        }
        /**
         * Construct a general message and append to the log root.
         * @param message Message text.
         * @param messageClass CSS class to be added to message.
         */
        HTMLLogger.prototype.addMessageElement = function (message, messageClass) {
            var messageElement = document.createElement(this.messageTag);
            messageElement.textContent = message;
            messageElement.className = this.baseMessageClass + " " + (messageClass ? messageClass : '');
            ;
            this.rootElement.appendChild(messageElement);
            return messageElement;
        };
        /**
         * Add an error message to the log.
         * @param errorMessage Error message text.
         */
        HTMLLogger.prototype.addErrorMessage = function (errorMessage) {
            this.addMessageElement(errorMessage, MessageClass.Error);
        };
        /**
         * Add a warning message to the log.
         * @param warningMessage Warning message text.
         */
        HTMLLogger.prototype.addWarningMessage = function (warningMessage) {
            this.addMessageElement(warningMessage, MessageClass.Warning);
        };
        /**
         * Add an informational message to the log.
         * @param infoMessage Information message text.
         */
        HTMLLogger.prototype.addInfoMessage = function (infoMessage) {
            this.addMessageElement(infoMessage, MessageClass.Info);
        };
        /**
         * Add a message to the log.
         * @param message Information message text.
         * @param style Optional CSS style.
         */
        HTMLLogger.prototype.addMessage = function (message, style) {
            var messageElement = this.addMessageElement(message);
            if (style)
                messageElement.style.cssText = style;
        };
        /**
         * Adds an empty line
         */
        HTMLLogger.prototype.addEmptyLine = function () {
            // https://stackoverflow.com/questions/5140547/line-break-inside-a-list-item-generates-space-between-the-lines
            //      this.addMessage('<br/><br/>');        
            this.addMessage('.');
        };
        /**
         * Clears the log output
         */
        HTMLLogger.prototype.clearLog = function () {
            // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
            while (this.rootElement.firstChild) {
                this.rootElement.removeChild(this.rootElement.firstChild);
            }
        };
        return HTMLLogger;
    }());
    exports.HTMLLogger = HTMLLogger;
});
define("System/Services", ["require", "exports", "System/Logger"], function (require, exports, Logger_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Services
     * General runtime support
     * @class
     */
    var Services = (function () {
        /**
         * @constructor
         */
        function Services() {
        }
        Services.consoleLogger = new Logger_1.ConsoleLogger();
        Services.htmlLogger = new Logger_1.HTMLLogger();
        return Services;
    }());
    exports.Services = Services;
});
define("Viewer/Graphics", ["require", "exports", "three", "System/Services"], function (require, exports, THREE, Services_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectNames;
    (function (ObjectNames) {
        ObjectNames["BoundingBox"] = "Bounding Box";
        ObjectNames["Box"] = "Box";
        ObjectNames["CameraHelper"] = "CameraHelper";
        ObjectNames["Plane"] = "Plane";
        ObjectNames["Sphere"] = "Sphere";
        ObjectNames["Triad"] = "Triad";
    })(ObjectNames = exports.ObjectNames || (exports.ObjectNames = {}));
    /**
     *  General THREE.js/WebGL support routines
     *  Graphics Library
     *  @class
     */
    var Graphics = (function () {
        /**
         * @constructor
         */
        function Graphics() {
        }
        //#region Geometry
        /* --------------------------------------------------------------------------------------------------------------------------------------//
        //			Geometry
        // --------------------------------------------------------------------------------------------------------------------------------------*/
        /**
         * Removes an object and all children from a scene.
         * @param scene Scene holding object to be removed.
         * @param rootObject Parent object (possibly with children).
         */
        Graphics.removeObjectChildren = function (rootObject, removeRoot) {
            if (!rootObject)
                return;
            var logger = Services_1.Services.consoleLogger;
            var remover = function (object3d) {
                if (object3d === rootObject) {
                    return;
                }
                logger.addInfoMessage('Removing: ' + object3d.name);
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
            rootObject.traverse(remover);
            // remove root children from root (backwards!)
            for (var iChild = (rootObject.children.length - 1); iChild >= 0; iChild--) {
                var child = rootObject.children[iChild];
                rootObject.remove(child);
            }
            if (removeRoot && rootObject.parent)
                rootObject.parent.remove(rootObject);
        };
        /**
         * Clone and transform an object.
         * @param object Object to clone and transform.
         * @param matrix Transformation matrix.
         */
        Graphics.cloneAndTransformObject = function (object, matrix) {
            // clone object (and geometry!)
            var objectClone = object.clone();
            objectClone.traverse(function (object) {
                if (object instanceof (THREE.Mesh))
                    object.geometry = object.geometry.clone();
            });
            // N.B. Important! The postion, rotation (quaternion) and scale are correcy but the matrix has not been updated.
            // THREE.js updates the matrix is updated in the render() loop.
            objectClone.updateMatrix();
            // transform
            objectClone.applyMatrix(matrix);
            return objectClone;
        };
        /**
         * @param position Location of bounding box.
         * @param mesh Mesh from which to create bounding box.
         * @param material Material of the bounding box.
         * @ returns Mesh of the bounding box.
         */
        Graphics.createBoundingBoxMeshFromGeometry = function (position, geometry, material) {
            var boundingBox, width, height, depth, boxMesh;
            geometry.computeBoundingBox();
            boundingBox = geometry.boundingBox;
            boxMesh = this.createBoundingBoxMeshFromBoundingBox(position, boundingBox, material);
            return boxMesh;
        };
        /**
         * @param position Location of box.
         * @param box Geometry Box from which to create box mesh.
         * @param material Material of the box.
         * @ returns Mesh of the box.
         */
        Graphics.createBoundingBoxMeshFromBoundingBox = function (position, boundingBox, material) {
            var width, height, depth, boxMesh;
            width = boundingBox.max.x - boundingBox.min.x;
            height = boundingBox.max.y - boundingBox.min.y;
            depth = boundingBox.max.z - boundingBox.min.z;
            boxMesh = this.createBoxMesh(position, width, height, depth, material);
            boxMesh.name = ObjectNames.BoundingBox;
            return boxMesh;
        };
        /**
         * Gets the extends of an object optionally including all children.
         */
        Graphics.getBoundingBoxFromObject = function (rootObject) {
            // https://stackoverflow.com/questions/15492857/any-way-to-get-a-bounding-box-from-a-three-js-object3d
            var boundingBox = new THREE.Box3();
            boundingBox = boundingBox.setFromObject(rootObject);
            return boundingBox;
        };
        /**
         * Creates a box mesh.
         * @param position Location of the box.
         * @param width Width.
         * @param height Height.
         * @param depth Depth.
         * @param material Optional material.
         * @returns Box mesh.
         */
        Graphics.createBoxMesh = function (position, width, height, depth, material) {
            var boxGeometry, boxMaterial, box;
            boxGeometry = new THREE.BoxGeometry(width, height, depth);
            boxGeometry.computeBoundingBox();
            boxMaterial = material || new THREE.MeshPhongMaterial({ color: 0x0000ff, opacity: 1.0 });
            box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.name = ObjectNames.Box;
            box.position.copy(position);
            return box;
        };
        /**
         * Creates a plane mesh.
         * @param position Location of the plane.
         * @param width Width.
         * @param height Height.
         * @param material Optional material.
         * @returns Plane mesh.
         */
        Graphics.createPlaneMesh = function (position, width, height, material) {
            var planeGeometry, planeMaterial, plane;
            planeGeometry = new THREE.PlaneGeometry(width, height);
            planeMaterial = material || new THREE.MeshPhongMaterial({ color: 0x0000ff, opacity: 1.0 });
            plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.name = ObjectNames.Plane;
            plane.position.copy(position);
            return plane;
        };
        /**
         * Creates a sphere mesh.
         * @param position Origin of the sphere.
         * @param radius Radius.
         * @param material Material.
         */
        Graphics.createSphereMesh = function (position, radius, material) {
            var sphereGeometry, segmentCount = 32, sphereMaterial, sphere;
            sphereGeometry = new THREE.SphereGeometry(radius, segmentCount, segmentCount);
            sphereGeometry.computeBoundingBox();
            sphereMaterial = material || new THREE.MeshPhongMaterial({ color: 0xff0000, opacity: 1.0 });
            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.name = ObjectNames.Sphere;
            sphere.position.copy(position);
            return sphere;
        };
        /**
     * Creates a line object.
     * @param startPosition Start point.
     * @param endPosition End point.
     * @param color Color.
     * @returns Line element.
     */
        Graphics.createLine = function (startPosition, endPosition, color) {
            var line, lineGeometry, material;
            lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(startPosition, endPosition);
            material = new THREE.LineBasicMaterial({ color: color });
            line = new THREE.Line(lineGeometry, material);
            return line;
        };
        /**
         * Creates an axes triad.
         * @param position Origin of the triad.
         * @param length Length of the coordinate arrow.
         * @param headLength Length of the arrow head.
         * @param headWidth Width of the arrow head.
         */
        Graphics.createWorldAxesTriad = function (position, length, headLength, headWidth) {
            var triadGroup = new THREE.Object3D(), arrowPosition = position || new THREE.Vector3(), arrowLength = length || 15, arrowHeadLength = headLength || 1, arrowHeadWidth = headWidth || 1;
            triadGroup.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), arrowPosition, arrowLength, 0xff0000, arrowHeadLength, arrowHeadWidth));
            triadGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), arrowPosition, arrowLength, 0x00ff00, arrowHeadLength, arrowHeadWidth));
            triadGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), arrowPosition, arrowLength, 0x0000ff, arrowHeadLength, arrowHeadWidth));
            return triadGroup;
        };
        /**
         * Creates an axes grid.
         * @param position  Origin of the axes grid.
         * @param size Size of the grid.
         * @param step Grid line intervals.
         * @returns Grid object.
         */
        Graphics.createWorldAxesGrid = function (position, size, step) {
            var gridGroup = new THREE.Object3D(), gridPosition = position || new THREE.Vector3(), gridSize = size || 10, gridStep = step || 1, colorCenterline = 0xff000000, xyGrid, yzGrid, zxGrid;
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
        };
        /**
         * Adds a camera helper to a scene to visualize the camera position.
         * @param scene Scene to annotate.
         * @param camera Camera to construct helper (may be null).
         */
        Graphics.addCameraHelper = function (scene, camera) {
            // remove existing
            var existingCameraHelper = scene.getObjectByName(ObjectNames.CameraHelper);
            if (existingCameraHelper)
                scene.remove(existingCameraHelper);
            if (!camera)
                return;
            var cameraHelper = new THREE.Group();
            cameraHelper.name = ObjectNames.CameraHelper;
            cameraHelper.visible = true;
            var position = Graphics.createSphereMesh(camera.position, 5);
            cameraHelper.add(position);
            scene.add(cameraHelper);
        };
        /**
         * Adds a coordinate axis helper to a scene to visualize the world axes.
         * @param scene Scene to annotate.
         */
        Graphics.addAxisHelper = function (scene, size) {
            var axisHelper = new THREE.AxisHelper(size);
            axisHelper.visible = true;
            scene.add(axisHelper);
        };
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
         * Converts a JQuery event to world coordinates.
         * @param event Event.
         * @param container DOM container.
         * @param camera Camera.
         * @returns World coordinates.
         */
        Graphics.worldCoordinatesFromJQEvent = function (event, container, camera) {
            var worldCoordinates, deviceCoordinates2D, deviceCoordinates3D, deviceZ;
            deviceCoordinates2D = this.deviceCoordinatesFromJQEvent(event, container);
            deviceZ = (camera instanceof THREE.PerspectiveCamera) ? 0.5 : 1.0;
            deviceCoordinates3D = new THREE.Vector3(deviceCoordinates2D.x, deviceCoordinates2D.y, deviceZ);
            worldCoordinates = deviceCoordinates3D.unproject(camera);
            return worldCoordinates;
        };
        // --------------------------------------------------------------------------------------------------------------------------------------//
        //			View Coordinates
        // --------------------------------------------------------------------------------------------------------------------------------------// 
        /**
         * Converts world coordinates to view coordinates.
         * @param vector World coordinate vector to convert.
         * @param camera Camera.
         * @returns View coordinates.
         */
        Graphics.viewCoordinatesFromWorldCoordinates = function (vector, camera) {
            var position = vector.clone(), viewCoordinates;
            viewCoordinates = position.applyMatrix4(camera.matrixWorldInverse);
            return viewCoordinates;
        };
        // --------------------------------------------------------------------------------------------------------------------------------------//
        //			Device Coordinates
        // --------------------------------------------------------------------------------------------------------------------------------------//
        /**
         * Converts a JQuery event to normalized device coordinates.
         * @param event JQuery event.
         * @param container DOM container.
         * @returns Normalized device coordinates.
         */
        Graphics.deviceCoordinatesFromJQEvent = function (event, container) {
            var deviceCoordinates, screenContainerCoordinates, ratioX, ratioY, deviceX, deviceY;
            screenContainerCoordinates = this.screenContainerCoordinatesFromJQEvent(event, container);
            ratioX = screenContainerCoordinates.x / container.width();
            ratioY = screenContainerCoordinates.y / container.height();
            deviceX = +((ratioX * 2) - 1); // [-1, 1]
            deviceY = -((ratioY * 2) - 1); // [-1, 1]
            deviceCoordinates = new THREE.Vector2(deviceX, deviceY);
            return deviceCoordinates;
        };
        /**
         * Converts world coordinates to device coordinates [-1, 1].
         * @param vector  World coordinates vector.
         * @param camera Camera.
         * @preturns Device coorindates.
         */
        Graphics.deviceCoordinatesFromWorldCoordinates = function (vector, camera) {
            // https://github.com/mrdoob/three.js/issues/78
            var position = vector.clone(), deviceCoordinates2D, deviceCoordinates3D;
            deviceCoordinates3D = position.project(camera);
            deviceCoordinates2D = new THREE.Vector2(deviceCoordinates3D.x, deviceCoordinates3D.y);
            return deviceCoordinates2D;
        };
        // --------------------------------------------------------------------------------------------------------------------------------------//
        //			Screen Coordinates
        // --------------------------------------------------------------------------------------------------------------------------------------//
        /**
         * Page coordinates from a JQuery event.
         * @param event JQuery event.
         * @returns Screen (page) coordinates.
         */
        Graphics.screenPageCoordinatesFromJQEvent = function (event) {
            var screenPageCoordinates = new THREE.Vector2();
            screenPageCoordinates.x = event.pageX;
            screenPageCoordinates.y = event.pageY;
            return screenPageCoordinates;
        };
        /**
         * Client coordinates from a JQuery event.
         * Client coordinates are relative to the <browser> view port. If the document has been scrolled it will
         * be different than the page coordinates which are always relative to the top left of the <entire> HTML page document.
         * http://www.bennadel.com/blog/1869-jquery-mouse-events-pagex-y-vs-clientx-y.htm
         * @param event JQuery event.
         * @returns Screen client coordinates.
         */
        Graphics.screenClientCoordinatesFromJQEvent = function (event) {
            var screenClientCoordinates = new THREE.Vector2();
            screenClientCoordinates.x = event.clientX;
            screenClientCoordinates.y = event.clientY;
            return screenClientCoordinates;
        };
        /**
         * Converts JQuery event coordinates to screen container coordinates.
         * @param event JQuery event.
         * @param container DOM container.
         * @returns Screen container coordinates.
         */
        Graphics.screenContainerCoordinatesFromJQEvent = function (event, container) {
            var screenContainerCoordinates = new THREE.Vector2(), containerOffset, pageX, pageY;
            containerOffset = container.offset();
            // JQuery does not set pageX/pageY for Drop events. They are defined in the originalEvent member.
            pageX = event.pageX || (event.originalEvent).pageX;
            pageY = event.pageY || (event.originalEvent).pageY;
            screenContainerCoordinates.x = pageX - containerOffset.left;
            screenContainerCoordinates.y = pageY - containerOffset.top;
            return screenContainerCoordinates;
        };
        /**
         * Converts world coordinates to screen container coordinates.
         * @param vector World vector.
         * @param container DOM container.
         * @param camera Camera.
         * @returns Screen container coordinates.
         */
        Graphics.screenContainerCoordinatesFromWorldCoordinates = function (vector, container, camera) {
            //https://github.com/mrdoob/three.js/issues/78
            var position = vector.clone(), deviceCoordinates, screenContainerCoordinates, left, top;
            // [(-1, -1), (1, 1)]
            deviceCoordinates = this.deviceCoordinatesFromWorldCoordinates(position, camera);
            left = ((+deviceCoordinates.x + 1) / 2) * container.width();
            top = ((-deviceCoordinates.y + 1) / 2) * container.height();
            screenContainerCoordinates = new THREE.Vector2(left, top);
            return screenContainerCoordinates;
        };
        //#endregion
        //#region Intersections
        /* --------------------------------------------------------------------------------------------------------------------------------------//
        //  Intersections
        // --------------------------------------------------------------------------------------------------------------------------------------*/
        /**
         * Creates a Raycaster through the mouse world position.
         * @param mouseWorld World coordinates.
         * @param camera Camera.
         * @returns THREE.Raycaster.
         */
        Graphics.raycasterFromMouse = function (mouseWorld, camera) {
            var rayOrigin = new THREE.Vector3(mouseWorld.x, mouseWorld.y, camera.position.z), worldPoint = new THREE.Vector3(mouseWorld.x, mouseWorld.y, mouseWorld.z);
            // Tools.consoleLog('World mouse coordinates: ' + worldPoint.x + ', ' + worldPoint.y);
            // construct ray from camera to mouse world
            var raycaster = new THREE.Raycaster(rayOrigin, worldPoint.sub(rayOrigin).normalize());
            return raycaster;
        };
        /**
         * Returns the first Intersection located by the cursor.
         * @param event JQuery event.
         * @param container DOM container.
         * @param camera Camera.
         * @param sceneObjects Array of scene objects.
         * @param recurse Recurse through objects.
         * @returns First intersection with screen objects.
         */
        Graphics.getFirstIntersection = function (event, container, camera, sceneObjects, recurse) {
            var raycaster, mouseWorld, iIntersection, intersection;
            // construct ray from camera to mouse world
            mouseWorld = Graphics.worldCoordinatesFromJQEvent(event, container, camera);
            raycaster = Graphics.raycasterFromMouse(mouseWorld, camera);
            // find all object intersections
            var intersects = raycaster.intersectObjects(sceneObjects, recurse);
            // no intersection?
            if (intersects.length === 0) {
                return null;
            }
            // use first; reject lines (Transform Frame)
            for (iIntersection = 0; iIntersection < intersects.length; iIntersection++) {
                intersection = intersects[iIntersection];
                if (!(intersection.object instanceof THREE.Line))
                    return intersection;
            }
            ;
            return null;
        };
        //#endregion
        //#region Helpers
        /* --------------------------------------------------------------------------------------------------------------------------------------//
        //  Helpers
        // --------------------------------------------------------------------------------------------------------------------------------------*/
        /**
         * Constructs a WebGL target canvas.
         * @param id DOM id for canvas.
         * @param width Width of canvas.
         * @param height Height of canvas.
         */
        Graphics.initializeCanvas = function (id, width, height) {
            var canvas = document.querySelector("#" + id);
            if (!canvas) {
                Services_1.Services.consoleLogger.addErrorMessage("Canvas element id = " + id + " not found");
                return null;
            }
            // CSS controls the size
            if (!width || !height)
                return canvas;
            // render dimensions    
            canvas.width = width;
            canvas.height = height;
            // DOM element dimensions (may be different than render dimensions)
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            return canvas;
        };
        return Graphics;
    }());
    exports.Graphics = Graphics;
});
define("Viewer/Camera", ["require", "exports", "three", "Viewer/Graphics"], function (require, exports, THREE, Graphics_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StandardView;
    (function (StandardView) {
        StandardView[StandardView["Front"] = 0] = "Front";
        StandardView[StandardView["Back"] = 1] = "Back";
        StandardView[StandardView["Top"] = 2] = "Top";
        StandardView[StandardView["Bottom"] = 3] = "Bottom";
        StandardView[StandardView["Left"] = 4] = "Left";
        StandardView[StandardView["Right"] = 5] = "Right";
        StandardView[StandardView["Isometric"] = 6] = "Isometric";
    })(StandardView = exports.StandardView || (exports.StandardView = {}));
    /**
     * Camera
     * General camera utility methods.
     * @class
     */
    var Camera = (function () {
        /**
         * @constructor
         */
        function Camera() {
        }
        //#region Clipping Planes
        /**
         * Returns the extents of the near camera plane.
         * @static
         * @param {THREE.PerspectiveCamera} camera Camera.
         * @returns {THREE.Vector2}
         * @memberof Graphics
         */
        Camera.getNearPlaneExtents = function (camera) {
            var cameraFOVRadians = camera.fov * (Math.PI / 180);
            var nearHeight = 2 * Math.tan(cameraFOVRadians / 2) * camera.near;
            var nearWidth = camera.aspect * nearHeight;
            var extents = new THREE.Vector2(nearWidth, nearHeight);
            return extents;
        };
        //#endregion
        //#region Settings
        /**
         * @description Create the default bounding box for a model.
         * If the model is empty, a unit sphere is uses as a proxy to provide defaults.
         * @static
         * @param {THREE.Object3D} model Model to calculate bounding box.
         * @returns {THREE.Box3}
         */
        Camera.getDefaultBoundingBox = function (model) {
            var boundingBox = new THREE.Box3();
            if (model)
                boundingBox = Graphics_1.Graphics.getBoundingBoxFromObject(model);
            if (!boundingBox.isEmpty())
                return boundingBox;
            // unit sphere proxy
            var sphereProxy = Graphics_1.Graphics.createSphereMesh(new THREE.Vector3(), 1);
            boundingBox = Graphics_1.Graphics.getBoundingBoxFromObject(sphereProxy);
            return boundingBox;
        };
        /**
         * @description Updates the camera to fit the model in the current view.
         * @static
         * @param {THREE.PerspectiveCamera} camera Camera to update.
         * @param {THREE.Group} model Model to fit.
         * @returns {CameraSettings}
         */
        Camera.getFitViewCamera = function (cameraTemplate, model) {
            var camera = cameraTemplate.clone(true);
            var boundingBoxWorld = Camera.getDefaultBoundingBox(model);
            var cameraMatrixWorld = camera.matrixWorld;
            var cameraMatrixWorldInverse = camera.matrixWorldInverse;
            // Find camera position in View coordinates...
            // clone model (and geometry!)
            var modelView = Graphics_1.Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
            var boundingBoxView = Camera.getDefaultBoundingBox(modelView);
            var verticalFieldOfViewRadians = (camera.fov / 2) * (Math.PI / 180);
            var horizontalFieldOfViewRadians = Math.atan(camera.aspect * Math.tan(verticalFieldOfViewRadians));
            var cameraZVerticalExtents = (boundingBoxView.getSize().y / 2) / Math.tan(verticalFieldOfViewRadians);
            var cameraZHorizontalExtents = (boundingBoxView.getSize().x / 2) / Math.tan(horizontalFieldOfViewRadians);
            var cameraZ = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);
            var positionView = new THREE.Vector3(boundingBoxView.getCenter().x, boundingBoxView.getCenter().y, boundingBoxView.max.z + cameraZ);
            // Now, transform back to World coordinates...
            var positionWorld = positionView.applyMatrix4(cameraMatrixWorld);
            camera.position.copy(positionWorld);
            camera.lookAt(boundingBoxWorld.getCenter());
            // force camera matrix to update; matrixAutoUpdate happens in render loop
            camera.updateMatrixWorld(true);
            camera.updateProjectionMatrix();
            return camera;
        };
        /**
         * @description Returns the camera settings to fit the model in a standard view.
         * @static
         * @param {Camera.StandardView} view Standard view (Top, Left, etc.)
         * @param {THREE.Object3D} model Model to fit.
         * @returns {THREE.PerspectiveCamera}
         */
        Camera.getStandardViewCamera = function (view, viewAspect, model) {
            var camera = Camera.getDefaultCamera(viewAspect);
            switch (view) {
                case StandardView.Front: {
                    camera.position.copy(new THREE.Vector3(0, 0, 1));
                    camera.up.set(0, 1, 0);
                    break;
                }
                case StandardView.Back: {
                    camera.position.copy(new THREE.Vector3(0, 0, -1));
                    camera.up.set(0, 1, 0);
                    break;
                }
                case StandardView.Top: {
                    camera.position.copy(new THREE.Vector3(0, 1, 0));
                    camera.up.set(0, 0, -1);
                    break;
                }
                case StandardView.Bottom: {
                    camera.position.copy(new THREE.Vector3(0, -1, 0));
                    camera.up.set(0, 0, 1);
                    break;
                }
                case StandardView.Left: {
                    camera.position.copy(new THREE.Vector3(-1, 0, 0));
                    camera.up.set(0, 1, 0);
                    break;
                }
                case StandardView.Right: {
                    camera.position.copy(new THREE.Vector3(1, 0, 0));
                    camera.up.set(0, 1, 0);
                    break;
                }
                case StandardView.Isometric: {
                    camera.position.copy(new THREE.Vector3(1, 0, 1));
                    camera.up.set(-1, 1, -1);
                    break;
                }
            }
            // Force orientation before Fit View calculation
            camera.lookAt(new THREE.Vector3());
            // force camera matrix to update; matrixAutoUpdate happens in render loop
            camera.updateMatrixWorld(true);
            camera.updateProjectionMatrix();
            camera = Camera.getFitViewCamera(camera, model);
            return camera;
        };
        /**
         * Creates a default scene camera.
         * @param viewAspect View aspect ratio.
         */
        Camera.getDefaultCamera = function (viewAspect) {
            var defaultCamera = new THREE.PerspectiveCamera();
            defaultCamera.position.copy(new THREE.Vector3(0, 0, 1));
            defaultCamera.lookAt(new THREE.Vector3());
            defaultCamera.near = Camera.DefaultNearClippingPlane;
            defaultCamera.far = Camera.DefaultFarClippingPlane;
            defaultCamera.fov = Camera.DefaultFieldOfView;
            defaultCamera.aspect = viewAspect;
            // force camera matrix to update; matrixAutoUpdate happens in render loop
            defaultCamera.updateMatrixWorld(true);
            defaultCamera.updateProjectionMatrix;
            return defaultCamera;
        };
        /**
         * Returns the default scene camera.
         * Creates a default if the current camera has not been constructed.
         * @param camera Active camera (possibly null).
         * @param viewAspect View aspect ratio.
         */
        Camera.getSceneCamera = function (camera, viewAspect) {
            if (camera)
                return camera;
            var defaultCamera = Camera.getDefaultCamera(viewAspect);
            return defaultCamera;
        };
        Camera.DefaultFieldOfView = 37; // 35mm vertical : https://www.nikonians.org/reviews/fov-tables       
        Camera.DefaultNearClippingPlane = 0.1;
        Camera.DefaultFarClippingPlane = 10000;
        return Camera;
    }());
    exports.Camera = Camera;
});
define("System/Math", ["require", "exports"], function (require, exports) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Math Library
     * General mathematics routines
     * @class
     */
    var MathLibrary = (function () {
        /**
         * @constructor
         */
        function MathLibrary() {
        }
        /**
         * Returns whether two numbers are equal within the given tolerance.
         * @param value First value to compare.
         * @param other Second value to compare.
         * @param tolerance Tolerance for comparison.
         * @returns True if within tolerance.
         */
        MathLibrary.numbersEqualWithinTolerance = function (value, other, tolerance) {
            return ((value >= (other - tolerance)) && (value <= (other + tolerance)));
        };
        return MathLibrary;
    }());
    exports.MathLibrary = MathLibrary;
});
define("DepthBuffer/DepthBuffer", ["require", "exports", "chai", "three", "Viewer/Camera", "System/Services"], function (require, exports, chai_1, THREE, Camera_1, Services_2) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *  DepthBuffer
     *  @class
     */
    var DepthBuffer = (function () {
        /**
         * @constructor
         * @param rgbaArray Raw aray of RGBA bytes packed with floats.
         * @param width Width of map.
         * @param height Height of map.
         * @param nearClipPlane Camera near clipping plane.
         * @param farClipPlane Camera far clipping plane.
         */
        function DepthBuffer(rgbaArray, width, height, camera) {
            this._rgbaArray = rgbaArray;
            this.width = width;
            this.height = height;
            this.camera = camera;
            this.initialize();
        }
        Object.defineProperty(DepthBuffer.prototype, "aspectRatio", {
            //#region Properties
            /**
             * Returns the aspect ration of the depth buffer.
             */
            get: function () {
                return this.width / this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "minimumNormalized", {
            /**
             * Returns the minimum normalized depth value.
             */
            get: function () {
                return this._minimumNormalized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "minimum", {
            /**
             * Returns the minimum depth value.
             */
            get: function () {
                var minimum = this.normalizedToModelDepth(this._maximumNormalized);
                return minimum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "maximumNormalized", {
            /**
             * Returns the maximum normalized depth value.
             */
            get: function () {
                return this._maximumNormalized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "maximum", {
            /**
             * Returns the maximum depth value.
             */
            get: function () {
                var maximum = this.normalizedToModelDepth(this.minimumNormalized);
                return maximum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "rangeNormalized", {
            /**
             * Returns the normalized depth range of the buffer.
             */
            get: function () {
                var depthNormalized = this._maximumNormalized - this._minimumNormalized;
                return depthNormalized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "range", {
            /**
             * Returns the normalized depth of the buffer.
             */
            get: function () {
                var depth = this.maximum - this.minimum;
                return depth;
            },
            enumerable: true,
            configurable: true
        });
        //#endregion
        /**
         * Calculate the extents of the depth buffer.
         */
        DepthBuffer.prototype.calculateExtents = function () {
            this.setMinimumNormalized();
            this.setMaximumNormalized();
        };
        /**
         * Initialize
         */
        DepthBuffer.prototype.initialize = function () {
            this._logger = Services_2.Services.htmlLogger;
            this._nearClipPlane = this.camera.near;
            this._farClipPlane = this.camera.far;
            this._cameraClipRange = this._farClipPlane - this._nearClipPlane;
            // RGBA -> Float32
            this.depths = new Float32Array(this._rgbaArray.buffer);
            // calculate extrema of depth buffer values
            this.calculateExtents();
        };
        /**
         * Convert a normalized depth [0,1] to depth in model units.
         * @param normalizedDepth Normalized depth [0,1].
         */
        DepthBuffer.prototype.normalizedToModelDepth = function (normalizedDepth) {
            // https://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
            normalizedDepth = 2.0 * normalizedDepth - 1.0;
            var zLinear = 2.0 * this.camera.near * this.camera.far / (this.camera.far + this.camera.near - normalizedDepth * (this.camera.far - this.camera.near));
            // zLinear is the distance from the camera; reverse to yield height from mesh plane
            zLinear = -(zLinear - this.camera.far);
            return zLinear;
        };
        /**
         * Returns the normalized depth value at a pixel index
         * @param row Buffer row.
         * @param column Buffer column.
         */
        DepthBuffer.prototype.depthNormalized = function (row, column) {
            var index = (Math.round(row) * this.width) + Math.round(column);
            return this.depths[index];
        };
        /**
         * Returns the depth value at a pixel index.
         * @param row Map row.
         * @param pixelColumn Map column.
         */
        DepthBuffer.prototype.depth = function (row, column) {
            var depthNormalized = this.depthNormalized(row, column);
            var depth = this.normalizedToModelDepth(depthNormalized);
            return depth;
        };
        /**
         * Calculates the minimum normalized depth value.
         */
        DepthBuffer.prototype.setMinimumNormalized = function () {
            var minimumNormalized = Number.MAX_VALUE;
            for (var index = 0; index < this.depths.length; index++) {
                var depthValue = this.depths[index];
                if (depthValue < minimumNormalized)
                    minimumNormalized = depthValue;
            }
            this._minimumNormalized = minimumNormalized;
        };
        /**
         * Calculates the maximum normalized depth value.
         */
        DepthBuffer.prototype.setMaximumNormalized = function () {
            var maximumNormalized = Number.MIN_VALUE;
            for (var index = 0; index < this.depths.length; index++) {
                var depthValue = this.depths[index];
                if (depthValue > maximumNormalized)
                    maximumNormalized = depthValue;
            }
            this._maximumNormalized = maximumNormalized;
        };
        /**
             * Returns the linear index of a model point in world coordinates.
             * @param worldVertex Vertex of model.
             */
        DepthBuffer.prototype.getModelVertexIndices = function (worldVertex, planeBoundingBox) {
            var boxSize = planeBoundingBox.getSize();
            var meshExtents = new THREE.Vector2(boxSize.x, boxSize.y);
            //  map coordinates to offsets in range [0, 1]
            var offsetX = (worldVertex.x + (boxSize.x / 2)) / boxSize.x;
            var offsetY = (worldVertex.y + (boxSize.y / 2)) / boxSize.y;
            var row = offsetY * (this.height - 1);
            var column = offsetX * (this.width - 1);
            row = Math.round(row);
            column = Math.round(column);
            chai_1.assert.isTrue((row >= 0) && (row < this.height), ("Vertex (" + worldVertex.x + ", " + worldVertex.y + ", " + worldVertex.z + ") yielded row = " + row));
            chai_1.assert.isTrue((column >= 0) && (column < this.width), ("Vertex (" + worldVertex.x + ", " + worldVertex.y + ", " + worldVertex.z + ") yielded column = " + column));
            return new THREE.Vector2(row, column);
        };
        /**
         * Returns the linear index of a model point in world coordinates.
         * @param worldVertex Vertex of model.
         */
        DepthBuffer.prototype.getModelVertexIndex = function (worldVertex, planeBoundingBox) {
            var indices = this.getModelVertexIndices(worldVertex, planeBoundingBox);
            var row = indices.x;
            var column = indices.y;
            var index = (row * this.width) + column;
            index = Math.round(index);
            chai_1.assert.isTrue((index >= 0) && (index < this.depths.length), ("Vertex (" + worldVertex.x + ", " + worldVertex.y + ", " + worldVertex.z + ") yielded index = " + index));
            return index;
        };
        /**
         * Constructs a pair of triangular faces at the given offset in the DepthBuffer.
         * @param row Row offset (Lower Left).
         * @param column Column offset (Lower Left).
         * @param faceSize Size of a face edge (not hypotenuse).
         * @param baseVertexIndex Beginning offset in mesh geometry vertex array.
         */
        DepthBuffer.prototype.constructTriFacesAtOffset = function (row, column, meshLowerLeft, faceSize, baseVertexIndex) {
            var facePair = {
                vertices: [],
                faces: []
            };
            //  Vertices
            //   2    3       
            //   0    1
            // complete mesh center will be at the world origin
            var originX = meshLowerLeft.x + (column * faceSize);
            var originY = meshLowerLeft.y + (row * faceSize);
            var lowerLeft = new THREE.Vector3(originX + 0, originY + 0, this.depth(row + 0, column + 0)); // baseVertexIndex + 0
            var lowerRight = new THREE.Vector3(originX + faceSize, originY + 0, this.depth(row + 0, column + 1)); // baseVertexIndex + 1
            var upperLeft = new THREE.Vector3(originX + 0, originY + faceSize, this.depth(row + 1, column + 0)); // baseVertexIndex + 2
            var upperRight = new THREE.Vector3(originX + faceSize, originY + faceSize, this.depth(row + 1, column + 1)); // baseVertexIndex + 3
            facePair.vertices.push(lowerLeft, // baseVertexIndex + 0
            lowerRight, // baseVertexIndex + 1
            upperLeft, // baseVertexIndex + 2
            upperRight // baseVertexIndex + 3
            );
            // right hand rule for polygon winding
            facePair.faces.push(new THREE.Face3(baseVertexIndex + 0, baseVertexIndex + 1, baseVertexIndex + 3), new THREE.Face3(baseVertexIndex + 0, baseVertexIndex + 3, baseVertexIndex + 2));
            return facePair;
        };
        /**
         * Constructs a mesh of the given base dimension.
         * @param meshXYExtents Base dimensions (model units). Height is controlled by DB aspect ratio.
         * @param material Material to assign to mesh.
         */
        DepthBuffer.prototype.mesh = function (material) {
            console.time("mesh");
            var meshXYExtents = Camera_1.Camera.getNearPlaneExtents(this.camera);
            if (!material)
                material = new THREE.MeshPhongMaterial(DepthBuffer.DefaultMeshPhongMaterialParameters);
            var meshGeometry = new THREE.Geometry();
            var faceSize = meshXYExtents.x / (this.width - 1);
            var baseVertexIndex = 0;
            var meshLowerLeft = new THREE.Vector2(-(meshXYExtents.x / 2), -(meshXYExtents.y / 2));
            for (var iRow = 0; iRow < (this.height - 1); iRow++) {
                for (var iColumn = 0; iColumn < (this.width - 1); iColumn++) {
                    var facePair = this.constructTriFacesAtOffset(iRow, iColumn, meshLowerLeft, faceSize, baseVertexIndex);
                    (_a = meshGeometry.vertices).push.apply(_a, facePair.vertices);
                    (_b = meshGeometry.faces).push.apply(_b, facePair.faces);
                    baseVertexIndex += 4;
                }
            }
            meshGeometry.computeFaceNormals();
            var mesh = new THREE.Mesh(meshGeometry, material);
            mesh.name = DepthBuffer.MeshModelName;
            console.timeEnd("mesh");
            return mesh;
            var _a, _b;
        };
        /**
         * Analyzes properties of a depth buffer.
         */
        DepthBuffer.prototype.analyze = function () {
            this._logger.clearLog();
            var middle = this.width / 2;
            var decimalPlaces = 5;
            var headerStyle = "font-family : monospace; font-weight : bold; color : blue; font-size : 18px";
            var messageStyle = "font-family : monospace; color : black; font-size : 14px";
            this._logger.addMessage('Camera Properties', headerStyle);
            this._logger.addMessage("Near Plane = " + this.camera.near, messageStyle);
            this._logger.addMessage("Far Plane  = " + this.camera.far, messageStyle);
            this._logger.addMessage("Clip Range = " + (this.camera.far - this.camera.near), messageStyle);
            this._logger.addEmptyLine();
            this._logger.addMessage('Normalized', headerStyle);
            this._logger.addMessage("Center Depth = " + this.depthNormalized(middle, middle).toFixed(decimalPlaces), messageStyle);
            this._logger.addMessage("Z Range = " + this.rangeNormalized.toFixed(decimalPlaces), messageStyle);
            this._logger.addMessage("Minimum = " + this.minimumNormalized.toFixed(decimalPlaces), messageStyle);
            this._logger.addMessage("Maximum = " + this.maximumNormalized.toFixed(decimalPlaces), messageStyle);
            this._logger.addEmptyLine();
            this._logger.addMessage('Model Units', headerStyle);
            this._logger.addMessage("Center Depth = " + this.depth(middle, middle).toFixed(decimalPlaces), messageStyle);
            this._logger.addMessage("Z Range = " + this.range.toFixed(decimalPlaces), messageStyle);
            this._logger.addMessage("Minimum = " + this.minimum.toFixed(decimalPlaces), messageStyle);
            this._logger.addMessage("Maximum = " + this.maximum.toFixed(decimalPlaces), messageStyle);
        };
        DepthBuffer.MeshModelName = 'ModelMesh';
        DepthBuffer.NormalizedTolerance = .001;
        DepthBuffer.DefaultMeshPhongMaterialParameters = { wireframe: false, color: 0xff00ff, reflectivity: 0.75, shininess: 0.75 };
        return DepthBuffer;
    }());
    exports.DepthBuffer = DepthBuffer;
});
define("System/Tools", ["require", "exports"], function (require, exports) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Tool Library
     * General utility routines
     * @class
     */
    var Tools = (function () {
        /**
         * @constructor
         */
        function Tools() {
        }
        //#region Utility
        /// <summary>        
        // Generate a pseudo GUID.
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        /// </summary>
        Tools.generatePseudoGUID = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
        return Tools;
    }());
    exports.Tools = Tools;
});
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
/*
  Requirements
    No persistent DOM element. The canvas is created dynamically.
        Option for persisting the Factory in the constructor
    JSON compatible constructor parameters
    Fixed resolution; resizing support is not required.
*/
define("DepthBuffer/DepthBufferFactory", ["require", "exports", "three", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "System/Services", "System/Tools"], function (require, exports, THREE, DepthBuffer_1, Graphics_2, Services_3, Tools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * DepthBufferFactory
     */
    var DepthBufferFactory = (function () {
        /**
         * @constructor
         * @param parameters Initialization parameters (DepthBufferFactoryParameters)
         */
        function DepthBufferFactory(parameters) {
            this._scene = null; // target scene
            this._model = null; // target model
            this._renderer = null; // scene renderer
            this._canvas = null; // DOM canvas supporting renderer
            this._width = DepthBufferFactory.DefaultResolution; // width resolution of the DB
            this._height = DepthBufferFactory.DefaultResolution; // height resolution of the DB
            this._camera = null; // perspective camera to generate the depth buffer
            this._logDepthBuffer = false; // use a logarithmic buffer for more accuracy in large scenes
            this._boundedClipping = true; // override camera clipping planes; set near and far to bound model for improved accuracy
            this._depthBuffer = null; // depth buffer 
            this._target = null; // WebGL render target for creating the WebGL depth buffer when rendering the scene
            this._encodedTarget = null; // WebGL render target for encodin the WebGL depth buffer into a floating point (RGBA format)
            this._postScene = null; // single polygon scene use to generate the encoded RGBA buffer
            this._postCamera = null; // orthographic camera
            this._postMaterial = null; // shader material that encodes the WebGL depth buffer into a floating point RGBA format
            this._minimumWebGL = true; // true if minimum WeGL requirements are present
            this._logger = null; // logger
            this._addCanvasToDOM = false; // visible canvas; add to HTML page
            // required
            this._width = parameters.width;
            this._height = parameters.height;
            this._model = parameters.model.clone(true);
            // optional
            this._camera = parameters.camera || null;
            this._logDepthBuffer = parameters.logDepthBuffer || false;
            this._boundedClipping = parameters.boundedClipping || true;
            this._addCanvasToDOM = parameters.addCanvasToDOM || false;
            this._canvas = this.initializeCanvas();
            this.initialize();
        }
        //#region Properties
        //#endregion
        //#region Initialization    
        /**
         * Verifies the minimum WebGL extensions are present.
         * @param renderer WebGL renderer.
         */
        DepthBufferFactory.prototype.verifyWebGLExtensions = function () {
            if (!this._renderer.extensions.get('WEBGL_depth_texture')) {
                this._minimumWebGL = false;
                this._logger.addErrorMessage('The minimum WebGL extensions are not supported in the browser.');
                return false;
            }
            return true;
        };
        /**
         * Handle a mouse down event on the canvas.
         */
        DepthBufferFactory.prototype.onMouseDown = function (event) {
            var deviceCoordinates = Graphics_2.Graphics.deviceCoordinatesFromJQEvent(event, $(event.target));
            this._logger.addInfoMessage("device = " + deviceCoordinates.x + ", " + deviceCoordinates.y);
            var decimalPlaces = 2;
            var row = (deviceCoordinates.y + 1) / 2 * this._depthBuffer.height;
            var column = (deviceCoordinates.x + 1) / 2 * this._depthBuffer.width;
            this._logger.addInfoMessage("Offset = [" + row + ", " + column + "]");
            this._logger.addInfoMessage("Depth = " + this._depthBuffer.depth(row, column).toFixed(decimalPlaces));
        };
        /**
         * Constructs a WebGL target canvas.
         */
        DepthBufferFactory.prototype.initializeCanvas = function () {
            this._canvas = document.createElement('canvas');
            this._canvas.setAttribute('name', Tools_1.Tools.generatePseudoGUID());
            this._canvas.setAttribute('class', DepthBufferFactory.CssClassName);
            // render dimensions    
            this._canvas.width = this._width;
            this._canvas.height = this._height;
            // DOM element dimensions (may be different than render dimensions)
            this._canvas.style.width = this._width + "px";
            this._canvas.style.height = this._height + "px";
            // add to DOM?
            if (this._addCanvasToDOM)
                document.querySelector("#" + DepthBufferFactory.RootContainerId).appendChild(this._canvas);
            var $canvas = $(this._canvas).on('mousedown', this.onMouseDown.bind(this));
            return this._canvas;
        };
        /**
         * Perform setup and initialization of the render scene.
         */
        DepthBufferFactory.prototype.initializeScene = function () {
            this._scene = new THREE.Scene();
            if (this._model)
                this._scene.add(this._model);
            this.initializeLighting(this._scene);
        };
        /**
         * Initialize the  model view.
         */
        DepthBufferFactory.prototype.initializeRenderer = function () {
            this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, logarithmicDepthBuffer: this._logDepthBuffer });
            this._renderer.setPixelRatio(window.devicePixelRatio);
            this._renderer.setSize(this._width, this._height);
            // Model Scene -> (Render Texture, Depth Texture)
            this._target = this.constructDepthTextureRenderTarget();
            // Encoded RGBA Texture from Depth Texture
            this._encodedTarget = new THREE.WebGLRenderTarget(this._width, this._height);
            this.verifyWebGLExtensions();
        };
        /**
         * Initialize default lighting in the scene.
         * Lighting does not affect the depth buffer. It is only used if the canvas is made visible.
         */
        DepthBufferFactory.prototype.initializeLighting = function (scene) {
            var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);
            var directionalLight1 = new THREE.DirectionalLight(0xffffff);
            directionalLight1.position.set(1, 1, 1);
            scene.add(directionalLight1);
        };
        /**
         * Perform setup and initialization.
         */
        DepthBufferFactory.prototype.initializePrimary = function () {
            this.initializeScene();
            this.initializeRenderer();
        };
        /**
         * Perform setup and initialization.
         */
        DepthBufferFactory.prototype.initialize = function () {
            this._logger = Services_3.Services.consoleLogger;
            this.initializePrimary();
            this.initializePost();
        };
        //#endregion
        //#region PostProcessing
        /**
         * Constructs a render target <with a depth texture buffer>.
         */
        DepthBufferFactory.prototype.constructDepthTextureRenderTarget = function () {
            // Model Scene -> (Render Texture, Depth Texture)
            var renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);
            renderTarget.texture.format = THREE.RGBAFormat;
            renderTarget.texture.type = THREE.UnsignedByteType;
            renderTarget.texture.minFilter = THREE.NearestFilter;
            renderTarget.texture.magFilter = THREE.NearestFilter;
            renderTarget.texture.generateMipmaps = false;
            renderTarget.stencilBuffer = false;
            renderTarget.depthBuffer = true;
            renderTarget.depthTexture = new THREE.DepthTexture(this._width, this._height);
            renderTarget.depthTexture.type = THREE.UnsignedIntType;
            return renderTarget;
        };
        /**
         * Perform setup and initialization of the post scene used to create the final RGBA encoded depth buffer.
         */
        DepthBufferFactory.prototype.initializePostScene = function () {
            var postMeshMaterial = new THREE.ShaderMaterial({
                vertexShader: MR.shaderSource['DepthBufferVertexShader'],
                fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],
                uniforms: {
                    cameraNear: { value: this._camera.near },
                    cameraFar: { value: this._camera.far },
                    tDiffuse: { value: this._target.texture },
                    tDepth: { value: this._target.depthTexture }
                }
            });
            var postMeshPlane = new THREE.PlaneGeometry(2, 2);
            var postMeshQuad = new THREE.Mesh(postMeshPlane, postMeshMaterial);
            this._postScene = new THREE.Scene();
            this._postScene.add(postMeshQuad);
            this.initializePostCamera();
            this.initializeLighting(this._postScene);
        };
        /**
         * Constructs the orthographic camera used to convert the WebGL depth buffer to the encoded RGBA buffer
         */
        DepthBufferFactory.prototype.initializePostCamera = function () {
            // Setup post processing stage
            var left = -1;
            var right = 1;
            var top = 1;
            var bottom = -1;
            var near = 0;
            var far = 1;
            this._postCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        };
        /**
         * Perform setup and initialization.
         */
        DepthBufferFactory.prototype.initializePost = function () {
            this.initializePostScene();
            this.initializePostCamera();
        };
        //#endregion
        //#region Generation
        /**
         * Verifies the pre-requisite settings are defined to create a mesh.
         */
        DepthBufferFactory.prototype.verifyMeshSettings = function () {
            var minimumSettings = true;
            var errorPrefix = 'DepthBufferFactory: ';
            if (!this._model) {
                this._logger.addErrorMessage(errorPrefix + "The model is not defined.");
                minimumSettings = false;
            }
            if (!this._camera) {
                this._logger.addErrorMessage(errorPrefix + "The camera is not defined.");
                minimumSettings = false;
            }
            return minimumSettings;
        };
        /**
         * Constructs an RGBA string with the byte values of a pixel.
         * @param buffer Unsigned byte raw buffer.
         * @param row Pixel row.
         * @param column Column row.
         */
        DepthBufferFactory.prototype.unsignedBytesToRGBA = function (buffer, row, column) {
            var offset = (row * this._width) + column;
            var rValue = buffer[offset + 0].toString(16);
            var gValue = buffer[offset + 1].toString(16);
            var bValue = buffer[offset + 2].toString(16);
            var aValue = buffer[offset + 3].toString(16);
            return "#" + rValue + gValue + bValue + " " + aValue;
        };
        /**
         * Analyzes a pixel from a render buffer.
         */
        DepthBufferFactory.prototype.analyzeRenderBuffer = function () {
            var renderBuffer = new Uint8Array(this._width * this._height * 4).fill(0);
            this._renderer.readRenderTargetPixels(this._target, 0, 0, this._width, this._height, renderBuffer);
            var messageString = "RGBA[0, 0] = " + this.unsignedBytesToRGBA(renderBuffer, 0, 0);
            this._logger.addMessage(messageString, null);
        };
        /**
         * Analyze the render and depth targets.
         */
        DepthBufferFactory.prototype.analyzeTargets = function () {
            //      this.analyzeRenderBuffer();
            //      this._depthBuffer.analyze();
        };
        /**
         * Create a depth buffer.
         */
        DepthBufferFactory.prototype.createDepthBuffer = function () {
            console.time("createDepthBuffer");
            this._renderer.render(this._scene, this._camera, this._target);
            // (optional) preview encoded RGBA texture; drawn by shader but not persisted
            this._renderer.render(this._postScene, this._postCamera);
            // Persist encoded RGBA texture; calculated from depth buffer
            // encodedTarget.texture      : encoded RGBA texture
            // encodedTarget.depthTexture : null
            this._renderer.render(this._postScene, this._postCamera, this._encodedTarget);
            // decode RGBA texture into depth floats
            var depthBufferRGBA = new Uint8Array(this._width * this._height * 4).fill(0);
            this._renderer.readRenderTargetPixels(this._encodedTarget, 0, 0, this._width, this._height, depthBufferRGBA);
            this._depthBuffer = new DepthBuffer_1.DepthBuffer(depthBufferRGBA, this._width, this._height, this._camera);
            this.analyzeTargets();
            console.timeEnd("createDepthBuffer");
        };
        /**
         * Sets the camera clipping planes for mesh generation.
         */
        DepthBufferFactory.prototype.setCameraClippingPlanes = function () {
            // copy camera; shared with ModelViewer
            var camera = new THREE.PerspectiveCamera();
            camera.copy(this._camera);
            this._camera = camera;
            var cameraMatrixWorldInverse = this._camera.matrixWorldInverse;
            // clone model (and geometry!)
            var modelView = Graphics_2.Graphics.cloneAndTransformObject(this._model, cameraMatrixWorldInverse);
            var boundingBoxView = Graphics_2.Graphics.getBoundingBoxFromObject(modelView);
            // The bounding box is world-axis aligned. 
            // In View coordinates, the camera is at the origin.
            // The bounding near plane is the maximum Z of the bounding box.
            // The bounding far plane is the minimum Z of the bounding box.
            var nearPlane = -boundingBoxView.max.z;
            var farPlane = -boundingBoxView.min.z;
            // adjust by epsilon to avoid clipping geometry at the near plane edge
            this._camera.near = (1 - DepthBufferFactory.NearPlaneEpsilone) * nearPlane;
            // allow user to override calculated far plane
            this._camera.far = Math.min(this._camera.far, farPlane);
            this._camera.updateProjectionMatrix();
        };
        /**
         * Generates a mesh from the active model and camera
         * @param parameters Generation parameters (MeshGenerateParameters)
         */
        DepthBufferFactory.prototype.meshGenerate = function (parameters) {
            if (!this.verifyMeshSettings())
                return null;
            if (this._boundedClipping)
                this.setCameraClippingPlanes();
            this.createDepthBuffer();
            var mesh = this._depthBuffer.mesh(parameters.material);
            return mesh;
        };
        /**
         * Generates an image from the active model and camera
         * @param parameters Generation parameters (ImageGenerateParameters)
         */
        DepthBufferFactory.prototype.imageGenerate = function (parameters) {
            return null;
        };
        DepthBufferFactory.DefaultResolution = 1024; // default DB resolution
        DepthBufferFactory.NearPlaneEpsilone = .001; // adjustment to avoid clipping geometry on the near plane
        DepthBufferFactory.CssClassName = 'DepthBufferFactory'; // CSS class
        DepthBufferFactory.RootContainerId = 'rootContainer'; // root container for viewers
        return DepthBufferFactory;
    }());
    exports.DepthBufferFactory = DepthBufferFactory;
});
define("System/EventManager", ["require", "exports"], function (require, exports) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventType;
    (function (EventType) {
        EventType[EventType["None"] = 0] = "None";
        EventType[EventType["NewModel"] = 1] = "NewModel";
        EventType[EventType["MeshGenerate"] = 2] = "MeshGenerate";
    })(EventType = exports.EventType || (exports.EventType = {}));
    /**
     * Event Manager
     * General event management and dispatching.
     * @class
     */
    var EventManager = (function () {
        /**
        /*
         * Creates EventManager object. It needs to be called with '.call' to add the functionality to an object.
         * @constructor
         */
        function EventManager() {
        }
        /**
         * Adds a listener to an event type.
         * @param type The type of the event that gets added.
         * @param listener The listener function that gets added.
         */
        EventManager.prototype.addEventListener = function (type, listener) {
            if (this._listeners === undefined) {
                this._listeners = [];
                this._listeners[EventType.None] = [];
            }
            var listeners = this._listeners;
            // event does not exist; create
            if (listeners[type] === undefined) {
                listeners[type] = [];
            }
            // do nothing if listener registered
            if (listeners[type].indexOf(listener) === -1) {
                // add new listener to this event
                listeners[type].push(listener);
            }
        };
        /**
         * Checks whether a listener is registered for an event.
         * @param type The type of the event to check.
         * @param listener The listener function to check..
         */
        EventManager.prototype.hasEventListener = function (type, listener) {
            // no events     
            if (this._listeners === undefined)
                return false;
            var listeners = this._listeners;
            // event exists and listener registered => true
            return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
        };
        /**
         * Removes a listener from an event type.
         * @param type The type of the event that gets removed.
         * @param listener The listener function that gets removed.
         */
        EventManager.prototype.removeEventListener = function (type, listener) {
            // no events; do nothing
            if (this._listeners === undefined)
                return;
            var listeners = this._listeners;
            var listenerArray = listeners[type];
            if (listenerArray !== undefined) {
                var index = listenerArray.indexOf(listener);
                // remove if found
                if (index !== -1) {
                    listenerArray.splice(index, 1);
                }
            }
        };
        /**
         * Fire an event type.
         * @param target Event target.
         * @param type The type of event that gets fired.
         */
        EventManager.prototype.dispatchEvent = function (target, eventType) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            // no events defined; do nothing
            if (this._listeners === undefined)
                return;
            var listeners = this._listeners;
            var listenerArray = listeners[eventType];
            if (listenerArray !== undefined) {
                var theEvent = {
                    type: eventType,
                    target: target // set target to instance triggering the event
                };
                // duplicate original array of listeners
                var array = listenerArray.slice(0);
                var length_1 = array.length;
                for (var index = 0; index < length_1; index++) {
                    array[index].apply(array, [theEvent].concat(args));
                }
            }
        };
        return EventManager;
    }());
    exports.EventManager = EventManager;
});
// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         // 
// @author mrdoob / http://mrdoob.com/                                     // 
// ------------------------------------------------------------------------//
define("ModelLoaders/OBJLoader", ["require", "exports", "three"], function (require, exports, THREE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function OBJLoader(manager) {
        this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        this.materials = null;
        this.regexp = {
            // v float float float
            vertex_pattern: /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/,
            // vn float float float
            normal_pattern: /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/,
            // vt float float
            uv_pattern: /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/,
            // f vertex vertex vertex
            face_vertex: /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,
            // f vertex/uv vertex/uv vertex/uv
            face_vertex_uv: /^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,
            // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
            face_vertex_uv_normal: /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,
            // f vertex//normal vertex//normal vertex//normal
            face_vertex_normal: /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,
            // o object_name | g group_name
            object_pattern: /^[og]\s*(.+)?/,
            // s boolean
            smoothing_pattern: /^s\s+(\d+|on|off)/,
            // mtllib file_reference
            material_library_pattern: /^mtllib /,
            // usemtl material_name
            material_use_pattern: /^usemtl /
        };
    }
    exports.OBJLoader = OBJLoader;
    ;
    OBJLoader.prototype = {
        constructor: OBJLoader,
        load: function (url, onLoad, onProgress, onError) {
            var scope = this;
            var loader = new THREE.FileLoader(scope.manager);
            loader.setPath(this.path);
            loader.load(url, function (text) {
                onLoad(scope.parse(text));
            }, onProgress, onError);
        },
        setPath: function (value) {
            this.path = value;
        },
        setMaterials: function (materials) {
            this.materials = materials;
        },
        _createParserState: function () {
            var state = {
                objects: [],
                object: {},
                vertices: [],
                normals: [],
                uvs: [],
                materialLibraries: [],
                startObject: function (name, fromDeclaration) {
                    // If the current object (initial from reset) is not from a g/o declaration in the parsed
                    // file. We need to use it for the first parsed g/o to keep things in sync.
                    if (this.object && this.object.fromDeclaration === false) {
                        this.object.name = name;
                        this.object.fromDeclaration = (fromDeclaration !== false);
                        return;
                    }
                    var previousMaterial = (this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined);
                    if (this.object && typeof this.object._finalize === 'function') {
                        this.object._finalize(true);
                    }
                    this.object = {
                        name: name || '',
                        fromDeclaration: (fromDeclaration !== false),
                        geometry: {
                            vertices: [],
                            normals: [],
                            uvs: []
                        },
                        materials: [],
                        smooth: true,
                        startMaterial: function (name, libraries) {
                            var previous = this._finalize(false);
                            // New usemtl declaration overwrites an inherited material, except if faces were declared
                            // after the material, then it must be preserved for proper MultiMaterial continuation.
                            if (previous && (previous.inherited || previous.groupCount <= 0)) {
                                this.materials.splice(previous.index, 1);
                            }
                            var material = {
                                index: this.materials.length,
                                name: name || '',
                                mtllib: (Array.isArray(libraries) && libraries.length > 0 ? libraries[libraries.length - 1] : ''),
                                smooth: (previous !== undefined ? previous.smooth : this.smooth),
                                groupStart: (previous !== undefined ? previous.groupEnd : 0),
                                groupEnd: -1,
                                groupCount: -1,
                                inherited: false,
                                clone: function (index) {
                                    var cloned = {
                                        index: (typeof index === 'number' ? index : this.index),
                                        name: this.name,
                                        mtllib: this.mtllib,
                                        smooth: this.smooth,
                                        groupStart: 0,
                                        groupEnd: -1,
                                        groupCount: -1,
                                        inherited: false,
                                        // ModelRelief
                                        clone: null
                                    };
                                    cloned.clone = this.clone.bind(cloned);
                                    return cloned;
                                }
                            };
                            this.materials.push(material);
                            return material;
                        },
                        currentMaterial: function () {
                            if (this.materials.length > 0) {
                                return this.materials[this.materials.length - 1];
                            }
                            return undefined;
                        },
                        _finalize: function (end) {
                            var lastMultiMaterial = this.currentMaterial();
                            if (lastMultiMaterial && lastMultiMaterial.groupEnd === -1) {
                                lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
                                lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
                                lastMultiMaterial.inherited = false;
                            }
                            // Ignore objects tail materials if no face declarations followed them before a new o/g started.
                            if (end && this.materials.length > 1) {
                                for (var mi = this.materials.length - 1; mi >= 0; mi--) {
                                    if (this.materials[mi].groupCount <= 0) {
                                        this.materials.splice(mi, 1);
                                    }
                                }
                            }
                            // Guarantee at least one empty material, this makes the creation later more straight forward.
                            if (end && this.materials.length === 0) {
                                this.materials.push({
                                    name: '',
                                    smooth: this.smooth
                                });
                            }
                            return lastMultiMaterial;
                        }
                    };
                    // Inherit previous objects material.
                    // Spec tells us that a declared material must be set to all objects until a new material is declared.
                    // If a usemtl declaration is encountered while this new object is being parsed, it will
                    // overwrite the inherited material. Exception being that there was already face declarations
                    // to the inherited material, then it will be preserved for proper MultiMaterial continuation.
                    if (previousMaterial && previousMaterial.name && typeof previousMaterial.clone === "function") {
                        var declared = previousMaterial.clone(0);
                        declared.inherited = true;
                        this.object.materials.push(declared);
                    }
                    this.objects.push(this.object);
                },
                finalize: function () {
                    if (this.object && typeof this.object._finalize === 'function') {
                        this.object._finalize(true);
                    }
                },
                parseVertexIndex: function (value, len) {
                    var index = parseInt(value, 10);
                    return (index >= 0 ? index - 1 : index + len / 3) * 3;
                },
                parseNormalIndex: function (value, len) {
                    var index = parseInt(value, 10);
                    return (index >= 0 ? index - 1 : index + len / 3) * 3;
                },
                parseUVIndex: function (value, len) {
                    var index = parseInt(value, 10);
                    return (index >= 0 ? index - 1 : index + len / 2) * 2;
                },
                addVertex: function (a, b, c) {
                    var src = this.vertices;
                    var dst = this.object.geometry.vertices;
                    dst.push(src[a + 0]);
                    dst.push(src[a + 1]);
                    dst.push(src[a + 2]);
                    dst.push(src[b + 0]);
                    dst.push(src[b + 1]);
                    dst.push(src[b + 2]);
                    dst.push(src[c + 0]);
                    dst.push(src[c + 1]);
                    dst.push(src[c + 2]);
                },
                addVertexLine: function (a) {
                    var src = this.vertices;
                    var dst = this.object.geometry.vertices;
                    dst.push(src[a + 0]);
                    dst.push(src[a + 1]);
                    dst.push(src[a + 2]);
                },
                addNormal: function (a, b, c) {
                    var src = this.normals;
                    var dst = this.object.geometry.normals;
                    dst.push(src[a + 0]);
                    dst.push(src[a + 1]);
                    dst.push(src[a + 2]);
                    dst.push(src[b + 0]);
                    dst.push(src[b + 1]);
                    dst.push(src[b + 2]);
                    dst.push(src[c + 0]);
                    dst.push(src[c + 1]);
                    dst.push(src[c + 2]);
                },
                addUV: function (a, b, c) {
                    var src = this.uvs;
                    var dst = this.object.geometry.uvs;
                    dst.push(src[a + 0]);
                    dst.push(src[a + 1]);
                    dst.push(src[b + 0]);
                    dst.push(src[b + 1]);
                    dst.push(src[c + 0]);
                    dst.push(src[c + 1]);
                },
                addUVLine: function (a) {
                    var src = this.uvs;
                    var dst = this.object.geometry.uvs;
                    dst.push(src[a + 0]);
                    dst.push(src[a + 1]);
                },
                addFace: function (a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {
                    var vLen = this.vertices.length;
                    var ia = this.parseVertexIndex(a, vLen);
                    var ib = this.parseVertexIndex(b, vLen);
                    var ic = this.parseVertexIndex(c, vLen);
                    var id;
                    if (d === undefined) {
                        this.addVertex(ia, ib, ic);
                    }
                    else {
                        id = this.parseVertexIndex(d, vLen);
                        this.addVertex(ia, ib, id);
                        this.addVertex(ib, ic, id);
                    }
                    if (ua !== undefined) {
                        var uvLen = this.uvs.length;
                        ia = this.parseUVIndex(ua, uvLen);
                        ib = this.parseUVIndex(ub, uvLen);
                        ic = this.parseUVIndex(uc, uvLen);
                        if (d === undefined) {
                            this.addUV(ia, ib, ic);
                        }
                        else {
                            id = this.parseUVIndex(ud, uvLen);
                            this.addUV(ia, ib, id);
                            this.addUV(ib, ic, id);
                        }
                    }
                    if (na !== undefined) {
                        // Normals are many times the same. If so, skip function call and parseInt.
                        var nLen = this.normals.length;
                        ia = this.parseNormalIndex(na, nLen);
                        ib = na === nb ? ia : this.parseNormalIndex(nb, nLen);
                        ic = na === nc ? ia : this.parseNormalIndex(nc, nLen);
                        if (d === undefined) {
                            this.addNormal(ia, ib, ic);
                        }
                        else {
                            id = this.parseNormalIndex(nd, nLen);
                            this.addNormal(ia, ib, id);
                            this.addNormal(ib, ic, id);
                        }
                    }
                },
                addLineGeometry: function (vertices, uvs) {
                    this.object.geometry.type = 'Line';
                    var vLen = this.vertices.length;
                    var uvLen = this.uvs.length;
                    for (var vi = 0, l = vertices.length; vi < l; vi++) {
                        this.addVertexLine(this.parseVertexIndex(vertices[vi], vLen));
                    }
                    for (var uvi = 0, l = uvs.length; uvi < l; uvi++) {
                        this.addUVLine(this.parseUVIndex(uvs[uvi], uvLen));
                    }
                }
            };
            state.startObject('', false);
            return state;
        },
        parse: function (text) {
            console.time('OBJLoader');
            var state = this._createParserState();
            if (text.indexOf('\r\n') !== -1) {
                // This is faster than String.split with regex that splits on both
                text = text.replace(/\r\n/g, '\n');
            }
            if (text.indexOf('\\\n') !== -1) {
                // join lines separated by a line continuation character (\)
                text = text.replace(/\\\n/g, '');
            }
            var lines = text.split('\n');
            var line = '', lineFirstChar = '', lineSecondChar = '';
            var lineLength = 0;
            var result = [];
            // Faster to just trim left side of the line. Use if available.
            // ModelRelief
            // var trimLeft = ( typeof ''.trimLeft === 'function' );
            for (var i = 0, l = lines.length; i < l; i++) {
                line = lines[i];
                // ModelRelief
                // line = trimLeft ? line.trimLeft() : line.trim();
                line = line.trim();
                lineLength = line.length;
                if (lineLength === 0)
                    continue;
                lineFirstChar = line.charAt(0);
                // @todo invoke passed in handler if any
                if (lineFirstChar === '#')
                    continue;
                if (lineFirstChar === 'v') {
                    lineSecondChar = line.charAt(1);
                    if (lineSecondChar === ' ' && (result = this.regexp.vertex_pattern.exec(line)) !== null) {
                        // 0                  1      2      3
                        // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                        state.vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                    }
                    else if (lineSecondChar === 'n' && (result = this.regexp.normal_pattern.exec(line)) !== null) {
                        // 0                   1      2      3
                        // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                        state.normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                    }
                    else if (lineSecondChar === 't' && (result = this.regexp.uv_pattern.exec(line)) !== null) {
                        // 0               1      2
                        // ["vt 0.1 0.2", "0.1", "0.2"]
                        state.uvs.push(parseFloat(result[1]), parseFloat(result[2]));
                    }
                    else {
                        throw new Error("Unexpected vertex/normal/uv line: '" + line + "'");
                    }
                }
                else if (lineFirstChar === "f") {
                    if ((result = this.regexp.face_vertex_uv_normal.exec(line)) !== null) {
                        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
                        // 0                        1    2    3    4    5    6    7    8    9   10         11         12
                        // ["f 1/1/1 2/2/2 3/3/3", "1", "1", "1", "2", "2", "2", "3", "3", "3", undefined, undefined, undefined]
                        state.addFace(result[1], result[4], result[7], result[10], result[2], result[5], result[8], result[11], result[3], result[6], result[9], result[12]);
                    }
                    else if ((result = this.regexp.face_vertex_uv.exec(line)) !== null) {
                        // f vertex/uv vertex/uv vertex/uv
                        // 0                  1    2    3    4    5    6   7          8
                        // ["f 1/1 2/2 3/3", "1", "1", "2", "2", "3", "3", undefined, undefined]
                        state.addFace(result[1], result[3], result[5], result[7], result[2], result[4], result[6], result[8]);
                    }
                    else if ((result = this.regexp.face_vertex_normal.exec(line)) !== null) {
                        // f vertex//normal vertex//normal vertex//normal
                        // 0                     1    2    3    4    5    6   7          8
                        // ["f 1//1 2//2 3//3", "1", "1", "2", "2", "3", "3", undefined, undefined]
                        state.addFace(result[1], result[3], result[5], result[7], undefined, undefined, undefined, undefined, result[2], result[4], result[6], result[8]);
                    }
                    else if ((result = this.regexp.face_vertex.exec(line)) !== null) {
                        // f vertex vertex vertex
                        // 0            1    2    3   4
                        // ["f 1 2 3", "1", "2", "3", undefined]
                        state.addFace(result[1], result[2], result[3], result[4]);
                    }
                    else {
                        throw new Error("Unexpected face line: '" + line + "'");
                    }
                }
                else if (lineFirstChar === "l") {
                    var lineParts = line.substring(1).trim().split(" ");
                    var lineVertices = [], lineUVs = [];
                    if (line.indexOf("/") === -1) {
                        lineVertices = lineParts;
                    }
                    else {
                        for (var li = 0, llen = lineParts.length; li < llen; li++) {
                            var parts = lineParts[li].split("/");
                            if (parts[0] !== "")
                                lineVertices.push(parts[0]);
                            if (parts[1] !== "")
                                lineUVs.push(parts[1]);
                        }
                    }
                    state.addLineGeometry(lineVertices, lineUVs);
                }
                else if ((result = this.regexp.object_pattern.exec(line)) !== null) {
                    // o object_name
                    // or
                    // g group_name
                    // WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
                    // var name = result[ 0 ].substr( 1 ).trim();
                    var name = (" " + result[0].substr(1).trim()).substr(1);
                    state.startObject(name);
                }
                else if (this.regexp.material_use_pattern.test(line)) {
                    // material
                    state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);
                }
                else if (this.regexp.material_library_pattern.test(line)) {
                    // mtl file
                    state.materialLibraries.push(line.substring(7).trim());
                }
                else if ((result = this.regexp.smoothing_pattern.exec(line)) !== null) {
                    // smooth shading
                    // @todo Handle files that have varying smooth values for a set of faces inside one geometry,
                    // but does not define a usemtl for each face set.
                    // This should be detected and a dummy material created (later MultiMaterial and geometry groups).
                    // This requires some care to not create extra material on each smooth value for "normal" obj files.
                    // where explicit usemtl defines geometry groups.
                    // Example asset: examples/models/obj/cerberus/Cerberus.obj
                    var value = result[1].trim().toLowerCase();
                    /*
                     * http://paulbourke.net/dataformats/obj/
                     * or
                     * http://www.cs.utah.edu/~boulos/cs3505/obj_spec.pdf
                     *
                     * From chapter "Grouping" Syntax explanation "s group_number":
                     * "group_number is the smoothing group number. To turn off smoothing groups, use a value of 0 or off.
                     * Polygonal elements use group numbers to put elements in different smoothing groups. For free-form
                     * surfaces, smoothing groups are either turned on or off; there is no difference between values greater
                     * than 0."
                     */
                    state.object.smooth = (value !== '0' && value !== 'off');
                    var material = state.object.currentMaterial();
                    if (material) {
                        material.smooth = state.object.smooth;
                    }
                }
                else {
                    // Handle null terminated files without exception
                    if (line === '\0')
                        continue;
                    throw new Error("Unexpected line: '" + line + "'");
                }
            }
            state.finalize();
            var container = new THREE.Group();
            // ModelRelief
            //container.materialLibraries = [].concat( state.materialLibraries );
            container.materialLibraries = [].concat(state.materialLibraries);
            for (var i = 0, l = state.objects.length; i < l; i++) {
                var object = state.objects[i];
                var geometry = object.geometry;
                var materials = object.materials;
                var isLine = (geometry.type === 'Line');
                // Skip o/g line declarations that did not follow with any faces
                if (geometry.vertices.length === 0)
                    continue;
                var buffergeometry = new THREE.BufferGeometry();
                buffergeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(geometry.vertices), 3));
                if (geometry.normals.length > 0) {
                    buffergeometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(geometry.normals), 3));
                }
                else {
                    buffergeometry.computeVertexNormals();
                }
                if (geometry.uvs.length > 0) {
                    buffergeometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(geometry.uvs), 2));
                }
                // Create materials
                // ModelRelief
                //var createdMaterials = [];           
                var createdMaterials = [];
                for (var mi = 0, miLen = materials.length; mi < miLen; mi++) {
                    var sourceMaterial = materials[mi];
                    var material = undefined;
                    if (this.materials !== null) {
                        material = this.materials.create(sourceMaterial.name);
                        // mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
                        if (isLine && material && !(material instanceof THREE.LineBasicMaterial)) {
                            var materialLine = new THREE.LineBasicMaterial();
                            materialLine.copy(material);
                            material = materialLine;
                        }
                    }
                    if (!material) {
                        material = (!isLine ? new THREE.MeshPhongMaterial() : new THREE.LineBasicMaterial());
                        material.name = sourceMaterial.name;
                    }
                    material.shading = sourceMaterial.smooth ? THREE.SmoothShading : THREE.FlatShading;
                    createdMaterials.push(material);
                }
                // Create mesh
                var mesh;
                if (createdMaterials.length > 1) {
                    for (var mi = 0, miLen = materials.length; mi < miLen; mi++) {
                        var sourceMaterial = materials[mi];
                        buffergeometry.addGroup(sourceMaterial.groupStart, sourceMaterial.groupCount, mi);
                    }
                    // ModelRelief
                    //mesh = ( ! isLine ? new THREE.Mesh( buffergeometry, createdMaterials ) : new THREE.LineSegments( buffergeometry, createdMaterials ) );
                    mesh = (!isLine ? new THREE.Mesh(buffergeometry, createdMaterials[0]) : new THREE.LineSegments(buffergeometry, null));
                }
                else {
                    // ModelRelief
                    //mesh = ( ! isLine ? new THREE.Mesh( buffergeometry, createdMaterials[ 0 ] ) : new THREE.LineSegments( buffergeometry, createMaterials) );
                    mesh = (!isLine ? new THREE.Mesh(buffergeometry, createdMaterials[0]) : new THREE.LineSegments(buffergeometry, null));
                }
                mesh.name = object.name;
                container.add(mesh);
            }
            console.timeEnd('OBJLoader');
            return container;
        }
    };
});
define("Viewer/CameraControls", ["require", "exports", "dat-gui", "Viewer/Camera"], function (require, exports, dat, Camera_2) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * CameraControls
     */
    var CameraSettings = (function () {
        function CameraSettings(camera, fitView) {
            this.fitView = fitView;
            this.standardView = Camera_2.StandardView.Front;
            this.nearClippingPlane = camera.near;
            this.farClippingPlane = camera.far;
            this.fieldOfView = camera.fov;
        }
        return CameraSettings;
    }());
    /**
     * camera UI Controls.
     */
    var CameraControls = (function () {
        /** Default constructor
         * @class CameraControls
         * @constructor
         */
        function CameraControls(viewer) {
            this._viewer = viewer;
            // UI Controls
            this.initializeControls();
        }
        //#region Event Handlers
        /**
         * Fits the active view.
         */
        CameraControls.prototype.fitView = function () {
            this._viewer.fitView();
        };
        //#endregion
        /**
         * Initialize the view settings that are controllable by the user
         */
        CameraControls.prototype.initializeControls = function () {
            var scope = this;
            this._cameraSettings = new CameraSettings(this._viewer.camera, this.fitView.bind(this));
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById(this._viewer.containerId);
            menuDiv.appendChild(gui.domElement);
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            //                                                                     Camera                                                                   //      
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            var cameraOptions = gui.addFolder('Camera Options');
            // Generate Relief
            var controlFitView = cameraOptions.add(this._cameraSettings, 'fitView').name('Fit View');
            // Standard Views
            var viewOptions = {
                Front: Camera_2.StandardView.Front,
                Back: Camera_2.StandardView.Back,
                Top: Camera_2.StandardView.Top,
                Isometric: Camera_2.StandardView.Isometric,
                Left: Camera_2.StandardView.Left,
                Right: Camera_2.StandardView.Right,
                Bottom: Camera_2.StandardView.Bottom
            };
            var controlStandardViews = cameraOptions.add(this._cameraSettings, 'standardView', viewOptions).name('Standard View');
            controlStandardViews.onChange(function (viewSetting) {
                var view = parseInt(viewSetting, 10);
                scope._viewer.setCameraToStandardView(view);
            });
            // Near Clipping Plane
            var minimum = 0.1;
            var maximum = 100;
            var stepSize = 0.1;
            var controlNearClippingPlane = cameraOptions.add(this._cameraSettings, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            controlNearClippingPlane.onChange(function (value) {
                scope._viewer.camera.near = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Far Clipping Plane
            minimum = 1;
            maximum = 10000;
            stepSize = 0.1;
            var controlFarClippingPlane = cameraOptions.add(this._cameraSettings, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFarClippingPlane.onChange(function (value) {
                scope._viewer.camera.far = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Field of View
            minimum = 25;
            maximum = 75;
            stepSize = 1;
            var controlFieldOfView = cameraOptions.add(this._cameraSettings, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFieldOfView.onChange(function (value) {
                scope._viewer.camera.fov = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            cameraOptions.open();
        };
        /**
         * Synchronize the UI camera settings with the target camera.
         * @param camera
         */
        CameraControls.prototype.synchronizeCameraSettings = function () {
            this._cameraSettings.nearClippingPlane = this._viewer.camera.near;
            this._cameraSettings.farClippingPlane = this._viewer.camera.far;
            this._cameraSettings.fieldOfView = this._viewer.camera.fov;
        };
        return CameraControls;
    }());
    exports.CameraControls = CameraControls;
});
define("Viewer/Materials", ["require", "exports", "three"], function (require, exports, THREE) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Materials
     * General THREE.js Material classes and helpers
     * @class
     */
    var Materials = (function () {
        /**
         * @constructor
         */
        function Materials() {
        }
        //#region Materials
        /**
         * Create a texture material from an image URL.
         * @param image Image to use in texture.
         * @returns Texture material.
         */
        Materials.createTextureMaterial = function (image) {
            var texture, textureMaterial;
            texture = new THREE.Texture(image);
            texture.needsUpdate = true;
            texture.generateMipmaps = false;
            texture.magFilter = THREE.NearestFilter; // The magnification and minification filters sample the texture map elements when mapping to a pixel.
            texture.minFilter = THREE.NearestFilter; // The default modes oversample which leads to blending with the black background. 
            // This produces colored (black) artifacts around the edges of the texture map elements.
            texture.repeat = new THREE.Vector2(1.0, 1.0);
            textureMaterial = new THREE.MeshBasicMaterial({ map: texture });
            textureMaterial.transparent = true;
            return textureMaterial;
        };
        /**
         *  Create a bump map Phong material from a texture map.
         * @param designTexture Bump map texture.
         * @returns Phong bump mapped material.
         */
        Materials.createMeshPhongMaterial = function (designTexture) {
            var material;
            material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                bumpMap: designTexture,
                bumpScale: -1.0,
                shading: THREE.SmoothShading,
            });
            return material;
        };
        /**
         * Create a transparent material.
         * @returns Transparent material.
         */
        Materials.createTransparentMaterial = function () {
            return new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.0, transparent: true });
        };
        return Materials;
    }());
    exports.Materials = Materials;
});
/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */
define("Viewer/TrackballControls", ["require", "exports", "three"], function (require, exports, THREE) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function TrackballControls(object, domElement) {
        var _this = this;
        var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
        this.object = object;
        this.domElement = (domElement !== undefined) ? domElement : document;
        // API
        this.enabled = true;
        this.screen = { left: 0, top: 0, width: 0, height: 0 };
        this.rotateSpeed = 1.0;
        this.zoomSpeed = 1.2;
        this.panSpeed = 0.3;
        this.noRotate = false;
        this.noZoom = false;
        this.noPan = false;
        this.staticMoving = true;
        this.dynamicDampingFactor = 0.2;
        this.minDistance = 0;
        this.maxDistance = Infinity;
        this.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];
        // internals
        this.target = new THREE.Vector3();
        var EPS = 0.000001;
        var lastPosition = new THREE.Vector3();
        var _state = STATE.NONE, _prevState = STATE.NONE, _eye = new THREE.Vector3(), _movePrev = new THREE.Vector2(), _moveCurr = new THREE.Vector2(), _lastAxis = new THREE.Vector3(), _lastAngle = 0, _zoomStart = new THREE.Vector2(), _zoomEnd = new THREE.Vector2(), _touchZoomDistanceStart = 0, _touchZoomDistanceEnd = 0, _panStart = new THREE.Vector2(), _panEnd = new THREE.Vector2();
        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.up0 = this.object.up.clone();
        // events
        var changeEvent = { type: 'change' };
        var startEvent = { type: 'start' };
        var endEvent = { type: 'end' };
        // methods
        this.handleResize = function () {
            if (this.domElement === document) {
                this.screen.left = 0;
                this.screen.top = 0;
                this.screen.width = window.innerWidth;
                this.screen.height = window.innerHeight;
            }
            else {
                var box = this.domElement.getBoundingClientRect();
                // adjustments come from similar code in the jquery offset() function
                var d = this.domElement.ownerDocument.documentElement;
                this.screen.left = box.left + window.pageXOffset - d.clientLeft;
                this.screen.top = box.top + window.pageYOffset - d.clientTop;
                this.screen.width = box.width;
                this.screen.height = box.height;
            }
        };
        this.handleEvent = function (event) {
            if (typeof this[event.type] === 'function') {
                this[event.type](event);
            }
        };
        var getMouseOnScreen = (function () {
            var vector = new THREE.Vector2();
            return function getMouseOnScreen(pageX, pageY) {
                vector.set((pageX - _this.screen.left) / _this.screen.width, (pageY - _this.screen.top) / _this.screen.height);
                return vector;
            };
        }());
        var getMouseOnCircle = (function () {
            var vector = new THREE.Vector2();
            return function getMouseOnCircle(pageX, pageY) {
                vector.set(((pageX - _this.screen.width * 0.5 - _this.screen.left) / (_this.screen.width * 0.5)), ((_this.screen.height + 2 * (_this.screen.top - pageY)) / _this.screen.width) // screen.width intentional
                );
                return vector;
            };
        }());
        this.rotateCamera = (function () {
            var axis = new THREE.Vector3(), quaternion = new THREE.Quaternion(), eyeDirection = new THREE.Vector3(), objectUpDirection = new THREE.Vector3(), objectSidewaysDirection = new THREE.Vector3(), moveDirection = new THREE.Vector3(), angle;
            return function rotateCamera() {
                moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
                angle = moveDirection.length();
                if (angle) {
                    _eye.copy(_this.object.position).sub(_this.target);
                    eyeDirection.copy(_eye).normalize();
                    objectUpDirection.copy(_this.object.up).normalize();
                    objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();
                    objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
                    objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);
                    moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));
                    axis.crossVectors(moveDirection, _eye).normalize();
                    angle *= _this.rotateSpeed;
                    quaternion.setFromAxisAngle(axis, angle);
                    _eye.applyQuaternion(quaternion);
                    _this.object.up.applyQuaternion(quaternion);
                    _lastAxis.copy(axis);
                    _lastAngle = angle;
                }
                else if (!_this.staticMoving && _lastAngle) {
                    _lastAngle *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
                    _eye.copy(_this.object.position).sub(_this.target);
                    quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
                    _eye.applyQuaternion(quaternion);
                    _this.object.up.applyQuaternion(quaternion);
                }
                _movePrev.copy(_moveCurr);
            };
        }());
        this.zoomCamera = function () {
            var factor;
            if (_state === STATE.TOUCH_ZOOM_PAN) {
                factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
                _touchZoomDistanceStart = _touchZoomDistanceEnd;
                _eye.multiplyScalar(factor);
            }
            else {
                factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;
                if (factor !== 1.0 && factor > 0.0) {
                    _eye.multiplyScalar(factor);
                }
                if (_this.staticMoving) {
                    _zoomStart.copy(_zoomEnd);
                }
                else {
                    _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
                }
            }
        };
        this.panCamera = (function () {
            var mouseChange = new THREE.Vector2(), objectUp = new THREE.Vector3(), pan = new THREE.Vector3();
            return function panCamera() {
                mouseChange.copy(_panEnd).sub(_panStart);
                if (mouseChange.lengthSq()) {
                    mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);
                    pan.copy(_eye).cross(_this.object.up).setLength(mouseChange.x);
                    pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));
                    _this.object.position.add(pan);
                    _this.target.add(pan);
                    if (_this.staticMoving) {
                        _panStart.copy(_panEnd);
                    }
                    else {
                        _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));
                    }
                }
            };
        }());
        this.checkDistances = function () {
            if (!_this.noZoom || !_this.noPan) {
                if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {
                    _this.object.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
                    _zoomStart.copy(_zoomEnd);
                }
                if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {
                    _this.object.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
                    _zoomStart.copy(_zoomEnd);
                }
            }
        };
        this.update = function () {
            _eye.subVectors(_this.object.position, _this.target);
            if (!_this.noRotate) {
                _this.rotateCamera();
            }
            if (!_this.noZoom) {
                _this.zoomCamera();
            }
            if (!_this.noPan) {
                _this.panCamera();
            }
            _this.object.position.addVectors(_this.target, _eye);
            _this.checkDistances();
            _this.object.lookAt(_this.target);
            if (lastPosition.distanceToSquared(_this.object.position) > EPS) {
                _this.dispatchEvent(changeEvent);
                lastPosition.copy(_this.object.position);
            }
        };
        this.reset = function () {
            _state = STATE.NONE;
            _prevState = STATE.NONE;
            _this.target.copy(_this.target0);
            _this.object.position.copy(_this.position0);
            _this.object.up.copy(_this.up0);
            _eye.subVectors(_this.object.position, _this.target);
            _this.object.lookAt(_this.target);
            _this.dispatchEvent(changeEvent);
            lastPosition.copy(_this.object.position);
        };
        // listeners
        function keydown(event) {
            if (_this.enabled === false)
                return;
            window.removeEventListener('keydown', keydown);
            _prevState = _state;
            if (_state !== STATE.NONE) {
                return;
            }
            else if (event.keyCode === _this.keys[STATE.ROTATE] && !_this.noRotate) {
                _state = STATE.ROTATE;
            }
            else if (event.keyCode === _this.keys[STATE.ZOOM] && !_this.noZoom) {
                _state = STATE.ZOOM;
            }
            else if (event.keyCode === _this.keys[STATE.PAN] && !_this.noPan) {
                _state = STATE.PAN;
            }
        }
        function keyup(event) {
            if (_this.enabled === false)
                return;
            _state = _prevState;
            window.addEventListener('keydown', keydown, false);
        }
        function mousedown(event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            if (_state === STATE.NONE) {
                _state = event.button;
            }
            if (_state === STATE.ROTATE && !_this.noRotate) {
                _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
                _movePrev.copy(_moveCurr);
            }
            else if (_state === STATE.ZOOM && !_this.noZoom) {
                _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
                _zoomEnd.copy(_zoomStart);
            }
            else if (_state === STATE.PAN && !_this.noPan) {
                _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
                _panEnd.copy(_panStart);
            }
            document.addEventListener('mousemove', mousemove, false);
            document.addEventListener('mouseup', mouseup, false);
            _this.dispatchEvent(startEvent);
        }
        function mousemove(event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            if (_state === STATE.ROTATE && !_this.noRotate) {
                _movePrev.copy(_moveCurr);
                _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
            }
            else if (_state === STATE.ZOOM && !_this.noZoom) {
                _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
            }
            else if (_state === STATE.PAN && !_this.noPan) {
                _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
            }
        }
        function mouseup(event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            _state = STATE.NONE;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            _this.dispatchEvent(endEvent);
        }
        function mousewheel(event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            switch (event.deltaMode) {
                case 2:
                    // Zoom in pages
                    _zoomStart.y -= event.deltaY * 0.025;
                    break;
                case 1:
                    // Zoom in lines
                    _zoomStart.y -= event.deltaY * 0.01;
                    break;
                default:
                    // undefined, 0, assume pixels
                    _zoomStart.y -= event.deltaY * 0.00025;
                    break;
            }
            _this.dispatchEvent(startEvent);
            _this.dispatchEvent(endEvent);
        }
        function touchstart(event) {
            if (_this.enabled === false)
                return;
            switch (event.touches.length) {
                case 1:
                    _state = STATE.TOUCH_ROTATE;
                    _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                    _movePrev.copy(_moveCurr);
                    break;
                default:// 2 or more
                    _state = STATE.TOUCH_ZOOM_PAN;
                    var dx = event.touches[0].pageX - event.touches[1].pageX;
                    var dy = event.touches[0].pageY - event.touches[1].pageY;
                    _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
                    var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                    var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                    _panStart.copy(getMouseOnScreen(x, y));
                    _panEnd.copy(_panStart);
                    break;
            }
            _this.dispatchEvent(startEvent);
        }
        function touchmove(event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            switch (event.touches.length) {
                case 1:
                    _movePrev.copy(_moveCurr);
                    _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                    break;
                default:// 2 or more
                    var dx = event.touches[0].pageX - event.touches[1].pageX;
                    var dy = event.touches[0].pageY - event.touches[1].pageY;
                    _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
                    var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                    var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                    _panEnd.copy(getMouseOnScreen(x, y));
                    break;
            }
        }
        function touchend(event) {
            if (_this.enabled === false)
                return;
            switch (event.touches.length) {
                case 0:
                    _state = STATE.NONE;
                    break;
                case 1:
                    _state = STATE.TOUCH_ROTATE;
                    _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                    _movePrev.copy(_moveCurr);
                    break;
            }
            _this.dispatchEvent(endEvent);
        }
        function contextmenu(event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
        }
        this.dispose = function () {
            this.domElement.removeEventListener('contextmenu', contextmenu, false);
            this.domElement.removeEventListener('mousedown', mousedown, false);
            this.domElement.removeEventListener('wheel', mousewheel, false);
            this.domElement.removeEventListener('touchstart', touchstart, false);
            this.domElement.removeEventListener('touchend', touchend, false);
            this.domElement.removeEventListener('touchmove', touchmove, false);
            document.removeEventListener('mousemove', mousemove, false);
            document.removeEventListener('mouseup', mouseup, false);
            window.removeEventListener('keydown', keydown, false);
            window.removeEventListener('keyup', keyup, false);
        };
        this.domElement.addEventListener('contextmenu', contextmenu, false);
        this.domElement.addEventListener('mousedown', mousedown, false);
        this.domElement.addEventListener('wheel', mousewheel, false);
        this.domElement.addEventListener('touchstart', touchstart, false);
        this.domElement.addEventListener('touchend', touchend, false);
        this.domElement.addEventListener('touchmove', touchmove, false);
        window.addEventListener('keydown', keydown, false);
        window.addEventListener('keyup', keyup, false);
        this.handleResize();
        // force an update at start
        this.update();
    }
    exports.TrackballControls = TrackballControls;
    TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    TrackballControls.prototype.constructor = TrackballControls;
});
define("Viewer/Viewer", ["require", "exports", "three", "Viewer/Camera", "Viewer/CameraControls", "System/EventManager", "Viewer/Graphics", "System/Services", "Viewer/TrackballControls"], function (require, exports, THREE, Camera_3, CameraControls_1, EventManager_1, Graphics_3, Services_4, TrackballControls_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectNames = {
        Root: 'Root'
    };
    /**
     * @exports Viewer/Viewer
     */
    var Viewer = (function () {
        /**
         * Default constructor
         * @class Viewer
         * @constructor
         * @param name Viewer name.
         * @param elementToBindTo HTML element to host the viewer.
         */
        function Viewer(name, modelCanvasId) {
            this._name = '';
            this._eventManager = null;
            this._logger = null;
            this._scene = null;
            this._root = null;
            this._renderer = null;
            this._canvas = null;
            this._width = 0;
            this._height = 0;
            this._camera = null;
            this._controls = null;
            this._cameraControls = null;
            this._name = name;
            this._eventManager = new EventManager_1.EventManager();
            this._logger = Services_4.Services.consoleLogger;
            this._canvas = Graphics_3.Graphics.initializeCanvas(modelCanvasId);
            this._width = this._canvas.offsetWidth;
            this._height = this._canvas.offsetHeight;
            this.initialize();
            this.animate();
        }
        ;
        Object.defineProperty(Viewer.prototype, "name", {
            //#region Properties
            /**
             * Gets the Viewer name.
             */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "camera", {
            /**
             * Gets the camera.
             */
            get: function () {
                return this._camera;
            },
            /**
             * Sets the camera.
             */
            set: function (camera) {
                this._camera = camera;
                this.initializeInputControls();
                Graphics_3.Graphics.addCameraHelper(this._scene, this.camera);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "model", {
            /**
            * Gets the active model.
            */
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "eventManager", {
            /**
             * Gets the EventManager.
             */
            get: function () {
                return this._eventManager;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Sets the active model.
         * @param value New model to activate.
         */
        Viewer.prototype.setModel = function (value) {
            // N.B. This is a method not a property so a sub class can override.
            // https://github.com/Microsoft/TypeScript/issues/4465
            Graphics_3.Graphics.removeObjectChildren(this._root, false);
            this._root.add(value);
        };
        Object.defineProperty(Viewer.prototype, "aspectRatio", {
            /**
             * Calculates the aspect ratio of the canvas afer a window resize
             */
            get: function () {
                var aspectRatio = this._width / this._height;
                return aspectRatio;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "containerId", {
            /**
             * Gets the DOM Id of the Viewer parent container.
             */
            get: function () {
                var parentElement = this._canvas.parentElement;
                return parentElement.id;
            },
            enumerable: true,
            configurable: true
        });
        //#endregion
        //#region Initialization    
        /**
         * Adds a test sphere to a scene.
         */
        Viewer.prototype.populateScene = function () {
            var mesh = Graphics_3.Graphics.createSphereMesh(new THREE.Vector3(), 2);
            this._root.add(mesh);
        };
        /**
         * Initialize Scene
         */
        Viewer.prototype.initializeScene = function () {
            this._scene = new THREE.Scene();
            this.createRoot();
            this.populateScene();
        };
        /**
         * Initialize the WebGL renderer.
         */
        Viewer.prototype.initializeRenderer = function () {
            this._renderer = new THREE.WebGLRenderer({
                logarithmicDepthBuffer: false,
                canvas: this._canvas,
                antialias: true
            });
            this._renderer.autoClear = true;
            this._renderer.setClearColor(0x000000);
        };
        /**
         * Initialize the viewer camera
         */
        Viewer.prototype.initializeCamera = function () {
            this.camera = Camera_3.Camera.getStandardViewCamera(Camera_3.StandardView.Front, this.aspectRatio, this.model);
        };
        /**
         * Adds lighting to the scene
         */
        Viewer.prototype.initializeLighting = function () {
            var ambientLight = new THREE.AmbientLight(0x404040);
            this._scene.add(ambientLight);
            var directionalLight1 = new THREE.DirectionalLight(0xC0C090);
            directionalLight1.position.set(-100, -50, 100);
            this._scene.add(directionalLight1);
            var directionalLight2 = new THREE.DirectionalLight(0xC0C090);
            directionalLight2.position.set(100, 50, -100);
            this._scene.add(directionalLight2);
        };
        /**
         * Sets up the user input controls (Trackball)
         */
        Viewer.prototype.initializeInputControls = function () {
            this._controls = new TrackballControls_1.TrackballControls(this.camera, this._renderer.domElement);
            // N.B. https://stackoverflow.com/questions/10325095/threejs-camera-lookat-has-no-effect-is-there-something-im-doing-wrong
            this._controls.position0.copy(this.camera.position);
            var boundingBox = Graphics_3.Graphics.getBoundingBoxFromObject(this._root);
            this._controls.target.copy(boundingBox.getCenter());
        };
        /**
         * Sets up the user input controls (Settings)
         */
        Viewer.prototype.initializeUIControls = function () {
            this._cameraControls = new CameraControls_1.CameraControls(this);
        };
        /**
         * Sets up the keyboard shortcuts.
         */
        Viewer.prototype.initializeKeyboardShortcuts = function () {
            var _this = this;
            document.addEventListener('keyup', function (event) {
                // https://css-tricks.com/snippets/javascript/javascript-keycodes/
                var keyCode = event.keyCode;
                switch (keyCode) {
                    case 70:// F               
                        _this.camera = Camera_3.Camera.getStandardViewCamera(Camera_3.StandardView.Front, _this.aspectRatio, _this.model);
                        break;
                }
            }, false);
        };
        /**
         * Initialize the scene with the base objects
         */
        Viewer.prototype.initialize = function () {
            this.initializeScene();
            this.initializeRenderer();
            this.initializeCamera();
            this.initializeLighting();
            this.initializeInputControls();
            this.initializeUIControls();
            this.initializeKeyboardShortcuts();
            this.onResizeWindow();
            window.addEventListener('resize', this.onResizeWindow.bind(this), false);
        };
        //#endregion
        //#region Scene
        /**
         * Removes all scene objects
         */
        Viewer.prototype.clearAllAssests = function () {
            Graphics_3.Graphics.removeObjectChildren(this._root, false);
        };
        /**
         * Creates the root object in the scene
         */
        Viewer.prototype.createRoot = function () {
            this._root = new THREE.Object3D();
            this._root.name = ObjectNames.Root;
            this._scene.add(this._root);
        };
        //#endregion
        //#region Camera
        /**
         * @description Sets the view camera properties to the given settings.
         * @param {StandardView} view Camera settings to apply.
         */
        Viewer.prototype.setCameraToStandardView = function (view) {
            var standardViewCamera = Camera_3.Camera.getStandardViewCamera(view, this.aspectRatio, this.model);
            this.camera = standardViewCamera;
        };
        /**
         * @description Fits the active view.
         */
        Viewer.prototype.fitView = function () {
            this.camera = Camera_3.Camera.getFitViewCamera(Camera_3.Camera.getSceneCamera(this.camera, this.aspectRatio), this.model);
        };
        //#endregion
        //#region Window Resize
        /**
         * Updates the scene camera to match the new window size
         */
        Viewer.prototype.updateCameraOnWindowResize = function () {
            this.camera.aspect = this.aspectRatio;
            this.camera.updateProjectionMatrix();
        };
        /**
         * Handles the WebGL processing for a DOM window 'resize' event
         */
        Viewer.prototype.resizeDisplayWebGL = function () {
            this._width = this._canvas.offsetWidth;
            this._height = this._canvas.offsetHeight;
            this._renderer.setSize(this._width, this._height, false);
            this._controls.handleResize();
            this.updateCameraOnWindowResize();
        };
        /**
         * Handles a window resize event
         */
        Viewer.prototype.onResizeWindow = function () {
            this.resizeDisplayWebGL();
        };
        //#endregion
        //#region Render Loop
        /**
         * Performs the WebGL render of the scene
         */
        Viewer.prototype.renderWebGL = function () {
            this._controls.update();
            this._renderer.render(this._scene, this.camera);
        };
        /**
         * Main DOM render loop
         */
        Viewer.prototype.animate = function () {
            requestAnimationFrame(this.animate.bind(this));
            this.renderWebGL();
        };
        return Viewer;
    }());
    exports.Viewer = Viewer;
});
define("ModelLoaders/TestModelLoader", ["require", "exports", "three", "Viewer/Graphics"], function (require, exports, THREE, Graphics_4) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var testModelColor = '#558de8';
    var TestModel;
    (function (TestModel) {
        TestModel[TestModel["Torus"] = 0] = "Torus";
        TestModel[TestModel["Sphere"] = 1] = "Sphere";
        TestModel[TestModel["SlopedPlane"] = 2] = "SlopedPlane";
        TestModel[TestModel["Box"] = 3] = "Box";
        TestModel[TestModel["Checkerboard"] = 4] = "Checkerboard";
    })(TestModel = exports.TestModel || (exports.TestModel = {}));
    var TestModelLoader = (function () {
        /** Default constructor
         * @class TestModelLoader
         * @constructor
         */
        function TestModelLoader() {
        }
        /**
         * @description Loads a parametric test model.
         * @param {Viewer} viewer Viewer instance to receive model.
         * @param {TestModel} modelType Model type (Box, Sphere, etc.)
         */
        TestModelLoader.prototype.loadTestModel = function (viewer, modelType) {
            switch (modelType) {
                case TestModel.Torus:
                    this.loadTorusModel(viewer);
                    break;
                case TestModel.Sphere:
                    this.loadSphereModel(viewer);
                    break;
                case TestModel.SlopedPlane:
                    this.loadSlopedPlaneModel(viewer);
                    break;
                case TestModel.Box:
                    this.loadBoxModel(viewer);
                    break;
                case TestModel.Checkerboard:
                    this.loadCheckerboardModel(viewer);
                    break;
            }
        };
        /**
         * Adds a torus to a scene.
         * @param viewer Instance of the Viewer to display the model
         */
        TestModelLoader.prototype.loadTorusModel = function (viewer) {
            var torusScene = new THREE.Group();
            // Setup some geometries
            var geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
            var material = new THREE.MeshPhongMaterial({ color: testModelColor });
            var count = 50;
            var scale = 5;
            for (var i = 0; i < count; i++) {
                var r = Math.random() * 2.0 * Math.PI;
                var z = (Math.random() * 2.0) - 1.0;
                var zScale = Math.sqrt(1.0 - z * z) * scale;
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(Math.cos(r) * zScale, Math.sin(r) * zScale, z * scale);
                mesh.rotation.set(Math.random(), Math.random(), Math.random());
                mesh.name = 'Torus Component';
                torusScene.add(mesh);
            }
            viewer.setModel(torusScene);
        };
        /**
         * Adds a test sphere to a scene.
         * @param viewer Instance of the Viewer to display the model.
         */
        TestModelLoader.prototype.loadSphereModel = function (viewer) {
            var radius = 2;
            var mesh = Graphics_4.Graphics.createSphereMesh(new THREE.Vector3, radius, new THREE.MeshPhongMaterial({ color: testModelColor }));
            viewer.setModel(mesh);
        };
        /**
         * Add a test box to a scene.
         * @param viewer Instance of the Viewer to display the model.
         */
        TestModelLoader.prototype.loadBoxModel = function (viewer) {
            var width = 2;
            var height = 2;
            var depth = 2;
            var mesh = Graphics_4.Graphics.createBoxMesh(new THREE.Vector3, width, height, depth, new THREE.MeshPhongMaterial({ color: testModelColor }));
            viewer.setModel(mesh);
        };
        /**
         * Add a sloped plane to a scene.
         * @param viewer Instance of the Viewer to display the model.
         */
        TestModelLoader.prototype.loadSlopedPlaneModel = function (viewer) {
            var width = 2;
            var height = 2;
            var mesh = Graphics_4.Graphics.createPlaneMesh(new THREE.Vector3, width, height, new THREE.MeshPhongMaterial({ color: testModelColor }));
            mesh.rotateX(Math.PI / 4);
            mesh.name = 'SlopedPlane';
            viewer.setModel(mesh);
        };
        /**
         * Add a test model consisting of a tiered checkerboard
         * @param viewer Instance of the Viewer to display the model.
         */
        TestModelLoader.prototype.loadCheckerboardModel = function (viewer) {
            var gridLength = 2;
            var totalHeight = 1.0;
            var gridDivisions = 2;
            var totalCells = Math.pow(gridDivisions, 2);
            var cellBase = gridLength / gridDivisions;
            var cellHeight = totalHeight / totalCells;
            var originX = -(cellBase * (gridDivisions / 2)) + (cellBase / 2);
            var originY = originX;
            var originZ = -cellHeight / 2;
            var origin = new THREE.Vector3(originX, originY, originZ);
            var baseColor = 0x007070;
            var colorDelta = (256 / totalCells) * Math.pow(256, 2);
            var group = new THREE.Group();
            var cellOrigin = origin.clone();
            var cellColor = baseColor;
            for (var iRow = 0; iRow < gridDivisions; iRow++) {
                for (var iColumn = 0; iColumn < gridDivisions; iColumn++) {
                    var cellMaterial = new THREE.MeshPhongMaterial({ color: cellColor });
                    var cell = Graphics_4.Graphics.createBoxMesh(cellOrigin, cellBase, cellBase, cellHeight, cellMaterial);
                    group.add(cell);
                    cellOrigin.x += cellBase;
                    cellOrigin.z += cellHeight;
                    cellColor += colorDelta;
                }
                cellOrigin.x = origin.x;
                cellOrigin.y += cellBase;
            }
            group.name = 'Checkerboard';
            viewer.setModel(group);
        };
        return TestModelLoader;
    }());
    exports.TestModelLoader = TestModelLoader;
});
define("ModelLoaders/Loader", ["require", "exports", "three", "ModelLoaders/OBJLoader", "ModelLoaders/TestModelLoader"], function (require, exports, THREE, OBJLoader_1, TestModelLoader_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var testModelColor = '#558de8';
    var Loader = (function () {
        /** Default constructor
         * @class Loader
         * @constructor
         */
        function Loader() {
        }
        /**
         * Loads a model based on the model name and path embedded in the HTML page.
         * @param viewer Instance of the Viewer to display the model.
         */
        Loader.prototype.loadOBJModel = function (viewer) {
            var modelNameElement = window.document.getElementById('modelName');
            var modelPathElement = window.document.getElementById('modelPath');
            var modelName = modelNameElement.textContent;
            var modelPath = modelPathElement.textContent;
            var fileName = modelPath + modelName;
            var manager = new THREE.LoadingManager();
            var loader = new OBJLoader_1.OBJLoader(manager);
            var onProgress = function (xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log(percentComplete.toFixed(2) + '% downloaded');
                }
            };
            var onError = function (xhr) {
            };
            loader.load(fileName, function (group) {
                viewer.setModel(group);
            }, onProgress, onError);
        };
        /**
         * Loads a parametric test model.
         * @param viewer Instance of the Viewer to display the model.
         * @param modelType Test model type (Spher, Box, etc.)
         */
        Loader.prototype.loadParametricTestModel = function (viewer, modelType) {
            var testLoader = new TestModelLoader_1.TestModelLoader();
            testLoader.loadTestModel(viewer, modelType);
        };
        return Loader;
    }());
    exports.Loader = Loader;
});
define("Viewer/MeshViewer", ["require", "exports", "three", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, DepthBuffer_2, Graphics_5, Services_5, Viewer_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * MeshViewer
     */
    var MeshViewer = (function (_super) {
        __extends(MeshViewer, _super);
        /**
         * @constructor
         * @constructor
         */
        /**
         * Default constructor
         * @class MeshViewer
         * @constructor
         * @param name Viewer name.
         * @param previewCanvasId HTML element to host the viewer.
         */
        function MeshViewer(name, previewCanvasId) {
            var _this = _super.call(this, name, previewCanvasId) || this;
            //override
            _this._logger = Services_5.Services.htmlLogger;
            return _this;
        }
        //#region Properties
        //#endregion
        //#region Initialization
        /**
         * Populate scene.
         */
        MeshViewer.prototype.populateScene = function () {
            var height = 1;
            var width = 1;
            var mesh = Graphics_5.Graphics.createPlaneMesh(new THREE.Vector3(), height, width, new THREE.MeshPhongMaterial(DepthBuffer_2.DepthBuffer.DefaultMeshPhongMaterialParameters));
            this._root.add(mesh);
        };
        /**
         * Adds lighting to the scene.
         */
        MeshViewer.prototype.initializeLighting = function () {
            var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            this._scene.add(ambientLight);
            var directionalLight1 = new THREE.DirectionalLight(0xffffff);
            directionalLight1.position.set(4, 4, 4);
            this._scene.add(directionalLight1);
        };
        return MeshViewer;
    }(Viewer_1.Viewer));
    exports.MeshViewer = MeshViewer;
});
define("Viewer/ModelViewerControls", ["require", "exports", "dat-gui"], function (require, exports, dat) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * ViewerControls
     */
    var ModelViewerSettings = (function () {
        function ModelViewerSettings(generateRelief) {
            this.displayGrid = true;
            this.generateRelief = generateRelief;
        }
        return ModelViewerSettings;
    }());
    /**
     * ModelViewer UI Controls.
     */
    var ModelViewerControls = (function () {
        /** Default constructor
         * @class ModelViewerControls
         * @constructor
         */
        function ModelViewerControls(modelViewer) {
            this._modelViewer = modelViewer;
            // UI Controls
            this.initializeControls();
        }
        //#region Event Handlers
        /**
         * Generates a relief from the current model camera.
         */
        ModelViewerControls.prototype.generateRelief = function () {
            this._modelViewer.generateRelief();
        };
        //#endregion
        /**
         * Initialize the view settings that are controllable by the user
         */
        ModelViewerControls.prototype.initializeControls = function () {
            var scope = this;
            this._modelViewerSettings = new ModelViewerSettings(this.generateRelief.bind(this));
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById(this._modelViewer.containerId);
            menuDiv.appendChild(gui.domElement);
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            //                                                                   ModelViewer                                                                //      
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            var modelViewerOptions = gui.addFolder('ModelViewer Options');
            // Grid
            var controlDisplayGrid = modelViewerOptions.add(this._modelViewerSettings, 'displayGrid').name('Display Grid');
            controlDisplayGrid.onChange(function (value) {
                scope._modelViewer.displayGrid(value);
            });
            // Generate Relief
            var controlGenerateRelief = modelViewerOptions.add(this._modelViewerSettings, 'generateRelief').name('Generate Relief');
            modelViewerOptions.open();
        };
        return ModelViewerControls;
    }());
    exports.ModelViewerControls = ModelViewerControls;
});
define("Viewer/ModelViewer", ["require", "exports", "three", "DepthBuffer/DepthBufferFactory", "System/EventManager", "Viewer/ModelViewerControls", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, DepthBufferFactory_1, EventManager_2, ModelViewerControls_1, Services_6, Viewer_2) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectNames = {
        Grid: 'Grid'
    };
    /**
     * @exports Viewer/ModelViewer
     */
    var ModelViewer = (function (_super) {
        __extends(ModelViewer, _super);
        /**
         * Default constructor
         * @class ModelViewer
         * @constructor
         * @param name Viewer name.
         * @param modelCanvasId HTML element to host the viewer.
         */
        function ModelViewer(name, modelCanvasId) {
            return _super.call(this, name, modelCanvasId) || this;
        }
        //#region Properties
        /**
         * Sets the model.
         */
        ModelViewer.prototype.setModel = function (value) {
            // Call base class property via super
            // https://github.com/Microsoft/TypeScript/issues/4465        
            _super.prototype.setModel.call(this, value);
            this._cameraControls.synchronizeCameraSettings();
            // dispatch NewModel event
            this._eventManager.dispatchEvent(this, EventManager_2.EventType.NewModel, value);
        };
        //#endregion
        //#region Initialization    
        /**
         * Populate scene.
         */
        ModelViewer.prototype.populateScene = function () {
            var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
            helper.name = ObjectNames.Grid;
            this._scene.add(helper);
        };
        /**
         * General initialization
         */
        ModelViewer.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        /**
         * UI controls initialization.
         */
        ModelViewer.prototype.initializeUIControls = function () {
            _super.prototype.initializeUIControls.call(this);
            this._modelViewerControls = new ModelViewerControls_1.ModelViewerControls(this);
        };
        //#endregion
        //#region Scene
        /**
         * Display the reference grid.
         */
        ModelViewer.prototype.displayGrid = function (visible) {
            var gridGeometry = this._scene.getObjectByName(ObjectNames.Grid);
            gridGeometry.visible = visible;
            this._logger.addInfoMessage("Display grid = " + visible);
        };
        //#endregion
        //#region Mesh Generation
        /**
         * Generates a relief from the current model camera.
         */
        ModelViewer.prototype.generateRelief = function () {
            // pixels
            var width = 512;
            var height = width / this.aspectRatio;
            var factory = new DepthBufferFactory_1.DepthBufferFactory({ width: width, height: height, model: this.model, camera: this.camera, addCanvasToDOM: false });
            var previewMesh = factory.meshGenerate({});
            this._eventManager.dispatchEvent(this, EventManager_2.EventType.MeshGenerate, previewMesh);
            Services_6.Services.consoleLogger.addInfoMessage('Relief generated');
        };
        return ModelViewer;
    }(Viewer_2.Viewer));
    exports.ModelViewer = ModelViewer;
});
define("ModelRelief", ["require", "exports", "Viewer/Camera", "System/EventManager", "ModelLoaders/Loader", "Viewer/MeshViewer", "Viewer/ModelViewer", "System/Services"], function (require, exports, Camera_4, EventManager_3, Loader_1, MeshViewer_1, ModelViewer_1, Services_7) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModelRelief = (function () {
        /** Default constructor
         * @class ModelRelief
         * @constructor
         */
        function ModelRelief() {
        }
        //#region Event Handlers
        /**
         * Event handler for mesh generation.
         * @param event Mesh generation event.
         * @params mesh Newly-generated mesh.
         */
        ModelRelief.prototype.onMeshGenerate = function (event, mesh) {
            this._meshViewer.setModel(mesh);
            this._meshViewer.fitView();
        };
        /**
         * Event handler for new model.
         * @param event NewModel event.
         * @param model Newly loaded model.
         */
        ModelRelief.prototype.onNewModel = function (event, model) {
            this._modelViewer.setCameraToStandardView(Camera_4.StandardView.Front);
            this._meshViewer.setCameraToStandardView(Camera_4.StandardView.Front);
        };
        //#endregion
        /**
         * Launch the model Viewer.
         */
        ModelRelief.prototype.run = function () {
            Services_7.Services.consoleLogger.addInfoMessage('ModelRelief started');
            // Mesh Preview
            this._meshViewer = new MeshViewer_1.MeshViewer('MeshViewer', 'meshCanvas');
            // Model Viewer    
            this._modelViewer = new ModelViewer_1.ModelViewer('ModelViewer', 'modelCanvas');
            this._modelViewer.eventManager.addEventListener(EventManager_3.EventType.MeshGenerate, this.onMeshGenerate.bind(this));
            this._modelViewer.eventManager.addEventListener(EventManager_3.EventType.NewModel, this.onNewModel.bind(this));
            // Loader
            this._loader = new Loader_1.Loader();
            // OBJ Models
            this._loader.loadOBJModel(this._modelViewer);
            // Test Models
            //      this._loader.loadParametricTestModel(this._modelViewer, TestModel.Checkerboard);
        };
        return ModelRelief;
    }());
    exports.ModelRelief = ModelRelief;
    var modelRelief = new ModelRelief();
    modelRelief.run();
});
define("UnitTests/UnitTests", ["require", "exports", "chai", "three"], function (require, exports, chai_2, THREE) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @exports Viewer/Viewer
     */
    var UnitTests = (function () {
        /**
         * Default constructor
         * @class UnitTests
         * @constructor
         */
        function UnitTests() {
        }
        UnitTests.VertexMapping = function (depthBuffer, mesh) {
            var meshGeometry = mesh.geometry;
            meshGeometry.computeBoundingBox();
            var boundingBox = meshGeometry.boundingBox;
            // width  = 3              3   4   5
            // column = 2              0   1   2
            // buffer length = 6
            // Test Points            
            var lowerLeft = boundingBox.min;
            var lowerRight = new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, 0);
            var upperRight = boundingBox.max;
            var upperLeft = new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, 0);
            var center = boundingBox.getCenter();
            // Expected Values
            var bufferLength = (depthBuffer.width * depthBuffer.height);
            var firstColumn = 0;
            var lastColumn = depthBuffer.width - 1;
            var centerColumn = Math.round(depthBuffer.width / 2);
            var firstRow = 0;
            var lastRow = depthBuffer.height - 1;
            var centerRow = Math.round(depthBuffer.height / 2);
            var lowerLeftIndex = 0;
            var lowerRightIndex = depthBuffer.width - 1;
            var upperRightIndex = bufferLength - 1;
            var upperLeftIndex = bufferLength - depthBuffer.width;
            var centerIndex = (centerRow * depthBuffer.width) + Math.round(depthBuffer.width / 2);
            var lowerLeftIndices = new THREE.Vector2(firstRow, firstColumn);
            var lowerRightIndices = new THREE.Vector2(firstRow, lastColumn);
            var upperRightIndices = new THREE.Vector2(lastRow, lastColumn);
            var upperLeftIndices = new THREE.Vector2(lastRow, firstColumn);
            var centerIndices = new THREE.Vector2(centerRow, centerColumn);
            var index;
            var indices;
            // Lower Left
            indices = depthBuffer.getModelVertexIndices(lowerLeft, boundingBox);
            chai_2.assert.deepEqual(indices, lowerLeftIndices);
            index = depthBuffer.getModelVertexIndex(lowerLeft, boundingBox);
            chai_2.assert.equal(index, lowerLeftIndex);
            // Lower Right
            indices = depthBuffer.getModelVertexIndices(lowerRight, boundingBox);
            chai_2.assert.deepEqual(indices, lowerRightIndices);
            index = depthBuffer.getModelVertexIndex(lowerRight, boundingBox);
            chai_2.assert.equal(index, lowerRightIndex);
            // Upper Right
            indices = depthBuffer.getModelVertexIndices(upperRight, boundingBox);
            chai_2.assert.deepEqual(indices, upperRightIndices);
            index = depthBuffer.getModelVertexIndex(upperRight, boundingBox);
            chai_2.assert.equal(index, upperRightIndex);
            // Upper Left
            indices = depthBuffer.getModelVertexIndices(upperLeft, boundingBox);
            chai_2.assert.deepEqual(indices, upperLeftIndices);
            index = depthBuffer.getModelVertexIndex(upperLeft, boundingBox);
            chai_2.assert.equal(index, upperLeftIndex);
            // Center
            indices = depthBuffer.getModelVertexIndices(center, boundingBox);
            chai_2.assert.deepEqual(indices, centerIndices);
            index = depthBuffer.getModelVertexIndex(center, boundingBox);
            chai_2.assert.equal(index, centerIndex);
        };
        return UnitTests;
    }());
    exports.UnitTests = UnitTests;
});
define("Workbench/CameraTest", ["require", "exports", "three", "dat-gui", "Viewer/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, dat, Graphics_6, Services_8, Viewer_3) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * CameraWorkbench
     */
    var CameraViewer = (function (_super) {
        __extends(CameraViewer, _super);
        function CameraViewer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CameraViewer.prototype.populateScene = function () {
            var triad = Graphics_6.Graphics.createWorldAxesTriad(new THREE.Vector3(), 1, 0.25, 0.25);
            this._scene.add(triad);
            var box = Graphics_6.Graphics.createBoxMesh(new THREE.Vector3(1, 1, -2), 1, 2, 2, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
            box.rotation.set(Math.random(), Math.random(), Math.random());
            box.updateMatrix();
            var boxClone = Graphics_6.Graphics.cloneAndTransformObject(box, new THREE.Matrix4());
            this.model.add(boxClone);
            var sphere = Graphics_6.Graphics.createSphereMesh(new THREE.Vector3(4, 2, -1), 1, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
            this.model.add(sphere);
        };
        /**
        * Initialize the viewer camera
        */
        CameraViewer.prototype.initializeDefaultCameraSettings = function () {
            var settings = {
                position: new THREE.Vector3(0.0, 0.0, 20.0),
                target: new THREE.Vector3(0, 0, 0),
                near: 2.0,
                far: 50.0,
                fieldOfView: 37 // https://www.nikonians.org/reviews/fov-tables
            };
            return settings;
        };
        return CameraViewer;
    }(Viewer_3.Viewer));
    exports.CameraViewer = CameraViewer;
    /**
     * @class
     * ViewerControls
     */
    var ViewerControls = (function () {
        function ViewerControls(camera, showBoundingBoxes, setClippingPlanes) {
            this.nearClippingPlane = camera.near;
            this.farClippingPlane = camera.far;
            this.fieldOfView = camera.fov;
            this.showBoundingBoxes = showBoundingBoxes;
            this.setClippingPlanes = setClippingPlanes;
        }
        return ViewerControls;
    }());
    /**
     * @class
     * App
     */
    var App = (function () {
        /**
         * @constructor
         */
        function App() {
        }
        /**
         * Set the camera clipping planes to the model extents in View coordinates.
         */
        App.prototype.setClippingPlanes = function () {
            var model = this._viewer.model;
            var cameraMatrixWorldInverse = this._viewer.camera.matrixWorldInverse;
            // clone model (and geometry!)
            var modelView = Graphics_6.Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
            var boundingBoxView = Graphics_6.Graphics.getBoundingBoxFromObject(modelView);
            // The bounding box is world-axis aligned. 
            // INv View coordinates, the camera is at the origin.
            // The bounding near plane is the maximum Z of the bounding box.
            // The bounding far plane is the minimum Z of the bounding box.
            var nearPlane = -boundingBoxView.max.z;
            var farPlane = -boundingBoxView.min.z;
            this._viewerControls.nearClippingPlane = nearPlane;
            this._viewerControls.farClippingPlane = farPlane;
            this._viewer.camera.near = nearPlane;
            this._viewer.camera.far = farPlane;
            this._viewer.camera.updateProjectionMatrix();
        };
        /**
         * Create a bounding box mesh.
         * @param object Target object.
         * @param color Color of bounding box mesh.
         */
        App.prototype.createBoundingBox = function (object, color) {
            var boundingBox = new THREE.Box3();
            boundingBox = boundingBox.setFromObject(object);
            var material = new THREE.MeshPhongMaterial({ color: color, opacity: 1.0, wireframe: true });
            var boundingBoxMesh = Graphics_6.Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);
            return boundingBoxMesh;
        };
        /**
         * Show the clipping planes of the model in View and World coordinates.
         */
        App.prototype.showBoundingBoxes = function () {
            var model = this._viewer.model;
            var cameraMatrixWorld = this._viewer.camera.matrixWorld;
            var cameraMatrixWorldInverse = this._viewer.camera.matrixWorldInverse;
            // remove existing BoundingBox
            model.remove(model.getObjectByName(Graphics_6.ObjectNames.BoundingBox));
            // clone model (and geometry!)
            var modelView = Graphics_6.Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
            // clear entire scene
            Graphics_6.Graphics.removeObjectChildren(model, false);
            model.add(modelView);
            var boundingBoxView = this.createBoundingBox(modelView, 0xff00ff);
            model.add(boundingBoxView);
            // transform model back from View to World
            var modelWorld = Graphics_6.Graphics.cloneAndTransformObject(modelView, cameraMatrixWorld);
            model.add(modelWorld);
            // transform bounding box back from View to World
            var boundingBoxWorld = Graphics_6.Graphics.cloneAndTransformObject(boundingBoxView, cameraMatrixWorld);
            model.add(boundingBoxWorld);
        };
        /**
         * Initialize the view settings that are controllable by the user
         */
        App.prototype.initializeViewerControls = function () {
            var scope = this;
            this._viewerControls = new ViewerControls(this._viewer.camera, this.showBoundingBoxes.bind(this), this.setClippingPlanes.bind(this));
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var settingsDiv = document.getElementById('settingsControls');
            settingsDiv.appendChild(gui.domElement);
            var folderOptions = gui.addFolder('Camera Options');
            // Near Clipping Plane
            var minimum = 0;
            var maximum = 100;
            var stepSize = 0.1;
            var controlNearClippingPlane = folderOptions.add(this._viewerControls, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            controlNearClippingPlane.onChange(function (value) {
                scope._viewer.camera.near = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Far Clipping Plane
            minimum = 1;
            maximum = 500;
            stepSize = 0.1;
            var controlFarClippingPlane = folderOptions.add(this._viewerControls, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFarClippingPlane.onChange(function (value) {
                scope._viewer.camera.far = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Field of View
            minimum = 25;
            maximum = 75;
            stepSize = 1;
            var controlFieldOfView = folderOptions.add(this._viewerControls, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFieldOfView.onChange(function (value) {
                scope._viewer.camera.fov = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Show Bounding Boxes
            var controlShowBoundingBoxes = folderOptions.add(this._viewerControls, 'showBoundingBoxes').name('Show Bounding Boxes');
            // Clipping Planes
            var controlSetClippingPlanes = folderOptions.add(this._viewerControls, 'setClippingPlanes').name('Set Clipping Planes');
            folderOptions.open();
        };
        /**
         * Main
         */
        App.prototype.run = function () {
            this._logger = Services_8.Services.consoleLogger;
            // Viewer    
            this._viewer = new CameraViewer('CameraViewer', 'viewerCanvas');
            // UI Controls
            this.initializeViewerControls();
        };
        return App;
    }());
    exports.App = App;
    var app = new App;
    app.run();
});
define("Workbench/DepthBufferTest", ["require", "exports"], function (require, exports) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * DepthBufferTest
     */
    var DepthBufferTest = (function () {
        /**
         * @constructor
         */
        function DepthBufferTest() {
        }
        /**
         * Main
         */
        DepthBufferTest.prototype.main = function () {
        };
        return DepthBufferTest;
    }());
    exports.DepthBufferTest = DepthBufferTest;
    var depthBufferTest = new DepthBufferTest();
    depthBufferTest.main();
});
define("Workbench/InheritanceTest", ["require", "exports", "System/Logger"], function (require, exports, Logger_2) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = new Logger_2.HTMLLogger();
    /**
     * @class
     * Widget
     */
    var Widget = (function () {
        /**
         * @constructor
         */
        function Widget(name, price) {
            this.name = name;
            this.price = price;
        }
        /**
         * Operate
         */
        Widget.prototype.operate = function () {
            logger.addInfoMessage(this.name + " operating....");
        };
        return Widget;
    }());
    exports.Widget = Widget;
    /**
     * @class
     * SuperWidget
     */
    var ColorWidget = (function (_super) {
        __extends(ColorWidget, _super);
        /**
         * @constructor
         */
        function ColorWidget(name, price, color) {
            var _this = _super.call(this, name, price) || this;
            _this.color = color;
            return _this;
        }
        return ColorWidget;
    }(Widget));
    exports.ColorWidget = ColorWidget;
    var GrandParent = (function () {
        function GrandParent(grandparentProperty) {
            this.grandparentProperty = grandparentProperty;
        }
        return GrandParent;
    }());
    exports.GrandParent = GrandParent;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(grandparentProperty, parentProperty) {
            var _this = _super.call(this, grandparentProperty) || this;
            _this.parentProperty = parentProperty;
            return _this;
        }
        return Parent;
    }(GrandParent));
    exports.Parent = Parent;
    var Child = (function (_super) {
        __extends(Child, _super);
        function Child(grandparentProperty, parentProperty, childProperty) {
            var _this = _super.call(this, grandparentProperty, parentProperty) || this;
            _this.childProperty = childProperty;
            return _this;
        }
        return Child;
    }(Parent));
    exports.Child = Child;
    /**
     * @class
     * Inheritance
     */
    var InheritanceTest = (function () {
        /**
         * @constructor
         */
        function InheritanceTest() {
        }
        /**
         * Main
         */
        InheritanceTest.prototype.main = function () {
            var widget = new Widget('Widget', 1.0);
            widget.operate();
            var colorWidget = new ColorWidget('ColorWidget', 1.0, 'red');
            colorWidget.operate();
            var child = new Child('GaGa', 'Dad', 'Steve');
        };
        return InheritanceTest;
    }());
    exports.InheritanceTest = InheritanceTest;
    var inheritance = new InheritanceTest;
    inheritance.main();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvU3lzdGVtL0xvZ2dlci50cyIsIlNjcmlwdHMvU3lzdGVtL1NlcnZpY2VzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvR3JhcGhpY3MudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmEudHMiLCJTY3JpcHRzL1N5c3RlbS9NYXRoLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlci50cyIsIlNjcmlwdHMvU3lzdGVtL1Rvb2xzLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlckZhY3RvcnkudHMiLCJTY3JpcHRzL1N5c3RlbS9FdmVudE1hbmFnZXIudHMiLCJTY3JpcHRzL01vZGVsTG9hZGVycy9PQkpMb2FkZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmFDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL01hdGVyaWFscy50cyIsIlNjcmlwdHMvVmlld2VyL1RyYWNrYmFsbENvbnRyb2xzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvVmlld2VyLnRzIiwiU2NyaXB0cy9Nb2RlbExvYWRlcnMvVGVzdE1vZGVsTG9hZGVyLnRzIiwiU2NyaXB0cy9Nb2RlbExvYWRlcnMvTG9hZGVyLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTWVzaFZpZXdlci50cyIsIlNjcmlwdHMvVmlld2VyL01vZGVsVmlld2VyQ29udHJvbHMudHMiLCJTY3JpcHRzL1ZpZXdlci9Nb2RlbFZpZXdlci50cyIsIlNjcmlwdHMvTW9kZWxSZWxpZWYudHMiLCJTY3JpcHRzL1VuaXRUZXN0cy9Vbml0VGVzdHMudHMiLCJTY3JpcHRzL1dvcmtiZW5jaC9DYW1lcmFUZXN0LnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvRGVwdGhCdWZmZXJUZXN0LnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvSW5oZXJpdGFuY2VUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsOEVBQThFO0lBQzlFLDZFQUE2RTtJQUM3RSx1SkFBdUo7SUFDdkosNkVBQTZF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LFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFakIsSUFBSSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5RCxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0wsc0JBQUM7SUFBRCxDQXJCQSxBQXFCQyxJQUFBO0lBckJZLDBDQUFlO0lBdUI1QixJQUFJLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBQztJQUN0QyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoid3d3cm9vdC9qcy9tb2RlbHJlbGllZi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIExvZ2dpbmcgSW50ZXJmYWNlXHJcbiAqIERpYWdub3N0aWMgbG9nZ2luZ1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBMb2dnZXIge1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpO1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKTtcclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZyk7XHJcbiAgICBhZGRNZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKTtcclxuXHJcbiAgICBhZGRFbXB0eUxpbmUgKCk7XHJcblxyXG4gICAgY2xlYXJMb2coKTtcclxufVxyXG4gICAgICAgICBcclxuZW51bSBNZXNzYWdlQ2xhc3Mge1xyXG4gICAgRXJyb3IgICA9ICdsb2dFcnJvcicsXHJcbiAgICBXYXJuaW5nID0gJ2xvZ1dhcm5pbmcnLFxyXG4gICAgSW5mbyAgICA9ICdsb2dJbmZvJyxcclxuICAgIE5vbmUgICAgPSAnbG9nTm9uZSdcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnNvbGUgbG9nZ2luZ1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25zb2xlTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2Vye1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0IGEgZ2VuZXJhbCBtZXNzYWdlIGFuZCBhZGQgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlQ2xhc3MgTWVzc2FnZSBjbGFzcy5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZUVudHJ5IChtZXNzYWdlIDogc3RyaW5nLCBtZXNzYWdlQ2xhc3MgOiBNZXNzYWdlQ2xhc3MpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByZWZpeCA9ICdNb2RlbFJlbGllZjogJztcclxuICAgICAgICBsZXQgbG9nTWVzc2FnZSA9IGAke3ByZWZpeH0ke21lc3NhZ2V9YDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlQ2xhc3MpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZUNsYXNzLkVycm9yOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuV2FybmluZzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuSW5mbzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuTm9uZTpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2UgRXJyb3IgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeShlcnJvck1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSB3YXJuaW5nTWVzc2FnZSBXYXJuaW5nIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KHdhcm5pbmdNZXNzYWdlLCBNZXNzYWdlQ2xhc3MuV2FybmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gaW5mb3JtYXRpb25hbCBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gaW5mb01lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRJbmZvTWVzc2FnZSAoaW5mb01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkoaW5mb01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5JbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBzdHlsZSBPcHRpb25hbCBzdHlsZS5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZSAobWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KG1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5Ob25lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gZW1wdHkgbGluZVxyXG4gICAgICovXHJcbiAgICBhZGRFbXB0eUxpbmUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbG9nIG91dHB1dFxyXG4gICAgICovXHJcbiAgICBjbGVhckxvZyAoKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBIVE1MIGxvZ2dpbmdcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSFRNTExvZ2dlciBpbXBsZW1lbnRzIExvZ2dlcntcclxuXHJcbiAgICByb290SWQgICAgICAgICAgIDogc3RyaW5nO1xyXG4gICAgcm9vdEVsZW1lbnRUYWcgICA6IHN0cmluZztcclxuICAgIHJvb3RFbGVtZW50ICAgICAgOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBtZXNzYWdlVGFnICAgICAgIDogc3RyaW5nO1xyXG4gICAgYmFzZU1lc3NhZ2VDbGFzcyA6IHN0cmluZ1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucm9vdElkICAgICAgICAgPSAnbG9nZ2VyUm9vdCdcclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50VGFnID0gJ3VsJztcclxuXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlVGFnICAgICAgID0gJ2xpJztcclxuICAgICAgICB0aGlzLmJhc2VNZXNzYWdlQ2xhc3MgPSAnbG9nTWVzc2FnZSc7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RoaXMucm9vdElkfWApO1xyXG4gICAgICAgIGlmICghdGhpcy5yb290RWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5yb290RWxlbWVudFRhZyk7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQuaWQgPSB0aGlzLnJvb3RJZDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJvb3RFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdCBhIGdlbmVyYWwgbWVzc2FnZSBhbmQgYXBwZW5kIHRvIHRoZSBsb2cgcm9vdC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlQ2xhc3MgQ1NTIGNsYXNzIHRvIGJlIGFkZGVkIHRvIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2VFbGVtZW50IChtZXNzYWdlIDogc3RyaW5nLCBtZXNzYWdlQ2xhc3M/IDogc3RyaW5nKSA6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbWVzc2FnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMubWVzc2FnZVRhZyk7XHJcbiAgICAgICAgbWVzc2FnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG5cclxuICAgICAgICBtZXNzYWdlRWxlbWVudC5jbGFzc05hbWUgICA9IGAke3RoaXMuYmFzZU1lc3NhZ2VDbGFzc30gJHttZXNzYWdlQ2xhc3MgPyBtZXNzYWdlQ2xhc3MgOiAnJ31gOztcclxuXHJcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBlcnJvciBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlIEVycm9yIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRWxlbWVudChlcnJvck1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSB3YXJuaW5nTWVzc2FnZSBXYXJuaW5nIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQod2FybmluZ01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5XYXJuaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBpbmZvTWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KGluZm9NZXNzYWdlLCBNZXNzYWdlQ2xhc3MuSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKiBAcGFyYW0gc3R5bGUgT3B0aW9uYWwgQ1NTIHN0eWxlLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlIChtZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2VFbGVtZW50ID0gdGhpcy5hZGRNZXNzYWdlRWxlbWVudChtZXNzYWdlKTtcclxuICAgICAgICBpZiAoc3R5bGUpXHJcbiAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gZW1wdHkgbGluZVxyXG4gICAgICovXHJcbiAgICBhZGRFbXB0eUxpbmUgKCkge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTQwNTQ3L2xpbmUtYnJlYWstaW5zaWRlLWEtbGlzdC1pdGVtLWdlbmVyYXRlcy1zcGFjZS1iZXR3ZWVuLXRoZS1saW5lc1xyXG4vLyAgICAgIHRoaXMuYWRkTWVzc2FnZSgnPGJyLz48YnIvPicpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlKCcuJyk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbG9nIG91dHB1dFxyXG4gICAgICovXHJcbiAgICBjbGVhckxvZyAoKSB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM5NTUyMjkvcmVtb3ZlLWFsbC1jaGlsZC1lbGVtZW50cy1vZi1hLWRvbS1ub2RlLWluLWphdmFzY3JpcHRcclxuICAgICAgICB3aGlsZSAodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyLCBIVE1MTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIFNlcnZpY2VzXHJcbiAqIEdlbmVyYWwgcnVudGltZSBzdXBwb3J0XHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VzIHtcclxuXHJcbiAgICBzdGF0aWMgY29uc29sZUxvZ2dlciA6IENvbnNvbGVMb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcigpO1xyXG4gICAgc3RhdGljIGh0bWxMb2dnZXIgICAgOiBIVE1MTG9nZ2VyICAgID0gbmV3IEhUTUxMb2dnZXIoKTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TW9kZWxSZWxpZWZ9ICAgICAgICAgICAgZnJvbSAnTW9kZWxSZWxpZWYnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG5leHBvcnQgZW51bSBPYmplY3ROYW1lcyB7XHJcblxyXG4gICAgQm91bmRpbmdCb3ggICA9ICdCb3VuZGluZyBCb3gnLFxyXG4gICAgQm94ICAgICAgICAgICA9ICdCb3gnLFxyXG4gICAgQ2FtZXJhSGVscGVyICA9ICdDYW1lcmFIZWxwZXInLFxyXG4gICAgUGxhbmUgICAgICAgICA9ICdQbGFuZScsXHJcbiAgICBTcGhlcmUgICAgICAgID0gJ1NwaGVyZScsXHJcbiAgICBUcmlhZCAgICAgICAgID0gJ1RyaWFkJ1xyXG59XHJcblxyXG4vKipcclxuICogIEdlbmVyYWwgVEhSRUUuanMvV2ViR0wgc3VwcG9ydCByb3V0aW5lc1xyXG4gKiAgR3JhcGhpY3MgTGlicmFyeVxyXG4gKiAgQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR3JhcGhpY3Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEdlb21ldHJ5XHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdEdlb21ldHJ5XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFuIG9iamVjdCBhbmQgYWxsIGNoaWxkcmVuIGZyb20gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSBzY2VuZSBTY2VuZSBob2xkaW5nIG9iamVjdCB0byBiZSByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIHJvb3RPYmplY3QgUGFyZW50IG9iamVjdCAocG9zc2libHkgd2l0aCBjaGlsZHJlbikuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW1vdmVPYmplY3RDaGlsZHJlbihyb290T2JqZWN0IDogVEhSRUUuT2JqZWN0M0QsIHJlbW92ZVJvb3QgOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIGlmICghcm9vdE9iamVjdClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgbG9nZ2VyICA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgbGV0IHJlbW92ZXIgPSBmdW5jdGlvbiAob2JqZWN0M2QpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChvYmplY3QzZCA9PT0gcm9vdE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UgKCdSZW1vdmluZzogJyArIG9iamVjdDNkLm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ2dlb21ldHJ5JykpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDNkLmdlb21ldHJ5LmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCdtYXRlcmlhbCcpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gb2JqZWN0M2QubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWwuaGFzT3duUHJvcGVydHkoJ21hdGVyaWFscycpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbHMgPSBtYXRlcmlhbC5tYXRlcmlhbHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaU1hdGVyaWFsIGluIG1hdGVyaWFscykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWxzLmhhc093blByb3BlcnR5KGlNYXRlcmlhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsc1tpTWF0ZXJpYWxdLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ3RleHR1cmUnKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0M2QudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByb290T2JqZWN0LnRyYXZlcnNlKHJlbW92ZXIpO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgcm9vdCBjaGlsZHJlbiBmcm9tIHJvb3QgKGJhY2t3YXJkcyEpXHJcbiAgICAgICAgZm9yIChsZXQgaUNoaWxkIDogbnVtYmVyID0gKHJvb3RPYmplY3QuY2hpbGRyZW4ubGVuZ3RoIC0gMSk7IGlDaGlsZCA+PSAwOyBpQ2hpbGQtLSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNoaWxkIDogVEhSRUUuT2JqZWN0M0QgPSByb290T2JqZWN0LmNoaWxkcmVuW2lDaGlsZF07XHJcbiAgICAgICAgICAgIHJvb3RPYmplY3QucmVtb3ZlIChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVtb3ZlUm9vdCAmJiByb290T2JqZWN0LnBhcmVudClcclxuICAgICAgICAgICAgcm9vdE9iamVjdC5wYXJlbnQucmVtb3ZlKHJvb3RPYmplY3QpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENsb25lIGFuZCB0cmFuc2Zvcm0gYW4gb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIG9iamVjdCBPYmplY3QgdG8gY2xvbmUgYW5kIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSBtYXRyaXggVHJhbnNmb3JtYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QgKG9iamVjdCA6IFRIUkVFLk9iamVjdDNELCBtYXRyaXggOiBUSFJFRS5NYXRyaXg0KSA6IFRIUkVFLk9iamVjdDNEIHtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgb2JqZWN0IChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBvYmplY3RDbG9uZSA6IFRIUkVFLk9iamVjdDNEID0gb2JqZWN0LmNsb25lKCk7XHJcbiAgICAgICAgb2JqZWN0Q2xvbmUudHJhdmVyc2Uob2JqZWN0ID0+IHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mKFRIUkVFLk1lc2gpKVxyXG4gICAgICAgICAgICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5LmNsb25lKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE4uQi4gSW1wb3J0YW50ISBUaGUgcG9zdGlvbiwgcm90YXRpb24gKHF1YXRlcm5pb24pIGFuZCBzY2FsZSBhcmUgY29ycmVjeSBidXQgdGhlIG1hdHJpeCBoYXMgbm90IGJlZW4gdXBkYXRlZC5cclxuICAgICAgICAvLyBUSFJFRS5qcyB1cGRhdGVzIHRoZSBtYXRyaXggaXMgdXBkYXRlZCBpbiB0aGUgcmVuZGVyKCkgbG9vcC5cclxuICAgICAgICBvYmplY3RDbG9uZS51cGRhdGVNYXRyaXgoKTsgICAgIFxyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm1cclxuICAgICAgICBvYmplY3RDbG9uZS5hcHBseU1hdHJpeChtYXRyaXgpO1xyXG5cclxuICAgICAgICByZXR1cm4gb2JqZWN0Q2xvbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHBhcmFtIG1lc2ggTWVzaCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3VuZGluZyBib3guXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwgb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEAgcmV0dXJucyBNZXNoIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tR2VvbWV0cnkocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBnZW9tZXRyeSA6IFRIUkVFLkdlb21ldHJ5LCBtYXRlcmlhbCA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2h7XHJcblxyXG4gICAgICAgIHZhciBib3VuZGluZ0JveCAgICAgOiBUSFJFRS5Cb3gzLFxyXG4gICAgICAgICAgICB3aWR0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGVwdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBib3hNZXNoICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGdlb21ldHJ5LmJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3ggKHBvc2l0aW9uLCBib3VuZGluZ0JveCwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94TWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiBib3guXHJcbiAgICAgKiBAcGFyYW0gYm94IEdlb21ldHJ5IEJveCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbCBvZiB0aGUgYm94LlxyXG4gICAgICogQCByZXR1cm5zIE1lc2ggb2YgdGhlIGJveC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGJvdW5kaW5nQm94IDogVEhSRUUuQm94MywgbWF0ZXJpYWwgOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBkZXB0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGJveE1lc2ggICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIHdpZHRoICA9IGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLng7XHJcbiAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdCb3gubWF4LnkgLSBib3VuZGluZ0JveC5taW4ueTtcclxuICAgICAgICBkZXB0aCAgPSBib3VuZGluZ0JveC5tYXgueiAtIGJvdW5kaW5nQm94Lm1pbi56O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3hNZXNoIChwb3NpdGlvbiwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG1hdGVyaWFsKTtcclxuICAgICAgICBib3hNZXNoLm5hbWUgPSBPYmplY3ROYW1lcy5Cb3VuZGluZ0JveDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJveE1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBleHRlbmRzIG9mIGFuIG9iamVjdCBvcHRpb25hbGx5IGluY2x1ZGluZyBhbGwgY2hpbGRyZW4uXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRCb3VuZGluZ0JveEZyb21PYmplY3Qocm9vdE9iamVjdCA6IFRIUkVFLk9iamVjdDNEKSA6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTQ5Mjg1Ny9hbnktd2F5LXRvLWdldC1hLWJvdW5kaW5nLWJveC1mcm9tLWEtdGhyZWUtanMtb2JqZWN0M2RcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzID0gbmV3IFRIUkVFLkJveDMoKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGJvdW5kaW5nQm94LnNldEZyb21PYmplY3Qocm9vdE9iamVjdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcclxuICAgICAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgYm94IG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgdGhlIGJveC5cclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIGRlcHRoIERlcHRoLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE9wdGlvbmFsIG1hdGVyaWFsLlxyXG4gICAgICogQHJldHVybnMgQm94IG1lc2guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3hNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgd2lkdGggOiBudW1iZXIsIGhlaWdodCA6IG51bWJlciwgZGVwdGggOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICB2YXIgXHJcbiAgICAgICAgICAgIGJveEdlb21ldHJ5ICA6IFRIUkVFLkJveEdlb21ldHJ5LFxyXG4gICAgICAgICAgICBib3hNYXRlcmlhbCAgOiBUSFJFRS5NYXRlcmlhbCxcclxuICAgICAgICAgICAgYm94ICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgYm94R2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2lkdGgsIGhlaWdodCwgZGVwdGgpO1xyXG4gICAgICAgIGJveEdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG5cclxuICAgICAgICBib3hNYXRlcmlhbCA9IG1hdGVyaWFsIHx8IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwZmYsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgYm94ID0gbmV3IFRIUkVFLk1lc2goIGJveEdlb21ldHJ5LCBib3hNYXRlcmlhbCk7XHJcbiAgICAgICAgYm94Lm5hbWUgPSBPYmplY3ROYW1lcy5Cb3g7XHJcbiAgICAgICAgYm94LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHBsYW5lIG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgdGhlIHBsYW5lLlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgT3B0aW9uYWwgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBQbGFuZSBtZXNoLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlUGxhbmVNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgd2lkdGggOiBudW1iZXIsIGhlaWdodCA6IG51bWJlciwgbWF0ZXJpYWw/IDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBwbGFuZUdlb21ldHJ5ICA6IFRIUkVFLlBsYW5lR2VvbWV0cnksXHJcbiAgICAgICAgICAgIHBsYW5lTWF0ZXJpYWwgIDogVEhSRUUuTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIHBsYW5lICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgcGxhbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHdpZHRoLCBoZWlnaHQpOyAgICAgICBcclxuICAgICAgICBwbGFuZU1hdGVyaWFsID0gbWF0ZXJpYWwgfHwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDBmZiwgb3BhY2l0eTogMS4wfSApO1xyXG5cclxuICAgICAgICBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBsYW5lTWF0ZXJpYWwpO1xyXG4gICAgICAgIHBsYW5lLm5hbWUgPSBPYmplY3ROYW1lcy5QbGFuZTtcclxuICAgICAgICBwbGFuZS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBsYW5lO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgc3BoZXJlIG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gT3JpZ2luIG9mIHRoZSBzcGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gcmFkaXVzIFJhZGl1cy5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVNwaGVyZU1lc2gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCByYWRpdXMgOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIHZhciBzcGhlcmVHZW9tZXRyeSAgOiBUSFJFRS5TcGhlcmVHZW9tZXRyeSxcclxuICAgICAgICAgICAgc2VnbWVudENvdW50ICAgIDogbnVtYmVyID0gMzIsXHJcbiAgICAgICAgICAgIHNwaGVyZU1hdGVyaWFsICA6IFRIUkVFLk1hdGVyaWFsLFxyXG4gICAgICAgICAgICBzcGhlcmUgICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBzcGhlcmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShyYWRpdXMsIHNlZ21lbnRDb3VudCwgc2VnbWVudENvdW50KTtcclxuICAgICAgICBzcGhlcmVHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgc3BoZXJlTWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgc3BoZXJlID0gbmV3IFRIUkVFLk1lc2goIHNwaGVyZUdlb21ldHJ5LCBzcGhlcmVNYXRlcmlhbCApO1xyXG4gICAgICAgIHNwaGVyZS5uYW1lID0gT2JqZWN0TmFtZXMuU3BoZXJlO1xyXG4gICAgICAgIHNwaGVyZS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNwaGVyZTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgbGluZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gc3RhcnRQb3NpdGlvbiBTdGFydCBwb2ludC5cclxuICAgICAqIEBwYXJhbSBlbmRQb3NpdGlvbiBFbmQgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgQ29sb3IuXHJcbiAgICAgKiBAcmV0dXJucyBMaW5lIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVMaW5lKHN0YXJ0UG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBlbmRQb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGNvbG9yIDogbnVtYmVyKSA6IFRIUkVFLkxpbmUge1xyXG5cclxuICAgICAgICB2YXIgbGluZSAgICAgICAgICAgIDogVEhSRUUuTGluZSxcclxuICAgICAgICAgICAgbGluZUdlb21ldHJ5ICAgIDogVEhSRUUuR2VvbWV0cnksXHJcbiAgICAgICAgICAgIG1hdGVyaWFsICAgICAgICA6IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBsaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgICAgICBsaW5lR2VvbWV0cnkudmVydGljZXMucHVzaCAoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pO1xyXG5cclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogY29sb3J9ICk7XHJcbiAgICAgICAgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGxpbmVHZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBheGVzIHRyaWFkLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIE9yaWdpbiBvZiB0aGUgdHJpYWQuXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIExlbmd0aCBvZiB0aGUgY29vcmRpbmF0ZSBhcnJvdy5cclxuICAgICAqIEBwYXJhbSBoZWFkTGVuZ3RoIExlbmd0aCBvZiB0aGUgYXJyb3cgaGVhZC5cclxuICAgICAqIEBwYXJhbSBoZWFkV2lkdGggV2lkdGggb2YgdGhlIGFycm93IGhlYWQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVXb3JsZEF4ZXNUcmlhZChwb3NpdGlvbj8gOiBUSFJFRS5WZWN0b3IzLCBsZW5ndGg/IDogbnVtYmVyLCBoZWFkTGVuZ3RoPyA6IG51bWJlciwgaGVhZFdpZHRoPyA6IG51bWJlcikgOiBUSFJFRS5PYmplY3QzRCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0cmlhZEdyb3VwICAgICAgOiBUSFJFRS5PYmplY3QzRCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpLFxyXG4gICAgICAgICAgICBhcnJvd1Bvc2l0aW9uICAgOiBUSFJFRS5WZWN0b3IzICA9IHBvc2l0aW9uIHx8bmV3IFRIUkVFLlZlY3RvcjMoKSxcclxuICAgICAgICAgICAgYXJyb3dMZW5ndGggICAgIDogbnVtYmVyID0gbGVuZ3RoICAgICB8fCAxNSxcclxuICAgICAgICAgICAgYXJyb3dIZWFkTGVuZ3RoIDogbnVtYmVyID0gaGVhZExlbmd0aCB8fCAxLFxyXG4gICAgICAgICAgICBhcnJvd0hlYWRXaWR0aCAgOiBudW1iZXIgPSBoZWFkV2lkdGggIHx8IDE7XHJcblxyXG4gICAgICAgIHRyaWFkR3JvdXAuYWRkKG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSwgYXJyb3dQb3NpdGlvbiwgYXJyb3dMZW5ndGgsIDB4ZmYwMDAwLCBhcnJvd0hlYWRMZW5ndGgsIGFycm93SGVhZFdpZHRoKSk7XHJcbiAgICAgICAgdHJpYWRHcm91cC5hZGQobmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApLCBhcnJvd1Bvc2l0aW9uLCBhcnJvd0xlbmd0aCwgMHgwMGZmMDAsIGFycm93SGVhZExlbmd0aCwgYXJyb3dIZWFkV2lkdGgpKTtcclxuICAgICAgICB0cmlhZEdyb3VwLmFkZChuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSksIGFycm93UG9zaXRpb24sIGFycm93TGVuZ3RoLCAweDAwMDBmZiwgYXJyb3dIZWFkTGVuZ3RoLCBhcnJvd0hlYWRXaWR0aCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJpYWRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXhlcyBncmlkLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uICBPcmlnaW4gb2YgdGhlIGF4ZXMgZ3JpZC5cclxuICAgICAqIEBwYXJhbSBzaXplIFNpemUgb2YgdGhlIGdyaWQuXHJcbiAgICAgKiBAcGFyYW0gc3RlcCBHcmlkIGxpbmUgaW50ZXJ2YWxzLlxyXG4gICAgICogQHJldHVybnMgR3JpZCBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVXb3JsZEF4ZXNHcmlkKHBvc2l0aW9uPyA6IFRIUkVFLlZlY3RvcjMsIHNpemU/IDogbnVtYmVyLCBzdGVwPyA6IG51bWJlcikgOiBUSFJFRS5PYmplY3QzRCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciBncmlkR3JvdXAgICAgICAgOiBUSFJFRS5PYmplY3QzRCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpLFxyXG4gICAgICAgICAgICBncmlkUG9zaXRpb24gICAgOiBUSFJFRS5WZWN0b3IzICA9IHBvc2l0aW9uIHx8bmV3IFRIUkVFLlZlY3RvcjMoKSxcclxuICAgICAgICAgICAgZ3JpZFNpemUgICAgICAgIDogbnVtYmVyID0gc2l6ZSB8fCAxMCxcclxuICAgICAgICAgICAgZ3JpZFN0ZXAgICAgICAgIDogbnVtYmVyID0gc3RlcCB8fCAxLFxyXG4gICAgICAgICAgICBjb2xvckNlbnRlcmxpbmUgOiBudW1iZXIgPSAgMHhmZjAwMDAwMCxcclxuICAgICAgICAgICAgeHlHcmlkICAgICAgICAgICA6IFRIUkVFLkdyaWRIZWxwZXIsXHJcbiAgICAgICAgICAgIHl6R3JpZCAgICAgICAgICAgOiBUSFJFRS5HcmlkSGVscGVyLFxyXG4gICAgICAgICAgICB6eEdyaWQgICAgICAgICAgIDogVEhSRUUuR3JpZEhlbHBlcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgeHlHcmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoZ3JpZFNpemUsIGdyaWRTdGVwKTtcclxuICAgICAgICB4eUdyaWQuc2V0Q29sb3JzKGNvbG9yQ2VudGVybGluZSwgMHhmZjAwMDApO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi5jb3B5KGdyaWRQb3NpdGlvbi5jbG9uZSgpKTtcclxuICAgICAgICB4eUdyaWQucm90YXRlT25BeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDEsIDAsIDApLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgeHlHcmlkLnBvc2l0aW9uLnggKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgeHlHcmlkLnBvc2l0aW9uLnkgKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgZ3JpZEdyb3VwLmFkZCh4eUdyaWQpO1xyXG5cclxuICAgICAgICB5ekdyaWQgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcihncmlkU2l6ZSwgZ3JpZFN0ZXApO1xyXG4gICAgICAgIHl6R3JpZC5zZXRDb2xvcnMoY29sb3JDZW50ZXJsaW5lLCAweDAwZmYwMCk7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLmNvcHkoZ3JpZFBvc2l0aW9uLmNsb25lKCkpO1xyXG4gICAgICAgIHl6R3JpZC5yb3RhdGVPbkF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB5ekdyaWQucG9zaXRpb24ueSArPSBncmlkU2l6ZTtcclxuICAgICAgICB5ekdyaWQucG9zaXRpb24ueiArPSBncmlkU2l6ZTtcclxuICAgICAgICBncmlkR3JvdXAuYWRkKHl6R3JpZCk7XHJcblxyXG4gICAgICAgIHp4R3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKGdyaWRTaXplLCBncmlkU3RlcCk7XHJcbiAgICAgICAgenhHcmlkLnNldENvbG9ycyhjb2xvckNlbnRlcmxpbmUsIDB4MDAwMGZmKTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24uY29weShncmlkUG9zaXRpb24uY2xvbmUoKSk7XHJcbiAgICAgICAgenhHcmlkLnJvdGF0ZU9uQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHp4R3JpZC5wb3NpdGlvbi56ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIHp4R3JpZC5wb3NpdGlvbi54ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIGdyaWRHcm91cC5hZGQoenhHcmlkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdyaWRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQWRkcyBhIGNhbWVyYSBoZWxwZXIgdG8gYSBzY2VuZSB0byB2aXN1YWxpemUgdGhlIGNhbWVyYSBwb3NpdGlvbi5cclxuICAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgdG8gYW5ub3RhdGUuXHJcbiAgICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEgdG8gY29uc3RydWN0IGhlbHBlciAobWF5IGJlIG51bGwpLlxyXG4gICAgICAqL1xyXG4gICAgc3RhdGljIGFkZENhbWVyYUhlbHBlciAoc2NlbmUgOiBUSFJFRS5TY2VuZSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmdcclxuICAgICAgICBsZXQgZXhpc3RpbmdDYW1lcmFIZWxwZXIgOiBUSFJFRS5Hcm91cCA9IHNjZW5lLmdldE9iamVjdEJ5TmFtZShPYmplY3ROYW1lcy5DYW1lcmFIZWxwZXIpO1xyXG4gICAgICAgIGlmIChleGlzdGluZ0NhbWVyYUhlbHBlcilcclxuICAgICAgICAgICAgc2NlbmUucmVtb3ZlKGV4aXN0aW5nQ2FtZXJhSGVscGVyKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYW1lcmEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY2FtZXJhSGVscGVyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgY2FtZXJhSGVscGVyLm5hbWUgPSBPYmplY3ROYW1lcy5DYW1lcmFIZWxwZXI7ICAgICAgIFxyXG4gICAgICAgIGNhbWVyYUhlbHBlci52aXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChjYW1lcmEucG9zaXRpb24sIDUpO1xyXG4gICAgICAgIGNhbWVyYUhlbHBlci5hZGQocG9zaXRpb24pO1xyXG5cclxuICAgICAgICBzY2VuZS5hZGQoY2FtZXJhSGVscGVyKTtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQWRkcyBhIGNvb3JkaW5hdGUgYXhpcyBoZWxwZXIgdG8gYSBzY2VuZSB0byB2aXN1YWxpemUgdGhlIHdvcmxkIGF4ZXMuXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqL1xyXG4gICAgc3RhdGljIGFkZEF4aXNIZWxwZXIgKHNjZW5lIDogVEhSRUUuU2NlbmUsIHNpemUgOiBudW1iZXIpIDogdm9pZHtcclxuXHJcbiAgICAgICAgbGV0IGF4aXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhpc0hlbHBlcihzaXplKTtcclxuICAgICAgICBheGlzSGVscGVyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHNjZW5lLmFkZChheGlzSGVscGVyKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gQ29vcmRpbmF0ZSBDb252ZXJzaW9uXHJcbiAgICAvKlxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIENvb3JkaW5hdGUgU3lzdGVtc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgRlJBTUVcdCAgICAgICAgICAgIEVYQU1QTEVcdFx0XHRcdFx0XHRcdFx0XHRcdFNQQUNFICAgICAgICAgICAgICAgICAgICAgIFVOSVRTICAgICAgICAgICAgICAgICAgICAgICBOT1RFU1xyXG5cclxuICAgIE1vZGVsICAgICAgICAgICAgICAgQ2F0YWxvZyBXZWJHTDogTW9kZWwsIEJhbmRFbGVtZW50IEJsb2NrICAgICBvYmplY3QgICAgICAgICAgICAgICAgICAgICAgbW0gICAgICAgICAgICAgICAgICAgICAgICAgIFJoaW5vIGRlZmluaXRpb25zXHJcbiAgICBXb3JsZCAgICAgICAgICAgICAgIERlc2lnbiBNb2RlbFx0XHRcdFx0XHRcdFx0XHR3b3JsZCAgICAgICAgICAgICAgICAgICAgICAgbW0gXHJcbiAgICBWaWV3ICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldyAgICAgICAgICAgICAgICAgICAgICAgIG1tXHJcbiAgICBEZXZpY2UgICAgICAgICAgICAgIE5vcm1hbGl6ZWQgdmlld1x0XHRcdFx0XHRcdFx0ICAgIGRldmljZSAgICAgICAgICAgICAgICAgICAgICBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgIFNjcmVlbi5QYWdlICAgICAgICAgSFRNTCBwYWdlXHRcdFx0XHRcdFx0XHRcdFx0c2NyZWVuICAgICAgICAgICAgICAgICAgICAgIHB4ICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAgYXQgVG9wIExlZnQsICtZIGRvd24gICAgSFRNTCBwYWdlXHJcbiAgICBTY3JlZW4uQ2xpZW50ICAgICAgIEJyb3dzZXIgdmlldyBwb3J0IFx0XHRcdFx0XHRcdCAgICBzY3JlZW4gICAgICAgICAgICAgICAgICAgICAgcHggICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCBhdCBUb3AgTGVmdCwgK1kgZG93biAgICBicm93c2VyIHdpbmRvd1xyXG4gICAgU2NyZWVuLkNvbnRhaW5lciAgICBET00gY29udGFpbmVyXHRcdFx0XHRcdFx0XHRcdHNjcmVlbiAgICAgICAgICAgICAgICAgICAgICBweCAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwIGF0IFRvcCBMZWZ0LCArWSBkb3duICAgIEhUTUwgY2FudmFzXHJcblxyXG4gICAgTW91c2UgRXZlbnQgUHJvcGVydGllc1xyXG4gICAgaHR0cDovL3d3dy5qYWNrbG1vb3JlLmNvbS9ub3Rlcy9tb3VzZS1wb3NpdGlvbi9cclxuICAgICovXHJcbiAgICAgICAgXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFdvcmxkIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHdvcmxkQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMyB7XHJcblxyXG4gICAgICAgIHZhciB3b3JsZENvb3JkaW5hdGVzICAgIDogVEhSRUUuVmVjdG9yMyxcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMyRCA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBkZXZpY2VaICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gdGhpcy5kZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICBkZXZpY2VaID0gKGNhbWVyYSBpbnN0YW5jZW9mIFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSA/IDAuNSA6IDEuMDtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEID0gbmV3IFRIUkVFLlZlY3RvcjMoZGV2aWNlQ29vcmRpbmF0ZXMyRC54LCBkZXZpY2VDb29yZGluYXRlczJELnksIGRldmljZVopO1xyXG5cclxuICAgICAgICB3b3JsZENvb3JkaW5hdGVzID0gZGV2aWNlQ29vcmRpbmF0ZXMzRC51bnByb2plY3QoY2FtZXJhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHdvcmxkQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRWaWV3IENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB3b3JsZCBjb29yZGluYXRlcyB0byB2aWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciBXb3JsZCBjb29yZGluYXRlIHZlY3RvciB0byBjb252ZXJ0LlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdmlld0Nvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IzIHtcclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLCAgXHJcbiAgICAgICAgICAgIHZpZXdDb29yZGluYXRlcyAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgdmlld0Nvb3JkaW5hdGVzID0gcG9zaXRpb24uYXBwbHlNYXRyaXg0KGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlld0Nvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0RGV2aWNlIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIG5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEByZXR1cm5zIE5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5KSA6IFRIUkVFLlZlY3RvcjIge1xyXG5cclxuICAgICAgICB2YXIgZGV2aWNlQ29vcmRpbmF0ZXMgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgcmF0aW9YLCAgcmF0aW9ZICAgICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGV2aWNlWCwgZGV2aWNlWSAgICAgICAgICAgICA6IG51bWJlcjtcclxuXHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgPSB0aGlzLnNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgcmF0aW9YID0gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueCAvIGNvbnRhaW5lci53aWR0aCgpO1xyXG4gICAgICAgIHJhdGlvWSA9IHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnkgLyBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGRldmljZVggPSArKChyYXRpb1ggKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZVkgPSAtKChyYXRpb1kgKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlWCwgZGV2aWNlWSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXZpY2VDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIGRldmljZSBjb29yZGluYXRlcyBbLTEsIDFdLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciAgV29ybGQgY29vcmRpbmF0ZXMgdmVjdG9yLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcHJldHVybnMgRGV2aWNlIGNvb3JpbmRhdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2lzc3Vlcy83OFxyXG4gICAgICAgIHZhciBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICA6IFRIUkVFLlZlY3RvcjMgPSB2ZWN0b3IuY2xvbmUoKSwgIFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgICAgICAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCA9IHBvc2l0aW9uLnByb2plY3QoY2FtZXJhKTtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlQ29vcmRpbmF0ZXMzRC54LCBkZXZpY2VDb29yZGluYXRlczNELnkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGV2aWNlQ29vcmRpbmF0ZXMyRDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFNjcmVlbiBDb29yZGluYXRlc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLyoqXHJcbiAgICAgKiBQYWdlIGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIChwYWdlKSBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlblBhZ2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlblBhZ2VDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cclxuICAgICAgICBzY3JlZW5QYWdlQ29vcmRpbmF0ZXMueCA9IGV2ZW50LnBhZ2VYO1xyXG4gICAgICAgIHNjcmVlblBhZ2VDb29yZGluYXRlcy55ID0gZXZlbnQucGFnZVk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5QYWdlQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2xpZW50IGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSA8YnJvd3Nlcj4gdmlldyBwb3J0LiBJZiB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gc2Nyb2xsZWQgaXQgd2lsbFxyXG4gICAgICogYmUgZGlmZmVyZW50IHRoYW4gdGhlIHBhZ2UgY29vcmRpbmF0ZXMgd2hpY2ggYXJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGUgdG9wIGxlZnQgb2YgdGhlIDxlbnRpcmU+IEhUTUwgcGFnZSBkb2N1bWVudC5cclxuICAgICAqIGh0dHA6Ly93d3cuYmVubmFkZWwuY29tL2Jsb2cvMTg2OS1qcXVlcnktbW91c2UtZXZlbnRzLXBhZ2V4LXktdnMtY2xpZW50eC15Lmh0bVxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiBjbGllbnQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5DbGllbnRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnkgPSBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBKUXVlcnkgZXZlbnQgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnkpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXHJcbiAgICAgICAgICAgIGNvbnRhaW5lck9mZnNldCAgICAgICAgICAgIDogSlF1ZXJ5Q29vcmRpbmF0ZXMsXHJcbiAgICAgICAgICAgIHBhZ2VYLCBwYWdlWSAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBjb250YWluZXJPZmZzZXQgPSBjb250YWluZXIub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEpRdWVyeSBkb2VzIG5vdCBzZXQgcGFnZVgvcGFnZVkgZm9yIERyb3AgZXZlbnRzLiBUaGV5IGFyZSBkZWZpbmVkIGluIHRoZSBvcmlnaW5hbEV2ZW50IG1lbWJlci5cclxuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYIHx8ICg8YW55PihldmVudC5vcmlnaW5hbEV2ZW50KSkucGFnZVg7XHJcbiAgICAgICAgcGFnZVkgPSBldmVudC5wYWdlWSB8fCAoPGFueT4oZXZlbnQub3JpZ2luYWxFdmVudCkpLnBhZ2VZO1xyXG5cclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy54ID0gcGFnZVggLSBjb250YWluZXJPZmZzZXQubGVmdDtcclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy55ID0gcGFnZVkgLSBjb250YWluZXJPZmZzZXQudG9wO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yIFdvcmxkIHZlY3Rvci5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvaXNzdWVzLzc4XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlcyAgICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgbGVmdCAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIHRvcCAgICAgICAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICAvLyBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlcyA9IHRoaXMuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyhwb3NpdGlvbiwgY2FtZXJhKTtcclxuICAgICAgICBsZWZ0ID0gKCgrZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMikgKiBjb250YWluZXIud2lkdGgoKTtcclxuICAgICAgICB0b3AgID0gKCgtZGV2aWNlQ29vcmRpbmF0ZXMueSArIDEpIC8gMikgKiBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIobGVmdCwgdG9wKTtcclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEludGVyc2VjdGlvbnNcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vICBJbnRlcnNlY3Rpb25zXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBSYXljYXN0ZXIgdGhyb3VnaCB0aGUgbW91c2Ugd29ybGQgcG9zaXRpb24uXHJcbiAgICAgKiBAcGFyYW0gbW91c2VXb3JsZCBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgVEhSRUUuUmF5Y2FzdGVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmF5Y2FzdGVyRnJvbU1vdXNlIChtb3VzZVdvcmxkIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlJheWNhc3RlcntcclxuXHJcbiAgICAgICAgdmFyIHJheU9yaWdpbiAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMgKG1vdXNlV29ybGQueCwgbW91c2VXb3JsZC55LCBjYW1lcmEucG9zaXRpb24ueiksXHJcbiAgICAgICAgICAgIHdvcmxkUG9pbnQgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMobW91c2VXb3JsZC54LCBtb3VzZVdvcmxkLnksIG1vdXNlV29ybGQueik7XHJcblxyXG4gICAgICAgICAgICAvLyBUb29scy5jb25zb2xlTG9nKCdXb3JsZCBtb3VzZSBjb29yZGluYXRlczogJyArIHdvcmxkUG9pbnQueCArICcsICcgKyB3b3JsZFBvaW50LnkpO1xyXG5cclxuICAgICAgICAvLyBjb25zdHJ1Y3QgcmF5IGZyb20gY2FtZXJhIHRvIG1vdXNlIHdvcmxkXHJcbiAgICAgICAgdmFyIHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIgKHJheU9yaWdpbiwgd29ybGRQb2ludC5zdWIgKHJheU9yaWdpbikubm9ybWFsaXplKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF5Y2FzdGVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBJbnRlcnNlY3Rpb24gbG9jYXRlZCBieSB0aGUgY3Vyc29yLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHBhcmFtIHNjZW5lT2JqZWN0cyBBcnJheSBvZiBzY2VuZSBvYmplY3RzLlxyXG4gICAgICogQHBhcmFtIHJlY3Vyc2UgUmVjdXJzZSB0aHJvdWdoIG9iamVjdHMuXHJcbiAgICAgKiBAcmV0dXJucyBGaXJzdCBpbnRlcnNlY3Rpb24gd2l0aCBzY3JlZW4gb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEZpcnN0SW50ZXJzZWN0aW9uKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhLCBzY2VuZU9iamVjdHMgOiBUSFJFRS5PYmplY3QzRFtdLCByZWN1cnNlIDogYm9vbGVhbikgOiBUSFJFRS5JbnRlcnNlY3Rpb24ge1xyXG5cclxuICAgICAgICB2YXIgcmF5Y2FzdGVyICAgICAgICAgIDogVEhSRUUuUmF5Y2FzdGVyLFxyXG4gICAgICAgICAgICBtb3VzZVdvcmxkICAgICAgICAgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBpSW50ZXJzZWN0aW9uICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGludGVyc2VjdGlvbiAgICAgICA6IFRIUkVFLkludGVyc2VjdGlvbjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnN0cnVjdCByYXkgZnJvbSBjYW1lcmEgdG8gbW91c2Ugd29ybGRcclxuICAgICAgICBtb3VzZVdvcmxkID0gR3JhcGhpY3Mud29ybGRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIsIGNhbWVyYSk7XHJcbiAgICAgICAgcmF5Y2FzdGVyICA9IEdyYXBoaWNzLnJheWNhc3RlckZyb21Nb3VzZSAobW91c2VXb3JsZCwgY2FtZXJhKTtcclxuXHJcbiAgICAgICAgLy8gZmluZCBhbGwgb2JqZWN0IGludGVyc2VjdGlvbnNcclxuICAgICAgICB2YXIgaW50ZXJzZWN0cyA6IFRIUkVFLkludGVyc2VjdGlvbltdID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMgKHNjZW5lT2JqZWN0cywgcmVjdXJzZSk7XHJcblxyXG4gICAgICAgIC8vIG5vIGludGVyc2VjdGlvbj9cclxuICAgICAgICBpZiAoaW50ZXJzZWN0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1c2UgZmlyc3Q7IHJlamVjdCBsaW5lcyAoVHJhbnNmb3JtIEZyYW1lKVxyXG4gICAgICAgIGZvciAoaUludGVyc2VjdGlvbiA9IDA7IGlJbnRlcnNlY3Rpb24gPCBpbnRlcnNlY3RzLmxlbmd0aDsgaUludGVyc2VjdGlvbisrKSB7XHJcblxyXG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3RzW2lJbnRlcnNlY3Rpb25dO1xyXG4gICAgICAgICAgICBpZiAoIShpbnRlcnNlY3Rpb24ub2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuTGluZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSGVscGVyc1xyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIEhlbHBlcnNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIFdlYkdMIHRhcmdldCBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gaWQgRE9NIGlkIGZvciBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgY2FudmFzLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZUNhbnZhcyhpZCA6IHN0cmluZywgd2lkdGg/IDogbnVtYmVyLCBoZWlnaHQ/IDogbnVtYmVyKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgIFxyXG4gICAgICAgIGxldCBjYW52YXMgOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aWR9YCk7XHJcbiAgICAgICAgaWYgKCFjYW52YXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYENhbnZhcyBlbGVtZW50IGlkID0gJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ1NTIGNvbnRyb2xzIHRoZSBzaXplXHJcbiAgICAgICAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KVxyXG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgZGltZW5zaW9ucyAgICBcclxuICAgICAgICBjYW52YXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIHJldHVybiBjYW52YXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5cclxuZXhwb3J0IGVudW0gU3RhbmRhcmRWaWV3IHtcclxuICAgIEZyb250LFxyXG4gICAgQmFjayxcclxuICAgIFRvcCxcclxuICAgIEJvdHRvbSxcclxuICAgIExlZnQsXHJcbiAgICBSaWdodCxcclxuICAgIElzb21ldHJpY1xyXG59XHJcblxyXG4vKipcclxuICogQ2FtZXJhXHJcbiAqIEdlbmVyYWwgY2FtZXJhIHV0aWxpdHkgbWV0aG9kcy5cclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FtZXJhIHtcclxuXHJcbiAgICBzdGF0aWMgRGVmYXVsdEZpZWxkT2ZWaWV3ICAgICAgIDogbnVtYmVyID0gMzc7ICAgICAgIC8vIDM1bW0gdmVydGljYWwgOiBodHRwczovL3d3dy5uaWtvbmlhbnMub3JnL3Jldmlld3MvZm92LXRhYmxlcyAgICAgICBcclxuICAgIHN0YXRpYyBEZWZhdWx0TmVhckNsaXBwaW5nUGxhbmUgOiBudW1iZXIgPSAwLjE7IFxyXG4gICAgc3RhdGljIERlZmF1bHRGYXJDbGlwcGluZ1BsYW5lICA6IG51bWJlciA9IDEwMDAwOyBcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gQ2xpcHBpbmcgUGxhbmVzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBleHRlbnRzIG9mIHRoZSBuZWFyIGNhbWVyYSBwbGFuZS5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7VEhSRUUuUGVyc3BlY3RpdmVDYW1lcmF9IGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuVmVjdG9yMn0gXHJcbiAgICAgKiBAbWVtYmVyb2YgR3JhcGhpY3NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldE5lYXJQbGFuZUV4dGVudHMoY2FtZXJhIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNhbWVyYUZPVlJhZGlhbnMgPSBjYW1lcmEuZm92ICogKE1hdGguUEkgLyAxODApO1xyXG4gICAgXHJcbiAgICAgICAgbGV0IG5lYXJIZWlnaHQgPSAyICogTWF0aC50YW4oY2FtZXJhRk9WUmFkaWFucyAvIDIpICogY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgbGV0IG5lYXJXaWR0aCAgPSBjYW1lcmEuYXNwZWN0ICogbmVhckhlaWdodDtcclxuICAgICAgICBsZXQgZXh0ZW50cyA9IG5ldyBUSFJFRS5WZWN0b3IyKG5lYXJXaWR0aCwgbmVhckhlaWdodCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGV4dGVudHM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFNldHRpbmdzXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgdGhlIGRlZmF1bHQgYm91bmRpbmcgYm94IGZvciBhIG1vZGVsLlxyXG4gICAgICogSWYgdGhlIG1vZGVsIGlzIGVtcHR5LCBhIHVuaXQgc3BoZXJlIGlzIHVzZXMgYXMgYSBwcm94eSB0byBwcm92aWRlIGRlZmF1bHRzLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5PYmplY3QzRH0gbW9kZWwgTW9kZWwgdG8gY2FsY3VsYXRlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5Cb3gzfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0RGVmYXVsdEJvdW5kaW5nQm94IChtb2RlbCA6IFRIUkVFLk9iamVjdDNEKSA6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpOyAgICAgICBcclxuICAgICAgICBpZiAobW9kZWwpIFxyXG4gICAgICAgICAgICBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChtb2RlbCk7IFxyXG5cclxuICAgICAgICBpZiAoIWJvdW5kaW5nQm94LmlzRW1wdHkoKSlcclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHVuaXQgc3BoZXJlIHByb3h5XHJcbiAgICAgICAgbGV0IHNwaGVyZVByb3h5ID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCAxKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChzcGhlcmVQcm94eSk7ICAgICAgICAgXHJcblxyXG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGVzIHRoZSBjYW1lcmEgdG8gZml0IHRoZSBtb2RlbCBpbiB0aGUgY3VycmVudCB2aWV3LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIENhbWVyYSB0byB1cGRhdGUuXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLkdyb3VwfSBtb2RlbCBNb2RlbCB0byBmaXQuXHJcbiAgICAgKiBAcmV0dXJucyB7Q2FtZXJhU2V0dGluZ3N9IFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Rml0Vmlld0NhbWVyYSAoY2FtZXJhVGVtcGxhdGUgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgbW9kZWwgOiBUSFJFRS5Hcm91cCwgKSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHsgXHJcblxyXG4gICAgICAgIGxldCBjYW1lcmEgPSBjYW1lcmFUZW1wbGF0ZS5jbG9uZSh0cnVlKTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZCAgICAgICAgIDogVEhSRUUuQm94MyAgICA9IENhbWVyYS5nZXREZWZhdWx0Qm91bmRpbmdCb3gobW9kZWwpO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZCAgICAgICAgOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UgOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBGaW5kIGNhbWVyYSBwb3NpdGlvbiBpbiBWaWV3IGNvb3JkaW5hdGVzLi4uXHJcblxyXG4gICAgICAgIC8vIGNsb25lIG1vZGVsIChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBtb2RlbFZpZXcgICAgICAgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QobW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldyA9IENhbWVyYS5nZXREZWZhdWx0Qm91bmRpbmdCb3gobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgbGV0IHZlcnRpY2FsRmllbGRPZlZpZXdSYWRpYW5zICAgOiBudW1iZXIgPSAoY2FtZXJhLmZvdiAvIDIpICogKE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgIGxldCBob3Jpem9udGFsRmllbGRPZlZpZXdSYWRpYW5zIDogbnVtYmVyID0gTWF0aC5hdGFuKGNhbWVyYS5hc3BlY3QgKiBNYXRoLnRhbih2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucykpOyAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGNhbWVyYVpWZXJ0aWNhbEV4dGVudHMgICA6IG51bWJlciA9IChib3VuZGluZ0JveFZpZXcuZ2V0U2l6ZSgpLnkgLyAyKSAvIE1hdGgudGFuICh2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucyk7ICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFaSG9yaXpvbnRhbEV4dGVudHMgOiBudW1iZXIgPSAoYm91bmRpbmdCb3hWaWV3LmdldFNpemUoKS54IC8gMikgLyBNYXRoLnRhbiAoaG9yaXpvbnRhbEZpZWxkT2ZWaWV3UmFkaWFucyk7ICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFaID0gTWF0aC5tYXgoY2FtZXJhWlZlcnRpY2FsRXh0ZW50cywgY2FtZXJhWkhvcml6b250YWxFeHRlbnRzKTtcclxuXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uVmlldyA9IG5ldyBUSFJFRS5WZWN0b3IzKGJvdW5kaW5nQm94Vmlldy5nZXRDZW50ZXIoKS54LCBib3VuZGluZ0JveFZpZXcuZ2V0Q2VudGVyKCkueSwgYm91bmRpbmdCb3hWaWV3Lm1heC56ICsgY2FtZXJhWik7XHJcblxyXG4gICAgICAgIC8vIE5vdywgdHJhbnNmb3JtIGJhY2sgdG8gV29ybGQgY29vcmRpbmF0ZXMuLi5cclxuICAgICAgICBsZXQgcG9zaXRpb25Xb3JsZCA9IHBvc2l0aW9uVmlldy5hcHBseU1hdHJpeDQoY2FtZXJhTWF0cml4V29ybGQpO1xyXG5cclxuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAocG9zaXRpb25Xb3JsZCk7XHJcbiAgICAgICAgY2FtZXJhLmxvb2tBdChib3VuZGluZ0JveFdvcmxkLmdldENlbnRlcigpKTtcclxuXHJcbiAgICAgICAgLy8gZm9yY2UgY2FtZXJhIG1hdHJpeCB0byB1cGRhdGU7IG1hdHJpeEF1dG9VcGRhdGUgaGFwcGVucyBpbiByZW5kZXIgbG9vcFxyXG4gICAgICAgIGNhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTtcclxuICAgICAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gY2FtZXJhO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyB0aGUgY2FtZXJhIHNldHRpbmdzIHRvIGZpdCB0aGUgbW9kZWwgaW4gYSBzdGFuZGFyZCB2aWV3LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtDYW1lcmEuU3RhbmRhcmRWaWV3fSB2aWV3IFN0YW5kYXJkIHZpZXcgKFRvcCwgTGVmdCwgZXRjLilcclxuICAgICAqIEBwYXJhbSB7VEhSRUUuT2JqZWN0M0R9IG1vZGVsIE1vZGVsIHRvIGZpdC5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRTdGFuZGFyZFZpZXdDYW1lcmEgKHZpZXc6IFN0YW5kYXJkVmlldywgdmlld0FzcGVjdCA6IG51bWJlciwgbW9kZWwgOiBUSFJFRS5Hcm91cCkgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSB7IFxyXG4gICAgICAgXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IENhbWVyYS5nZXREZWZhdWx0Q2FtZXJhKHZpZXdBc3BlY3QpOyAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAodmlldykge1xyXG5cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuRnJvbnQ6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMygwLCAgMCwgMSkpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAxLCAwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LkJhY2s6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMygwLCAgMCwgLTEpKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Ub3A6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMygwLCAgMSwgMCkpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAwLCAtMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Cb3R0b206IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMygwLCAtMSwgMCkpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAwLCAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LkxlZnQ6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMygtMSwgIDAsIDApKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5SaWdodDoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKDEsICAwLCAwKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KDAsIDEsIDApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuSXNvbWV0cmljOiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMoMSwgIDAsIDEpKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoLTEsIDEsIC0xKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBGb3JjZSBvcmllbnRhdGlvbiBiZWZvcmUgRml0IFZpZXcgY2FsY3VsYXRpb25cclxuICAgICAgICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKCkpO1xyXG5cclxuICAgICAgICAvLyBmb3JjZSBjYW1lcmEgbWF0cml4IHRvIHVwZGF0ZTsgbWF0cml4QXV0b1VwZGF0ZSBoYXBwZW5zIGluIHJlbmRlciBsb29wXHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpO1xyXG4gICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgIGNhbWVyYSA9IENhbWVyYS5nZXRGaXRWaWV3Q2FtZXJhKGNhbWVyYSwgbW9kZWwpO1xyXG4gICAgICAgIHJldHVybiBjYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgZGVmYXVsdCBzY2VuZSBjYW1lcmEuXHJcbiAgICAgKiBAcGFyYW0gdmlld0FzcGVjdCBWaWV3IGFzcGVjdCByYXRpby5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldERlZmF1bHRDYW1lcmEgKHZpZXdBc3BlY3QgOiBudW1iZXIpIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkZWZhdWx0Q2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyAoMCwgMCwgMSkpO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKCkpO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEubmVhciAgID0gQ2FtZXJhLkRlZmF1bHROZWFyQ2xpcHBpbmdQbGFuZTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmZhciAgICA9IENhbWVyYS5EZWZhdWx0RmFyQ2xpcHBpbmdQbGFuZTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmZvdiAgICA9IENhbWVyYS5EZWZhdWx0RmllbGRPZlZpZXc7XHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS5hc3BlY3QgPSB2aWV3QXNwZWN0O1xyXG5cclxuICAgICAgICAvLyBmb3JjZSBjYW1lcmEgbWF0cml4IHRvIHVwZGF0ZTsgbWF0cml4QXV0b1VwZGF0ZSBoYXBwZW5zIGluIHJlbmRlciBsb29wXHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTsgICAgICAgXHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4O1xyXG5cclxuICAgICAgICByZXR1cm4gZGVmYXVsdENhbWVyYTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZGVmYXVsdCBzY2VuZSBjYW1lcmEuXHJcbiAgICAgKiBDcmVhdGVzIGEgZGVmYXVsdCBpZiB0aGUgY3VycmVudCBjYW1lcmEgaGFzIG5vdCBiZWVuIGNvbnN0cnVjdGVkLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBBY3RpdmUgY2FtZXJhIChwb3NzaWJseSBudWxsKS5cclxuICAgICAqIEBwYXJhbSB2aWV3QXNwZWN0IFZpZXcgYXNwZWN0IHJhdGlvLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0U2NlbmVDYW1lcmEgKGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIHZpZXdBc3BlY3QgOiBudW1iZXIpIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEge1xyXG5cclxuICAgICAgICBpZiAoY2FtZXJhKVxyXG4gICAgICAgICAgICByZXR1cm4gY2FtZXJhO1xyXG5cclxuICAgICAgICBsZXQgZGVmYXVsdENhbWVyYSA9IENhbWVyYS5nZXREZWZhdWx0Q2FtZXJhKHZpZXdBc3BlY3QpO1xyXG4gICAgICAgIHJldHVybiBkZWZhdWx0Q2FtZXJhO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG4iLCIgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgIFxyXG4vKipcclxuICogTWF0aCBMaWJyYXJ5XHJcbiAqIEdlbmVyYWwgbWF0aGVtYXRpY3Mgcm91dGluZXNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0aExpYnJhcnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdHdvIG51bWJlcnMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIEZpcnN0IHZhbHVlIHRvIGNvbXBhcmUuXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIgU2Vjb25kIHZhbHVlIHRvIGNvbXBhcmUuXHJcbiAgICAgKiBAcGFyYW0gdG9sZXJhbmNlIFRvbGVyYW5jZSBmb3IgY29tcGFyaXNvbi5cclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgd2l0aGluIHRvbGVyYW5jZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIG51bWJlcnNFcXVhbFdpdGhpblRvbGVyYW5jZSh2YWx1ZSA6IG51bWJlciwgb3RoZXIgOiBudW1iZXIsIHRvbGVyYW5jZSA6IG51bWJlcikgOiBib29sZWFuIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuICgodmFsdWUgPj0gKG90aGVyIC0gdG9sZXJhbmNlKSkgJiYgKHZhbHVlIDw9IChvdGhlciArIHRvbGVyYW5jZSkpKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7YXNzZXJ0fSAgICAgICAgICAgICBmcm9tICdjaGFpJ1xyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYX0gICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG5pbnRlcmZhY2UgRmFjZVBhaXIge1xyXG4gICAgICAgIFxyXG4gICAgdmVydGljZXMgOiBUSFJFRS5WZWN0b3IzW107XHJcbiAgICBmYWNlcyAgICA6IFRIUkVFLkZhY2UzW107XHJcbn1cclxuICAgICAgICAgIFxyXG4vKipcclxuICogIERlcHRoQnVmZmVyIFxyXG4gKiAgQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXIge1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBNZXNoTW9kZWxOYW1lICAgICAgICAgOiBzdHJpbmcgPSAnTW9kZWxNZXNoJztcclxuICAgIHN0YXRpYyByZWFkb25seSBOb3JtYWxpemVkVG9sZXJhbmNlICAgOiBudW1iZXIgPSAuMDAxOyAgICBcclxuXHJcbiAgICBzdGF0aWMgRGVmYXVsdE1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyA9IHt3aXJlZnJhbWUgOiBmYWxzZSwgY29sb3IgOiAweGZmMDBmZiwgcmVmbGVjdGl2aXR5IDogMC43NSwgc2hpbmluZXNzIDogMC43NX07XHJcbiAgICBcclxuICAgIF9sb2dnZXIgOiBMb2dnZXI7XHJcblxyXG4gICAgX3JnYmFBcnJheSA6IFVpbnQ4QXJyYXk7XHJcbiAgICBkZXB0aHMgICAgIDogRmxvYXQzMkFycmF5O1xyXG4gICAgd2lkdGggICAgICA6IG51bWJlcjtcclxuICAgIGhlaWdodCAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgY2FtZXJhICAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xyXG4gICAgX25lYXJDbGlwUGxhbmUgICA6IG51bWJlcjtcclxuICAgIF9mYXJDbGlwUGxhbmUgICAgOiBudW1iZXI7XHJcbiAgICBfY2FtZXJhQ2xpcFJhbmdlIDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBfbWluaW11bU5vcm1hbGl6ZWQgOiBudW1iZXI7XHJcbiAgICBfbWF4aW11bU5vcm1hbGl6ZWQgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSByZ2JhQXJyYXkgUmF3IGFyYXkgb2YgUkdCQSBieXRlcyBwYWNrZWQgd2l0aCBmbG9hdHMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgbWFwLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgbWFwLlxyXG4gICAgICogQHBhcmFtIG5lYXJDbGlwUGxhbmUgQ2FtZXJhIG5lYXIgY2xpcHBpbmcgcGxhbmUuXHJcbiAgICAgKiBAcGFyYW0gZmFyQ2xpcFBsYW5lIENhbWVyYSBmYXIgY2xpcHBpbmcgcGxhbmUuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHJnYmFBcnJheSA6IFVpbnQ4QXJyYXksIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOm51bWJlciwgY2FtZXJhIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9yZ2JhQXJyYXkgPSByZ2JhQXJyYXk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBjYW1lcmE7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGFzcGVjdCByYXRpb24gb2YgdGhlIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGFzcGVjdFJhdGlvICgpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1pbmltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1pbmltdW1Ob3JtYWxpemVkICgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWluaW11bSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bSA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aCh0aGlzLl9tYXhpbXVtTm9ybWFsaXplZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtaW5pbXVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4aW11bU5vcm1hbGl6ZWQgKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhpbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXhpbXVtKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBtYXhpbXVtID0gdGhpcy5ub3JtYWxpemVkVG9Nb2RlbERlcHRoKHRoaXMubWluaW11bU5vcm1hbGl6ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF4aW11bTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggcmFuZ2Ugb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhbmdlTm9ybWFsaXplZCgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgZGVwdGhOb3JtYWxpemVkIDogbnVtYmVyID0gdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQgLSB0aGlzLl9taW5pbXVtTm9ybWFsaXplZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhbmdlKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBkZXB0aCA6IG51bWJlciA9IHRoaXMubWF4aW11bSAtIHRoaXMubWluaW11bTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGV4dGVudHMgb2YgdGhlIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqLyAgICAgICBcclxuICAgIGNhbGN1bGF0ZUV4dGVudHMgKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNldE1pbmltdW1Ob3JtYWxpemVkKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLnNldE1heGltdW1Ob3JtYWxpemVkKCk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemVcclxuICAgICAqLyAgICAgICBcclxuICAgIGluaXRpYWxpemUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmh0bWxMb2dnZXI7ICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLl9uZWFyQ2xpcFBsYW5lICAgPSB0aGlzLmNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuX2ZhckNsaXBQbGFuZSAgICA9IHRoaXMuY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFDbGlwUmFuZ2UgPSB0aGlzLl9mYXJDbGlwUGxhbmUgLSB0aGlzLl9uZWFyQ2xpcFBsYW5lO1xyXG5cclxuICAgICAgICAvLyBSR0JBIC0+IEZsb2F0MzJcclxuICAgICAgICB0aGlzLmRlcHRocyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fcmdiYUFycmF5LmJ1ZmZlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGV4dHJlbWEgb2YgZGVwdGggYnVmZmVyIHZhbHVlc1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlRXh0ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCBhIG5vcm1hbGl6ZWQgZGVwdGggWzAsMV0gdG8gZGVwdGggaW4gbW9kZWwgdW5pdHMuXHJcbiAgICAgKiBAcGFyYW0gbm9ybWFsaXplZERlcHRoIE5vcm1hbGl6ZWQgZGVwdGggWzAsMV0uXHJcbiAgICAgKi9cclxuICAgIG5vcm1hbGl6ZWRUb01vZGVsRGVwdGgobm9ybWFsaXplZERlcHRoIDogbnVtYmVyKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY2NTIyNTMvZ2V0dGluZy10aGUtdHJ1ZS16LXZhbHVlLWZyb20tdGhlLWRlcHRoLWJ1ZmZlclxyXG4gICAgICAgIG5vcm1hbGl6ZWREZXB0aCA9IDIuMCAqIG5vcm1hbGl6ZWREZXB0aCAtIDEuMDtcclxuICAgICAgICBsZXQgekxpbmVhciA9IDIuMCAqIHRoaXMuY2FtZXJhLm5lYXIgKiB0aGlzLmNhbWVyYS5mYXIgLyAodGhpcy5jYW1lcmEuZmFyICsgdGhpcy5jYW1lcmEubmVhciAtIG5vcm1hbGl6ZWREZXB0aCAqICh0aGlzLmNhbWVyYS5mYXIgLSB0aGlzLmNhbWVyYS5uZWFyKSk7XHJcblxyXG4gICAgICAgIC8vIHpMaW5lYXIgaXMgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNhbWVyYTsgcmV2ZXJzZSB0byB5aWVsZCBoZWlnaHQgZnJvbSBtZXNoIHBsYW5lXHJcbiAgICAgICAgekxpbmVhciA9IC0oekxpbmVhciAtIHRoaXMuY2FtZXJhLmZhcik7XHJcblxyXG4gICAgICAgIHJldHVybiB6TGluZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9ybWFsaXplZCBkZXB0aCB2YWx1ZSBhdCBhIHBpeGVsIGluZGV4XHJcbiAgICAgKiBAcGFyYW0gcm93IEJ1ZmZlciByb3cuXHJcbiAgICAgKiBAcGFyYW0gY29sdW1uIEJ1ZmZlciBjb2x1bW4uXHJcbiAgICAgKi9cclxuICAgIGRlcHRoTm9ybWFsaXplZCAocm93IDogbnVtYmVyLCBjb2x1bW4pIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGV4ID0gKE1hdGgucm91bmQocm93KSAqIHRoaXMud2lkdGgpICsgTWF0aC5yb3VuZChjb2x1bW4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoc1tpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGRlcHRoIHZhbHVlIGF0IGEgcGl4ZWwgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gcm93IE1hcCByb3cuXHJcbiAgICAgKiBAcGFyYW0gcGl4ZWxDb2x1bW4gTWFwIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgZGVwdGgocm93IDogbnVtYmVyLCBjb2x1bW4pIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGRlcHRoTm9ybWFsaXplZCA9IHRoaXMuZGVwdGhOb3JtYWxpemVkKHJvdywgY29sdW1uKTtcclxuICAgICAgICBsZXQgZGVwdGggPSB0aGlzLm5vcm1hbGl6ZWRUb01vZGVsRGVwdGgoZGVwdGhOb3JtYWxpemVkKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZGVwdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBtaW5pbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHNldE1pbmltdW1Ob3JtYWxpemVkKCkge1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bU5vcm1hbGl6ZWQgOiBudW1iZXIgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4OiBudW1iZXIgPSAwOyBpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aDsgaW5kZXgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGhWYWx1ZSA6IG51bWJlciA9IHRoaXMuZGVwdGhzW2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZXB0aFZhbHVlIDwgbWluaW11bU5vcm1hbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICBtaW5pbXVtTm9ybWFsaXplZCA9IGRlcHRoVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQgPSBtaW5pbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG1heGltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TWF4aW11bU5vcm1hbGl6ZWQoKSB7XHJcblxyXG4gICAgICAgIGxldCBtYXhpbXVtTm9ybWFsaXplZCA6IG51bWJlciA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgdGhpcy5kZXB0aHMubGVuZ3RoOyBpbmRleCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aFZhbHVlIDogbnVtYmVyID0gdGhpcy5kZXB0aHNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoZGVwdGhWYWx1ZSA+IG1heGltdW1Ob3JtYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgbWF4aW11bU5vcm1hbGl6ZWQgPSBkZXB0aFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21heGltdW1Ob3JtYWxpemVkID0gbWF4aW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4vKipcclxuICAgICAqIFJldHVybnMgdGhlIGxpbmVhciBpbmRleCBvZiBhIG1vZGVsIHBvaW50IGluIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHdvcmxkVmVydGV4IFZlcnRleCBvZiBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzICh3b3JsZFZlcnRleCA6IFRIUkVFLlZlY3RvcjMsIHBsYW5lQm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgXHJcbiAgICAgICAgbGV0IGJveFNpemUgICAgICA6IFRIUkVFLlZlY3RvcjMgPSBwbGFuZUJvdW5kaW5nQm94LmdldFNpemUoKTtcclxuICAgICAgICBsZXQgbWVzaEV4dGVudHMgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyIChib3hTaXplLngsIGJveFNpemUueSk7XHJcblxyXG4gICAgICAgIC8vICBtYXAgY29vcmRpbmF0ZXMgdG8gb2Zmc2V0cyBpbiByYW5nZSBbMCwgMV1cclxuICAgICAgICBsZXQgb2Zmc2V0WCA6IG51bWJlciA9ICh3b3JsZFZlcnRleC54ICsgKGJveFNpemUueCAvIDIpKSAvIGJveFNpemUueDtcclxuICAgICAgICBsZXQgb2Zmc2V0WSA6IG51bWJlciA9ICh3b3JsZFZlcnRleC55ICsgKGJveFNpemUueSAvIDIpKSAvIGJveFNpemUueTtcclxuXHJcbiAgICAgICAgbGV0IHJvdyAgICA6IG51bWJlciA9IG9mZnNldFkgKiAodGhpcy5oZWlnaHQgLSAxKTtcclxuICAgICAgICBsZXQgY29sdW1uIDogbnVtYmVyID0gb2Zmc2V0WCAqICh0aGlzLndpZHRoIC0gMSk7XHJcbiAgICAgICAgcm93ICAgID0gTWF0aC5yb3VuZChyb3cpO1xyXG4gICAgICAgIGNvbHVtbiA9IE1hdGgucm91bmQoY29sdW1uKTtcclxuXHJcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZSgocm93ID49IDApICYmIChyb3cgPCB0aGlzLmhlaWdodCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIHJvdyA9ICR7cm93fWApKTtcclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChjb2x1bW4+PSAwKSAmJiAoY29sdW1uIDwgdGhpcy53aWR0aCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIGNvbHVtbiA9ICR7Y29sdW1ufWApKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IyKHJvdywgY29sdW1uKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbGluZWFyIGluZGV4IG9mIGEgbW9kZWwgcG9pbnQgaW4gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gd29ybGRWZXJ0ZXggVmVydGV4IG9mIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXRNb2RlbFZlcnRleEluZGV4ICh3b3JsZFZlcnRleCA6IFRIUkVFLlZlY3RvcjMsIHBsYW5lQm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2VzIDogVEhSRUUuVmVjdG9yMiA9IHRoaXMuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHdvcmxkVmVydGV4LCBwbGFuZUJvdW5kaW5nQm94KTsgICAgXHJcbiAgICAgICAgbGV0IHJvdyAgICA6IG51bWJlciA9IGluZGljZXMueDtcclxuICAgICAgICBsZXQgY29sdW1uIDogbnVtYmVyID0gaW5kaWNlcy55O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbmRleCA9IChyb3cgKiB0aGlzLndpZHRoKSArIGNvbHVtbjtcclxuICAgICAgICBpbmRleCA9IE1hdGgucm91bmQoaW5kZXgpO1xyXG5cclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChpbmRleCA+PSAwKSAmJiAoaW5kZXggPCB0aGlzLmRlcHRocy5sZW5ndGgpLCAoYFZlcnRleCAoJHt3b3JsZFZlcnRleC54fSwgJHt3b3JsZFZlcnRleC55fSwgJHt3b3JsZFZlcnRleC56fSkgeWllbGRlZCBpbmRleCA9ICR7aW5kZXh9YCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIENvbnN0cnVjdHMgYSBwYWlyIG9mIHRyaWFuZ3VsYXIgZmFjZXMgYXQgdGhlIGdpdmVuIG9mZnNldCBpbiB0aGUgRGVwdGhCdWZmZXIuXHJcbiAgICAgICogQHBhcmFtIHJvdyBSb3cgb2Zmc2V0IChMb3dlciBMZWZ0KS5cclxuICAgICAgKiBAcGFyYW0gY29sdW1uIENvbHVtbiBvZmZzZXQgKExvd2VyIExlZnQpLlxyXG4gICAgICAqIEBwYXJhbSBmYWNlU2l6ZSBTaXplIG9mIGEgZmFjZSBlZGdlIChub3QgaHlwb3RlbnVzZSkuXHJcbiAgICAgICogQHBhcmFtIGJhc2VWZXJ0ZXhJbmRleCBCZWdpbm5pbmcgb2Zmc2V0IGluIG1lc2ggZ2VvbWV0cnkgdmVydGV4IGFycmF5LlxyXG4gICAgICAqL1xyXG4gICAgIGNvbnN0cnVjdFRyaUZhY2VzQXRPZmZzZXQgKHJvdyA6IG51bWJlciwgY29sdW1uIDogbnVtYmVyLCBtZXNoTG93ZXJMZWZ0IDogVEhSRUUuVmVjdG9yMiwgZmFjZVNpemUgOiBudW1iZXIsIGJhc2VWZXJ0ZXhJbmRleCA6IG51bWJlcikgOiBGYWNlUGFpciB7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICBsZXQgZmFjZVBhaXIgOiBGYWNlUGFpciA9IHtcclxuICAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgICBmYWNlcyAgICA6IFtdXHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIC8vICBWZXJ0aWNlc1xyXG4gICAgICAgICAvLyAgIDIgICAgMyAgICAgICBcclxuICAgICAgICAgLy8gICAwICAgIDFcclxuICAgICBcclxuICAgICAgICAgLy8gY29tcGxldGUgbWVzaCBjZW50ZXIgd2lsbCBiZSBhdCB0aGUgd29ybGQgb3JpZ2luXHJcbiAgICAgICAgIGxldCBvcmlnaW5YIDogbnVtYmVyID0gbWVzaExvd2VyTGVmdC54ICsgKGNvbHVtbiAqIGZhY2VTaXplKTtcclxuICAgICAgICAgbGV0IG9yaWdpblkgOiBudW1iZXIgPSBtZXNoTG93ZXJMZWZ0LnkgKyAocm93ICAgICogZmFjZVNpemUpO1xyXG4gXHJcbiAgICAgICAgIGxldCBsb3dlckxlZnQgICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyAwLCAgICAgICAgIG9yaWdpblkgKyAwLCAgICAgICAgdGhpcy5kZXB0aChyb3cgKyAwLCBjb2x1bW4rIDApKTsgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMFxyXG4gICAgICAgICBsZXQgbG93ZXJSaWdodCAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgZmFjZVNpemUsICBvcmlnaW5ZICsgMCwgICAgICAgIHRoaXMuZGVwdGgocm93ICsgMCwgY29sdW1uICsgMSkpOyAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDFcclxuICAgICAgICAgbGV0IHVwcGVyTGVmdCAgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIDAsICAgICAgICAgb3JpZ2luWSArIGZhY2VTaXplLCB0aGlzLmRlcHRoKHJvdyArIDEsIGNvbHVtbiArIDApKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAyXHJcbiAgICAgICAgIGxldCB1cHBlclJpZ2h0ICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyBmYWNlU2l6ZSwgIG9yaWdpblkgKyBmYWNlU2l6ZSwgdGhpcy5kZXB0aChyb3cgKyAxLCBjb2x1bW4gKyAxKSk7ICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgM1xyXG4gXHJcbiAgICAgICAgIGZhY2VQYWlyLnZlcnRpY2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgbG93ZXJMZWZ0LCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAwXHJcbiAgICAgICAgICAgICAgbG93ZXJSaWdodCwgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAxXHJcbiAgICAgICAgICAgICAgdXBwZXJMZWZ0LCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAyXHJcbiAgICAgICAgICAgICAgdXBwZXJSaWdodCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAzXHJcbiAgICAgICAgICApO1xyXG4gXHJcbiAgICAgICAgICAvLyByaWdodCBoYW5kIHJ1bGUgZm9yIHBvbHlnb24gd2luZGluZ1xyXG4gICAgICAgICAgZmFjZVBhaXIuZmFjZXMucHVzaChcclxuICAgICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoYmFzZVZlcnRleEluZGV4ICsgMCwgYmFzZVZlcnRleEluZGV4ICsgMSwgYmFzZVZlcnRleEluZGV4ICsgMyksXHJcbiAgICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKGJhc2VWZXJ0ZXhJbmRleCArIDAsIGJhc2VWZXJ0ZXhJbmRleCArIDMsIGJhc2VWZXJ0ZXhJbmRleCArIDIpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgIHJldHVybiBmYWNlUGFpcjtcclxuICAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbWVzaCBvZiB0aGUgZ2l2ZW4gYmFzZSBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0gbWVzaFhZRXh0ZW50cyBCYXNlIGRpbWVuc2lvbnMgKG1vZGVsIHVuaXRzKS4gSGVpZ2h0IGlzIGNvbnRyb2xsZWQgYnkgREIgYXNwZWN0IHJhdGlvLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE1hdGVyaWFsIHRvIGFzc2lnbiB0byBtZXNoLlxyXG4gICAgICovXHJcbiAgICBtZXNoKG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWUoXCJtZXNoXCIpO1xyXG4gICAgICAgIGxldCBtZXNoWFlFeHRlbnRzIDogVEhSRUUuVmVjdG9yMiA9IENhbWVyYS5nZXROZWFyUGxhbmVFeHRlbnRzKHRoaXMuY2FtZXJhKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIW1hdGVyaWFsKVxyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbChEZXB0aEJ1ZmZlci5EZWZhdWx0TWVzaFBob25nTWF0ZXJpYWxQYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmYWNlU2l6ZSAgICAgICAgOiBudW1iZXIgPSBtZXNoWFlFeHRlbnRzLnggLyAodGhpcy53aWR0aCAtIDEpO1xyXG4gICAgICAgIGxldCBiYXNlVmVydGV4SW5kZXggOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBsZXQgbWVzaExvd2VyTGVmdCA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigtKG1lc2hYWUV4dGVudHMueCAvIDIpLCAtKG1lc2hYWUV4dGVudHMueSAvIDIpIClcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaVJvdyA9IDA7IGlSb3cgPCAodGhpcy5oZWlnaHQgLSAxKTsgaVJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlDb2x1bW4gPSAwOyBpQ29sdW1uIDwgKHRoaXMud2lkdGggLSAxKTsgaUNvbHVtbisrKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBmYWNlUGFpciA9IHRoaXMuY29uc3RydWN0VHJpRmFjZXNBdE9mZnNldChpUm93LCBpQ29sdW1uLCBtZXNoTG93ZXJMZWZ0LCBmYWNlU2l6ZSwgYmFzZVZlcnRleEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkudmVydGljZXMucHVzaCguLi5mYWNlUGFpci52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkuZmFjZXMucHVzaCguLi5mYWNlUGFpci5mYWNlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmFzZVZlcnRleEluZGV4ICs9IDQ7XHJcbiAgICAgICAgICAgIH0gICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IG1lc2ggID0gbmV3IFRIUkVFLk1lc2gobWVzaEdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgbWVzaC5uYW1lID0gRGVwdGhCdWZmZXIuTWVzaE1vZGVsTmFtZTtcclxuXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKFwibWVzaFwiKTsgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmFseXplcyBwcm9wZXJ0aWVzIG9mIGEgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplICgpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuY2xlYXJMb2coKTtcclxuXHJcbiAgICAgICAgbGV0IG1pZGRsZSA9IHRoaXMud2lkdGggLyAyO1xyXG4gICAgICAgIGxldCBkZWNpbWFsUGxhY2VzID0gNTtcclxuICAgICAgICBsZXQgaGVhZGVyU3R5bGUgICA9IFwiZm9udC1mYW1pbHkgOiBtb25vc3BhY2U7IGZvbnQtd2VpZ2h0IDogYm9sZDsgY29sb3IgOiBibHVlOyBmb250LXNpemUgOiAxOHB4XCI7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2VTdHlsZSAgPSBcImZvbnQtZmFtaWx5IDogbW9ub3NwYWNlOyBjb2xvciA6IGJsYWNrOyBmb250LXNpemUgOiAxNHB4XCI7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKCdDYW1lcmEgUHJvcGVydGllcycsIGhlYWRlclN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTmVhciBQbGFuZSA9ICR7dGhpcy5jYW1lcmEubmVhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBGYXIgUGxhbmUgID0gJHt0aGlzLmNhbWVyYS5mYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgQ2xpcCBSYW5nZSA9ICR7dGhpcy5jYW1lcmEuZmFyIC0gdGhpcy5jYW1lcmEubmVhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFbXB0eUxpbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoJ05vcm1hbGl6ZWQnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENlbnRlciBEZXB0aCA9ICR7dGhpcy5kZXB0aE5vcm1hbGl6ZWQobWlkZGxlLCBtaWRkbGUpLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgWiBSYW5nZSA9ICR7dGhpcy5yYW5nZU5vcm1hbGl6ZWQudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBNaW5pbXVtID0gJHt0aGlzLm1pbmltdW1Ob3JtYWxpemVkLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWF4aW11bSA9ICR7dGhpcy5tYXhpbXVtTm9ybWFsaXplZC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVtcHR5TGluZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZSgnTW9kZWwgVW5pdHMnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENlbnRlciBEZXB0aCA9ICR7dGhpcy5kZXB0aChtaWRkbGUsIG1pZGRsZSkudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBaIFJhbmdlID0gJHt0aGlzLnJhbmdlLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWluaW11bSA9ICR7dGhpcy5taW5pbXVtLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWF4aW11bSA9ICR7dGhpcy5tYXhpbXVtLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgIH1cclxufSIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIFRvb2wgTGlicmFyeVxyXG4gKiBHZW5lcmFsIHV0aWxpdHkgcm91dGluZXNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVG9vbHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gVXRpbGl0eVxyXG4gICAgLy8vIDxzdW1tYXJ5PiAgICAgICAgXHJcbiAgICAvLyBHZW5lcmF0ZSBhIHBzZXVkbyBHVUlELlxyXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgc3RhdGljIGdlbmVyYXRlUHNldWRvR1VJRCgpIHtcclxuICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuICAgICBcclxuICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuLypcclxuICBSZXF1aXJlbWVudHNcclxuICAgIE5vIHBlcnNpc3RlbnQgRE9NIGVsZW1lbnQuIFRoZSBjYW52YXMgaXMgY3JlYXRlZCBkeW5hbWljYWxseS5cclxuICAgICAgICBPcHRpb24gZm9yIHBlcnNpc3RpbmcgdGhlIEZhY3RvcnkgaW4gdGhlIGNvbnN0cnVjdG9yXHJcbiAgICBKU09OIGNvbXBhdGlibGUgY29uc3RydWN0b3IgcGFyYW1ldGVyc1xyXG4gICAgRml4ZWQgcmVzb2x1dGlvbjsgcmVzaXppbmcgc3VwcG9ydCBpcyBub3QgcmVxdWlyZWQuXHJcbiovXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYX0gICAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlcn0gICAgICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtNb2RlbFJlbGllZn0gICAgICAgICAgICBmcm9tICdNb2RlbFJlbGllZidcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUb29sc30gICAgICAgICAgICAgICAgICBmcm9tICdUb29scydcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycyB7XHJcblxyXG4gICAgd2lkdGggICAgICAgICAgICA6IG51bWJlciwgICAgICAgICAgICAgICAgICAvLyB3aWR0aCBvZiBEQlxyXG4gICAgaGVpZ2h0ICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICAvLyBoZWlnaHQgb2YgREIgICAgICAgIFxyXG4gICAgbW9kZWwgICAgICAgICAgICA6IFRIUkVFLkdyb3VwLCAgICAgICAgICAgICAvLyBtb2RlbCByb290XHJcblxyXG4gICAgY2FtZXJhPyAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCAvLyBjYW1lcmFcclxuICAgIFxyXG4gICAgbG9nRGVwdGhCdWZmZXI/ICA6IGJvb2xlYW4sICAgICAgICAgICAgICAgICAvLyB1c2UgbG9nYXJpdGhtaWMgZGVwdGggYnVmZmVyIGZvciBoaWdoZXIgcmVzb2x1dGlvbiAoYmV0dGVyIGRpc3RyaWJ1dGlvbikgaW4gc2NlbmVzIHdpdGggbGFyZ2UgZXh0ZW50c1xyXG4gICAgYm91bmRlZENsaXBwaW5nPyA6IGJvb2xlYW4sICAgICAgICAgICAgICAgICAvLyBvdmVycnJpZCBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzIHRvIGJvdW5kIG1vZGVsXHJcbiAgICBcclxuICAgIGFkZENhbnZhc1RvRE9NPyAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVzaEdlbmVyYXRlUGFyYW1ldGVycyB7XHJcblxyXG4gICAgY2FtZXJhPyAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xyXG4gICAgbWF0ZXJpYWw/ICAgICAgICA6IFRIUkVFLk1hdGVyaWFsO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlckZhY3RvcnlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlckZhY3Rvcnkge1xyXG5cclxuICAgIHN0YXRpYyBEZWZhdWx0UmVzb2x1dGlvbiA6IG51bWJlciAgICAgICAgICAgPSAxMDI0OyAgICAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgREIgcmVzb2x1dGlvblxyXG4gICAgc3RhdGljIE5lYXJQbGFuZUVwc2lsb25lIDogbnVtYmVyICAgICAgICAgICA9IC4wMDE7ICAgICAgICAgICAgICAgICAgICAgLy8gYWRqdXN0bWVudCB0byBhdm9pZCBjbGlwcGluZyBnZW9tZXRyeSBvbiB0aGUgbmVhciBwbGFuZVxyXG4gICAgXHJcbiAgICBzdGF0aWMgQ3NzQ2xhc3NOYW1lICAgICAgOiBzdHJpbmcgICAgICAgICAgID0gJ0RlcHRoQnVmZmVyRmFjdG9yeSc7ICAgICAvLyBDU1MgY2xhc3NcclxuICAgIHN0YXRpYyBSb290Q29udGFpbmVySWQgICA6IHN0cmluZyAgICAgICAgICAgPSAncm9vdENvbnRhaW5lcic7ICAgICAgICAgIC8vIHJvb3QgY29udGFpbmVyIGZvciB2aWV3ZXJzXHJcbiAgICBcclxuICAgIF9zY2VuZSAgICAgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gdGFyZ2V0IHNjZW5lXHJcbiAgICBfbW9kZWwgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHRhcmdldCBtb2RlbFxyXG5cclxuICAgIF9yZW5kZXJlciAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlcmVyICAgICAgPSBudWxsOyAgICAgLy8gc2NlbmUgcmVuZGVyZXJcclxuICAgIF9jYW52YXMgICAgICAgICAgOiBIVE1MQ2FudmFzRWxlbWVudCAgICAgICAgPSBudWxsOyAgICAgLy8gRE9NIGNhbnZhcyBzdXBwb3J0aW5nIHJlbmRlcmVyXHJcbiAgICBfd2lkdGggICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgID0gRGVwdGhCdWZmZXJGYWN0b3J5LkRlZmF1bHRSZXNvbHV0aW9uOyAgICAgLy8gd2lkdGggcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuICAgIF9oZWlnaHQgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgPSBEZXB0aEJ1ZmZlckZhY3RvcnkuRGVmYXVsdFJlc29sdXRpb247ICAgICAvLyBoZWlnaHQgcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuXHJcbiAgICBfY2FtZXJhICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgID0gbnVsbDsgICAgIC8vIHBlcnNwZWN0aXZlIGNhbWVyYSB0byBnZW5lcmF0ZSB0aGUgZGVwdGggYnVmZmVyXHJcblxyXG5cclxuICAgIF9sb2dEZXB0aEJ1ZmZlciAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdXNlIGEgbG9nYXJpdGhtaWMgYnVmZmVyIGZvciBtb3JlIGFjY3VyYWN5IGluIGxhcmdlIHNjZW5lc1xyXG4gICAgX2JvdW5kZWRDbGlwcGluZyA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICA9IHRydWU7ICAgICAvLyBvdmVycmlkZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzOyBzZXQgbmVhciBhbmQgZmFyIHRvIGJvdW5kIG1vZGVsIGZvciBpbXByb3ZlZCBhY2N1cmFjeVxyXG5cclxuICAgIF9kZXB0aEJ1ZmZlciAgICAgOiBEZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gZGVwdGggYnVmZmVyIFxyXG4gICAgX3RhcmdldCAgICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBjcmVhdGluZyB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHdoZW4gcmVuZGVyaW5nIHRoZSBzY2VuZVxyXG4gICAgX2VuY29kZWRUYXJnZXQgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBlbmNvZGluIHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgaW50byBhIGZsb2F0aW5nIHBvaW50IChSR0JBIGZvcm1hdClcclxuXHJcbiAgICBfcG9zdFNjZW5lICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHNpbmdsZSBwb2x5Z29uIHNjZW5lIHVzZSB0byBnZW5lcmF0ZSB0aGUgZW5jb2RlZCBSR0JBIGJ1ZmZlclxyXG4gICAgX3Bvc3RDYW1lcmEgICAgICA6IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSA9IG51bGw7ICAgICAvLyBvcnRob2dyYXBoaWMgY2FtZXJhXHJcbiAgICBfcG9zdE1hdGVyaWFsICAgIDogVEhSRUUuU2hhZGVyTWF0ZXJpYWwgICAgID0gbnVsbDsgICAgIC8vIHNoYWRlciBtYXRlcmlhbCB0aGF0IGVuY29kZXMgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciBpbnRvIGEgZmxvYXRpbmcgcG9pbnQgUkdCQSBmb3JtYXRcclxuXHJcbiAgICBfbWluaW11bVdlYkdMICAgIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gdHJ1ZTsgICAgIC8vIHRydWUgaWYgbWluaW11bSBXZUdMIHJlcXVpcmVtZW50cyBhcmUgcHJlc2VudFxyXG4gICAgX2xvZ2dlciAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBsb2dnZXJcclxuICAgIF9hZGRDYW52YXNUb0RPTSAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MIHBhZ2VcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgSW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyAoRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVycyA6IERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgLy8gcmVxdWlyZWRcclxuICAgICAgICB0aGlzLl93aWR0aCAgICAgICAgICAgPSBwYXJhbWV0ZXJzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAgICAgICAgICA9IHBhcmFtZXRlcnMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX21vZGVsICAgICAgICAgICA9IHBhcmFtZXRlcnMubW9kZWwuY2xvbmUodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhICAgICAgICAgID0gcGFyYW1ldGVycy5jYW1lcmEgICAgICAgICAgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLl9sb2dEZXB0aEJ1ZmZlciAgPSBwYXJhbWV0ZXJzLmxvZ0RlcHRoQnVmZmVyICB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ib3VuZGVkQ2xpcHBpbmcgPSBwYXJhbWV0ZXJzLmJvdW5kZWRDbGlwcGluZyB8fCB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2FkZENhbnZhc1RvRE9NICA9IHBhcmFtZXRlcnMuYWRkQ2FudmFzVG9ET00gIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSB0aGlzLmluaXRpYWxpemVDYW52YXMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVmVyaWZpZXMgdGhlIG1pbmltdW0gV2ViR0wgZXh0ZW5zaW9ucyBhcmUgcHJlc2VudC5cclxuICAgICAqIEBwYXJhbSByZW5kZXJlciBXZWJHTCByZW5kZXJlci5cclxuICAgICAqL1xyXG4gICAgdmVyaWZ5V2ViR0xFeHRlbnNpb25zKCkgOiBib29sZWFuIHsgXHJcbiAgICBcclxuICAgICAgICBpZiAoIXRoaXMuX3JlbmRlcmVyLmV4dGVuc2lvbnMuZ2V0KCdXRUJHTF9kZXB0aF90ZXh0dXJlJykpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWluaW11bVdlYkdMID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoJ1RoZSBtaW5pbXVtIFdlYkdMIGV4dGVuc2lvbnMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXIuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlIGEgbW91c2UgZG93biBldmVudCBvbiB0aGUgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBvbk1vdXNlRG93bihldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0KSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgZGV2aWNlQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gR3JhcGhpY3MuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCwgJChldmVudC50YXJnZXQpKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYGRldmljZSA9ICR7ZGV2aWNlQ29vcmRpbmF0ZXMueH0sICR7ZGV2aWNlQ29vcmRpbmF0ZXMueX1gKTtcclxuXHJcbiAgICAgICAgbGV0IGRlY2ltYWxQbGFjZXMgICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHJvdyAgICAgICAgICAgICA6IG51bWJlciA9IChkZXZpY2VDb29yZGluYXRlcy55ICsgMSkgLyAyICogdGhpcy5fZGVwdGhCdWZmZXIuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBjb2x1bW4gICAgICAgICAgOiBudW1iZXIgPSAoZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMiAqIHRoaXMuX2RlcHRoQnVmZmVyLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgT2Zmc2V0ID0gWyR7cm93fSwgJHtjb2x1bW59XWApOyAgICAgICBcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYERlcHRoID0gJHt0aGlzLl9kZXB0aEJ1ZmZlci5kZXB0aChyb3csIGNvbHVtbikudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gKTsgICAgICAgXHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSBXZWJHTCB0YXJnZXQgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FudmFzKCkgOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICBcclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMuc2V0QXR0cmlidXRlKCduYW1lJywgVG9vbHMuZ2VuZXJhdGVQc2V1ZG9HVUlEKCkpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgRGVwdGhCdWZmZXJGYWN0b3J5LkNzc0NsYXNzTmFtZSk7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciBkaW1lbnNpb25zICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbnZhcy53aWR0aCAgPSB0aGlzLl93aWR0aDtcclxuICAgICAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0OyBcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt0aGlzLl93aWR0aH1weGA7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuX2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIC8vIGFkZCB0byBET00/XHJcbiAgICAgICAgaWYgKHRoaXMuX2FkZENhbnZhc1RvRE9NKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtEZXB0aEJ1ZmZlckZhY3RvcnkuUm9vdENvbnRhaW5lcklkfWApLmFwcGVuZENoaWxkKHRoaXMuX2NhbnZhcyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgJGNhbnZhcyA9ICQodGhpcy5fY2FudmFzKS5vbignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uIG9mIHRoZSByZW5kZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTY2VuZSAoKSA6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLl9zY2VuZS5hZGQodGhpcy5fbW9kZWwpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZyh0aGlzLl9zY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSAgbW9kZWwgdmlldy5cclxuICAgICAqL1xyXG4gICAgIGluaXRpYWxpemVSZW5kZXJlcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigge2NhbnZhcyA6IHRoaXMuX2NhbnZhcywgbG9nYXJpdGhtaWNEZXB0aEJ1ZmZlciA6IHRoaXMuX2xvZ0RlcHRoQnVmZmVyfSk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gTW9kZWwgU2NlbmUgLT4gKFJlbmRlciBUZXh0dXJlLCBEZXB0aCBUZXh0dXJlKVxyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRoaXMuY29uc3RydWN0RGVwdGhUZXh0dXJlUmVuZGVyVGFyZ2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEVuY29kZWQgUkdCQSBUZXh0dXJlIGZyb20gRGVwdGggVGV4dHVyZVxyXG4gICAgICAgIHRoaXMuX2VuY29kZWRUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcblxyXG4gICAgICAgIHRoaXMudmVyaWZ5V2ViR0xFeHRlbnNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGRlZmF1bHQgbGlnaHRpbmcgaW4gdGhlIHNjZW5lLlxyXG4gICAgICogTGlnaHRpbmcgZG9lcyBub3QgYWZmZWN0IHRoZSBkZXB0aCBidWZmZXIuIEl0IGlzIG9ubHkgdXNlZCBpZiB0aGUgY2FudmFzIGlzIG1hZGUgdmlzaWJsZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nIChzY2VuZSA6IFRIUkVFLlNjZW5lKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC4yKTtcclxuICAgICAgICBzY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCgxLCAxLCAxKTtcclxuICAgICAgICBzY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQcmltYXJ5ICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUHJpbWFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3QoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gUG9zdFByb2Nlc3NpbmdcclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIHJlbmRlciB0YXJnZXQgPHdpdGggYSBkZXB0aCB0ZXh0dXJlIGJ1ZmZlcj4uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdERlcHRoVGV4dHVyZVJlbmRlclRhcmdldCgpIDogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQge1xyXG5cclxuICAgICAgICAvLyBNb2RlbCBTY2VuZSAtPiAoUmVuZGVyIFRleHR1cmUsIERlcHRoIFRleHR1cmUpXHJcbiAgICAgICAgbGV0IHJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUuZm9ybWF0ICAgICAgICAgICA9IFRIUkVFLlJHQkFGb3JtYXQ7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUudHlwZSAgICAgICAgICAgICA9IFRIUkVFLlVuc2lnbmVkQnl0ZVR5cGU7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUubWluRmlsdGVyICAgICAgICA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUubWFnRmlsdGVyICAgICAgICA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzICA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZW5kZXJUYXJnZXQuc3RlbmNpbEJ1ZmZlciAgICAgICAgICAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSB0cnVlO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aFRleHR1cmUgICAgICAgICAgICAgPSBuZXcgVEhSRUUuRGVwdGhUZXh0dXJlKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aFRleHR1cmUudHlwZSAgICAgICAgPSBUSFJFRS5VbnNpZ25lZEludFR5cGU7XHJcbiAgICBcclxuICAgICAgICByZXR1cm4gcmVuZGVyVGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHBvc3Qgc2NlbmUgdXNlZCB0byBjcmVhdGUgdGhlIGZpbmFsIFJHQkEgZW5jb2RlZCBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0U2NlbmUgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHBvc3RNZXNoTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2ZXJ0ZXhTaGFkZXI6ICAgTVIuc2hhZGVyU291cmNlWydEZXB0aEJ1ZmZlclZlcnRleFNoYWRlciddLFxyXG4gICAgICAgICAgICBmcmFnbWVudFNoYWRlcjogTVIuc2hhZGVyU291cmNlWydEZXB0aEJ1ZmZlckZyYWdtZW50U2hhZGVyJ10sXHJcblxyXG4gICAgICAgICAgICB1bmlmb3Jtczoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhTmVhciAgOiAgIHsgdmFsdWU6IHRoaXMuX2NhbWVyYS5uZWFyIH0sXHJcbiAgICAgICAgICAgICAgICBjYW1lcmFGYXIgICA6ICAgeyB2YWx1ZTogdGhpcy5fY2FtZXJhLmZhciB9LFxyXG4gICAgICAgICAgICAgICAgdERpZmZ1c2UgICAgOiAgIHsgdmFsdWU6IHRoaXMuX3RhcmdldC50ZXh0dXJlIH0sXHJcbiAgICAgICAgICAgICAgICB0RGVwdGggICAgICA6ICAgeyB2YWx1ZTogdGhpcy5fdGFyZ2V0LmRlcHRoVGV4dHVyZSB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgcG9zdE1lc2hQbGFuZSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDIsIDIpO1xyXG4gICAgICAgIGxldCBwb3N0TWVzaFF1YWQgID0gbmV3IFRIUkVFLk1lc2gocG9zdE1lc2hQbGFuZSwgcG9zdE1lc2hNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3RTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuX3Bvc3RTY2VuZS5hZGQocG9zdE1lc2hRdWFkKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdENhbWVyYSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpZ2h0aW5nKHRoaXMuX3Bvc3RTY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIHRoZSBvcnRob2dyYXBoaWMgY2FtZXJhIHVzZWQgdG8gY29udmVydCB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHRvIHRoZSBlbmNvZGVkIFJHQkEgYnVmZmVyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0Q2FtZXJhKCkge1xyXG5cclxuICAgICAgICAvLyBTZXR1cCBwb3N0IHByb2Nlc3Npbmcgc3RhZ2VcclxuICAgICAgICBsZXQgbGVmdDogbnVtYmVyICAgICAgPSAgLTE7XHJcbiAgICAgICAgbGV0IHJpZ2h0OiBudW1iZXIgICAgID0gICAxO1xyXG4gICAgICAgIGxldCB0b3A6IG51bWJlciAgICAgICA9ICAgMTtcclxuICAgICAgICBsZXQgYm90dG9tOiBudW1iZXIgICAgPSAgLTE7XHJcbiAgICAgICAgbGV0IG5lYXI6IG51bWJlciAgICAgID0gICAwO1xyXG4gICAgICAgIGxldCBmYXI6IG51bWJlciAgICAgICA9ICAgMTtcclxuXHJcbiAgICAgICAgdGhpcy5fcG9zdENhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0ICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RDYW1lcmEoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gR2VuZXJhdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBWZXJpZmllcyB0aGUgcHJlLXJlcXVpc2l0ZSBzZXR0aW5ncyBhcmUgZGVmaW5lZCB0byBjcmVhdGUgYSBtZXNoLlxyXG4gICAgICovXHJcbiAgICB2ZXJpZnlNZXNoU2V0dGluZ3MoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGxldCBtaW5pbXVtU2V0dGluZ3MgOiBib29sZWFuID0gdHJ1ZVxyXG4gICAgICAgIGxldCBlcnJvclByZWZpeCAgICAgOiBzdHJpbmcgPSAnRGVwdGhCdWZmZXJGYWN0b3J5OiAnO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYCR7ZXJyb3JQcmVmaXh9VGhlIG1vZGVsIGlzIG5vdCBkZWZpbmVkLmApO1xyXG4gICAgICAgICAgICBtaW5pbXVtU2V0dGluZ3MgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYCR7ZXJyb3JQcmVmaXh9VGhlIGNhbWVyYSBpcyBub3QgZGVmaW5lZC5gKTtcclxuICAgICAgICAgICAgbWluaW11bVNldHRpbmdzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWluaW11bVNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhbiBSR0JBIHN0cmluZyB3aXRoIHRoZSBieXRlIHZhbHVlcyBvZiBhIHBpeGVsLlxyXG4gICAgICogQHBhcmFtIGJ1ZmZlciBVbnNpZ25lZCBieXRlIHJhdyBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0gcm93IFBpeGVsIHJvdy5cclxuICAgICAqIEBwYXJhbSBjb2x1bW4gQ29sdW1uIHJvdy5cclxuICAgICAqL1xyXG4gICAgIHVuc2lnbmVkQnl0ZXNUb1JHQkEgKGJ1ZmZlciA6IFVpbnQ4QXJyYXksIHJvdyA6IG51bWJlciwgY29sdW1uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IChyb3cgKiB0aGlzLl93aWR0aCkgKyBjb2x1bW47XHJcbiAgICAgICAgbGV0IHJWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAwXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGdWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAxXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGJWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAyXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGFWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAzXS50b1N0cmluZygxNik7XHJcblxyXG4gICAgICAgIHJldHVybiBgIyR7clZhbHVlfSR7Z1ZhbHVlfSR7YlZhbHVlfSAke2FWYWx1ZX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZXMgYSBwaXhlbCBmcm9tIGEgcmVuZGVyIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZVJlbmRlckJ1ZmZlciAoKSB7XHJcblxyXG4gICAgICAgIGxldCByZW5kZXJCdWZmZXIgPSAgbmV3IFVpbnQ4QXJyYXkodGhpcy5fd2lkdGggKiB0aGlzLl9oZWlnaHQgKiA0KS5maWxsKDApO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlYWRSZW5kZXJUYXJnZXRQaXhlbHModGhpcy5fdGFyZ2V0LCAwLCAwLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCByZW5kZXJCdWZmZXIpO1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZVN0cmluZyA9IGBSR0JBWzAsIDBdID0gJHt0aGlzLnVuc2lnbmVkQnl0ZXNUb1JHQkEocmVuZGVyQnVmZmVyLCAwLCAwKX1gO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKG1lc3NhZ2VTdHJpbmcsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZSB0aGUgcmVuZGVyIGFuZCBkZXB0aCB0YXJnZXRzLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplVGFyZ2V0cyAoKSAge1xyXG5cclxuLy8gICAgICB0aGlzLmFuYWx5emVSZW5kZXJCdWZmZXIoKTtcclxuLy8gICAgICB0aGlzLl9kZXB0aEJ1ZmZlci5hbmFseXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZURlcHRoQnVmZmVyKCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWUoXCJjcmVhdGVEZXB0aEJ1ZmZlclwiKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fc2NlbmUsIHRoaXMuX2NhbWVyYSwgdGhpcy5fdGFyZ2V0KTsgICAgXHJcbiAgICBcclxuICAgICAgICAvLyAob3B0aW9uYWwpIHByZXZpZXcgZW5jb2RlZCBSR0JBIHRleHR1cmU7IGRyYXduIGJ5IHNoYWRlciBidXQgbm90IHBlcnNpc3RlZFxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9wb3N0U2NlbmUsIHRoaXMuX3Bvc3RDYW1lcmEpOyAgICBcclxuXHJcbiAgICAgICAgLy8gUGVyc2lzdCBlbmNvZGVkIFJHQkEgdGV4dHVyZTsgY2FsY3VsYXRlZCBmcm9tIGRlcHRoIGJ1ZmZlclxyXG4gICAgICAgIC8vIGVuY29kZWRUYXJnZXQudGV4dHVyZSAgICAgIDogZW5jb2RlZCBSR0JBIHRleHR1cmVcclxuICAgICAgICAvLyBlbmNvZGVkVGFyZ2V0LmRlcHRoVGV4dHVyZSA6IG51bGxcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fcG9zdFNjZW5lLCB0aGlzLl9wb3N0Q2FtZXJhLCB0aGlzLl9lbmNvZGVkVGFyZ2V0KTsgXHJcblxyXG4gICAgICAgIC8vIGRlY29kZSBSR0JBIHRleHR1cmUgaW50byBkZXB0aCBmbG9hdHNcclxuICAgICAgICBsZXQgZGVwdGhCdWZmZXJSR0JBID0gIG5ldyBVaW50OEFycmF5KHRoaXMuX3dpZHRoICogdGhpcy5faGVpZ2h0ICogNCkuZmlsbCgwKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZWFkUmVuZGVyVGFyZ2V0UGl4ZWxzKHRoaXMuX2VuY29kZWRUYXJnZXQsIDAsIDAsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIGRlcHRoQnVmZmVyUkdCQSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlcHRoQnVmZmVyID0gbmV3IERlcHRoQnVmZmVyKGRlcHRoQnVmZmVyUkdCQSwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgdGhpcy5fY2FtZXJhKTsgICAgXHJcblxyXG4gICAgICAgIHRoaXMuYW5hbHl6ZVRhcmdldHMoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKFwiY3JlYXRlRGVwdGhCdWZmZXJcIik7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNhbWVyYSBjbGlwcGluZyBwbGFuZXMgZm9yIG1lc2ggZ2VuZXJhdGlvbi5cclxuICAgICAqL1xyXG4gICAgc2V0Q2FtZXJhQ2xpcHBpbmdQbGFuZXMgKCkge1xyXG5cclxuICAgICAgICAvLyBjb3B5IGNhbWVyYTsgc2hhcmVkIHdpdGggTW9kZWxWaWV3ZXJcclxuICAgICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XHJcbiAgICAgICAgY2FtZXJhLmNvcHkgKHRoaXMuX2NhbWVyYSk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xyXG5cclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX2NhbWVyYS5tYXRyaXhXb3JsZEludmVyc2U7XHJcblxyXG4gICAgICAgIC8vIGNsb25lIG1vZGVsIChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBtb2RlbFZpZXcgICAgICAgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QodGhpcy5fbW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldyA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChtb2RlbFZpZXcpO1xyXG5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgYm94IGlzIHdvcmxkLWF4aXMgYWxpZ25lZC4gXHJcbiAgICAgICAgLy8gSW4gVmlldyBjb29yZGluYXRlcywgdGhlIGNhbWVyYSBpcyBhdCB0aGUgb3JpZ2luLlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBuZWFyIHBsYW5lIGlzIHRoZSBtYXhpbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgZmFyIHBsYW5lIGlzIHRoZSBtaW5pbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICBsZXQgbmVhclBsYW5lID0gLWJvdW5kaW5nQm94Vmlldy5tYXguejtcclxuICAgICAgICBsZXQgZmFyUGxhbmUgID0gLWJvdW5kaW5nQm94Vmlldy5taW4uejtcclxuXHJcbiAgICAgICAgLy8gYWRqdXN0IGJ5IGVwc2lsb24gdG8gYXZvaWQgY2xpcHBpbmcgZ2VvbWV0cnkgYXQgdGhlIG5lYXIgcGxhbmUgZWRnZVxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5uZWFyID0gKDEgLSBEZXB0aEJ1ZmZlckZhY3RvcnkuTmVhclBsYW5lRXBzaWxvbmUpICogbmVhclBsYW5lO1xyXG5cclxuICAgICAgICAvLyBhbGxvdyB1c2VyIHRvIG92ZXJyaWRlIGNhbGN1bGF0ZWQgZmFyIHBsYW5lXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLmZhciAgPSBNYXRoLm1pbih0aGlzLl9jYW1lcmEuZmFyLCBmYXJQbGFuZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIG1lc2ggZnJvbSB0aGUgYWN0aXZlIG1vZGVsIGFuZCBjYW1lcmFcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEdlbmVyYXRpb24gcGFyYW1ldGVycyAoTWVzaEdlbmVyYXRlUGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgbWVzaEdlbmVyYXRlIChwYXJhbWV0ZXJzIDogTWVzaEdlbmVyYXRlUGFyYW1ldGVycykgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMudmVyaWZ5TWVzaFNldHRpbmdzKCkpIFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5fYm91bmRlZENsaXBwaW5nKVxyXG4gICAgICAgICAgICB0aGlzLnNldENhbWVyYUNsaXBwaW5nUGxhbmVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVwdGhCdWZmZXIoKTtcclxuICAgICAgICBsZXQgbWVzaCA9IHRoaXMuX2RlcHRoQnVmZmVyLm1lc2gocGFyYW1ldGVycy5tYXRlcmlhbCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgYW4gaW1hZ2UgZnJvbSB0aGUgYWN0aXZlIG1vZGVsIGFuZCBjYW1lcmFcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEdlbmVyYXRpb24gcGFyYW1ldGVycyAoSW1hZ2VHZW5lcmF0ZVBhcmFtZXRlcnMpXHJcbiAgICAgKi9cclxuICAgIGltYWdlR2VuZXJhdGUgKHBhcmFtZXRlcnMgOiBJbWFnZUdlbmVyYXRlUGFyYW1ldGVycykgOiBVaW50OEFycmF5IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuICAgICAgICAgXHJcbmV4cG9ydCBpbnRlcmZhY2UgTVJFdmVudCB7XHJcblxyXG4gICAgdHlwZSAgICA6IEV2ZW50VHlwZTtcclxuICAgIHRhcmdldCAgOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEV2ZW50VHlwZSB7XHJcblxyXG4gICAgTm9uZSxcclxuICAgIE5ld01vZGVsLFxyXG4gICAgTWVzaEdlbmVyYXRlXHJcbn1cclxuXHJcbnR5cGUgTGlzdGVuZXIgPSAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZDtcclxudHlwZSBMaXN0ZW5lckFycmF5ID0gTGlzdGVuZXJbXVtdOyAgLy8gTGlzdGVuZXJbXVtFdmVudFR5cGVdO1xyXG5cclxuLyoqXHJcbiAqIEV2ZW50IE1hbmFnZXJcclxuICogR2VuZXJhbCBldmVudCBtYW5hZ2VtZW50IGFuZCBkaXNwYXRjaGluZy5cclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuXHJcbiAgICBfbGlzdGVuZXJzIDogTGlzdGVuZXJBcnJheTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAvKlxyXG4gICAgICogQ3JlYXRlcyBFdmVudE1hbmFnZXIgb2JqZWN0LiBJdCBuZWVkcyB0byBiZSBjYWxsZWQgd2l0aCAnLmNhbGwnIHRvIGFkZCB0aGUgZnVuY3Rpb25hbGl0eSB0byBhbiBvYmplY3QuXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gYW4gZXZlbnQgdHlwZS5cclxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0aGF0IGdldHMgYWRkZWQuXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHRoYXQgZ2V0cyBhZGRlZC5cclxuICAgICAqL1xyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGUsIGxpc3RlbmVyOiAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZCApOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbRXZlbnRUeXBlLk5vbmVdID0gW107XHJcbiAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGRvZXMgbm90IGV4aXN0OyBjcmVhdGVcclxuICAgICAgICBpZiAobGlzdGVuZXJzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGxpc3RlbmVyc1t0eXBlXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZG8gbm90aGluZyBpZiBsaXN0ZW5lciByZWdpc3RlcmVkXHJcbiAgICAgICAgaWYgKGxpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGFkZCBuZXcgbGlzdGVuZXIgdG8gdGhpcyBldmVudFxyXG4gICAgICAgICAgICBsaXN0ZW5lcnNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyB3aGV0aGVyIGEgbGlzdGVuZXIgaXMgcmVnaXN0ZXJlZCBmb3IgYW4gZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgdG8gY2hlY2suXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIGNoZWNrLi5cclxuICAgICAqL1xyXG4gICAgaGFzRXZlbnRMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGUsIGxpc3RlbmVyOiAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHMgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICAvLyBldmVudCBleGlzdHMgYW5kIGxpc3RlbmVyIHJlZ2lzdGVyZWQgPT4gdHJ1ZVxyXG4gICAgICAgIHJldHVybiBsaXN0ZW5lcnNbdHlwZV0gIT09IHVuZGVmaW5lZCAmJiBsaXN0ZW5lcnNbdHlwZV0uaW5kZXhPZihsaXN0ZW5lcikgIT09IC0gMTsgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gYW4gZXZlbnQgdHlwZS5cclxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0aGF0IGdldHMgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdGhhdCBnZXRzIHJlbW92ZWQuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZTogRXZlbnRUeXBlLCBsaXN0ZW5lcjogKGV2ZW50OiBNUkV2ZW50LCAuLi5hcmdzIDogYW55W10pID0+IHZvaWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gbm8gZXZlbnRzOyBkbyBub3RoaW5nXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkICkgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xyXG4gICAgICAgIGxldCBsaXN0ZW5lckFycmF5ID0gbGlzdGVuZXJzW3R5cGVdO1xyXG5cclxuICAgICAgICBpZiAobGlzdGVuZXJBcnJheSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdGVuZXJBcnJheS5pbmRleE9mKGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBpZiBmb3VuZFxyXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZpcmUgYW4gZXZlbnQgdHlwZS5cclxuICAgICAqIEBwYXJhbSB0YXJnZXQgRXZlbnQgdGFyZ2V0LlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgZXZlbnQgdGhhdCBnZXRzIGZpcmVkLlxyXG4gICAgICovXHJcbiAgICBkaXNwYXRjaEV2ZW50KHRhcmdldCA6IGFueSwgZXZlbnRUeXBlIDogRXZlbnRUeXBlLCAuLi5hcmdzIDogYW55W10pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gbm8gZXZlbnRzIGRlZmluZWQ7IGRvIG5vdGhpbmdcclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVycyAgICAgPSB0aGlzLl9saXN0ZW5lcnM7ICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lckFycmF5ID0gbGlzdGVuZXJzW2V2ZW50VHlwZV07XHJcblxyXG4gICAgICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB0aGVFdmVudCA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGUgICA6IGV2ZW50VHlwZSwgICAgICAgICAvLyB0eXBlXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgOiB0YXJnZXQgICAgICAgICAgICAgLy8gc2V0IHRhcmdldCB0byBpbnN0YW5jZSB0cmlnZ2VyaW5nIHRoZSBldmVudFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBkdXBsaWNhdGUgb3JpZ2luYWwgYXJyYXkgb2YgbGlzdGVuZXJzXHJcbiAgICAgICAgICAgIGxldCBhcnJheSA9IGxpc3RlbmVyQXJyYXkuc2xpY2UoMCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDAgOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGFycmF5W2luZGV4XSh0aGVFdmVudCwgLi4uYXJncyk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gT0JKTG9hZGVyICggbWFuYWdlciApIHtcclxuXHJcbiAgICB0aGlzLm1hbmFnZXIgPSAoIG1hbmFnZXIgIT09IHVuZGVmaW5lZCApID8gbWFuYWdlciA6IFRIUkVFLkRlZmF1bHRMb2FkaW5nTWFuYWdlcjtcclxuXHJcbiAgICB0aGlzLm1hdGVyaWFscyA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5yZWdleHAgPSB7XHJcbiAgICAgICAgLy8gdiBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIHZlcnRleF9wYXR0ZXJuICAgICAgICAgICA6IC9edlxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKS8sXHJcbiAgICAgICAgLy8gdm4gZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgICAgICBub3JtYWxfcGF0dGVybiAgICAgICAgICAgOiAvXnZuXFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyB2dCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIHV2X3BhdHRlcm4gICAgICAgICAgICAgICA6IC9ednRcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4XHJcbiAgICAgICAgZmFjZV92ZXJ0ZXggICAgICAgICAgICAgIDogL15mXFxzKygtP1xcZCspXFxzKygtP1xcZCspXFxzKygtP1xcZCspKD86XFxzKygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgICAgICBmYWNlX3ZlcnRleF91diAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBmIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsXHJcbiAgICAgICAgZmFjZV92ZXJ0ZXhfdXZfbm9ybWFsICAgIDogL15mXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgZmFjZV92ZXJ0ZXhfbm9ybWFsICAgICAgIDogL15mXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gbyBvYmplY3RfbmFtZSB8IGcgZ3JvdXBfbmFtZVxyXG4gICAgICAgIG9iamVjdF9wYXR0ZXJuICAgICAgICAgICA6IC9eW29nXVxccyooLispPy8sXHJcbiAgICAgICAgLy8gcyBib29sZWFuXHJcbiAgICAgICAgc21vb3RoaW5nX3BhdHRlcm4gICAgICAgIDogL15zXFxzKyhcXGQrfG9ufG9mZikvLFxyXG4gICAgICAgIC8vIG10bGxpYiBmaWxlX3JlZmVyZW5jZVxyXG4gICAgICAgIG1hdGVyaWFsX2xpYnJhcnlfcGF0dGVybiA6IC9ebXRsbGliIC8sXHJcbiAgICAgICAgLy8gdXNlbXRsIG1hdGVyaWFsX25hbWVcclxuICAgICAgICBtYXRlcmlhbF91c2VfcGF0dGVybiAgICAgOiAvXnVzZW10bCAvXHJcbiAgICB9O1xyXG5cclxufTtcclxuXHJcbk9CSkxvYWRlci5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgY29uc3RydWN0b3I6IE9CSkxvYWRlcixcclxuXHJcbiAgICBsb2FkOiBmdW5jdGlvbiAoIHVybCwgb25Mb2FkLCBvblByb2dyZXNzLCBvbkVycm9yICkge1xyXG5cclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkZpbGVMb2FkZXIoIHNjb3BlLm1hbmFnZXIgKTtcclxuICAgICAgICBsb2FkZXIuc2V0UGF0aCggdGhpcy5wYXRoICk7XHJcbiAgICAgICAgbG9hZGVyLmxvYWQoIHVybCwgZnVuY3Rpb24gKCB0ZXh0ICkge1xyXG5cclxuICAgICAgICAgICAgb25Mb2FkKCBzY29wZS5wYXJzZSggdGV4dCApICk7XHJcblxyXG4gICAgICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHNldFBhdGg6IGZ1bmN0aW9uICggdmFsdWUgKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGF0aCA9IHZhbHVlO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0ZXJpYWxzOiBmdW5jdGlvbiAoIG1hdGVyaWFscyApIHtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRlcmlhbHMgPSBtYXRlcmlhbHM7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBfY3JlYXRlUGFyc2VyU3RhdGUgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0cyAgOiBbXSxcclxuICAgICAgICAgICAgb2JqZWN0ICAgOiB7fSxcclxuXHJcbiAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgIHV2cyAgICAgIDogW10sXHJcblxyXG4gICAgICAgICAgICBtYXRlcmlhbExpYnJhcmllcyA6IFtdLFxyXG5cclxuICAgICAgICAgICAgc3RhcnRPYmplY3Q6IGZ1bmN0aW9uICggbmFtZSwgZnJvbURlY2xhcmF0aW9uICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IG9iamVjdCAoaW5pdGlhbCBmcm9tIHJlc2V0KSBpcyBub3QgZnJvbSBhIGcvbyBkZWNsYXJhdGlvbiBpbiB0aGUgcGFyc2VkXHJcbiAgICAgICAgICAgICAgICAvLyBmaWxlLiBXZSBuZWVkIHRvIHVzZSBpdCBmb3IgdGhlIGZpcnN0IHBhcnNlZCBnL28gdG8ga2VlcCB0aGluZ3MgaW4gc3luYy5cclxuICAgICAgICAgICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdGhpcy5vYmplY3QuZnJvbURlY2xhcmF0aW9uID09PSBmYWxzZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QuZnJvbURlY2xhcmF0aW9uID0gKCBmcm9tRGVjbGFyYXRpb24gIT09IGZhbHNlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNNYXRlcmlhbCA9ICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpIDogdW5kZWZpbmVkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbURlY2xhcmF0aW9uIDogKCBmcm9tRGVjbGFyYXRpb24gIT09IGZhbHNlICksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5IDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNlcyA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxzICA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dnMgICAgICA6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHMgOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICBzbW9vdGggOiB0cnVlLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGFydE1hdGVyaWFsIDogZnVuY3Rpb24oIG5hbWUsIGxpYnJhcmllcyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX2ZpbmFsaXplKCBmYWxzZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV3IHVzZW10bCBkZWNsYXJhdGlvbiBvdmVyd3JpdGVzIGFuIGluaGVyaXRlZCBtYXRlcmlhbCwgZXhjZXB0IGlmIGZhY2VzIHdlcmUgZGVjbGFyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIG1hdGVyaWFsLCB0aGVuIGl0IG11c3QgYmUgcHJlc2VydmVkIGZvciBwcm9wZXIgTXVsdGlNYXRlcmlhbCBjb250aW51YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcHJldmlvdXMgJiYgKCBwcmV2aW91cy5pbmhlcml0ZWQgfHwgcHJldmlvdXMuZ3JvdXBDb3VudCA8PSAwICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMuc3BsaWNlKCBwcmV2aW91cy5pbmRleCwgMSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggICAgICA6IHRoaXMubWF0ZXJpYWxzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgOiBuYW1lIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXRsbGliICAgICA6ICggQXJyYXkuaXNBcnJheSggbGlicmFyaWVzICkgJiYgbGlicmFyaWVzLmxlbmd0aCA+IDAgPyBsaWJyYXJpZXNbIGxpYnJhcmllcy5sZW5ndGggLSAxIF0gOiAnJyApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc21vb3RoICAgICA6ICggcHJldmlvdXMgIT09IHVuZGVmaW5lZCA/IHByZXZpb3VzLnNtb290aCA6IHRoaXMuc21vb3RoICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0IDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuZ3JvdXBFbmQgOiAwICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEVuZCAgIDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgOiBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggICAgICA6ICggdHlwZW9mIGluZGV4ID09PSAnbnVtYmVyJyA/IGluZGV4IDogdGhpcy5pbmRleCApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogdGhpcy5tdGxsaWIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtb290aCAgICAgOiB0aGlzLnNtb290aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBTdGFydCA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBDb3VudCA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZWQuY2xvbmUgPSB0aGlzLmNsb25lLmJpbmQoY2xvbmVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMucHVzaCggbWF0ZXJpYWwgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE1hdGVyaWFsIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRlcmlhbHNbIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCAtIDEgXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgX2ZpbmFsaXplIDogZnVuY3Rpb24oIGVuZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0TXVsdGlNYXRlcmlhbCA9IHRoaXMuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbGFzdE11bHRpTWF0ZXJpYWwgJiYgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPT09IC0xICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kID0gdGhpcy5nZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGggLyAzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBDb3VudCA9IGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kIC0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBTdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmluaGVyaXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWdub3JlIG9iamVjdHMgdGFpbCBtYXRlcmlhbHMgaWYgbm8gZmFjZSBkZWNsYXJhdGlvbnMgZm9sbG93ZWQgdGhlbSBiZWZvcmUgYSBuZXcgby9nIHN0YXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZW5kICYmIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIG1pID0gdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMTsgbWkgPj0gMDsgbWktLSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzW21pXS5ncm91cENvdW50IDw9IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnNwbGljZSggbWksIDEgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHdWFyYW50ZWUgYXQgbGVhc3Qgb25lIGVtcHR5IG1hdGVyaWFsLCB0aGlzIG1ha2VzIHRoZSBjcmVhdGlvbiBsYXRlciBtb3JlIHN0cmFpZ2h0IGZvcndhcmQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZW5kICYmIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA9PT0gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lICAgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbW9vdGggOiB0aGlzLnNtb290aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdE11bHRpTWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSW5oZXJpdCBwcmV2aW91cyBvYmplY3RzIG1hdGVyaWFsLlxyXG4gICAgICAgICAgICAgICAgLy8gU3BlYyB0ZWxscyB1cyB0aGF0IGEgZGVjbGFyZWQgbWF0ZXJpYWwgbXVzdCBiZSBzZXQgdG8gYWxsIG9iamVjdHMgdW50aWwgYSBuZXcgbWF0ZXJpYWwgaXMgZGVjbGFyZWQuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBhIHVzZW10bCBkZWNsYXJhdGlvbiBpcyBlbmNvdW50ZXJlZCB3aGlsZSB0aGlzIG5ldyBvYmplY3QgaXMgYmVpbmcgcGFyc2VkLCBpdCB3aWxsXHJcbiAgICAgICAgICAgICAgICAvLyBvdmVyd3JpdGUgdGhlIGluaGVyaXRlZCBtYXRlcmlhbC4gRXhjZXB0aW9uIGJlaW5nIHRoYXQgdGhlcmUgd2FzIGFscmVhZHkgZmFjZSBkZWNsYXJhdGlvbnNcclxuICAgICAgICAgICAgICAgIC8vIHRvIHRoZSBpbmhlcml0ZWQgbWF0ZXJpYWwsIHRoZW4gaXQgd2lsbCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHByZXZpb3VzTWF0ZXJpYWwgJiYgcHJldmlvdXNNYXRlcmlhbC5uYW1lICYmIHR5cGVvZiBwcmV2aW91c01hdGVyaWFsLmNsb25lID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWNsYXJlZCA9IHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUoIDAgKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWNsYXJlZC5pbmhlcml0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Lm1hdGVyaWFscy5wdXNoKCBkZWNsYXJlZCApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdHMucHVzaCggdGhpcy5vYmplY3QgKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmaW5hbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QuX2ZpbmFsaXplKCB0cnVlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHBhcnNlVmVydGV4SW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAzICkgKiAzO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHBhcnNlTm9ybWFsSW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAzICkgKiAzO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHBhcnNlVVZJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDIgKSAqIDI7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVmVydGV4OiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMudmVydGljZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudmVydGljZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDIgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDIgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFZlcnRleExpbmU6IGZ1bmN0aW9uICggYSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkTm9ybWFsIDogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLm5vcm1hbHM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkubm9ybWFscztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVVY6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy51dnM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudXZzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRVVkxpbmU6IGZ1bmN0aW9uICggYSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy51dnM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudXZzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRGYWNlOiBmdW5jdGlvbiAoIGEsIGIsIGMsIGQsIHVhLCB1YiwgdWMsIHVkLCBuYSwgbmIsIG5jLCBuZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdkxlbiA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpYSA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYSwgdkxlbiApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGliID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBiLCB2TGVuICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWMgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGMsIHZMZW4gKTtcclxuICAgICAgICAgICAgICAgIHZhciBpZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZCA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggZCwgdkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdWEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHV2TGVuID0gdGhpcy51dnMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpYSA9IHRoaXMucGFyc2VVVkluZGV4KCB1YSwgdXZMZW4gKTtcclxuICAgICAgICAgICAgICAgICAgICBpYiA9IHRoaXMucGFyc2VVVkluZGV4KCB1YiwgdXZMZW4gKTtcclxuICAgICAgICAgICAgICAgICAgICBpYyA9IHRoaXMucGFyc2VVVkluZGV4KCB1YywgdXZMZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWKCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHRoaXMucGFyc2VVVkluZGV4KCB1ZCwgdXZMZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVViggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbmEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm9ybWFscyBhcmUgbWFueSB0aW1lcyB0aGUgc2FtZS4gSWYgc28sIHNraXAgZnVuY3Rpb24gY2FsbCBhbmQgcGFyc2VJbnQuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5MZW4gPSB0aGlzLm5vcm1hbHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGlhID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYSwgbkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpYiA9IG5hID09PSBuYiA/IGlhIDogdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYiwgbkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGljID0gbmEgPT09IG5jID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5jLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuZCwgbkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRMaW5lR2VvbWV0cnk6IGZ1bmN0aW9uICggdmVydGljZXMsIHV2cyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5nZW9tZXRyeS50eXBlID0gJ0xpbmUnO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIHZpID0gMCwgbCA9IHZlcnRpY2VzLmxlbmd0aDsgdmkgPCBsOyB2aSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXhMaW5lKCB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIHZlcnRpY2VzWyB2aSBdLCB2TGVuICkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIHV2aSA9IDAsIGwgPSB1dnMubGVuZ3RoOyB1dmkgPCBsOyB1dmkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVZMaW5lKCB0aGlzLnBhcnNlVVZJbmRleCggdXZzWyB1dmkgXSwgdXZMZW4gKSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc3RhdGUuc3RhcnRPYmplY3QoICcnLCBmYWxzZSApO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZTogZnVuY3Rpb24gKCB0ZXh0ICkge1xyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWUoICdPQkpMb2FkZXInICk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX2NyZWF0ZVBhcnNlclN0YXRlKCk7XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxyXFxuJyApICE9PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIFN0cmluZy5zcGxpdCB3aXRoIHJlZ2V4IHRoYXQgc3BsaXRzIG9uIGJvdGhcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggL1xcclxcbi9nLCAnXFxuJyApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxcXFxcbicgKSAhPT0gLSAxKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBqb2luIGxpbmVzIHNlcGFyYXRlZCBieSBhIGxpbmUgY29udGludWF0aW9uIGNoYXJhY3RlciAoXFwpXHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXFxcXFxuL2csICcnICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxpbmVzID0gdGV4dC5zcGxpdCggJ1xcbicgKTtcclxuICAgICAgICB2YXIgbGluZSA9ICcnLCBsaW5lRmlyc3RDaGFyID0gJycsIGxpbmVTZWNvbmRDaGFyID0gJyc7XHJcbiAgICAgICAgdmFyIGxpbmVMZW5ndGggPSAwO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gRmFzdGVyIHRvIGp1c3QgdHJpbSBsZWZ0IHNpZGUgb2YgdGhlIGxpbmUuIFVzZSBpZiBhdmFpbGFibGUuXHJcbiAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAvLyB2YXIgdHJpbUxlZnQgPSAoIHR5cGVvZiAnJy50cmltTGVmdCA9PT0gJ2Z1bmN0aW9uJyApO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF07XHJcblxyXG4gICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAvLyBsaW5lID0gdHJpbUxlZnQgPyBsaW5lLnRyaW1MZWZ0KCkgOiBsaW5lLnRyaW0oKTtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgbGluZUxlbmd0aCA9IGxpbmUubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsaW5lTGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBsaW5lRmlyc3RDaGFyID0gbGluZS5jaGFyQXQoIDAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEB0b2RvIGludm9rZSBwYXNzZWQgaW4gaGFuZGxlciBpZiBhbnlcclxuICAgICAgICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAnIycgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJ3YnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxpbmVTZWNvbmRDaGFyID0gbGluZS5jaGFyQXQoIDEgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAnICcgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC52ZXJ0ZXhfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInYgMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICduJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm5vcm1hbF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm5vcm1hbHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICd0JyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnV2X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAxICAgICAgMlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudXZzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIHZlcnRleC9ub3JtYWwvdXYgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwiZlwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91dl9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICAgNyAgICA4ICAgIDkgICAxMCAgICAgICAgIDExICAgICAgICAgMTJcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMS8xIDIvMi8yIDMvMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA3IF0sIHJlc3VsdFsgMTAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDggXSwgcmVzdWx0WyAxMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOSBdLCByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXYuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMSAyLzIgMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfbm9ybWFsLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxLy8xIDIvLzIgMy8vM1wiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgMSAgICAyICAgIDMgICA0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDIgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNCBdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBmYWNlIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lRmlyc3RDaGFyID09PSBcImxcIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVBhcnRzID0gbGluZS5zdWJzdHJpbmcoIDEgKS50cmltKCkuc3BsaXQoIFwiIFwiICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVZlcnRpY2VzID0gW10sIGxpbmVVVnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmUuaW5kZXhPZiggXCIvXCIgKSA9PT0gLSAxICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsaW5lVmVydGljZXMgPSBsaW5lUGFydHM7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGxpID0gMCwgbGxlbiA9IGxpbmVQYXJ0cy5sZW5ndGg7IGxpIDwgbGxlbjsgbGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBsaW5lUGFydHNbIGxpIF0uc3BsaXQoIFwiL1wiICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAwIF0gIT09IFwiXCIgKSBsaW5lVmVydGljZXMucHVzaCggcGFydHNbIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAxIF0gIT09IFwiXCIgKSBsaW5lVVZzLnB1c2goIHBhcnRzWyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXRlLmFkZExpbmVHZW9tZXRyeSggbGluZVZlcnRpY2VzLCBsaW5lVVZzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm9iamVjdF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG8gb2JqZWN0X25hbWVcclxuICAgICAgICAgICAgICAgIC8vIG9yXHJcbiAgICAgICAgICAgICAgICAvLyBnIGdyb3VwX25hbWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXT1JLQVJPVU5EOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yODY5XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgbmFtZSA9IHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gKCBcIiBcIiArIHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKSApLnN1YnN0ciggMSApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLnN0YXJ0T2JqZWN0KCBuYW1lICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF91c2VfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWF0ZXJpYWxcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5vYmplY3Quc3RhcnRNYXRlcmlhbCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCksIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG10bCBmaWxlXHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMucHVzaCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuc21vb3RoaW5nX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBIYW5kbGUgZmlsZXMgdGhhdCBoYXZlIHZhcnlpbmcgc21vb3RoIHZhbHVlcyBmb3IgYSBzZXQgb2YgZmFjZXMgaW5zaWRlIG9uZSBnZW9tZXRyeSxcclxuICAgICAgICAgICAgICAgIC8vIGJ1dCBkb2VzIG5vdCBkZWZpbmUgYSB1c2VtdGwgZm9yIGVhY2ggZmFjZSBzZXQuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhbmQgYSBkdW1teSBtYXRlcmlhbCBjcmVhdGVkIChsYXRlciBNdWx0aU1hdGVyaWFsIGFuZCBnZW9tZXRyeSBncm91cHMpLlxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyByZXF1aXJlcyBzb21lIGNhcmUgdG8gbm90IGNyZWF0ZSBleHRyYSBtYXRlcmlhbCBvbiBlYWNoIHNtb290aCB2YWx1ZSBmb3IgXCJub3JtYWxcIiBvYmogZmlsZXMuXHJcbiAgICAgICAgICAgICAgICAvLyB3aGVyZSBleHBsaWNpdCB1c2VtdGwgZGVmaW5lcyBnZW9tZXRyeSBncm91cHMuXHJcbiAgICAgICAgICAgICAgICAvLyBFeGFtcGxlIGFzc2V0OiBleGFtcGxlcy9tb2RlbHMvb2JqL2NlcmJlcnVzL0NlcmJlcnVzLm9ialxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdFsgMSBdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGh0dHA6Ly9wYXVsYm91cmtlLm5ldC9kYXRhZm9ybWF0cy9vYmovXHJcbiAgICAgICAgICAgICAgICAgKiBvclxyXG4gICAgICAgICAgICAgICAgICogaHR0cDovL3d3dy5jcy51dGFoLmVkdS9+Ym91bG9zL2NzMzUwNS9vYmpfc3BlYy5wZGZcclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBGcm9tIGNoYXB0ZXIgXCJHcm91cGluZ1wiIFN5bnRheCBleHBsYW5hdGlvbiBcInMgZ3JvdXBfbnVtYmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgKiBcImdyb3VwX251bWJlciBpcyB0aGUgc21vb3RoaW5nIGdyb3VwIG51bWJlci4gVG8gdHVybiBvZmYgc21vb3RoaW5nIGdyb3VwcywgdXNlIGEgdmFsdWUgb2YgMCBvciBvZmYuXHJcbiAgICAgICAgICAgICAgICAgKiBQb2x5Z29uYWwgZWxlbWVudHMgdXNlIGdyb3VwIG51bWJlcnMgdG8gcHV0IGVsZW1lbnRzIGluIGRpZmZlcmVudCBzbW9vdGhpbmcgZ3JvdXBzLiBGb3IgZnJlZS1mb3JtXHJcbiAgICAgICAgICAgICAgICAgKiBzdXJmYWNlcywgc21vb3RoaW5nIGdyb3VwcyBhcmUgZWl0aGVyIHR1cm5lZCBvbiBvciBvZmY7IHRoZXJlIGlzIG5vIGRpZmZlcmVuY2UgYmV0d2VlbiB2YWx1ZXMgZ3JlYXRlclxyXG4gICAgICAgICAgICAgICAgICogdGhhbiAwLlwiXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdC5zbW9vdGggPSAoIHZhbHVlICE9PSAnMCcgJiYgdmFsdWUgIT09ICdvZmYnICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gc3RhdGUub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc21vb3RoID0gc3RhdGUub2JqZWN0LnNtb290aDtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBudWxsIHRlcm1pbmF0ZWQgZmlsZXMgd2l0aG91dCBleGNlcHRpb25cclxuICAgICAgICAgICAgICAgIGlmICggbGluZSA9PT0gJ1xcMCcgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUuZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgLy9jb250YWluZXIubWF0ZXJpYWxMaWJyYXJpZXMgPSBbXS5jb25jYXQoIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcbiAgICAgICAgKDxhbnk+Y29udGFpbmVyKS5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsID0gc3RhdGUub2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG9iamVjdCA9IHN0YXRlLm9iamVjdHNbIGkgXTtcclxuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5O1xyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzID0gb2JqZWN0Lm1hdGVyaWFscztcclxuICAgICAgICAgICAgdmFyIGlzTGluZSA9ICggZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmUnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIG8vZyBsaW5lIGRlY2xhcmF0aW9ucyB0aGF0IGRpZCBub3QgZm9sbG93IHdpdGggYW55IGZhY2VzXHJcbiAgICAgICAgICAgIGlmICggZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnVmZmVyZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHJcbiAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudmVydGljZXMgKSwgMyApICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdub3JtYWwnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS5ub3JtYWxzICksIDMgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBnZW9tZXRyeS51dnMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnV2cyApLCAyICkgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBtYXRlcmlhbHNcclxuICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgLy92YXIgY3JlYXRlZE1hdGVyaWFscyA9IFtdOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjcmVhdGVkTWF0ZXJpYWxzIDogVEhSRUUuTWF0ZXJpYWxbXSA9IFtdOyAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VNYXRlcmlhbCA9IG1hdGVyaWFsc1ttaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscyAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFscy5jcmVhdGUoIHNvdXJjZU1hdGVyaWFsLm5hbWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbXRsIGV0Yy4gbG9hZGVycyBwcm9iYWJseSBjYW4ndCBjcmVhdGUgbGluZSBtYXRlcmlhbHMgY29ycmVjdGx5LCBjb3B5IHByb3BlcnRpZXMgdG8gYSBsaW5lIG1hdGVyaWFsLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNMaW5lICYmIG1hdGVyaWFsICYmICEgKCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWxMaW5lID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsTGluZS5jb3B5KCBtYXRlcmlhbCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IG1hdGVyaWFsTGluZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICEgbWF0ZXJpYWwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpIDogbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5uYW1lID0gc291cmNlTWF0ZXJpYWwubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2hhZGluZyA9IHNvdXJjZU1hdGVyaWFsLnNtb290aCA/IFRIUkVFLlNtb290aFNoYWRpbmcgOiBUSFJFRS5GbGF0U2hhZGluZztcclxuXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkTWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1lc2hcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBjcmVhdGVkTWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRHcm91cCggc291cmNlTWF0ZXJpYWwuZ3JvdXBTdGFydCwgc291cmNlTWF0ZXJpYWwuZ3JvdXBDb3VudCwgbWkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgLy9tZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFscyApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHMgKSApO1xyXG4gICAgICAgICAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbMF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsICkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgIC8vbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZU1hdGVyaWFscykgKTtcclxuICAgICAgICAgICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsKSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGQoIG1lc2ggKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoICdPQkpMb2FkZXInICk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgZnJvbSBcIkNhbWVyYVwiXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJWaWV3ZXJcIlxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBDYW1lcmFDb250cm9sc1xyXG4gKi9cclxuY2xhc3MgQ2FtZXJhU2V0dGluZ3Mge1xyXG5cclxuICAgIGZpdFZpZXcgICAgICAgICAgICA6ICgpID0+IHZvaWQ7XHJcbiAgICBcclxuICAgIHN0YW5kYXJkVmlldyAgICAgICA6IFN0YW5kYXJkVmlldztcclxuICAgIG5lYXJDbGlwcGluZ1BsYW5lICA6IG51bWJlcjtcclxuICAgIGZhckNsaXBwaW5nUGxhbmUgICA6IG51bWJlcjtcclxuICAgIGZpZWxkT2ZWaWV3ICAgICAgICA6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgZml0VmlldyA6ICgpID0+IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLmZpdFZpZXcgPSBmaXRWaWV3O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhbmRhcmRWaWV3ICAgICAgPSBTdGFuZGFyZFZpZXcuRnJvbnQ7XHJcbiAgICAgICAgdGhpcy5uZWFyQ2xpcHBpbmdQbGFuZSA9IGNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSAgPSBjYW1lcmEuZmFyO1xyXG4gICAgICAgIHRoaXMuZmllbGRPZlZpZXcgICAgICAgPSBjYW1lcmEuZm92O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogY2FtZXJhIFVJIENvbnRyb2xzLlxyXG4gKi8gICAgXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmFDb250cm9scyB7XHJcblxyXG4gICAgX3ZpZXdlciAgICAgICAgIDogVmlld2VyOyAgICAgICAgICAgICAgICAgICAgIC8vIGFzc29jaWF0ZWQgdmlld2VyXHJcbiAgICBfY2FtZXJhU2V0dGluZ3MgOiBDYW1lcmFTZXR0aW5nczsgICAgICAgICAgICAgLy8gVUkgc2V0dGluZ3NcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIENhbWVyYUNvbnRyb2xzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iodmlld2VyIDogVmlld2VyKSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyID0gdmlld2VyO1xyXG5cclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuICAgIC8qKlxyXG4gICAgICogRml0cyB0aGUgYWN0aXZlIHZpZXcuXHJcbiAgICAgKi9cclxuICAgIGZpdFZpZXcoKSA6IHZvaWQgeyBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92aWV3ZXIuZml0VmlldygpO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzID0gbmV3IENhbWVyYVNldHRpbmdzKHRoaXMuX3ZpZXdlci5jYW1lcmEsIHRoaXMuZml0Vmlldy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgbGV0IGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgbWVudURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuX3ZpZXdlci5jb250YWluZXJJZCk7XHJcbiAgICAgICAgbWVudURpdi5hcHBlbmRDaGlsZChndWkuZG9tRWxlbWVudCk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW1lcmEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICBcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgICAgIGxldCBjYW1lcmFPcHRpb25zID0gZ3VpLmFkZEZvbGRlcignQ2FtZXJhIE9wdGlvbnMnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBHZW5lcmF0ZSBSZWxpZWZcclxuICAgICAgICBsZXQgY29udHJvbEZpdFZpZXcgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2ZpdFZpZXcnKS5uYW1lKCdGaXQgVmlldycpO1xyXG5cclxuICAgICAgICAvLyBTdGFuZGFyZCBWaWV3c1xyXG4gICAgICAgIGxldCB2aWV3T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgRnJvbnQgICAgICAgOiBTdGFuZGFyZFZpZXcuRnJvbnQsXHJcbiAgICAgICAgICAgIEJhY2sgICAgICAgIDogU3RhbmRhcmRWaWV3LkJhY2ssXHJcbiAgICAgICAgICAgIFRvcCAgICAgICAgIDogU3RhbmRhcmRWaWV3LlRvcCxcclxuICAgICAgICAgICAgSXNvbWV0cmljICAgOiBTdGFuZGFyZFZpZXcuSXNvbWV0cmljLFxyXG4gICAgICAgICAgICBMZWZ0ICAgICAgICA6IFN0YW5kYXJkVmlldy5MZWZ0LFxyXG4gICAgICAgICAgICBSaWdodCAgICAgICA6IFN0YW5kYXJkVmlldy5SaWdodCxcclxuICAgICAgICAgICAgQm90dG9tICAgICAgOiBTdGFuZGFyZFZpZXcuQm90dG9tXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTdGFuZGFyZFZpZXdzID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdzdGFuZGFyZFZpZXcnLCB2aWV3T3B0aW9ucykubmFtZSgnU3RhbmRhcmQgVmlldycpO1xyXG4gICAgICAgIGNvbnRyb2xTdGFuZGFyZFZpZXdzLm9uQ2hhbmdlICgodmlld1NldHRpbmcgOiBzdHJpbmcpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3IDogU3RhbmRhcmRWaWV3ID0gcGFyc2VJbnQodmlld1NldHRpbmcsIDEwKTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyh2aWV3KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTmVhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIGxldCBtaW5pbXVtICA9ICAgMC4xO1xyXG4gICAgICAgIGxldCBtYXhpbXVtICA9IDEwMDtcclxuICAgICAgICBsZXQgc3RlcFNpemUgPSAgIDAuMTtcclxuICAgICAgICBsZXQgY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICduZWFyQ2xpcHBpbmdQbGFuZScpLm5hbWUoJ05lYXIgQ2xpcHBpbmcgUGxhbmUnKS5taW4obWluaW11bSkubWF4KG1heGltdW0pLnN0ZXAoc3RlcFNpemUpLmxpc3RlbigpO1xyXG4gICAgICAgIGNvbnRyb2xOZWFyQ2xpcHBpbmdQbGFuZS5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS5uZWFyID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBGYXIgQ2xpcHBpbmcgUGxhbmVcclxuICAgICAgICBtaW5pbXVtICA9ICAgICAxO1xyXG4gICAgICAgIG1heGltdW0gID0gMTAwMDA7XHJcbiAgICAgICAgc3RlcFNpemUgPSAgICAgMC4xO1xyXG4gICAgICAgIGxldCBjb250cm9sRmFyQ2xpcHBpbmdQbGFuZSA9IGNhbWVyYU9wdGlvbnMuYWRkKHRoaXMuX2NhbWVyYVNldHRpbmdzLCAnZmFyQ2xpcHBpbmdQbGFuZScpLm5hbWUoJ0ZhciBDbGlwcGluZyBQbGFuZScpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7O1xyXG4gICAgICAgIGNvbnRyb2xGYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIG1pbmltdW0gID0gMjU7XHJcbiAgICAgICAgbWF4aW11bSAgPSA3NTtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXc9IGNhbWVyYU9wdGlvbnMuYWRkKHRoaXMuX2NhbWVyYVNldHRpbmdzLCAnZmllbGRPZlZpZXcnKS5uYW1lKCdGaWVsZCBvZiBWaWV3JykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZpZWxkT2ZWaWV3IC5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS5mb3YgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGNhbWVyYU9wdGlvbnMub3BlbigpOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN5bmNocm9uaXplIHRoZSBVSSBjYW1lcmEgc2V0dGluZ3Mgd2l0aCB0aGUgdGFyZ2V0IGNhbWVyYS5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgXHJcbiAgICAgKi9cclxuICAgIHN5bmNocm9uaXplQ2FtZXJhU2V0dGluZ3MgKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5uZWFyQ2xpcHBpbmdQbGFuZSA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubmVhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5mYXJDbGlwcGluZ1BsYW5lICA9IHRoaXMuX3ZpZXdlci5jYW1lcmEuZmFyO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzLmZpZWxkT2ZWaWV3ICAgICAgID0gdGhpcy5fdmlld2VyLmNhbWVyYS5mb3Y7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuICAgICAgICAgIFxyXG4vKipcclxuICogTWF0ZXJpYWxzXHJcbiAqIEdlbmVyYWwgVEhSRUUuanMgTWF0ZXJpYWwgY2xhc3NlcyBhbmQgaGVscGVyc1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbHMge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIE1hdGVyaWFsc1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSB0ZXh0dXJlIG1hdGVyaWFsIGZyb20gYW4gaW1hZ2UgVVJMLlxyXG4gICAgICogQHBhcmFtIGltYWdlIEltYWdlIHRvIHVzZSBpbiB0ZXh0dXJlLlxyXG4gICAgICogQHJldHVybnMgVGV4dHVyZSBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVRleHR1cmVNYXRlcmlhbCAoaW1hZ2UgOiBIVE1MSW1hZ2VFbGVtZW50KSA6IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgdmFyIHRleHR1cmUgICAgICAgICA6IFRIUkVFLlRleHR1cmUsXHJcbiAgICAgICAgICAgIHRleHR1cmVNYXRlcmlhbCA6IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGltYWdlKTtcclxuICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlICAgICA9IHRydWU7XHJcbiAgICAgICAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7ICAgICAvLyBUaGUgbWFnbmlmaWNhdGlvbiBhbmQgbWluaWZpY2F0aW9uIGZpbHRlcnMgc2FtcGxlIHRoZSB0ZXh0dXJlIG1hcCBlbGVtZW50cyB3aGVuIG1hcHBpbmcgdG8gYSBwaXhlbC5cclxuICAgICAgICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7ICAgICAvLyBUaGUgZGVmYXVsdCBtb2RlcyBvdmVyc2FtcGxlIHdoaWNoIGxlYWRzIHRvIGJsZW5kaW5nIHdpdGggdGhlIGJsYWNrIGJhY2tncm91bmQuIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgcHJvZHVjZXMgY29sb3JlZCAoYmxhY2spIGFydGlmYWN0cyBhcm91bmQgdGhlIGVkZ2VzIG9mIHRoZSB0ZXh0dXJlIG1hcCBlbGVtZW50cy5cclxuICAgICAgICB0ZXh0dXJlLnJlcGVhdCA9IG5ldyBUSFJFRS5WZWN0b3IyKDEuMCwgMS4wKTtcclxuXHJcbiAgICAgICAgdGV4dHVyZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7bWFwOiB0ZXh0dXJlfSApO1xyXG4gICAgICAgIHRleHR1cmVNYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0ZXh0dXJlTWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAgQ3JlYXRlIGEgYnVtcCBtYXAgUGhvbmcgbWF0ZXJpYWwgZnJvbSBhIHRleHR1cmUgbWFwLlxyXG4gICAgICogQHBhcmFtIGRlc2lnblRleHR1cmUgQnVtcCBtYXAgdGV4dHVyZS5cclxuICAgICAqIEByZXR1cm5zIFBob25nIGJ1bXAgbWFwcGVkIG1hdGVyaWFsLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlTWVzaFBob25nTWF0ZXJpYWwoZGVzaWduVGV4dHVyZSA6IFRIUkVFLlRleHR1cmUpICA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIHtcclxuXHJcbiAgICAgICAgdmFyIG1hdGVyaWFsIDogVEhSRUUuTWVzaFBob25nTWF0ZXJpYWw7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcclxuICAgICAgICAgICAgY29sb3IgICA6IDB4ZmZmZmZmLFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGJ1bXBNYXAgICA6IGRlc2lnblRleHR1cmUsXHJcbiAgICAgICAgICAgIGJ1bXBTY2FsZSA6IC0xLjAsXHJcblxyXG4gICAgICAgICAgICBzaGFkaW5nOiBUSFJFRS5TbW9vdGhTaGFkaW5nLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSB0cmFuc3BhcmVudCBtYXRlcmlhbC5cclxuICAgICAqIEByZXR1cm5zIFRyYW5zcGFyZW50IG1hdGVyaWFsLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlVHJhbnNwYXJlbnRNYXRlcmlhbCgpICA6IFRIUkVFLk1hdGVyaWFsIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3IgOiAweDAwMDAwMCwgb3BhY2l0eSA6IDAuMCwgdHJhbnNwYXJlbnQgOiB0cnVlfSk7XHJcbiAgICB9XHJcblxyXG4vLyNlbmRyZWdpb25cclxufVxyXG4iLCIvKipcbiAqIEBhdXRob3IgRWJlcmhhcmQgR3JhZXRoZXIgLyBodHRwOi8vZWdyYWV0aGVyLmNvbS9cbiAqIEBhdXRob3IgTWFyayBMdW5kaW4gXHQvIGh0dHA6Ly9tYXJrLWx1bmRpbi5jb21cbiAqIEBhdXRob3IgU2ltb25lIE1hbmluaSAvIGh0dHA6Ly9kYXJvbjEzMzcuZ2l0aHViLmlvXG4gKiBAYXV0aG9yIEx1Y2EgQW50aWdhIFx0LyBodHRwOi8vbGFudGlnYS5naXRodWIuaW9cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmFja2JhbGxDb250cm9scyAoIG9iamVjdCwgZG9tRWxlbWVudCApIHtcblxuXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHR2YXIgU1RBVEUgPSB7IE5PTkU6IC0gMSwgUk9UQVRFOiAwLCBaT09NOiAxLCBQQU46IDIsIFRPVUNIX1JPVEFURTogMywgVE9VQ0hfWk9PTV9QQU46IDQgfTtcblxuXHR0aGlzLm9iamVjdCA9IG9iamVjdDtcblx0dGhpcy5kb21FbGVtZW50ID0gKCBkb21FbGVtZW50ICE9PSB1bmRlZmluZWQgKSA/IGRvbUVsZW1lbnQgOiBkb2N1bWVudDtcblxuXHQvLyBBUElcblxuXHR0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG5cdHRoaXMuc2NyZWVuID0geyBsZWZ0OiAwLCB0b3A6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcblxuXHR0aGlzLnJvdGF0ZVNwZWVkID0gMS4wO1xuXHR0aGlzLnpvb21TcGVlZCA9IDEuMjtcblx0dGhpcy5wYW5TcGVlZCA9IDAuMztcblxuXHR0aGlzLm5vUm90YXRlID0gZmFsc2U7XG5cdHRoaXMubm9ab29tID0gZmFsc2U7XG5cdHRoaXMubm9QYW4gPSBmYWxzZTtcblxuXHR0aGlzLnN0YXRpY01vdmluZyA9IHRydWU7XG5cdHRoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjI7XG5cblx0dGhpcy5taW5EaXN0YW5jZSA9IDA7XG5cdHRoaXMubWF4RGlzdGFuY2UgPSBJbmZpbml0eTtcblxuXHR0aGlzLmtleXMgPSBbIDY1IC8qQSovLCA4MyAvKlMqLywgNjggLypEKi8gXTtcblxuXHQvLyBpbnRlcm5hbHNcblxuXHR0aGlzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0dmFyIEVQUyA9IDAuMDAwMDAxO1xuXG5cdHZhciBsYXN0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdHZhciBfc3RhdGUgPSBTVEFURS5OT05FLFxuXHRfcHJldlN0YXRlID0gU1RBVEUuTk9ORSxcblxuXHRfZXllID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblxuXHRfbW92ZVByZXYgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfbW92ZUN1cnIgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXG5cdF9sYXN0QXhpcyA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdF9sYXN0QW5nbGUgPSAwLFxuXG5cdF96b29tU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfem9vbUVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cblx0X3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSAwLFxuXHRfdG91Y2hab29tRGlzdGFuY2VFbmQgPSAwLFxuXG5cdF9wYW5TdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF9wYW5FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdC8vIGZvciByZXNldFxuXG5cdHRoaXMudGFyZ2V0MCA9IHRoaXMudGFyZ2V0LmNsb25lKCk7XG5cdHRoaXMucG9zaXRpb24wID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0dGhpcy51cDAgPSB0aGlzLm9iamVjdC51cC5jbG9uZSgpO1xuXG5cdC8vIGV2ZW50c1xuXG5cdHZhciBjaGFuZ2VFdmVudCA9IHsgdHlwZTogJ2NoYW5nZScgfTtcblx0dmFyIHN0YXJ0RXZlbnQgPSB7IHR5cGU6ICdzdGFydCcgfTtcblx0dmFyIGVuZEV2ZW50ID0geyB0eXBlOiAnZW5kJyB9O1xuXG5cblx0Ly8gbWV0aG9kc1xuXG5cdHRoaXMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCB0aGlzLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ICkge1xuXG5cdFx0XHR0aGlzLnNjcmVlbi5sZWZ0ID0gMDtcblx0XHRcdHRoaXMuc2NyZWVuLnRvcCA9IDA7XG5cdFx0XHR0aGlzLnNjcmVlbi53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdFx0dGhpcy5zY3JlZW4uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIGJveCA9IHRoaXMuZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdC8vIGFkanVzdG1lbnRzIGNvbWUgZnJvbSBzaW1pbGFyIGNvZGUgaW4gdGhlIGpxdWVyeSBvZmZzZXQoKSBmdW5jdGlvblxuXHRcdFx0dmFyIGQgPSB0aGlzLmRvbUVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHR0aGlzLnNjcmVlbi5sZWZ0ID0gYm94LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgLSBkLmNsaWVudExlZnQ7XG5cdFx0XHR0aGlzLnNjcmVlbi50b3AgPSBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IC0gZC5jbGllbnRUb3A7XG5cdFx0XHR0aGlzLnNjcmVlbi53aWR0aCA9IGJveC53aWR0aDtcblx0XHRcdHRoaXMuc2NyZWVuLmhlaWdodCA9IGJveC5oZWlnaHQ7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24gKCBldmVudCApIHtcblxuXHRcdGlmICggdHlwZW9mIHRoaXNbIGV2ZW50LnR5cGUgXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblxuXHRcdFx0dGhpc1sgZXZlbnQudHlwZSBdKCBldmVudCApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dmFyIGdldE1vdXNlT25TY3JlZW4gPSAoIGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGdldE1vdXNlT25TY3JlZW4oIHBhZ2VYLCBwYWdlWSApIHtcblxuXHRcdFx0dmVjdG9yLnNldChcblx0XHRcdFx0KCBwYWdlWCAtIF90aGlzLnNjcmVlbi5sZWZ0ICkgLyBfdGhpcy5zY3JlZW4ud2lkdGgsXG5cdFx0XHRcdCggcGFnZVkgLSBfdGhpcy5zY3JlZW4udG9wICkgLyBfdGhpcy5zY3JlZW4uaGVpZ2h0XG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdmVjdG9yO1xuXG5cdFx0fTtcblxuXHR9KCkgKTtcblxuXHR2YXIgZ2V0TW91c2VPbkNpcmNsZSA9ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gZ2V0TW91c2VPbkNpcmNsZSggcGFnZVgsIHBhZ2VZICkge1xuXG5cdFx0XHR2ZWN0b3Iuc2V0KFxuXHRcdFx0XHQoICggcGFnZVggLSBfdGhpcy5zY3JlZW4ud2lkdGggKiAwLjUgLSBfdGhpcy5zY3JlZW4ubGVmdCApIC8gKCBfdGhpcy5zY3JlZW4ud2lkdGggKiAwLjUgKSApLFxuXHRcdFx0XHQoICggX3RoaXMuc2NyZWVuLmhlaWdodCArIDIgKiAoIF90aGlzLnNjcmVlbi50b3AgLSBwYWdlWSApICkgLyBfdGhpcy5zY3JlZW4ud2lkdGggKSAvLyBzY3JlZW4ud2lkdGggaW50ZW50aW9uYWxcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB2ZWN0b3I7XG5cblx0XHR9O1xuXG5cdH0oKSApO1xuXG5cdHRoaXMucm90YXRlQ2FtZXJhID0gKCBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBheGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdHF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLFxuXHRcdFx0ZXllRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG9iamVjdFVwRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG1vdmVEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0YW5nbGU7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gcm90YXRlQ2FtZXJhKCkge1xuXG5cdFx0XHRtb3ZlRGlyZWN0aW9uLnNldCggX21vdmVDdXJyLnggLSBfbW92ZVByZXYueCwgX21vdmVDdXJyLnkgLSBfbW92ZVByZXYueSwgMCApO1xuXHRcdFx0YW5nbGUgPSBtb3ZlRGlyZWN0aW9uLmxlbmd0aCgpO1xuXG5cdFx0XHRpZiAoIGFuZ2xlICkge1xuXG5cdFx0XHRcdF9leWUuY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkuc3ViKCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdFx0XHRleWVEaXJlY3Rpb24uY29weSggX2V5ZSApLm5vcm1hbGl6ZSgpO1xuXHRcdFx0XHRvYmplY3RVcERpcmVjdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QudXAgKS5ub3JtYWxpemUoKTtcblx0XHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24uY3Jvc3NWZWN0b3JzKCBvYmplY3RVcERpcmVjdGlvbiwgZXllRGlyZWN0aW9uICkubm9ybWFsaXplKCk7XG5cblx0XHRcdFx0b2JqZWN0VXBEaXJlY3Rpb24uc2V0TGVuZ3RoKCBfbW92ZUN1cnIueSAtIF9tb3ZlUHJldi55ICk7XG5cdFx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uLnNldExlbmd0aCggX21vdmVDdXJyLnggLSBfbW92ZVByZXYueCApO1xuXG5cdFx0XHRcdG1vdmVEaXJlY3Rpb24uY29weSggb2JqZWN0VXBEaXJlY3Rpb24uYWRkKCBvYmplY3RTaWRld2F5c0RpcmVjdGlvbiApICk7XG5cblx0XHRcdFx0YXhpcy5jcm9zc1ZlY3RvcnMoIG1vdmVEaXJlY3Rpb24sIF9leWUgKS5ub3JtYWxpemUoKTtcblxuXHRcdFx0XHRhbmdsZSAqPSBfdGhpcy5yb3RhdGVTcGVlZDtcblx0XHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKCBheGlzLCBhbmdsZSApO1xuXG5cdFx0XHRcdF9leWUuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cdFx0XHRcdF90aGlzLm9iamVjdC51cC5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblxuXHRcdFx0XHRfbGFzdEF4aXMuY29weSggYXhpcyApO1xuXHRcdFx0XHRfbGFzdEFuZ2xlID0gYW5nbGU7XG5cblx0XHRcdH0gZWxzZSBpZiAoICEgX3RoaXMuc3RhdGljTW92aW5nICYmIF9sYXN0QW5nbGUgKSB7XG5cblx0XHRcdFx0X2xhc3RBbmdsZSAqPSBNYXRoLnNxcnQoIDEuMCAtIF90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yICk7XG5cdFx0XHRcdF9leWUuY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkuc3ViKCBfdGhpcy50YXJnZXQgKTtcblx0XHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKCBfbGFzdEF4aXMsIF9sYXN0QW5nbGUgKTtcblx0XHRcdFx0X2V5ZS5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblx0XHRcdFx0X3RoaXMub2JqZWN0LnVwLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXG5cdFx0XHR9XG5cblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblxuXHRcdH07XG5cblx0fSgpICk7XG5cblxuXHR0aGlzLnpvb21DYW1lcmEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgZmFjdG9yO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLlRPVUNIX1pPT01fUEFOICkge1xuXG5cdFx0XHRmYWN0b3IgPSBfdG91Y2hab29tRGlzdGFuY2VTdGFydCAvIF90b3VjaFpvb21EaXN0YW5jZUVuZDtcblx0XHRcdF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gX3RvdWNoWm9vbURpc3RhbmNlRW5kO1xuXHRcdFx0X2V5ZS5tdWx0aXBseVNjYWxhciggZmFjdG9yICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRmYWN0b3IgPSAxLjAgKyAoIF96b29tRW5kLnkgLSBfem9vbVN0YXJ0LnkgKSAqIF90aGlzLnpvb21TcGVlZDtcblxuXHRcdFx0aWYgKCBmYWN0b3IgIT09IDEuMCAmJiBmYWN0b3IgPiAwLjAgKSB7XG5cblx0XHRcdFx0X2V5ZS5tdWx0aXBseVNjYWxhciggZmFjdG9yICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBfdGhpcy5zdGF0aWNNb3ZpbmcgKSB7XG5cblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdF96b29tU3RhcnQueSArPSAoIF96b29tRW5kLnkgLSBfem9vbVN0YXJ0LnkgKSAqIHRoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3I7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucGFuQ2FtZXJhID0gKCBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBtb3VzZUNoYW5nZSA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdFx0XHRvYmplY3RVcCA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRwYW4gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHBhbkNhbWVyYSgpIHtcblxuXHRcdFx0bW91c2VDaGFuZ2UuY29weSggX3BhbkVuZCApLnN1YiggX3BhblN0YXJ0ICk7XG5cblx0XHRcdGlmICggbW91c2VDaGFuZ2UubGVuZ3RoU3EoKSApIHtcblxuXHRcdFx0XHRtb3VzZUNoYW5nZS5tdWx0aXBseVNjYWxhciggX2V5ZS5sZW5ndGgoKSAqIF90aGlzLnBhblNwZWVkICk7XG5cblx0XHRcdFx0cGFuLmNvcHkoIF9leWUgKS5jcm9zcyggX3RoaXMub2JqZWN0LnVwICkuc2V0TGVuZ3RoKCBtb3VzZUNoYW5nZS54ICk7XG5cdFx0XHRcdHBhbi5hZGQoIG9iamVjdFVwLmNvcHkoIF90aGlzLm9iamVjdC51cCApLnNldExlbmd0aCggbW91c2VDaGFuZ2UueSApICk7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZCggcGFuICk7XG5cdFx0XHRcdF90aGlzLnRhcmdldC5hZGQoIHBhbiApO1xuXG5cdFx0XHRcdGlmICggX3RoaXMuc3RhdGljTW92aW5nICkge1xuXG5cdFx0XHRcdFx0X3BhblN0YXJ0LmNvcHkoIF9wYW5FbmQgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0X3BhblN0YXJ0LmFkZCggbW91c2VDaGFuZ2Uuc3ViVmVjdG9ycyggX3BhbkVuZCwgX3BhblN0YXJ0ICkubXVsdGlwbHlTY2FsYXIoIF90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yICkgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9KCkgKTtcblxuXHR0aGlzLmNoZWNrRGlzdGFuY2VzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCAhIF90aGlzLm5vWm9vbSB8fCAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRpZiAoIF9leWUubGVuZ3RoU3EoKSA+IF90aGlzLm1heERpc3RhbmNlICogX3RoaXMubWF4RGlzdGFuY2UgKSB7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZFZlY3RvcnMoIF90aGlzLnRhcmdldCwgX2V5ZS5zZXRMZW5ndGgoIF90aGlzLm1heERpc3RhbmNlICkgKTtcblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggX2V5ZS5sZW5ndGhTcSgpIDwgX3RoaXMubWluRGlzdGFuY2UgKiBfdGhpcy5taW5EaXN0YW5jZSApIHtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllLnNldExlbmd0aCggX3RoaXMubWluRGlzdGFuY2UgKSApO1xuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X2V5ZS5zdWJWZWN0b3JzKCBfdGhpcy5vYmplY3QucG9zaXRpb24sIF90aGlzLnRhcmdldCApO1xuXG5cdFx0aWYgKCAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfdGhpcy5yb3RhdGVDYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdGlmICggISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF90aGlzLnpvb21DYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdGlmICggISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3RoaXMucGFuQ2FtZXJhKCk7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllICk7XG5cblx0XHRfdGhpcy5jaGVja0Rpc3RhbmNlcygpO1xuXG5cdFx0X3RoaXMub2JqZWN0Lmxvb2tBdCggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRpZiAoIGxhc3RQb3NpdGlvbi5kaXN0YW5jZVRvU3F1YXJlZCggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkgPiBFUFMgKSB7XG5cblx0XHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cblx0XHRcdGxhc3RQb3NpdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXHRcdF9wcmV2U3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0X3RoaXMudGFyZ2V0LmNvcHkoIF90aGlzLnRhcmdldDAgKTtcblx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uY29weSggX3RoaXMucG9zaXRpb24wICk7XG5cdFx0X3RoaXMub2JqZWN0LnVwLmNvcHkoIF90aGlzLnVwMCApO1xuXG5cdFx0X2V5ZS5zdWJWZWN0b3JzKCBfdGhpcy5vYmplY3QucG9zaXRpb24sIF90aGlzLnRhcmdldCApO1xuXG5cdFx0X3RoaXMub2JqZWN0Lmxvb2tBdCggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXG5cdFx0bGFzdFBvc2l0aW9uLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApO1xuXG5cdH07XG5cblx0Ly8gbGlzdGVuZXJzXG5cblx0ZnVuY3Rpb24ga2V5ZG93biggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biApO1xuXG5cdFx0X3ByZXZTdGF0ZSA9IF9zdGF0ZTtcblxuXHRcdGlmICggX3N0YXRlICE9PSBTVEFURS5OT05FICkge1xuXG5cdFx0XHRyZXR1cm47XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5ST1RBVEUgXSAmJiAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5ST1RBVEU7XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5aT09NIF0gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlpPT007XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5QQU4gXSAmJiAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5QQU47XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGtleXVwKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRfc3RhdGUgPSBfcHJldlN0YXRlO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2Vkb3duKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLk5PTkUgKSB7XG5cblx0XHRcdF9zdGF0ZSA9IGV2ZW50LmJ1dHRvbjtcblxuXHRcdH1cblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5ST1RBVEUgJiYgISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlpPT00gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF96b29tU3RhcnQuY29weSggZ2V0TW91c2VPblNjcmVlbiggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblx0XHRcdF96b29tRW5kLmNvcHkoIF96b29tU3RhcnQgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUEFOICYmICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF9wYW5TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXHRcdFx0X3BhbkVuZC5jb3B5KCBfcGFuU3RhcnQgKTtcblxuXHRcdH1cblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUsIGZhbHNlICk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBtb3VzZXVwLCBmYWxzZSApO1xuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggc3RhcnRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZW1vdmUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUk9UQVRFICYmICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5aT09NICYmICEgX3RoaXMubm9ab29tICkge1xuXG5cdFx0XHRfem9vbUVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5QQU4gJiYgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3BhbkVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZXVwKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUgKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG1vdXNldXAgKTtcblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZXdoZWVsKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0c3dpdGNoICggZXZlbnQuZGVsdGFNb2RlICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpvb20gaW4gcGFnZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDI1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuXHRcdFx0Y2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBab29tIGluIGxpbmVzXG5cdFx0XHRcdF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAxO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Ly8gdW5kZWZpbmVkLCAwLCBhc3N1bWUgcGl4ZWxzXG5cdFx0XHRcdF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAwMDI1O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIHN0YXJ0RXZlbnQgKTtcblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaHN0YXJ0KCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKCBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9ST1RBVEU7XG5cdFx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSApICk7XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IC8vIDIgb3IgbW9yZVxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9aT09NX1BBTjtcblx0XHRcdFx0dmFyIGR4ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYO1xuXHRcdFx0XHR2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XG5cdFx0XHRcdF90b3VjaFpvb21EaXN0YW5jZUVuZCA9IF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRcdHZhciB4ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVggKSAvIDI7XG5cdFx0XHRcdHZhciB5ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVkgKSAvIDI7XG5cdFx0XHRcdF9wYW5TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCB4LCB5ICkgKTtcblx0XHRcdFx0X3BhbkVuZC5jb3B5KCBfcGFuU3RhcnQgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBzdGFydEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNobW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoICkge1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICkgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IC8vIDIgb3IgbW9yZVxuXHRcdFx0XHR2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG5cdFx0XHRcdHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcblx0XHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlRW5kID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRcdHZhciB4ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVggKSAvIDI7XG5cdFx0XHRcdHZhciB5ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVkgKSAvIDI7XG5cdFx0XHRcdF9wYW5FbmQuY29weSggZ2V0TW91c2VPblNjcmVlbiggeCwgeSApICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaGVuZCggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0c3dpdGNoICggZXZlbnQudG91Y2hlcy5sZW5ndGggKSB7XG5cblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuXHRcdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKSApO1xuXHRcdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggZW5kRXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gY29udGV4dG1lbnUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0fVxuXG5cdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIGNvbnRleHRtZW51LCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgbW91c2Vkb3duLCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBtb3VzZXdoZWVsLCBmYWxzZSApO1xuXG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgdG91Y2hlbmQsIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlICk7XG5cblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlLCBmYWxzZSApO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgbW91c2V1cCwgZmFsc2UgKTtcblxuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGtleWRvd24sIGZhbHNlICk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGtleXVwLCBmYWxzZSApO1xuXG5cdH07XG5cblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIGNvbnRleHRtZW51LCBmYWxzZSApOyBcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBtb3VzZWRvd24sIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBtb3VzZXdoZWVsLCBmYWxzZSApO1xuXG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoc3RhcnQsIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlICk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGtleXVwLCBmYWxzZSApO1xuXG5cdHRoaXMuaGFuZGxlUmVzaXplKCk7XG5cblx0Ly8gZm9yY2UgYW4gdXBkYXRlIGF0IHN0YXJ0XG5cdHRoaXMudXBkYXRlKCk7XG5cbn1cblxuVHJhY2tiYWxsQ29udHJvbHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVEhSRUUuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSApO1xuVHJhY2tiYWxsQ29udHJvbHMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVHJhY2tiYWxsQ29udHJvbHM7XG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcbmltcG9ydCB7Q2FtZXJhLCBTdGFuZGFyZFZpZXd9ICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0NhbWVyYUNvbnRyb2xzfSAgICAgICAgIGZyb20gJ0NhbWVyYUNvbnRyb2xzJ1xyXG5pbXBvcnQge0V2ZW50TWFuYWdlcn0gICAgICAgICAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXJ9ICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0ZXJpYWxzfSAgICAgICAgICAgICAgZnJvbSAnTWF0ZXJpYWxzJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5cclxuY29uc3QgT2JqZWN0TmFtZXMgPSB7XHJcbiAgICBSb290IDogICdSb290J1xyXG59XHJcblxyXG4vKipcclxuICogQGV4cG9ydHMgVmlld2VyL1ZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFZpZXdlciB7XHJcblxyXG4gICAgX25hbWUgICAgICAgICAgICAgICAgICAgOiBzdHJpbmcgICAgICAgICAgICAgICAgICAgID0gJyc7XHJcbiAgICBfZXZlbnRNYW5hZ2VyICAgICAgICAgICA6IEV2ZW50TWFuYWdlciAgICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgX2xvZ2dlciAgICAgICAgICAgICAgICAgOiBMb2dnZXIgICAgICAgICAgICAgICAgICAgID0gbnVsbDtcclxuICAgIFxyXG4gICAgX3NjZW5lICAgICAgICAgICAgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgID0gbnVsbDtcclxuICAgIF9yb290ICAgICAgICAgICAgICAgICAgIDogVEhSRUUuT2JqZWN0M0QgICAgICAgICAgICA9IG51bGw7ICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICBfcmVuZGVyZXIgICAgICAgICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyZXIgICAgICAgPSBudWxsOztcclxuICAgIF9jYW52YXMgICAgICAgICAgICAgICAgIDogSFRNTENhbnZhc0VsZW1lbnQgICAgICAgICA9IG51bGw7XHJcbiAgICBfd2lkdGggICAgICAgICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICAgPSAwO1xyXG4gICAgX2hlaWdodCAgICAgICAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgID0gMDtcclxuXHJcbiAgICBfY2FtZXJhICAgICAgICAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhICAgPSBudWxsO1xyXG5cclxuICAgIF9jb250cm9scyAgICAgICAgICAgICAgIDogVHJhY2tiYWxsQ29udHJvbHMgICAgICAgICA9IG51bGw7XHJcbiAgICBfY2FtZXJhQ29udHJvbHMgICAgICAgICA6IENhbWVyYUNvbnRyb2xzICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBWaWV3ZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIG5hbWUgVmlld2VyIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvQmluZFRvIEhUTUwgZWxlbWVudCB0byBob3N0IHRoZSB2aWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgOiBzdHJpbmcsIG1vZGVsQ2FudmFzSWQgOiBzdHJpbmcpIHsgXHJcblxyXG4gICAgICAgIHRoaXMuX25hbWUgICAgICAgICA9IG5hbWU7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKCk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyICAgICAgID0gU2VydmljZXMuY29uc29sZUxvZ2dlcjtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gR3JhcGhpY3MuaW5pdGlhbGl6ZUNhbnZhcyhtb2RlbENhbnZhc0lkKTtcclxuICAgICAgICB0aGlzLl93aWR0aCAgPSB0aGlzLl9jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5fY2FudmFzLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIFZpZXdlciBuYW1lLlxyXG4gICAgICovXHJcbiAgICBnZXQgbmFtZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGNhbWVyYS5cclxuICAgICAqL1xyXG4gICAgZ2V0IGNhbWVyYSgpIHtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBzZXQgY2FtZXJhKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgR3JhcGhpY3MuYWRkQ2FtZXJhSGVscGVyKHRoaXMuX3NjZW5lLCB0aGlzLmNhbWVyYSk7ICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgYWN0aXZlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXQgbW9kZWwoKSA6IFRIUkVFLkdyb3VwIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBFdmVudE1hbmFnZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCBldmVudE1hbmFnZXIoKSA6IEV2ZW50TWFuYWdlciB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50TWFuYWdlcjtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgYWN0aXZlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIE5ldyBtb2RlbCB0byBhY3RpdmF0ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TW9kZWwodmFsdWUgOiBUSFJFRS5Hcm91cCkge1xyXG5cclxuICAgICAgICAvLyBOLkIuIFRoaXMgaXMgYSBtZXRob2Qgbm90IGEgcHJvcGVydHkgc28gYSBzdWIgY2xhc3MgY2FuIG92ZXJyaWRlLlxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvNDQ2NVxyXG5cclxuICAgICAgICBHcmFwaGljcy5yZW1vdmVPYmplY3RDaGlsZHJlbih0aGlzLl9yb290LCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSBjYW52YXMgYWZlciBhIHdpbmRvdyByZXNpemVcclxuICAgICAqL1xyXG4gICAgZ2V0IGFzcGVjdFJhdGlvKCkgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgYXNwZWN0UmF0aW8gOiBudW1iZXIgPSB0aGlzLl93aWR0aCAvIHRoaXMuX2hlaWdodDtcclxuICAgICAgICByZXR1cm4gYXNwZWN0UmF0aW87XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgRE9NIElkIG9mIHRoZSBWaWV3ZXIgcGFyZW50IGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRhaW5lcklkKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBwYXJlbnRFbGVtZW50IDogSFRNTEVsZW1lbnQgPSB0aGlzLl9jYW52YXMucGFyZW50RWxlbWVudDtcclxuICAgICAgICByZXR1cm4gcGFyZW50RWxlbWVudC5pZDtcclxuICAgIH0gXHJcbiAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdGVzdCBzcGhlcmUgdG8gYSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCAyKTtcclxuICAgICAgICB0aGlzLl9yb290LmFkZChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgU2NlbmVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVNjZW5lICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVJvb3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZVNjZW5lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBXZWJHTCByZW5kZXJlci5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVJlbmRlcmVyICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XHJcblxyXG4gICAgICAgICAgICBsb2dhcml0aG1pY0RlcHRoQnVmZmVyICA6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYW52YXMgICAgICAgICAgICAgICAgICA6IHRoaXMuX2NhbnZhcyxcclxuICAgICAgICAgICAgYW50aWFsaWFzICAgICAgICAgICAgICAgOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuYXV0b0NsZWFyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwKTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlld2VyIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhKCkge1xyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gQ2FtZXJhLmdldFN0YW5kYXJkVmlld0NhbWVyYShTdGFuZGFyZFZpZXcuRnJvbnQsIHRoaXMuYXNwZWN0UmF0aW8sIHRoaXMubW9kZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBsaWdodGluZyB0byB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nKCkge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDQwNDA0MCk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4QzBDMDkwKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0MS5wb3NpdGlvbi5zZXQoLTEwMCwgLTUwLCAxMDApO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0MSk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MiA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4QzBDMDkwKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0Mi5wb3NpdGlvbi5zZXQoMTAwLCA1MCwgLTEwMCk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIHVzZXIgaW5wdXQgY29udHJvbHMgKFRyYWNrYmFsbClcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzID0gbmV3IFRyYWNrYmFsbENvbnRyb2xzKHRoaXMuY2FtZXJhLCB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gTi5CLiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDMyNTA5NS90aHJlZWpzLWNhbWVyYS1sb29rYXQtaGFzLW5vLWVmZmVjdC1pcy10aGVyZS1zb21ldGhpbmctaW0tZG9pbmctd3JvbmdcclxuICAgICAgICB0aGlzLl9jb250cm9scy5wb3NpdGlvbjAuY29weSh0aGlzLmNhbWVyYS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdCh0aGlzLl9yb290KTtcclxuICAgICAgICB0aGlzLl9jb250cm9scy50YXJnZXQuY29weShib3VuZGluZ0JveC5nZXRDZW50ZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSB1c2VyIGlucHV0IGNvbnRyb2xzIChTZXR0aW5ncylcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzID0gbmV3IENhbWVyYUNvbnRyb2xzKHRoaXMpOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIGtleWJvYXJkIHNob3J0Y3V0cy5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUtleWJvYXJkU2hvcnRjdXRzKCkge1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCA6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvamF2YXNjcmlwdC9qYXZhc2NyaXB0LWtleWNvZGVzL1xyXG4gICAgICAgICAgICBsZXQga2V5Q29kZSA6IG51bWJlciA9IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNzA6ICAgICAgICAgICAgICAgIC8vIEYgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYSA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdDYW1lcmEoU3RhbmRhcmRWaWV3LkZyb250LCB0aGlzLmFzcGVjdFJhdGlvLCB0aGlzLm1vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBzY2VuZSB3aXRoIHRoZSBiYXNlIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDYW1lcmEoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZygpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplS2V5Ym9hcmRTaG9ydGN1dHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZVdpbmRvdygpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplV2luZG93LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2NlbmVcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc2NlbmUgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBjbGVhckFsbEFzc2VzdHMoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4odGhpcy5fcm9vdCwgZmFsc2UpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIHJvb3Qgb2JqZWN0IGluIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVSb290KCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5uYW1lID0gT2JqZWN0TmFtZXMuUm9vdDtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQodGhpcy5fcm9vdCk7XHJcbiAgICB9XHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBDYW1lcmFcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gU2V0cyB0aGUgdmlldyBjYW1lcmEgcHJvcGVydGllcyB0byB0aGUgZ2l2ZW4gc2V0dGluZ3MuXHJcbiAgICAgKiBAcGFyYW0ge1N0YW5kYXJkVmlld30gdmlldyBDYW1lcmEgc2V0dGluZ3MgdG8gYXBwbHkuXHJcbiAgICAgKi9cclxuICAgIHNldENhbWVyYVRvU3RhbmRhcmRWaWV3KHZpZXcgOiBTdGFuZGFyZFZpZXcpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YW5kYXJkVmlld0NhbWVyYSA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdDYW1lcmEodmlldywgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5tb2RlbCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBzdGFuZGFyZFZpZXdDYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gRml0cyB0aGUgYWN0aXZlIHZpZXcuXHJcbiAgICAgKi9cclxuICAgIGZpdFZpZXcoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gQ2FtZXJhLmdldEZpdFZpZXdDYW1lcmEgKENhbWVyYS5nZXRTY2VuZUNhbWVyYSh0aGlzLmNhbWVyYSwgdGhpcy5hc3BlY3RSYXRpbyksIHRoaXMubW9kZWwpO1xyXG4gICAgfVxyXG4gICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFdpbmRvdyBSZXNpemVcclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgc2NlbmUgY2FtZXJhIHRvIG1hdGNoIHRoZSBuZXcgd2luZG93IHNpemVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQ2FtZXJhT25XaW5kb3dSZXNpemUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlcyB0aGUgV2ViR0wgcHJvY2Vzc2luZyBmb3IgYSBET00gd2luZG93ICdyZXNpemUnIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIHJlc2l6ZURpc3BsYXlXZWJHTCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSAgdGhpcy5fY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLmhhbmRsZVJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FtZXJhT25XaW5kb3dSZXNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgYSB3aW5kb3cgcmVzaXplIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uUmVzaXplV2luZG93ICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNpemVEaXNwbGF5V2ViR0woKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gUmVuZGVyIExvb3BcclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgdGhlIFdlYkdMIHJlbmRlciBvZiB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgcmVuZGVyV2ViR0woKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9zY2VuZSwgdGhpcy5jYW1lcmEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpbiBET00gcmVuZGVyIGxvb3BcclxuICAgICAqL1xyXG4gICAgYW5pbWF0ZSgpIHtcclxuXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnJlbmRlcldlYkdMKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IFxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5cclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5jb25zdCB0ZXN0TW9kZWxDb2xvciA9ICcjNTU4ZGU4JztcclxuXHJcbmV4cG9ydCBlbnVtIFRlc3RNb2RlbCB7XHJcbiAgICBUb3J1cyxcclxuICAgIFNwaGVyZSxcclxuICAgIFNsb3BlZFBsYW5lLFxyXG4gICAgQm94LFxyXG4gICAgQ2hlY2tlcmJvYXJkXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0TW9kZWxMb2FkZXIge1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVGVzdE1vZGVsTG9hZGVyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2FkcyBhIHBhcmFtZXRyaWMgdGVzdCBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB7Vmlld2VyfSB2aWV3ZXIgVmlld2VyIGluc3RhbmNlIHRvIHJlY2VpdmUgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0ge1Rlc3RNb2RlbH0gbW9kZWxUeXBlIE1vZGVsIHR5cGUgKEJveCwgU3BoZXJlLCBldGMuKVxyXG4gICAgICovXHJcbiAgICBsb2FkVGVzdE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIsIG1vZGVsVHlwZSA6IFRlc3RNb2RlbCkge1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG1vZGVsVHlwZSl7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5Ub3J1czpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFRvcnVzTW9kZWwodmlld2VyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuU3BoZXJlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU3BoZXJlTW9kZWwodmlld2VyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuU2xvcGVkUGxhbmU6IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU2xvcGVkUGxhbmVNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5Cb3g6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRCb3hNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5DaGVja2VyYm9hcmQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDaGVja2VyYm9hcmRNb2RlbCh2aWV3ZXIpOyAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSB0b3J1cyB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZFRvcnVzTW9kZWwodmlld2VyIDogVmlld2VyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcnVzU2NlbmUgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgc29tZSBnZW9tZXRyaWVzXHJcbiAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzS25vdEdlb21ldHJ5KDEsIDAuMywgMTI4LCA2NCk7XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pO1xyXG5cclxuICAgICAgICBsZXQgY291bnQgPSA1MDtcclxuICAgICAgICBsZXQgc2NhbGUgPSA1O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XHJcbiAgICAgICAgICAgIGxldCB6ID0gKE1hdGgucmFuZG9tKCkgKiAyLjApIC0gMS4wO1xyXG4gICAgICAgICAgICBsZXQgelNjYWxlID0gTWF0aC5zcXJ0KDEuMCAtIHogKiB6KSAqIHNjYWxlO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnNldChcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKHIpICogelNjYWxlLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4ocikgKiB6U2NhbGUsXHJcbiAgICAgICAgICAgICAgICB6ICogc2NhbGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbWVzaC5yb3RhdGlvbi5zZXQoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSk7XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSAnVG9ydXMgQ29tcG9uZW50JztcclxuICAgICAgICAgICAgdG9ydXNTY2VuZS5hZGQobWVzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbCAodG9ydXNTY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdGVzdCBzcGhlcmUgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkU3BoZXJlTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgcmFkaXVzID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzLCByYWRpdXMsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSlcclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB0ZXN0IGJveCB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRCb3hNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCAgPSAyOyAgICBcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMjsgICAgXHJcbiAgICAgICAgbGV0IGRlcHRoICA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlQm94TWVzaChuZXcgVEhSRUUuVmVjdG9yMywgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSlcclxuXHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsKG1lc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgc2xvcGVkIHBsYW5lIHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZFNsb3BlZFBsYW5lTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgd2lkdGggID0gMjsgICAgXHJcbiAgICAgICAgbGV0IGhlaWdodCA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlUGxhbmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzLCB3aWR0aCwgaGVpZ2h0LCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSkpICAgICAgIFxyXG4gICAgICAgIG1lc2gucm90YXRlWChNYXRoLlBJIC8gNCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVzaC5uYW1lID0gJ1Nsb3BlZFBsYW5lJztcclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB0ZXN0IG1vZGVsIGNvbnNpc3Rpbmcgb2YgYSB0aWVyZWQgY2hlY2tlcmJvYXJkXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZENoZWNrZXJib2FyZE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZ3JpZExlbmd0aCAgICAgOiBudW1iZXIgPSAyO1xyXG4gICAgICAgIGxldCB0b3RhbEhlaWdodCAgICA6IG51bWJlciA9IDEuMDsgICAgICAgIFxyXG4gICAgICAgIGxldCBncmlkRGl2aXNpb25zICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHRvdGFsQ2VsbHMgICAgIDogbnVtYmVyID0gTWF0aC5wb3coZ3JpZERpdmlzaW9ucywgMik7XHJcblxyXG4gICAgICAgIGxldCBjZWxsQmFzZSAgICAgICA6IG51bWJlciA9IGdyaWRMZW5ndGggLyBncmlkRGl2aXNpb25zO1xyXG4gICAgICAgIGxldCBjZWxsSGVpZ2h0ICAgICA6IG51bWJlciA9IHRvdGFsSGVpZ2h0IC8gdG90YWxDZWxscztcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpblggOiBudW1iZXIgPSAtKGNlbGxCYXNlICogKGdyaWREaXZpc2lvbnMgLyAyKSkgKyAoY2VsbEJhc2UgLyAyKTtcclxuICAgICAgICBsZXQgb3JpZ2luWSA6IG51bWJlciA9IG9yaWdpblg7XHJcbiAgICAgICAgbGV0IG9yaWdpblogOiBudW1iZXIgPSAtY2VsbEhlaWdodCAvIDI7XHJcbiAgICAgICAgbGV0IG9yaWdpbiAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCwgb3JpZ2luWSwgb3JpZ2luWik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGJhc2VDb2xvciAgICAgIDogbnVtYmVyID0gMHgwMDcwNzA7XHJcbiAgICAgICAgbGV0IGNvbG9yRGVsdGEgICAgIDogbnVtYmVyID0gKDI1NiAvIHRvdGFsQ2VsbHMpICogTWF0aC5wb3coMjU2LCAyKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwICAgICAgOiBUSFJFRS5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIGxldCBjZWxsT3JpZ2luIDogVEhSRUUuVmVjdG9yMyA9IG9yaWdpbi5jbG9uZSgpO1xyXG4gICAgICAgIGxldCBjZWxsQ29sb3IgIDogbnVtYmVyID0gYmFzZUNvbG9yO1xyXG4gICAgICAgIGZvciAobGV0IGlSb3cgOiBudW1iZXIgPSAwOyBpUm93IDwgZ3JpZERpdmlzaW9uczsgaVJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlDb2x1bW4gOiBudW1iZXIgPSAwOyBpQ29sdW1uIDwgZ3JpZERpdmlzaW9uczsgaUNvbHVtbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe2NvbG9yIDogY2VsbENvbG9yfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKGNlbGxPcmlnaW4sIGNlbGxCYXNlLCBjZWxsQmFzZSwgY2VsbEhlaWdodCwgY2VsbE1hdGVyaWFsKTtcclxuICAgICAgICAgICAgICAgIGdyb3VwLmFkZCAoY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2VsbE9yaWdpbi54ICs9IGNlbGxCYXNlO1xyXG4gICAgICAgICAgICAgICAgY2VsbE9yaWdpbi56ICs9IGNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBjZWxsQ29sb3IgICAgKz0gY29sb3JEZWx0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNlbGxPcmlnaW4ueCA9IG9yaWdpbi54O1xyXG4gICAgICAgIGNlbGxPcmlnaW4ueSArPSBjZWxsQmFzZTtcclxuICAgICAgICB9ICAgICAgIFxyXG5cclxuICAgICAgICBncm91cC5uYW1lID0gJ0NoZWNrZXJib2FyZCc7XHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsKGdyb3VwKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcblxyXG5pbXBvcnQge1N0YW5kYXJkVmlld30gICAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtPQkpMb2FkZXJ9ICAgICAgICAgICAgICAgICAgZnJvbSBcIk9CSkxvYWRlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1Rlc3RNb2RlbExvYWRlciwgVGVzdE1vZGVsfSBmcm9tICdUZXN0TW9kZWxMb2FkZXInXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IHRlc3RNb2RlbENvbG9yID0gJyM1NThkZTgnO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRlciB7XHJcblxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBMb2FkZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYSBtb2RlbCBiYXNlZCBvbiB0aGUgbW9kZWwgbmFtZSBhbmQgcGF0aCBlbWJlZGRlZCBpbiB0aGUgSFRNTCBwYWdlLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovICAgIFxyXG4gICAgbG9hZE9CSk1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsTmFtZUVsZW1lbnQgOiBIVE1MRWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZWxOYW1lJyk7XHJcbiAgICAgICAgbGV0IG1vZGVsUGF0aEVsZW1lbnQgOiBIVE1MRWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZWxQYXRoJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGxldCBtb2RlbE5hbWUgICAgOiBzdHJpbmcgPSBtb2RlbE5hbWVFbGVtZW50LnRleHRDb250ZW50O1xyXG4gICAgICAgIGxldCBtb2RlbFBhdGggICAgOiBzdHJpbmcgPSBtb2RlbFBhdGhFbGVtZW50LnRleHRDb250ZW50O1xyXG4gICAgICAgIGxldCBmaWxlTmFtZSAgICAgOiBzdHJpbmcgPSBtb2RlbFBhdGggKyBtb2RlbE5hbWU7XHJcblxyXG4gICAgICAgIGxldCBtYW5hZ2VyID0gbmV3IFRIUkVFLkxvYWRpbmdNYW5hZ2VyKCk7XHJcbiAgICAgICAgbGV0IGxvYWRlciAgPSBuZXcgT0JKTG9hZGVyKG1hbmFnZXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvblByb2dyZXNzID0gZnVuY3Rpb24gKHhocikge1xyXG5cclxuICAgICAgICAgICAgaWYgKHhoci5sZW5ndGhDb21wdXRhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0geGhyLmxvYWRlZCAvIHhoci50b3RhbCAqIDEwMDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBlcmNlbnRDb21wbGV0ZS50b0ZpeGVkKDIpICsgJyUgZG93bmxvYWRlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IG9uRXJyb3IgPSBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgfTsgICAgICAgIFxyXG5cclxuICAgICAgICBsb2FkZXIubG9hZChmaWxlTmFtZSwgZnVuY3Rpb24gKGdyb3VwIDogVEhSRUUuR3JvdXApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXdlci5zZXRNb2RlbChncm91cCk7XHJcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIHBhcmFtZXRyaWMgdGVzdCBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqIEBwYXJhbSBtb2RlbFR5cGUgVGVzdCBtb2RlbCB0eXBlIChTcGhlciwgQm94LCBldGMuKVxyXG4gICAgICovICAgIFxyXG4gICAgbG9hZFBhcmFtZXRyaWNUZXN0TW9kZWwgKHZpZXdlciA6IFZpZXdlciwgbW9kZWxUeXBlIDogVGVzdE1vZGVsKSB7XHJcblxyXG4gICAgICAgIGxldCB0ZXN0TG9hZGVyID0gbmV3IFRlc3RNb2RlbExvYWRlcigpO1xyXG4gICAgICAgIHRlc3RMb2FkZXIubG9hZFRlc3RNb2RlbCh2aWV3ZXIsIG1vZGVsVHlwZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlcn0gICAgICAgICAgICAgICAgZnJvbSAnRGVwdGhCdWZmZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBNZXNoVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWVzaFZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1lc2hWaWV3ZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIG5hbWUgVmlld2VyIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gcHJldmlld0NhbnZhc0lkIEhUTUwgZWxlbWVudCB0byBob3N0IHRoZSB2aWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgOiBzdHJpbmcsIHByZXZpZXdDYW52YXNJZCA6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyKG5hbWUsIHByZXZpZXdDYW52YXNJZCk7XHJcblxyXG4gICAgICAgIC8vb3ZlcnJpZGVcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5odG1sTG9nZ2VyOyAgICAgICBcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uXHJcbiAgICAvKipcclxuICAgICAqIFBvcHVsYXRlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBwb3B1bGF0ZVNjZW5lICgpIHsgICAgICAgXHJcblxyXG4gICAgICAgIGxldCBoZWlnaHQgPSAxO1xyXG4gICAgICAgIGxldCB3aWR0aCAgPSAxO1xyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlUGxhbmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKCksIGhlaWdodCwgd2lkdGgsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbChEZXB0aEJ1ZmZlci5EZWZhdWx0TWVzaFBob25nTWF0ZXJpYWxQYXJhbWV0ZXJzKSk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGxpZ2h0aW5nIHRvIHRoZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nKCkge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC4yKTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCg0LCA0LCA0KTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufSIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuaW1wb3J0ICogYXMgZGF0ICAgIGZyb20gJ2RhdC1ndWknXHJcblxyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIE1vZGVsVmlld2VyU2V0dGluZ3Mge1xyXG5cclxuICAgIGRpc3BsYXlHcmlkICAgIDogYm9vbGVhbjtcclxuICAgIGdlbmVyYXRlUmVsaWVmIDogKCkgPT4gdm9pZDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoZ2VuZXJhdGVSZWxpZWYgOiAoKSA9PiBhbnkpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmRpc3BsYXlHcmlkICAgID0gdHJ1ZTsgXHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVJlbGllZiA9IGdlbmVyYXRlUmVsaWVmO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogTW9kZWxWaWV3ZXIgVUkgQ29udHJvbHMuXHJcbiAqLyAgICBcclxuZXhwb3J0IGNsYXNzIE1vZGVsVmlld2VyQ29udHJvbHMge1xyXG5cclxuICAgIF9tb2RlbFZpZXdlciAgICAgICAgIDogTW9kZWxWaWV3ZXI7ICAgICAgICAgICAgICAgICAgICAgLy8gYXNzb2NpYXRlZCB2aWV3ZXJcclxuICAgIF9tb2RlbFZpZXdlclNldHRpbmdzIDogTW9kZWxWaWV3ZXJTZXR0aW5nczsgICAgICAgICAgICAgLy8gVUkgc2V0dGluZ3NcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsVmlld2VyQ29udHJvbHNcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbFZpZXdlciA6IE1vZGVsVmlld2VyKSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIgPSBtb2RlbFZpZXdlcjtcclxuXHJcbiAgICAgICAgLy8gVUkgQ29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDb250cm9scygpO1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEV2ZW50IEhhbmRsZXJzXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIHJlbGllZiBmcm9tIHRoZSBjdXJyZW50IG1vZGVsIGNhbWVyYS5cclxuICAgICAqL1xyXG4gICAgZ2VuZXJhdGVSZWxpZWYoKSA6IHZvaWQgeyBcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIuZ2VuZXJhdGVSZWxpZWYoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MgPSBuZXcgTW9kZWxWaWV3ZXJTZXR0aW5ncyh0aGlzLmdlbmVyYXRlUmVsaWVmLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBJbml0IGRhdC5ndWkgYW5kIGNvbnRyb2xzIGZvciB0aGUgVUlcclxuICAgICAgICBsZXQgZ3VpID0gbmV3IGRhdC5HVUkoe1xyXG4gICAgICAgICAgICBhdXRvUGxhY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICB3aWR0aDogMzIwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IG1lbnVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLl9tb2RlbFZpZXdlci5jb250YWluZXJJZCk7XHJcbiAgICAgICAgbWVudURpdi5hcHBlbmRDaGlsZChndWkuZG9tRWxlbWVudCk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTW9kZWxWaWV3ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICBcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgICAgIGxldCBtb2RlbFZpZXdlck9wdGlvbnMgPSBndWkuYWRkRm9sZGVyKCdNb2RlbFZpZXdlciBPcHRpb25zJyk7XHJcblxyXG4gICAgICAgIC8vIEdyaWRcclxuICAgICAgICBsZXQgY29udHJvbERpc3BsYXlHcmlkID0gbW9kZWxWaWV3ZXJPcHRpb25zLmFkZCh0aGlzLl9tb2RlbFZpZXdlclNldHRpbmdzLCAnZGlzcGxheUdyaWQnKS5uYW1lKCdEaXNwbGF5IEdyaWQnKTtcclxuICAgICAgICBjb250cm9sRGlzcGxheUdyaWQub25DaGFuZ2UgKCh2YWx1ZSA6IGJvb2xlYW4pID0+IHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl9tb2RlbFZpZXdlci5kaXNwbGF5R3JpZCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEdlbmVyYXRlIFJlbGllZlxyXG4gICAgICAgIGxldCBjb250cm9sR2VuZXJhdGVSZWxpZWYgPSBtb2RlbFZpZXdlck9wdGlvbnMuYWRkKHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MsICdnZW5lcmF0ZVJlbGllZicpLm5hbWUoJ0dlbmVyYXRlIFJlbGllZicpO1xyXG5cclxuICAgICAgICBtb2RlbFZpZXdlck9wdGlvbnMub3BlbigpO1xyXG4gICAgfSAgICBcclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7U3RhbmRhcmRWaWV3fSAgICAgICAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtFdmVudE1hbmFnZXIsIEV2ZW50VHlwZX0gICAgICAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge01hdGVyaWFsc30gICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTWF0ZXJpYWxzJ1xyXG5pbXBvcnQge01vZGVsVmlld2VyQ29udHJvbHN9ICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld2VyQ29udHJvbHNcIlxyXG5pbXBvcnQge0xvZ2dlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IE9iamVjdE5hbWVzID0ge1xyXG4gICAgR3JpZCA6ICAnR3JpZCdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9Nb2RlbFZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1vZGVsVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuXHJcbiAgICBfbW9kZWxWaWV3ZXJDb250cm9scyA6IE1vZGVsVmlld2VyQ29udHJvbHM7ICAgICAgICAgICAgIC8vIFVJIGNvbnRyb2xzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTW9kZWxWaWV3ZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIG5hbWUgVmlld2VyIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gbW9kZWxDYW52YXNJZCBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBtb2RlbENhbnZhc0lkIDogc3RyaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIgKG5hbWUsIG1vZGVsQ2FudmFzSWQpOyAgICAgICBcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBzZXRNb2RlbCh2YWx1ZSA6IFRIUkVFLkdyb3VwKSB7XHJcblxyXG4gICAgICAgIC8vIENhbGwgYmFzZSBjbGFzcyBwcm9wZXJ0eSB2aWEgc3VwZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzQ0NjUgICAgICAgIFxyXG4gICAgICAgIHN1cGVyLnNldE1vZGVsKHZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhQ29udHJvbHMuc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncygpO1xyXG5cclxuICAgICAgICAvLyBkaXNwYXRjaCBOZXdNb2RlbCBldmVudFxyXG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRoaXMsIEV2ZW50VHlwZS5OZXdNb2RlbCwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3B1bGF0ZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDMwMCwgMzAsIDB4ODZlNmZmLCAweDk5OTk5OSk7XHJcbiAgICAgICAgaGVscGVyLm5hbWUgPSBPYmplY3ROYW1lcy5HcmlkO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChoZWxwZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhbCBpbml0aWFsaXphdGlvblxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogVUkgY29udHJvbHMgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVVSUNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBzdXBlci5pbml0aWFsaXplVUlDb250cm9scygpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXJDb250cm9scyA9IG5ldyBNb2RlbFZpZXdlckNvbnRyb2xzKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2NlbmVcclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSB0aGUgcmVmZXJlbmNlIGdyaWQuXHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlHcmlkKHZpc2libGUgOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIGxldCBncmlkR2VvbWV0cnkgOiBUSFJFRS5PYmplY3QzRCA9IHRoaXMuX3NjZW5lLmdldE9iamVjdEJ5TmFtZShPYmplY3ROYW1lcy5HcmlkKTtcclxuICAgICAgICBncmlkR2VvbWV0cnkudmlzaWJsZSA9IHZpc2libGU7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBEaXNwbGF5IGdyaWQgPSAke3Zpc2libGV9YCk7XHJcbiAgICB9IFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBNZXNoIEdlbmVyYXRpb25cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGEgcmVsaWVmIGZyb20gdGhlIGN1cnJlbnQgbW9kZWwgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZW5lcmF0ZVJlbGllZigpIDogdm9pZCB7IFxyXG4gICAgICAgIFxyXG4gICAgLy8gcGl4ZWxzXHJcbiAgICBsZXQgd2lkdGggID0gNTEyO1xyXG4gICAgbGV0IGhlaWdodCA9IHdpZHRoIC8gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgIGxldCBmYWN0b3J5ID0gbmV3IERlcHRoQnVmZmVyRmFjdG9yeSh7d2lkdGggOiB3aWR0aCwgaGVpZ2h0IDogaGVpZ2h0LCBtb2RlbCA6IHRoaXMubW9kZWwsIGNhbWVyYSA6IHRoaXMuY2FtZXJhLCBhZGRDYW52YXNUb0RPTSA6IGZhbHNlfSk7ICAgXHJcblxyXG4gICAgbGV0IHByZXZpZXdNZXNoIDogVEhSRUUuTWVzaCA9IGZhY3RvcnkubWVzaEdlbmVyYXRlKHt9KTsgICBcclxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRoaXMsIEV2ZW50VHlwZS5NZXNoR2VuZXJhdGUsIHByZXZpZXdNZXNoKTtcclxuXHJcbiAgICBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyLmFkZEluZm9NZXNzYWdlKCdSZWxpZWYgZ2VuZXJhdGVkJyk7XHJcbn1cclxuLy8jZW5kcmVnaW9uXHJcbn0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiQ2FtZXJhXCJcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtFdmVudFR5cGUsIE1SRXZlbnQsIEV2ZW50TWFuYWdlcn0gICBmcm9tICdFdmVudE1hbmFnZXInXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge01lc2hWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNZXNoVmlld2VyXCJcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge09CSkxvYWRlcn0gICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJPQkpMb2FkZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1Rlc3RNb2RlbH0gICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1Rlc3RNb2RlbExvYWRlcidcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiVmlld2VyXCJcclxuICAgIFxyXG5leHBvcnQgY2xhc3MgTW9kZWxSZWxpZWYge1xyXG5cclxuICAgIF9tZXNoVmlld2VyICAgICAgICAgOiBNZXNoVmlld2VyO1xyXG4gICAgX21vZGVsVmlld2VyICAgICAgICA6IE1vZGVsVmlld2VyO1xyXG4gICAgX2xvYWRlciAgICAgICAgICAgICA6IExvYWRlcjtcclxuICAgIFxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNb2RlbFJlbGllZlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgXHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuICAgIC8qKlxyXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgbWVzaCBnZW5lcmF0aW9uLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IE1lc2ggZ2VuZXJhdGlvbiBldmVudC5cclxuICAgICAqIEBwYXJhbXMgbWVzaCBOZXdseS1nZW5lcmF0ZWQgbWVzaC5cclxuICAgICAqL1xyXG4gICAgb25NZXNoR2VuZXJhdGUgKGV2ZW50IDogTVJFdmVudCwgbWVzaCA6IFRIUkVFLk1lc2gpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fbWVzaFZpZXdlci5zZXRNb2RlbChtZXNoKTtcclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyLmZpdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIG5ldyBtb2RlbC5cclxuICAgICAqIEBwYXJhbSBldmVudCBOZXdNb2RlbCBldmVudC5cclxuICAgICAqIEBwYXJhbSBtb2RlbCBOZXdseSBsb2FkZWQgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIG9uTmV3TW9kZWwgKGV2ZW50IDogTVJFdmVudCwgbW9kZWwgOiBUSFJFRS5Hcm91cCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyLnNldENhbWVyYVRvU3RhbmRhcmRWaWV3KFN0YW5kYXJkVmlldy5Gcm9udCk7ICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyLnNldENhbWVyYVRvU3RhbmRhcmRWaWV3KFN0YW5kYXJkVmlldy5Gcm9udCk7ICAgICAgIFxyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbiAgICAvKipcclxuICAgICAqIExhdW5jaCB0aGUgbW9kZWwgVmlld2VyLlxyXG4gICAgICovXHJcbiAgICBydW4gKCkge1xyXG5cclxuICAgICAgICBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyLmFkZEluZm9NZXNzYWdlICgnTW9kZWxSZWxpZWYgc3RhcnRlZCcpOyAgIFxyXG4gICAgICAgXHJcbiAgICAgICAgLy8gTWVzaCBQcmV2aWV3XHJcbiAgICAgICAgdGhpcy5fbWVzaFZpZXdlciA9ICBuZXcgTWVzaFZpZXdlcignTWVzaFZpZXdlcicsICdtZXNoQ2FudmFzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTW9kZWwgVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyID0gbmV3IE1vZGVsVmlld2VyKCdNb2RlbFZpZXdlcicsICdtb2RlbENhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyLmV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5NZXNoR2VuZXJhdGUsIHRoaXMub25NZXNoR2VuZXJhdGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIuZXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLk5ld01vZGVsLCAgICAgdGhpcy5vbk5ld01vZGVsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIExvYWRlclxyXG4gICAgICAgIHRoaXMuX2xvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgLy8gT0JKIE1vZGVsc1xyXG4gICAgICAgIHRoaXMuX2xvYWRlci5sb2FkT0JKTW9kZWwgKHRoaXMuX21vZGVsVmlld2VyKTtcclxuXHJcbiAgICAgICAgLy8gVGVzdCBNb2RlbHNcclxuLy8gICAgICB0aGlzLl9sb2FkZXIubG9hZFBhcmFtZXRyaWNUZXN0TW9kZWwodGhpcy5fbW9kZWxWaWV3ZXIsIFRlc3RNb2RlbC5DaGVja2VyYm9hcmQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgbW9kZWxSZWxpZWYgPSBuZXcgTW9kZWxSZWxpZWYoKTtcclxubW9kZWxSZWxpZWYucnVuKCk7XHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7YXNzZXJ0fSAgIGZyb20gJ2NoYWknXHJcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlcn0gZnJvbSAnRGVwdGhCdWZmZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9IGZyb20gJ01hdGgnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8qKlxyXG4gKiBAZXhwb3J0cyBWaWV3ZXIvVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVW5pdFRlc3RzIHtcclxuICAgXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBVbml0VGVzdHNcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgICAgICAgXHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBzdGF0aWMgVmVydGV4TWFwcGluZyAoZGVwdGhCdWZmZXIgOiBEZXB0aEJ1ZmZlciwgbWVzaCA6IFRIUkVFLk1lc2gpIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hHZW9tZXRyeSA6IFRIUkVFLkdlb21ldHJ5ID0gPFRIUkVFLkdlb21ldHJ5PiBtZXNoLmdlb21ldHJ5O1xyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBtZXNoR2VvbWV0cnkuYm91bmRpbmdCb3g7XHJcblxyXG4gICAgICAgIC8vIHdpZHRoICA9IDMgICAgICAgICAgICAgIDMgICA0ICAgNVxyXG4gICAgICAgIC8vIGNvbHVtbiA9IDIgICAgICAgICAgICAgIDAgICAxICAgMlxyXG4gICAgICAgIC8vIGJ1ZmZlciBsZW5ndGggPSA2XHJcblxyXG4gICAgICAgIC8vIFRlc3QgUG9pbnRzICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdCAgPSBib3VuZGluZ0JveC5taW47XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHQgPSBuZXcgVEhSRUUuVmVjdG9yMyAoYm91bmRpbmdCb3gubWF4LngsIGJvdW5kaW5nQm94Lm1pbi55LCAwKTtcclxuICAgICAgICBsZXQgdXBwZXJSaWdodCA9IGJvdW5kaW5nQm94Lm1heDtcclxuICAgICAgICBsZXQgdXBwZXJMZWZ0ICA9IG5ldyBUSFJFRS5WZWN0b3IzIChib3VuZGluZ0JveC5taW4ueCwgYm91bmRpbmdCb3gubWF4LnksIDApO1xyXG4gICAgICAgIGxldCBjZW50ZXIgICAgID0gYm91bmRpbmdCb3guZ2V0Q2VudGVyKCk7XHJcblxyXG4gICAgICAgIC8vIEV4cGVjdGVkIFZhbHVlc1xyXG4gICAgICAgIGxldCBidWZmZXJMZW5ndGggICAgOiBudW1iZXIgPSAoZGVwdGhCdWZmZXIud2lkdGggKiBkZXB0aEJ1ZmZlci5oZWlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZmlyc3RDb2x1bW4gICA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGxhc3RDb2x1bW4gICAgOiBudW1iZXIgPSBkZXB0aEJ1ZmZlci53aWR0aCAtIDE7XHJcbiAgICAgICAgbGV0IGNlbnRlckNvbHVtbiAgOiBudW1iZXIgPSBNYXRoLnJvdW5kKGRlcHRoQnVmZmVyLndpZHRoIC8gMik7XHJcbiAgICAgICAgbGV0IGZpcnN0Um93ICAgICAgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBsYXN0Um93ICAgICAgIDogbnVtYmVyID0gZGVwdGhCdWZmZXIuaGVpZ2h0IC0gMTtcclxuICAgICAgICBsZXQgY2VudGVyUm93ICAgICA6IG51bWJlciA9IE1hdGgucm91bmQoZGVwdGhCdWZmZXIuaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIGxldCBsb3dlckxlZnRJbmRleCAgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBsb3dlclJpZ2h0SW5kZXggOiBudW1iZXIgPSBkZXB0aEJ1ZmZlci53aWR0aCAtIDE7XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHRJbmRleCA6IG51bWJlciA9IGJ1ZmZlckxlbmd0aCAtIDE7XHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdEluZGV4ICA6IG51bWJlciA9IGJ1ZmZlckxlbmd0aCAtIGRlcHRoQnVmZmVyLndpZHRoO1xyXG4gICAgICAgIGxldCBjZW50ZXJJbmRleCAgICAgOiBudW1iZXIgPSAoY2VudGVyUm93ICogZGVwdGhCdWZmZXIud2lkdGgpICsgIE1hdGgucm91bmQoZGVwdGhCdWZmZXIud2lkdGggLyAyKTtcclxuXHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdEluZGljZXMgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGZpcnN0Um93LCBmaXJzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHRJbmRpY2VzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGZpcnN0Um93LCBsYXN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgdXBwZXJSaWdodEluZGljZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIobGFzdFJvdywgbGFzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdEluZGljZXMgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGxhc3RSb3csIGZpcnN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgY2VudGVySW5kaWNlcyAgICAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoY2VudGVyUm93LCBjZW50ZXJDb2x1bW4pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbmRleCAgIDogbnVtYmVyXHJcbiAgICAgICAgbGV0IGluZGljZXMgOiBUSFJFRS5WZWN0b3IyO1xyXG5cclxuICAgICAgICAvLyBMb3dlciBMZWZ0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyhsb3dlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIGxvd2VyTGVmdEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCAgID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleChsb3dlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIGxvd2VyTGVmdEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gTG93ZXIgUmlnaHRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKGxvd2VyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIGxvd2VyUmlnaHRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KGxvd2VyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIGxvd2VyUmlnaHRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIFVwcGVyIFJpZ2h0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyh1cHBlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCB1cHBlclJpZ2h0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleCh1cHBlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCB1cHBlclJpZ2h0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBVcHBlciBMZWZ0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyh1cHBlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIHVwcGVyTGVmdEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgodXBwZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCB1cHBlckxlZnRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIENlbnRlclxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXMoY2VudGVyLCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCBjZW50ZXJJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KGNlbnRlciwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgY2VudGVySW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIH0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzLCBPYmplY3ROYW1lc30gICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvYWRlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdMb2FkZXInXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtNZXNoVmlld2VyfSAgICAgICAgICAgICAgICAgZnJvbSBcIk1lc2hWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUcmFja2JhbGxDb250cm9sc30gICAgICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FtZXJhU2V0dGluZ3Mge1xyXG4gICAgcG9zaXRpb246ICAgICAgIFRIUkVFLlZlY3RvcjM7ICAgICAgICAvLyBsb2NhdGlvbiBvZiBjYW1lcmFcclxuICAgIHRhcmdldDogICAgICAgICBUSFJFRS5WZWN0b3IzOyAgICAgICAgLy8gdGFyZ2V0IHBvaW50XHJcbiAgICBuZWFyOiAgICAgICAgICAgbnVtYmVyOyAgICAgICAgICAgICAgIC8vIG5lYXIgY2xpcHBpbmcgcGxhbmVcclxuICAgIGZhcjogICAgICAgICAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gZmFyIGNsaXBwaW5nIHBsYW5lXHJcbiAgICBmaWVsZE9mVmlldzogICAgbnVtYmVyOyAgICAgICAgICAgICAgIC8vIGZpZWxkIG9mIHZpZXdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBDYW1lcmFXb3JrYmVuY2hcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmFWaWV3ZXIgZXh0ZW5kcyBWaWV3ZXIge1xyXG5cclxuICAgIHBvcHVsYXRlU2NlbmUoKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmlhZCA9IEdyYXBoaWNzLmNyZWF0ZVdvcmxkQXhlc1RyaWFkKG5ldyBUSFJFRS5WZWN0b3IzKCksIDEsIDAuMjUsIDAuMjUpO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZCh0cmlhZCk7XHJcblxyXG4gICAgICAgIGxldCBib3ggOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlQm94TWVzaChuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAtMiksIDEsIDIsIDIsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiAweGZmMDAwMH0pKTtcclxuICAgICAgICBib3gucm90YXRpb24uc2V0KE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgICAgIGJveC51cGRhdGVNYXRyaXgoKTtcclxuXHJcbiAgICAgICAgbGV0IGJveENsb25lID0gR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QoYm94LCBuZXcgVEhSRUUuTWF0cml4NCgpKTtcclxuICAgICAgICB0aGlzLm1vZGVsLmFkZChib3hDbG9uZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGhlcmUgOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMyg0LCAyLCAtMSksIDEsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiAweDAwZmYwMH0pKTtcclxuICAgICAgICB0aGlzLm1vZGVsLmFkZChzcGhlcmUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVEZWZhdWx0Q2FtZXJhU2V0dGluZ3MgKCkgOiBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgICAgIGxldCBzZXR0aW5ncyA6IENhbWVyYVNldHRpbmdzID0ge1xyXG5cclxuICAgICAgICAgICAgcG9zaXRpb246ICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuMCwgMC4wLCAyMC4wKSxcclxuICAgICAgICAgICAgdGFyZ2V0OiAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApLFxyXG4gICAgICAgICAgICBuZWFyOiAgICAgICAgICAgIDIuMCxcclxuICAgICAgICAgICAgZmFyOiAgICAgICAgICAgIDUwLjAsXHJcbiAgICAgICAgICAgIGZpZWxkT2ZWaWV3OiAgICAzNyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL3d3dy5uaWtvbmlhbnMub3JnL3Jldmlld3MvZm92LXRhYmxlc1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXR0aW5nczsgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICBuZWFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXI7XHJcbiAgICBmYXJDbGlwcGluZ1BsYW5lICAgOiBudW1iZXI7XHJcbiAgICBmaWVsZE9mVmlldyAgICAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgc2hvd0JvdW5kaW5nQm94ZXMgOiAoKSA9PiB2b2lkO1xyXG4gICAgc2V0Q2xpcHBpbmdQbGFuZXMgOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIHNob3dCb3VuZGluZ0JveGVzIDogKCkgPT4gYW55LCBzZXRDbGlwcGluZ1BsYW5lcyA6ICgpID0+IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lICAgID0gY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5mYXJDbGlwcGluZ1BsYW5lICAgICA9IGNhbWVyYS5mYXI7XHJcbiAgICAgICAgdGhpcy5maWVsZE9mVmlldyAgICAgICAgICA9IGNhbWVyYS5mb3Y7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMgPSBzaG93Qm91bmRpbmdCb3hlcztcclxuICAgICAgICB0aGlzLnNldENsaXBwaW5nUGxhbmVzICA9IHNldENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEFwcFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBcclxuICAgIF9sb2dnZXIgICAgICAgICA6IENvbnNvbGVMb2dnZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgOiBMb2FkZXI7XHJcbiAgICBfdmlld2VyICAgICAgICAgOiBDYW1lcmFWaWV3ZXI7XHJcbiAgICBfdmlld2VyQ29udHJvbHMgOiBWaWV3ZXJDb250cm9scztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byB0aGUgbW9kZWwgZXh0ZW50cyBpbiBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsICAgICAgICAgICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgPSB0aGlzLl92aWV3ZXIubW9kZWw7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgbW9kZWwgKGFuZCBnZW9tZXRyeSEpXHJcbiAgICAgICAgbGV0IG1vZGVsVmlldyA9IEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXcgPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGJveCBpcyB3b3JsZC1heGlzIGFsaWduZWQuIFxyXG4gICAgICAgIC8vIElOdiBWaWV3IGNvb3JkaW5hdGVzLCB0aGUgY2FtZXJhIGlzIGF0IHRoZSBvcmlnaW4uXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIG5lYXIgcGxhbmUgaXMgdGhlIG1heGltdW0gWiBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBmYXIgcGxhbmUgaXMgdGhlIG1pbmltdW0gWiBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICAgIGxldCBuZWFyUGxhbmUgPSAtYm91bmRpbmdCb3hWaWV3Lm1heC56O1xyXG4gICAgICAgIGxldCBmYXJQbGFuZSAgPSAtYm91bmRpbmdCb3hWaWV3Lm1pbi56O1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scy5uZWFyQ2xpcHBpbmdQbGFuZSA9IG5lYXJQbGFuZTtcclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scy5mYXJDbGlwcGluZ1BsYW5lICA9IGZhclBsYW5lO1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSBuZWFyUGxhbmU7XHJcbiAgICAgICAgdGhpcy5fdmlld2VyLmNhbWVyYS5mYXIgID0gZmFyUGxhbmU7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgYm91bmRpbmcgYm94IG1lc2guXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0IFRhcmdldCBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgQ29sb3Igb2YgYm91bmRpbmcgYm94IG1lc2guXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUJvdW5kaW5nQm94IChvYmplY3QgOiBUSFJFRS5PYmplY3QzRCwgY29sb3IgOiBudW1iZXIpIDogVEhSRUUuTWVzaCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBib3VuZGluZ0JveCA6IFRIUkVFLkJveDMgPSBuZXcgVEhSRUUuQm94MygpO1xyXG4gICAgICAgICAgICBib3VuZGluZ0JveCA9IGJvdW5kaW5nQm94LnNldEZyb21PYmplY3Qob2JqZWN0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge2NvbG9yIDogY29sb3IsIG9wYWNpdHkgOiAxLjAsIHdpcmVmcmFtZSA6IHRydWV9KTsgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBib3VuZGluZ0JveE1lc2ggOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlQm91bmRpbmdCb3hNZXNoRnJvbUJvdW5kaW5nQm94KGJvdW5kaW5nQm94LmdldENlbnRlcigpLCBib3VuZGluZ0JveCwgbWF0ZXJpYWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRpbmdCb3hNZXNoO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93IHRoZSBjbGlwcGluZyBwbGFuZXMgb2YgdGhlIG1vZGVsIGluIFZpZXcgYW5kIFdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzaG93Qm91bmRpbmdCb3hlcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsICAgICAgICAgICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgPSB0aGlzLl92aWV3ZXIubW9kZWw7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkICAgICAgICA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UgOiBUSFJFRS5NYXRyaXg0ID0gdGhpcy5fdmlld2VyLmNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2U7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBleGlzdGluZyBCb3VuZGluZ0JveFxyXG4gICAgICAgIG1vZGVsLnJlbW92ZShtb2RlbC5nZXRPYmplY3RCeU5hbWUoT2JqZWN0TmFtZXMuQm91bmRpbmdCb3gpKTtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgbW9kZWwgKGFuZCBnZW9tZXRyeSEpXHJcbiAgICAgICAgbGV0IG1vZGVsVmlldyA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgLy8gY2xlYXIgZW50aXJlIHNjZW5lXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4obW9kZWwsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgbW9kZWwuYWRkKG1vZGVsVmlldyk7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXcgPSB0aGlzLmNyZWF0ZUJvdW5kaW5nQm94KG1vZGVsVmlldywgMHhmZjAwZmYpO1xyXG4gICAgICAgIG1vZGVsLmFkZChib3VuZGluZ0JveFZpZXcpO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gbW9kZWwgYmFjayBmcm9tIFZpZXcgdG8gV29ybGRcclxuICAgICAgICBsZXQgbW9kZWxXb3JsZCA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChtb2RlbFZpZXcsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBtb2RlbC5hZGQobW9kZWxXb3JsZCk7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBib3VuZGluZyBib3ggYmFjayBmcm9tIFZpZXcgdG8gV29ybGRcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZCA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChib3VuZGluZ0JveFZpZXcsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBtb2RlbC5hZGQoYm91bmRpbmdCb3hXb3JsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplVmlld2VyQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlckNvbnRyb2xzID0gbmV3IFZpZXdlckNvbnRyb2xzKHRoaXMuX3ZpZXdlci5jYW1lcmEsIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMuYmluZCh0aGlzKSwgdGhpcy5zZXRDbGlwcGluZ1BsYW5lcy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgdmFyIGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBzZXR0aW5nc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5nc0NvbnRyb2xzJyk7XHJcbiAgICAgICAgc2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG4gICAgICAgIHZhciBmb2xkZXJPcHRpb25zID0gZ3VpLmFkZEZvbGRlcignQ2FtZXJhIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gTmVhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIGxldCBtaW5pbXVtICA9ICAgMDtcclxuICAgICAgICBsZXQgbWF4aW11bSAgPSAxMDA7XHJcbiAgICAgICAgbGV0IHN0ZXBTaXplID0gICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xOZWFyQ2xpcHBpbmdQbGFuZSA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnbmVhckNsaXBwaW5nUGxhbmUnKS5uYW1lKCdOZWFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTtcclxuICAgICAgICBjb250cm9sTmVhckNsaXBwaW5nUGxhbmUgLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAxO1xyXG4gICAgICAgIG1heGltdW0gID0gNTAwO1xyXG4gICAgICAgIHN0ZXBTaXplID0gICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGYXJDbGlwcGluZ1BsYW5lID0gZm9sZGVyT3B0aW9ucy5hZGQodGhpcy5fdmlld2VyQ29udHJvbHMsICdmYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnRmFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZhckNsaXBwaW5nUGxhbmUgLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIG1pbmltdW0gID0gMjU7XHJcbiAgICAgICAgbWF4aW11bSAgPSA3NTtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXc9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnZmllbGRPZlZpZXcnKS5uYW1lKCdGaWVsZCBvZiBWaWV3JykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZpZWxkT2ZWaWV3IC5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS5mb3YgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIFNob3cgQm91bmRpbmcgQm94ZXNcclxuICAgICAgICBsZXQgY29udHJvbFNob3dCb3VuZGluZ0JveGVzID0gZm9sZGVyT3B0aW9ucy5hZGQodGhpcy5fdmlld2VyQ29udHJvbHMsICdzaG93Qm91bmRpbmdCb3hlcycpLm5hbWUoJ1Nob3cgQm91bmRpbmcgQm94ZXMnKTtcclxuXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgUGxhbmVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTZXRDbGlwcGluZ1BsYW5lcyA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnc2V0Q2xpcHBpbmdQbGFuZXMnKS5uYW1lKCdTZXQgQ2xpcHBpbmcgUGxhbmVzJyk7XHJcblxyXG4gICAgICAgIGZvbGRlck9wdGlvbnMub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBydW4gKCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX3ZpZXdlciA9IG5ldyBDYW1lcmFWaWV3ZXIoJ0NhbWVyYVZpZXdlcicsICd2aWV3ZXJDYW52YXMnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXdlckNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBhcHAgPSBuZXcgQXBwO1xyXG5hcHAucnVuKCk7XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlclRlc3RcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlclRlc3Qge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBtYWluICgpIHtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGRlcHRoQnVmZmVyVGVzdCA9IG5ldyBEZXB0aEJ1ZmZlclRlc3QoKTtcclxuZGVwdGhCdWZmZXJUZXN0Lm1haW4oKTtcclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxubGV0IGxvZ2dlciA9IG5ldyBIVE1MTG9nZ2VyKCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIFdpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFdpZGdldCB7XHJcbiAgICBcclxuICAgIG5hbWUgIDogc3RyaW5nO1xyXG4gICAgcHJpY2UgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJpY2UgOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lICA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlcmF0ZVxyXG4gICAgICovXHJcbiAgICBvcGVyYXRlICgpIHtcclxuICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UoYCR7dGhpcy5uYW1lfSBvcGVyYXRpbmcuLi4uYCk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBTdXBlcldpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbG9yV2lkZ2V0IGV4dGVuZHMgV2lkZ2V0IHtcclxuXHJcbiAgICBjb2xvciA6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmljZSA6IG51bWJlciwgY29sb3IgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIgKG5hbWUsIHByaWNlKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFuZFBhcmVudCB7XHJcblxyXG4gICAgZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmdyYW5kcGFyZW50UHJvcGVydHkgID0gZ3JhbmRwYXJlbnRQcm9wZXJ0eSA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJlbnQgZXh0ZW5kcyBHcmFuZFBhcmVudHtcclxuICAgIFxyXG4gICAgcGFyZW50UHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZywgcGFyZW50UHJvcGVydHkgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoZ3JhbmRwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRQcm9wZXJ0eSA9IHBhcmVudFByb3BlcnR5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBQYXJlbnR7XHJcbiAgICBcclxuICAgIGNoaWxkUHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5IDogc3RyaW5nLCBwYXJlbnRQcm9wZXJ0eSA6IHN0cmluZywgY2hpbGRQcm9wZXJ0eSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBzdXBlcihncmFuZHBhcmVudFByb3BlcnR5LCBwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5jaGlsZFByb3BlcnR5ID0gY2hpbGRQcm9wZXJ0eTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBJbmhlcml0YW5jZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluaGVyaXRhbmNlVGVzdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluXHJcbiAgICAgKi9cclxuICAgIG1haW4gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3aWRnZXQgPSBuZXcgV2lkZ2V0ICgnV2lkZ2V0JywgMS4wKTtcclxuICAgICAgICB3aWRnZXQub3BlcmF0ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY29sb3JXaWRnZXQgPSBuZXcgQ29sb3JXaWRnZXQgKCdDb2xvcldpZGdldCcsIDEuMCwgJ3JlZCcpO1xyXG4gICAgICAgIGNvbG9yV2lkZ2V0Lm9wZXJhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkID0gbmV3IENoaWxkKCdHYUdhJywgJ0RhZCcsICdTdGV2ZScpOyAgICBcclxuICAgIH1cclxufVxyXG5cclxubGV0IGluaGVyaXRhbmNlID0gbmV3IEluaGVyaXRhbmNlVGVzdDtcclxuaW5oZXJpdGFuY2UubWFpbigpO1xyXG4iXX0=

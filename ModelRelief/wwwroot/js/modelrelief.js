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
            boxMesh.name = Graphics.BoundingBoxName;
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
            box.name = Graphics.BoxName;
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
            plane.name = Graphics.PlaneName;
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
            sphere.name = Graphics.SphereName;
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
            if (camera) {
                var cameraHelper = new THREE.CameraHelper(camera);
                cameraHelper.visible = true;
                scene.add(cameraHelper);
            }
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
        Graphics.BoundingBoxName = 'Bounding Box';
        Graphics.BoxName = 'Box';
        Graphics.PlaneName = 'Plane';
        Graphics.SphereName = 'Sphere';
        Graphics.TriadName = 'Triad';
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
        StandardView[StandardView["Top"] = 1] = "Top";
        StandardView[StandardView["Bottom"] = 2] = "Bottom";
        StandardView[StandardView["Left"] = 3] = "Left";
        StandardView[StandardView["Right"] = 4] = "Right";
        StandardView[StandardView["Isometric"] = 5] = "Isometric";
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
         * @description Returns the camera settings to fit the model in the current view.
         * @static
         * @param {THREE.Group} model Model to fit.
         * @param {number} viewAspect Aspect ratio of view.
         * @returns {CameraSettings}
         */
        Camera.getFitViewSettings = function (model, viewAAspect) {
            var boundingBox = Camera.getDefaultBoundingBox(model);
            var verticalFieldOfViewRadians = (Camera.DefaultFieldOfView / 2) * (Math.PI / 180);
            var horizontalFieldOfViewRadians = Math.atan(viewAAspect * Math.tan(verticalFieldOfViewRadians));
            var cameraZVerticalExtents = (boundingBox.getSize().y / 2) / Math.tan(verticalFieldOfViewRadians);
            var cameraZHorizontalExtents = (boundingBox.getSize().x / 2) / Math.tan(horizontalFieldOfViewRadians);
            var cameraZ = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);
            return {
                position: new THREE.Vector3(boundingBox.getCenter().x, boundingBox.getCenter().y, boundingBox.max.z + cameraZ),
                target: boundingBox.getCenter(),
                near: Camera.DefaultNearClippingPlane,
                far: Camera.DefaultFarClippingPlane,
                fieldOfView: Camera.DefaultFieldOfView
            };
        };
        /**
         * @description Returns the camera settings to fit the model in a standard view.
         * @static
         * @param {Camera.StandardView} view Standard view (Top, Left, etc.)
         * @param {THREE.Object3D} model Model to fit.
         * @param {number} viewAspect Aspect ratio of view.
         * @returns {CameraSettings}
         */
        Camera.getStandardViewSettings = function (view, model, viewAspect) {
            return Camera.getFitViewSettings(model, viewAspect);
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
define("Viewer/Viewer", ["require", "exports", "three", "Viewer/Camera", "System/EventManager", "Viewer/Graphics", "System/Services", "Viewer/TrackballControls"], function (require, exports, THREE, Camera_2, EventManager_1, Graphics_3, Services_4, TrackballControls_1) {
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
         * @param elementToBindTo HTML element to host the viewer.
         */
        function Viewer(modelCanvasId) {
            this._eventManager = null;
            this._logger = null;
            this._scene = null;
            this._root = null;
            this._renderer = null;
            this._canvas = null;
            this._width = 0;
            this._height = 0;
            this._camera = null;
            this._defaultCameraSettings = null;
            this._controls = null;
            this._eventManager = new EventManager_1.EventManager();
            this._logger = Services_4.Services.consoleLogger;
            this._canvas = Graphics_3.Graphics.initializeCanvas(modelCanvasId);
            this._width = this._canvas.offsetWidth;
            this._height = this._canvas.offsetHeight;
            this.initialize();
            this.animate();
        }
        ;
        Object.defineProperty(Viewer.prototype, "model", {
            //#region Properties
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
        Viewer.prototype.initializeDefaultCameraSettings = function () {
            return Camera_2.Camera.getStandardViewSettings(Camera_2.StandardView.Front, this.model, this.aspectRatio);
        };
        /**
         * Initialize the viewer camera
         */
        Viewer.prototype.initializeCamera = function () {
            this._defaultCameraSettings = this.initializeDefaultCameraSettings();
            this._camera = new THREE.PerspectiveCamera(this._defaultCameraSettings.fieldOfView, this.aspectRatio, this._defaultCameraSettings.near, this._defaultCameraSettings.far);
            this.resetCameraToDefaultSettings();
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
            this._controls = new TrackballControls_1.TrackballControls(this._camera, this._renderer.domElement);
            // N.B. https://stackoverflow.com/questions/10325095/threejs-camera-lookat-has-no-effect-is-there-something-im-doing-wrong
            this._controls.position0.copy(this._camera.position);
            this._controls.target.copy(this._defaultCameraSettings.target);
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
                        var settings = Camera_2.Camera.getStandardViewSettings(Camera_2.StandardView.Front, _this.model, _this.aspectRatio);
                        _this.applyCameraSettings(settings);
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
         * @description Resets all camera properties to the defaults
         * @param {CameraSettings} settings Settings to apply to camera.
         */
        Viewer.prototype.applyCameraSettings = function (settings) {
            this._camera.position.copy(settings.position);
            this._camera.lookAt(settings.target);
            this._camera.near = settings.near;
            this._camera.far = settings.far;
            this._camera.fov = settings.fieldOfView;
            this._camera.up.set(0, 1, 0);
            this.updateCameraOnWindowResize();
            this.initializeInputControls();
        };
        /**
         * @description Sets the view camera properties to the given settings.
         * @param {StandardView} view Camera settings to apply.
         */
        Viewer.prototype.setCameraToStandardView = function (view) {
            this._defaultCameraSettings = Camera_2.Camera.getStandardViewSettings(view, this.model, this.aspectRatio);
            this.resetCameraToDefaultSettings();
        };
        /**
         * @description Resets all camera properties to the defaults.
         */
        Viewer.prototype.resetCameraToDefaultSettings = function () {
            this.applyCameraSettings(this._defaultCameraSettings);
        };
        /**
         * @description Fits the active view.
         */
        Viewer.prototype.fitView = function () {
            var fitViewSettings = Camera_2.Camera.getFitViewSettings(this.model, this._camera.aspect);
            this.applyCameraSettings(fitViewSettings);
        };
        //#endregion
        //#region Window Resize
        /**
         * Updates the scene camera to match the new window size
         */
        Viewer.prototype.updateCameraOnWindowResize = function () {
            this._camera.aspect = this.aspectRatio;
            // this._camera.lookAt(this._defaultCameraSettings.target);
            this._camera.updateProjectionMatrix();
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
            this._renderer.render(this._scene, this._camera);
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
         */
        function MeshViewer(previewCanvasId) {
            var _this = _super.call(this, previewCanvasId) || this;
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
define("Viewer/ModelViewerControls", ["require", "exports", "dat-gui", "Viewer/Camera"], function (require, exports, dat, Camera_3) {
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
        function ModelViewerSettings(camera, generateRelief) {
            this.displayGrid = true;
            this.generateRelief = generateRelief;
            this.standardView = Camera_3.StandardView.Front;
            this.nearClippingPlane = camera.near;
            this.farClippingPlane = camera.far;
            this.fieldOfView = camera.fov;
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
            this._modelViewerSettings = new ModelViewerSettings(this._modelViewer.camera, this.generateRelief.bind(this));
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById(ModelViewerControls.ContainerId);
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
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            //                                                                     Camera                                                                   //      
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            var cameraOptions = gui.addFolder('Camera Options');
            // Standard Views
            var viewOptions = {
                Front: Camera_3.StandardView.Front,
                Top: Camera_3.StandardView.Top,
                Iso: Camera_3.StandardView.Isometric,
                Left: Camera_3.StandardView.Left,
                Right: Camera_3.StandardView.Right,
                Bottom: Camera_3.StandardView.Bottom
            };
            var controlStandardViews = cameraOptions.add(this._modelViewerSettings, 'standardView', viewOptions).name('Standard View');
            controlStandardViews.onChange(function (view) {
                scope._modelViewer.setCameraToStandardView(view);
            });
            // Near Clipping Plane
            var minimum = 0.1;
            var maximum = 100;
            var stepSize = 0.1;
            var controlNearClippingPlane = cameraOptions.add(this._modelViewerSettings, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            controlNearClippingPlane.onChange(function (value) {
                scope._modelViewer.camera.near = value;
                scope._modelViewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Far Clipping Plane
            minimum = 1;
            maximum = 10000;
            stepSize = 0.1;
            var controlFarClippingPlane = cameraOptions.add(this._modelViewerSettings, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFarClippingPlane.onChange(function (value) {
                scope._modelViewer.camera.far = value;
                scope._modelViewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Field of View
            minimum = 25;
            maximum = 75;
            stepSize = 1;
            var controlFieldOfView = cameraOptions.add(this._modelViewerSettings, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFieldOfView.onChange(function (value) {
                scope._modelViewer.camera.fov = value;
                scope._modelViewer.camera.updateProjectionMatrix();
            }.bind(this));
            cameraOptions.open();
        };
        /**
         * Synchronize the UI camera settings with the target camera.
         * @param camera
         */
        ModelViewerControls.prototype.synchronizeCameraSettings = function (camera) {
            this._modelViewerSettings.nearClippingPlane = camera.near;
            this._modelViewerSettings.farClippingPlane = camera.far;
            this._modelViewerSettings.fieldOfView = camera.fov;
        };
        ModelViewerControls.ContainerId = 'modelContainer';
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
         * @param modelCanvasId HTML element to host the viewer.
         */
        function ModelViewer(modelCanvasId) {
            return _super.call(this, modelCanvasId) || this;
        }
        Object.defineProperty(ModelViewer.prototype, "camera", {
            //#region Properties
            /**
             * Gets the camera.
             */
            get: function () {
                return this._camera;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Sets the model.
         */
        ModelViewer.prototype.setModel = function (value) {
            // Call base class property via super
            // https://github.com/Microsoft/TypeScript/issues/4465        
            _super.prototype.setModel.call(this, value);
            this._modelViewerControls.synchronizeCameraSettings(this.camera);
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
            this.initializeUIControls();
        };
        /**
         * UI controls initialization.
         */
        ModelViewer.prototype.initializeUIControls = function () {
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
            this._meshViewer = new MeshViewer_1.MeshViewer('meshCanvas');
            // Model Viewer    
            this._modelViewer = new ModelViewer_1.ModelViewer('modelCanvas');
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
     * Create a bounding box mesh.
     * @param object Target object.
     * @param color Color of bounding box mesh.
     */
    function createBoundingBox(object, color) {
        var boundingBox = new THREE.Box3();
        boundingBox = boundingBox.setFromObject(object);
        var material = new THREE.MeshPhongMaterial({ color: color, opacity: 1.0, wireframe: true });
        var boundingBoxMesh = Graphics_6.Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);
        return boundingBoxMesh;
    }
    /**
     * @class
     * CameraWorkbench
     */
    var CameraViewer = (function (_super) {
        __extends(CameraViewer, _super);
        function CameraViewer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(CameraViewer.prototype, "camera", {
            /**
             * Camera
             */
            get: function () {
                return this._camera;
            },
            enumerable: true,
            configurable: true
        });
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
            // WIP: Or this._viewer.updateCamera()?
            this._viewer.camera.updateProjectionMatrix();
        };
        /**
         * Show the clipping planes of the model in View and World coordinates.
         */
        App.prototype.showBoundingBoxes = function () {
            var model = this._viewer.model;
            var cameraMatrixWorld = this._viewer.camera.matrixWorld;
            var cameraMatrixWorldInverse = this._viewer.camera.matrixWorldInverse;
            // remove existing BoundingBox
            model.remove(model.getObjectByName(Graphics_6.Graphics.BoundingBoxName));
            // clone model (and geometry!)
            var modelView = Graphics_6.Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
            // clear entire scene
            Graphics_6.Graphics.removeObjectChildren(model, false);
            model.add(modelView);
            var boundingBoxView = createBoundingBox(modelView, 0xff00ff);
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
            this._viewer = new CameraViewer('viewerCanvas');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvU3lzdGVtL0xvZ2dlci50cyIsIlNjcmlwdHMvU3lzdGVtL1NlcnZpY2VzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvR3JhcGhpY3MudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmEudHMiLCJTY3JpcHRzL1N5c3RlbS9NYXRoLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlci50cyIsIlNjcmlwdHMvU3lzdGVtL1Rvb2xzLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlckZhY3RvcnkudHMiLCJTY3JpcHRzL1N5c3RlbS9FdmVudE1hbmFnZXIudHMiLCJTY3JpcHRzL01vZGVsTG9hZGVycy9PQkpMb2FkZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9NYXRlcmlhbHMudHMiLCJTY3JpcHRzL1ZpZXdlci9UcmFja2JhbGxDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL1ZpZXdlci50cyIsIlNjcmlwdHMvTW9kZWxMb2FkZXJzL1Rlc3RNb2RlbExvYWRlci50cyIsIlNjcmlwdHMvTW9kZWxMb2FkZXJzL0xvYWRlci50cyIsIlNjcmlwdHMvVmlld2VyL01lc2hWaWV3ZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9Nb2RlbFZpZXdlckNvbnRyb2xzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTW9kZWxWaWV3ZXIudHMiLCJTY3JpcHRzL01vZGVsUmVsaWVmLnRzIiwiU2NyaXB0cy9Vbml0VGVzdHMvVW5pdFRlc3RzLnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvQ2FtZXJhVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0RlcHRoQnVmZmVyVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0luaGVyaXRhbmNlVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDhFQUE4RTtJQUM5RSw2RUFBNkU7SUFDN0UsdUpBQXVKO0lBQ3ZKLDZFQUE2RTtJQUM3RSw2RUFBNkU7SUFDN0UsWUFBWSxDQUFDOztJQWlC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TSxHQUFHLElBQUksTUFBTSxDQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFakIsSUFBSSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5RCxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0wsc0JBQUM7SUFBRCxDQXJCQSxBQXFCQyxJQUFBO0lBckJZLDBDQUFlO0lBdUI1QixJQUFJLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBQztJQUN0QyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoid3d3cm9vdC9qcy9tb2RlbHJlbGllZi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIExvZ2dpbmcgSW50ZXJmYWNlXHJcbiAqIERpYWdub3N0aWMgbG9nZ2luZ1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBMb2dnZXIge1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpO1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKTtcclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZyk7XHJcbiAgICBhZGRNZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKTtcclxuXHJcbiAgICBhZGRFbXB0eUxpbmUgKCk7XHJcblxyXG4gICAgY2xlYXJMb2coKTtcclxufVxyXG4gICAgICAgICBcclxuZW51bSBNZXNzYWdlQ2xhc3Mge1xyXG4gICAgRXJyb3IgICA9ICdsb2dFcnJvcicsXHJcbiAgICBXYXJuaW5nID0gJ2xvZ1dhcm5pbmcnLFxyXG4gICAgSW5mbyAgICA9ICdsb2dJbmZvJyxcclxuICAgIE5vbmUgICAgPSAnbG9nTm9uZSdcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnNvbGUgbG9nZ2luZ1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25zb2xlTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2Vye1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0IGEgZ2VuZXJhbCBtZXNzYWdlIGFuZCBhZGQgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlQ2xhc3MgTWVzc2FnZSBjbGFzcy5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZUVudHJ5IChtZXNzYWdlIDogc3RyaW5nLCBtZXNzYWdlQ2xhc3MgOiBNZXNzYWdlQ2xhc3MpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByZWZpeCA9ICdNb2RlbFJlbGllZjogJztcclxuICAgICAgICBsZXQgbG9nTWVzc2FnZSA9IGAke3ByZWZpeH0ke21lc3NhZ2V9YDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlQ2xhc3MpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZUNsYXNzLkVycm9yOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuV2FybmluZzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuSW5mbzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuTm9uZTpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2UgRXJyb3IgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeShlcnJvck1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSB3YXJuaW5nTWVzc2FnZSBXYXJuaW5nIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KHdhcm5pbmdNZXNzYWdlLCBNZXNzYWdlQ2xhc3MuV2FybmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gaW5mb3JtYXRpb25hbCBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gaW5mb01lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRJbmZvTWVzc2FnZSAoaW5mb01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkoaW5mb01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5JbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBzdHlsZSBPcHRpb25hbCBzdHlsZS5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZSAobWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KG1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5Ob25lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gZW1wdHkgbGluZVxyXG4gICAgICovXHJcbiAgICBhZGRFbXB0eUxpbmUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbG9nIG91dHB1dFxyXG4gICAgICovXHJcbiAgICBjbGVhckxvZyAoKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBIVE1MIGxvZ2dpbmdcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSFRNTExvZ2dlciBpbXBsZW1lbnRzIExvZ2dlcntcclxuXHJcbiAgICByb290SWQgICAgICAgICAgIDogc3RyaW5nO1xyXG4gICAgcm9vdEVsZW1lbnRUYWcgICA6IHN0cmluZztcclxuICAgIHJvb3RFbGVtZW50ICAgICAgOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBtZXNzYWdlVGFnICAgICAgIDogc3RyaW5nO1xyXG4gICAgYmFzZU1lc3NhZ2VDbGFzcyA6IHN0cmluZ1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucm9vdElkICAgICAgICAgPSAnbG9nZ2VyUm9vdCdcclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50VGFnID0gJ3VsJztcclxuXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlVGFnICAgICAgID0gJ2xpJztcclxuICAgICAgICB0aGlzLmJhc2VNZXNzYWdlQ2xhc3MgPSAnbG9nTWVzc2FnZSc7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RoaXMucm9vdElkfWApO1xyXG4gICAgICAgIGlmICghdGhpcy5yb290RWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5yb290RWxlbWVudFRhZyk7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQuaWQgPSB0aGlzLnJvb3RJZDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJvb3RFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdCBhIGdlbmVyYWwgbWVzc2FnZSBhbmQgYXBwZW5kIHRvIHRoZSBsb2cgcm9vdC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlQ2xhc3MgQ1NTIGNsYXNzIHRvIGJlIGFkZGVkIHRvIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2VFbGVtZW50IChtZXNzYWdlIDogc3RyaW5nLCBtZXNzYWdlQ2xhc3M/IDogc3RyaW5nKSA6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbWVzc2FnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMubWVzc2FnZVRhZyk7XHJcbiAgICAgICAgbWVzc2FnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG5cclxuICAgICAgICBtZXNzYWdlRWxlbWVudC5jbGFzc05hbWUgICA9IGAke3RoaXMuYmFzZU1lc3NhZ2VDbGFzc30gJHttZXNzYWdlQ2xhc3MgPyBtZXNzYWdlQ2xhc3MgOiAnJ31gOztcclxuXHJcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBlcnJvciBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlIEVycm9yIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRWxlbWVudChlcnJvck1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSB3YXJuaW5nTWVzc2FnZSBXYXJuaW5nIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQod2FybmluZ01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5XYXJuaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBpbmZvTWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KGluZm9NZXNzYWdlLCBNZXNzYWdlQ2xhc3MuSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKiBAcGFyYW0gc3R5bGUgT3B0aW9uYWwgQ1NTIHN0eWxlLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlIChtZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2VFbGVtZW50ID0gdGhpcy5hZGRNZXNzYWdlRWxlbWVudChtZXNzYWdlKTtcclxuICAgICAgICBpZiAoc3R5bGUpXHJcbiAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gZW1wdHkgbGluZVxyXG4gICAgICovXHJcbiAgICBhZGRFbXB0eUxpbmUgKCkge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTQwNTQ3L2xpbmUtYnJlYWstaW5zaWRlLWEtbGlzdC1pdGVtLWdlbmVyYXRlcy1zcGFjZS1iZXR3ZWVuLXRoZS1saW5lc1xyXG4vLyAgICAgIHRoaXMuYWRkTWVzc2FnZSgnPGJyLz48YnIvPicpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlKCcuJyk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbG9nIG91dHB1dFxyXG4gICAgICovXHJcbiAgICBjbGVhckxvZyAoKSB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM5NTUyMjkvcmVtb3ZlLWFsbC1jaGlsZC1lbGVtZW50cy1vZi1hLWRvbS1ub2RlLWluLWphdmFzY3JpcHRcclxuICAgICAgICB3aGlsZSAodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyLCBIVE1MTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIFNlcnZpY2VzXHJcbiAqIEdlbmVyYWwgcnVudGltZSBzdXBwb3J0XHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VzIHtcclxuXHJcbiAgICBzdGF0aWMgY29uc29sZUxvZ2dlciA6IENvbnNvbGVMb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcigpO1xyXG4gICAgc3RhdGljIGh0bWxMb2dnZXIgICAgOiBIVE1MTG9nZ2VyICAgID0gbmV3IEhUTUxMb2dnZXIoKTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TW9kZWxSZWxpZWZ9ICAgICAgICAgICAgZnJvbSAnTW9kZWxSZWxpZWYnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG4vKipcclxuICogIEdlbmVyYWwgVEhSRUUuanMvV2ViR0wgc3VwcG9ydCByb3V0aW5lc1xyXG4gKiAgR3JhcGhpY3MgTGlicmFyeVxyXG4gKiAgQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR3JhcGhpY3Mge1xyXG5cclxuICAgIHN0YXRpYyBCb3VuZGluZ0JveE5hbWUgICAgIDogc3RyaW5nID0gJ0JvdW5kaW5nIEJveCc7XHJcbiAgICBzdGF0aWMgQm94TmFtZSAgICAgICAgICAgICA6IHN0cmluZyA9ICdCb3gnO1xyXG4gICAgc3RhdGljIFBsYW5lTmFtZSAgICAgICAgICAgOiBzdHJpbmcgPSAnUGxhbmUnO1xyXG4gICAgc3RhdGljIFNwaGVyZU5hbWUgICAgICAgICAgOiBzdHJpbmcgPSAnU3BoZXJlJztcclxuICAgIHN0YXRpYyBUcmlhZE5hbWUgICAgICAgICAgIDogc3RyaW5nID0gJ1RyaWFkJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBHZW9tZXRyeVxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRHZW9tZXRyeVxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbiBvYmplY3QgYW5kIGFsbCBjaGlsZHJlbiBmcm9tIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgaG9sZGluZyBvYmplY3QgdG8gYmUgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSByb290T2JqZWN0IFBhcmVudCBvYmplY3QgKHBvc3NpYmx5IHdpdGggY2hpbGRyZW4pLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVtb3ZlT2JqZWN0Q2hpbGRyZW4ocm9vdE9iamVjdCA6IFRIUkVFLk9iamVjdDNELCByZW1vdmVSb290IDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBpZiAoIXJvb3RPYmplY3QpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGxvZ2dlciAgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIGxldCByZW1vdmVyID0gZnVuY3Rpb24gKG9iamVjdDNkKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QgPT09IHJvb3RPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbG9nZ2VyLmFkZEluZm9NZXNzYWdlICgnUmVtb3Zpbmc6ICcgKyBvYmplY3QzZC5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCdnZW9tZXRyeScpKSB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QzZC5nZW9tZXRyeS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvYmplY3QzZC5oYXNPd25Qcm9wZXJ0eSgnbWF0ZXJpYWwnKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IG9iamVjdDNkLm1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGVyaWFsLmhhc093blByb3BlcnR5KCdtYXRlcmlhbHMnKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWxzID0gbWF0ZXJpYWwubWF0ZXJpYWxzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlNYXRlcmlhbCBpbiBtYXRlcmlhbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGVyaWFscy5oYXNPd25Qcm9wZXJ0eShpTWF0ZXJpYWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHNbaU1hdGVyaWFsXS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCd0ZXh0dXJlJykpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDNkLnRleHR1cmUuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcm9vdE9iamVjdC50cmF2ZXJzZShyZW1vdmVyKTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHJvb3QgY2hpbGRyZW4gZnJvbSByb290IChiYWNrd2FyZHMhKVxyXG4gICAgICAgIGZvciAobGV0IGlDaGlsZCA6IG51bWJlciA9IChyb290T2JqZWN0LmNoaWxkcmVuLmxlbmd0aCAtIDEpOyBpQ2hpbGQgPj0gMDsgaUNoaWxkLS0pIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA6IFRIUkVFLk9iamVjdDNEID0gcm9vdE9iamVjdC5jaGlsZHJlbltpQ2hpbGRdO1xyXG4gICAgICAgICAgICByb290T2JqZWN0LnJlbW92ZSAoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlbW92ZVJvb3QgJiYgcm9vdE9iamVjdC5wYXJlbnQpXHJcbiAgICAgICAgICAgIHJvb3RPYmplY3QucGFyZW50LnJlbW92ZShyb290T2JqZWN0KTtcclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9uZSBhbmQgdHJhbnNmb3JtIGFuIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBvYmplY3QgT2JqZWN0IHRvIGNsb25lIGFuZCB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0gbWF0cml4IFRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNsb25lQW5kVHJhbnNmb3JtT2JqZWN0IChvYmplY3QgOiBUSFJFRS5PYmplY3QzRCwgbWF0cml4IDogVEhSRUUuTWF0cml4NCkgOiBUSFJFRS5PYmplY3QzRCB7XHJcblxyXG4gICAgICAgIC8vIGNsb25lIG9iamVjdCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgb2JqZWN0Q2xvbmUgOiBUSFJFRS5PYmplY3QzRCA9IG9iamVjdC5jbG9uZSgpO1xyXG4gICAgICAgIG9iamVjdENsb25lLnRyYXZlcnNlKG9iamVjdCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZihUSFJFRS5NZXNoKSlcclxuICAgICAgICAgICAgICAgIG9iamVjdC5nZW9tZXRyeSA9IG9iamVjdC5nZW9tZXRyeS5jbG9uZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBOLkIuIEltcG9ydGFudCEgVGhlIHBvc3Rpb24sIHJvdGF0aW9uIChxdWF0ZXJuaW9uKSBhbmQgc2NhbGUgYXJlIGNvcnJlY3kgYnV0IHRoZSBtYXRyaXggaGFzIG5vdCBiZWVuIHVwZGF0ZWQuXHJcbiAgICAgICAgLy8gVEhSRUUuanMgdXBkYXRlcyB0aGUgbWF0cml4IGlzIHVwZGF0ZWQgaW4gdGhlIHJlbmRlcigpIGxvb3AuXHJcbiAgICAgICAgb2JqZWN0Q2xvbmUudXBkYXRlTWF0cml4KCk7ICAgICBcclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtXHJcbiAgICAgICAgb2JqZWN0Q2xvbmUuYXBwbHlNYXRyaXgobWF0cml4KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdENsb25lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEBwYXJhbSBtZXNoIE1lc2ggZnJvbSB3aGljaCB0byBjcmVhdGUgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE1hdGVyaWFsIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgKiBAIHJldHVybnMgTWVzaCBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlQm91bmRpbmdCb3hNZXNoRnJvbUdlb21ldHJ5KHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgZ2VvbWV0cnkgOiBUSFJFRS5HZW9tZXRyeSwgbWF0ZXJpYWwgOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoe1xyXG5cclxuICAgICAgICB2YXIgYm91bmRpbmdCb3ggICAgIDogVEhSRUUuQm94MyxcclxuICAgICAgICAgICAgd2lkdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBoZWlnaHQgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGRlcHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgYm94TWVzaCAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgYm91bmRpbmdCb3ggPSBnZW9tZXRyeS5ib3VuZGluZ0JveDtcclxuXHJcbiAgICAgICAgYm94TWVzaCA9IHRoaXMuY3JlYXRlQm91bmRpbmdCb3hNZXNoRnJvbUJvdW5kaW5nQm94IChwb3NpdGlvbiwgYm91bmRpbmdCb3gsIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJveE1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgYm94LlxyXG4gICAgICogQHBhcmFtIGJveCBHZW9tZXRyeSBCb3ggZnJvbSB3aGljaCB0byBjcmVhdGUgYm94IG1lc2guXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwgb2YgdGhlIGJveC5cclxuICAgICAqIEAgcmV0dXJucyBNZXNoIG9mIHRoZSBib3guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBib3VuZGluZ0JveCA6IFRIUkVFLkJveDMsIG1hdGVyaWFsIDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGVwdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBib3hNZXNoICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICB3aWR0aCAgPSBib3VuZGluZ0JveC5tYXgueCAtIGJvdW5kaW5nQm94Lm1pbi54O1xyXG4gICAgICAgIGhlaWdodCA9IGJvdW5kaW5nQm94Lm1heC55IC0gYm91bmRpbmdCb3gubWluLnk7XHJcbiAgICAgICAgZGVwdGggID0gYm91bmRpbmdCb3gubWF4LnogLSBib3VuZGluZ0JveC5taW4uejtcclxuXHJcbiAgICAgICAgYm94TWVzaCA9IHRoaXMuY3JlYXRlQm94TWVzaCAocG9zaXRpb24sIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCBtYXRlcmlhbCk7XHJcbiAgICAgICAgYm94TWVzaC5uYW1lID0gR3JhcGhpY3MuQm91bmRpbmdCb3hOYW1lO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94TWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGV4dGVuZHMgb2YgYW4gb2JqZWN0IG9wdGlvbmFsbHkgaW5jbHVkaW5nIGFsbCBjaGlsZHJlbi5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEJvdW5kaW5nQm94RnJvbU9iamVjdChyb290T2JqZWN0IDogVEhSRUUuT2JqZWN0M0QpIDogVEhSRUUuQm94MyB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE1NDkyODU3L2FueS13YXktdG8tZ2V0LWEtYm91bmRpbmctYm94LWZyb20tYS10aHJlZS1qcy1vYmplY3QzZFxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA6IFRIUkVFLkJveDMgPSBuZXcgVEhSRUUuQm94MygpO1xyXG4gICAgICAgIGJvdW5kaW5nQm94ID0gYm91bmRpbmdCb3guc2V0RnJvbU9iamVjdChyb290T2JqZWN0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiB0aGUgYm94LlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0gZGVwdGggRGVwdGguXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgT3B0aW9uYWwgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBCb3ggbWVzaC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUJveE1lc2gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCB3aWR0aCA6IG51bWJlciwgaGVpZ2h0IDogbnVtYmVyLCBkZXB0aCA6IG51bWJlciwgbWF0ZXJpYWw/IDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcblxyXG4gICAgICAgIHZhciBcclxuICAgICAgICAgICAgYm94R2VvbWV0cnkgIDogVEhSRUUuQm94R2VvbWV0cnksXHJcbiAgICAgICAgICAgIGJveE1hdGVyaWFsICA6IFRIUkVFLk1hdGVyaWFsLFxyXG4gICAgICAgICAgICBib3ggICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBib3hHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSh3aWR0aCwgaGVpZ2h0LCBkZXB0aCk7XHJcbiAgICAgICAgYm94R2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcblxyXG4gICAgICAgIGJveE1hdGVyaWFsID0gbWF0ZXJpYWwgfHwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDBmZiwgb3BhY2l0eTogMS4wfSApO1xyXG5cclxuICAgICAgICBib3ggPSBuZXcgVEhSRUUuTWVzaCggYm94R2VvbWV0cnksIGJveE1hdGVyaWFsKTtcclxuICAgICAgICBib3gubmFtZSA9IEdyYXBoaWNzLkJveE5hbWU7XHJcbiAgICAgICAgYm94LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHBsYW5lIG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgdGhlIHBsYW5lLlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgT3B0aW9uYWwgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBQbGFuZSBtZXNoLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlUGxhbmVNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgd2lkdGggOiBudW1iZXIsIGhlaWdodCA6IG51bWJlciwgbWF0ZXJpYWw/IDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBwbGFuZUdlb21ldHJ5ICA6IFRIUkVFLlBsYW5lR2VvbWV0cnksXHJcbiAgICAgICAgICAgIHBsYW5lTWF0ZXJpYWwgIDogVEhSRUUuTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIHBsYW5lICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgcGxhbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHdpZHRoLCBoZWlnaHQpOyAgICAgICBcclxuICAgICAgICBwbGFuZU1hdGVyaWFsID0gbWF0ZXJpYWwgfHwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDBmZiwgb3BhY2l0eTogMS4wfSApO1xyXG5cclxuICAgICAgICBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBsYW5lTWF0ZXJpYWwpO1xyXG4gICAgICAgIHBsYW5lLm5hbWUgPSBHcmFwaGljcy5QbGFuZU5hbWU7XHJcbiAgICAgICAgcGxhbmUucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBwbGFuZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHNwaGVyZSBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIE9yaWdpbiBvZiB0aGUgc3BoZXJlLlxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBSYWRpdXMuXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVTcGhlcmVNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgcmFkaXVzIDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICB2YXIgc3BoZXJlR2VvbWV0cnkgIDogVEhSRUUuU3BoZXJlR2VvbWV0cnksXHJcbiAgICAgICAgICAgIHNlZ21lbnRDb3VudCAgICA6IG51bWJlciA9IDMyLFxyXG4gICAgICAgICAgICBzcGhlcmVNYXRlcmlhbCAgOiBUSFJFRS5NYXRlcmlhbCxcclxuICAgICAgICAgICAgc3BoZXJlICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgc3BoZXJlR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkocmFkaXVzLCBzZWdtZW50Q291bnQsIHNlZ21lbnRDb3VudCk7XHJcbiAgICAgICAgc3BoZXJlR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcblxyXG4gICAgICAgIHNwaGVyZU1hdGVyaWFsID0gbWF0ZXJpYWwgfHwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4ZmYwMDAwLCBvcGFjaXR5OiAxLjB9ICk7XHJcblxyXG4gICAgICAgIHNwaGVyZSA9IG5ldyBUSFJFRS5NZXNoKCBzcGhlcmVHZW9tZXRyeSwgc3BoZXJlTWF0ZXJpYWwgKTtcclxuICAgICAgICBzcGhlcmUubmFtZSA9IEdyYXBoaWNzLlNwaGVyZU5hbWU7XHJcbiAgICAgICAgc3BoZXJlLnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gc3BoZXJlO1xyXG4gICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBsaW5lIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBzdGFydFBvc2l0aW9uIFN0YXJ0IHBvaW50LlxyXG4gICAgICogQHBhcmFtIGVuZFBvc2l0aW9uIEVuZCBwb2ludC5cclxuICAgICAqIEBwYXJhbSBjb2xvciBDb2xvci5cclxuICAgICAqIEByZXR1cm5zIExpbmUgZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUxpbmUoc3RhcnRQb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGVuZFBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgY29sb3IgOiBudW1iZXIpIDogVEhSRUUuTGluZSB7XHJcblxyXG4gICAgICAgIHZhciBsaW5lICAgICAgICAgICAgOiBUSFJFRS5MaW5lLFxyXG4gICAgICAgICAgICBsaW5lR2VvbWV0cnkgICAgOiBUSFJFRS5HZW9tZXRyeSxcclxuICAgICAgICAgICAgbWF0ZXJpYWwgICAgICAgIDogVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWw7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGxpbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG4gICAgICAgIGxpbmVHZW9tZXRyeS52ZXJ0aWNlcy5wdXNoIChzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbik7XHJcblxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiBjb2xvcn0gKTtcclxuICAgICAgICBsaW5lID0gbmV3IFRIUkVFLkxpbmUobGluZUdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGF4ZXMgdHJpYWQuXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gT3JpZ2luIG9mIHRoZSB0cmlhZC5cclxuICAgICAqIEBwYXJhbSBsZW5ndGggTGVuZ3RoIG9mIHRoZSBjb29yZGluYXRlIGFycm93LlxyXG4gICAgICogQHBhcmFtIGhlYWRMZW5ndGggTGVuZ3RoIG9mIHRoZSBhcnJvdyBoZWFkLlxyXG4gICAgICogQHBhcmFtIGhlYWRXaWR0aCBXaWR0aCBvZiB0aGUgYXJyb3cgaGVhZC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVdvcmxkQXhlc1RyaWFkKHBvc2l0aW9uPyA6IFRIUkVFLlZlY3RvcjMsIGxlbmd0aD8gOiBudW1iZXIsIGhlYWRMZW5ndGg/IDogbnVtYmVyLCBoZWFkV2lkdGg/IDogbnVtYmVyKSA6IFRIUkVFLk9iamVjdDNEIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgdmFyIHRyaWFkR3JvdXAgICAgICA6IFRIUkVFLk9iamVjdDNEID0gbmV3IFRIUkVFLk9iamVjdDNEKCksXHJcbiAgICAgICAgICAgIGFycm93UG9zaXRpb24gICA6IFRIUkVFLlZlY3RvcjMgID0gcG9zaXRpb24gfHxuZXcgVEhSRUUuVmVjdG9yMygpLFxyXG4gICAgICAgICAgICBhcnJvd0xlbmd0aCAgICAgOiBudW1iZXIgPSBsZW5ndGggICAgIHx8IDE1LFxyXG4gICAgICAgICAgICBhcnJvd0hlYWRMZW5ndGggOiBudW1iZXIgPSBoZWFkTGVuZ3RoIHx8IDEsXHJcbiAgICAgICAgICAgIGFycm93SGVhZFdpZHRoICA6IG51bWJlciA9IGhlYWRXaWR0aCAgfHwgMTtcclxuXHJcbiAgICAgICAgdHJpYWRHcm91cC5hZGQobmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDEsIDAsIDApLCBhcnJvd1Bvc2l0aW9uLCBhcnJvd0xlbmd0aCwgMHhmZjAwMDAsIGFycm93SGVhZExlbmd0aCwgYXJyb3dIZWFkV2lkdGgpKTtcclxuICAgICAgICB0cmlhZEdyb3VwLmFkZChuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCksIGFycm93UG9zaXRpb24sIGFycm93TGVuZ3RoLCAweDAwZmYwMCwgYXJyb3dIZWFkTGVuZ3RoLCBhcnJvd0hlYWRXaWR0aCkpO1xyXG4gICAgICAgIHRyaWFkR3JvdXAuYWRkKG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKSwgYXJyb3dQb3NpdGlvbiwgYXJyb3dMZW5ndGgsIDB4MDAwMGZmLCBhcnJvd0hlYWRMZW5ndGgsIGFycm93SGVhZFdpZHRoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmlhZEdyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBheGVzIGdyaWQuXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gIE9yaWdpbiBvZiB0aGUgYXhlcyBncmlkLlxyXG4gICAgICogQHBhcmFtIHNpemUgU2l6ZSBvZiB0aGUgZ3JpZC5cclxuICAgICAqIEBwYXJhbSBzdGVwIEdyaWQgbGluZSBpbnRlcnZhbHMuXHJcbiAgICAgKiBAcmV0dXJucyBHcmlkIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVdvcmxkQXhlc0dyaWQocG9zaXRpb24/IDogVEhSRUUuVmVjdG9yMywgc2l6ZT8gOiBudW1iZXIsIHN0ZXA/IDogbnVtYmVyKSA6IFRIUkVFLk9iamVjdDNEIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgdmFyIGdyaWRHcm91cCAgICAgICA6IFRIUkVFLk9iamVjdDNEID0gbmV3IFRIUkVFLk9iamVjdDNEKCksXHJcbiAgICAgICAgICAgIGdyaWRQb3NpdGlvbiAgICA6IFRIUkVFLlZlY3RvcjMgID0gcG9zaXRpb24gfHxuZXcgVEhSRUUuVmVjdG9yMygpLFxyXG4gICAgICAgICAgICBncmlkU2l6ZSAgICAgICAgOiBudW1iZXIgPSBzaXplIHx8IDEwLFxyXG4gICAgICAgICAgICBncmlkU3RlcCAgICAgICAgOiBudW1iZXIgPSBzdGVwIHx8IDEsXHJcbiAgICAgICAgICAgIGNvbG9yQ2VudGVybGluZSA6IG51bWJlciA9ICAweGZmMDAwMDAwLFxyXG4gICAgICAgICAgICB4eUdyaWQgICAgICAgICAgIDogVEhSRUUuR3JpZEhlbHBlcixcclxuICAgICAgICAgICAgeXpHcmlkICAgICAgICAgICA6IFRIUkVFLkdyaWRIZWxwZXIsXHJcbiAgICAgICAgICAgIHp4R3JpZCAgICAgICAgICAgOiBUSFJFRS5HcmlkSGVscGVyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB4eUdyaWQgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcihncmlkU2l6ZSwgZ3JpZFN0ZXApO1xyXG4gICAgICAgIHh5R3JpZC5zZXRDb2xvcnMoY29sb3JDZW50ZXJsaW5lLCAweGZmMDAwMCk7XHJcbiAgICAgICAgeHlHcmlkLnBvc2l0aW9uLmNvcHkoZ3JpZFBvc2l0aW9uLmNsb25lKCkpO1xyXG4gICAgICAgIHh5R3JpZC5yb3RhdGVPbkF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMCksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB4eUdyaWQucG9zaXRpb24ueCArPSBncmlkU2l6ZTtcclxuICAgICAgICB4eUdyaWQucG9zaXRpb24ueSArPSBncmlkU2l6ZTtcclxuICAgICAgICBncmlkR3JvdXAuYWRkKHh5R3JpZCk7XHJcblxyXG4gICAgICAgIHl6R3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKGdyaWRTaXplLCBncmlkU3RlcCk7XHJcbiAgICAgICAgeXpHcmlkLnNldENvbG9ycyhjb2xvckNlbnRlcmxpbmUsIDB4MDBmZjAwKTtcclxuICAgICAgICB5ekdyaWQucG9zaXRpb24uY29weShncmlkUG9zaXRpb24uY2xvbmUoKSk7XHJcbiAgICAgICAgeXpHcmlkLnJvdGF0ZU9uQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKSwgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHl6R3JpZC5wb3NpdGlvbi55ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIHl6R3JpZC5wb3NpdGlvbi56ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIGdyaWRHcm91cC5hZGQoeXpHcmlkKTtcclxuXHJcbiAgICAgICAgenhHcmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoZ3JpZFNpemUsIGdyaWRTdGVwKTtcclxuICAgICAgICB6eEdyaWQuc2V0Q29sb3JzKGNvbG9yQ2VudGVybGluZSwgMHgwMDAwZmYpO1xyXG4gICAgICAgIHp4R3JpZC5wb3NpdGlvbi5jb3B5KGdyaWRQb3NpdGlvbi5jbG9uZSgpKTtcclxuICAgICAgICB6eEdyaWQucm90YXRlT25BeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgenhHcmlkLnBvc2l0aW9uLnogKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgenhHcmlkLnBvc2l0aW9uLnggKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgZ3JpZEdyb3VwLmFkZCh6eEdyaWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gZ3JpZEdyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgICAvKipcclxuICAgICAgKiBBZGRzIGEgY2FtZXJhIGhlbHBlciB0byBhIHNjZW5lIHRvIHZpc3VhbGl6ZSB0aGUgY2FtZXJhIHBvc2l0aW9uLlxyXG4gICAgICAqIEBwYXJhbSBzY2VuZSBTY2VuZSB0byBhbm5vdGF0ZS5cclxuICAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYSB0byBjb25zdHJ1Y3QgaGVscGVyIChtYXkgYmUgbnVsbCkuXHJcbiAgICAgICovXHJcbiAgICBzdGF0aWMgYWRkQ2FtZXJhSGVscGVyIChzY2VuZSA6IFRIUkVFLlNjZW5lLCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogdm9pZHtcclxuXHJcbiAgICAgICAgaWYgKGNhbWVyYSkge1xyXG4gICAgICAgICAgICBsZXQgY2FtZXJhSGVscGVyID0gbmV3IFRIUkVFLkNhbWVyYUhlbHBlcihjYW1lcmEgKTtcclxuICAgICAgICAgICAgY2FtZXJhSGVscGVyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBzY2VuZS5hZGQoY2FtZXJhSGVscGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIEFkZHMgYSBjb29yZGluYXRlIGF4aXMgaGVscGVyIHRvIGEgc2NlbmUgdG8gdmlzdWFsaXplIHRoZSB3b3JsZCBheGVzLlxyXG4gICAgICAqIEBwYXJhbSBzY2VuZSBTY2VuZSB0byBhbm5vdGF0ZS5cclxuICAgICAgKi9cclxuICAgIHN0YXRpYyBhZGRBeGlzSGVscGVyIChzY2VuZSA6IFRIUkVFLlNjZW5lLCBzaXplIDogbnVtYmVyKSA6IHZvaWR7XHJcblxyXG4gICAgICAgIGxldCBheGlzSGVscGVyID0gbmV3IFRIUkVFLkF4aXNIZWxwZXIoc2l6ZSk7XHJcbiAgICAgICAgYXhpc0hlbHBlci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBzY2VuZS5hZGQoYXhpc0hlbHBlcik7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIENvb3JkaW5hdGUgQ29udmVyc2lvblxyXG4gICAgLypcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vICBDb29yZGluYXRlIFN5c3RlbXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIEZSQU1FXHQgICAgICAgICAgICBFWEFNUExFXHRcdFx0XHRcdFx0XHRcdFx0XHRTUEFDRSAgICAgICAgICAgICAgICAgICAgICBVTklUUyAgICAgICAgICAgICAgICAgICAgICAgTk9URVNcclxuXHJcbiAgICBNb2RlbCAgICAgICAgICAgICAgIENhdGFsb2cgV2ViR0w6IE1vZGVsLCBCYW5kRWxlbWVudCBCbG9jayAgICAgb2JqZWN0ICAgICAgICAgICAgICAgICAgICAgIG1tICAgICAgICAgICAgICAgICAgICAgICAgICBSaGlubyBkZWZpbml0aW9uc1xyXG4gICAgV29ybGQgICAgICAgICAgICAgICBEZXNpZ24gTW9kZWxcdFx0XHRcdFx0XHRcdFx0d29ybGQgICAgICAgICAgICAgICAgICAgICAgIG1tIFxyXG4gICAgVmlldyAgICAgICAgICAgICAgICBDYW1lcmEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcgICAgICAgICAgICAgICAgICAgICAgICBtbVxyXG4gICAgRGV2aWNlICAgICAgICAgICAgICBOb3JtYWxpemVkIHZpZXdcdFx0XHRcdFx0XHRcdCAgICBkZXZpY2UgICAgICAgICAgICAgICAgICAgICAgWygtMSwgLTEpLCAoMSwgMSldXHJcbiAgICBTY3JlZW4uUGFnZSAgICAgICAgIEhUTUwgcGFnZVx0XHRcdFx0XHRcdFx0XHRcdHNjcmVlbiAgICAgICAgICAgICAgICAgICAgICBweCAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwIGF0IFRvcCBMZWZ0LCArWSBkb3duICAgIEhUTUwgcGFnZVxyXG4gICAgU2NyZWVuLkNsaWVudCAgICAgICBCcm93c2VyIHZpZXcgcG9ydCBcdFx0XHRcdFx0XHQgICAgc2NyZWVuICAgICAgICAgICAgICAgICAgICAgIHB4ICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAgYXQgVG9wIExlZnQsICtZIGRvd24gICAgYnJvd3NlciB3aW5kb3dcclxuICAgIFNjcmVlbi5Db250YWluZXIgICAgRE9NIGNvbnRhaW5lclx0XHRcdFx0XHRcdFx0XHRzY3JlZW4gICAgICAgICAgICAgICAgICAgICAgcHggICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCBhdCBUb3AgTGVmdCwgK1kgZG93biAgICBIVE1MIGNhbnZhc1xyXG5cclxuICAgIE1vdXNlIEV2ZW50IFByb3BlcnRpZXNcclxuICAgIGh0dHA6Ly93d3cuamFja2xtb29yZS5jb20vbm90ZXMvbW91c2UtcG9zaXRpb24vXHJcbiAgICAqL1xyXG4gICAgICAgIFxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRXb3JsZCBDb29yZGluYXRlc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhIEpRdWVyeSBldmVudCB0byB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBldmVudCBFdmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgV29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB3b3JsZENvb3JkaW5hdGVzRnJvbUpRRXZlbnQgKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjMge1xyXG5cclxuICAgICAgICB2YXIgd29ybGRDb29yZGluYXRlcyAgICA6IFRIUkVFLlZlY3RvcjMsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzMkQgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEIDogVEhSRUUuVmVjdG9yMyxcclxuICAgICAgICAgICAgZGV2aWNlWiAgICAgICAgICAgICA6IG51bWJlcjtcclxuXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMyRCA9IHRoaXMuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCwgY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgZGV2aWNlWiA9IChjYW1lcmEgaW5zdGFuY2VvZiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSkgPyAwLjUgOiAxLjA7XHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCA9IG5ldyBUSFJFRS5WZWN0b3IzKGRldmljZUNvb3JkaW5hdGVzMkQueCwgZGV2aWNlQ29vcmRpbmF0ZXMyRC55LCBkZXZpY2VaKTtcclxuXHJcbiAgICAgICAgd29ybGRDb29yZGluYXRlcyA9IGRldmljZUNvb3JkaW5hdGVzM0QudW5wcm9qZWN0KGNhbWVyYSk7XHJcblxyXG4gICAgICAgIHJldHVybiB3b3JsZENvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0VmlldyBDb29yZGluYXRlc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgd29ybGQgY29vcmRpbmF0ZXMgdG8gdmlldyBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSB2ZWN0b3IgV29ybGQgY29vcmRpbmF0ZSB2ZWN0b3IgdG8gY29udmVydC5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgVmlldyBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHZpZXdDb29yZGluYXRlc0Zyb21Xb3JsZENvb3JkaW5hdGVzICh2ZWN0b3IgOiBUSFJFRS5WZWN0b3IzLCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMyB7XHJcblxyXG4gICAgICAgIHZhciBwb3NpdGlvbiAgICAgICAgICA6IFRIUkVFLlZlY3RvcjMgPSB2ZWN0b3IuY2xvbmUoKSwgIFxyXG4gICAgICAgICAgICB2aWV3Q29vcmRpbmF0ZXMgICA6IFRIUkVFLlZlY3RvcjM7XHJcblxyXG4gICAgICAgIHZpZXdDb29yZGluYXRlcyA9IHBvc2l0aW9uLmFwcGx5TWF0cml4NChjYW1lcmEubWF0cml4V29ybGRJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpZXdDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdERldmljZSBDb29yZGluYXRlc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhIEpRdWVyeSBldmVudCB0byBub3JtYWxpemVkIGRldmljZSBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcmV0dXJucyBOb3JtYWxpemVkIGRldmljZSBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRldmljZUNvb3JkaW5hdGVzRnJvbUpRRXZlbnQgKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSkgOiBUSFJFRS5WZWN0b3IyIHtcclxuXHJcbiAgICAgICAgdmFyIGRldmljZUNvb3JkaW5hdGVzICAgICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIHJhdGlvWCwgIHJhdGlvWSAgICAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGRldmljZVgsIGRldmljZVkgICAgICAgICAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzID0gdGhpcy5zY3JlZW5Db250YWluZXJDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIpO1xyXG4gICAgICAgIHJhdGlvWCA9IHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnggLyBjb250YWluZXIud2lkdGgoKTtcclxuICAgICAgICByYXRpb1kgPSBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy55IC8gY29udGFpbmVyLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBkZXZpY2VYID0gKygocmF0aW9YICogMikgLSAxKTsgICAgICAgICAgICAgICAgIC8vIFstMSwgMV1cclxuICAgICAgICBkZXZpY2VZID0gLSgocmF0aW9ZICogMikgLSAxKTsgICAgICAgICAgICAgICAgIC8vIFstMSwgMV1cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlcyA9IG5ldyBUSFJFRS5WZWN0b3IyKGRldmljZVgsIGRldmljZVkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGV2aWNlQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB3b3JsZCBjb29yZGluYXRlcyB0byBkZXZpY2UgY29vcmRpbmF0ZXMgWy0xLCAxXS5cclxuICAgICAqIEBwYXJhbSB2ZWN0b3IgIFdvcmxkIGNvb3JkaW5hdGVzIHZlY3Rvci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHByZXR1cm5zIERldmljZSBjb29yaW5kYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRldmljZUNvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9pc3N1ZXMvNzhcclxuICAgICAgICB2YXIgcG9zaXRpb24gICAgICAgICAgICAgICAgICAgOiBUSFJFRS5WZWN0b3IzID0gdmVjdG9yLmNsb25lKCksICBcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMyRCAgICAgICAgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEICAgICAgICA6IFRIUkVFLlZlY3RvcjM7XHJcblxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgPSBwb3NpdGlvbi5wcm9qZWN0KGNhbWVyYSk7XHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMyRCA9IG5ldyBUSFJFRS5WZWN0b3IyKGRldmljZUNvb3JkaW5hdGVzM0QueCwgZGV2aWNlQ29vcmRpbmF0ZXMzRC55KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRldmljZUNvb3JkaW5hdGVzMkQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRTY3JlZW4gQ29vcmRpbmF0ZXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8qKlxyXG4gICAgICogUGFnZSBjb29yZGluYXRlcyBmcm9tIGEgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiAocGFnZSkgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5QYWdlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0KSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzY3JlZW5QYWdlQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgc2NyZWVuUGFnZUNvb3JkaW5hdGVzLnggPSBldmVudC5wYWdlWDtcclxuICAgICAgICBzY3JlZW5QYWdlQ29vcmRpbmF0ZXMueSA9IGV2ZW50LnBhZ2VZO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuUGFnZUNvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIENsaWVudCBjb29yZGluYXRlcyBmcm9tIGEgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQ2xpZW50IGNvb3JkaW5hdGVzIGFyZSByZWxhdGl2ZSB0byB0aGUgPGJyb3dzZXI+IHZpZXcgcG9ydC4gSWYgdGhlIGRvY3VtZW50IGhhcyBiZWVuIHNjcm9sbGVkIGl0IHdpbGxcclxuICAgICAqIGJlIGRpZmZlcmVudCB0aGFuIHRoZSBwYWdlIGNvb3JkaW5hdGVzIHdoaWNoIGFyZSBhbHdheXMgcmVsYXRpdmUgdG8gdGhlIHRvcCBsZWZ0IG9mIHRoZSA8ZW50aXJlPiBIVE1MIHBhZ2UgZG9jdW1lbnQuXHJcbiAgICAgKiBodHRwOi8vd3d3LmJlbm5hZGVsLmNvbS9ibG9nLzE4NjktanF1ZXJ5LW1vdXNlLWV2ZW50cy1wYWdleC15LXZzLWNsaWVudHgteS5odG1cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gY2xpZW50IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0KSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzY3JlZW5DbGllbnRDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cclxuICAgICAgICBzY3JlZW5DbGllbnRDb29yZGluYXRlcy54ID0gZXZlbnQuY2xpZW50WDtcclxuICAgICAgICBzY3JlZW5DbGllbnRDb29yZGluYXRlcy55ID0gZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgSlF1ZXJ5IGV2ZW50IGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5KSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxyXG4gICAgICAgICAgICBjb250YWluZXJPZmZzZXQgICAgICAgICAgICA6IEpRdWVyeUNvb3JkaW5hdGVzLFxyXG4gICAgICAgICAgICBwYWdlWCwgcGFnZVkgICAgICAgICAgICAgICA6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgY29udGFpbmVyT2Zmc2V0ID0gY29udGFpbmVyLm9mZnNldCgpO1xyXG5cclxuICAgICAgICAvLyBKUXVlcnkgZG9lcyBub3Qgc2V0IHBhZ2VYL3BhZ2VZIGZvciBEcm9wIGV2ZW50cy4gVGhleSBhcmUgZGVmaW5lZCBpbiB0aGUgb3JpZ2luYWxFdmVudCBtZW1iZXIuXHJcbiAgICAgICAgcGFnZVggPSBldmVudC5wYWdlWCB8fCAoPGFueT4oZXZlbnQub3JpZ2luYWxFdmVudCkpLnBhZ2VYO1xyXG4gICAgICAgIHBhZ2VZID0gZXZlbnQucGFnZVkgfHwgKDxhbnk+KGV2ZW50Lm9yaWdpbmFsRXZlbnQpKS5wYWdlWTtcclxuXHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueCA9IHBhZ2VYIC0gY29udGFpbmVyT2Zmc2V0LmxlZnQ7XHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueSA9IHBhZ2VZIC0gY29udGFpbmVyT2Zmc2V0LnRvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB3b3JsZCBjb29yZGluYXRlcyB0byBzY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciBXb3JsZCB2ZWN0b3IuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5Db250YWluZXJDb29yZGluYXRlc0Zyb21Xb3JsZENvb3JkaW5hdGVzICh2ZWN0b3IgOiBUSFJFRS5WZWN0b3IzLCBjb250YWluZXIgOiBKUXVlcnksIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgLy9odHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2lzc3Vlcy83OFxyXG4gICAgICAgIHZhciBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICA6IFRIUkVFLlZlY3RvcjMgPSB2ZWN0b3IuY2xvbmUoKSxcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMgICAgICAgICAgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGxlZnQgICAgICAgICAgICAgICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICB0b3AgICAgICAgICAgICAgICAgICAgICAgICA6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLy8gWygtMSwgLTEpLCAoMSwgMSldXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMgPSB0aGlzLmRldmljZUNvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMocG9zaXRpb24sIGNhbWVyYSk7XHJcbiAgICAgICAgbGVmdCA9ICgoK2RldmljZUNvb3JkaW5hdGVzLnggKyAxKSAvIDIpICogY29udGFpbmVyLndpZHRoKCk7XHJcbiAgICAgICAgdG9wICA9ICgoLWRldmljZUNvb3JkaW5hdGVzLnkgKyAxKSAvIDIpICogY29udGFpbmVyLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcyA9IG5ldyBUSFJFRS5WZWN0b3IyKGxlZnQsIHRvcCk7XHJcbiAgICAgICAgcmV0dXJuIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbnRlcnNlY3Rpb25zXHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvLyAgSW50ZXJzZWN0aW9uc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgUmF5Y2FzdGVyIHRocm91Z2ggdGhlIG1vdXNlIHdvcmxkIHBvc2l0aW9uLlxyXG4gICAgICogQHBhcmFtIG1vdXNlV29ybGQgV29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEByZXR1cm5zIFRIUkVFLlJheWNhc3Rlci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJheWNhc3RlckZyb21Nb3VzZSAobW91c2VXb3JsZCA6IFRIUkVFLlZlY3RvcjMsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5SYXljYXN0ZXJ7XHJcblxyXG4gICAgICAgIHZhciByYXlPcmlnaW4gIDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzIChtb3VzZVdvcmxkLngsIG1vdXNlV29ybGQueSwgY2FtZXJhLnBvc2l0aW9uLnopLFxyXG4gICAgICAgICAgICB3b3JsZFBvaW50IDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzKG1vdXNlV29ybGQueCwgbW91c2VXb3JsZC55LCBtb3VzZVdvcmxkLnopO1xyXG5cclxuICAgICAgICAgICAgLy8gVG9vbHMuY29uc29sZUxvZygnV29ybGQgbW91c2UgY29vcmRpbmF0ZXM6ICcgKyB3b3JsZFBvaW50LnggKyAnLCAnICsgd29ybGRQb2ludC55KTtcclxuXHJcbiAgICAgICAgLy8gY29uc3RydWN0IHJheSBmcm9tIGNhbWVyYSB0byBtb3VzZSB3b3JsZFxyXG4gICAgICAgIHZhciByYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyIChyYXlPcmlnaW4sIHdvcmxkUG9pbnQuc3ViIChyYXlPcmlnaW4pLm5vcm1hbGl6ZSgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJheWNhc3RlcjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZmlyc3QgSW50ZXJzZWN0aW9uIGxvY2F0ZWQgYnkgdGhlIGN1cnNvci5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEBwYXJhbSBzY2VuZU9iamVjdHMgQXJyYXkgb2Ygc2NlbmUgb2JqZWN0cy5cclxuICAgICAqIEBwYXJhbSByZWN1cnNlIFJlY3Vyc2UgdGhyb3VnaCBvYmplY3RzLlxyXG4gICAgICogQHJldHVybnMgRmlyc3QgaW50ZXJzZWN0aW9uIHdpdGggc2NyZWVuIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRGaXJzdEludGVyc2VjdGlvbihldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnksIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSwgc2NlbmVPYmplY3RzIDogVEhSRUUuT2JqZWN0M0RbXSwgcmVjdXJzZSA6IGJvb2xlYW4pIDogVEhSRUUuSW50ZXJzZWN0aW9uIHtcclxuXHJcbiAgICAgICAgdmFyIHJheWNhc3RlciAgICAgICAgICA6IFRIUkVFLlJheWNhc3RlcixcclxuICAgICAgICAgICAgbW91c2VXb3JsZCAgICAgICAgIDogVEhSRUUuVmVjdG9yMyxcclxuICAgICAgICAgICAgaUludGVyc2VjdGlvbiAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24gICAgICAgOiBUSFJFRS5JbnRlcnNlY3Rpb247XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAvLyBjb25zdHJ1Y3QgcmF5IGZyb20gY2FtZXJhIHRvIG1vdXNlIHdvcmxkXHJcbiAgICAgICAgbW91c2VXb3JsZCA9IEdyYXBoaWNzLndvcmxkQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCwgY29udGFpbmVyLCBjYW1lcmEpO1xyXG4gICAgICAgIHJheWNhc3RlciAgPSBHcmFwaGljcy5yYXljYXN0ZXJGcm9tTW91c2UgKG1vdXNlV29ybGQsIGNhbWVyYSk7XHJcblxyXG4gICAgICAgIC8vIGZpbmQgYWxsIG9iamVjdCBpbnRlcnNlY3Rpb25zXHJcbiAgICAgICAgdmFyIGludGVyc2VjdHMgOiBUSFJFRS5JbnRlcnNlY3Rpb25bXSA9IHJheWNhc3Rlci5pbnRlcnNlY3RPYmplY3RzIChzY2VuZU9iamVjdHMsIHJlY3Vyc2UpO1xyXG5cclxuICAgICAgICAvLyBubyBpbnRlcnNlY3Rpb24/XHJcbiAgICAgICAgaWYgKGludGVyc2VjdHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXNlIGZpcnN0OyByZWplY3QgbGluZXMgKFRyYW5zZm9ybSBGcmFtZSlcclxuICAgICAgICBmb3IgKGlJbnRlcnNlY3Rpb24gPSAwOyBpSW50ZXJzZWN0aW9uIDwgaW50ZXJzZWN0cy5sZW5ndGg7IGlJbnRlcnNlY3Rpb24rKykge1xyXG5cclxuICAgICAgICAgICAgaW50ZXJzZWN0aW9uID0gaW50ZXJzZWN0c1tpSW50ZXJzZWN0aW9uXTtcclxuICAgICAgICAgICAgaWYgKCEoaW50ZXJzZWN0aW9uLm9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLkxpbmUpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVyc2VjdGlvbjtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEhlbHBlcnNcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vICBIZWxwZXJzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSBXZWJHTCB0YXJnZXQgY2FudmFzLlxyXG4gICAgICogQHBhcmFtIGlkIERPTSBpZCBmb3IgY2FudmFzLlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoIG9mIGNhbnZhcy5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0IG9mIGNhbnZhcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGluaXRpYWxpemVDYW52YXMoaWQgOiBzdHJpbmcsIHdpZHRoPyA6IG51bWJlciwgaGVpZ2h0PyA6IG51bWJlcikgOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICBcclxuICAgICAgICBsZXQgY2FudmFzIDogSFRNTENhbnZhc0VsZW1lbnQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApO1xyXG4gICAgICAgIGlmICghY2FudmFzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIuYWRkRXJyb3JNZXNzYWdlKGBDYW52YXMgZWxlbWVudCBpZCA9ICR7aWR9IG5vdCBmb3VuZGApO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIENTUyBjb250cm9scyB0aGUgc2l6ZVxyXG4gICAgICAgIGlmICghd2lkdGggfHwgIWhlaWdodClcclxuICAgICAgICAgICAgcmV0dXJuIGNhbnZhcztcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIGRpbWVuc2lvbnMgICAgXHJcbiAgICAgICAgY2FudmFzLndpZHRoICA9IHdpZHRoO1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vIERPTSBlbGVtZW50IGRpbWVuc2lvbnMgKG1heSBiZSBkaWZmZXJlbnQgdGhhbiByZW5kZXIgZGltZW5zaW9ucylcclxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggID0gYCR7d2lkdGh9cHhgO1xyXG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xyXG5cclxuICAgICAgICByZXR1cm4gY2FudmFzO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufSIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FtZXJhU2V0dGluZ3Mge1xyXG4gICAgcG9zaXRpb246ICAgICAgIFRIUkVFLlZlY3RvcjM7ICAgICAgICAvLyBsb2NhdGlvbiBvZiBjYW1lcmFcclxuICAgIHRhcmdldDogICAgICAgICBUSFJFRS5WZWN0b3IzOyAgICAgICAgLy8gdGFyZ2V0IHBvaW50XHJcbiAgICBuZWFyOiAgICAgICAgICAgbnVtYmVyOyAgICAgICAgICAgICAgIC8vIG5lYXIgY2xpcHBpbmcgcGxhbmVcclxuICAgIGZhcjogICAgICAgICAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gZmFyIGNsaXBwaW5nIHBsYW5lXHJcbiAgICBmaWVsZE9mVmlldzogICAgbnVtYmVyOyAgICAgICAgICAgICAgIC8vIGZpZWxkIG9mIHZpZXdcclxufVxyXG5cclxuZXhwb3J0IGVudW0gU3RhbmRhcmRWaWV3IHtcclxuICAgIEZyb250LFxyXG4gICAgVG9wLFxyXG4gICAgQm90dG9tLFxyXG4gICAgTGVmdCxcclxuICAgIFJpZ2h0LFxyXG4gICAgSXNvbWV0cmljXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYW1lcmFcclxuICogR2VuZXJhbCBjYW1lcmEgdXRpbGl0eSBtZXRob2RzLlxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEge1xyXG5cclxuICAgIHN0YXRpYyBEZWZhdWx0RmllbGRPZlZpZXcgICAgICAgOiBudW1iZXIgPSAzNzsgICAgICAgLy8gMzVtbSB2ZXJ0aWNhbCA6IGh0dHBzOi8vd3d3Lm5pa29uaWFucy5vcmcvcmV2aWV3cy9mb3YtdGFibGVzICAgICAgIFxyXG4gICAgc3RhdGljIERlZmF1bHROZWFyQ2xpcHBpbmdQbGFuZSA6IG51bWJlciA9IDAuMTsgXHJcbiAgICBzdGF0aWMgRGVmYXVsdEZhckNsaXBwaW5nUGxhbmUgIDogbnVtYmVyID0gMTAwMDA7IFxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBDbGlwcGluZyBQbGFuZXNcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGV4dGVudHMgb2YgdGhlIG5lYXIgY2FtZXJhIHBsYW5lLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5WZWN0b3IyfSBcclxuICAgICAqIEBtZW1iZXJvZiBHcmFwaGljc1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0TmVhclBsYW5lRXh0ZW50cyhjYW1lcmEgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY2FtZXJhRk9WUmFkaWFucyA9IGNhbWVyYS5mb3YgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBcclxuICAgICAgICBsZXQgbmVhckhlaWdodCA9IDIgKiBNYXRoLnRhbihjYW1lcmFGT1ZSYWRpYW5zIC8gMikgKiBjYW1lcmEubmVhcjtcclxuICAgICAgICBsZXQgbmVhcldpZHRoICA9IGNhbWVyYS5hc3BlY3QgKiBuZWFySGVpZ2h0O1xyXG4gICAgICAgIGxldCBleHRlbnRzID0gbmV3IFRIUkVFLlZlY3RvcjIobmVhcldpZHRoLCBuZWFySGVpZ2h0KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZXh0ZW50cztcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2V0dGluZ3NcclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSB0aGUgZGVmYXVsdCBib3VuZGluZyBib3ggZm9yIGEgbW9kZWwuXHJcbiAgICAgKiBJZiB0aGUgbW9kZWwgaXMgZW1wdHksIGEgdW5pdCBzcGhlcmUgaXMgdXNlcyBhcyBhIHByb3h5IHRvIHByb3ZpZGUgZGVmYXVsdHMuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLk9iamVjdDNEfSBtb2RlbCBNb2RlbCB0byBjYWxjdWxhdGUgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHJldHVybnMge1RIUkVFLkJveDN9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXREZWZhdWx0Qm91bmRpbmdCb3ggKG1vZGVsIDogVEhSRUUuT2JqZWN0M0QpIDogVEhSRUUuQm94MyB7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKCk7ICAgICAgIFxyXG4gICAgICAgIGlmIChtb2RlbCkgXHJcbiAgICAgICAgICAgIGJvdW5kaW5nQm94ID0gR3JhcGhpY3MuZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KG1vZGVsKTsgXHJcblxyXG4gICAgICAgIGlmICghYm91bmRpbmdCb3guaXNFbXB0eSgpKVxyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gdW5pdCBzcGhlcmUgcHJveHlcclxuICAgICAgICBsZXQgc3BoZXJlUHJveHkgPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKCksIDEpO1xyXG4gICAgICAgIGJvdW5kaW5nQm94ID0gR3JhcGhpY3MuZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KHNwaGVyZVByb3h5KTsgICAgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIGNhbWVyYSBzZXR0aW5ncyB0byBmaXQgdGhlIG1vZGVsIGluIHRoZSBjdXJyZW50IHZpZXcuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLkdyb3VwfSBtb2RlbCBNb2RlbCB0byBmaXQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmlld0FzcGVjdCBBc3BlY3QgcmF0aW8gb2Ygdmlldy5cclxuICAgICAqIEByZXR1cm5zIHtDYW1lcmFTZXR0aW5nc30gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRGaXRWaWV3U2V0dGluZ3MgKG1vZGVsIDogVEhSRUUuR3JvdXAsIHZpZXdBQXNwZWN0IDogbnVtYmVyKSA6IENhbWVyYVNldHRpbmdzIHsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gQ2FtZXJhLmdldERlZmF1bHRCb3VuZGluZ0JveChtb2RlbCk7XHJcblxyXG4gICAgICAgIGxldCB2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucyAgIDogbnVtYmVyID0gKENhbWVyYS5EZWZhdWx0RmllbGRPZlZpZXcgLyAyKSAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICBsZXQgaG9yaXpvbnRhbEZpZWxkT2ZWaWV3UmFkaWFucyA6IG51bWJlciA9IE1hdGguYXRhbih2aWV3QUFzcGVjdCAqIE1hdGgudGFuKHZlcnRpY2FsRmllbGRPZlZpZXdSYWRpYW5zKSk7ICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgY2FtZXJhWlZlcnRpY2FsRXh0ZW50cyAgIDogbnVtYmVyID0gKGJvdW5kaW5nQm94LmdldFNpemUoKS55IC8gMikgLyBNYXRoLnRhbiAodmVydGljYWxGaWVsZE9mVmlld1JhZGlhbnMpOyAgICAgICBcclxuICAgICAgICBsZXQgY2FtZXJhWkhvcml6b250YWxFeHRlbnRzIDogbnVtYmVyID0gKGJvdW5kaW5nQm94LmdldFNpemUoKS54IC8gMikgLyBNYXRoLnRhbiAoaG9yaXpvbnRhbEZpZWxkT2ZWaWV3UmFkaWFucyk7ICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFaID0gTWF0aC5tYXgoY2FtZXJhWlZlcnRpY2FsRXh0ZW50cywgY2FtZXJhWkhvcml6b250YWxFeHRlbnRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAgICAgICBuZXcgVEhSRUUuVmVjdG9yMyhib3VuZGluZ0JveC5nZXRDZW50ZXIoKS54LCBib3VuZGluZ0JveC5nZXRDZW50ZXIoKS55LCBib3VuZGluZ0JveC5tYXgueiArIGNhbWVyYVopLCAgICAgICAgIFxyXG4gICAgICAgICAgICB0YXJnZXQ6ICAgICAgICAgYm91bmRpbmdCb3guZ2V0Q2VudGVyKCksXHJcbiAgICAgICAgICAgIG5lYXI6ICAgICAgICAgICBDYW1lcmEuRGVmYXVsdE5lYXJDbGlwcGluZ1BsYW5lLFxyXG4gICAgICAgICAgICBmYXI6ICAgICAgICAgICAgQ2FtZXJhLkRlZmF1bHRGYXJDbGlwcGluZ1BsYW5lLFxyXG4gICAgICAgICAgICBmaWVsZE9mVmlldzogICAgQ2FtZXJhLkRlZmF1bHRGaWVsZE9mVmlldyAgICAgICAgICAgICBcclxuICAgICAgICB9ICAgICAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIGNhbWVyYSBzZXR0aW5ncyB0byBmaXQgdGhlIG1vZGVsIGluIGEgc3RhbmRhcmQgdmlldy5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7Q2FtZXJhLlN0YW5kYXJkVmlld30gdmlldyBTdGFuZGFyZCB2aWV3IChUb3AsIExlZnQsIGV0Yy4pXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLk9iamVjdDNEfSBtb2RlbCBNb2RlbCB0byBmaXQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmlld0FzcGVjdCBBc3BlY3QgcmF0aW8gb2Ygdmlldy5cclxuICAgICAqIEByZXR1cm5zIHtDYW1lcmFTZXR0aW5nc30gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRTdGFuZGFyZFZpZXdTZXR0aW5ncyAodmlldzogU3RhbmRhcmRWaWV3LCBtb2RlbCA6IFRIUkVFLkdyb3VwLCB2aWV3QXNwZWN0IDogbnVtYmVyKSA6IENhbWVyYVNldHRpbmdzIHsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIENhbWVyYS5nZXRGaXRWaWV3U2V0dGluZ3MobW9kZWwsIHZpZXdBc3BlY3QpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG4iLCIgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgIFxyXG4vKipcclxuICogTWF0aCBMaWJyYXJ5XHJcbiAqIEdlbmVyYWwgbWF0aGVtYXRpY3Mgcm91dGluZXNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0aExpYnJhcnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdHdvIG51bWJlcnMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIEZpcnN0IHZhbHVlIHRvIGNvbXBhcmUuXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIgU2Vjb25kIHZhbHVlIHRvIGNvbXBhcmUuXHJcbiAgICAgKiBAcGFyYW0gdG9sZXJhbmNlIFRvbGVyYW5jZSBmb3IgY29tcGFyaXNvbi5cclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgd2l0aGluIHRvbGVyYW5jZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIG51bWJlcnNFcXVhbFdpdGhpblRvbGVyYW5jZSh2YWx1ZSA6IG51bWJlciwgb3RoZXIgOiBudW1iZXIsIHRvbGVyYW5jZSA6IG51bWJlcikgOiBib29sZWFuIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuICgodmFsdWUgPj0gKG90aGVyIC0gdG9sZXJhbmNlKSkgJiYgKHZhbHVlIDw9IChvdGhlciArIHRvbGVyYW5jZSkpKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7YXNzZXJ0fSAgICAgICAgICAgICBmcm9tICdjaGFpJ1xyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYX0gICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG5pbnRlcmZhY2UgRmFjZVBhaXIge1xyXG4gICAgICAgIFxyXG4gICAgdmVydGljZXMgOiBUSFJFRS5WZWN0b3IzW107XHJcbiAgICBmYWNlcyAgICA6IFRIUkVFLkZhY2UzW107XHJcbn1cclxuICAgICAgICAgIFxyXG4vKipcclxuICogIERlcHRoQnVmZmVyIFxyXG4gKiAgQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXIge1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBNZXNoTW9kZWxOYW1lICAgICAgICAgOiBzdHJpbmcgPSAnTW9kZWxNZXNoJztcclxuICAgIHN0YXRpYyByZWFkb25seSBOb3JtYWxpemVkVG9sZXJhbmNlICAgOiBudW1iZXIgPSAuMDAxOyAgICBcclxuXHJcbiAgICBzdGF0aWMgRGVmYXVsdE1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyA9IHt3aXJlZnJhbWUgOiBmYWxzZSwgY29sb3IgOiAweGZmMDBmZiwgcmVmbGVjdGl2aXR5IDogMC43NSwgc2hpbmluZXNzIDogMC43NX07XHJcbiAgICBcclxuICAgIF9sb2dnZXIgOiBMb2dnZXI7XHJcblxyXG4gICAgX3JnYmFBcnJheSA6IFVpbnQ4QXJyYXk7XHJcbiAgICBkZXB0aHMgICAgIDogRmxvYXQzMkFycmF5O1xyXG4gICAgd2lkdGggICAgICA6IG51bWJlcjtcclxuICAgIGhlaWdodCAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgY2FtZXJhICAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xyXG4gICAgX25lYXJDbGlwUGxhbmUgICA6IG51bWJlcjtcclxuICAgIF9mYXJDbGlwUGxhbmUgICAgOiBudW1iZXI7XHJcbiAgICBfY2FtZXJhQ2xpcFJhbmdlIDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBfbWluaW11bU5vcm1hbGl6ZWQgOiBudW1iZXI7XHJcbiAgICBfbWF4aW11bU5vcm1hbGl6ZWQgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSByZ2JhQXJyYXkgUmF3IGFyYXkgb2YgUkdCQSBieXRlcyBwYWNrZWQgd2l0aCBmbG9hdHMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgbWFwLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgbWFwLlxyXG4gICAgICogQHBhcmFtIG5lYXJDbGlwUGxhbmUgQ2FtZXJhIG5lYXIgY2xpcHBpbmcgcGxhbmUuXHJcbiAgICAgKiBAcGFyYW0gZmFyQ2xpcFBsYW5lIENhbWVyYSBmYXIgY2xpcHBpbmcgcGxhbmUuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHJnYmFBcnJheSA6IFVpbnQ4QXJyYXksIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOm51bWJlciwgY2FtZXJhIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9yZ2JhQXJyYXkgPSByZ2JhQXJyYXk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBjYW1lcmE7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGFzcGVjdCByYXRpb24gb2YgdGhlIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGFzcGVjdFJhdGlvICgpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1pbmltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1pbmltdW1Ob3JtYWxpemVkICgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWluaW11bSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bSA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aCh0aGlzLl9tYXhpbXVtTm9ybWFsaXplZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtaW5pbXVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4aW11bU5vcm1hbGl6ZWQgKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhpbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXhpbXVtKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBtYXhpbXVtID0gdGhpcy5ub3JtYWxpemVkVG9Nb2RlbERlcHRoKHRoaXMubWluaW11bU5vcm1hbGl6ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF4aW11bTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggcmFuZ2Ugb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhbmdlTm9ybWFsaXplZCgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgZGVwdGhOb3JtYWxpemVkIDogbnVtYmVyID0gdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQgLSB0aGlzLl9taW5pbXVtTm9ybWFsaXplZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhbmdlKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBkZXB0aCA6IG51bWJlciA9IHRoaXMubWF4aW11bSAtIHRoaXMubWluaW11bTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGV4dGVudHMgb2YgdGhlIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqLyAgICAgICBcclxuICAgIGNhbGN1bGF0ZUV4dGVudHMgKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNldE1pbmltdW1Ob3JtYWxpemVkKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLnNldE1heGltdW1Ob3JtYWxpemVkKCk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemVcclxuICAgICAqLyAgICAgICBcclxuICAgIGluaXRpYWxpemUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmh0bWxMb2dnZXI7ICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLl9uZWFyQ2xpcFBsYW5lICAgPSB0aGlzLmNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuX2ZhckNsaXBQbGFuZSAgICA9IHRoaXMuY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFDbGlwUmFuZ2UgPSB0aGlzLl9mYXJDbGlwUGxhbmUgLSB0aGlzLl9uZWFyQ2xpcFBsYW5lO1xyXG5cclxuICAgICAgICAvLyBSR0JBIC0+IEZsb2F0MzJcclxuICAgICAgICB0aGlzLmRlcHRocyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fcmdiYUFycmF5LmJ1ZmZlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGV4dHJlbWEgb2YgZGVwdGggYnVmZmVyIHZhbHVlc1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlRXh0ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCBhIG5vcm1hbGl6ZWQgZGVwdGggWzAsMV0gdG8gZGVwdGggaW4gbW9kZWwgdW5pdHMuXHJcbiAgICAgKiBAcGFyYW0gbm9ybWFsaXplZERlcHRoIE5vcm1hbGl6ZWQgZGVwdGggWzAsMV0uXHJcbiAgICAgKi9cclxuICAgIG5vcm1hbGl6ZWRUb01vZGVsRGVwdGgobm9ybWFsaXplZERlcHRoIDogbnVtYmVyKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY2NTIyNTMvZ2V0dGluZy10aGUtdHJ1ZS16LXZhbHVlLWZyb20tdGhlLWRlcHRoLWJ1ZmZlclxyXG4gICAgICAgIG5vcm1hbGl6ZWREZXB0aCA9IDIuMCAqIG5vcm1hbGl6ZWREZXB0aCAtIDEuMDtcclxuICAgICAgICBsZXQgekxpbmVhciA9IDIuMCAqIHRoaXMuY2FtZXJhLm5lYXIgKiB0aGlzLmNhbWVyYS5mYXIgLyAodGhpcy5jYW1lcmEuZmFyICsgdGhpcy5jYW1lcmEubmVhciAtIG5vcm1hbGl6ZWREZXB0aCAqICh0aGlzLmNhbWVyYS5mYXIgLSB0aGlzLmNhbWVyYS5uZWFyKSk7XHJcblxyXG4gICAgICAgIC8vIHpMaW5lYXIgaXMgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNhbWVyYTsgcmV2ZXJzZSB0byB5aWVsZCBoZWlnaHQgZnJvbSBtZXNoIHBsYW5lXHJcbiAgICAgICAgekxpbmVhciA9IC0oekxpbmVhciAtIHRoaXMuY2FtZXJhLmZhcik7XHJcblxyXG4gICAgICAgIHJldHVybiB6TGluZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9ybWFsaXplZCBkZXB0aCB2YWx1ZSBhdCBhIHBpeGVsIGluZGV4XHJcbiAgICAgKiBAcGFyYW0gcm93IEJ1ZmZlciByb3cuXHJcbiAgICAgKiBAcGFyYW0gY29sdW1uIEJ1ZmZlciBjb2x1bW4uXHJcbiAgICAgKi9cclxuICAgIGRlcHRoTm9ybWFsaXplZCAocm93IDogbnVtYmVyLCBjb2x1bW4pIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGV4ID0gKE1hdGgucm91bmQocm93KSAqIHRoaXMud2lkdGgpICsgTWF0aC5yb3VuZChjb2x1bW4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoc1tpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGRlcHRoIHZhbHVlIGF0IGEgcGl4ZWwgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gcm93IE1hcCByb3cuXHJcbiAgICAgKiBAcGFyYW0gcGl4ZWxDb2x1bW4gTWFwIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgZGVwdGgocm93IDogbnVtYmVyLCBjb2x1bW4pIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGRlcHRoTm9ybWFsaXplZCA9IHRoaXMuZGVwdGhOb3JtYWxpemVkKHJvdywgY29sdW1uKTtcclxuICAgICAgICBsZXQgZGVwdGggPSB0aGlzLm5vcm1hbGl6ZWRUb01vZGVsRGVwdGgoZGVwdGhOb3JtYWxpemVkKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZGVwdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBtaW5pbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHNldE1pbmltdW1Ob3JtYWxpemVkKCkge1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bU5vcm1hbGl6ZWQgOiBudW1iZXIgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4OiBudW1iZXIgPSAwOyBpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aDsgaW5kZXgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGhWYWx1ZSA6IG51bWJlciA9IHRoaXMuZGVwdGhzW2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZXB0aFZhbHVlIDwgbWluaW11bU5vcm1hbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICBtaW5pbXVtTm9ybWFsaXplZCA9IGRlcHRoVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQgPSBtaW5pbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG1heGltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TWF4aW11bU5vcm1hbGl6ZWQoKSB7XHJcblxyXG4gICAgICAgIGxldCBtYXhpbXVtTm9ybWFsaXplZCA6IG51bWJlciA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgdGhpcy5kZXB0aHMubGVuZ3RoOyBpbmRleCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aFZhbHVlIDogbnVtYmVyID0gdGhpcy5kZXB0aHNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoZGVwdGhWYWx1ZSA+IG1heGltdW1Ob3JtYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgbWF4aW11bU5vcm1hbGl6ZWQgPSBkZXB0aFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21heGltdW1Ob3JtYWxpemVkID0gbWF4aW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4vKipcclxuICAgICAqIFJldHVybnMgdGhlIGxpbmVhciBpbmRleCBvZiBhIG1vZGVsIHBvaW50IGluIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHdvcmxkVmVydGV4IFZlcnRleCBvZiBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzICh3b3JsZFZlcnRleCA6IFRIUkVFLlZlY3RvcjMsIHBsYW5lQm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgXHJcbiAgICAgICAgbGV0IGJveFNpemUgICAgICA6IFRIUkVFLlZlY3RvcjMgPSBwbGFuZUJvdW5kaW5nQm94LmdldFNpemUoKTtcclxuICAgICAgICBsZXQgbWVzaEV4dGVudHMgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyIChib3hTaXplLngsIGJveFNpemUueSk7XHJcblxyXG4gICAgICAgIC8vICBtYXAgY29vcmRpbmF0ZXMgdG8gb2Zmc2V0cyBpbiByYW5nZSBbMCwgMV1cclxuICAgICAgICBsZXQgb2Zmc2V0WCA6IG51bWJlciA9ICh3b3JsZFZlcnRleC54ICsgKGJveFNpemUueCAvIDIpKSAvIGJveFNpemUueDtcclxuICAgICAgICBsZXQgb2Zmc2V0WSA6IG51bWJlciA9ICh3b3JsZFZlcnRleC55ICsgKGJveFNpemUueSAvIDIpKSAvIGJveFNpemUueTtcclxuXHJcbiAgICAgICAgbGV0IHJvdyAgICA6IG51bWJlciA9IG9mZnNldFkgKiAodGhpcy5oZWlnaHQgLSAxKTtcclxuICAgICAgICBsZXQgY29sdW1uIDogbnVtYmVyID0gb2Zmc2V0WCAqICh0aGlzLndpZHRoIC0gMSk7XHJcbiAgICAgICAgcm93ICAgID0gTWF0aC5yb3VuZChyb3cpO1xyXG4gICAgICAgIGNvbHVtbiA9IE1hdGgucm91bmQoY29sdW1uKTtcclxuXHJcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZSgocm93ID49IDApICYmIChyb3cgPCB0aGlzLmhlaWdodCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIHJvdyA9ICR7cm93fWApKTtcclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChjb2x1bW4+PSAwKSAmJiAoY29sdW1uIDwgdGhpcy53aWR0aCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIGNvbHVtbiA9ICR7Y29sdW1ufWApKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IyKHJvdywgY29sdW1uKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbGluZWFyIGluZGV4IG9mIGEgbW9kZWwgcG9pbnQgaW4gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gd29ybGRWZXJ0ZXggVmVydGV4IG9mIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXRNb2RlbFZlcnRleEluZGV4ICh3b3JsZFZlcnRleCA6IFRIUkVFLlZlY3RvcjMsIHBsYW5lQm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2VzIDogVEhSRUUuVmVjdG9yMiA9IHRoaXMuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHdvcmxkVmVydGV4LCBwbGFuZUJvdW5kaW5nQm94KTsgICAgXHJcbiAgICAgICAgbGV0IHJvdyAgICA6IG51bWJlciA9IGluZGljZXMueDtcclxuICAgICAgICBsZXQgY29sdW1uIDogbnVtYmVyID0gaW5kaWNlcy55O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbmRleCA9IChyb3cgKiB0aGlzLndpZHRoKSArIGNvbHVtbjtcclxuICAgICAgICBpbmRleCA9IE1hdGgucm91bmQoaW5kZXgpO1xyXG5cclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChpbmRleCA+PSAwKSAmJiAoaW5kZXggPCB0aGlzLmRlcHRocy5sZW5ndGgpLCAoYFZlcnRleCAoJHt3b3JsZFZlcnRleC54fSwgJHt3b3JsZFZlcnRleC55fSwgJHt3b3JsZFZlcnRleC56fSkgeWllbGRlZCBpbmRleCA9ICR7aW5kZXh9YCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIENvbnN0cnVjdHMgYSBwYWlyIG9mIHRyaWFuZ3VsYXIgZmFjZXMgYXQgdGhlIGdpdmVuIG9mZnNldCBpbiB0aGUgRGVwdGhCdWZmZXIuXHJcbiAgICAgICogQHBhcmFtIHJvdyBSb3cgb2Zmc2V0IChMb3dlciBMZWZ0KS5cclxuICAgICAgKiBAcGFyYW0gY29sdW1uIENvbHVtbiBvZmZzZXQgKExvd2VyIExlZnQpLlxyXG4gICAgICAqIEBwYXJhbSBmYWNlU2l6ZSBTaXplIG9mIGEgZmFjZSBlZGdlIChub3QgaHlwb3RlbnVzZSkuXHJcbiAgICAgICogQHBhcmFtIGJhc2VWZXJ0ZXhJbmRleCBCZWdpbm5pbmcgb2Zmc2V0IGluIG1lc2ggZ2VvbWV0cnkgdmVydGV4IGFycmF5LlxyXG4gICAgICAqL1xyXG4gICAgIGNvbnN0cnVjdFRyaUZhY2VzQXRPZmZzZXQgKHJvdyA6IG51bWJlciwgY29sdW1uIDogbnVtYmVyLCBtZXNoTG93ZXJMZWZ0IDogVEhSRUUuVmVjdG9yMiwgZmFjZVNpemUgOiBudW1iZXIsIGJhc2VWZXJ0ZXhJbmRleCA6IG51bWJlcikgOiBGYWNlUGFpciB7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICBsZXQgZmFjZVBhaXIgOiBGYWNlUGFpciA9IHtcclxuICAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgICBmYWNlcyAgICA6IFtdXHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIC8vICBWZXJ0aWNlc1xyXG4gICAgICAgICAvLyAgIDIgICAgMyAgICAgICBcclxuICAgICAgICAgLy8gICAwICAgIDFcclxuICAgICBcclxuICAgICAgICAgLy8gY29tcGxldGUgbWVzaCBjZW50ZXIgd2lsbCBiZSBhdCB0aGUgd29ybGQgb3JpZ2luXHJcbiAgICAgICAgIGxldCBvcmlnaW5YIDogbnVtYmVyID0gbWVzaExvd2VyTGVmdC54ICsgKGNvbHVtbiAqIGZhY2VTaXplKTtcclxuICAgICAgICAgbGV0IG9yaWdpblkgOiBudW1iZXIgPSBtZXNoTG93ZXJMZWZ0LnkgKyAocm93ICAgICogZmFjZVNpemUpO1xyXG4gXHJcbiAgICAgICAgIGxldCBsb3dlckxlZnQgICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyAwLCAgICAgICAgIG9yaWdpblkgKyAwLCAgICAgICAgdGhpcy5kZXB0aChyb3cgKyAwLCBjb2x1bW4rIDApKTsgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMFxyXG4gICAgICAgICBsZXQgbG93ZXJSaWdodCAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgZmFjZVNpemUsICBvcmlnaW5ZICsgMCwgICAgICAgIHRoaXMuZGVwdGgocm93ICsgMCwgY29sdW1uICsgMSkpOyAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDFcclxuICAgICAgICAgbGV0IHVwcGVyTGVmdCAgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIDAsICAgICAgICAgb3JpZ2luWSArIGZhY2VTaXplLCB0aGlzLmRlcHRoKHJvdyArIDEsIGNvbHVtbiArIDApKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAyXHJcbiAgICAgICAgIGxldCB1cHBlclJpZ2h0ICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyBmYWNlU2l6ZSwgIG9yaWdpblkgKyBmYWNlU2l6ZSwgdGhpcy5kZXB0aChyb3cgKyAxLCBjb2x1bW4gKyAxKSk7ICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgM1xyXG4gXHJcbiAgICAgICAgIGZhY2VQYWlyLnZlcnRpY2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgbG93ZXJMZWZ0LCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAwXHJcbiAgICAgICAgICAgICAgbG93ZXJSaWdodCwgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAxXHJcbiAgICAgICAgICAgICAgdXBwZXJMZWZ0LCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAyXHJcbiAgICAgICAgICAgICAgdXBwZXJSaWdodCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAzXHJcbiAgICAgICAgICApO1xyXG4gXHJcbiAgICAgICAgICAvLyByaWdodCBoYW5kIHJ1bGUgZm9yIHBvbHlnb24gd2luZGluZ1xyXG4gICAgICAgICAgZmFjZVBhaXIuZmFjZXMucHVzaChcclxuICAgICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoYmFzZVZlcnRleEluZGV4ICsgMCwgYmFzZVZlcnRleEluZGV4ICsgMSwgYmFzZVZlcnRleEluZGV4ICsgMyksXHJcbiAgICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKGJhc2VWZXJ0ZXhJbmRleCArIDAsIGJhc2VWZXJ0ZXhJbmRleCArIDMsIGJhc2VWZXJ0ZXhJbmRleCArIDIpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgIHJldHVybiBmYWNlUGFpcjtcclxuICAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbWVzaCBvZiB0aGUgZ2l2ZW4gYmFzZSBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0gbWVzaFhZRXh0ZW50cyBCYXNlIGRpbWVuc2lvbnMgKG1vZGVsIHVuaXRzKS4gSGVpZ2h0IGlzIGNvbnRyb2xsZWQgYnkgREIgYXNwZWN0IHJhdGlvLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE1hdGVyaWFsIHRvIGFzc2lnbiB0byBtZXNoLlxyXG4gICAgICovXHJcbiAgICBtZXNoKG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWUoXCJtZXNoXCIpO1xyXG4gICAgICAgIGxldCBtZXNoWFlFeHRlbnRzIDogVEhSRUUuVmVjdG9yMiA9IENhbWVyYS5nZXROZWFyUGxhbmVFeHRlbnRzKHRoaXMuY2FtZXJhKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIW1hdGVyaWFsKVxyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbChEZXB0aEJ1ZmZlci5EZWZhdWx0TWVzaFBob25nTWF0ZXJpYWxQYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmYWNlU2l6ZSAgICAgICAgOiBudW1iZXIgPSBtZXNoWFlFeHRlbnRzLnggLyAodGhpcy53aWR0aCAtIDEpO1xyXG4gICAgICAgIGxldCBiYXNlVmVydGV4SW5kZXggOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBsZXQgbWVzaExvd2VyTGVmdCA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigtKG1lc2hYWUV4dGVudHMueCAvIDIpLCAtKG1lc2hYWUV4dGVudHMueSAvIDIpIClcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaVJvdyA9IDA7IGlSb3cgPCAodGhpcy5oZWlnaHQgLSAxKTsgaVJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlDb2x1bW4gPSAwOyBpQ29sdW1uIDwgKHRoaXMud2lkdGggLSAxKTsgaUNvbHVtbisrKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBmYWNlUGFpciA9IHRoaXMuY29uc3RydWN0VHJpRmFjZXNBdE9mZnNldChpUm93LCBpQ29sdW1uLCBtZXNoTG93ZXJMZWZ0LCBmYWNlU2l6ZSwgYmFzZVZlcnRleEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkudmVydGljZXMucHVzaCguLi5mYWNlUGFpci52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkuZmFjZXMucHVzaCguLi5mYWNlUGFpci5mYWNlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmFzZVZlcnRleEluZGV4ICs9IDQ7XHJcbiAgICAgICAgICAgIH0gICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IG1lc2ggID0gbmV3IFRIUkVFLk1lc2gobWVzaEdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgbWVzaC5uYW1lID0gRGVwdGhCdWZmZXIuTWVzaE1vZGVsTmFtZTtcclxuXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKFwibWVzaFwiKTsgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmFseXplcyBwcm9wZXJ0aWVzIG9mIGEgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplICgpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuY2xlYXJMb2coKTtcclxuXHJcbiAgICAgICAgbGV0IG1pZGRsZSA9IHRoaXMud2lkdGggLyAyO1xyXG4gICAgICAgIGxldCBkZWNpbWFsUGxhY2VzID0gNTtcclxuICAgICAgICBsZXQgaGVhZGVyU3R5bGUgICA9IFwiZm9udC1mYW1pbHkgOiBtb25vc3BhY2U7IGZvbnQtd2VpZ2h0IDogYm9sZDsgY29sb3IgOiBibHVlOyBmb250LXNpemUgOiAxOHB4XCI7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2VTdHlsZSAgPSBcImZvbnQtZmFtaWx5IDogbW9ub3NwYWNlOyBjb2xvciA6IGJsYWNrOyBmb250LXNpemUgOiAxNHB4XCI7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKCdDYW1lcmEgUHJvcGVydGllcycsIGhlYWRlclN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTmVhciBQbGFuZSA9ICR7dGhpcy5jYW1lcmEubmVhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBGYXIgUGxhbmUgID0gJHt0aGlzLmNhbWVyYS5mYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgQ2xpcCBSYW5nZSA9ICR7dGhpcy5jYW1lcmEuZmFyIC0gdGhpcy5jYW1lcmEubmVhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFbXB0eUxpbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoJ05vcm1hbGl6ZWQnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENlbnRlciBEZXB0aCA9ICR7dGhpcy5kZXB0aE5vcm1hbGl6ZWQobWlkZGxlLCBtaWRkbGUpLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgWiBSYW5nZSA9ICR7dGhpcy5yYW5nZU5vcm1hbGl6ZWQudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBNaW5pbXVtID0gJHt0aGlzLm1pbmltdW1Ob3JtYWxpemVkLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWF4aW11bSA9ICR7dGhpcy5tYXhpbXVtTm9ybWFsaXplZC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVtcHR5TGluZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZSgnTW9kZWwgVW5pdHMnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENlbnRlciBEZXB0aCA9ICR7dGhpcy5kZXB0aChtaWRkbGUsIG1pZGRsZSkudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBaIFJhbmdlID0gJHt0aGlzLnJhbmdlLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWluaW11bSA9ICR7dGhpcy5taW5pbXVtLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWF4aW11bSA9ICR7dGhpcy5tYXhpbXVtLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgIH1cclxufSIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIFRvb2wgTGlicmFyeVxyXG4gKiBHZW5lcmFsIHV0aWxpdHkgcm91dGluZXNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVG9vbHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gVXRpbGl0eVxyXG4gICAgLy8vIDxzdW1tYXJ5PiAgICAgICAgXHJcbiAgICAvLyBHZW5lcmF0ZSBhIHBzZXVkbyBHVUlELlxyXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgc3RhdGljIGdlbmVyYXRlUHNldWRvR1VJRCgpIHtcclxuICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuICAgICBcclxuICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuLypcclxuICBSZXF1aXJlbWVudHNcclxuICAgIE5vIHBlcnNpc3RlbnQgRE9NIGVsZW1lbnQuIFRoZSBjYW52YXMgaXMgY3JlYXRlZCBkeW5hbWljYWxseS5cclxuICAgICAgICBPcHRpb24gZm9yIHBlcnNpc3RpbmcgdGhlIEZhY3RvcnkgaW4gdGhlIGNvbnN0cnVjdG9yXHJcbiAgICBKU09OIGNvbXBhdGlibGUgY29uc3RydWN0b3IgcGFyYW1ldGVyc1xyXG4gICAgRml4ZWQgcmVzb2x1dGlvbjsgcmVzaXppbmcgc3VwcG9ydCBpcyBub3QgcmVxdWlyZWQuXHJcbiovXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYX0gICAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlcn0gICAgICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtNb2RlbFJlbGllZn0gICAgICAgICAgICBmcm9tICdNb2RlbFJlbGllZidcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUb29sc30gICAgICAgICAgICAgICAgICBmcm9tICdUb29scydcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycyB7XHJcblxyXG4gICAgd2lkdGggICAgICAgICAgICA6IG51bWJlciwgICAgICAgICAgICAgICAgICAvLyB3aWR0aCBvZiBEQlxyXG4gICAgaGVpZ2h0ICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICAvLyBoZWlnaHQgb2YgREIgICAgICAgIFxyXG4gICAgbW9kZWwgICAgICAgICAgICA6IFRIUkVFLkdyb3VwLCAgICAgICAgICAgICAvLyBtb2RlbCByb290XHJcblxyXG4gICAgY2FtZXJhPyAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCAvLyBjYW1lcmFcclxuICAgIFxyXG4gICAgbG9nRGVwdGhCdWZmZXI/ICA6IGJvb2xlYW4sICAgICAgICAgICAgICAgICAvLyB1c2UgbG9nYXJpdGhtaWMgZGVwdGggYnVmZmVyIGZvciBoaWdoZXIgcmVzb2x1dGlvbiAoYmV0dGVyIGRpc3RyaWJ1dGlvbikgaW4gc2NlbmVzIHdpdGggbGFyZ2UgZXh0ZW50c1xyXG4gICAgYm91bmRlZENsaXBwaW5nPyA6IGJvb2xlYW4sICAgICAgICAgICAgICAgICAvLyBvdmVycnJpZCBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzIHRvIGJvdW5kIG1vZGVsXHJcbiAgICBcclxuICAgIGFkZENhbnZhc1RvRE9NPyAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVzaEdlbmVyYXRlUGFyYW1ldGVycyB7XHJcblxyXG4gICAgY2FtZXJhPyAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xyXG4gICAgbWF0ZXJpYWw/ICAgICAgICA6IFRIUkVFLk1hdGVyaWFsO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlckZhY3RvcnlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlckZhY3Rvcnkge1xyXG5cclxuICAgIHN0YXRpYyBEZWZhdWx0UmVzb2x1dGlvbiA6IG51bWJlciAgICAgICAgICAgPSAxMDI0OyAgICAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgREIgcmVzb2x1dGlvblxyXG4gICAgc3RhdGljIE5lYXJQbGFuZUVwc2lsb25lIDogbnVtYmVyICAgICAgICAgICA9IC4wMDE7ICAgICAgICAgICAgICAgICAgICAgLy8gYWRqdXN0bWVudCB0byBhdm9pZCBjbGlwcGluZyBnZW9tZXRyeSBvbiB0aGUgbmVhciBwbGFuZVxyXG4gICAgXHJcbiAgICBzdGF0aWMgQ3NzQ2xhc3NOYW1lICAgICAgOiBzdHJpbmcgICAgICAgICAgID0gJ0RlcHRoQnVmZmVyRmFjdG9yeSc7ICAgICAvLyBDU1MgY2xhc3NcclxuICAgIHN0YXRpYyBSb290Q29udGFpbmVySWQgICA6IHN0cmluZyAgICAgICAgICAgPSAncm9vdENvbnRhaW5lcic7ICAgICAgICAgIC8vIHJvb3QgY29udGFpbmVyIGZvciB2aWV3ZXJzXHJcbiAgICBcclxuICAgIF9zY2VuZSAgICAgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gdGFyZ2V0IHNjZW5lXHJcbiAgICBfbW9kZWwgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHRhcmdldCBtb2RlbFxyXG5cclxuICAgIF9yZW5kZXJlciAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlcmVyICAgICAgPSBudWxsOyAgICAgLy8gc2NlbmUgcmVuZGVyZXJcclxuICAgIF9jYW52YXMgICAgICAgICAgOiBIVE1MQ2FudmFzRWxlbWVudCAgICAgICAgPSBudWxsOyAgICAgLy8gRE9NIGNhbnZhcyBzdXBwb3J0aW5nIHJlbmRlcmVyXHJcbiAgICBfd2lkdGggICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgID0gRGVwdGhCdWZmZXJGYWN0b3J5LkRlZmF1bHRSZXNvbHV0aW9uOyAgICAgLy8gd2lkdGggcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuICAgIF9oZWlnaHQgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgPSBEZXB0aEJ1ZmZlckZhY3RvcnkuRGVmYXVsdFJlc29sdXRpb247ICAgICAvLyBoZWlnaHQgcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuXHJcbiAgICBfY2FtZXJhICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgID0gbnVsbDsgICAgIC8vIHBlcnNwZWN0aXZlIGNhbWVyYSB0byBnZW5lcmF0ZSB0aGUgZGVwdGggYnVmZmVyXHJcblxyXG5cclxuICAgIF9sb2dEZXB0aEJ1ZmZlciAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdXNlIGEgbG9nYXJpdGhtaWMgYnVmZmVyIGZvciBtb3JlIGFjY3VyYWN5IGluIGxhcmdlIHNjZW5lc1xyXG4gICAgX2JvdW5kZWRDbGlwcGluZyA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICA9IHRydWU7ICAgICAvLyBvdmVycmlkZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzOyBzZXQgbmVhciBhbmQgZmFyIHRvIGJvdW5kIG1vZGVsIGZvciBpbXByb3ZlZCBhY2N1cmFjeVxyXG5cclxuICAgIF9kZXB0aEJ1ZmZlciAgICAgOiBEZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gZGVwdGggYnVmZmVyIFxyXG4gICAgX3RhcmdldCAgICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBjcmVhdGluZyB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHdoZW4gcmVuZGVyaW5nIHRoZSBzY2VuZVxyXG4gICAgX2VuY29kZWRUYXJnZXQgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBlbmNvZGluIHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgaW50byBhIGZsb2F0aW5nIHBvaW50IChSR0JBIGZvcm1hdClcclxuXHJcbiAgICBfcG9zdFNjZW5lICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHNpbmdsZSBwb2x5Z29uIHNjZW5lIHVzZSB0byBnZW5lcmF0ZSB0aGUgZW5jb2RlZCBSR0JBIGJ1ZmZlclxyXG4gICAgX3Bvc3RDYW1lcmEgICAgICA6IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSA9IG51bGw7ICAgICAvLyBvcnRob2dyYXBoaWMgY2FtZXJhXHJcbiAgICBfcG9zdE1hdGVyaWFsICAgIDogVEhSRUUuU2hhZGVyTWF0ZXJpYWwgICAgID0gbnVsbDsgICAgIC8vIHNoYWRlciBtYXRlcmlhbCB0aGF0IGVuY29kZXMgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciBpbnRvIGEgZmxvYXRpbmcgcG9pbnQgUkdCQSBmb3JtYXRcclxuXHJcbiAgICBfbWluaW11bVdlYkdMICAgIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gdHJ1ZTsgICAgIC8vIHRydWUgaWYgbWluaW11bSBXZUdMIHJlcXVpcmVtZW50cyBhcmUgcHJlc2VudFxyXG4gICAgX2xvZ2dlciAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBsb2dnZXJcclxuICAgIF9hZGRDYW52YXNUb0RPTSAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MIHBhZ2VcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgSW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyAoRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVycyA6IERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgLy8gcmVxdWlyZWRcclxuICAgICAgICB0aGlzLl93aWR0aCAgICAgICAgICAgPSBwYXJhbWV0ZXJzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAgICAgICAgICA9IHBhcmFtZXRlcnMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX21vZGVsICAgICAgICAgICA9IHBhcmFtZXRlcnMubW9kZWwuY2xvbmUodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhICAgICAgICAgID0gcGFyYW1ldGVycy5jYW1lcmEgICAgICAgICAgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLl9sb2dEZXB0aEJ1ZmZlciAgPSBwYXJhbWV0ZXJzLmxvZ0RlcHRoQnVmZmVyICB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ib3VuZGVkQ2xpcHBpbmcgPSBwYXJhbWV0ZXJzLmJvdW5kZWRDbGlwcGluZyB8fCB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2FkZENhbnZhc1RvRE9NICA9IHBhcmFtZXRlcnMuYWRkQ2FudmFzVG9ET00gIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSB0aGlzLmluaXRpYWxpemVDYW52YXMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVmVyaWZpZXMgdGhlIG1pbmltdW0gV2ViR0wgZXh0ZW5zaW9ucyBhcmUgcHJlc2VudC5cclxuICAgICAqIEBwYXJhbSByZW5kZXJlciBXZWJHTCByZW5kZXJlci5cclxuICAgICAqL1xyXG4gICAgdmVyaWZ5V2ViR0xFeHRlbnNpb25zKCkgOiBib29sZWFuIHsgXHJcbiAgICBcclxuICAgICAgICBpZiAoIXRoaXMuX3JlbmRlcmVyLmV4dGVuc2lvbnMuZ2V0KCdXRUJHTF9kZXB0aF90ZXh0dXJlJykpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWluaW11bVdlYkdMID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoJ1RoZSBtaW5pbXVtIFdlYkdMIGV4dGVuc2lvbnMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXIuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlIGEgbW91c2UgZG93biBldmVudCBvbiB0aGUgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBvbk1vdXNlRG93bihldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0KSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgZGV2aWNlQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gR3JhcGhpY3MuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCwgJChldmVudC50YXJnZXQpKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYGRldmljZSA9ICR7ZGV2aWNlQ29vcmRpbmF0ZXMueH0sICR7ZGV2aWNlQ29vcmRpbmF0ZXMueX1gKTtcclxuXHJcbiAgICAgICAgbGV0IGRlY2ltYWxQbGFjZXMgICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHJvdyAgICAgICAgICAgICA6IG51bWJlciA9IChkZXZpY2VDb29yZGluYXRlcy55ICsgMSkgLyAyICogdGhpcy5fZGVwdGhCdWZmZXIuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBjb2x1bW4gICAgICAgICAgOiBudW1iZXIgPSAoZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMiAqIHRoaXMuX2RlcHRoQnVmZmVyLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgT2Zmc2V0ID0gWyR7cm93fSwgJHtjb2x1bW59XWApOyAgICAgICBcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYERlcHRoID0gJHt0aGlzLl9kZXB0aEJ1ZmZlci5kZXB0aChyb3csIGNvbHVtbikudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gKTsgICAgICAgXHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSBXZWJHTCB0YXJnZXQgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FudmFzKCkgOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICBcclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMuc2V0QXR0cmlidXRlKCduYW1lJywgVG9vbHMuZ2VuZXJhdGVQc2V1ZG9HVUlEKCkpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgRGVwdGhCdWZmZXJGYWN0b3J5LkNzc0NsYXNzTmFtZSk7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciBkaW1lbnNpb25zICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbnZhcy53aWR0aCAgPSB0aGlzLl93aWR0aDtcclxuICAgICAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0OyBcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt0aGlzLl93aWR0aH1weGA7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuX2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIC8vIGFkZCB0byBET00/XHJcbiAgICAgICAgaWYgKHRoaXMuX2FkZENhbnZhc1RvRE9NKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtEZXB0aEJ1ZmZlckZhY3RvcnkuUm9vdENvbnRhaW5lcklkfWApLmFwcGVuZENoaWxkKHRoaXMuX2NhbnZhcyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgJGNhbnZhcyA9ICQodGhpcy5fY2FudmFzKS5vbignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uIG9mIHRoZSByZW5kZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTY2VuZSAoKSA6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLl9zY2VuZS5hZGQodGhpcy5fbW9kZWwpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZyh0aGlzLl9zY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSAgbW9kZWwgdmlldy5cclxuICAgICAqL1xyXG4gICAgIGluaXRpYWxpemVSZW5kZXJlcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigge2NhbnZhcyA6IHRoaXMuX2NhbnZhcywgbG9nYXJpdGhtaWNEZXB0aEJ1ZmZlciA6IHRoaXMuX2xvZ0RlcHRoQnVmZmVyfSk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gTW9kZWwgU2NlbmUgLT4gKFJlbmRlciBUZXh0dXJlLCBEZXB0aCBUZXh0dXJlKVxyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRoaXMuY29uc3RydWN0RGVwdGhUZXh0dXJlUmVuZGVyVGFyZ2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEVuY29kZWQgUkdCQSBUZXh0dXJlIGZyb20gRGVwdGggVGV4dHVyZVxyXG4gICAgICAgIHRoaXMuX2VuY29kZWRUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcblxyXG4gICAgICAgIHRoaXMudmVyaWZ5V2ViR0xFeHRlbnNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGRlZmF1bHQgbGlnaHRpbmcgaW4gdGhlIHNjZW5lLlxyXG4gICAgICogTGlnaHRpbmcgZG9lcyBub3QgYWZmZWN0IHRoZSBkZXB0aCBidWZmZXIuIEl0IGlzIG9ubHkgdXNlZCBpZiB0aGUgY2FudmFzIGlzIG1hZGUgdmlzaWJsZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nIChzY2VuZSA6IFRIUkVFLlNjZW5lKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC4yKTtcclxuICAgICAgICBzY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCgxLCAxLCAxKTtcclxuICAgICAgICBzY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQcmltYXJ5ICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUHJpbWFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3QoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gUG9zdFByb2Nlc3NpbmdcclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIHJlbmRlciB0YXJnZXQgPHdpdGggYSBkZXB0aCB0ZXh0dXJlIGJ1ZmZlcj4uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdERlcHRoVGV4dHVyZVJlbmRlclRhcmdldCgpIDogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQge1xyXG5cclxuICAgICAgICAvLyBNb2RlbCBTY2VuZSAtPiAoUmVuZGVyIFRleHR1cmUsIERlcHRoIFRleHR1cmUpXHJcbiAgICAgICAgbGV0IHJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUuZm9ybWF0ICAgICAgICAgICA9IFRIUkVFLlJHQkFGb3JtYXQ7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUudHlwZSAgICAgICAgICAgICA9IFRIUkVFLlVuc2lnbmVkQnl0ZVR5cGU7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUubWluRmlsdGVyICAgICAgICA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUubWFnRmlsdGVyICAgICAgICA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzICA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZW5kZXJUYXJnZXQuc3RlbmNpbEJ1ZmZlciAgICAgICAgICAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSB0cnVlO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aFRleHR1cmUgICAgICAgICAgICAgPSBuZXcgVEhSRUUuRGVwdGhUZXh0dXJlKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aFRleHR1cmUudHlwZSAgICAgICAgPSBUSFJFRS5VbnNpZ25lZEludFR5cGU7XHJcbiAgICBcclxuICAgICAgICByZXR1cm4gcmVuZGVyVGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHBvc3Qgc2NlbmUgdXNlZCB0byBjcmVhdGUgdGhlIGZpbmFsIFJHQkEgZW5jb2RlZCBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0U2NlbmUgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHBvc3RNZXNoTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2ZXJ0ZXhTaGFkZXI6ICAgTVIuc2hhZGVyU291cmNlWydEZXB0aEJ1ZmZlclZlcnRleFNoYWRlciddLFxyXG4gICAgICAgICAgICBmcmFnbWVudFNoYWRlcjogTVIuc2hhZGVyU291cmNlWydEZXB0aEJ1ZmZlckZyYWdtZW50U2hhZGVyJ10sXHJcblxyXG4gICAgICAgICAgICB1bmlmb3Jtczoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhTmVhciAgOiAgIHsgdmFsdWU6IHRoaXMuX2NhbWVyYS5uZWFyIH0sXHJcbiAgICAgICAgICAgICAgICBjYW1lcmFGYXIgICA6ICAgeyB2YWx1ZTogdGhpcy5fY2FtZXJhLmZhciB9LFxyXG4gICAgICAgICAgICAgICAgdERpZmZ1c2UgICAgOiAgIHsgdmFsdWU6IHRoaXMuX3RhcmdldC50ZXh0dXJlIH0sXHJcbiAgICAgICAgICAgICAgICB0RGVwdGggICAgICA6ICAgeyB2YWx1ZTogdGhpcy5fdGFyZ2V0LmRlcHRoVGV4dHVyZSB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgcG9zdE1lc2hQbGFuZSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDIsIDIpO1xyXG4gICAgICAgIGxldCBwb3N0TWVzaFF1YWQgID0gbmV3IFRIUkVFLk1lc2gocG9zdE1lc2hQbGFuZSwgcG9zdE1lc2hNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3RTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuX3Bvc3RTY2VuZS5hZGQocG9zdE1lc2hRdWFkKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdENhbWVyYSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpZ2h0aW5nKHRoaXMuX3Bvc3RTY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIHRoZSBvcnRob2dyYXBoaWMgY2FtZXJhIHVzZWQgdG8gY29udmVydCB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHRvIHRoZSBlbmNvZGVkIFJHQkEgYnVmZmVyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0Q2FtZXJhKCkge1xyXG5cclxuICAgICAgICAvLyBTZXR1cCBwb3N0IHByb2Nlc3Npbmcgc3RhZ2VcclxuICAgICAgICBsZXQgbGVmdDogbnVtYmVyICAgICAgPSAgLTE7XHJcbiAgICAgICAgbGV0IHJpZ2h0OiBudW1iZXIgICAgID0gICAxO1xyXG4gICAgICAgIGxldCB0b3A6IG51bWJlciAgICAgICA9ICAgMTtcclxuICAgICAgICBsZXQgYm90dG9tOiBudW1iZXIgICAgPSAgLTE7XHJcbiAgICAgICAgbGV0IG5lYXI6IG51bWJlciAgICAgID0gICAwO1xyXG4gICAgICAgIGxldCBmYXI6IG51bWJlciAgICAgICA9ICAgMTtcclxuXHJcbiAgICAgICAgdGhpcy5fcG9zdENhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0ICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RDYW1lcmEoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gR2VuZXJhdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBWZXJpZmllcyB0aGUgcHJlLXJlcXVpc2l0ZSBzZXR0aW5ncyBhcmUgZGVmaW5lZCB0byBjcmVhdGUgYSBtZXNoLlxyXG4gICAgICovXHJcbiAgICB2ZXJpZnlNZXNoU2V0dGluZ3MoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGxldCBtaW5pbXVtU2V0dGluZ3MgOiBib29sZWFuID0gdHJ1ZVxyXG4gICAgICAgIGxldCBlcnJvclByZWZpeCAgICAgOiBzdHJpbmcgPSAnRGVwdGhCdWZmZXJGYWN0b3J5OiAnO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYCR7ZXJyb3JQcmVmaXh9VGhlIG1vZGVsIGlzIG5vdCBkZWZpbmVkLmApO1xyXG4gICAgICAgICAgICBtaW5pbXVtU2V0dGluZ3MgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYCR7ZXJyb3JQcmVmaXh9VGhlIGNhbWVyYSBpcyBub3QgZGVmaW5lZC5gKTtcclxuICAgICAgICAgICAgbWluaW11bVNldHRpbmdzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWluaW11bVNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhbiBSR0JBIHN0cmluZyB3aXRoIHRoZSBieXRlIHZhbHVlcyBvZiBhIHBpeGVsLlxyXG4gICAgICogQHBhcmFtIGJ1ZmZlciBVbnNpZ25lZCBieXRlIHJhdyBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0gcm93IFBpeGVsIHJvdy5cclxuICAgICAqIEBwYXJhbSBjb2x1bW4gQ29sdW1uIHJvdy5cclxuICAgICAqL1xyXG4gICAgIHVuc2lnbmVkQnl0ZXNUb1JHQkEgKGJ1ZmZlciA6IFVpbnQ4QXJyYXksIHJvdyA6IG51bWJlciwgY29sdW1uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IChyb3cgKiB0aGlzLl93aWR0aCkgKyBjb2x1bW47XHJcbiAgICAgICAgbGV0IHJWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAwXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGdWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAxXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGJWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAyXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGFWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAzXS50b1N0cmluZygxNik7XHJcblxyXG4gICAgICAgIHJldHVybiBgIyR7clZhbHVlfSR7Z1ZhbHVlfSR7YlZhbHVlfSAke2FWYWx1ZX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZXMgYSBwaXhlbCBmcm9tIGEgcmVuZGVyIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZVJlbmRlckJ1ZmZlciAoKSB7XHJcblxyXG4gICAgICAgIGxldCByZW5kZXJCdWZmZXIgPSAgbmV3IFVpbnQ4QXJyYXkodGhpcy5fd2lkdGggKiB0aGlzLl9oZWlnaHQgKiA0KS5maWxsKDApO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlYWRSZW5kZXJUYXJnZXRQaXhlbHModGhpcy5fdGFyZ2V0LCAwLCAwLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCByZW5kZXJCdWZmZXIpO1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZVN0cmluZyA9IGBSR0JBWzAsIDBdID0gJHt0aGlzLnVuc2lnbmVkQnl0ZXNUb1JHQkEocmVuZGVyQnVmZmVyLCAwLCAwKX1gO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKG1lc3NhZ2VTdHJpbmcsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZSB0aGUgcmVuZGVyIGFuZCBkZXB0aCB0YXJnZXRzLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplVGFyZ2V0cyAoKSAge1xyXG5cclxuLy8gICAgICB0aGlzLmFuYWx5emVSZW5kZXJCdWZmZXIoKTtcclxuLy8gICAgICB0aGlzLl9kZXB0aEJ1ZmZlci5hbmFseXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZURlcHRoQnVmZmVyKCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWUoXCJjcmVhdGVEZXB0aEJ1ZmZlclwiKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fc2NlbmUsIHRoaXMuX2NhbWVyYSwgdGhpcy5fdGFyZ2V0KTsgICAgXHJcbiAgICBcclxuICAgICAgICAvLyAob3B0aW9uYWwpIHByZXZpZXcgZW5jb2RlZCBSR0JBIHRleHR1cmU7IGRyYXduIGJ5IHNoYWRlciBidXQgbm90IHBlcnNpc3RlZFxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9wb3N0U2NlbmUsIHRoaXMuX3Bvc3RDYW1lcmEpOyAgICBcclxuXHJcbiAgICAgICAgLy8gUGVyc2lzdCBlbmNvZGVkIFJHQkEgdGV4dHVyZTsgY2FsY3VsYXRlZCBmcm9tIGRlcHRoIGJ1ZmZlclxyXG4gICAgICAgIC8vIGVuY29kZWRUYXJnZXQudGV4dHVyZSAgICAgIDogZW5jb2RlZCBSR0JBIHRleHR1cmVcclxuICAgICAgICAvLyBlbmNvZGVkVGFyZ2V0LmRlcHRoVGV4dHVyZSA6IG51bGxcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fcG9zdFNjZW5lLCB0aGlzLl9wb3N0Q2FtZXJhLCB0aGlzLl9lbmNvZGVkVGFyZ2V0KTsgXHJcblxyXG4gICAgICAgIC8vIGRlY29kZSBSR0JBIHRleHR1cmUgaW50byBkZXB0aCBmbG9hdHNcclxuICAgICAgICBsZXQgZGVwdGhCdWZmZXJSR0JBID0gIG5ldyBVaW50OEFycmF5KHRoaXMuX3dpZHRoICogdGhpcy5faGVpZ2h0ICogNCkuZmlsbCgwKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZWFkUmVuZGVyVGFyZ2V0UGl4ZWxzKHRoaXMuX2VuY29kZWRUYXJnZXQsIDAsIDAsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIGRlcHRoQnVmZmVyUkdCQSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlcHRoQnVmZmVyID0gbmV3IERlcHRoQnVmZmVyKGRlcHRoQnVmZmVyUkdCQSwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgdGhpcy5fY2FtZXJhKTsgICAgXHJcblxyXG4gICAgICAgIHRoaXMuYW5hbHl6ZVRhcmdldHMoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKFwiY3JlYXRlRGVwdGhCdWZmZXJcIik7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNhbWVyYSBjbGlwcGluZyBwbGFuZXMgZm9yIG1lc2ggZ2VuZXJhdGlvbi5cclxuICAgICAqL1xyXG4gICAgc2V0Q2FtZXJhQ2xpcHBpbmdQbGFuZXMgKCkge1xyXG5cclxuICAgICAgICAvLyBjb3B5IGNhbWVyYTsgc2hhcmVkIHdpdGggTW9kZWxWaWV3ZXJcclxuICAgICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XHJcbiAgICAgICAgY2FtZXJhLmNvcHkgKHRoaXMuX2NhbWVyYSk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xyXG5cclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX2NhbWVyYS5tYXRyaXhXb3JsZEludmVyc2U7XHJcblxyXG4gICAgICAgIC8vIGNsb25lIG1vZGVsIChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBtb2RlbFZpZXcgICAgICAgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QodGhpcy5fbW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldyA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChtb2RlbFZpZXcpO1xyXG5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgYm94IGlzIHdvcmxkLWF4aXMgYWxpZ25lZC4gXHJcbiAgICAgICAgLy8gSW4gVmlldyBjb29yZGluYXRlcywgdGhlIGNhbWVyYSBpcyBhdCB0aGUgb3JpZ2luLlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBuZWFyIHBsYW5lIGlzIHRoZSBtYXhpbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgZmFyIHBsYW5lIGlzIHRoZSBtaW5pbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICBsZXQgbmVhclBsYW5lID0gLWJvdW5kaW5nQm94Vmlldy5tYXguejtcclxuICAgICAgICBsZXQgZmFyUGxhbmUgID0gLWJvdW5kaW5nQm94Vmlldy5taW4uejtcclxuXHJcbiAgICAgICAgLy8gYWRqdXN0IGJ5IGVwc2lsb24gdG8gYXZvaWQgY2xpcHBpbmcgZ2VvbWV0cnkgYXQgdGhlIG5lYXIgcGxhbmUgZWRnZVxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5uZWFyID0gKDEgLSBEZXB0aEJ1ZmZlckZhY3RvcnkuTmVhclBsYW5lRXBzaWxvbmUpICogbmVhclBsYW5lO1xyXG5cclxuICAgICAgICAvLyBhbGxvdyB1c2VyIHRvIG92ZXJyaWRlIGNhbGN1bGF0ZWQgZmFyIHBsYW5lXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLmZhciAgPSBNYXRoLm1pbih0aGlzLl9jYW1lcmEuZmFyLCBmYXJQbGFuZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIG1lc2ggZnJvbSB0aGUgYWN0aXZlIG1vZGVsIGFuZCBjYW1lcmFcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEdlbmVyYXRpb24gcGFyYW1ldGVycyAoTWVzaEdlbmVyYXRlUGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgbWVzaEdlbmVyYXRlIChwYXJhbWV0ZXJzIDogTWVzaEdlbmVyYXRlUGFyYW1ldGVycykgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMudmVyaWZ5TWVzaFNldHRpbmdzKCkpIFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5fYm91bmRlZENsaXBwaW5nKVxyXG4gICAgICAgICAgICB0aGlzLnNldENhbWVyYUNsaXBwaW5nUGxhbmVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVwdGhCdWZmZXIoKTtcclxuICAgICAgICBsZXQgbWVzaCA9IHRoaXMuX2RlcHRoQnVmZmVyLm1lc2gocGFyYW1ldGVycy5tYXRlcmlhbCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgYW4gaW1hZ2UgZnJvbSB0aGUgYWN0aXZlIG1vZGVsIGFuZCBjYW1lcmFcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEdlbmVyYXRpb24gcGFyYW1ldGVycyAoSW1hZ2VHZW5lcmF0ZVBhcmFtZXRlcnMpXHJcbiAgICAgKi9cclxuICAgIGltYWdlR2VuZXJhdGUgKHBhcmFtZXRlcnMgOiBJbWFnZUdlbmVyYXRlUGFyYW1ldGVycykgOiBVaW50OEFycmF5IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuICAgICAgICAgXHJcbmV4cG9ydCBpbnRlcmZhY2UgTVJFdmVudCB7XHJcblxyXG4gICAgdHlwZSAgICA6IEV2ZW50VHlwZTtcclxuICAgIHRhcmdldCAgOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEV2ZW50VHlwZSB7XHJcblxyXG4gICAgTm9uZSxcclxuICAgIE5ld01vZGVsLFxyXG4gICAgTWVzaEdlbmVyYXRlXHJcbn1cclxuXHJcbnR5cGUgTGlzdGVuZXIgPSAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZDtcclxudHlwZSBMaXN0ZW5lckFycmF5ID0gTGlzdGVuZXJbXVtdOyAgLy8gTGlzdGVuZXJbXVtFdmVudFR5cGVdO1xyXG5cclxuLyoqXHJcbiAqIEV2ZW50IE1hbmFnZXJcclxuICogR2VuZXJhbCBldmVudCBtYW5hZ2VtZW50IGFuZCBkaXNwYXRjaGluZy5cclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuXHJcbiAgICBfbGlzdGVuZXJzIDogTGlzdGVuZXJBcnJheTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAvKlxyXG4gICAgICogQ3JlYXRlcyBFdmVudE1hbmFnZXIgb2JqZWN0LiBJdCBuZWVkcyB0byBiZSBjYWxsZWQgd2l0aCAnLmNhbGwnIHRvIGFkZCB0aGUgZnVuY3Rpb25hbGl0eSB0byBhbiBvYmplY3QuXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gYW4gZXZlbnQgdHlwZS5cclxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0aGF0IGdldHMgYWRkZWQuXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHRoYXQgZ2V0cyBhZGRlZC5cclxuICAgICAqL1xyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGUsIGxpc3RlbmVyOiAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZCApOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbRXZlbnRUeXBlLk5vbmVdID0gW107XHJcbiAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGRvZXMgbm90IGV4aXN0OyBjcmVhdGVcclxuICAgICAgICBpZiAobGlzdGVuZXJzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGxpc3RlbmVyc1t0eXBlXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZG8gbm90aGluZyBpZiBsaXN0ZW5lciByZWdpc3RlcmVkXHJcbiAgICAgICAgaWYgKGxpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGFkZCBuZXcgbGlzdGVuZXIgdG8gdGhpcyBldmVudFxyXG4gICAgICAgICAgICBsaXN0ZW5lcnNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyB3aGV0aGVyIGEgbGlzdGVuZXIgaXMgcmVnaXN0ZXJlZCBmb3IgYW4gZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgdG8gY2hlY2suXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIGNoZWNrLi5cclxuICAgICAqL1xyXG4gICAgaGFzRXZlbnRMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGUsIGxpc3RlbmVyOiAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHMgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICAvLyBldmVudCBleGlzdHMgYW5kIGxpc3RlbmVyIHJlZ2lzdGVyZWQgPT4gdHJ1ZVxyXG4gICAgICAgIHJldHVybiBsaXN0ZW5lcnNbdHlwZV0gIT09IHVuZGVmaW5lZCAmJiBsaXN0ZW5lcnNbdHlwZV0uaW5kZXhPZihsaXN0ZW5lcikgIT09IC0gMTsgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gYW4gZXZlbnQgdHlwZS5cclxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0aGF0IGdldHMgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdGhhdCBnZXRzIHJlbW92ZWQuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZTogRXZlbnRUeXBlLCBsaXN0ZW5lcjogKGV2ZW50OiBNUkV2ZW50LCAuLi5hcmdzIDogYW55W10pID0+IHZvaWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gbm8gZXZlbnRzOyBkbyBub3RoaW5nXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkICkgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xyXG4gICAgICAgIGxldCBsaXN0ZW5lckFycmF5ID0gbGlzdGVuZXJzW3R5cGVdO1xyXG5cclxuICAgICAgICBpZiAobGlzdGVuZXJBcnJheSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdGVuZXJBcnJheS5pbmRleE9mKGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBpZiBmb3VuZFxyXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZpcmUgYW4gZXZlbnQgdHlwZS5cclxuICAgICAqIEBwYXJhbSB0YXJnZXQgRXZlbnQgdGFyZ2V0LlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgZXZlbnQgdGhhdCBnZXRzIGZpcmVkLlxyXG4gICAgICovXHJcbiAgICBkaXNwYXRjaEV2ZW50KHRhcmdldCA6IGFueSwgZXZlbnRUeXBlIDogRXZlbnRUeXBlLCAuLi5hcmdzIDogYW55W10pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gbm8gZXZlbnRzIGRlZmluZWQ7IGRvIG5vdGhpbmdcclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVycyAgICAgPSB0aGlzLl9saXN0ZW5lcnM7ICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lckFycmF5ID0gbGlzdGVuZXJzW2V2ZW50VHlwZV07XHJcblxyXG4gICAgICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB0aGVFdmVudCA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGUgICA6IGV2ZW50VHlwZSwgICAgICAgICAvLyB0eXBlXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgOiB0YXJnZXQgICAgICAgICAgICAgLy8gc2V0IHRhcmdldCB0byBpbnN0YW5jZSB0cmlnZ2VyaW5nIHRoZSBldmVudFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBkdXBsaWNhdGUgb3JpZ2luYWwgYXJyYXkgb2YgbGlzdGVuZXJzXHJcbiAgICAgICAgICAgIGxldCBhcnJheSA9IGxpc3RlbmVyQXJyYXkuc2xpY2UoMCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDAgOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGFycmF5W2luZGV4XSh0aGVFdmVudCwgLi4uYXJncyk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gT0JKTG9hZGVyICggbWFuYWdlciApIHtcclxuXHJcbiAgICB0aGlzLm1hbmFnZXIgPSAoIG1hbmFnZXIgIT09IHVuZGVmaW5lZCApID8gbWFuYWdlciA6IFRIUkVFLkRlZmF1bHRMb2FkaW5nTWFuYWdlcjtcclxuXHJcbiAgICB0aGlzLm1hdGVyaWFscyA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5yZWdleHAgPSB7XHJcbiAgICAgICAgLy8gdiBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIHZlcnRleF9wYXR0ZXJuICAgICAgICAgICA6IC9edlxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKS8sXHJcbiAgICAgICAgLy8gdm4gZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgICAgICBub3JtYWxfcGF0dGVybiAgICAgICAgICAgOiAvXnZuXFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyB2dCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIHV2X3BhdHRlcm4gICAgICAgICAgICAgICA6IC9ednRcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4XHJcbiAgICAgICAgZmFjZV92ZXJ0ZXggICAgICAgICAgICAgIDogL15mXFxzKygtP1xcZCspXFxzKygtP1xcZCspXFxzKygtP1xcZCspKD86XFxzKygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgICAgICBmYWNlX3ZlcnRleF91diAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBmIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsXHJcbiAgICAgICAgZmFjZV92ZXJ0ZXhfdXZfbm9ybWFsICAgIDogL15mXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgZmFjZV92ZXJ0ZXhfbm9ybWFsICAgICAgIDogL15mXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gbyBvYmplY3RfbmFtZSB8IGcgZ3JvdXBfbmFtZVxyXG4gICAgICAgIG9iamVjdF9wYXR0ZXJuICAgICAgICAgICA6IC9eW29nXVxccyooLispPy8sXHJcbiAgICAgICAgLy8gcyBib29sZWFuXHJcbiAgICAgICAgc21vb3RoaW5nX3BhdHRlcm4gICAgICAgIDogL15zXFxzKyhcXGQrfG9ufG9mZikvLFxyXG4gICAgICAgIC8vIG10bGxpYiBmaWxlX3JlZmVyZW5jZVxyXG4gICAgICAgIG1hdGVyaWFsX2xpYnJhcnlfcGF0dGVybiA6IC9ebXRsbGliIC8sXHJcbiAgICAgICAgLy8gdXNlbXRsIG1hdGVyaWFsX25hbWVcclxuICAgICAgICBtYXRlcmlhbF91c2VfcGF0dGVybiAgICAgOiAvXnVzZW10bCAvXHJcbiAgICB9O1xyXG5cclxufTtcclxuXHJcbk9CSkxvYWRlci5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgY29uc3RydWN0b3I6IE9CSkxvYWRlcixcclxuXHJcbiAgICBsb2FkOiBmdW5jdGlvbiAoIHVybCwgb25Mb2FkLCBvblByb2dyZXNzLCBvbkVycm9yICkge1xyXG5cclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkZpbGVMb2FkZXIoIHNjb3BlLm1hbmFnZXIgKTtcclxuICAgICAgICBsb2FkZXIuc2V0UGF0aCggdGhpcy5wYXRoICk7XHJcbiAgICAgICAgbG9hZGVyLmxvYWQoIHVybCwgZnVuY3Rpb24gKCB0ZXh0ICkge1xyXG5cclxuICAgICAgICAgICAgb25Mb2FkKCBzY29wZS5wYXJzZSggdGV4dCApICk7XHJcblxyXG4gICAgICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHNldFBhdGg6IGZ1bmN0aW9uICggdmFsdWUgKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGF0aCA9IHZhbHVlO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0ZXJpYWxzOiBmdW5jdGlvbiAoIG1hdGVyaWFscyApIHtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRlcmlhbHMgPSBtYXRlcmlhbHM7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBfY3JlYXRlUGFyc2VyU3RhdGUgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0cyAgOiBbXSxcclxuICAgICAgICAgICAgb2JqZWN0ICAgOiB7fSxcclxuXHJcbiAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgIHV2cyAgICAgIDogW10sXHJcblxyXG4gICAgICAgICAgICBtYXRlcmlhbExpYnJhcmllcyA6IFtdLFxyXG5cclxuICAgICAgICAgICAgc3RhcnRPYmplY3Q6IGZ1bmN0aW9uICggbmFtZSwgZnJvbURlY2xhcmF0aW9uICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IG9iamVjdCAoaW5pdGlhbCBmcm9tIHJlc2V0KSBpcyBub3QgZnJvbSBhIGcvbyBkZWNsYXJhdGlvbiBpbiB0aGUgcGFyc2VkXHJcbiAgICAgICAgICAgICAgICAvLyBmaWxlLiBXZSBuZWVkIHRvIHVzZSBpdCBmb3IgdGhlIGZpcnN0IHBhcnNlZCBnL28gdG8ga2VlcCB0aGluZ3MgaW4gc3luYy5cclxuICAgICAgICAgICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdGhpcy5vYmplY3QuZnJvbURlY2xhcmF0aW9uID09PSBmYWxzZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QuZnJvbURlY2xhcmF0aW9uID0gKCBmcm9tRGVjbGFyYXRpb24gIT09IGZhbHNlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNNYXRlcmlhbCA9ICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpIDogdW5kZWZpbmVkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbURlY2xhcmF0aW9uIDogKCBmcm9tRGVjbGFyYXRpb24gIT09IGZhbHNlICksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5IDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNlcyA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxzICA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dnMgICAgICA6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHMgOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICBzbW9vdGggOiB0cnVlLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGFydE1hdGVyaWFsIDogZnVuY3Rpb24oIG5hbWUsIGxpYnJhcmllcyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX2ZpbmFsaXplKCBmYWxzZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV3IHVzZW10bCBkZWNsYXJhdGlvbiBvdmVyd3JpdGVzIGFuIGluaGVyaXRlZCBtYXRlcmlhbCwgZXhjZXB0IGlmIGZhY2VzIHdlcmUgZGVjbGFyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIG1hdGVyaWFsLCB0aGVuIGl0IG11c3QgYmUgcHJlc2VydmVkIGZvciBwcm9wZXIgTXVsdGlNYXRlcmlhbCBjb250aW51YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcHJldmlvdXMgJiYgKCBwcmV2aW91cy5pbmhlcml0ZWQgfHwgcHJldmlvdXMuZ3JvdXBDb3VudCA8PSAwICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMuc3BsaWNlKCBwcmV2aW91cy5pbmRleCwgMSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggICAgICA6IHRoaXMubWF0ZXJpYWxzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgOiBuYW1lIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXRsbGliICAgICA6ICggQXJyYXkuaXNBcnJheSggbGlicmFyaWVzICkgJiYgbGlicmFyaWVzLmxlbmd0aCA+IDAgPyBsaWJyYXJpZXNbIGxpYnJhcmllcy5sZW5ndGggLSAxIF0gOiAnJyApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc21vb3RoICAgICA6ICggcHJldmlvdXMgIT09IHVuZGVmaW5lZCA/IHByZXZpb3VzLnNtb290aCA6IHRoaXMuc21vb3RoICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0IDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuZ3JvdXBFbmQgOiAwICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEVuZCAgIDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgOiBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggICAgICA6ICggdHlwZW9mIGluZGV4ID09PSAnbnVtYmVyJyA/IGluZGV4IDogdGhpcy5pbmRleCApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogdGhpcy5tdGxsaWIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtb290aCAgICAgOiB0aGlzLnNtb290aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBTdGFydCA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBDb3VudCA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZWQuY2xvbmUgPSB0aGlzLmNsb25lLmJpbmQoY2xvbmVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMucHVzaCggbWF0ZXJpYWwgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE1hdGVyaWFsIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRlcmlhbHNbIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCAtIDEgXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgX2ZpbmFsaXplIDogZnVuY3Rpb24oIGVuZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0TXVsdGlNYXRlcmlhbCA9IHRoaXMuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbGFzdE11bHRpTWF0ZXJpYWwgJiYgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPT09IC0xICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kID0gdGhpcy5nZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGggLyAzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBDb3VudCA9IGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kIC0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBTdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmluaGVyaXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWdub3JlIG9iamVjdHMgdGFpbCBtYXRlcmlhbHMgaWYgbm8gZmFjZSBkZWNsYXJhdGlvbnMgZm9sbG93ZWQgdGhlbSBiZWZvcmUgYSBuZXcgby9nIHN0YXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZW5kICYmIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIG1pID0gdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMTsgbWkgPj0gMDsgbWktLSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzW21pXS5ncm91cENvdW50IDw9IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnNwbGljZSggbWksIDEgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHdWFyYW50ZWUgYXQgbGVhc3Qgb25lIGVtcHR5IG1hdGVyaWFsLCB0aGlzIG1ha2VzIHRoZSBjcmVhdGlvbiBsYXRlciBtb3JlIHN0cmFpZ2h0IGZvcndhcmQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZW5kICYmIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA9PT0gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lICAgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbW9vdGggOiB0aGlzLnNtb290aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdE11bHRpTWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSW5oZXJpdCBwcmV2aW91cyBvYmplY3RzIG1hdGVyaWFsLlxyXG4gICAgICAgICAgICAgICAgLy8gU3BlYyB0ZWxscyB1cyB0aGF0IGEgZGVjbGFyZWQgbWF0ZXJpYWwgbXVzdCBiZSBzZXQgdG8gYWxsIG9iamVjdHMgdW50aWwgYSBuZXcgbWF0ZXJpYWwgaXMgZGVjbGFyZWQuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBhIHVzZW10bCBkZWNsYXJhdGlvbiBpcyBlbmNvdW50ZXJlZCB3aGlsZSB0aGlzIG5ldyBvYmplY3QgaXMgYmVpbmcgcGFyc2VkLCBpdCB3aWxsXHJcbiAgICAgICAgICAgICAgICAvLyBvdmVyd3JpdGUgdGhlIGluaGVyaXRlZCBtYXRlcmlhbC4gRXhjZXB0aW9uIGJlaW5nIHRoYXQgdGhlcmUgd2FzIGFscmVhZHkgZmFjZSBkZWNsYXJhdGlvbnNcclxuICAgICAgICAgICAgICAgIC8vIHRvIHRoZSBpbmhlcml0ZWQgbWF0ZXJpYWwsIHRoZW4gaXQgd2lsbCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHByZXZpb3VzTWF0ZXJpYWwgJiYgcHJldmlvdXNNYXRlcmlhbC5uYW1lICYmIHR5cGVvZiBwcmV2aW91c01hdGVyaWFsLmNsb25lID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWNsYXJlZCA9IHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUoIDAgKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWNsYXJlZC5pbmhlcml0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Lm1hdGVyaWFscy5wdXNoKCBkZWNsYXJlZCApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdHMucHVzaCggdGhpcy5vYmplY3QgKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmaW5hbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QuX2ZpbmFsaXplKCB0cnVlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHBhcnNlVmVydGV4SW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAzICkgKiAzO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHBhcnNlTm9ybWFsSW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAzICkgKiAzO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHBhcnNlVVZJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDIgKSAqIDI7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVmVydGV4OiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMudmVydGljZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudmVydGljZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDIgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDIgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFZlcnRleExpbmU6IGZ1bmN0aW9uICggYSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkTm9ybWFsIDogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLm5vcm1hbHM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkubm9ybWFscztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVVY6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy51dnM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudXZzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRVVkxpbmU6IGZ1bmN0aW9uICggYSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy51dnM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudXZzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRGYWNlOiBmdW5jdGlvbiAoIGEsIGIsIGMsIGQsIHVhLCB1YiwgdWMsIHVkLCBuYSwgbmIsIG5jLCBuZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdkxlbiA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpYSA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYSwgdkxlbiApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGliID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBiLCB2TGVuICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWMgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGMsIHZMZW4gKTtcclxuICAgICAgICAgICAgICAgIHZhciBpZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZCA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggZCwgdkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdWEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHV2TGVuID0gdGhpcy51dnMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpYSA9IHRoaXMucGFyc2VVVkluZGV4KCB1YSwgdXZMZW4gKTtcclxuICAgICAgICAgICAgICAgICAgICBpYiA9IHRoaXMucGFyc2VVVkluZGV4KCB1YiwgdXZMZW4gKTtcclxuICAgICAgICAgICAgICAgICAgICBpYyA9IHRoaXMucGFyc2VVVkluZGV4KCB1YywgdXZMZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWKCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHRoaXMucGFyc2VVVkluZGV4KCB1ZCwgdXZMZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVViggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbmEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm9ybWFscyBhcmUgbWFueSB0aW1lcyB0aGUgc2FtZS4gSWYgc28sIHNraXAgZnVuY3Rpb24gY2FsbCBhbmQgcGFyc2VJbnQuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5MZW4gPSB0aGlzLm5vcm1hbHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGlhID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYSwgbkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpYiA9IG5hID09PSBuYiA/IGlhIDogdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYiwgbkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGljID0gbmEgPT09IG5jID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5jLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuZCwgbkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRMaW5lR2VvbWV0cnk6IGZ1bmN0aW9uICggdmVydGljZXMsIHV2cyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5nZW9tZXRyeS50eXBlID0gJ0xpbmUnO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIHZpID0gMCwgbCA9IHZlcnRpY2VzLmxlbmd0aDsgdmkgPCBsOyB2aSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXhMaW5lKCB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIHZlcnRpY2VzWyB2aSBdLCB2TGVuICkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIHV2aSA9IDAsIGwgPSB1dnMubGVuZ3RoOyB1dmkgPCBsOyB1dmkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVZMaW5lKCB0aGlzLnBhcnNlVVZJbmRleCggdXZzWyB1dmkgXSwgdXZMZW4gKSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc3RhdGUuc3RhcnRPYmplY3QoICcnLCBmYWxzZSApO1xyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZTogZnVuY3Rpb24gKCB0ZXh0ICkge1xyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWUoICdPQkpMb2FkZXInICk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX2NyZWF0ZVBhcnNlclN0YXRlKCk7XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxyXFxuJyApICE9PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIFN0cmluZy5zcGxpdCB3aXRoIHJlZ2V4IHRoYXQgc3BsaXRzIG9uIGJvdGhcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggL1xcclxcbi9nLCAnXFxuJyApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxcXFxcbicgKSAhPT0gLSAxKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBqb2luIGxpbmVzIHNlcGFyYXRlZCBieSBhIGxpbmUgY29udGludWF0aW9uIGNoYXJhY3RlciAoXFwpXHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXFxcXFxuL2csICcnICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxpbmVzID0gdGV4dC5zcGxpdCggJ1xcbicgKTtcclxuICAgICAgICB2YXIgbGluZSA9ICcnLCBsaW5lRmlyc3RDaGFyID0gJycsIGxpbmVTZWNvbmRDaGFyID0gJyc7XHJcbiAgICAgICAgdmFyIGxpbmVMZW5ndGggPSAwO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gRmFzdGVyIHRvIGp1c3QgdHJpbSBsZWZ0IHNpZGUgb2YgdGhlIGxpbmUuIFVzZSBpZiBhdmFpbGFibGUuXHJcbiAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAvLyB2YXIgdHJpbUxlZnQgPSAoIHR5cGVvZiAnJy50cmltTGVmdCA9PT0gJ2Z1bmN0aW9uJyApO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF07XHJcblxyXG4gICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAvLyBsaW5lID0gdHJpbUxlZnQgPyBsaW5lLnRyaW1MZWZ0KCkgOiBsaW5lLnRyaW0oKTtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgbGluZUxlbmd0aCA9IGxpbmUubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsaW5lTGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBsaW5lRmlyc3RDaGFyID0gbGluZS5jaGFyQXQoIDAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEB0b2RvIGludm9rZSBwYXNzZWQgaW4gaGFuZGxlciBpZiBhbnlcclxuICAgICAgICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAnIycgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJ3YnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxpbmVTZWNvbmRDaGFyID0gbGluZS5jaGFyQXQoIDEgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAnICcgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC52ZXJ0ZXhfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInYgMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICduJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm5vcm1hbF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm5vcm1hbHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICd0JyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnV2X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAxICAgICAgMlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudXZzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIHZlcnRleC9ub3JtYWwvdXYgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwiZlwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91dl9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICAgNyAgICA4ICAgIDkgICAxMCAgICAgICAgIDExICAgICAgICAgMTJcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMS8xIDIvMi8yIDMvMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA3IF0sIHJlc3VsdFsgMTAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDggXSwgcmVzdWx0WyAxMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOSBdLCByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXYuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMSAyLzIgMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfbm9ybWFsLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxLy8xIDIvLzIgMy8vM1wiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgMSAgICAyICAgIDMgICA0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDIgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNCBdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBmYWNlIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lRmlyc3RDaGFyID09PSBcImxcIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVBhcnRzID0gbGluZS5zdWJzdHJpbmcoIDEgKS50cmltKCkuc3BsaXQoIFwiIFwiICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVZlcnRpY2VzID0gW10sIGxpbmVVVnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmUuaW5kZXhPZiggXCIvXCIgKSA9PT0gLSAxICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsaW5lVmVydGljZXMgPSBsaW5lUGFydHM7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGxpID0gMCwgbGxlbiA9IGxpbmVQYXJ0cy5sZW5ndGg7IGxpIDwgbGxlbjsgbGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBsaW5lUGFydHNbIGxpIF0uc3BsaXQoIFwiL1wiICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAwIF0gIT09IFwiXCIgKSBsaW5lVmVydGljZXMucHVzaCggcGFydHNbIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAxIF0gIT09IFwiXCIgKSBsaW5lVVZzLnB1c2goIHBhcnRzWyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXRlLmFkZExpbmVHZW9tZXRyeSggbGluZVZlcnRpY2VzLCBsaW5lVVZzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm9iamVjdF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG8gb2JqZWN0X25hbWVcclxuICAgICAgICAgICAgICAgIC8vIG9yXHJcbiAgICAgICAgICAgICAgICAvLyBnIGdyb3VwX25hbWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXT1JLQVJPVU5EOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yODY5XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgbmFtZSA9IHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gKCBcIiBcIiArIHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKSApLnN1YnN0ciggMSApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLnN0YXJ0T2JqZWN0KCBuYW1lICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF91c2VfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWF0ZXJpYWxcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5vYmplY3Quc3RhcnRNYXRlcmlhbCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCksIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG10bCBmaWxlXHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMucHVzaCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuc21vb3RoaW5nX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBIYW5kbGUgZmlsZXMgdGhhdCBoYXZlIHZhcnlpbmcgc21vb3RoIHZhbHVlcyBmb3IgYSBzZXQgb2YgZmFjZXMgaW5zaWRlIG9uZSBnZW9tZXRyeSxcclxuICAgICAgICAgICAgICAgIC8vIGJ1dCBkb2VzIG5vdCBkZWZpbmUgYSB1c2VtdGwgZm9yIGVhY2ggZmFjZSBzZXQuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhbmQgYSBkdW1teSBtYXRlcmlhbCBjcmVhdGVkIChsYXRlciBNdWx0aU1hdGVyaWFsIGFuZCBnZW9tZXRyeSBncm91cHMpLlxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyByZXF1aXJlcyBzb21lIGNhcmUgdG8gbm90IGNyZWF0ZSBleHRyYSBtYXRlcmlhbCBvbiBlYWNoIHNtb290aCB2YWx1ZSBmb3IgXCJub3JtYWxcIiBvYmogZmlsZXMuXHJcbiAgICAgICAgICAgICAgICAvLyB3aGVyZSBleHBsaWNpdCB1c2VtdGwgZGVmaW5lcyBnZW9tZXRyeSBncm91cHMuXHJcbiAgICAgICAgICAgICAgICAvLyBFeGFtcGxlIGFzc2V0OiBleGFtcGxlcy9tb2RlbHMvb2JqL2NlcmJlcnVzL0NlcmJlcnVzLm9ialxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdFsgMSBdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGh0dHA6Ly9wYXVsYm91cmtlLm5ldC9kYXRhZm9ybWF0cy9vYmovXHJcbiAgICAgICAgICAgICAgICAgKiBvclxyXG4gICAgICAgICAgICAgICAgICogaHR0cDovL3d3dy5jcy51dGFoLmVkdS9+Ym91bG9zL2NzMzUwNS9vYmpfc3BlYy5wZGZcclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBGcm9tIGNoYXB0ZXIgXCJHcm91cGluZ1wiIFN5bnRheCBleHBsYW5hdGlvbiBcInMgZ3JvdXBfbnVtYmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgKiBcImdyb3VwX251bWJlciBpcyB0aGUgc21vb3RoaW5nIGdyb3VwIG51bWJlci4gVG8gdHVybiBvZmYgc21vb3RoaW5nIGdyb3VwcywgdXNlIGEgdmFsdWUgb2YgMCBvciBvZmYuXHJcbiAgICAgICAgICAgICAgICAgKiBQb2x5Z29uYWwgZWxlbWVudHMgdXNlIGdyb3VwIG51bWJlcnMgdG8gcHV0IGVsZW1lbnRzIGluIGRpZmZlcmVudCBzbW9vdGhpbmcgZ3JvdXBzLiBGb3IgZnJlZS1mb3JtXHJcbiAgICAgICAgICAgICAgICAgKiBzdXJmYWNlcywgc21vb3RoaW5nIGdyb3VwcyBhcmUgZWl0aGVyIHR1cm5lZCBvbiBvciBvZmY7IHRoZXJlIGlzIG5vIGRpZmZlcmVuY2UgYmV0d2VlbiB2YWx1ZXMgZ3JlYXRlclxyXG4gICAgICAgICAgICAgICAgICogdGhhbiAwLlwiXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdC5zbW9vdGggPSAoIHZhbHVlICE9PSAnMCcgJiYgdmFsdWUgIT09ICdvZmYnICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gc3RhdGUub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc21vb3RoID0gc3RhdGUub2JqZWN0LnNtb290aDtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBudWxsIHRlcm1pbmF0ZWQgZmlsZXMgd2l0aG91dCBleGNlcHRpb25cclxuICAgICAgICAgICAgICAgIGlmICggbGluZSA9PT0gJ1xcMCcgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUuZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgLy9jb250YWluZXIubWF0ZXJpYWxMaWJyYXJpZXMgPSBbXS5jb25jYXQoIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcbiAgICAgICAgKDxhbnk+Y29udGFpbmVyKS5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsID0gc3RhdGUub2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG9iamVjdCA9IHN0YXRlLm9iamVjdHNbIGkgXTtcclxuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5O1xyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzID0gb2JqZWN0Lm1hdGVyaWFscztcclxuICAgICAgICAgICAgdmFyIGlzTGluZSA9ICggZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmUnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIG8vZyBsaW5lIGRlY2xhcmF0aW9ucyB0aGF0IGRpZCBub3QgZm9sbG93IHdpdGggYW55IGZhY2VzXHJcbiAgICAgICAgICAgIGlmICggZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnVmZmVyZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHJcbiAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudmVydGljZXMgKSwgMyApICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdub3JtYWwnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS5ub3JtYWxzICksIDMgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBnZW9tZXRyeS51dnMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnV2cyApLCAyICkgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBtYXRlcmlhbHNcclxuICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgLy92YXIgY3JlYXRlZE1hdGVyaWFscyA9IFtdOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjcmVhdGVkTWF0ZXJpYWxzIDogVEhSRUUuTWF0ZXJpYWxbXSA9IFtdOyAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VNYXRlcmlhbCA9IG1hdGVyaWFsc1ttaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscyAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFscy5jcmVhdGUoIHNvdXJjZU1hdGVyaWFsLm5hbWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbXRsIGV0Yy4gbG9hZGVycyBwcm9iYWJseSBjYW4ndCBjcmVhdGUgbGluZSBtYXRlcmlhbHMgY29ycmVjdGx5LCBjb3B5IHByb3BlcnRpZXMgdG8gYSBsaW5lIG1hdGVyaWFsLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNMaW5lICYmIG1hdGVyaWFsICYmICEgKCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWxMaW5lID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsTGluZS5jb3B5KCBtYXRlcmlhbCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IG1hdGVyaWFsTGluZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICEgbWF0ZXJpYWwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpIDogbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5uYW1lID0gc291cmNlTWF0ZXJpYWwubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2hhZGluZyA9IHNvdXJjZU1hdGVyaWFsLnNtb290aCA/IFRIUkVFLlNtb290aFNoYWRpbmcgOiBUSFJFRS5GbGF0U2hhZGluZztcclxuXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkTWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1lc2hcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBjcmVhdGVkTWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRHcm91cCggc291cmNlTWF0ZXJpYWwuZ3JvdXBTdGFydCwgc291cmNlTWF0ZXJpYWwuZ3JvdXBDb3VudCwgbWkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgLy9tZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFscyApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHMgKSApO1xyXG4gICAgICAgICAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbMF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsICkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgIC8vbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZU1hdGVyaWFscykgKTtcclxuICAgICAgICAgICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsKSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGQoIG1lc2ggKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoICdPQkpMb2FkZXInICk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJ1xyXG4gICAgICAgICAgXHJcbi8qKlxyXG4gKiBNYXRlcmlhbHNcclxuICogR2VuZXJhbCBUSFJFRS5qcyBNYXRlcmlhbCBjbGFzc2VzIGFuZCBoZWxwZXJzXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1hdGVyaWFscyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gTWF0ZXJpYWxzXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIHRleHR1cmUgbWF0ZXJpYWwgZnJvbSBhbiBpbWFnZSBVUkwuXHJcbiAgICAgKiBAcGFyYW0gaW1hZ2UgSW1hZ2UgdG8gdXNlIGluIHRleHR1cmUuXHJcbiAgICAgKiBAcmV0dXJucyBUZXh0dXJlIG1hdGVyaWFsLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlVGV4dHVyZU1hdGVyaWFsIChpbWFnZSA6IEhUTUxJbWFnZUVsZW1lbnQpIDogVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgdGV4dHVyZSAgICAgICAgIDogVEhSRUUuVGV4dHVyZSxcclxuICAgICAgICAgICAgdGV4dHVyZU1hdGVyaWFsIDogVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoaW1hZ2UpO1xyXG4gICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgICAgID0gdHJ1ZTtcclxuICAgICAgICB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjsgICAgIC8vIFRoZSBtYWduaWZpY2F0aW9uIGFuZCBtaW5pZmljYXRpb24gZmlsdGVycyBzYW1wbGUgdGhlIHRleHR1cmUgbWFwIGVsZW1lbnRzIHdoZW4gbWFwcGluZyB0byBhIHBpeGVsLlxyXG4gICAgICAgIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjsgICAgIC8vIFRoZSBkZWZhdWx0IG1vZGVzIG92ZXJzYW1wbGUgd2hpY2ggbGVhZHMgdG8gYmxlbmRpbmcgd2l0aCB0aGUgYmxhY2sgYmFja2dyb3VuZC4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBwcm9kdWNlcyBjb2xvcmVkIChibGFjaykgYXJ0aWZhY3RzIGFyb3VuZCB0aGUgZWRnZXMgb2YgdGhlIHRleHR1cmUgbWFwIGVsZW1lbnRzLlxyXG4gICAgICAgIHRleHR1cmUucmVwZWF0ID0gbmV3IFRIUkVFLlZlY3RvcjIoMS4wLCAxLjApO1xyXG5cclxuICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHttYXA6IHRleHR1cmV9ICk7XHJcbiAgICAgICAgdGV4dHVyZU1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRleHR1cmVNYXRlcmlhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICBDcmVhdGUgYSBidW1wIG1hcCBQaG9uZyBtYXRlcmlhbCBmcm9tIGEgdGV4dHVyZSBtYXAuXHJcbiAgICAgKiBAcGFyYW0gZGVzaWduVGV4dHVyZSBCdW1wIG1hcCB0ZXh0dXJlLlxyXG4gICAgICogQHJldHVybnMgUGhvbmcgYnVtcCBtYXBwZWQgbWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVNZXNoUGhvbmdNYXRlcmlhbChkZXNpZ25UZXh0dXJlIDogVEhSRUUuVGV4dHVyZSkgIDogVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwge1xyXG5cclxuICAgICAgICB2YXIgbWF0ZXJpYWwgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe1xyXG4gICAgICAgICAgICBjb2xvciAgIDogMHhmZmZmZmYsXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgYnVtcE1hcCAgIDogZGVzaWduVGV4dHVyZSxcclxuICAgICAgICAgICAgYnVtcFNjYWxlIDogLTEuMCxcclxuXHJcbiAgICAgICAgICAgIHNoYWRpbmc6IFRIUkVFLlNtb290aFNoYWRpbmcsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBtYXRlcmlhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIHRyYW5zcGFyZW50IG1hdGVyaWFsLlxyXG4gICAgICogQHJldHVybnMgVHJhbnNwYXJlbnQgbWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVUcmFuc3BhcmVudE1hdGVyaWFsKCkgIDogVEhSRUUuTWF0ZXJpYWwge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvciA6IDB4MDAwMDAwLCBvcGFjaXR5IDogMC4wLCB0cmFuc3BhcmVudCA6IHRydWV9KTtcclxuICAgIH1cclxuXHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcbiIsIi8qKlxuICogQGF1dGhvciBFYmVyaGFyZCBHcmFldGhlciAvIGh0dHA6Ly9lZ3JhZXRoZXIuY29tL1xuICogQGF1dGhvciBNYXJrIEx1bmRpbiBcdC8gaHR0cDovL21hcmstbHVuZGluLmNvbVxuICogQGF1dGhvciBTaW1vbmUgTWFuaW5pIC8gaHR0cDovL2Rhcm9uMTMzNy5naXRodWIuaW9cbiAqIEBhdXRob3IgTHVjYSBBbnRpZ2EgXHQvIGh0dHA6Ly9sYW50aWdhLmdpdGh1Yi5pb1xuICovXG5cbid1c2Ugc3RyaWN0JztcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFRyYWNrYmFsbENvbnRyb2xzICggb2JqZWN0LCBkb21FbGVtZW50ICkge1xuXG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cdHZhciBTVEFURSA9IHsgTk9ORTogLSAxLCBST1RBVEU6IDAsIFpPT006IDEsIFBBTjogMiwgVE9VQ0hfUk9UQVRFOiAzLCBUT1VDSF9aT09NX1BBTjogNCB9O1xuXG5cdHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuXHR0aGlzLmRvbUVsZW1lbnQgPSAoIGRvbUVsZW1lbnQgIT09IHVuZGVmaW5lZCApID8gZG9tRWxlbWVudCA6IGRvY3VtZW50O1xuXG5cdC8vIEFQSVxuXG5cdHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cblx0dGhpcy5zY3JlZW4gPSB7IGxlZnQ6IDAsIHRvcDogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xuXG5cdHRoaXMucm90YXRlU3BlZWQgPSAxLjA7XG5cdHRoaXMuem9vbVNwZWVkID0gMS4yO1xuXHR0aGlzLnBhblNwZWVkID0gMC4zO1xuXG5cdHRoaXMubm9Sb3RhdGUgPSBmYWxzZTtcblx0dGhpcy5ub1pvb20gPSBmYWxzZTtcblx0dGhpcy5ub1BhbiA9IGZhbHNlO1xuXG5cdHRoaXMuc3RhdGljTW92aW5nID0gdHJ1ZTtcblx0dGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMjtcblxuXHR0aGlzLm1pbkRpc3RhbmNlID0gMDtcblx0dGhpcy5tYXhEaXN0YW5jZSA9IEluZmluaXR5O1xuXG5cdHRoaXMua2V5cyA9IFsgNjUgLypBKi8sIDgzIC8qUyovLCA2OCAvKkQqLyBdO1xuXG5cdC8vIGludGVybmFsc1xuXG5cdHRoaXMudGFyZ2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHR2YXIgRVBTID0gMC4wMDAwMDE7XG5cblx0dmFyIGxhc3RQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0dmFyIF9zdGF0ZSA9IFNUQVRFLk5PTkUsXG5cdF9wcmV2U3RhdGUgPSBTVEFURS5OT05FLFxuXG5cdF9leWUgPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXG5cdF9tb3ZlUHJldiA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF9tb3ZlQ3VyciA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cblx0X2xhc3RBeGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0X2xhc3RBbmdsZSA9IDAsXG5cblx0X3pvb21TdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF96b29tRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblxuXHRfdG91Y2hab29tRGlzdGFuY2VTdGFydCA9IDAsXG5cdF90b3VjaFpvb21EaXN0YW5jZUVuZCA9IDAsXG5cblx0X3BhblN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblx0X3BhbkVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0Ly8gZm9yIHJlc2V0XG5cblx0dGhpcy50YXJnZXQwID0gdGhpcy50YXJnZXQuY2xvbmUoKTtcblx0dGhpcy5wb3NpdGlvbjAgPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHR0aGlzLnVwMCA9IHRoaXMub2JqZWN0LnVwLmNsb25lKCk7XG5cblx0Ly8gZXZlbnRzXG5cblx0dmFyIGNoYW5nZUV2ZW50ID0geyB0eXBlOiAnY2hhbmdlJyB9O1xuXHR2YXIgc3RhcnRFdmVudCA9IHsgdHlwZTogJ3N0YXJ0JyB9O1xuXHR2YXIgZW5kRXZlbnQgPSB7IHR5cGU6ICdlbmQnIH07XG5cblxuXHQvLyBtZXRob2RzXG5cblx0dGhpcy5oYW5kbGVSZXNpemUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHRoaXMuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgKSB7XG5cblx0XHRcdHRoaXMuc2NyZWVuLmxlZnQgPSAwO1xuXHRcdFx0dGhpcy5zY3JlZW4udG9wID0gMDtcblx0XHRcdHRoaXMuc2NyZWVuLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0XHR0aGlzLnNjcmVlbi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgYm94ID0gdGhpcy5kb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0Ly8gYWRqdXN0bWVudHMgY29tZSBmcm9tIHNpbWlsYXIgY29kZSBpbiB0aGUganF1ZXJ5IG9mZnNldCgpIGZ1bmN0aW9uXG5cdFx0XHR2YXIgZCA9IHRoaXMuZG9tRWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0XHRcdHRoaXMuc2NyZWVuLmxlZnQgPSBib3gubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCAtIGQuY2xpZW50TGVmdDtcblx0XHRcdHRoaXMuc2NyZWVuLnRvcCA9IGJveC50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQgLSBkLmNsaWVudFRvcDtcblx0XHRcdHRoaXMuc2NyZWVuLndpZHRoID0gYm94LndpZHRoO1xuXHRcdFx0dGhpcy5zY3JlZW4uaGVpZ2h0ID0gYm94LmhlaWdodDtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCB0eXBlb2YgdGhpc1sgZXZlbnQudHlwZSBdID09PSAnZnVuY3Rpb24nICkge1xuXG5cdFx0XHR0aGlzWyBldmVudC50eXBlIF0oIGV2ZW50ICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2YXIgZ2V0TW91c2VPblNjcmVlbiA9ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gZ2V0TW91c2VPblNjcmVlbiggcGFnZVgsIHBhZ2VZICkge1xuXG5cdFx0XHR2ZWN0b3Iuc2V0KFxuXHRcdFx0XHQoIHBhZ2VYIC0gX3RoaXMuc2NyZWVuLmxlZnQgKSAvIF90aGlzLnNjcmVlbi53aWR0aCxcblx0XHRcdFx0KCBwYWdlWSAtIF90aGlzLnNjcmVlbi50b3AgKSAvIF90aGlzLnNjcmVlbi5oZWlnaHRcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB2ZWN0b3I7XG5cblx0XHR9O1xuXG5cdH0oKSApO1xuXG5cdHZhciBnZXRNb3VzZU9uQ2lyY2xlID0gKCBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiBnZXRNb3VzZU9uQ2lyY2xlKCBwYWdlWCwgcGFnZVkgKSB7XG5cblx0XHRcdHZlY3Rvci5zZXQoXG5cdFx0XHRcdCggKCBwYWdlWCAtIF90aGlzLnNjcmVlbi53aWR0aCAqIDAuNSAtIF90aGlzLnNjcmVlbi5sZWZ0ICkgLyAoIF90aGlzLnNjcmVlbi53aWR0aCAqIDAuNSApICksXG5cdFx0XHRcdCggKCBfdGhpcy5zY3JlZW4uaGVpZ2h0ICsgMiAqICggX3RoaXMuc2NyZWVuLnRvcCAtIHBhZ2VZICkgKSAvIF90aGlzLnNjcmVlbi53aWR0aCApIC8vIHNjcmVlbi53aWR0aCBpbnRlbnRpb25hbFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHZlY3RvcjtcblxuXHRcdH07XG5cblx0fSgpICk7XG5cblx0dGhpcy5yb3RhdGVDYW1lcmEgPSAoIGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIGF4aXMgPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0cXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCksXG5cdFx0XHRleWVEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0b2JqZWN0VXBEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0bW92ZURpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRhbmdsZTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiByb3RhdGVDYW1lcmEoKSB7XG5cblx0XHRcdG1vdmVEaXJlY3Rpb24uc2V0KCBfbW92ZUN1cnIueCAtIF9tb3ZlUHJldi54LCBfbW92ZUN1cnIueSAtIF9tb3ZlUHJldi55LCAwICk7XG5cdFx0XHRhbmdsZSA9IG1vdmVEaXJlY3Rpb24ubGVuZ3RoKCk7XG5cblx0XHRcdGlmICggYW5nbGUgKSB7XG5cblx0XHRcdFx0X2V5ZS5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKS5zdWIoIF90aGlzLnRhcmdldCApO1xuXG5cdFx0XHRcdGV5ZURpcmVjdGlvbi5jb3B5KCBfZXllICkubm9ybWFsaXplKCk7XG5cdFx0XHRcdG9iamVjdFVwRGlyZWN0aW9uLmNvcHkoIF90aGlzLm9iamVjdC51cCApLm5vcm1hbGl6ZSgpO1xuXHRcdFx0XHRvYmplY3RTaWRld2F5c0RpcmVjdGlvbi5jcm9zc1ZlY3RvcnMoIG9iamVjdFVwRGlyZWN0aW9uLCBleWVEaXJlY3Rpb24gKS5ub3JtYWxpemUoKTtcblxuXHRcdFx0XHRvYmplY3RVcERpcmVjdGlvbi5zZXRMZW5ndGgoIF9tb3ZlQ3Vyci55IC0gX21vdmVQcmV2LnkgKTtcblx0XHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24uc2V0TGVuZ3RoKCBfbW92ZUN1cnIueCAtIF9tb3ZlUHJldi54ICk7XG5cblx0XHRcdFx0bW92ZURpcmVjdGlvbi5jb3B5KCBvYmplY3RVcERpcmVjdGlvbi5hZGQoIG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uICkgKTtcblxuXHRcdFx0XHRheGlzLmNyb3NzVmVjdG9ycyggbW92ZURpcmVjdGlvbiwgX2V5ZSApLm5vcm1hbGl6ZSgpO1xuXG5cdFx0XHRcdGFuZ2xlICo9IF90aGlzLnJvdGF0ZVNwZWVkO1xuXHRcdFx0XHRxdWF0ZXJuaW9uLnNldEZyb21BeGlzQW5nbGUoIGF4aXMsIGFuZ2xlICk7XG5cblx0XHRcdFx0X2V5ZS5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblx0XHRcdFx0X3RoaXMub2JqZWN0LnVwLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXG5cdFx0XHRcdF9sYXN0QXhpcy5jb3B5KCBheGlzICk7XG5cdFx0XHRcdF9sYXN0QW5nbGUgPSBhbmdsZTtcblxuXHRcdFx0fSBlbHNlIGlmICggISBfdGhpcy5zdGF0aWNNb3ZpbmcgJiYgX2xhc3RBbmdsZSApIHtcblxuXHRcdFx0XHRfbGFzdEFuZ2xlICo9IE1hdGguc3FydCggMS4wIC0gX3RoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgKTtcblx0XHRcdFx0X2V5ZS5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKS5zdWIoIF90aGlzLnRhcmdldCApO1xuXHRcdFx0XHRxdWF0ZXJuaW9uLnNldEZyb21BeGlzQW5nbGUoIF9sYXN0QXhpcywgX2xhc3RBbmdsZSApO1xuXHRcdFx0XHRfZXllLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXHRcdFx0XHRfdGhpcy5vYmplY3QudXAuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cblx0XHRcdH1cblxuXHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXG5cdFx0fTtcblxuXHR9KCkgKTtcblxuXG5cdHRoaXMuem9vbUNhbWVyYSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciBmYWN0b3I7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuVE9VQ0hfWk9PTV9QQU4gKSB7XG5cblx0XHRcdGZhY3RvciA9IF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0IC8gX3RvdWNoWm9vbURpc3RhbmNlRW5kO1xuXHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSBfdG91Y2hab29tRGlzdGFuY2VFbmQ7XG5cdFx0XHRfZXllLm11bHRpcGx5U2NhbGFyKCBmYWN0b3IgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGZhY3RvciA9IDEuMCArICggX3pvb21FbmQueSAtIF96b29tU3RhcnQueSApICogX3RoaXMuem9vbVNwZWVkO1xuXG5cdFx0XHRpZiAoIGZhY3RvciAhPT0gMS4wICYmIGZhY3RvciA+IDAuMCApIHtcblxuXHRcdFx0XHRfZXllLm11bHRpcGx5U2NhbGFyKCBmYWN0b3IgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIF90aGlzLnN0YXRpY01vdmluZyApIHtcblxuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0X3pvb21TdGFydC55ICs9ICggX3pvb21FbmQueSAtIF96b29tU3RhcnQueSApICogdGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvcjtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5wYW5DYW1lcmEgPSAoIGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIG1vdXNlQ2hhbmdlID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblx0XHRcdG9iamVjdFVwID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdHBhbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gcGFuQ2FtZXJhKCkge1xuXG5cdFx0XHRtb3VzZUNoYW5nZS5jb3B5KCBfcGFuRW5kICkuc3ViKCBfcGFuU3RhcnQgKTtcblxuXHRcdFx0aWYgKCBtb3VzZUNoYW5nZS5sZW5ndGhTcSgpICkge1xuXG5cdFx0XHRcdG1vdXNlQ2hhbmdlLm11bHRpcGx5U2NhbGFyKCBfZXllLmxlbmd0aCgpICogX3RoaXMucGFuU3BlZWQgKTtcblxuXHRcdFx0XHRwYW4uY29weSggX2V5ZSApLmNyb3NzKCBfdGhpcy5vYmplY3QudXAgKS5zZXRMZW5ndGgoIG1vdXNlQ2hhbmdlLnggKTtcblx0XHRcdFx0cGFuLmFkZCggb2JqZWN0VXAuY29weSggX3RoaXMub2JqZWN0LnVwICkuc2V0TGVuZ3RoKCBtb3VzZUNoYW5nZS55ICkgKTtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkKCBwYW4gKTtcblx0XHRcdFx0X3RoaXMudGFyZ2V0LmFkZCggcGFuICk7XG5cblx0XHRcdFx0aWYgKCBfdGhpcy5zdGF0aWNNb3ZpbmcgKSB7XG5cblx0XHRcdFx0XHRfcGFuU3RhcnQuY29weSggX3BhbkVuZCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRfcGFuU3RhcnQuYWRkKCBtb3VzZUNoYW5nZS5zdWJWZWN0b3JzKCBfcGFuRW5kLCBfcGFuU3RhcnQgKS5tdWx0aXBseVNjYWxhciggX3RoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgKSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH0oKSApO1xuXG5cdHRoaXMuY2hlY2tEaXN0YW5jZXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoICEgX3RoaXMubm9ab29tIHx8ICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdGlmICggX2V5ZS5sZW5ndGhTcSgpID4gX3RoaXMubWF4RGlzdGFuY2UgKiBfdGhpcy5tYXhEaXN0YW5jZSApIHtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllLnNldExlbmd0aCggX3RoaXMubWF4RGlzdGFuY2UgKSApO1xuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBfZXllLmxlbmd0aFNxKCkgPCBfdGhpcy5taW5EaXN0YW5jZSAqIF90aGlzLm1pbkRpc3RhbmNlICkge1xuXG5cdFx0XHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5hZGRWZWN0b3JzKCBfdGhpcy50YXJnZXQsIF9leWUuc2V0TGVuZ3RoKCBfdGhpcy5taW5EaXN0YW5jZSApICk7XG5cdFx0XHRcdF96b29tU3RhcnQuY29weSggX3pvb21FbmQgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfZXllLnN1YlZlY3RvcnMoIF90aGlzLm9iamVjdC5wb3NpdGlvbiwgX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRpZiAoICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF90aGlzLnJvdGF0ZUNhbWVyYSgpO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3RoaXMuem9vbUNhbWVyYSgpO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfdGhpcy5wYW5DYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5hZGRWZWN0b3JzKCBfdGhpcy50YXJnZXQsIF9leWUgKTtcblxuXHRcdF90aGlzLmNoZWNrRGlzdGFuY2VzKCk7XG5cblx0XHRfdGhpcy5vYmplY3QubG9va0F0KCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdGlmICggbGFzdFBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKCBfdGhpcy5vYmplY3QucG9zaXRpb24gKSA+IEVQUyApIHtcblxuXHRcdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggY2hhbmdlRXZlbnQgKTtcblxuXHRcdFx0bGFzdFBvc2l0aW9uLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF9zdGF0ZSA9IFNUQVRFLk5PTkU7XG5cdFx0X3ByZXZTdGF0ZSA9IFNUQVRFLk5PTkU7XG5cblx0XHRfdGhpcy50YXJnZXQuY29weSggX3RoaXMudGFyZ2V0MCApO1xuXHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5jb3B5KCBfdGhpcy5wb3NpdGlvbjAgKTtcblx0XHRfdGhpcy5vYmplY3QudXAuY29weSggX3RoaXMudXAwICk7XG5cblx0XHRfZXllLnN1YlZlY3RvcnMoIF90aGlzLm9iamVjdC5wb3NpdGlvbiwgX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRfdGhpcy5vYmplY3QubG9va0F0KCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cblx0XHRsYXN0UG9zaXRpb24uY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICk7XG5cblx0fTtcblxuXHQvLyBsaXN0ZW5lcnNcblxuXHRmdW5jdGlvbiBrZXlkb3duKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duICk7XG5cblx0XHRfcHJldlN0YXRlID0gX3N0YXRlO1xuXG5cdFx0aWYgKCBfc3RhdGUgIT09IFNUQVRFLk5PTkUgKSB7XG5cblx0XHRcdHJldHVybjtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlJPVEFURSBdICYmICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlJPVEFURTtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlpPT00gXSAmJiAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3N0YXRlID0gU1RBVEUuWk9PTTtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlBBTiBdICYmICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlBBTjtcblxuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24ga2V5dXAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdF9zdGF0ZSA9IF9wcmV2U3RhdGU7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duLCBmYWxzZSApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZWRvd24oIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuTk9ORSApIHtcblxuXHRcdFx0X3N0YXRlID0gZXZlbnQuYnV0dG9uO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLlJPVEFURSAmJiAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuWk9PTSAmJiAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3pvb21TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXHRcdFx0X3pvb21FbmQuY29weSggX3pvb21TdGFydCApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5QQU4gJiYgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3BhblN0YXJ0LmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cdFx0XHRfcGFuRW5kLmNvcHkoIF9wYW5TdGFydCApO1xuXG5cdFx0fVxuXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIG1vdXNlbW92ZSwgZmFsc2UgKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG1vdXNldXAsIGZhbHNlICk7XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBzdGFydEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlbW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5ST1RBVEUgJiYgISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlpPT00gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF96b29tRW5kLmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlBBTiAmJiAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfcGFuRW5kLmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNldXAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIG1vdXNlbW92ZSApO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgbW91c2V1cCApO1xuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGVuZEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNld2hlZWwoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRzd2l0Y2ggKCBldmVudC5kZWx0YU1vZGUgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWm9vbSBpbiBwYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfem9vbVN0YXJ0LnkgLT0gZXZlbnQuZGVsdGFZICogMC4wMjU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG5cdFx0XHRjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpvb20gaW4gbGluZXNcblx0XHRcdFx0X3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDE7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHQvLyB1bmRlZmluZWQsIDAsIGFzc3VtZSBwaXhlbHNcblx0XHRcdFx0X3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDAwMjU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggc3RhcnRFdmVudCApO1xuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGVuZEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNoc3RhcnQoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoICkge1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdF9zdGF0ZSA9IFNUQVRFLlRPVUNIX1JPVEFURTtcblx0XHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICkgKTtcblx0XHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDogLy8gMiBvciBtb3JlXG5cdFx0XHRcdF9zdGF0ZSA9IFNUQVRFLlRPVUNIX1pPT01fUEFOO1xuXHRcdFx0XHR2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG5cdFx0XHRcdHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcblx0XHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlRW5kID0gX3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSBNYXRoLnNxcnQoIGR4ICogZHggKyBkeSAqIGR5ICk7XG5cblx0XHRcdFx0dmFyIHggPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWCApIC8gMjtcblx0XHRcdFx0dmFyIHkgPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWSApIC8gMjtcblx0XHRcdFx0X3BhblN0YXJ0LmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIHgsIHkgKSApO1xuXHRcdFx0XHRfcGFuRW5kLmNvcHkoIF9wYW5TdGFydCApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIHN0YXJ0RXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gdG91Y2htb3ZlKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0c3dpdGNoICggZXZlbnQudG91Y2hlcy5sZW5ndGggKSB7XG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKSApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDogLy8gMiBvciBtb3JlXG5cdFx0XHRcdHZhciBkeCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWDtcblx0XHRcdFx0dmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xuXHRcdFx0XHRfdG91Y2hab29tRGlzdGFuY2VFbmQgPSBNYXRoLnNxcnQoIGR4ICogZHggKyBkeSAqIGR5ICk7XG5cblx0XHRcdFx0dmFyIHggPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWCApIC8gMjtcblx0XHRcdFx0dmFyIHkgPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWSApIC8gMjtcblx0XHRcdFx0X3BhbkVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCB4LCB5ICkgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNoZW5kKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKCBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcblxuXHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9ST1RBVEU7XG5cdFx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSApICk7XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBjb250ZXh0bWVudSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHR9XG5cblx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NvbnRleHRtZW51JywgY29udGV4dG1lbnUsIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBtb3VzZWRvd24sIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd3aGVlbCcsIG1vdXNld2hlZWwsIGZhbHNlICk7XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaHN0YXJ0LCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIHRvdWNobW92ZSwgZmFsc2UgKTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUsIGZhbHNlICk7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBtb3VzZXVwLCBmYWxzZSApO1xuXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleXVwJywga2V5dXAsIGZhbHNlICk7XG5cblx0fTtcblxuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2NvbnRleHRtZW51JywgY29udGV4dG1lbnUsIGZhbHNlICk7IFxuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIG1vdXNlZG93biwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd3aGVlbCcsIG1vdXNld2hlZWwsIGZhbHNlICk7XG5cblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaGVuZCcsIHRvdWNoZW5kLCBmYWxzZSApO1xuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIHRvdWNobW92ZSwgZmFsc2UgKTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duLCBmYWxzZSApO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleXVwJywga2V5dXAsIGZhbHNlICk7XG5cblx0dGhpcy5oYW5kbGVSZXNpemUoKTtcblxuXHQvLyBmb3JjZSBhbiB1cGRhdGUgYXQgc3RhcnRcblx0dGhpcy51cGRhdGUoKTtcblxufVxuXG5UcmFja2JhbGxDb250cm9scy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBUSFJFRS5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlICk7XG5UcmFja2JhbGxDb250cm9scy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUcmFja2JhbGxDb250cm9scztcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcbmltcG9ydCB7Q2FtZXJhLCBDYW1lcmFTZXR0aW5ncywgU3RhbmRhcmRWaWV3fSAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtFdmVudE1hbmFnZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnRXZlbnRNYW5hZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGVyaWFsc30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdNYXRlcmlhbHMnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICAgICAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuXHJcbmNvbnN0IE9iamVjdE5hbWVzID0ge1xyXG4gICAgUm9vdCA6ICAnUm9vdCdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9WaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBWaWV3ZXIge1xyXG5cclxuICAgIF9ldmVudE1hbmFnZXIgICAgICAgICAgIDogRXZlbnRNYW5hZ2VyICAgICAgICAgICAgICA9IG51bGw7XHJcbiAgICBfbG9nZ2VyICAgICAgICAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgXHJcbiAgICBfc2NlbmUgICAgICAgICAgICAgICAgICA6IFRIUkVFLlNjZW5lICAgICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgX3Jvb3QgICAgICAgICAgICAgICAgICAgOiBUSFJFRS5PYmplY3QzRCAgICAgICAgICAgID0gbnVsbDsgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgIF9yZW5kZXJlciAgICAgICAgICAgICAgIDogVEhSRUUuV2ViR0xSZW5kZXJlciAgICAgICA9IG51bGw7O1xyXG4gICAgX2NhbnZhcyAgICAgICAgICAgICAgICAgOiBIVE1MQ2FudmFzRWxlbWVudCAgICAgICAgID0gbnVsbDtcclxuICAgIF93aWR0aCAgICAgICAgICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgICA9IDA7XHJcbiAgICBfaGVpZ2h0ICAgICAgICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICAgPSAwO1xyXG5cclxuICAgIF9jYW1lcmEgICAgICAgICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgICA9IG51bGw7XHJcbiAgICBfZGVmYXVsdENhbWVyYVNldHRpbmdzICA6IENhbWVyYVNldHRpbmdzICAgICAgICAgICAgPSBudWxsO1xyXG5cclxuICAgIF9jb250cm9scyAgICAgICAgICAgICAgIDogVHJhY2tiYWxsQ29udHJvbHMgICAgICAgICA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVmlld2VyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBlbGVtZW50VG9CaW5kVG8gSFRNTCBlbGVtZW50IHRvIGhvc3QgdGhlIHZpZXdlci5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kZWxDYW52YXNJZCA6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlciA9IG5ldyBFdmVudE1hbmFnZXIoKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgICAgICAgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBHcmFwaGljcy5pbml0aWFsaXplQ2FudmFzKG1vZGVsQ2FudmFzSWQpO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoICA9IHRoaXMuX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLl9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBhY3RpdmUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldCBtb2RlbCgpIDogVEhSRUUuR3JvdXAge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIEV2ZW50TWFuYWdlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGV2ZW50TWFuYWdlcigpIDogRXZlbnRNYW5hZ2VyIHtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRNYW5hZ2VyO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBhY3RpdmUgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgTmV3IG1vZGVsIHRvIGFjdGl2YXRlLlxyXG4gICAgICovXHJcbiAgICBzZXRNb2RlbCh2YWx1ZSA6IFRIUkVFLkdyb3VwKSB7XHJcblxyXG4gICAgICAgIC8vIE4uQi4gVGhpcyBpcyBhIG1ldGhvZCBub3QgYSBwcm9wZXJ0eSBzbyBhIHN1YiBjbGFzcyBjYW4gb3ZlcnJpZGUuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy80NDY1XHJcblxyXG4gICAgICAgIEdyYXBoaWNzLnJlbW92ZU9iamVjdENoaWxkcmVuKHRoaXMuX3Jvb3QsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLl9yb290LmFkZCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGNhbnZhcyBhZmVyIGEgd2luZG93IHJlc2l6ZVxyXG4gICAgICovXHJcbiAgICBnZXQgYXNwZWN0UmF0aW8oKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBhc3BlY3RSYXRpbyA6IG51bWJlciA9IHRoaXMuX3dpZHRoIC8gdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgIHJldHVybiBhc3BlY3RSYXRpbztcclxuICAgIH0gXHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHRlc3Qgc3BoZXJlIHRvIGEgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHBvcHVsYXRlU2NlbmUgKCkge1xyXG5cclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVNwaGVyZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMoKSwgMik7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIFNjZW5lXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVSb290KCk7XHJcblxyXG4gICAgICAgIHRoaXMucG9wdWxhdGVTY2VuZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgV2ViR0wgcmVuZGVyZXIuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVSZW5kZXJlciAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xyXG5cclxuICAgICAgICAgICAgbG9nYXJpdGhtaWNEZXB0aEJ1ZmZlciAgOiBmYWxzZSxcclxuICAgICAgICAgICAgY2FudmFzICAgICAgICAgICAgICAgICAgOiB0aGlzLl9jYW52YXMsXHJcbiAgICAgICAgICAgIGFudGlhbGlhcyAgICAgICAgICAgICAgIDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmF1dG9DbGVhciA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDAwMDAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVEZWZhdWx0Q2FtZXJhU2V0dGluZ3MgKCkgOiBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgICAgIHJldHVybiBDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3U2V0dGluZ3MoU3RhbmRhcmRWaWV3LkZyb250LCB0aGlzLm1vZGVsLCB0aGlzLmFzcGVjdFJhdGlvKTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlld2VyIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhKCkge1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzID0gdGhpcy5pbml0aWFsaXplRGVmYXVsdENhbWVyYVNldHRpbmdzKCk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKHRoaXMuX2RlZmF1bHRDYW1lcmFTZXR0aW5ncy5maWVsZE9mVmlldywgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzLm5lYXIsIHRoaXMuX2RlZmF1bHRDYW1lcmFTZXR0aW5ncy5mYXIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc2V0Q2FtZXJhVG9EZWZhdWx0U2V0dGluZ3MoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVMaWdodGluZygpIHtcclxuXHJcbiAgICAgICAgbGV0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg0MDQwNDApO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEMwQzA5MCk7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDEucG9zaXRpb24uc2V0KC0xMDAsIC01MCwgMTAwKTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDIgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEMwQzA5MCk7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDIucG9zaXRpb24uc2V0KDEwMCwgNTAsIC0xMDApO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0Mik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSB1c2VyIGlucHV0IGNvbnRyb2xzIChUcmFja2JhbGwpXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVJbnB1dENvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scyA9IG5ldyBUcmFja2JhbGxDb250cm9scyh0aGlzLl9jYW1lcmEsIHRoaXMuX3JlbmRlcmVyLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyBOLkIuIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMzI1MDk1L3RocmVlanMtY2FtZXJhLWxvb2thdC1oYXMtbm8tZWZmZWN0LWlzLXRoZXJlLXNvbWV0aGluZy1pbS1kb2luZy13cm9uZ1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLnBvc2l0aW9uMC5jb3B5KHRoaXMuX2NhbWVyYS5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbHMudGFyZ2V0LmNvcHkodGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSBrZXlib2FyZCBzaG9ydGN1dHMuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVLZXlib2FyZFNob3J0Y3V0cygpIHtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQgOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAvLyBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2phdmFzY3JpcHQvamF2YXNjcmlwdC1rZXljb2Rlcy9cclxuICAgICAgICAgICAgbGV0IGtleUNvZGUgOiBudW1iZXIgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDcwOiAgICAgICAgICAgICAgICAvLyBGICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2V0dGluZ3MgOiBDYW1lcmFTZXR0aW5ncyA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdTZXR0aW5ncyhTdGFuZGFyZFZpZXcuRnJvbnQsIHRoaXMubW9kZWwsIHRoaXMuYXNwZWN0UmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlDYW1lcmFTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgc2NlbmUgd2l0aCB0aGUgYmFzZSBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemUgKCkge1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2FtZXJhKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGlnaHRpbmcoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVJbnB1dENvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplS2V5Ym9hcmRTaG9ydGN1dHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZVdpbmRvdygpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplV2luZG93LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2NlbmVcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc2NlbmUgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBjbGVhckFsbEFzc2VzdHMoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4odGhpcy5fcm9vdCwgZmFsc2UpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIHJvb3Qgb2JqZWN0IGluIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVSb290KCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5uYW1lID0gT2JqZWN0TmFtZXMuUm9vdDtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQodGhpcy5fcm9vdCk7XHJcbiAgICB9XHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBDYW1lcmFcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXNldHMgYWxsIGNhbWVyYSBwcm9wZXJ0aWVzIHRvIHRoZSBkZWZhdWx0c1xyXG4gICAgICogQHBhcmFtIHtDYW1lcmFTZXR0aW5nc30gc2V0dGluZ3MgU2V0dGluZ3MgdG8gYXBwbHkgdG8gY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBhcHBseUNhbWVyYVNldHRpbmdzKHNldHRpbmdzIDogQ2FtZXJhU2V0dGluZ3MpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9jYW1lcmEucG9zaXRpb24uY29weShzZXR0aW5ncy5wb3NpdGlvbik7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5sb29rQXQoc2V0dGluZ3MudGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl9jYW1lcmEubmVhciA9IHNldHRpbmdzLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLmZhciAgPSBzZXR0aW5ncy5mYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLmZvdiAgPSBzZXR0aW5ncy5maWVsZE9mVmlldztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9jYW1lcmEudXAuc2V0KDAsIDEsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbWVyYU9uV2luZG93UmVzaXplKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSW5wdXRDb250cm9scygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBTZXRzIHRoZSB2aWV3IGNhbWVyYSBwcm9wZXJ0aWVzIHRvIHRoZSBnaXZlbiBzZXR0aW5ncy5cclxuICAgICAqIEBwYXJhbSB7U3RhbmRhcmRWaWV3fSB2aWV3IENhbWVyYSBzZXR0aW5ncyB0byBhcHBseS5cclxuICAgICAqL1xyXG4gICAgc2V0Q2FtZXJhVG9TdGFuZGFyZFZpZXcodmlldyA6IFN0YW5kYXJkVmlldykge1xyXG5cclxuICAgICAgICB0aGlzLl9kZWZhdWx0Q2FtZXJhU2V0dGluZ3MgPSBDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3U2V0dGluZ3ModmlldywgdGhpcy5tb2RlbCwgIHRoaXMuYXNwZWN0UmF0aW8pO1xyXG4gICAgICAgIHRoaXMucmVzZXRDYW1lcmFUb0RlZmF1bHRTZXR0aW5ncygpO1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJlc2V0cyBhbGwgY2FtZXJhIHByb3BlcnRpZXMgdG8gdGhlIGRlZmF1bHRzLlxyXG4gICAgICovXHJcbiAgICByZXNldENhbWVyYVRvRGVmYXVsdFNldHRpbmdzKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYXBwbHlDYW1lcmFTZXR0aW5ncyAodGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBGaXRzIHRoZSBhY3RpdmUgdmlldy5cclxuICAgICAqL1xyXG4gICAgZml0VmlldygpIHtcclxuXHJcbiAgICAgICAgbGV0IGZpdFZpZXdTZXR0aW5ncyA9IENhbWVyYS5nZXRGaXRWaWV3U2V0dGluZ3MgKHRoaXMubW9kZWwsIHRoaXMuX2NhbWVyYS5hc3BlY3QpO1xyXG4gICAgICAgIHRoaXMuYXBwbHlDYW1lcmFTZXR0aW5ncyhmaXRWaWV3U2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFdpbmRvdyBSZXNpemVcclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgc2NlbmUgY2FtZXJhIHRvIG1hdGNoIHRoZSBuZXcgd2luZG93IHNpemVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQ2FtZXJhT25XaW5kb3dSZXNpemUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5hc3BlY3QgPSB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgIC8vIHRoaXMuX2NhbWVyYS5sb29rQXQodGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzLnRhcmdldCk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgdGhlIFdlYkdMIHByb2Nlc3NpbmcgZm9yIGEgRE9NIHdpbmRvdyAncmVzaXplJyBldmVudFxyXG4gICAgICovXHJcbiAgICByZXNpemVEaXNwbGF5V2ViR0woKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gIHRoaXMuX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLl9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFNpemUodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scy5oYW5kbGVSZXNpemUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbWVyYU9uV2luZG93UmVzaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIGEgd2luZG93IHJlc2l6ZSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblJlc2l6ZVdpbmRvdyAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucmVzaXplRGlzcGxheVdlYkdMKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFJlbmRlciBMb29wXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIHRoZSBXZWJHTCByZW5kZXIgb2YgdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcldlYkdMKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scy51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fc2NlbmUsIHRoaXMuX2NhbWVyYSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluIERPTSByZW5kZXIgbG9vcFxyXG4gICAgICovXHJcbiAgICBhbmltYXRlKCkge1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyV2ViR0woKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcblxyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IHRlc3RNb2RlbENvbG9yID0gJyM1NThkZTgnO1xyXG5cclxuZXhwb3J0IGVudW0gVGVzdE1vZGVsIHtcclxuICAgIFRvcnVzLFxyXG4gICAgU3BoZXJlLFxyXG4gICAgU2xvcGVkUGxhbmUsXHJcbiAgICBCb3gsXHJcbiAgICBDaGVja2VyYm9hcmRcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3RNb2RlbExvYWRlciB7XHJcblxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBUZXN0TW9kZWxMb2FkZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIExvYWRzIGEgcGFyYW1ldHJpYyB0ZXN0IG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHtWaWV3ZXJ9IHZpZXdlciBWaWV3ZXIgaW5zdGFuY2UgdG8gcmVjZWl2ZSBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB7VGVzdE1vZGVsfSBtb2RlbFR5cGUgTW9kZWwgdHlwZSAoQm94LCBTcGhlcmUsIGV0Yy4pXHJcbiAgICAgKi9cclxuICAgIGxvYWRUZXN0TW9kZWwgKHZpZXdlciA6IFZpZXdlciwgbW9kZWxUeXBlIDogVGVzdE1vZGVsKSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobW9kZWxUeXBlKXtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLlRvcnVzOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVG9ydXNNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5TcGhlcmU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTcGhlcmVNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5TbG9wZWRQbGFuZTogXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTbG9wZWRQbGFuZU1vZGVsKHZpZXdlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLkJveDpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEJveE1vZGVsKHZpZXdlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLkNoZWNrZXJib2FyZDpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENoZWNrZXJib2FyZE1vZGVsKHZpZXdlcik7ICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHRvcnVzIHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkVG9ydXNNb2RlbCh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdG9ydXNTY2VuZSA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAgICAgICAvLyBTZXR1cCBzb21lIGdlb21ldHJpZXNcclxuICAgICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNLbm90R2VvbWV0cnkoMSwgMC4zLCAxMjgsIDY0KTtcclxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSk7XHJcblxyXG4gICAgICAgIGxldCBjb3VudCA9IDUwO1xyXG4gICAgICAgIGxldCBzY2FsZSA9IDU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpICogMi4wICogTWF0aC5QSTtcclxuICAgICAgICAgICAgbGV0IHogPSAoTWF0aC5yYW5kb20oKSAqIDIuMCkgLSAxLjA7XHJcbiAgICAgICAgICAgIGxldCB6U2NhbGUgPSBNYXRoLnNxcnQoMS4wIC0geiAqIHopICogc2NhbGU7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIG1lc2gucG9zaXRpb24uc2V0KFxyXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MocikgKiB6U2NhbGUsXHJcbiAgICAgICAgICAgICAgICBNYXRoLnNpbihyKSAqIHpTY2FsZSxcclxuICAgICAgICAgICAgICAgIHogKiBzY2FsZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBtZXNoLnJvdGF0aW9uLnNldChNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKTtcclxuXHJcbiAgICAgICAgICAgIG1lc2gubmFtZSA9ICdUb3J1cyBDb21wb25lbnQnO1xyXG4gICAgICAgICAgICB0b3J1c1NjZW5lLmFkZChtZXNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsICh0b3J1c1NjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSB0ZXN0IHNwaGVyZSB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRTcGhlcmVNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCByYWRpdXMgPSAyOyAgICBcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVNwaGVyZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHJhZGl1cywgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pKVxyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHRlc3QgYm94IHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZEJveE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoICA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBoZWlnaHQgPSAyOyAgICBcclxuICAgICAgICBsZXQgZGVwdGggID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKG5ldyBUSFJFRS5WZWN0b3IzLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pKVxyXG5cclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBzbG9wZWQgcGxhbmUgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkU2xvcGVkUGxhbmVNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCAgPSAyOyAgICBcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVQbGFuZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHdpZHRoLCBoZWlnaHQsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSkgICAgICAgXHJcbiAgICAgICAgbWVzaC5yb3RhdGVYKE1hdGguUEkgLyA0KTtcclxuICAgICAgICBcclxuICAgICAgICBtZXNoLm5hbWUgPSAnU2xvcGVkUGxhbmUnO1xyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHRlc3QgbW9kZWwgY29uc2lzdGluZyBvZiBhIHRpZXJlZCBjaGVja2VyYm9hcmRcclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkQ2hlY2tlcmJvYXJkTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBncmlkTGVuZ3RoICAgICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ICAgIDogbnVtYmVyID0gMS4wOyAgICAgICAgXHJcbiAgICAgICAgbGV0IGdyaWREaXZpc2lvbnMgIDogbnVtYmVyID0gMjtcclxuICAgICAgICBsZXQgdG90YWxDZWxscyAgICAgOiBudW1iZXIgPSBNYXRoLnBvdyhncmlkRGl2aXNpb25zLCAyKTtcclxuXHJcbiAgICAgICAgbGV0IGNlbGxCYXNlICAgICAgIDogbnVtYmVyID0gZ3JpZExlbmd0aCAvIGdyaWREaXZpc2lvbnM7XHJcbiAgICAgICAgbGV0IGNlbGxIZWlnaHQgICAgIDogbnVtYmVyID0gdG90YWxIZWlnaHQgLyB0b3RhbENlbGxzO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luWCA6IG51bWJlciA9IC0oY2VsbEJhc2UgKiAoZ3JpZERpdmlzaW9ucyAvIDIpKSArIChjZWxsQmFzZSAvIDIpO1xyXG4gICAgICAgIGxldCBvcmlnaW5ZIDogbnVtYmVyID0gb3JpZ2luWDtcclxuICAgICAgICBsZXQgb3JpZ2luWiA6IG51bWJlciA9IC1jZWxsSGVpZ2h0IC8gMjtcclxuICAgICAgICBsZXQgb3JpZ2luICA6IFRIUkVFLlZlY3RvcjMgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YLCBvcmlnaW5ZLCBvcmlnaW5aKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYmFzZUNvbG9yICAgICAgOiBudW1iZXIgPSAweDAwNzA3MDtcclxuICAgICAgICBsZXQgY29sb3JEZWx0YSAgICAgOiBudW1iZXIgPSAoMjU2IC8gdG90YWxDZWxscykgKiBNYXRoLnBvdygyNTYsIDIpO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXAgICAgICA6IFRIUkVFLkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgbGV0IGNlbGxPcmlnaW4gOiBUSFJFRS5WZWN0b3IzID0gb3JpZ2luLmNsb25lKCk7XHJcbiAgICAgICAgbGV0IGNlbGxDb2xvciAgOiBudW1iZXIgPSBiYXNlQ29sb3I7XHJcbiAgICAgICAgZm9yIChsZXQgaVJvdyA6IG51bWJlciA9IDA7IGlSb3cgPCBncmlkRGl2aXNpb25zOyBpUm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaUNvbHVtbiA6IG51bWJlciA9IDA7IGlDb2x1bW4gPCBncmlkRGl2aXNpb25zOyBpQ29sdW1uKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiBjZWxsQ29sb3J9KTtcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsIDogVEhSRUUuTWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJveE1lc2goY2VsbE9yaWdpbiwgY2VsbEJhc2UsIGNlbGxCYXNlLCBjZWxsSGVpZ2h0LCBjZWxsTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuYWRkIChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjZWxsT3JpZ2luLnggKz0gY2VsbEJhc2U7XHJcbiAgICAgICAgICAgICAgICBjZWxsT3JpZ2luLnogKz0gY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGNlbGxDb2xvciAgICArPSBjb2xvckRlbHRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2VsbE9yaWdpbi54ID0gb3JpZ2luLng7XHJcbiAgICAgICAgY2VsbE9yaWdpbi55ICs9IGNlbGxCYXNlO1xyXG4gICAgICAgIH0gICAgICAgXHJcblxyXG4gICAgICAgIGdyb3VwLm5hbWUgPSAnQ2hlY2tlcmJvYXJkJztcclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwoZ3JvdXApO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuXHJcbmltcG9ydCB7U3RhbmRhcmRWaWV3fSAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge09CSkxvYWRlcn0gICAgICAgICAgICAgICAgICBmcm9tIFwiT0JKTG9hZGVyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VGVzdE1vZGVsTG9hZGVyLCBUZXN0TW9kZWx9IGZyb20gJ1Rlc3RNb2RlbExvYWRlcidcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuY29uc3QgdGVzdE1vZGVsQ29sb3IgPSAnIzU1OGRlOCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZGVyIHtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIExvYWRlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIG1vZGVsIGJhc2VkIG9uIHRoZSBtb2RlbCBuYW1lIGFuZCBwYXRoIGVtYmVkZGVkIGluIHRoZSBIVE1MIHBhZ2UuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi8gICAgXHJcbiAgICBsb2FkT0JKTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWxOYW1lRWxlbWVudCA6IEhUTUxFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RlbE5hbWUnKTtcclxuICAgICAgICBsZXQgbW9kZWxQYXRoRWxlbWVudCA6IEhUTUxFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RlbFBhdGgnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IG1vZGVsTmFtZSAgICA6IHN0cmluZyA9IG1vZGVsTmFtZUVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgbGV0IG1vZGVsUGF0aCAgICA6IHN0cmluZyA9IG1vZGVsUGF0aEVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgbGV0IGZpbGVOYW1lICAgICA6IHN0cmluZyA9IG1vZGVsUGF0aCArIG1vZGVsTmFtZTtcclxuXHJcbiAgICAgICAgbGV0IG1hbmFnZXIgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKTtcclxuICAgICAgICBsZXQgbG9hZGVyICA9IG5ldyBPQkpMb2FkZXIobWFuYWdlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoeGhyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoeGhyLmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGVyY2VudENvbXBsZXRlLnRvRml4ZWQoMikgKyAnJSBkb3dubG9hZGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgb25FcnJvciA9IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICB9OyAgICAgICAgXHJcblxyXG4gICAgICAgIGxvYWRlci5sb2FkKGZpbGVOYW1lLCBmdW5jdGlvbiAoZ3JvdXAgOiBUSFJFRS5Hcm91cCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmlld2VyLnNldE1vZGVsKGdyb3VwKTtcclxuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgcGFyYW1ldHJpYyB0ZXN0IG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIG1vZGVsVHlwZSBUZXN0IG1vZGVsIHR5cGUgKFNwaGVyLCBCb3gsIGV0Yy4pXHJcbiAgICAgKi8gICAgXHJcbiAgICBsb2FkUGFyYW1ldHJpY1Rlc3RNb2RlbCAodmlld2VyIDogVmlld2VyLCBtb2RlbFR5cGUgOiBUZXN0TW9kZWwpIHtcclxuXHJcbiAgICAgICAgbGV0IHRlc3RMb2FkZXIgPSBuZXcgVGVzdE1vZGVsTG9hZGVyKCk7XHJcbiAgICAgICAgdGVzdExvYWRlci5sb2FkVGVzdE1vZGVsKHZpZXdlciwgbW9kZWxUeXBlKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmFTZXR0aW5ncywgQ2FtZXJhfSAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0RlcHRoQnVmZmVyfSAgICAgICAgICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIE1lc2hWaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNZXNoVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocHJldmlld0NhbnZhc0lkIDogc3RyaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIocHJldmlld0NhbnZhc0lkKTtcclxuXHJcbiAgICAgICAgLy9vdmVycmlkZVxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmh0bWxMb2dnZXI7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW5pdGlhbGl6YXRpb25cclxuICAgIC8qKlxyXG4gICAgICogUG9wdWxhdGUgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHBvcHVsYXRlU2NlbmUgKCkgeyAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGhlaWdodCA9IDE7XHJcbiAgICAgICAgbGV0IHdpZHRoICA9IDE7XHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVQbGFuZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMoKSwgaGVpZ2h0LCB3aWR0aCwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKERlcHRoQnVmZmVyLkRlZmF1bHRNZXNoUGhvbmdNYXRlcmlhbFBhcmFtZXRlcnMpKTtcclxuICAgICAgICB0aGlzLl9yb290LmFkZChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplTGlnaHRpbmcoKSB7XHJcblxyXG4gICAgICAgIGxldCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjIpO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDEucG9zaXRpb24uc2V0KDQsIDQsIDQpO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0MSk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7U3RhbmRhcmRWaWV3fSAgICAgICAgICAgICAgIGZyb20gXCJDYW1lcmFcIlxyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJ9ICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7T0JKTG9hZGVyfSAgICAgICAgICAgICAgICAgIGZyb20gXCJPQkpMb2FkZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUZXN0TW9kZWx9ICAgICAgICAgICAgICAgICAgZnJvbSAnVGVzdE1vZGVsTG9hZGVyJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tIFwiVmlld2VyXCJcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIE1vZGVsVmlld2VyU2V0dGluZ3Mge1xyXG5cclxuICAgIGRpc3BsYXlHcmlkICAgIDogYm9vbGVhbjtcclxuICAgIGdlbmVyYXRlUmVsaWVmIDogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBzdGFuZGFyZFZpZXcgICAgICAgOiBTdGFuZGFyZFZpZXc7XHJcbiAgICBuZWFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXI7XHJcbiAgICBmYXJDbGlwcGluZ1BsYW5lICAgOiBudW1iZXI7XHJcbiAgICBmaWVsZE9mVmlldyAgICAgICAgOiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIGdlbmVyYXRlUmVsaWVmIDogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JpZCAgICA9IHRydWU7IFxyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVSZWxpZWYgPSBnZW5lcmF0ZVJlbGllZjtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFuZGFyZFZpZXcgICAgICAgICA9IFN0YW5kYXJkVmlldy5Gcm9udDtcclxuICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lICAgID0gY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5mYXJDbGlwcGluZ1BsYW5lICAgICA9IGNhbWVyYS5mYXI7XHJcbiAgICAgICAgdGhpcy5maWVsZE9mVmlldyAgICAgICAgICA9IGNhbWVyYS5mb3Y7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNb2RlbFZpZXdlciBVSSBDb250cm9scy5cclxuICovICAgIFxyXG5leHBvcnQgY2xhc3MgTW9kZWxWaWV3ZXJDb250cm9scyB7XHJcblxyXG4gICAgc3RhdGljIENvbnRhaW5lcklkICAgOiBzdHJpbmcgPSAnbW9kZWxDb250YWluZXInO1xyXG5cclxuICAgIF9tb2RlbFZpZXdlciAgICAgICAgIDogTW9kZWxWaWV3ZXI7ICAgICAgICAgICAgICAgICAgICAgLy8gYXNzb2NpYXRlZCB2aWV3ZXJcclxuICAgIF9tb2RlbFZpZXdlclNldHRpbmdzIDogTW9kZWxWaWV3ZXJTZXR0aW5nczsgICAgICAgICAgICAgLy8gVUkgc2V0dGluZ3NcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsVmlld2VyQ29udHJvbHNcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbFZpZXdlciA6IE1vZGVsVmlld2VyKSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIgPSBtb2RlbFZpZXdlcjtcclxuXHJcbiAgICAgICAgLy8gVUkgQ29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDb250cm9scygpO1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEV2ZW50IEhhbmRsZXJzXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIHJlbGllZiBmcm9tIHRoZSBjdXJyZW50IG1vZGVsIGNhbWVyYS5cclxuICAgICAqL1xyXG4gICAgZ2VuZXJhdGVSZWxpZWYoKSA6IHZvaWQgeyBcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIuZ2VuZXJhdGVSZWxpZWYoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MgPSBuZXcgTW9kZWxWaWV3ZXJTZXR0aW5ncyh0aGlzLl9tb2RlbFZpZXdlci5jYW1lcmEsIHRoaXMuZ2VuZXJhdGVSZWxpZWYuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIGxldCBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgbWVudURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKE1vZGVsVmlld2VyQ29udHJvbHMuQ29udGFpbmVySWQpO1xyXG4gICAgICAgIG1lbnVEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1vZGVsVmlld2VyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICBsZXQgbW9kZWxWaWV3ZXJPcHRpb25zID0gZ3VpLmFkZEZvbGRlcignTW9kZWxWaWV3ZXIgT3B0aW9ucycpO1xyXG5cclxuICAgICAgICAvLyBHcmlkXHJcbiAgICAgICAgbGV0IGNvbnRyb2xEaXNwbGF5R3JpZCA9IG1vZGVsVmlld2VyT3B0aW9ucy5hZGQodGhpcy5fbW9kZWxWaWV3ZXJTZXR0aW5ncywgJ2Rpc3BsYXlHcmlkJykubmFtZSgnRGlzcGxheSBHcmlkJyk7XHJcbiAgICAgICAgY29udHJvbERpc3BsYXlHcmlkLm9uQ2hhbmdlICgodmFsdWUgOiBib29sZWFuKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fbW9kZWxWaWV3ZXIuZGlzcGxheUdyaWQodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBHZW5lcmF0ZSBSZWxpZWZcclxuICAgICAgICBsZXQgY29udHJvbEdlbmVyYXRlUmVsaWVmID0gbW9kZWxWaWV3ZXJPcHRpb25zLmFkZCh0aGlzLl9tb2RlbFZpZXdlclNldHRpbmdzLCAnZ2VuZXJhdGVSZWxpZWYnKS5uYW1lKCdHZW5lcmF0ZSBSZWxpZWYnKTtcclxuXHJcbiAgICAgICAgbW9kZWxWaWV3ZXJPcHRpb25zLm9wZW4oKTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IGNhbWVyYU9wdGlvbnMgPSBndWkuYWRkRm9sZGVyKCdDYW1lcmEgT3B0aW9ucycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFN0YW5kYXJkIFZpZXdzXHJcbiAgICAgICAgbGV0IHZpZXdPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBGcm9udCAgIDogU3RhbmRhcmRWaWV3LkZyb250LFxyXG4gICAgICAgICAgICBUb3AgICAgIDogU3RhbmRhcmRWaWV3LlRvcCxcclxuICAgICAgICAgICAgSXNvICAgICA6IFN0YW5kYXJkVmlldy5Jc29tZXRyaWMsXHJcbiAgICAgICAgICAgIExlZnQgICAgOiBTdGFuZGFyZFZpZXcuTGVmdCxcclxuICAgICAgICAgICAgUmlnaHQgICA6IFN0YW5kYXJkVmlldy5SaWdodCxcclxuICAgICAgICAgICAgQm90dG9tICA6IFN0YW5kYXJkVmlldy5Cb3R0b21cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgY29udHJvbFN0YW5kYXJkVmlld3MgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9tb2RlbFZpZXdlclNldHRpbmdzLCAnc3RhbmRhcmRWaWV3Jywgdmlld09wdGlvbnMpLm5hbWUoJ1N0YW5kYXJkIFZpZXcnKTtcclxuICAgICAgICBjb250cm9sU3RhbmRhcmRWaWV3cy5vbkNoYW5nZSAoKHZpZXcgOiBTdGFuZGFyZFZpZXcpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNjb3BlLl9tb2RlbFZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyh2aWV3KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTmVhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIGxldCBtaW5pbXVtICA9ICAgMC4xO1xyXG4gICAgICAgIGxldCBtYXhpbXVtICA9IDEwMDtcclxuICAgICAgICBsZXQgc3RlcFNpemUgPSAgIDAuMTtcclxuICAgICAgICBsZXQgY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fbW9kZWxWaWV3ZXJTZXR0aW5ncywgJ25lYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnTmVhciBDbGlwcGluZyBQbGFuZScpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7XHJcbiAgICAgICAgY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl9tb2RlbFZpZXdlci5jYW1lcmEubmVhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fbW9kZWxWaWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBGYXIgQ2xpcHBpbmcgUGxhbmVcclxuICAgICAgICBtaW5pbXVtICA9ICAgICAxO1xyXG4gICAgICAgIG1heGltdW0gID0gMTAwMDA7XHJcbiAgICAgICAgc3RlcFNpemUgPSAgICAgMC4xO1xyXG4gICAgICAgIGxldCBjb250cm9sRmFyQ2xpcHBpbmdQbGFuZSA9IGNhbWVyYU9wdGlvbnMuYWRkKHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MsICdmYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnRmFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZhckNsaXBwaW5nUGxhbmUub25DaGFuZ2UgKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuX21vZGVsVmlld2VyLmNhbWVyYS5mYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX21vZGVsVmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIG1pbmltdW0gID0gMjU7XHJcbiAgICAgICAgbWF4aW11bSAgPSA3NTtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXc9IGNhbWVyYU9wdGlvbnMuYWRkKHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MsICdmaWVsZE9mVmlldycpLm5hbWUoJ0ZpZWxkIG9mIFZpZXcnKS5taW4obWluaW11bSkubWF4KG1heGltdW0pLnN0ZXAoc3RlcFNpemUpLmxpc3RlbigpOztcclxuICAgICAgICBjb250cm9sRmllbGRPZlZpZXcgLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl9tb2RlbFZpZXdlci5jYW1lcmEuZm92ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHNjb3BlLl9tb2RlbFZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGNhbWVyYU9wdGlvbnMub3BlbigpOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN5bmNocm9uaXplIHRoZSBVSSBjYW1lcmEgc2V0dGluZ3Mgd2l0aCB0aGUgdGFyZ2V0IGNhbWVyYS5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgXHJcbiAgICAgKi9cclxuICAgIHN5bmNocm9uaXplQ2FtZXJhU2V0dGluZ3MgKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MubmVhckNsaXBwaW5nUGxhbmUgPSBjYW1lcmEubmVhcjtcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlclNldHRpbmdzLmZhckNsaXBwaW5nUGxhbmUgID0gY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlclNldHRpbmdzLmZpZWxkT2ZWaWV3ICAgICAgID0gY2FtZXJhLmZvdjtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhU2V0dGluZ3MsIFN0YW5kYXJkVmlld30gICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtFdmVudE1hbmFnZXIsIEV2ZW50VHlwZX0gICAgICAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge01hdGVyaWFsc30gICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTWF0ZXJpYWxzJ1xyXG5pbXBvcnQge01vZGVsVmlld2VyQ29udHJvbHN9ICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld2VyQ29udHJvbHNcIlxyXG5pbXBvcnQge0xvZ2dlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IE9iamVjdE5hbWVzID0ge1xyXG4gICAgR3JpZCA6ICAnR3JpZCdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9Nb2RlbFZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1vZGVsVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuXHJcbiAgICBfbW9kZWxWaWV3ZXJDb250cm9scyA6IE1vZGVsVmlld2VyQ29udHJvbHM7ICAgICAgICAgICAgIC8vIFVJIGNvbnRyb2xzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTW9kZWxWaWV3ZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIG1vZGVsQ2FudmFzSWQgSFRNTCBlbGVtZW50IHRvIGhvc3QgdGhlIHZpZXdlci5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kZWxDYW52YXNJZCA6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyIChtb2RlbENhbnZhc0lkKTsgICAgICAgXHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBjYW1lcmEuXHJcbiAgICAgKi9cclxuICAgIGdldCBjYW1lcmEoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgc2V0TW9kZWwodmFsdWUgOiBUSFJFRS5Hcm91cCkge1xyXG5cclxuICAgICAgICAvLyBDYWxsIGJhc2UgY2xhc3MgcHJvcGVydHkgdmlhIHN1cGVyXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy80NDY1ICAgICAgICBcclxuICAgICAgICBzdXBlci5zZXRNb2RlbCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyQ29udHJvbHMuc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncyh0aGlzLmNhbWVyYSk7XHJcblxyXG4gICAgICAgIC8vIGRpc3BhdGNoIE5ld01vZGVsIGV2ZW50XHJcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQodGhpcywgRXZlbnRUeXBlLk5ld01vZGVsLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW5pdGlhbGl6YXRpb24gICAgXHJcbiAgICAvKipcclxuICAgICAqIFBvcHVsYXRlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBwb3B1bGF0ZVNjZW5lICgpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgaGVscGVyID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoMzAwLCAzMCwgMHg4NmU2ZmYsIDB4OTk5OTk5KTtcclxuICAgICAgICBoZWxwZXIubmFtZSA9IE9iamVjdE5hbWVzLkdyaWQ7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGhlbHBlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmFsIGluaXRpYWxpemF0aW9uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIFVJIGNvbnRyb2xzIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplVUlDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXJDb250cm9scyA9IG5ldyBNb2RlbFZpZXdlckNvbnRyb2xzKHRoaXMpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBTY2VuZVxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5IHRoZSByZWZlcmVuY2UgZ3JpZC5cclxuICAgICAqL1xyXG4gICAgZGlzcGxheUdyaWQodmlzaWJsZSA6IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgbGV0IGdyaWRHZW9tZXRyeSA6IFRIUkVFLk9iamVjdDNEID0gdGhpcy5fc2NlbmUuZ2V0T2JqZWN0QnlOYW1lKE9iamVjdE5hbWVzLkdyaWQpO1xyXG4gICAgICAgIGdyaWRHZW9tZXRyeS52aXNpYmxlID0gdmlzaWJsZTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYERpc3BsYXkgZ3JpZCA9ICR7dmlzaWJsZX1gKTtcclxuICAgIH0gXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIE1lc2ggR2VuZXJhdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgYSByZWxpZWYgZnJvbSB0aGUgY3VycmVudCBtb2RlbCBjYW1lcmEuXHJcbiAgICAgKi9cclxuICAgIGdlbmVyYXRlUmVsaWVmKCkgOiB2b2lkIHsgXHJcbiAgICAgICAgXHJcbiAgICAvLyBwaXhlbHNcclxuICAgIGxldCB3aWR0aCAgPSA1MTI7XHJcbiAgICBsZXQgaGVpZ2h0ID0gd2lkdGggLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgbGV0IGZhY3RvcnkgPSBuZXcgRGVwdGhCdWZmZXJGYWN0b3J5KHt3aWR0aCA6IHdpZHRoLCBoZWlnaHQgOiBoZWlnaHQsIG1vZGVsIDogdGhpcy5tb2RlbCwgY2FtZXJhIDogdGhpcy5jYW1lcmEsIGFkZENhbnZhc1RvRE9NIDogZmFsc2V9KTsgICBcclxuXHJcbiAgICBsZXQgcHJldmlld01lc2ggOiBUSFJFRS5NZXNoID0gZmFjdG9yeS5tZXNoR2VuZXJhdGUoe30pOyAgIFxyXG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQodGhpcywgRXZlbnRUeXBlLk1lc2hHZW5lcmF0ZSwgcHJldmlld01lc2gpO1xyXG5cclxuICAgIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIuYWRkSW5mb01lc3NhZ2UoJ1JlbGllZiBnZW5lcmF0ZWQnKTtcclxufVxyXG4vLyNlbmRyZWdpb25cclxufSBcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuaW1wb3J0ICogYXMgZGF0ICAgIGZyb20gJ2RhdC1ndWknXHJcblxyXG5pbXBvcnQge1N0YW5kYXJkVmlld30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJDYW1lcmFcIlxyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICAgICAgICAgIGZyb20gXCJEZXB0aEJ1ZmZlckZhY3RvcnlcIlxyXG5pbXBvcnQge0V2ZW50VHlwZSwgTVJFdmVudCwgRXZlbnRNYW5hZ2VyfSAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdMb2FkZXInXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7TWVzaFZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk1lc2hWaWV3ZXJcIlxyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7T0JKTG9hZGVyfSAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk9CSkxvYWRlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VGVzdE1vZGVsfSAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVGVzdE1vZGVsTG9hZGVyJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJWaWV3ZXJcIlxyXG4gICAgXHJcbmV4cG9ydCBjbGFzcyBNb2RlbFJlbGllZiB7XHJcblxyXG4gICAgX21lc2hWaWV3ZXIgICAgICAgICA6IE1lc2hWaWV3ZXI7XHJcbiAgICBfbW9kZWxWaWV3ZXIgICAgICAgIDogTW9kZWxWaWV3ZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgICAgIDogTG9hZGVyO1xyXG4gICAgXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsUmVsaWVmXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBtZXNoIGdlbmVyYXRpb24uXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgTWVzaCBnZW5lcmF0aW9uIGV2ZW50LlxyXG4gICAgICogQHBhcmFtcyBtZXNoIE5ld2x5LWdlbmVyYXRlZCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBvbk1lc2hHZW5lcmF0ZSAoZXZlbnQgOiBNUkV2ZW50LCBtZXNoIDogVEhSRUUuTWVzaCkge1xyXG5cclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyLnNldE1vZGVsKG1lc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgbmV3IG1vZGVsLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IE5ld01vZGVsIGV2ZW50LlxyXG4gICAgICogQHBhcmFtIG1vZGVsIE5ld2x5IGxvYWRlZCBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgb25OZXdNb2RlbCAoZXZlbnQgOiBNUkV2ZW50LCBtb2RlbCA6IFRIUkVFLkdyb3VwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIuc2V0Q2FtZXJhVG9TdGFuZGFyZFZpZXcoU3RhbmRhcmRWaWV3LkZyb250KTsgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX21lc2hWaWV3ZXIuc2V0Q2FtZXJhVG9TdGFuZGFyZFZpZXcoU3RhbmRhcmRWaWV3LkZyb250KTsgICAgICAgXHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoIHRoZSBtb2RlbCBWaWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIHJ1biAoKSB7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIuYWRkSW5mb01lc3NhZ2UgKCdNb2RlbFJlbGllZiBzdGFydGVkJyk7ICAgXHJcbiAgICAgICBcclxuICAgICAgICAvLyBNZXNoIFByZXZpZXdcclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyID0gIG5ldyBNZXNoVmlld2VyKCdtZXNoQ2FudmFzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTW9kZWwgVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyID0gbmV3IE1vZGVsVmlld2VyKCdtb2RlbENhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyLmV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5NZXNoR2VuZXJhdGUsIHRoaXMub25NZXNoR2VuZXJhdGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIuZXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLk5ld01vZGVsLCAgICAgdGhpcy5vbk5ld01vZGVsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIExvYWRlclxyXG4gICAgICAgIHRoaXMuX2xvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgLy8gT0JKIE1vZGVsc1xyXG4gICAgICAgIHRoaXMuX2xvYWRlci5sb2FkT0JKTW9kZWwgKHRoaXMuX21vZGVsVmlld2VyKTtcclxuXHJcbiAgICAgICAgLy8gVGVzdCBNb2RlbHNcclxuLy8gICAgICB0aGlzLl9sb2FkZXIubG9hZFBhcmFtZXRyaWNUZXN0TW9kZWwodGhpcy5fbW9kZWxWaWV3ZXIsIFRlc3RNb2RlbC5DaGVja2VyYm9hcmQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgbW9kZWxSZWxpZWYgPSBuZXcgTW9kZWxSZWxpZWYoKTtcclxubW9kZWxSZWxpZWYucnVuKCk7XHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7YXNzZXJ0fSAgIGZyb20gJ2NoYWknXHJcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlcn0gZnJvbSAnRGVwdGhCdWZmZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9IGZyb20gJ01hdGgnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8qKlxyXG4gKiBAZXhwb3J0cyBWaWV3ZXIvVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVW5pdFRlc3RzIHtcclxuICAgXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBVbml0VGVzdHNcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgICAgICAgXHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBzdGF0aWMgVmVydGV4TWFwcGluZyAoZGVwdGhCdWZmZXIgOiBEZXB0aEJ1ZmZlciwgbWVzaCA6IFRIUkVFLk1lc2gpIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hHZW9tZXRyeSA6IFRIUkVFLkdlb21ldHJ5ID0gPFRIUkVFLkdlb21ldHJ5PiBtZXNoLmdlb21ldHJ5O1xyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBtZXNoR2VvbWV0cnkuYm91bmRpbmdCb3g7XHJcblxyXG4gICAgICAgIC8vIHdpZHRoICA9IDMgICAgICAgICAgICAgIDMgICA0ICAgNVxyXG4gICAgICAgIC8vIGNvbHVtbiA9IDIgICAgICAgICAgICAgIDAgICAxICAgMlxyXG4gICAgICAgIC8vIGJ1ZmZlciBsZW5ndGggPSA2XHJcblxyXG4gICAgICAgIC8vIFRlc3QgUG9pbnRzICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdCAgPSBib3VuZGluZ0JveC5taW47XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHQgPSBuZXcgVEhSRUUuVmVjdG9yMyAoYm91bmRpbmdCb3gubWF4LngsIGJvdW5kaW5nQm94Lm1pbi55LCAwKTtcclxuICAgICAgICBsZXQgdXBwZXJSaWdodCA9IGJvdW5kaW5nQm94Lm1heDtcclxuICAgICAgICBsZXQgdXBwZXJMZWZ0ICA9IG5ldyBUSFJFRS5WZWN0b3IzIChib3VuZGluZ0JveC5taW4ueCwgYm91bmRpbmdCb3gubWF4LnksIDApO1xyXG4gICAgICAgIGxldCBjZW50ZXIgICAgID0gYm91bmRpbmdCb3guZ2V0Q2VudGVyKCk7XHJcblxyXG4gICAgICAgIC8vIEV4cGVjdGVkIFZhbHVlc1xyXG4gICAgICAgIGxldCBidWZmZXJMZW5ndGggICAgOiBudW1iZXIgPSAoZGVwdGhCdWZmZXIud2lkdGggKiBkZXB0aEJ1ZmZlci5oZWlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZmlyc3RDb2x1bW4gICA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGxhc3RDb2x1bW4gICAgOiBudW1iZXIgPSBkZXB0aEJ1ZmZlci53aWR0aCAtIDE7XHJcbiAgICAgICAgbGV0IGNlbnRlckNvbHVtbiAgOiBudW1iZXIgPSBNYXRoLnJvdW5kKGRlcHRoQnVmZmVyLndpZHRoIC8gMik7XHJcbiAgICAgICAgbGV0IGZpcnN0Um93ICAgICAgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBsYXN0Um93ICAgICAgIDogbnVtYmVyID0gZGVwdGhCdWZmZXIuaGVpZ2h0IC0gMTtcclxuICAgICAgICBsZXQgY2VudGVyUm93ICAgICA6IG51bWJlciA9IE1hdGgucm91bmQoZGVwdGhCdWZmZXIuaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIGxldCBsb3dlckxlZnRJbmRleCAgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBsb3dlclJpZ2h0SW5kZXggOiBudW1iZXIgPSBkZXB0aEJ1ZmZlci53aWR0aCAtIDE7XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHRJbmRleCA6IG51bWJlciA9IGJ1ZmZlckxlbmd0aCAtIDE7XHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdEluZGV4ICA6IG51bWJlciA9IGJ1ZmZlckxlbmd0aCAtIGRlcHRoQnVmZmVyLndpZHRoO1xyXG4gICAgICAgIGxldCBjZW50ZXJJbmRleCAgICAgOiBudW1iZXIgPSAoY2VudGVyUm93ICogZGVwdGhCdWZmZXIud2lkdGgpICsgIE1hdGgucm91bmQoZGVwdGhCdWZmZXIud2lkdGggLyAyKTtcclxuXHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdEluZGljZXMgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGZpcnN0Um93LCBmaXJzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHRJbmRpY2VzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGZpcnN0Um93LCBsYXN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgdXBwZXJSaWdodEluZGljZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIobGFzdFJvdywgbGFzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdEluZGljZXMgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGxhc3RSb3csIGZpcnN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgY2VudGVySW5kaWNlcyAgICAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoY2VudGVyUm93LCBjZW50ZXJDb2x1bW4pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbmRleCAgIDogbnVtYmVyXHJcbiAgICAgICAgbGV0IGluZGljZXMgOiBUSFJFRS5WZWN0b3IyO1xyXG5cclxuICAgICAgICAvLyBMb3dlciBMZWZ0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyhsb3dlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIGxvd2VyTGVmdEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCAgID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleChsb3dlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIGxvd2VyTGVmdEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gTG93ZXIgUmlnaHRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKGxvd2VyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIGxvd2VyUmlnaHRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KGxvd2VyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIGxvd2VyUmlnaHRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIFVwcGVyIFJpZ2h0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyh1cHBlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCB1cHBlclJpZ2h0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleCh1cHBlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCB1cHBlclJpZ2h0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBVcHBlciBMZWZ0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyh1cHBlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIHVwcGVyTGVmdEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgodXBwZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCB1cHBlckxlZnRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIENlbnRlclxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXMoY2VudGVyLCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCBjZW50ZXJJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KGNlbnRlciwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgY2VudGVySW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIH0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhU2V0dGluZ3MsIENhbWVyYX0gICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7TWVzaFZpZXdlcn0gICAgICAgICAgICAgICAgIGZyb20gXCJNZXNoVmlld2VyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1VuaXRUZXN0c30gICAgICAgICAgICAgICAgICBmcm9tICdVbml0VGVzdHMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGJvdW5kaW5nIGJveCBtZXNoLlxyXG4gICAgICogQHBhcmFtIG9iamVjdCBUYXJnZXQgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIGNvbG9yIENvbG9yIG9mIGJvdW5kaW5nIGJveCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVCb3VuZGluZ0JveCAob2JqZWN0IDogVEhSRUUuT2JqZWN0M0QsIGNvbG9yIDogbnVtYmVyKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzID0gbmV3IFRIUkVFLkJveDMoKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGJvdW5kaW5nQm94LnNldEZyb21PYmplY3Qob2JqZWN0KTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHtjb2xvciA6IGNvbG9yLCBvcGFjaXR5IDogMS4wLCB3aXJlZnJhbWUgOiB0cnVlfSk7ICAgICAgIFxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveE1lc2ggOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlQm91bmRpbmdCb3hNZXNoRnJvbUJvdW5kaW5nQm94KGJvdW5kaW5nQm94LmdldENlbnRlcigpLCBib3VuZGluZ0JveCwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3hNZXNoO1xyXG4gICAgfVxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIENhbWVyYVdvcmtiZW5jaFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbWVyYVZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYW1lcmFcclxuICAgICAqL1xyXG4gICAgZ2V0IGNhbWVyYSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbWVyYTtcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZVNjZW5lKCkge1xyXG5cclxuICAgICAgICBsZXQgdHJpYWQgPSBHcmFwaGljcy5jcmVhdGVXb3JsZEF4ZXNUcmlhZChuZXcgVEhSRUUuVmVjdG9yMygpLCAxLCAwLjI1LCAwLjI1KTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQodHJpYWQpO1xyXG5cclxuICAgICAgICBsZXQgYm94IDogVEhSRUUuTWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJveE1lc2gobmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgLTIpLCAxLCAyLCAyLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe2NvbG9yIDogMHhmZjAwMDB9KSk7XHJcbiAgICAgICAgYm94LnJvdGF0aW9uLnNldChNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKTtcclxuICAgICAgICBib3gudXBkYXRlTWF0cml4KCk7XHJcblxyXG4gICAgICAgIGxldCBib3hDbG9uZSA9IEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KGJveCwgbmV3IFRIUkVFLk1hdHJpeDQoKSk7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5hZGQoYm94Q2xvbmUpO1xyXG5cclxuICAgICAgICBsZXQgc3BoZXJlIDogVEhSRUUuTWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVNwaGVyZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMoNCwgMiwgLTEpLCAxLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe2NvbG9yIDogMHgwMGZmMDB9KSk7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5hZGQoc3BoZXJlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlld2VyIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplRGVmYXVsdENhbWVyYVNldHRpbmdzICgpIDogQ2FtZXJhU2V0dGluZ3Mge1xyXG5cclxuICAgICAgICBsZXQgc2V0dGluZ3MgOiBDYW1lcmFTZXR0aW5ncyA9IHtcclxuXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLjAsIDAuMCwgMjAuMCksXHJcbiAgICAgICAgICAgIHRhcmdldDogICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSxcclxuICAgICAgICAgICAgbmVhcjogICAgICAgICAgICAyLjAsXHJcbiAgICAgICAgICAgIGZhcjogICAgICAgICAgICA1MC4wLFxyXG4gICAgICAgICAgICBmaWVsZE9mVmlldzogICAgMzcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly93d3cubmlrb25pYW5zLm9yZy9yZXZpZXdzL2Zvdi10YWJsZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2V0dGluZ3M7ICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIFZpZXdlckNvbnRyb2xzXHJcbiAqL1xyXG5jbGFzcyBWaWV3ZXJDb250cm9scyB7XHJcblxyXG4gICAgbmVhckNsaXBwaW5nUGxhbmUgIDogbnVtYmVyO1xyXG4gICAgZmFyQ2xpcHBpbmdQbGFuZSAgIDogbnVtYmVyO1xyXG4gICAgZmllbGRPZlZpZXcgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgIHNob3dCb3VuZGluZ0JveGVzIDogKCkgPT4gdm9pZDtcclxuICAgIHNldENsaXBwaW5nUGxhbmVzIDogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBzaG93Qm91bmRpbmdCb3hlcyA6ICgpID0+IGFueSwgc2V0Q2xpcHBpbmdQbGFuZXMgOiAoKSA9PiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5uZWFyQ2xpcHBpbmdQbGFuZSAgICA9IGNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSAgICAgPSBjYW1lcmEuZmFyO1xyXG4gICAgICAgIHRoaXMuZmllbGRPZlZpZXcgICAgICAgICAgPSBjYW1lcmEuZm92O1xyXG5cclxuICAgICAgICB0aGlzLnNob3dCb3VuZGluZ0JveGVzID0gc2hvd0JvdW5kaW5nQm94ZXM7XHJcbiAgICAgICAgdGhpcy5zZXRDbGlwcGluZ1BsYW5lcyAgPSBzZXRDbGlwcGluZ1BsYW5lcztcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBBcHBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHAge1xyXG4gICAgXHJcbiAgICBfbG9nZ2VyICAgICAgICAgOiBDb25zb2xlTG9nZ2VyO1xyXG4gICAgX2xvYWRlciAgICAgICAgIDogTG9hZGVyO1xyXG4gICAgX3ZpZXdlciAgICAgICAgIDogQ2FtZXJhVmlld2VyO1xyXG4gICAgX3ZpZXdlckNvbnRyb2xzIDogVmlld2VyQ29udHJvbHM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIGNhbWVyYSBjbGlwcGluZyBwbGFuZXMgdG8gdGhlIG1vZGVsIGV4dGVudHMgaW4gVmlldyBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc2V0Q2xpcHBpbmdQbGFuZXMoKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbCAgICAgICAgICAgICAgICAgICAgOiBUSFJFRS5Hcm91cCAgID0gdGhpcy5fdmlld2VyLm1vZGVsO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UgOiBUSFJFRS5NYXRyaXg0ID0gdGhpcy5fdmlld2VyLmNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2U7XHJcblxyXG4gICAgICAgIC8vIGNsb25lIG1vZGVsIChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBtb2RlbFZpZXcgPSBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3ID0gR3JhcGhpY3MuZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KG1vZGVsVmlldyk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBib3ggaXMgd29ybGQtYXhpcyBhbGlnbmVkLiBcclxuICAgICAgICAvLyBJTnYgVmlldyBjb29yZGluYXRlcywgdGhlIGNhbWVyYSBpcyBhdCB0aGUgb3JpZ2luLlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBuZWFyIHBsYW5lIGlzIHRoZSBtYXhpbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgZmFyIHBsYW5lIGlzIHRoZSBtaW5pbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICBsZXQgbmVhclBsYW5lID0gLWJvdW5kaW5nQm94Vmlldy5tYXguejtcclxuICAgICAgICBsZXQgZmFyUGxhbmUgID0gLWJvdW5kaW5nQm94Vmlldy5taW4uejtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyQ29udHJvbHMubmVhckNsaXBwaW5nUGxhbmUgPSBuZWFyUGxhbmU7XHJcbiAgICAgICAgdGhpcy5fdmlld2VyQ29udHJvbHMuZmFyQ2xpcHBpbmdQbGFuZSAgPSBmYXJQbGFuZTtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyLmNhbWVyYS5uZWFyID0gbmVhclBsYW5lO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEuZmFyICA9IGZhclBsYW5lO1xyXG5cclxuICAgICAgICAvLyBXSVA6IE9yIHRoaXMuX3ZpZXdlci51cGRhdGVDYW1lcmEoKT9cclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIGNsaXBwaW5nIHBsYW5lcyBvZiB0aGUgbW9kZWwgaW4gVmlldyBhbmQgV29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHNob3dCb3VuZGluZ0JveGVzKCkge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWwgICAgICAgICAgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICA9IHRoaXMuX3ZpZXdlci5tb2RlbDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGQgICAgICAgIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubWF0cml4V29ybGQ7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nIEJvdW5kaW5nQm94XHJcbiAgICAgICAgbW9kZWwucmVtb3ZlKG1vZGVsLmdldE9iamVjdEJ5TmFtZShHcmFwaGljcy5Cb3VuZGluZ0JveE5hbWUpKTtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgbW9kZWwgKGFuZCBnZW9tZXRyeSEpXHJcbiAgICAgICAgbGV0IG1vZGVsVmlldyA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgLy8gY2xlYXIgZW50aXJlIHNjZW5lXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4obW9kZWwsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgbW9kZWwuYWRkKG1vZGVsVmlldyk7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXcgPSBjcmVhdGVCb3VuZGluZ0JveChtb2RlbFZpZXcsIDB4ZmYwMGZmKTtcclxuICAgICAgICBtb2RlbC5hZGQoYm91bmRpbmdCb3hWaWV3KTtcclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIG1vZGVsIGJhY2sgZnJvbSBWaWV3IHRvIFdvcmxkXHJcbiAgICAgICAgbGV0IG1vZGVsV29ybGQgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QobW9kZWxWaWV3LCBjYW1lcmFNYXRyaXhXb3JsZCk7XHJcbiAgICAgICAgbW9kZWwuYWRkKG1vZGVsV29ybGQpO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gYm91bmRpbmcgYm94IGJhY2sgZnJvbSBWaWV3IHRvIFdvcmxkXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94V29ybGQgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QoYm91bmRpbmdCb3hWaWV3LCBjYW1lcmFNYXRyaXhXb3JsZCk7XHJcbiAgICAgICAgbW9kZWwuYWRkKGJvdW5kaW5nQm94V29ybGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlldyBzZXR0aW5ncyB0aGF0IGFyZSBjb250cm9sbGFibGUgYnkgdGhlIHVzZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVZpZXdlckNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scyA9IG5ldyBWaWV3ZXJDb250cm9scyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLnNob3dCb3VuZGluZ0JveGVzLmJpbmQodGhpcyksIHRoaXMuc2V0Q2xpcHBpbmdQbGFuZXMuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIHZhciBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgc2V0dGluZ3NEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3NDb250cm9scycpO1xyXG4gICAgICAgIHNldHRpbmdzRGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuICAgICAgICB2YXIgZm9sZGVyT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ0NhbWVyYSBPcHRpb25zJyk7XHJcblxyXG4gICAgICAgIC8vIE5lYXIgQ2xpcHBpbmcgUGxhbmVcclxuICAgICAgICBsZXQgbWluaW11bSAgPSAgIDA7XHJcbiAgICAgICAgbGV0IG1heGltdW0gID0gMTAwO1xyXG4gICAgICAgIGxldCBzdGVwU2l6ZSA9ICAgMC4xO1xyXG4gICAgICAgIGxldCBjb250cm9sTmVhckNsaXBwaW5nUGxhbmUgPSBmb2xkZXJPcHRpb25zLmFkZCh0aGlzLl92aWV3ZXJDb250cm9scywgJ25lYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnTmVhciBDbGlwcGluZyBQbGFuZScpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7XHJcbiAgICAgICAgY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lIC5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS5uZWFyID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBGYXIgQ2xpcHBpbmcgUGxhbmVcclxuICAgICAgICBtaW5pbXVtICA9ICAgMTtcclxuICAgICAgICBtYXhpbXVtICA9IDUwMDtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAgMC4xO1xyXG4gICAgICAgIGxldCBjb250cm9sRmFyQ2xpcHBpbmdQbGFuZSA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnZmFyQ2xpcHBpbmdQbGFuZScpLm5hbWUoJ0ZhciBDbGlwcGluZyBQbGFuZScpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7O1xyXG4gICAgICAgIGNvbnRyb2xGYXJDbGlwcGluZ1BsYW5lIC5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS5mYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZpZWxkIG9mIFZpZXdcclxuICAgICAgICBtaW5pbXVtICA9IDI1O1xyXG4gICAgICAgIG1heGltdW0gID0gNzU7XHJcbiAgICAgICAgc3RlcFNpemUgPSAgMTtcclxuICAgICAgICBsZXQgY29udHJvbEZpZWxkT2ZWaWV3PSBmb2xkZXJPcHRpb25zLmFkZCh0aGlzLl92aWV3ZXJDb250cm9scywgJ2ZpZWxkT2ZWaWV3JykubmFtZSgnRmllbGQgb2YgVmlldycpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7O1xyXG4gICAgICAgIGNvbnRyb2xGaWVsZE9mVmlldyAub25DaGFuZ2UgKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEuZm92ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBTaG93IEJvdW5kaW5nIEJveGVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTaG93Qm91bmRpbmdCb3hlcyA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnc2hvd0JvdW5kaW5nQm94ZXMnKS5uYW1lKCdTaG93IEJvdW5kaW5nIEJveGVzJyk7XHJcblxyXG4gICAgICAgIC8vIENsaXBwaW5nIFBsYW5lc1xyXG4gICAgICAgIGxldCBjb250cm9sU2V0Q2xpcHBpbmdQbGFuZXMgPSBmb2xkZXJPcHRpb25zLmFkZCh0aGlzLl92aWV3ZXJDb250cm9scywgJ3NldENsaXBwaW5nUGxhbmVzJykubmFtZSgnU2V0IENsaXBwaW5nIFBsYW5lcycpO1xyXG5cclxuICAgICAgICBmb2xkZXJPcHRpb25zLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW5cclxuICAgICAqL1xyXG4gICAgcnVuICgpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFZpZXdlciAgICBcclxuICAgICAgICB0aGlzLl92aWV3ZXIgPSBuZXcgQ2FtZXJhVmlld2VyKCd2aWV3ZXJDYW52YXMnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXdlckNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBhcHAgPSBuZXcgQXBwO1xyXG5hcHAucnVuKCk7XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlclRlc3RcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlclRlc3Qge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBtYWluICgpIHtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGRlcHRoQnVmZmVyVGVzdCA9IG5ldyBEZXB0aEJ1ZmZlclRlc3QoKTtcclxuZGVwdGhCdWZmZXJUZXN0Lm1haW4oKTtcclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxubGV0IGxvZ2dlciA9IG5ldyBIVE1MTG9nZ2VyKCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIFdpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFdpZGdldCB7XHJcbiAgICBcclxuICAgIG5hbWUgIDogc3RyaW5nO1xyXG4gICAgcHJpY2UgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJpY2UgOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lICA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlcmF0ZVxyXG4gICAgICovXHJcbiAgICBvcGVyYXRlICgpIHtcclxuICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UoYCR7dGhpcy5uYW1lfSBvcGVyYXRpbmcuLi4uYCk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBTdXBlcldpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbG9yV2lkZ2V0IGV4dGVuZHMgV2lkZ2V0IHtcclxuXHJcbiAgICBjb2xvciA6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmljZSA6IG51bWJlciwgY29sb3IgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIgKG5hbWUsIHByaWNlKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFuZFBhcmVudCB7XHJcblxyXG4gICAgZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmdyYW5kcGFyZW50UHJvcGVydHkgID0gZ3JhbmRwYXJlbnRQcm9wZXJ0eSA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJlbnQgZXh0ZW5kcyBHcmFuZFBhcmVudHtcclxuICAgIFxyXG4gICAgcGFyZW50UHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZywgcGFyZW50UHJvcGVydHkgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoZ3JhbmRwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRQcm9wZXJ0eSA9IHBhcmVudFByb3BlcnR5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBQYXJlbnR7XHJcbiAgICBcclxuICAgIGNoaWxkUHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5IDogc3RyaW5nLCBwYXJlbnRQcm9wZXJ0eSA6IHN0cmluZywgY2hpbGRQcm9wZXJ0eSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBzdXBlcihncmFuZHBhcmVudFByb3BlcnR5LCBwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5jaGlsZFByb3BlcnR5ID0gY2hpbGRQcm9wZXJ0eTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBJbmhlcml0YW5jZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluaGVyaXRhbmNlVGVzdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluXHJcbiAgICAgKi9cclxuICAgIG1haW4gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3aWRnZXQgPSBuZXcgV2lkZ2V0ICgnV2lkZ2V0JywgMS4wKTtcclxuICAgICAgICB3aWRnZXQub3BlcmF0ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY29sb3JXaWRnZXQgPSBuZXcgQ29sb3JXaWRnZXQgKCdDb2xvcldpZGdldCcsIDEuMCwgJ3JlZCcpO1xyXG4gICAgICAgIGNvbG9yV2lkZ2V0Lm9wZXJhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkID0gbmV3IENoaWxkKCdHYUdhJywgJ0RhZCcsICdTdGV2ZScpOyAgICBcclxuICAgIH1cclxufVxyXG5cclxubGV0IGluaGVyaXRhbmNlID0gbmV3IEluaGVyaXRhbmNlVGVzdDtcclxuaW5oZXJpdGFuY2UubWFpbigpO1xyXG4iXX0=

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
        Camera.optimizeClippingPlanes = function (camera, model) {
            var modelClone = model.clone(true);
            modelClone.applyMatrix(camera.matrixWorldInverse);
            model = modelClone;
        };
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
         * @description Returns the camera settings to fit the model in a standard view.
         * @static
         * @param {THREE.Object3D} model Model to fit.
         * @param {Camera.StandardView} view Standard view (Top, Left, etc.)
         * @param {number} aspectRatio Aspect ratio of window.
         * @returns {CameraSettings}
         */
        Camera.getStandardViewSettings = function (model, view, aspectRatio) {
            var boundingBox = Camera.getDefaultBoundingBox(model);
            var verticalFieldOfViewRadians = (Camera.DefaultFieldOfView / 2) * (Math.PI / 180);
            var horizontalFieldOfViewRadians = Math.atan(aspectRatio * Math.tan(verticalFieldOfViewRadians));
            var cameraZVerticalExtents = (boundingBox.getSize().y / 2) / Math.tan(verticalFieldOfViewRadians);
            var cameraZHorizontalExtents = (boundingBox.getSize().x / 2) / Math.tan(horizontalFieldOfViewRadians);
            var cameraZ = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);
            var farPlane = Camera.DefaultFarClippingPlane;
            return {
                position: new THREE.Vector3(boundingBox.getCenter().x, boundingBox.getCenter().y, boundingBox.max.z + cameraZ),
                target: boundingBox.getCenter(),
                near: Camera.DefaultNearClippingPlane,
                far: farPlane,
                fieldOfView: Camera.DefaultFieldOfView
            };
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
            this._model = parameters.model.clone();
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
            this._depthBuffer.analyze();
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
define("Viewer/Viewer", ["require", "exports", "three", "Viewer/Camera", "Viewer/TrackballControls", "Viewer/Graphics", "System/Services"], function (require, exports, THREE, Camera_2, TrackballControls_1, Graphics_3, Services_4) {
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
            this._scene = null;
            this._root = null;
            this._renderer = null;
            this._canvas = null;
            this._width = 0;
            this._height = 0;
            this._camera = null;
            this._defaultCameraSettings = null;
            this._controls = null;
            this._logger = null;
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
            /**
             * Sets the active model.
             * @param value New model to activate.
             */
            set: function (value) {
                Graphics_3.Graphics.removeObjectChildren(this._root, false);
                this._root.add(value);
                this.setCameraToStandardView(Camera_2.StandardView.Front);
            },
            enumerable: true,
            configurable: true
        });
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
            return Camera_2.Camera.getStandardViewSettings(this.model, Camera_2.StandardView.Front, this.aspectRatio);
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
                        var settings = Camera_2.Camera.getStandardViewSettings(_this.model, Camera_2.StandardView.Front, _this.aspectRatio);
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
            this._defaultCameraSettings = Camera_2.Camera.getStandardViewSettings(this.model, view, this.aspectRatio);
            this.resetCameraToDefaultSettings();
        };
        /**
         * @description Resets all camera properties to the defaults.
         */
        Viewer.prototype.resetCameraToDefaultSettings = function () {
            this.applyCameraSettings(this._defaultCameraSettings);
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
            viewer.model = torusScene;
        };
        /**
         * Adds a test sphere to a scene.
         * @param viewer Instance of the Viewer to display the model.
         */
        TestModelLoader.prototype.loadSphereModel = function (viewer) {
            var radius = 2;
            var mesh = Graphics_4.Graphics.createSphereMesh(new THREE.Vector3, radius, new THREE.MeshPhongMaterial({ color: testModelColor }));
            viewer.model = mesh;
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
            viewer.model = mesh;
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
            viewer.model = mesh;
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
            viewer.model = group;
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
                viewer.model = group;
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
define("Viewer/MeshPreviewViewer", ["require", "exports", "three", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, DepthBuffer_2, Graphics_5, Services_5, Viewer_1) {
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
    var MeshPreviewViewer = (function (_super) {
        __extends(MeshPreviewViewer, _super);
        /**
         * @constructor
         */
        function MeshPreviewViewer(previewCanvasId) {
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
        MeshPreviewViewer.prototype.populateScene = function () {
            var height = 1;
            var width = 1;
            var mesh = Graphics_5.Graphics.createPlaneMesh(new THREE.Vector3(), height, width, new THREE.MeshPhongMaterial(DepthBuffer_2.DepthBuffer.DefaultMeshPhongMaterialParameters));
            this._root.add(mesh);
        };
        /**
         * Adds lighting to the scene.
         */
        MeshPreviewViewer.prototype.initializeLighting = function () {
            var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            this._scene.add(ambientLight);
            var directionalLight1 = new THREE.DirectionalLight(0xffffff);
            directionalLight1.position.set(4, 4, 4);
            this._scene.add(directionalLight1);
        };
        return MeshPreviewViewer;
    }(Viewer_1.Viewer));
    exports.MeshPreviewViewer = MeshPreviewViewer;
});
define("Viewer/ModelViewer", ["require", "exports", "three", "Viewer/Viewer"], function (require, exports, THREE, Viewer_2) {
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
         * Adds lighting to the scene
         */
        ModelViewer.prototype.initializeLighting = function () {
            _super.prototype.initializeLighting.call(this);
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
        return ModelViewer;
    }(Viewer_2.Viewer));
    exports.ModelViewer = ModelViewer;
});
define("ModelRelief", ["require", "exports", "dat-gui", "DepthBuffer/DepthBufferFactory", "ModelLoaders/Loader", "Viewer/MeshPreviewViewer", "Viewer/ModelViewer", "System/Services"], function (require, exports, dat, DepthBufferFactory_1, Loader_1, MeshPreviewViewer_1, ModelViewer_1, Services_6) {
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
    var ViewerControls = (function () {
        function ViewerControls(camera, generateRelief) {
            this.displayGrid = true;
            this.generateRelief = generateRelief;
            this.nearClippingPlane = camera.near;
            this.farClippingPlane = camera.far;
            this.fieldOfView = camera.fov;
        }
        return ViewerControls;
    }());
    var ModelRelief = (function () {
        /** Default constructor
         * @class ModelRelief
         * @constructor
         */
        function ModelRelief() {
        }
        /**
         * Generates a relief from the current model camera.
         */
        ModelRelief.prototype.generateRelief = function () {
            // pixels
            var width = 512;
            var height = width / this._modelViewer.aspectRatio;
            var factory = new DepthBufferFactory_1.DepthBufferFactory({ width: width, height: height, model: this._modelViewer._root, camera: this._modelViewer.camera, addCanvasToDOM: true });
            var previewMesh = factory.meshGenerate({});
            this._meshPreviewViewer.model = previewMesh;
            Services_6.Services.consoleLogger.addInfoMessage('Relief generated');
        };
        /**
         * Initialize the view settings that are controllable by the user
         */
        ModelRelief.prototype.initializeViewerControls = function () {
            var scope = this;
            var viewerControls = new ViewerControls(this._modelViewer.camera, this.generateRelief.bind(this));
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById('settingsControls');
            menuDiv.appendChild(gui.domElement);
            // ----------------------//
            //    ModelViewer        //      
            // ----------------------//
            var modelViewerOptions = gui.addFolder('ModelViewer Options');
            // Grid
            var controlDisplayGrid = modelViewerOptions.add(viewerControls, 'displayGrid').name('Display Grid');
            controlDisplayGrid.onChange(function (value) {
                scope._modelViewer.displayGrid(value);
            });
            // Depth Buffer
            var controlGenerateRelief = modelViewerOptions.add(viewerControls, 'generateRelief').name('Generate Relief');
            modelViewerOptions.open();
            // ----------------------//
            //        Camera         //      
            // ----------------------//
            var cameraOptions = gui.addFolder('Camera Options');
            // Near Clipping Plane
            var minimum = 0.1;
            var maximum = 100;
            var stepSize = 0.1;
            var controlNearClippingPlane = cameraOptions.add(viewerControls, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            controlNearClippingPlane.onChange(function (value) {
                scope._modelViewer.camera.near = value;
                scope._modelViewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Far Clipping Plane
            minimum = 1;
            maximum = 10000;
            stepSize = 0.1;
            var controlFarClippingPlane = cameraOptions.add(viewerControls, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFarClippingPlane.onChange(function (value) {
                scope._modelViewer.camera.far = value;
                scope._modelViewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Field of View
            minimum = 25;
            maximum = 75;
            stepSize = 1;
            var controlFieldOfView = cameraOptions.add(viewerControls, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFieldOfView.onChange(function (value) {
                scope._modelViewer.camera.fov = value;
                scope._modelViewer.camera.updateProjectionMatrix();
            }.bind(this));
            cameraOptions.open();
        };
        /**
         * Launch the model Viewer.
         */
        ModelRelief.prototype.run = function () {
            Services_6.Services.consoleLogger.addInfoMessage('ModelRelief started');
            // Model Viewer    
            this._modelViewer = new ModelViewer_1.ModelViewer('modelCanvas');
            // Mesh Preview
            this._meshPreviewViewer = new MeshPreviewViewer_1.MeshPreviewViewer('meshCanvas');
            // UI Controls
            this.initializeViewerControls();
            // Loader
            this._loader = new Loader_1.Loader();
            // OBJ Models
            this._loader.loadOBJModel(this._modelViewer);
            // Test Models
            // this._loader.loadParametricTestModel(this._modelViewer, TestModel.Box);
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
define("Workbench/CameraTest", ["require", "exports", "three", "dat-gui", "Viewer/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, dat, Graphics_6, Services_7, Viewer_3) {
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
            this._logger = Services_7.Services.consoleLogger;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvU3lzdGVtL0xvZ2dlci50cyIsIlNjcmlwdHMvU3lzdGVtL1NlcnZpY2VzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvR3JhcGhpY3MudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmEudHMiLCJTY3JpcHRzL1N5c3RlbS9NYXRoLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlci50cyIsIlNjcmlwdHMvU3lzdGVtL1Rvb2xzLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlckZhY3RvcnkudHMiLCJTY3JpcHRzL01vZGVsTG9hZGVycy9PQkpMb2FkZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9UcmFja2JhbGxDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL01hdGVyaWFscy50cyIsIlNjcmlwdHMvVmlld2VyL1ZpZXdlci50cyIsIlNjcmlwdHMvTW9kZWxMb2FkZXJzL1Rlc3RNb2RlbExvYWRlci50cyIsIlNjcmlwdHMvTW9kZWxMb2FkZXJzL0xvYWRlci50cyIsIlNjcmlwdHMvVmlld2VyL01lc2hQcmV2aWV3Vmlld2VyLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTW9kZWxWaWV3ZXIudHMiLCJTY3JpcHRzL01vZGVsUmVsaWVmLnRzIiwiU2NyaXB0cy9Vbml0VGVzdHMvVW5pdFRlc3RzLnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvQ2FtZXJhVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0RlcHRoQnVmZmVyVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0luaGVyaXRhbmNlVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDhFQUE4RTtJQUM5RSw2RUFBNkU7SUFDN0UsdUpBQXVKO0lBQ3ZKLDZFQUE2RTtJQUM3RSw2RUFBNkU7SUFDN0UsWUFBWSxDQUFDOztJQWlCYixJQUFLLFlBS0o7SUFMRCxXQUFLLFlBQVk7UUFDYixrQ0FBb0IsQ0FBQTtRQUNwQixzQ0FBc0IsQ0FBQTtRQUN0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b290L2pzL21vZGVscmVsaWVmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogTG9nZ2luZyBJbnRlcmZhY2VcclxuICogRGlhZ25vc3RpYyBsb2dnaW5nXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIExvZ2dlciB7XHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZyk7XHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpO1xyXG4gICAgYWRkSW5mb01lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nKTtcclxuICAgIGFkZE1lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpO1xyXG5cclxuICAgIGFkZEVtcHR5TGluZSAoKTtcclxuXHJcbiAgICBjbGVhckxvZygpO1xyXG59XHJcbiAgICAgICAgIFxyXG5lbnVtIE1lc3NhZ2VDbGFzcyB7XHJcbiAgICBFcnJvciAgID0gJ2xvZ0Vycm9yJyxcclxuICAgIFdhcm5pbmcgPSAnbG9nV2FybmluZycsXHJcbiAgICBJbmZvICAgID0gJ2xvZ0luZm8nLFxyXG4gICAgTm9uZSAgICA9ICdsb2dOb25lJ1xyXG59XHJcblxyXG4vKipcclxuICogQ29uc29sZSBsb2dnaW5nXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbnNvbGVMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXJ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSBnZW5lcmFsIG1lc3NhZ2UgYW5kIGFkZCB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VDbGFzcyBNZXNzYWdlIGNsYXNzLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlRW50cnkgKG1lc3NhZ2UgOiBzdHJpbmcsIG1lc3NhZ2VDbGFzcyA6IE1lc3NhZ2VDbGFzcykgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJlZml4ID0gJ01vZGVsUmVsaWVmOiAnO1xyXG4gICAgICAgIGxldCBsb2dNZXNzYWdlID0gYCR7cHJlZml4fSR7bWVzc2FnZX1gO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VDbGFzcykge1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuRXJyb3I6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5XYXJuaW5nOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5JbmZvOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5Ob25lOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobG9nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIGVycm9yTWVzc2FnZSBFcnJvciBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEVycm9yTWVzc2FnZSAoZXJyb3JNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KGVycm9yTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHdhcm5pbmcgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIHdhcm5pbmdNZXNzYWdlIFdhcm5pbmcgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkod2FybmluZ01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5XYXJuaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBpbmZvTWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeShpbmZvTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIHN0eWxlIE9wdGlvbmFsIHN0eWxlLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlIChtZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkobWVzc2FnZSwgTWVzc2FnZUNsYXNzLk5vbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBlbXB0eSBsaW5lXHJcbiAgICAgKi9cclxuICAgIGFkZEVtcHR5TGluZSAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBsb2cgb3V0cHV0XHJcbiAgICAgKi9cclxuICAgIGNsZWFyTG9nICgpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5jbGVhcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEhUTUwgbG9nZ2luZ1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBIVE1MTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2Vye1xyXG5cclxuICAgIHJvb3RJZCAgICAgICAgICAgOiBzdHJpbmc7XHJcbiAgICByb290RWxlbWVudFRhZyAgIDogc3RyaW5nO1xyXG4gICAgcm9vdEVsZW1lbnQgICAgICA6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIG1lc3NhZ2VUYWcgICAgICAgOiBzdHJpbmc7XHJcbiAgICBiYXNlTWVzc2FnZUNsYXNzIDogc3RyaW5nXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yb290SWQgICAgICAgICA9ICdsb2dnZXJSb290J1xyXG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnRUYWcgPSAndWwnO1xyXG5cclxuICAgICAgICB0aGlzLm1lc3NhZ2VUYWcgICAgICAgPSAnbGknO1xyXG4gICAgICAgIHRoaXMuYmFzZU1lc3NhZ2VDbGFzcyA9ICdsb2dNZXNzYWdlJztcclxuXHJcbiAgICAgICAgdGhpcy5yb290RWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7dGhpcy5yb290SWR9YCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3RFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnJvb3RFbGVtZW50VGFnKTtcclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudC5pZCA9IHRoaXMucm9vdElkO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0IGEgZ2VuZXJhbCBtZXNzYWdlIGFuZCBhcHBlbmQgdG8gdGhlIGxvZyByb290LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VDbGFzcyBDU1MgY2xhc3MgdG8gYmUgYWRkZWQgdG8gbWVzc2FnZS5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZUVsZW1lbnQgKG1lc3NhZ2UgOiBzdHJpbmcsIG1lc3NhZ2VDbGFzcz8gOiBzdHJpbmcpIDogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBtZXNzYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5tZXNzYWdlVGFnKTtcclxuICAgICAgICBtZXNzYWdlRWxlbWVudC50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VFbGVtZW50LmNsYXNzTmFtZSAgID0gYCR7dGhpcy5iYXNlTWVzc2FnZUNsYXNzfSAke21lc3NhZ2VDbGFzcyA/IG1lc3NhZ2VDbGFzcyA6ICcnfWA7O1xyXG5cclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2VFbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2UgRXJyb3IgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KGVycm9yTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHdhcm5pbmcgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIHdhcm5pbmdNZXNzYWdlIFdhcm5pbmcgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRWxlbWVudCh3YXJuaW5nTWVzc2FnZSwgTWVzc2FnZUNsYXNzLldhcm5pbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGluZm9ybWF0aW9uYWwgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIGluZm9NZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkSW5mb01lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQoaW5mb01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5JbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBzdHlsZSBPcHRpb25hbCBDU1Mgc3R5bGUuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2UgKG1lc3NhZ2UgOiBzdHJpbmcsIHN0eWxlPyA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZUVsZW1lbnQgPSB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KG1lc3NhZ2UpO1xyXG4gICAgICAgIGlmIChzdHlsZSlcclxuICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBlbXB0eSBsaW5lXHJcbiAgICAgKi9cclxuICAgIGFkZEVtcHR5TGluZSAoKSB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxNDA1NDcvbGluZS1icmVhay1pbnNpZGUtYS1saXN0LWl0ZW0tZ2VuZXJhdGVzLXNwYWNlLWJldHdlZW4tdGhlLWxpbmVzXHJcbi8vICAgICAgdGhpcy5hZGRNZXNzYWdlKCc8YnIvPjxici8+Jyk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2UoJy4nKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBsb2cgb3V0cHV0XHJcbiAgICAgKi9cclxuICAgIGNsZWFyTG9nICgpIHtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzk1NTIyOS9yZW1vdmUtYWxsLWNoaWxkLWVsZW1lbnRzLW9mLWEtZG9tLW5vZGUtaW4tamF2YXNjcmlwdFxyXG4gICAgICAgIHdoaWxlICh0aGlzLnJvb3RFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnJvb3RFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXIsIEhUTUxMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbiAgICAgICAgIFxyXG4vKipcclxuICogU2VydmljZXNcclxuICogR2VuZXJhbCBydW50aW1lIHN1cHBvcnRcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZXMge1xyXG5cclxuICAgIHN0YXRpYyBjb25zb2xlTG9nZ2VyIDogQ29uc29sZUxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKCk7XHJcbiAgICBzdGF0aWMgaHRtbExvZ2dlciAgICA6IEhUTUxMb2dnZXIgICAgPSBuZXcgSFRNTExvZ2dlcigpO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNb2RlbFJlbGllZn0gICAgICAgICAgICBmcm9tICdNb2RlbFJlbGllZidcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuXHJcbi8qKlxyXG4gKiAgR2VuZXJhbCBUSFJFRS5qcy9XZWJHTCBzdXBwb3J0IHJvdXRpbmVzXHJcbiAqICBHcmFwaGljcyBMaWJyYXJ5XHJcbiAqICBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHcmFwaGljcyB7XHJcblxyXG4gICAgc3RhdGljIEJvdW5kaW5nQm94TmFtZSAgICAgOiBzdHJpbmcgPSAnQm91bmRpbmcgQm94JztcclxuICAgIHN0YXRpYyBCb3hOYW1lICAgICAgICAgICAgIDogc3RyaW5nID0gJ0JveCc7XHJcbiAgICBzdGF0aWMgUGxhbmVOYW1lICAgICAgICAgICA6IHN0cmluZyA9ICdQbGFuZSc7XHJcbiAgICBzdGF0aWMgU3BoZXJlTmFtZSAgICAgICAgICA6IHN0cmluZyA9ICdTcGhlcmUnO1xyXG4gICAgc3RhdGljIFRyaWFkTmFtZSAgICAgICAgICAgOiBzdHJpbmcgPSAnVHJpYWQnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEdlb21ldHJ5XHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdEdlb21ldHJ5XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFuIG9iamVjdCBhbmQgYWxsIGNoaWxkcmVuIGZyb20gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSBzY2VuZSBTY2VuZSBob2xkaW5nIG9iamVjdCB0byBiZSByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIHJvb3RPYmplY3QgUGFyZW50IG9iamVjdCAocG9zc2libHkgd2l0aCBjaGlsZHJlbikuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW1vdmVPYmplY3RDaGlsZHJlbihyb290T2JqZWN0IDogVEhSRUUuT2JqZWN0M0QsIHJlbW92ZVJvb3QgOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIGlmICghcm9vdE9iamVjdClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgbG9nZ2VyICA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgbGV0IHJlbW92ZXIgPSBmdW5jdGlvbiAob2JqZWN0M2QpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChvYmplY3QzZCA9PT0gcm9vdE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UgKCdSZW1vdmluZzogJyArIG9iamVjdDNkLm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ2dlb21ldHJ5JykpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDNkLmdlb21ldHJ5LmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCdtYXRlcmlhbCcpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gb2JqZWN0M2QubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWwuaGFzT3duUHJvcGVydHkoJ21hdGVyaWFscycpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbHMgPSBtYXRlcmlhbC5tYXRlcmlhbHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaU1hdGVyaWFsIGluIG1hdGVyaWFscykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWxzLmhhc093blByb3BlcnR5KGlNYXRlcmlhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsc1tpTWF0ZXJpYWxdLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ3RleHR1cmUnKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0M2QudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByb290T2JqZWN0LnRyYXZlcnNlKHJlbW92ZXIpO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgcm9vdCBjaGlsZHJlbiBmcm9tIHJvb3QgKGJhY2t3YXJkcyEpXHJcbiAgICAgICAgZm9yIChsZXQgaUNoaWxkIDogbnVtYmVyID0gKHJvb3RPYmplY3QuY2hpbGRyZW4ubGVuZ3RoIC0gMSk7IGlDaGlsZCA+PSAwOyBpQ2hpbGQtLSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNoaWxkIDogVEhSRUUuT2JqZWN0M0QgPSByb290T2JqZWN0LmNoaWxkcmVuW2lDaGlsZF07XHJcbiAgICAgICAgICAgIHJvb3RPYmplY3QucmVtb3ZlIChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVtb3ZlUm9vdCAmJiByb290T2JqZWN0LnBhcmVudClcclxuICAgICAgICAgICAgcm9vdE9iamVjdC5wYXJlbnQucmVtb3ZlKHJvb3RPYmplY3QpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENsb25lIGFuZCB0cmFuc2Zvcm0gYW4gb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIG9iamVjdCBPYmplY3QgdG8gY2xvbmUgYW5kIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSBtYXRyaXggVHJhbnNmb3JtYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QgKG9iamVjdCA6IFRIUkVFLk9iamVjdDNELCBtYXRyaXggOiBUSFJFRS5NYXRyaXg0KSA6IFRIUkVFLk9iamVjdDNEIHtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgb2JqZWN0IChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBvYmplY3RDbG9uZSA6IFRIUkVFLk9iamVjdDNEID0gb2JqZWN0LmNsb25lKCk7XHJcbiAgICAgICAgb2JqZWN0Q2xvbmUudHJhdmVyc2Uob2JqZWN0ID0+IHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mKFRIUkVFLk1lc2gpKVxyXG4gICAgICAgICAgICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5LmNsb25lKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE4uQi4gSW1wb3J0YW50ISBUaGUgcG9zdGlvbiwgcm90YXRpb24gKHF1YXRlcm5pb24pIGFuZCBzY2FsZSBhcmUgY29ycmVjeSBidXQgdGhlIG1hdHJpeCBoYXMgbm90IGJlZW4gdXBkYXRlZC5cclxuICAgICAgICAvLyBUSFJFRS5qcyB1cGRhdGVzIHRoZSBtYXRyaXggaXMgdXBkYXRlZCBpbiB0aGUgcmVuZGVyKCkgbG9vcC5cclxuICAgICAgICBvYmplY3RDbG9uZS51cGRhdGVNYXRyaXgoKTsgICAgIFxyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm1cclxuICAgICAgICBvYmplY3RDbG9uZS5hcHBseU1hdHJpeChtYXRyaXgpO1xyXG5cclxuICAgICAgICByZXR1cm4gb2JqZWN0Q2xvbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHBhcmFtIG1lc2ggTWVzaCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3VuZGluZyBib3guXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwgb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEAgcmV0dXJucyBNZXNoIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tR2VvbWV0cnkocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBnZW9tZXRyeSA6IFRIUkVFLkdlb21ldHJ5LCBtYXRlcmlhbCA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2h7XHJcblxyXG4gICAgICAgIHZhciBib3VuZGluZ0JveCAgICAgOiBUSFJFRS5Cb3gzLFxyXG4gICAgICAgICAgICB3aWR0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGVwdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBib3hNZXNoICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGdlb21ldHJ5LmJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3ggKHBvc2l0aW9uLCBib3VuZGluZ0JveCwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94TWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiBib3guXHJcbiAgICAgKiBAcGFyYW0gYm94IEdlb21ldHJ5IEJveCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbCBvZiB0aGUgYm94LlxyXG4gICAgICogQCByZXR1cm5zIE1lc2ggb2YgdGhlIGJveC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGJvdW5kaW5nQm94IDogVEhSRUUuQm94MywgbWF0ZXJpYWwgOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBkZXB0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGJveE1lc2ggICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIHdpZHRoICA9IGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLng7XHJcbiAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdCb3gubWF4LnkgLSBib3VuZGluZ0JveC5taW4ueTtcclxuICAgICAgICBkZXB0aCAgPSBib3VuZGluZ0JveC5tYXgueiAtIGJvdW5kaW5nQm94Lm1pbi56O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3hNZXNoIChwb3NpdGlvbiwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG1hdGVyaWFsKTtcclxuICAgICAgICBib3hNZXNoLm5hbWUgPSBHcmFwaGljcy5Cb3VuZGluZ0JveE5hbWU7XHJcblxyXG4gICAgICAgIHJldHVybiBib3hNZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgZXh0ZW5kcyBvZiBhbiBvYmplY3Qgb3B0aW9uYWxseSBpbmNsdWRpbmcgYWxsIGNoaWxkcmVuLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KHJvb3RPYmplY3QgOiBUSFJFRS5PYmplY3QzRCkgOiBUSFJFRS5Cb3gzIHtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTU0OTI4NTcvYW55LXdheS10by1nZXQtYS1ib3VuZGluZy1ib3gtZnJvbS1hLXRocmVlLWpzLW9iamVjdDNkXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94IDogVEhSRUUuQm94MyA9IG5ldyBUSFJFRS5Cb3gzKCk7XHJcbiAgICAgICAgYm91bmRpbmdCb3ggPSBib3VuZGluZ0JveC5zZXRGcm9tT2JqZWN0KHJvb3RPYmplY3QpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGJveCBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIHRoZSBib3guXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGguXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodC5cclxuICAgICAqIEBwYXJhbSBkZXB0aCBEZXB0aC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBPcHRpb25hbCBtYXRlcmlhbC5cclxuICAgICAqIEByZXR1cm5zIEJveCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlQm94TWVzaChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOiBudW1iZXIsIGRlcHRoIDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBib3hHZW9tZXRyeSAgOiBUSFJFRS5Cb3hHZW9tZXRyeSxcclxuICAgICAgICAgICAgYm94TWF0ZXJpYWwgIDogVEhSRUUuTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIGJveCAgICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIGJveEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHdpZHRoLCBoZWlnaHQsIGRlcHRoKTtcclxuICAgICAgICBib3hHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgYm94TWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMGZmLCBvcGFjaXR5OiAxLjB9ICk7XHJcblxyXG4gICAgICAgIGJveCA9IG5ldyBUSFJFRS5NZXNoKCBib3hHZW9tZXRyeSwgYm94TWF0ZXJpYWwpO1xyXG4gICAgICAgIGJveC5uYW1lID0gR3JhcGhpY3MuQm94TmFtZTtcclxuICAgICAgICBib3gucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBib3g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgcGxhbmUgbWVzaC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiB0aGUgcGxhbmUuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGguXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBPcHRpb25hbCBtYXRlcmlhbC5cclxuICAgICAqIEByZXR1cm5zIFBsYW5lIG1lc2guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVQbGFuZU1lc2gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCB3aWR0aCA6IG51bWJlciwgaGVpZ2h0IDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgXHJcbiAgICAgICAgICAgIHBsYW5lR2VvbWV0cnkgIDogVEhSRUUuUGxhbmVHZW9tZXRyeSxcclxuICAgICAgICAgICAgcGxhbmVNYXRlcmlhbCAgOiBUSFJFRS5NYXRlcmlhbCxcclxuICAgICAgICAgICAgcGxhbmUgICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkod2lkdGgsIGhlaWdodCk7ICAgICAgIFxyXG4gICAgICAgIHBsYW5lTWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMGZmLCBvcGFjaXR5OiAxLjB9ICk7XHJcblxyXG4gICAgICAgIHBsYW5lID0gbmV3IFRIUkVFLk1lc2gocGxhbmVHZW9tZXRyeSwgcGxhbmVNYXRlcmlhbCk7XHJcbiAgICAgICAgcGxhbmUubmFtZSA9IEdyYXBoaWNzLlBsYW5lTmFtZTtcclxuICAgICAgICBwbGFuZS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBsYW5lO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgc3BoZXJlIG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gT3JpZ2luIG9mIHRoZSBzcGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gcmFkaXVzIFJhZGl1cy5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVNwaGVyZU1lc2gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCByYWRpdXMgOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIHZhciBzcGhlcmVHZW9tZXRyeSAgOiBUSFJFRS5TcGhlcmVHZW9tZXRyeSxcclxuICAgICAgICAgICAgc2VnbWVudENvdW50ICAgIDogbnVtYmVyID0gMzIsXHJcbiAgICAgICAgICAgIHNwaGVyZU1hdGVyaWFsICA6IFRIUkVFLk1hdGVyaWFsLFxyXG4gICAgICAgICAgICBzcGhlcmUgICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBzcGhlcmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShyYWRpdXMsIHNlZ21lbnRDb3VudCwgc2VnbWVudENvdW50KTtcclxuICAgICAgICBzcGhlcmVHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgc3BoZXJlTWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgc3BoZXJlID0gbmV3IFRIUkVFLk1lc2goIHNwaGVyZUdlb21ldHJ5LCBzcGhlcmVNYXRlcmlhbCApO1xyXG4gICAgICAgIHNwaGVyZS5uYW1lID0gR3JhcGhpY3MuU3BoZXJlTmFtZTtcclxuICAgICAgICBzcGhlcmUucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBzcGhlcmU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGxpbmUgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0YXJ0UG9zaXRpb24gU3RhcnQgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0gZW5kUG9zaXRpb24gRW5kIHBvaW50LlxyXG4gICAgICogQHBhcmFtIGNvbG9yIENvbG9yLlxyXG4gICAgICogQHJldHVybnMgTGluZSBlbGVtZW50LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlTGluZShzdGFydFBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgZW5kUG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBjb2xvciA6IG51bWJlcikgOiBUSFJFRS5MaW5lIHtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgICAgICAgICAgICA6IFRIUkVFLkxpbmUsXHJcbiAgICAgICAgICAgIGxpbmVHZW9tZXRyeSAgICA6IFRIUkVFLkdlb21ldHJ5LFxyXG4gICAgICAgICAgICBtYXRlcmlhbCAgICAgICAgOiBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbGluZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICAgICAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2ggKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IGNvbG9yfSApO1xyXG4gICAgICAgIGxpbmUgPSBuZXcgVEhSRUUuTGluZShsaW5lR2VvbWV0cnksIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXhlcyB0cmlhZC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBPcmlnaW4gb2YgdGhlIHRyaWFkLlxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBMZW5ndGggb2YgdGhlIGNvb3JkaW5hdGUgYXJyb3cuXHJcbiAgICAgKiBAcGFyYW0gaGVhZExlbmd0aCBMZW5ndGggb2YgdGhlIGFycm93IGhlYWQuXHJcbiAgICAgKiBAcGFyYW0gaGVhZFdpZHRoIFdpZHRoIG9mIHRoZSBhcnJvdyBoZWFkLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlV29ybGRBeGVzVHJpYWQocG9zaXRpb24/IDogVEhSRUUuVmVjdG9yMywgbGVuZ3RoPyA6IG51bWJlciwgaGVhZExlbmd0aD8gOiBudW1iZXIsIGhlYWRXaWR0aD8gOiBudW1iZXIpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgdHJpYWRHcm91cCAgICAgIDogVEhSRUUuT2JqZWN0M0QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKSxcclxuICAgICAgICAgICAgYXJyb3dQb3NpdGlvbiAgIDogVEhSRUUuVmVjdG9yMyAgPSBwb3NpdGlvbiB8fG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgICAgICAgIGFycm93TGVuZ3RoICAgICA6IG51bWJlciA9IGxlbmd0aCAgICAgfHwgMTUsXHJcbiAgICAgICAgICAgIGFycm93SGVhZExlbmd0aCA6IG51bWJlciA9IGhlYWRMZW5ndGggfHwgMSxcclxuICAgICAgICAgICAgYXJyb3dIZWFkV2lkdGggIDogbnVtYmVyID0gaGVhZFdpZHRoICB8fCAxO1xyXG5cclxuICAgICAgICB0cmlhZEdyb3VwLmFkZChuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMCksIGFycm93UG9zaXRpb24sIGFycm93TGVuZ3RoLCAweGZmMDAwMCwgYXJyb3dIZWFkTGVuZ3RoLCBhcnJvd0hlYWRXaWR0aCkpO1xyXG4gICAgICAgIHRyaWFkR3JvdXAuYWRkKG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgYXJyb3dQb3NpdGlvbiwgYXJyb3dMZW5ndGgsIDB4MDBmZjAwLCBhcnJvd0hlYWRMZW5ndGgsIGFycm93SGVhZFdpZHRoKSk7XHJcbiAgICAgICAgdHJpYWRHcm91cC5hZGQobmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBhcnJvd1Bvc2l0aW9uLCBhcnJvd0xlbmd0aCwgMHgwMDAwZmYsIGFycm93SGVhZExlbmd0aCwgYXJyb3dIZWFkV2lkdGgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyaWFkR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGF4ZXMgZ3JpZC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAgT3JpZ2luIG9mIHRoZSBheGVzIGdyaWQuXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSBTaXplIG9mIHRoZSBncmlkLlxyXG4gICAgICogQHBhcmFtIHN0ZXAgR3JpZCBsaW5lIGludGVydmFscy5cclxuICAgICAqIEByZXR1cm5zIEdyaWQgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlV29ybGRBeGVzR3JpZChwb3NpdGlvbj8gOiBUSFJFRS5WZWN0b3IzLCBzaXplPyA6IG51bWJlciwgc3RlcD8gOiBudW1iZXIpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgZ3JpZEdyb3VwICAgICAgIDogVEhSRUUuT2JqZWN0M0QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKSxcclxuICAgICAgICAgICAgZ3JpZFBvc2l0aW9uICAgIDogVEhSRUUuVmVjdG9yMyAgPSBwb3NpdGlvbiB8fG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgICAgICAgIGdyaWRTaXplICAgICAgICA6IG51bWJlciA9IHNpemUgfHwgMTAsXHJcbiAgICAgICAgICAgIGdyaWRTdGVwICAgICAgICA6IG51bWJlciA9IHN0ZXAgfHwgMSxcclxuICAgICAgICAgICAgY29sb3JDZW50ZXJsaW5lIDogbnVtYmVyID0gIDB4ZmYwMDAwMDAsXHJcbiAgICAgICAgICAgIHh5R3JpZCAgICAgICAgICAgOiBUSFJFRS5HcmlkSGVscGVyLFxyXG4gICAgICAgICAgICB5ekdyaWQgICAgICAgICAgIDogVEhSRUUuR3JpZEhlbHBlcixcclxuICAgICAgICAgICAgenhHcmlkICAgICAgICAgICA6IFRIUkVFLkdyaWRIZWxwZXI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHh5R3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKGdyaWRTaXplLCBncmlkU3RlcCk7XHJcbiAgICAgICAgeHlHcmlkLnNldENvbG9ycyhjb2xvckNlbnRlcmxpbmUsIDB4ZmYwMDAwKTtcclxuICAgICAgICB4eUdyaWQucG9zaXRpb24uY29weShncmlkUG9zaXRpb24uY2xvbmUoKSk7XHJcbiAgICAgICAgeHlHcmlkLnJvdGF0ZU9uQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSwgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi54ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi55ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIGdyaWRHcm91cC5hZGQoeHlHcmlkKTtcclxuXHJcbiAgICAgICAgeXpHcmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoZ3JpZFNpemUsIGdyaWRTdGVwKTtcclxuICAgICAgICB5ekdyaWQuc2V0Q29sb3JzKGNvbG9yQ2VudGVybGluZSwgMHgwMGZmMDApO1xyXG4gICAgICAgIHl6R3JpZC5wb3NpdGlvbi5jb3B5KGdyaWRQb3NpdGlvbi5jbG9uZSgpKTtcclxuICAgICAgICB5ekdyaWQucm90YXRlT25BeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLnkgKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLnogKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgZ3JpZEdyb3VwLmFkZCh5ekdyaWQpO1xyXG5cclxuICAgICAgICB6eEdyaWQgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcihncmlkU2l6ZSwgZ3JpZFN0ZXApO1xyXG4gICAgICAgIHp4R3JpZC5zZXRDb2xvcnMoY29sb3JDZW50ZXJsaW5lLCAweDAwMDBmZik7XHJcbiAgICAgICAgenhHcmlkLnBvc2l0aW9uLmNvcHkoZ3JpZFBvc2l0aW9uLmNsb25lKCkpO1xyXG4gICAgICAgIHp4R3JpZC5yb3RhdGVPbkF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24ueiArPSBncmlkU2l6ZTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24ueCArPSBncmlkU2l6ZTtcclxuICAgICAgICBncmlkR3JvdXAuYWRkKHp4R3JpZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBncmlkR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIEFkZHMgYSBjYW1lcmEgaGVscGVyIHRvIGEgc2NlbmUgdG8gdmlzdWFsaXplIHRoZSBjYW1lcmEgcG9zaXRpb24uXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhIHRvIGNvbnN0cnVjdCBoZWxwZXIgKG1heSBiZSBudWxsKS5cclxuICAgICAgKi9cclxuICAgIHN0YXRpYyBhZGRDYW1lcmFIZWxwZXIgKHNjZW5lIDogVEhSRUUuU2NlbmUsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiB2b2lke1xyXG5cclxuICAgICAgICBpZiAoY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIGxldCBjYW1lcmFIZWxwZXIgPSBuZXcgVEhSRUUuQ2FtZXJhSGVscGVyKGNhbWVyYSApO1xyXG4gICAgICAgICAgICBjYW1lcmFIZWxwZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHNjZW5lLmFkZChjYW1lcmFIZWxwZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQWRkcyBhIGNvb3JkaW5hdGUgYXhpcyBoZWxwZXIgdG8gYSBzY2VuZSB0byB2aXN1YWxpemUgdGhlIHdvcmxkIGF4ZXMuXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqL1xyXG4gICAgc3RhdGljIGFkZEF4aXNIZWxwZXIgKHNjZW5lIDogVEhSRUUuU2NlbmUsIHNpemUgOiBudW1iZXIpIDogdm9pZHtcclxuXHJcbiAgICAgICAgbGV0IGF4aXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhpc0hlbHBlcihzaXplKTtcclxuICAgICAgICBheGlzSGVscGVyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHNjZW5lLmFkZChheGlzSGVscGVyKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gQ29vcmRpbmF0ZSBDb252ZXJzaW9uXHJcbiAgICAvKlxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIENvb3JkaW5hdGUgU3lzdGVtc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgRlJBTUVcdCAgICAgICAgICAgIEVYQU1QTEVcdFx0XHRcdFx0XHRcdFx0XHRcdFNQQUNFICAgICAgICAgICAgICAgICAgICAgIFVOSVRTICAgICAgICAgICAgICAgICAgICAgICBOT1RFU1xyXG5cclxuICAgIE1vZGVsICAgICAgICAgICAgICAgQ2F0YWxvZyBXZWJHTDogTW9kZWwsIEJhbmRFbGVtZW50IEJsb2NrICAgICBvYmplY3QgICAgICAgICAgICAgICAgICAgICAgbW0gICAgICAgICAgICAgICAgICAgICAgICAgIFJoaW5vIGRlZmluaXRpb25zXHJcbiAgICBXb3JsZCAgICAgICAgICAgICAgIERlc2lnbiBNb2RlbFx0XHRcdFx0XHRcdFx0XHR3b3JsZCAgICAgICAgICAgICAgICAgICAgICAgbW0gXHJcbiAgICBWaWV3ICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldyAgICAgICAgICAgICAgICAgICAgICAgIG1tXHJcbiAgICBEZXZpY2UgICAgICAgICAgICAgIE5vcm1hbGl6ZWQgdmlld1x0XHRcdFx0XHRcdFx0ICAgIGRldmljZSAgICAgICAgICAgICAgICAgICAgICBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgIFNjcmVlbi5QYWdlICAgICAgICAgSFRNTCBwYWdlXHRcdFx0XHRcdFx0XHRcdFx0c2NyZWVuICAgICAgICAgICAgICAgICAgICAgIHB4ICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAgYXQgVG9wIExlZnQsICtZIGRvd24gICAgSFRNTCBwYWdlXHJcbiAgICBTY3JlZW4uQ2xpZW50ICAgICAgIEJyb3dzZXIgdmlldyBwb3J0IFx0XHRcdFx0XHRcdCAgICBzY3JlZW4gICAgICAgICAgICAgICAgICAgICAgcHggICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCBhdCBUb3AgTGVmdCwgK1kgZG93biAgICBicm93c2VyIHdpbmRvd1xyXG4gICAgU2NyZWVuLkNvbnRhaW5lciAgICBET00gY29udGFpbmVyXHRcdFx0XHRcdFx0XHRcdHNjcmVlbiAgICAgICAgICAgICAgICAgICAgICBweCAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwIGF0IFRvcCBMZWZ0LCArWSBkb3duICAgIEhUTUwgY2FudmFzXHJcblxyXG4gICAgTW91c2UgRXZlbnQgUHJvcGVydGllc1xyXG4gICAgaHR0cDovL3d3dy5qYWNrbG1vb3JlLmNvbS9ub3Rlcy9tb3VzZS1wb3NpdGlvbi9cclxuICAgICovXHJcbiAgICAgICAgXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFdvcmxkIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHdvcmxkQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMyB7XHJcblxyXG4gICAgICAgIHZhciB3b3JsZENvb3JkaW5hdGVzICAgIDogVEhSRUUuVmVjdG9yMyxcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMyRCA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBkZXZpY2VaICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gdGhpcy5kZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICBkZXZpY2VaID0gKGNhbWVyYSBpbnN0YW5jZW9mIFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSA/IDAuNSA6IDEuMDtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEID0gbmV3IFRIUkVFLlZlY3RvcjMoZGV2aWNlQ29vcmRpbmF0ZXMyRC54LCBkZXZpY2VDb29yZGluYXRlczJELnksIGRldmljZVopO1xyXG5cclxuICAgICAgICB3b3JsZENvb3JkaW5hdGVzID0gZGV2aWNlQ29vcmRpbmF0ZXMzRC51bnByb2plY3QoY2FtZXJhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHdvcmxkQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRWaWV3IENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB3b3JsZCBjb29yZGluYXRlcyB0byB2aWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciBXb3JsZCBjb29yZGluYXRlIHZlY3RvciB0byBjb252ZXJ0LlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdmlld0Nvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IzIHtcclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLCAgXHJcbiAgICAgICAgICAgIHZpZXdDb29yZGluYXRlcyAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgdmlld0Nvb3JkaW5hdGVzID0gcG9zaXRpb24uYXBwbHlNYXRyaXg0KGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlld0Nvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0RGV2aWNlIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIG5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEByZXR1cm5zIE5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5KSA6IFRIUkVFLlZlY3RvcjIge1xyXG5cclxuICAgICAgICB2YXIgZGV2aWNlQ29vcmRpbmF0ZXMgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgcmF0aW9YLCAgcmF0aW9ZICAgICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGV2aWNlWCwgZGV2aWNlWSAgICAgICAgICAgICA6IG51bWJlcjtcclxuXHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgPSB0aGlzLnNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgcmF0aW9YID0gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueCAvIGNvbnRhaW5lci53aWR0aCgpO1xyXG4gICAgICAgIHJhdGlvWSA9IHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnkgLyBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGRldmljZVggPSArKChyYXRpb1ggKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZVkgPSAtKChyYXRpb1kgKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlWCwgZGV2aWNlWSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXZpY2VDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIGRldmljZSBjb29yZGluYXRlcyBbLTEsIDFdLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciAgV29ybGQgY29vcmRpbmF0ZXMgdmVjdG9yLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcHJldHVybnMgRGV2aWNlIGNvb3JpbmRhdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2lzc3Vlcy83OFxyXG4gICAgICAgIHZhciBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICA6IFRIUkVFLlZlY3RvcjMgPSB2ZWN0b3IuY2xvbmUoKSwgIFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgICAgICAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCA9IHBvc2l0aW9uLnByb2plY3QoY2FtZXJhKTtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlQ29vcmRpbmF0ZXMzRC54LCBkZXZpY2VDb29yZGluYXRlczNELnkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGV2aWNlQ29vcmRpbmF0ZXMyRDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFNjcmVlbiBDb29yZGluYXRlc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLyoqXHJcbiAgICAgKiBQYWdlIGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIChwYWdlKSBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlblBhZ2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlblBhZ2VDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cclxuICAgICAgICBzY3JlZW5QYWdlQ29vcmRpbmF0ZXMueCA9IGV2ZW50LnBhZ2VYO1xyXG4gICAgICAgIHNjcmVlblBhZ2VDb29yZGluYXRlcy55ID0gZXZlbnQucGFnZVk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5QYWdlQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2xpZW50IGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSA8YnJvd3Nlcj4gdmlldyBwb3J0LiBJZiB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gc2Nyb2xsZWQgaXQgd2lsbFxyXG4gICAgICogYmUgZGlmZmVyZW50IHRoYW4gdGhlIHBhZ2UgY29vcmRpbmF0ZXMgd2hpY2ggYXJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGUgdG9wIGxlZnQgb2YgdGhlIDxlbnRpcmU+IEhUTUwgcGFnZSBkb2N1bWVudC5cclxuICAgICAqIGh0dHA6Ly93d3cuYmVubmFkZWwuY29tL2Jsb2cvMTg2OS1qcXVlcnktbW91c2UtZXZlbnRzLXBhZ2V4LXktdnMtY2xpZW50eC15Lmh0bVxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiBjbGllbnQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5DbGllbnRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnkgPSBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBKUXVlcnkgZXZlbnQgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnkpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXHJcbiAgICAgICAgICAgIGNvbnRhaW5lck9mZnNldCAgICAgICAgICAgIDogSlF1ZXJ5Q29vcmRpbmF0ZXMsXHJcbiAgICAgICAgICAgIHBhZ2VYLCBwYWdlWSAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBjb250YWluZXJPZmZzZXQgPSBjb250YWluZXIub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEpRdWVyeSBkb2VzIG5vdCBzZXQgcGFnZVgvcGFnZVkgZm9yIERyb3AgZXZlbnRzLiBUaGV5IGFyZSBkZWZpbmVkIGluIHRoZSBvcmlnaW5hbEV2ZW50IG1lbWJlci5cclxuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYIHx8ICg8YW55PihldmVudC5vcmlnaW5hbEV2ZW50KSkucGFnZVg7XHJcbiAgICAgICAgcGFnZVkgPSBldmVudC5wYWdlWSB8fCAoPGFueT4oZXZlbnQub3JpZ2luYWxFdmVudCkpLnBhZ2VZO1xyXG5cclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy54ID0gcGFnZVggLSBjb250YWluZXJPZmZzZXQubGVmdDtcclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy55ID0gcGFnZVkgLSBjb250YWluZXJPZmZzZXQudG9wO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yIFdvcmxkIHZlY3Rvci5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvaXNzdWVzLzc4XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlcyAgICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgbGVmdCAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIHRvcCAgICAgICAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICAvLyBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlcyA9IHRoaXMuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyhwb3NpdGlvbiwgY2FtZXJhKTtcclxuICAgICAgICBsZWZ0ID0gKCgrZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMikgKiBjb250YWluZXIud2lkdGgoKTtcclxuICAgICAgICB0b3AgID0gKCgtZGV2aWNlQ29vcmRpbmF0ZXMueSArIDEpIC8gMikgKiBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIobGVmdCwgdG9wKTtcclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEludGVyc2VjdGlvbnNcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vICBJbnRlcnNlY3Rpb25zXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBSYXljYXN0ZXIgdGhyb3VnaCB0aGUgbW91c2Ugd29ybGQgcG9zaXRpb24uXHJcbiAgICAgKiBAcGFyYW0gbW91c2VXb3JsZCBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgVEhSRUUuUmF5Y2FzdGVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmF5Y2FzdGVyRnJvbU1vdXNlIChtb3VzZVdvcmxkIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlJheWNhc3RlcntcclxuXHJcbiAgICAgICAgdmFyIHJheU9yaWdpbiAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMgKG1vdXNlV29ybGQueCwgbW91c2VXb3JsZC55LCBjYW1lcmEucG9zaXRpb24ueiksXHJcbiAgICAgICAgICAgIHdvcmxkUG9pbnQgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMobW91c2VXb3JsZC54LCBtb3VzZVdvcmxkLnksIG1vdXNlV29ybGQueik7XHJcblxyXG4gICAgICAgICAgICAvLyBUb29scy5jb25zb2xlTG9nKCdXb3JsZCBtb3VzZSBjb29yZGluYXRlczogJyArIHdvcmxkUG9pbnQueCArICcsICcgKyB3b3JsZFBvaW50LnkpO1xyXG5cclxuICAgICAgICAvLyBjb25zdHJ1Y3QgcmF5IGZyb20gY2FtZXJhIHRvIG1vdXNlIHdvcmxkXHJcbiAgICAgICAgdmFyIHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIgKHJheU9yaWdpbiwgd29ybGRQb2ludC5zdWIgKHJheU9yaWdpbikubm9ybWFsaXplKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF5Y2FzdGVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBJbnRlcnNlY3Rpb24gbG9jYXRlZCBieSB0aGUgY3Vyc29yLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHBhcmFtIHNjZW5lT2JqZWN0cyBBcnJheSBvZiBzY2VuZSBvYmplY3RzLlxyXG4gICAgICogQHBhcmFtIHJlY3Vyc2UgUmVjdXJzZSB0aHJvdWdoIG9iamVjdHMuXHJcbiAgICAgKiBAcmV0dXJucyBGaXJzdCBpbnRlcnNlY3Rpb24gd2l0aCBzY3JlZW4gb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEZpcnN0SW50ZXJzZWN0aW9uKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhLCBzY2VuZU9iamVjdHMgOiBUSFJFRS5PYmplY3QzRFtdLCByZWN1cnNlIDogYm9vbGVhbikgOiBUSFJFRS5JbnRlcnNlY3Rpb24ge1xyXG5cclxuICAgICAgICB2YXIgcmF5Y2FzdGVyICAgICAgICAgIDogVEhSRUUuUmF5Y2FzdGVyLFxyXG4gICAgICAgICAgICBtb3VzZVdvcmxkICAgICAgICAgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBpSW50ZXJzZWN0aW9uICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGludGVyc2VjdGlvbiAgICAgICA6IFRIUkVFLkludGVyc2VjdGlvbjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnN0cnVjdCByYXkgZnJvbSBjYW1lcmEgdG8gbW91c2Ugd29ybGRcclxuICAgICAgICBtb3VzZVdvcmxkID0gR3JhcGhpY3Mud29ybGRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIsIGNhbWVyYSk7XHJcbiAgICAgICAgcmF5Y2FzdGVyICA9IEdyYXBoaWNzLnJheWNhc3RlckZyb21Nb3VzZSAobW91c2VXb3JsZCwgY2FtZXJhKTtcclxuXHJcbiAgICAgICAgLy8gZmluZCBhbGwgb2JqZWN0IGludGVyc2VjdGlvbnNcclxuICAgICAgICB2YXIgaW50ZXJzZWN0cyA6IFRIUkVFLkludGVyc2VjdGlvbltdID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMgKHNjZW5lT2JqZWN0cywgcmVjdXJzZSk7XHJcblxyXG4gICAgICAgIC8vIG5vIGludGVyc2VjdGlvbj9cclxuICAgICAgICBpZiAoaW50ZXJzZWN0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1c2UgZmlyc3Q7IHJlamVjdCBsaW5lcyAoVHJhbnNmb3JtIEZyYW1lKVxyXG4gICAgICAgIGZvciAoaUludGVyc2VjdGlvbiA9IDA7IGlJbnRlcnNlY3Rpb24gPCBpbnRlcnNlY3RzLmxlbmd0aDsgaUludGVyc2VjdGlvbisrKSB7XHJcblxyXG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3RzW2lJbnRlcnNlY3Rpb25dO1xyXG4gICAgICAgICAgICBpZiAoIShpbnRlcnNlY3Rpb24ub2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuTGluZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSGVscGVyc1xyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIEhlbHBlcnNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIFdlYkdMIHRhcmdldCBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gaWQgRE9NIGlkIGZvciBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgY2FudmFzLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZUNhbnZhcyhpZCA6IHN0cmluZywgd2lkdGg/IDogbnVtYmVyLCBoZWlnaHQ/IDogbnVtYmVyKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgIFxyXG4gICAgICAgIGxldCBjYW52YXMgOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aWR9YCk7XHJcbiAgICAgICAgaWYgKCFjYW52YXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYENhbnZhcyBlbGVtZW50IGlkID0gJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ1NTIGNvbnRyb2xzIHRoZSBzaXplXHJcbiAgICAgICAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KVxyXG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgZGltZW5zaW9ucyAgICBcclxuICAgICAgICBjYW52YXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIHJldHVybiBjYW52YXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYW1lcmFTZXR0aW5ncyB7XHJcbiAgICBwb3NpdGlvbjogICAgICAgVEhSRUUuVmVjdG9yMzsgICAgICAgIC8vIGxvY2F0aW9uIG9mIGNhbWVyYVxyXG4gICAgdGFyZ2V0OiAgICAgICAgIFRIUkVFLlZlY3RvcjM7ICAgICAgICAvLyB0YXJnZXQgcG9pbnRcclxuICAgIG5lYXI6ICAgICAgICAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gbmVhciBjbGlwcGluZyBwbGFuZVxyXG4gICAgZmFyOiAgICAgICAgICAgIG51bWJlcjsgICAgICAgICAgICAgICAvLyBmYXIgY2xpcHBpbmcgcGxhbmVcclxuICAgIGZpZWxkT2ZWaWV3OiAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gZmllbGQgb2Ygdmlld1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBTdGFuZGFyZFZpZXcge1xyXG4gICAgRnJvbnQsXHJcbiAgICBUb3AsXHJcbiAgICBCb3R0b20sXHJcbiAgICBMZWZ0LFxyXG4gICAgUmlnaHQsXHJcbiAgICBJc29tZXRyaWNcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbWVyYVxyXG4gKiBHZW5lcmFsIGNhbWVyYSB1dGlsaXR5IG1ldGhvZHMuXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbWVyYSB7XHJcblxyXG4gICAgc3RhdGljIERlZmF1bHRGaWVsZE9mVmlldyAgICAgICA6IG51bWJlciA9IDM3OyAgICAgICAvLyAzNW1tIHZlcnRpY2FsIDogaHR0cHM6Ly93d3cubmlrb25pYW5zLm9yZy9yZXZpZXdzL2Zvdi10YWJsZXMgICAgICAgXHJcbiAgICBzdGF0aWMgRGVmYXVsdE5lYXJDbGlwcGluZ1BsYW5lIDogbnVtYmVyID0gMC4xOyBcclxuICAgIHN0YXRpYyBEZWZhdWx0RmFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXIgPSAxMDAwMDsgXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIENsaXBwaW5nIFBsYW5lc1xyXG4gICAgc3RhdGljIG9wdGltaXplQ2xpcHBpbmdQbGFuZXMgKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBtb2RlbCA6IFRIUkVFLkdyb3VwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG1vZGVsQ2xvbmUgOiBUSFJFRS5Hcm91cCA9IG1vZGVsLmNsb25lKHRydWUpO1xyXG4gICAgICAgIG1vZGVsQ2xvbmUuYXBwbHlNYXRyaXgoY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbW9kZWwgPSBtb2RlbENsb25lO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBleHRlbnRzIG9mIHRoZSBuZWFyIGNhbWVyYSBwbGFuZS5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7VEhSRUUuUGVyc3BlY3RpdmVDYW1lcmF9IGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuVmVjdG9yMn0gXHJcbiAgICAgKiBAbWVtYmVyb2YgR3JhcGhpY3NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldE5lYXJQbGFuZUV4dGVudHMoY2FtZXJhIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNhbWVyYUZPVlJhZGlhbnMgPSBjYW1lcmEuZm92ICogKE1hdGguUEkgLyAxODApO1xyXG4gICAgXHJcbiAgICAgICAgbGV0IG5lYXJIZWlnaHQgPSAyICogTWF0aC50YW4oY2FtZXJhRk9WUmFkaWFucyAvIDIpICogY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgbGV0IG5lYXJXaWR0aCAgPSBjYW1lcmEuYXNwZWN0ICogbmVhckhlaWdodDtcclxuICAgICAgICBsZXQgZXh0ZW50cyA9IG5ldyBUSFJFRS5WZWN0b3IyKG5lYXJXaWR0aCwgbmVhckhlaWdodCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGV4dGVudHM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFNldHRpbmdzXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgdGhlIGRlZmF1bHQgYm91bmRpbmcgYm94IGZvciBhIG1vZGVsLlxyXG4gICAgICogSWYgdGhlIG1vZGVsIGlzIGVtcHR5LCBhIHVuaXQgc3BoZXJlIGlzIHVzZXMgYXMgYSBwcm94eSB0byBwcm92aWRlIGRlZmF1bHRzLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5PYmplY3QzRH0gbW9kZWwgTW9kZWwgdG8gY2FsY3VsYXRlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5Cb3gzfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0RGVmYXVsdEJvdW5kaW5nQm94IChtb2RlbCA6IFRIUkVFLk9iamVjdDNEKSA6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpOyAgICAgICBcclxuICAgICAgICBpZiAobW9kZWwpIFxyXG4gICAgICAgICAgICBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChtb2RlbCk7IFxyXG5cclxuICAgICAgICBpZiAoIWJvdW5kaW5nQm94LmlzRW1wdHkoKSlcclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHVuaXQgc3BoZXJlIHByb3h5XHJcbiAgICAgICAgbGV0IHNwaGVyZVByb3h5ID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCAxKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChzcGhlcmVQcm94eSk7ICAgICAgICAgXHJcblxyXG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIHRoZSBjYW1lcmEgc2V0dGluZ3MgdG8gZml0IHRoZSBtb2RlbCBpbiBhIHN0YW5kYXJkIHZpZXcuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLk9iamVjdDNEfSBtb2RlbCBNb2RlbCB0byBmaXQuXHJcbiAgICAgKiBAcGFyYW0ge0NhbWVyYS5TdGFuZGFyZFZpZXd9IHZpZXcgU3RhbmRhcmQgdmlldyAoVG9wLCBMZWZ0LCBldGMuKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFzcGVjdFJhdGlvIEFzcGVjdCByYXRpbyBvZiB3aW5kb3cuXHJcbiAgICAgKiBAcmV0dXJucyB7Q2FtZXJhU2V0dGluZ3N9IFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0U3RhbmRhcmRWaWV3U2V0dGluZ3MgKG1vZGVsIDogVEhSRUUuT2JqZWN0M0QsIHZpZXcgOiBTdGFuZGFyZFZpZXcsIGFzcGVjdFJhdGlvIDogbnVtYmVyKSA6IENhbWVyYVNldHRpbmdzIHsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gQ2FtZXJhLmdldERlZmF1bHRCb3VuZGluZ0JveChtb2RlbCk7XHJcblxyXG4gICAgICAgIGxldCB2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucyAgIDogbnVtYmVyID0gKENhbWVyYS5EZWZhdWx0RmllbGRPZlZpZXcgLyAyKSAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICBsZXQgaG9yaXpvbnRhbEZpZWxkT2ZWaWV3UmFkaWFucyA6IG51bWJlciA9IE1hdGguYXRhbihhc3BlY3RSYXRpbyAqIE1hdGgudGFuKHZlcnRpY2FsRmllbGRPZlZpZXdSYWRpYW5zKSk7ICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgY2FtZXJhWlZlcnRpY2FsRXh0ZW50cyAgIDogbnVtYmVyID0gKGJvdW5kaW5nQm94LmdldFNpemUoKS55IC8gMikgLyBNYXRoLnRhbiAodmVydGljYWxGaWVsZE9mVmlld1JhZGlhbnMpOyAgICAgICBcclxuICAgICAgICBsZXQgY2FtZXJhWkhvcml6b250YWxFeHRlbnRzIDogbnVtYmVyID0gKGJvdW5kaW5nQm94LmdldFNpemUoKS54IC8gMikgLyBNYXRoLnRhbiAoaG9yaXpvbnRhbEZpZWxkT2ZWaWV3UmFkaWFucyk7ICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFaID0gTWF0aC5tYXgoY2FtZXJhWlZlcnRpY2FsRXh0ZW50cywgY2FtZXJhWkhvcml6b250YWxFeHRlbnRzKTtcclxuXHJcbiAgICAgICAgbGV0IGZhclBsYW5lICAgIDogbnVtYmVyID0gQ2FtZXJhLkRlZmF1bHRGYXJDbGlwcGluZ1BsYW5lO1xyXG5cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgcG9zaXRpb246ICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKGJvdW5kaW5nQm94LmdldENlbnRlcigpLngsIGJvdW5kaW5nQm94LmdldENlbnRlcigpLnksIGJvdW5kaW5nQm94Lm1heC56ICsgY2FtZXJhWiksICAgICAgICAgXHJcbiAgICAgICAgICAgIHRhcmdldDogICAgICAgICBib3VuZGluZ0JveC5nZXRDZW50ZXIoKSxcclxuICAgICAgICAgICAgbmVhcjogICAgICAgICAgIENhbWVyYS5EZWZhdWx0TmVhckNsaXBwaW5nUGxhbmUsICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgZmFyOiAgICAgICAgICAgIGZhclBsYW5lLCAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmaWVsZE9mVmlldzogICAgQ2FtZXJhLkRlZmF1bHRGaWVsZE9mVmlldyAgICAgICAgICAgICBcclxuICAgICAgICB9ICAgICAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuIiwiICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGggTGlicmFyeVxyXG4gKiBHZW5lcmFsIG1hdGhlbWF0aWNzIHJvdXRpbmVzXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1hdGhMaWJyYXJ5IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHR3byBudW1iZXJzIGFyZSBlcXVhbCB3aXRoaW4gdGhlIGdpdmVuIHRvbGVyYW5jZS5cclxuICAgICAqIEBwYXJhbSB2YWx1ZSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlLlxyXG4gICAgICogQHBhcmFtIG90aGVyIFNlY29uZCB2YWx1ZSB0byBjb21wYXJlLlxyXG4gICAgICogQHBhcmFtIHRvbGVyYW5jZSBUb2xlcmFuY2UgZm9yIGNvbXBhcmlzb24uXHJcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHdpdGhpbiB0b2xlcmFuY2UuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBudW1iZXJzRXF1YWxXaXRoaW5Ub2xlcmFuY2UodmFsdWUgOiBudW1iZXIsIG90aGVyIDogbnVtYmVyLCB0b2xlcmFuY2UgOiBudW1iZXIpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoKHZhbHVlID49IChvdGhlciAtIHRvbGVyYW5jZSkpICYmICh2YWx1ZSA8PSAob3RoZXIgKyB0b2xlcmFuY2UpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQge2Fzc2VydH0gICAgICAgICAgICAgZnJvbSAnY2hhaSdcclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmF9ICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuaW50ZXJmYWNlIEZhY2VQYWlyIHtcclxuICAgICAgICBcclxuICAgIHZlcnRpY2VzIDogVEhSRUUuVmVjdG9yM1tdO1xyXG4gICAgZmFjZXMgICAgOiBUSFJFRS5GYWNlM1tdO1xyXG59XHJcbiAgICAgICAgICBcclxuLyoqXHJcbiAqICBEZXB0aEJ1ZmZlciBcclxuICogIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERlcHRoQnVmZmVyIHtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgTWVzaE1vZGVsTmFtZSAgICAgICAgIDogc3RyaW5nID0gJ01vZGVsTWVzaCc7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgTm9ybWFsaXplZFRvbGVyYW5jZSAgIDogbnVtYmVyID0gLjAwMTsgICAgXHJcblxyXG4gICAgc3RhdGljIERlZmF1bHRNZXNoUGhvbmdNYXRlcmlhbFBhcmFtZXRlcnMgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbFBhcmFtZXRlcnMgPSB7d2lyZWZyYW1lIDogZmFsc2UsIGNvbG9yIDogMHhmZjAwZmYsIHJlZmxlY3Rpdml0eSA6IDAuNzUsIHNoaW5pbmVzcyA6IDAuNzV9O1xyXG4gICAgXHJcbiAgICBfbG9nZ2VyIDogTG9nZ2VyO1xyXG5cclxuICAgIF9yZ2JhQXJyYXkgOiBVaW50OEFycmF5O1xyXG4gICAgZGVwdGhzICAgICA6IEZsb2F0MzJBcnJheTtcclxuICAgIHdpZHRoICAgICAgOiBudW1iZXI7XHJcbiAgICBoZWlnaHQgICAgIDogbnVtYmVyO1xyXG5cclxuICAgIGNhbWVyYSAgICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcclxuICAgIF9uZWFyQ2xpcFBsYW5lICAgOiBudW1iZXI7XHJcbiAgICBfZmFyQ2xpcFBsYW5lICAgIDogbnVtYmVyO1xyXG4gICAgX2NhbWVyYUNsaXBSYW5nZSA6IG51bWJlcjtcclxuICAgIFxyXG4gICAgX21pbmltdW1Ob3JtYWxpemVkIDogbnVtYmVyO1xyXG4gICAgX21heGltdW1Ob3JtYWxpemVkIDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gcmdiYUFycmF5IFJhdyBhcmF5IG9mIFJHQkEgYnl0ZXMgcGFja2VkIHdpdGggZmxvYXRzLlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoIG9mIG1hcC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0IG9mIG1hcC5cclxuICAgICAqIEBwYXJhbSBuZWFyQ2xpcFBsYW5lIENhbWVyYSBuZWFyIGNsaXBwaW5nIHBsYW5lLlxyXG4gICAgICogQHBhcmFtIGZhckNsaXBQbGFuZSBDYW1lcmEgZmFyIGNsaXBwaW5nIHBsYW5lLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihyZ2JhQXJyYXkgOiBVaW50OEFycmF5LCB3aWR0aCA6IG51bWJlciwgaGVpZ2h0IDpudW1iZXIsIGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcmdiYUFycmF5ID0gcmdiYUFycmF5O1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoICA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gY2FtZXJhO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBhc3BlY3QgcmF0aW9uIG9mIHRoZSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCBhc3BlY3RSYXRpbyAoKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtaW5pbXVtTm9ybWFsaXplZCAoKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pbmltdW1Ob3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWluaW11bSBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1pbmltdW0oKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgbGV0IG1pbmltdW0gPSB0aGlzLm5vcm1hbGl6ZWRUb01vZGVsRGVwdGgodGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWluaW11bTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1heGltdW1Ob3JtYWxpemVkICgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4aW11bSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgbWF4aW11bSA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aCh0aGlzLm1pbmltdW1Ob3JtYWxpemVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1heGltdW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpemVkIGRlcHRoIHJhbmdlIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCByYW5nZU5vcm1hbGl6ZWQoKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgbGV0IGRlcHRoTm9ybWFsaXplZCA6IG51bWJlciA9IHRoaXMuX21heGltdW1Ob3JtYWxpemVkIC0gdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQ7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXB0aE5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpemVkIGRlcHRoIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCByYW5nZSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgZGVwdGggOiBudW1iZXIgPSB0aGlzLm1heGltdW0gLSB0aGlzLm1pbmltdW07XHJcblxyXG4gICAgICAgIHJldHVybiBkZXB0aDtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIHRoZSBleHRlbnRzIG9mIHRoZSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi8gICAgICAgXHJcbiAgICBjYWxjdWxhdGVFeHRlbnRzICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNaW5pbXVtTm9ybWFsaXplZCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXRNYXhpbXVtTm9ybWFsaXplZCgpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplXHJcbiAgICAgKi8gICAgICAgXHJcbiAgICBpbml0aWFsaXplICgpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5odG1sTG9nZ2VyOyAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5fbmVhckNsaXBQbGFuZSAgID0gdGhpcy5jYW1lcmEubmVhcjtcclxuICAgICAgICB0aGlzLl9mYXJDbGlwUGxhbmUgICAgPSB0aGlzLmNhbWVyYS5mYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhQ2xpcFJhbmdlID0gdGhpcy5fZmFyQ2xpcFBsYW5lIC0gdGhpcy5fbmVhckNsaXBQbGFuZTtcclxuXHJcbiAgICAgICAgLy8gUkdCQSAtPiBGbG9hdDMyXHJcbiAgICAgICAgdGhpcy5kZXB0aHMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX3JnYmFBcnJheS5idWZmZXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBleHRyZW1hIG9mIGRlcHRoIGJ1ZmZlciB2YWx1ZXNcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUV4dGVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnQgYSBub3JtYWxpemVkIGRlcHRoIFswLDFdIHRvIGRlcHRoIGluIG1vZGVsIHVuaXRzLlxyXG4gICAgICogQHBhcmFtIG5vcm1hbGl6ZWREZXB0aCBOb3JtYWxpemVkIGRlcHRoIFswLDFdLlxyXG4gICAgICovXHJcbiAgICBub3JtYWxpemVkVG9Nb2RlbERlcHRoKG5vcm1hbGl6ZWREZXB0aCA6IG51bWJlcikgOiBudW1iZXIge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NjUyMjUzL2dldHRpbmctdGhlLXRydWUtei12YWx1ZS1mcm9tLXRoZS1kZXB0aC1idWZmZXJcclxuICAgICAgICBub3JtYWxpemVkRGVwdGggPSAyLjAgKiBub3JtYWxpemVkRGVwdGggLSAxLjA7XHJcbiAgICAgICAgbGV0IHpMaW5lYXIgPSAyLjAgKiB0aGlzLmNhbWVyYS5uZWFyICogdGhpcy5jYW1lcmEuZmFyIC8gKHRoaXMuY2FtZXJhLmZhciArIHRoaXMuY2FtZXJhLm5lYXIgLSBub3JtYWxpemVkRGVwdGggKiAodGhpcy5jYW1lcmEuZmFyIC0gdGhpcy5jYW1lcmEubmVhcikpO1xyXG5cclxuICAgICAgICAvLyB6TGluZWFyIGlzIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjYW1lcmE7IHJldmVyc2UgdG8geWllbGQgaGVpZ2h0IGZyb20gbWVzaCBwbGFuZVxyXG4gICAgICAgIHpMaW5lYXIgPSAtKHpMaW5lYXIgLSB0aGlzLmNhbWVyYS5mYXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gekxpbmVhcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUgYXQgYSBwaXhlbCBpbmRleFxyXG4gICAgICogQHBhcmFtIHJvdyBCdWZmZXIgcm93LlxyXG4gICAgICogQHBhcmFtIGNvbHVtbiBCdWZmZXIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBkZXB0aE5vcm1hbGl6ZWQgKHJvdyA6IG51bWJlciwgY29sdW1uKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBpbmRleCA9IChNYXRoLnJvdW5kKHJvdykgKiB0aGlzLndpZHRoKSArIE1hdGgucm91bmQoY29sdW1uKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXB0aHNbaW5kZXhdXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBkZXB0aCB2YWx1ZSBhdCBhIHBpeGVsIGluZGV4LlxyXG4gICAgICogQHBhcmFtIHJvdyBNYXAgcm93LlxyXG4gICAgICogQHBhcmFtIHBpeGVsQ29sdW1uIE1hcCBjb2x1bW4uXHJcbiAgICAgKi9cclxuICAgIGRlcHRoKHJvdyA6IG51bWJlciwgY29sdW1uKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBkZXB0aE5vcm1hbGl6ZWQgPSB0aGlzLmRlcHRoTm9ybWFsaXplZChyb3csIGNvbHVtbik7XHJcbiAgICAgICAgbGV0IGRlcHRoID0gdGhpcy5ub3JtYWxpemVkVG9Nb2RlbERlcHRoKGRlcHRoTm9ybWFsaXplZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgbWluaW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBzZXRNaW5pbXVtTm9ybWFsaXplZCgpIHtcclxuXHJcbiAgICAgICAgbGV0IG1pbmltdW1Ob3JtYWxpemVkIDogbnVtYmVyID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleDogbnVtYmVyID0gMDsgaW5kZXggPCB0aGlzLmRlcHRocy5sZW5ndGg7IGluZGV4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoVmFsdWUgOiBudW1iZXIgPSB0aGlzLmRlcHRoc1tpbmRleF07XHJcblxyXG4gICAgICAgICAgICBpZiAoZGVwdGhWYWx1ZSA8IG1pbmltdW1Ob3JtYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgbWluaW11bU5vcm1hbGl6ZWQgPSBkZXB0aFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21pbmltdW1Ob3JtYWxpemVkID0gbWluaW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBtYXhpbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHNldE1heGltdW1Ob3JtYWxpemVkKCkge1xyXG5cclxuICAgICAgICBsZXQgbWF4aW11bU5vcm1hbGl6ZWQgOiBudW1iZXIgPSBOdW1iZXIuTUlOX1ZBTFVFO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4OiBudW1iZXIgPSAwOyBpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aDsgaW5kZXgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGhWYWx1ZSA6IG51bWJlciA9IHRoaXMuZGVwdGhzW2luZGV4XTtcclxuICAgICAgICAgICAgaWYgKGRlcHRoVmFsdWUgPiBtYXhpbXVtTm9ybWFsaXplZClcclxuICAgICAgICAgICAgICAgIG1heGltdW1Ob3JtYWxpemVkID0gZGVwdGhWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9tYXhpbXVtTm9ybWFsaXplZCA9IG1heGltdW1Ob3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBsaW5lYXIgaW5kZXggb2YgYSBtb2RlbCBwb2ludCBpbiB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSB3b3JsZFZlcnRleCBWZXJ0ZXggb2YgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldE1vZGVsVmVydGV4SW5kaWNlcyAod29ybGRWZXJ0ZXggOiBUSFJFRS5WZWN0b3IzLCBwbGFuZUJvdW5kaW5nQm94IDogVEhSRUUuQm94MykgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgIFxyXG4gICAgICAgIGxldCBib3hTaXplICAgICAgOiBUSFJFRS5WZWN0b3IzID0gcGxhbmVCb3VuZGluZ0JveC5nZXRTaXplKCk7XHJcbiAgICAgICAgbGV0IG1lc2hFeHRlbnRzICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMiAoYm94U2l6ZS54LCBib3hTaXplLnkpO1xyXG5cclxuICAgICAgICAvLyAgbWFwIGNvb3JkaW5hdGVzIHRvIG9mZnNldHMgaW4gcmFuZ2UgWzAsIDFdXHJcbiAgICAgICAgbGV0IG9mZnNldFggOiBudW1iZXIgPSAod29ybGRWZXJ0ZXgueCArIChib3hTaXplLnggLyAyKSkgLyBib3hTaXplLng7XHJcbiAgICAgICAgbGV0IG9mZnNldFkgOiBudW1iZXIgPSAod29ybGRWZXJ0ZXgueSArIChib3hTaXplLnkgLyAyKSkgLyBib3hTaXplLnk7XHJcblxyXG4gICAgICAgIGxldCByb3cgICAgOiBudW1iZXIgPSBvZmZzZXRZICogKHRoaXMuaGVpZ2h0IC0gMSk7XHJcbiAgICAgICAgbGV0IGNvbHVtbiA6IG51bWJlciA9IG9mZnNldFggKiAodGhpcy53aWR0aCAtIDEpO1xyXG4gICAgICAgIHJvdyAgICA9IE1hdGgucm91bmQocm93KTtcclxuICAgICAgICBjb2x1bW4gPSBNYXRoLnJvdW5kKGNvbHVtbik7XHJcblxyXG4gICAgICAgIGFzc2VydC5pc1RydWUoKHJvdyA+PSAwKSAmJiAocm93IDwgdGhpcy5oZWlnaHQpLCAoYFZlcnRleCAoJHt3b3JsZFZlcnRleC54fSwgJHt3b3JsZFZlcnRleC55fSwgJHt3b3JsZFZlcnRleC56fSkgeWllbGRlZCByb3cgPSAke3Jvd31gKSk7XHJcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZSgoY29sdW1uPj0gMCkgJiYgKGNvbHVtbiA8IHRoaXMud2lkdGgpLCAoYFZlcnRleCAoJHt3b3JsZFZlcnRleC54fSwgJHt3b3JsZFZlcnRleC55fSwgJHt3b3JsZFZlcnRleC56fSkgeWllbGRlZCBjb2x1bW4gPSAke2NvbHVtbn1gKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMihyb3csIGNvbHVtbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGxpbmVhciBpbmRleCBvZiBhIG1vZGVsIHBvaW50IGluIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHdvcmxkVmVydGV4IFZlcnRleCBvZiBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgZ2V0TW9kZWxWZXJ0ZXhJbmRleCAod29ybGRWZXJ0ZXggOiBUSFJFRS5WZWN0b3IzLCBwbGFuZUJvdW5kaW5nQm94IDogVEhSRUUuQm94MykgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgaW5kaWNlcyA6IFRIUkVFLlZlY3RvcjIgPSB0aGlzLmdldE1vZGVsVmVydGV4SW5kaWNlcyh3b3JsZFZlcnRleCwgcGxhbmVCb3VuZGluZ0JveCk7ICAgIFxyXG4gICAgICAgIGxldCByb3cgICAgOiBudW1iZXIgPSBpbmRpY2VzLng7XHJcbiAgICAgICAgbGV0IGNvbHVtbiA6IG51bWJlciA9IGluZGljZXMueTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgaW5kZXggPSAocm93ICogdGhpcy53aWR0aCkgKyBjb2x1bW47XHJcbiAgICAgICAgaW5kZXggPSBNYXRoLnJvdW5kKGluZGV4KTtcclxuXHJcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZSgoaW5kZXggPj0gMCkgJiYgKGluZGV4IDwgdGhpcy5kZXB0aHMubGVuZ3RoKSwgKGBWZXJ0ZXggKCR7d29ybGRWZXJ0ZXgueH0sICR7d29ybGRWZXJ0ZXgueX0sICR7d29ybGRWZXJ0ZXguen0pIHlpZWxkZWQgaW5kZXggPSAke2luZGV4fWApKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgICAvKipcclxuICAgICAgKiBDb25zdHJ1Y3RzIGEgcGFpciBvZiB0cmlhbmd1bGFyIGZhY2VzIGF0IHRoZSBnaXZlbiBvZmZzZXQgaW4gdGhlIERlcHRoQnVmZmVyLlxyXG4gICAgICAqIEBwYXJhbSByb3cgUm93IG9mZnNldCAoTG93ZXIgTGVmdCkuXHJcbiAgICAgICogQHBhcmFtIGNvbHVtbiBDb2x1bW4gb2Zmc2V0IChMb3dlciBMZWZ0KS5cclxuICAgICAgKiBAcGFyYW0gZmFjZVNpemUgU2l6ZSBvZiBhIGZhY2UgZWRnZSAobm90IGh5cG90ZW51c2UpLlxyXG4gICAgICAqIEBwYXJhbSBiYXNlVmVydGV4SW5kZXggQmVnaW5uaW5nIG9mZnNldCBpbiBtZXNoIGdlb21ldHJ5IHZlcnRleCBhcnJheS5cclxuICAgICAgKi9cclxuICAgICBjb25zdHJ1Y3RUcmlGYWNlc0F0T2Zmc2V0IChyb3cgOiBudW1iZXIsIGNvbHVtbiA6IG51bWJlciwgbWVzaExvd2VyTGVmdCA6IFRIUkVFLlZlY3RvcjIsIGZhY2VTaXplIDogbnVtYmVyLCBiYXNlVmVydGV4SW5kZXggOiBudW1iZXIpIDogRmFjZVBhaXIge1xyXG4gICAgICAgICBcclxuICAgICAgICAgbGV0IGZhY2VQYWlyIDogRmFjZVBhaXIgPSB7XHJcbiAgICAgICAgICAgICB2ZXJ0aWNlcyA6IFtdLFxyXG4gICAgICAgICAgICAgZmFjZXMgICAgOiBbXVxyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICAvLyAgVmVydGljZXNcclxuICAgICAgICAgLy8gICAyICAgIDMgICAgICAgXHJcbiAgICAgICAgIC8vICAgMCAgICAxXHJcbiAgICAgXHJcbiAgICAgICAgIC8vIGNvbXBsZXRlIG1lc2ggY2VudGVyIHdpbGwgYmUgYXQgdGhlIHdvcmxkIG9yaWdpblxyXG4gICAgICAgICBsZXQgb3JpZ2luWCA6IG51bWJlciA9IG1lc2hMb3dlckxlZnQueCArIChjb2x1bW4gKiBmYWNlU2l6ZSk7XHJcbiAgICAgICAgIGxldCBvcmlnaW5ZIDogbnVtYmVyID0gbWVzaExvd2VyTGVmdC55ICsgKHJvdyAgICAqIGZhY2VTaXplKTtcclxuIFxyXG4gICAgICAgICBsZXQgbG93ZXJMZWZ0ICAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgMCwgICAgICAgICBvcmlnaW5ZICsgMCwgICAgICAgIHRoaXMuZGVwdGgocm93ICsgMCwgY29sdW1uKyAwKSk7ICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDBcclxuICAgICAgICAgbGV0IGxvd2VyUmlnaHQgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIGZhY2VTaXplLCAgb3JpZ2luWSArIDAsICAgICAgICB0aGlzLmRlcHRoKHJvdyArIDAsIGNvbHVtbiArIDEpKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAxXHJcbiAgICAgICAgIGxldCB1cHBlckxlZnQgICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyAwLCAgICAgICAgIG9yaWdpblkgKyBmYWNlU2l6ZSwgdGhpcy5kZXB0aChyb3cgKyAxLCBjb2x1bW4gKyAwKSk7ICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMlxyXG4gICAgICAgICBsZXQgdXBwZXJSaWdodCAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgZmFjZVNpemUsICBvcmlnaW5ZICsgZmFjZVNpemUsIHRoaXMuZGVwdGgocm93ICsgMSwgY29sdW1uICsgMSkpOyAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDNcclxuIFxyXG4gICAgICAgICBmYWNlUGFpci52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgIGxvd2VyTGVmdCwgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMFxyXG4gICAgICAgICAgICAgIGxvd2VyUmlnaHQsICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMVxyXG4gICAgICAgICAgICAgIHVwcGVyTGVmdCwgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMlxyXG4gICAgICAgICAgICAgIHVwcGVyUmlnaHQgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgM1xyXG4gICAgICAgICAgKTtcclxuIFxyXG4gICAgICAgICAgLy8gcmlnaHQgaGFuZCBydWxlIGZvciBwb2x5Z29uIHdpbmRpbmdcclxuICAgICAgICAgIGZhY2VQYWlyLmZhY2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKGJhc2VWZXJ0ZXhJbmRleCArIDAsIGJhc2VWZXJ0ZXhJbmRleCArIDEsIGJhc2VWZXJ0ZXhJbmRleCArIDMpLFxyXG4gICAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMyhiYXNlVmVydGV4SW5kZXggKyAwLCBiYXNlVmVydGV4SW5kZXggKyAzLCBiYXNlVmVydGV4SW5kZXggKyAyKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICByZXR1cm4gZmFjZVBhaXI7XHJcbiAgICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIG1lc2ggb2YgdGhlIGdpdmVuIGJhc2UgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIG1lc2hYWUV4dGVudHMgQmFzZSBkaW1lbnNpb25zIChtb2RlbCB1bml0cykuIEhlaWdodCBpcyBjb250cm9sbGVkIGJ5IERCIGFzcGVjdCByYXRpby5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbCB0byBhc3NpZ24gdG8gbWVzaC5cclxuICAgICAqL1xyXG4gICAgbWVzaChtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgY29uc29sZS50aW1lKFwibWVzaFwiKTtcclxuICAgICAgICBsZXQgbWVzaFhZRXh0ZW50cyA6IFRIUkVFLlZlY3RvcjIgPSBDYW1lcmEuZ2V0TmVhclBsYW5lRXh0ZW50cyh0aGlzLmNhbWVyYSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFtYXRlcmlhbClcclxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoRGVwdGhCdWZmZXIuRGVmYXVsdE1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyk7XHJcblxyXG4gICAgICAgIGxldCBtZXNoR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZmFjZVNpemUgICAgICAgIDogbnVtYmVyID0gbWVzaFhZRXh0ZW50cy54IC8gKHRoaXMud2lkdGggLSAxKTtcclxuICAgICAgICBsZXQgYmFzZVZlcnRleEluZGV4IDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hMb3dlckxlZnQgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoLShtZXNoWFlFeHRlbnRzLnggLyAyKSwgLShtZXNoWFlFeHRlbnRzLnkgLyAyKSApXHJcblxyXG4gICAgICAgIGZvciAobGV0IGlSb3cgPSAwOyBpUm93IDwgKHRoaXMuaGVpZ2h0IC0gMSk7IGlSb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpQ29sdW1uID0gMDsgaUNvbHVtbiA8ICh0aGlzLndpZHRoIC0gMSk7IGlDb2x1bW4rKykge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgZmFjZVBhaXIgPSB0aGlzLmNvbnN0cnVjdFRyaUZhY2VzQXRPZmZzZXQoaVJvdywgaUNvbHVtbiwgbWVzaExvd2VyTGVmdCwgZmFjZVNpemUsIGJhc2VWZXJ0ZXhJbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWVzaEdlb21ldHJ5LnZlcnRpY2VzLnB1c2goLi4uZmFjZVBhaXIudmVydGljZXMpO1xyXG4gICAgICAgICAgICAgICAgbWVzaEdlb21ldHJ5LmZhY2VzLnB1c2goLi4uZmFjZVBhaXIuZmFjZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJhc2VWZXJ0ZXhJbmRleCArPSA0O1xyXG4gICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXNoR2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIGxldCBtZXNoICA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgIG1lc2gubmFtZSA9IERlcHRoQnVmZmVyLk1lc2hNb2RlbE5hbWU7XHJcblxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZChcIm1lc2hcIik7ICAgICAgIFxyXG4gICAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZXMgcHJvcGVydGllcyBvZiBhIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmNsZWFyTG9nKCk7XHJcblxyXG4gICAgICAgIGxldCBtaWRkbGUgPSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICBsZXQgZGVjaW1hbFBsYWNlcyA9IDU7XHJcbiAgICAgICAgbGV0IGhlYWRlclN0eWxlICAgPSBcImZvbnQtZmFtaWx5IDogbW9ub3NwYWNlOyBmb250LXdlaWdodCA6IGJvbGQ7IGNvbG9yIDogYmx1ZTsgZm9udC1zaXplIDogMThweFwiO1xyXG4gICAgICAgIGxldCBtZXNzYWdlU3R5bGUgID0gXCJmb250LWZhbWlseSA6IG1vbm9zcGFjZTsgY29sb3IgOiBibGFjazsgZm9udC1zaXplIDogMTRweFwiO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZSgnQ2FtZXJhIFByb3BlcnRpZXMnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE5lYXIgUGxhbmUgPSAke3RoaXMuY2FtZXJhLm5lYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgRmFyIFBsYW5lICA9ICR7dGhpcy5jYW1lcmEuZmFyfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENsaXAgUmFuZ2UgPSAke3RoaXMuY2FtZXJhLmZhciAtIHRoaXMuY2FtZXJhLm5lYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRW1wdHlMaW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKCdOb3JtYWxpemVkJywgaGVhZGVyU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBDZW50ZXIgRGVwdGggPSAke3RoaXMuZGVwdGhOb3JtYWxpemVkKG1pZGRsZSwgbWlkZGxlKS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYFogUmFuZ2UgPSAke3RoaXMucmFuZ2VOb3JtYWxpemVkLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWluaW11bSA9ICR7dGhpcy5taW5pbXVtTm9ybWFsaXplZC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1heGltdW0gPSAke3RoaXMubWF4aW11bU5vcm1hbGl6ZWQudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFbXB0eUxpbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoJ01vZGVsIFVuaXRzJywgaGVhZGVyU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBDZW50ZXIgRGVwdGggPSAke3RoaXMuZGVwdGgobWlkZGxlLCBtaWRkbGUpLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgWiBSYW5nZSA9ICR7dGhpcy5yYW5nZS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1pbmltdW0gPSAke3RoaXMubWluaW11bS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1heGltdW0gPSAke3RoaXMubWF4aW11bS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICB9XHJcbn0iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuICAgICAgICAgXHJcbi8qKlxyXG4gKiBUb29sIExpYnJhcnlcclxuICogR2VuZXJhbCB1dGlsaXR5IHJvdXRpbmVzXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRvb2xzIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFV0aWxpdHlcclxuICAgIC8vLyA8c3VtbWFyeT4gICAgICAgIFxyXG4gICAgLy8gR2VuZXJhdGUgYSBwc2V1ZG8gR1VJRC5cclxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuICAgIHN0YXRpYyBnZW5lcmF0ZVBzZXVkb0dVSUQoKSB7XHJcbiAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcbiAgICAgXHJcbiAgICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbi8qXHJcbiAgUmVxdWlyZW1lbnRzXHJcbiAgICBObyBwZXJzaXN0ZW50IERPTSBlbGVtZW50LiBUaGUgY2FudmFzIGlzIGNyZWF0ZWQgZHluYW1pY2FsbHkuXHJcbiAgICAgICAgT3B0aW9uIGZvciBwZXJzaXN0aW5nIHRoZSBGYWN0b3J5IGluIHRoZSBjb25zdHJ1Y3RvclxyXG4gICAgSlNPTiBjb21wYXRpYmxlIGNvbnN0cnVjdG9yIHBhcmFtZXRlcnNcclxuICAgIEZpeGVkIHJlc29sdXRpb247IHJlc2l6aW5nIHN1cHBvcnQgaXMgbm90IHJlcXVpcmVkLlxyXG4qL1xyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmF9ICAgICAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9ICAgICAgICAgICAgZnJvbSAnRGVwdGhCdWZmZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7TW9kZWxSZWxpZWZ9ICAgICAgICAgICAgZnJvbSAnTW9kZWxSZWxpZWYnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VG9vbHN9ICAgICAgICAgICAgICAgICAgZnJvbSAnVG9vbHMnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMge1xyXG5cclxuICAgIHdpZHRoICAgICAgICAgICAgOiBudW1iZXIsICAgICAgICAgICAgICAgICAgLy8gd2lkdGggb2YgREJcclxuICAgIGhlaWdodCAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgLy8gaGVpZ2h0IG9mIERCICAgICAgICBcclxuICAgIG1vZGVsICAgICAgICAgICAgOiBUSFJFRS5Hcm91cCwgICAgICAgICAgICAgLy8gbW9kZWwgcm9vdFxyXG5cclxuICAgIGNhbWVyYT8gICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgLy8gY2FtZXJhXHJcbiAgICBcclxuICAgIGxvZ0RlcHRoQnVmZmVyPyAgOiBib29sZWFuLCAgICAgICAgICAgICAgICAgLy8gdXNlIGxvZ2FyaXRobWljIGRlcHRoIGJ1ZmZlciBmb3IgaGlnaGVyIHJlc29sdXRpb24gKGJldHRlciBkaXN0cmlidXRpb24pIGluIHNjZW5lcyB3aXRoIGxhcmdlIGV4dGVudHNcclxuICAgIGJvdW5kZWRDbGlwcGluZz8gOiBib29sZWFuLCAgICAgICAgICAgICAgICAgLy8gb3ZlcnJyaWQgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byBib3VuZCBtb2RlbFxyXG4gICAgXHJcbiAgICBhZGRDYW52YXNUb0RPTT8gIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgIC8vIHZpc2libGUgY2FudmFzOyBhZGQgdG8gSFRNTFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1lc2hHZW5lcmF0ZVBhcmFtZXRlcnMge1xyXG5cclxuICAgIGNhbWVyYT8gICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcclxuICAgIG1hdGVyaWFsPyAgICAgICAgOiBUSFJFRS5NYXRlcmlhbDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbWFnZUdlbmVyYXRlUGFyYW1ldGVycyB7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogRGVwdGhCdWZmZXJGYWN0b3J5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXJGYWN0b3J5IHtcclxuXHJcbiAgICBzdGF0aWMgRGVmYXVsdFJlc29sdXRpb24gOiBudW1iZXIgICAgICAgICAgID0gMTAyNDsgICAgICAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IERCIHJlc29sdXRpb25cclxuICAgIHN0YXRpYyBOZWFyUGxhbmVFcHNpbG9uZSA6IG51bWJlciAgICAgICAgICAgPSAuMDAxOyAgICAgICAgICAgICAgICAgICAgIC8vIGFkanVzdG1lbnQgdG8gYXZvaWQgY2xpcHBpbmcgZ2VvbWV0cnkgb24gdGhlIG5lYXIgcGxhbmVcclxuICAgIFxyXG4gICAgc3RhdGljIENzc0NsYXNzTmFtZSAgICAgIDogc3RyaW5nICAgICAgICAgICA9ICdEZXB0aEJ1ZmZlckZhY3RvcnknOyAgICAgLy8gQ1NTIGNsYXNzXHJcbiAgICBzdGF0aWMgUm9vdENvbnRhaW5lcklkICAgOiBzdHJpbmcgICAgICAgICAgID0gJ3Jvb3RDb250YWluZXInOyAgICAgICAgICAvLyByb290IGNvbnRhaW5lciBmb3Igdmlld2Vyc1xyXG4gICAgXHJcbiAgICBfc2NlbmUgICAgICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHRhcmdldCBzY2VuZVxyXG4gICAgX21vZGVsICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyB0YXJnZXQgbW9kZWxcclxuXHJcbiAgICBfcmVuZGVyZXIgICAgICAgIDogVEhSRUUuV2ViR0xSZW5kZXJlciAgICAgID0gbnVsbDsgICAgIC8vIHNjZW5lIHJlbmRlcmVyXHJcbiAgICBfY2FudmFzICAgICAgICAgIDogSFRNTENhbnZhc0VsZW1lbnQgICAgICAgID0gbnVsbDsgICAgIC8vIERPTSBjYW52YXMgc3VwcG9ydGluZyByZW5kZXJlclxyXG4gICAgX3dpZHRoICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICA9IERlcHRoQnVmZmVyRmFjdG9yeS5EZWZhdWx0UmVzb2x1dGlvbjsgICAgIC8vIHdpZHRoIHJlc29sdXRpb24gb2YgdGhlIERCXHJcbiAgICBfaGVpZ2h0ICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgID0gRGVwdGhCdWZmZXJGYWN0b3J5LkRlZmF1bHRSZXNvbHV0aW9uOyAgICAgLy8gaGVpZ2h0IHJlc29sdXRpb24gb2YgdGhlIERCXHJcblxyXG4gICAgX2NhbWVyYSAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhICA9IG51bGw7ICAgICAvLyBwZXJzcGVjdGl2ZSBjYW1lcmEgdG8gZ2VuZXJhdGUgdGhlIGRlcHRoIGJ1ZmZlclxyXG5cclxuXHJcbiAgICBfbG9nRGVwdGhCdWZmZXIgIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gZmFsc2U7ICAgIC8vIHVzZSBhIGxvZ2FyaXRobWljIGJ1ZmZlciBmb3IgbW9yZSBhY2N1cmFjeSBpbiBsYXJnZSBzY2VuZXNcclxuICAgIF9ib3VuZGVkQ2xpcHBpbmcgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSB0cnVlOyAgICAgLy8gb3ZlcnJpZGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lczsgc2V0IG5lYXIgYW5kIGZhciB0byBib3VuZCBtb2RlbCBmb3IgaW1wcm92ZWQgYWNjdXJhY3lcclxuXHJcbiAgICBfZGVwdGhCdWZmZXIgICAgIDogRGVwdGhCdWZmZXIgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIGRlcHRoIGJ1ZmZlciBcclxuICAgIF90YXJnZXQgICAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCAgPSBudWxsOyAgICAgLy8gV2ViR0wgcmVuZGVyIHRhcmdldCBmb3IgY3JlYXRpbmcgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciB3aGVuIHJlbmRlcmluZyB0aGUgc2NlbmVcclxuICAgIF9lbmNvZGVkVGFyZ2V0ICAgOiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCAgPSBudWxsOyAgICAgLy8gV2ViR0wgcmVuZGVyIHRhcmdldCBmb3IgZW5jb2RpbiB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIGludG8gYSBmbG9hdGluZyBwb2ludCAoUkdCQSBmb3JtYXQpXHJcblxyXG4gICAgX3Bvc3RTY2VuZSAgICAgICA6IFRIUkVFLlNjZW5lICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBzaW5nbGUgcG9seWdvbiBzY2VuZSB1c2UgdG8gZ2VuZXJhdGUgdGhlIGVuY29kZWQgUkdCQSBidWZmZXJcclxuICAgIF9wb3N0Q2FtZXJhICAgICAgOiBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEgPSBudWxsOyAgICAgLy8gb3J0aG9ncmFwaGljIGNhbWVyYVxyXG4gICAgX3Bvc3RNYXRlcmlhbCAgICA6IFRIUkVFLlNoYWRlck1hdGVyaWFsICAgICA9IG51bGw7ICAgICAvLyBzaGFkZXIgbWF0ZXJpYWwgdGhhdCBlbmNvZGVzIHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgaW50byBhIGZsb2F0aW5nIHBvaW50IFJHQkEgZm9ybWF0XHJcblxyXG4gICAgX21pbmltdW1XZWJHTCAgICA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICA9IHRydWU7ICAgICAvLyB0cnVlIGlmIG1pbmltdW0gV2VHTCByZXF1aXJlbWVudHMgYXJlIHByZXNlbnRcclxuICAgIF9sb2dnZXIgICAgICAgICAgOiBMb2dnZXIgICAgICAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gbG9nZ2VyXHJcbiAgICBfYWRkQ2FudmFzVG9ET00gIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gZmFsc2U7ICAgIC8vIHZpc2libGUgY2FudmFzOyBhZGQgdG8gSFRNTCBwYWdlXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMgKERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMpXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMgOiBEZXB0aEJ1ZmZlckZhY3RvcnlQYXJhbWV0ZXJzKSB7XHJcblxyXG4gICAgICAgIC8vIHJlcXVpcmVkXHJcbiAgICAgICAgdGhpcy5fd2lkdGggICAgICAgICAgID0gcGFyYW1ldGVycy53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgICAgICAgICAgPSBwYXJhbWV0ZXJzLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9tb2RlbCAgICAgICAgICAgPSBwYXJhbWV0ZXJzLm1vZGVsLmNsb25lKCk7XHJcblxyXG4gICAgICAgIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhICAgICAgICAgID0gcGFyYW1ldGVycy5jYW1lcmEgICAgICAgICAgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLl9sb2dEZXB0aEJ1ZmZlciAgPSBwYXJhbWV0ZXJzLmxvZ0RlcHRoQnVmZmVyICB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ib3VuZGVkQ2xpcHBpbmcgPSBwYXJhbWV0ZXJzLmJvdW5kZWRDbGlwcGluZyB8fCB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2FkZENhbnZhc1RvRE9NICA9IHBhcmFtZXRlcnMuYWRkQ2FudmFzVG9ET00gIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSB0aGlzLmluaXRpYWxpemVDYW52YXMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVmVyaWZpZXMgdGhlIG1pbmltdW0gV2ViR0wgZXh0ZW5zaW9ucyBhcmUgcHJlc2VudC5cclxuICAgICAqIEBwYXJhbSByZW5kZXJlciBXZWJHTCByZW5kZXJlci5cclxuICAgICAqL1xyXG4gICAgdmVyaWZ5V2ViR0xFeHRlbnNpb25zKCkgOiBib29sZWFuIHsgXHJcbiAgICBcclxuICAgICAgICBpZiAoIXRoaXMuX3JlbmRlcmVyLmV4dGVuc2lvbnMuZ2V0KCdXRUJHTF9kZXB0aF90ZXh0dXJlJykpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWluaW11bVdlYkdMID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoJ1RoZSBtaW5pbXVtIFdlYkdMIGV4dGVuc2lvbnMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXIuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlIGEgbW91c2UgZG93biBldmVudCBvbiB0aGUgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBvbk1vdXNlRG93bihldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0KSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgZGV2aWNlQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gR3JhcGhpY3MuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCwgJChldmVudC50YXJnZXQpKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYGRldmljZSA9ICR7ZGV2aWNlQ29vcmRpbmF0ZXMueH0sICR7ZGV2aWNlQ29vcmRpbmF0ZXMueX1gKTtcclxuXHJcbiAgICAgICAgbGV0IGRlY2ltYWxQbGFjZXMgICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHJvdyAgICAgICAgICAgICA6IG51bWJlciA9IChkZXZpY2VDb29yZGluYXRlcy55ICsgMSkgLyAyICogdGhpcy5fZGVwdGhCdWZmZXIuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBjb2x1bW4gICAgICAgICAgOiBudW1iZXIgPSAoZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMiAqIHRoaXMuX2RlcHRoQnVmZmVyLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgT2Zmc2V0ID0gWyR7cm93fSwgJHtjb2x1bW59XWApOyAgICAgICBcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYERlcHRoID0gJHt0aGlzLl9kZXB0aEJ1ZmZlci5kZXB0aChyb3csIGNvbHVtbikudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gKTsgICAgICAgXHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSBXZWJHTCB0YXJnZXQgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FudmFzKCkgOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICBcclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMuc2V0QXR0cmlidXRlKCduYW1lJywgVG9vbHMuZ2VuZXJhdGVQc2V1ZG9HVUlEKCkpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgRGVwdGhCdWZmZXJGYWN0b3J5LkNzc0NsYXNzTmFtZSk7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciBkaW1lbnNpb25zICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbnZhcy53aWR0aCAgPSB0aGlzLl93aWR0aDtcclxuICAgICAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0OyBcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt0aGlzLl93aWR0aH1weGA7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuX2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIC8vIGFkZCB0byBET00/XHJcbiAgICAgICAgaWYgKHRoaXMuX2FkZENhbnZhc1RvRE9NKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtEZXB0aEJ1ZmZlckZhY3RvcnkuUm9vdENvbnRhaW5lcklkfWApLmFwcGVuZENoaWxkKHRoaXMuX2NhbnZhcyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgJGNhbnZhcyA9ICQodGhpcy5fY2FudmFzKS5vbignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uIG9mIHRoZSByZW5kZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTY2VuZSAoKSA6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLl9zY2VuZS5hZGQodGhpcy5fbW9kZWwpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZyh0aGlzLl9zY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSAgbW9kZWwgdmlldy5cclxuICAgICAqL1xyXG4gICAgIGluaXRpYWxpemVSZW5kZXJlcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigge2NhbnZhcyA6IHRoaXMuX2NhbnZhcywgbG9nYXJpdGhtaWNEZXB0aEJ1ZmZlciA6IHRoaXMuX2xvZ0RlcHRoQnVmZmVyfSk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gTW9kZWwgU2NlbmUgLT4gKFJlbmRlciBUZXh0dXJlLCBEZXB0aCBUZXh0dXJlKVxyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRoaXMuY29uc3RydWN0RGVwdGhUZXh0dXJlUmVuZGVyVGFyZ2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEVuY29kZWQgUkdCQSBUZXh0dXJlIGZyb20gRGVwdGggVGV4dHVyZVxyXG4gICAgICAgIHRoaXMuX2VuY29kZWRUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcblxyXG4gICAgICAgIHRoaXMudmVyaWZ5V2ViR0xFeHRlbnNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGRlZmF1bHQgbGlnaHRpbmcgaW4gdGhlIHNjZW5lLlxyXG4gICAgICogTGlnaHRpbmcgZG9lcyBub3QgYWZmZWN0IHRoZSBkZXB0aCBidWZmZXIuIEl0IGlzIG9ubHkgdXNlZCBpZiB0aGUgY2FudmFzIGlzIG1hZGUgdmlzaWJsZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nIChzY2VuZSA6IFRIUkVFLlNjZW5lKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC4yKTtcclxuICAgICAgICBzY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCgxLCAxLCAxKTtcclxuICAgICAgICBzY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQcmltYXJ5ICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUHJpbWFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3QoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gUG9zdFByb2Nlc3NpbmdcclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIHJlbmRlciB0YXJnZXQgPHdpdGggYSBkZXB0aCB0ZXh0dXJlIGJ1ZmZlcj4uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdERlcHRoVGV4dHVyZVJlbmRlclRhcmdldCgpIDogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQge1xyXG5cclxuICAgICAgICAvLyBNb2RlbCBTY2VuZSAtPiAoUmVuZGVyIFRleHR1cmUsIERlcHRoIFRleHR1cmUpXHJcbiAgICAgICAgbGV0IHJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUuZm9ybWF0ICAgICAgICAgICA9IFRIUkVFLlJHQkFGb3JtYXQ7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUudHlwZSAgICAgICAgICAgICA9IFRIUkVFLlVuc2lnbmVkQnl0ZVR5cGU7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUubWluRmlsdGVyICAgICAgICA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUubWFnRmlsdGVyICAgICAgICA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzICA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZW5kZXJUYXJnZXQuc3RlbmNpbEJ1ZmZlciAgICAgICAgICAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSB0cnVlO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aFRleHR1cmUgICAgICAgICAgICAgPSBuZXcgVEhSRUUuRGVwdGhUZXh0dXJlKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aFRleHR1cmUudHlwZSAgICAgICAgPSBUSFJFRS5VbnNpZ25lZEludFR5cGU7XHJcbiAgICBcclxuICAgICAgICByZXR1cm4gcmVuZGVyVGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHBvc3Qgc2NlbmUgdXNlZCB0byBjcmVhdGUgdGhlIGZpbmFsIFJHQkEgZW5jb2RlZCBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0U2NlbmUgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHBvc3RNZXNoTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2ZXJ0ZXhTaGFkZXI6ICAgTVIuc2hhZGVyU291cmNlWydEZXB0aEJ1ZmZlclZlcnRleFNoYWRlciddLFxyXG4gICAgICAgICAgICBmcmFnbWVudFNoYWRlcjogTVIuc2hhZGVyU291cmNlWydEZXB0aEJ1ZmZlckZyYWdtZW50U2hhZGVyJ10sXHJcblxyXG4gICAgICAgICAgICB1bmlmb3Jtczoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhTmVhciAgOiAgIHsgdmFsdWU6IHRoaXMuX2NhbWVyYS5uZWFyIH0sXHJcbiAgICAgICAgICAgICAgICBjYW1lcmFGYXIgICA6ICAgeyB2YWx1ZTogdGhpcy5fY2FtZXJhLmZhciB9LFxyXG4gICAgICAgICAgICAgICAgdERpZmZ1c2UgICAgOiAgIHsgdmFsdWU6IHRoaXMuX3RhcmdldC50ZXh0dXJlIH0sXHJcbiAgICAgICAgICAgICAgICB0RGVwdGggICAgICA6ICAgeyB2YWx1ZTogdGhpcy5fdGFyZ2V0LmRlcHRoVGV4dHVyZSB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgcG9zdE1lc2hQbGFuZSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDIsIDIpO1xyXG4gICAgICAgIGxldCBwb3N0TWVzaFF1YWQgID0gbmV3IFRIUkVFLk1lc2gocG9zdE1lc2hQbGFuZSwgcG9zdE1lc2hNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3RTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuX3Bvc3RTY2VuZS5hZGQocG9zdE1lc2hRdWFkKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdENhbWVyYSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpZ2h0aW5nKHRoaXMuX3Bvc3RTY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIHRoZSBvcnRob2dyYXBoaWMgY2FtZXJhIHVzZWQgdG8gY29udmVydCB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHRvIHRoZSBlbmNvZGVkIFJHQkEgYnVmZmVyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0Q2FtZXJhKCkge1xyXG5cclxuICAgICAgICAvLyBTZXR1cCBwb3N0IHByb2Nlc3Npbmcgc3RhZ2VcclxuICAgICAgICBsZXQgbGVmdDogbnVtYmVyICAgICAgPSAgLTE7XHJcbiAgICAgICAgbGV0IHJpZ2h0OiBudW1iZXIgICAgID0gICAxO1xyXG4gICAgICAgIGxldCB0b3A6IG51bWJlciAgICAgICA9ICAgMTtcclxuICAgICAgICBsZXQgYm90dG9tOiBudW1iZXIgICAgPSAgLTE7XHJcbiAgICAgICAgbGV0IG5lYXI6IG51bWJlciAgICAgID0gICAwO1xyXG4gICAgICAgIGxldCBmYXI6IG51bWJlciAgICAgICA9ICAgMTtcclxuXHJcbiAgICAgICAgdGhpcy5fcG9zdENhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0ICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RDYW1lcmEoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gR2VuZXJhdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBWZXJpZmllcyB0aGUgcHJlLXJlcXVpc2l0ZSBzZXR0aW5ncyBhcmUgZGVmaW5lZCB0byBjcmVhdGUgYSBtZXNoLlxyXG4gICAgICovXHJcbiAgICB2ZXJpZnlNZXNoU2V0dGluZ3MoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGxldCBtaW5pbXVtU2V0dGluZ3MgOiBib29sZWFuID0gdHJ1ZVxyXG4gICAgICAgIGxldCBlcnJvclByZWZpeCAgICAgOiBzdHJpbmcgPSAnRGVwdGhCdWZmZXJGYWN0b3J5OiAnO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYCR7ZXJyb3JQcmVmaXh9VGhlIG1vZGVsIGlzIG5vdCBkZWZpbmVkLmApO1xyXG4gICAgICAgICAgICBtaW5pbXVtU2V0dGluZ3MgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYCR7ZXJyb3JQcmVmaXh9VGhlIGNhbWVyYSBpcyBub3QgZGVmaW5lZC5gKTtcclxuICAgICAgICAgICAgbWluaW11bVNldHRpbmdzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWluaW11bVNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhbiBSR0JBIHN0cmluZyB3aXRoIHRoZSBieXRlIHZhbHVlcyBvZiBhIHBpeGVsLlxyXG4gICAgICogQHBhcmFtIGJ1ZmZlciBVbnNpZ25lZCBieXRlIHJhdyBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0gcm93IFBpeGVsIHJvdy5cclxuICAgICAqIEBwYXJhbSBjb2x1bW4gQ29sdW1uIHJvdy5cclxuICAgICAqL1xyXG4gICAgIHVuc2lnbmVkQnl0ZXNUb1JHQkEgKGJ1ZmZlciA6IFVpbnQ4QXJyYXksIHJvdyA6IG51bWJlciwgY29sdW1uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IChyb3cgKiB0aGlzLl93aWR0aCkgKyBjb2x1bW47XHJcbiAgICAgICAgbGV0IHJWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAwXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGdWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAxXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGJWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAyXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGFWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAzXS50b1N0cmluZygxNik7XHJcblxyXG4gICAgICAgIHJldHVybiBgIyR7clZhbHVlfSR7Z1ZhbHVlfSR7YlZhbHVlfSAke2FWYWx1ZX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZXMgYSBwaXhlbCBmcm9tIGEgcmVuZGVyIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZVJlbmRlckJ1ZmZlciAoKSB7XHJcblxyXG4gICAgICAgIGxldCByZW5kZXJCdWZmZXIgPSAgbmV3IFVpbnQ4QXJyYXkodGhpcy5fd2lkdGggKiB0aGlzLl9oZWlnaHQgKiA0KS5maWxsKDApO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlYWRSZW5kZXJUYXJnZXRQaXhlbHModGhpcy5fdGFyZ2V0LCAwLCAwLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCByZW5kZXJCdWZmZXIpO1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZVN0cmluZyA9IGBSR0JBWzAsIDBdID0gJHt0aGlzLnVuc2lnbmVkQnl0ZXNUb1JHQkEocmVuZGVyQnVmZmVyLCAwLCAwKX1gO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKG1lc3NhZ2VTdHJpbmcsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZSB0aGUgcmVuZGVyIGFuZCBkZXB0aCB0YXJnZXRzLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplVGFyZ2V0cyAoKSAge1xyXG5cclxuLy8gICAgICB0aGlzLmFuYWx5emVSZW5kZXJCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLl9kZXB0aEJ1ZmZlci5hbmFseXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZURlcHRoQnVmZmVyKCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLnRpbWUoXCJjcmVhdGVEZXB0aEJ1ZmZlclwiKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fc2NlbmUsIHRoaXMuX2NhbWVyYSwgdGhpcy5fdGFyZ2V0KTsgICAgXHJcbiAgICBcclxuICAgICAgICAvLyAob3B0aW9uYWwpIHByZXZpZXcgZW5jb2RlZCBSR0JBIHRleHR1cmU7IGRyYXduIGJ5IHNoYWRlciBidXQgbm90IHBlcnNpc3RlZFxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9wb3N0U2NlbmUsIHRoaXMuX3Bvc3RDYW1lcmEpOyAgICBcclxuXHJcbiAgICAgICAgLy8gUGVyc2lzdCBlbmNvZGVkIFJHQkEgdGV4dHVyZTsgY2FsY3VsYXRlZCBmcm9tIGRlcHRoIGJ1ZmZlclxyXG4gICAgICAgIC8vIGVuY29kZWRUYXJnZXQudGV4dHVyZSAgICAgIDogZW5jb2RlZCBSR0JBIHRleHR1cmVcclxuICAgICAgICAvLyBlbmNvZGVkVGFyZ2V0LmRlcHRoVGV4dHVyZSA6IG51bGxcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fcG9zdFNjZW5lLCB0aGlzLl9wb3N0Q2FtZXJhLCB0aGlzLl9lbmNvZGVkVGFyZ2V0KTsgXHJcblxyXG4gICAgICAgIC8vIGRlY29kZSBSR0JBIHRleHR1cmUgaW50byBkZXB0aCBmbG9hdHNcclxuICAgICAgICBsZXQgZGVwdGhCdWZmZXJSR0JBID0gIG5ldyBVaW50OEFycmF5KHRoaXMuX3dpZHRoICogdGhpcy5faGVpZ2h0ICogNCkuZmlsbCgwKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZWFkUmVuZGVyVGFyZ2V0UGl4ZWxzKHRoaXMuX2VuY29kZWRUYXJnZXQsIDAsIDAsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIGRlcHRoQnVmZmVyUkdCQSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlcHRoQnVmZmVyID0gbmV3IERlcHRoQnVmZmVyKGRlcHRoQnVmZmVyUkdCQSwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgdGhpcy5fY2FtZXJhKTsgICAgXHJcblxyXG4gICAgICAgIHRoaXMuYW5hbHl6ZVRhcmdldHMoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKFwiY3JlYXRlRGVwdGhCdWZmZXJcIik7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzIGZvciBtZXNoIGdlbmVyYXRpb24uXHJcbiAgICAgKi9cclxuICAgIHNldENhbWVyYUNsaXBwaW5nUGxhbmVzICgpIHtcclxuXHJcbiAgICAgICAgLy8gY29weSBjYW1lcmE7IHNoYXJlZCB3aXRoIE1vZGVsVmlld2VyXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xyXG4gICAgICAgIGNhbWVyYS5jb3B5ICh0aGlzLl9jYW1lcmEpO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcclxuXHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl9jYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG5cclxuICAgICAgICAvLyBjbG9uZSBtb2RlbCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgbW9kZWxWaWV3ICAgICAgID0gIEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KHRoaXMuX21vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXcgPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGJveCBpcyB3b3JsZC1heGlzIGFsaWduZWQuIFxyXG4gICAgICAgIC8vIEluIFZpZXcgY29vcmRpbmF0ZXMsIHRoZSBjYW1lcmEgaXMgYXQgdGhlIG9yaWdpbi5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgbmVhciBwbGFuZSBpcyB0aGUgbWF4aW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGZhciBwbGFuZSBpcyB0aGUgbWluaW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgbGV0IG5lYXJQbGFuZSA9IC1ib3VuZGluZ0JveFZpZXcubWF4Lno7XHJcbiAgICAgICAgbGV0IGZhclBsYW5lICA9IC1ib3VuZGluZ0JveFZpZXcubWluLno7XHJcblxyXG4gICAgICAgIC8vIGFkanVzdCBieSBlcHNpbG9uIHRvIGF2b2lkIGNsaXBwaW5nIGdlb21ldHJ5IGF0IHRoZSBuZWFyIHBsYW5lIGVkZ2VcclxuICAgICAgICB0aGlzLl9jYW1lcmEubmVhciA9ICgxIC0gRGVwdGhCdWZmZXJGYWN0b3J5Lk5lYXJQbGFuZUVwc2lsb25lKSAqIG5lYXJQbGFuZTtcclxuXHJcbiAgICAgICAgLy8gYWxsb3cgdXNlciB0byBvdmVycmlkZSBjYWxjdWxhdGVkIGZhciBwbGFuZVxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5mYXIgID0gTWF0aC5taW4odGhpcy5fY2FtZXJhLmZhciwgZmFyUGxhbmUpO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgYSBtZXNoIGZyb20gdGhlIGFjdGl2ZSBtb2RlbCBhbmQgY2FtZXJhXHJcbiAgICAgKiBAcGFyYW0gcGFyYW1ldGVycyBHZW5lcmF0aW9uIHBhcmFtZXRlcnMgKE1lc2hHZW5lcmF0ZVBhcmFtZXRlcnMpXHJcbiAgICAgKi9cclxuICAgIG1lc2hHZW5lcmF0ZSAocGFyYW1ldGVycyA6IE1lc2hHZW5lcmF0ZVBhcmFtZXRlcnMpIDogVEhSRUUuTWVzaCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLnZlcmlmeU1lc2hTZXR0aW5ncygpKSBcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuX2JvdW5kZWRDbGlwcGluZylcclxuICAgICAgICAgICAgdGhpcy5zZXRDYW1lcmFDbGlwcGluZ1BsYW5lcygpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZURlcHRoQnVmZmVyKCk7XHJcbiAgICAgICAgbGV0IG1lc2ggPSB0aGlzLl9kZXB0aEJ1ZmZlci5tZXNoKHBhcmFtZXRlcnMubWF0ZXJpYWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGFuIGltYWdlIGZyb20gdGhlIGFjdGl2ZSBtb2RlbCBhbmQgY2FtZXJhXHJcbiAgICAgKiBAcGFyYW0gcGFyYW1ldGVycyBHZW5lcmF0aW9uIHBhcmFtZXRlcnMgKEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzKVxyXG4gICAgICovXHJcbiAgICBpbWFnZUdlbmVyYXRlIChwYXJhbWV0ZXJzIDogSW1hZ2VHZW5lcmF0ZVBhcmFtZXRlcnMpIDogVWludDhBcnJheSB7XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFxyXG4vLyBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBPQkpMb2FkZXIgKCBtYW5hZ2VyICkge1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9ICggbWFuYWdlciAhPT0gdW5kZWZpbmVkICkgPyBtYW5hZ2VyIDogVEhSRUUuRGVmYXVsdExvYWRpbmdNYW5hZ2VyO1xyXG5cclxuICAgIHRoaXMubWF0ZXJpYWxzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLnJlZ2V4cCA9IHtcclxuICAgICAgICAvLyB2IGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdmVydGV4X3BhdHRlcm4gICAgICAgICAgIDogL152XFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyB2biBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIG5vcm1hbF9wYXR0ZXJuICAgICAgICAgICA6IC9edm5cXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIHZ0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdXZfcGF0dGVybiAgICAgICAgICAgICAgIDogL152dFxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICBmYWNlX3ZlcnRleCAgICAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXHMrKC0/XFxkKylcXHMrKC0/XFxkKykoPzpcXHMrKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgIGZhY2VfdmVydGV4X3V2ICAgICAgICAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF91dl9ub3JtYWwgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF9ub3JtYWwgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBvIG9iamVjdF9uYW1lIHwgZyBncm91cF9uYW1lXHJcbiAgICAgICAgb2JqZWN0X3BhdHRlcm4gICAgICAgICAgIDogL15bb2ddXFxzKiguKyk/LyxcclxuICAgICAgICAvLyBzIGJvb2xlYW5cclxuICAgICAgICBzbW9vdGhpbmdfcGF0dGVybiAgICAgICAgOiAvXnNcXHMrKFxcZCt8b258b2ZmKS8sXHJcbiAgICAgICAgLy8gbXRsbGliIGZpbGVfcmVmZXJlbmNlXHJcbiAgICAgICAgbWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuIDogL15tdGxsaWIgLyxcclxuICAgICAgICAvLyB1c2VtdGwgbWF0ZXJpYWxfbmFtZVxyXG4gICAgICAgIG1hdGVyaWFsX3VzZV9wYXR0ZXJuICAgICA6IC9edXNlbXRsIC9cclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuT0JKTG9hZGVyLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogT0JKTG9hZGVyLFxyXG5cclxuICAgIGxvYWQ6IGZ1bmN0aW9uICggdXJsLCBvbkxvYWQsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKSB7XHJcblxyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRmlsZUxvYWRlciggc2NvcGUubWFuYWdlciApO1xyXG4gICAgICAgIGxvYWRlci5zZXRQYXRoKCB0aGlzLnBhdGggKTtcclxuICAgICAgICBsb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgICAgICBvbkxvYWQoIHNjb3BlLnBhcnNlKCB0ZXh0ICkgKTtcclxuXHJcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0UGF0aDogZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXRoID0gdmFsdWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNYXRlcmlhbHM6IGZ1bmN0aW9uICggbWF0ZXJpYWxzICkge1xyXG5cclxuICAgICAgICB0aGlzLm1hdGVyaWFscyA9IG1hdGVyaWFscztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIF9jcmVhdGVQYXJzZXJTdGF0ZSA6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlID0ge1xyXG4gICAgICAgICAgICBvYmplY3RzICA6IFtdLFxyXG4gICAgICAgICAgICBvYmplY3QgICA6IHt9LFxyXG5cclxuICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgdXZzICAgICAgOiBbXSxcclxuXHJcbiAgICAgICAgICAgIG1hdGVyaWFsTGlicmFyaWVzIDogW10sXHJcblxyXG4gICAgICAgICAgICBzdGFydE9iamVjdDogZnVuY3Rpb24gKCBuYW1lLCBmcm9tRGVjbGFyYXRpb24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgb2JqZWN0IChpbml0aWFsIGZyb20gcmVzZXQpIGlzIG5vdCBmcm9tIGEgZy9vIGRlY2xhcmF0aW9uIGluIHRoZSBwYXJzZWRcclxuICAgICAgICAgICAgICAgIC8vIGZpbGUuIFdlIG5lZWQgdG8gdXNlIGl0IGZvciB0aGUgZmlyc3QgcGFyc2VkIGcvbyB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPT09IGZhbHNlICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPSAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c01hdGVyaWFsID0gKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsID09PSAnZnVuY3Rpb24nID8gdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsKCkgOiB1bmRlZmluZWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSggdHJ1ZSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tRGVjbGFyYXRpb24gOiAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV2cyAgICAgIDogW11cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFscyA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TWF0ZXJpYWwgOiBmdW5jdGlvbiggbmFtZSwgbGlicmFyaWVzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5fZmluYWxpemUoIGZhbHNlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXcgdXNlbXRsIGRlY2xhcmF0aW9uIG92ZXJ3cml0ZXMgYW4gaW5oZXJpdGVkIG1hdGVyaWFsLCBleGNlcHQgaWYgZmFjZXMgd2VyZSBkZWNsYXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGUgbWF0ZXJpYWwsIHRoZW4gaXQgbXVzdCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBwcmV2aW91cyAmJiAoIHByZXZpb3VzLmluaGVyaXRlZCB8fCBwcmV2aW91cy5ncm91cENvdW50IDw9IDAgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5zcGxpY2UoIHByZXZpb3VzLmluZGV4LCAxICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogdGhpcy5tYXRlcmlhbHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogKCBBcnJheS5pc0FycmF5KCBsaWJyYXJpZXMgKSAmJiBsaWJyYXJpZXMubGVuZ3RoID4gMCA/IGxpYnJhcmllc1sgbGlicmFyaWVzLmxlbmd0aCAtIDEgXSA6ICcnICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbW9vdGggICAgIDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuc21vb3RoIDogdGhpcy5zbW9vdGggKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiAoIHByZXZpb3VzICE9PSB1bmRlZmluZWQgPyBwcmV2aW91cy5ncm91cEVuZCA6IDAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmVkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogKCB0eXBlb2YgaW5kZXggPT09ICdudW1iZXInID8gaW5kZXggOiB0aGlzLmluZGV4ICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG10bGxpYiAgICAgOiB0aGlzLm10bGxpYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21vb3RoICAgICA6IHRoaXMuc21vb3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0IDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZC5jbG9uZSA9IHRoaXMuY2xvbmUuYmluZChjbG9uZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKCBtYXRlcmlhbCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGVyaWFsc1sgdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBfZmluYWxpemUgOiBmdW5jdGlvbiggZW5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RNdWx0aU1hdGVyaWFsID0gdGhpcy5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBsYXN0TXVsdGlNYXRlcmlhbCAmJiBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9PT0gLTEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPSB0aGlzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cENvdW50ID0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgLSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cFN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuaW5oZXJpdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgb2JqZWN0cyB0YWlsIG1hdGVyaWFscyBpZiBubyBmYWNlIGRlY2xhcmF0aW9ucyBmb2xsb3dlZCB0aGVtIGJlZm9yZSBhIG5ldyBvL2cgc3RhcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSB0aGlzLm1hdGVyaWFscy5sZW5ndGggLSAxOyBtaSA+PSAwOyBtaS0tICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHNbbWldLmdyb3VwQ291bnQgPD0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMuc3BsaWNlKCBtaSwgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEd1YXJhbnRlZSBhdCBsZWFzdCBvbmUgZW1wdHkgbWF0ZXJpYWwsIHRoaXMgbWFrZXMgdGhlIGNyZWF0aW9uIGxhdGVyIG1vcmUgc3RyYWlnaHQgZm9yd2FyZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID09PSAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRoaXMuc21vb3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0TXVsdGlNYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJbmhlcml0IHByZXZpb3VzIG9iamVjdHMgbWF0ZXJpYWwuXHJcbiAgICAgICAgICAgICAgICAvLyBTcGVjIHRlbGxzIHVzIHRoYXQgYSBkZWNsYXJlZCBtYXRlcmlhbCBtdXN0IGJlIHNldCB0byBhbGwgb2JqZWN0cyB1bnRpbCBhIG5ldyBtYXRlcmlhbCBpcyBkZWNsYXJlZC5cclxuICAgICAgICAgICAgICAgIC8vIElmIGEgdXNlbXRsIGRlY2xhcmF0aW9uIGlzIGVuY291bnRlcmVkIHdoaWxlIHRoaXMgbmV3IG9iamVjdCBpcyBiZWluZyBwYXJzZWQsIGl0IHdpbGxcclxuICAgICAgICAgICAgICAgIC8vIG92ZXJ3cml0ZSB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLiBFeGNlcHRpb24gYmVpbmcgdGhhdCB0aGVyZSB3YXMgYWxyZWFkeSBmYWNlIGRlY2xhcmF0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGluaGVyaXRlZCBtYXRlcmlhbCwgdGhlbiBpdCB3aWxsIGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggcHJldmlvdXNNYXRlcmlhbCAmJiBwcmV2aW91c01hdGVyaWFsLm5hbWUgJiYgdHlwZW9mIHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUgPT09IFwiZnVuY3Rpb25cIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlY2xhcmVkID0gcHJldmlvdXNNYXRlcmlhbC5jbG9uZSggMCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlY2xhcmVkLmluaGVyaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QubWF0ZXJpYWxzLnB1c2goIGRlY2xhcmVkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKCB0aGlzLm9iamVjdCApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZpbmFsaXplIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VWZXJ0ZXhJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VOb3JtYWxJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VVVkluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMiApICogMjtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRWZXJ0ZXg6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVmVydGV4TGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGROb3JtYWwgOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMubm9ybWFscztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS5ub3JtYWxzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRVVjogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFVWTGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEZhY2U6IGZ1bmN0aW9uICggYSwgYiwgYywgZCwgdWEsIHViLCB1YywgdWQsIG5hLCBuYiwgbmMsIG5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlhID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBhLCB2TGVuICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWIgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGIsIHZMZW4gKTtcclxuICAgICAgICAgICAgICAgIHZhciBpYyA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYywgdkxlbiApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBkLCB2TGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB1YSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlhID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVhLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGliID0gdGhpcy5wYXJzZVVWSW5kZXgoIHViLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGljID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVjLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVkLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBuYSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBOb3JtYWxzIGFyZSBtYW55IHRpbWVzIHRoZSBzYW1lLiBJZiBzbywgc2tpcCBmdW5jdGlvbiBjYWxsIGFuZCBwYXJzZUludC5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbkxlbiA9IHRoaXMubm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWEgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5hLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGliID0gbmEgPT09IG5iID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5iLCBuTGVuICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWMgPSBuYSA9PT0gbmMgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmMsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5kLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZExpbmVHZW9tZXRyeTogZnVuY3Rpb24gKCB2ZXJ0aWNlcywgdXZzICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Lmdlb21ldHJ5LnR5cGUgPSAnTGluZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdmkgPSAwLCBsID0gdmVydGljZXMubGVuZ3RoOyB2aSA8IGw7IHZpICsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleExpbmUoIHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggdmVydGljZXNbIHZpIF0sIHZMZW4gKSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdXZpID0gMCwgbCA9IHV2cy5sZW5ndGg7IHV2aSA8IGw7IHV2aSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVVkxpbmUoIHRoaXMucGFyc2VVVkluZGV4KCB1dnNbIHV2aSBdLCB1dkxlbiApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzdGF0ZS5zdGFydE9iamVjdCggJycsIGZhbHNlICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlOiBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUudGltZSggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5fY3JlYXRlUGFyc2VyU3RhdGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCB0ZXh0LmluZGV4T2YoICdcXHJcXG4nICkgIT09IC0gMSApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgZmFzdGVyIHRoYW4gU3RyaW5nLnNwbGl0IHdpdGggcmVnZXggdGhhdCBzcGxpdHMgb24gYm90aFxyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXFxyXFxuL2csICdcXG4nICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB0ZXh0LmluZGV4T2YoICdcXFxcXFxuJyApICE9PSAtIDEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGpvaW4gbGluZXMgc2VwYXJhdGVkIGJ5IGEgbGluZSBjb250aW51YXRpb24gY2hhcmFjdGVyIChcXClcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggL1xcXFxcXG4vZywgJycgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGluZXMgPSB0ZXh0LnNwbGl0KCAnXFxuJyApO1xyXG4gICAgICAgIHZhciBsaW5lID0gJycsIGxpbmVGaXJzdENoYXIgPSAnJywgbGluZVNlY29uZENoYXIgPSAnJztcclxuICAgICAgICB2YXIgbGluZUxlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICAvLyBGYXN0ZXIgdG8ganVzdCB0cmltIGxlZnQgc2lkZSBvZiB0aGUgbGluZS4gVXNlIGlmIGF2YWlsYWJsZS5cclxuICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgIC8vIHZhciB0cmltTGVmdCA9ICggdHlwZW9mICcnLnRyaW1MZWZ0ID09PSAnZnVuY3Rpb24nICk7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICBsaW5lID0gbGluZXNbIGkgXTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgICAgIC8vIGxpbmUgPSB0cmltTGVmdCA/IGxpbmUudHJpbUxlZnQoKSA6IGxpbmUudHJpbSgpO1xyXG4gICAgICAgICAgICBsaW5lID0gbGluZS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBsaW5lTGVuZ3RoID0gbGluZS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpbmVMZW5ndGggPT09IDAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGxpbmVGaXJzdENoYXIgPSBsaW5lLmNoYXJBdCggMCApO1xyXG5cclxuICAgICAgICAgICAgLy8gQHRvZG8gaW52b2tlIHBhc3NlZCBpbiBoYW5kbGVyIGlmIGFueVxyXG4gICAgICAgICAgICBpZiAoIGxpbmVGaXJzdENoYXIgPT09ICcjJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAndicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGluZVNlY29uZENoYXIgPSBsaW5lLmNoYXJBdCggMSApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbGluZVNlY29uZENoYXIgPT09ICcgJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnZlcnRleF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widiAxLjAgMi4wIDMuMFwiLCBcIjEuMFwiLCBcIjIuMFwiLCBcIjMuMFwiXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ24nICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAubm9ybWFsX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widm4gMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUubm9ybWFscy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ3QnICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAudXZfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgIDEgICAgICAyXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widnQgMC4xIDAuMlwiLCBcIjAuMVwiLCBcIjAuMlwiXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS51dnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgdmVydGV4L25vcm1hbC91diBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZUZpcnN0Q2hhciA9PT0gXCJmXCIgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4X3V2X25vcm1hbC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgICA3ICAgIDggICAgOSAgIDEwICAgICAgICAgMTEgICAgICAgICAxMlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcImYgMS8xLzEgMi8yLzIgMy8zLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDcgXSwgcmVzdWx0WyAxMCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgOCBdLCByZXN1bHRbIDExIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMyBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA5IF0sIHJlc3VsdFsgMTIgXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91di5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgIDcgICAgICAgICAgOFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcImYgMS8xIDIvMiAzLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvLzEgMi8vMiAzLy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAxICAgIDIgICAgMyAgIDRcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEgMiAzXCIsIFwiMVwiLCBcIjJcIiwgXCIzXCIsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMiBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA0IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGZhY2UgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwibFwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBsaW5lUGFydHMgPSBsaW5lLnN1YnN0cmluZyggMSApLnRyaW0oKS5zcGxpdCggXCIgXCIgKTtcclxuICAgICAgICAgICAgICAgIHZhciBsaW5lVmVydGljZXMgPSBbXSwgbGluZVVWcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbGluZS5pbmRleE9mKCBcIi9cIiApID09PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVWZXJ0aWNlcyA9IGxpbmVQYXJ0cztcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbGkgPSAwLCBsbGVuID0gbGluZVBhcnRzLmxlbmd0aDsgbGkgPCBsbGVuOyBsaSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IGxpbmVQYXJ0c1sgbGkgXS5zcGxpdCggXCIvXCIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcGFydHNbIDAgXSAhPT0gXCJcIiApIGxpbmVWZXJ0aWNlcy5wdXNoKCBwYXJ0c1sgMCBdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcGFydHNbIDEgXSAhPT0gXCJcIiApIGxpbmVVVnMucHVzaCggcGFydHNbIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkTGluZUdlb21ldHJ5KCBsaW5lVmVydGljZXMsIGxpbmVVVnMgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAub2JqZWN0X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbyBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgLy8gb3JcclxuICAgICAgICAgICAgICAgIC8vIGcgZ3JvdXBfbmFtZVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFdPUktBUk9VTkQ6IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTI4NjlcclxuICAgICAgICAgICAgICAgIC8vIHZhciBuYW1lID0gcmVzdWx0WyAwIF0uc3Vic3RyKCAxICkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAoIFwiIFwiICsgcmVzdWx0WyAwIF0uc3Vic3RyKCAxICkudHJpbSgpICkuc3Vic3RyKCAxICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUuc3RhcnRPYmplY3QoIG5hbWUgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX3VzZV9wYXR0ZXJuLnRlc3QoIGxpbmUgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYXRlcmlhbFxyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdC5zdGFydE1hdGVyaWFsKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSwgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX2xpYnJhcnlfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbXRsIGZpbGVcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcy5wdXNoKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5zbW9vdGhpbmdfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzbW9vdGggc2hhZGluZ1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEB0b2RvIEhhbmRsZSBmaWxlcyB0aGF0IGhhdmUgdmFyeWluZyBzbW9vdGggdmFsdWVzIGZvciBhIHNldCBvZiBmYWNlcyBpbnNpZGUgb25lIGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgLy8gYnV0IGRvZXMgbm90IGRlZmluZSBhIHVzZW10bCBmb3IgZWFjaCBmYWNlIHNldC5cclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGRldGVjdGVkIGFuZCBhIGR1bW15IG1hdGVyaWFsIGNyZWF0ZWQgKGxhdGVyIE11bHRpTWF0ZXJpYWwgYW5kIGdlb21ldHJ5IGdyb3VwcykuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHJlcXVpcmVzIHNvbWUgY2FyZSB0byBub3QgY3JlYXRlIGV4dHJhIG1hdGVyaWFsIG9uIGVhY2ggc21vb3RoIHZhbHVlIGZvciBcIm5vcm1hbFwiIG9iaiBmaWxlcy5cclxuICAgICAgICAgICAgICAgIC8vIHdoZXJlIGV4cGxpY2l0IHVzZW10bCBkZWZpbmVzIGdlb21ldHJ5IGdyb3Vwcy5cclxuICAgICAgICAgICAgICAgIC8vIEV4YW1wbGUgYXNzZXQ6IGV4YW1wbGVzL21vZGVscy9vYmovY2VyYmVydXMvQ2VyYmVydXMub2JqXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0WyAxIF0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogaHR0cDovL3BhdWxib3Vya2UubmV0L2RhdGFmb3JtYXRzL29iai9cclxuICAgICAgICAgICAgICAgICAqIG9yXHJcbiAgICAgICAgICAgICAgICAgKiBodHRwOi8vd3d3LmNzLnV0YWguZWR1L35ib3Vsb3MvY3MzNTA1L29ial9zcGVjLnBkZlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIEZyb20gY2hhcHRlciBcIkdyb3VwaW5nXCIgU3ludGF4IGV4cGxhbmF0aW9uIFwicyBncm91cF9udW1iZXJcIjpcclxuICAgICAgICAgICAgICAgICAqIFwiZ3JvdXBfbnVtYmVyIGlzIHRoZSBzbW9vdGhpbmcgZ3JvdXAgbnVtYmVyLiBUbyB0dXJuIG9mZiBzbW9vdGhpbmcgZ3JvdXBzLCB1c2UgYSB2YWx1ZSBvZiAwIG9yIG9mZi5cclxuICAgICAgICAgICAgICAgICAqIFBvbHlnb25hbCBlbGVtZW50cyB1c2UgZ3JvdXAgbnVtYmVycyB0byBwdXQgZWxlbWVudHMgaW4gZGlmZmVyZW50IHNtb290aGluZyBncm91cHMuIEZvciBmcmVlLWZvcm1cclxuICAgICAgICAgICAgICAgICAqIHN1cmZhY2VzLCBzbW9vdGhpbmcgZ3JvdXBzIGFyZSBlaXRoZXIgdHVybmVkIG9uIG9yIG9mZjsgdGhlcmUgaXMgbm8gZGlmZmVyZW5jZSBiZXR3ZWVuIHZhbHVlcyBncmVhdGVyXHJcbiAgICAgICAgICAgICAgICAgKiB0aGFuIDAuXCJcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgc3RhdGUub2JqZWN0LnNtb290aCA9ICggdmFsdWUgIT09ICcwJyAmJiB2YWx1ZSAhPT0gJ29mZicgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSBzdGF0ZS5vYmplY3QuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5zbW9vdGggPSBzdGF0ZS5vYmplY3Quc21vb3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIG51bGwgdGVybWluYXRlZCBmaWxlcyB3aXRob3V0IGV4Y2VwdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKCBsaW5lID09PSAnXFwwJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS5maW5hbGl6ZSgpO1xyXG5cclxuICAgICAgICB2YXIgY29udGFpbmVyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAvL2NvbnRhaW5lci5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuICAgICAgICAoPGFueT5jb250YWluZXIpLm1hdGVyaWFsTGlicmFyaWVzID0gW10uY29uY2F0KCBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcyApO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBzdGF0ZS5vYmplY3RzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gc3RhdGUub2JqZWN0c1sgaSBdO1xyXG4gICAgICAgICAgICB2YXIgZ2VvbWV0cnkgPSBvYmplY3QuZ2VvbWV0cnk7XHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbHMgPSBvYmplY3QubWF0ZXJpYWxzO1xyXG4gICAgICAgICAgICB2YXIgaXNMaW5lID0gKCBnZW9tZXRyeS50eXBlID09PSAnTGluZScgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNraXAgby9nIGxpbmUgZGVjbGFyYXRpb25zIHRoYXQgZGlkIG5vdCBmb2xsb3cgd2l0aCBhbnkgZmFjZXNcclxuICAgICAgICAgICAgaWYgKCBnZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGggPT09IDAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidWZmZXJnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cclxuICAgICAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS52ZXJ0aWNlcyApLCAzICkgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggZ2VvbWV0cnkubm9ybWFscy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ25vcm1hbCcsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5Lm5vcm1hbHMgKSwgMyApICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdlb21ldHJ5LnV2cy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3V2JywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudXZzICksIDIgKSApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1hdGVyaWFsc1xyXG4gICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAvL3ZhciBjcmVhdGVkTWF0ZXJpYWxzID0gW107ICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGNyZWF0ZWRNYXRlcmlhbHMgOiBUSFJFRS5NYXRlcmlhbFtdID0gW107ICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGZvciAoIHZhciBtaSA9IDAsIG1pTGVuID0gbWF0ZXJpYWxzLmxlbmd0aDsgbWkgPCBtaUxlbiA7IG1pKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWxzLmNyZWF0ZSggc291cmNlTWF0ZXJpYWwubmFtZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtdGwgZXRjLiBsb2FkZXJzIHByb2JhYmx5IGNhbid0IGNyZWF0ZSBsaW5lIG1hdGVyaWFscyBjb3JyZWN0bHksIGNvcHkgcHJvcGVydGllcyB0byBhIGxpbmUgbWF0ZXJpYWwuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpc0xpbmUgJiYgbWF0ZXJpYWwgJiYgISAoIG1hdGVyaWFsIGluc3RhbmNlb2YgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbExpbmUgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxMaW5lLmNvcHkoIG1hdGVyaWFsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gbWF0ZXJpYWxMaW5lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggISBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCkgOiBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoKSApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLm5hbWUgPSBzb3VyY2VNYXRlcmlhbC5uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5zaGFkaW5nID0gc291cmNlTWF0ZXJpYWwuc21vb3RoID8gVEhSRUUuU21vb3RoU2hhZGluZyA6IFRIUkVFLkZsYXRTaGFkaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRNYXRlcmlhbHMucHVzaChtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbWVzaFxyXG5cclxuICAgICAgICAgICAgdmFyIG1lc2g7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGNyZWF0ZWRNYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEdyb3VwKCBzb3VyY2VNYXRlcmlhbC5ncm91cFN0YXJ0LCBzb3VyY2VNYXRlcmlhbC5ncm91cENvdW50LCBtaSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgICAgICAgICAvL21lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzICkgOiBuZXcgVEhSRUUuTGluZVNlZ21lbnRzKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFscyApICk7XHJcbiAgICAgICAgICAgICAgICBtZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1swXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIG51bGwgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgLy9tZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1sgMCBdICkgOiBuZXcgVEhSRUUuTGluZVNlZ21lbnRzKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlTWF0ZXJpYWxzKSApO1xyXG4gICAgICAgICAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIG51bGwpICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1lc2gubmFtZSA9IG9iamVjdC5uYW1lO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLmFkZCggbWVzaCApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIi8qKlxuICogQGF1dGhvciBFYmVyaGFyZCBHcmFldGhlciAvIGh0dHA6Ly9lZ3JhZXRoZXIuY29tL1xuICogQGF1dGhvciBNYXJrIEx1bmRpbiBcdC8gaHR0cDovL21hcmstbHVuZGluLmNvbVxuICogQGF1dGhvciBTaW1vbmUgTWFuaW5pIC8gaHR0cDovL2Rhcm9uMTMzNy5naXRodWIuaW9cbiAqIEBhdXRob3IgTHVjYSBBbnRpZ2EgXHQvIGh0dHA6Ly9sYW50aWdhLmdpdGh1Yi5pb1xuICovXG5cbid1c2Ugc3RyaWN0JztcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFRyYWNrYmFsbENvbnRyb2xzICggb2JqZWN0LCBkb21FbGVtZW50ICkge1xuXG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cdHZhciBTVEFURSA9IHsgTk9ORTogLSAxLCBST1RBVEU6IDAsIFpPT006IDEsIFBBTjogMiwgVE9VQ0hfUk9UQVRFOiAzLCBUT1VDSF9aT09NX1BBTjogNCB9O1xuXG5cdHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuXHR0aGlzLmRvbUVsZW1lbnQgPSAoIGRvbUVsZW1lbnQgIT09IHVuZGVmaW5lZCApID8gZG9tRWxlbWVudCA6IGRvY3VtZW50O1xuXG5cdC8vIEFQSVxuXG5cdHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cblx0dGhpcy5zY3JlZW4gPSB7IGxlZnQ6IDAsIHRvcDogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xuXG5cdHRoaXMucm90YXRlU3BlZWQgPSAxLjA7XG5cdHRoaXMuem9vbVNwZWVkID0gMS4yO1xuXHR0aGlzLnBhblNwZWVkID0gMC4zO1xuXG5cdHRoaXMubm9Sb3RhdGUgPSBmYWxzZTtcblx0dGhpcy5ub1pvb20gPSBmYWxzZTtcblx0dGhpcy5ub1BhbiA9IGZhbHNlO1xuXG5cdHRoaXMuc3RhdGljTW92aW5nID0gdHJ1ZTtcblx0dGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMjtcblxuXHR0aGlzLm1pbkRpc3RhbmNlID0gMDtcblx0dGhpcy5tYXhEaXN0YW5jZSA9IEluZmluaXR5O1xuXG5cdHRoaXMua2V5cyA9IFsgNjUgLypBKi8sIDgzIC8qUyovLCA2OCAvKkQqLyBdO1xuXG5cdC8vIGludGVybmFsc1xuXG5cdHRoaXMudGFyZ2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHR2YXIgRVBTID0gMC4wMDAwMDE7XG5cblx0dmFyIGxhc3RQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0dmFyIF9zdGF0ZSA9IFNUQVRFLk5PTkUsXG5cdF9wcmV2U3RhdGUgPSBTVEFURS5OT05FLFxuXG5cdF9leWUgPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXG5cdF9tb3ZlUHJldiA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF9tb3ZlQ3VyciA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cblx0X2xhc3RBeGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0X2xhc3RBbmdsZSA9IDAsXG5cblx0X3pvb21TdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF96b29tRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblxuXHRfdG91Y2hab29tRGlzdGFuY2VTdGFydCA9IDAsXG5cdF90b3VjaFpvb21EaXN0YW5jZUVuZCA9IDAsXG5cblx0X3BhblN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblx0X3BhbkVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0Ly8gZm9yIHJlc2V0XG5cblx0dGhpcy50YXJnZXQwID0gdGhpcy50YXJnZXQuY2xvbmUoKTtcblx0dGhpcy5wb3NpdGlvbjAgPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHR0aGlzLnVwMCA9IHRoaXMub2JqZWN0LnVwLmNsb25lKCk7XG5cblx0Ly8gZXZlbnRzXG5cblx0dmFyIGNoYW5nZUV2ZW50ID0geyB0eXBlOiAnY2hhbmdlJyB9O1xuXHR2YXIgc3RhcnRFdmVudCA9IHsgdHlwZTogJ3N0YXJ0JyB9O1xuXHR2YXIgZW5kRXZlbnQgPSB7IHR5cGU6ICdlbmQnIH07XG5cblxuXHQvLyBtZXRob2RzXG5cblx0dGhpcy5oYW5kbGVSZXNpemUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHRoaXMuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgKSB7XG5cblx0XHRcdHRoaXMuc2NyZWVuLmxlZnQgPSAwO1xuXHRcdFx0dGhpcy5zY3JlZW4udG9wID0gMDtcblx0XHRcdHRoaXMuc2NyZWVuLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0XHR0aGlzLnNjcmVlbi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgYm94ID0gdGhpcy5kb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0Ly8gYWRqdXN0bWVudHMgY29tZSBmcm9tIHNpbWlsYXIgY29kZSBpbiB0aGUganF1ZXJ5IG9mZnNldCgpIGZ1bmN0aW9uXG5cdFx0XHR2YXIgZCA9IHRoaXMuZG9tRWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0XHRcdHRoaXMuc2NyZWVuLmxlZnQgPSBib3gubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCAtIGQuY2xpZW50TGVmdDtcblx0XHRcdHRoaXMuc2NyZWVuLnRvcCA9IGJveC50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQgLSBkLmNsaWVudFRvcDtcblx0XHRcdHRoaXMuc2NyZWVuLndpZHRoID0gYm94LndpZHRoO1xuXHRcdFx0dGhpcy5zY3JlZW4uaGVpZ2h0ID0gYm94LmhlaWdodDtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCB0eXBlb2YgdGhpc1sgZXZlbnQudHlwZSBdID09PSAnZnVuY3Rpb24nICkge1xuXG5cdFx0XHR0aGlzWyBldmVudC50eXBlIF0oIGV2ZW50ICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2YXIgZ2V0TW91c2VPblNjcmVlbiA9ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gZ2V0TW91c2VPblNjcmVlbiggcGFnZVgsIHBhZ2VZICkge1xuXG5cdFx0XHR2ZWN0b3Iuc2V0KFxuXHRcdFx0XHQoIHBhZ2VYIC0gX3RoaXMuc2NyZWVuLmxlZnQgKSAvIF90aGlzLnNjcmVlbi53aWR0aCxcblx0XHRcdFx0KCBwYWdlWSAtIF90aGlzLnNjcmVlbi50b3AgKSAvIF90aGlzLnNjcmVlbi5oZWlnaHRcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB2ZWN0b3I7XG5cblx0XHR9O1xuXG5cdH0oKSApO1xuXG5cdHZhciBnZXRNb3VzZU9uQ2lyY2xlID0gKCBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiBnZXRNb3VzZU9uQ2lyY2xlKCBwYWdlWCwgcGFnZVkgKSB7XG5cblx0XHRcdHZlY3Rvci5zZXQoXG5cdFx0XHRcdCggKCBwYWdlWCAtIF90aGlzLnNjcmVlbi53aWR0aCAqIDAuNSAtIF90aGlzLnNjcmVlbi5sZWZ0ICkgLyAoIF90aGlzLnNjcmVlbi53aWR0aCAqIDAuNSApICksXG5cdFx0XHRcdCggKCBfdGhpcy5zY3JlZW4uaGVpZ2h0ICsgMiAqICggX3RoaXMuc2NyZWVuLnRvcCAtIHBhZ2VZICkgKSAvIF90aGlzLnNjcmVlbi53aWR0aCApIC8vIHNjcmVlbi53aWR0aCBpbnRlbnRpb25hbFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHZlY3RvcjtcblxuXHRcdH07XG5cblx0fSgpICk7XG5cblx0dGhpcy5yb3RhdGVDYW1lcmEgPSAoIGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIGF4aXMgPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0cXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCksXG5cdFx0XHRleWVEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0b2JqZWN0VXBEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0bW92ZURpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRhbmdsZTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiByb3RhdGVDYW1lcmEoKSB7XG5cblx0XHRcdG1vdmVEaXJlY3Rpb24uc2V0KCBfbW92ZUN1cnIueCAtIF9tb3ZlUHJldi54LCBfbW92ZUN1cnIueSAtIF9tb3ZlUHJldi55LCAwICk7XG5cdFx0XHRhbmdsZSA9IG1vdmVEaXJlY3Rpb24ubGVuZ3RoKCk7XG5cblx0XHRcdGlmICggYW5nbGUgKSB7XG5cblx0XHRcdFx0X2V5ZS5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKS5zdWIoIF90aGlzLnRhcmdldCApO1xuXG5cdFx0XHRcdGV5ZURpcmVjdGlvbi5jb3B5KCBfZXllICkubm9ybWFsaXplKCk7XG5cdFx0XHRcdG9iamVjdFVwRGlyZWN0aW9uLmNvcHkoIF90aGlzLm9iamVjdC51cCApLm5vcm1hbGl6ZSgpO1xuXHRcdFx0XHRvYmplY3RTaWRld2F5c0RpcmVjdGlvbi5jcm9zc1ZlY3RvcnMoIG9iamVjdFVwRGlyZWN0aW9uLCBleWVEaXJlY3Rpb24gKS5ub3JtYWxpemUoKTtcblxuXHRcdFx0XHRvYmplY3RVcERpcmVjdGlvbi5zZXRMZW5ndGgoIF9tb3ZlQ3Vyci55IC0gX21vdmVQcmV2LnkgKTtcblx0XHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24uc2V0TGVuZ3RoKCBfbW92ZUN1cnIueCAtIF9tb3ZlUHJldi54ICk7XG5cblx0XHRcdFx0bW92ZURpcmVjdGlvbi5jb3B5KCBvYmplY3RVcERpcmVjdGlvbi5hZGQoIG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uICkgKTtcblxuXHRcdFx0XHRheGlzLmNyb3NzVmVjdG9ycyggbW92ZURpcmVjdGlvbiwgX2V5ZSApLm5vcm1hbGl6ZSgpO1xuXG5cdFx0XHRcdGFuZ2xlICo9IF90aGlzLnJvdGF0ZVNwZWVkO1xuXHRcdFx0XHRxdWF0ZXJuaW9uLnNldEZyb21BeGlzQW5nbGUoIGF4aXMsIGFuZ2xlICk7XG5cblx0XHRcdFx0X2V5ZS5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblx0XHRcdFx0X3RoaXMub2JqZWN0LnVwLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXG5cdFx0XHRcdF9sYXN0QXhpcy5jb3B5KCBheGlzICk7XG5cdFx0XHRcdF9sYXN0QW5nbGUgPSBhbmdsZTtcblxuXHRcdFx0fSBlbHNlIGlmICggISBfdGhpcy5zdGF0aWNNb3ZpbmcgJiYgX2xhc3RBbmdsZSApIHtcblxuXHRcdFx0XHRfbGFzdEFuZ2xlICo9IE1hdGguc3FydCggMS4wIC0gX3RoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgKTtcblx0XHRcdFx0X2V5ZS5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKS5zdWIoIF90aGlzLnRhcmdldCApO1xuXHRcdFx0XHRxdWF0ZXJuaW9uLnNldEZyb21BeGlzQW5nbGUoIF9sYXN0QXhpcywgX2xhc3RBbmdsZSApO1xuXHRcdFx0XHRfZXllLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXHRcdFx0XHRfdGhpcy5vYmplY3QudXAuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cblx0XHRcdH1cblxuXHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXG5cdFx0fTtcblxuXHR9KCkgKTtcblxuXG5cdHRoaXMuem9vbUNhbWVyYSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciBmYWN0b3I7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuVE9VQ0hfWk9PTV9QQU4gKSB7XG5cblx0XHRcdGZhY3RvciA9IF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0IC8gX3RvdWNoWm9vbURpc3RhbmNlRW5kO1xuXHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSBfdG91Y2hab29tRGlzdGFuY2VFbmQ7XG5cdFx0XHRfZXllLm11bHRpcGx5U2NhbGFyKCBmYWN0b3IgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGZhY3RvciA9IDEuMCArICggX3pvb21FbmQueSAtIF96b29tU3RhcnQueSApICogX3RoaXMuem9vbVNwZWVkO1xuXG5cdFx0XHRpZiAoIGZhY3RvciAhPT0gMS4wICYmIGZhY3RvciA+IDAuMCApIHtcblxuXHRcdFx0XHRfZXllLm11bHRpcGx5U2NhbGFyKCBmYWN0b3IgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIF90aGlzLnN0YXRpY01vdmluZyApIHtcblxuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0X3pvb21TdGFydC55ICs9ICggX3pvb21FbmQueSAtIF96b29tU3RhcnQueSApICogdGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvcjtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5wYW5DYW1lcmEgPSAoIGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIG1vdXNlQ2hhbmdlID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblx0XHRcdG9iamVjdFVwID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdHBhbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gcGFuQ2FtZXJhKCkge1xuXG5cdFx0XHRtb3VzZUNoYW5nZS5jb3B5KCBfcGFuRW5kICkuc3ViKCBfcGFuU3RhcnQgKTtcblxuXHRcdFx0aWYgKCBtb3VzZUNoYW5nZS5sZW5ndGhTcSgpICkge1xuXG5cdFx0XHRcdG1vdXNlQ2hhbmdlLm11bHRpcGx5U2NhbGFyKCBfZXllLmxlbmd0aCgpICogX3RoaXMucGFuU3BlZWQgKTtcblxuXHRcdFx0XHRwYW4uY29weSggX2V5ZSApLmNyb3NzKCBfdGhpcy5vYmplY3QudXAgKS5zZXRMZW5ndGgoIG1vdXNlQ2hhbmdlLnggKTtcblx0XHRcdFx0cGFuLmFkZCggb2JqZWN0VXAuY29weSggX3RoaXMub2JqZWN0LnVwICkuc2V0TGVuZ3RoKCBtb3VzZUNoYW5nZS55ICkgKTtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkKCBwYW4gKTtcblx0XHRcdFx0X3RoaXMudGFyZ2V0LmFkZCggcGFuICk7XG5cblx0XHRcdFx0aWYgKCBfdGhpcy5zdGF0aWNNb3ZpbmcgKSB7XG5cblx0XHRcdFx0XHRfcGFuU3RhcnQuY29weSggX3BhbkVuZCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRfcGFuU3RhcnQuYWRkKCBtb3VzZUNoYW5nZS5zdWJWZWN0b3JzKCBfcGFuRW5kLCBfcGFuU3RhcnQgKS5tdWx0aXBseVNjYWxhciggX3RoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgKSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH0oKSApO1xuXG5cdHRoaXMuY2hlY2tEaXN0YW5jZXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoICEgX3RoaXMubm9ab29tIHx8ICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdGlmICggX2V5ZS5sZW5ndGhTcSgpID4gX3RoaXMubWF4RGlzdGFuY2UgKiBfdGhpcy5tYXhEaXN0YW5jZSApIHtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllLnNldExlbmd0aCggX3RoaXMubWF4RGlzdGFuY2UgKSApO1xuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBfZXllLmxlbmd0aFNxKCkgPCBfdGhpcy5taW5EaXN0YW5jZSAqIF90aGlzLm1pbkRpc3RhbmNlICkge1xuXG5cdFx0XHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5hZGRWZWN0b3JzKCBfdGhpcy50YXJnZXQsIF9leWUuc2V0TGVuZ3RoKCBfdGhpcy5taW5EaXN0YW5jZSApICk7XG5cdFx0XHRcdF96b29tU3RhcnQuY29weSggX3pvb21FbmQgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfZXllLnN1YlZlY3RvcnMoIF90aGlzLm9iamVjdC5wb3NpdGlvbiwgX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRpZiAoICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF90aGlzLnJvdGF0ZUNhbWVyYSgpO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3RoaXMuem9vbUNhbWVyYSgpO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfdGhpcy5wYW5DYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5hZGRWZWN0b3JzKCBfdGhpcy50YXJnZXQsIF9leWUgKTtcblxuXHRcdF90aGlzLmNoZWNrRGlzdGFuY2VzKCk7XG5cblx0XHRfdGhpcy5vYmplY3QubG9va0F0KCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdGlmICggbGFzdFBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKCBfdGhpcy5vYmplY3QucG9zaXRpb24gKSA+IEVQUyApIHtcblxuXHRcdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggY2hhbmdlRXZlbnQgKTtcblxuXHRcdFx0bGFzdFBvc2l0aW9uLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF9zdGF0ZSA9IFNUQVRFLk5PTkU7XG5cdFx0X3ByZXZTdGF0ZSA9IFNUQVRFLk5PTkU7XG5cblx0XHRfdGhpcy50YXJnZXQuY29weSggX3RoaXMudGFyZ2V0MCApO1xuXHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5jb3B5KCBfdGhpcy5wb3NpdGlvbjAgKTtcblx0XHRfdGhpcy5vYmplY3QudXAuY29weSggX3RoaXMudXAwICk7XG5cblx0XHRfZXllLnN1YlZlY3RvcnMoIF90aGlzLm9iamVjdC5wb3NpdGlvbiwgX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRfdGhpcy5vYmplY3QubG9va0F0KCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cblx0XHRsYXN0UG9zaXRpb24uY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICk7XG5cblx0fTtcblxuXHQvLyBsaXN0ZW5lcnNcblxuXHRmdW5jdGlvbiBrZXlkb3duKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duICk7XG5cblx0XHRfcHJldlN0YXRlID0gX3N0YXRlO1xuXG5cdFx0aWYgKCBfc3RhdGUgIT09IFNUQVRFLk5PTkUgKSB7XG5cblx0XHRcdHJldHVybjtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlJPVEFURSBdICYmICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlJPVEFURTtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlpPT00gXSAmJiAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3N0YXRlID0gU1RBVEUuWk9PTTtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlBBTiBdICYmICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlBBTjtcblxuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24ga2V5dXAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdF9zdGF0ZSA9IF9wcmV2U3RhdGU7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duLCBmYWxzZSApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZWRvd24oIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuTk9ORSApIHtcblxuXHRcdFx0X3N0YXRlID0gZXZlbnQuYnV0dG9uO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLlJPVEFURSAmJiAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuWk9PTSAmJiAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3pvb21TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXHRcdFx0X3pvb21FbmQuY29weSggX3pvb21TdGFydCApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5QQU4gJiYgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3BhblN0YXJ0LmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cdFx0XHRfcGFuRW5kLmNvcHkoIF9wYW5TdGFydCApO1xuXG5cdFx0fVxuXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIG1vdXNlbW92ZSwgZmFsc2UgKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG1vdXNldXAsIGZhbHNlICk7XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBzdGFydEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlbW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5ST1RBVEUgJiYgISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlpPT00gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF96b29tRW5kLmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlBBTiAmJiAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfcGFuRW5kLmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNldXAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIG1vdXNlbW92ZSApO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgbW91c2V1cCApO1xuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGVuZEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNld2hlZWwoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRzd2l0Y2ggKCBldmVudC5kZWx0YU1vZGUgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWm9vbSBpbiBwYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfem9vbVN0YXJ0LnkgLT0gZXZlbnQuZGVsdGFZICogMC4wMjU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG5cdFx0XHRjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpvb20gaW4gbGluZXNcblx0XHRcdFx0X3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDE7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHQvLyB1bmRlZmluZWQsIDAsIGFzc3VtZSBwaXhlbHNcblx0XHRcdFx0X3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDAwMjU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggc3RhcnRFdmVudCApO1xuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGVuZEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNoc3RhcnQoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoICkge1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdF9zdGF0ZSA9IFNUQVRFLlRPVUNIX1JPVEFURTtcblx0XHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICkgKTtcblx0XHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDogLy8gMiBvciBtb3JlXG5cdFx0XHRcdF9zdGF0ZSA9IFNUQVRFLlRPVUNIX1pPT01fUEFOO1xuXHRcdFx0XHR2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG5cdFx0XHRcdHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcblx0XHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlRW5kID0gX3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSBNYXRoLnNxcnQoIGR4ICogZHggKyBkeSAqIGR5ICk7XG5cblx0XHRcdFx0dmFyIHggPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWCApIC8gMjtcblx0XHRcdFx0dmFyIHkgPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWSApIC8gMjtcblx0XHRcdFx0X3BhblN0YXJ0LmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIHgsIHkgKSApO1xuXHRcdFx0XHRfcGFuRW5kLmNvcHkoIF9wYW5TdGFydCApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIHN0YXJ0RXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gdG91Y2htb3ZlKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0c3dpdGNoICggZXZlbnQudG91Y2hlcy5sZW5ndGggKSB7XG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKSApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDogLy8gMiBvciBtb3JlXG5cdFx0XHRcdHZhciBkeCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWDtcblx0XHRcdFx0dmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xuXHRcdFx0XHRfdG91Y2hab29tRGlzdGFuY2VFbmQgPSBNYXRoLnNxcnQoIGR4ICogZHggKyBkeSAqIGR5ICk7XG5cblx0XHRcdFx0dmFyIHggPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWCApIC8gMjtcblx0XHRcdFx0dmFyIHkgPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWSApIC8gMjtcblx0XHRcdFx0X3BhbkVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCB4LCB5ICkgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNoZW5kKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKCBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcblxuXHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9ST1RBVEU7XG5cdFx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSApICk7XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBjb250ZXh0bWVudSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHR9XG5cblx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NvbnRleHRtZW51JywgY29udGV4dG1lbnUsIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBtb3VzZWRvd24sIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd3aGVlbCcsIG1vdXNld2hlZWwsIGZhbHNlICk7XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaHN0YXJ0LCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIHRvdWNobW92ZSwgZmFsc2UgKTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUsIGZhbHNlICk7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBtb3VzZXVwLCBmYWxzZSApO1xuXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleXVwJywga2V5dXAsIGZhbHNlICk7XG5cblx0fTtcblxuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2NvbnRleHRtZW51JywgY29udGV4dG1lbnUsIGZhbHNlICk7IFxuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIG1vdXNlZG93biwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd3aGVlbCcsIG1vdXNld2hlZWwsIGZhbHNlICk7XG5cblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaGVuZCcsIHRvdWNoZW5kLCBmYWxzZSApO1xuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIHRvdWNobW92ZSwgZmFsc2UgKTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duLCBmYWxzZSApO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleXVwJywga2V5dXAsIGZhbHNlICk7XG5cblx0dGhpcy5oYW5kbGVSZXNpemUoKTtcblxuXHQvLyBmb3JjZSBhbiB1cGRhdGUgYXQgc3RhcnRcblx0dGhpcy51cGRhdGUoKTtcblxufVxuXG5UcmFja2JhbGxDb250cm9scy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBUSFJFRS5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlICk7XG5UcmFja2JhbGxDb250cm9scy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUcmFja2JhbGxDb250cm9scztcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcbiAgICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGVyaWFsc1xyXG4gKiBHZW5lcmFsIFRIUkVFLmpzIE1hdGVyaWFsIGNsYXNzZXMgYW5kIGhlbHBlcnNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBNYXRlcmlhbHNcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdGV4dHVyZSBtYXRlcmlhbCBmcm9tIGFuIGltYWdlIFVSTC5cclxuICAgICAqIEBwYXJhbSBpbWFnZSBJbWFnZSB0byB1c2UgaW4gdGV4dHVyZS5cclxuICAgICAqIEByZXR1cm5zIFRleHR1cmUgbWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVUZXh0dXJlTWF0ZXJpYWwgKGltYWdlIDogSFRNTEltYWdlRWxlbWVudCkgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0ZXh0dXJlICAgICAgICAgOiBUSFJFRS5UZXh0dXJlLFxyXG4gICAgICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShpbWFnZSk7XHJcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSAgICAgPSB0cnVlO1xyXG4gICAgICAgIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIG1hZ25pZmljYXRpb24gYW5kIG1pbmlmaWNhdGlvbiBmaWx0ZXJzIHNhbXBsZSB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMgd2hlbiBtYXBwaW5nIHRvIGEgcGl4ZWwuXHJcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIGRlZmF1bHQgbW9kZXMgb3ZlcnNhbXBsZSB3aGljaCBsZWFkcyB0byBibGVuZGluZyB3aXRoIHRoZSBibGFjayBiYWNrZ3JvdW5kLiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHByb2R1Y2VzIGNvbG9yZWQgKGJsYWNrKSBhcnRpZmFjdHMgYXJvdW5kIHRoZSBlZGdlcyBvZiB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMuXHJcbiAgICAgICAgdGV4dHVyZS5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAsIDEuMCk7XHJcblxyXG4gICAgICAgIHRleHR1cmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge21hcDogdGV4dHVyZX0gKTtcclxuICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGV4dHVyZU1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIENyZWF0ZSBhIGJ1bXAgbWFwIFBob25nIG1hdGVyaWFsIGZyb20gYSB0ZXh0dXJlIG1hcC5cclxuICAgICAqIEBwYXJhbSBkZXNpZ25UZXh0dXJlIEJ1bXAgbWFwIHRleHR1cmUuXHJcbiAgICAgKiBAcmV0dXJucyBQaG9uZyBidW1wIG1hcHBlZCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZU1lc2hQaG9uZ01hdGVyaWFsKGRlc2lnblRleHR1cmUgOiBUSFJFRS5UZXh0dXJlKSAgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgIGNvbG9yICAgOiAweGZmZmZmZixcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBidW1wTWFwICAgOiBkZXNpZ25UZXh0dXJlLFxyXG4gICAgICAgICAgICBidW1wU2NhbGUgOiAtMS4wLFxyXG5cclxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuU21vb3RoU2hhZGluZyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdHJhbnNwYXJlbnQgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBUcmFuc3BhcmVudCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVRyYW5zcGFyZW50TWF0ZXJpYWwoKSAgOiBUSFJFRS5NYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yIDogMHgwMDAwMDAsIG9wYWNpdHkgOiAwLjAsIHRyYW5zcGFyZW50IDogdHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuaW1wb3J0IHtDYW1lcmEsIENhbWVyYVNldHRpbmdzLCBTdGFuZGFyZFZpZXd9ICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICAgICAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRlcmlhbHN9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTWF0ZXJpYWxzJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuXHJcbmNvbnN0IE9iamVjdE5hbWVzID0ge1xyXG4gICAgUm9vdCA6ICAnUm9vdCdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9WaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBWaWV3ZXIge1xyXG5cclxuICAgIF9zY2VuZSAgICAgICAgICAgICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgICA9IG51bGw7XHJcbiAgICBfcm9vdCAgICAgICAgICAgICAgICAgICA6IFRIUkVFLk9iamVjdDNEICAgICAgICAgICAgPSBudWxsOyAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgX3JlbmRlcmVyICAgICAgICAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlcmVyICAgICAgID0gbnVsbDs7XHJcbiAgICBfY2FudmFzICAgICAgICAgICAgICAgICA6IEhUTUxDYW52YXNFbGVtZW50ICAgICAgICAgPSBudWxsO1xyXG4gICAgX3dpZHRoICAgICAgICAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgID0gMDtcclxuICAgIF9oZWlnaHQgICAgICAgICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgICA9IDA7XHJcblxyXG4gICAgX2NhbWVyYSAgICAgICAgICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSAgID0gbnVsbDtcclxuICAgIF9kZWZhdWx0Q2FtZXJhU2V0dGluZ3MgIDogQ2FtZXJhU2V0dGluZ3MgICAgICAgICAgICA9IG51bGw7XHJcblxyXG4gICAgX2NvbnRyb2xzICAgICAgICAgICAgICAgOiBUcmFja2JhbGxDb250cm9scyAgICAgICAgID0gbnVsbDtcclxuXHJcbiAgICBfbG9nZ2VyICAgICAgICAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICAgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIFZpZXdlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvQmluZFRvIEhUTUwgZWxlbWVudCB0byBob3N0IHRoZSB2aWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGVsQ2FudmFzSWQgOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBHcmFwaGljcy5pbml0aWFsaXplQ2FudmFzKG1vZGVsQ2FudmFzSWQpO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoICA9IHRoaXMuX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLl9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBhY3RpdmUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldCBtb2RlbCgpIDogVEhSRUUuR3JvdXAge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGFjdGl2ZSBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB2YWx1ZSBOZXcgbW9kZWwgdG8gYWN0aXZhdGUuXHJcbiAgICAgKi9cclxuICAgIHNldCBtb2RlbCh2YWx1ZSA6IFRIUkVFLkdyb3VwKSB7XHJcbiBcclxuICAgICAgICBHcmFwaGljcy5yZW1vdmVPYmplY3RDaGlsZHJlbih0aGlzLl9yb290LCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQodmFsdWUpO1xyXG5cclxuICAgICAgICB0aGlzLnNldENhbWVyYVRvU3RhbmRhcmRWaWV3KFN0YW5kYXJkVmlldy5Gcm9udCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGNhbnZhcyBhZmVyIGEgd2luZG93IHJlc2l6ZVxyXG4gICAgICovXHJcbiAgICBnZXQgYXNwZWN0UmF0aW8oKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBhc3BlY3RSYXRpbyA6IG51bWJlciA9IHRoaXMuX3dpZHRoIC8gdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgIHJldHVybiBhc3BlY3RSYXRpbztcclxuICAgIH0gXHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHRlc3Qgc3BoZXJlIHRvIGEgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHBvcHVsYXRlU2NlbmUgKCkge1xyXG5cclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVNwaGVyZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMoKSwgMik7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIFNjZW5lXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVSb290KCk7XHJcblxyXG4gICAgICAgIHRoaXMucG9wdWxhdGVTY2VuZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgV2ViR0wgcmVuZGVyZXIuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVSZW5kZXJlciAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xyXG5cclxuICAgICAgICAgICAgbG9nYXJpdGhtaWNEZXB0aEJ1ZmZlciAgOiBmYWxzZSxcclxuICAgICAgICAgICAgY2FudmFzICAgICAgICAgICAgICAgICAgOiB0aGlzLl9jYW52YXMsXHJcbiAgICAgICAgICAgIGFudGlhbGlhcyAgICAgICAgICAgICAgIDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmF1dG9DbGVhciA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDAwMDAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVEZWZhdWx0Q2FtZXJhU2V0dGluZ3MgKCkgOiBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgICAgIHJldHVybiBDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3U2V0dGluZ3ModGhpcy5tb2RlbCwgU3RhbmRhcmRWaWV3LkZyb250LCB0aGlzLmFzcGVjdFJhdGlvKTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlld2VyIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhKCkge1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzID0gdGhpcy5pbml0aWFsaXplRGVmYXVsdENhbWVyYVNldHRpbmdzKCk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKHRoaXMuX2RlZmF1bHRDYW1lcmFTZXR0aW5ncy5maWVsZE9mVmlldywgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzLm5lYXIsIHRoaXMuX2RlZmF1bHRDYW1lcmFTZXR0aW5ncy5mYXIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc2V0Q2FtZXJhVG9EZWZhdWx0U2V0dGluZ3MoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVMaWdodGluZygpIHtcclxuXHJcbiAgICAgICAgbGV0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg0MDQwNDApO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEMwQzA5MCk7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDEucG9zaXRpb24uc2V0KC0xMDAsIC01MCwgMTAwKTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDIgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEMwQzA5MCk7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDIucG9zaXRpb24uc2V0KDEwMCwgNTAsIC0xMDApO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0Mik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSB1c2VyIGlucHV0IGNvbnRyb2xzIChUcmFja2JhbGwpXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVJbnB1dENvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scyA9IG5ldyBUcmFja2JhbGxDb250cm9scyh0aGlzLl9jYW1lcmEsIHRoaXMuX3JlbmRlcmVyLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyBOLkIuIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMzI1MDk1L3RocmVlanMtY2FtZXJhLWxvb2thdC1oYXMtbm8tZWZmZWN0LWlzLXRoZXJlLXNvbWV0aGluZy1pbS1kb2luZy13cm9uZ1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLnBvc2l0aW9uMC5jb3B5KHRoaXMuX2NhbWVyYS5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbHMudGFyZ2V0LmNvcHkodGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSBrZXlib2FyZCBzaG9ydGN1dHMuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVLZXlib2FyZFNob3J0Y3V0cygpIHtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQgOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAvLyBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2phdmFzY3JpcHQvamF2YXNjcmlwdC1rZXljb2Rlcy9cclxuICAgICAgICAgICAgbGV0IGtleUNvZGUgOiBudW1iZXIgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDcwOiAgICAgICAgICAgICAgICAvLyBGICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2V0dGluZ3MgOiBDYW1lcmFTZXR0aW5ncyA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdTZXR0aW5ncyh0aGlzLm1vZGVsLCBTdGFuZGFyZFZpZXcuRnJvbnQsIHRoaXMuYXNwZWN0UmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlDYW1lcmFTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgc2NlbmUgd2l0aCB0aGUgYmFzZSBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemUgKCkge1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2FtZXJhKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGlnaHRpbmcoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVJbnB1dENvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplS2V5Ym9hcmRTaG9ydGN1dHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZVdpbmRvdygpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplV2luZG93LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2NlbmVcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc2NlbmUgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBjbGVhckFsbEFzc2VzdHMoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4odGhpcy5fcm9vdCwgZmFsc2UpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIHJvb3Qgb2JqZWN0IGluIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVSb290KCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5uYW1lID0gT2JqZWN0TmFtZXMuUm9vdDtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQodGhpcy5fcm9vdCk7XHJcbiAgICB9XHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBDYW1lcmFcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXNldHMgYWxsIGNhbWVyYSBwcm9wZXJ0aWVzIHRvIHRoZSBkZWZhdWx0c1xyXG4gICAgICogQHBhcmFtIHtDYW1lcmFTZXR0aW5nc30gc2V0dGluZ3MgU2V0dGluZ3MgdG8gYXBwbHkgdG8gY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBhcHBseUNhbWVyYVNldHRpbmdzKHNldHRpbmdzIDogQ2FtZXJhU2V0dGluZ3MpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9jYW1lcmEucG9zaXRpb24uY29weShzZXR0aW5ncy5wb3NpdGlvbik7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5sb29rQXQoc2V0dGluZ3MudGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl9jYW1lcmEubmVhciA9IHNldHRpbmdzLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLmZhciAgPSBzZXR0aW5ncy5mYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLmZvdiAgPSBzZXR0aW5ncy5maWVsZE9mVmlldztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9jYW1lcmEudXAuc2V0KDAsIDEsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbWVyYU9uV2luZG93UmVzaXplKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSW5wdXRDb250cm9scygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBTZXRzIHRoZSB2aWV3IGNhbWVyYSBwcm9wZXJ0aWVzIHRvIHRoZSBnaXZlbiBzZXR0aW5ncy5cclxuICAgICAqIEBwYXJhbSB7U3RhbmRhcmRWaWV3fSB2aWV3IENhbWVyYSBzZXR0aW5ncyB0byBhcHBseS5cclxuICAgICAqL1xyXG4gICAgc2V0Q2FtZXJhVG9TdGFuZGFyZFZpZXcodmlldyA6IFN0YW5kYXJkVmlldykge1xyXG5cclxuICAgICAgICB0aGlzLl9kZWZhdWx0Q2FtZXJhU2V0dGluZ3MgPSBDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3U2V0dGluZ3ModGhpcy5tb2RlbCwgdmlldywgdGhpcy5hc3BlY3RSYXRpbyk7XHJcbiAgICAgICAgdGhpcy5yZXNldENhbWVyYVRvRGVmYXVsdFNldHRpbmdzKCk7XHJcbiAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVzZXRzIGFsbCBjYW1lcmEgcHJvcGVydGllcyB0byB0aGUgZGVmYXVsdHMuXHJcbiAgICAgKi9cclxuICAgIHJlc2V0Q2FtZXJhVG9EZWZhdWx0U2V0dGluZ3MoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hcHBseUNhbWVyYVNldHRpbmdzICh0aGlzLl9kZWZhdWx0Q2FtZXJhU2V0dGluZ3MpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBXaW5kb3cgUmVzaXplXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHNjZW5lIGNhbWVyYSB0byBtYXRjaCB0aGUgbmV3IHdpbmRvdyBzaXplXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUNhbWVyYU9uV2luZG93UmVzaXplKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmEuYXNwZWN0ID0gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAvLyB0aGlzLl9jYW1lcmEubG9va0F0KHRoaXMuX2RlZmF1bHRDYW1lcmFTZXR0aW5ncy50YXJnZXQpO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIHRoZSBXZWJHTCBwcm9jZXNzaW5nIGZvciBhIERPTSB3aW5kb3cgJ3Jlc2l6ZScgZXZlbnRcclxuICAgICAqL1xyXG4gICAgcmVzaXplRGlzcGxheVdlYkdMKCkge1xyXG5cclxuICAgICAgICB0aGlzLl93aWR0aCA9ICB0aGlzLl9jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5fY2FudmFzLm9mZnNldEhlaWdodDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTaXplKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udHJvbHMuaGFuZGxlUmVzaXplKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYW1lcmFPbldpbmRvd1Jlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlcyBhIHdpbmRvdyByZXNpemUgZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25SZXNpemVXaW5kb3cgKCkge1xyXG5cclxuICAgICAgICB0aGlzLnJlc2l6ZURpc3BsYXlXZWJHTCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBSZW5kZXIgTG9vcFxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtcyB0aGUgV2ViR0wgcmVuZGVyIG9mIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICByZW5kZXJXZWJHTCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udHJvbHMudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVuZGVyKHRoaXMuX3NjZW5lLCB0aGlzLl9jYW1lcmEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpbiBET00gcmVuZGVyIGxvb3BcclxuICAgICAqL1xyXG4gICAgYW5pbWF0ZSgpIHtcclxuXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnJlbmRlcldlYkdMKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IFxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5cclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5jb25zdCB0ZXN0TW9kZWxDb2xvciA9ICcjNTU4ZGU4JztcclxuXHJcbmV4cG9ydCBlbnVtIFRlc3RNb2RlbCB7XHJcbiAgICBUb3J1cyxcclxuICAgIFNwaGVyZSxcclxuICAgIFNsb3BlZFBsYW5lLFxyXG4gICAgQm94LFxyXG4gICAgQ2hlY2tlcmJvYXJkXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0TW9kZWxMb2FkZXIge1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVGVzdE1vZGVsTG9hZGVyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2FkcyBhIHBhcmFtZXRyaWMgdGVzdCBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB7Vmlld2VyfSB2aWV3ZXIgVmlld2VyIGluc3RhbmNlIHRvIHJlY2VpdmUgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0ge1Rlc3RNb2RlbH0gbW9kZWxUeXBlIE1vZGVsIHR5cGUgKEJveCwgU3BoZXJlLCBldGMuKVxyXG4gICAgICovXHJcbiAgICBsb2FkVGVzdE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIsIG1vZGVsVHlwZSA6IFRlc3RNb2RlbCkge1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG1vZGVsVHlwZSl7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5Ub3J1czpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFRvcnVzTW9kZWwodmlld2VyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuU3BoZXJlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU3BoZXJlTW9kZWwodmlld2VyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuU2xvcGVkUGxhbmU6IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU2xvcGVkUGxhbmVNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5Cb3g6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRCb3hNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5DaGVja2VyYm9hcmQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDaGVja2VyYm9hcmRNb2RlbCh2aWV3ZXIpOyAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSB0b3J1cyB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZFRvcnVzTW9kZWwodmlld2VyIDogVmlld2VyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcnVzU2NlbmUgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgc29tZSBnZW9tZXRyaWVzXHJcbiAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzS25vdEdlb21ldHJ5KDEsIDAuMywgMTI4LCA2NCk7XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pO1xyXG5cclxuICAgICAgICBsZXQgY291bnQgPSA1MDtcclxuICAgICAgICBsZXQgc2NhbGUgPSA1O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XHJcbiAgICAgICAgICAgIGxldCB6ID0gKE1hdGgucmFuZG9tKCkgKiAyLjApIC0gMS4wO1xyXG4gICAgICAgICAgICBsZXQgelNjYWxlID0gTWF0aC5zcXJ0KDEuMCAtIHogKiB6KSAqIHNjYWxlO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnNldChcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKHIpICogelNjYWxlLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4ocikgKiB6U2NhbGUsXHJcbiAgICAgICAgICAgICAgICB6ICogc2NhbGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbWVzaC5yb3RhdGlvbi5zZXQoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSk7XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSAnVG9ydXMgQ29tcG9uZW50JztcclxuICAgICAgICAgICAgdG9ydXNTY2VuZS5hZGQobWVzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZpZXdlci5tb2RlbCA9IHRvcnVzU2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdGVzdCBzcGhlcmUgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkU3BoZXJlTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgcmFkaXVzID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzLCByYWRpdXMsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSlcclxuICAgICAgICB2aWV3ZXIubW9kZWwgPSBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgdGVzdCBib3ggdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkQm94TW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgd2lkdGggID0gMjsgICAgXHJcbiAgICAgICAgbGV0IGhlaWdodCA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBkZXB0aCAgPSAyOyAgICBcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJveE1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSkpXHJcblxyXG4gICAgICAgIHZpZXdlci5tb2RlbCA9IG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBzbG9wZWQgcGxhbmUgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkU2xvcGVkUGxhbmVNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCAgPSAyOyAgICBcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVQbGFuZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHdpZHRoLCBoZWlnaHQsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSkgICAgICAgXHJcbiAgICAgICAgbWVzaC5yb3RhdGVYKE1hdGguUEkgLyA0KTtcclxuICAgICAgICBcclxuICAgICAgICBtZXNoLm5hbWUgPSAnU2xvcGVkUGxhbmUnO1xyXG4gICAgICAgIHZpZXdlci5tb2RlbCA9IG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB0ZXN0IG1vZGVsIGNvbnNpc3Rpbmcgb2YgYSB0aWVyZWQgY2hlY2tlcmJvYXJkXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZENoZWNrZXJib2FyZE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZ3JpZExlbmd0aCAgICAgOiBudW1iZXIgPSAyO1xyXG4gICAgICAgIGxldCB0b3RhbEhlaWdodCAgICA6IG51bWJlciA9IDEuMDsgICAgICAgIFxyXG4gICAgICAgIGxldCBncmlkRGl2aXNpb25zICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHRvdGFsQ2VsbHMgICAgIDogbnVtYmVyID0gTWF0aC5wb3coZ3JpZERpdmlzaW9ucywgMik7XHJcblxyXG4gICAgICAgIGxldCBjZWxsQmFzZSAgICAgICA6IG51bWJlciA9IGdyaWRMZW5ndGggLyBncmlkRGl2aXNpb25zO1xyXG4gICAgICAgIGxldCBjZWxsSGVpZ2h0ICAgICA6IG51bWJlciA9IHRvdGFsSGVpZ2h0IC8gdG90YWxDZWxscztcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpblggOiBudW1iZXIgPSAtKGNlbGxCYXNlICogKGdyaWREaXZpc2lvbnMgLyAyKSkgKyAoY2VsbEJhc2UgLyAyKTtcclxuICAgICAgICBsZXQgb3JpZ2luWSA6IG51bWJlciA9IG9yaWdpblg7XHJcbiAgICAgICAgbGV0IG9yaWdpblogOiBudW1iZXIgPSAtY2VsbEhlaWdodCAvIDI7XHJcbiAgICAgICAgbGV0IG9yaWdpbiAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCwgb3JpZ2luWSwgb3JpZ2luWik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGJhc2VDb2xvciAgICAgIDogbnVtYmVyID0gMHgwMDcwNzA7XHJcbiAgICAgICAgbGV0IGNvbG9yRGVsdGEgICAgIDogbnVtYmVyID0gKDI1NiAvIHRvdGFsQ2VsbHMpICogTWF0aC5wb3coMjU2LCAyKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwICAgICAgOiBUSFJFRS5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIGxldCBjZWxsT3JpZ2luIDogVEhSRUUuVmVjdG9yMyA9IG9yaWdpbi5jbG9uZSgpO1xyXG4gICAgICAgIGxldCBjZWxsQ29sb3IgIDogbnVtYmVyID0gYmFzZUNvbG9yO1xyXG4gICAgICAgIGZvciAobGV0IGlSb3cgOiBudW1iZXIgPSAwOyBpUm93IDwgZ3JpZERpdmlzaW9uczsgaVJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlDb2x1bW4gOiBudW1iZXIgPSAwOyBpQ29sdW1uIDwgZ3JpZERpdmlzaW9uczsgaUNvbHVtbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe2NvbG9yIDogY2VsbENvbG9yfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKGNlbGxPcmlnaW4sIGNlbGxCYXNlLCBjZWxsQmFzZSwgY2VsbEhlaWdodCwgY2VsbE1hdGVyaWFsKTtcclxuICAgICAgICAgICAgICAgIGdyb3VwLmFkZCAoY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2VsbE9yaWdpbi54ICs9IGNlbGxCYXNlO1xyXG4gICAgICAgICAgICAgICAgY2VsbE9yaWdpbi56ICs9IGNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBjZWxsQ29sb3IgICAgKz0gY29sb3JEZWx0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNlbGxPcmlnaW4ueCA9IG9yaWdpbi54O1xyXG4gICAgICAgIGNlbGxPcmlnaW4ueSArPSBjZWxsQmFzZTtcclxuICAgICAgICB9ICAgICAgIFxyXG5cclxuICAgICAgICBncm91cC5uYW1lID0gJ0NoZWNrZXJib2FyZCc7XHJcbiAgICAgICAgdmlld2VyLm1vZGVsID0gZ3JvdXA7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7T0JKTG9hZGVyfSAgICAgICAgICAgICAgICAgIGZyb20gXCJPQkpMb2FkZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUZXN0TW9kZWxMb2FkZXIsIFRlc3RNb2RlbH0gZnJvbSAnVGVzdE1vZGVsTG9hZGVyJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5jb25zdCB0ZXN0TW9kZWxDb2xvciA9ICcjNTU4ZGU4JztcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkZXIge1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTG9hZGVyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgbW9kZWwgYmFzZWQgb24gdGhlIG1vZGVsIG5hbWUgYW5kIHBhdGggZW1iZWRkZWQgaW4gdGhlIEhUTUwgcGFnZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqLyAgICBcclxuICAgIGxvYWRPQkpNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbE5hbWVFbGVtZW50IDogSFRNTEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVsTmFtZScpO1xyXG4gICAgICAgIGxldCBtb2RlbFBhdGhFbGVtZW50IDogSFRNTEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVsUGF0aCcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBsZXQgbW9kZWxOYW1lICAgIDogc3RyaW5nID0gbW9kZWxOYW1lRWxlbWVudC50ZXh0Q29udGVudDtcclxuICAgICAgICBsZXQgbW9kZWxQYXRoICAgIDogc3RyaW5nID0gbW9kZWxQYXRoRWxlbWVudC50ZXh0Q29udGVudDtcclxuICAgICAgICBsZXQgZmlsZU5hbWUgICAgIDogc3RyaW5nID0gbW9kZWxQYXRoICsgbW9kZWxOYW1lO1xyXG5cclxuICAgICAgICBsZXQgbWFuYWdlciA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpO1xyXG4gICAgICAgIGxldCBsb2FkZXIgID0gbmV3IE9CSkxvYWRlcihtYW5hZ2VyKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgb25Qcm9ncmVzcyA9IGZ1bmN0aW9uICh4aHIpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh4aHIubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IHhoci5sb2FkZWQgLyB4aHIudG90YWwgKiAxMDA7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwZXJjZW50Q29tcGxldGUudG9GaXhlZCgyKSArICclIGRvd25sb2FkZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBvbkVycm9yID0gZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgIH07ICAgICAgICBcclxuXHJcbiAgICAgICAgbG9hZGVyLmxvYWQoZmlsZU5hbWUsIGZ1bmN0aW9uIChncm91cCA6IFRIUkVFLkdyb3VwKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3ZXIubW9kZWwgPSBncm91cDtcclxuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgcGFyYW1ldHJpYyB0ZXN0IG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIG1vZGVsVHlwZSBUZXN0IG1vZGVsIHR5cGUgKFNwaGVyLCBCb3gsIGV0Yy4pXHJcbiAgICAgKi8gICAgXHJcbiAgICBsb2FkUGFyYW1ldHJpY1Rlc3RNb2RlbCAodmlld2VyIDogVmlld2VyLCBtb2RlbFR5cGUgOiBUZXN0TW9kZWwpIHtcclxuXHJcbiAgICAgICAgbGV0IHRlc3RMb2FkZXIgPSBuZXcgVGVzdE1vZGVsTG9hZGVyKCk7XHJcbiAgICAgICAgdGVzdExvYWRlci5sb2FkVGVzdE1vZGVsKHZpZXdlciwgbW9kZWxUeXBlKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmFTZXR0aW5ncywgQ2FtZXJhfSAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0RlcHRoQnVmZmVyfSAgICAgICAgICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIE1lc2hWaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNZXNoUHJldmlld1ZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByZXZpZXdDYW52YXNJZCA6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyKHByZXZpZXdDYW52YXNJZCk7XHJcblxyXG4gICAgICAgIC8vb3ZlcnJpZGVcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5odG1sTG9nZ2VyOyAgICAgICBcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uXHJcbiAgICAvKipcclxuICAgICAqIFBvcHVsYXRlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBwb3B1bGF0ZVNjZW5lICgpIHsgICAgICAgXHJcblxyXG4gICAgICAgIGxldCBoZWlnaHQgPSAxO1xyXG4gICAgICAgIGxldCB3aWR0aCAgPSAxO1xyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlUGxhbmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKCksIGhlaWdodCwgd2lkdGgsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbChEZXB0aEJ1ZmZlci5EZWZhdWx0TWVzaFBob25nTWF0ZXJpYWxQYXJhbWV0ZXJzKSk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGxpZ2h0aW5nIHRvIHRoZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nKCkge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC4yKTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCg0LCA0LCA0KTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufSIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmFTZXR0aW5ncywgU3RhbmRhcmRWaWV3fSAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtUcmFja2JhbGxDb250cm9sc30gICAgICAgICAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyfSAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0ZXJpYWxzfSAgICAgICAgICAgICAgICAgICAgICBmcm9tICdNYXRlcmlhbHMnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IE9iamVjdE5hbWVzID0ge1xyXG4gICAgR3JpZCA6ICAnR3JpZCdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9Nb2RlbFZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1vZGVsVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNb2RlbFZpZXdlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gbW9kZWxDYW52YXNJZCBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbENhbnZhc0lkIDogc3RyaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIgKG1vZGVsQ2FudmFzSWQpO1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZXQgY2FtZXJhKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogUG9wdWxhdGUgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHBvcHVsYXRlU2NlbmUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBoZWxwZXIgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcigzMDAsIDMwLCAweDg2ZTZmZiwgMHg5OTk5OTkpO1xyXG4gICAgICAgIGhlbHBlci5uYW1lID0gT2JqZWN0TmFtZXMuR3JpZDtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoaGVscGVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVMaWdodGluZygpIHtcclxuXHJcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZUxpZ2h0aW5nKCk7XHJcbiAgICB9ICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFNjZW5lXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgdGhlIHJlZmVyZW5jZSBncmlkLlxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5R3JpZCh2aXNpYmxlIDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBsZXQgZ3JpZEdlb21ldHJ5IDogVEhSRUUuT2JqZWN0M0QgPSB0aGlzLl9zY2VuZS5nZXRPYmplY3RCeU5hbWUoT2JqZWN0TmFtZXMuR3JpZCk7XHJcbiAgICAgICAgZ3JpZEdlb21ldHJ5LnZpc2libGUgPSB2aXNpYmxlO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgRGlzcGxheSBncmlkID0gJHt2aXNpYmxlfWApO1xyXG4gICAgfSBcclxuLy8jZW5kcmVnaW9uXHJcblxyXG59IFxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7U3RhbmRhcmRWaWV3fSAgICAgICAgICAgICAgIGZyb20gXCJDYW1lcmFcIlxyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7TWVzaFByZXZpZXdWaWV3ZXJ9ICAgICAgICAgIGZyb20gXCJNZXNoUHJldmlld1ZpZXdlclwiXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJ9ICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7T0JKTG9hZGVyfSAgICAgICAgICAgICAgICAgIGZyb20gXCJPQkpMb2FkZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUZXN0TW9kZWx9ICAgICAgICAgICAgICAgICAgZnJvbSAnVGVzdE1vZGVsTG9hZGVyJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tIFwiVmlld2VyXCJcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICAgICAgZGlzcGxheUdyaWQgICAgOiBib29sZWFuO1xyXG4gICAgICAgIGdlbmVyYXRlUmVsaWVmIDogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgbmVhckNsaXBwaW5nUGxhbmUgIDogbnVtYmVyO1xyXG4gICAgICAgIGZhckNsaXBwaW5nUGxhbmUgICA6IG51bWJlcjtcclxuICAgICAgICBmaWVsZE9mVmlldyAgICAgICAgOiBudW1iZXI7XHJcbiAgICAgICBcclxuICAgICAgICBjb25zdHJ1Y3RvcihjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBnZW5lcmF0ZVJlbGllZiA6ICgpID0+IGFueSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JpZCAgICA9IHRydWU7IFxyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlUmVsaWVmID0gZ2VuZXJhdGVSZWxpZWY7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lICAgID0gY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgICAgIHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSAgICAgPSBjYW1lcmEuZmFyO1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkT2ZWaWV3ICAgICAgICAgID0gY2FtZXJhLmZvdjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBjbGFzcyBNb2RlbFJlbGllZiB7XHJcblxyXG4gICAgX2xvYWRlciAgICAgICAgICAgICA6IExvYWRlcjtcclxuICAgIF9tb2RlbFZpZXdlciAgICAgICAgOiBNb2RlbFZpZXdlcjtcclxuICAgIF9tZXNoUHJldmlld1ZpZXdlciAgOiBNZXNoUHJldmlld1ZpZXdlcjtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsUmVsaWVmXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIHJlbGllZiBmcm9tIHRoZSBjdXJyZW50IG1vZGVsIGNhbWVyYS5cclxuICAgICAqL1xyXG4gICAgZ2VuZXJhdGVSZWxpZWYoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBwaXhlbHNcclxuICAgICAgICBsZXQgd2lkdGggID0gNTEyO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB3aWR0aCAvIHRoaXMuX21vZGVsVmlld2VyLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgIGxldCBmYWN0b3J5ID0gbmV3IERlcHRoQnVmZmVyRmFjdG9yeSh7d2lkdGggOiB3aWR0aCwgaGVpZ2h0IDogaGVpZ2h0LCBtb2RlbCA6IHRoaXMuX21vZGVsVmlld2VyLl9yb290LCBjYW1lcmEgOiB0aGlzLl9tb2RlbFZpZXdlci5jYW1lcmEsIGFkZENhbnZhc1RvRE9NIDogdHJ1ZX0pOyAgIFxyXG5cclxuICAgICAgICBsZXQgcHJldmlld01lc2ggOiBUSFJFRS5NZXNoID0gZmFjdG9yeS5tZXNoR2VuZXJhdGUoe30pO1xyXG4gICAgICAgIHRoaXMuX21lc2hQcmV2aWV3Vmlld2VyLm1vZGVsID0gcHJldmlld01lc2g7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIuYWRkSW5mb01lc3NhZ2UoJ1JlbGllZiBnZW5lcmF0ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHZpZXcgc2V0dGluZ3MgdGhhdCBhcmUgY29udHJvbGxhYmxlIGJ5IHRoZSB1c2VyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVWaWV3ZXJDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgbGV0IHNjb3BlID0gdGhpcztcclxuXHJcbiAgICAgICAgbGV0IHZpZXdlckNvbnRyb2xzID0gbmV3IFZpZXdlckNvbnRyb2xzKHRoaXMuX21vZGVsVmlld2VyLmNhbWVyYSwgdGhpcy5nZW5lcmF0ZVJlbGllZi5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgbGV0IGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtZW51RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzQ29udHJvbHMnKTtcclxuICAgICAgICBtZW51RGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgLy8gICAgTW9kZWxWaWV3ZXIgICAgICAgIC8vICAgICAgXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IG1vZGVsVmlld2VyT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ01vZGVsVmlld2VyIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gR3JpZFxyXG4gICAgICAgIGxldCBjb250cm9sRGlzcGxheUdyaWQgPSBtb2RlbFZpZXdlck9wdGlvbnMuYWRkKHZpZXdlckNvbnRyb2xzLCAnZGlzcGxheUdyaWQnKS5uYW1lKCdEaXNwbGF5IEdyaWQnKTtcclxuICAgICAgICBjb250cm9sRGlzcGxheUdyaWQub25DaGFuZ2UgKCh2YWx1ZSA6IGJvb2xlYW4pID0+IHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl9tb2RlbFZpZXdlci5kaXNwbGF5R3JpZCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIERlcHRoIEJ1ZmZlclxyXG4gICAgICAgIGxldCBjb250cm9sR2VuZXJhdGVSZWxpZWYgPSBtb2RlbFZpZXdlck9wdGlvbnMuYWRkKHZpZXdlckNvbnRyb2xzLCAnZ2VuZXJhdGVSZWxpZWYnKS5uYW1lKCdHZW5lcmF0ZSBSZWxpZWYnKTtcclxuXHJcbiAgICAgICAgbW9kZWxWaWV3ZXJPcHRpb25zLm9wZW4oKTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgLy8gICAgICAgIENhbWVyYSAgICAgICAgIC8vICAgICAgXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IGNhbWVyYU9wdGlvbnMgPSBndWkuYWRkRm9sZGVyKCdDYW1lcmEgT3B0aW9ucycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE5lYXIgQ2xpcHBpbmcgUGxhbmVcclxuICAgICAgICBsZXQgbWluaW11bSAgPSAgIDAuMTtcclxuICAgICAgICBsZXQgbWF4aW11bSAgPSAxMDA7XHJcbiAgICAgICAgbGV0IHN0ZXBTaXplID0gICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xOZWFyQ2xpcHBpbmdQbGFuZSA9IGNhbWVyYU9wdGlvbnMuYWRkKHZpZXdlckNvbnRyb2xzLCAnbmVhckNsaXBwaW5nUGxhbmUnKS5uYW1lKCdOZWFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTtcclxuICAgICAgICBjb250cm9sTmVhckNsaXBwaW5nUGxhbmUub25DaGFuZ2UgKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuX21vZGVsVmlld2VyLmNhbWVyYS5uZWFyID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHNjb3BlLl9tb2RlbFZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAgIDE7XHJcbiAgICAgICAgbWF4aW11bSAgPSAxMDAwMDtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAgICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGYXJDbGlwcGluZ1BsYW5lID0gY2FtZXJhT3B0aW9ucy5hZGQodmlld2VyQ29udHJvbHMsICdmYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnRmFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZhckNsaXBwaW5nUGxhbmUub25DaGFuZ2UgKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuX21vZGVsVmlld2VyLmNhbWVyYS5mYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX21vZGVsVmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIG1pbmltdW0gID0gMjU7XHJcbiAgICAgICAgbWF4aW11bSAgPSA3NTtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXc9IGNhbWVyYU9wdGlvbnMuYWRkKHZpZXdlckNvbnRyb2xzLCAnZmllbGRPZlZpZXcnKS5uYW1lKCdGaWVsZCBvZiBWaWV3JykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZpZWxkT2ZWaWV3IC5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fbW9kZWxWaWV3ZXIuY2FtZXJhLmZvdiA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fbW9kZWxWaWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBjYW1lcmFPcHRpb25zLm9wZW4oKTsgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggdGhlIG1vZGVsIFZpZXdlci5cclxuICAgICAqL1xyXG4gICAgcnVuICgpIHtcclxuXHJcbiAgICAgICAgU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRJbmZvTWVzc2FnZSAoJ01vZGVsUmVsaWVmIHN0YXJ0ZWQnKTsgICBcclxuICAgICAgIFxyXG4gICAgICAgIC8vIE1vZGVsIFZpZXdlciAgICBcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlciA9IG5ldyBNb2RlbFZpZXdlcignbW9kZWxDYW52YXMnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBNZXNoIFByZXZpZXdcclxuICAgICAgICB0aGlzLl9tZXNoUHJldmlld1ZpZXdlciA9ICBuZXcgTWVzaFByZXZpZXdWaWV3ZXIoJ21lc2hDYW52YXMnKTtcclxuXHJcbiAgICAgICAgLy8gVUkgQ29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVWaWV3ZXJDb250cm9scygpO1xyXG5cclxuICAgICAgICAvLyBMb2FkZXJcclxuICAgICAgICB0aGlzLl9sb2FkZXIgPSBuZXcgTG9hZGVyKCk7XHJcblxyXG4gICAgICAgIC8vIE9CSiBNb2RlbHNcclxuICAgICAgICB0aGlzLl9sb2FkZXIubG9hZE9CSk1vZGVsICh0aGlzLl9tb2RlbFZpZXdlcik7XHJcblxyXG4gICAgICAgIC8vIFRlc3QgTW9kZWxzXHJcbiAgICAgICAgLy8gdGhpcy5fbG9hZGVyLmxvYWRQYXJhbWV0cmljVGVzdE1vZGVsKHRoaXMuX21vZGVsVmlld2VyLCBUZXN0TW9kZWwuQm94KTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IG1vZGVsUmVsaWVmID0gbmV3IE1vZGVsUmVsaWVmKCk7XHJcbm1vZGVsUmVsaWVmLnJ1bigpO1xyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQge2Fzc2VydH0gICBmcm9tICdjaGFpJ1xyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9IGZyb20gJ0RlcHRoQnVmZmVyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSBmcm9tICdNYXRoJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vKipcclxuICogQGV4cG9ydHMgVmlld2VyL1ZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVuaXRUZXN0cyB7XHJcbiAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVW5pdFRlc3RzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgc3RhdGljIFZlcnRleE1hcHBpbmcgKGRlcHRoQnVmZmVyIDogRGVwdGhCdWZmZXIsIG1lc2ggOiBUSFJFRS5NZXNoKSB7XHJcblxyXG4gICAgICAgIGxldCBtZXNoR2VvbWV0cnkgOiBUSFJFRS5HZW9tZXRyeSA9IDxUSFJFRS5HZW9tZXRyeT4gbWVzaC5nZW9tZXRyeTtcclxuICAgICAgICBtZXNoR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gbWVzaEdlb21ldHJ5LmJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICAvLyB3aWR0aCAgPSAzICAgICAgICAgICAgICAzICAgNCAgIDVcclxuICAgICAgICAvLyBjb2x1bW4gPSAyICAgICAgICAgICAgICAwICAgMSAgIDJcclxuICAgICAgICAvLyBidWZmZXIgbGVuZ3RoID0gNlxyXG5cclxuICAgICAgICAvLyBUZXN0IFBvaW50cyAgICAgICAgICAgIFxyXG4gICAgICAgIGxldCBsb3dlckxlZnQgID0gYm91bmRpbmdCb3gubWluO1xyXG4gICAgICAgIGxldCBsb3dlclJpZ2h0ID0gbmV3IFRIUkVFLlZlY3RvcjMgKGJvdW5kaW5nQm94Lm1heC54LCBib3VuZGluZ0JveC5taW4ueSwgMCk7XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHQgPSBib3VuZGluZ0JveC5tYXg7XHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdCAgPSBuZXcgVEhSRUUuVmVjdG9yMyAoYm91bmRpbmdCb3gubWluLngsIGJvdW5kaW5nQm94Lm1heC55LCAwKTtcclxuICAgICAgICBsZXQgY2VudGVyICAgICA9IGJvdW5kaW5nQm94LmdldENlbnRlcigpO1xyXG5cclxuICAgICAgICAvLyBFeHBlY3RlZCBWYWx1ZXNcclxuICAgICAgICBsZXQgYnVmZmVyTGVuZ3RoICAgIDogbnVtYmVyID0gKGRlcHRoQnVmZmVyLndpZHRoICogZGVwdGhCdWZmZXIuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGZpcnN0Q29sdW1uICAgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBsYXN0Q29sdW1uICAgIDogbnVtYmVyID0gZGVwdGhCdWZmZXIud2lkdGggLSAxO1xyXG4gICAgICAgIGxldCBjZW50ZXJDb2x1bW4gIDogbnVtYmVyID0gTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci53aWR0aCAvIDIpO1xyXG4gICAgICAgIGxldCBmaXJzdFJvdyAgICAgIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbGFzdFJvdyAgICAgICA6IG51bWJlciA9IGRlcHRoQnVmZmVyLmhlaWdodCAtIDE7XHJcbiAgICAgICAgbGV0IGNlbnRlclJvdyAgICAgOiBudW1iZXIgPSBNYXRoLnJvdW5kKGRlcHRoQnVmZmVyLmhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICBsZXQgbG93ZXJMZWZ0SW5kZXggIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodEluZGV4IDogbnVtYmVyID0gZGVwdGhCdWZmZXIud2lkdGggLSAxO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0SW5kZXggOiBudW1iZXIgPSBidWZmZXJMZW5ndGggLSAxO1xyXG4gICAgICAgIGxldCB1cHBlckxlZnRJbmRleCAgOiBudW1iZXIgPSBidWZmZXJMZW5ndGggLSBkZXB0aEJ1ZmZlci53aWR0aDtcclxuICAgICAgICBsZXQgY2VudGVySW5kZXggICAgIDogbnVtYmVyID0gKGNlbnRlclJvdyAqIGRlcHRoQnVmZmVyLndpZHRoKSArICBNYXRoLnJvdW5kKGRlcHRoQnVmZmVyLndpZHRoIC8gMik7XHJcblxyXG4gICAgICAgIGxldCBsb3dlckxlZnRJbmRpY2VzICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihmaXJzdFJvdywgZmlyc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCBsb3dlclJpZ2h0SW5kaWNlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihmaXJzdFJvdywgbGFzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHRJbmRpY2VzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGxhc3RSb3csIGxhc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCB1cHBlckxlZnRJbmRpY2VzICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihsYXN0Um93LCBmaXJzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IGNlbnRlckluZGljZXMgICAgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGNlbnRlclJvdywgY2VudGVyQ29sdW1uKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgaW5kZXggICA6IG51bWJlclxyXG4gICAgICAgIGxldCBpbmRpY2VzIDogVEhSRUUuVmVjdG9yMjtcclxuXHJcbiAgICAgICAgLy8gTG93ZXIgTGVmdFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXMobG93ZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCBsb3dlckxlZnRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggICA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgobG93ZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBsb3dlckxlZnRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIExvd2VyIFJpZ2h0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyhsb3dlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCBsb3dlclJpZ2h0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleChsb3dlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBsb3dlclJpZ2h0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBVcHBlciBSaWdodFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXModXBwZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgdXBwZXJSaWdodEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgodXBwZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgdXBwZXJSaWdodEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gVXBwZXIgTGVmdFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXModXBwZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCB1cHBlckxlZnRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KHVwcGVyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgdXBwZXJMZWZ0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBDZW50ZXJcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKGNlbnRlciwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgY2VudGVySW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleChjZW50ZXIsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIGNlbnRlckluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICB9IFxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuaW1wb3J0ICogYXMgZGF0ICAgIGZyb20gJ2RhdC1ndWknXHJcblxyXG5pbXBvcnQge0NhbWVyYVNldHRpbmdzLCBDYW1lcmF9ICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgICAgIGZyb20gJ0RlcHRoQnVmZmVyRmFjdG9yeSdcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0xvYWRlcidcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hQcmV2aWV3Vmlld2VyfSAgICAgICAgICBmcm9tIFwiTWVzaFByZXZpZXdWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUcmFja2JhbGxDb250cm9sc30gICAgICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgYm91bmRpbmcgYm94IG1lc2guXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0IFRhcmdldCBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgQ29sb3Igb2YgYm91bmRpbmcgYm94IG1lc2guXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJvdW5kaW5nQm94IChvYmplY3QgOiBUSFJFRS5PYmplY3QzRCwgY29sb3IgOiBudW1iZXIpIDogVEhSRUUuTWVzaCB7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA6IFRIUkVFLkJveDMgPSBuZXcgVEhSRUUuQm94MygpO1xyXG4gICAgICAgIGJvdW5kaW5nQm94ID0gYm91bmRpbmdCb3guc2V0RnJvbU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge2NvbG9yIDogY29sb3IsIG9wYWNpdHkgOiAxLjAsIHdpcmVmcmFtZSA6IHRydWV9KTsgICAgICAgXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94TWVzaCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3goYm91bmRpbmdCb3guZ2V0Q2VudGVyKCksIGJvdW5kaW5nQm94LCBtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveE1lc2g7XHJcbiAgICB9XHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQ2FtZXJhV29ya2JlbmNoXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FtZXJhVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbWVyYVxyXG4gICAgICovXHJcbiAgICBnZXQgY2FtZXJhICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlU2NlbmUoKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmlhZCA9IEdyYXBoaWNzLmNyZWF0ZVdvcmxkQXhlc1RyaWFkKG5ldyBUSFJFRS5WZWN0b3IzKCksIDEsIDAuMjUsIDAuMjUpO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZCh0cmlhZCk7XHJcblxyXG4gICAgICAgIGxldCBib3ggOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlQm94TWVzaChuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAtMiksIDEsIDIsIDIsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiAweGZmMDAwMH0pKTtcclxuICAgICAgICBib3gucm90YXRpb24uc2V0KE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgICAgIGJveC51cGRhdGVNYXRyaXgoKTtcclxuXHJcbiAgICAgICAgbGV0IGJveENsb25lID0gR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QoYm94LCBuZXcgVEhSRUUuTWF0cml4NCgpKTtcclxuICAgICAgICB0aGlzLm1vZGVsLmFkZChib3hDbG9uZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGhlcmUgOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMyg0LCAyLCAtMSksIDEsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiAweDAwZmYwMH0pKTtcclxuICAgICAgICB0aGlzLm1vZGVsLmFkZChzcGhlcmUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVEZWZhdWx0Q2FtZXJhU2V0dGluZ3MgKCkgOiBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgICAgIGxldCBzZXR0aW5ncyA6IENhbWVyYVNldHRpbmdzID0ge1xyXG5cclxuICAgICAgICAgICAgcG9zaXRpb246ICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuMCwgMC4wLCAyMC4wKSxcclxuICAgICAgICAgICAgdGFyZ2V0OiAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApLFxyXG4gICAgICAgICAgICBuZWFyOiAgICAgICAgICAgIDIuMCxcclxuICAgICAgICAgICAgZmFyOiAgICAgICAgICAgIDUwLjAsXHJcbiAgICAgICAgICAgIGZpZWxkT2ZWaWV3OiAgICAzNyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL3d3dy5uaWtvbmlhbnMub3JnL3Jldmlld3MvZm92LXRhYmxlc1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXR0aW5nczsgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICBuZWFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXI7XHJcbiAgICBmYXJDbGlwcGluZ1BsYW5lICAgOiBudW1iZXI7XHJcbiAgICBmaWVsZE9mVmlldyAgICAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgc2hvd0JvdW5kaW5nQm94ZXMgOiAoKSA9PiB2b2lkO1xyXG4gICAgc2V0Q2xpcHBpbmdQbGFuZXMgOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIHNob3dCb3VuZGluZ0JveGVzIDogKCkgPT4gYW55LCBzZXRDbGlwcGluZ1BsYW5lcyA6ICgpID0+IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lICAgID0gY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5mYXJDbGlwcGluZ1BsYW5lICAgICA9IGNhbWVyYS5mYXI7XHJcbiAgICAgICAgdGhpcy5maWVsZE9mVmlldyAgICAgICAgICA9IGNhbWVyYS5mb3Y7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMgPSBzaG93Qm91bmRpbmdCb3hlcztcclxuICAgICAgICB0aGlzLnNldENsaXBwaW5nUGxhbmVzICA9IHNldENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEFwcFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBcclxuICAgIF9sb2dnZXIgICAgICAgICA6IENvbnNvbGVMb2dnZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgOiBMb2FkZXI7XHJcbiAgICBfdmlld2VyICAgICAgICAgOiBDYW1lcmFWaWV3ZXI7XHJcbiAgICBfdmlld2VyQ29udHJvbHMgOiBWaWV3ZXJDb250cm9scztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byB0aGUgbW9kZWwgZXh0ZW50cyBpbiBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsICAgICAgICAgICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgPSB0aGlzLl92aWV3ZXIubW9kZWw7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgbW9kZWwgKGFuZCBnZW9tZXRyeSEpXHJcbiAgICAgICAgbGV0IG1vZGVsVmlldyA9IEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXcgPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGJveCBpcyB3b3JsZC1heGlzIGFsaWduZWQuIFxyXG4gICAgICAgIC8vIElOdiBWaWV3IGNvb3JkaW5hdGVzLCB0aGUgY2FtZXJhIGlzIGF0IHRoZSBvcmlnaW4uXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIG5lYXIgcGxhbmUgaXMgdGhlIG1heGltdW0gWiBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBmYXIgcGxhbmUgaXMgdGhlIG1pbmltdW0gWiBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICAgIGxldCBuZWFyUGxhbmUgPSAtYm91bmRpbmdCb3hWaWV3Lm1heC56O1xyXG4gICAgICAgIGxldCBmYXJQbGFuZSAgPSAtYm91bmRpbmdCb3hWaWV3Lm1pbi56O1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scy5uZWFyQ2xpcHBpbmdQbGFuZSA9IG5lYXJQbGFuZTtcclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scy5mYXJDbGlwcGluZ1BsYW5lICA9IGZhclBsYW5lO1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSBuZWFyUGxhbmU7XHJcbiAgICAgICAgdGhpcy5fdmlld2VyLmNhbWVyYS5mYXIgID0gZmFyUGxhbmU7XHJcblxyXG4gICAgICAgIC8vIFdJUDogT3IgdGhpcy5fdmlld2VyLnVwZGF0ZUNhbWVyYSgpP1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyB0aGUgY2xpcHBpbmcgcGxhbmVzIG9mIHRoZSBtb2RlbCBpbiBWaWV3IGFuZCBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc2hvd0JvdW5kaW5nQm94ZXMoKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbCAgICAgICAgICAgICAgICAgICAgOiBUSFJFRS5Hcm91cCAgID0gdGhpcy5fdmlld2VyLm1vZGVsO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZCAgICAgICAgOiBUSFJFRS5NYXRyaXg0ID0gdGhpcy5fdmlld2VyLmNhbWVyYS5tYXRyaXhXb3JsZDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmcgQm91bmRpbmdCb3hcclxuICAgICAgICBtb2RlbC5yZW1vdmUobW9kZWwuZ2V0T2JqZWN0QnlOYW1lKEdyYXBoaWNzLkJvdW5kaW5nQm94TmFtZSkpO1xyXG5cclxuICAgICAgICAvLyBjbG9uZSBtb2RlbCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgbW9kZWxWaWV3ID0gIEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICAvLyBjbGVhciBlbnRpcmUgc2NlbmVcclxuICAgICAgICBHcmFwaGljcy5yZW1vdmVPYmplY3RDaGlsZHJlbihtb2RlbCwgZmFsc2UpO1xyXG5cclxuICAgICAgICBtb2RlbC5hZGQobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldyA9IGNyZWF0ZUJvdW5kaW5nQm94KG1vZGVsVmlldywgMHhmZjAwZmYpO1xyXG4gICAgICAgIG1vZGVsLmFkZChib3VuZGluZ0JveFZpZXcpO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gbW9kZWwgYmFjayBmcm9tIFZpZXcgdG8gV29ybGRcclxuICAgICAgICBsZXQgbW9kZWxXb3JsZCA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChtb2RlbFZpZXcsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBtb2RlbC5hZGQobW9kZWxXb3JsZCk7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBib3VuZGluZyBib3ggYmFjayBmcm9tIFZpZXcgdG8gV29ybGRcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZCA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChib3VuZGluZ0JveFZpZXcsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBtb2RlbC5hZGQoYm91bmRpbmdCb3hXb3JsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplVmlld2VyQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlckNvbnRyb2xzID0gbmV3IFZpZXdlckNvbnRyb2xzKHRoaXMuX3ZpZXdlci5jYW1lcmEsIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMuYmluZCh0aGlzKSwgdGhpcy5zZXRDbGlwcGluZ1BsYW5lcy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgdmFyIGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBzZXR0aW5nc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5nc0NvbnRyb2xzJyk7XHJcbiAgICAgICAgc2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG4gICAgICAgIHZhciBmb2xkZXJPcHRpb25zID0gZ3VpLmFkZEZvbGRlcignQ2FtZXJhIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gTmVhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIGxldCBtaW5pbXVtICA9ICAgMDtcclxuICAgICAgICBsZXQgbWF4aW11bSAgPSAxMDA7XHJcbiAgICAgICAgbGV0IHN0ZXBTaXplID0gICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xOZWFyQ2xpcHBpbmdQbGFuZSA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnbmVhckNsaXBwaW5nUGxhbmUnKS5uYW1lKCdOZWFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTtcclxuICAgICAgICBjb250cm9sTmVhckNsaXBwaW5nUGxhbmUgLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAxO1xyXG4gICAgICAgIG1heGltdW0gID0gNTAwO1xyXG4gICAgICAgIHN0ZXBTaXplID0gICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGYXJDbGlwcGluZ1BsYW5lID0gZm9sZGVyT3B0aW9ucy5hZGQodGhpcy5fdmlld2VyQ29udHJvbHMsICdmYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnRmFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZhckNsaXBwaW5nUGxhbmUgLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIG1pbmltdW0gID0gMjU7XHJcbiAgICAgICAgbWF4aW11bSAgPSA3NTtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXc9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnZmllbGRPZlZpZXcnKS5uYW1lKCdGaWVsZCBvZiBWaWV3JykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZpZWxkT2ZWaWV3IC5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS5mb3YgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIFNob3cgQm91bmRpbmcgQm94ZXNcclxuICAgICAgICBsZXQgY29udHJvbFNob3dCb3VuZGluZ0JveGVzID0gZm9sZGVyT3B0aW9ucy5hZGQodGhpcy5fdmlld2VyQ29udHJvbHMsICdzaG93Qm91bmRpbmdCb3hlcycpLm5hbWUoJ1Nob3cgQm91bmRpbmcgQm94ZXMnKTtcclxuXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgUGxhbmVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTZXRDbGlwcGluZ1BsYW5lcyA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnc2V0Q2xpcHBpbmdQbGFuZXMnKS5uYW1lKCdTZXQgQ2xpcHBpbmcgUGxhbmVzJyk7XHJcblxyXG4gICAgICAgIGZvbGRlck9wdGlvbnMub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBydW4gKCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX3ZpZXdlciA9IG5ldyBDYW1lcmFWaWV3ZXIoJ3ZpZXdlckNhbnZhcycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFVJIENvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplVmlld2VyQ29udHJvbHMoKTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGFwcCA9IG5ldyBBcHA7XHJcbmFwcC5ydW4oKTtcclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7TWVzaFByZXZpZXdWaWV3ZXJ9ICAgICAgZnJvbSBcIk1lc2hQcmV2aWV3Vmlld2VyXCJcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1VuaXRUZXN0c30gICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogRGVwdGhCdWZmZXJUZXN0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXJUZXN0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW5cclxuICAgICAqL1xyXG4gICAgbWFpbiAoKSB7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBkZXB0aEJ1ZmZlclRlc3QgPSBuZXcgRGVwdGhCdWZmZXJUZXN0KCk7XHJcbmRlcHRoQnVmZmVyVGVzdC5tYWluKCk7XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hQcmV2aWV3Vmlld2VyfSAgICAgIGZyb20gXCJNZXNoUHJldmlld1ZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxubGV0IGxvZ2dlciA9IG5ldyBIVE1MTG9nZ2VyKCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIFdpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFdpZGdldCB7XHJcbiAgICBcclxuICAgIG5hbWUgIDogc3RyaW5nO1xyXG4gICAgcHJpY2UgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJpY2UgOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lICA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlcmF0ZVxyXG4gICAgICovXHJcbiAgICBvcGVyYXRlICgpIHtcclxuICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UoYCR7dGhpcy5uYW1lfSBvcGVyYXRpbmcuLi4uYCk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBTdXBlcldpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbG9yV2lkZ2V0IGV4dGVuZHMgV2lkZ2V0IHtcclxuXHJcbiAgICBjb2xvciA6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmljZSA6IG51bWJlciwgY29sb3IgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIgKG5hbWUsIHByaWNlKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFuZFBhcmVudCB7XHJcblxyXG4gICAgZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmdyYW5kcGFyZW50UHJvcGVydHkgID0gZ3JhbmRwYXJlbnRQcm9wZXJ0eSA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJlbnQgZXh0ZW5kcyBHcmFuZFBhcmVudHtcclxuICAgIFxyXG4gICAgcGFyZW50UHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZywgcGFyZW50UHJvcGVydHkgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoZ3JhbmRwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRQcm9wZXJ0eSA9IHBhcmVudFByb3BlcnR5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBQYXJlbnR7XHJcbiAgICBcclxuICAgIGNoaWxkUHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5IDogc3RyaW5nLCBwYXJlbnRQcm9wZXJ0eSA6IHN0cmluZywgY2hpbGRQcm9wZXJ0eSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBzdXBlcihncmFuZHBhcmVudFByb3BlcnR5LCBwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5jaGlsZFByb3BlcnR5ID0gY2hpbGRQcm9wZXJ0eTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBJbmhlcml0YW5jZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluaGVyaXRhbmNlVGVzdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluXHJcbiAgICAgKi9cclxuICAgIG1haW4gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3aWRnZXQgPSBuZXcgV2lkZ2V0ICgnV2lkZ2V0JywgMS4wKTtcclxuICAgICAgICB3aWRnZXQub3BlcmF0ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY29sb3JXaWRnZXQgPSBuZXcgQ29sb3JXaWRnZXQgKCdDb2xvcldpZGdldCcsIDEuMCwgJ3JlZCcpO1xyXG4gICAgICAgIGNvbG9yV2lkZ2V0Lm9wZXJhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkID0gbmV3IENoaWxkKCdHYUdhJywgJ0RhZCcsICdTdGV2ZScpOyAgICBcclxuICAgIH1cclxufVxyXG5cclxubGV0IGluaGVyaXRhbmNlID0gbmV3IEluaGVyaXRhbmNlVGVzdDtcclxuaW5oZXJpdGFuY2UubWFpbigpO1xyXG4iXX0=

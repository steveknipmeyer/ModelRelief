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
define("Viewer/Camera", ["require", "exports"], function (require, exports) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        return Camera;
    }());
    exports.Camera = Camera;
});
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
         * @param color Color.
         * @param segments Mesh segments.
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
            //          Tools.consoleLog('World mouse coordinates: ' + worldPoint.x + ', ' + worldPoint.y);
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
define("DepthBuffer/DepthBuffer", ["require", "exports", "chai", "three", "System/Services"], function (require, exports, chai_1, THREE, Services_2) {
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
                var minimum = this.normalizedToModelDepth(this._minimumNormalized);
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
                var maximum = this.normalizedToModelDepth(this.maximumNormalized);
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
            //N.B. This does not yield the correct result. 
            // The values are too large (~10000).
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
    
        /**
         * Constructs a mesh of the given base dimension.
         * @param modelWidth Base dimension (model units). Height is controlled by DB aspect ratio.
         * @param material Material to assign to mesh.
         */
        DepthBuffer.prototype.mesh = function (modelWidth, material) {
            if (!material)
                material = new THREE.MeshPhongMaterial({ wireframe: false, color: 0xff00ff, reflectivity: 0.75, shininess: 0.75 });
            var meshGeometry = new THREE.Geometry();
            var faceSize = modelWidth / (this.width - 1);
            var baseVertexIndex = 0;
            for (var iRow = 0; iRow < (this.height - 1); iRow++) {
                for (var iColumn = 0; iColumn < (this.width - 1); iColumn++) {
                    var facePair = this.constructTriFacesAtOffset(iRow, iColumn, faceSize, baseVertexIndex);
                    (_a = meshGeometry.vertices).push.apply(_a, facePair.vertices);
                    (_b = meshGeometry.faces).push.apply(_b, facePair.faces);
                    baseVertexIndex += 4;
                }
            }
            meshGeometry.computeFaceNormals();
            var mesh = new THREE.Mesh(meshGeometry, material);
            mesh.name = DepthBuffer.MeshModelName;
            return mesh;
            var _a, _b;
        };
        /**
         * Constructs a pair of triangular faces at the given offset in the DepthBuffer.
         * @param row Row offset (Lower Left).
         * @param column Column offset (Lower Left).
         * @param faceSize Size of a face edge (not hypotenuse).
         * @param baseVertexIndex Beginning offset in mesh geometry vertex array.
         */
        DepthBuffer.prototype.constructTriFacesAtOffset = function (row, column, faceSize, baseVertexIndex) {
            var facePair = {
                vertices: [],
                faces: []
            };
            //  Vertices
            //   2    3       
            //   0    1
            var meshWidth = (this.width - 1) * faceSize;
            var meshHeight = (this.height - 1) * faceSize;
            // mesh center will be at the world origin
            var originX = (column * faceSize) - (meshWidth / 2);
            var originY = (row * faceSize) - (meshHeight / 2);
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
        DepthBuffer.normalizedTolerance = .001;
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
define("DepthBuffer/DepthBufferFactory", ["require", "exports", "three", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "System/Services", "System/Tools"], function (require, exports, THREE, DepthBuffer_1, Graphics_1, Services_3, Tools_1) {
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
            this._minimumWebGL = true; // true if minimum WeGL requirementat are present
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
            var deviceCoordinates = Graphics_1.Graphics.deviceCoordinatesFromJQEvent(event, $(event.target));
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
            var modelView = Graphics_1.Graphics.cloneAndTransformObject(this._model, cameraMatrixWorldInverse);
            var boundingBoxView = Graphics_1.Graphics.getBoundingBoxFromObject(modelView);
            // The bounding box is world-axis aligned. 
            // In View coordinates, the camera is at the origin.
            // The bounding near plane is the maximum Z of the bounding box.
            // The bounding far plane is the minimum Z of the bounding box.
            var nearPlane = -boundingBoxView.max.z;
            var farPlane = -boundingBoxView.min.z;
            this._camera.near = nearPlane;
            this._camera.far = farPlane;
            // WIP: Or this._viewer.updateCamera()?
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
            console.time("createDepthBuffer");
            this.createDepthBuffer();
            console.timeEnd("createDepthBuffer");
            console.time("mesh");
            var mesh = this._depthBuffer.mesh(parameters.modelWidth, parameters.material);
            console.timeEnd("mesh");
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
define("Viewer/Viewer", ["require", "exports", "three", "Viewer/TrackballControls", "Viewer/Graphics", "System/Services"], function (require, exports, THREE, TrackballControls_1, Graphics_2, Services_4) {
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
            this._canvas = Graphics_2.Graphics.initializeCanvas(modelCanvasId);
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
                Graphics_2.Graphics.removeObjectChildren(this._root, false);
                this._root.add(value);
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
            // geometry
            var radius = 2;
            var segments = 64;
            var geometry = new THREE.SphereGeometry(radius, segments, segments);
            var material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
            var mesh = new THREE.Mesh(geometry, material);
            var center = new THREE.Vector3(0.0, 0.0, 0.0);
            mesh.position.set(center.x, center.y, center.z);
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
         * Initialize the default camera settings.
         */
        Viewer.prototype.initializeDefaultCameraSettings = function () {
            var settings = {
                position: new THREE.Vector3(0.0, 0.0, 10.0),
                target: new THREE.Vector3(0, 0, 0),
                near: 0.1,
                far: 10000,
                fieldOfView: 45
            };
            return settings;
        };
        /**
         * Initialize the viewer camera
         */
        Viewer.prototype.initializeCamera = function () {
            this._defaultCameraSettings = this.initializeDefaultCameraSettings();
            this._camera = new THREE.PerspectiveCamera(this._defaultCameraSettings.fieldOfView, this.aspectRatio, this._defaultCameraSettings.near, this._defaultCameraSettings.far);
            this._camera.position.copy(this._defaultCameraSettings.position);
            this.resetCamera();
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
                        _this.resetCamera();
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
            Graphics_2.Graphics.removeObjectChildren(this._root, false);
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
         * Resets all camera properties to the defaults
         */
        Viewer.prototype.resetCamera = function () {
            this._camera.position.copy(this._defaultCameraSettings.position);
            this._camera.up.set(0, 1, 0);
            this.updateCamera();
        };
        //#endregion
        //#region Window Resize
        /**
         * Updates the scene camera to match the new window size
         */
        Viewer.prototype.updateCamera = function () {
            this._camera.aspect = this.aspectRatio;
            this._camera.lookAt(this._defaultCameraSettings.target);
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
            this.updateCamera();
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
define("ModelLoaders/Loader", ["require", "exports", "three", "Viewer/Graphics", "ModelLoaders/OBJLoader"], function (require, exports, THREE, Graphics_3, OBJLoader_1) {
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
         * Adds a torus to a scene.
         * @param viewer Instance of the Viewer to display the model
         */
        Loader.prototype.loadTorusModel = function (viewer) {
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
        Loader.prototype.loadSphereModel = function (viewer) {
            // geometry
            var radius = 2;
            var segments = 64;
            var geometry = new THREE.SphereGeometry(radius, segments, segments);
            var material = new THREE.MeshPhongMaterial({ color: testModelColor });
            var mesh = new THREE.Mesh(geometry, material);
            var center = new THREE.Vector3(0.0, 0.0, 0.0);
            mesh.position.set(center.x, center.y, center.z);
            mesh.name = 'Sphere';
            viewer.model = mesh;
        };
        /**
         * Add a test box to a scene.
         * @param viewer Instance of the Viewer to display the model.
         */
        Loader.prototype.loadBoxModel = function (viewer) {
            // box
            var dimensions = 2.0;
            var width = dimensions;
            var height = dimensions;
            var depth = dimensions;
            var geometry = new THREE.BoxGeometry(width, height, depth);
            var material = new THREE.MeshPhongMaterial({ color: testModelColor });
            var mesh = new THREE.Mesh(geometry, material);
            var center = new THREE.Vector3(0.0, 0.0, 0.0);
            mesh.position.set(center.x, center.y, center.z);
            mesh.name = 'Box';
            viewer.model = mesh;
        };
        /**
         * Add a test model consisting of a tiered checkerboard
         * @param viewer Instance of the Viewer to display the model.
         */
        Loader.prototype.loadCheckerboardModel = function (viewer) {
            var gridLength = 2;
            var totalHeight = 1.0;
            var gridDivisions = 10;
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
                    var cell = Graphics_3.Graphics.createBoxMesh(cellOrigin, cellBase, cellBase, cellHeight, cellMaterial);
                    group.add(cell);
                    cellOrigin.x += cellBase;
                    cellOrigin.z += cellHeight;
                    cellColor += colorDelta;
                }
                cellOrigin.x = origin.x;
                cellOrigin.y += cellBase;
            }
            viewer.model = group;
        };
        return Loader;
    }());
    exports.Loader = Loader;
});
define("Viewer/MeshPreviewViewer", ["require", "exports", "three", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, Services_5, Viewer_1) {
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
        };
        /**
         * Initializes perspective camera.
         */
        MeshPreviewViewer.prototype.initializeDefaultCameraSettings = function () {
            var settings = {
                position: new THREE.Vector3(0.0, 0.0, 4.0),
                target: new THREE.Vector3(0, 0, 0),
                near: 0.1,
                far: 1000.0,
                fieldOfView: 37 // https://www.nikonians.org/reviews/fov-tables
            };
            return settings;
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
         * Initialize the viewer camera
         */
        ModelViewer.prototype.initializeDefaultCameraSettings = function () {
            var useTestCamera = true;
            var settingsOBJ = {
                // Baseline : near = 0.1, far = 10000
                // ZBuffer  : near = 100, far = 300
                position: new THREE.Vector3(0.0, 175.0, 500.0),
                target: new THREE.Vector3(0, 0, 0),
                near: 0.1,
                far: 10000,
                fieldOfView: 45
            };
            var settingsTestModels = {
                position: new THREE.Vector3(0.0, 0.0, 4.0),
                target: new THREE.Vector3(0, 0, 0),
                near: 0.1,
                far: 10000,
                fieldOfView: 37 // https://www.nikonians.org/reviews/fov-tables
            };
            return useTestCamera ? settingsTestModels : settingsOBJ;
        };
        /**
         * Adds lighting to the scene
         */
        ModelViewer.prototype.initializeLighting = function () {
            var ambientLight = new THREE.AmbientLight(0x404040);
            this._scene.add(ambientLight);
            var directionalLight1 = new THREE.DirectionalLight(0xC0C090);
            directionalLight1.position.set(-100, -50, 100);
            this._scene.add(directionalLight1);
            var directionalLight2 = new THREE.DirectionalLight(0xC0C090);
            directionalLight2.position.set(100, 50, -100);
            this._scene.add(directionalLight2);
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
            var size = 512;
            var factory = new DepthBufferFactory_1.DepthBufferFactory({ width: size, height: size, model: this._modelViewer._root, camera: this._modelViewer.camera, addCanvasToDOM: true });
            var previewMesh = factory.meshGenerate({ modelWidth: 2 });
            this._meshPreviewViewer.model = previewMesh;
            Services_6.Services.consoleLogger.addInfoMessage('Relief generated');
        };
        /**
         * Initialize the view settings that are controllable by the user
         */
        ModelRelief.prototype.initializeViewerControls = function () {
            var scope = this;
            var ViewerControls = (function () {
                function ViewerControls() {
                    this.displayGrid = true;
                    this.generateRelief = function () { };
                }
                return ViewerControls;
            }());
            var viewerControls = new ViewerControls();
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById('settingsControls');
            menuDiv.appendChild(gui.domElement);
            var folderOptions = gui.addFolder('ModelViewer Options');
            // Grid
            var controlDisplayGrid = folderOptions.add(viewerControls, 'displayGrid').name('Display Grid');
            controlDisplayGrid.onChange(function (value) {
                scope._modelViewer.displayGrid(value);
            }.bind(this));
            // Depth Buffer
            var controlGenerateRelief = folderOptions.add(viewerControls, 'generateRelief').name('Generate Relief');
            controlGenerateRelief.onChange(function () {
                scope.generateRelief();
            }.bind(this));
            folderOptions.open();
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
            //      this._loader.loadOBJModel (this._modelViewer);
            this._loader.loadCheckerboardModel(this._modelViewer);
            //      this._loader.loadTorusModel (this._modelViewer);
            //      this._loader.loadBoxModel (this._modelViewer);
            //      this._loader.loadSphereModel (this._modelViewer);
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
define("Workbench/CameraTest", ["require", "exports", "three", "dat-gui", "Viewer/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, dat, Graphics_4, Services_7, Viewer_3) {
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
        var boundingBoxMesh = Graphics_4.Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);
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
            var triad = Graphics_4.Graphics.createWorldAxesTriad(new THREE.Vector3(), 1, 0.25, 0.25);
            this._scene.add(triad);
            var box = Graphics_4.Graphics.createBoxMesh(new THREE.Vector3(1, 1, -2), 1, 2, 2, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
            box.rotation.set(Math.random(), Math.random(), Math.random());
            box.updateMatrix();
            var boxClone = Graphics_4.Graphics.cloneAndTransformObject(box, new THREE.Matrix4());
            this.model.add(boxClone);
            var sphere = Graphics_4.Graphics.createSphereMesh(new THREE.Vector3(4, 2, -1), 1, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
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
            var modelView = Graphics_4.Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
            var boundingBoxView = Graphics_4.Graphics.getBoundingBoxFromObject(modelView);
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
            model.remove(model.getObjectByName(Graphics_4.Graphics.BoundingBoxName));
            // clone model (and geometry!)
            var modelView = Graphics_4.Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
            // clear entire scene
            Graphics_4.Graphics.removeObjectChildren(model, false);
            model.add(modelView);
            var boundingBoxView = createBoundingBox(modelView, 0xff00ff);
            model.add(boundingBoxView);
            // transform model back from View to World
            var modelWorld = Graphics_4.Graphics.cloneAndTransformObject(modelView, cameraMatrixWorld);
            model.add(modelWorld);
            // transform bounding box back from View to World
            var boundingBoxWorld = Graphics_4.Graphics.cloneAndTransformObject(boundingBoxView, cameraMatrixWorld);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvVmlld2VyL0NhbWVyYS50cyIsIlNjcmlwdHMvU3lzdGVtL0xvZ2dlci50cyIsIlNjcmlwdHMvU3lzdGVtL1NlcnZpY2VzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvR3JhcGhpY3MudHMiLCJTY3JpcHRzL1N5c3RlbS9NYXRoLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlci50cyIsIlNjcmlwdHMvU3lzdGVtL1Rvb2xzLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlckZhY3RvcnkudHMiLCJTY3JpcHRzL01vZGVsTG9hZGVycy9PQkpMb2FkZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9UcmFja2JhbGxDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL01hdGVyaWFscy50cyIsIlNjcmlwdHMvVmlld2VyL1ZpZXdlci50cyIsIlNjcmlwdHMvTW9kZWxMb2FkZXJzL0xvYWRlci50cyIsIlNjcmlwdHMvVmlld2VyL01lc2hQcmV2aWV3Vmlld2VyLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTW9kZWxWaWV3ZXIudHMiLCJTY3JpcHRzL01vZGVsUmVsaWVmLnRzIiwiU2NyaXB0cy9Vbml0VGVzdHMvVW5pdFRlc3RzLnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvQ2FtZXJhVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0RlcHRoQnVmZmVyVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0luaGVyaXRhbmNlVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDhFQUE4RTtJQUM5RSw2RUFBNkU7SUFDN0UsdUpBQXVKO0lBQ3ZKLDZFQUE2RTtJQUM3RSw2RUFBNkU7SUFDN0UsWUFBWSxDQUFDOztJQUliOzs7O09BSUc7SUFDSDtRQUVJOztXQUVHO1FBQ0g7UUFDQSxDQUFDO1FBRUwseUJBQXlCO1FBQ2QsNkJBQXNCLEdBQTdCLFVBQStCLE1BQWdDLEVBQUUsS0FBbUI7WUFFaEYsSUFBSSxVQUFV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O1FBQ3ZDLENBQUM7UUFDTCxZQUFDO0lBQUQsQ0FSQSxBQVFDLENBUjBCLE1BQU0sR0FRaEM7SUFSWSxzQkFBSztJQVVsQjs7O09BR0c7SUFDSDtRQUVJOztXQUVHO1FBQ0g7UUFDQSxDQUFDO1FBRUQ7O1dBRUc7UUFDSCw4QkFBSSxHQUFKO1lBRUksSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVqQixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlELFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUV0QixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDTCxzQkFBQztJQUFELENBckJBLEFBcUJDLElBQUE7SUFyQlksMENBQWU7SUF1QjVCLElBQUksV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDO0lBQ3RDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJ3d3dyb290L2pzL21vZGVscmVsaWVmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuICAgICAgICAgIFxyXG4vKipcclxuICogQ2FtZXJhXHJcbiAqIEdlbmVyYWwgY2FtZXJhIHV0aWxpdHkgbWV0aG9kcy5cclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FtZXJhIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBDbGlwcGluZyBQbGFuZXNcclxuICAgIHN0YXRpYyBvcHRpbWl6ZUNsaXBwaW5nUGxhbmVzIChjYW1lcmEgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgbW9kZWwgOiBUSFJFRS5Hcm91cCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBtb2RlbENsb25lIDogVEhSRUUuR3JvdXAgPSBtb2RlbC5jbG9uZSh0cnVlKTtcclxuICAgICAgICBtb2RlbENsb25lLmFwcGx5TWF0cml4KGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG1vZGVsID0gbW9kZWxDbG9uZTtcclxuICAgIH1cclxuXHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIExvZ2dpbmcgSW50ZXJmYWNlXHJcbiAqIERpYWdub3N0aWMgbG9nZ2luZ1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBMb2dnZXIge1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpO1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKTtcclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZyk7XHJcbiAgICBhZGRNZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKTtcclxuXHJcbiAgICBhZGRFbXB0eUxpbmUgKCk7XHJcblxyXG4gICAgY2xlYXJMb2coKTtcclxufVxyXG4gICAgICAgICBcclxuZW51bSBNZXNzYWdlQ2xhc3Mge1xyXG4gICAgRXJyb3IgICA9ICdsb2dFcnJvcicsXHJcbiAgICBXYXJuaW5nID0gJ2xvZ1dhcm5pbmcnLFxyXG4gICAgSW5mbyAgICA9ICdsb2dJbmZvJyxcclxuICAgIE5vbmUgICAgPSAnbG9nTm9uZSdcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnNvbGUgbG9nZ2luZ1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25zb2xlTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2Vye1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0IGEgZ2VuZXJhbCBtZXNzYWdlIGFuZCBhZGQgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlQ2xhc3MgTWVzc2FnZSBjbGFzcy5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZUVudHJ5IChtZXNzYWdlIDogc3RyaW5nLCBtZXNzYWdlQ2xhc3MgOiBNZXNzYWdlQ2xhc3MpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByZWZpeCA9ICdNb2RlbFJlbGllZjogJztcclxuICAgICAgICBsZXQgbG9nTWVzc2FnZSA9IGAke3ByZWZpeH0ke21lc3NhZ2V9YDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlQ2xhc3MpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZUNsYXNzLkVycm9yOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuV2FybmluZzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuSW5mbzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuTm9uZTpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2UgRXJyb3IgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeShlcnJvck1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSB3YXJuaW5nTWVzc2FnZSBXYXJuaW5nIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KHdhcm5pbmdNZXNzYWdlLCBNZXNzYWdlQ2xhc3MuV2FybmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gaW5mb3JtYXRpb25hbCBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gaW5mb01lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRJbmZvTWVzc2FnZSAoaW5mb01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkoaW5mb01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5JbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBzdHlsZSBPcHRpb25hbCBzdHlsZS5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZSAobWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KG1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5Ob25lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gZW1wdHkgbGluZVxyXG4gICAgICovXHJcbiAgICBhZGRFbXB0eUxpbmUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbG9nIG91dHB1dFxyXG4gICAgICovXHJcbiAgICBjbGVhckxvZyAoKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBIVE1MIGxvZ2dpbmdcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSFRNTExvZ2dlciBpbXBsZW1lbnRzIExvZ2dlcntcclxuXHJcbiAgICByb290SWQgICAgICAgICAgIDogc3RyaW5nO1xyXG4gICAgcm9vdEVsZW1lbnRUYWcgICA6IHN0cmluZztcclxuICAgIHJvb3RFbGVtZW50ICAgICAgOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBtZXNzYWdlVGFnICAgICAgIDogc3RyaW5nO1xyXG4gICAgYmFzZU1lc3NhZ2VDbGFzcyA6IHN0cmluZ1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucm9vdElkICAgICAgICAgPSAnbG9nZ2VyUm9vdCdcclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50VGFnID0gJ3VsJztcclxuXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlVGFnICAgICAgID0gJ2xpJztcclxuICAgICAgICB0aGlzLmJhc2VNZXNzYWdlQ2xhc3MgPSAnbG9nTWVzc2FnZSc7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RoaXMucm9vdElkfWApO1xyXG4gICAgICAgIGlmICghdGhpcy5yb290RWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5yb290RWxlbWVudFRhZyk7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQuaWQgPSB0aGlzLnJvb3RJZDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJvb3RFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdCBhIGdlbmVyYWwgbWVzc2FnZSBhbmQgYXBwZW5kIHRvIHRoZSBsb2cgcm9vdC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlQ2xhc3MgQ1NTIGNsYXNzIHRvIGJlIGFkZGVkIHRvIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2VFbGVtZW50IChtZXNzYWdlIDogc3RyaW5nLCBtZXNzYWdlQ2xhc3M/IDogc3RyaW5nKSA6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbWVzc2FnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMubWVzc2FnZVRhZyk7XHJcbiAgICAgICAgbWVzc2FnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG5cclxuICAgICAgICBtZXNzYWdlRWxlbWVudC5jbGFzc05hbWUgICA9IGAke3RoaXMuYmFzZU1lc3NhZ2VDbGFzc30gJHttZXNzYWdlQ2xhc3MgPyBtZXNzYWdlQ2xhc3MgOiAnJ31gOztcclxuXHJcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBlcnJvciBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlIEVycm9yIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRWxlbWVudChlcnJvck1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSB3YXJuaW5nTWVzc2FnZSBXYXJuaW5nIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQod2FybmluZ01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5XYXJuaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBpbmZvTWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KGluZm9NZXNzYWdlLCBNZXNzYWdlQ2xhc3MuSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKiBAcGFyYW0gc3R5bGUgT3B0aW9uYWwgQ1NTIHN0eWxlLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlIChtZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2VFbGVtZW50ID0gdGhpcy5hZGRNZXNzYWdlRWxlbWVudChtZXNzYWdlKTtcclxuICAgICAgICBpZiAoc3R5bGUpXHJcbiAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gZW1wdHkgbGluZVxyXG4gICAgICovXHJcbiAgICBhZGRFbXB0eUxpbmUgKCkge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTQwNTQ3L2xpbmUtYnJlYWstaW5zaWRlLWEtbGlzdC1pdGVtLWdlbmVyYXRlcy1zcGFjZS1iZXR3ZWVuLXRoZS1saW5lc1xyXG4vLyAgICAgIHRoaXMuYWRkTWVzc2FnZSgnPGJyLz48YnIvPicpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlKCcuJyk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbG9nIG91dHB1dFxyXG4gICAgICovXHJcbiAgICBjbGVhckxvZyAoKSB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM5NTUyMjkvcmVtb3ZlLWFsbC1jaGlsZC1lbGVtZW50cy1vZi1hLWRvbS1ub2RlLWluLWphdmFzY3JpcHRcclxuICAgICAgICB3aGlsZSAodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyLCBIVE1MTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIFNlcnZpY2VzXHJcbiAqIEdlbmVyYWwgcnVudGltZSBzdXBwb3J0XHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VzIHtcclxuXHJcbiAgICBzdGF0aWMgY29uc29sZUxvZ2dlciA6IENvbnNvbGVMb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcigpO1xyXG4gICAgc3RhdGljIGh0bWxMb2dnZXIgICAgOiBIVE1MTG9nZ2VyICAgID0gbmV3IEhUTUxMb2dnZXIoKTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TW9kZWxSZWxpZWZ9ICAgICAgICAgICAgZnJvbSAnTW9kZWxSZWxpZWYnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhbWVyYVNldHRpbmdzIHtcclxuICAgIHBvc2l0aW9uOiAgICAgICBUSFJFRS5WZWN0b3IzOyAgICAgICAgLy8gbG9jYXRpb24gb2YgY2FtZXJhXHJcbiAgICB0YXJnZXQ6ICAgICAgICAgVEhSRUUuVmVjdG9yMzsgICAgICAgIC8vIHRhcmdldCBwb2ludFxyXG4gICAgbmVhcjogICAgICAgICAgIG51bWJlcjsgICAgICAgICAgICAgICAvLyBuZWFyIGNsaXBwaW5nIHBsYW5lXHJcbiAgICBmYXI6ICAgICAgICAgICAgbnVtYmVyOyAgICAgICAgICAgICAgIC8vIGZhciBjbGlwcGluZyBwbGFuZVxyXG4gICAgZmllbGRPZlZpZXc6ICAgIG51bWJlcjsgICAgICAgICAgICAgICAvLyBmaWVsZCBvZiB2aWV3XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAgR2VuZXJhbCBUSFJFRS5qcy9XZWJHTCBzdXBwb3J0IHJvdXRpbmVzXHJcbiAqICBHcmFwaGljcyBMaWJyYXJ5XHJcbiAqICBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHcmFwaGljcyB7XHJcblxyXG4gICAgc3RhdGljIEJvdW5kaW5nQm94TmFtZSAgICAgOiBzdHJpbmcgPSAnQm91bmRpbmcgQm94JztcclxuICAgIHN0YXRpYyBCb3hOYW1lICAgICAgICAgICAgIDogc3RyaW5nID0gJ0JveCc7XHJcbiAgICBzdGF0aWMgUGxhbmVOYW1lICAgICAgICAgICA6IHN0cmluZyA9ICdQbGFuZSc7XHJcbiAgICBzdGF0aWMgU3BoZXJlTmFtZSAgICAgICAgICA6IHN0cmluZyA9ICdTcGhlcmUnO1xyXG4gICAgc3RhdGljIFRyaWFkTmFtZSAgICAgICAgICAgOiBzdHJpbmcgPSAnVHJpYWQnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEdlb21ldHJ5XHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdEdlb21ldHJ5XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFuIG9iamVjdCBhbmQgYWxsIGNoaWxkcmVuIGZyb20gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSBzY2VuZSBTY2VuZSBob2xkaW5nIG9iamVjdCB0byBiZSByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIHJvb3RPYmplY3QgUGFyZW50IG9iamVjdCAocG9zc2libHkgd2l0aCBjaGlsZHJlbikuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW1vdmVPYmplY3RDaGlsZHJlbihyb290T2JqZWN0IDogVEhSRUUuT2JqZWN0M0QsIHJlbW92ZVJvb3QgOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIGlmICghcm9vdE9iamVjdClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgbG9nZ2VyICA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgbGV0IHJlbW92ZXIgPSBmdW5jdGlvbiAob2JqZWN0M2QpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChvYmplY3QzZCA9PT0gcm9vdE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UgKCdSZW1vdmluZzogJyArIG9iamVjdDNkLm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ2dlb21ldHJ5JykpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDNkLmdlb21ldHJ5LmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCdtYXRlcmlhbCcpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gb2JqZWN0M2QubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWwuaGFzT3duUHJvcGVydHkoJ21hdGVyaWFscycpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbHMgPSBtYXRlcmlhbC5tYXRlcmlhbHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaU1hdGVyaWFsIGluIG1hdGVyaWFscykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWxzLmhhc093blByb3BlcnR5KGlNYXRlcmlhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsc1tpTWF0ZXJpYWxdLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ3RleHR1cmUnKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0M2QudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByb290T2JqZWN0LnRyYXZlcnNlKHJlbW92ZXIpO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgcm9vdCBjaGlsZHJlbiBmcm9tIHJvb3QgKGJhY2t3YXJkcyEpXHJcbiAgICAgICAgZm9yIChsZXQgaUNoaWxkIDogbnVtYmVyID0gKHJvb3RPYmplY3QuY2hpbGRyZW4ubGVuZ3RoIC0gMSk7IGlDaGlsZCA+PSAwOyBpQ2hpbGQtLSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNoaWxkIDogVEhSRUUuT2JqZWN0M0QgPSByb290T2JqZWN0LmNoaWxkcmVuW2lDaGlsZF07XHJcbiAgICAgICAgICAgIHJvb3RPYmplY3QucmVtb3ZlIChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVtb3ZlUm9vdCAmJiByb290T2JqZWN0LnBhcmVudClcclxuICAgICAgICAgICAgcm9vdE9iamVjdC5wYXJlbnQucmVtb3ZlKHJvb3RPYmplY3QpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENsb25lIGFuZCB0cmFuc2Zvcm0gYW4gb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIG9iamVjdCBPYmplY3QgdG8gY2xvbmUgYW5kIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSBtYXRyaXggVHJhbnNmb3JtYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QgKG9iamVjdCA6IFRIUkVFLk9iamVjdDNELCBtYXRyaXggOiBUSFJFRS5NYXRyaXg0KSA6IFRIUkVFLk9iamVjdDNEIHtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgb2JqZWN0IChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBvYmplY3RDbG9uZSA6IFRIUkVFLk9iamVjdDNEID0gb2JqZWN0LmNsb25lKCk7XHJcbiAgICAgICAgb2JqZWN0Q2xvbmUudHJhdmVyc2Uob2JqZWN0ID0+IHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mKFRIUkVFLk1lc2gpKVxyXG4gICAgICAgICAgICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5LmNsb25lKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE4uQi4gSW1wb3J0YW50ISBUaGUgcG9zdGlvbiwgcm90YXRpb24gKHF1YXRlcm5pb24pIGFuZCBzY2FsZSBhcmUgY29ycmVjeSBidXQgdGhlIG1hdHJpeCBoYXMgbm90IGJlZW4gdXBkYXRlZC5cclxuICAgICAgICAvLyBUSFJFRS5qcyB1cGRhdGVzIHRoZSBtYXRyaXggaXMgdXBkYXRlZCBpbiB0aGUgcmVuZGVyKCkgbG9vcC5cclxuICAgICAgICBvYmplY3RDbG9uZS51cGRhdGVNYXRyaXgoKTsgICAgIFxyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm1cclxuICAgICAgICBvYmplY3RDbG9uZS5hcHBseU1hdHJpeChtYXRyaXgpO1xyXG5cclxuICAgICAgICByZXR1cm4gb2JqZWN0Q2xvbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHBhcmFtIG1lc2ggTWVzaCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3VuZGluZyBib3guXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwgb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEAgcmV0dXJucyBNZXNoIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tR2VvbWV0cnkocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBnZW9tZXRyeSA6IFRIUkVFLkdlb21ldHJ5LCBtYXRlcmlhbCA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2h7XHJcblxyXG4gICAgICAgIHZhciBib3VuZGluZ0JveCAgICAgOiBUSFJFRS5Cb3gzLFxyXG4gICAgICAgICAgICB3aWR0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGVwdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBib3hNZXNoICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGdlb21ldHJ5LmJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3ggKHBvc2l0aW9uLCBib3VuZGluZ0JveCwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94TWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiBib3guXHJcbiAgICAgKiBAcGFyYW0gYm94IEdlb21ldHJ5IEJveCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbCBvZiB0aGUgYm94LlxyXG4gICAgICogQCByZXR1cm5zIE1lc2ggb2YgdGhlIGJveC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGJvdW5kaW5nQm94IDogVEhSRUUuQm94MywgbWF0ZXJpYWwgOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBkZXB0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGJveE1lc2ggICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIHdpZHRoICA9IGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLng7XHJcbiAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdCb3gubWF4LnkgLSBib3VuZGluZ0JveC5taW4ueTtcclxuICAgICAgICBkZXB0aCAgPSBib3VuZGluZ0JveC5tYXgueiAtIGJvdW5kaW5nQm94Lm1pbi56O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3hNZXNoIChwb3NpdGlvbiwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG1hdGVyaWFsKTtcclxuICAgICAgICBib3hNZXNoLm5hbWUgPSBHcmFwaGljcy5Cb3VuZGluZ0JveE5hbWU7XHJcblxyXG4gICAgICAgIHJldHVybiBib3hNZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgZXh0ZW5kcyBvZiBhbiBvYmplY3Qgb3B0aW9uYWxseSBpbmNsdWRpbmcgYWxsIGNoaWxkcmVuLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KHJvb3RPYmplY3QgOiBUSFJFRS5PYmplY3QzRCkgOiBUSFJFRS5Cb3gzIHtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTU0OTI4NTcvYW55LXdheS10by1nZXQtYS1ib3VuZGluZy1ib3gtZnJvbS1hLXRocmVlLWpzLW9iamVjdDNkXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94IDogVEhSRUUuQm94MyA9IG5ldyBUSFJFRS5Cb3gzKCk7XHJcbiAgICAgICAgYm91bmRpbmdCb3ggPSBib3VuZGluZ0JveC5zZXRGcm9tT2JqZWN0KHJvb3RPYmplY3QpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGJveCBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIHRoZSBib3guXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGguXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodC5cclxuICAgICAqIEBwYXJhbSBkZXB0aCBEZXB0aC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBPcHRpb25hbCBtYXRlcmlhbC5cclxuICAgICAqIEByZXR1cm5zIEJveCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlQm94TWVzaChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOiBudW1iZXIsIGRlcHRoIDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBib3hHZW9tZXRyeSAgOiBUSFJFRS5Cb3hHZW9tZXRyeSxcclxuICAgICAgICAgICAgYm94TWF0ZXJpYWwgIDogVEhSRUUuTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIGJveCAgICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIGJveEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHdpZHRoLCBoZWlnaHQsIGRlcHRoKTtcclxuICAgICAgICBib3hHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgYm94TWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMGZmLCBvcGFjaXR5OiAxLjB9ICk7XHJcblxyXG4gICAgICAgIGJveCA9IG5ldyBUSFJFRS5NZXNoKCBib3hHZW9tZXRyeSwgYm94TWF0ZXJpYWwpO1xyXG4gICAgICAgIGJveC5uYW1lID0gR3JhcGhpY3MuQm94TmFtZTtcclxuICAgICAgICBib3gucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBib3g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgcGxhbmUgbWVzaC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiB0aGUgcGxhbmUuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGguXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBPcHRpb25hbCBtYXRlcmlhbC5cclxuICAgICAqIEByZXR1cm5zIFBsYW5lIG1lc2guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVQbGFuZU1lc2gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCB3aWR0aCA6IG51bWJlciwgaGVpZ2h0IDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBcclxuICAgICAgICAgICAgICAgICAgICBwbGFuZUdlb21ldHJ5ICA6IFRIUkVFLlBsYW5lR2VvbWV0cnksXHJcbiAgICAgICAgICAgICAgICAgICAgcGxhbmVNYXRlcmlhbCAgOiBUSFJFRS5NYXRlcmlhbCxcclxuICAgICAgICAgICAgICAgICAgICBwbGFuZSAgICAgICAgICA6IFRIUkVFLk1lc2g7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkod2lkdGgsIGhlaWdodCk7ICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcGxhbmVNYXRlcmlhbCA9IG1hdGVyaWFsIHx8IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwZmYsIG9wYWNpdHk6IDEuMH0gKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIHBsYW5lID0gbmV3IFRIUkVFLk1lc2gocGxhbmVHZW9tZXRyeSwgcGxhbmVNYXRlcmlhbCk7XHJcbiAgICAgICAgICAgICAgICBwbGFuZS5uYW1lID0gR3JhcGhpY3MuUGxhbmVOYW1lO1xyXG4gICAgICAgICAgICAgICAgcGxhbmUucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxhbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHNwaGVyZSBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIE9yaWdpbiBvZiB0aGUgc3BoZXJlLlxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBSYWRpdXMuXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgQ29sb3IuXHJcbiAgICAgKiBAcGFyYW0gc2VnbWVudHMgTWVzaCBzZWdtZW50cy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVNwaGVyZU1lc2gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCByYWRpdXMgOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIHZhciBzcGhlcmVHZW9tZXRyeSAgOiBUSFJFRS5TcGhlcmVHZW9tZXRyeSxcclxuICAgICAgICAgICAgc2VnbWVudENvdW50ICAgIDogbnVtYmVyID0gMzIsXHJcbiAgICAgICAgICAgIHNwaGVyZU1hdGVyaWFsICA6IFRIUkVFLk1hdGVyaWFsLFxyXG4gICAgICAgICAgICBzcGhlcmUgICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBzcGhlcmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShyYWRpdXMsIHNlZ21lbnRDb3VudCwgc2VnbWVudENvdW50KTtcclxuICAgICAgICBzcGhlcmVHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgc3BoZXJlTWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgc3BoZXJlID0gbmV3IFRIUkVFLk1lc2goIHNwaGVyZUdlb21ldHJ5LCBzcGhlcmVNYXRlcmlhbCApO1xyXG4gICAgICAgIHNwaGVyZS5uYW1lID0gR3JhcGhpY3MuU3BoZXJlTmFtZTtcclxuICAgICAgICBzcGhlcmUucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBzcGhlcmU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGxpbmUgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0YXJ0UG9zaXRpb24gU3RhcnQgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0gZW5kUG9zaXRpb24gRW5kIHBvaW50LlxyXG4gICAgICogQHBhcmFtIGNvbG9yIENvbG9yLlxyXG4gICAgICogQHJldHVybnMgTGluZSBlbGVtZW50LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlTGluZShzdGFydFBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgZW5kUG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBjb2xvciA6IG51bWJlcikgOiBUSFJFRS5MaW5lIHtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgICAgICAgICAgICA6IFRIUkVFLkxpbmUsXHJcbiAgICAgICAgICAgIGxpbmVHZW9tZXRyeSAgICA6IFRIUkVFLkdlb21ldHJ5LFxyXG4gICAgICAgICAgICBtYXRlcmlhbCAgICAgICAgOiBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbGluZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICAgICAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2ggKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IGNvbG9yfSApO1xyXG4gICAgICAgIGxpbmUgPSBuZXcgVEhSRUUuTGluZShsaW5lR2VvbWV0cnksIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXhlcyB0cmlhZC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBPcmlnaW4gb2YgdGhlIHRyaWFkLlxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBMZW5ndGggb2YgdGhlIGNvb3JkaW5hdGUgYXJyb3cuXHJcbiAgICAgKiBAcGFyYW0gaGVhZExlbmd0aCBMZW5ndGggb2YgdGhlIGFycm93IGhlYWQuXHJcbiAgICAgKiBAcGFyYW0gaGVhZFdpZHRoIFdpZHRoIG9mIHRoZSBhcnJvdyBoZWFkLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlV29ybGRBeGVzVHJpYWQocG9zaXRpb24/IDogVEhSRUUuVmVjdG9yMywgbGVuZ3RoPyA6IG51bWJlciwgaGVhZExlbmd0aD8gOiBudW1iZXIsIGhlYWRXaWR0aD8gOiBudW1iZXIpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgdHJpYWRHcm91cCAgICAgIDogVEhSRUUuT2JqZWN0M0QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKSxcclxuICAgICAgICAgICAgYXJyb3dQb3NpdGlvbiAgIDogVEhSRUUuVmVjdG9yMyAgPSBwb3NpdGlvbiB8fG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgICAgICAgIGFycm93TGVuZ3RoICAgICA6IG51bWJlciA9IGxlbmd0aCAgICAgfHwgMTUsXHJcbiAgICAgICAgICAgIGFycm93SGVhZExlbmd0aCA6IG51bWJlciA9IGhlYWRMZW5ndGggfHwgMSxcclxuICAgICAgICAgICAgYXJyb3dIZWFkV2lkdGggIDogbnVtYmVyID0gaGVhZFdpZHRoICB8fCAxO1xyXG5cclxuICAgICAgICB0cmlhZEdyb3VwLmFkZChuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMCksIGFycm93UG9zaXRpb24sIGFycm93TGVuZ3RoLCAweGZmMDAwMCwgYXJyb3dIZWFkTGVuZ3RoLCBhcnJvd0hlYWRXaWR0aCkpO1xyXG4gICAgICAgIHRyaWFkR3JvdXAuYWRkKG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgYXJyb3dQb3NpdGlvbiwgYXJyb3dMZW5ndGgsIDB4MDBmZjAwLCBhcnJvd0hlYWRMZW5ndGgsIGFycm93SGVhZFdpZHRoKSk7XHJcbiAgICAgICAgdHJpYWRHcm91cC5hZGQobmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBhcnJvd1Bvc2l0aW9uLCBhcnJvd0xlbmd0aCwgMHgwMDAwZmYsIGFycm93SGVhZExlbmd0aCwgYXJyb3dIZWFkV2lkdGgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyaWFkR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGF4ZXMgZ3JpZC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAgT3JpZ2luIG9mIHRoZSBheGVzIGdyaWQuXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSBTaXplIG9mIHRoZSBncmlkLlxyXG4gICAgICogQHBhcmFtIHN0ZXAgR3JpZCBsaW5lIGludGVydmFscy5cclxuICAgICAqIEByZXR1cm5zIEdyaWQgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlV29ybGRBeGVzR3JpZChwb3NpdGlvbj8gOiBUSFJFRS5WZWN0b3IzLCBzaXplPyA6IG51bWJlciwgc3RlcD8gOiBudW1iZXIpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgZ3JpZEdyb3VwICAgICAgIDogVEhSRUUuT2JqZWN0M0QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKSxcclxuICAgICAgICAgICAgZ3JpZFBvc2l0aW9uICAgIDogVEhSRUUuVmVjdG9yMyAgPSBwb3NpdGlvbiB8fG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgICAgICAgIGdyaWRTaXplICAgICAgICA6IG51bWJlciA9IHNpemUgfHwgMTAsXHJcbiAgICAgICAgICAgIGdyaWRTdGVwICAgICAgICA6IG51bWJlciA9IHN0ZXAgfHwgMSxcclxuICAgICAgICAgICAgY29sb3JDZW50ZXJsaW5lIDogbnVtYmVyID0gIDB4ZmYwMDAwMDAsXHJcbiAgICAgICAgICAgIHh5R3JpZCAgICAgICAgICAgOiBUSFJFRS5HcmlkSGVscGVyLFxyXG4gICAgICAgICAgICB5ekdyaWQgICAgICAgICAgIDogVEhSRUUuR3JpZEhlbHBlcixcclxuICAgICAgICAgICAgenhHcmlkICAgICAgICAgICA6IFRIUkVFLkdyaWRIZWxwZXI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHh5R3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKGdyaWRTaXplLCBncmlkU3RlcCk7XHJcbiAgICAgICAgeHlHcmlkLnNldENvbG9ycyhjb2xvckNlbnRlcmxpbmUsIDB4ZmYwMDAwKTtcclxuICAgICAgICB4eUdyaWQucG9zaXRpb24uY29weShncmlkUG9zaXRpb24uY2xvbmUoKSk7XHJcbiAgICAgICAgeHlHcmlkLnJvdGF0ZU9uQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSwgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi54ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi55ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIGdyaWRHcm91cC5hZGQoeHlHcmlkKTtcclxuXHJcbiAgICAgICAgeXpHcmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoZ3JpZFNpemUsIGdyaWRTdGVwKTtcclxuICAgICAgICB5ekdyaWQuc2V0Q29sb3JzKGNvbG9yQ2VudGVybGluZSwgMHgwMGZmMDApO1xyXG4gICAgICAgIHl6R3JpZC5wb3NpdGlvbi5jb3B5KGdyaWRQb3NpdGlvbi5jbG9uZSgpKTtcclxuICAgICAgICB5ekdyaWQucm90YXRlT25BeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLnkgKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLnogKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgZ3JpZEdyb3VwLmFkZCh5ekdyaWQpO1xyXG5cclxuICAgICAgICB6eEdyaWQgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcihncmlkU2l6ZSwgZ3JpZFN0ZXApO1xyXG4gICAgICAgIHp4R3JpZC5zZXRDb2xvcnMoY29sb3JDZW50ZXJsaW5lLCAweDAwMDBmZik7XHJcbiAgICAgICAgenhHcmlkLnBvc2l0aW9uLmNvcHkoZ3JpZFBvc2l0aW9uLmNsb25lKCkpO1xyXG4gICAgICAgIHp4R3JpZC5yb3RhdGVPbkF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24ueiArPSBncmlkU2l6ZTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24ueCArPSBncmlkU2l6ZTtcclxuICAgICAgICBncmlkR3JvdXAuYWRkKHp4R3JpZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBncmlkR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIEFkZHMgYSBjYW1lcmEgaGVscGVyIHRvIGEgc2NlbmUgdG8gdmlzdWFsaXplIHRoZSBjYW1lcmEgcG9zaXRpb24uXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhIHRvIGNvbnN0cnVjdCBoZWxwZXIgKG1heSBiZSBudWxsKS5cclxuICAgICAgKi9cclxuICAgIHN0YXRpYyBhZGRDYW1lcmFIZWxwZXIgKHNjZW5lIDogVEhSRUUuU2NlbmUsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiB2b2lke1xyXG5cclxuICAgICAgICBpZiAoY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIGxldCBjYW1lcmFIZWxwZXIgPSBuZXcgVEhSRUUuQ2FtZXJhSGVscGVyKGNhbWVyYSApO1xyXG4gICAgICAgICAgICBjYW1lcmFIZWxwZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHNjZW5lLmFkZChjYW1lcmFIZWxwZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQWRkcyBhIGNvb3JkaW5hdGUgYXhpcyBoZWxwZXIgdG8gYSBzY2VuZSB0byB2aXN1YWxpemUgdGhlIHdvcmxkIGF4ZXMuXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqL1xyXG4gICAgc3RhdGljIGFkZEF4aXNIZWxwZXIgKHNjZW5lIDogVEhSRUUuU2NlbmUsIHNpemUgOiBudW1iZXIpIDogdm9pZHtcclxuXHJcbiAgICAgICAgbGV0IGF4aXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhpc0hlbHBlcihzaXplKTtcclxuICAgICAgICBheGlzSGVscGVyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHNjZW5lLmFkZChheGlzSGVscGVyKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gQ29vcmRpbmF0ZSBDb252ZXJzaW9uXHJcbiAgICAvKlxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIENvb3JkaW5hdGUgU3lzdGVtc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgRlJBTUVcdCAgICAgICAgICAgIEVYQU1QTEVcdFx0XHRcdFx0XHRcdFx0XHRcdFNQQUNFICAgICAgICAgICAgICAgICAgICAgIFVOSVRTICAgICAgICAgICAgICAgICAgICAgICBOT1RFU1xyXG5cclxuICAgIE1vZGVsICAgICAgICAgICAgICAgQ2F0YWxvZyBXZWJHTDogTW9kZWwsIEJhbmRFbGVtZW50IEJsb2NrICAgICBvYmplY3QgICAgICAgICAgICAgICAgICAgICAgbW0gICAgICAgICAgICAgICAgICAgICAgICAgIFJoaW5vIGRlZmluaXRpb25zXHJcbiAgICBXb3JsZCAgICAgICAgICAgICAgIERlc2lnbiBNb2RlbFx0XHRcdFx0XHRcdFx0XHR3b3JsZCAgICAgICAgICAgICAgICAgICAgICAgbW0gXHJcbiAgICBWaWV3ICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldyAgICAgICAgICAgICAgICAgICAgICAgIG1tXHJcbiAgICBEZXZpY2UgICAgICAgICAgICAgIE5vcm1hbGl6ZWQgdmlld1x0XHRcdFx0XHRcdFx0ICAgIGRldmljZSAgICAgICAgICAgICAgICAgICAgICBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgIFNjcmVlbi5QYWdlICAgICAgICAgSFRNTCBwYWdlXHRcdFx0XHRcdFx0XHRcdFx0c2NyZWVuICAgICAgICAgICAgICAgICAgICAgIHB4ICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAgYXQgVG9wIExlZnQsICtZIGRvd24gICAgSFRNTCBwYWdlXHJcbiAgICBTY3JlZW4uQ2xpZW50ICAgICAgIEJyb3dzZXIgdmlldyBwb3J0IFx0XHRcdFx0XHRcdCAgICBzY3JlZW4gICAgICAgICAgICAgICAgICAgICAgcHggICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCBhdCBUb3AgTGVmdCwgK1kgZG93biAgICBicm93c2VyIHdpbmRvd1xyXG4gICAgU2NyZWVuLkNvbnRhaW5lciAgICBET00gY29udGFpbmVyXHRcdFx0XHRcdFx0XHRcdHNjcmVlbiAgICAgICAgICAgICAgICAgICAgICBweCAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwIGF0IFRvcCBMZWZ0LCArWSBkb3duICAgIEhUTUwgY2FudmFzXHJcblxyXG4gICAgTW91c2UgRXZlbnQgUHJvcGVydGllc1xyXG4gICAgaHR0cDovL3d3dy5qYWNrbG1vb3JlLmNvbS9ub3Rlcy9tb3VzZS1wb3NpdGlvbi9cclxuICAgICovXHJcbiAgICAgICAgXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFdvcmxkIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHdvcmxkQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMyB7XHJcblxyXG4gICAgICAgIHZhciB3b3JsZENvb3JkaW5hdGVzICAgIDogVEhSRUUuVmVjdG9yMyxcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMyRCA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBkZXZpY2VaICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gdGhpcy5kZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICBkZXZpY2VaID0gKGNhbWVyYSBpbnN0YW5jZW9mIFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSA/IDAuNSA6IDEuMDtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEID0gbmV3IFRIUkVFLlZlY3RvcjMoZGV2aWNlQ29vcmRpbmF0ZXMyRC54LCBkZXZpY2VDb29yZGluYXRlczJELnksIGRldmljZVopO1xyXG5cclxuICAgICAgICB3b3JsZENvb3JkaW5hdGVzID0gZGV2aWNlQ29vcmRpbmF0ZXMzRC51bnByb2plY3QoY2FtZXJhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHdvcmxkQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRWaWV3IENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB3b3JsZCBjb29yZGluYXRlcyB0byB2aWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciBXb3JsZCBjb29yZGluYXRlIHZlY3RvciB0byBjb252ZXJ0LlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdmlld0Nvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IzIHtcclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLCAgXHJcbiAgICAgICAgICAgIHZpZXdDb29yZGluYXRlcyAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgdmlld0Nvb3JkaW5hdGVzID0gcG9zaXRpb24uYXBwbHlNYXRyaXg0KGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlld0Nvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0RGV2aWNlIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIG5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEByZXR1cm5zIE5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5KSA6IFRIUkVFLlZlY3RvcjIge1xyXG5cclxuICAgICAgICB2YXIgZGV2aWNlQ29vcmRpbmF0ZXMgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgcmF0aW9YLCAgcmF0aW9ZICAgICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGV2aWNlWCwgZGV2aWNlWSAgICAgICAgICAgICA6IG51bWJlcjtcclxuXHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgPSB0aGlzLnNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgcmF0aW9YID0gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueCAvIGNvbnRhaW5lci53aWR0aCgpO1xyXG4gICAgICAgIHJhdGlvWSA9IHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnkgLyBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGRldmljZVggPSArKChyYXRpb1ggKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZVkgPSAtKChyYXRpb1kgKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlWCwgZGV2aWNlWSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXZpY2VDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIGRldmljZSBjb29yZGluYXRlcyBbLTEsIDFdLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciAgV29ybGQgY29vcmRpbmF0ZXMgdmVjdG9yLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcHJldHVybnMgRGV2aWNlIGNvb3JpbmRhdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2lzc3Vlcy83OFxyXG4gICAgICAgIHZhciBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICA6IFRIUkVFLlZlY3RvcjMgPSB2ZWN0b3IuY2xvbmUoKSwgIFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgICAgICAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCA9IHBvc2l0aW9uLnByb2plY3QoY2FtZXJhKTtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlQ29vcmRpbmF0ZXMzRC54LCBkZXZpY2VDb29yZGluYXRlczNELnkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGV2aWNlQ29vcmRpbmF0ZXMyRDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFNjcmVlbiBDb29yZGluYXRlc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLyoqXHJcbiAgICAgKiBQYWdlIGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIChwYWdlKSBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlblBhZ2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlblBhZ2VDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cclxuICAgICAgICBzY3JlZW5QYWdlQ29vcmRpbmF0ZXMueCA9IGV2ZW50LnBhZ2VYO1xyXG4gICAgICAgIHNjcmVlblBhZ2VDb29yZGluYXRlcy55ID0gZXZlbnQucGFnZVk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5QYWdlQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2xpZW50IGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSA8YnJvd3Nlcj4gdmlldyBwb3J0LiBJZiB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gc2Nyb2xsZWQgaXQgd2lsbFxyXG4gICAgICogYmUgZGlmZmVyZW50IHRoYW4gdGhlIHBhZ2UgY29vcmRpbmF0ZXMgd2hpY2ggYXJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGUgdG9wIGxlZnQgb2YgdGhlIDxlbnRpcmU+IEhUTUwgcGFnZSBkb2N1bWVudC5cclxuICAgICAqIGh0dHA6Ly93d3cuYmVubmFkZWwuY29tL2Jsb2cvMTg2OS1qcXVlcnktbW91c2UtZXZlbnRzLXBhZ2V4LXktdnMtY2xpZW50eC15Lmh0bVxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiBjbGllbnQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5DbGllbnRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnkgPSBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBKUXVlcnkgZXZlbnQgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnkpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXHJcbiAgICAgICAgICAgIGNvbnRhaW5lck9mZnNldCAgICAgICAgICAgIDogSlF1ZXJ5Q29vcmRpbmF0ZXMsXHJcbiAgICAgICAgICAgIHBhZ2VYLCBwYWdlWSAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBjb250YWluZXJPZmZzZXQgPSBjb250YWluZXIub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEpRdWVyeSBkb2VzIG5vdCBzZXQgcGFnZVgvcGFnZVkgZm9yIERyb3AgZXZlbnRzLiBUaGV5IGFyZSBkZWZpbmVkIGluIHRoZSBvcmlnaW5hbEV2ZW50IG1lbWJlci5cclxuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYIHx8ICg8YW55PihldmVudC5vcmlnaW5hbEV2ZW50KSkucGFnZVg7XHJcbiAgICAgICAgcGFnZVkgPSBldmVudC5wYWdlWSB8fCAoPGFueT4oZXZlbnQub3JpZ2luYWxFdmVudCkpLnBhZ2VZO1xyXG5cclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy54ID0gcGFnZVggLSBjb250YWluZXJPZmZzZXQubGVmdDtcclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy55ID0gcGFnZVkgLSBjb250YWluZXJPZmZzZXQudG9wO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yIFdvcmxkIHZlY3Rvci5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvaXNzdWVzLzc4XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlcyAgICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgbGVmdCAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIHRvcCAgICAgICAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICAvLyBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlcyA9IHRoaXMuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyhwb3NpdGlvbiwgY2FtZXJhKTtcclxuICAgICAgICBsZWZ0ID0gKCgrZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMikgKiBjb250YWluZXIud2lkdGgoKTtcclxuICAgICAgICB0b3AgID0gKCgtZGV2aWNlQ29vcmRpbmF0ZXMueSArIDEpIC8gMikgKiBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIobGVmdCwgdG9wKTtcclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEludGVyc2VjdGlvbnNcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vICBJbnRlcnNlY3Rpb25zXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBSYXljYXN0ZXIgdGhyb3VnaCB0aGUgbW91c2Ugd29ybGQgcG9zaXRpb24uXHJcbiAgICAgKiBAcGFyYW0gbW91c2VXb3JsZCBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgVEhSRUUuUmF5Y2FzdGVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmF5Y2FzdGVyRnJvbU1vdXNlIChtb3VzZVdvcmxkIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlJheWNhc3RlcntcclxuXHJcbiAgICAgICAgdmFyIHJheU9yaWdpbiAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMgKG1vdXNlV29ybGQueCwgbW91c2VXb3JsZC55LCBjYW1lcmEucG9zaXRpb24ueiksXHJcbiAgICAgICAgICAgIHdvcmxkUG9pbnQgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMobW91c2VXb3JsZC54LCBtb3VzZVdvcmxkLnksIG1vdXNlV29ybGQueik7XHJcblxyXG4vLyAgICAgICAgICBUb29scy5jb25zb2xlTG9nKCdXb3JsZCBtb3VzZSBjb29yZGluYXRlczogJyArIHdvcmxkUG9pbnQueCArICcsICcgKyB3b3JsZFBvaW50LnkpO1xyXG5cclxuICAgICAgICAvLyBjb25zdHJ1Y3QgcmF5IGZyb20gY2FtZXJhIHRvIG1vdXNlIHdvcmxkXHJcbiAgICAgICAgdmFyIHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIgKHJheU9yaWdpbiwgd29ybGRQb2ludC5zdWIgKHJheU9yaWdpbikubm9ybWFsaXplKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF5Y2FzdGVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBJbnRlcnNlY3Rpb24gbG9jYXRlZCBieSB0aGUgY3Vyc29yLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHBhcmFtIHNjZW5lT2JqZWN0cyBBcnJheSBvZiBzY2VuZSBvYmplY3RzLlxyXG4gICAgICogQHBhcmFtIHJlY3Vyc2UgUmVjdXJzZSB0aHJvdWdoIG9iamVjdHMuXHJcbiAgICAgKiBAcmV0dXJucyBGaXJzdCBpbnRlcnNlY3Rpb24gd2l0aCBzY3JlZW4gb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEZpcnN0SW50ZXJzZWN0aW9uKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhLCBzY2VuZU9iamVjdHMgOiBUSFJFRS5PYmplY3QzRFtdLCByZWN1cnNlIDogYm9vbGVhbikgOiBUSFJFRS5JbnRlcnNlY3Rpb24ge1xyXG5cclxuICAgICAgICB2YXIgcmF5Y2FzdGVyICAgICAgICAgIDogVEhSRUUuUmF5Y2FzdGVyLFxyXG4gICAgICAgICAgICBtb3VzZVdvcmxkICAgICAgICAgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBpSW50ZXJzZWN0aW9uICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGludGVyc2VjdGlvbiAgICAgICA6IFRIUkVFLkludGVyc2VjdGlvbjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnN0cnVjdCByYXkgZnJvbSBjYW1lcmEgdG8gbW91c2Ugd29ybGRcclxuICAgICAgICBtb3VzZVdvcmxkID0gR3JhcGhpY3Mud29ybGRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIsIGNhbWVyYSk7XHJcbiAgICAgICAgcmF5Y2FzdGVyICA9IEdyYXBoaWNzLnJheWNhc3RlckZyb21Nb3VzZSAobW91c2VXb3JsZCwgY2FtZXJhKTtcclxuXHJcbiAgICAgICAgLy8gZmluZCBhbGwgb2JqZWN0IGludGVyc2VjdGlvbnNcclxuICAgICAgICB2YXIgaW50ZXJzZWN0cyA6IFRIUkVFLkludGVyc2VjdGlvbltdID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMgKHNjZW5lT2JqZWN0cywgcmVjdXJzZSk7XHJcblxyXG4gICAgICAgIC8vIG5vIGludGVyc2VjdGlvbj9cclxuICAgICAgICBpZiAoaW50ZXJzZWN0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1c2UgZmlyc3Q7IHJlamVjdCBsaW5lcyAoVHJhbnNmb3JtIEZyYW1lKVxyXG4gICAgICAgIGZvciAoaUludGVyc2VjdGlvbiA9IDA7IGlJbnRlcnNlY3Rpb24gPCBpbnRlcnNlY3RzLmxlbmd0aDsgaUludGVyc2VjdGlvbisrKSB7XHJcblxyXG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3RzW2lJbnRlcnNlY3Rpb25dO1xyXG4gICAgICAgICAgICBpZiAoIShpbnRlcnNlY3Rpb24ub2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuTGluZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSGVscGVyc1xyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIEhlbHBlcnNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIFdlYkdMIHRhcmdldCBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gaWQgRE9NIGlkIGZvciBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgY2FudmFzLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZUNhbnZhcyhpZCA6IHN0cmluZywgd2lkdGg/IDogbnVtYmVyLCBoZWlnaHQ/IDogbnVtYmVyKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgIFxyXG4gICAgICAgIGxldCBjYW52YXMgOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aWR9YCk7XHJcbiAgICAgICAgaWYgKCFjYW52YXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYENhbnZhcyBlbGVtZW50IGlkID0gJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ1NTIGNvbnRyb2xzIHRoZSBzaXplXHJcbiAgICAgICAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KVxyXG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgZGltZW5zaW9ucyAgICBcclxuICAgICAgICBjYW52YXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIHJldHVybiBjYW52YXM7XHJcbiAgICB9XHJcblxyXG5cclxuLy8jZW5kcmVnaW9uXHJcblxyXG59IiwiICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGggTGlicmFyeVxyXG4gKiBHZW5lcmFsIG1hdGhlbWF0aWNzIHJvdXRpbmVzXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1hdGhMaWJyYXJ5IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHR3byBudW1iZXJzIGFyZSBlcXVhbCB3aXRoaW4gdGhlIGdpdmVuIHRvbGVyYW5jZS5cclxuICAgICAqIEBwYXJhbSB2YWx1ZSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlLlxyXG4gICAgICogQHBhcmFtIG90aGVyIFNlY29uZCB2YWx1ZSB0byBjb21wYXJlLlxyXG4gICAgICogQHBhcmFtIHRvbGVyYW5jZSBUb2xlcmFuY2UgZm9yIGNvbXBhcmlzb24uXHJcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHdpdGhpbiB0b2xlcmFuY2UuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBudW1iZXJzRXF1YWxXaXRoaW5Ub2xlcmFuY2UodmFsdWUgOiBudW1iZXIsIG90aGVyIDogbnVtYmVyLCB0b2xlcmFuY2UgOiBudW1iZXIpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoKHZhbHVlID49IChvdGhlciAtIHRvbGVyYW5jZSkpICYmICh2YWx1ZSA8PSAob3RoZXIgKyB0b2xlcmFuY2UpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQge2Fzc2VydH0gICAgICAgICAgICAgZnJvbSAnY2hhaSdcclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuaW50ZXJmYWNlIEZhY2VQYWlyIHtcclxuICAgICAgICBcclxuICAgIHZlcnRpY2VzIDogVEhSRUUuVmVjdG9yM1tdO1xyXG4gICAgZmFjZXMgICAgOiBUSFJFRS5GYWNlM1tdO1xyXG59XHJcbiAgICAgICAgICBcclxuLyoqXHJcbiAqICBEZXB0aEJ1ZmZlciBcclxuICogIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERlcHRoQnVmZmVyIHtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgTWVzaE1vZGVsTmFtZSAgICAgICA6IHN0cmluZyA9ICdNb2RlbE1lc2gnO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG5vcm1hbGl6ZWRUb2xlcmFuY2UgOiBudW1iZXIgPSAuMDAxOyAgICBcclxuXHJcbiAgICBfbG9nZ2VyIDogTG9nZ2VyO1xyXG5cclxuICAgIF9yZ2JhQXJyYXkgOiBVaW50OEFycmF5O1xyXG4gICAgZGVwdGhzICAgICA6IEZsb2F0MzJBcnJheTtcclxuICAgIHdpZHRoICAgICAgOiBudW1iZXI7XHJcbiAgICBoZWlnaHQgICAgIDogbnVtYmVyO1xyXG5cclxuICAgIGNhbWVyYSAgICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcclxuICAgIF9uZWFyQ2xpcFBsYW5lICAgOiBudW1iZXI7XHJcbiAgICBfZmFyQ2xpcFBsYW5lICAgIDogbnVtYmVyO1xyXG4gICAgX2NhbWVyYUNsaXBSYW5nZSA6IG51bWJlcjtcclxuICAgIFxyXG4gICAgX21pbmltdW1Ob3JtYWxpemVkIDogbnVtYmVyO1xyXG4gICAgX21heGltdW1Ob3JtYWxpemVkIDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gcmdiYUFycmF5IFJhdyBhcmF5IG9mIFJHQkEgYnl0ZXMgcGFja2VkIHdpdGggZmxvYXRzLlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoIG9mIG1hcC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0IG9mIG1hcC5cclxuICAgICAqIEBwYXJhbSBuZWFyQ2xpcFBsYW5lIENhbWVyYSBuZWFyIGNsaXBwaW5nIHBsYW5lLlxyXG4gICAgICogQHBhcmFtIGZhckNsaXBQbGFuZSBDYW1lcmEgZmFyIGNsaXBwaW5nIHBsYW5lLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihyZ2JhQXJyYXkgOiBVaW50OEFycmF5LCB3aWR0aCA6IG51bWJlciwgaGVpZ2h0IDpudW1iZXIsIGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcmdiYUFycmF5ID0gcmdiYUFycmF5O1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoICA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gY2FtZXJhO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBhc3BlY3QgcmF0aW9uIG9mIHRoZSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCBhc3BlY3RSYXRpbyAoKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtaW5pbXVtTm9ybWFsaXplZCAoKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pbmltdW1Ob3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWluaW11bSBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1pbmltdW0oKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgbGV0IG1pbmltdW0gPSB0aGlzLm5vcm1hbGl6ZWRUb01vZGVsRGVwdGgodGhpcy5fbWluaW11bU5vcm1hbGl6ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWluaW11bTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1heGltdW1Ob3JtYWxpemVkICgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4aW11bSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgbWF4aW11bSA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aCh0aGlzLm1heGltdW1Ob3JtYWxpemVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1heGltdW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpemVkIGRlcHRoIHJhbmdlIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCByYW5nZU5vcm1hbGl6ZWQoKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgbGV0IGRlcHRoTm9ybWFsaXplZCA6IG51bWJlciA9IHRoaXMuX21heGltdW1Ob3JtYWxpemVkIC0gdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQ7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXB0aE5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpemVkIGRlcHRoIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCByYW5nZSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgZGVwdGggOiBudW1iZXIgPSB0aGlzLm1heGltdW0gLSB0aGlzLm1pbmltdW07XHJcblxyXG4gICAgICAgIHJldHVybiBkZXB0aDtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIHRoZSBleHRlbnRzIG9mIHRoZSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi8gICAgICAgXHJcbiAgICBjYWxjdWxhdGVFeHRlbnRzICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNaW5pbXVtTm9ybWFsaXplZCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXRNYXhpbXVtTm9ybWFsaXplZCgpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplXHJcbiAgICAgKi8gICAgICAgXHJcbiAgICBpbml0aWFsaXplICgpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5odG1sTG9nZ2VyOyAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5fbmVhckNsaXBQbGFuZSAgID0gdGhpcy5jYW1lcmEubmVhcjtcclxuICAgICAgICB0aGlzLl9mYXJDbGlwUGxhbmUgICAgPSB0aGlzLmNhbWVyYS5mYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhQ2xpcFJhbmdlID0gdGhpcy5fZmFyQ2xpcFBsYW5lIC0gdGhpcy5fbmVhckNsaXBQbGFuZTtcclxuXHJcbiAgICAgICAgLy8gUkdCQSAtPiBGbG9hdDMyXHJcbiAgICAgICAgdGhpcy5kZXB0aHMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX3JnYmFBcnJheS5idWZmZXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBleHRyZW1hIG9mIGRlcHRoIGJ1ZmZlciB2YWx1ZXNcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUV4dGVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnQgYSBub3JtYWxpemVkIGRlcHRoIFswLDFdIHRvIGRlcHRoIGluIG1vZGVsIHVuaXRzLlxyXG4gICAgICogQHBhcmFtIG5vcm1hbGl6ZWREZXB0aCBOb3JtYWxpemVkIGRlcHRoIFswLDFdLlxyXG4gICAgICovXHJcbiAgICBub3JtYWxpemVkVG9Nb2RlbERlcHRoKG5vcm1hbGl6ZWREZXB0aCA6IG51bWJlcikgOiBudW1iZXIge1xyXG5cclxuICAgICAgICAvL04uQi4gVGhpcyBkb2VzIG5vdCB5aWVsZCB0aGUgY29ycmVjdCByZXN1bHQuIFxyXG4gICAgICAgIC8vIFRoZSB2YWx1ZXMgYXJlIHRvbyBsYXJnZSAofjEwMDAwKS5cclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjY1MjI1My9nZXR0aW5nLXRoZS10cnVlLXotdmFsdWUtZnJvbS10aGUtZGVwdGgtYnVmZmVyXHJcbiAgICAgICAgbm9ybWFsaXplZERlcHRoID0gMi4wICogbm9ybWFsaXplZERlcHRoIC0gMS4wO1xyXG4gICAgICAgIGxldCB6TGluZWFyID0gMi4wICogdGhpcy5jYW1lcmEubmVhciAqIHRoaXMuY2FtZXJhLmZhciAvICh0aGlzLmNhbWVyYS5mYXIgKyB0aGlzLmNhbWVyYS5uZWFyIC0gbm9ybWFsaXplZERlcHRoICogKHRoaXMuY2FtZXJhLmZhciAtIHRoaXMuY2FtZXJhLm5lYXIpKTtcclxuXHJcbiAgICAgICAgLy8gekxpbmVhciBpcyB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2FtZXJhOyByZXZlcnNlIHRvIHlpZWxkIGhlaWdodCBmcm9tIG1lc2ggcGxhbmVcclxuICAgICAgICB6TGluZWFyID0gLSh6TGluZWFyIC0gdGhpcy5jYW1lcmEuZmFyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHpMaW5lYXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpemVkIGRlcHRoIHZhbHVlIGF0IGEgcGl4ZWwgaW5kZXhcclxuICAgICAqIEBwYXJhbSByb3cgQnVmZmVyIHJvdy5cclxuICAgICAqIEBwYXJhbSBjb2x1bW4gQnVmZmVyIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgZGVwdGhOb3JtYWxpemVkIChyb3cgOiBudW1iZXIsIGNvbHVtbikgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgaW5kZXggPSAoTWF0aC5yb3VuZChyb3cpICogdGhpcy53aWR0aCkgKyBNYXRoLnJvdW5kKGNvbHVtbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGhzW2luZGV4XVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZGVwdGggdmFsdWUgYXQgYSBwaXhlbCBpbmRleC5cclxuICAgICAqIEBwYXJhbSByb3cgTWFwIHJvdy5cclxuICAgICAqIEBwYXJhbSBwaXhlbENvbHVtbiBNYXAgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBkZXB0aChyb3cgOiBudW1iZXIsIGNvbHVtbikgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgZGVwdGhOb3JtYWxpemVkID0gdGhpcy5kZXB0aE5vcm1hbGl6ZWQocm93LCBjb2x1bW4pO1xyXG4gICAgICAgIGxldCBkZXB0aCA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aChkZXB0aE5vcm1hbGl6ZWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBkZXB0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG1pbmltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TWluaW11bU5vcm1hbGl6ZWQoKSB7XHJcblxyXG4gICAgICAgIGxldCBtaW5pbXVtTm9ybWFsaXplZCA6IG51bWJlciA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgdGhpcy5kZXB0aHMubGVuZ3RoOyBpbmRleCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aFZhbHVlIDogbnVtYmVyID0gdGhpcy5kZXB0aHNbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRlcHRoVmFsdWUgPCBtaW5pbXVtTm9ybWFsaXplZClcclxuICAgICAgICAgICAgICAgIG1pbmltdW1Ob3JtYWxpemVkID0gZGVwdGhWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9taW5pbXVtTm9ybWFsaXplZCA9IG1pbmltdW1Ob3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgbWF4aW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBzZXRNYXhpbXVtTm9ybWFsaXplZCgpIHtcclxuXHJcbiAgICAgICAgbGV0IG1heGltdW1Ob3JtYWxpemVkIDogbnVtYmVyID0gTnVtYmVyLk1JTl9WQUxVRTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleDogbnVtYmVyID0gMDsgaW5kZXggPCB0aGlzLmRlcHRocy5sZW5ndGg7IGluZGV4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoVmFsdWUgOiBudW1iZXIgPSB0aGlzLmRlcHRoc1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmIChkZXB0aFZhbHVlID4gbWF4aW11bU5vcm1hbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICBtYXhpbXVtTm9ybWFsaXplZCA9IGRlcHRoVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQgPSBtYXhpbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbi8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbGluZWFyIGluZGV4IG9mIGEgbW9kZWwgcG9pbnQgaW4gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gd29ybGRWZXJ0ZXggVmVydGV4IG9mIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXRNb2RlbFZlcnRleEluZGljZXMgKHdvcmxkVmVydGV4IDogVEhSRUUuVmVjdG9yMywgcGxhbmVCb3VuZGluZ0JveCA6IFRIUkVFLkJveDMpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICBcclxuICAgICAgICBsZXQgYm94U2l6ZSAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHBsYW5lQm91bmRpbmdCb3guZ2V0U2l6ZSgpO1xyXG4gICAgICAgIGxldCBtZXNoRXh0ZW50cyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIgKGJveFNpemUueCwgYm94U2l6ZS55KTtcclxuXHJcbiAgICAgICAgLy8gIG1hcCBjb29yZGluYXRlcyB0byBvZmZzZXRzIGluIHJhbmdlIFswLCAxXVxyXG4gICAgICAgIGxldCBvZmZzZXRYIDogbnVtYmVyID0gKHdvcmxkVmVydGV4LnggKyAoYm94U2l6ZS54IC8gMikpIC8gYm94U2l6ZS54O1xyXG4gICAgICAgIGxldCBvZmZzZXRZIDogbnVtYmVyID0gKHdvcmxkVmVydGV4LnkgKyAoYm94U2l6ZS55IC8gMikpIC8gYm94U2l6ZS55O1xyXG5cclxuICAgICAgICBsZXQgcm93ICAgIDogbnVtYmVyID0gb2Zmc2V0WSAqICh0aGlzLmhlaWdodCAtIDEpO1xyXG4gICAgICAgIGxldCBjb2x1bW4gOiBudW1iZXIgPSBvZmZzZXRYICogKHRoaXMud2lkdGggLSAxKTtcclxuICAgICAgICByb3cgICAgPSBNYXRoLnJvdW5kKHJvdyk7XHJcbiAgICAgICAgY29sdW1uID0gTWF0aC5yb3VuZChjb2x1bW4pO1xyXG5cclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChyb3cgPj0gMCkgJiYgKHJvdyA8IHRoaXMuaGVpZ2h0KSwgKGBWZXJ0ZXggKCR7d29ybGRWZXJ0ZXgueH0sICR7d29ybGRWZXJ0ZXgueX0sICR7d29ybGRWZXJ0ZXguen0pIHlpZWxkZWQgcm93ID0gJHtyb3d9YCkpO1xyXG4gICAgICAgIGFzc2VydC5pc1RydWUoKGNvbHVtbj49IDApICYmIChjb2x1bW4gPCB0aGlzLndpZHRoKSwgKGBWZXJ0ZXggKCR7d29ybGRWZXJ0ZXgueH0sICR7d29ybGRWZXJ0ZXgueX0sICR7d29ybGRWZXJ0ZXguen0pIHlpZWxkZWQgY29sdW1uID0gJHtjb2x1bW59YCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjIocm93LCBjb2x1bW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBsaW5lYXIgaW5kZXggb2YgYSBtb2RlbCBwb2ludCBpbiB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSB3b3JsZFZlcnRleCBWZXJ0ZXggb2YgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldE1vZGVsVmVydGV4SW5kZXggKHdvcmxkVmVydGV4IDogVEhSRUUuVmVjdG9yMywgcGxhbmVCb3VuZGluZ0JveCA6IFRIUkVFLkJveDMpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZXMgOiBUSFJFRS5WZWN0b3IyID0gdGhpcy5nZXRNb2RlbFZlcnRleEluZGljZXMod29ybGRWZXJ0ZXgsIHBsYW5lQm91bmRpbmdCb3gpOyAgICBcclxuICAgICAgICBsZXQgcm93ICAgIDogbnVtYmVyID0gaW5kaWNlcy54O1xyXG4gICAgICAgIGxldCBjb2x1bW4gOiBudW1iZXIgPSBpbmRpY2VzLnk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4ID0gKHJvdyAqIHRoaXMud2lkdGgpICsgY29sdW1uO1xyXG4gICAgICAgIGluZGV4ID0gTWF0aC5yb3VuZChpbmRleCk7XHJcblxyXG4gICAgICAgIGFzc2VydC5pc1RydWUoKGluZGV4ID49IDApICYmIChpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIGluZGV4ID0gJHtpbmRleH1gKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH1cclxuICAgIC8qKlxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIG1lc2ggb2YgdGhlIGdpdmVuIGJhc2UgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIG1vZGVsV2lkdGggQmFzZSBkaW1lbnNpb24gKG1vZGVsIHVuaXRzKS4gSGVpZ2h0IGlzIGNvbnRyb2xsZWQgYnkgREIgYXNwZWN0IHJhdGlvLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE1hdGVyaWFsIHRvIGFzc2lnbiB0byBtZXNoLlxyXG4gICAgICovXHJcbiAgICBtZXNoKG1vZGVsV2lkdGggOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICBpZiAoIW1hdGVyaWFsKVxyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7d2lyZWZyYW1lIDogZmFsc2UsIGNvbG9yIDogMHhmZjAwZmYsIHJlZmxlY3Rpdml0eSA6IDAuNzUsIHNoaW5pbmVzcyA6IDAuNzV9KTtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG4gICAgICAgIGxldCBmYWNlU2l6ZSAgICAgICAgOiBudW1iZXIgPSBtb2RlbFdpZHRoIC8gKHRoaXMud2lkdGggLSAxKTtcclxuICAgICAgICBsZXQgYmFzZVZlcnRleEluZGV4IDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaVJvdyA9IDA7IGlSb3cgPCAodGhpcy5oZWlnaHQgLSAxKTsgaVJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlDb2x1bW4gPSAwOyBpQ29sdW1uIDwgKHRoaXMud2lkdGggLSAxKTsgaUNvbHVtbisrKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBmYWNlUGFpciA9IHRoaXMuY29uc3RydWN0VHJpRmFjZXNBdE9mZnNldChpUm93LCBpQ29sdW1uLCBmYWNlU2l6ZSwgYmFzZVZlcnRleEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkudmVydGljZXMucHVzaCguLi5mYWNlUGFpci52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkuZmFjZXMucHVzaCguLi5mYWNlUGFpci5mYWNlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmFzZVZlcnRleEluZGV4ICs9IDQ7XHJcbiAgICAgICAgICAgIH0gICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IG1lc2ggID0gbmV3IFRIUkVFLk1lc2gobWVzaEdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgbWVzaC5uYW1lID0gRGVwdGhCdWZmZXIuTWVzaE1vZGVsTmFtZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgcGFpciBvZiB0cmlhbmd1bGFyIGZhY2VzIGF0IHRoZSBnaXZlbiBvZmZzZXQgaW4gdGhlIERlcHRoQnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHJvdyBSb3cgb2Zmc2V0IChMb3dlciBMZWZ0KS5cclxuICAgICAqIEBwYXJhbSBjb2x1bW4gQ29sdW1uIG9mZnNldCAoTG93ZXIgTGVmdCkuXHJcbiAgICAgKiBAcGFyYW0gZmFjZVNpemUgU2l6ZSBvZiBhIGZhY2UgZWRnZSAobm90IGh5cG90ZW51c2UpLlxyXG4gICAgICogQHBhcmFtIGJhc2VWZXJ0ZXhJbmRleCBCZWdpbm5pbmcgb2Zmc2V0IGluIG1lc2ggZ2VvbWV0cnkgdmVydGV4IGFycmF5LlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RUcmlGYWNlc0F0T2Zmc2V0IChyb3cgOiBudW1iZXIsIGNvbHVtbiA6IG51bWJlciwgZmFjZVNpemUgOiBudW1iZXIsIGJhc2VWZXJ0ZXhJbmRleCA6IG51bWJlcikgOiBGYWNlUGFpciB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGZhY2VQYWlyIDogRmFjZVBhaXIgPSB7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgIGZhY2VzICAgIDogW11cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICBWZXJ0aWNlc1xyXG4gICAgICAgIC8vICAgMiAgICAzICAgICAgIFxyXG4gICAgICAgIC8vICAgMCAgICAxXHJcblxyXG4gICAgICAgIGxldCBtZXNoV2lkdGggIDogbnVtYmVyID0gKHRoaXMud2lkdGggLSAxKSAqIGZhY2VTaXplO1xyXG4gICAgICAgIGxldCBtZXNoSGVpZ2h0IDogbnVtYmVyID0gKHRoaXMuaGVpZ2h0LSAxKSAqIGZhY2VTaXplO1xyXG5cclxuICAgICAgICAvLyBtZXNoIGNlbnRlciB3aWxsIGJlIGF0IHRoZSB3b3JsZCBvcmlnaW5cclxuICAgICAgICBsZXQgb3JpZ2luWCA6IG51bWJlciA9IChjb2x1bW4gKiBmYWNlU2l6ZSkgLSAobWVzaFdpZHRoIC8gMik7XHJcbiAgICAgICAgbGV0IG9yaWdpblkgOiBudW1iZXIgPSAocm93ICAgICogZmFjZVNpemUpIC0gKG1lc2hIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdCAgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIDAsICAgICAgICAgb3JpZ2luWSArIDAsICAgICAgICB0aGlzLmRlcHRoKHJvdyArIDAsIGNvbHVtbisgMCkpOyAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAwXHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHQgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIGZhY2VTaXplLCAgb3JpZ2luWSArIDAsICAgICAgICB0aGlzLmRlcHRoKHJvdyArIDAsIGNvbHVtbiArIDEpKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAxXHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdCAgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIDAsICAgICAgICAgb3JpZ2luWSArIGZhY2VTaXplLCB0aGlzLmRlcHRoKHJvdyArIDEsIGNvbHVtbiArIDApKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAyXHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHQgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIGZhY2VTaXplLCAgb3JpZ2luWSArIGZhY2VTaXplLCB0aGlzLmRlcHRoKHJvdyArIDEsIGNvbHVtbiArIDEpKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAzXHJcblxyXG4gICAgICAgIGZhY2VQYWlyLnZlcnRpY2VzLnB1c2goXHJcbiAgICAgICAgICAgICBsb3dlckxlZnQsICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDBcclxuICAgICAgICAgICAgIGxvd2VyUmlnaHQsICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMVxyXG4gICAgICAgICAgICAgdXBwZXJMZWZ0LCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAyXHJcbiAgICAgICAgICAgICB1cHBlclJpZ2h0ICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDNcclxuICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgIC8vIHJpZ2h0IGhhbmQgcnVsZSBmb3IgcG9seWdvbiB3aW5kaW5nXHJcbiAgICAgICAgIGZhY2VQYWlyLmZhY2VzLnB1c2goXHJcbiAgICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoYmFzZVZlcnRleEluZGV4ICsgMCwgYmFzZVZlcnRleEluZGV4ICsgMSwgYmFzZVZlcnRleEluZGV4ICsgMyksXHJcbiAgICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoYmFzZVZlcnRleEluZGV4ICsgMCwgYmFzZVZlcnRleEluZGV4ICsgMywgYmFzZVZlcnRleEluZGV4ICsgMilcclxuICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGZhY2VQYWlyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZXMgcHJvcGVydGllcyBvZiBhIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmNsZWFyTG9nKCk7XHJcblxyXG4gICAgICAgIGxldCBtaWRkbGUgPSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICBsZXQgZGVjaW1hbFBsYWNlcyA9IDU7XHJcbiAgICAgICAgbGV0IGhlYWRlclN0eWxlICAgPSBcImZvbnQtZmFtaWx5IDogbW9ub3NwYWNlOyBmb250LXdlaWdodCA6IGJvbGQ7IGNvbG9yIDogYmx1ZTsgZm9udC1zaXplIDogMThweFwiO1xyXG4gICAgICAgIGxldCBtZXNzYWdlU3R5bGUgID0gXCJmb250LWZhbWlseSA6IG1vbm9zcGFjZTsgY29sb3IgOiBibGFjazsgZm9udC1zaXplIDogMTRweFwiO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZSgnQ2FtZXJhIFByb3BlcnRpZXMnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE5lYXIgUGxhbmUgPSAke3RoaXMuY2FtZXJhLm5lYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgRmFyIFBsYW5lICA9ICR7dGhpcy5jYW1lcmEuZmFyfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENsaXAgUmFuZ2UgPSAke3RoaXMuY2FtZXJhLmZhciAtIHRoaXMuY2FtZXJhLm5lYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRW1wdHlMaW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKCdOb3JtYWxpemVkJywgaGVhZGVyU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBDZW50ZXIgRGVwdGggPSAke3RoaXMuZGVwdGhOb3JtYWxpemVkKG1pZGRsZSwgbWlkZGxlKS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYFogUmFuZ2UgPSAke3RoaXMucmFuZ2VOb3JtYWxpemVkLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWluaW11bSA9ICR7dGhpcy5taW5pbXVtTm9ybWFsaXplZC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1heGltdW0gPSAke3RoaXMubWF4aW11bU5vcm1hbGl6ZWQudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFbXB0eUxpbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoJ01vZGVsIFVuaXRzJywgaGVhZGVyU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBDZW50ZXIgRGVwdGggPSAke3RoaXMuZGVwdGgobWlkZGxlLCBtaWRkbGUpLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgWiBSYW5nZSA9ICR7dGhpcy5yYW5nZS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1pbmltdW0gPSAke3RoaXMubWluaW11bS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1heGltdW0gPSAke3RoaXMubWF4aW11bS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICB9XHJcbn0iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuICAgICAgICAgXHJcbi8qKlxyXG4gKiBUb29sIExpYnJhcnlcclxuICogR2VuZXJhbCB1dGlsaXR5IHJvdXRpbmVzXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRvb2xzIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFV0aWxpdHlcclxuICAgIC8vLyA8c3VtbWFyeT4gICAgICAgIFxyXG4gICAgLy8gR2VuZXJhdGUgYSBwc2V1ZG8gR1VJRC5cclxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuICAgIHN0YXRpYyBnZW5lcmF0ZVBzZXVkb0dVSUQoKSB7XHJcbiAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcbiAgICAgXHJcbiAgICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbi8qXHJcbiAgUmVxdWlyZW1lbnRzXHJcbiAgICBObyBwZXJzaXN0ZW50IERPTSBlbGVtZW50LiBUaGUgY2FudmFzIGlzIGNyZWF0ZWQgZHluYW1pY2FsbHkuXHJcbiAgICAgICAgT3B0aW9uIGZvciBwZXJzaXN0aW5nIHRoZSBGYWN0b3J5IGluIHRoZSBjb25zdHJ1Y3RvclxyXG4gICAgSlNPTiBjb21wYXRpYmxlIGNvbnN0cnVjdG9yIHBhcmFtZXRlcnNcclxuICAgIEZpeGVkIHJlc29sdXRpb247IHJlc2l6aW5nIHN1cHBvcnQgaXMgbm90IHJlcXVpcmVkLlxyXG4qL1xyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmF9ICAgICAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9ICAgICAgICAgICAgZnJvbSAnRGVwdGhCdWZmZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7TW9kZWxSZWxpZWZ9ICAgICAgICAgICAgZnJvbSAnTW9kZWxSZWxpZWYnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VG9vbHN9ICAgICAgICAgICAgICAgICAgZnJvbSAnVG9vbHMnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMge1xyXG5cclxuICAgIHdpZHRoICAgICAgICAgICAgOiBudW1iZXIsICAgICAgICAgICAgICAgICAgLy8gd2lkdGggb2YgREJcclxuICAgIGhlaWdodCAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgLy8gaGVpZ2h0IG9mIERCICAgICAgICBcclxuICAgIG1vZGVsICAgICAgICAgICAgOiBUSFJFRS5Hcm91cCwgICAgICAgICAgICAgLy8gbW9kZWwgcm9vdFxyXG5cclxuICAgIGNhbWVyYT8gICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgLy8gY2FtZXJhXHJcbiAgICBcclxuICAgIGxvZ0RlcHRoQnVmZmVyPyAgOiBib29sZWFuLCAgICAgICAgICAgICAgICAgLy8gdXNlIGxvZ2FyaXRobWljIGRlcHRoIGJ1ZmZlciBmb3IgaGlnaGVyIHJlc29sdXRpb24gKGJldHRlciBkaXN0cmlidXRpb24pIGluIHNjZW5lcyB3aXRoIGxhcmdlIGV4dGVudHNcclxuICAgIGJvdW5kZWRDbGlwcGluZz8gOiBib29sZWFuLCAgICAgICAgICAgICAgICAgLy8gb3ZlcnJyaWQgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byBib3VuZCBtb2RlbFxyXG4gICAgXHJcbiAgICBhZGRDYW52YXNUb0RPTT8gIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgIC8vIHZpc2libGUgY2FudmFzOyBhZGQgdG8gSFRNTFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1lc2hHZW5lcmF0ZVBhcmFtZXRlcnMge1xyXG5cclxuICAgIG1vZGVsV2lkdGggICAgICAgOiBudW1iZXI7XHJcbiAgICBjYW1lcmE/ICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XHJcbiAgICBtYXRlcmlhbD8gICAgICAgIDogVEhSRUUuTWF0ZXJpYWw7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VHZW5lcmF0ZVBhcmFtZXRlcnMge1xyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIERlcHRoQnVmZmVyRmFjdG9yeVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERlcHRoQnVmZmVyRmFjdG9yeSB7XHJcblxyXG4gICAgc3RhdGljIERlZmF1bHRSZXNvbHV0aW9uIDogbnVtYmVyICAgICAgICAgICA9IDEwMjQ7ICAgICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBEQiByZXNvbHV0aW9uXHJcbiAgICBzdGF0aWMgQ3NzQ2xhc3NOYW1lICAgICAgOiBzdHJpbmcgICAgICAgICAgID0gJ0RlcHRoQnVmZmVyRmFjdG9yeSc7ICAgICAvLyBDU1MgY2xhc3NcclxuICAgIHN0YXRpYyBSb290Q29udGFpbmVySWQgICA6IHN0cmluZyAgICAgICAgICAgPSAncm9vdENvbnRhaW5lcic7ICAgICAgICAgIC8vIHJvb3QgY29udGFpbmVyIGZvciB2aWV3ZXJzXHJcblxyXG4gICAgX3NjZW5lICAgICAgICAgICA6IFRIUkVFLlNjZW5lICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyB0YXJnZXQgc2NlbmVcclxuICAgIF9tb2RlbCAgICAgICAgICAgOiBUSFJFRS5Hcm91cCAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gdGFyZ2V0IG1vZGVsXHJcblxyXG4gICAgX3JlbmRlcmVyICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyZXIgICAgICA9IG51bGw7ICAgICAvLyBzY2VuZSByZW5kZXJlclxyXG4gICAgX2NhbnZhcyAgICAgICAgICA6IEhUTUxDYW52YXNFbGVtZW50ICAgICAgICA9IG51bGw7ICAgICAvLyBET00gY2FudmFzIHN1cHBvcnRpbmcgcmVuZGVyZXJcclxuICAgIF93aWR0aCAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgPSBEZXB0aEJ1ZmZlckZhY3RvcnkuRGVmYXVsdFJlc29sdXRpb247ICAgICAvLyB3aWR0aCByZXNvbHV0aW9uIG9mIHRoZSBEQlxyXG4gICAgX2hlaWdodCAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICA9IERlcHRoQnVmZmVyRmFjdG9yeS5EZWZhdWx0UmVzb2x1dGlvbjsgICAgIC8vIGhlaWdodCByZXNvbHV0aW9uIG9mIHRoZSBEQlxyXG5cclxuICAgIF9jYW1lcmEgICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSAgPSBudWxsOyAgICAgLy8gcGVyc3BlY3RpdmUgY2FtZXJhIHRvIGdlbmVyYXRlIHRoZSBkZXB0aCBidWZmZXJcclxuXHJcblxyXG4gICAgX2xvZ0RlcHRoQnVmZmVyICA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICA9IGZhbHNlOyAgICAvLyB1c2UgYSBsb2dhcml0aG1pYyBidWZmZXIgZm9yIG1vcmUgYWNjdXJhY3kgaW4gbGFyZ2Ugc2NlbmVzXHJcbiAgICBfYm91bmRlZENsaXBwaW5nIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gdHJ1ZTsgICAgIC8vIG92ZXJyaWRlIGNhbWVyYSBjbGlwcGluZyBwbGFuZXM7IHNldCBuZWFyIGFuZCBmYXIgdG8gYm91bmQgbW9kZWwgZm9yIGltcHJvdmVkIGFjY3VyYWN5XHJcblxyXG4gICAgX2RlcHRoQnVmZmVyICAgICA6IERlcHRoQnVmZmVyICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBkZXB0aCBidWZmZXIgXHJcbiAgICBfdGFyZ2V0ICAgICAgICAgIDogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQgID0gbnVsbDsgICAgIC8vIFdlYkdMIHJlbmRlciB0YXJnZXQgZm9yIGNyZWF0aW5nIHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgd2hlbiByZW5kZXJpbmcgdGhlIHNjZW5lXHJcbiAgICBfZW5jb2RlZFRhcmdldCAgIDogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQgID0gbnVsbDsgICAgIC8vIFdlYkdMIHJlbmRlciB0YXJnZXQgZm9yIGVuY29kaW4gdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciBpbnRvIGEgZmxvYXRpbmcgcG9pbnQgKFJHQkEgZm9ybWF0KVxyXG5cclxuICAgIF9wb3N0U2NlbmUgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gc2luZ2xlIHBvbHlnb24gc2NlbmUgdXNlIHRvIGdlbmVyYXRlIHRoZSBlbmNvZGVkIFJHQkEgYnVmZmVyXHJcbiAgICBfcG9zdENhbWVyYSAgICAgIDogVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhID0gbnVsbDsgICAgIC8vIG9ydGhvZ3JhcGhpYyBjYW1lcmFcclxuICAgIF9wb3N0TWF0ZXJpYWwgICAgOiBUSFJFRS5TaGFkZXJNYXRlcmlhbCAgICAgPSBudWxsOyAgICAgLy8gc2hhZGVyIG1hdGVyaWFsIHRoYXQgZW5jb2RlcyB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIGludG8gYSBmbG9hdGluZyBwb2ludCBSR0JBIGZvcm1hdFxyXG5cclxuICAgIF9taW5pbXVtV2ViR0wgICAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSB0cnVlOyAgICAgLy8gdHJ1ZSBpZiBtaW5pbXVtIFdlR0wgcmVxdWlyZW1lbnRhdCBhcmUgcHJlc2VudFxyXG4gICAgX2xvZ2dlciAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBsb2dnZXJcclxuICAgIF9hZGRDYW52YXNUb0RPTSAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MIHBhZ2VcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgSW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyAoRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVycyA6IERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgLy8gcmVxdWlyZWRcclxuICAgICAgICB0aGlzLl93aWR0aCAgICAgICAgICAgPSBwYXJhbWV0ZXJzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAgICAgICAgICA9IHBhcmFtZXRlcnMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX21vZGVsICAgICAgICAgICA9IHBhcmFtZXRlcnMubW9kZWwuY2xvbmUoKTtcclxuXHJcbiAgICAgICAgLy8gb3B0aW9uYWxcclxuICAgICAgICB0aGlzLl9jYW1lcmEgICAgICAgICAgPSBwYXJhbWV0ZXJzLmNhbWVyYSAgICAgICAgICB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuX2xvZ0RlcHRoQnVmZmVyICA9IHBhcmFtZXRlcnMubG9nRGVwdGhCdWZmZXIgIHx8IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2JvdW5kZWRDbGlwcGluZyA9IHBhcmFtZXRlcnMuYm91bmRlZENsaXBwaW5nIHx8IHRydWU7XHJcbiAgICAgICAgdGhpcy5fYWRkQ2FudmFzVG9ET00gID0gcGFyYW1ldGVycy5hZGRDYW52YXNUb0RPTSAgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IHRoaXMuaW5pdGlhbGl6ZUNhbnZhcygpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBWZXJpZmllcyB0aGUgbWluaW11bSBXZWJHTCBleHRlbnNpb25zIGFyZSBwcmVzZW50LlxyXG4gICAgICogQHBhcmFtIHJlbmRlcmVyIFdlYkdMIHJlbmRlcmVyLlxyXG4gICAgICovXHJcbiAgICB2ZXJpZnlXZWJHTEV4dGVuc2lvbnMoKSA6IGJvb2xlYW4geyBcclxuICAgIFxyXG4gICAgICAgIGlmICghdGhpcy5fcmVuZGVyZXIuZXh0ZW5zaW9ucy5nZXQoJ1dFQkdMX2RlcHRoX3RleHR1cmUnKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9taW5pbXVtV2ViR0wgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVycm9yTWVzc2FnZSgnVGhlIG1pbmltdW0gV2ViR0wgZXh0ZW5zaW9ucyBhcmUgbm90IHN1cHBvcnRlZCBpbiB0aGUgYnJvd3Nlci4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGUgYSBtb3VzZSBkb3duIGV2ZW50IG9uIHRoZSBjYW52YXMuXHJcbiAgICAgKi9cclxuICAgIG9uTW91c2VEb3duKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBkZXZpY2VDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBHcmFwaGljcy5kZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCAkKGV2ZW50LnRhcmdldCkpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgZGV2aWNlID0gJHtkZXZpY2VDb29yZGluYXRlcy54fSwgJHtkZXZpY2VDb29yZGluYXRlcy55fWApO1xyXG5cclxuICAgICAgICBsZXQgZGVjaW1hbFBsYWNlcyAgIDogbnVtYmVyID0gMjtcclxuICAgICAgICBsZXQgcm93ICAgICAgICAgICAgIDogbnVtYmVyID0gKGRldmljZUNvb3JkaW5hdGVzLnkgKyAxKSAvIDIgKiB0aGlzLl9kZXB0aEJ1ZmZlci5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGNvbHVtbiAgICAgICAgICA6IG51bWJlciA9IChkZXZpY2VDb29yZGluYXRlcy54ICsgMSkgLyAyICogdGhpcy5fZGVwdGhCdWZmZXIud2lkdGg7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBPZmZzZXQgPSBbJHtyb3d9LCAke2NvbHVtbn1dYCk7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgRGVwdGggPSAke3RoaXMuX2RlcHRoQnVmZmVyLmRlcHRoKHJvdywgY29sdW1uKS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWApOyAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIFdlYkdMIHRhcmdldCBjYW52YXMuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDYW52YXMoKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBUb29scy5nZW5lcmF0ZVBzZXVkb0dVSUQoKSk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBEZXB0aEJ1ZmZlckZhY3RvcnkuQ3NzQ2xhc3NOYW1lKTtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIGRpbWVuc2lvbnMgICAgXHJcbiAgICAgICAgdGhpcy5fY2FudmFzLndpZHRoICA9IHRoaXMuX3dpZHRoO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5oZWlnaHQgPSB0aGlzLl9oZWlnaHQ7IFxyXG5cclxuICAgICAgICAvLyBET00gZWxlbWVudCBkaW1lbnNpb25zIChtYXkgYmUgZGlmZmVyZW50IHRoYW4gcmVuZGVyIGRpbWVuc2lvbnMpXHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnN0eWxlLndpZHRoICA9IGAke3RoaXMuX3dpZHRofXB4YDtcclxuICAgICAgICB0aGlzLl9jYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5faGVpZ2h0fXB4YDtcclxuXHJcbiAgICAgICAgLy8gYWRkIHRvIERPTT9cclxuICAgICAgICBpZiAodGhpcy5fYWRkQ2FudmFzVG9ET00pXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke0RlcHRoQnVmZmVyRmFjdG9yeS5Sb290Q29udGFpbmVySWR9YCkuYXBwZW5kQ2hpbGQodGhpcy5fY2FudmFzKTtcclxuXHJcbiAgICAgICAgICAgIGxldCAkY2FudmFzID0gJCh0aGlzLl9jYW52YXMpLm9uKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHJlbmRlciBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVNjZW5lICgpIDogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwpXHJcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lLmFkZCh0aGlzLl9tb2RlbCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpZ2h0aW5nKHRoaXMuX3NjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlICBtb2RlbCB2aWV3LlxyXG4gICAgICovXHJcbiAgICAgaW5pdGlhbGl6ZVJlbmRlcmVyKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7Y2FudmFzIDogdGhpcy5fY2FudmFzLCBsb2dhcml0aG1pY0RlcHRoQnVmZmVyIDogdGhpcy5fbG9nRGVwdGhCdWZmZXJ9KTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTaXplKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyBNb2RlbCBTY2VuZSAtPiAoUmVuZGVyIFRleHR1cmUsIERlcHRoIFRleHR1cmUpXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGhpcy5jb25zdHJ1Y3REZXB0aFRleHR1cmVSZW5kZXJUYXJnZXQoKTtcclxuXHJcbiAgICAgICAgLy8gRW5jb2RlZCBSR0JBIFRleHR1cmUgZnJvbSBEZXB0aCBUZXh0dXJlXHJcbiAgICAgICAgdGhpcy5fZW5jb2RlZFRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJpZnlXZWJHTEV4dGVuc2lvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgZGVmYXVsdCBsaWdodGluZyBpbiB0aGUgc2NlbmUuXHJcbiAgICAgKiBMaWdodGluZyBkb2VzIG5vdCBhZmZlY3QgdGhlIGRlcHRoIGJ1ZmZlci4gSXQgaXMgb25seSB1c2VkIGlmIHRoZSBjYW52YXMgaXMgbWFkZSB2aXNpYmxlLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplTGlnaHRpbmcgKHNjZW5lIDogVEhSRUUuU2NlbmUpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjIpO1xyXG4gICAgICAgIHNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDEucG9zaXRpb24uc2V0KDEsIDEsIDEpO1xyXG4gICAgICAgIHNjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0MSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVByaW1hcnkgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU2NlbmUoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVSZW5kZXJlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemUgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gU2VydmljZXMuY29uc29sZUxvZ2dlcjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQcmltYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBQb3N0UHJvY2Vzc2luZ1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgcmVuZGVyIHRhcmdldCA8d2l0aCBhIGRlcHRoIHRleHR1cmUgYnVmZmVyPi5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0RGVwdGhUZXh0dXJlUmVuZGVyVGFyZ2V0KCkgOiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCB7XHJcblxyXG4gICAgICAgIC8vIE1vZGVsIFNjZW5lIC0+IChSZW5kZXIgVGV4dHVyZSwgRGVwdGggVGV4dHVyZSlcclxuICAgICAgICBsZXQgcmVuZGVyVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG5cclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS5mb3JtYXQgICAgICAgICAgID0gVEhSRUUuUkdCQUZvcm1hdDtcclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS50eXBlICAgICAgICAgICAgID0gVEhSRUUuVW5zaWduZWRCeXRlVHlwZTtcclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS5taW5GaWx0ZXIgICAgICAgID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS5tYWdGaWx0ZXIgICAgICAgID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlbmRlclRhcmdldC5zdGVuY2lsQnVmZmVyICAgICAgICAgICAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LmRlcHRoQnVmZmVyICAgICAgICAgICAgICA9IHRydWU7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LmRlcHRoVGV4dHVyZSAgICAgICAgICAgICA9IG5ldyBUSFJFRS5EZXB0aFRleHR1cmUodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LmRlcHRoVGV4dHVyZS50eXBlICAgICAgICA9IFRIUkVFLlVuc2lnbmVkSW50VHlwZTtcclxuICAgIFxyXG4gICAgICAgIHJldHVybiByZW5kZXJUYXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbiBvZiB0aGUgcG9zdCBzY2VuZSB1c2VkIHRvIGNyZWF0ZSB0aGUgZmluYWwgUkdCQSBlbmNvZGVkIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVBvc3RTY2VuZSAoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgcG9zdE1lc2hNYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbCh7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZlcnRleFNoYWRlcjogICBNUi5zaGFkZXJTb3VyY2VbJ0RlcHRoQnVmZmVyVmVydGV4U2hhZGVyJ10sXHJcbiAgICAgICAgICAgIGZyYWdtZW50U2hhZGVyOiBNUi5zaGFkZXJTb3VyY2VbJ0RlcHRoQnVmZmVyRnJhZ21lbnRTaGFkZXInXSxcclxuXHJcbiAgICAgICAgICAgIHVuaWZvcm1zOiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmFOZWFyICA6ICAgeyB2YWx1ZTogdGhpcy5fY2FtZXJhLm5lYXIgfSxcclxuICAgICAgICAgICAgICAgIGNhbWVyYUZhciAgIDogICB7IHZhbHVlOiB0aGlzLl9jYW1lcmEuZmFyIH0sXHJcbiAgICAgICAgICAgICAgICB0RGlmZnVzZSAgICA6ICAgeyB2YWx1ZTogdGhpcy5fdGFyZ2V0LnRleHR1cmUgfSxcclxuICAgICAgICAgICAgICAgIHREZXB0aCAgICAgIDogICB7IHZhbHVlOiB0aGlzLl90YXJnZXQuZGVwdGhUZXh0dXJlIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBwb3N0TWVzaFBsYW5lID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMiwgMik7XHJcbiAgICAgICAgbGV0IHBvc3RNZXNoUXVhZCAgPSBuZXcgVEhSRUUuTWVzaChwb3N0TWVzaFBsYW5lLCBwb3N0TWVzaE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcG9zdFNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5fcG9zdFNjZW5lLmFkZChwb3N0TWVzaFF1YWQpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQb3N0Q2FtZXJhKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGlnaHRpbmcodGhpcy5fcG9zdFNjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgdGhlIG9ydGhvZ3JhcGhpYyBjYW1lcmEgdXNlZCB0byBjb252ZXJ0IHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgdG8gdGhlIGVuY29kZWQgUkdCQSBidWZmZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVBvc3RDYW1lcmEoKSB7XHJcblxyXG4gICAgICAgIC8vIFNldHVwIHBvc3QgcHJvY2Vzc2luZyBzdGFnZVxyXG4gICAgICAgIGxldCBsZWZ0OiBudW1iZXIgICAgICA9ICAtMTtcclxuICAgICAgICBsZXQgcmlnaHQ6IG51bWJlciAgICAgPSAgIDE7XHJcbiAgICAgICAgbGV0IHRvcDogbnVtYmVyICAgICAgID0gICAxO1xyXG4gICAgICAgIGxldCBib3R0b206IG51bWJlciAgICA9ICAtMTtcclxuICAgICAgICBsZXQgbmVhcjogbnVtYmVyICAgICAgPSAgIDA7XHJcbiAgICAgICAgbGV0IGZhcjogbnVtYmVyICAgICAgID0gICAxO1xyXG5cclxuICAgICAgICB0aGlzLl9wb3N0Q2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYShsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIG5lYXIsIGZhcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVBvc3QgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdFNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdENhbWVyYSgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBHZW5lcmF0aW9uXHJcbiAgICAvKipcclxuICAgICAqIFZlcmlmaWVzIHRoZSBwcmUtcmVxdWlzaXRlIHNldHRpbmdzIGFyZSBkZWZpbmVkIHRvIGNyZWF0ZSBhIG1lc2guXHJcbiAgICAgKi9cclxuICAgIHZlcmlmeU1lc2hTZXR0aW5ncygpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgbGV0IG1pbmltdW1TZXR0aW5ncyA6IGJvb2xlYW4gPSB0cnVlXHJcbiAgICAgICAgbGV0IGVycm9yUHJlZml4ICAgICA6IHN0cmluZyA9ICdEZXB0aEJ1ZmZlckZhY3Rvcnk6ICc7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fbW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVycm9yTWVzc2FnZShgJHtlcnJvclByZWZpeH1UaGUgbW9kZWwgaXMgbm90IGRlZmluZWQuYCk7XHJcbiAgICAgICAgICAgIG1pbmltdW1TZXR0aW5ncyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9jYW1lcmEpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVycm9yTWVzc2FnZShgJHtlcnJvclByZWZpeH1UaGUgY2FtZXJhIGlzIG5vdCBkZWZpbmVkLmApO1xyXG4gICAgICAgICAgICBtaW5pbXVtU2V0dGluZ3MgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtaW5pbXVtU2V0dGluZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGFuIFJHQkEgc3RyaW5nIHdpdGggdGhlIGJ5dGUgdmFsdWVzIG9mIGEgcGl4ZWwuXHJcbiAgICAgKiBAcGFyYW0gYnVmZmVyIFVuc2lnbmVkIGJ5dGUgcmF3IGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSByb3cgUGl4ZWwgcm93LlxyXG4gICAgICogQHBhcmFtIGNvbHVtbiBDb2x1bW4gcm93LlxyXG4gICAgICovXHJcbiAgICAgdW5zaWduZWRCeXRlc1RvUkdCQSAoYnVmZmVyIDogVWludDhBcnJheSwgcm93IDogbnVtYmVyLCBjb2x1bW4gOiBudW1iZXIpIDogc3RyaW5nIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gKHJvdyAqIHRoaXMuX3dpZHRoKSArIGNvbHVtbjtcclxuICAgICAgICBsZXQgclZhbHVlID0gYnVmZmVyW29mZnNldCArIDBdLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBsZXQgZ1ZhbHVlID0gYnVmZmVyW29mZnNldCArIDFdLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBsZXQgYlZhbHVlID0gYnVmZmVyW29mZnNldCArIDJdLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBsZXQgYVZhbHVlID0gYnVmZmVyW29mZnNldCArIDNdLnRvU3RyaW5nKDE2KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAjJHtyVmFsdWV9JHtnVmFsdWV9JHtiVmFsdWV9ICR7YVZhbHVlfWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmFseXplcyBhIHBpeGVsIGZyb20gYSByZW5kZXIgYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplUmVuZGVyQnVmZmVyICgpIHtcclxuXHJcbiAgICAgICAgbGV0IHJlbmRlckJ1ZmZlciA9ICBuZXcgVWludDhBcnJheSh0aGlzLl93aWR0aCAqIHRoaXMuX2hlaWdodCAqIDQpLmZpbGwoMCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVhZFJlbmRlclRhcmdldFBpeGVscyh0aGlzLl90YXJnZXQsIDAsIDAsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHJlbmRlckJ1ZmZlcik7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlU3RyaW5nID0gYFJHQkFbMCwgMF0gPSAke3RoaXMudW5zaWduZWRCeXRlc1RvUkdCQShyZW5kZXJCdWZmZXIsIDAsIDApfWA7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UobWVzc2FnZVN0cmluZywgbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmFseXplIHRoZSByZW5kZXIgYW5kIGRlcHRoIHRhcmdldHMuXHJcbiAgICAgKi9cclxuICAgIGFuYWx5emVUYXJnZXRzICgpICB7XHJcblxyXG4vLyAgICAgIHRoaXMuYW5hbHl6ZVJlbmRlckJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMuX2RlcHRoQnVmZmVyLmFuYWx5emUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgY3JlYXRlRGVwdGhCdWZmZXIoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9zY2VuZSwgdGhpcy5fY2FtZXJhLCB0aGlzLl90YXJnZXQpOyAgICBcclxuICAgIFxyXG4gICAgICAgIC8vIChvcHRpb25hbCkgcHJldmlldyBlbmNvZGVkIFJHQkEgdGV4dHVyZTsgZHJhd24gYnkgc2hhZGVyIGJ1dCBub3QgcGVyc2lzdGVkXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVuZGVyKHRoaXMuX3Bvc3RTY2VuZSwgdGhpcy5fcG9zdENhbWVyYSk7ICAgIFxyXG5cclxuICAgICAgICAvLyBQZXJzaXN0IGVuY29kZWQgUkdCQSB0ZXh0dXJlOyBjYWxjdWxhdGVkIGZyb20gZGVwdGggYnVmZmVyXHJcbiAgICAgICAgLy8gZW5jb2RlZFRhcmdldC50ZXh0dXJlICAgICAgOiBlbmNvZGVkIFJHQkEgdGV4dHVyZVxyXG4gICAgICAgIC8vIGVuY29kZWRUYXJnZXQuZGVwdGhUZXh0dXJlIDogbnVsbFxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9wb3N0U2NlbmUsIHRoaXMuX3Bvc3RDYW1lcmEsIHRoaXMuX2VuY29kZWRUYXJnZXQpOyBcclxuXHJcbiAgICAgICAgLy8gZGVjb2RlIFJHQkEgdGV4dHVyZSBpbnRvIGRlcHRoIGZsb2F0c1xyXG4gICAgICAgIGxldCBkZXB0aEJ1ZmZlclJHQkEgPSAgbmV3IFVpbnQ4QXJyYXkodGhpcy5fd2lkdGggKiB0aGlzLl9oZWlnaHQgKiA0KS5maWxsKDApO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlYWRSZW5kZXJUYXJnZXRQaXhlbHModGhpcy5fZW5jb2RlZFRhcmdldCwgMCwgMCwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgZGVwdGhCdWZmZXJSR0JBKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGVwdGhCdWZmZXIgPSBuZXcgRGVwdGhCdWZmZXIoZGVwdGhCdWZmZXJSR0JBLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCB0aGlzLl9jYW1lcmEpOyAgICBcclxuXHJcbiAgICAgICAgdGhpcy5hbmFseXplVGFyZ2V0cygpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzIGZvciBtZXNoIGdlbmVyYXRpb24uXHJcbiAgICAgKi9cclxuICAgIHNldENhbWVyYUNsaXBwaW5nUGxhbmVzICgpIHtcclxuXHJcbiAgICAgICAgLy8gY29weSBjYW1lcmE7IHNoYXJlZCB3aXRoIE1vZGVsVmlld2VyXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xyXG4gICAgICAgIGNhbWVyYS5jb3B5ICh0aGlzLl9jYW1lcmEpO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcclxuXHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl9jYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG5cclxuICAgICAgICAvLyBjbG9uZSBtb2RlbCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgbW9kZWxWaWV3ICAgICAgID0gIEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KHRoaXMuX21vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXcgPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGJveCBpcyB3b3JsZC1heGlzIGFsaWduZWQuIFxyXG4gICAgICAgIC8vIEluIFZpZXcgY29vcmRpbmF0ZXMsIHRoZSBjYW1lcmEgaXMgYXQgdGhlIG9yaWdpbi5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgbmVhciBwbGFuZSBpcyB0aGUgbWF4aW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGZhciBwbGFuZSBpcyB0aGUgbWluaW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgbGV0IG5lYXJQbGFuZSA9IC1ib3VuZGluZ0JveFZpZXcubWF4Lno7XHJcbiAgICAgICAgbGV0IGZhclBsYW5lICA9IC1ib3VuZGluZ0JveFZpZXcubWluLno7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5uZWFyID0gbmVhclBsYW5lO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5mYXIgID0gZmFyUGxhbmU7XHJcblxyXG4gICAgICAgIC8vIFdJUDogT3IgdGhpcy5fdmlld2VyLnVwZGF0ZUNhbWVyYSgpP1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIG1lc2ggZnJvbSB0aGUgYWN0aXZlIG1vZGVsIGFuZCBjYW1lcmFcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEdlbmVyYXRpb24gcGFyYW1ldGVycyAoTWVzaEdlbmVyYXRlUGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgbWVzaEdlbmVyYXRlIChwYXJhbWV0ZXJzIDogTWVzaEdlbmVyYXRlUGFyYW1ldGVycykgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMudmVyaWZ5TWVzaFNldHRpbmdzKCkpIFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5fYm91bmRlZENsaXBwaW5nKVxyXG4gICAgICAgICAgICB0aGlzLnNldENhbWVyYUNsaXBwaW5nUGxhbmVzKCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUudGltZShcImNyZWF0ZURlcHRoQnVmZmVyXCIpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVwdGhCdWZmZXIoKTtcclxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoXCJjcmVhdGVEZXB0aEJ1ZmZlclwiKTtcclxuICAgICAgICBjb25zb2xlLnRpbWUoXCJtZXNoXCIpOyAgICAgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSB0aGlzLl9kZXB0aEJ1ZmZlci5tZXNoKHBhcmFtZXRlcnMubW9kZWxXaWR0aCwgcGFyYW1ldGVycy5tYXRlcmlhbCk7XHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKFwibWVzaFwiKTsgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGFuIGltYWdlIGZyb20gdGhlIGFjdGl2ZSBtb2RlbCBhbmQgY2FtZXJhXHJcbiAgICAgKiBAcGFyYW0gcGFyYW1ldGVycyBHZW5lcmF0aW9uIHBhcmFtZXRlcnMgKEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzKVxyXG4gICAgICovXHJcbiAgICBpbWFnZUdlbmVyYXRlIChwYXJhbWV0ZXJzIDogSW1hZ2VHZW5lcmF0ZVBhcmFtZXRlcnMpIDogVWludDhBcnJheSB7XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFxyXG4vLyBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBPQkpMb2FkZXIgKCBtYW5hZ2VyICkge1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9ICggbWFuYWdlciAhPT0gdW5kZWZpbmVkICkgPyBtYW5hZ2VyIDogVEhSRUUuRGVmYXVsdExvYWRpbmdNYW5hZ2VyO1xyXG5cclxuICAgIHRoaXMubWF0ZXJpYWxzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLnJlZ2V4cCA9IHtcclxuICAgICAgICAvLyB2IGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdmVydGV4X3BhdHRlcm4gICAgICAgICAgIDogL152XFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyB2biBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIG5vcm1hbF9wYXR0ZXJuICAgICAgICAgICA6IC9edm5cXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIHZ0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdXZfcGF0dGVybiAgICAgICAgICAgICAgIDogL152dFxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICBmYWNlX3ZlcnRleCAgICAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXHMrKC0/XFxkKylcXHMrKC0/XFxkKykoPzpcXHMrKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgIGZhY2VfdmVydGV4X3V2ICAgICAgICAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF91dl9ub3JtYWwgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF9ub3JtYWwgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBvIG9iamVjdF9uYW1lIHwgZyBncm91cF9uYW1lXHJcbiAgICAgICAgb2JqZWN0X3BhdHRlcm4gICAgICAgICAgIDogL15bb2ddXFxzKiguKyk/LyxcclxuICAgICAgICAvLyBzIGJvb2xlYW5cclxuICAgICAgICBzbW9vdGhpbmdfcGF0dGVybiAgICAgICAgOiAvXnNcXHMrKFxcZCt8b258b2ZmKS8sXHJcbiAgICAgICAgLy8gbXRsbGliIGZpbGVfcmVmZXJlbmNlXHJcbiAgICAgICAgbWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuIDogL15tdGxsaWIgLyxcclxuICAgICAgICAvLyB1c2VtdGwgbWF0ZXJpYWxfbmFtZVxyXG4gICAgICAgIG1hdGVyaWFsX3VzZV9wYXR0ZXJuICAgICA6IC9edXNlbXRsIC9cclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuT0JKTG9hZGVyLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogT0JKTG9hZGVyLFxyXG5cclxuICAgIGxvYWQ6IGZ1bmN0aW9uICggdXJsLCBvbkxvYWQsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKSB7XHJcblxyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRmlsZUxvYWRlciggc2NvcGUubWFuYWdlciApO1xyXG4gICAgICAgIGxvYWRlci5zZXRQYXRoKCB0aGlzLnBhdGggKTtcclxuICAgICAgICBsb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgICAgICBvbkxvYWQoIHNjb3BlLnBhcnNlKCB0ZXh0ICkgKTtcclxuXHJcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0UGF0aDogZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXRoID0gdmFsdWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNYXRlcmlhbHM6IGZ1bmN0aW9uICggbWF0ZXJpYWxzICkge1xyXG5cclxuICAgICAgICB0aGlzLm1hdGVyaWFscyA9IG1hdGVyaWFscztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIF9jcmVhdGVQYXJzZXJTdGF0ZSA6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlID0ge1xyXG4gICAgICAgICAgICBvYmplY3RzICA6IFtdLFxyXG4gICAgICAgICAgICBvYmplY3QgICA6IHt9LFxyXG5cclxuICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgdXZzICAgICAgOiBbXSxcclxuXHJcbiAgICAgICAgICAgIG1hdGVyaWFsTGlicmFyaWVzIDogW10sXHJcblxyXG4gICAgICAgICAgICBzdGFydE9iamVjdDogZnVuY3Rpb24gKCBuYW1lLCBmcm9tRGVjbGFyYXRpb24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgb2JqZWN0IChpbml0aWFsIGZyb20gcmVzZXQpIGlzIG5vdCBmcm9tIGEgZy9vIGRlY2xhcmF0aW9uIGluIHRoZSBwYXJzZWRcclxuICAgICAgICAgICAgICAgIC8vIGZpbGUuIFdlIG5lZWQgdG8gdXNlIGl0IGZvciB0aGUgZmlyc3QgcGFyc2VkIGcvbyB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPT09IGZhbHNlICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPSAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c01hdGVyaWFsID0gKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsID09PSAnZnVuY3Rpb24nID8gdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsKCkgOiB1bmRlZmluZWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSggdHJ1ZSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tRGVjbGFyYXRpb24gOiAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV2cyAgICAgIDogW11cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFscyA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TWF0ZXJpYWwgOiBmdW5jdGlvbiggbmFtZSwgbGlicmFyaWVzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5fZmluYWxpemUoIGZhbHNlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXcgdXNlbXRsIGRlY2xhcmF0aW9uIG92ZXJ3cml0ZXMgYW4gaW5oZXJpdGVkIG1hdGVyaWFsLCBleGNlcHQgaWYgZmFjZXMgd2VyZSBkZWNsYXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGUgbWF0ZXJpYWwsIHRoZW4gaXQgbXVzdCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBwcmV2aW91cyAmJiAoIHByZXZpb3VzLmluaGVyaXRlZCB8fCBwcmV2aW91cy5ncm91cENvdW50IDw9IDAgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5zcGxpY2UoIHByZXZpb3VzLmluZGV4LCAxICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogdGhpcy5tYXRlcmlhbHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogKCBBcnJheS5pc0FycmF5KCBsaWJyYXJpZXMgKSAmJiBsaWJyYXJpZXMubGVuZ3RoID4gMCA/IGxpYnJhcmllc1sgbGlicmFyaWVzLmxlbmd0aCAtIDEgXSA6ICcnICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbW9vdGggICAgIDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuc21vb3RoIDogdGhpcy5zbW9vdGggKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiAoIHByZXZpb3VzICE9PSB1bmRlZmluZWQgPyBwcmV2aW91cy5ncm91cEVuZCA6IDAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmVkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogKCB0eXBlb2YgaW5kZXggPT09ICdudW1iZXInID8gaW5kZXggOiB0aGlzLmluZGV4ICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG10bGxpYiAgICAgOiB0aGlzLm10bGxpYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21vb3RoICAgICA6IHRoaXMuc21vb3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0IDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZC5jbG9uZSA9IHRoaXMuY2xvbmUuYmluZChjbG9uZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKCBtYXRlcmlhbCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGVyaWFsc1sgdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBfZmluYWxpemUgOiBmdW5jdGlvbiggZW5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RNdWx0aU1hdGVyaWFsID0gdGhpcy5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBsYXN0TXVsdGlNYXRlcmlhbCAmJiBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9PT0gLTEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPSB0aGlzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cENvdW50ID0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgLSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cFN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuaW5oZXJpdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgb2JqZWN0cyB0YWlsIG1hdGVyaWFscyBpZiBubyBmYWNlIGRlY2xhcmF0aW9ucyBmb2xsb3dlZCB0aGVtIGJlZm9yZSBhIG5ldyBvL2cgc3RhcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSB0aGlzLm1hdGVyaWFscy5sZW5ndGggLSAxOyBtaSA+PSAwOyBtaS0tICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHNbbWldLmdyb3VwQ291bnQgPD0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMuc3BsaWNlKCBtaSwgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEd1YXJhbnRlZSBhdCBsZWFzdCBvbmUgZW1wdHkgbWF0ZXJpYWwsIHRoaXMgbWFrZXMgdGhlIGNyZWF0aW9uIGxhdGVyIG1vcmUgc3RyYWlnaHQgZm9yd2FyZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID09PSAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRoaXMuc21vb3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0TXVsdGlNYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJbmhlcml0IHByZXZpb3VzIG9iamVjdHMgbWF0ZXJpYWwuXHJcbiAgICAgICAgICAgICAgICAvLyBTcGVjIHRlbGxzIHVzIHRoYXQgYSBkZWNsYXJlZCBtYXRlcmlhbCBtdXN0IGJlIHNldCB0byBhbGwgb2JqZWN0cyB1bnRpbCBhIG5ldyBtYXRlcmlhbCBpcyBkZWNsYXJlZC5cclxuICAgICAgICAgICAgICAgIC8vIElmIGEgdXNlbXRsIGRlY2xhcmF0aW9uIGlzIGVuY291bnRlcmVkIHdoaWxlIHRoaXMgbmV3IG9iamVjdCBpcyBiZWluZyBwYXJzZWQsIGl0IHdpbGxcclxuICAgICAgICAgICAgICAgIC8vIG92ZXJ3cml0ZSB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLiBFeGNlcHRpb24gYmVpbmcgdGhhdCB0aGVyZSB3YXMgYWxyZWFkeSBmYWNlIGRlY2xhcmF0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGluaGVyaXRlZCBtYXRlcmlhbCwgdGhlbiBpdCB3aWxsIGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggcHJldmlvdXNNYXRlcmlhbCAmJiBwcmV2aW91c01hdGVyaWFsLm5hbWUgJiYgdHlwZW9mIHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUgPT09IFwiZnVuY3Rpb25cIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlY2xhcmVkID0gcHJldmlvdXNNYXRlcmlhbC5jbG9uZSggMCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlY2xhcmVkLmluaGVyaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QubWF0ZXJpYWxzLnB1c2goIGRlY2xhcmVkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKCB0aGlzLm9iamVjdCApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZpbmFsaXplIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VWZXJ0ZXhJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VOb3JtYWxJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VVVkluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMiApICogMjtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRWZXJ0ZXg6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVmVydGV4TGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGROb3JtYWwgOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMubm9ybWFscztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS5ub3JtYWxzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRVVjogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFVWTGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEZhY2U6IGZ1bmN0aW9uICggYSwgYiwgYywgZCwgdWEsIHViLCB1YywgdWQsIG5hLCBuYiwgbmMsIG5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlhID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBhLCB2TGVuICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWIgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGIsIHZMZW4gKTtcclxuICAgICAgICAgICAgICAgIHZhciBpYyA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYywgdkxlbiApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBkLCB2TGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB1YSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlhID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVhLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGliID0gdGhpcy5wYXJzZVVWSW5kZXgoIHViLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGljID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVjLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVkLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBuYSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBOb3JtYWxzIGFyZSBtYW55IHRpbWVzIHRoZSBzYW1lLiBJZiBzbywgc2tpcCBmdW5jdGlvbiBjYWxsIGFuZCBwYXJzZUludC5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbkxlbiA9IHRoaXMubm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWEgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5hLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGliID0gbmEgPT09IG5iID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5iLCBuTGVuICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWMgPSBuYSA9PT0gbmMgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmMsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5kLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZExpbmVHZW9tZXRyeTogZnVuY3Rpb24gKCB2ZXJ0aWNlcywgdXZzICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Lmdlb21ldHJ5LnR5cGUgPSAnTGluZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdmkgPSAwLCBsID0gdmVydGljZXMubGVuZ3RoOyB2aSA8IGw7IHZpICsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleExpbmUoIHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggdmVydGljZXNbIHZpIF0sIHZMZW4gKSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdXZpID0gMCwgbCA9IHV2cy5sZW5ndGg7IHV2aSA8IGw7IHV2aSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVVkxpbmUoIHRoaXMucGFyc2VVVkluZGV4KCB1dnNbIHV2aSBdLCB1dkxlbiApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzdGF0ZS5zdGFydE9iamVjdCggJycsIGZhbHNlICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlOiBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUudGltZSggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5fY3JlYXRlUGFyc2VyU3RhdGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCB0ZXh0LmluZGV4T2YoICdcXHJcXG4nICkgIT09IC0gMSApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgZmFzdGVyIHRoYW4gU3RyaW5nLnNwbGl0IHdpdGggcmVnZXggdGhhdCBzcGxpdHMgb24gYm90aFxyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXFxyXFxuL2csICdcXG4nICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB0ZXh0LmluZGV4T2YoICdcXFxcXFxuJyApICE9PSAtIDEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGpvaW4gbGluZXMgc2VwYXJhdGVkIGJ5IGEgbGluZSBjb250aW51YXRpb24gY2hhcmFjdGVyIChcXClcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggL1xcXFxcXG4vZywgJycgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGluZXMgPSB0ZXh0LnNwbGl0KCAnXFxuJyApO1xyXG4gICAgICAgIHZhciBsaW5lID0gJycsIGxpbmVGaXJzdENoYXIgPSAnJywgbGluZVNlY29uZENoYXIgPSAnJztcclxuICAgICAgICB2YXIgbGluZUxlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICAvLyBGYXN0ZXIgdG8ganVzdCB0cmltIGxlZnQgc2lkZSBvZiB0aGUgbGluZS4gVXNlIGlmIGF2YWlsYWJsZS5cclxuICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgIC8vIHZhciB0cmltTGVmdCA9ICggdHlwZW9mICcnLnRyaW1MZWZ0ID09PSAnZnVuY3Rpb24nICk7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICBsaW5lID0gbGluZXNbIGkgXTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgICAgIC8vIGxpbmUgPSB0cmltTGVmdCA/IGxpbmUudHJpbUxlZnQoKSA6IGxpbmUudHJpbSgpO1xyXG4gICAgICAgICAgICBsaW5lID0gbGluZS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBsaW5lTGVuZ3RoID0gbGluZS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpbmVMZW5ndGggPT09IDAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGxpbmVGaXJzdENoYXIgPSBsaW5lLmNoYXJBdCggMCApO1xyXG5cclxuICAgICAgICAgICAgLy8gQHRvZG8gaW52b2tlIHBhc3NlZCBpbiBoYW5kbGVyIGlmIGFueVxyXG4gICAgICAgICAgICBpZiAoIGxpbmVGaXJzdENoYXIgPT09ICcjJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAndicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGluZVNlY29uZENoYXIgPSBsaW5lLmNoYXJBdCggMSApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbGluZVNlY29uZENoYXIgPT09ICcgJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnZlcnRleF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widiAxLjAgMi4wIDMuMFwiLCBcIjEuMFwiLCBcIjIuMFwiLCBcIjMuMFwiXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ24nICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAubm9ybWFsX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widm4gMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUubm9ybWFscy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ3QnICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAudXZfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgIDEgICAgICAyXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widnQgMC4xIDAuMlwiLCBcIjAuMVwiLCBcIjAuMlwiXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS51dnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgdmVydGV4L25vcm1hbC91diBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZUZpcnN0Q2hhciA9PT0gXCJmXCIgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4X3V2X25vcm1hbC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgICA3ICAgIDggICAgOSAgIDEwICAgICAgICAgMTEgICAgICAgICAxMlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcImYgMS8xLzEgMi8yLzIgMy8zLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDcgXSwgcmVzdWx0WyAxMCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgOCBdLCByZXN1bHRbIDExIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMyBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA5IF0sIHJlc3VsdFsgMTIgXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91di5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgIDcgICAgICAgICAgOFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcImYgMS8xIDIvMiAzLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvLzEgMi8vMiAzLy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAxICAgIDIgICAgMyAgIDRcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEgMiAzXCIsIFwiMVwiLCBcIjJcIiwgXCIzXCIsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMiBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA0IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGZhY2UgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwibFwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBsaW5lUGFydHMgPSBsaW5lLnN1YnN0cmluZyggMSApLnRyaW0oKS5zcGxpdCggXCIgXCIgKTtcclxuICAgICAgICAgICAgICAgIHZhciBsaW5lVmVydGljZXMgPSBbXSwgbGluZVVWcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbGluZS5pbmRleE9mKCBcIi9cIiApID09PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVWZXJ0aWNlcyA9IGxpbmVQYXJ0cztcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbGkgPSAwLCBsbGVuID0gbGluZVBhcnRzLmxlbmd0aDsgbGkgPCBsbGVuOyBsaSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IGxpbmVQYXJ0c1sgbGkgXS5zcGxpdCggXCIvXCIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcGFydHNbIDAgXSAhPT0gXCJcIiApIGxpbmVWZXJ0aWNlcy5wdXNoKCBwYXJ0c1sgMCBdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcGFydHNbIDEgXSAhPT0gXCJcIiApIGxpbmVVVnMucHVzaCggcGFydHNbIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkTGluZUdlb21ldHJ5KCBsaW5lVmVydGljZXMsIGxpbmVVVnMgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAub2JqZWN0X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbyBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgLy8gb3JcclxuICAgICAgICAgICAgICAgIC8vIGcgZ3JvdXBfbmFtZVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFdPUktBUk9VTkQ6IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTI4NjlcclxuICAgICAgICAgICAgICAgIC8vIHZhciBuYW1lID0gcmVzdWx0WyAwIF0uc3Vic3RyKCAxICkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAoIFwiIFwiICsgcmVzdWx0WyAwIF0uc3Vic3RyKCAxICkudHJpbSgpICkuc3Vic3RyKCAxICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUuc3RhcnRPYmplY3QoIG5hbWUgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX3VzZV9wYXR0ZXJuLnRlc3QoIGxpbmUgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYXRlcmlhbFxyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdC5zdGFydE1hdGVyaWFsKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSwgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX2xpYnJhcnlfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbXRsIGZpbGVcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcy5wdXNoKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5zbW9vdGhpbmdfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzbW9vdGggc2hhZGluZ1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEB0b2RvIEhhbmRsZSBmaWxlcyB0aGF0IGhhdmUgdmFyeWluZyBzbW9vdGggdmFsdWVzIGZvciBhIHNldCBvZiBmYWNlcyBpbnNpZGUgb25lIGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgLy8gYnV0IGRvZXMgbm90IGRlZmluZSBhIHVzZW10bCBmb3IgZWFjaCBmYWNlIHNldC5cclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGRldGVjdGVkIGFuZCBhIGR1bW15IG1hdGVyaWFsIGNyZWF0ZWQgKGxhdGVyIE11bHRpTWF0ZXJpYWwgYW5kIGdlb21ldHJ5IGdyb3VwcykuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHJlcXVpcmVzIHNvbWUgY2FyZSB0byBub3QgY3JlYXRlIGV4dHJhIG1hdGVyaWFsIG9uIGVhY2ggc21vb3RoIHZhbHVlIGZvciBcIm5vcm1hbFwiIG9iaiBmaWxlcy5cclxuICAgICAgICAgICAgICAgIC8vIHdoZXJlIGV4cGxpY2l0IHVzZW10bCBkZWZpbmVzIGdlb21ldHJ5IGdyb3Vwcy5cclxuICAgICAgICAgICAgICAgIC8vIEV4YW1wbGUgYXNzZXQ6IGV4YW1wbGVzL21vZGVscy9vYmovY2VyYmVydXMvQ2VyYmVydXMub2JqXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0WyAxIF0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogaHR0cDovL3BhdWxib3Vya2UubmV0L2RhdGFmb3JtYXRzL29iai9cclxuICAgICAgICAgICAgICAgICAqIG9yXHJcbiAgICAgICAgICAgICAgICAgKiBodHRwOi8vd3d3LmNzLnV0YWguZWR1L35ib3Vsb3MvY3MzNTA1L29ial9zcGVjLnBkZlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIEZyb20gY2hhcHRlciBcIkdyb3VwaW5nXCIgU3ludGF4IGV4cGxhbmF0aW9uIFwicyBncm91cF9udW1iZXJcIjpcclxuICAgICAgICAgICAgICAgICAqIFwiZ3JvdXBfbnVtYmVyIGlzIHRoZSBzbW9vdGhpbmcgZ3JvdXAgbnVtYmVyLiBUbyB0dXJuIG9mZiBzbW9vdGhpbmcgZ3JvdXBzLCB1c2UgYSB2YWx1ZSBvZiAwIG9yIG9mZi5cclxuICAgICAgICAgICAgICAgICAqIFBvbHlnb25hbCBlbGVtZW50cyB1c2UgZ3JvdXAgbnVtYmVycyB0byBwdXQgZWxlbWVudHMgaW4gZGlmZmVyZW50IHNtb290aGluZyBncm91cHMuIEZvciBmcmVlLWZvcm1cclxuICAgICAgICAgICAgICAgICAqIHN1cmZhY2VzLCBzbW9vdGhpbmcgZ3JvdXBzIGFyZSBlaXRoZXIgdHVybmVkIG9uIG9yIG9mZjsgdGhlcmUgaXMgbm8gZGlmZmVyZW5jZSBiZXR3ZWVuIHZhbHVlcyBncmVhdGVyXHJcbiAgICAgICAgICAgICAgICAgKiB0aGFuIDAuXCJcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgc3RhdGUub2JqZWN0LnNtb290aCA9ICggdmFsdWUgIT09ICcwJyAmJiB2YWx1ZSAhPT0gJ29mZicgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSBzdGF0ZS5vYmplY3QuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5zbW9vdGggPSBzdGF0ZS5vYmplY3Quc21vb3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIG51bGwgdGVybWluYXRlZCBmaWxlcyB3aXRob3V0IGV4Y2VwdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKCBsaW5lID09PSAnXFwwJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS5maW5hbGl6ZSgpO1xyXG5cclxuICAgICAgICB2YXIgY29udGFpbmVyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAvL2NvbnRhaW5lci5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuICAgICAgICAoPGFueT5jb250YWluZXIpLm1hdGVyaWFsTGlicmFyaWVzID0gW10uY29uY2F0KCBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcyApO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBzdGF0ZS5vYmplY3RzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gc3RhdGUub2JqZWN0c1sgaSBdO1xyXG4gICAgICAgICAgICB2YXIgZ2VvbWV0cnkgPSBvYmplY3QuZ2VvbWV0cnk7XHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbHMgPSBvYmplY3QubWF0ZXJpYWxzO1xyXG4gICAgICAgICAgICB2YXIgaXNMaW5lID0gKCBnZW9tZXRyeS50eXBlID09PSAnTGluZScgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNraXAgby9nIGxpbmUgZGVjbGFyYXRpb25zIHRoYXQgZGlkIG5vdCBmb2xsb3cgd2l0aCBhbnkgZmFjZXNcclxuICAgICAgICAgICAgaWYgKCBnZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGggPT09IDAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidWZmZXJnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cclxuICAgICAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS52ZXJ0aWNlcyApLCAzICkgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggZ2VvbWV0cnkubm9ybWFscy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ25vcm1hbCcsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5Lm5vcm1hbHMgKSwgMyApICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdlb21ldHJ5LnV2cy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3V2JywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudXZzICksIDIgKSApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1hdGVyaWFsc1xyXG4gICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAvL3ZhciBjcmVhdGVkTWF0ZXJpYWxzID0gW107ICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGNyZWF0ZWRNYXRlcmlhbHMgOiBUSFJFRS5NYXRlcmlhbFtdID0gW107ICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGZvciAoIHZhciBtaSA9IDAsIG1pTGVuID0gbWF0ZXJpYWxzLmxlbmd0aDsgbWkgPCBtaUxlbiA7IG1pKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWxzLmNyZWF0ZSggc291cmNlTWF0ZXJpYWwubmFtZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtdGwgZXRjLiBsb2FkZXJzIHByb2JhYmx5IGNhbid0IGNyZWF0ZSBsaW5lIG1hdGVyaWFscyBjb3JyZWN0bHksIGNvcHkgcHJvcGVydGllcyB0byBhIGxpbmUgbWF0ZXJpYWwuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpc0xpbmUgJiYgbWF0ZXJpYWwgJiYgISAoIG1hdGVyaWFsIGluc3RhbmNlb2YgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbExpbmUgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxMaW5lLmNvcHkoIG1hdGVyaWFsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gbWF0ZXJpYWxMaW5lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggISBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCkgOiBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoKSApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLm5hbWUgPSBzb3VyY2VNYXRlcmlhbC5uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5zaGFkaW5nID0gc291cmNlTWF0ZXJpYWwuc21vb3RoID8gVEhSRUUuU21vb3RoU2hhZGluZyA6IFRIUkVFLkZsYXRTaGFkaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRNYXRlcmlhbHMucHVzaChtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbWVzaFxyXG5cclxuICAgICAgICAgICAgdmFyIG1lc2g7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGNyZWF0ZWRNYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEdyb3VwKCBzb3VyY2VNYXRlcmlhbC5ncm91cFN0YXJ0LCBzb3VyY2VNYXRlcmlhbC5ncm91cENvdW50LCBtaSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgICAgICAgICAvL21lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzICkgOiBuZXcgVEhSRUUuTGluZVNlZ21lbnRzKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFscyApICk7XHJcbiAgICAgICAgICAgICAgICBtZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1swXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIG51bGwgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgLy9tZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1sgMCBdICkgOiBuZXcgVEhSRUUuTGluZVNlZ21lbnRzKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlTWF0ZXJpYWxzKSApO1xyXG4gICAgICAgICAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIG51bGwpICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1lc2gubmFtZSA9IG9iamVjdC5uYW1lO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLmFkZCggbWVzaCApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIi8qKlxuICogQGF1dGhvciBFYmVyaGFyZCBHcmFldGhlciAvIGh0dHA6Ly9lZ3JhZXRoZXIuY29tL1xuICogQGF1dGhvciBNYXJrIEx1bmRpbiBcdC8gaHR0cDovL21hcmstbHVuZGluLmNvbVxuICogQGF1dGhvciBTaW1vbmUgTWFuaW5pIC8gaHR0cDovL2Rhcm9uMTMzNy5naXRodWIuaW9cbiAqIEBhdXRob3IgTHVjYSBBbnRpZ2EgXHQvIGh0dHA6Ly9sYW50aWdhLmdpdGh1Yi5pb1xuICovXG5cbid1c2Ugc3RyaWN0JztcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFRyYWNrYmFsbENvbnRyb2xzICggb2JqZWN0LCBkb21FbGVtZW50ICkge1xuXG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cdHZhciBTVEFURSA9IHsgTk9ORTogLSAxLCBST1RBVEU6IDAsIFpPT006IDEsIFBBTjogMiwgVE9VQ0hfUk9UQVRFOiAzLCBUT1VDSF9aT09NX1BBTjogNCB9O1xuXG5cdHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuXHR0aGlzLmRvbUVsZW1lbnQgPSAoIGRvbUVsZW1lbnQgIT09IHVuZGVmaW5lZCApID8gZG9tRWxlbWVudCA6IGRvY3VtZW50O1xuXG5cdC8vIEFQSVxuXG5cdHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cblx0dGhpcy5zY3JlZW4gPSB7IGxlZnQ6IDAsIHRvcDogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xuXG5cdHRoaXMucm90YXRlU3BlZWQgPSAxLjA7XG5cdHRoaXMuem9vbVNwZWVkID0gMS4yO1xuXHR0aGlzLnBhblNwZWVkID0gMC4zO1xuXG5cdHRoaXMubm9Sb3RhdGUgPSBmYWxzZTtcblx0dGhpcy5ub1pvb20gPSBmYWxzZTtcblx0dGhpcy5ub1BhbiA9IGZhbHNlO1xuXG5cdHRoaXMuc3RhdGljTW92aW5nID0gdHJ1ZTtcblx0dGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMjtcblxuXHR0aGlzLm1pbkRpc3RhbmNlID0gMDtcblx0dGhpcy5tYXhEaXN0YW5jZSA9IEluZmluaXR5O1xuXG5cdHRoaXMua2V5cyA9IFsgNjUgLypBKi8sIDgzIC8qUyovLCA2OCAvKkQqLyBdO1xuXG5cdC8vIGludGVybmFsc1xuXG5cdHRoaXMudGFyZ2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHR2YXIgRVBTID0gMC4wMDAwMDE7XG5cblx0dmFyIGxhc3RQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0dmFyIF9zdGF0ZSA9IFNUQVRFLk5PTkUsXG5cdF9wcmV2U3RhdGUgPSBTVEFURS5OT05FLFxuXG5cdF9leWUgPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXG5cdF9tb3ZlUHJldiA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF9tb3ZlQ3VyciA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cblx0X2xhc3RBeGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0X2xhc3RBbmdsZSA9IDAsXG5cblx0X3pvb21TdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF96b29tRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblxuXHRfdG91Y2hab29tRGlzdGFuY2VTdGFydCA9IDAsXG5cdF90b3VjaFpvb21EaXN0YW5jZUVuZCA9IDAsXG5cblx0X3BhblN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblx0X3BhbkVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0Ly8gZm9yIHJlc2V0XG5cblx0dGhpcy50YXJnZXQwID0gdGhpcy50YXJnZXQuY2xvbmUoKTtcblx0dGhpcy5wb3NpdGlvbjAgPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHR0aGlzLnVwMCA9IHRoaXMub2JqZWN0LnVwLmNsb25lKCk7XG5cblx0Ly8gZXZlbnRzXG5cblx0dmFyIGNoYW5nZUV2ZW50ID0geyB0eXBlOiAnY2hhbmdlJyB9O1xuXHR2YXIgc3RhcnRFdmVudCA9IHsgdHlwZTogJ3N0YXJ0JyB9O1xuXHR2YXIgZW5kRXZlbnQgPSB7IHR5cGU6ICdlbmQnIH07XG5cblxuXHQvLyBtZXRob2RzXG5cblx0dGhpcy5oYW5kbGVSZXNpemUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHRoaXMuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgKSB7XG5cblx0XHRcdHRoaXMuc2NyZWVuLmxlZnQgPSAwO1xuXHRcdFx0dGhpcy5zY3JlZW4udG9wID0gMDtcblx0XHRcdHRoaXMuc2NyZWVuLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0XHR0aGlzLnNjcmVlbi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgYm94ID0gdGhpcy5kb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0Ly8gYWRqdXN0bWVudHMgY29tZSBmcm9tIHNpbWlsYXIgY29kZSBpbiB0aGUganF1ZXJ5IG9mZnNldCgpIGZ1bmN0aW9uXG5cdFx0XHR2YXIgZCA9IHRoaXMuZG9tRWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0XHRcdHRoaXMuc2NyZWVuLmxlZnQgPSBib3gubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCAtIGQuY2xpZW50TGVmdDtcblx0XHRcdHRoaXMuc2NyZWVuLnRvcCA9IGJveC50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQgLSBkLmNsaWVudFRvcDtcblx0XHRcdHRoaXMuc2NyZWVuLndpZHRoID0gYm94LndpZHRoO1xuXHRcdFx0dGhpcy5zY3JlZW4uaGVpZ2h0ID0gYm94LmhlaWdodDtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCB0eXBlb2YgdGhpc1sgZXZlbnQudHlwZSBdID09PSAnZnVuY3Rpb24nICkge1xuXG5cdFx0XHR0aGlzWyBldmVudC50eXBlIF0oIGV2ZW50ICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2YXIgZ2V0TW91c2VPblNjcmVlbiA9ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gZ2V0TW91c2VPblNjcmVlbiggcGFnZVgsIHBhZ2VZICkge1xuXG5cdFx0XHR2ZWN0b3Iuc2V0KFxuXHRcdFx0XHQoIHBhZ2VYIC0gX3RoaXMuc2NyZWVuLmxlZnQgKSAvIF90aGlzLnNjcmVlbi53aWR0aCxcblx0XHRcdFx0KCBwYWdlWSAtIF90aGlzLnNjcmVlbi50b3AgKSAvIF90aGlzLnNjcmVlbi5oZWlnaHRcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB2ZWN0b3I7XG5cblx0XHR9O1xuXG5cdH0oKSApO1xuXG5cdHZhciBnZXRNb3VzZU9uQ2lyY2xlID0gKCBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiBnZXRNb3VzZU9uQ2lyY2xlKCBwYWdlWCwgcGFnZVkgKSB7XG5cblx0XHRcdHZlY3Rvci5zZXQoXG5cdFx0XHRcdCggKCBwYWdlWCAtIF90aGlzLnNjcmVlbi53aWR0aCAqIDAuNSAtIF90aGlzLnNjcmVlbi5sZWZ0ICkgLyAoIF90aGlzLnNjcmVlbi53aWR0aCAqIDAuNSApICksXG5cdFx0XHRcdCggKCBfdGhpcy5zY3JlZW4uaGVpZ2h0ICsgMiAqICggX3RoaXMuc2NyZWVuLnRvcCAtIHBhZ2VZICkgKSAvIF90aGlzLnNjcmVlbi53aWR0aCApIC8vIHNjcmVlbi53aWR0aCBpbnRlbnRpb25hbFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHZlY3RvcjtcblxuXHRcdH07XG5cblx0fSgpICk7XG5cblx0dGhpcy5yb3RhdGVDYW1lcmEgPSAoIGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIGF4aXMgPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0cXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCksXG5cdFx0XHRleWVEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0b2JqZWN0VXBEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0bW92ZURpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRhbmdsZTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiByb3RhdGVDYW1lcmEoKSB7XG5cblx0XHRcdG1vdmVEaXJlY3Rpb24uc2V0KCBfbW92ZUN1cnIueCAtIF9tb3ZlUHJldi54LCBfbW92ZUN1cnIueSAtIF9tb3ZlUHJldi55LCAwICk7XG5cdFx0XHRhbmdsZSA9IG1vdmVEaXJlY3Rpb24ubGVuZ3RoKCk7XG5cblx0XHRcdGlmICggYW5nbGUgKSB7XG5cblx0XHRcdFx0X2V5ZS5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKS5zdWIoIF90aGlzLnRhcmdldCApO1xuXG5cdFx0XHRcdGV5ZURpcmVjdGlvbi5jb3B5KCBfZXllICkubm9ybWFsaXplKCk7XG5cdFx0XHRcdG9iamVjdFVwRGlyZWN0aW9uLmNvcHkoIF90aGlzLm9iamVjdC51cCApLm5vcm1hbGl6ZSgpO1xuXHRcdFx0XHRvYmplY3RTaWRld2F5c0RpcmVjdGlvbi5jcm9zc1ZlY3RvcnMoIG9iamVjdFVwRGlyZWN0aW9uLCBleWVEaXJlY3Rpb24gKS5ub3JtYWxpemUoKTtcblxuXHRcdFx0XHRvYmplY3RVcERpcmVjdGlvbi5zZXRMZW5ndGgoIF9tb3ZlQ3Vyci55IC0gX21vdmVQcmV2LnkgKTtcblx0XHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24uc2V0TGVuZ3RoKCBfbW92ZUN1cnIueCAtIF9tb3ZlUHJldi54ICk7XG5cblx0XHRcdFx0bW92ZURpcmVjdGlvbi5jb3B5KCBvYmplY3RVcERpcmVjdGlvbi5hZGQoIG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uICkgKTtcblxuXHRcdFx0XHRheGlzLmNyb3NzVmVjdG9ycyggbW92ZURpcmVjdGlvbiwgX2V5ZSApLm5vcm1hbGl6ZSgpO1xuXG5cdFx0XHRcdGFuZ2xlICo9IF90aGlzLnJvdGF0ZVNwZWVkO1xuXHRcdFx0XHRxdWF0ZXJuaW9uLnNldEZyb21BeGlzQW5nbGUoIGF4aXMsIGFuZ2xlICk7XG5cblx0XHRcdFx0X2V5ZS5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblx0XHRcdFx0X3RoaXMub2JqZWN0LnVwLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXG5cdFx0XHRcdF9sYXN0QXhpcy5jb3B5KCBheGlzICk7XG5cdFx0XHRcdF9sYXN0QW5nbGUgPSBhbmdsZTtcblxuXHRcdFx0fSBlbHNlIGlmICggISBfdGhpcy5zdGF0aWNNb3ZpbmcgJiYgX2xhc3RBbmdsZSApIHtcblxuXHRcdFx0XHRfbGFzdEFuZ2xlICo9IE1hdGguc3FydCggMS4wIC0gX3RoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgKTtcblx0XHRcdFx0X2V5ZS5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKS5zdWIoIF90aGlzLnRhcmdldCApO1xuXHRcdFx0XHRxdWF0ZXJuaW9uLnNldEZyb21BeGlzQW5nbGUoIF9sYXN0QXhpcywgX2xhc3RBbmdsZSApO1xuXHRcdFx0XHRfZXllLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXHRcdFx0XHRfdGhpcy5vYmplY3QudXAuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cblx0XHRcdH1cblxuXHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXG5cdFx0fTtcblxuXHR9KCkgKTtcblxuXG5cdHRoaXMuem9vbUNhbWVyYSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciBmYWN0b3I7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuVE9VQ0hfWk9PTV9QQU4gKSB7XG5cblx0XHRcdGZhY3RvciA9IF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0IC8gX3RvdWNoWm9vbURpc3RhbmNlRW5kO1xuXHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSBfdG91Y2hab29tRGlzdGFuY2VFbmQ7XG5cdFx0XHRfZXllLm11bHRpcGx5U2NhbGFyKCBmYWN0b3IgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGZhY3RvciA9IDEuMCArICggX3pvb21FbmQueSAtIF96b29tU3RhcnQueSApICogX3RoaXMuem9vbVNwZWVkO1xuXG5cdFx0XHRpZiAoIGZhY3RvciAhPT0gMS4wICYmIGZhY3RvciA+IDAuMCApIHtcblxuXHRcdFx0XHRfZXllLm11bHRpcGx5U2NhbGFyKCBmYWN0b3IgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIF90aGlzLnN0YXRpY01vdmluZyApIHtcblxuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0X3pvb21TdGFydC55ICs9ICggX3pvb21FbmQueSAtIF96b29tU3RhcnQueSApICogdGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvcjtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5wYW5DYW1lcmEgPSAoIGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIG1vdXNlQ2hhbmdlID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblx0XHRcdG9iamVjdFVwID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdHBhbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gcGFuQ2FtZXJhKCkge1xuXG5cdFx0XHRtb3VzZUNoYW5nZS5jb3B5KCBfcGFuRW5kICkuc3ViKCBfcGFuU3RhcnQgKTtcblxuXHRcdFx0aWYgKCBtb3VzZUNoYW5nZS5sZW5ndGhTcSgpICkge1xuXG5cdFx0XHRcdG1vdXNlQ2hhbmdlLm11bHRpcGx5U2NhbGFyKCBfZXllLmxlbmd0aCgpICogX3RoaXMucGFuU3BlZWQgKTtcblxuXHRcdFx0XHRwYW4uY29weSggX2V5ZSApLmNyb3NzKCBfdGhpcy5vYmplY3QudXAgKS5zZXRMZW5ndGgoIG1vdXNlQ2hhbmdlLnggKTtcblx0XHRcdFx0cGFuLmFkZCggb2JqZWN0VXAuY29weSggX3RoaXMub2JqZWN0LnVwICkuc2V0TGVuZ3RoKCBtb3VzZUNoYW5nZS55ICkgKTtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkKCBwYW4gKTtcblx0XHRcdFx0X3RoaXMudGFyZ2V0LmFkZCggcGFuICk7XG5cblx0XHRcdFx0aWYgKCBfdGhpcy5zdGF0aWNNb3ZpbmcgKSB7XG5cblx0XHRcdFx0XHRfcGFuU3RhcnQuY29weSggX3BhbkVuZCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRfcGFuU3RhcnQuYWRkKCBtb3VzZUNoYW5nZS5zdWJWZWN0b3JzKCBfcGFuRW5kLCBfcGFuU3RhcnQgKS5tdWx0aXBseVNjYWxhciggX3RoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgKSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH0oKSApO1xuXG5cdHRoaXMuY2hlY2tEaXN0YW5jZXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoICEgX3RoaXMubm9ab29tIHx8ICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdGlmICggX2V5ZS5sZW5ndGhTcSgpID4gX3RoaXMubWF4RGlzdGFuY2UgKiBfdGhpcy5tYXhEaXN0YW5jZSApIHtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllLnNldExlbmd0aCggX3RoaXMubWF4RGlzdGFuY2UgKSApO1xuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBfZXllLmxlbmd0aFNxKCkgPCBfdGhpcy5taW5EaXN0YW5jZSAqIF90aGlzLm1pbkRpc3RhbmNlICkge1xuXG5cdFx0XHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5hZGRWZWN0b3JzKCBfdGhpcy50YXJnZXQsIF9leWUuc2V0TGVuZ3RoKCBfdGhpcy5taW5EaXN0YW5jZSApICk7XG5cdFx0XHRcdF96b29tU3RhcnQuY29weSggX3pvb21FbmQgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfZXllLnN1YlZlY3RvcnMoIF90aGlzLm9iamVjdC5wb3NpdGlvbiwgX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRpZiAoICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF90aGlzLnJvdGF0ZUNhbWVyYSgpO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3RoaXMuem9vbUNhbWVyYSgpO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfdGhpcy5wYW5DYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5hZGRWZWN0b3JzKCBfdGhpcy50YXJnZXQsIF9leWUgKTtcblxuXHRcdF90aGlzLmNoZWNrRGlzdGFuY2VzKCk7XG5cblx0XHRfdGhpcy5vYmplY3QubG9va0F0KCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdGlmICggbGFzdFBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKCBfdGhpcy5vYmplY3QucG9zaXRpb24gKSA+IEVQUyApIHtcblxuXHRcdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggY2hhbmdlRXZlbnQgKTtcblxuXHRcdFx0bGFzdFBvc2l0aW9uLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF9zdGF0ZSA9IFNUQVRFLk5PTkU7XG5cdFx0X3ByZXZTdGF0ZSA9IFNUQVRFLk5PTkU7XG5cblx0XHRfdGhpcy50YXJnZXQuY29weSggX3RoaXMudGFyZ2V0MCApO1xuXHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5jb3B5KCBfdGhpcy5wb3NpdGlvbjAgKTtcblx0XHRfdGhpcy5vYmplY3QudXAuY29weSggX3RoaXMudXAwICk7XG5cblx0XHRfZXllLnN1YlZlY3RvcnMoIF90aGlzLm9iamVjdC5wb3NpdGlvbiwgX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRfdGhpcy5vYmplY3QubG9va0F0KCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cblx0XHRsYXN0UG9zaXRpb24uY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICk7XG5cblx0fTtcblxuXHQvLyBsaXN0ZW5lcnNcblxuXHRmdW5jdGlvbiBrZXlkb3duKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duICk7XG5cblx0XHRfcHJldlN0YXRlID0gX3N0YXRlO1xuXG5cdFx0aWYgKCBfc3RhdGUgIT09IFNUQVRFLk5PTkUgKSB7XG5cblx0XHRcdHJldHVybjtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlJPVEFURSBdICYmICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlJPVEFURTtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlpPT00gXSAmJiAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3N0YXRlID0gU1RBVEUuWk9PTTtcblxuXHRcdH0gZWxzZSBpZiAoIGV2ZW50LmtleUNvZGUgPT09IF90aGlzLmtleXNbIFNUQVRFLlBBTiBdICYmICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlBBTjtcblxuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24ga2V5dXAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdF9zdGF0ZSA9IF9wcmV2U3RhdGU7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duLCBmYWxzZSApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZWRvd24oIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuTk9ORSApIHtcblxuXHRcdFx0X3N0YXRlID0gZXZlbnQuYnV0dG9uO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLlJPVEFURSAmJiAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuWk9PTSAmJiAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3pvb21TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXHRcdFx0X3pvb21FbmQuY29weSggX3pvb21TdGFydCApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5QQU4gJiYgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3BhblN0YXJ0LmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cdFx0XHRfcGFuRW5kLmNvcHkoIF9wYW5TdGFydCApO1xuXG5cdFx0fVxuXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIG1vdXNlbW92ZSwgZmFsc2UgKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG1vdXNldXAsIGZhbHNlICk7XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBzdGFydEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlbW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5ST1RBVEUgJiYgISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlpPT00gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF96b29tRW5kLmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlBBTiAmJiAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfcGFuRW5kLmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNldXAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIG1vdXNlbW92ZSApO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgbW91c2V1cCApO1xuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGVuZEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNld2hlZWwoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRzd2l0Y2ggKCBldmVudC5kZWx0YU1vZGUgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWm9vbSBpbiBwYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfem9vbVN0YXJ0LnkgLT0gZXZlbnQuZGVsdGFZICogMC4wMjU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG5cdFx0XHRjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpvb20gaW4gbGluZXNcblx0XHRcdFx0X3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDE7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHQvLyB1bmRlZmluZWQsIDAsIGFzc3VtZSBwaXhlbHNcblx0XHRcdFx0X3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDAwMjU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggc3RhcnRFdmVudCApO1xuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGVuZEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNoc3RhcnQoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoICkge1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdF9zdGF0ZSA9IFNUQVRFLlRPVUNIX1JPVEFURTtcblx0XHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICkgKTtcblx0XHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDogLy8gMiBvciBtb3JlXG5cdFx0XHRcdF9zdGF0ZSA9IFNUQVRFLlRPVUNIX1pPT01fUEFOO1xuXHRcdFx0XHR2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG5cdFx0XHRcdHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcblx0XHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlRW5kID0gX3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSBNYXRoLnNxcnQoIGR4ICogZHggKyBkeSAqIGR5ICk7XG5cblx0XHRcdFx0dmFyIHggPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWCApIC8gMjtcblx0XHRcdFx0dmFyIHkgPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWSApIC8gMjtcblx0XHRcdFx0X3BhblN0YXJ0LmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIHgsIHkgKSApO1xuXHRcdFx0XHRfcGFuRW5kLmNvcHkoIF9wYW5TdGFydCApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIHN0YXJ0RXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gdG91Y2htb3ZlKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0c3dpdGNoICggZXZlbnQudG91Y2hlcy5sZW5ndGggKSB7XG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKSApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDogLy8gMiBvciBtb3JlXG5cdFx0XHRcdHZhciBkeCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWDtcblx0XHRcdFx0dmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xuXHRcdFx0XHRfdG91Y2hab29tRGlzdGFuY2VFbmQgPSBNYXRoLnNxcnQoIGR4ICogZHggKyBkeSAqIGR5ICk7XG5cblx0XHRcdFx0dmFyIHggPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWCApIC8gMjtcblx0XHRcdFx0dmFyIHkgPSAoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSArIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWSApIC8gMjtcblx0XHRcdFx0X3BhbkVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCB4LCB5ICkgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNoZW5kKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKCBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcblxuXHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9ST1RBVEU7XG5cdFx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSApICk7XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBjb250ZXh0bWVudSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHR9XG5cblx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NvbnRleHRtZW51JywgY29udGV4dG1lbnUsIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBtb3VzZWRvd24sIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd3aGVlbCcsIG1vdXNld2hlZWwsIGZhbHNlICk7XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaHN0YXJ0LCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIHRvdWNobW92ZSwgZmFsc2UgKTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUsIGZhbHNlICk7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBtb3VzZXVwLCBmYWxzZSApO1xuXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleXVwJywga2V5dXAsIGZhbHNlICk7XG5cblx0fTtcblxuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2NvbnRleHRtZW51JywgY29udGV4dG1lbnUsIGZhbHNlICk7IFxuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIG1vdXNlZG93biwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd3aGVlbCcsIG1vdXNld2hlZWwsIGZhbHNlICk7XG5cblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaGVuZCcsIHRvdWNoZW5kLCBmYWxzZSApO1xuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIHRvdWNobW92ZSwgZmFsc2UgKTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duLCBmYWxzZSApO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleXVwJywga2V5dXAsIGZhbHNlICk7XG5cblx0dGhpcy5oYW5kbGVSZXNpemUoKTtcblxuXHQvLyBmb3JjZSBhbiB1cGRhdGUgYXQgc3RhcnRcblx0dGhpcy51cGRhdGUoKTtcblxufVxuXG5UcmFja2JhbGxDb250cm9scy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBUSFJFRS5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlICk7XG5UcmFja2JhbGxDb250cm9scy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUcmFja2JhbGxDb250cm9scztcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcbiAgICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGVyaWFsc1xyXG4gKiBHZW5lcmFsIFRIUkVFLmpzIE1hdGVyaWFsIGNsYXNzZXMgYW5kIGhlbHBlcnNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBNYXRlcmlhbHNcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdGV4dHVyZSBtYXRlcmlhbCBmcm9tIGFuIGltYWdlIFVSTC5cclxuICAgICAqIEBwYXJhbSBpbWFnZSBJbWFnZSB0byB1c2UgaW4gdGV4dHVyZS5cclxuICAgICAqIEByZXR1cm5zIFRleHR1cmUgbWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVUZXh0dXJlTWF0ZXJpYWwgKGltYWdlIDogSFRNTEltYWdlRWxlbWVudCkgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0ZXh0dXJlICAgICAgICAgOiBUSFJFRS5UZXh0dXJlLFxyXG4gICAgICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShpbWFnZSk7XHJcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSAgICAgPSB0cnVlO1xyXG4gICAgICAgIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIG1hZ25pZmljYXRpb24gYW5kIG1pbmlmaWNhdGlvbiBmaWx0ZXJzIHNhbXBsZSB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMgd2hlbiBtYXBwaW5nIHRvIGEgcGl4ZWwuXHJcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIGRlZmF1bHQgbW9kZXMgb3ZlcnNhbXBsZSB3aGljaCBsZWFkcyB0byBibGVuZGluZyB3aXRoIHRoZSBibGFjayBiYWNrZ3JvdW5kLiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHByb2R1Y2VzIGNvbG9yZWQgKGJsYWNrKSBhcnRpZmFjdHMgYXJvdW5kIHRoZSBlZGdlcyBvZiB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMuXHJcbiAgICAgICAgdGV4dHVyZS5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAsIDEuMCk7XHJcblxyXG4gICAgICAgIHRleHR1cmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge21hcDogdGV4dHVyZX0gKTtcclxuICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGV4dHVyZU1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIENyZWF0ZSBhIGJ1bXAgbWFwIFBob25nIG1hdGVyaWFsIGZyb20gYSB0ZXh0dXJlIG1hcC5cclxuICAgICAqIEBwYXJhbSBkZXNpZ25UZXh0dXJlIEJ1bXAgbWFwIHRleHR1cmUuXHJcbiAgICAgKiBAcmV0dXJucyBQaG9uZyBidW1wIG1hcHBlZCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZU1lc2hQaG9uZ01hdGVyaWFsKGRlc2lnblRleHR1cmUgOiBUSFJFRS5UZXh0dXJlKSAgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgIGNvbG9yICAgOiAweGZmZmZmZixcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBidW1wTWFwICAgOiBkZXNpZ25UZXh0dXJlLFxyXG4gICAgICAgICAgICBidW1wU2NhbGUgOiAtMS4wLFxyXG5cclxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuU21vb3RoU2hhZGluZyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdHJhbnNwYXJlbnQgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBUcmFuc3BhcmVudCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVRyYW5zcGFyZW50TWF0ZXJpYWwoKSAgOiBUSFJFRS5NYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yIDogMHgwMDAwMDAsIG9wYWNpdHkgOiAwLjAsIHRyYW5zcGFyZW50IDogdHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge0NhbWVyYVNldHRpbmdzLCBHcmFwaGljc30gICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGVyaWFsc30gICAgICAgICAgICAgICAgICBmcm9tICdNYXRlcmlhbHMnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuY29uc3QgT2JqZWN0TmFtZXMgPSB7XHJcbiAgICBSb290IDogICdSb290J1xyXG59XHJcblxyXG4vKipcclxuICogQGV4cG9ydHMgVmlld2VyL1ZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFZpZXdlciB7XHJcblxyXG4gICAgX3NjZW5lICAgICAgICAgICAgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgID0gbnVsbDtcclxuICAgIF9yb290ICAgICAgICAgICAgICAgICAgIDogVEhSRUUuT2JqZWN0M0QgICAgICAgICAgICA9IG51bGw7ICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICBfcmVuZGVyZXIgICAgICAgICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyZXIgICAgICAgPSBudWxsOztcclxuICAgIF9jYW52YXMgICAgICAgICAgICAgICAgIDogSFRNTENhbnZhc0VsZW1lbnQgICAgICAgICA9IG51bGw7XHJcbiAgICBfd2lkdGggICAgICAgICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICAgPSAwO1xyXG4gICAgX2hlaWdodCAgICAgICAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgID0gMDtcclxuXHJcbiAgICBfY2FtZXJhICAgICAgICAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhICAgPSBudWxsO1xyXG4gICAgX2RlZmF1bHRDYW1lcmFTZXR0aW5ncyAgOiBDYW1lcmFTZXR0aW5ncyAgICAgICAgICAgID0gbnVsbDtcclxuXHJcbiAgICBfY29udHJvbHMgICAgICAgICAgICAgICA6IFRyYWNrYmFsbENvbnRyb2xzICAgICAgICAgPSBudWxsO1xyXG5cclxuICAgIF9sb2dnZXIgICAgICAgICAgICAgICAgIDogTG9nZ2VyICAgICAgICAgICAgICAgICAgICA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVmlld2VyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBlbGVtZW50VG9CaW5kVG8gSFRNTCBlbGVtZW50IHRvIGhvc3QgdGhlIHZpZXdlci5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kZWxDYW52YXNJZCA6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IEdyYXBoaWNzLmluaXRpYWxpemVDYW52YXMobW9kZWxDYW52YXNJZCk7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggID0gdGhpcy5fY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGFjdGl2ZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1vZGVsKCkgOiBUSFJFRS5Hcm91cCB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgYWN0aXZlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIE5ldyBtb2RlbCB0byBhY3RpdmF0ZS5cclxuICAgICAqL1xyXG4gICAgc2V0IG1vZGVsKHZhbHVlIDogVEhSRUUuR3JvdXApIHtcclxuXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4odGhpcy5fcm9vdCwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuX3Jvb3QuYWRkKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgY2FudmFzIGFmZXIgYSB3aW5kb3cgcmVzaXplXHJcbiAgICAgKi9cclxuICAgIGdldCBhc3BlY3RSYXRpbygpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGFzcGVjdFJhdGlvIDogbnVtYmVyID0gdGhpcy5fd2lkdGggLyB0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIGFzcGVjdFJhdGlvO1xyXG4gICAgfSBcclxuXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdGVzdCBzcGhlcmUgdG8gYSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIC8vIGdlb21ldHJ5XHJcbiAgICAgICAgbGV0IHJhZGl1cyAgIDogbnVtYmVyID0gMjtcclxuICAgICAgICBsZXQgc2VnbWVudHMgOiBudW1iZXIgPSA2NDtcclxuICAgICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkocmFkaXVzLCBzZWdtZW50cywgc2VnbWVudHMpO1xyXG5cclxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwZmYgfSk7XHJcblxyXG4gICAgICAgIGxldCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgICAgICBsZXQgY2VudGVyIDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG4gICAgICAgIG1lc2gucG9zaXRpb24uc2V0KGNlbnRlci54LCBjZW50ZXIueSwgY2VudGVyLnopO1xyXG5cclxuICAgICAgICB0aGlzLl9yb290LmFkZChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgU2NlbmVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVNjZW5lICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVJvb3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZVNjZW5lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBXZWJHTCByZW5kZXJlci5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVJlbmRlcmVyICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XHJcblxyXG4gICAgICAgICAgICBsb2dhcml0aG1pY0RlcHRoQnVmZmVyICA6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYW52YXMgICAgICAgICAgICAgICAgICA6IHRoaXMuX2NhbnZhcyxcclxuICAgICAgICAgICAgYW50aWFsaWFzICAgICAgICAgICAgICAgOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuYXV0b0NsZWFyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIGRlZmF1bHQgY2FtZXJhIHNldHRpbmdzLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplRGVmYXVsdENhbWVyYVNldHRpbmdzKCkgOiBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgICAgIGxldCBzZXR0aW5ncyA6IENhbWVyYVNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMC4wLCAwLjAsIDEwLjApLFxyXG4gICAgICAgICAgICB0YXJnZXQ6ICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCksXHJcbiAgICAgICAgICAgIG5lYXI6ICAgICAgICAgICAwLjEsXHJcbiAgICAgICAgICAgIGZhcjogICAgICAgICAgICAxMDAwMCxcclxuICAgICAgICAgICAgZmllbGRPZlZpZXc6ICAgIDQ1XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlld2VyIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhKCkge1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzID0gdGhpcy5pbml0aWFsaXplRGVmYXVsdENhbWVyYVNldHRpbmdzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSh0aGlzLl9kZWZhdWx0Q2FtZXJhU2V0dGluZ3MuZmllbGRPZlZpZXcsIHRoaXMuYXNwZWN0UmF0aW8sIHRoaXMuX2RlZmF1bHRDYW1lcmFTZXR0aW5ncy5uZWFyLCB0aGlzLl9kZWZhdWx0Q2FtZXJhU2V0dGluZ3MuZmFyKTtcclxuICAgICAgICB0aGlzLl9jYW1lcmEucG9zaXRpb24uY29weSh0aGlzLl9kZWZhdWx0Q2FtZXJhU2V0dGluZ3MucG9zaXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLnJlc2V0Q2FtZXJhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGxpZ2h0aW5nIHRvIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplTGlnaHRpbmcoKSB7XHJcblxyXG4gICAgICAgIGxldCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4NDA0MDQwKTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhDMEMwOTApO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCgtMTAwLCAtNTAsIDEwMCk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQxKTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQyID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhDMEMwOTApO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQyLnBvc2l0aW9uLnNldCgxMDAsIDUwLCAtMTAwKTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB1cCB0aGUgdXNlciBpbnB1dCBjb250cm9scyAoVHJhY2tiYWxsKVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplSW5wdXRDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udHJvbHMgPSBuZXcgVHJhY2tiYWxsQ29udHJvbHModGhpcy5fY2FtZXJhLCB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIGtleWJvYXJkIHNob3J0Y3V0cy5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUtleWJvYXJkU2hvcnRjdXRzKCkge1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCA6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvamF2YXNjcmlwdC9qYXZhc2NyaXB0LWtleWNvZGVzL1xyXG4gICAgICAgICAgICBsZXQga2V5Q29kZSA6IG51bWJlciA9IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNzA6ICAgICAgICAgICAgICAgIC8vIEYgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRDYW1lcmEoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBzY2VuZSB3aXRoIHRoZSBiYXNlIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDYW1lcmEoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZygpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVLZXlib2FyZFNob3J0Y3V0cygpO1xyXG5cclxuICAgICAgICB0aGlzLm9uUmVzaXplV2luZG93KCk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemVXaW5kb3cuYmluZCh0aGlzKSwgZmFsc2UpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBTY2VuZVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBzY2VuZSBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIGNsZWFyQWxsQXNzZXN0cygpIHtcclxuICAgICAgICBcclxuICAgICAgICBHcmFwaGljcy5yZW1vdmVPYmplY3RDaGlsZHJlbih0aGlzLl9yb290LCBmYWxzZSk7XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgcm9vdCBvYmplY3QgaW4gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVJvb3QoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcclxuICAgICAgICB0aGlzLl9yb290Lm5hbWUgPSBPYmplY3ROYW1lcy5Sb290O1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZCh0aGlzLl9yb290KTtcclxuICAgIH1cclxuXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIENhbWVyYVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldHMgYWxsIGNhbWVyYSBwcm9wZXJ0aWVzIHRvIHRoZSBkZWZhdWx0c1xyXG4gICAgICovXHJcbiAgICByZXNldENhbWVyYSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLnBvc2l0aW9uLmNvcHkodGhpcy5fZGVmYXVsdENhbWVyYVNldHRpbmdzLnBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLl9jYW1lcmEudXAuc2V0KDAsIDEsIDApO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FtZXJhKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFdpbmRvdyBSZXNpemVcclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgc2NlbmUgY2FtZXJhIHRvIG1hdGNoIHRoZSBuZXcgd2luZG93IHNpemVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQ2FtZXJhKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmEuYXNwZWN0ID0gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICB0aGlzLl9jYW1lcmEubG9va0F0KHRoaXMuX2RlZmF1bHRDYW1lcmFTZXR0aW5ncy50YXJnZXQpO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIHRoZSBXZWJHTCBwcm9jZXNzaW5nIGZvciBhIERPTSB3aW5kb3cgJ3Jlc2l6ZScgZXZlbnRcclxuICAgICAqL1xyXG4gICAgcmVzaXplRGlzcGxheVdlYkdMKCkge1xyXG5cclxuICAgICAgICB0aGlzLl93aWR0aCA9ICB0aGlzLl9jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5fY2FudmFzLm9mZnNldEhlaWdodDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTaXplKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udHJvbHMuaGFuZGxlUmVzaXplKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYW1lcmEoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgYSB3aW5kb3cgcmVzaXplIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uUmVzaXplV2luZG93ICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNpemVEaXNwbGF5V2ViR0woKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gUmVuZGVyIExvb3BcclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgdGhlIFdlYkdMIHJlbmRlciBvZiB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgcmVuZGVyV2ViR0woKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9zY2VuZSwgdGhpcy5fY2FtZXJhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW4gRE9NIHJlbmRlciBsb29wXHJcbiAgICAgKi9cclxuICAgIGFuaW1hdGUoKSB7XHJcblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJXZWJHTCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufSBcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7T0JKTG9hZGVyfSAgICAgICAgICAgICAgZnJvbSBcIk9CSkxvYWRlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuY29uc3QgdGVzdE1vZGVsQ29sb3IgPSAnIzU1OGRlOCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZGVyIHtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIExvYWRlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIG1vZGVsIGJhc2VkIG9uIHRoZSBtb2RlbCBuYW1lIGFuZCBwYXRoIGVtYmVkZGVkIGluIHRoZSBIVE1MIHBhZ2UuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi8gICAgXHJcbiAgICBsb2FkT0JKTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWxOYW1lRWxlbWVudCA6IEhUTUxFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RlbE5hbWUnKTtcclxuICAgICAgICBsZXQgbW9kZWxQYXRoRWxlbWVudCA6IEhUTUxFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RlbFBhdGgnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IG1vZGVsTmFtZSAgICA6IHN0cmluZyA9IG1vZGVsTmFtZUVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgbGV0IG1vZGVsUGF0aCAgICA6IHN0cmluZyA9IG1vZGVsUGF0aEVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgbGV0IGZpbGVOYW1lICAgICA6IHN0cmluZyA9IG1vZGVsUGF0aCArIG1vZGVsTmFtZTtcclxuXHJcbiAgICAgICAgbGV0IG1hbmFnZXIgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKTtcclxuICAgICAgICBsZXQgbG9hZGVyICA9IG5ldyBPQkpMb2FkZXIobWFuYWdlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoeGhyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoeGhyLmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGVyY2VudENvbXBsZXRlLnRvRml4ZWQoMikgKyAnJSBkb3dubG9hZGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgb25FcnJvciA9IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICB9OyAgICAgICAgXHJcblxyXG4gICAgICAgIGxvYWRlci5sb2FkKGZpbGVOYW1lLCBmdW5jdGlvbiAoZ3JvdXAgOiBUSFJFRS5Hcm91cCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmlld2VyLm1vZGVsID0gZ3JvdXA7XHJcblxyXG4gICAgICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHRvcnVzIHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWxcclxuICAgICAqL1xyXG4gICAgbG9hZFRvcnVzTW9kZWwodmlld2VyIDogVmlld2VyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcnVzU2NlbmUgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgc29tZSBnZW9tZXRyaWVzXHJcbiAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzS25vdEdlb21ldHJ5KDEsIDAuMywgMTI4LCA2NCk7XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pO1xyXG5cclxuICAgICAgICBsZXQgY291bnQgPSA1MDtcclxuICAgICAgICBsZXQgc2NhbGUgPSA1O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XHJcbiAgICAgICAgICAgIGxldCB6ID0gKE1hdGgucmFuZG9tKCkgKiAyLjApIC0gMS4wO1xyXG4gICAgICAgICAgICBsZXQgelNjYWxlID0gTWF0aC5zcXJ0KDEuMCAtIHogKiB6KSAqIHNjYWxlO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnNldChcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKHIpICogelNjYWxlLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4ocikgKiB6U2NhbGUsXHJcbiAgICAgICAgICAgICAgICB6ICogc2NhbGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbWVzaC5yb3RhdGlvbi5zZXQoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSk7XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSAnVG9ydXMgQ29tcG9uZW50JztcclxuICAgICAgICAgICAgdG9ydXNTY2VuZS5hZGQobWVzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZpZXdlci5tb2RlbCA9IHRvcnVzU2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdGVzdCBzcGhlcmUgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgbG9hZFNwaGVyZU1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuXHJcbiAgICAgICAgLy8gZ2VvbWV0cnlcclxuICAgICAgICBsZXQgcmFkaXVzICAgOiBudW1iZXIgPSAyO1xyXG4gICAgICAgIGxldCBzZWdtZW50cyA6IG51bWJlciA9IDY0O1xyXG4gICAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShyYWRpdXMsIHNlZ21lbnRzLCBzZWdtZW50cyk7XHJcblxyXG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KTtcclxuXHJcbiAgICAgICAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgIGxldCBjZW50ZXIgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcbiAgICAgICAgbWVzaC5wb3NpdGlvbi5zZXQoY2VudGVyLngsIGNlbnRlci55LCBjZW50ZXIueik7XHJcblxyXG4gICAgICAgIG1lc2gubmFtZSA9ICdTcGhlcmUnO1xyXG4gICAgICAgIHZpZXdlci5tb2RlbCA9IG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB0ZXN0IGJveCB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBsb2FkQm94TW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICAvLyBib3hcclxuICAgICAgICBsZXQgZGltZW5zaW9ucyA6IG51bWJlciA9IDIuMFxyXG4gICAgICAgIGxldCB3aWR0aCAgOiBudW1iZXIgPSBkaW1lbnNpb25zO1xyXG4gICAgICAgIGxldCBoZWlnaHQgOiBudW1iZXIgPSBkaW1lbnNpb25zO1xyXG4gICAgICAgIGxldCBkZXB0aCAgOiBudW1iZXIgPSBkaW1lbnNpb25zO1xyXG5cclxuICAgICAgICBsZXQgZ2VvbWV0cnkgOiBUSFJFRS5HZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSh3aWR0aCwgaGVpZ2h0LCBkZXB0aCk7XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsIDogVEhSRUUuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSk7XHJcblxyXG4gICAgICAgIGxldCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgICAgICBsZXQgY2VudGVyIDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG4gICAgICAgIG1lc2gucG9zaXRpb24uc2V0KGNlbnRlci54LCBjZW50ZXIueSwgY2VudGVyLnopO1xyXG5cclxuICAgICAgICBtZXNoLm5hbWUgPSAnQm94JztcclxuICAgICAgICB2aWV3ZXIubW9kZWwgPSBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgdGVzdCBtb2RlbCBjb25zaXN0aW5nIG9mIGEgdGllcmVkIGNoZWNrZXJib2FyZFxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBsb2FkQ2hlY2tlcmJvYXJkTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBncmlkTGVuZ3RoICAgICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ICAgIDogbnVtYmVyID0gMS4wOyAgICAgICBcclxuICAgICAgICBsZXQgZ3JpZERpdmlzaW9ucyAgOiBudW1iZXIgPSAxMDtcclxuICAgICAgICBsZXQgdG90YWxDZWxscyAgICAgOiBudW1iZXIgPSBNYXRoLnBvdyhncmlkRGl2aXNpb25zLCAyKTtcclxuXHJcbiAgICAgICAgbGV0IGNlbGxCYXNlICAgICAgIDogbnVtYmVyID0gZ3JpZExlbmd0aCAvIGdyaWREaXZpc2lvbnM7XHJcbiAgICAgICAgbGV0IGNlbGxIZWlnaHQgICAgIDogbnVtYmVyID0gdG90YWxIZWlnaHQgLyB0b3RhbENlbGxzO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luWCA6IG51bWJlciA9IC0oY2VsbEJhc2UgKiAoZ3JpZERpdmlzaW9ucyAvIDIpKSArIChjZWxsQmFzZSAvIDIpO1xyXG4gICAgICAgIGxldCBvcmlnaW5ZIDogbnVtYmVyID0gb3JpZ2luWDtcclxuICAgICAgICBsZXQgb3JpZ2luWiA6IG51bWJlciA9IC1jZWxsSGVpZ2h0IC8gMjtcclxuICAgICAgICBsZXQgb3JpZ2luICA6IFRIUkVFLlZlY3RvcjMgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YLCBvcmlnaW5ZLCBvcmlnaW5aKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYmFzZUNvbG9yICAgICAgOiBudW1iZXIgPSAweDAwNzA3MDtcclxuICAgICAgICBsZXQgY29sb3JEZWx0YSAgICAgOiBudW1iZXIgPSAoMjU2IC8gdG90YWxDZWxscykgKiBNYXRoLnBvdygyNTYsIDIpO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXAgICAgICA6IFRIUkVFLkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgbGV0IGNlbGxPcmlnaW4gOiBUSFJFRS5WZWN0b3IzID0gb3JpZ2luLmNsb25lKCk7XHJcbiAgICAgICAgbGV0IGNlbGxDb2xvciAgOiBudW1iZXIgPSBiYXNlQ29sb3I7XHJcbiAgICAgICAgZm9yIChsZXQgaVJvdyA6IG51bWJlciA9IDA7IGlSb3cgPCBncmlkRGl2aXNpb25zOyBpUm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaUNvbHVtbiA6IG51bWJlciA9IDA7IGlDb2x1bW4gPCBncmlkRGl2aXNpb25zOyBpQ29sdW1uKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiBjZWxsQ29sb3J9KTtcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsIDogVEhSRUUuTWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJveE1lc2goY2VsbE9yaWdpbiwgY2VsbEJhc2UsIGNlbGxCYXNlLCBjZWxsSGVpZ2h0LCBjZWxsTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuYWRkIChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjZWxsT3JpZ2luLnggKz0gY2VsbEJhc2U7XHJcbiAgICAgICAgICAgICAgICBjZWxsT3JpZ2luLnogKz0gY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGNlbGxDb2xvciAgICArPSBjb2xvckRlbHRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2VsbE9yaWdpbi54ID0gb3JpZ2luLng7XHJcbiAgICAgICAgY2VsbE9yaWdpbi55ICs9IGNlbGxCYXNlO1xyXG4gICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgdmlld2VyLm1vZGVsID0gZ3JvdXA7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhU2V0dGluZ3MsIEdyYXBoaWNzfSAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBNZXNoVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWVzaFByZXZpZXdWaWV3ZXIgZXh0ZW5kcyBWaWV3ZXIge1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihwcmV2aWV3Q2FudmFzSWQgOiBzdHJpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlcihwcmV2aWV3Q2FudmFzSWQpO1xyXG5cclxuICAgICAgICAvL292ZXJyaWRlXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gU2VydmljZXMuaHRtbExvZ2dlcjsgICAgICAgXHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3B1bGF0ZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgcGVyc3BlY3RpdmUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplRGVmYXVsdENhbWVyYVNldHRpbmdzKCkgOiBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgICAgIGxldCBzZXR0aW5ncyA6IENhbWVyYVNldHRpbmdzID0ge1xyXG5cclxuICAgICAgICAgICAgcG9zaXRpb246ICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuMCwgMC4wLCA0LjApLFxyXG4gICAgICAgICAgICB0YXJnZXQ6ICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCksXHJcbiAgICAgICAgICAgIG5lYXI6ICAgICAgICAgICAwLjEsXHJcbiAgICAgICAgICAgIGZhcjogICAgICAgICAxMDAwLjAsXHJcbiAgICAgICAgICAgIGZpZWxkT2ZWaWV3OiAgICAzNyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL3d3dy5uaWtvbmlhbnMub3JnL3Jldmlld3MvZm92LXRhYmxlc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBsaWdodGluZyB0byB0aGUgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVMaWdodGluZygpIHtcclxuXHJcbiAgICAgICAgbGV0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYsIDAuMik7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0MS5wb3NpdGlvbi5zZXQoNCwgNCwgNCk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQxKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn0iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtUcmFja2JhbGxDb250cm9sc30gICAgICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7Q2FtZXJhU2V0dGluZ3MsIEdyYXBoaWNzfSAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0ZXJpYWxzfSAgICAgICAgICAgICAgICAgIGZyb20gJ01hdGVyaWFscydcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IE9iamVjdE5hbWVzID0ge1xyXG4gICAgR3JpZCA6ICAnR3JpZCdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9Nb2RlbFZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1vZGVsVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNb2RlbFZpZXdlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gbW9kZWxDYW52YXNJZCBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbENhbnZhc0lkIDogc3RyaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIgKG1vZGVsQ2FudmFzSWQpO1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZXQgY2FtZXJhKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW5pdGlhbGl6YXRpb24gICAgXHJcbiAgICAvKipcclxuICAgICAqIFBvcHVsYXRlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBwb3B1bGF0ZVNjZW5lICgpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgaGVscGVyID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoMzAwLCAzMCwgMHg4NmU2ZmYsIDB4OTk5OTk5KTtcclxuICAgICAgICBoZWxwZXIubmFtZSA9IE9iamVjdE5hbWVzLkdyaWQ7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGhlbHBlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVEZWZhdWx0Q2FtZXJhU2V0dGluZ3MgKCkgOiBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgICAgIGxldCB1c2VUZXN0Q2FtZXJhIDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgbGV0IHNldHRpbmdzT0JKIDogQ2FtZXJhU2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIC8vIEJhc2VsaW5lIDogbmVhciA9IDAuMSwgZmFyID0gMTAwMDBcclxuICAgICAgICAgICAgLy8gWkJ1ZmZlciAgOiBuZWFyID0gMTAwLCBmYXIgPSAzMDBcclxuXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLjAsIDE3NS4wLCA1MDAuMCksXHJcbiAgICAgICAgICAgIHRhcmdldDogICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSxcclxuICAgICAgICAgICAgbmVhcjogICAgICAgICAgIDAuMSxcclxuICAgICAgICAgICAgZmFyOiAgICAgICAgICAgIDEwMDAwLFxyXG4gICAgICAgICAgICBmaWVsZE9mVmlldzogICAgNDVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgc2V0dGluZ3NUZXN0TW9kZWxzIDogQ2FtZXJhU2V0dGluZ3MgPSB7XHJcblxyXG4gICAgICAgICAgICBwb3NpdGlvbjogICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMC4wLCAwLjAsIDQuMCksXHJcbiAgICAgICAgICAgIHRhcmdldDogICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSxcclxuICAgICAgICAgICAgbmVhcjogICAgICAgICAgIDAuMSxcclxuICAgICAgICAgICAgZmFyOiAgICAgICAgICAgIDEwMDAwLFxyXG4gICAgICAgICAgICBmaWVsZE9mVmlldzogICAgMzcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly93d3cubmlrb25pYW5zLm9yZy9yZXZpZXdzL2Zvdi10YWJsZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdXNlVGVzdENhbWVyYSA/IHNldHRpbmdzVGVzdE1vZGVscyA6IHNldHRpbmdzT0JKOyAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVMaWdodGluZygpIHtcclxuXHJcbiAgICAgICAgbGV0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg0MDQwNDApO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEMwQzA5MCk7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDEucG9zaXRpb24uc2V0KC0xMDAsIC01MCwgMTAwKTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDIgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEMwQzA5MCk7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDIucG9zaXRpb24uc2V0KDEwMCwgNTAsIC0xMDApO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0Mik7XHJcbiAgICB9ICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFNjZW5lXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgdGhlIHJlZmVyZW5jZSBncmlkLlxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5R3JpZCh2aXNpYmxlIDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBsZXQgZ3JpZEdlb21ldHJ5IDogVEhSRUUuT2JqZWN0M0QgPSB0aGlzLl9zY2VuZS5nZXRPYmplY3RCeU5hbWUoT2JqZWN0TmFtZXMuR3JpZCk7XHJcbiAgICAgICAgZ3JpZEdlb21ldHJ5LnZpc2libGUgPSB2aXNpYmxlO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgRGlzcGxheSBncmlkID0gJHt2aXNpYmxlfWApO1xyXG4gICAgfSBcclxuLy8jZW5kcmVnaW9uXHJcblxyXG59IFxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSBcIkRlcHRoQnVmZmVyRmFjdG9yeVwiXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge01lc2hQcmV2aWV3Vmlld2VyfSAgICAgIGZyb20gXCJNZXNoUHJldmlld1ZpZXdlclwiXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJ9ICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld2VyXCJcclxuaW1wb3J0IHtPQkpMb2FkZXJ9ICAgICAgICAgICAgICBmcm9tIFwiT0JKTG9hZGVyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICBmcm9tIFwiVmlld2VyXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBNb2RlbFJlbGllZiB7XHJcblxyXG4gICAgX2xvYWRlciAgICAgICAgICAgICA6IExvYWRlcjtcclxuICAgIF9tb2RlbFZpZXdlciAgICAgICAgOiBNb2RlbFZpZXdlcjtcclxuICAgIF9tZXNoUHJldmlld1ZpZXdlciAgOiBNZXNoUHJldmlld1ZpZXdlcjtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsUmVsaWVmXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIHJlbGllZiBmcm9tIHRoZSBjdXJyZW50IG1vZGVsIGNhbWVyYS5cclxuICAgICAqL1xyXG4gICAgZ2VuZXJhdGVSZWxpZWYoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgc2l6ZSA9IDUxMjtcclxuICAgICAgICBsZXQgZmFjdG9yeSA9IG5ldyBEZXB0aEJ1ZmZlckZhY3Rvcnkoe3dpZHRoIDogc2l6ZSwgaGVpZ2h0IDogc2l6ZSwgbW9kZWwgOiB0aGlzLl9tb2RlbFZpZXdlci5fcm9vdCwgY2FtZXJhIDogdGhpcy5fbW9kZWxWaWV3ZXIuY2FtZXJhLCBhZGRDYW52YXNUb0RPTSA6IHRydWV9KTsgICBcclxuICAgICAgICBsZXQgcHJldmlld01lc2ggOiBUSFJFRS5NZXNoID0gZmFjdG9yeS5tZXNoR2VuZXJhdGUoe21vZGVsV2lkdGggOiAyfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX21lc2hQcmV2aWV3Vmlld2VyLm1vZGVsID0gcHJldmlld01lc2g7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIuYWRkSW5mb01lc3NhZ2UoJ1JlbGllZiBnZW5lcmF0ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHZpZXcgc2V0dGluZ3MgdGhhdCBhcmUgY29udHJvbGxhYmxlIGJ5IHRoZSB1c2VyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVWaWV3ZXJDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgbGV0IHNjb3BlID0gdGhpcztcclxuXHJcbiAgICAgICAgY2xhc3MgVmlld2VyQ29udHJvbHMge1xyXG4gICAgICAgICAgICBkaXNwbGF5R3JpZDogYm9vbGVhbjtcclxuICAgICAgICAgICAgZ2VuZXJhdGVSZWxpZWYgOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlHcmlkICAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVJlbGllZiA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZpZXdlckNvbnRyb2xzID0gbmV3IFZpZXdlckNvbnRyb2xzKCk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIHZhciBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbWVudURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5nc0NvbnRyb2xzJyk7XHJcbiAgICAgICAgbWVudURpdi5hcHBlbmRDaGlsZChndWkuZG9tRWxlbWVudCk7XHJcbiAgICAgICAgdmFyIGZvbGRlck9wdGlvbnMgPSBndWkuYWRkRm9sZGVyKCdNb2RlbFZpZXdlciBPcHRpb25zJyk7XHJcblxyXG4gICAgICAgIC8vIEdyaWRcclxuICAgICAgICB2YXIgY29udHJvbERpc3BsYXlHcmlkID0gZm9sZGVyT3B0aW9ucy5hZGQodmlld2VyQ29udHJvbHMsICdkaXNwbGF5R3JpZCcpLm5hbWUoJ0Rpc3BsYXkgR3JpZCcpO1xyXG4gICAgICAgIGNvbnRyb2xEaXNwbGF5R3JpZC5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fbW9kZWxWaWV3ZXIuZGlzcGxheUdyaWQgKHZhbHVlKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBEZXB0aCBCdWZmZXJcclxuICAgICAgICB2YXIgY29udHJvbEdlbmVyYXRlUmVsaWVmID0gZm9sZGVyT3B0aW9ucy5hZGQodmlld2VyQ29udHJvbHMsICdnZW5lcmF0ZVJlbGllZicpLm5hbWUoJ0dlbmVyYXRlIFJlbGllZicpO1xyXG4gICAgICAgIGNvbnRyb2xHZW5lcmF0ZVJlbGllZi5vbkNoYW5nZSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuZ2VuZXJhdGVSZWxpZWYoKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBmb2xkZXJPcHRpb25zLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExhdW5jaCB0aGUgbW9kZWwgVmlld2VyLlxyXG4gICAgICovXHJcbiAgICBydW4gKCkge1xyXG5cclxuICAgICAgICBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyLmFkZEluZm9NZXNzYWdlICgnTW9kZWxSZWxpZWYgc3RhcnRlZCcpOyAgIFxyXG4gICAgICAgXHJcbiAgICAgICAgLy8gTW9kZWwgVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyID0gbmV3IE1vZGVsVmlld2VyKCdtb2RlbENhbnZhcycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE1lc2ggUHJldmlld1xyXG4gICAgICAgIHRoaXMuX21lc2hQcmV2aWV3Vmlld2VyID0gIG5ldyBNZXNoUHJldmlld1ZpZXdlcignbWVzaENhbnZhcycpO1xyXG5cclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXdlckNvbnRyb2xzKCk7XHJcblxyXG4gICAgICAgIC8vIExvYWRlclxyXG4gICAgICAgIHRoaXMuX2xvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuXHJcbi8vICAgICAgdGhpcy5fbG9hZGVyLmxvYWRPQkpNb2RlbCAodGhpcy5fbW9kZWxWaWV3ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2FkZXIubG9hZENoZWNrZXJib2FyZE1vZGVsICh0aGlzLl9tb2RlbFZpZXdlcik7XHJcbi8vICAgICAgdGhpcy5fbG9hZGVyLmxvYWRUb3J1c01vZGVsICh0aGlzLl9tb2RlbFZpZXdlcik7XHJcbi8vICAgICAgdGhpcy5fbG9hZGVyLmxvYWRCb3hNb2RlbCAodGhpcy5fbW9kZWxWaWV3ZXIpO1xyXG4vLyAgICAgIHRoaXMuX2xvYWRlci5sb2FkU3BoZXJlTW9kZWwgKHRoaXMuX21vZGVsVmlld2VyKTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IG1vZGVsUmVsaWVmID0gbmV3IE1vZGVsUmVsaWVmKCk7XHJcbm1vZGVsUmVsaWVmLnJ1bigpO1xyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQge2Fzc2VydH0gICBmcm9tICdjaGFpJ1xyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9IGZyb20gJ0RlcHRoQnVmZmVyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSBmcm9tICdNYXRoJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vKipcclxuICogQGV4cG9ydHMgVmlld2VyL1ZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVuaXRUZXN0cyB7XHJcbiAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVW5pdFRlc3RzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgc3RhdGljIFZlcnRleE1hcHBpbmcgKGRlcHRoQnVmZmVyIDogRGVwdGhCdWZmZXIsIG1lc2ggOiBUSFJFRS5NZXNoKSB7XHJcblxyXG4gICAgICAgIGxldCBtZXNoR2VvbWV0cnkgOiBUSFJFRS5HZW9tZXRyeSA9IDxUSFJFRS5HZW9tZXRyeT4gbWVzaC5nZW9tZXRyeTtcclxuICAgICAgICBtZXNoR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gbWVzaEdlb21ldHJ5LmJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICAvLyB3aWR0aCAgPSAzICAgICAgICAgICAgICAzICAgNCAgIDVcclxuICAgICAgICAvLyBjb2x1bW4gPSAyICAgICAgICAgICAgICAwICAgMSAgIDJcclxuICAgICAgICAvLyBidWZmZXIgbGVuZ3RoID0gNlxyXG5cclxuICAgICAgICAvLyBUZXN0IFBvaW50cyAgICAgICAgICAgIFxyXG4gICAgICAgIGxldCBsb3dlckxlZnQgID0gYm91bmRpbmdCb3gubWluO1xyXG4gICAgICAgIGxldCBsb3dlclJpZ2h0ID0gbmV3IFRIUkVFLlZlY3RvcjMgKGJvdW5kaW5nQm94Lm1heC54LCBib3VuZGluZ0JveC5taW4ueSwgMCk7XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHQgPSBib3VuZGluZ0JveC5tYXg7XHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdCAgPSBuZXcgVEhSRUUuVmVjdG9yMyAoYm91bmRpbmdCb3gubWluLngsIGJvdW5kaW5nQm94Lm1heC55LCAwKTtcclxuICAgICAgICBsZXQgY2VudGVyICAgICA9IGJvdW5kaW5nQm94LmdldENlbnRlcigpO1xyXG5cclxuICAgICAgICAvLyBFeHBlY3RlZCBWYWx1ZXNcclxuICAgICAgICBsZXQgYnVmZmVyTGVuZ3RoICAgIDogbnVtYmVyID0gKGRlcHRoQnVmZmVyLndpZHRoICogZGVwdGhCdWZmZXIuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGZpcnN0Q29sdW1uICAgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBsYXN0Q29sdW1uICAgIDogbnVtYmVyID0gZGVwdGhCdWZmZXIud2lkdGggLSAxO1xyXG4gICAgICAgIGxldCBjZW50ZXJDb2x1bW4gIDogbnVtYmVyID0gTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci53aWR0aCAvIDIpO1xyXG4gICAgICAgIGxldCBmaXJzdFJvdyAgICAgIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbGFzdFJvdyAgICAgICA6IG51bWJlciA9IGRlcHRoQnVmZmVyLmhlaWdodCAtIDE7XHJcbiAgICAgICAgbGV0IGNlbnRlclJvdyAgICAgOiBudW1iZXIgPSBNYXRoLnJvdW5kKGRlcHRoQnVmZmVyLmhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICBsZXQgbG93ZXJMZWZ0SW5kZXggIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodEluZGV4IDogbnVtYmVyID0gZGVwdGhCdWZmZXIud2lkdGggLSAxO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0SW5kZXggOiBudW1iZXIgPSBidWZmZXJMZW5ndGggLSAxO1xyXG4gICAgICAgIGxldCB1cHBlckxlZnRJbmRleCAgOiBudW1iZXIgPSBidWZmZXJMZW5ndGggLSBkZXB0aEJ1ZmZlci53aWR0aDtcclxuICAgICAgICBsZXQgY2VudGVySW5kZXggICAgIDogbnVtYmVyID0gKGNlbnRlclJvdyAqIGRlcHRoQnVmZmVyLndpZHRoKSArICBNYXRoLnJvdW5kKGRlcHRoQnVmZmVyLndpZHRoIC8gMik7XHJcblxyXG4gICAgICAgIGxldCBsb3dlckxlZnRJbmRpY2VzICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihmaXJzdFJvdywgZmlyc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCBsb3dlclJpZ2h0SW5kaWNlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihmaXJzdFJvdywgbGFzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHRJbmRpY2VzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGxhc3RSb3csIGxhc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCB1cHBlckxlZnRJbmRpY2VzICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihsYXN0Um93LCBmaXJzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IGNlbnRlckluZGljZXMgICAgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGNlbnRlclJvdywgY2VudGVyQ29sdW1uKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgaW5kZXggICA6IG51bWJlclxyXG4gICAgICAgIGxldCBpbmRpY2VzIDogVEhSRUUuVmVjdG9yMjtcclxuXHJcbiAgICAgICAgLy8gTG93ZXIgTGVmdFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXMobG93ZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCBsb3dlckxlZnRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggICA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgobG93ZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBsb3dlckxlZnRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIExvd2VyIFJpZ2h0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyhsb3dlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCBsb3dlclJpZ2h0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleChsb3dlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBsb3dlclJpZ2h0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBVcHBlciBSaWdodFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXModXBwZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgdXBwZXJSaWdodEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgodXBwZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgdXBwZXJSaWdodEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gVXBwZXIgTGVmdFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXModXBwZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCB1cHBlckxlZnRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KHVwcGVyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgdXBwZXJMZWZ0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBDZW50ZXJcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKGNlbnRlciwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgY2VudGVySW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleChjZW50ZXIsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIGNlbnRlckluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICB9IFxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuaW1wb3J0ICogYXMgZGF0ICAgIGZyb20gJ2RhdC1ndWknXHJcblxyXG5pbXBvcnQge0NhbWVyYX0gICAgICAgICAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgICAgIGZyb20gJ0RlcHRoQnVmZmVyRmFjdG9yeSdcclxuaW1wb3J0IHtDYW1lcmFTZXR0aW5ncywgR3JhcGhpY3N9ICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0xvYWRlcidcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hQcmV2aWV3Vmlld2VyfSAgICAgICAgICBmcm9tIFwiTWVzaFByZXZpZXdWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUcmFja2JhbGxDb250cm9sc30gICAgICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgYm91bmRpbmcgYm94IG1lc2guXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0IFRhcmdldCBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgQ29sb3Igb2YgYm91bmRpbmcgYm94IG1lc2guXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJvdW5kaW5nQm94IChvYmplY3QgOiBUSFJFRS5PYmplY3QzRCwgY29sb3IgOiBudW1iZXIpIDogVEhSRUUuTWVzaCB7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA6IFRIUkVFLkJveDMgPSBuZXcgVEhSRUUuQm94MygpO1xyXG4gICAgICAgIGJvdW5kaW5nQm94ID0gYm91bmRpbmdCb3guc2V0RnJvbU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge2NvbG9yIDogY29sb3IsIG9wYWNpdHkgOiAxLjAsIHdpcmVmcmFtZSA6IHRydWV9KTsgICAgICAgXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94TWVzaCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3goYm91bmRpbmdCb3guZ2V0Q2VudGVyKCksIGJvdW5kaW5nQm94LCBtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveE1lc2g7XHJcbiAgICB9XHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQ2FtZXJhV29ya2JlbmNoXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FtZXJhVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbWVyYVxyXG4gICAgICovXHJcbiAgICBnZXQgY2FtZXJhICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlU2NlbmUoKSB7XHJcblxyXG4gICAgICAgIGxldCB0cmlhZCA9IEdyYXBoaWNzLmNyZWF0ZVdvcmxkQXhlc1RyaWFkKG5ldyBUSFJFRS5WZWN0b3IzKCksIDEsIDAuMjUsIDAuMjUpO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZCh0cmlhZCk7XHJcblxyXG4gICAgICAgIGxldCBib3ggOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlQm94TWVzaChuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAtMiksIDEsIDIsIDIsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiAweGZmMDAwMH0pKTtcclxuICAgICAgICBib3gucm90YXRpb24uc2V0KE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgICAgIGJveC51cGRhdGVNYXRyaXgoKTtcclxuXHJcbiAgICAgICAgbGV0IGJveENsb25lID0gR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QoYm94LCBuZXcgVEhSRUUuTWF0cml4NCgpKTtcclxuICAgICAgICB0aGlzLm1vZGVsLmFkZChib3hDbG9uZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGhlcmUgOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMyg0LCAyLCAtMSksIDEsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiAweDAwZmYwMH0pKTtcclxuICAgICAgICB0aGlzLm1vZGVsLmFkZChzcGhlcmUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVEZWZhdWx0Q2FtZXJhU2V0dGluZ3MgKCkgOiBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgICAgIGxldCBzZXR0aW5ncyA6IENhbWVyYVNldHRpbmdzID0ge1xyXG5cclxuICAgICAgICAgICAgcG9zaXRpb246ICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuMCwgMC4wLCAyMC4wKSxcclxuICAgICAgICAgICAgdGFyZ2V0OiAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApLFxyXG4gICAgICAgICAgICBuZWFyOiAgICAgICAgICAgIDIuMCxcclxuICAgICAgICAgICAgZmFyOiAgICAgICAgICAgIDUwLjAsXHJcbiAgICAgICAgICAgIGZpZWxkT2ZWaWV3OiAgICAzNyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL3d3dy5uaWtvbmlhbnMub3JnL3Jldmlld3MvZm92LXRhYmxlc1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXR0aW5nczsgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICBuZWFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXI7XHJcbiAgICBmYXJDbGlwcGluZ1BsYW5lICAgOiBudW1iZXI7XHJcbiAgICBmaWVsZE9mVmlldyAgICAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgc2hvd0JvdW5kaW5nQm94ZXMgOiAoKSA9PiB2b2lkO1xyXG4gICAgc2V0Q2xpcHBpbmdQbGFuZXMgOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIHNob3dCb3VuZGluZ0JveGVzIDogKCkgPT4gYW55LCBzZXRDbGlwcGluZ1BsYW5lcyA6ICgpID0+IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lICAgID0gY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5mYXJDbGlwcGluZ1BsYW5lICAgICA9IGNhbWVyYS5mYXI7XHJcbiAgICAgICAgdGhpcy5maWVsZE9mVmlldyAgICAgICAgICA9IGNhbWVyYS5mb3Y7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMgPSBzaG93Qm91bmRpbmdCb3hlcztcclxuICAgICAgICB0aGlzLnNldENsaXBwaW5nUGxhbmVzICA9IHNldENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEFwcFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBcclxuICAgIF9sb2dnZXIgICAgICAgICA6IENvbnNvbGVMb2dnZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgOiBMb2FkZXI7XHJcbiAgICBfdmlld2VyICAgICAgICAgOiBDYW1lcmFWaWV3ZXI7XHJcbiAgICBfdmlld2VyQ29udHJvbHMgOiBWaWV3ZXJDb250cm9scztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byB0aGUgbW9kZWwgZXh0ZW50cyBpbiBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsICAgICAgICAgICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgPSB0aGlzLl92aWV3ZXIubW9kZWw7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgbW9kZWwgKGFuZCBnZW9tZXRyeSEpXHJcbiAgICAgICAgbGV0IG1vZGVsVmlldyA9IEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXcgPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGJveCBpcyB3b3JsZC1heGlzIGFsaWduZWQuIFxyXG4gICAgICAgIC8vIElOdiBWaWV3IGNvb3JkaW5hdGVzLCB0aGUgY2FtZXJhIGlzIGF0IHRoZSBvcmlnaW4uXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIG5lYXIgcGxhbmUgaXMgdGhlIG1heGltdW0gWiBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBmYXIgcGxhbmUgaXMgdGhlIG1pbmltdW0gWiBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICAgIGxldCBuZWFyUGxhbmUgPSAtYm91bmRpbmdCb3hWaWV3Lm1heC56O1xyXG4gICAgICAgIGxldCBmYXJQbGFuZSAgPSAtYm91bmRpbmdCb3hWaWV3Lm1pbi56O1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scy5uZWFyQ2xpcHBpbmdQbGFuZSA9IG5lYXJQbGFuZTtcclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scy5mYXJDbGlwcGluZ1BsYW5lICA9IGZhclBsYW5lO1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSBuZWFyUGxhbmU7XHJcbiAgICAgICAgdGhpcy5fdmlld2VyLmNhbWVyYS5mYXIgID0gZmFyUGxhbmU7XHJcblxyXG4gICAgICAgIC8vIFdJUDogT3IgdGhpcy5fdmlld2VyLnVwZGF0ZUNhbWVyYSgpP1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyB0aGUgY2xpcHBpbmcgcGxhbmVzIG9mIHRoZSBtb2RlbCBpbiBWaWV3IGFuZCBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc2hvd0JvdW5kaW5nQm94ZXMoKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbCAgICAgICAgICAgICAgICAgICAgOiBUSFJFRS5Hcm91cCAgID0gdGhpcy5fdmlld2VyLm1vZGVsO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZCAgICAgICAgOiBUSFJFRS5NYXRyaXg0ID0gdGhpcy5fdmlld2VyLmNhbWVyYS5tYXRyaXhXb3JsZDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmcgQm91bmRpbmdCb3hcclxuICAgICAgICBtb2RlbC5yZW1vdmUobW9kZWwuZ2V0T2JqZWN0QnlOYW1lKEdyYXBoaWNzLkJvdW5kaW5nQm94TmFtZSkpO1xyXG5cclxuICAgICAgICAvLyBjbG9uZSBtb2RlbCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgbW9kZWxWaWV3ID0gIEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICAvLyBjbGVhciBlbnRpcmUgc2NlbmVcclxuICAgICAgICBHcmFwaGljcy5yZW1vdmVPYmplY3RDaGlsZHJlbihtb2RlbCwgZmFsc2UpO1xyXG5cclxuICAgICAgICBtb2RlbC5hZGQobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldyA9IGNyZWF0ZUJvdW5kaW5nQm94KG1vZGVsVmlldywgMHhmZjAwZmYpO1xyXG4gICAgICAgIG1vZGVsLmFkZChib3VuZGluZ0JveFZpZXcpO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gbW9kZWwgYmFjayBmcm9tIFZpZXcgdG8gV29ybGRcclxuICAgICAgICBsZXQgbW9kZWxXb3JsZCA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChtb2RlbFZpZXcsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBtb2RlbC5hZGQobW9kZWxXb3JsZCk7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBib3VuZGluZyBib3ggYmFjayBmcm9tIFZpZXcgdG8gV29ybGRcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZCA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChib3VuZGluZ0JveFZpZXcsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBtb2RlbC5hZGQoYm91bmRpbmdCb3hXb3JsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplVmlld2VyQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlckNvbnRyb2xzID0gbmV3IFZpZXdlckNvbnRyb2xzKHRoaXMuX3ZpZXdlci5jYW1lcmEsIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMuYmluZCh0aGlzKSwgdGhpcy5zZXRDbGlwcGluZ1BsYW5lcy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgdmFyIGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBzZXR0aW5nc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5nc0NvbnRyb2xzJyk7XHJcbiAgICAgICAgc2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG4gICAgICAgIHZhciBmb2xkZXJPcHRpb25zID0gZ3VpLmFkZEZvbGRlcignQ2FtZXJhIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gTmVhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIGxldCBtaW5pbXVtICA9ICAgMDtcclxuICAgICAgICBsZXQgbWF4aW11bSAgPSAxMDA7XHJcbiAgICAgICAgbGV0IHN0ZXBTaXplID0gICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xOZWFyQ2xpcHBpbmdQbGFuZSA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnbmVhckNsaXBwaW5nUGxhbmUnKS5uYW1lKCdOZWFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTtcclxuICAgICAgICBjb250cm9sTmVhckNsaXBwaW5nUGxhbmUgLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAxO1xyXG4gICAgICAgIG1heGltdW0gID0gNTAwO1xyXG4gICAgICAgIHN0ZXBTaXplID0gICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGYXJDbGlwcGluZ1BsYW5lID0gZm9sZGVyT3B0aW9ucy5hZGQodGhpcy5fdmlld2VyQ29udHJvbHMsICdmYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnRmFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZhckNsaXBwaW5nUGxhbmUgLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIG1pbmltdW0gID0gMjU7XHJcbiAgICAgICAgbWF4aW11bSAgPSA3NTtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXc9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnZmllbGRPZlZpZXcnKS5uYW1lKCdGaWVsZCBvZiBWaWV3JykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZpZWxkT2ZWaWV3IC5vbkNoYW5nZSAoZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS5mb3YgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIFNob3cgQm91bmRpbmcgQm94ZXNcclxuICAgICAgICBsZXQgY29udHJvbFNob3dCb3VuZGluZ0JveGVzID0gZm9sZGVyT3B0aW9ucy5hZGQodGhpcy5fdmlld2VyQ29udHJvbHMsICdzaG93Qm91bmRpbmdCb3hlcycpLm5hbWUoJ1Nob3cgQm91bmRpbmcgQm94ZXMnKTtcclxuXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgUGxhbmVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTZXRDbGlwcGluZ1BsYW5lcyA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnc2V0Q2xpcHBpbmdQbGFuZXMnKS5uYW1lKCdTZXQgQ2xpcHBpbmcgUGxhbmVzJyk7XHJcblxyXG4gICAgICAgIGZvbGRlck9wdGlvbnMub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBydW4gKCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX3ZpZXdlciA9IG5ldyBDYW1lcmFWaWV3ZXIoJ3ZpZXdlckNhbnZhcycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFVJIENvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplVmlld2VyQ29udHJvbHMoKTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGFwcCA9IG5ldyBBcHA7XHJcbmFwcC5ydW4oKTtcclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7TWVzaFByZXZpZXdWaWV3ZXJ9ICAgICAgZnJvbSBcIk1lc2hQcmV2aWV3Vmlld2VyXCJcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1VuaXRUZXN0c30gICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogRGVwdGhCdWZmZXJUZXN0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXJUZXN0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW5cclxuICAgICAqL1xyXG4gICAgbWFpbiAoKSB7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBkZXB0aEJ1ZmZlclRlc3QgPSBuZXcgRGVwdGhCdWZmZXJUZXN0KCk7XHJcbmRlcHRoQnVmZmVyVGVzdC5tYWluKCk7XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hQcmV2aWV3Vmlld2VyfSAgICAgIGZyb20gXCJNZXNoUHJldmlld1ZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxubGV0IGxvZ2dlciA9IG5ldyBIVE1MTG9nZ2VyKCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIFdpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFdpZGdldCB7XHJcbiAgICBcclxuICAgIG5hbWUgIDogc3RyaW5nO1xyXG4gICAgcHJpY2UgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJpY2UgOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lICA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlcmF0ZVxyXG4gICAgICovXHJcbiAgICBvcGVyYXRlICgpIHtcclxuICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UoYCR7dGhpcy5uYW1lfSBvcGVyYXRpbmcuLi4uYCk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBTdXBlcldpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbG9yV2lkZ2V0IGV4dGVuZHMgV2lkZ2V0IHtcclxuXHJcbiAgICBjb2xvciA6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmljZSA6IG51bWJlciwgY29sb3IgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIgKG5hbWUsIHByaWNlKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFuZFBhcmVudCB7XHJcblxyXG4gICAgZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmdyYW5kcGFyZW50UHJvcGVydHkgID0gZ3JhbmRwYXJlbnRQcm9wZXJ0eSA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJlbnQgZXh0ZW5kcyBHcmFuZFBhcmVudHtcclxuICAgIFxyXG4gICAgcGFyZW50UHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZywgcGFyZW50UHJvcGVydHkgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoZ3JhbmRwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRQcm9wZXJ0eSA9IHBhcmVudFByb3BlcnR5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBQYXJlbnR7XHJcbiAgICBcclxuICAgIGNoaWxkUHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5IDogc3RyaW5nLCBwYXJlbnRQcm9wZXJ0eSA6IHN0cmluZywgY2hpbGRQcm9wZXJ0eSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBzdXBlcihncmFuZHBhcmVudFByb3BlcnR5LCBwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5jaGlsZFByb3BlcnR5ID0gY2hpbGRQcm9wZXJ0eTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBJbmhlcml0YW5jZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluaGVyaXRhbmNlVGVzdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluXHJcbiAgICAgKi9cclxuICAgIG1haW4gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3aWRnZXQgPSBuZXcgV2lkZ2V0ICgnV2lkZ2V0JywgMS4wKTtcclxuICAgICAgICB3aWRnZXQub3BlcmF0ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY29sb3JXaWRnZXQgPSBuZXcgQ29sb3JXaWRnZXQgKCdDb2xvcldpZGdldCcsIDEuMCwgJ3JlZCcpO1xyXG4gICAgICAgIGNvbG9yV2lkZ2V0Lm9wZXJhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkID0gbmV3IENoaWxkKCdHYUdhJywgJ0RhZCcsICdTdGV2ZScpOyAgICBcclxuICAgIH1cclxufVxyXG5cclxubGV0IGluaGVyaXRhbmNlID0gbmV3IEluaGVyaXRhbmNlVGVzdDtcclxuaW5oZXJpdGFuY2UubWFpbigpO1xyXG4iXX0=

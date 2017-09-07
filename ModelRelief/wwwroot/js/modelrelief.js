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
            var prefix = 'MR: ';
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
define("System/StopWatch", ["require", "exports"], function (require, exports) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * StopWatch
     * General debugger timer.
     * @class
     */
    var StopWatch = (function () {
        /**
         * @constructor
         * @param {string} timerName Timer identifier
         * @param {Logger} logger Logger
         * N.B. Logger is passed as a constructor parameter because StopWatch and Service.consoleLogger are static Service properties.
         */
        function StopWatch(timerName, logger) {
            this._logger = logger;
            this._name = timerName;
            this._events = {};
            this._baselineTime = Date.now();
        }
        Object.defineProperty(StopWatch.prototype, "eventCount", {
            //#region Properties
            /**
             * @description Returns the mumber of pending events.
             * @readonly
             * @type {number}
             */
            get: function () {
                return Object.keys(this._events).length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StopWatch.prototype, "indentPrefix", {
            /**
             * @description Returns the current indent level.
             * @readonly
             * @type {string}
             */
            get: function () {
                var indent = '    ';
                return indent.repeat(this.eventCount);
            },
            enumerable: true,
            configurable: true
        });
        //#endregion
        /**
         * @description Resets the timer.
         */
        StopWatch.prototype.mark = function (event) {
            var startMilliseconds = Date.now();
            var indentPrefix = this.indentPrefix;
            var timerEntry = { startTime: startMilliseconds, indent: indentPrefix };
            this._events[event] = timerEntry;
            this._logger.addMessage("" + indentPrefix + event);
            return event;
        };
        /**
         * @description Logs the elapsted time.
         */
        StopWatch.prototype.logElapsedTime = function (event) {
            var timerElapsedTime = Date.now();
            var eventElapsedTime = (timerElapsedTime - (this._events[event].startTime)) / 1000;
            var elapsedTimeMessage = eventElapsedTime.toFixed(StopWatch.precision);
            var indentPrefix = this._events[event].indent;
            this._logger.addInfoMessage("" + indentPrefix + event + " : " + elapsedTimeMessage + " sec");
            // remove event from log
            delete this._events[event];
        };
        StopWatch.precision = 3;
        return StopWatch;
    }());
    exports.StopWatch = StopWatch;
});
define("System/Services", ["require", "exports", "System/Logger", "System/StopWatch"], function (require, exports, Logger_1, StopWatch_1) {
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
        Services.timer = new StopWatch_1.StopWatch('Master', Services.consoleLogger);
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
        ObjectNames["Root"] = "Root";
        ObjectNames["BoundingBox"] = "Bounding Box";
        ObjectNames["Box"] = "Box";
        ObjectNames["CameraHelper"] = "CameraHelper";
        ObjectNames["ModelClone"] = "Model Clone";
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
         * @description Dispose of resources held by a graphical object.
         * @static
         * @param {any} object3d Object to process.
         * https://stackoverflow.com/questions/18357529/threejs-remove-object-from-scene
         */
        Graphics.disposeResources = function (object3d) {
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
        };
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
                Graphics.disposeResources(object3d);
            };
            rootObject.traverse(remover);
            // remove root children from rootObject (backwards!)
            for (var iChild = (rootObject.children.length - 1); iChild >= 0; iChild--) {
                var child = rootObject.children[iChild];
                rootObject.remove(child);
            }
            if (removeRoot && rootObject.parent)
                rootObject.parent.remove(rootObject);
        };
        /**
         * Remove all objects of a given name from the scene.
         * @param scene Scene to process.
         * @param objectName Object name to find.
         */
        Graphics.removeAllByName = function (scene, objectName) {
            var object;
            while (object = scene.getObjectByName(objectName)) {
                Graphics.disposeResources(object);
                scene.remove(object);
            }
        };
        /**
         * Clone and transform an object.
         * @param object Object to clone and transform.
         * @param matrix Transformation matrix.
         */
        Graphics.cloneAndTransformObject = function (object, matrix) {
            var methodTag = Services_1.Services.timer.mark('cloneAndTransformObject');
            // clone object (and geometry!)
            var cloneTag = Services_1.Services.timer.mark('clone');
            var objectClone = object.clone();
            objectClone.traverse(function (object) {
                if (object instanceof (THREE.Mesh))
                    object.geometry = object.geometry.clone();
            });
            Services_1.Services.timer.logElapsedTime(cloneTag);
            // N.B. Important! The postion, rotation (quaternion) and scale are correct but the matrix has not been updated.
            // THREE.js updates the matrix in the render() loop.
            var transformTag = Services_1.Services.timer.mark('transform');
            objectClone.updateMatrixWorld(true);
            // transform
            objectClone.applyMatrix(matrix);
            Services_1.Services.timer.logElapsedTime(transformTag);
            Services_1.Services.timer.logElapsedTime(methodTag);
            return objectClone;
        };
        /**
         * Gets the bounding box of a transformed object.
         * @param object Object to transform.
         * @param matrix Transformation matrix.
         */
        Graphics.getTransformedBoundingBox = function (object, matrix) {
            var methodTag = Services_1.Services.timer.mark('getTransformedBoundingBox');
            object.updateMatrixWorld(true);
            object.applyMatrix(matrix);
            var boundingBox = Graphics.getBoundingBoxFromObject(object);
            // restore object
            var matrixIdentity = new THREE.Matrix4();
            var matrixInverse = matrixIdentity.getInverse(matrix, true);
            object.applyMatrix(matrixInverse);
            Services_1.Services.timer.logElapsedTime(methodTag);
            return boundingBox;
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
            var timerTag = Services_1.Services.timer.mark(rootObject.name + ": BoundingBox");
            // https://stackoverflow.com/questions/15492857/any-way-to-get-a-bounding-box-from-a-three-js-object3d
            var boundingBox = new THREE.Box3();
            boundingBox = boundingBox.setFromObject(rootObject);
            Services_1.Services.timer.logElapsedTime(timerTag);
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
        Graphics.addCameraHelper = function (camera, scene, model) {
            if (!camera)
                return;
            // camera properties
            var cameraMatrixWorld = camera.matrixWorld;
            var cameraMatrixWorldInverse = camera.matrixWorldInverse;
            // construct root object of the helper
            var cameraHelper = new THREE.Group();
            cameraHelper.name = ObjectNames.CameraHelper;
            cameraHelper.visible = true;
            // model bounding box (View coordinates)
            var boundingBoxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: true, transparent: false, opacity: 0.2 });
            var boundingBoxView = Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);
            var boundingBoxViewMesh = Graphics.createBoundingBoxMeshFromBoundingBox(boundingBoxView.getCenter(), boundingBoxView, boundingBoxMaterial);
            var boundingBoxWorldMesh = Graphics.cloneAndTransformObject(boundingBoxViewMesh, cameraMatrixWorld);
            cameraHelper.add(boundingBoxWorldMesh);
            // position
            var position = Graphics.createSphereMesh(camera.position, 3);
            cameraHelper.add(position);
            // camera target line
            var unitTarget = new THREE.Vector3(0, 0, -1);
            unitTarget.applyQuaternion(camera.quaternion);
            var scaledTarget;
            scaledTarget = unitTarget.multiplyScalar(-boundingBoxView.max.z);
            var startPoint = camera.position;
            var endPoint = new THREE.Vector3();
            endPoint.addVectors(startPoint, scaledTarget);
            var targetLine = Graphics.createLine(startPoint, endPoint, 0x00ff00);
            cameraHelper.add(targetLine);
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
            var timerTag = Services_2.Services.timer.mark('DepthBuffer.mesh');
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
            // Mesh was constructed with Z = depth buffer(X,Y).
            // Now rotate mesh to align with viewer XY plane so Top view is looking down on the mesh.
            mesh.rotateX(-Math.PI / 2);
            Services_2.Services.timer.logElapsedTime(timerTag);
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
        DepthBuffer.DefaultMeshPhongMaterialParameters = { side: THREE.DoubleSide, wireframe: false, color: 0xff00ff, reflectivity: 0.75, shininess: 0.75 };
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
define("DepthBuffer/DepthBufferFactory", ["require", "exports", "three", "Viewer/Camera", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "System/Services", "System/Tools"], function (require, exports, THREE, Camera_2, DepthBuffer_1, Graphics_1, Services_3, Tools_1) {
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
            this._boundedClipping = false; // override camera clipping planes; set near and far to bound model for improved accuracy
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
            this._boundedClipping = parameters.boundedClipping || false;
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
            //      this._depthBuffer.analyze();
        };
        /**
         * Create a depth buffer.
         */
        DepthBufferFactory.prototype.createDepthBuffer = function () {
            var timerTag = Services_3.Services.timer.mark('DepthBufferFactory.createDepthBuffer');
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
            Services_3.Services.timer.logElapsedTime(timerTag);
        };
        /**
         * Sets the camera clipping planes for mesh generation.
         */
        DepthBufferFactory.prototype.setCameraClippingPlanes = function () {
            // copy camera; shared with ModelViewer
            var camera = new THREE.PerspectiveCamera();
            camera.copy(this._camera);
            this._camera = camera;
            var clippingPlanes = Camera_2.Camera.getBoundingClippingPlanes(this._camera, this._model);
            this._camera.near = clippingPlanes.near;
            this._camera.far = clippingPlanes.far;
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
        DepthBufferFactory.NearPlaneEpsilon = .001; // adjustment to avoid clipping geometry on the near plane
        DepthBufferFactory.CssClassName = 'DepthBufferFactory'; // CSS class
        DepthBufferFactory.RootContainerId = 'rootContainer'; // root container for viewers
        return DepthBufferFactory;
    }());
    exports.DepthBufferFactory = DepthBufferFactory;
});
define("Viewer/Camera", ["require", "exports", "three", "DepthBuffer/DepthBufferFactory", "Viewer/Graphics", "System/Services"], function (require, exports, THREE, DepthBufferFactory_1, Graphics_2, Services_4) {
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
        /**
         * Finds the bounding clipping planes for the given model.
         *
         */
        Camera.getBoundingClippingPlanes = function (camera, model) {
            var cameraMatrixWorldInverse = camera.matrixWorldInverse;
            var boundingBoxView = Graphics_2.Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);
            // The bounding box is world-axis aligned. 
            // In View coordinates, the camera is at the origin.
            // The bounding near plane is the maximum Z of the bounding box.
            // The bounding far plane is the minimum Z of the bounding box.
            var nearPlane = -boundingBoxView.max.z;
            var farPlane = -boundingBoxView.min.z;
            var clippingPlanes = {
                // adjust by epsilon to avoid clipping geometry at the near plane edge
                near: (1 - DepthBufferFactory_1.DepthBufferFactory.NearPlaneEpsilon) * nearPlane,
                far: farPlane
            };
            return clippingPlanes;
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
                boundingBox = Graphics_2.Graphics.getBoundingBoxFromObject(model);
            if (!boundingBox.isEmpty())
                return boundingBox;
            // unit sphere proxy
            var sphereProxy = Graphics_2.Graphics.createSphereMesh(new THREE.Vector3(), 1);
            boundingBox = Graphics_2.Graphics.getBoundingBoxFromObject(sphereProxy);
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
            var timerTag = Services_4.Services.timer.mark('Camera.getFitViewCamera');
            var camera = cameraTemplate.clone(true);
            var boundingBoxWorld = Camera.getDefaultBoundingBox(model);
            var cameraMatrixWorld = camera.matrixWorld;
            var cameraMatrixWorldInverse = camera.matrixWorldInverse;
            // Find camera position in View coordinates...
            var boundingBoxView = Graphics_2.Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);
            var verticalFieldOfViewRadians = (camera.fov / 2) * (Math.PI / 180);
            var horizontalFieldOfViewRadians = Math.atan(camera.aspect * Math.tan(verticalFieldOfViewRadians));
            var cameraZVerticalExtents = (boundingBoxView.getSize().y / 2) / Math.tan(verticalFieldOfViewRadians);
            var cameraZHorizontalExtents = (boundingBoxView.getSize().x / 2) / Math.tan(horizontalFieldOfViewRadians);
            var cameraZ = Math.max(cameraZVerticalExtents, cameraZHorizontalExtents);
            // preserve XY; set Z to include extents
            var cameraPositionView = camera.position.applyMatrix4(cameraMatrixWorldInverse);
            var positionView = new THREE.Vector3(cameraPositionView.x, cameraPositionView.y, boundingBoxView.max.z + cameraZ);
            // Now, transform back to World coordinates...
            var positionWorld = positionView.applyMatrix4(cameraMatrixWorld);
            camera.position.copy(positionWorld);
            camera.lookAt(boundingBoxWorld.getCenter());
            // force camera matrix to update; matrixAutoUpdate happens in render loop
            camera.updateMatrixWorld(true);
            camera.updateProjectionMatrix();
            Services_4.Services.timer.logElapsedTime(timerTag);
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
            var timerTag = Services_4.Services.timer.mark('Camera.getStandardView');
            var camera = Camera.getDefaultCamera(viewAspect);
            var boundingBox = Graphics_2.Graphics.getBoundingBoxFromObject(model);
            var centerX = boundingBox.getCenter().x;
            var centerY = boundingBox.getCenter().y;
            var centerZ = boundingBox.getCenter().z;
            var minX = boundingBox.min.x;
            var minY = boundingBox.min.y;
            var minZ = boundingBox.min.z;
            var maxX = boundingBox.max.x;
            var maxY = boundingBox.max.y;
            var maxZ = boundingBox.max.z;
            switch (view) {
                case StandardView.Front: {
                    camera.position.copy(new THREE.Vector3(centerX, centerY, maxZ));
                    camera.up.set(0, 1, 0);
                    break;
                }
                case StandardView.Back: {
                    camera.position.copy(new THREE.Vector3(centerX, centerY, minZ));
                    camera.up.set(0, 1, 0);
                    break;
                }
                case StandardView.Top: {
                    camera.position.copy(new THREE.Vector3(centerX, maxY, centerZ));
                    camera.up.set(0, 0, -1);
                    break;
                }
                case StandardView.Bottom: {
                    camera.position.copy(new THREE.Vector3(centerX, minY, centerZ));
                    camera.up.set(0, 0, 1);
                    break;
                }
                case StandardView.Left: {
                    camera.position.copy(new THREE.Vector3(minX, centerY, centerZ));
                    camera.up.set(0, 1, 0);
                    break;
                }
                case StandardView.Right: {
                    camera.position.copy(new THREE.Vector3(maxX, centerY, centerZ));
                    camera.up.set(0, 1, 0);
                    break;
                }
                case StandardView.Isometric: {
                    var side = Math.max(Math.max(boundingBox.getSize().x, boundingBox.getSize().y), boundingBox.getSize().z);
                    camera.position.copy(new THREE.Vector3(side, side, side));
                    camera.up.set(-1, 1, -1);
                    break;
                }
            }
            // Force orientation before Fit View calculation
            camera.lookAt(boundingBox.getCenter());
            // force camera matrix to update; matrixAutoUpdate happens in render loop
            camera.updateMatrixWorld(true);
            camera.updateProjectionMatrix();
            camera = Camera.getFitViewCamera(camera, model);
            Services_4.Services.timer.logElapsedTime(timerTag);
            return camera;
        };
        /**
         * Creates a default scene camera.
         * @param viewAspect View aspect ratio.
         */
        Camera.getDefaultCamera = function (viewAspect) {
            var defaultCamera = new THREE.PerspectiveCamera();
            defaultCamera.position.copy(new THREE.Vector3(0, 0, 0));
            defaultCamera.lookAt(new THREE.Vector3(0, 0, -1));
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
// -------------------------------------------------------------------------------------// 
//                                                                                      // 
// @author mrdoob / http://mrdoob.com/                                                  // 
// https://github.com/sohamkamani/three-object-loader/blob/master/source/index.js       //
//                                                                                      // 
// -------------------------------------------------------------------------------------//
define("ModelLoaders/OBJLoader", ["require", "exports", "three", "System/Services"], function (require, exports, THREE, Services_5) {
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
            var timerTag = Services_5.Services.timer.mark('OBJLoader.parse');
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
            Services_5.Services.timer.logElapsedTime(timerTag);
            return container;
        }
    };
});
define("Viewer/CameraControls", ["require", "exports", "dat-gui", "Viewer/Camera", "Viewer/Graphics"], function (require, exports, dat, Camera_3, Graphics_3) {
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
        function CameraSettings(camera, fitView, addCwmeraHelper, boundClippingPlanes) {
            this.fitView = fitView;
            this.addCameraHelper = addCwmeraHelper;
            this.standardView = Camera_3.StandardView.Front;
            this.fieldOfView = camera.fov;
            this.nearClippingPlane = camera.near;
            this.farClippingPlane = camera.far;
            this.boundClippingPlanes = boundClippingPlanes;
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
        /**
         * Adds a camera visualization graphic to the scene.
         */
        CameraControls.prototype.addCameraHelper = function () {
            // remove existing
            Graphics_3.Graphics.removeAllByName(this._viewer.scene, Graphics_3.ObjectNames.CameraHelper);
            // World
            Graphics_3.Graphics.addCameraHelper(this._viewer.camera, this._viewer.scene, this._viewer.model);
            // View
            var modelView = Graphics_3.Graphics.cloneAndTransformObject(this._viewer.model, this._viewer.camera.matrixWorldInverse);
            var cameraView = Camera_3.Camera.getDefaultCamera(this._viewer.aspectRatio);
            Graphics_3.Graphics.addCameraHelper(cameraView, this._viewer.scene, modelView);
        };
        /**
         * Force the far clipping plane to the model extents.
         */
        CameraControls.prototype.boundClippingPlanes = function () {
            var clippingPlanes = Camera_3.Camera.getBoundingClippingPlanes(this._viewer.camera, this._viewer.model);
            // camera
            this._viewer.camera.near = clippingPlanes.near;
            this._viewer.camera.far = clippingPlanes.far;
            this._viewer.camera.updateProjectionMatrix();
            // UI controls
            this._cameraSettings.nearClippingPlane = clippingPlanes.near;
            this._controlNearClippingPlane.min(clippingPlanes.near);
            this._controlNearClippingPlane.max(clippingPlanes.far);
            this._cameraSettings.farClippingPlane = clippingPlanes.far;
            this._controlFarClippingPlane.min(clippingPlanes.near);
            this._controlFarClippingPlane.max(clippingPlanes.far);
        };
        //#endregion
        /**
         * Initialize the view settings that are controllable by the user
         */
        CameraControls.prototype.initializeControls = function () {
            var scope = this;
            this._cameraSettings = new CameraSettings(this._viewer.camera, this.fitView.bind(this), this.addCameraHelper.bind(this), this.boundClippingPlanes.bind(this));
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
            // Fit View
            var controlFitView = cameraOptions.add(this._cameraSettings, 'fitView').name('Fit View');
            // CameraHelper
            var controlCameraHelper = cameraOptions.add(this._cameraSettings, 'addCameraHelper').name('Camera Helper');
            // Standard Views
            var viewOptions = {
                Front: Camera_3.StandardView.Front,
                Back: Camera_3.StandardView.Back,
                Top: Camera_3.StandardView.Top,
                Isometric: Camera_3.StandardView.Isometric,
                Left: Camera_3.StandardView.Left,
                Right: Camera_3.StandardView.Right,
                Bottom: Camera_3.StandardView.Bottom
            };
            var controlStandardViews = cameraOptions.add(this._cameraSettings, 'standardView', viewOptions).name('Standard View').listen();
            controlStandardViews.onChange(function (viewSetting) {
                var view = parseInt(viewSetting, 10);
                scope._viewer.setCameraToStandardView(view);
            });
            // Field of View
            var minimum = 25;
            var maximum = 75;
            var stepSize = 1;
            var controlFieldOfView = cameraOptions.add(this._cameraSettings, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();
            ;
            controlFieldOfView.onChange(function (value) {
                scope._viewer.camera.fov = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Near Clipping Plane
            minimum = 0.1;
            maximum = 100;
            stepSize = 0.1;
            this._controlNearClippingPlane = cameraOptions.add(this._cameraSettings, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            this._controlNearClippingPlane.onChange(function (value) {
                scope._viewer.camera.near = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Far Clipping Plane
            minimum = 1;
            maximum = 10000;
            stepSize = 0.1;
            this._controlFarClippingPlane = cameraOptions.add(this._cameraSettings, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
            this._controlFarClippingPlane.onChange(function (value) {
                scope._viewer.camera.far = value;
                scope._viewer.camera.updateProjectionMatrix();
            }.bind(this));
            // Bound Clipping Planes
            var controlBoundClippingPlanes = cameraOptions.add(this._cameraSettings, 'boundClippingPlanes').name('Bound Clipping Planes');
            cameraOptions.open();
        };
        /**
         * Synchronize the UI camera settings with the target camera.
         * @param camera
         */
        CameraControls.prototype.synchronizeCameraSettings = function (view) {
            if (view)
                this._cameraSettings.standardView = view;
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
 * https://github.com/gtsop/threejs-trackball-controls
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
define("Viewer/Viewer", ["require", "exports", "three", "Viewer/Camera", "Viewer/CameraControls", "System/EventManager", "Viewer/Graphics", "System/Services", "Viewer/TrackballControls"], function (require, exports, THREE, Camera_4, CameraControls_1, EventManager_1, Graphics_4, Services_6, TrackballControls_1) {
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
            this._logger = Services_6.Services.consoleLogger;
            this._canvas = Graphics_4.Graphics.initializeCanvas(modelCanvasId);
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
        Object.defineProperty(Viewer.prototype, "scene", {
            /**
             * Gets the Viewer scene.
             */
            get: function () {
                return this._scene;
            },
            /**
             * Sets the Viewer scene.
             */
            set: function (value) {
                this._scene = value;
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
                this.camera.name = this.name;
                this.initializeInputControls();
                if (this._cameraControls)
                    this._cameraControls.synchronizeCameraSettings();
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
            Graphics_4.Graphics.removeObjectChildren(this._root, false);
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
            var mesh = Graphics_4.Graphics.createSphereMesh(new THREE.Vector3(), 2);
            mesh.visible = false;
            this._root.add(mesh);
        };
        /**
         * Initialize Scene
         */
        Viewer.prototype.initializeScene = function () {
            this.scene = new THREE.Scene();
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
            this.camera = Camera_4.Camera.getStandardViewCamera(Camera_4.StandardView.Front, this.aspectRatio, this.model);
        };
        /**
         * Adds lighting to the scene
         */
        Viewer.prototype.initializeLighting = function () {
            var ambientLight = new THREE.AmbientLight(0x404040);
            this.scene.add(ambientLight);
            var directionalLight1 = new THREE.DirectionalLight(0xC0C090);
            directionalLight1.position.set(-100, -50, 100);
            this.scene.add(directionalLight1);
            var directionalLight2 = new THREE.DirectionalLight(0xC0C090);
            directionalLight2.position.set(100, 50, -100);
            this.scene.add(directionalLight2);
        };
        /**
         * Sets up the user input controls (Trackball)
         */
        Viewer.prototype.initializeInputControls = function () {
            this._controls = new TrackballControls_1.TrackballControls(this.camera, this._renderer.domElement);
            // N.B. https://stackoverflow.com/questions/10325095/threejs-camera-lookat-has-no-effect-is-there-something-im-doing-wrong
            this._controls.position0.copy(this.camera.position);
            var boundingBox = Graphics_4.Graphics.getBoundingBoxFromObject(this._root);
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
                        _this.camera = Camera_4.Camera.getStandardViewCamera(Camera_4.StandardView.Front, _this.aspectRatio, _this.model);
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
            Graphics_4.Graphics.removeObjectChildren(this._root, false);
        };
        /**
         * Creates the root object in the scene
         */
        Viewer.prototype.createRoot = function () {
            this._root = new THREE.Object3D();
            this._root.name = Graphics_4.ObjectNames.Root;
            this.scene.add(this._root);
        };
        //#endregion
        //#region Camera
        /**
         * @description Sets the view camera properties to the given settings.
         * @param {StandardView} view Camera settings to apply.
         */
        Viewer.prototype.setCameraToStandardView = function (view) {
            var standardViewCamera = Camera_4.Camera.getStandardViewCamera(view, this.aspectRatio, this.model);
            this.camera = standardViewCamera;
            this._cameraControls.synchronizeCameraSettings(view);
        };
        /**
         * @description Fits the active view.
         */
        Viewer.prototype.fitView = function () {
            this.camera = Camera_4.Camera.getFitViewCamera(Camera_4.Camera.getSceneCamera(this.camera, this.aspectRatio), this.model);
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
            this._renderer.render(this.scene, this.camera);
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
define("ModelLoaders/TestModelLoader", ["require", "exports", "three", "Viewer/Graphics"], function (require, exports, THREE, Graphics_5) {
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
            var mesh = Graphics_5.Graphics.createSphereMesh(new THREE.Vector3, radius, new THREE.MeshPhongMaterial({ color: testModelColor }));
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
            var mesh = Graphics_5.Graphics.createBoxMesh(new THREE.Vector3, width, height, depth, new THREE.MeshPhongMaterial({ color: testModelColor }));
            viewer.setModel(mesh);
        };
        /**
         * Add a sloped plane to a scene.
         * @param viewer Instance of the Viewer to display the model.
         */
        TestModelLoader.prototype.loadSlopedPlaneModel = function (viewer) {
            var width = 2;
            var height = 2;
            var mesh = Graphics_5.Graphics.createPlaneMesh(new THREE.Vector3, width, height, new THREE.MeshPhongMaterial({ color: testModelColor }));
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
                    var cell = Graphics_5.Graphics.createBoxMesh(cellOrigin, cellBase, cellBase, cellHeight, cellMaterial);
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
define("Viewer/MeshViewer", ["require", "exports", "three", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, DepthBuffer_2, Graphics_6, Services_7, Viewer_1) {
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
            _this._logger = Services_7.Services.htmlLogger;
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
            var mesh = Graphics_6.Graphics.createPlaneMesh(new THREE.Vector3(), height, width, new THREE.MeshPhongMaterial(DepthBuffer_2.DepthBuffer.DefaultMeshPhongMaterialParameters));
            mesh.rotateX(-Math.PI / 2);
            this._root.add(mesh);
        };
        /**
         * Adds lighting to the scene.
         */
        MeshViewer.prototype.initializeLighting = function () {
            var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            this.scene.add(ambientLight);
            var directionalLight1 = new THREE.DirectionalLight(0xffffff);
            directionalLight1.position.set(4, 4, 4);
            this.scene.add(directionalLight1);
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
define("Viewer/ModelViewer", ["require", "exports", "three", "DepthBuffer/DepthBufferFactory", "System/EventManager", "Viewer/ModelViewerControls", "Viewer/Viewer"], function (require, exports, THREE, DepthBufferFactory_2, EventManager_2, ModelViewerControls_1, Viewer_2) {
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
            // dispatch NewModel event
            this._eventManager.dispatchEvent(this, EventManager_2.EventType.NewModel, value);
        };
        //#endregion
        //#region Initialization    
        /**
         * Populate scene.
         */
        ModelViewer.prototype.populateScene = function () {
            _super.prototype.populateScene.call(this);
            var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
            helper.name = ObjectNames.Grid;
            this.scene.add(helper);
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
            var gridGeometry = this.scene.getObjectByName(ObjectNames.Grid);
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
            var factory = new DepthBufferFactory_2.DepthBufferFactory({ width: width, height: height, model: this.model, camera: this.camera, addCanvasToDOM: false });
            var previewMesh = factory.meshGenerate({});
            this._eventManager.dispatchEvent(this, EventManager_2.EventType.MeshGenerate, previewMesh);
            // Services.consoleLogger.addInfoMessage('Relief generated');
        };
        return ModelViewer;
    }(Viewer_2.Viewer));
    exports.ModelViewer = ModelViewer;
});
define("ModelRelief", ["require", "exports", "Viewer/Camera", "System/EventManager", "ModelLoaders/Loader", "Viewer/MeshViewer", "Viewer/ModelViewer", "System/Services"], function (require, exports, Camera_5, EventManager_3, Loader_1, MeshViewer_1, ModelViewer_1, Services_8) {
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
            this._initialMeshGeneration = true;
        }
        //#region Event Handlers
        /**
         * Event handler for mesh generation.
         * @param event Mesh generation event.
         * @params mesh Newly-generated mesh.
         */
        ModelRelief.prototype.onMeshGenerate = function (event, mesh) {
            this._meshViewer.setModel(mesh);
            if (this._initialMeshGeneration) {
                this._meshViewer.fitView();
                this._initialMeshGeneration = false;
            }
        };
        /**
         * Event handler for new model.
         * @param event NewModel event.
         * @param model Newly loaded model.
         */
        ModelRelief.prototype.onNewModel = function (event, model) {
            this._modelViewer.setCameraToStandardView(Camera_5.StandardView.Front);
            this._meshViewer.setCameraToStandardView(Camera_5.StandardView.Top);
        };
        //#endregion
        /**
         * Launch the model Viewer.
         */
        ModelRelief.prototype.run = function () {
            Services_8.Services.consoleLogger.addInfoMessage('ModelRelief started');
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
define("Workbench/CameraTest", ["require", "exports", "three", "dat-gui", "Viewer/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, dat, Graphics_7, Services_9, Viewer_3) {
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
            var triad = Graphics_7.Graphics.createWorldAxesTriad(new THREE.Vector3(), 1, 0.25, 0.25);
            this._scene.add(triad);
            var box = Graphics_7.Graphics.createBoxMesh(new THREE.Vector3(4, 6, -2), 1, 2, 2, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
            box.rotation.set(Math.random(), Math.random(), Math.random());
            box.updateMatrixWorld(true);
            this.model.add(box);
            var sphere = Graphics_7.Graphics.createSphereMesh(new THREE.Vector3(-3, 10, -1), 1, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
            this.model.add(sphere);
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
            var boundingBoxView = Graphics_7.Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);
            // The bounding box is world-axis aligned. 
            // INv View coordinates, the camera is at the origin.
            // The bounding near plane is the maximum Z of the bounding box.
            // The bounding far plane is the minimum Z of the bounding box.
            var nearPlane = -boundingBoxView.max.z;
            var farPlane = -boundingBoxView.min.z;
            this._viewer._cameraControls._cameraSettings.nearClippingPlane = nearPlane;
            this._viewer._cameraControls._cameraSettings.farClippingPlane = farPlane;
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
            var boundingBoxMesh = Graphics_7.Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);
            return boundingBoxMesh;
        };
        /**
         * Show the clipping planes of the model in View and World coordinates.
         */
        App.prototype.showBoundingBoxes = function () {
            var model = this._viewer.model;
            var cameraMatrixWorld = this._viewer.camera.matrixWorld;
            var cameraMatrixWorldInverse = this._viewer.camera.matrixWorldInverse;
            // remove existing BoundingBoxes and model clone (View coordinates)
            Graphics_7.Graphics.removeAllByName(this._viewer._scene, Graphics_7.ObjectNames.BoundingBox);
            Graphics_7.Graphics.removeAllByName(this._viewer._scene, Graphics_7.ObjectNames.ModelClone);
            // clone model (and geometry!)
            var modelView = Graphics_7.Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
            modelView.name = Graphics_7.ObjectNames.ModelClone;
            model.add(modelView);
            var boundingBoxView = this.createBoundingBox(modelView, 0xff00ff);
            model.add(boundingBoxView);
            // transform bounding box back from View to World
            var boundingBoxWorld = Graphics_7.Graphics.cloneAndTransformObject(boundingBoxView, cameraMatrixWorld);
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
            var folderOptions = gui.addFolder('CameraTest Options');
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
            this._logger = Services_9.Services.consoleLogger;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvU3lzdGVtL0xvZ2dlci50cyIsIlNjcmlwdHMvU3lzdGVtL1N0b3BXYXRjaC50cyIsIlNjcmlwdHMvU3lzdGVtL1NlcnZpY2VzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvR3JhcGhpY3MudHMiLCJTY3JpcHRzL1N5c3RlbS9NYXRoLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlci50cyIsIlNjcmlwdHMvU3lzdGVtL1Rvb2xzLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlckZhY3RvcnkudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmEudHMiLCJTY3JpcHRzL1N5c3RlbS9FdmVudE1hbmFnZXIudHMiLCJTY3JpcHRzL01vZGVsTG9hZGVycy9PQkpMb2FkZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmFDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL01hdGVyaWFscy50cyIsIlNjcmlwdHMvVmlld2VyL1RyYWNrYmFsbENvbnRyb2xzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvVmlld2VyLnRzIiwiU2NyaXB0cy9Nb2RlbExvYWRlcnMvVGVzdE1vZGVsTG9hZGVyLnRzIiwiU2NyaXB0cy9Nb2RlbExvYWRlcnMvTG9hZGVyLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTWVzaFZpZXdlci50cyIsIlNjcmlwdHMvVmlld2VyL01vZGVsVmlld2VyQ29udHJvbHMudHMiLCJTY3JpcHRzL1ZpZXdlci9Nb2RlbFZpZXdlci50cyIsIlNjcmlwdHMvTW9kZWxSZWxpZWYudHMiLCJTY3JpcHRzL1VuaXRUZXN0cy9Vbml0VGVzdHMudHMiLCJTY3JpcHRzL1dvcmtiZW5jaC9DYW1lcmFUZXN0LnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvRGVwdGhCdWZmZXJUZXN0LnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvSW5oZXJpdGFuY2VUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsOEVBQThFO0lBQzlFLDZF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LE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVqQixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlELFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUV0QixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDTCxzQkFBQztJQUFELENBckJBLEFBcUJDLElBQUE7SUFyQlksMENBQWU7SUF1QjVCLElBQUksV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDO0lBQ3RDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJ3d3dyb290L2pzL21vZGVscmVsaWVmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogTG9nZ2luZyBJbnRlcmZhY2VcclxuICogRGlhZ25vc3RpYyBsb2dnaW5nXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIExvZ2dlciB7XHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZyk7XHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpO1xyXG4gICAgYWRkSW5mb01lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nKTtcclxuICAgIGFkZE1lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpO1xyXG5cclxuICAgIGFkZEVtcHR5TGluZSAoKTtcclxuXHJcbiAgICBjbGVhckxvZygpO1xyXG59XHJcbiAgICAgICAgIFxyXG5lbnVtIE1lc3NhZ2VDbGFzcyB7XHJcbiAgICBFcnJvciAgID0gJ2xvZ0Vycm9yJyxcclxuICAgIFdhcm5pbmcgPSAnbG9nV2FybmluZycsXHJcbiAgICBJbmZvICAgID0gJ2xvZ0luZm8nLFxyXG4gICAgTm9uZSAgICA9ICdsb2dOb25lJ1xyXG59XHJcblxyXG4vKipcclxuICogQ29uc29sZSBsb2dnaW5nXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbnNvbGVMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXJ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSBnZW5lcmFsIG1lc3NhZ2UgYW5kIGFkZCB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VDbGFzcyBNZXNzYWdlIGNsYXNzLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlRW50cnkgKG1lc3NhZ2UgOiBzdHJpbmcsIG1lc3NhZ2VDbGFzcyA6IE1lc3NhZ2VDbGFzcykgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJlZml4ID0gJ01SOiAnO1xyXG4gICAgICAgIGxldCBsb2dNZXNzYWdlID0gYCR7cHJlZml4fSR7bWVzc2FnZX1gO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VDbGFzcykge1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuRXJyb3I6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5XYXJuaW5nOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5JbmZvOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5Ob25lOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobG9nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIGVycm9yTWVzc2FnZSBFcnJvciBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEVycm9yTWVzc2FnZSAoZXJyb3JNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KGVycm9yTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHdhcm5pbmcgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIHdhcm5pbmdNZXNzYWdlIFdhcm5pbmcgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkod2FybmluZ01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5XYXJuaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBpbmZvTWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeShpbmZvTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIHN0eWxlIE9wdGlvbmFsIHN0eWxlLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlIChtZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkobWVzc2FnZSwgTWVzc2FnZUNsYXNzLk5vbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBlbXB0eSBsaW5lXHJcbiAgICAgKi9cclxuICAgIGFkZEVtcHR5TGluZSAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBsb2cgb3V0cHV0XHJcbiAgICAgKi9cclxuICAgIGNsZWFyTG9nICgpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5jbGVhcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEhUTUwgbG9nZ2luZ1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBIVE1MTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2Vye1xyXG5cclxuICAgIHJvb3RJZCAgICAgICAgICAgOiBzdHJpbmc7XHJcbiAgICByb290RWxlbWVudFRhZyAgIDogc3RyaW5nO1xyXG4gICAgcm9vdEVsZW1lbnQgICAgICA6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIG1lc3NhZ2VUYWcgICAgICAgOiBzdHJpbmc7XHJcbiAgICBiYXNlTWVzc2FnZUNsYXNzIDogc3RyaW5nXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yb290SWQgICAgICAgICA9ICdsb2dnZXJSb290J1xyXG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnRUYWcgPSAndWwnO1xyXG5cclxuICAgICAgICB0aGlzLm1lc3NhZ2VUYWcgICAgICAgPSAnbGknO1xyXG4gICAgICAgIHRoaXMuYmFzZU1lc3NhZ2VDbGFzcyA9ICdsb2dNZXNzYWdlJztcclxuXHJcbiAgICAgICAgdGhpcy5yb290RWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7dGhpcy5yb290SWR9YCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3RFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnJvb3RFbGVtZW50VGFnKTtcclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudC5pZCA9IHRoaXMucm9vdElkO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0IGEgZ2VuZXJhbCBtZXNzYWdlIGFuZCBhcHBlbmQgdG8gdGhlIGxvZyByb290LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VDbGFzcyBDU1MgY2xhc3MgdG8gYmUgYWRkZWQgdG8gbWVzc2FnZS5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZUVsZW1lbnQgKG1lc3NhZ2UgOiBzdHJpbmcsIG1lc3NhZ2VDbGFzcz8gOiBzdHJpbmcpIDogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBtZXNzYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5tZXNzYWdlVGFnKTtcclxuICAgICAgICBtZXNzYWdlRWxlbWVudC50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VFbGVtZW50LmNsYXNzTmFtZSAgID0gYCR7dGhpcy5iYXNlTWVzc2FnZUNsYXNzfSAke21lc3NhZ2VDbGFzcyA/IG1lc3NhZ2VDbGFzcyA6ICcnfWA7O1xyXG5cclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2VFbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2UgRXJyb3IgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KGVycm9yTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHdhcm5pbmcgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIHdhcm5pbmdNZXNzYWdlIFdhcm5pbmcgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRWxlbWVudCh3YXJuaW5nTWVzc2FnZSwgTWVzc2FnZUNsYXNzLldhcm5pbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGluZm9ybWF0aW9uYWwgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIGluZm9NZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkSW5mb01lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQoaW5mb01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5JbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBzdHlsZSBPcHRpb25hbCBDU1Mgc3R5bGUuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2UgKG1lc3NhZ2UgOiBzdHJpbmcsIHN0eWxlPyA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZUVsZW1lbnQgPSB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KG1lc3NhZ2UpO1xyXG4gICAgICAgIGlmIChzdHlsZSlcclxuICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBlbXB0eSBsaW5lXHJcbiAgICAgKi9cclxuICAgIGFkZEVtcHR5TGluZSAoKSB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxNDA1NDcvbGluZS1icmVhay1pbnNpZGUtYS1saXN0LWl0ZW0tZ2VuZXJhdGVzLXNwYWNlLWJldHdlZW4tdGhlLWxpbmVzXHJcbi8vICAgICAgdGhpcy5hZGRNZXNzYWdlKCc8YnIvPjxici8+Jyk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2UoJy4nKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBsb2cgb3V0cHV0XHJcbiAgICAgKi9cclxuICAgIGNsZWFyTG9nICgpIHtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzk1NTIyOS9yZW1vdmUtYWxsLWNoaWxkLWVsZW1lbnRzLW9mLWEtZG9tLW5vZGUtaW4tamF2YXNjcmlwdFxyXG4gICAgICAgIHdoaWxlICh0aGlzLnJvb3RFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnJvb3RFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7TG9nZ2VyfSAgICAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBUaW1lciByZWNvcmQuXHJcbiAqIEBpbnRlcmZhY2UgVGltZXJFbnRyeVxyXG4gKi9cclxuaW50ZXJmYWNlIFRpbWVyRW50cnkge1xyXG5cclxuICAgIHN0YXJ0VGltZSA6IG51bWJlcjtcclxuICAgIGluZGVudCAgICA6IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFN0b3BXYXRjaFxyXG4gKiBHZW5lcmFsIGRlYnVnZ2VyIHRpbWVyLlxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTdG9wV2F0Y2gge1xyXG4gICAgXHJcbiAgICBzdGF0aWMgcHJlY2lzaW9uIDogbnVtYmVyID0gMztcclxuXHJcbiAgICBfbG9nZ2VyICAgICAgICAgICAgOiBMb2dnZXI7XHJcbiAgICBfbmFtZSAgICAgICAgICAgICAgOiBzdHJpbmc7XHJcblxyXG4gICAgX2V2ZW50cyAgICAgICAgICAgIDogYW55O1xyXG4gICAgX2Jhc2VsaW5lVGltZSAgICAgIDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVyTmFtZSBUaW1lciBpZGVudGlmaWVyXHJcbiAgICAgKiBAcGFyYW0ge0xvZ2dlcn0gbG9nZ2VyIExvZ2dlclxyXG4gICAgICogTi5CLiBMb2dnZXIgaXMgcGFzc2VkIGFzIGEgY29uc3RydWN0b3IgcGFyYW1ldGVyIGJlY2F1c2UgU3RvcFdhdGNoIGFuZCBTZXJ2aWNlLmNvbnNvbGVMb2dnZXIgYXJlIHN0YXRpYyBTZXJ2aWNlIHByb3BlcnRpZXMuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRpbWVyTmFtZSA6IHN0cmluZywgbG9nZ2VyIDogTG9nZ2VyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcclxuICAgICAgICB0aGlzLl9uYW1lICAgPSB0aW1lck5hbWU7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzICA9IHt9XHJcbiAgICAgICAgdGhpcy5fYmFzZWxpbmVUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIHRoZSBtdW1iZXIgb2YgcGVuZGluZyBldmVudHMuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBldmVudENvdW50ICgpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50cykubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIGN1cnJlbnQgaW5kZW50IGxldmVsLlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgaW5kZW50UHJlZml4KCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCBpbmRlbnQ6IHN0cmluZyA9ICcgICAgJztcclxuICAgICAgICByZXR1cm4gaW5kZW50LnJlcGVhdCh0aGlzLmV2ZW50Q291bnQpO1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVzZXRzIHRoZSB0aW1lci5cclxuICAgICAqL1xyXG4gICAgbWFyayhldmVudCA6IHN0cmluZykgOiBzdHJpbmcge1xyXG5cclxuICAgICAgICBsZXQgc3RhcnRNaWxsaXNlY29uZHMgOiBudW1iZXIgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIGxldCBpbmRlbnRQcmVmaXggICAgICA6IHN0cmluZyA9IHRoaXMuaW5kZW50UHJlZml4O1xyXG4gICAgICAgIGxldCB0aW1lckVudHJ5ICAgICAgICA6IFRpbWVyRW50cnkgPSB7IHN0YXJ0VGltZTogc3RhcnRNaWxsaXNlY29uZHMsIGluZGVudCA6IGluZGVudFByZWZpeH07XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IHRpbWVyRW50cnk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGAke2luZGVudFByZWZpeH0ke2V2ZW50fWApO1xyXG5cclxuICAgICAgICByZXR1cm4gZXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyB0aGUgZWxhcHN0ZWQgdGltZS5cclxuICAgICAqL1xyXG4gICAgbG9nRWxhcHNlZFRpbWUoZXZlbnQgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyRWxhcHNlZFRpbWUgICA6IG51bWJlciA9IERhdGUubm93KCk7XHJcbiAgICAgICAgbGV0IGV2ZW50RWxhcHNlZFRpbWUgICA6IG51bWJlciA9ICh0aW1lckVsYXBzZWRUaW1lIC0gKDxudW1iZXI+ICh0aGlzLl9ldmVudHNbZXZlbnRdLnN0YXJ0VGltZSkpKSAvIDEwMDA7XHJcbiAgICAgICAgbGV0IGVsYXBzZWRUaW1lTWVzc2FnZSA6IHN0cmluZyA9IGV2ZW50RWxhcHNlZFRpbWUudG9GaXhlZChTdG9wV2F0Y2gucHJlY2lzaW9uKTtcclxuICAgICAgICBsZXQgaW5kZW50UHJlZml4ICAgICAgIDogc3RyaW5nID0gdGhpcy5fZXZlbnRzW2V2ZW50XS5pbmRlbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgJHtpbmRlbnRQcmVmaXh9JHtldmVudH0gOiAke2VsYXBzZWRUaW1lTWVzc2FnZX0gc2VjYCk7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBldmVudCBmcm9tIGxvZ1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnRdO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXIsIEhUTUxMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7U3RvcFdhdGNofSAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnU3RvcFdhdGNoJ1xyXG4vKipcclxuICogU2VydmljZXNcclxuICogR2VuZXJhbCBydW50aW1lIHN1cHBvcnRcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZXMge1xyXG5cclxuICAgIHN0YXRpYyBjb25zb2xlTG9nZ2VyIDogQ29uc29sZUxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKCk7XHJcbiAgICBzdGF0aWMgaHRtbExvZ2dlciAgICA6IEhUTUxMb2dnZXIgICAgPSBuZXcgSFRNTExvZ2dlcigpO1xyXG4gICAgc3RhdGljIHRpbWVyICAgICAgICAgOiBTdG9wV2F0Y2ggICAgID0gbmV3IFN0b3BXYXRjaCgnTWFzdGVyJywgU2VydmljZXMuY29uc29sZUxvZ2dlcik7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01vZGVsUmVsaWVmfSAgICAgICAgICAgIGZyb20gJ01vZGVsUmVsaWVmJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuZXhwb3J0IGVudW0gT2JqZWN0TmFtZXMge1xyXG5cclxuICAgIFJvb3QgICAgICAgICAgPSAgJ1Jvb3QnLFxyXG5cclxuICAgIEJvdW5kaW5nQm94ICAgPSAnQm91bmRpbmcgQm94JyxcclxuICAgIEJveCAgICAgICAgICAgPSAnQm94JyxcclxuICAgIENhbWVyYUhlbHBlciAgPSAnQ2FtZXJhSGVscGVyJyxcclxuICAgIE1vZGVsQ2xvbmUgICAgPSAnTW9kZWwgQ2xvbmUnLFxyXG4gICAgUGxhbmUgICAgICAgICA9ICdQbGFuZScsXHJcbiAgICBTcGhlcmUgICAgICAgID0gJ1NwaGVyZScsXHJcbiAgICBUcmlhZCAgICAgICAgID0gJ1RyaWFkJ1xyXG59XHJcblxyXG4vKipcclxuICogIEdlbmVyYWwgVEhSRUUuanMvV2ViR0wgc3VwcG9ydCByb3V0aW5lc1xyXG4gKiAgR3JhcGhpY3MgTGlicmFyeVxyXG4gKiAgQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR3JhcGhpY3Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEdlb21ldHJ5XHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdEdlb21ldHJ5XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogQGRlc2NyaXB0aW9uIERpc3Bvc2Ugb2YgcmVzb3VyY2VzIGhlbGQgYnkgYSBncmFwaGljYWwgb2JqZWN0LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHthbnl9IG9iamVjdDNkIE9iamVjdCB0byBwcm9jZXNzLlxyXG4gICAgICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgzNTc1MjkvdGhyZWVqcy1yZW1vdmUtb2JqZWN0LWZyb20tc2NlbmVcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRpc3Bvc2VSZXNvdXJjZXMob2JqZWN0M2QpIDogdm9pZCB7XHJcbiBcclxuICAgICAgICAvLyBsb2dnZXIuYWRkSW5mb01lc3NhZ2UgKCdSZW1vdmluZzogJyArIG9iamVjdDNkLm5hbWUpO1xyXG4gICAgICAgIGlmIChvYmplY3QzZC5oYXNPd25Qcm9wZXJ0eSgnZ2VvbWV0cnknKSkge1xyXG4gICAgICAgICAgICBvYmplY3QzZC5nZW9tZXRyeS5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ21hdGVyaWFsJykpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IG9iamVjdDNkLm1hdGVyaWFsO1xyXG4gICAgICAgICAgICBpZiAobWF0ZXJpYWwuaGFzT3duUHJvcGVydHkoJ21hdGVyaWFscycpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFscyA9IG1hdGVyaWFsLm1hdGVyaWFscztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlNYXRlcmlhbCBpbiBtYXRlcmlhbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWxzLmhhc093blByb3BlcnR5KGlNYXRlcmlhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxzW2lNYXRlcmlhbF0uZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCd0ZXh0dXJlJykpIHtcclxuICAgICAgICAgICAgb2JqZWN0M2QudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbiBvYmplY3QgYW5kIGFsbCBjaGlsZHJlbiBmcm9tIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgaG9sZGluZyBvYmplY3QgdG8gYmUgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSByb290T2JqZWN0IFBhcmVudCBvYmplY3QgKHBvc3NpYmx5IHdpdGggY2hpbGRyZW4pLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVtb3ZlT2JqZWN0Q2hpbGRyZW4ocm9vdE9iamVjdCA6IFRIUkVFLk9iamVjdDNELCByZW1vdmVSb290IDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBpZiAoIXJvb3RPYmplY3QpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGxvZ2dlciAgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIGxldCByZW1vdmVyID0gZnVuY3Rpb24gKG9iamVjdDNkKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QgPT09IHJvb3RPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBHcmFwaGljcy5kaXNwb3NlUmVzb3VyY2VzKG9iamVjdDNkKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByb290T2JqZWN0LnRyYXZlcnNlKHJlbW92ZXIpO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgcm9vdCBjaGlsZHJlbiBmcm9tIHJvb3RPYmplY3QgKGJhY2t3YXJkcyEpXHJcbiAgICAgICAgZm9yIChsZXQgaUNoaWxkIDogbnVtYmVyID0gKHJvb3RPYmplY3QuY2hpbGRyZW4ubGVuZ3RoIC0gMSk7IGlDaGlsZCA+PSAwOyBpQ2hpbGQtLSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNoaWxkIDogVEhSRUUuT2JqZWN0M0QgPSByb290T2JqZWN0LmNoaWxkcmVuW2lDaGlsZF07XHJcbiAgICAgICAgICAgIHJvb3RPYmplY3QucmVtb3ZlIChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVtb3ZlUm9vdCAmJiByb290T2JqZWN0LnBhcmVudClcclxuICAgICAgICAgICAgcm9vdE9iamVjdC5wYXJlbnQucmVtb3ZlKHJvb3RPYmplY3QpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhbGwgb2JqZWN0cyBvZiBhIGdpdmVuIG5hbWUgZnJvbSB0aGUgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgdG8gcHJvY2Vzcy5cclxuICAgICAqIEBwYXJhbSBvYmplY3ROYW1lIE9iamVjdCBuYW1lIHRvIGZpbmQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW1vdmVBbGxCeU5hbWUgKHNjZW5lIDogVEhSRUUuU2NlbmUsIG9iamVjdE5hbWUgOiBzdHJpbmcpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBvYmplY3Q6IFRIUkVFLk9iamVjdDNEO1xyXG4gICAgICAgIHdoaWxlIChvYmplY3QgPSBzY2VuZS5nZXRPYmplY3RCeU5hbWUob2JqZWN0TmFtZSkpIHtcclxuXHJcbiAgICAgICAgICAgIEdyYXBoaWNzLmRpc3Bvc2VSZXNvdXJjZXMob2JqZWN0KTtcclxuICAgICAgICAgICAgc2NlbmUucmVtb3ZlKG9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xvbmUgYW5kIHRyYW5zZm9ybSBhbiBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0IE9iamVjdCB0byBjbG9uZSBhbmQgdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIG1hdHJpeCBUcmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjbG9uZUFuZFRyYW5zZm9ybU9iamVjdCAob2JqZWN0IDogVEhSRUUuT2JqZWN0M0QsIG1hdHJpeCA6IFRIUkVFLk1hdHJpeDQpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG5cclxuICAgICAgICBsZXQgbWV0aG9kVGFnIDogc3RyaW5nID0gU2VydmljZXMudGltZXIubWFyaygnY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QnKTtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgb2JqZWN0IChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBjbG9uZVRhZzogc3RyaW5nID0gU2VydmljZXMudGltZXIubWFyaygnY2xvbmUnKTtcclxuICAgICAgICBsZXQgb2JqZWN0Q2xvbmUgOiBUSFJFRS5PYmplY3QzRCA9IG9iamVjdC5jbG9uZSgpO1xyXG4gICAgICAgIG9iamVjdENsb25lLnRyYXZlcnNlKG9iamVjdCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZihUSFJFRS5NZXNoKSlcclxuICAgICAgICAgICAgICAgIG9iamVjdC5nZW9tZXRyeSA9IG9iamVjdC5nZW9tZXRyeS5jbG9uZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKGNsb25lVGFnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBOLkIuIEltcG9ydGFudCEgVGhlIHBvc3Rpb24sIHJvdGF0aW9uIChxdWF0ZXJuaW9uKSBhbmQgc2NhbGUgYXJlIGNvcnJlY3QgYnV0IHRoZSBtYXRyaXggaGFzIG5vdCBiZWVuIHVwZGF0ZWQuXHJcbiAgICAgICAgLy8gVEhSRUUuanMgdXBkYXRlcyB0aGUgbWF0cml4IGluIHRoZSByZW5kZXIoKSBsb29wLlxyXG4gICAgICAgIGxldCB0cmFuc2Zvcm1UYWc6IHN0cmluZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ3RyYW5zZm9ybScpO1xyXG4gICAgICAgIG9iamVjdENsb25lLnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpOyAgICAgXHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybVxyXG4gICAgICAgIG9iamVjdENsb25lLmFwcGx5TWF0cml4KG1hdHJpeCk7XHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUodHJhbnNmb3JtVGFnKTtcclxuICAgICAgICBcclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZShtZXRob2RUYWcpO1xyXG4gICAgICAgIHJldHVybiBvYmplY3RDbG9uZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgYm91bmRpbmcgYm94IG9mIGEgdHJhbnNmb3JtZWQgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIG9iamVjdCBPYmplY3QgdG8gdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIG1hdHJpeCBUcmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94KG9iamVjdDogVEhSRUUuT2JqZWN0M0QsIG1hdHJpeDogVEhSRUUuTWF0cml4NCk6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICBsZXQgbWV0aG9kVGFnOiBzdHJpbmcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdnZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94Jyk7XHJcblxyXG4gICAgICAgIG9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTtcclxuICAgICAgICBvYmplY3QuYXBwbHlNYXRyaXgobWF0cml4KTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3g6IFRIUkVFLkJveDMgPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3Qob2JqZWN0KTtcclxuXHJcbiAgICAgICAgLy8gcmVzdG9yZSBvYmplY3RcclxuICAgICAgICBsZXQgbWF0cml4SWRlbnRpdHkgPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG4gICAgICAgIGxldCBtYXRyaXhJbnZlcnNlID0gbWF0cml4SWRlbnRpdHkuZ2V0SW52ZXJzZShtYXRyaXgsIHRydWUpO1xyXG4gICAgICAgIG9iamVjdC5hcHBseU1hdHJpeChtYXRyaXhJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUobWV0aG9kVGFnKTtcclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHBhcmFtIG1lc2ggTWVzaCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3VuZGluZyBib3guXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwgb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEAgcmV0dXJucyBNZXNoIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tR2VvbWV0cnkocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBnZW9tZXRyeSA6IFRIUkVFLkdlb21ldHJ5LCBtYXRlcmlhbCA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2h7XHJcblxyXG4gICAgICAgIHZhciBib3VuZGluZ0JveCAgICAgOiBUSFJFRS5Cb3gzLFxyXG4gICAgICAgICAgICB3aWR0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGVwdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBib3hNZXNoICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGdlb21ldHJ5LmJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3ggKHBvc2l0aW9uLCBib3VuZGluZ0JveCwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94TWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiBib3guXHJcbiAgICAgKiBAcGFyYW0gYm94IEdlb21ldHJ5IEJveCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbCBvZiB0aGUgYm94LlxyXG4gICAgICogQCByZXR1cm5zIE1lc2ggb2YgdGhlIGJveC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGJvdW5kaW5nQm94IDogVEhSRUUuQm94MywgbWF0ZXJpYWwgOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBkZXB0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGJveE1lc2ggICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIHdpZHRoICA9IGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLng7XHJcbiAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdCb3gubWF4LnkgLSBib3VuZGluZ0JveC5taW4ueTtcclxuICAgICAgICBkZXB0aCAgPSBib3VuZGluZ0JveC5tYXgueiAtIGJvdW5kaW5nQm94Lm1pbi56O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3hNZXNoIChwb3NpdGlvbiwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG1hdGVyaWFsKTtcclxuICAgICAgICBib3hNZXNoLm5hbWUgPSBPYmplY3ROYW1lcy5Cb3VuZGluZ0JveDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJveE1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBleHRlbmRzIG9mIGFuIG9iamVjdCBvcHRpb25hbGx5IGluY2x1ZGluZyBhbGwgY2hpbGRyZW4uXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRCb3VuZGluZ0JveEZyb21PYmplY3Qocm9vdE9iamVjdCA6IFRIUkVFLk9iamVjdDNEKSA6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICBsZXQgdGltZXJUYWcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKGAke3Jvb3RPYmplY3QubmFtZX06IEJvdW5kaW5nQm94YCk7ICAgICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTQ5Mjg1Ny9hbnktd2F5LXRvLWdldC1hLWJvdW5kaW5nLWJveC1mcm9tLWEtdGhyZWUtanMtb2JqZWN0M2RcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzID0gbmV3IFRIUkVFLkJveDMoKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGJvdW5kaW5nQm94LnNldEZyb21PYmplY3Qocm9vdE9iamVjdCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTtcclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICAgICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgYm94IG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgdGhlIGJveC5cclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIGRlcHRoIERlcHRoLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE9wdGlvbmFsIG1hdGVyaWFsLlxyXG4gICAgICogQHJldHVybnMgQm94IG1lc2guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3hNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgd2lkdGggOiBudW1iZXIsIGhlaWdodCA6IG51bWJlciwgZGVwdGggOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICB2YXIgXHJcbiAgICAgICAgICAgIGJveEdlb21ldHJ5ICA6IFRIUkVFLkJveEdlb21ldHJ5LFxyXG4gICAgICAgICAgICBib3hNYXRlcmlhbCAgOiBUSFJFRS5NYXRlcmlhbCxcclxuICAgICAgICAgICAgYm94ICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgYm94R2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2lkdGgsIGhlaWdodCwgZGVwdGgpO1xyXG4gICAgICAgIGJveEdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG5cclxuICAgICAgICBib3hNYXRlcmlhbCA9IG1hdGVyaWFsIHx8IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwZmYsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgYm94ID0gbmV3IFRIUkVFLk1lc2goIGJveEdlb21ldHJ5LCBib3hNYXRlcmlhbCk7XHJcbiAgICAgICAgYm94Lm5hbWUgPSBPYmplY3ROYW1lcy5Cb3g7XHJcbiAgICAgICAgYm94LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHBsYW5lIG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgdGhlIHBsYW5lLlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgT3B0aW9uYWwgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBQbGFuZSBtZXNoLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlUGxhbmVNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgd2lkdGggOiBudW1iZXIsIGhlaWdodCA6IG51bWJlciwgbWF0ZXJpYWw/IDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBwbGFuZUdlb21ldHJ5ICA6IFRIUkVFLlBsYW5lR2VvbWV0cnksXHJcbiAgICAgICAgICAgIHBsYW5lTWF0ZXJpYWwgIDogVEhSRUUuTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIHBsYW5lICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgcGxhbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHdpZHRoLCBoZWlnaHQpOyAgICAgICBcclxuICAgICAgICBwbGFuZU1hdGVyaWFsID0gbWF0ZXJpYWwgfHwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDBmZiwgb3BhY2l0eTogMS4wfSApO1xyXG5cclxuICAgICAgICBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBsYW5lTWF0ZXJpYWwpO1xyXG4gICAgICAgIHBsYW5lLm5hbWUgPSBPYmplY3ROYW1lcy5QbGFuZTtcclxuICAgICAgICBwbGFuZS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBsYW5lO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgc3BoZXJlIG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gT3JpZ2luIG9mIHRoZSBzcGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gcmFkaXVzIFJhZGl1cy5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVNwaGVyZU1lc2gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCByYWRpdXMgOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIHZhciBzcGhlcmVHZW9tZXRyeSAgOiBUSFJFRS5TcGhlcmVHZW9tZXRyeSxcclxuICAgICAgICAgICAgc2VnbWVudENvdW50ICAgIDogbnVtYmVyID0gMzIsXHJcbiAgICAgICAgICAgIHNwaGVyZU1hdGVyaWFsICA6IFRIUkVFLk1hdGVyaWFsLFxyXG4gICAgICAgICAgICBzcGhlcmUgICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBzcGhlcmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShyYWRpdXMsIHNlZ21lbnRDb3VudCwgc2VnbWVudENvdW50KTtcclxuICAgICAgICBzcGhlcmVHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgc3BoZXJlTWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgc3BoZXJlID0gbmV3IFRIUkVFLk1lc2goIHNwaGVyZUdlb21ldHJ5LCBzcGhlcmVNYXRlcmlhbCApO1xyXG4gICAgICAgIHNwaGVyZS5uYW1lID0gT2JqZWN0TmFtZXMuU3BoZXJlO1xyXG4gICAgICAgIHNwaGVyZS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNwaGVyZTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgbGluZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gc3RhcnRQb3NpdGlvbiBTdGFydCBwb2ludC5cclxuICAgICAqIEBwYXJhbSBlbmRQb3NpdGlvbiBFbmQgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgQ29sb3IuXHJcbiAgICAgKiBAcmV0dXJucyBMaW5lIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVMaW5lKHN0YXJ0UG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBlbmRQb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGNvbG9yIDogbnVtYmVyKSA6IFRIUkVFLkxpbmUge1xyXG5cclxuICAgICAgICB2YXIgbGluZSAgICAgICAgICAgIDogVEhSRUUuTGluZSxcclxuICAgICAgICAgICAgbGluZUdlb21ldHJ5ICAgIDogVEhSRUUuR2VvbWV0cnksXHJcbiAgICAgICAgICAgIG1hdGVyaWFsICAgICAgICA6IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBsaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgICAgICBsaW5lR2VvbWV0cnkudmVydGljZXMucHVzaCAoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pO1xyXG5cclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogY29sb3J9ICk7XHJcbiAgICAgICAgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGxpbmVHZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBheGVzIHRyaWFkLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIE9yaWdpbiBvZiB0aGUgdHJpYWQuXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIExlbmd0aCBvZiB0aGUgY29vcmRpbmF0ZSBhcnJvdy5cclxuICAgICAqIEBwYXJhbSBoZWFkTGVuZ3RoIExlbmd0aCBvZiB0aGUgYXJyb3cgaGVhZC5cclxuICAgICAqIEBwYXJhbSBoZWFkV2lkdGggV2lkdGggb2YgdGhlIGFycm93IGhlYWQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVXb3JsZEF4ZXNUcmlhZChwb3NpdGlvbj8gOiBUSFJFRS5WZWN0b3IzLCBsZW5ndGg/IDogbnVtYmVyLCBoZWFkTGVuZ3RoPyA6IG51bWJlciwgaGVhZFdpZHRoPyA6IG51bWJlcikgOiBUSFJFRS5PYmplY3QzRCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0cmlhZEdyb3VwICAgICAgOiBUSFJFRS5PYmplY3QzRCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpLFxyXG4gICAgICAgICAgICBhcnJvd1Bvc2l0aW9uICAgOiBUSFJFRS5WZWN0b3IzICA9IHBvc2l0aW9uIHx8bmV3IFRIUkVFLlZlY3RvcjMoKSxcclxuICAgICAgICAgICAgYXJyb3dMZW5ndGggICAgIDogbnVtYmVyID0gbGVuZ3RoICAgICB8fCAxNSxcclxuICAgICAgICAgICAgYXJyb3dIZWFkTGVuZ3RoIDogbnVtYmVyID0gaGVhZExlbmd0aCB8fCAxLFxyXG4gICAgICAgICAgICBhcnJvd0hlYWRXaWR0aCAgOiBudW1iZXIgPSBoZWFkV2lkdGggIHx8IDE7XHJcblxyXG4gICAgICAgIHRyaWFkR3JvdXAuYWRkKG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSwgYXJyb3dQb3NpdGlvbiwgYXJyb3dMZW5ndGgsIDB4ZmYwMDAwLCBhcnJvd0hlYWRMZW5ndGgsIGFycm93SGVhZFdpZHRoKSk7XHJcbiAgICAgICAgdHJpYWRHcm91cC5hZGQobmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApLCBhcnJvd1Bvc2l0aW9uLCBhcnJvd0xlbmd0aCwgMHgwMGZmMDAsIGFycm93SGVhZExlbmd0aCwgYXJyb3dIZWFkV2lkdGgpKTtcclxuICAgICAgICB0cmlhZEdyb3VwLmFkZChuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSksIGFycm93UG9zaXRpb24sIGFycm93TGVuZ3RoLCAweDAwMDBmZiwgYXJyb3dIZWFkTGVuZ3RoLCBhcnJvd0hlYWRXaWR0aCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJpYWRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXhlcyBncmlkLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uICBPcmlnaW4gb2YgdGhlIGF4ZXMgZ3JpZC5cclxuICAgICAqIEBwYXJhbSBzaXplIFNpemUgb2YgdGhlIGdyaWQuXHJcbiAgICAgKiBAcGFyYW0gc3RlcCBHcmlkIGxpbmUgaW50ZXJ2YWxzLlxyXG4gICAgICogQHJldHVybnMgR3JpZCBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVXb3JsZEF4ZXNHcmlkKHBvc2l0aW9uPyA6IFRIUkVFLlZlY3RvcjMsIHNpemU/IDogbnVtYmVyLCBzdGVwPyA6IG51bWJlcikgOiBUSFJFRS5PYmplY3QzRCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciBncmlkR3JvdXAgICAgICAgOiBUSFJFRS5PYmplY3QzRCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpLFxyXG4gICAgICAgICAgICBncmlkUG9zaXRpb24gICAgOiBUSFJFRS5WZWN0b3IzICA9IHBvc2l0aW9uIHx8bmV3IFRIUkVFLlZlY3RvcjMoKSxcclxuICAgICAgICAgICAgZ3JpZFNpemUgICAgICAgIDogbnVtYmVyID0gc2l6ZSB8fCAxMCxcclxuICAgICAgICAgICAgZ3JpZFN0ZXAgICAgICAgIDogbnVtYmVyID0gc3RlcCB8fCAxLFxyXG4gICAgICAgICAgICBjb2xvckNlbnRlcmxpbmUgOiBudW1iZXIgPSAgMHhmZjAwMDAwMCxcclxuICAgICAgICAgICAgeHlHcmlkICAgICAgICAgICA6IFRIUkVFLkdyaWRIZWxwZXIsXHJcbiAgICAgICAgICAgIHl6R3JpZCAgICAgICAgICAgOiBUSFJFRS5HcmlkSGVscGVyLFxyXG4gICAgICAgICAgICB6eEdyaWQgICAgICAgICAgIDogVEhSRUUuR3JpZEhlbHBlcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgeHlHcmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoZ3JpZFNpemUsIGdyaWRTdGVwKTtcclxuICAgICAgICB4eUdyaWQuc2V0Q29sb3JzKGNvbG9yQ2VudGVybGluZSwgMHhmZjAwMDApO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi5jb3B5KGdyaWRQb3NpdGlvbi5jbG9uZSgpKTtcclxuICAgICAgICB4eUdyaWQucm90YXRlT25BeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDEsIDAsIDApLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgeHlHcmlkLnBvc2l0aW9uLnggKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgeHlHcmlkLnBvc2l0aW9uLnkgKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgZ3JpZEdyb3VwLmFkZCh4eUdyaWQpO1xyXG5cclxuICAgICAgICB5ekdyaWQgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcihncmlkU2l6ZSwgZ3JpZFN0ZXApO1xyXG4gICAgICAgIHl6R3JpZC5zZXRDb2xvcnMoY29sb3JDZW50ZXJsaW5lLCAweDAwZmYwMCk7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLmNvcHkoZ3JpZFBvc2l0aW9uLmNsb25lKCkpO1xyXG4gICAgICAgIHl6R3JpZC5yb3RhdGVPbkF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB5ekdyaWQucG9zaXRpb24ueSArPSBncmlkU2l6ZTtcclxuICAgICAgICB5ekdyaWQucG9zaXRpb24ueiArPSBncmlkU2l6ZTtcclxuICAgICAgICBncmlkR3JvdXAuYWRkKHl6R3JpZCk7XHJcblxyXG4gICAgICAgIHp4R3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKGdyaWRTaXplLCBncmlkU3RlcCk7XHJcbiAgICAgICAgenhHcmlkLnNldENvbG9ycyhjb2xvckNlbnRlcmxpbmUsIDB4MDAwMGZmKTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24uY29weShncmlkUG9zaXRpb24uY2xvbmUoKSk7XHJcbiAgICAgICAgenhHcmlkLnJvdGF0ZU9uQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHp4R3JpZC5wb3NpdGlvbi56ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIHp4R3JpZC5wb3NpdGlvbi54ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIGdyaWRHcm91cC5hZGQoenhHcmlkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdyaWRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQWRkcyBhIGNhbWVyYSBoZWxwZXIgdG8gYSBzY2VuZSB0byB2aXN1YWxpemUgdGhlIGNhbWVyYSBwb3NpdGlvbi5cclxuICAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgdG8gYW5ub3RhdGUuXHJcbiAgICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEgdG8gY29uc3RydWN0IGhlbHBlciAobWF5IGJlIG51bGwpLlxyXG4gICAgICAqL1xyXG4gICAgc3RhdGljIGFkZENhbWVyYUhlbHBlciAoY2FtZXJhIDogVEhSRUUuQ2FtZXJhLCBzY2VuZSA6IFRIUkVFLlNjZW5lLCBtb2RlbCA6IFRIUkVFLkdyb3VwKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoIWNhbWVyYSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBjYW1lcmEgcHJvcGVydGllc1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZCAgICAgICAgOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UgOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjb25zdHJ1Y3Qgcm9vdCBvYmplY3Qgb2YgdGhlIGhlbHBlclxyXG4gICAgICAgIGxldCBjYW1lcmFIZWxwZXIgID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgY2FtZXJhSGVscGVyLm5hbWUgPSBPYmplY3ROYW1lcy5DYW1lcmFIZWxwZXI7ICAgICAgIFxyXG4gICAgICAgIGNhbWVyYUhlbHBlci52aXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gbW9kZWwgYm91bmRpbmcgYm94IChWaWV3IGNvb3JkaW5hdGVzKVxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4ZmYwMDAwLCB3aXJlZnJhbWU6IHRydWUsIHRyYW5zcGFyZW50OiBmYWxzZSwgb3BhY2l0eTogMC4yIH0pXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldzogVEhSRUUuQm94MyA9IEdyYXBoaWNzLmdldFRyYW5zZm9ybWVkQm91bmRpbmdCb3gobW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7ICAgICAgICBcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3TWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveChib3VuZGluZ0JveFZpZXcuZ2V0Q2VudGVyKCksIGJvdW5kaW5nQm94VmlldywgYm91bmRpbmdCb3hNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFdvcmxkTWVzaCA9IEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KGJvdW5kaW5nQm94Vmlld01lc2gsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBjYW1lcmFIZWxwZXIuYWRkKGJvdW5kaW5nQm94V29ybGRNZXNoKTtcclxuXHJcbiAgICAgICAgLy8gcG9zaXRpb25cclxuICAgICAgICBsZXQgcG9zaXRpb24gPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKGNhbWVyYS5wb3NpdGlvbiwgMyk7XHJcbiAgICAgICAgY2FtZXJhSGVscGVyLmFkZChwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIC8vIGNhbWVyYSB0YXJnZXQgbGluZVxyXG4gICAgICAgIGxldCB1bml0VGFyZ2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xyXG4gICAgICAgIHVuaXRUYXJnZXQuYXBwbHlRdWF0ZXJuaW9uKGNhbWVyYS5xdWF0ZXJuaW9uKTtcclxuICAgICAgICBsZXQgc2NhbGVkVGFyZ2V0IDogVEhSRUUuVmVjdG9yMztcclxuICAgICAgICBzY2FsZWRUYXJnZXQgPSB1bml0VGFyZ2V0Lm11bHRpcGx5U2NhbGFyKC1ib3VuZGluZ0JveFZpZXcubWF4LnopO1xyXG5cclxuICAgICAgICBsZXQgc3RhcnRQb2ludCA6IFRIUkVFLlZlY3RvcjMgPSBjYW1lcmEucG9zaXRpb247XHJcbiAgICAgICAgbGV0IGVuZFBvaW50ICAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgICAgICBlbmRQb2ludC5hZGRWZWN0b3JzKHN0YXJ0UG9pbnQsIHNjYWxlZFRhcmdldCk7XHJcbiAgICAgICAgbGV0IHRhcmdldExpbmUgOiBUSFJFRS5MaW5lID0gR3JhcGhpY3MuY3JlYXRlTGluZShzdGFydFBvaW50LCBlbmRQb2ludCwgMHgwMGZmMDApO1xyXG4gICAgICAgIGNhbWVyYUhlbHBlci5hZGQodGFyZ2V0TGluZSk7XHJcblxyXG4gICAgICAgIHNjZW5lLmFkZChjYW1lcmFIZWxwZXIpO1xyXG4gICAgfVxyXG5cclxuICAgICAvKipcclxuICAgICAgKiBBZGRzIGEgY29vcmRpbmF0ZSBheGlzIGhlbHBlciB0byBhIHNjZW5lIHRvIHZpc3VhbGl6ZSB0aGUgd29ybGQgYXhlcy5cclxuICAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgdG8gYW5ub3RhdGUuXHJcbiAgICAgICovXHJcbiAgICBzdGF0aWMgYWRkQXhpc0hlbHBlciAoc2NlbmUgOiBUSFJFRS5TY2VuZSwgc2l6ZSA6IG51bWJlcikgOiB2b2lke1xyXG5cclxuICAgICAgICBsZXQgYXhpc0hlbHBlciA9IG5ldyBUSFJFRS5BeGlzSGVscGVyKHNpemUpO1xyXG4gICAgICAgIGF4aXNIZWxwZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgc2NlbmUuYWRkKGF4aXNIZWxwZXIpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBDb29yZGluYXRlIENvbnZlcnNpb25cclxuICAgIC8qXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvLyAgQ29vcmRpbmF0ZSBTeXN0ZW1zXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICBGUkFNRVx0ICAgICAgICAgICAgRVhBTVBMRVx0XHRcdFx0XHRcdFx0XHRcdFx0U1BBQ0UgICAgICAgICAgICAgICAgICAgICAgVU5JVFMgICAgICAgICAgICAgICAgICAgICAgIE5PVEVTXHJcblxyXG4gICAgTW9kZWwgICAgICAgICAgICAgICBDYXRhbG9nIFdlYkdMOiBNb2RlbCwgQmFuZEVsZW1lbnQgQmxvY2sgICAgIG9iamVjdCAgICAgICAgICAgICAgICAgICAgICBtbSAgICAgICAgICAgICAgICAgICAgICAgICAgUmhpbm8gZGVmaW5pdGlvbnNcclxuICAgIFdvcmxkICAgICAgICAgICAgICAgRGVzaWduIE1vZGVsXHRcdFx0XHRcdFx0XHRcdHdvcmxkICAgICAgICAgICAgICAgICAgICAgICBtbSBcclxuICAgIFZpZXcgICAgICAgICAgICAgICAgQ2FtZXJhICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3ICAgICAgICAgICAgICAgICAgICAgICAgbW1cclxuICAgIERldmljZSAgICAgICAgICAgICAgTm9ybWFsaXplZCB2aWV3XHRcdFx0XHRcdFx0XHQgICAgZGV2aWNlICAgICAgICAgICAgICAgICAgICAgIFsoLTEsIC0xKSwgKDEsIDEpXVxyXG4gICAgU2NyZWVuLlBhZ2UgICAgICAgICBIVE1MIHBhZ2VcdFx0XHRcdFx0XHRcdFx0XHRzY3JlZW4gICAgICAgICAgICAgICAgICAgICAgcHggICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCBhdCBUb3AgTGVmdCwgK1kgZG93biAgICBIVE1MIHBhZ2VcclxuICAgIFNjcmVlbi5DbGllbnQgICAgICAgQnJvd3NlciB2aWV3IHBvcnQgXHRcdFx0XHRcdFx0ICAgIHNjcmVlbiAgICAgICAgICAgICAgICAgICAgICBweCAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwIGF0IFRvcCBMZWZ0LCArWSBkb3duICAgIGJyb3dzZXIgd2luZG93XHJcbiAgICBTY3JlZW4uQ29udGFpbmVyICAgIERPTSBjb250YWluZXJcdFx0XHRcdFx0XHRcdFx0c2NyZWVuICAgICAgICAgICAgICAgICAgICAgIHB4ICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAgYXQgVG9wIExlZnQsICtZIGRvd24gICAgSFRNTCBjYW52YXNcclxuXHJcbiAgICBNb3VzZSBFdmVudCBQcm9wZXJ0aWVzXHJcbiAgICBodHRwOi8vd3d3LmphY2tsbW9vcmUuY29tL25vdGVzL21vdXNlLXBvc2l0aW9uL1xyXG4gICAgKi9cclxuICAgICAgICBcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0V29ybGQgQ29vcmRpbmF0ZXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYSBKUXVlcnkgZXZlbnQgdG8gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgRXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEByZXR1cm5zIFdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgd29ybGRDb29yZGluYXRlc0Zyb21KUUV2ZW50IChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnksIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IzIHtcclxuXHJcbiAgICAgICAgdmFyIHdvcmxkQ29vcmRpbmF0ZXMgICAgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCA6IFRIUkVFLlZlY3RvcjMsXHJcbiAgICAgICAgICAgIGRldmljZVogICAgICAgICAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzMkQgPSB0aGlzLmRldmljZUNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGRldmljZVogPSAoY2FtZXJhIGluc3RhbmNlb2YgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpID8gMC41IDogMS4wO1xyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgPSBuZXcgVEhSRUUuVmVjdG9yMyhkZXZpY2VDb29yZGluYXRlczJELngsIGRldmljZUNvb3JkaW5hdGVzMkQueSwgZGV2aWNlWik7XHJcblxyXG4gICAgICAgIHdvcmxkQ29vcmRpbmF0ZXMgPSBkZXZpY2VDb29yZGluYXRlczNELnVucHJvamVjdChjYW1lcmEpO1xyXG5cclxuICAgICAgICByZXR1cm4gd29ybGRDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFZpZXcgQ29vcmRpbmF0ZXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIHZpZXcgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yIFdvcmxkIGNvb3JkaW5hdGUgdmVjdG9yIHRvIGNvbnZlcnQuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEByZXR1cm5zIFZpZXcgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB2aWV3Q29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjMge1xyXG5cclxuICAgICAgICB2YXIgcG9zaXRpb24gICAgICAgICAgOiBUSFJFRS5WZWN0b3IzID0gdmVjdG9yLmNsb25lKCksICBcclxuICAgICAgICAgICAgdmlld0Nvb3JkaW5hdGVzICAgOiBUSFJFRS5WZWN0b3IzO1xyXG5cclxuICAgICAgICB2aWV3Q29vcmRpbmF0ZXMgPSBwb3NpdGlvbi5hcHBseU1hdHJpeDQoY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aWV3Q29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHREZXZpY2UgQ29vcmRpbmF0ZXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYSBKUXVlcnkgZXZlbnQgdG8gbm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHJldHVybnMgTm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50IChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnkpIDogVEhSRUUuVmVjdG9yMiB7XHJcblxyXG4gICAgICAgIHZhciBkZXZpY2VDb29yZGluYXRlcyAgICAgICAgICAgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcyAgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICByYXRpb1gsICByYXRpb1kgICAgICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBkZXZpY2VYLCBkZXZpY2VZICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcyA9IHRoaXMuc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCwgY29udGFpbmVyKTtcclxuICAgICAgICByYXRpb1ggPSBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy54IC8gY29udGFpbmVyLndpZHRoKCk7XHJcbiAgICAgICAgcmF0aW9ZID0gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueSAvIGNvbnRhaW5lci5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgZGV2aWNlWCA9ICsoKHJhdGlvWCAqIDIpIC0gMSk7ICAgICAgICAgICAgICAgICAvLyBbLTEsIDFdXHJcbiAgICAgICAgZGV2aWNlWSA9IC0oKHJhdGlvWSAqIDIpIC0gMSk7ICAgICAgICAgICAgICAgICAvLyBbLTEsIDFdXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMgPSBuZXcgVEhSRUUuVmVjdG9yMihkZXZpY2VYLCBkZXZpY2VZKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRldmljZUNvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgd29ybGQgY29vcmRpbmF0ZXMgdG8gZGV2aWNlIGNvb3JkaW5hdGVzIFstMSwgMV0uXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yICBXb3JsZCBjb29yZGluYXRlcyB2ZWN0b3IuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEBwcmV0dXJucyBEZXZpY2UgY29vcmluZGF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkZXZpY2VDb29yZGluYXRlc0Zyb21Xb3JsZENvb3JkaW5hdGVzICh2ZWN0b3IgOiBUSFJFRS5WZWN0b3IzLCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvaXNzdWVzLzc4XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLCAgXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzMkQgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCAgICAgICAgOiBUSFJFRS5WZWN0b3IzO1xyXG5cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEID0gcG9zaXRpb24ucHJvamVjdChjYW1lcmEpO1xyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzMkQgPSBuZXcgVEhSRUUuVmVjdG9yMihkZXZpY2VDb29yZGluYXRlczNELngsIGRldmljZUNvb3JkaW5hdGVzM0QueSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXZpY2VDb29yZGluYXRlczJEO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0U2NyZWVuIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIFBhZ2UgY29vcmRpbmF0ZXMgZnJvbSBhIEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gKHBhZ2UpIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuUGFnZUNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2NyZWVuUGFnZUNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHNjcmVlblBhZ2VDb29yZGluYXRlcy54ID0gZXZlbnQucGFnZVg7XHJcbiAgICAgICAgc2NyZWVuUGFnZUNvb3JkaW5hdGVzLnkgPSBldmVudC5wYWdlWTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNjcmVlblBhZ2VDb29yZGluYXRlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgZnJvbSBhIEpRdWVyeSBldmVudC5cclxuICAgICAqIENsaWVudCBjb29yZGluYXRlcyBhcmUgcmVsYXRpdmUgdG8gdGhlIDxicm93c2VyPiB2aWV3IHBvcnQuIElmIHRoZSBkb2N1bWVudCBoYXMgYmVlbiBzY3JvbGxlZCBpdCB3aWxsXHJcbiAgICAgKiBiZSBkaWZmZXJlbnQgdGhhbiB0aGUgcGFnZSBjb29yZGluYXRlcyB3aGljaCBhcmUgYWx3YXlzIHJlbGF0aXZlIHRvIHRoZSB0b3AgbGVmdCBvZiB0aGUgPGVudGlyZT4gSFRNTCBwYWdlIGRvY3VtZW50LlxyXG4gICAgICogaHR0cDovL3d3dy5iZW5uYWRlbC5jb20vYmxvZy8xODY5LWpxdWVyeS1tb3VzZS1ldmVudHMtcGFnZXgteS12cy1jbGllbnR4LXkuaHRtXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIGNsaWVudCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXMueCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXMueSA9IGV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5DbGllbnRDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIEpRdWVyeSBldmVudCBjb29yZGluYXRlcyB0byBzY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5Db250YWluZXJDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcclxuICAgICAgICAgICAgY29udGFpbmVyT2Zmc2V0ICAgICAgICAgICAgOiBKUXVlcnlDb29yZGluYXRlcyxcclxuICAgICAgICAgICAgcGFnZVgsIHBhZ2VZICAgICAgICAgICAgICAgOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGNvbnRhaW5lck9mZnNldCA9IGNvbnRhaW5lci5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgLy8gSlF1ZXJ5IGRvZXMgbm90IHNldCBwYWdlWC9wYWdlWSBmb3IgRHJvcCBldmVudHMuIFRoZXkgYXJlIGRlZmluZWQgaW4gdGhlIG9yaWdpbmFsRXZlbnQgbWVtYmVyLlxyXG4gICAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVggfHwgKDxhbnk+KGV2ZW50Lm9yaWdpbmFsRXZlbnQpKS5wYWdlWDtcclxuICAgICAgICBwYWdlWSA9IGV2ZW50LnBhZ2VZIHx8ICg8YW55PihldmVudC5vcmlnaW5hbEV2ZW50KSkucGFnZVk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnggPSBwYWdlWCAtIGNvbnRhaW5lck9mZnNldC5sZWZ0O1xyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnkgPSBwYWdlWSAtIGNvbnRhaW5lck9mZnNldC50b3A7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcztcclxuICAgIH1cclxuICBcclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgd29ybGQgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSB2ZWN0b3IgV29ybGQgdmVjdG9yLlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9pc3N1ZXMvNzhcclxuICAgICAgICB2YXIgcG9zaXRpb24gICAgICAgICAgICAgICAgICAgOiBUSFJFRS5WZWN0b3IzID0gdmVjdG9yLmNsb25lKCksXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzICAgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICBsZWZ0ICAgICAgICAgICAgICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgdG9wICAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8vIFsoLTEsIC0xKSwgKDEsIDEpXVxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzID0gdGhpcy5kZXZpY2VDb29yZGluYXRlc0Zyb21Xb3JsZENvb3JkaW5hdGVzKHBvc2l0aW9uLCBjYW1lcmEpO1xyXG4gICAgICAgIGxlZnQgPSAoKCtkZXZpY2VDb29yZGluYXRlcy54ICsgMSkgLyAyKSAqIGNvbnRhaW5lci53aWR0aCgpO1xyXG4gICAgICAgIHRvcCAgPSAoKC1kZXZpY2VDb29yZGluYXRlcy55ICsgMSkgLyAyKSAqIGNvbnRhaW5lci5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgPSBuZXcgVEhSRUUuVmVjdG9yMihsZWZ0LCB0b3ApO1xyXG4gICAgICAgIHJldHVybiBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcztcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW50ZXJzZWN0aW9uc1xyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIEludGVyc2VjdGlvbnNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFJheWNhc3RlciB0aHJvdWdoIHRoZSBtb3VzZSB3b3JsZCBwb3NpdGlvbi5cclxuICAgICAqIEBwYXJhbSBtb3VzZVdvcmxkIFdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBUSFJFRS5SYXljYXN0ZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByYXljYXN0ZXJGcm9tTW91c2UgKG1vdXNlV29ybGQgOiBUSFJFRS5WZWN0b3IzLCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuUmF5Y2FzdGVye1xyXG5cclxuICAgICAgICB2YXIgcmF5T3JpZ2luICA6IFRIUkVFLlZlY3RvcjMgPSBuZXcgVEhSRUUuVmVjdG9yMyAobW91c2VXb3JsZC54LCBtb3VzZVdvcmxkLnksIGNhbWVyYS5wb3NpdGlvbi56KSxcclxuICAgICAgICAgICAgd29ybGRQb2ludCA6IFRIUkVFLlZlY3RvcjMgPSBuZXcgVEhSRUUuVmVjdG9yMyhtb3VzZVdvcmxkLngsIG1vdXNlV29ybGQueSwgbW91c2VXb3JsZC56KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRvb2xzLmNvbnNvbGVMb2coJ1dvcmxkIG1vdXNlIGNvb3JkaW5hdGVzOiAnICsgd29ybGRQb2ludC54ICsgJywgJyArIHdvcmxkUG9pbnQueSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0cnVjdCByYXkgZnJvbSBjYW1lcmEgdG8gbW91c2Ugd29ybGRcclxuICAgICAgICB2YXIgcmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlciAocmF5T3JpZ2luLCB3b3JsZFBvaW50LnN1YiAocmF5T3JpZ2luKS5ub3JtYWxpemUoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiByYXljYXN0ZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGZpcnN0IEludGVyc2VjdGlvbiBsb2NhdGVkIGJ5IHRoZSBjdXJzb3IuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcGFyYW0gc2NlbmVPYmplY3RzIEFycmF5IG9mIHNjZW5lIG9iamVjdHMuXHJcbiAgICAgKiBAcGFyYW0gcmVjdXJzZSBSZWN1cnNlIHRocm91Z2ggb2JqZWN0cy5cclxuICAgICAqIEByZXR1cm5zIEZpcnN0IGludGVyc2VjdGlvbiB3aXRoIHNjcmVlbiBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Rmlyc3RJbnRlcnNlY3Rpb24oZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEsIHNjZW5lT2JqZWN0cyA6IFRIUkVFLk9iamVjdDNEW10sIHJlY3Vyc2UgOiBib29sZWFuKSA6IFRIUkVFLkludGVyc2VjdGlvbiB7XHJcblxyXG4gICAgICAgIHZhciByYXljYXN0ZXIgICAgICAgICAgOiBUSFJFRS5SYXljYXN0ZXIsXHJcbiAgICAgICAgICAgIG1vdXNlV29ybGQgICAgICAgICA6IFRIUkVFLlZlY3RvcjMsXHJcbiAgICAgICAgICAgIGlJbnRlcnNlY3Rpb24gICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgaW50ZXJzZWN0aW9uICAgICAgIDogVEhSRUUuSW50ZXJzZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gY29uc3RydWN0IHJheSBmcm9tIGNhbWVyYSB0byBtb3VzZSB3b3JsZFxyXG4gICAgICAgIG1vdXNlV29ybGQgPSBHcmFwaGljcy53b3JsZENvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lciwgY2FtZXJhKTtcclxuICAgICAgICByYXljYXN0ZXIgID0gR3JhcGhpY3MucmF5Y2FzdGVyRnJvbU1vdXNlIChtb3VzZVdvcmxkLCBjYW1lcmEpO1xyXG5cclxuICAgICAgICAvLyBmaW5kIGFsbCBvYmplY3QgaW50ZXJzZWN0aW9uc1xyXG4gICAgICAgIHZhciBpbnRlcnNlY3RzIDogVEhSRUUuSW50ZXJzZWN0aW9uW10gPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyAoc2NlbmVPYmplY3RzLCByZWN1cnNlKTtcclxuXHJcbiAgICAgICAgLy8gbm8gaW50ZXJzZWN0aW9uP1xyXG4gICAgICAgIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHVzZSBmaXJzdDsgcmVqZWN0IGxpbmVzIChUcmFuc2Zvcm0gRnJhbWUpXHJcbiAgICAgICAgZm9yIChpSW50ZXJzZWN0aW9uID0gMDsgaUludGVyc2VjdGlvbiA8IGludGVyc2VjdHMubGVuZ3RoOyBpSW50ZXJzZWN0aW9uKyspIHtcclxuXHJcbiAgICAgICAgICAgIGludGVyc2VjdGlvbiA9IGludGVyc2VjdHNbaUludGVyc2VjdGlvbl07XHJcbiAgICAgICAgICAgIGlmICghKGludGVyc2VjdGlvbi5vYmplY3QgaW5zdGFuY2VvZiBUSFJFRS5MaW5lKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcnNlY3Rpb247XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBIZWxwZXJzXHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvLyAgSGVscGVyc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgV2ViR0wgdGFyZ2V0IGNhbnZhcy5cclxuICAgICAqIEBwYXJhbSBpZCBET00gaWQgZm9yIGNhbnZhcy5cclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aCBvZiBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodCBvZiBjYW52YXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0aWFsaXplQ2FudmFzKGlkIDogc3RyaW5nLCB3aWR0aD8gOiBudW1iZXIsIGhlaWdodD8gOiBudW1iZXIpIDogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgXHJcbiAgICAgICAgbGV0IGNhbnZhcyA6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKTtcclxuICAgICAgICBpZiAoIWNhbnZhcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyLmFkZEVycm9yTWVzc2FnZShgQ2FudmFzIGVsZW1lbnQgaWQgPSAke2lkfSBub3QgZm91bmRgKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBDU1MgY29udHJvbHMgdGhlIHNpemVcclxuICAgICAgICBpZiAoIXdpZHRoIHx8ICFoZWlnaHQpXHJcbiAgICAgICAgICAgIHJldHVybiBjYW52YXM7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciBkaW1lbnNpb25zICAgIFxyXG4gICAgICAgIGNhbnZhcy53aWR0aCAgPSB3aWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICAvLyBET00gZWxlbWVudCBkaW1lbnNpb25zIChtYXkgYmUgZGlmZmVyZW50IHRoYW4gcmVuZGVyIGRpbWVuc2lvbnMpXHJcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoICA9IGAke3dpZHRofXB4YDtcclxuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNhbnZhcztcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn0iLCIgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgIFxyXG4vKipcclxuICogTWF0aCBMaWJyYXJ5XHJcbiAqIEdlbmVyYWwgbWF0aGVtYXRpY3Mgcm91dGluZXNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0aExpYnJhcnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdHdvIG51bWJlcnMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIEZpcnN0IHZhbHVlIHRvIGNvbXBhcmUuXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIgU2Vjb25kIHZhbHVlIHRvIGNvbXBhcmUuXHJcbiAgICAgKiBAcGFyYW0gdG9sZXJhbmNlIFRvbGVyYW5jZSBmb3IgY29tcGFyaXNvbi5cclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgd2l0aGluIHRvbGVyYW5jZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIG51bWJlcnNFcXVhbFdpdGhpblRvbGVyYW5jZSh2YWx1ZSA6IG51bWJlciwgb3RoZXIgOiBudW1iZXIsIHRvbGVyYW5jZSA6IG51bWJlcikgOiBib29sZWFuIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuICgodmFsdWUgPj0gKG90aGVyIC0gdG9sZXJhbmNlKSkgJiYgKHZhbHVlIDw9IChvdGhlciArIHRvbGVyYW5jZSkpKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7YXNzZXJ0fSAgICAgICAgICAgICBmcm9tICdjaGFpJ1xyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYX0gICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7U3RvcFdhdGNofSAgICAgICAgICBmcm9tICdTdG9wV2F0Y2gnXHJcblxyXG5pbnRlcmZhY2UgRmFjZVBhaXIge1xyXG4gICAgICAgIFxyXG4gICAgdmVydGljZXMgOiBUSFJFRS5WZWN0b3IzW107XHJcbiAgICBmYWNlcyAgICA6IFRIUkVFLkZhY2UzW107XHJcbn1cclxuICAgICAgICAgIFxyXG4vKipcclxuICogIERlcHRoQnVmZmVyIFxyXG4gKiAgQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXIge1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBNZXNoTW9kZWxOYW1lICAgICAgICAgOiBzdHJpbmcgPSAnTW9kZWxNZXNoJztcclxuICAgIHN0YXRpYyByZWFkb25seSBOb3JtYWxpemVkVG9sZXJhbmNlICAgOiBudW1iZXIgPSAuMDAxOyAgICBcclxuXHJcbiAgICBzdGF0aWMgRGVmYXVsdE1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyA9IHtzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLCB3aXJlZnJhbWUgOiBmYWxzZSwgY29sb3IgOiAweGZmMDBmZiwgcmVmbGVjdGl2aXR5IDogMC43NSwgc2hpbmluZXNzIDogMC43NX07XHJcbiAgICBcclxuICAgIF9sb2dnZXIgOiBMb2dnZXI7XHJcblxyXG4gICAgX3JnYmFBcnJheSA6IFVpbnQ4QXJyYXk7XHJcbiAgICBkZXB0aHMgICAgIDogRmxvYXQzMkFycmF5O1xyXG4gICAgd2lkdGggICAgICA6IG51bWJlcjtcclxuICAgIGhlaWdodCAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgY2FtZXJhICAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xyXG4gICAgX25lYXJDbGlwUGxhbmUgICA6IG51bWJlcjtcclxuICAgIF9mYXJDbGlwUGxhbmUgICAgOiBudW1iZXI7XHJcbiAgICBfY2FtZXJhQ2xpcFJhbmdlIDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBfbWluaW11bU5vcm1hbGl6ZWQgOiBudW1iZXI7XHJcbiAgICBfbWF4aW11bU5vcm1hbGl6ZWQgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSByZ2JhQXJyYXkgUmF3IGFyYXkgb2YgUkdCQSBieXRlcyBwYWNrZWQgd2l0aCBmbG9hdHMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgbWFwLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgbWFwLlxyXG4gICAgICogQHBhcmFtIG5lYXJDbGlwUGxhbmUgQ2FtZXJhIG5lYXIgY2xpcHBpbmcgcGxhbmUuXHJcbiAgICAgKiBAcGFyYW0gZmFyQ2xpcFBsYW5lIENhbWVyYSBmYXIgY2xpcHBpbmcgcGxhbmUuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHJnYmFBcnJheSA6IFVpbnQ4QXJyYXksIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOm51bWJlciwgY2FtZXJhIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9yZ2JhQXJyYXkgPSByZ2JhQXJyYXk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBjYW1lcmE7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGFzcGVjdCByYXRpb24gb2YgdGhlIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGFzcGVjdFJhdGlvICgpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1pbmltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1pbmltdW1Ob3JtYWxpemVkICgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWluaW11bSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bSA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aCh0aGlzLl9tYXhpbXVtTm9ybWFsaXplZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtaW5pbXVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4aW11bU5vcm1hbGl6ZWQgKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhpbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXhpbXVtKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBtYXhpbXVtID0gdGhpcy5ub3JtYWxpemVkVG9Nb2RlbERlcHRoKHRoaXMubWluaW11bU5vcm1hbGl6ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF4aW11bTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggcmFuZ2Ugb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhbmdlTm9ybWFsaXplZCgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgZGVwdGhOb3JtYWxpemVkIDogbnVtYmVyID0gdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQgLSB0aGlzLl9taW5pbXVtTm9ybWFsaXplZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhbmdlKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBkZXB0aCA6IG51bWJlciA9IHRoaXMubWF4aW11bSAtIHRoaXMubWluaW11bTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGV4dGVudHMgb2YgdGhlIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqLyAgICAgICBcclxuICAgIGNhbGN1bGF0ZUV4dGVudHMgKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNldE1pbmltdW1Ob3JtYWxpemVkKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLnNldE1heGltdW1Ob3JtYWxpemVkKCk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemVcclxuICAgICAqLyAgICAgICBcclxuICAgIGluaXRpYWxpemUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmh0bWxMb2dnZXI7ICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLl9uZWFyQ2xpcFBsYW5lICAgPSB0aGlzLmNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuX2ZhckNsaXBQbGFuZSAgICA9IHRoaXMuY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFDbGlwUmFuZ2UgPSB0aGlzLl9mYXJDbGlwUGxhbmUgLSB0aGlzLl9uZWFyQ2xpcFBsYW5lO1xyXG5cclxuICAgICAgICAvLyBSR0JBIC0+IEZsb2F0MzJcclxuICAgICAgICB0aGlzLmRlcHRocyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fcmdiYUFycmF5LmJ1ZmZlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGV4dHJlbWEgb2YgZGVwdGggYnVmZmVyIHZhbHVlc1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlRXh0ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCBhIG5vcm1hbGl6ZWQgZGVwdGggWzAsMV0gdG8gZGVwdGggaW4gbW9kZWwgdW5pdHMuXHJcbiAgICAgKiBAcGFyYW0gbm9ybWFsaXplZERlcHRoIE5vcm1hbGl6ZWQgZGVwdGggWzAsMV0uXHJcbiAgICAgKi9cclxuICAgIG5vcm1hbGl6ZWRUb01vZGVsRGVwdGgobm9ybWFsaXplZERlcHRoIDogbnVtYmVyKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY2NTIyNTMvZ2V0dGluZy10aGUtdHJ1ZS16LXZhbHVlLWZyb20tdGhlLWRlcHRoLWJ1ZmZlclxyXG4gICAgICAgIG5vcm1hbGl6ZWREZXB0aCA9IDIuMCAqIG5vcm1hbGl6ZWREZXB0aCAtIDEuMDtcclxuICAgICAgICBsZXQgekxpbmVhciA9IDIuMCAqIHRoaXMuY2FtZXJhLm5lYXIgKiB0aGlzLmNhbWVyYS5mYXIgLyAodGhpcy5jYW1lcmEuZmFyICsgdGhpcy5jYW1lcmEubmVhciAtIG5vcm1hbGl6ZWREZXB0aCAqICh0aGlzLmNhbWVyYS5mYXIgLSB0aGlzLmNhbWVyYS5uZWFyKSk7XHJcblxyXG4gICAgICAgIC8vIHpMaW5lYXIgaXMgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNhbWVyYTsgcmV2ZXJzZSB0byB5aWVsZCBoZWlnaHQgZnJvbSBtZXNoIHBsYW5lXHJcbiAgICAgICAgekxpbmVhciA9IC0oekxpbmVhciAtIHRoaXMuY2FtZXJhLmZhcik7XHJcblxyXG4gICAgICAgIHJldHVybiB6TGluZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9ybWFsaXplZCBkZXB0aCB2YWx1ZSBhdCBhIHBpeGVsIGluZGV4XHJcbiAgICAgKiBAcGFyYW0gcm93IEJ1ZmZlciByb3cuXHJcbiAgICAgKiBAcGFyYW0gY29sdW1uIEJ1ZmZlciBjb2x1bW4uXHJcbiAgICAgKi9cclxuICAgIGRlcHRoTm9ybWFsaXplZCAocm93IDogbnVtYmVyLCBjb2x1bW4pIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGV4ID0gKE1hdGgucm91bmQocm93KSAqIHRoaXMud2lkdGgpICsgTWF0aC5yb3VuZChjb2x1bW4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoc1tpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGRlcHRoIHZhbHVlIGF0IGEgcGl4ZWwgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gcm93IE1hcCByb3cuXHJcbiAgICAgKiBAcGFyYW0gcGl4ZWxDb2x1bW4gTWFwIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgZGVwdGgocm93IDogbnVtYmVyLCBjb2x1bW4pIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGRlcHRoTm9ybWFsaXplZCA9IHRoaXMuZGVwdGhOb3JtYWxpemVkKHJvdywgY29sdW1uKTtcclxuICAgICAgICBsZXQgZGVwdGggPSB0aGlzLm5vcm1hbGl6ZWRUb01vZGVsRGVwdGgoZGVwdGhOb3JtYWxpemVkKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZGVwdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBtaW5pbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHNldE1pbmltdW1Ob3JtYWxpemVkKCkge1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bU5vcm1hbGl6ZWQgOiBudW1iZXIgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4OiBudW1iZXIgPSAwOyBpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aDsgaW5kZXgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGhWYWx1ZSA6IG51bWJlciA9IHRoaXMuZGVwdGhzW2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZXB0aFZhbHVlIDwgbWluaW11bU5vcm1hbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICBtaW5pbXVtTm9ybWFsaXplZCA9IGRlcHRoVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQgPSBtaW5pbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG1heGltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TWF4aW11bU5vcm1hbGl6ZWQoKSB7XHJcblxyXG4gICAgICAgIGxldCBtYXhpbXVtTm9ybWFsaXplZCA6IG51bWJlciA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgdGhpcy5kZXB0aHMubGVuZ3RoOyBpbmRleCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aFZhbHVlIDogbnVtYmVyID0gdGhpcy5kZXB0aHNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoZGVwdGhWYWx1ZSA+IG1heGltdW1Ob3JtYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgbWF4aW11bU5vcm1hbGl6ZWQgPSBkZXB0aFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21heGltdW1Ob3JtYWxpemVkID0gbWF4aW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4vKipcclxuICAgICAqIFJldHVybnMgdGhlIGxpbmVhciBpbmRleCBvZiBhIG1vZGVsIHBvaW50IGluIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHdvcmxkVmVydGV4IFZlcnRleCBvZiBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzICh3b3JsZFZlcnRleCA6IFRIUkVFLlZlY3RvcjMsIHBsYW5lQm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgXHJcbiAgICAgICAgbGV0IGJveFNpemUgICAgICA6IFRIUkVFLlZlY3RvcjMgPSBwbGFuZUJvdW5kaW5nQm94LmdldFNpemUoKTtcclxuICAgICAgICBsZXQgbWVzaEV4dGVudHMgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyIChib3hTaXplLngsIGJveFNpemUueSk7XHJcblxyXG4gICAgICAgIC8vICBtYXAgY29vcmRpbmF0ZXMgdG8gb2Zmc2V0cyBpbiByYW5nZSBbMCwgMV1cclxuICAgICAgICBsZXQgb2Zmc2V0WCA6IG51bWJlciA9ICh3b3JsZFZlcnRleC54ICsgKGJveFNpemUueCAvIDIpKSAvIGJveFNpemUueDtcclxuICAgICAgICBsZXQgb2Zmc2V0WSA6IG51bWJlciA9ICh3b3JsZFZlcnRleC55ICsgKGJveFNpemUueSAvIDIpKSAvIGJveFNpemUueTtcclxuXHJcbiAgICAgICAgbGV0IHJvdyAgICA6IG51bWJlciA9IG9mZnNldFkgKiAodGhpcy5oZWlnaHQgLSAxKTtcclxuICAgICAgICBsZXQgY29sdW1uIDogbnVtYmVyID0gb2Zmc2V0WCAqICh0aGlzLndpZHRoIC0gMSk7XHJcbiAgICAgICAgcm93ICAgID0gTWF0aC5yb3VuZChyb3cpO1xyXG4gICAgICAgIGNvbHVtbiA9IE1hdGgucm91bmQoY29sdW1uKTtcclxuXHJcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZSgocm93ID49IDApICYmIChyb3cgPCB0aGlzLmhlaWdodCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIHJvdyA9ICR7cm93fWApKTtcclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChjb2x1bW4+PSAwKSAmJiAoY29sdW1uIDwgdGhpcy53aWR0aCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIGNvbHVtbiA9ICR7Y29sdW1ufWApKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IyKHJvdywgY29sdW1uKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbGluZWFyIGluZGV4IG9mIGEgbW9kZWwgcG9pbnQgaW4gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gd29ybGRWZXJ0ZXggVmVydGV4IG9mIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXRNb2RlbFZlcnRleEluZGV4ICh3b3JsZFZlcnRleCA6IFRIUkVFLlZlY3RvcjMsIHBsYW5lQm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2VzIDogVEhSRUUuVmVjdG9yMiA9IHRoaXMuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHdvcmxkVmVydGV4LCBwbGFuZUJvdW5kaW5nQm94KTsgICAgXHJcbiAgICAgICAgbGV0IHJvdyAgICA6IG51bWJlciA9IGluZGljZXMueDtcclxuICAgICAgICBsZXQgY29sdW1uIDogbnVtYmVyID0gaW5kaWNlcy55O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbmRleCA9IChyb3cgKiB0aGlzLndpZHRoKSArIGNvbHVtbjtcclxuICAgICAgICBpbmRleCA9IE1hdGgucm91bmQoaW5kZXgpO1xyXG5cclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChpbmRleCA+PSAwKSAmJiAoaW5kZXggPCB0aGlzLmRlcHRocy5sZW5ndGgpLCAoYFZlcnRleCAoJHt3b3JsZFZlcnRleC54fSwgJHt3b3JsZFZlcnRleC55fSwgJHt3b3JsZFZlcnRleC56fSkgeWllbGRlZCBpbmRleCA9ICR7aW5kZXh9YCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIENvbnN0cnVjdHMgYSBwYWlyIG9mIHRyaWFuZ3VsYXIgZmFjZXMgYXQgdGhlIGdpdmVuIG9mZnNldCBpbiB0aGUgRGVwdGhCdWZmZXIuXHJcbiAgICAgICogQHBhcmFtIHJvdyBSb3cgb2Zmc2V0IChMb3dlciBMZWZ0KS5cclxuICAgICAgKiBAcGFyYW0gY29sdW1uIENvbHVtbiBvZmZzZXQgKExvd2VyIExlZnQpLlxyXG4gICAgICAqIEBwYXJhbSBmYWNlU2l6ZSBTaXplIG9mIGEgZmFjZSBlZGdlIChub3QgaHlwb3RlbnVzZSkuXHJcbiAgICAgICogQHBhcmFtIGJhc2VWZXJ0ZXhJbmRleCBCZWdpbm5pbmcgb2Zmc2V0IGluIG1lc2ggZ2VvbWV0cnkgdmVydGV4IGFycmF5LlxyXG4gICAgICAqL1xyXG4gICAgIGNvbnN0cnVjdFRyaUZhY2VzQXRPZmZzZXQgKHJvdyA6IG51bWJlciwgY29sdW1uIDogbnVtYmVyLCBtZXNoTG93ZXJMZWZ0IDogVEhSRUUuVmVjdG9yMiwgZmFjZVNpemUgOiBudW1iZXIsIGJhc2VWZXJ0ZXhJbmRleCA6IG51bWJlcikgOiBGYWNlUGFpciB7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICBsZXQgZmFjZVBhaXIgOiBGYWNlUGFpciA9IHtcclxuICAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgICBmYWNlcyAgICA6IFtdXHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIC8vICBWZXJ0aWNlc1xyXG4gICAgICAgICAvLyAgIDIgICAgMyAgICAgICBcclxuICAgICAgICAgLy8gICAwICAgIDFcclxuICAgICBcclxuICAgICAgICAgLy8gY29tcGxldGUgbWVzaCBjZW50ZXIgd2lsbCBiZSBhdCB0aGUgd29ybGQgb3JpZ2luXHJcbiAgICAgICAgIGxldCBvcmlnaW5YIDogbnVtYmVyID0gbWVzaExvd2VyTGVmdC54ICsgKGNvbHVtbiAqIGZhY2VTaXplKTtcclxuICAgICAgICAgbGV0IG9yaWdpblkgOiBudW1iZXIgPSBtZXNoTG93ZXJMZWZ0LnkgKyAocm93ICAgICogZmFjZVNpemUpO1xyXG4gXHJcbiAgICAgICAgIGxldCBsb3dlckxlZnQgICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyAwLCAgICAgICAgIG9yaWdpblkgKyAwLCAgICAgICAgdGhpcy5kZXB0aChyb3cgKyAwLCBjb2x1bW4rIDApKTsgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMFxyXG4gICAgICAgICBsZXQgbG93ZXJSaWdodCAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgZmFjZVNpemUsICBvcmlnaW5ZICsgMCwgICAgICAgIHRoaXMuZGVwdGgocm93ICsgMCwgY29sdW1uICsgMSkpOyAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDFcclxuICAgICAgICAgbGV0IHVwcGVyTGVmdCAgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIDAsICAgICAgICAgb3JpZ2luWSArIGZhY2VTaXplLCB0aGlzLmRlcHRoKHJvdyArIDEsIGNvbHVtbiArIDApKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAyXHJcbiAgICAgICAgIGxldCB1cHBlclJpZ2h0ICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyBmYWNlU2l6ZSwgIG9yaWdpblkgKyBmYWNlU2l6ZSwgdGhpcy5kZXB0aChyb3cgKyAxLCBjb2x1bW4gKyAxKSk7ICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgM1xyXG4gXHJcbiAgICAgICAgIGZhY2VQYWlyLnZlcnRpY2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgbG93ZXJMZWZ0LCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAwXHJcbiAgICAgICAgICAgICAgbG93ZXJSaWdodCwgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAxXHJcbiAgICAgICAgICAgICAgdXBwZXJMZWZ0LCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAyXHJcbiAgICAgICAgICAgICAgdXBwZXJSaWdodCAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAzXHJcbiAgICAgICAgICApO1xyXG4gXHJcbiAgICAgICAgICAvLyByaWdodCBoYW5kIHJ1bGUgZm9yIHBvbHlnb24gd2luZGluZ1xyXG4gICAgICAgICAgZmFjZVBhaXIuZmFjZXMucHVzaChcclxuICAgICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoYmFzZVZlcnRleEluZGV4ICsgMCwgYmFzZVZlcnRleEluZGV4ICsgMSwgYmFzZVZlcnRleEluZGV4ICsgMyksXHJcbiAgICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKGJhc2VWZXJ0ZXhJbmRleCArIDAsIGJhc2VWZXJ0ZXhJbmRleCArIDMsIGJhc2VWZXJ0ZXhJbmRleCArIDIpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgIHJldHVybiBmYWNlUGFpcjtcclxuICAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbWVzaCBvZiB0aGUgZ2l2ZW4gYmFzZSBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0gbWVzaFhZRXh0ZW50cyBCYXNlIGRpbWVuc2lvbnMgKG1vZGVsIHVuaXRzKS4gSGVpZ2h0IGlzIGNvbnRyb2xsZWQgYnkgREIgYXNwZWN0IHJhdGlvLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE1hdGVyaWFsIHRvIGFzc2lnbiB0byBtZXNoLlxyXG4gICAgICovXHJcbiAgICBtZXNoKG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICBsZXQgdGltZXJUYWcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdEZXB0aEJ1ZmZlci5tZXNoJyk7ICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IG1lc2hYWUV4dGVudHMgOiBUSFJFRS5WZWN0b3IyID0gQ2FtZXJhLmdldE5lYXJQbGFuZUV4dGVudHModGhpcy5jYW1lcmEpOyAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIW1hdGVyaWFsKVxyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbChEZXB0aEJ1ZmZlci5EZWZhdWx0TWVzaFBob25nTWF0ZXJpYWxQYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmYWNlU2l6ZSAgICAgICAgOiBudW1iZXIgPSBtZXNoWFlFeHRlbnRzLnggLyAodGhpcy53aWR0aCAtIDEpO1xyXG4gICAgICAgIGxldCBiYXNlVmVydGV4SW5kZXggOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBsZXQgbWVzaExvd2VyTGVmdCA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigtKG1lc2hYWUV4dGVudHMueCAvIDIpLCAtKG1lc2hYWUV4dGVudHMueSAvIDIpIClcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaVJvdyA9IDA7IGlSb3cgPCAodGhpcy5oZWlnaHQgLSAxKTsgaVJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlDb2x1bW4gPSAwOyBpQ29sdW1uIDwgKHRoaXMud2lkdGggLSAxKTsgaUNvbHVtbisrKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBmYWNlUGFpciA9IHRoaXMuY29uc3RydWN0VHJpRmFjZXNBdE9mZnNldChpUm93LCBpQ29sdW1uLCBtZXNoTG93ZXJMZWZ0LCBmYWNlU2l6ZSwgYmFzZVZlcnRleEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkudmVydGljZXMucHVzaCguLi5mYWNlUGFpci52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkuZmFjZXMucHVzaCguLi5mYWNlUGFpci5mYWNlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmFzZVZlcnRleEluZGV4ICs9IDQ7XHJcbiAgICAgICAgICAgIH0gICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IG1lc2ggID0gbmV3IFRIUkVFLk1lc2gobWVzaEdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgbWVzaC5uYW1lID0gRGVwdGhCdWZmZXIuTWVzaE1vZGVsTmFtZTtcclxuXHJcbiAgICAgICAgLy8gTWVzaCB3YXMgY29uc3RydWN0ZWQgd2l0aCBaID0gZGVwdGggYnVmZmVyKFgsWSkuXHJcbiAgICAgICAgLy8gTm93IHJvdGF0ZSBtZXNoIHRvIGFsaWduIHdpdGggdmlld2VyIFhZIHBsYW5lIHNvIFRvcCB2aWV3IGlzIGxvb2tpbmcgZG93biBvbiB0aGUgbWVzaC5cclxuICAgICAgICBtZXNoLnJvdGF0ZVgoLU1hdGguUEkgLyAyKTtcclxuXHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUodGltZXJUYWcpXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmFseXplcyBwcm9wZXJ0aWVzIG9mIGEgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplICgpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuY2xlYXJMb2coKTtcclxuXHJcbiAgICAgICAgbGV0IG1pZGRsZSA9IHRoaXMud2lkdGggLyAyO1xyXG4gICAgICAgIGxldCBkZWNpbWFsUGxhY2VzID0gNTtcclxuICAgICAgICBsZXQgaGVhZGVyU3R5bGUgICA9IFwiZm9udC1mYW1pbHkgOiBtb25vc3BhY2U7IGZvbnQtd2VpZ2h0IDogYm9sZDsgY29sb3IgOiBibHVlOyBmb250LXNpemUgOiAxOHB4XCI7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2VTdHlsZSAgPSBcImZvbnQtZmFtaWx5IDogbW9ub3NwYWNlOyBjb2xvciA6IGJsYWNrOyBmb250LXNpemUgOiAxNHB4XCI7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKCdDYW1lcmEgUHJvcGVydGllcycsIGhlYWRlclN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTmVhciBQbGFuZSA9ICR7dGhpcy5jYW1lcmEubmVhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBGYXIgUGxhbmUgID0gJHt0aGlzLmNhbWVyYS5mYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgQ2xpcCBSYW5nZSA9ICR7dGhpcy5jYW1lcmEuZmFyIC0gdGhpcy5jYW1lcmEubmVhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFbXB0eUxpbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoJ05vcm1hbGl6ZWQnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENlbnRlciBEZXB0aCA9ICR7dGhpcy5kZXB0aE5vcm1hbGl6ZWQobWlkZGxlLCBtaWRkbGUpLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgWiBSYW5nZSA9ICR7dGhpcy5yYW5nZU5vcm1hbGl6ZWQudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBNaW5pbXVtID0gJHt0aGlzLm1pbmltdW1Ob3JtYWxpemVkLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWF4aW11bSA9ICR7dGhpcy5tYXhpbXVtTm9ybWFsaXplZC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVtcHR5TGluZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZSgnTW9kZWwgVW5pdHMnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENlbnRlciBEZXB0aCA9ICR7dGhpcy5kZXB0aChtaWRkbGUsIG1pZGRsZSkudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBaIFJhbmdlID0gJHt0aGlzLnJhbmdlLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWluaW11bSA9ICR7dGhpcy5taW5pbXVtLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWF4aW11bSA9ICR7dGhpcy5tYXhpbXVtLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgIH1cclxufSIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIFRvb2wgTGlicmFyeVxyXG4gKiBHZW5lcmFsIHV0aWxpdHkgcm91dGluZXNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVG9vbHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gVXRpbGl0eVxyXG4gICAgLy8vIDxzdW1tYXJ5PiAgICAgICAgXHJcbiAgICAvLyBHZW5lcmF0ZSBhIHBzZXVkbyBHVUlELlxyXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgc3RhdGljIGdlbmVyYXRlUHNldWRvR1VJRCgpIHtcclxuICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuICAgICBcclxuICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuLypcclxuICBSZXF1aXJlbWVudHNcclxuICAgIE5vIHBlcnNpc3RlbnQgRE9NIGVsZW1lbnQuIFRoZSBjYW52YXMgaXMgY3JlYXRlZCBkeW5hbWljYWxseS5cclxuICAgICAgICBPcHRpb24gZm9yIHBlcnNpc3RpbmcgdGhlIEZhY3RvcnkgaW4gdGhlIGNvbnN0cnVjdG9yXHJcbiAgICBKU09OIGNvbXBhdGlibGUgY29uc3RydWN0b3IgcGFyYW1ldGVyc1xyXG4gICAgRml4ZWQgcmVzb2x1dGlvbjsgcmVzaXppbmcgc3VwcG9ydCBpcyBub3QgcmVxdWlyZWQuXHJcbiovXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYSwgQ2xpcHBpbmdQbGFuZXN9IGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlcn0gICAgICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtNb2RlbFJlbGllZn0gICAgICAgICAgICBmcm9tICdNb2RlbFJlbGllZidcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtTdG9wV2F0Y2h9ICAgICAgICAgICAgICBmcm9tICdTdG9wV2F0Y2gnXHJcbmltcG9ydCB7VG9vbHN9ICAgICAgICAgICAgICAgICAgZnJvbSAnVG9vbHMnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMge1xyXG5cclxuICAgIHdpZHRoICAgICAgICAgICAgOiBudW1iZXIsICAgICAgICAgICAgICAgICAgLy8gd2lkdGggb2YgREJcclxuICAgIGhlaWdodCAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgLy8gaGVpZ2h0IG9mIERCICAgICAgICBcclxuICAgIG1vZGVsICAgICAgICAgICAgOiBUSFJFRS5Hcm91cCwgICAgICAgICAgICAgLy8gbW9kZWwgcm9vdFxyXG5cclxuICAgIGNhbWVyYT8gICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgLy8gY2FtZXJhXHJcbiAgICBcclxuICAgIGxvZ0RlcHRoQnVmZmVyPyAgOiBib29sZWFuLCAgICAgICAgICAgICAgICAgLy8gdXNlIGxvZ2FyaXRobWljIGRlcHRoIGJ1ZmZlciBmb3IgaGlnaGVyIHJlc29sdXRpb24gKGJldHRlciBkaXN0cmlidXRpb24pIGluIHNjZW5lcyB3aXRoIGxhcmdlIGV4dGVudHNcclxuICAgIGJvdW5kZWRDbGlwcGluZz8gOiBib29sZWFuLCAgICAgICAgICAgICAgICAgLy8gb3ZlcnJyaWQgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byBib3VuZCBtb2RlbFxyXG4gICAgXHJcbiAgICBhZGRDYW52YXNUb0RPTT8gIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgIC8vIHZpc2libGUgY2FudmFzOyBhZGQgdG8gSFRNTFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1lc2hHZW5lcmF0ZVBhcmFtZXRlcnMge1xyXG5cclxuICAgIGNhbWVyYT8gICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcclxuICAgIG1hdGVyaWFsPyAgICAgICAgOiBUSFJFRS5NYXRlcmlhbDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbWFnZUdlbmVyYXRlUGFyYW1ldGVycyB7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogRGVwdGhCdWZmZXJGYWN0b3J5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXJGYWN0b3J5IHtcclxuXHJcbiAgICBzdGF0aWMgRGVmYXVsdFJlc29sdXRpb24gOiBudW1iZXIgICAgICAgICAgID0gMTAyNDsgICAgICAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IERCIHJlc29sdXRpb25cclxuICAgIHN0YXRpYyBOZWFyUGxhbmVFcHNpbG9uICA6IG51bWJlciAgICAgICAgICAgPSAuMDAxOyAgICAgICAgICAgICAgICAgICAgIC8vIGFkanVzdG1lbnQgdG8gYXZvaWQgY2xpcHBpbmcgZ2VvbWV0cnkgb24gdGhlIG5lYXIgcGxhbmVcclxuICAgIFxyXG4gICAgc3RhdGljIENzc0NsYXNzTmFtZSAgICAgIDogc3RyaW5nICAgICAgICAgICA9ICdEZXB0aEJ1ZmZlckZhY3RvcnknOyAgICAgLy8gQ1NTIGNsYXNzXHJcbiAgICBzdGF0aWMgUm9vdENvbnRhaW5lcklkICAgOiBzdHJpbmcgICAgICAgICAgID0gJ3Jvb3RDb250YWluZXInOyAgICAgICAgICAvLyByb290IGNvbnRhaW5lciBmb3Igdmlld2Vyc1xyXG4gICAgXHJcbiAgICBfc2NlbmUgICAgICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHRhcmdldCBzY2VuZVxyXG4gICAgX21vZGVsICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyB0YXJnZXQgbW9kZWxcclxuXHJcbiAgICBfcmVuZGVyZXIgICAgICAgIDogVEhSRUUuV2ViR0xSZW5kZXJlciAgICAgID0gbnVsbDsgICAgIC8vIHNjZW5lIHJlbmRlcmVyXHJcbiAgICBfY2FudmFzICAgICAgICAgIDogSFRNTENhbnZhc0VsZW1lbnQgICAgICAgID0gbnVsbDsgICAgIC8vIERPTSBjYW52YXMgc3VwcG9ydGluZyByZW5kZXJlclxyXG4gICAgX3dpZHRoICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICA9IERlcHRoQnVmZmVyRmFjdG9yeS5EZWZhdWx0UmVzb2x1dGlvbjsgICAgIC8vIHdpZHRoIHJlc29sdXRpb24gb2YgdGhlIERCXHJcbiAgICBfaGVpZ2h0ICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgID0gRGVwdGhCdWZmZXJGYWN0b3J5LkRlZmF1bHRSZXNvbHV0aW9uOyAgICAgLy8gaGVpZ2h0IHJlc29sdXRpb24gb2YgdGhlIERCXHJcblxyXG4gICAgX2NhbWVyYSAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhICA9IG51bGw7ICAgICAvLyBwZXJzcGVjdGl2ZSBjYW1lcmEgdG8gZ2VuZXJhdGUgdGhlIGRlcHRoIGJ1ZmZlclxyXG5cclxuXHJcbiAgICBfbG9nRGVwdGhCdWZmZXIgIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gZmFsc2U7ICAgIC8vIHVzZSBhIGxvZ2FyaXRobWljIGJ1ZmZlciBmb3IgbW9yZSBhY2N1cmFjeSBpbiBsYXJnZSBzY2VuZXNcclxuICAgIF9ib3VuZGVkQ2xpcHBpbmcgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gb3ZlcnJpZGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lczsgc2V0IG5lYXIgYW5kIGZhciB0byBib3VuZCBtb2RlbCBmb3IgaW1wcm92ZWQgYWNjdXJhY3lcclxuXHJcbiAgICBfZGVwdGhCdWZmZXIgICAgIDogRGVwdGhCdWZmZXIgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIGRlcHRoIGJ1ZmZlciBcclxuICAgIF90YXJnZXQgICAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCAgPSBudWxsOyAgICAgLy8gV2ViR0wgcmVuZGVyIHRhcmdldCBmb3IgY3JlYXRpbmcgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciB3aGVuIHJlbmRlcmluZyB0aGUgc2NlbmVcclxuICAgIF9lbmNvZGVkVGFyZ2V0ICAgOiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCAgPSBudWxsOyAgICAgLy8gV2ViR0wgcmVuZGVyIHRhcmdldCBmb3IgZW5jb2RpbiB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIGludG8gYSBmbG9hdGluZyBwb2ludCAoUkdCQSBmb3JtYXQpXHJcblxyXG4gICAgX3Bvc3RTY2VuZSAgICAgICA6IFRIUkVFLlNjZW5lICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBzaW5nbGUgcG9seWdvbiBzY2VuZSB1c2UgdG8gZ2VuZXJhdGUgdGhlIGVuY29kZWQgUkdCQSBidWZmZXJcclxuICAgIF9wb3N0Q2FtZXJhICAgICAgOiBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEgPSBudWxsOyAgICAgLy8gb3J0aG9ncmFwaGljIGNhbWVyYVxyXG4gICAgX3Bvc3RNYXRlcmlhbCAgICA6IFRIUkVFLlNoYWRlck1hdGVyaWFsICAgICA9IG51bGw7ICAgICAvLyBzaGFkZXIgbWF0ZXJpYWwgdGhhdCBlbmNvZGVzIHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgaW50byBhIGZsb2F0aW5nIHBvaW50IFJHQkEgZm9ybWF0XHJcblxyXG4gICAgX21pbmltdW1XZWJHTCAgICA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICA9IHRydWU7ICAgICAvLyB0cnVlIGlmIG1pbmltdW0gV2VHTCByZXF1aXJlbWVudHMgYXJlIHByZXNlbnRcclxuICAgIF9sb2dnZXIgICAgICAgICAgOiBMb2dnZXIgICAgICAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gbG9nZ2VyXHJcbiAgICBfYWRkQ2FudmFzVG9ET00gIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gZmFsc2U7ICAgIC8vIHZpc2libGUgY2FudmFzOyBhZGQgdG8gSFRNTCBwYWdlXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMgKERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMpXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMgOiBEZXB0aEJ1ZmZlckZhY3RvcnlQYXJhbWV0ZXJzKSB7XHJcblxyXG4gICAgICAgIC8vIHJlcXVpcmVkXHJcbiAgICAgICAgdGhpcy5fd2lkdGggICAgICAgICAgID0gcGFyYW1ldGVycy53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgICAgICAgICAgPSBwYXJhbWV0ZXJzLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9tb2RlbCAgICAgICAgICAgPSBwYXJhbWV0ZXJzLm1vZGVsLmNsb25lKHRydWUpO1xyXG5cclxuICAgICAgICAvLyBvcHRpb25hbFxyXG4gICAgICAgIHRoaXMuX2NhbWVyYSAgICAgICAgICA9IHBhcmFtZXRlcnMuY2FtZXJhICAgICAgICAgIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbG9nRGVwdGhCdWZmZXIgID0gcGFyYW1ldGVycy5sb2dEZXB0aEJ1ZmZlciAgfHwgZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fYm91bmRlZENsaXBwaW5nID0gcGFyYW1ldGVycy5ib3VuZGVkQ2xpcHBpbmcgfHwgZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fYWRkQ2FudmFzVG9ET00gID0gcGFyYW1ldGVycy5hZGRDYW52YXNUb0RPTSAgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IHRoaXMuaW5pdGlhbGl6ZUNhbnZhcygpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBWZXJpZmllcyB0aGUgbWluaW11bSBXZWJHTCBleHRlbnNpb25zIGFyZSBwcmVzZW50LlxyXG4gICAgICogQHBhcmFtIHJlbmRlcmVyIFdlYkdMIHJlbmRlcmVyLlxyXG4gICAgICovXHJcbiAgICB2ZXJpZnlXZWJHTEV4dGVuc2lvbnMoKSA6IGJvb2xlYW4geyBcclxuICAgIFxyXG4gICAgICAgIGlmICghdGhpcy5fcmVuZGVyZXIuZXh0ZW5zaW9ucy5nZXQoJ1dFQkdMX2RlcHRoX3RleHR1cmUnKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9taW5pbXVtV2ViR0wgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVycm9yTWVzc2FnZSgnVGhlIG1pbmltdW0gV2ViR0wgZXh0ZW5zaW9ucyBhcmUgbm90IHN1cHBvcnRlZCBpbiB0aGUgYnJvd3Nlci4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGUgYSBtb3VzZSBkb3duIGV2ZW50IG9uIHRoZSBjYW52YXMuXHJcbiAgICAgKi9cclxuICAgIG9uTW91c2VEb3duKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBkZXZpY2VDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBHcmFwaGljcy5kZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCAkKGV2ZW50LnRhcmdldCkpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgZGV2aWNlID0gJHtkZXZpY2VDb29yZGluYXRlcy54fSwgJHtkZXZpY2VDb29yZGluYXRlcy55fWApO1xyXG5cclxuICAgICAgICBsZXQgZGVjaW1hbFBsYWNlcyAgIDogbnVtYmVyID0gMjtcclxuICAgICAgICBsZXQgcm93ICAgICAgICAgICAgIDogbnVtYmVyID0gKGRldmljZUNvb3JkaW5hdGVzLnkgKyAxKSAvIDIgKiB0aGlzLl9kZXB0aEJ1ZmZlci5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGNvbHVtbiAgICAgICAgICA6IG51bWJlciA9IChkZXZpY2VDb29yZGluYXRlcy54ICsgMSkgLyAyICogdGhpcy5fZGVwdGhCdWZmZXIud2lkdGg7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBPZmZzZXQgPSBbJHtyb3d9LCAke2NvbHVtbn1dYCk7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgRGVwdGggPSAke3RoaXMuX2RlcHRoQnVmZmVyLmRlcHRoKHJvdywgY29sdW1uKS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWApOyAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIFdlYkdMIHRhcmdldCBjYW52YXMuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDYW52YXMoKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBUb29scy5nZW5lcmF0ZVBzZXVkb0dVSUQoKSk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBEZXB0aEJ1ZmZlckZhY3RvcnkuQ3NzQ2xhc3NOYW1lKTtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIGRpbWVuc2lvbnMgICAgXHJcbiAgICAgICAgdGhpcy5fY2FudmFzLndpZHRoICA9IHRoaXMuX3dpZHRoO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5oZWlnaHQgPSB0aGlzLl9oZWlnaHQ7IFxyXG5cclxuICAgICAgICAvLyBET00gZWxlbWVudCBkaW1lbnNpb25zIChtYXkgYmUgZGlmZmVyZW50IHRoYW4gcmVuZGVyIGRpbWVuc2lvbnMpXHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnN0eWxlLndpZHRoICA9IGAke3RoaXMuX3dpZHRofXB4YDtcclxuICAgICAgICB0aGlzLl9jYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5faGVpZ2h0fXB4YDtcclxuXHJcbiAgICAgICAgLy8gYWRkIHRvIERPTT9cclxuICAgICAgICBpZiAodGhpcy5fYWRkQ2FudmFzVG9ET00pXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke0RlcHRoQnVmZmVyRmFjdG9yeS5Sb290Q29udGFpbmVySWR9YCkuYXBwZW5kQ2hpbGQodGhpcy5fY2FudmFzKTtcclxuXHJcbiAgICAgICAgICAgIGxldCAkY2FudmFzID0gJCh0aGlzLl9jYW52YXMpLm9uKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHJlbmRlciBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVNjZW5lICgpIDogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwpXHJcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lLmFkZCh0aGlzLl9tb2RlbCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpZ2h0aW5nKHRoaXMuX3NjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlICBtb2RlbCB2aWV3LlxyXG4gICAgICovXHJcbiAgICAgaW5pdGlhbGl6ZVJlbmRlcmVyKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7Y2FudmFzIDogdGhpcy5fY2FudmFzLCBsb2dhcml0aG1pY0RlcHRoQnVmZmVyIDogdGhpcy5fbG9nRGVwdGhCdWZmZXJ9KTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTaXplKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyBNb2RlbCBTY2VuZSAtPiAoUmVuZGVyIFRleHR1cmUsIERlcHRoIFRleHR1cmUpXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGhpcy5jb25zdHJ1Y3REZXB0aFRleHR1cmVSZW5kZXJUYXJnZXQoKTtcclxuXHJcbiAgICAgICAgLy8gRW5jb2RlZCBSR0JBIFRleHR1cmUgZnJvbSBEZXB0aCBUZXh0dXJlXHJcbiAgICAgICAgdGhpcy5fZW5jb2RlZFRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJpZnlXZWJHTEV4dGVuc2lvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgZGVmYXVsdCBsaWdodGluZyBpbiB0aGUgc2NlbmUuXHJcbiAgICAgKiBMaWdodGluZyBkb2VzIG5vdCBhZmZlY3QgdGhlIGRlcHRoIGJ1ZmZlci4gSXQgaXMgb25seSB1c2VkIGlmIHRoZSBjYW52YXMgaXMgbWFkZSB2aXNpYmxlLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplTGlnaHRpbmcgKHNjZW5lIDogVEhSRUUuU2NlbmUpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjIpO1xyXG4gICAgICAgIHNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDEucG9zaXRpb24uc2V0KDEsIDEsIDEpO1xyXG4gICAgICAgIHNjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0MSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVByaW1hcnkgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU2NlbmUoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVSZW5kZXJlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemUgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gU2VydmljZXMuY29uc29sZUxvZ2dlcjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQcmltYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBQb3N0UHJvY2Vzc2luZ1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgcmVuZGVyIHRhcmdldCA8d2l0aCBhIGRlcHRoIHRleHR1cmUgYnVmZmVyPi5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0RGVwdGhUZXh0dXJlUmVuZGVyVGFyZ2V0KCkgOiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCB7XHJcblxyXG4gICAgICAgIC8vIE1vZGVsIFNjZW5lIC0+IChSZW5kZXIgVGV4dHVyZSwgRGVwdGggVGV4dHVyZSlcclxuICAgICAgICBsZXQgcmVuZGVyVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG5cclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS5mb3JtYXQgICAgICAgICAgID0gVEhSRUUuUkdCQUZvcm1hdDtcclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS50eXBlICAgICAgICAgICAgID0gVEhSRUUuVW5zaWduZWRCeXRlVHlwZTtcclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS5taW5GaWx0ZXIgICAgICAgID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS5tYWdGaWx0ZXIgICAgICAgID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcclxuICAgICAgICByZW5kZXJUYXJnZXQudGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlbmRlclRhcmdldC5zdGVuY2lsQnVmZmVyICAgICAgICAgICAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LmRlcHRoQnVmZmVyICAgICAgICAgICAgICA9IHRydWU7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LmRlcHRoVGV4dHVyZSAgICAgICAgICAgICA9IG5ldyBUSFJFRS5EZXB0aFRleHR1cmUodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LmRlcHRoVGV4dHVyZS50eXBlICAgICAgICA9IFRIUkVFLlVuc2lnbmVkSW50VHlwZTtcclxuICAgIFxyXG4gICAgICAgIHJldHVybiByZW5kZXJUYXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbiBvZiB0aGUgcG9zdCBzY2VuZSB1c2VkIHRvIGNyZWF0ZSB0aGUgZmluYWwgUkdCQSBlbmNvZGVkIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVBvc3RTY2VuZSAoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgcG9zdE1lc2hNYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbCh7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZlcnRleFNoYWRlcjogICBNUi5zaGFkZXJTb3VyY2VbJ0RlcHRoQnVmZmVyVmVydGV4U2hhZGVyJ10sXHJcbiAgICAgICAgICAgIGZyYWdtZW50U2hhZGVyOiBNUi5zaGFkZXJTb3VyY2VbJ0RlcHRoQnVmZmVyRnJhZ21lbnRTaGFkZXInXSxcclxuXHJcbiAgICAgICAgICAgIHVuaWZvcm1zOiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmFOZWFyICA6ICAgeyB2YWx1ZTogdGhpcy5fY2FtZXJhLm5lYXIgfSxcclxuICAgICAgICAgICAgICAgIGNhbWVyYUZhciAgIDogICB7IHZhbHVlOiB0aGlzLl9jYW1lcmEuZmFyIH0sXHJcbiAgICAgICAgICAgICAgICB0RGlmZnVzZSAgICA6ICAgeyB2YWx1ZTogdGhpcy5fdGFyZ2V0LnRleHR1cmUgfSxcclxuICAgICAgICAgICAgICAgIHREZXB0aCAgICAgIDogICB7IHZhbHVlOiB0aGlzLl90YXJnZXQuZGVwdGhUZXh0dXJlIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBwb3N0TWVzaFBsYW5lID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMiwgMik7XHJcbiAgICAgICAgbGV0IHBvc3RNZXNoUXVhZCAgPSBuZXcgVEhSRUUuTWVzaChwb3N0TWVzaFBsYW5lLCBwb3N0TWVzaE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcG9zdFNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5fcG9zdFNjZW5lLmFkZChwb3N0TWVzaFF1YWQpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQb3N0Q2FtZXJhKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGlnaHRpbmcodGhpcy5fcG9zdFNjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgdGhlIG9ydGhvZ3JhcGhpYyBjYW1lcmEgdXNlZCB0byBjb252ZXJ0IHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgdG8gdGhlIGVuY29kZWQgUkdCQSBidWZmZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVBvc3RDYW1lcmEoKSB7XHJcblxyXG4gICAgICAgIC8vIFNldHVwIHBvc3QgcHJvY2Vzc2luZyBzdGFnZVxyXG4gICAgICAgIGxldCBsZWZ0OiBudW1iZXIgICAgICA9ICAtMTtcclxuICAgICAgICBsZXQgcmlnaHQ6IG51bWJlciAgICAgPSAgIDE7XHJcbiAgICAgICAgbGV0IHRvcDogbnVtYmVyICAgICAgID0gICAxO1xyXG4gICAgICAgIGxldCBib3R0b206IG51bWJlciAgICA9ICAtMTtcclxuICAgICAgICBsZXQgbmVhcjogbnVtYmVyICAgICAgPSAgIDA7XHJcbiAgICAgICAgbGV0IGZhcjogbnVtYmVyICAgICAgID0gICAxO1xyXG5cclxuICAgICAgICB0aGlzLl9wb3N0Q2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYShsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIG5lYXIsIGZhcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVBvc3QgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdFNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdENhbWVyYSgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBHZW5lcmF0aW9uXHJcbiAgICAvKipcclxuICAgICAqIFZlcmlmaWVzIHRoZSBwcmUtcmVxdWlzaXRlIHNldHRpbmdzIGFyZSBkZWZpbmVkIHRvIGNyZWF0ZSBhIG1lc2guXHJcbiAgICAgKi9cclxuICAgIHZlcmlmeU1lc2hTZXR0aW5ncygpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgbGV0IG1pbmltdW1TZXR0aW5ncyA6IGJvb2xlYW4gPSB0cnVlXHJcbiAgICAgICAgbGV0IGVycm9yUHJlZml4ICAgICA6IHN0cmluZyA9ICdEZXB0aEJ1ZmZlckZhY3Rvcnk6ICc7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fbW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVycm9yTWVzc2FnZShgJHtlcnJvclByZWZpeH1UaGUgbW9kZWwgaXMgbm90IGRlZmluZWQuYCk7XHJcbiAgICAgICAgICAgIG1pbmltdW1TZXR0aW5ncyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9jYW1lcmEpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVycm9yTWVzc2FnZShgJHtlcnJvclByZWZpeH1UaGUgY2FtZXJhIGlzIG5vdCBkZWZpbmVkLmApO1xyXG4gICAgICAgICAgICBtaW5pbXVtU2V0dGluZ3MgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtaW5pbXVtU2V0dGluZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGFuIFJHQkEgc3RyaW5nIHdpdGggdGhlIGJ5dGUgdmFsdWVzIG9mIGEgcGl4ZWwuXHJcbiAgICAgKiBAcGFyYW0gYnVmZmVyIFVuc2lnbmVkIGJ5dGUgcmF3IGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSByb3cgUGl4ZWwgcm93LlxyXG4gICAgICogQHBhcmFtIGNvbHVtbiBDb2x1bW4gcm93LlxyXG4gICAgICovXHJcbiAgICAgdW5zaWduZWRCeXRlc1RvUkdCQSAoYnVmZmVyIDogVWludDhBcnJheSwgcm93IDogbnVtYmVyLCBjb2x1bW4gOiBudW1iZXIpIDogc3RyaW5nIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gKHJvdyAqIHRoaXMuX3dpZHRoKSArIGNvbHVtbjtcclxuICAgICAgICBsZXQgclZhbHVlID0gYnVmZmVyW29mZnNldCArIDBdLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBsZXQgZ1ZhbHVlID0gYnVmZmVyW29mZnNldCArIDFdLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBsZXQgYlZhbHVlID0gYnVmZmVyW29mZnNldCArIDJdLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBsZXQgYVZhbHVlID0gYnVmZmVyW29mZnNldCArIDNdLnRvU3RyaW5nKDE2KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAjJHtyVmFsdWV9JHtnVmFsdWV9JHtiVmFsdWV9ICR7YVZhbHVlfWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmFseXplcyBhIHBpeGVsIGZyb20gYSByZW5kZXIgYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplUmVuZGVyQnVmZmVyICgpIHtcclxuXHJcbiAgICAgICAgbGV0IHJlbmRlckJ1ZmZlciA9ICBuZXcgVWludDhBcnJheSh0aGlzLl93aWR0aCAqIHRoaXMuX2hlaWdodCAqIDQpLmZpbGwoMCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVhZFJlbmRlclRhcmdldFBpeGVscyh0aGlzLl90YXJnZXQsIDAsIDAsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHJlbmRlckJ1ZmZlcik7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlU3RyaW5nID0gYFJHQkFbMCwgMF0gPSAke3RoaXMudW5zaWduZWRCeXRlc1RvUkdCQShyZW5kZXJCdWZmZXIsIDAsIDApfWA7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UobWVzc2FnZVN0cmluZywgbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmFseXplIHRoZSByZW5kZXIgYW5kIGRlcHRoIHRhcmdldHMuXHJcbiAgICAgKi9cclxuICAgIGFuYWx5emVUYXJnZXRzICgpICB7XHJcblxyXG4vLyAgICAgIHRoaXMuYW5hbHl6ZVJlbmRlckJ1ZmZlcigpO1xyXG4vLyAgICAgIHRoaXMuX2RlcHRoQnVmZmVyLmFuYWx5emUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgY3JlYXRlRGVwdGhCdWZmZXIoKSB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ0RlcHRoQnVmZmVyRmFjdG9yeS5jcmVhdGVEZXB0aEJ1ZmZlcicpOyAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9zY2VuZSwgdGhpcy5fY2FtZXJhLCB0aGlzLl90YXJnZXQpOyAgICBcclxuICAgIFxyXG4gICAgICAgIC8vIChvcHRpb25hbCkgcHJldmlldyBlbmNvZGVkIFJHQkEgdGV4dHVyZTsgZHJhd24gYnkgc2hhZGVyIGJ1dCBub3QgcGVyc2lzdGVkXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVuZGVyKHRoaXMuX3Bvc3RTY2VuZSwgdGhpcy5fcG9zdENhbWVyYSk7ICAgIFxyXG5cclxuICAgICAgICAvLyBQZXJzaXN0IGVuY29kZWQgUkdCQSB0ZXh0dXJlOyBjYWxjdWxhdGVkIGZyb20gZGVwdGggYnVmZmVyXHJcbiAgICAgICAgLy8gZW5jb2RlZFRhcmdldC50ZXh0dXJlICAgICAgOiBlbmNvZGVkIFJHQkEgdGV4dHVyZVxyXG4gICAgICAgIC8vIGVuY29kZWRUYXJnZXQuZGVwdGhUZXh0dXJlIDogbnVsbFxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9wb3N0U2NlbmUsIHRoaXMuX3Bvc3RDYW1lcmEsIHRoaXMuX2VuY29kZWRUYXJnZXQpOyBcclxuXHJcbiAgICAgICAgLy8gZGVjb2RlIFJHQkEgdGV4dHVyZSBpbnRvIGRlcHRoIGZsb2F0c1xyXG4gICAgICAgIGxldCBkZXB0aEJ1ZmZlclJHQkEgPSAgbmV3IFVpbnQ4QXJyYXkodGhpcy5fd2lkdGggKiB0aGlzLl9oZWlnaHQgKiA0KS5maWxsKDApO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlYWRSZW5kZXJUYXJnZXRQaXhlbHModGhpcy5fZW5jb2RlZFRhcmdldCwgMCwgMCwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgZGVwdGhCdWZmZXJSR0JBKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGVwdGhCdWZmZXIgPSBuZXcgRGVwdGhCdWZmZXIoZGVwdGhCdWZmZXJSR0JBLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCB0aGlzLl9jYW1lcmEpOyAgICBcclxuXHJcbiAgICAgICAgdGhpcy5hbmFseXplVGFyZ2V0cygpO1xyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyBmb3IgbWVzaCBnZW5lcmF0aW9uLlxyXG4gICAgICovXHJcbiAgICBzZXRDYW1lcmFDbGlwcGluZ1BsYW5lcyAoKSB7XHJcblxyXG4gICAgICAgIC8vIGNvcHkgY2FtZXJhOyBzaGFyZWQgd2l0aCBNb2RlbFZpZXdlclxyXG4gICAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoKTtcclxuICAgICAgICBjYW1lcmEuY29weSAodGhpcy5fY2FtZXJhKTtcclxuICAgICAgICB0aGlzLl9jYW1lcmEgPSBjYW1lcmE7XHJcblxyXG4gICAgICAgIGxldCBjbGlwcGluZ1BsYW5lcyA6IENsaXBwaW5nUGxhbmVzID0gQ2FtZXJhLmdldEJvdW5kaW5nQ2xpcHBpbmdQbGFuZXModGhpcy5fY2FtZXJhLCB0aGlzLl9tb2RlbCk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLm5lYXIgPSBjbGlwcGluZ1BsYW5lcy5uZWFyO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYS5mYXIgID0gY2xpcHBpbmdQbGFuZXMuZmFyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIG1lc2ggZnJvbSB0aGUgYWN0aXZlIG1vZGVsIGFuZCBjYW1lcmFcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEdlbmVyYXRpb24gcGFyYW1ldGVycyAoTWVzaEdlbmVyYXRlUGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgbWVzaEdlbmVyYXRlIChwYXJhbWV0ZXJzIDogTWVzaEdlbmVyYXRlUGFyYW1ldGVycykgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMudmVyaWZ5TWVzaFNldHRpbmdzKCkpIFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5fYm91bmRlZENsaXBwaW5nKVxyXG4gICAgICAgICAgICB0aGlzLnNldENhbWVyYUNsaXBwaW5nUGxhbmVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVwdGhCdWZmZXIoKTtcclxuICAgICAgICBsZXQgbWVzaCA9IHRoaXMuX2RlcHRoQnVmZmVyLm1lc2gocGFyYW1ldGVycy5tYXRlcmlhbCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgYW4gaW1hZ2UgZnJvbSB0aGUgYWN0aXZlIG1vZGVsIGFuZCBjYW1lcmFcclxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJzIEdlbmVyYXRpb24gcGFyYW1ldGVycyAoSW1hZ2VHZW5lcmF0ZVBhcmFtZXRlcnMpXHJcbiAgICAgKi9cclxuICAgIGltYWdlR2VuZXJhdGUgKHBhcmFtZXRlcnMgOiBJbWFnZUdlbmVyYXRlUGFyYW1ldGVycykgOiBVaW50OEFycmF5IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7IERlcHRoQnVmZmVyRmFjdG9yeSB9IGZyb20gJ0RlcHRoQnVmZmVyRmFjdG9yeSdcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1N0b3BXYXRjaH0gICAgICAgICAgICBmcm9tICdTdG9wV2F0Y2gnXHJcblxyXG5leHBvcnQgZW51bSBTdGFuZGFyZFZpZXcge1xyXG4gICAgRnJvbnQsXHJcbiAgICBCYWNrLFxyXG4gICAgVG9wLFxyXG4gICAgQm90dG9tLFxyXG4gICAgTGVmdCxcclxuICAgIFJpZ2h0LFxyXG4gICAgSXNvbWV0cmljXHJcbn1cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDYW1lcmEgY2xpcHBpbmcgcGxhbmVzIHR1cGxlLlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgQ2xpcHBpbmdQbGFuZXNcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpcHBpbmdQbGFuZXMge1xyXG4gICAgbmVhciA6IG51bWJlcjtcclxuICAgIGZhciAgOiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYW1lcmFcclxuICogR2VuZXJhbCBjYW1lcmEgdXRpbGl0eSBtZXRob2RzLlxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEge1xyXG5cclxuICAgIHN0YXRpYyBEZWZhdWx0RmllbGRPZlZpZXcgICAgICAgOiBudW1iZXIgPSAzNzsgICAgICAgLy8gMzVtbSB2ZXJ0aWNhbCA6IGh0dHBzOi8vd3d3Lm5pa29uaWFucy5vcmcvcmV2aWV3cy9mb3YtdGFibGVzICAgICAgIFxyXG4gICAgc3RhdGljIERlZmF1bHROZWFyQ2xpcHBpbmdQbGFuZSA6IG51bWJlciA9IDAuMTsgXHJcbiAgICBzdGF0aWMgRGVmYXVsdEZhckNsaXBwaW5nUGxhbmUgIDogbnVtYmVyID0gMTAwMDA7IFxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBDbGlwcGluZyBQbGFuZXNcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGV4dGVudHMgb2YgdGhlIG5lYXIgY2FtZXJhIHBsYW5lLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5WZWN0b3IyfSBcclxuICAgICAqIEBtZW1iZXJvZiBHcmFwaGljc1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0TmVhclBsYW5lRXh0ZW50cyhjYW1lcmEgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY2FtZXJhRk9WUmFkaWFucyA9IGNhbWVyYS5mb3YgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBcclxuICAgICAgICBsZXQgbmVhckhlaWdodCA9IDIgKiBNYXRoLnRhbihjYW1lcmFGT1ZSYWRpYW5zIC8gMikgKiBjYW1lcmEubmVhcjtcclxuICAgICAgICBsZXQgbmVhcldpZHRoICA9IGNhbWVyYS5hc3BlY3QgKiBuZWFySGVpZ2h0O1xyXG4gICAgICAgIGxldCBleHRlbnRzID0gbmV3IFRIUkVFLlZlY3RvcjIobmVhcldpZHRoLCBuZWFySGVpZ2h0KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZXh0ZW50cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmRzIHRoZSBib3VuZGluZyBjbGlwcGluZyBwbGFuZXMgZm9yIHRoZSBnaXZlbiBtb2RlbC4gXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEJvdW5kaW5nQ2xpcHBpbmdQbGFuZXMoY2FtZXJhIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIG1vZGVsIDogVEhSRUUuT2JqZWN0M0QpIDogQ2xpcHBpbmdQbGFuZXN7XHJcblxyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2U6IFRIUkVFLk1hdHJpeDQgPSBjYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXc6IFRIUkVFLkJveDMgPSBHcmFwaGljcy5nZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgYm94IGlzIHdvcmxkLWF4aXMgYWxpZ25lZC4gXHJcbiAgICAgICAgLy8gSW4gVmlldyBjb29yZGluYXRlcywgdGhlIGNhbWVyYSBpcyBhdCB0aGUgb3JpZ2luLlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBuZWFyIHBsYW5lIGlzIHRoZSBtYXhpbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgZmFyIHBsYW5lIGlzIHRoZSBtaW5pbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICBsZXQgbmVhclBsYW5lID0gLWJvdW5kaW5nQm94Vmlldy5tYXguejtcclxuICAgICAgICBsZXQgZmFyUGxhbmUgPSAtYm91bmRpbmdCb3hWaWV3Lm1pbi56O1xyXG5cclxuICAgICAgICBsZXQgY2xpcHBpbmdQbGFuZXMgOiBDbGlwcGluZ1BsYW5lcyA9IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGFkanVzdCBieSBlcHNpbG9uIHRvIGF2b2lkIGNsaXBwaW5nIGdlb21ldHJ5IGF0IHRoZSBuZWFyIHBsYW5lIGVkZ2VcclxuICAgICAgICAgICAgbmVhciA6ICAoMSAtIERlcHRoQnVmZmVyRmFjdG9yeS5OZWFyUGxhbmVFcHNpbG9uKSAqIG5lYXJQbGFuZSxcclxuICAgICAgICAgICAgZmFyICA6IGZhclBsYW5lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjbGlwcGluZ1BsYW5lcztcclxuICAgIH0gIFxyXG5cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2V0dGluZ3NcclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSB0aGUgZGVmYXVsdCBib3VuZGluZyBib3ggZm9yIGEgbW9kZWwuXHJcbiAgICAgKiBJZiB0aGUgbW9kZWwgaXMgZW1wdHksIGEgdW5pdCBzcGhlcmUgaXMgdXNlcyBhcyBhIHByb3h5IHRvIHByb3ZpZGUgZGVmYXVsdHMuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLk9iamVjdDNEfSBtb2RlbCBNb2RlbCB0byBjYWxjdWxhdGUgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHJldHVybnMge1RIUkVFLkJveDN9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXREZWZhdWx0Qm91bmRpbmdCb3ggKG1vZGVsIDogVEhSRUUuT2JqZWN0M0QpIDogVEhSRUUuQm94MyB7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKCk7ICAgICAgIFxyXG4gICAgICAgIGlmIChtb2RlbCkgXHJcbiAgICAgICAgICAgIGJvdW5kaW5nQm94ID0gR3JhcGhpY3MuZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KG1vZGVsKTsgXHJcblxyXG4gICAgICAgIGlmICghYm91bmRpbmdCb3guaXNFbXB0eSgpKVxyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gdW5pdCBzcGhlcmUgcHJveHlcclxuICAgICAgICBsZXQgc3BoZXJlUHJveHkgPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKCksIDEpO1xyXG4gICAgICAgIGJvdW5kaW5nQm94ID0gR3JhcGhpY3MuZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KHNwaGVyZVByb3h5KTsgICAgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFVwZGF0ZXMgdGhlIGNhbWVyYSB0byBmaXQgdGhlIG1vZGVsIGluIHRoZSBjdXJyZW50IHZpZXcuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhfSBjYW1lcmEgQ2FtZXJhIHRvIHVwZGF0ZS5cclxuICAgICAqIEBwYXJhbSB7VEhSRUUuR3JvdXB9IG1vZGVsIE1vZGVsIHRvIGZpdC5cclxuICAgICAqIEByZXR1cm5zIHtDYW1lcmFTZXR0aW5nc30gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRGaXRWaWV3Q2FtZXJhIChjYW1lcmFUZW1wbGF0ZSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBtb2RlbCA6IFRIUkVFLkdyb3VwLCApIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgeyBcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyVGFnID0gU2VydmljZXMudGltZXIubWFyaygnQ2FtZXJhLmdldEZpdFZpZXdDYW1lcmEnKTsgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgY2FtZXJhID0gY2FtZXJhVGVtcGxhdGUuY2xvbmUodHJ1ZSk7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94V29ybGQgICAgICAgICA6IFRIUkVFLkJveDMgICAgPSBDYW1lcmEuZ2V0RGVmYXVsdEJvdW5kaW5nQm94KG1vZGVsKTtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGQgICAgICAgIDogVEhSRUUuTWF0cml4NCA9IGNhbWVyYS5tYXRyaXhXb3JsZDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRmluZCBjYW1lcmEgcG9zaXRpb24gaW4gVmlldyBjb29yZGluYXRlcy4uLlxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXc6IFRIUkVFLkJveDMgPSBHcmFwaGljcy5nZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICBsZXQgdmVydGljYWxGaWVsZE9mVmlld1JhZGlhbnMgICA6IG51bWJlciA9IChjYW1lcmEuZm92IC8gMikgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgbGV0IGhvcml6b250YWxGaWVsZE9mVmlld1JhZGlhbnMgOiBudW1iZXIgPSBNYXRoLmF0YW4oY2FtZXJhLmFzcGVjdCAqIE1hdGgudGFuKHZlcnRpY2FsRmllbGRPZlZpZXdSYWRpYW5zKSk7ICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgY2FtZXJhWlZlcnRpY2FsRXh0ZW50cyAgIDogbnVtYmVyID0gKGJvdW5kaW5nQm94Vmlldy5nZXRTaXplKCkueSAvIDIpIC8gTWF0aC50YW4gKHZlcnRpY2FsRmllbGRPZlZpZXdSYWRpYW5zKTsgICAgICAgXHJcbiAgICAgICAgbGV0IGNhbWVyYVpIb3Jpem9udGFsRXh0ZW50cyA6IG51bWJlciA9IChib3VuZGluZ0JveFZpZXcuZ2V0U2l6ZSgpLnggLyAyKSAvIE1hdGgudGFuIChob3Jpem9udGFsRmllbGRPZlZpZXdSYWRpYW5zKTsgICAgICAgXHJcbiAgICAgICAgbGV0IGNhbWVyYVogPSBNYXRoLm1heChjYW1lcmFaVmVydGljYWxFeHRlbnRzLCBjYW1lcmFaSG9yaXpvbnRhbEV4dGVudHMpO1xyXG5cclxuICAgICAgICAvLyBwcmVzZXJ2ZSBYWTsgc2V0IFogdG8gaW5jbHVkZSBleHRlbnRzXHJcbiAgICAgICAgbGV0IGNhbWVyYVBvc2l0aW9uVmlldyA9IGNhbWVyYS5wb3NpdGlvbi5hcHBseU1hdHJpeDQoY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTtcclxuICAgICAgICBsZXQgcG9zaXRpb25WaWV3ID0gbmV3IFRIUkVFLlZlY3RvcjMoY2FtZXJhUG9zaXRpb25WaWV3LngsIGNhbWVyYVBvc2l0aW9uVmlldy55LCBib3VuZGluZ0JveFZpZXcubWF4LnogKyBjYW1lcmFaKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBOb3csIHRyYW5zZm9ybSBiYWNrIHRvIFdvcmxkIGNvb3JkaW5hdGVzLi4uXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uV29ybGQgPSBwb3NpdGlvblZpZXcuYXBwbHlNYXRyaXg0KGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuXHJcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKHBvc2l0aW9uV29ybGQpO1xyXG4gICAgICAgIGNhbWVyYS5sb29rQXQoYm91bmRpbmdCb3hXb3JsZC5nZXRDZW50ZXIoKSk7XHJcblxyXG4gICAgICAgIC8vIGZvcmNlIGNhbWVyYSBtYXRyaXggdG8gdXBkYXRlOyBtYXRyaXhBdXRvVXBkYXRlIGhhcHBlbnMgaW4gcmVuZGVyIGxvb3BcclxuICAgICAgICBjYW1lcmEudXBkYXRlTWF0cml4V29ybGQodHJ1ZSk7XHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUodGltZXJUYWcpOyAgICAgICBcclxuICAgICAgICByZXR1cm4gY2FtZXJhO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyB0aGUgY2FtZXJhIHNldHRpbmdzIHRvIGZpdCB0aGUgbW9kZWwgaW4gYSBzdGFuZGFyZCB2aWV3LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtDYW1lcmEuU3RhbmRhcmRWaWV3fSB2aWV3IFN0YW5kYXJkIHZpZXcgKFRvcCwgTGVmdCwgZXRjLilcclxuICAgICAqIEBwYXJhbSB7VEhSRUUuT2JqZWN0M0R9IG1vZGVsIE1vZGVsIHRvIGZpdC5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRTdGFuZGFyZFZpZXdDYW1lcmEgKHZpZXc6IFN0YW5kYXJkVmlldywgdmlld0FzcGVjdCA6IG51bWJlciwgbW9kZWwgOiBUSFJFRS5Hcm91cCkgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSB7IFxyXG5cclxuICAgICAgICBsZXQgdGltZXJUYWcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3Jyk7ICAgICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY2FtZXJhID0gQ2FtZXJhLmdldERlZmF1bHRDYW1lcmEodmlld0FzcGVjdCk7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gR3JhcGhpY3MuZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KG1vZGVsKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY2VudGVyWCA9IGJvdW5kaW5nQm94LmdldENlbnRlcigpLng7XHJcbiAgICAgICAgbGV0IGNlbnRlclkgPSBib3VuZGluZ0JveC5nZXRDZW50ZXIoKS55O1xyXG4gICAgICAgIGxldCBjZW50ZXJaID0gYm91bmRpbmdCb3guZ2V0Q2VudGVyKCkuejtcclxuXHJcbiAgICAgICAgbGV0IG1pblggPSBib3VuZGluZ0JveC5taW4ueDtcclxuICAgICAgICBsZXQgbWluWSA9IGJvdW5kaW5nQm94Lm1pbi55O1xyXG4gICAgICAgIGxldCBtaW5aID0gYm91bmRpbmdCb3gubWluLno7XHJcbiAgICAgICAgbGV0IG1heFggPSBib3VuZGluZ0JveC5tYXgueDtcclxuICAgICAgICBsZXQgbWF4WSA9IGJvdW5kaW5nQm94Lm1heC55O1xyXG4gICAgICAgIGxldCBtYXhaID0gYm91bmRpbmdCb3gubWF4Lno7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoICh2aWV3KSB7ICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuRnJvbnQ6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhjZW50ZXJYLCAgY2VudGVyWSwgbWF4WikpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAxLCAwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LkJhY2s6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhjZW50ZXJYLCAgY2VudGVyWSwgbWluWikpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAxLCAwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LlRvcDoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKGNlbnRlclgsICBtYXhZLCBjZW50ZXJaKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KDAsIDAsIC0xKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LkJvdHRvbToge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKGNlbnRlclgsIG1pblksIGNlbnRlclopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5MZWZ0OiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMobWluWCwgY2VudGVyWSwgY2VudGVyWikpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAxLCAwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LlJpZ2h0OiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMobWF4WCwgY2VudGVyWSwgY2VudGVyWikpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAxLCAwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3Lklzb21ldHJpYzoge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNpZGUgPSBNYXRoLm1heChNYXRoLm1heChib3VuZGluZ0JveC5nZXRTaXplKCkueCwgYm91bmRpbmdCb3guZ2V0U2l6ZSgpLnkpLCBib3VuZGluZ0JveC5nZXRTaXplKCkueik7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMoc2lkZSwgIHNpZGUsIHNpZGUpKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoLTEsIDEsIC0xKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBGb3JjZSBvcmllbnRhdGlvbiBiZWZvcmUgRml0IFZpZXcgY2FsY3VsYXRpb25cclxuICAgICAgICBjYW1lcmEubG9va0F0KGJvdW5kaW5nQm94LmdldENlbnRlcigpKTtcclxuXHJcbiAgICAgICAgLy8gZm9yY2UgY2FtZXJhIG1hdHJpeCB0byB1cGRhdGU7IG1hdHJpeEF1dG9VcGRhdGUgaGFwcGVucyBpbiByZW5kZXIgbG9vcFxyXG4gICAgICAgIGNhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTtcclxuICAgICAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cclxuICAgICAgICBjYW1lcmEgPSBDYW1lcmEuZ2V0Rml0Vmlld0NhbWVyYShjYW1lcmEsIG1vZGVsKTtcclxuXHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUodGltZXJUYWcpO1xyXG4gICAgICAgIHJldHVybiBjYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgZGVmYXVsdCBzY2VuZSBjYW1lcmEuXHJcbiAgICAgKiBAcGFyYW0gdmlld0FzcGVjdCBWaWV3IGFzcGVjdCByYXRpby5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldERlZmF1bHRDYW1lcmEgKHZpZXdBc3BlY3QgOiBudW1iZXIpIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkZWZhdWx0Q2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyAoMCwgMCwgMCkpO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIC0xKSk7XHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS5uZWFyICAgPSBDYW1lcmEuRGVmYXVsdE5lYXJDbGlwcGluZ1BsYW5lO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEuZmFyICAgID0gQ2FtZXJhLkRlZmF1bHRGYXJDbGlwcGluZ1BsYW5lO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEuZm92ICAgID0gQ2FtZXJhLkRlZmF1bHRGaWVsZE9mVmlldztcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmFzcGVjdCA9IHZpZXdBc3BlY3Q7XHJcblxyXG4gICAgICAgIC8vIGZvcmNlIGNhbWVyYSBtYXRyaXggdG8gdXBkYXRlOyBtYXRyaXhBdXRvVXBkYXRlIGhhcHBlbnMgaW4gcmVuZGVyIGxvb3BcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpOyAgICAgICBcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXg7XHJcblxyXG4gICAgICAgIHJldHVybiBkZWZhdWx0Q2FtZXJhO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBkZWZhdWx0IHNjZW5lIGNhbWVyYS5cclxuICAgICAqIENyZWF0ZXMgYSBkZWZhdWx0IGlmIHRoZSBjdXJyZW50IGNhbWVyYSBoYXMgbm90IGJlZW4gY29uc3RydWN0ZWQuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIEFjdGl2ZSBjYW1lcmEgKHBvc3NpYmx5IG51bGwpLlxyXG4gICAgICogQHBhcmFtIHZpZXdBc3BlY3QgVmlldyBhc3BlY3QgcmF0aW8uXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRTY2VuZUNhbWVyYSAoY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgdmlld0FzcGVjdCA6IG51bWJlcikgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSB7XHJcblxyXG4gICAgICAgIGlmIChjYW1lcmEpXHJcbiAgICAgICAgICAgIHJldHVybiBjYW1lcmE7XHJcblxyXG4gICAgICAgIGxldCBkZWZhdWx0Q2FtZXJhID0gQ2FtZXJhLmdldERlZmF1bHRDYW1lcmEodmlld0FzcGVjdCk7XHJcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRDYW1lcmE7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuZXhwb3J0IGludGVyZmFjZSBNUkV2ZW50IHtcclxuXHJcbiAgICB0eXBlICAgIDogRXZlbnRUeXBlO1xyXG4gICAgdGFyZ2V0ICA6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gRXZlbnRUeXBlIHtcclxuXHJcbiAgICBOb25lLFxyXG4gICAgTmV3TW9kZWwsXHJcbiAgICBNZXNoR2VuZXJhdGVcclxufVxyXG5cclxudHlwZSBMaXN0ZW5lciA9IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkO1xyXG50eXBlIExpc3RlbmVyQXJyYXkgPSBMaXN0ZW5lcltdW107ICAvLyBMaXN0ZW5lcltdW0V2ZW50VHlwZV07XHJcblxyXG4vKipcclxuICogRXZlbnQgTWFuYWdlclxyXG4gKiBHZW5lcmFsIGV2ZW50IG1hbmFnZW1lbnQgYW5kIGRpc3BhdGNoaW5nLlxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xyXG5cclxuICAgIF9saXN0ZW5lcnMgOiBMaXN0ZW5lckFycmF5O1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgIC8qXHJcbiAgICAgKiBDcmVhdGVzIEV2ZW50TWFuYWdlciBvYmplY3QuIEl0IG5lZWRzIHRvIGJlIGNhbGxlZCB3aXRoICcuY2FsbCcgdG8gYWRkIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGFuIG9iamVjdC5cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciB0byBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRoYXQgZ2V0cyBhZGRlZC5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdGhhdCBnZXRzIGFkZGVkLlxyXG4gICAgICovXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKHR5cGU6IEV2ZW50VHlwZSwgbGlzdGVuZXI6IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkICk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tFdmVudFR5cGUuTm9uZV0gPSBbXTtcclxuICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgZG9lcyBub3QgZXhpc3Q7IGNyZWF0ZVxyXG4gICAgICAgIGlmIChsaXN0ZW5lcnNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgbGlzdGVuZXJzW3R5cGVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBkbyBub3RoaW5nIGlmIGxpc3RlbmVyIHJlZ2lzdGVyZWRcclxuICAgICAgICBpZiAobGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgLy8gYWRkIG5ldyBsaXN0ZW5lciB0byB0aGlzIGV2ZW50XHJcbiAgICAgICAgICAgIGxpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYSBsaXN0ZW5lciBpcyByZWdpc3RlcmVkIGZvciBhbiBldmVudC5cclxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBjaGVjay5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdG8gY2hlY2suLlxyXG4gICAgICovXHJcbiAgICBoYXNFdmVudExpc3RlbmVyKHR5cGU6IEV2ZW50VHlwZSwgbGlzdGVuZXI6IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIC8vIG5vIGV2ZW50cyAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGV4aXN0cyBhbmQgbGlzdGVuZXIgcmVnaXN0ZXJlZCA9PiB0cnVlXHJcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyc1t0eXBlXSAhPT0gdW5kZWZpbmVkICYmIGxpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLSAxOyAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRoYXQgZ2V0cyByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lciBmdW5jdGlvbiB0aGF0IGdldHMgcmVtb3ZlZC5cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGUsIGxpc3RlbmVyOiAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZCk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHM7IGRvIG5vdGhpbmdcclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSBcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcbiAgICAgICAgbGV0IGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbdHlwZV07XHJcblxyXG4gICAgICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0ZW5lckFycmF5LmluZGV4T2YobGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGlmIGZvdW5kXHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lckFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRmlyZSBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHRhcmdldCBFdmVudCB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBldmVudCB0aGF0IGdldHMgZmlyZWQuXHJcbiAgICAgKi9cclxuICAgIGRpc3BhdGNoRXZlbnQodGFyZ2V0IDogYW55LCBldmVudFR5cGUgOiBFdmVudFR5cGUsIC4uLmFyZ3MgOiBhbnlbXSk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHMgZGVmaW5lZDsgZG8gbm90aGluZ1xyXG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGlzdGVuZXJzICAgICA9IHRoaXMuX2xpc3RlbmVyczsgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbZXZlbnRUeXBlXTtcclxuXHJcbiAgICAgICAgaWYgKGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRoZUV2ZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZSAgIDogZXZlbnRUeXBlLCAgICAgICAgIC8vIHR5cGVcclxuICAgICAgICAgICAgICAgIHRhcmdldCA6IHRhcmdldCAgICAgICAgICAgICAvLyBzZXQgdGFyZ2V0IHRvIGluc3RhbmNlIHRyaWdnZXJpbmcgdGhlIGV2ZW50XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGR1cGxpY2F0ZSBvcmlnaW5hbCBhcnJheSBvZiBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgbGV0IGFycmF5ID0gbGlzdGVuZXJBcnJheS5zbGljZSgwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdKHRoZUV2ZW50LCAuLi5hcmdzKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXHJcbi8vIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb20vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3NvaGFta2FtYW5pL3RocmVlLW9iamVjdC1sb2FkZXIvYmxvYi9tYXN0ZXIvc291cmNlL2luZGV4LmpzICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge1NlcnZpY2VzfSAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1N0b3BXYXRjaH0gIGZyb20gJ1N0b3BXYXRjaCdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBPQkpMb2FkZXIgKCBtYW5hZ2VyICkge1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9ICggbWFuYWdlciAhPT0gdW5kZWZpbmVkICkgPyBtYW5hZ2VyIDogVEhSRUUuRGVmYXVsdExvYWRpbmdNYW5hZ2VyO1xyXG5cclxuICAgIHRoaXMubWF0ZXJpYWxzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLnJlZ2V4cCA9IHtcclxuICAgICAgICAvLyB2IGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdmVydGV4X3BhdHRlcm4gICAgICAgICAgIDogL152XFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyB2biBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIG5vcm1hbF9wYXR0ZXJuICAgICAgICAgICA6IC9edm5cXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIHZ0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdXZfcGF0dGVybiAgICAgICAgICAgICAgIDogL152dFxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICBmYWNlX3ZlcnRleCAgICAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXHMrKC0/XFxkKylcXHMrKC0/XFxkKykoPzpcXHMrKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgIGZhY2VfdmVydGV4X3V2ICAgICAgICAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF91dl9ub3JtYWwgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF9ub3JtYWwgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBvIG9iamVjdF9uYW1lIHwgZyBncm91cF9uYW1lXHJcbiAgICAgICAgb2JqZWN0X3BhdHRlcm4gICAgICAgICAgIDogL15bb2ddXFxzKiguKyk/LyxcclxuICAgICAgICAvLyBzIGJvb2xlYW5cclxuICAgICAgICBzbW9vdGhpbmdfcGF0dGVybiAgICAgICAgOiAvXnNcXHMrKFxcZCt8b258b2ZmKS8sXHJcbiAgICAgICAgLy8gbXRsbGliIGZpbGVfcmVmZXJlbmNlXHJcbiAgICAgICAgbWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuIDogL15tdGxsaWIgLyxcclxuICAgICAgICAvLyB1c2VtdGwgbWF0ZXJpYWxfbmFtZVxyXG4gICAgICAgIG1hdGVyaWFsX3VzZV9wYXR0ZXJuICAgICA6IC9edXNlbXRsIC9cclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuT0JKTG9hZGVyLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogT0JKTG9hZGVyLFxyXG5cclxuICAgIGxvYWQ6IGZ1bmN0aW9uICggdXJsLCBvbkxvYWQsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKSB7XHJcblxyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRmlsZUxvYWRlciggc2NvcGUubWFuYWdlciApO1xyXG4gICAgICAgIGxvYWRlci5zZXRQYXRoKCB0aGlzLnBhdGggKTtcclxuICAgICAgICBsb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgICAgICBvbkxvYWQoIHNjb3BlLnBhcnNlKCB0ZXh0ICkgKTtcclxuXHJcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0UGF0aDogZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXRoID0gdmFsdWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNYXRlcmlhbHM6IGZ1bmN0aW9uICggbWF0ZXJpYWxzICkge1xyXG5cclxuICAgICAgICB0aGlzLm1hdGVyaWFscyA9IG1hdGVyaWFscztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIF9jcmVhdGVQYXJzZXJTdGF0ZSA6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlID0ge1xyXG4gICAgICAgICAgICBvYmplY3RzICA6IFtdLFxyXG4gICAgICAgICAgICBvYmplY3QgICA6IHt9LFxyXG5cclxuICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgdXZzICAgICAgOiBbXSxcclxuXHJcbiAgICAgICAgICAgIG1hdGVyaWFsTGlicmFyaWVzIDogW10sXHJcblxyXG4gICAgICAgICAgICBzdGFydE9iamVjdDogZnVuY3Rpb24gKCBuYW1lLCBmcm9tRGVjbGFyYXRpb24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgb2JqZWN0IChpbml0aWFsIGZyb20gcmVzZXQpIGlzIG5vdCBmcm9tIGEgZy9vIGRlY2xhcmF0aW9uIGluIHRoZSBwYXJzZWRcclxuICAgICAgICAgICAgICAgIC8vIGZpbGUuIFdlIG5lZWQgdG8gdXNlIGl0IGZvciB0aGUgZmlyc3QgcGFyc2VkIGcvbyB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPT09IGZhbHNlICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPSAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c01hdGVyaWFsID0gKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsID09PSAnZnVuY3Rpb24nID8gdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsKCkgOiB1bmRlZmluZWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSggdHJ1ZSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tRGVjbGFyYXRpb24gOiAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV2cyAgICAgIDogW11cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFscyA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TWF0ZXJpYWwgOiBmdW5jdGlvbiggbmFtZSwgbGlicmFyaWVzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5fZmluYWxpemUoIGZhbHNlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXcgdXNlbXRsIGRlY2xhcmF0aW9uIG92ZXJ3cml0ZXMgYW4gaW5oZXJpdGVkIG1hdGVyaWFsLCBleGNlcHQgaWYgZmFjZXMgd2VyZSBkZWNsYXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGUgbWF0ZXJpYWwsIHRoZW4gaXQgbXVzdCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBwcmV2aW91cyAmJiAoIHByZXZpb3VzLmluaGVyaXRlZCB8fCBwcmV2aW91cy5ncm91cENvdW50IDw9IDAgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5zcGxpY2UoIHByZXZpb3VzLmluZGV4LCAxICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogdGhpcy5tYXRlcmlhbHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogKCBBcnJheS5pc0FycmF5KCBsaWJyYXJpZXMgKSAmJiBsaWJyYXJpZXMubGVuZ3RoID4gMCA/IGxpYnJhcmllc1sgbGlicmFyaWVzLmxlbmd0aCAtIDEgXSA6ICcnICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbW9vdGggICAgIDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuc21vb3RoIDogdGhpcy5zbW9vdGggKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiAoIHByZXZpb3VzICE9PSB1bmRlZmluZWQgPyBwcmV2aW91cy5ncm91cEVuZCA6IDAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmVkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogKCB0eXBlb2YgaW5kZXggPT09ICdudW1iZXInID8gaW5kZXggOiB0aGlzLmluZGV4ICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG10bGxpYiAgICAgOiB0aGlzLm10bGxpYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21vb3RoICAgICA6IHRoaXMuc21vb3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0IDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZC5jbG9uZSA9IHRoaXMuY2xvbmUuYmluZChjbG9uZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKCBtYXRlcmlhbCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGVyaWFsc1sgdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBfZmluYWxpemUgOiBmdW5jdGlvbiggZW5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RNdWx0aU1hdGVyaWFsID0gdGhpcy5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBsYXN0TXVsdGlNYXRlcmlhbCAmJiBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9PT0gLTEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPSB0aGlzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cENvdW50ID0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgLSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cFN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuaW5oZXJpdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgb2JqZWN0cyB0YWlsIG1hdGVyaWFscyBpZiBubyBmYWNlIGRlY2xhcmF0aW9ucyBmb2xsb3dlZCB0aGVtIGJlZm9yZSBhIG5ldyBvL2cgc3RhcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSB0aGlzLm1hdGVyaWFscy5sZW5ndGggLSAxOyBtaSA+PSAwOyBtaS0tICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHNbbWldLmdyb3VwQ291bnQgPD0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMuc3BsaWNlKCBtaSwgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEd1YXJhbnRlZSBhdCBsZWFzdCBvbmUgZW1wdHkgbWF0ZXJpYWwsIHRoaXMgbWFrZXMgdGhlIGNyZWF0aW9uIGxhdGVyIG1vcmUgc3RyYWlnaHQgZm9yd2FyZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID09PSAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRoaXMuc21vb3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0TXVsdGlNYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJbmhlcml0IHByZXZpb3VzIG9iamVjdHMgbWF0ZXJpYWwuXHJcbiAgICAgICAgICAgICAgICAvLyBTcGVjIHRlbGxzIHVzIHRoYXQgYSBkZWNsYXJlZCBtYXRlcmlhbCBtdXN0IGJlIHNldCB0byBhbGwgb2JqZWN0cyB1bnRpbCBhIG5ldyBtYXRlcmlhbCBpcyBkZWNsYXJlZC5cclxuICAgICAgICAgICAgICAgIC8vIElmIGEgdXNlbXRsIGRlY2xhcmF0aW9uIGlzIGVuY291bnRlcmVkIHdoaWxlIHRoaXMgbmV3IG9iamVjdCBpcyBiZWluZyBwYXJzZWQsIGl0IHdpbGxcclxuICAgICAgICAgICAgICAgIC8vIG92ZXJ3cml0ZSB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLiBFeGNlcHRpb24gYmVpbmcgdGhhdCB0aGVyZSB3YXMgYWxyZWFkeSBmYWNlIGRlY2xhcmF0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGluaGVyaXRlZCBtYXRlcmlhbCwgdGhlbiBpdCB3aWxsIGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggcHJldmlvdXNNYXRlcmlhbCAmJiBwcmV2aW91c01hdGVyaWFsLm5hbWUgJiYgdHlwZW9mIHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUgPT09IFwiZnVuY3Rpb25cIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlY2xhcmVkID0gcHJldmlvdXNNYXRlcmlhbC5jbG9uZSggMCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlY2xhcmVkLmluaGVyaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QubWF0ZXJpYWxzLnB1c2goIGRlY2xhcmVkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKCB0aGlzLm9iamVjdCApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZpbmFsaXplIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VWZXJ0ZXhJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VOb3JtYWxJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VVVkluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMiApICogMjtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRWZXJ0ZXg6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVmVydGV4TGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGROb3JtYWwgOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMubm9ybWFscztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS5ub3JtYWxzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRVVjogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFVWTGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEZhY2U6IGZ1bmN0aW9uICggYSwgYiwgYywgZCwgdWEsIHViLCB1YywgdWQsIG5hLCBuYiwgbmMsIG5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlhID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBhLCB2TGVuICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWIgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGIsIHZMZW4gKTtcclxuICAgICAgICAgICAgICAgIHZhciBpYyA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYywgdkxlbiApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBkLCB2TGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB1YSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlhID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVhLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGliID0gdGhpcy5wYXJzZVVWSW5kZXgoIHViLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGljID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVjLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVkLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBuYSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBOb3JtYWxzIGFyZSBtYW55IHRpbWVzIHRoZSBzYW1lLiBJZiBzbywgc2tpcCBmdW5jdGlvbiBjYWxsIGFuZCBwYXJzZUludC5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbkxlbiA9IHRoaXMubm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWEgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5hLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGliID0gbmEgPT09IG5iID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5iLCBuTGVuICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWMgPSBuYSA9PT0gbmMgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmMsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5kLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZExpbmVHZW9tZXRyeTogZnVuY3Rpb24gKCB2ZXJ0aWNlcywgdXZzICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Lmdlb21ldHJ5LnR5cGUgPSAnTGluZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdmkgPSAwLCBsID0gdmVydGljZXMubGVuZ3RoOyB2aSA8IGw7IHZpICsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleExpbmUoIHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggdmVydGljZXNbIHZpIF0sIHZMZW4gKSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdXZpID0gMCwgbCA9IHV2cy5sZW5ndGg7IHV2aSA8IGw7IHV2aSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVVkxpbmUoIHRoaXMucGFyc2VVVkluZGV4KCB1dnNbIHV2aSBdLCB1dkxlbiApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzdGF0ZS5zdGFydE9iamVjdCggJycsIGZhbHNlICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlOiBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ09CSkxvYWRlci5wYXJzZScpOyAgICAgICAgXHJcblxyXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX2NyZWF0ZVBhcnNlclN0YXRlKCk7XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxyXFxuJyApICE9PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIFN0cmluZy5zcGxpdCB3aXRoIHJlZ2V4IHRoYXQgc3BsaXRzIG9uIGJvdGhcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggL1xcclxcbi9nLCAnXFxuJyApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxcXFxcbicgKSAhPT0gLSAxKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBqb2luIGxpbmVzIHNlcGFyYXRlZCBieSBhIGxpbmUgY29udGludWF0aW9uIGNoYXJhY3RlciAoXFwpXHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXFxcXFxuL2csICcnICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxpbmVzID0gdGV4dC5zcGxpdCggJ1xcbicgKTtcclxuICAgICAgICB2YXIgbGluZSA9ICcnLCBsaW5lRmlyc3RDaGFyID0gJycsIGxpbmVTZWNvbmRDaGFyID0gJyc7XHJcbiAgICAgICAgdmFyIGxpbmVMZW5ndGggPSAwO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gRmFzdGVyIHRvIGp1c3QgdHJpbSBsZWZ0IHNpZGUgb2YgdGhlIGxpbmUuIFVzZSBpZiBhdmFpbGFibGUuXHJcbiAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAvLyB2YXIgdHJpbUxlZnQgPSAoIHR5cGVvZiAnJy50cmltTGVmdCA9PT0gJ2Z1bmN0aW9uJyApO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF07XHJcblxyXG4gICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAvLyBsaW5lID0gdHJpbUxlZnQgPyBsaW5lLnRyaW1MZWZ0KCkgOiBsaW5lLnRyaW0oKTtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgbGluZUxlbmd0aCA9IGxpbmUubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsaW5lTGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBsaW5lRmlyc3RDaGFyID0gbGluZS5jaGFyQXQoIDAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEB0b2RvIGludm9rZSBwYXNzZWQgaW4gaGFuZGxlciBpZiBhbnlcclxuICAgICAgICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAnIycgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJ3YnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxpbmVTZWNvbmRDaGFyID0gbGluZS5jaGFyQXQoIDEgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAnICcgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC52ZXJ0ZXhfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInYgMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICduJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm5vcm1hbF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm5vcm1hbHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICd0JyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnV2X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAxICAgICAgMlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudXZzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIHZlcnRleC9ub3JtYWwvdXYgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwiZlwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91dl9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICAgNyAgICA4ICAgIDkgICAxMCAgICAgICAgIDExICAgICAgICAgMTJcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMS8xIDIvMi8yIDMvMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA3IF0sIHJlc3VsdFsgMTAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDggXSwgcmVzdWx0WyAxMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOSBdLCByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXYuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMSAyLzIgMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfbm9ybWFsLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxLy8xIDIvLzIgMy8vM1wiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgMSAgICAyICAgIDMgICA0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDIgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNCBdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBmYWNlIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lRmlyc3RDaGFyID09PSBcImxcIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVBhcnRzID0gbGluZS5zdWJzdHJpbmcoIDEgKS50cmltKCkuc3BsaXQoIFwiIFwiICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVZlcnRpY2VzID0gW10sIGxpbmVVVnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmUuaW5kZXhPZiggXCIvXCIgKSA9PT0gLSAxICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsaW5lVmVydGljZXMgPSBsaW5lUGFydHM7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGxpID0gMCwgbGxlbiA9IGxpbmVQYXJ0cy5sZW5ndGg7IGxpIDwgbGxlbjsgbGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBsaW5lUGFydHNbIGxpIF0uc3BsaXQoIFwiL1wiICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAwIF0gIT09IFwiXCIgKSBsaW5lVmVydGljZXMucHVzaCggcGFydHNbIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAxIF0gIT09IFwiXCIgKSBsaW5lVVZzLnB1c2goIHBhcnRzWyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXRlLmFkZExpbmVHZW9tZXRyeSggbGluZVZlcnRpY2VzLCBsaW5lVVZzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm9iamVjdF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG8gb2JqZWN0X25hbWVcclxuICAgICAgICAgICAgICAgIC8vIG9yXHJcbiAgICAgICAgICAgICAgICAvLyBnIGdyb3VwX25hbWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXT1JLQVJPVU5EOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yODY5XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgbmFtZSA9IHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gKCBcIiBcIiArIHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKSApLnN1YnN0ciggMSApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLnN0YXJ0T2JqZWN0KCBuYW1lICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF91c2VfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWF0ZXJpYWxcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5vYmplY3Quc3RhcnRNYXRlcmlhbCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCksIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG10bCBmaWxlXHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMucHVzaCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuc21vb3RoaW5nX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBIYW5kbGUgZmlsZXMgdGhhdCBoYXZlIHZhcnlpbmcgc21vb3RoIHZhbHVlcyBmb3IgYSBzZXQgb2YgZmFjZXMgaW5zaWRlIG9uZSBnZW9tZXRyeSxcclxuICAgICAgICAgICAgICAgIC8vIGJ1dCBkb2VzIG5vdCBkZWZpbmUgYSB1c2VtdGwgZm9yIGVhY2ggZmFjZSBzZXQuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhbmQgYSBkdW1teSBtYXRlcmlhbCBjcmVhdGVkIChsYXRlciBNdWx0aU1hdGVyaWFsIGFuZCBnZW9tZXRyeSBncm91cHMpLlxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyByZXF1aXJlcyBzb21lIGNhcmUgdG8gbm90IGNyZWF0ZSBleHRyYSBtYXRlcmlhbCBvbiBlYWNoIHNtb290aCB2YWx1ZSBmb3IgXCJub3JtYWxcIiBvYmogZmlsZXMuXHJcbiAgICAgICAgICAgICAgICAvLyB3aGVyZSBleHBsaWNpdCB1c2VtdGwgZGVmaW5lcyBnZW9tZXRyeSBncm91cHMuXHJcbiAgICAgICAgICAgICAgICAvLyBFeGFtcGxlIGFzc2V0OiBleGFtcGxlcy9tb2RlbHMvb2JqL2NlcmJlcnVzL0NlcmJlcnVzLm9ialxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdFsgMSBdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGh0dHA6Ly9wYXVsYm91cmtlLm5ldC9kYXRhZm9ybWF0cy9vYmovXHJcbiAgICAgICAgICAgICAgICAgKiBvclxyXG4gICAgICAgICAgICAgICAgICogaHR0cDovL3d3dy5jcy51dGFoLmVkdS9+Ym91bG9zL2NzMzUwNS9vYmpfc3BlYy5wZGZcclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBGcm9tIGNoYXB0ZXIgXCJHcm91cGluZ1wiIFN5bnRheCBleHBsYW5hdGlvbiBcInMgZ3JvdXBfbnVtYmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgKiBcImdyb3VwX251bWJlciBpcyB0aGUgc21vb3RoaW5nIGdyb3VwIG51bWJlci4gVG8gdHVybiBvZmYgc21vb3RoaW5nIGdyb3VwcywgdXNlIGEgdmFsdWUgb2YgMCBvciBvZmYuXHJcbiAgICAgICAgICAgICAgICAgKiBQb2x5Z29uYWwgZWxlbWVudHMgdXNlIGdyb3VwIG51bWJlcnMgdG8gcHV0IGVsZW1lbnRzIGluIGRpZmZlcmVudCBzbW9vdGhpbmcgZ3JvdXBzLiBGb3IgZnJlZS1mb3JtXHJcbiAgICAgICAgICAgICAgICAgKiBzdXJmYWNlcywgc21vb3RoaW5nIGdyb3VwcyBhcmUgZWl0aGVyIHR1cm5lZCBvbiBvciBvZmY7IHRoZXJlIGlzIG5vIGRpZmZlcmVuY2UgYmV0d2VlbiB2YWx1ZXMgZ3JlYXRlclxyXG4gICAgICAgICAgICAgICAgICogdGhhbiAwLlwiXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdC5zbW9vdGggPSAoIHZhbHVlICE9PSAnMCcgJiYgdmFsdWUgIT09ICdvZmYnICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gc3RhdGUub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc21vb3RoID0gc3RhdGUub2JqZWN0LnNtb290aDtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBudWxsIHRlcm1pbmF0ZWQgZmlsZXMgd2l0aG91dCBleGNlcHRpb25cclxuICAgICAgICAgICAgICAgIGlmICggbGluZSA9PT0gJ1xcMCcgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUuZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgLy9jb250YWluZXIubWF0ZXJpYWxMaWJyYXJpZXMgPSBbXS5jb25jYXQoIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcbiAgICAgICAgKDxhbnk+Y29udGFpbmVyKS5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsID0gc3RhdGUub2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG9iamVjdCA9IHN0YXRlLm9iamVjdHNbIGkgXTtcclxuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5O1xyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzID0gb2JqZWN0Lm1hdGVyaWFscztcclxuICAgICAgICAgICAgdmFyIGlzTGluZSA9ICggZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmUnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIG8vZyBsaW5lIGRlY2xhcmF0aW9ucyB0aGF0IGRpZCBub3QgZm9sbG93IHdpdGggYW55IGZhY2VzXHJcbiAgICAgICAgICAgIGlmICggZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnVmZmVyZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHJcbiAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudmVydGljZXMgKSwgMyApICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdub3JtYWwnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS5ub3JtYWxzICksIDMgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBnZW9tZXRyeS51dnMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnV2cyApLCAyICkgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBtYXRlcmlhbHNcclxuICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgLy92YXIgY3JlYXRlZE1hdGVyaWFscyA9IFtdOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjcmVhdGVkTWF0ZXJpYWxzIDogVEhSRUUuTWF0ZXJpYWxbXSA9IFtdOyAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VNYXRlcmlhbCA9IG1hdGVyaWFsc1ttaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscyAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFscy5jcmVhdGUoIHNvdXJjZU1hdGVyaWFsLm5hbWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbXRsIGV0Yy4gbG9hZGVycyBwcm9iYWJseSBjYW4ndCBjcmVhdGUgbGluZSBtYXRlcmlhbHMgY29ycmVjdGx5LCBjb3B5IHByb3BlcnRpZXMgdG8gYSBsaW5lIG1hdGVyaWFsLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNMaW5lICYmIG1hdGVyaWFsICYmICEgKCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWxMaW5lID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsTGluZS5jb3B5KCBtYXRlcmlhbCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IG1hdGVyaWFsTGluZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICEgbWF0ZXJpYWwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpIDogbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5uYW1lID0gc291cmNlTWF0ZXJpYWwubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2hhZGluZyA9IHNvdXJjZU1hdGVyaWFsLnNtb290aCA/IFRIUkVFLlNtb290aFNoYWRpbmcgOiBUSFJFRS5GbGF0U2hhZGluZztcclxuXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkTWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1lc2hcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBjcmVhdGVkTWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRHcm91cCggc291cmNlTWF0ZXJpYWwuZ3JvdXBTdGFydCwgc291cmNlTWF0ZXJpYWwuZ3JvdXBDb3VudCwgbWkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgLy9tZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFscyApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHMgKSApO1xyXG4gICAgICAgICAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbMF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsICkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgIC8vbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZU1hdGVyaWFscykgKTtcclxuICAgICAgICAgICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsKSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGQoIG1lc2ggKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZyk7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhLCBTdGFuZGFyZFZpZXd9ICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzLCBPYmplY3ROYW1lc30gICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIlZpZXdlclwiXHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIENhbWVyYUNvbnRyb2xzXHJcbiAqL1xyXG5jbGFzcyBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgZml0VmlldyAgICAgICAgICAgIDogKCkgPT4gdm9pZDtcclxuICAgIGFkZENhbWVyYUhlbHBlciAgICA6ICgpID0+IHZvaWQ7XHJcbiAgICBcclxuICAgIHN0YW5kYXJkVmlldyAgICAgICAgICA6IFN0YW5kYXJkVmlldztcclxuICAgIGZpZWxkT2ZWaWV3OiBudW1iZXIgICA7XHJcbiAgICBuZWFyQ2xpcHBpbmdQbGFuZSAgICAgOiBudW1iZXI7XHJcbiAgICBmYXJDbGlwcGluZ1BsYW5lICAgICAgOiBudW1iZXI7XHJcbiAgICBib3VuZENsaXBwaW5nUGxhbmVzICAgOiAoKSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBmaXRWaWV3OiAoKSA9PiBhbnksIGFkZEN3bWVyYUhlbHBlcjogKCkgPT4gYW55LCBib3VuZENsaXBwaW5nUGxhbmVzOiAoKSA9PiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5maXRWaWV3ICAgICAgICAgPSBmaXRWaWV3O1xyXG4gICAgICAgIHRoaXMuYWRkQ2FtZXJhSGVscGVyID0gYWRkQ3dtZXJhSGVscGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhbmRhcmRWaWV3ICAgICAgICAgID0gU3RhbmRhcmRWaWV3LkZyb250O1xyXG4gICAgICAgIHRoaXMuZmllbGRPZlZpZXcgICAgICAgICAgID0gY2FtZXJhLmZvdjtcclxuICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lICAgICA9IGNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSAgICAgID0gY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLmJvdW5kQ2xpcHBpbmdQbGFuZXMgPSBib3VuZENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogY2FtZXJhIFVJIENvbnRyb2xzLlxyXG4gKi8gICAgXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmFDb250cm9scyB7XHJcblxyXG4gICAgX3ZpZXdlciAgICAgICAgICAgICAgICAgICA6IFZpZXdlcjsgICAgICAgICAgICAgICAgICAgICAvLyBhc3NvY2lhdGVkIHZpZXdlclxyXG4gICAgX2NhbWVyYVNldHRpbmdzICAgICAgICAgICA6IENhbWVyYVNldHRpbmdzOyAgICAgICAgICAgICAvLyBVSSBzZXR0aW5nc1xyXG4gICAgX2NvbnRyb2xOZWFyQ2xpcHBpbmdQbGFuZSA6IGRhdC5HVUlDb250cm9sbGVyO1xyXG4gICAgX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lICA6IGRhdC5HVUlDb250cm9sbGVyO1xyXG4gICAgXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIENhbWVyYUNvbnRyb2xzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iodmlld2VyIDogVmlld2VyKSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyID0gdmlld2VyO1xyXG5cclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuICAgIC8qKlxyXG4gICAgICogRml0cyB0aGUgYWN0aXZlIHZpZXcuXHJcbiAgICAgKi9cclxuICAgIGZpdFZpZXcoKSA6IHZvaWQgeyBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92aWV3ZXIuZml0VmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIGNhbWVyYSB2aXN1YWxpemF0aW9uIGdyYXBoaWMgdG8gdGhlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBhZGRDYW1lcmFIZWxwZXIoKSA6IHZvaWQgeyBcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlQWxsQnlOYW1lKHRoaXMuX3ZpZXdlci5zY2VuZSwgT2JqZWN0TmFtZXMuQ2FtZXJhSGVscGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBXb3JsZFxyXG4gICAgICAgIEdyYXBoaWNzLmFkZENhbWVyYUhlbHBlcih0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLl92aWV3ZXIuc2NlbmUsIHRoaXMuX3ZpZXdlci5tb2RlbCk7XHJcblxyXG4gICAgICAgIC8vIFZpZXdcclxuICAgICAgICBsZXQgbW9kZWxWaWV3ID0gR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QodGhpcy5fdmlld2VyLm1vZGVsLCB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbGV0IGNhbWVyYVZpZXcgPSBDYW1lcmEuZ2V0RGVmYXVsdENhbWVyYSh0aGlzLl92aWV3ZXIuYXNwZWN0UmF0aW8pO1xyXG4gICAgICAgIEdyYXBoaWNzLmFkZENhbWVyYUhlbHBlcihjYW1lcmFWaWV3LCB0aGlzLl92aWV3ZXIuc2NlbmUsIG1vZGVsVmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3JjZSB0aGUgZmFyIGNsaXBwaW5nIHBsYW5lIHRvIHRoZSBtb2RlbCBleHRlbnRzLlxyXG4gICAgICovXHJcbiAgICBib3VuZENsaXBwaW5nUGxhbmVzKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY2xpcHBpbmdQbGFuZXMgPSBDYW1lcmEuZ2V0Qm91bmRpbmdDbGlwcGluZ1BsYW5lcyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLl92aWV3ZXIubW9kZWwpO1xyXG5cclxuICAgICAgICAvLyBjYW1lcmFcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSBjbGlwcGluZ1BsYW5lcy5uZWFyO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEuZmFyICA9IGNsaXBwaW5nUGxhbmVzLmZhcjtcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLy8gVUkgY29udHJvbHNcclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5uZWFyQ2xpcHBpbmdQbGFuZSA9IGNsaXBwaW5nUGxhbmVzLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lLm1pbihjbGlwcGluZ1BsYW5lcy5uZWFyKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sTmVhckNsaXBwaW5nUGxhbmUubWF4IChjbGlwcGluZ1BsYW5lcy5mYXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzLmZhckNsaXBwaW5nUGxhbmUgID0gY2xpcHBpbmdQbGFuZXMuZmFyO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lLm1pbihjbGlwcGluZ1BsYW5lcy5uZWFyKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sRmFyQ2xpcHBpbmdQbGFuZS5tYXgoY2xpcHBpbmdQbGFuZXMuZmFyKTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlldyBzZXR0aW5ncyB0aGF0IGFyZSBjb250cm9sbGFibGUgYnkgdGhlIHVzZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncyA9IG5ldyBDYW1lcmFTZXR0aW5ncyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLmZpdFZpZXcuYmluZCh0aGlzKSwgdGhpcy5hZGRDYW1lcmFIZWxwZXIuYmluZCh0aGlzKSwgdGhpcy5ib3VuZENsaXBwaW5nUGxhbmVzLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBJbml0IGRhdC5ndWkgYW5kIGNvbnRyb2xzIGZvciB0aGUgVUlcclxuICAgICAgICBsZXQgZ3VpID0gbmV3IGRhdC5HVUkoe1xyXG4gICAgICAgICAgICBhdXRvUGxhY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICB3aWR0aDogMzIwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBtZW51RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fdmlld2VyLmNvbnRhaW5lcklkKTtcclxuICAgICAgICBtZW51RGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IGNhbWVyYU9wdGlvbnMgPSBndWkuYWRkRm9sZGVyKCdDYW1lcmEgT3B0aW9ucycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZpdCBWaWV3XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGaXRWaWV3ID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdmaXRWaWV3JykubmFtZSgnRml0IFZpZXcnKTtcclxuXHJcbiAgICAgICAgLy8gQ2FtZXJhSGVscGVyXHJcbiAgICAgICAgbGV0IGNvbnRyb2xDYW1lcmFIZWxwZXIgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2FkZENhbWVyYUhlbHBlcicpLm5hbWUoJ0NhbWVyYSBIZWxwZXInKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBTdGFuZGFyZCBWaWV3c1xyXG4gICAgICAgIGxldCB2aWV3T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgRnJvbnQgICAgICAgOiBTdGFuZGFyZFZpZXcuRnJvbnQsXHJcbiAgICAgICAgICAgIEJhY2sgICAgICAgIDogU3RhbmRhcmRWaWV3LkJhY2ssXHJcbiAgICAgICAgICAgIFRvcCAgICAgICAgIDogU3RhbmRhcmRWaWV3LlRvcCxcclxuICAgICAgICAgICAgSXNvbWV0cmljICAgOiBTdGFuZGFyZFZpZXcuSXNvbWV0cmljLFxyXG4gICAgICAgICAgICBMZWZ0ICAgICAgICA6IFN0YW5kYXJkVmlldy5MZWZ0LFxyXG4gICAgICAgICAgICBSaWdodCAgICAgICA6IFN0YW5kYXJkVmlldy5SaWdodCxcclxuICAgICAgICAgICAgQm90dG9tICAgICAgOiBTdGFuZGFyZFZpZXcuQm90dG9tXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTdGFuZGFyZFZpZXdzID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdzdGFuZGFyZFZpZXcnLCB2aWV3T3B0aW9ucykubmFtZSgnU3RhbmRhcmQgVmlldycpLmxpc3RlbigpO1xyXG4gICAgICAgIGNvbnRyb2xTdGFuZGFyZFZpZXdzLm9uQ2hhbmdlICgodmlld1NldHRpbmcgOiBzdHJpbmcpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3IDogU3RhbmRhcmRWaWV3ID0gcGFyc2VJbnQodmlld1NldHRpbmcsIDEwKTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyh2aWV3KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIGxldCBtaW5pbXVtID0gMjU7XHJcbiAgICAgICAgbGV0IG1heGltdW0gPSA3NTtcclxuICAgICAgICBsZXQgc3RlcFNpemUgPSAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXcgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2ZpZWxkT2ZWaWV3JykubmFtZSgnRmllbGQgb2YgVmlldycpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7O1xyXG4gICAgICAgIGNvbnRyb2xGaWVsZE9mVmlldy5vbkNoYW5nZShmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZvdiA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gTmVhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAwLjE7XHJcbiAgICAgICAgbWF4aW11bSAgPSAxMDA7XHJcbiAgICAgICAgc3RlcFNpemUgPSAgIDAuMTtcclxuICAgICAgICB0aGlzLl9jb250cm9sTmVhckNsaXBwaW5nUGxhbmUgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ25lYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnTmVhciBDbGlwcGluZyBQbGFuZScpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAgIDE7XHJcbiAgICAgICAgbWF4aW11bSAgPSAxMDAwMDtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAgICAwLjE7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbEZhckNsaXBwaW5nUGxhbmUgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2ZhckNsaXBwaW5nUGxhbmUnKS5uYW1lKCdGYXIgQ2xpcHBpbmcgUGxhbmUnKS5taW4obWluaW11bSkubWF4KG1heGltdW0pLnN0ZXAoc3RlcFNpemUpLmxpc3RlbigpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gQm91bmQgQ2xpcHBpbmcgUGxhbmVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xCb3VuZENsaXBwaW5nUGxhbmVzID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdib3VuZENsaXBwaW5nUGxhbmVzJykubmFtZSgnQm91bmQgQ2xpcHBpbmcgUGxhbmVzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FtZXJhT3B0aW9ucy5vcGVuKCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3luY2hyb25pemUgdGhlIFVJIGNhbWVyYSBzZXR0aW5ncyB3aXRoIHRoZSB0YXJnZXQgY2FtZXJhLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBcclxuICAgICAqL1xyXG4gICAgc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncyAodmlldz8gOiBTdGFuZGFyZFZpZXcpIHtcclxuXHJcbiAgICAgICAgaWYgKHZpZXcpXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzLnN0YW5kYXJkVmlldyA9IHZpZXc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhU2V0dGluZ3MubmVhckNsaXBwaW5nUGxhbmUgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhU2V0dGluZ3MuZmFyQ2xpcHBpbmdQbGFuZSAgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5maWVsZE9mVmlldyAgICAgICA9IHRoaXMuX3ZpZXdlci5jYW1lcmEuZm92O1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcbiAgICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGVyaWFsc1xyXG4gKiBHZW5lcmFsIFRIUkVFLmpzIE1hdGVyaWFsIGNsYXNzZXMgYW5kIGhlbHBlcnNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBNYXRlcmlhbHNcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdGV4dHVyZSBtYXRlcmlhbCBmcm9tIGFuIGltYWdlIFVSTC5cclxuICAgICAqIEBwYXJhbSBpbWFnZSBJbWFnZSB0byB1c2UgaW4gdGV4dHVyZS5cclxuICAgICAqIEByZXR1cm5zIFRleHR1cmUgbWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVUZXh0dXJlTWF0ZXJpYWwgKGltYWdlIDogSFRNTEltYWdlRWxlbWVudCkgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0ZXh0dXJlICAgICAgICAgOiBUSFJFRS5UZXh0dXJlLFxyXG4gICAgICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShpbWFnZSk7XHJcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSAgICAgPSB0cnVlO1xyXG4gICAgICAgIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIG1hZ25pZmljYXRpb24gYW5kIG1pbmlmaWNhdGlvbiBmaWx0ZXJzIHNhbXBsZSB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMgd2hlbiBtYXBwaW5nIHRvIGEgcGl4ZWwuXHJcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIGRlZmF1bHQgbW9kZXMgb3ZlcnNhbXBsZSB3aGljaCBsZWFkcyB0byBibGVuZGluZyB3aXRoIHRoZSBibGFjayBiYWNrZ3JvdW5kLiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHByb2R1Y2VzIGNvbG9yZWQgKGJsYWNrKSBhcnRpZmFjdHMgYXJvdW5kIHRoZSBlZGdlcyBvZiB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMuXHJcbiAgICAgICAgdGV4dHVyZS5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAsIDEuMCk7XHJcblxyXG4gICAgICAgIHRleHR1cmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge21hcDogdGV4dHVyZX0gKTtcclxuICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGV4dHVyZU1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIENyZWF0ZSBhIGJ1bXAgbWFwIFBob25nIG1hdGVyaWFsIGZyb20gYSB0ZXh0dXJlIG1hcC5cclxuICAgICAqIEBwYXJhbSBkZXNpZ25UZXh0dXJlIEJ1bXAgbWFwIHRleHR1cmUuXHJcbiAgICAgKiBAcmV0dXJucyBQaG9uZyBidW1wIG1hcHBlZCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZU1lc2hQaG9uZ01hdGVyaWFsKGRlc2lnblRleHR1cmUgOiBUSFJFRS5UZXh0dXJlKSAgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgIGNvbG9yICAgOiAweGZmZmZmZixcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBidW1wTWFwICAgOiBkZXNpZ25UZXh0dXJlLFxyXG4gICAgICAgICAgICBidW1wU2NhbGUgOiAtMS4wLFxyXG5cclxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuU21vb3RoU2hhZGluZyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdHJhbnNwYXJlbnQgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBUcmFuc3BhcmVudCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVRyYW5zcGFyZW50TWF0ZXJpYWwoKSAgOiBUSFJFRS5NYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yIDogMHgwMDAwMDAsIG9wYWNpdHkgOiAwLjAsIHRyYW5zcGFyZW50IDogdHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuIiwiLyoqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ3Rzb3AvdGhyZWVqcy10cmFja2JhbGwtY29udHJvbHNcbiAqIEBhdXRob3IgRWJlcmhhcmQgR3JhZXRoZXIgLyBodHRwOi8vZWdyYWV0aGVyLmNvbS9cbiAqIEBhdXRob3IgTWFyayBMdW5kaW4gXHQvIGh0dHA6Ly9tYXJrLWx1bmRpbi5jb21cbiAqIEBhdXRob3IgU2ltb25lIE1hbmluaSAvIGh0dHA6Ly9kYXJvbjEzMzcuZ2l0aHViLmlvXG4gKiBAYXV0aG9yIEx1Y2EgQW50aWdhIFx0LyBodHRwOi8vbGFudGlnYS5naXRodWIuaW9cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmFja2JhbGxDb250cm9scyAoIG9iamVjdCwgZG9tRWxlbWVudCApIHtcblxuXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHR2YXIgU1RBVEUgPSB7IE5PTkU6IC0gMSwgUk9UQVRFOiAwLCBaT09NOiAxLCBQQU46IDIsIFRPVUNIX1JPVEFURTogMywgVE9VQ0hfWk9PTV9QQU46IDQgfTtcblxuXHR0aGlzLm9iamVjdCA9IG9iamVjdDtcblx0dGhpcy5kb21FbGVtZW50ID0gKCBkb21FbGVtZW50ICE9PSB1bmRlZmluZWQgKSA/IGRvbUVsZW1lbnQgOiBkb2N1bWVudDtcblxuXHQvLyBBUElcblxuXHR0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG5cdHRoaXMuc2NyZWVuID0geyBsZWZ0OiAwLCB0b3A6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcblxuXHR0aGlzLnJvdGF0ZVNwZWVkID0gMS4wO1xuXHR0aGlzLnpvb21TcGVlZCA9IDEuMjtcblx0dGhpcy5wYW5TcGVlZCA9IDAuMztcblxuXHR0aGlzLm5vUm90YXRlID0gZmFsc2U7XG5cdHRoaXMubm9ab29tID0gZmFsc2U7XG5cdHRoaXMubm9QYW4gPSBmYWxzZTtcblxuXHR0aGlzLnN0YXRpY01vdmluZyA9IHRydWU7XG5cdHRoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjI7XG5cblx0dGhpcy5taW5EaXN0YW5jZSA9IDA7XG5cdHRoaXMubWF4RGlzdGFuY2UgPSBJbmZpbml0eTtcblxuXHR0aGlzLmtleXMgPSBbIDY1IC8qQSovLCA4MyAvKlMqLywgNjggLypEKi8gXTtcblxuXHQvLyBpbnRlcm5hbHNcblxuXHR0aGlzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0dmFyIEVQUyA9IDAuMDAwMDAxO1xuXG5cdHZhciBsYXN0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdHZhciBfc3RhdGUgPSBTVEFURS5OT05FLFxuXHRfcHJldlN0YXRlID0gU1RBVEUuTk9ORSxcblxuXHRfZXllID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblxuXHRfbW92ZVByZXYgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfbW92ZUN1cnIgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXG5cdF9sYXN0QXhpcyA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdF9sYXN0QW5nbGUgPSAwLFxuXG5cdF96b29tU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfem9vbUVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cblx0X3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSAwLFxuXHRfdG91Y2hab29tRGlzdGFuY2VFbmQgPSAwLFxuXG5cdF9wYW5TdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF9wYW5FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdC8vIGZvciByZXNldFxuXG5cdHRoaXMudGFyZ2V0MCA9IHRoaXMudGFyZ2V0LmNsb25lKCk7XG5cdHRoaXMucG9zaXRpb24wID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0dGhpcy51cDAgPSB0aGlzLm9iamVjdC51cC5jbG9uZSgpO1xuXG5cdC8vIGV2ZW50c1xuXG5cdHZhciBjaGFuZ2VFdmVudCA9IHsgdHlwZTogJ2NoYW5nZScgfTtcblx0dmFyIHN0YXJ0RXZlbnQgPSB7IHR5cGU6ICdzdGFydCcgfTtcblx0dmFyIGVuZEV2ZW50ID0geyB0eXBlOiAnZW5kJyB9O1xuXG5cblx0Ly8gbWV0aG9kc1xuXG5cdHRoaXMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCB0aGlzLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ICkge1xuXG5cdFx0XHR0aGlzLnNjcmVlbi5sZWZ0ID0gMDtcblx0XHRcdHRoaXMuc2NyZWVuLnRvcCA9IDA7XG5cdFx0XHR0aGlzLnNjcmVlbi53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdFx0dGhpcy5zY3JlZW4uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIGJveCA9IHRoaXMuZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdC8vIGFkanVzdG1lbnRzIGNvbWUgZnJvbSBzaW1pbGFyIGNvZGUgaW4gdGhlIGpxdWVyeSBvZmZzZXQoKSBmdW5jdGlvblxuXHRcdFx0dmFyIGQgPSB0aGlzLmRvbUVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHR0aGlzLnNjcmVlbi5sZWZ0ID0gYm94LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgLSBkLmNsaWVudExlZnQ7XG5cdFx0XHR0aGlzLnNjcmVlbi50b3AgPSBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IC0gZC5jbGllbnRUb3A7XG5cdFx0XHR0aGlzLnNjcmVlbi53aWR0aCA9IGJveC53aWR0aDtcblx0XHRcdHRoaXMuc2NyZWVuLmhlaWdodCA9IGJveC5oZWlnaHQ7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24gKCBldmVudCApIHtcblxuXHRcdGlmICggdHlwZW9mIHRoaXNbIGV2ZW50LnR5cGUgXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblxuXHRcdFx0dGhpc1sgZXZlbnQudHlwZSBdKCBldmVudCApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dmFyIGdldE1vdXNlT25TY3JlZW4gPSAoIGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGdldE1vdXNlT25TY3JlZW4oIHBhZ2VYLCBwYWdlWSApIHtcblxuXHRcdFx0dmVjdG9yLnNldChcblx0XHRcdFx0KCBwYWdlWCAtIF90aGlzLnNjcmVlbi5sZWZ0ICkgLyBfdGhpcy5zY3JlZW4ud2lkdGgsXG5cdFx0XHRcdCggcGFnZVkgLSBfdGhpcy5zY3JlZW4udG9wICkgLyBfdGhpcy5zY3JlZW4uaGVpZ2h0XG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdmVjdG9yO1xuXG5cdFx0fTtcblxuXHR9KCkgKTtcblxuXHR2YXIgZ2V0TW91c2VPbkNpcmNsZSA9ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gZ2V0TW91c2VPbkNpcmNsZSggcGFnZVgsIHBhZ2VZICkge1xuXG5cdFx0XHR2ZWN0b3Iuc2V0KFxuXHRcdFx0XHQoICggcGFnZVggLSBfdGhpcy5zY3JlZW4ud2lkdGggKiAwLjUgLSBfdGhpcy5zY3JlZW4ubGVmdCApIC8gKCBfdGhpcy5zY3JlZW4ud2lkdGggKiAwLjUgKSApLFxuXHRcdFx0XHQoICggX3RoaXMuc2NyZWVuLmhlaWdodCArIDIgKiAoIF90aGlzLnNjcmVlbi50b3AgLSBwYWdlWSApICkgLyBfdGhpcy5zY3JlZW4ud2lkdGggKSAvLyBzY3JlZW4ud2lkdGggaW50ZW50aW9uYWxcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB2ZWN0b3I7XG5cblx0XHR9O1xuXG5cdH0oKSApO1xuXG5cdHRoaXMucm90YXRlQ2FtZXJhID0gKCBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBheGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdHF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLFxuXHRcdFx0ZXllRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG9iamVjdFVwRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG1vdmVEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0YW5nbGU7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gcm90YXRlQ2FtZXJhKCkge1xuXG5cdFx0XHRtb3ZlRGlyZWN0aW9uLnNldCggX21vdmVDdXJyLnggLSBfbW92ZVByZXYueCwgX21vdmVDdXJyLnkgLSBfbW92ZVByZXYueSwgMCApO1xuXHRcdFx0YW5nbGUgPSBtb3ZlRGlyZWN0aW9uLmxlbmd0aCgpO1xuXG5cdFx0XHRpZiAoIGFuZ2xlICkge1xuXG5cdFx0XHRcdF9leWUuY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkuc3ViKCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdFx0XHRleWVEaXJlY3Rpb24uY29weSggX2V5ZSApLm5vcm1hbGl6ZSgpO1xuXHRcdFx0XHRvYmplY3RVcERpcmVjdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QudXAgKS5ub3JtYWxpemUoKTtcblx0XHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24uY3Jvc3NWZWN0b3JzKCBvYmplY3RVcERpcmVjdGlvbiwgZXllRGlyZWN0aW9uICkubm9ybWFsaXplKCk7XG5cblx0XHRcdFx0b2JqZWN0VXBEaXJlY3Rpb24uc2V0TGVuZ3RoKCBfbW92ZUN1cnIueSAtIF9tb3ZlUHJldi55ICk7XG5cdFx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uLnNldExlbmd0aCggX21vdmVDdXJyLnggLSBfbW92ZVByZXYueCApO1xuXG5cdFx0XHRcdG1vdmVEaXJlY3Rpb24uY29weSggb2JqZWN0VXBEaXJlY3Rpb24uYWRkKCBvYmplY3RTaWRld2F5c0RpcmVjdGlvbiApICk7XG5cblx0XHRcdFx0YXhpcy5jcm9zc1ZlY3RvcnMoIG1vdmVEaXJlY3Rpb24sIF9leWUgKS5ub3JtYWxpemUoKTtcblxuXHRcdFx0XHRhbmdsZSAqPSBfdGhpcy5yb3RhdGVTcGVlZDtcblx0XHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKCBheGlzLCBhbmdsZSApO1xuXG5cdFx0XHRcdF9leWUuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cdFx0XHRcdF90aGlzLm9iamVjdC51cC5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblxuXHRcdFx0XHRfbGFzdEF4aXMuY29weSggYXhpcyApO1xuXHRcdFx0XHRfbGFzdEFuZ2xlID0gYW5nbGU7XG5cblx0XHRcdH0gZWxzZSBpZiAoICEgX3RoaXMuc3RhdGljTW92aW5nICYmIF9sYXN0QW5nbGUgKSB7XG5cblx0XHRcdFx0X2xhc3RBbmdsZSAqPSBNYXRoLnNxcnQoIDEuMCAtIF90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yICk7XG5cdFx0XHRcdF9leWUuY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkuc3ViKCBfdGhpcy50YXJnZXQgKTtcblx0XHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKCBfbGFzdEF4aXMsIF9sYXN0QW5nbGUgKTtcblx0XHRcdFx0X2V5ZS5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblx0XHRcdFx0X3RoaXMub2JqZWN0LnVwLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXG5cdFx0XHR9XG5cblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblxuXHRcdH07XG5cblx0fSgpICk7XG5cblxuXHR0aGlzLnpvb21DYW1lcmEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgZmFjdG9yO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLlRPVUNIX1pPT01fUEFOICkge1xuXG5cdFx0XHRmYWN0b3IgPSBfdG91Y2hab29tRGlzdGFuY2VTdGFydCAvIF90b3VjaFpvb21EaXN0YW5jZUVuZDtcblx0XHRcdF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gX3RvdWNoWm9vbURpc3RhbmNlRW5kO1xuXHRcdFx0X2V5ZS5tdWx0aXBseVNjYWxhciggZmFjdG9yICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRmYWN0b3IgPSAxLjAgKyAoIF96b29tRW5kLnkgLSBfem9vbVN0YXJ0LnkgKSAqIF90aGlzLnpvb21TcGVlZDtcblxuXHRcdFx0aWYgKCBmYWN0b3IgIT09IDEuMCAmJiBmYWN0b3IgPiAwLjAgKSB7XG5cblx0XHRcdFx0X2V5ZS5tdWx0aXBseVNjYWxhciggZmFjdG9yICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBfdGhpcy5zdGF0aWNNb3ZpbmcgKSB7XG5cblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdF96b29tU3RhcnQueSArPSAoIF96b29tRW5kLnkgLSBfem9vbVN0YXJ0LnkgKSAqIHRoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3I7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucGFuQ2FtZXJhID0gKCBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBtb3VzZUNoYW5nZSA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdFx0XHRvYmplY3RVcCA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRwYW4gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHBhbkNhbWVyYSgpIHtcblxuXHRcdFx0bW91c2VDaGFuZ2UuY29weSggX3BhbkVuZCApLnN1YiggX3BhblN0YXJ0ICk7XG5cblx0XHRcdGlmICggbW91c2VDaGFuZ2UubGVuZ3RoU3EoKSApIHtcblxuXHRcdFx0XHRtb3VzZUNoYW5nZS5tdWx0aXBseVNjYWxhciggX2V5ZS5sZW5ndGgoKSAqIF90aGlzLnBhblNwZWVkICk7XG5cblx0XHRcdFx0cGFuLmNvcHkoIF9leWUgKS5jcm9zcyggX3RoaXMub2JqZWN0LnVwICkuc2V0TGVuZ3RoKCBtb3VzZUNoYW5nZS54ICk7XG5cdFx0XHRcdHBhbi5hZGQoIG9iamVjdFVwLmNvcHkoIF90aGlzLm9iamVjdC51cCApLnNldExlbmd0aCggbW91c2VDaGFuZ2UueSApICk7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZCggcGFuICk7XG5cdFx0XHRcdF90aGlzLnRhcmdldC5hZGQoIHBhbiApO1xuXG5cdFx0XHRcdGlmICggX3RoaXMuc3RhdGljTW92aW5nICkge1xuXG5cdFx0XHRcdFx0X3BhblN0YXJ0LmNvcHkoIF9wYW5FbmQgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0X3BhblN0YXJ0LmFkZCggbW91c2VDaGFuZ2Uuc3ViVmVjdG9ycyggX3BhbkVuZCwgX3BhblN0YXJ0ICkubXVsdGlwbHlTY2FsYXIoIF90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yICkgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9KCkgKTtcblxuXHR0aGlzLmNoZWNrRGlzdGFuY2VzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCAhIF90aGlzLm5vWm9vbSB8fCAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRpZiAoIF9leWUubGVuZ3RoU3EoKSA+IF90aGlzLm1heERpc3RhbmNlICogX3RoaXMubWF4RGlzdGFuY2UgKSB7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZFZlY3RvcnMoIF90aGlzLnRhcmdldCwgX2V5ZS5zZXRMZW5ndGgoIF90aGlzLm1heERpc3RhbmNlICkgKTtcblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggX2V5ZS5sZW5ndGhTcSgpIDwgX3RoaXMubWluRGlzdGFuY2UgKiBfdGhpcy5taW5EaXN0YW5jZSApIHtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllLnNldExlbmd0aCggX3RoaXMubWluRGlzdGFuY2UgKSApO1xuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X2V5ZS5zdWJWZWN0b3JzKCBfdGhpcy5vYmplY3QucG9zaXRpb24sIF90aGlzLnRhcmdldCApO1xuXG5cdFx0aWYgKCAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfdGhpcy5yb3RhdGVDYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdGlmICggISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF90aGlzLnpvb21DYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdGlmICggISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3RoaXMucGFuQ2FtZXJhKCk7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllICk7XG5cblx0XHRfdGhpcy5jaGVja0Rpc3RhbmNlcygpO1xuXG5cdFx0X3RoaXMub2JqZWN0Lmxvb2tBdCggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRpZiAoIGxhc3RQb3NpdGlvbi5kaXN0YW5jZVRvU3F1YXJlZCggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkgPiBFUFMgKSB7XG5cblx0XHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cblx0XHRcdGxhc3RQb3NpdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXHRcdF9wcmV2U3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0X3RoaXMudGFyZ2V0LmNvcHkoIF90aGlzLnRhcmdldDAgKTtcblx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uY29weSggX3RoaXMucG9zaXRpb24wICk7XG5cdFx0X3RoaXMub2JqZWN0LnVwLmNvcHkoIF90aGlzLnVwMCApO1xuXG5cdFx0X2V5ZS5zdWJWZWN0b3JzKCBfdGhpcy5vYmplY3QucG9zaXRpb24sIF90aGlzLnRhcmdldCApO1xuXG5cdFx0X3RoaXMub2JqZWN0Lmxvb2tBdCggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXG5cdFx0bGFzdFBvc2l0aW9uLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApO1xuXG5cdH07XG5cblx0Ly8gbGlzdGVuZXJzXG5cblx0ZnVuY3Rpb24ga2V5ZG93biggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biApO1xuXG5cdFx0X3ByZXZTdGF0ZSA9IF9zdGF0ZTtcblxuXHRcdGlmICggX3N0YXRlICE9PSBTVEFURS5OT05FICkge1xuXG5cdFx0XHRyZXR1cm47XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5ST1RBVEUgXSAmJiAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5ST1RBVEU7XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5aT09NIF0gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlpPT007XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5QQU4gXSAmJiAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5QQU47XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGtleXVwKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRfc3RhdGUgPSBfcHJldlN0YXRlO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2Vkb3duKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLk5PTkUgKSB7XG5cblx0XHRcdF9zdGF0ZSA9IGV2ZW50LmJ1dHRvbjtcblxuXHRcdH1cblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5ST1RBVEUgJiYgISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlpPT00gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF96b29tU3RhcnQuY29weSggZ2V0TW91c2VPblNjcmVlbiggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblx0XHRcdF96b29tRW5kLmNvcHkoIF96b29tU3RhcnQgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUEFOICYmICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF9wYW5TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXHRcdFx0X3BhbkVuZC5jb3B5KCBfcGFuU3RhcnQgKTtcblxuXHRcdH1cblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUsIGZhbHNlICk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBtb3VzZXVwLCBmYWxzZSApO1xuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggc3RhcnRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZW1vdmUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUk9UQVRFICYmICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5aT09NICYmICEgX3RoaXMubm9ab29tICkge1xuXG5cdFx0XHRfem9vbUVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5QQU4gJiYgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3BhbkVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZXVwKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUgKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG1vdXNldXAgKTtcblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZXdoZWVsKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0c3dpdGNoICggZXZlbnQuZGVsdGFNb2RlICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpvb20gaW4gcGFnZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDI1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuXHRcdFx0Y2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBab29tIGluIGxpbmVzXG5cdFx0XHRcdF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAxO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Ly8gdW5kZWZpbmVkLCAwLCBhc3N1bWUgcGl4ZWxzXG5cdFx0XHRcdF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAwMDI1O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIHN0YXJ0RXZlbnQgKTtcblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaHN0YXJ0KCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKCBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9ST1RBVEU7XG5cdFx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSApICk7XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IC8vIDIgb3IgbW9yZVxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9aT09NX1BBTjtcblx0XHRcdFx0dmFyIGR4ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYO1xuXHRcdFx0XHR2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XG5cdFx0XHRcdF90b3VjaFpvb21EaXN0YW5jZUVuZCA9IF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRcdHZhciB4ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVggKSAvIDI7XG5cdFx0XHRcdHZhciB5ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVkgKSAvIDI7XG5cdFx0XHRcdF9wYW5TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCB4LCB5ICkgKTtcblx0XHRcdFx0X3BhbkVuZC5jb3B5KCBfcGFuU3RhcnQgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBzdGFydEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNobW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoICkge1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICkgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IC8vIDIgb3IgbW9yZVxuXHRcdFx0XHR2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG5cdFx0XHRcdHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcblx0XHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlRW5kID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRcdHZhciB4ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVggKSAvIDI7XG5cdFx0XHRcdHZhciB5ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVkgKSAvIDI7XG5cdFx0XHRcdF9wYW5FbmQuY29weSggZ2V0TW91c2VPblNjcmVlbiggeCwgeSApICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaGVuZCggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0c3dpdGNoICggZXZlbnQudG91Y2hlcy5sZW5ndGggKSB7XG5cblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuXHRcdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKSApO1xuXHRcdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggZW5kRXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gY29udGV4dG1lbnUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0fVxuXG5cdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIGNvbnRleHRtZW51LCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgbW91c2Vkb3duLCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBtb3VzZXdoZWVsLCBmYWxzZSApO1xuXG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgdG91Y2hlbmQsIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlICk7XG5cblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlLCBmYWxzZSApO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgbW91c2V1cCwgZmFsc2UgKTtcblxuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGtleWRvd24sIGZhbHNlICk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGtleXVwLCBmYWxzZSApO1xuXG5cdH07XG5cblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIGNvbnRleHRtZW51LCBmYWxzZSApOyBcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBtb3VzZWRvd24sIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBtb3VzZXdoZWVsLCBmYWxzZSApO1xuXG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoc3RhcnQsIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlICk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGtleXVwLCBmYWxzZSApO1xuXG5cdHRoaXMuaGFuZGxlUmVzaXplKCk7XG5cblx0Ly8gZm9yY2UgYW4gdXBkYXRlIGF0IHN0YXJ0XG5cdHRoaXMudXBkYXRlKCk7XG5cbn1cblxuVHJhY2tiYWxsQ29udHJvbHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVEhSRUUuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSApO1xuVHJhY2tiYWxsQ29udHJvbHMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVHJhY2tiYWxsQ29udHJvbHM7XG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcbmltcG9ydCB7Q2FtZXJhLCBTdGFuZGFyZFZpZXd9ICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0NhbWVyYUNvbnRyb2xzfSAgICAgICAgIGZyb20gJ0NhbWVyYUNvbnRyb2xzJ1xyXG5pbXBvcnQge0V2ZW50TWFuYWdlcn0gICAgICAgICAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtHcmFwaGljcywgT2JqZWN0TmFtZXN9ICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXJ9ICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0ZXJpYWxzfSAgICAgICAgICAgICAgZnJvbSAnTWF0ZXJpYWxzJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9WaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBWaWV3ZXIge1xyXG5cclxuICAgIF9uYW1lICAgICAgICAgICAgICAgICAgIDogc3RyaW5nICAgICAgICAgICAgICAgICAgICA9ICcnO1xyXG4gICAgX2V2ZW50TWFuYWdlciAgICAgICAgICAgOiBFdmVudE1hbmFnZXIgICAgICAgICAgICAgID0gbnVsbDtcclxuICAgIF9sb2dnZXIgICAgICAgICAgICAgICAgIDogTG9nZ2VyICAgICAgICAgICAgICAgICAgICA9IG51bGw7XHJcbiAgICBcclxuICAgIF9zY2VuZSAgICAgICAgICAgICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgICA9IG51bGw7XHJcbiAgICBfcm9vdCAgICAgICAgICAgICAgICAgICA6IFRIUkVFLk9iamVjdDNEICAgICAgICAgICAgPSBudWxsOyAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgX3JlbmRlcmVyICAgICAgICAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlcmVyICAgICAgID0gbnVsbDs7XHJcbiAgICBfY2FudmFzICAgICAgICAgICAgICAgICA6IEhUTUxDYW52YXNFbGVtZW50ICAgICAgICAgPSBudWxsO1xyXG4gICAgX3dpZHRoICAgICAgICAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgID0gMDtcclxuICAgIF9oZWlnaHQgICAgICAgICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgICA9IDA7XHJcblxyXG4gICAgX2NhbWVyYSAgICAgICAgICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSAgID0gbnVsbDtcclxuXHJcbiAgICBfY29udHJvbHMgICAgICAgICAgICAgICA6IFRyYWNrYmFsbENvbnRyb2xzICAgICAgICAgPSBudWxsO1xyXG4gICAgX2NhbWVyYUNvbnRyb2xzICAgICAgICAgOiBDYW1lcmFDb250cm9scyAgICAgICAgICAgID0gbnVsbDtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVmlld2VyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBuYW1lIFZpZXdlciBuYW1lLlxyXG4gICAgICogQHBhcmFtIGVsZW1lbnRUb0JpbmRUbyBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBtb2RlbENhbnZhc0lkIDogc3RyaW5nKSB7IFxyXG5cclxuICAgICAgICB0aGlzLl9uYW1lICAgICAgICAgPSBuYW1lOyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcigpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciAgICAgICA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IEdyYXBoaWNzLmluaXRpYWxpemVDYW52YXMobW9kZWxDYW52YXNJZCk7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggID0gdGhpcy5fY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBWaWV3ZXIgbmFtZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG5hbWUoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBWaWV3ZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGdldCBzY2VuZSgpIDogVEhSRUUuU2NlbmUge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBWaWV3ZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHNldCBzY2VuZSh2YWx1ZTogVEhSRUUuU2NlbmUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fc2NlbmUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZXQgY2FtZXJhKCkgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYXtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBzZXQgY2FtZXJhKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLm5hbWUgPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSW5wdXRDb250cm9scygpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhQ29udHJvbHMpXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzLnN5bmNocm9uaXplQ2FtZXJhU2V0dGluZ3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgYWN0aXZlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXQgbW9kZWwoKSA6IFRIUkVFLkdyb3VwIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBFdmVudE1hbmFnZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCBldmVudE1hbmFnZXIoKSA6IEV2ZW50TWFuYWdlciB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50TWFuYWdlcjtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgYWN0aXZlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIE5ldyBtb2RlbCB0byBhY3RpdmF0ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TW9kZWwodmFsdWUgOiBUSFJFRS5Hcm91cCkge1xyXG5cclxuICAgICAgICAvLyBOLkIuIFRoaXMgaXMgYSBtZXRob2Qgbm90IGEgcHJvcGVydHkgc28gYSBzdWIgY2xhc3MgY2FuIG92ZXJyaWRlLlxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvNDQ2NVxyXG5cclxuICAgICAgICBHcmFwaGljcy5yZW1vdmVPYmplY3RDaGlsZHJlbih0aGlzLl9yb290LCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSBjYW52YXMgYWZlciBhIHdpbmRvdyByZXNpemVcclxuICAgICAqL1xyXG4gICAgZ2V0IGFzcGVjdFJhdGlvKCkgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgYXNwZWN0UmF0aW8gOiBudW1iZXIgPSB0aGlzLl93aWR0aCAvIHRoaXMuX2hlaWdodDtcclxuICAgICAgICByZXR1cm4gYXNwZWN0UmF0aW87XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgRE9NIElkIG9mIHRoZSBWaWV3ZXIgcGFyZW50IGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRhaW5lcklkKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBwYXJlbnRFbGVtZW50IDogSFRNTEVsZW1lbnQgPSB0aGlzLl9jYW52YXMucGFyZW50RWxlbWVudDtcclxuICAgICAgICByZXR1cm4gcGFyZW50RWxlbWVudC5pZDtcclxuICAgIH0gXHJcbiAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdGVzdCBzcGhlcmUgdG8gYSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCAyKTtcclxuICAgICAgICBtZXNoLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9yb290LmFkZChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgU2NlbmVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVNjZW5lICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUm9vdCgpO1xyXG5cclxuICAgICAgICB0aGlzLnBvcHVsYXRlU2NlbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIFdlYkdMIHJlbmRlcmVyLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUmVuZGVyZXIgKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcclxuXHJcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXIgIDogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhbnZhcyAgICAgICAgICAgICAgICAgIDogdGhpcy5fY2FudmFzLFxyXG4gICAgICAgICAgICBhbnRpYWxpYXMgICAgICAgICAgICAgICA6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5hdXRvQ2xlYXIgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDApO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDYW1lcmEoKSB7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3Q2FtZXJhKFN0YW5kYXJkVmlldy5Gcm9udCwgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5tb2RlbCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBsaWdodGluZyB0byB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nKCkge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDQwNDA0MCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhDMEMwOTApO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCgtMTAwLCAtNTAsIDEwMCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDIgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEMwQzA5MCk7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDIucG9zaXRpb24uc2V0KDEwMCwgNTAsIC0xMDApO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIHVzZXIgaW5wdXQgY29udHJvbHMgKFRyYWNrYmFsbClcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzID0gbmV3IFRyYWNrYmFsbENvbnRyb2xzKHRoaXMuY2FtZXJhLCB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gTi5CLiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDMyNTA5NS90aHJlZWpzLWNhbWVyYS1sb29rYXQtaGFzLW5vLWVmZmVjdC1pcy10aGVyZS1zb21ldGhpbmctaW0tZG9pbmctd3JvbmdcclxuICAgICAgICB0aGlzLl9jb250cm9scy5wb3NpdGlvbjAuY29weSh0aGlzLmNhbWVyYS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdCh0aGlzLl9yb290KTtcclxuICAgICAgICB0aGlzLl9jb250cm9scy50YXJnZXQuY29weShib3VuZGluZ0JveC5nZXRDZW50ZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSB1c2VyIGlucHV0IGNvbnRyb2xzIChTZXR0aW5ncylcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzID0gbmV3IENhbWVyYUNvbnRyb2xzKHRoaXMpOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIGtleWJvYXJkIHNob3J0Y3V0cy5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUtleWJvYXJkU2hvcnRjdXRzKCkge1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCA6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvamF2YXNjcmlwdC9qYXZhc2NyaXB0LWtleWNvZGVzL1xyXG4gICAgICAgICAgICBsZXQga2V5Q29kZSA6IG51bWJlciA9IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNzA6ICAgICAgICAgICAgICAgIC8vIEYgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYSA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdDYW1lcmEoU3RhbmRhcmRWaWV3LkZyb250LCB0aGlzLmFzcGVjdFJhdGlvLCB0aGlzLm1vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBzY2VuZSB3aXRoIHRoZSBiYXNlIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDYW1lcmEoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZygpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplS2V5Ym9hcmRTaG9ydGN1dHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZVdpbmRvdygpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplV2luZG93LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2NlbmVcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc2NlbmUgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBjbGVhckFsbEFzc2VzdHMoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4odGhpcy5fcm9vdCwgZmFsc2UpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIHJvb3Qgb2JqZWN0IGluIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVSb290KCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5uYW1lID0gT2JqZWN0TmFtZXMuUm9vdDtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLl9yb290KTtcclxuICAgIH1cclxuXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIENhbWVyYVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBTZXRzIHRoZSB2aWV3IGNhbWVyYSBwcm9wZXJ0aWVzIHRvIHRoZSBnaXZlbiBzZXR0aW5ncy5cclxuICAgICAqIEBwYXJhbSB7U3RhbmRhcmRWaWV3fSB2aWV3IENhbWVyYSBzZXR0aW5ncyB0byBhcHBseS5cclxuICAgICAqL1xyXG4gICAgc2V0Q2FtZXJhVG9TdGFuZGFyZFZpZXcodmlldyA6IFN0YW5kYXJkVmlldykge1xyXG5cclxuICAgICAgICBsZXQgc3RhbmRhcmRWaWV3Q2FtZXJhID0gQ2FtZXJhLmdldFN0YW5kYXJkVmlld0NhbWVyYSh2aWV3LCB0aGlzLmFzcGVjdFJhdGlvLCB0aGlzLm1vZGVsKTtcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IHN0YW5kYXJkVmlld0NhbWVyYTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhQ29udHJvbHMuc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncyh2aWV3KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBGaXRzIHRoZSBhY3RpdmUgdmlldy5cclxuICAgICAqL1xyXG4gICAgZml0VmlldygpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBDYW1lcmEuZ2V0Rml0Vmlld0NhbWVyYSAoQ2FtZXJhLmdldFNjZW5lQ2FtZXJhKHRoaXMuY2FtZXJhLCB0aGlzLmFzcGVjdFJhdGlvKSwgdGhpcy5tb2RlbCk7XHJcbiAgICB9XHJcbiAgICAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFdpbmRvdyBSZXNpemVcclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgc2NlbmUgY2FtZXJhIHRvIG1hdGNoIHRoZSBuZXcgd2luZG93IHNpemVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQ2FtZXJhT25XaW5kb3dSZXNpemUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlcyB0aGUgV2ViR0wgcHJvY2Vzc2luZyBmb3IgYSBET00gd2luZG93ICdyZXNpemUnIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIHJlc2l6ZURpc3BsYXlXZWJHTCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSAgdGhpcy5fY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLmhhbmRsZVJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FtZXJhT25XaW5kb3dSZXNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgYSB3aW5kb3cgcmVzaXplIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uUmVzaXplV2luZG93ICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNpemVEaXNwbGF5V2ViR0woKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gUmVuZGVyIExvb3BcclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgdGhlIFdlYkdMIHJlbmRlciBvZiB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgcmVuZGVyV2ViR0woKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluIERPTSByZW5kZXIgbG9vcFxyXG4gICAgICovXHJcbiAgICBhbmltYXRlKCkge1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyV2ViR0woKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcblxyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IHRlc3RNb2RlbENvbG9yID0gJyM1NThkZTgnO1xyXG5cclxuZXhwb3J0IGVudW0gVGVzdE1vZGVsIHtcclxuICAgIFRvcnVzLFxyXG4gICAgU3BoZXJlLFxyXG4gICAgU2xvcGVkUGxhbmUsXHJcbiAgICBCb3gsXHJcbiAgICBDaGVja2VyYm9hcmRcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3RNb2RlbExvYWRlciB7XHJcblxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBUZXN0TW9kZWxMb2FkZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIExvYWRzIGEgcGFyYW1ldHJpYyB0ZXN0IG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHtWaWV3ZXJ9IHZpZXdlciBWaWV3ZXIgaW5zdGFuY2UgdG8gcmVjZWl2ZSBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB7VGVzdE1vZGVsfSBtb2RlbFR5cGUgTW9kZWwgdHlwZSAoQm94LCBTcGhlcmUsIGV0Yy4pXHJcbiAgICAgKi9cclxuICAgIGxvYWRUZXN0TW9kZWwgKHZpZXdlciA6IFZpZXdlciwgbW9kZWxUeXBlIDogVGVzdE1vZGVsKSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobW9kZWxUeXBlKXtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLlRvcnVzOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVG9ydXNNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5TcGhlcmU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTcGhlcmVNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5TbG9wZWRQbGFuZTogXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTbG9wZWRQbGFuZU1vZGVsKHZpZXdlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLkJveDpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEJveE1vZGVsKHZpZXdlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLkNoZWNrZXJib2FyZDpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENoZWNrZXJib2FyZE1vZGVsKHZpZXdlcik7ICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHRvcnVzIHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkVG9ydXNNb2RlbCh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdG9ydXNTY2VuZSA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAgICAgICAvLyBTZXR1cCBzb21lIGdlb21ldHJpZXNcclxuICAgICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNLbm90R2VvbWV0cnkoMSwgMC4zLCAxMjgsIDY0KTtcclxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSk7XHJcblxyXG4gICAgICAgIGxldCBjb3VudCA9IDUwO1xyXG4gICAgICAgIGxldCBzY2FsZSA9IDU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpICogMi4wICogTWF0aC5QSTtcclxuICAgICAgICAgICAgbGV0IHogPSAoTWF0aC5yYW5kb20oKSAqIDIuMCkgLSAxLjA7XHJcbiAgICAgICAgICAgIGxldCB6U2NhbGUgPSBNYXRoLnNxcnQoMS4wIC0geiAqIHopICogc2NhbGU7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIG1lc2gucG9zaXRpb24uc2V0KFxyXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MocikgKiB6U2NhbGUsXHJcbiAgICAgICAgICAgICAgICBNYXRoLnNpbihyKSAqIHpTY2FsZSxcclxuICAgICAgICAgICAgICAgIHogKiBzY2FsZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBtZXNoLnJvdGF0aW9uLnNldChNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKTtcclxuXHJcbiAgICAgICAgICAgIG1lc2gubmFtZSA9ICdUb3J1cyBDb21wb25lbnQnO1xyXG4gICAgICAgICAgICB0b3J1c1NjZW5lLmFkZChtZXNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsICh0b3J1c1NjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSB0ZXN0IHNwaGVyZSB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRTcGhlcmVNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCByYWRpdXMgPSAyOyAgICBcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVNwaGVyZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHJhZGl1cywgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pKVxyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHRlc3QgYm94IHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZEJveE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoICA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBoZWlnaHQgPSAyOyAgICBcclxuICAgICAgICBsZXQgZGVwdGggID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKG5ldyBUSFJFRS5WZWN0b3IzLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pKVxyXG5cclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBzbG9wZWQgcGxhbmUgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkU2xvcGVkUGxhbmVNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCAgPSAyOyAgICBcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVQbGFuZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHdpZHRoLCBoZWlnaHQsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSkgICAgICAgXHJcbiAgICAgICAgbWVzaC5yb3RhdGVYKE1hdGguUEkgLyA0KTtcclxuICAgICAgICBcclxuICAgICAgICBtZXNoLm5hbWUgPSAnU2xvcGVkUGxhbmUnO1xyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHRlc3QgbW9kZWwgY29uc2lzdGluZyBvZiBhIHRpZXJlZCBjaGVja2VyYm9hcmRcclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkQ2hlY2tlcmJvYXJkTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBncmlkTGVuZ3RoICAgICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ICAgIDogbnVtYmVyID0gMS4wOyAgICAgICAgXHJcbiAgICAgICAgbGV0IGdyaWREaXZpc2lvbnMgIDogbnVtYmVyID0gMjtcclxuICAgICAgICBsZXQgdG90YWxDZWxscyAgICAgOiBudW1iZXIgPSBNYXRoLnBvdyhncmlkRGl2aXNpb25zLCAyKTtcclxuXHJcbiAgICAgICAgbGV0IGNlbGxCYXNlICAgICAgIDogbnVtYmVyID0gZ3JpZExlbmd0aCAvIGdyaWREaXZpc2lvbnM7XHJcbiAgICAgICAgbGV0IGNlbGxIZWlnaHQgICAgIDogbnVtYmVyID0gdG90YWxIZWlnaHQgLyB0b3RhbENlbGxzO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luWCA6IG51bWJlciA9IC0oY2VsbEJhc2UgKiAoZ3JpZERpdmlzaW9ucyAvIDIpKSArIChjZWxsQmFzZSAvIDIpO1xyXG4gICAgICAgIGxldCBvcmlnaW5ZIDogbnVtYmVyID0gb3JpZ2luWDtcclxuICAgICAgICBsZXQgb3JpZ2luWiA6IG51bWJlciA9IC1jZWxsSGVpZ2h0IC8gMjtcclxuICAgICAgICBsZXQgb3JpZ2luICA6IFRIUkVFLlZlY3RvcjMgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YLCBvcmlnaW5ZLCBvcmlnaW5aKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYmFzZUNvbG9yICAgICAgOiBudW1iZXIgPSAweDAwNzA3MDtcclxuICAgICAgICBsZXQgY29sb3JEZWx0YSAgICAgOiBudW1iZXIgPSAoMjU2IC8gdG90YWxDZWxscykgKiBNYXRoLnBvdygyNTYsIDIpO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXAgICAgICA6IFRIUkVFLkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgbGV0IGNlbGxPcmlnaW4gOiBUSFJFRS5WZWN0b3IzID0gb3JpZ2luLmNsb25lKCk7XHJcbiAgICAgICAgbGV0IGNlbGxDb2xvciAgOiBudW1iZXIgPSBiYXNlQ29sb3I7XHJcbiAgICAgICAgZm9yIChsZXQgaVJvdyA6IG51bWJlciA9IDA7IGlSb3cgPCBncmlkRGl2aXNpb25zOyBpUm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaUNvbHVtbiA6IG51bWJlciA9IDA7IGlDb2x1bW4gPCBncmlkRGl2aXNpb25zOyBpQ29sdW1uKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiBjZWxsQ29sb3J9KTtcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsIDogVEhSRUUuTWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJveE1lc2goY2VsbE9yaWdpbiwgY2VsbEJhc2UsIGNlbGxCYXNlLCBjZWxsSGVpZ2h0LCBjZWxsTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuYWRkIChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjZWxsT3JpZ2luLnggKz0gY2VsbEJhc2U7XHJcbiAgICAgICAgICAgICAgICBjZWxsT3JpZ2luLnogKz0gY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGNlbGxDb2xvciAgICArPSBjb2xvckRlbHRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2VsbE9yaWdpbi54ID0gb3JpZ2luLng7XHJcbiAgICAgICAgY2VsbE9yaWdpbi55ICs9IGNlbGxCYXNlO1xyXG4gICAgICAgIH0gICAgICAgXHJcblxyXG4gICAgICAgIGdyb3VwLm5hbWUgPSAnQ2hlY2tlcmJvYXJkJztcclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwoZ3JvdXApO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuXHJcbmltcG9ydCB7U3RhbmRhcmRWaWV3fSAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge09CSkxvYWRlcn0gICAgICAgICAgICAgICAgICBmcm9tIFwiT0JKTG9hZGVyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VGVzdE1vZGVsTG9hZGVyLCBUZXN0TW9kZWx9IGZyb20gJ1Rlc3RNb2RlbExvYWRlcidcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuY29uc3QgdGVzdE1vZGVsQ29sb3IgPSAnIzU1OGRlOCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZGVyIHtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIExvYWRlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIG1vZGVsIGJhc2VkIG9uIHRoZSBtb2RlbCBuYW1lIGFuZCBwYXRoIGVtYmVkZGVkIGluIHRoZSBIVE1MIHBhZ2UuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi8gICAgXHJcbiAgICBsb2FkT0JKTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWxOYW1lRWxlbWVudCA6IEhUTUxFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RlbE5hbWUnKTtcclxuICAgICAgICBsZXQgbW9kZWxQYXRoRWxlbWVudCA6IEhUTUxFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RlbFBhdGgnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IG1vZGVsTmFtZSAgICA6IHN0cmluZyA9IG1vZGVsTmFtZUVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgbGV0IG1vZGVsUGF0aCAgICA6IHN0cmluZyA9IG1vZGVsUGF0aEVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgbGV0IGZpbGVOYW1lICAgICA6IHN0cmluZyA9IG1vZGVsUGF0aCArIG1vZGVsTmFtZTtcclxuXHJcbiAgICAgICAgbGV0IG1hbmFnZXIgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKTtcclxuICAgICAgICBsZXQgbG9hZGVyICA9IG5ldyBPQkpMb2FkZXIobWFuYWdlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoeGhyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoeGhyLmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGVyY2VudENvbXBsZXRlLnRvRml4ZWQoMikgKyAnJSBkb3dubG9hZGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgb25FcnJvciA9IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICB9OyAgICAgICAgXHJcblxyXG4gICAgICAgIGxvYWRlci5sb2FkKGZpbGVOYW1lLCBmdW5jdGlvbiAoZ3JvdXAgOiBUSFJFRS5Hcm91cCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmlld2VyLnNldE1vZGVsKGdyb3VwKTtcclxuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgcGFyYW1ldHJpYyB0ZXN0IG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIG1vZGVsVHlwZSBUZXN0IG1vZGVsIHR5cGUgKFNwaGVyLCBCb3gsIGV0Yy4pXHJcbiAgICAgKi8gICAgXHJcbiAgICBsb2FkUGFyYW1ldHJpY1Rlc3RNb2RlbCAodmlld2VyIDogVmlld2VyLCBtb2RlbFR5cGUgOiBUZXN0TW9kZWwpIHtcclxuXHJcbiAgICAgICAgbGV0IHRlc3RMb2FkZXIgPSBuZXcgVGVzdE1vZGVsTG9hZGVyKCk7XHJcbiAgICAgICAgdGVzdExvYWRlci5sb2FkVGVzdE1vZGVsKHZpZXdlciwgbW9kZWxUeXBlKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmEsIFN0YW5kYXJkVmlld30gICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0RlcHRoQnVmZmVyfSAgICAgICAgICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIE1lc2hWaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNZXNoVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTWVzaFZpZXdlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBWaWV3ZXIgbmFtZS5cclxuICAgICAqIEBwYXJhbSBwcmV2aWV3Q2FudmFzSWQgSFRNTCBlbGVtZW50IHRvIGhvc3QgdGhlIHZpZXdlci5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJldmlld0NhbnZhc0lkIDogc3RyaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIobmFtZSwgcHJldmlld0NhbnZhc0lkKTtcclxuXHJcbiAgICAgICAgLy9vdmVycmlkZVxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmh0bWxMb2dnZXI7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW5pdGlhbGl6YXRpb25cclxuICAgIC8qKlxyXG4gICAgICogUG9wdWxhdGUgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHBvcHVsYXRlU2NlbmUgKCkgeyAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGhlaWdodCA9IDE7XHJcbiAgICAgICAgbGV0IHdpZHRoICA9IDE7XHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVQbGFuZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMoKSwgaGVpZ2h0LCB3aWR0aCwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKERlcHRoQnVmZmVyLkRlZmF1bHRNZXNoUGhvbmdNYXRlcmlhbFBhcmFtZXRlcnMpKTtcclxuICAgICAgICBtZXNoLnJvdGF0ZVgoLU1hdGguUEkgLyAyKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGxpZ2h0aW5nIHRvIHRoZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nKCkge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC4yKTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDEucG9zaXRpb24uc2V0KDQsIDQsIDQpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQxKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn0iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgZnJvbSBcIkRlcHRoQnVmZmVyRmFjdG9yeVwiXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld2VyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIFZpZXdlckNvbnRyb2xzXHJcbiAqL1xyXG5jbGFzcyBNb2RlbFZpZXdlclNldHRpbmdzIHtcclxuXHJcbiAgICBkaXNwbGF5R3JpZCAgICA6IGJvb2xlYW47XHJcbiAgICBnZW5lcmF0ZVJlbGllZiA6ICgpID0+IHZvaWQ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGdlbmVyYXRlUmVsaWVmIDogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JpZCAgICA9IHRydWU7IFxyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVSZWxpZWYgPSBnZW5lcmF0ZVJlbGllZjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1vZGVsVmlld2VyIFVJIENvbnRyb2xzLlxyXG4gKi8gICAgXHJcbmV4cG9ydCBjbGFzcyBNb2RlbFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICBfbW9kZWxWaWV3ZXIgICAgICAgICA6IE1vZGVsVmlld2VyOyAgICAgICAgICAgICAgICAgICAgIC8vIGFzc29jaWF0ZWQgdmlld2VyXHJcbiAgICBfbW9kZWxWaWV3ZXJTZXR0aW5ncyA6IE1vZGVsVmlld2VyU2V0dGluZ3M7ICAgICAgICAgICAgIC8vIFVJIHNldHRpbmdzXHJcblxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNb2RlbFZpZXdlckNvbnRyb2xzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kZWxWaWV3ZXIgOiBNb2RlbFZpZXdlcikgeyAgXHJcblxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyID0gbW9kZWxWaWV3ZXI7XHJcblxyXG4gICAgICAgIC8vIFVJIENvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ29udHJvbHMoKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgYSByZWxpZWYgZnJvbSB0aGUgY3VycmVudCBtb2RlbCBjYW1lcmEuXHJcbiAgICAgKi9cclxuICAgIGdlbmVyYXRlUmVsaWVmKCkgOiB2b2lkIHsgXHJcblxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyLmdlbmVyYXRlUmVsaWVmKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlldyBzZXR0aW5ncyB0aGF0IGFyZSBjb250cm9sbGFibGUgYnkgdGhlIHVzZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlclNldHRpbmdzID0gbmV3IE1vZGVsVmlld2VyU2V0dGluZ3ModGhpcy5nZW5lcmF0ZVJlbGllZi5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgbGV0IGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtZW51RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fbW9kZWxWaWV3ZXIuY29udGFpbmVySWQpO1xyXG4gICAgICAgIG1lbnVEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1vZGVsVmlld2VyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICBsZXQgbW9kZWxWaWV3ZXJPcHRpb25zID0gZ3VpLmFkZEZvbGRlcignTW9kZWxWaWV3ZXIgT3B0aW9ucycpO1xyXG5cclxuICAgICAgICAvLyBHcmlkXHJcbiAgICAgICAgbGV0IGNvbnRyb2xEaXNwbGF5R3JpZCA9IG1vZGVsVmlld2VyT3B0aW9ucy5hZGQodGhpcy5fbW9kZWxWaWV3ZXJTZXR0aW5ncywgJ2Rpc3BsYXlHcmlkJykubmFtZSgnRGlzcGxheSBHcmlkJyk7XHJcbiAgICAgICAgY29udHJvbERpc3BsYXlHcmlkLm9uQ2hhbmdlICgodmFsdWUgOiBib29sZWFuKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5fbW9kZWxWaWV3ZXIuZGlzcGxheUdyaWQodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBHZW5lcmF0ZSBSZWxpZWZcclxuICAgICAgICBsZXQgY29udHJvbEdlbmVyYXRlUmVsaWVmID0gbW9kZWxWaWV3ZXJPcHRpb25zLmFkZCh0aGlzLl9tb2RlbFZpZXdlclNldHRpbmdzLCAnZ2VuZXJhdGVSZWxpZWYnKS5uYW1lKCdHZW5lcmF0ZSBSZWxpZWYnKTtcclxuXHJcbiAgICAgICAgbW9kZWxWaWV3ZXJPcHRpb25zLm9wZW4oKTtcclxuICAgIH0gICAgXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge1N0YW5kYXJkVmlld30gICAgICAgICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICAgICAgZnJvbSBcIkRlcHRoQnVmZmVyRmFjdG9yeVwiXHJcbmltcG9ydCB7RXZlbnRNYW5hZ2VyLCBFdmVudFR5cGV9ICAgICAgICBmcm9tICdFdmVudE1hbmFnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtNYXRlcmlhbHN9ICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ01hdGVyaWFscydcclxuaW1wb3J0IHtNb2RlbFZpZXdlckNvbnRyb2xzfSAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlckNvbnRyb2xzXCJcclxuaW1wb3J0IHtMb2dnZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtUcmFja2JhbGxDb250cm9sc30gICAgICAgICAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5jb25zdCBPYmplY3ROYW1lcyA9IHtcclxuICAgIEdyaWQgOiAgJ0dyaWQnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZXhwb3J0cyBWaWV3ZXIvTW9kZWxWaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNb2RlbFZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcblxyXG4gICAgX21vZGVsVmlld2VyQ29udHJvbHMgOiBNb2RlbFZpZXdlckNvbnRyb2xzOyAgICAgICAgICAgICAvLyBVSSBjb250cm9sc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsVmlld2VyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBuYW1lIFZpZXdlciBuYW1lLlxyXG4gICAgICogQHBhcmFtIG1vZGVsQ2FudmFzSWQgSFRNTCBlbGVtZW50IHRvIGhvc3QgdGhlIHZpZXdlci5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgbW9kZWxDYW52YXNJZCA6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyIChuYW1lLCBtb2RlbENhbnZhc0lkKTsgICAgICAgXHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgc2V0TW9kZWwodmFsdWUgOiBUSFJFRS5Hcm91cCkge1xyXG5cclxuICAgICAgICAvLyBDYWxsIGJhc2UgY2xhc3MgcHJvcGVydHkgdmlhIHN1cGVyXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy80NDY1ICAgICAgICBcclxuICAgICAgICBzdXBlci5zZXRNb2RlbCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vIGRpc3BhdGNoIE5ld01vZGVsIGV2ZW50XHJcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQodGhpcywgRXZlbnRUeXBlLk5ld01vZGVsLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW5pdGlhbGl6YXRpb24gICAgXHJcbiAgICAvKipcclxuICAgICAqIFBvcHVsYXRlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBwb3B1bGF0ZVNjZW5lICgpIHtcclxuXHJcbiAgICAgICAgc3VwZXIucG9wdWxhdGVTY2VuZSgpOyBcclxuICAgICAgICBcclxuICAgICAgICB2YXIgaGVscGVyID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoMzAwLCAzMCwgMHg4NmU2ZmYsIDB4OTk5OTk5KTtcclxuICAgICAgICBoZWxwZXIubmFtZSA9IE9iamVjdE5hbWVzLkdyaWQ7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoaGVscGVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYWwgaW5pdGlhbGl6YXRpb25cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlci5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIFVJIGNvbnRyb2xzIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplVUlDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZVVJQ29udHJvbHMoKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyQ29udHJvbHMgPSBuZXcgTW9kZWxWaWV3ZXJDb250cm9scyh0aGlzKTtcclxuICAgIH1cclxuXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFNjZW5lXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgdGhlIHJlZmVyZW5jZSBncmlkLlxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5R3JpZCh2aXNpYmxlIDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBsZXQgZ3JpZEdlb21ldHJ5IDogVEhSRUUuT2JqZWN0M0QgPSB0aGlzLnNjZW5lLmdldE9iamVjdEJ5TmFtZShPYmplY3ROYW1lcy5HcmlkKTtcclxuICAgICAgICBncmlkR2VvbWV0cnkudmlzaWJsZSA9IHZpc2libGU7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBEaXNwbGF5IGdyaWQgPSAke3Zpc2libGV9YCk7XHJcbiAgICB9IFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBNZXNoIEdlbmVyYXRpb25cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGEgcmVsaWVmIGZyb20gdGhlIGN1cnJlbnQgbW9kZWwgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZW5lcmF0ZVJlbGllZigpIDogdm9pZCB7IFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHBpeGVsc1xyXG4gICAgICAgIGxldCB3aWR0aCAgPSA1MTI7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHdpZHRoIC8gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICBsZXQgZmFjdG9yeSA9IG5ldyBEZXB0aEJ1ZmZlckZhY3Rvcnkoe3dpZHRoIDogd2lkdGgsIGhlaWdodCA6IGhlaWdodCwgbW9kZWwgOiB0aGlzLm1vZGVsLCBjYW1lcmEgOiB0aGlzLmNhbWVyYSwgYWRkQ2FudmFzVG9ET00gOiBmYWxzZX0pOyAgIFxyXG5cclxuICAgICAgICBsZXQgcHJldmlld01lc2ggOiBUSFJFRS5NZXNoID0gZmFjdG9yeS5tZXNoR2VuZXJhdGUoe30pOyAgIFxyXG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRoaXMsIEV2ZW50VHlwZS5NZXNoR2VuZXJhdGUsIHByZXZpZXdNZXNoKTtcclxuXHJcbiAgICAgICAgLy8gU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRJbmZvTWVzc2FnZSgnUmVsaWVmIGdlbmVyYXRlZCcpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufSBcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuaW1wb3J0ICogYXMgZGF0ICAgIGZyb20gJ2RhdC1ndWknXHJcblxyXG5pbXBvcnQge1N0YW5kYXJkVmlld30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJDYW1lcmFcIlxyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICAgICAgICAgIGZyb20gXCJEZXB0aEJ1ZmZlckZhY3RvcnlcIlxyXG5pbXBvcnQge0V2ZW50VHlwZSwgTVJFdmVudCwgRXZlbnRNYW5hZ2VyfSAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdMb2FkZXInXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7TWVzaFZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk1lc2hWaWV3ZXJcIlxyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7T0JKTG9hZGVyfSAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk9CSkxvYWRlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VGVzdE1vZGVsfSAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVGVzdE1vZGVsTG9hZGVyJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJWaWV3ZXJcIlxyXG4gICAgXHJcbmV4cG9ydCBjbGFzcyBNb2RlbFJlbGllZiB7XHJcblxyXG4gICAgX21lc2hWaWV3ZXIgICAgICAgICAgICAgOiBNZXNoVmlld2VyO1xyXG4gICAgX21vZGVsVmlld2VyICAgICAgICAgICAgOiBNb2RlbFZpZXdlcjtcclxuICAgIF9sb2FkZXIgICAgICAgICAgICAgICAgIDogTG9hZGVyO1xyXG4gICAgXHJcbiAgICBfaW5pdGlhbE1lc2hHZW5lcmF0aW9uICA6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTW9kZWxSZWxpZWZcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgIFxyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEV2ZW50IEhhbmRsZXJzXHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIG1lc2ggZ2VuZXJhdGlvbi5cclxuICAgICAqIEBwYXJhbSBldmVudCBNZXNoIGdlbmVyYXRpb24gZXZlbnQuXHJcbiAgICAgKiBAcGFyYW1zIG1lc2ggTmV3bHktZ2VuZXJhdGVkIG1lc2guXHJcbiAgICAgKi9cclxuICAgIG9uTWVzaEdlbmVyYXRlIChldmVudCA6IE1SRXZlbnQsIG1lc2ggOiBUSFJFRS5NZXNoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX21lc2hWaWV3ZXIuc2V0TW9kZWwobWVzaCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pbml0aWFsTWVzaEdlbmVyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fbWVzaFZpZXdlci5maXRWaWV3KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxNZXNoR2VuZXJhdGlvbiA9IGZhbHNlOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIG5ldyBtb2RlbC5cclxuICAgICAqIEBwYXJhbSBldmVudCBOZXdNb2RlbCBldmVudC5cclxuICAgICAqIEBwYXJhbSBtb2RlbCBOZXdseSBsb2FkZWQgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIG9uTmV3TW9kZWwgKGV2ZW50IDogTVJFdmVudCwgbW9kZWwgOiBUSFJFRS5Hcm91cCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyLnNldENhbWVyYVRvU3RhbmRhcmRWaWV3KFN0YW5kYXJkVmlldy5Gcm9udCk7ICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyLnNldENhbWVyYVRvU3RhbmRhcmRWaWV3KFN0YW5kYXJkVmlldy5Ub3ApOyAgICAgICBcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2ggdGhlIG1vZGVsIFZpZXdlci5cclxuICAgICAqL1xyXG4gICAgcnVuICgpIHtcclxuXHJcbiAgICAgICAgU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRJbmZvTWVzc2FnZSAoJ01vZGVsUmVsaWVmIHN0YXJ0ZWQnKTsgICBcclxuICAgICAgIFxyXG4gICAgICAgIC8vIE1lc2ggUHJldmlld1xyXG4gICAgICAgIHRoaXMuX21lc2hWaWV3ZXIgPSAgbmV3IE1lc2hWaWV3ZXIoJ01lc2hWaWV3ZXInLCAnbWVzaENhbnZhcycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE1vZGVsIFZpZXdlciAgICBcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlciA9IG5ldyBNb2RlbFZpZXdlcignTW9kZWxWaWV3ZXInLCAnbW9kZWxDYW52YXMnKTtcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlci5ldmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTWVzaEdlbmVyYXRlLCB0aGlzLm9uTWVzaEdlbmVyYXRlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyLmV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5OZXdNb2RlbCwgICAgIHRoaXMub25OZXdNb2RlbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBMb2FkZXJcclxuICAgICAgICB0aGlzLl9sb2FkZXIgPSBuZXcgTG9hZGVyKCk7XHJcblxyXG4gICAgICAgIC8vIE9CSiBNb2RlbHNcclxuICAgICAgICB0aGlzLl9sb2FkZXIubG9hZE9CSk1vZGVsICh0aGlzLl9tb2RlbFZpZXdlcik7XHJcblxyXG4gICAgICAgIC8vIFRlc3QgTW9kZWxzXHJcbi8vICAgICAgdGhpcy5fbG9hZGVyLmxvYWRQYXJhbWV0cmljVGVzdE1vZGVsKHRoaXMuX21vZGVsVmlld2VyLCBUZXN0TW9kZWwuQ2hlY2tlcmJvYXJkKTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IG1vZGVsUmVsaWVmID0gbmV3IE1vZGVsUmVsaWVmKCk7XHJcbm1vZGVsUmVsaWVmLnJ1bigpO1xyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQge2Fzc2VydH0gICBmcm9tICdjaGFpJ1xyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9IGZyb20gJ0RlcHRoQnVmZmVyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSBmcm9tICdNYXRoJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vKipcclxuICogQGV4cG9ydHMgVmlld2VyL1ZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVuaXRUZXN0cyB7XHJcbiAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVW5pdFRlc3RzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgc3RhdGljIFZlcnRleE1hcHBpbmcgKGRlcHRoQnVmZmVyIDogRGVwdGhCdWZmZXIsIG1lc2ggOiBUSFJFRS5NZXNoKSB7XHJcblxyXG4gICAgICAgIGxldCBtZXNoR2VvbWV0cnkgOiBUSFJFRS5HZW9tZXRyeSA9IDxUSFJFRS5HZW9tZXRyeT4gbWVzaC5nZW9tZXRyeTtcclxuICAgICAgICBtZXNoR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gbWVzaEdlb21ldHJ5LmJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICAvLyB3aWR0aCAgPSAzICAgICAgICAgICAgICAzICAgNCAgIDVcclxuICAgICAgICAvLyBjb2x1bW4gPSAyICAgICAgICAgICAgICAwICAgMSAgIDJcclxuICAgICAgICAvLyBidWZmZXIgbGVuZ3RoID0gNlxyXG5cclxuICAgICAgICAvLyBUZXN0IFBvaW50cyAgICAgICAgICAgIFxyXG4gICAgICAgIGxldCBsb3dlckxlZnQgID0gYm91bmRpbmdCb3gubWluO1xyXG4gICAgICAgIGxldCBsb3dlclJpZ2h0ID0gbmV3IFRIUkVFLlZlY3RvcjMgKGJvdW5kaW5nQm94Lm1heC54LCBib3VuZGluZ0JveC5taW4ueSwgMCk7XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHQgPSBib3VuZGluZ0JveC5tYXg7XHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdCAgPSBuZXcgVEhSRUUuVmVjdG9yMyAoYm91bmRpbmdCb3gubWluLngsIGJvdW5kaW5nQm94Lm1heC55LCAwKTtcclxuICAgICAgICBsZXQgY2VudGVyICAgICA9IGJvdW5kaW5nQm94LmdldENlbnRlcigpO1xyXG5cclxuICAgICAgICAvLyBFeHBlY3RlZCBWYWx1ZXNcclxuICAgICAgICBsZXQgYnVmZmVyTGVuZ3RoICAgIDogbnVtYmVyID0gKGRlcHRoQnVmZmVyLndpZHRoICogZGVwdGhCdWZmZXIuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGZpcnN0Q29sdW1uICAgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBsYXN0Q29sdW1uICAgIDogbnVtYmVyID0gZGVwdGhCdWZmZXIud2lkdGggLSAxO1xyXG4gICAgICAgIGxldCBjZW50ZXJDb2x1bW4gIDogbnVtYmVyID0gTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci53aWR0aCAvIDIpO1xyXG4gICAgICAgIGxldCBmaXJzdFJvdyAgICAgIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbGFzdFJvdyAgICAgICA6IG51bWJlciA9IGRlcHRoQnVmZmVyLmhlaWdodCAtIDE7XHJcbiAgICAgICAgbGV0IGNlbnRlclJvdyAgICAgOiBudW1iZXIgPSBNYXRoLnJvdW5kKGRlcHRoQnVmZmVyLmhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICBsZXQgbG93ZXJMZWZ0SW5kZXggIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodEluZGV4IDogbnVtYmVyID0gZGVwdGhCdWZmZXIud2lkdGggLSAxO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0SW5kZXggOiBudW1iZXIgPSBidWZmZXJMZW5ndGggLSAxO1xyXG4gICAgICAgIGxldCB1cHBlckxlZnRJbmRleCAgOiBudW1iZXIgPSBidWZmZXJMZW5ndGggLSBkZXB0aEJ1ZmZlci53aWR0aDtcclxuICAgICAgICBsZXQgY2VudGVySW5kZXggICAgIDogbnVtYmVyID0gKGNlbnRlclJvdyAqIGRlcHRoQnVmZmVyLndpZHRoKSArICBNYXRoLnJvdW5kKGRlcHRoQnVmZmVyLndpZHRoIC8gMik7XHJcblxyXG4gICAgICAgIGxldCBsb3dlckxlZnRJbmRpY2VzICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihmaXJzdFJvdywgZmlyc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCBsb3dlclJpZ2h0SW5kaWNlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihmaXJzdFJvdywgbGFzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHRJbmRpY2VzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGxhc3RSb3csIGxhc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCB1cHBlckxlZnRJbmRpY2VzICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihsYXN0Um93LCBmaXJzdENvbHVtbik7XHJcbiAgICAgICAgbGV0IGNlbnRlckluZGljZXMgICAgIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKGNlbnRlclJvdywgY2VudGVyQ29sdW1uKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgaW5kZXggICA6IG51bWJlclxyXG4gICAgICAgIGxldCBpbmRpY2VzIDogVEhSRUUuVmVjdG9yMjtcclxuXHJcbiAgICAgICAgLy8gTG93ZXIgTGVmdFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXMobG93ZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCBsb3dlckxlZnRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggICA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgobG93ZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBsb3dlckxlZnRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIExvd2VyIFJpZ2h0XHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyhsb3dlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCBsb3dlclJpZ2h0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleChsb3dlclJpZ2h0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBsb3dlclJpZ2h0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBVcHBlciBSaWdodFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXModXBwZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgdXBwZXJSaWdodEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgodXBwZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgdXBwZXJSaWdodEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gVXBwZXIgTGVmdFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXModXBwZXJMZWZ0LCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbmRpY2VzLCB1cHBlckxlZnRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KHVwcGVyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgdXBwZXJMZWZ0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBDZW50ZXJcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKGNlbnRlciwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgY2VudGVySW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleChjZW50ZXIsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIGNlbnRlckluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICB9IFxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuaW1wb3J0ICogYXMgZGF0ICAgIGZyb20gJ2RhdC1ndWknXHJcblxyXG5pbXBvcnQge0NhbWVyYX0gICAgICAgICAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgICAgIGZyb20gJ0RlcHRoQnVmZmVyRmFjdG9yeSdcclxuaW1wb3J0IHtHcmFwaGljcywgT2JqZWN0TmFtZXN9ICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7TWVzaFZpZXdlcn0gICAgICAgICAgICAgICAgIGZyb20gXCJNZXNoVmlld2VyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1VuaXRUZXN0c30gICAgICAgICAgICAgICAgICBmcm9tICdVbml0VGVzdHMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhbWVyYVNldHRpbmdzIHtcclxuICAgIHBvc2l0aW9uOiAgICAgICBUSFJFRS5WZWN0b3IzOyAgICAgICAgLy8gbG9jYXRpb24gb2YgY2FtZXJhXHJcbiAgICB0YXJnZXQ6ICAgICAgICAgVEhSRUUuVmVjdG9yMzsgICAgICAgIC8vIHRhcmdldCBwb2ludFxyXG4gICAgbmVhcjogICAgICAgICAgIG51bWJlcjsgICAgICAgICAgICAgICAvLyBuZWFyIGNsaXBwaW5nIHBsYW5lXHJcbiAgICBmYXI6ICAgICAgICAgICAgbnVtYmVyOyAgICAgICAgICAgICAgIC8vIGZhciBjbGlwcGluZyBwbGFuZVxyXG4gICAgZmllbGRPZlZpZXc6ICAgIG51bWJlcjsgICAgICAgICAgICAgICAvLyBmaWVsZCBvZiB2aWV3XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQ2FtZXJhV29ya2JlbmNoXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FtZXJhVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuXHJcbiAgICBwb3B1bGF0ZVNjZW5lKCkge1xyXG5cclxuICAgICAgICBsZXQgdHJpYWQgPSBHcmFwaGljcy5jcmVhdGVXb3JsZEF4ZXNUcmlhZChuZXcgVEhSRUUuVmVjdG9yMygpLCAxLCAwLjI1LCAwLjI1KTtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQodHJpYWQpO1xyXG5cclxuICAgICAgICBsZXQgYm94IDogVEhSRUUuTWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJveE1lc2gobmV3IFRIUkVFLlZlY3RvcjMoNCwgNiwgLTIpLCAxLCAyLCAyLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe2NvbG9yIDogMHhmZjAwMDB9KSk7XHJcbiAgICAgICAgYm94LnJvdGF0aW9uLnNldChNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKTtcclxuICAgICAgICBib3gudXBkYXRlTWF0cml4V29ybGQodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5hZGQoYm94KTtcclxuXHJcbiAgICAgICAgbGV0IHNwaGVyZSA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKC0zLCAxMCwgLTEpLCAxLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe2NvbG9yIDogMHgwMGZmMDB9KSk7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5hZGQoc3BoZXJlKTtcclxuICAgIH0gICBcclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBWaWV3ZXJDb250cm9sc1xyXG4gKi9cclxuY2xhc3MgVmlld2VyQ29udHJvbHMge1xyXG5cclxuICAgIHNob3dCb3VuZGluZ0JveGVzIDogKCkgPT4gdm9pZDtcclxuICAgIHNldENsaXBwaW5nUGxhbmVzIDogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBzaG93Qm91bmRpbmdCb3hlcyA6ICgpID0+IGFueSwgc2V0Q2xpcHBpbmdQbGFuZXMgOiAoKSA9PiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93Qm91bmRpbmdCb3hlcyA9IHNob3dCb3VuZGluZ0JveGVzO1xyXG4gICAgICAgIHRoaXMuc2V0Q2xpcHBpbmdQbGFuZXMgID0gc2V0Q2xpcHBpbmdQbGFuZXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQXBwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICAgIFxyXG4gICAgX2xvZ2dlciAgICAgICAgIDogQ29uc29sZUxvZ2dlcjtcclxuICAgIF9sb2FkZXIgICAgICAgICA6IExvYWRlcjtcclxuICAgIF92aWV3ZXIgICAgICAgICA6IENhbWVyYVZpZXdlcjtcclxuICAgIF92aWV3ZXJDb250cm9scyA6IFZpZXdlckNvbnRyb2xzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzIHRvIHRoZSBtb2RlbCBleHRlbnRzIGluIFZpZXcgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHNldENsaXBwaW5nUGxhbmVzKCkge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWwgICAgICAgICAgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICA9IHRoaXMuX3ZpZXdlci5tb2RlbDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNsb25lIG1vZGVsIChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXc6IFRIUkVFLkJveDMgPSBHcmFwaGljcy5nZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpOyAgICAgICAgXHJcblxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBib3ggaXMgd29ybGQtYXhpcyBhbGlnbmVkLiBcclxuICAgICAgICAvLyBJTnYgVmlldyBjb29yZGluYXRlcywgdGhlIGNhbWVyYSBpcyBhdCB0aGUgb3JpZ2luLlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBuZWFyIHBsYW5lIGlzIHRoZSBtYXhpbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgZmFyIHBsYW5lIGlzIHRoZSBtaW5pbXVtIFogb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAgICBsZXQgbmVhclBsYW5lID0gLWJvdW5kaW5nQm94Vmlldy5tYXguejtcclxuICAgICAgICBsZXQgZmFyUGxhbmUgID0gLWJvdW5kaW5nQm94Vmlldy5taW4uejtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyLl9jYW1lcmFDb250cm9scy5fY2FtZXJhU2V0dGluZ3MubmVhckNsaXBwaW5nUGxhbmUgPSBuZWFyUGxhbmU7XHJcbiAgICAgICAgdGhpcy5fdmlld2VyLl9jYW1lcmFDb250cm9scy5fY2FtZXJhU2V0dGluZ3MuZmFyQ2xpcHBpbmdQbGFuZSAgPSBmYXJQbGFuZTtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyLmNhbWVyYS5uZWFyID0gbmVhclBsYW5lO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEuZmFyICA9IGZhclBsYW5lO1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGJvdW5kaW5nIGJveCBtZXNoLlxyXG4gICAgICogQHBhcmFtIG9iamVjdCBUYXJnZXQgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIGNvbG9yIENvbG9yIG9mIGJvdW5kaW5nIGJveCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBjcmVhdGVCb3VuZGluZ0JveCAob2JqZWN0IDogVEhSRUUuT2JqZWN0M0QsIGNvbG9yIDogbnVtYmVyKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgYm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzID0gbmV3IFRIUkVFLkJveDMoKTtcclxuICAgICAgICAgICAgYm91bmRpbmdCb3ggPSBib3VuZGluZ0JveC5zZXRGcm9tT2JqZWN0KG9iamVjdCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHtjb2xvciA6IGNvbG9yLCBvcGFjaXR5IDogMS4wLCB3aXJlZnJhbWUgOiB0cnVlfSk7ICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgYm91bmRpbmdCb3hNZXNoIDogVEhSRUUuTWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveChib3VuZGluZ0JveC5nZXRDZW50ZXIoKSwgYm91bmRpbmdCb3gsIG1hdGVyaWFsKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94TWVzaDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU2hvdyB0aGUgY2xpcHBpbmcgcGxhbmVzIG9mIHRoZSBtb2RlbCBpbiBWaWV3IGFuZCBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc2hvd0JvdW5kaW5nQm94ZXMoKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbCAgICAgICAgICAgICAgICAgICAgOiBUSFJFRS5Hcm91cCAgID0gdGhpcy5fdmlld2VyLm1vZGVsO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZCAgICAgICAgOiBUSFJFRS5NYXRyaXg0ID0gdGhpcy5fdmlld2VyLmNhbWVyYS5tYXRyaXhXb3JsZDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmcgQm91bmRpbmdCb3hlcyBhbmQgbW9kZWwgY2xvbmUgKFZpZXcgY29vcmRpbmF0ZXMpXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlQWxsQnlOYW1lKHRoaXMuX3ZpZXdlci5fc2NlbmUsIE9iamVjdE5hbWVzLkJvdW5kaW5nQm94KTtcclxuICAgICAgICBHcmFwaGljcy5yZW1vdmVBbGxCeU5hbWUodGhpcy5fdmlld2VyLl9zY2VuZSwgT2JqZWN0TmFtZXMuTW9kZWxDbG9uZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY2xvbmUgbW9kZWwgKGFuZCBnZW9tZXRyeSEpXHJcbiAgICAgICAgbGV0IG1vZGVsVmlldyAgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QobW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbW9kZWxWaWV3Lm5hbWUgPSBPYmplY3ROYW1lcy5Nb2RlbENsb25lO1xyXG4gICAgICAgIG1vZGVsLmFkZChtb2RlbFZpZXcpO1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3IDogVEhSRUUuTWVzaCA9IHRoaXMuY3JlYXRlQm91bmRpbmdCb3gobW9kZWxWaWV3LCAweGZmMDBmZik7XHJcbiAgICAgICAgbW9kZWwuYWRkKGJvdW5kaW5nQm94Vmlldyk7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBib3VuZGluZyBib3ggYmFjayBmcm9tIFZpZXcgdG8gV29ybGRcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZCA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChib3VuZGluZ0JveFZpZXcsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBtb2RlbC5hZGQoYm91bmRpbmdCb3hXb3JsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplVmlld2VyQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlckNvbnRyb2xzID0gbmV3IFZpZXdlckNvbnRyb2xzKHRoaXMuX3ZpZXdlci5jYW1lcmEsIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMuYmluZCh0aGlzKSwgdGhpcy5zZXRDbGlwcGluZ1BsYW5lcy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgdmFyIGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBzZXR0aW5nc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5nc0NvbnRyb2xzJyk7XHJcbiAgICAgICAgc2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG4gICAgICAgIHZhciBmb2xkZXJPcHRpb25zID0gZ3VpLmFkZEZvbGRlcignQ2FtZXJhVGVzdCBPcHRpb25zJyk7XHJcblxyXG4gICAgICAgIC8vIFNob3cgQm91bmRpbmcgQm94ZXNcclxuICAgICAgICBsZXQgY29udHJvbFNob3dCb3VuZGluZ0JveGVzID0gZm9sZGVyT3B0aW9ucy5hZGQodGhpcy5fdmlld2VyQ29udHJvbHMsICdzaG93Qm91bmRpbmdCb3hlcycpLm5hbWUoJ1Nob3cgQm91bmRpbmcgQm94ZXMnKTtcclxuXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgUGxhbmVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTZXRDbGlwcGluZ1BsYW5lcyA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnc2V0Q2xpcHBpbmdQbGFuZXMnKS5uYW1lKCdTZXQgQ2xpcHBpbmcgUGxhbmVzJyk7XHJcblxyXG4gICAgICAgIGZvbGRlck9wdGlvbnMub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBydW4gKCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX3ZpZXdlciA9IG5ldyBDYW1lcmFWaWV3ZXIoJ0NhbWVyYVZpZXdlcicsICd2aWV3ZXJDYW52YXMnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXdlckNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBhcHAgPSBuZXcgQXBwO1xyXG5hcHAucnVuKCk7XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlclRlc3RcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlclRlc3Qge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBtYWluICgpIHtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGRlcHRoQnVmZmVyVGVzdCA9IG5ldyBEZXB0aEJ1ZmZlclRlc3QoKTtcclxuZGVwdGhCdWZmZXJUZXN0Lm1haW4oKTtcclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxubGV0IGxvZ2dlciA9IG5ldyBIVE1MTG9nZ2VyKCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIFdpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFdpZGdldCB7XHJcbiAgICBcclxuICAgIG5hbWUgIDogc3RyaW5nO1xyXG4gICAgcHJpY2UgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJpY2UgOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lICA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlcmF0ZVxyXG4gICAgICovXHJcbiAgICBvcGVyYXRlICgpIHtcclxuICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UoYCR7dGhpcy5uYW1lfSBvcGVyYXRpbmcuLi4uYCk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBTdXBlcldpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbG9yV2lkZ2V0IGV4dGVuZHMgV2lkZ2V0IHtcclxuXHJcbiAgICBjb2xvciA6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmljZSA6IG51bWJlciwgY29sb3IgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIgKG5hbWUsIHByaWNlKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFuZFBhcmVudCB7XHJcblxyXG4gICAgZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmdyYW5kcGFyZW50UHJvcGVydHkgID0gZ3JhbmRwYXJlbnRQcm9wZXJ0eSA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJlbnQgZXh0ZW5kcyBHcmFuZFBhcmVudHtcclxuICAgIFxyXG4gICAgcGFyZW50UHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZywgcGFyZW50UHJvcGVydHkgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoZ3JhbmRwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRQcm9wZXJ0eSA9IHBhcmVudFByb3BlcnR5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBQYXJlbnR7XHJcbiAgICBcclxuICAgIGNoaWxkUHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5IDogc3RyaW5nLCBwYXJlbnRQcm9wZXJ0eSA6IHN0cmluZywgY2hpbGRQcm9wZXJ0eSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBzdXBlcihncmFuZHBhcmVudFByb3BlcnR5LCBwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5jaGlsZFByb3BlcnR5ID0gY2hpbGRQcm9wZXJ0eTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBJbmhlcml0YW5jZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluaGVyaXRhbmNlVGVzdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluXHJcbiAgICAgKi9cclxuICAgIG1haW4gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3aWRnZXQgPSBuZXcgV2lkZ2V0ICgnV2lkZ2V0JywgMS4wKTtcclxuICAgICAgICB3aWRnZXQub3BlcmF0ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY29sb3JXaWRnZXQgPSBuZXcgQ29sb3JXaWRnZXQgKCdDb2xvcldpZGdldCcsIDEuMCwgJ3JlZCcpO1xyXG4gICAgICAgIGNvbG9yV2lkZ2V0Lm9wZXJhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkID0gbmV3IENoaWxkKCdHYUdhJywgJ0RhZCcsICdTdGV2ZScpOyAgICBcclxuICAgIH1cclxufVxyXG5cclxubGV0IGluaGVyaXRhbmNlID0gbmV3IEluaGVyaXRhbmNlVGVzdDtcclxuaW5oZXJpdGFuY2UubWFpbigpO1xyXG4iXX0=

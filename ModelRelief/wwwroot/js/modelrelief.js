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
            if (!matrix)
                matrix = new THREE.Matrix4();
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
define("DepthBuffer/DepthBuffer", ["require", "exports", "chai", "three", "Viewer/Camera", "Viewer/Graphics", "System/Services"], function (require, exports, chai_1, THREE, Camera_1, Graphics_1, Services_2) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *  Mesh cache to optimize mesh creation.
     * If a mesh exists in the cache of the required dimensions, it is used as a template.
     *  @class
     */
    var MeshCache = (function () {
        /**
         * Constructor
         */
        function MeshCache() {
            this._cache = new Map();
        }
        /**
         * @description Generates the map key for a mesh.
         * @param {THREE.Vector2} modelExtents Extents of the camera near plane; model units.
         * @param {THREE.Vector2} pixelExtents Extents of the pixel array used to subdivide the mesh.
         * @returns {string}
         */
        MeshCache.prototype.generateKey = function (modelExtents, pixelExtents) {
            var aspectRatio = (modelExtents.x / modelExtents.y).toFixed(2).toString();
            return "Aspect = " + aspectRatio + " : Pixels = (" + Math.round(pixelExtents.x).toString() + ", " + Math.round(pixelExtents.y).toString() + ")";
        };
        /**
         * @description Returns a mesh from the cache as a template (or null);
         * @param {THREE.Vector2} modelExtents Extents of the camera near plane; model units.
         * @param {THREE.Vector2} pixelExtents Extents of the pixel array used to subdivide the mesh.
         * @returns {THREE.Mesh}
         */
        MeshCache.prototype.getMesh = function (modelExtents, pixelExtents) {
            var key = this.generateKey(modelExtents, pixelExtents);
            return this._cache[key];
        };
        /**
         * @description Adds a mesh instance to the cache.
         * @param {THREE.Vector2} modelExtents Extents of the camera near plane; model units.
         * @param {THREE.Vector2} pixelExtents Extents of the pixel array used to subdivide the mesh.
         * @param {THREE.Mesh} Mesh instance to add.
         * @returns {void}
         */
        MeshCache.prototype.addMesh = function (modelExtents, pixelExtents, mesh) {
            var key = this.generateKey(modelExtents, pixelExtents);
            if (this._cache[key])
                return;
            var meshClone = Graphics_1.Graphics.cloneAndTransformObject(mesh);
            this._cache[key] = meshClone;
        };
        return MeshCache;
    }());
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
            this._logger = Services_2.Services.consoleLogger;
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
         * @description Constructs a new mesh from an existing mesh of the same dimensions.
         * @param {THREE.Mesh} mesh Template mesh identical in model <and> pixel extents.
         * @param {THREE.Vector2} meshExtents Final mesh extents.
         * @param {THREE.Material} material Material to assign to the mesh.
         * @returns {THREE.Mesh}
         */
        DepthBuffer.prototype.constructMeshFromTemplate = function (mesh, meshExtents, material) {
            // The mesh template matches the aspect ratio of the template.
            // Now, scale the mesh to the final target dimensions.
            var boundingBox = Graphics_1.Graphics.getBoundingBoxFromObject(mesh);
            var scale = meshExtents.x / boundingBox.getSize().x;
            mesh.scale.x = scale;
            mesh.scale.y = scale;
            var meshVertices = mesh.geometry.vertices;
            var depthCount = this.depths.length;
            chai_1.assert(meshVertices.length === depthCount);
            for (var iDepth = 0; iDepth < depthCount; iDepth++) {
                var modelDepth = this.normalizedToModelDepth(this.depths[iDepth]);
                meshVertices[iDepth].set(meshVertices[iDepth].x, meshVertices[iDepth].y, modelDepth);
            }
            var meshGeometry = mesh.geometry;
            mesh = new THREE.Mesh(meshGeometry, material);
            return mesh;
        };
        /**
         * @description Constructs a new mesh from a collection of triangles.
         * @param {THREE.Vector2} meshXYExtents Extents of the mesh.
         * @param {THREE.Material} material Material to assign to the mesh.
         * @returns {THREE.Mesh}
         */
        DepthBuffer.prototype.constructMesh = function (meshXYExtents, material) {
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
            meshGeometry.mergeVertices();
            var mesh = new THREE.Mesh(meshGeometry, material);
            return mesh;
            var _a, _b;
        };
        /**
         * Constructs a mesh of the given base dimension.
         * @param meshXYExtents Base dimensions (model units). Height is controlled by DB aspect ratio.
         * @param material Material to assign to mesh.
         */
        DepthBuffer.prototype.mesh = function (material) {
            var timerTag = Services_2.Services.timer.mark('DepthBuffer.mesh');
            // The mesh size is in real world units to match the depth buffer offsets which are also in real world units.
            // Find the size of the near plane to size the mesh to the model units.
            var meshXYExtents = Camera_1.Camera.getNearPlaneExtents(this.camera);
            if (!material)
                material = new THREE.MeshPhongMaterial(DepthBuffer.DefaultMeshPhongMaterialParameters);
            var meshCache = DepthBuffer.Cache.getMesh(meshXYExtents, new THREE.Vector2(this.width, this.height));
            var mesh = meshCache ? this.constructMeshFromTemplate(meshCache, meshXYExtents, material) : this.constructMesh(meshXYExtents, material);
            mesh.name = DepthBuffer.MeshModelName;
            var meshGeometry = mesh.geometry;
            meshGeometry.verticesNeedUpdate = true;
            meshGeometry.normalsNeedUpdate = true;
            meshGeometry.elementsNeedUpdate = true;
            var faceNormalsTag = Services_2.Services.timer.mark('meshGeometry.computeFaceNormals');
            meshGeometry.computeVertexNormals();
            meshGeometry.computeFaceNormals();
            Services_2.Services.timer.logElapsedTime(faceNormalsTag);
            // Mesh was constructed with Z = depth buffer(X,Y).
            // Now rotate mesh to align with viewer XY plane so Top view is looking down on the mesh.
            mesh.rotateX(-Math.PI / 2);
            DepthBuffer.Cache.addMesh(meshXYExtents, new THREE.Vector2(this.width, this.height), mesh);
            Services_2.Services.timer.logElapsedTime(timerTag);
            return mesh;
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
        DepthBuffer.Cache = new MeshCache();
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
define("DepthBuffer/DepthBufferFactory", ["require", "exports", "three", "Viewer/Camera", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "System/Services", "System/Tools"], function (require, exports, THREE, Camera_2, DepthBuffer_1, Graphics_2, Services_3, Tools_1) {
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
            if (this._boundedClipping ||
                ((this._camera.near === Camera_2.Camera.DefaultNearClippingPlane) && (this._camera.far === Camera_2.Camera.DefaultFarClippingPlane)))
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
define("Viewer/Camera", ["require", "exports", "three", "DepthBuffer/DepthBufferFactory", "Viewer/Graphics", "System/Services"], function (require, exports, THREE, DepthBufferFactory_1, Graphics_3, Services_4) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StandardView;
    (function (StandardView) {
        StandardView[StandardView["None"] = 0] = "None";
        StandardView[StandardView["Front"] = 1] = "Front";
        StandardView[StandardView["Back"] = 2] = "Back";
        StandardView[StandardView["Top"] = 3] = "Top";
        StandardView[StandardView["Bottom"] = 4] = "Bottom";
        StandardView[StandardView["Left"] = 5] = "Left";
        StandardView[StandardView["Right"] = 6] = "Right";
        StandardView[StandardView["Isometric"] = 7] = "Isometric";
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
            var boundingBoxView = Graphics_3.Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);
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
                boundingBox = Graphics_3.Graphics.getBoundingBoxFromObject(model);
            if (!boundingBox.isEmpty())
                return boundingBox;
            // unit sphere proxy
            var sphereProxy = Graphics_3.Graphics.createSphereMesh(new THREE.Vector3(), 1);
            boundingBox = Graphics_3.Graphics.getBoundingBoxFromObject(sphereProxy);
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
            var boundingBoxView = Graphics_3.Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);
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
            var boundingBox = Graphics_3.Graphics.getBoundingBoxFromObject(model);
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
define("Viewer/CameraControls", ["require", "exports", "dat-gui", "Viewer/Camera", "Viewer/Graphics"], function (require, exports, dat, Camera_3, Graphics_4) {
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
            Graphics_4.Graphics.removeAllByName(this._viewer.scene, Graphics_4.ObjectNames.CameraHelper);
            // World
            Graphics_4.Graphics.addCameraHelper(this._viewer.camera, this._viewer.scene, this._viewer.model);
            // View
            var modelView = Graphics_4.Graphics.cloneAndTransformObject(this._viewer.model, this._viewer.camera.matrixWorldInverse);
            var cameraView = Camera_3.Camera.getDefaultCamera(this._viewer.aspectRatio);
            Graphics_4.Graphics.addCameraHelper(cameraView, this._viewer.scene, modelView);
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
define("Viewer/Viewer", ["require", "exports", "three", "Viewer/Camera", "Viewer/CameraControls", "System/EventManager", "Viewer/Graphics", "System/Services", "Viewer/TrackballControls"], function (require, exports, THREE, Camera_4, CameraControls_1, EventManager_1, Graphics_5, Services_6, TrackballControls_1) {
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
            this._canvas = Graphics_5.Graphics.initializeCanvas(modelCanvasId);
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
            Graphics_5.Graphics.removeObjectChildren(this._root, false);
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
            var mesh = Graphics_5.Graphics.createSphereMesh(new THREE.Vector3(), 2);
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
            var boundingBox = Graphics_5.Graphics.getBoundingBoxFromObject(this._root);
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
            Graphics_5.Graphics.removeObjectChildren(this._root, false);
        };
        /**
         * Creates the root object in the scene
         */
        Viewer.prototype.createRoot = function () {
            this._root = new THREE.Object3D();
            this._root.name = Graphics_5.ObjectNames.Root;
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
define("ModelLoaders/TestModelLoader", ["require", "exports", "three", "Viewer/Graphics"], function (require, exports, THREE, Graphics_6) {
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
            var mesh = Graphics_6.Graphics.createSphereMesh(new THREE.Vector3, radius, new THREE.MeshPhongMaterial({ color: testModelColor }));
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
            var mesh = Graphics_6.Graphics.createBoxMesh(new THREE.Vector3, width, height, depth, new THREE.MeshPhongMaterial({ color: testModelColor }));
            viewer.setModel(mesh);
        };
        /**
         * Add a sloped plane to a scene.
         * @param viewer Instance of the Viewer to display the model.
         */
        TestModelLoader.prototype.loadSlopedPlaneModel = function (viewer) {
            var width = 2;
            var height = 2;
            var mesh = Graphics_6.Graphics.createPlaneMesh(new THREE.Vector3, width, height, new THREE.MeshPhongMaterial({ color: testModelColor }));
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
                    var cell = Graphics_6.Graphics.createBoxMesh(cellOrigin, cellBase, cellBase, cellHeight, cellMaterial);
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
define("Viewer/MeshViewerControls", ["require", "exports", "dat-gui"], function (require, exports, dat) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * MeshViewer Settings
     */
    var MeshViewerSettings = (function () {
        function MeshViewerSettings(saveRelief) {
            this.saveRelief = saveRelief;
        }
        return MeshViewerSettings;
    }());
    /**
     * MeshViewer UI Controls.
     */
    var MeshViewerControls = (function () {
        /** Default constructor
         * @class MeshViewerControls
         * @constructor
         */
        function MeshViewerControls(meshViewer) {
            this._meshViewer = meshViewer;
            // UI Controls
            this.initializeControls();
        }
        //#region Event Handlers
        /**
         * Saves the relief to a disk file.
         */
        MeshViewerControls.prototype.saveRelief = function () {
            this._meshViewer.saveRelief();
        };
        //#endregion
        /**
         * Initialize the view settings that are controllable by the user
         */
        MeshViewerControls.prototype.initializeControls = function () {
            var scope = this;
            this._meshViewerSettings = new MeshViewerSettings(this.saveRelief.bind(this));
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById(this._meshViewer.containerId);
            menuDiv.appendChild(gui.domElement);
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            //                                                                   MeshViewer                                                                 //      
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            var meshViewerOptions = gui.addFolder('MeshViewer Options');
            // Save Relief
            var controlSaveRelief = meshViewerOptions.add(this._meshViewerSettings, 'saveRelief').name('Save Relief');
            meshViewerOptions.open();
        };
        return MeshViewerControls;
    }());
    exports.MeshViewerControls = MeshViewerControls;
});
// -------------------------------------------------------------------------------------// 
//                                                                                      // 
// @author mrdoob / http://mrdoob.com/                                                  // 
// https://github.com/AndrewRayCode/three-obj-exporter/blob/master/index.js       //
//                                                                                      // 
// -------------------------------------------------------------------------------------//
define("ModelExporters/OBJExporter", ["require", "exports", "three"], function (require, exports, THREE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OBJExporter = (function () {
        function OBJExporter() {
        }
        OBJExporter.prototype.parse = function (object) {
            var output = '';
            var indexVertex = 0;
            var indexVertexUvs = 0;
            var indexNormals = 0;
            var vertex = new THREE.Vector3();
            var normal = new THREE.Vector3();
            var uv = new THREE.Vector2();
            var i, j, k, l, m, face = [];
            var parseMesh = function (mesh) {
                var nbVertex = 0;
                var nbNormals = 0;
                var nbVertexUvs = 0;
                var geometry = mesh.geometry;
                var normalMatrixWorld = new THREE.Matrix3();
                if (geometry instanceof THREE.Geometry) {
                    geometry = new THREE.BufferGeometry().setFromObject(mesh);
                }
                if (geometry instanceof THREE.BufferGeometry) {
                    // shortcuts
                    var vertices = geometry.getAttribute('position');
                    var normals = geometry.getAttribute('normal');
                    var uvs = geometry.getAttribute('uv');
                    var indices = geometry.getIndex();
                    // name of the mesh object
                    output += 'o ' + mesh.name + '\n';
                    // name of the mesh material
                    if (mesh.material && mesh.material.name) {
                        output += 'usemtl ' + mesh.material.name + '\n';
                    }
                    // vertices
                    if (vertices !== undefined) {
                        for (i = 0, l = vertices.count; i < l; i++, nbVertex++) {
                            vertex.x = vertices.getX(i);
                            vertex.y = vertices.getY(i);
                            vertex.z = vertices.getZ(i);
                            // transfrom the vertex to world space
                            vertex.applyMatrix4(mesh.matrixWorld);
                            // transform the vertex to export format
                            output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';
                        }
                    }
                    // uvs
                    if (uvs !== undefined) {
                        for (i = 0, l = uvs.count; i < l; i++, nbVertexUvs++) {
                            uv.x = uvs.getX(i);
                            uv.y = uvs.getY(i);
                            // transform the uv to export format
                            output += 'vt ' + uv.x + ' ' + uv.y + '\n';
                        }
                    }
                    // normals
                    if (normals !== undefined) {
                        normalMatrixWorld.getNormalMatrix(mesh.matrixWorld);
                        for (i = 0, l = normals.count; i < l; i++, nbNormals++) {
                            normal.x = normals.getX(i);
                            normal.y = normals.getY(i);
                            normal.z = normals.getZ(i);
                            // transfrom the normal to world space
                            normal.applyMatrix3(normalMatrixWorld);
                            // transform the normal to export format
                            output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';
                        }
                    }
                    // faces
                    if (indices !== null) {
                        for (i = 0, l = indices.count; i < l; i += 3) {
                            for (m = 0; m < 3; m++) {
                                j = indices.getX(i + m) + 1;
                                face[m] = (indexVertex + j) + '/' + (uvs ? (indexVertexUvs + j) : '') + '/' + (indexNormals + j);
                            }
                            // transform the face to export format
                            output += 'f ' + face.join(' ') + "\n";
                        }
                    }
                    else {
                        for (i = 0, l = vertices.count; i < l; i += 3) {
                            for (m = 0; m < 3; m++) {
                                j = i + m + 1;
                                face[m] = (indexVertex + j) + '/' + (uvs ? (indexVertexUvs + j) : '') + '/' + (indexNormals + j);
                            }
                            // transform the face to export format
                            output += 'f ' + face.join(' ') + "\n";
                        }
                    }
                }
                else {
                    console.warn('THREE.OBJExporter.parseMesh(): geometry type unsupported', geometry);
                }
                // update index
                indexVertex += nbVertex;
                indexVertexUvs += nbVertexUvs;
                indexNormals += nbNormals;
            };
            var parseLine = function (line) {
                var nbVertex = 0;
                var geometry = line.geometry;
                var type = line.type;
                if (geometry instanceof THREE.Geometry) {
                    geometry = new THREE.BufferGeometry().setFromObject(line);
                }
                if (geometry instanceof THREE.BufferGeometry) {
                    // shortcuts
                    var vertices = geometry.getAttribute('position');
                    var indices = geometry.getIndex();
                    // name of the line object
                    output += 'o ' + line.name + '\n';
                    if (vertices !== undefined) {
                        for (i = 0, l = vertices.count; i < l; i++, nbVertex++) {
                            vertex.x = vertices.getX(i);
                            vertex.y = vertices.getY(i);
                            vertex.z = vertices.getZ(i);
                            // transfrom the vertex to world space
                            vertex.applyMatrix4(line.matrixWorld);
                            // transform the vertex to export format
                            output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';
                        }
                    }
                    if (type === 'Line') {
                        output += 'l ';
                        for (j = 1, l = vertices.count; j <= l; j++) {
                            output += (indexVertex + j) + ' ';
                        }
                        output += '\n';
                    }
                    if (type === 'LineSegments') {
                        for (j = 1, k = j + 1, l = vertices.count; j < l; j += 2, k = j + 1) {
                            output += 'l ' + (indexVertex + j) + ' ' + (indexVertex + k) + '\n';
                        }
                    }
                }
                else {
                    console.warn('THREE.OBJExporter.parseLine(): geometry type unsupported', geometry);
                }
                // update index
                indexVertex += nbVertex;
            };
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    parseMesh(child);
                }
                if (child instanceof THREE.Line) {
                    parseLine(child);
                }
            });
            return output;
        };
        return OBJExporter;
    }());
    exports.OBJExporter = OBJExporter;
});
define("Viewer/MeshViewer", ["require", "exports", "three", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "Viewer/MeshViewerControls", "ModelExporters/OBJExporter", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, DepthBuffer_2, Graphics_7, MeshViewerControls_1, OBJExporter_1, Services_7, Viewer_1) {
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
            var mesh = Graphics_7.Graphics.createPlaneMesh(new THREE.Vector3(), height, width, new THREE.MeshPhongMaterial(DepthBuffer_2.DepthBuffer.DefaultMeshPhongMaterialParameters));
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
        /**
         * UI controls initialization.
         */
        MeshViewer.prototype.initializeUIControls = function () {
            _super.prototype.initializeUIControls.call(this);
            this._meshViewerControls = new MeshViewerControls_1.MeshViewerControls(this);
        };
        //#endregion
        //#region Save Operations
        /**
         * Saves a relief to a disk file.
         */
        MeshViewer.prototype.saveRelief = function () {
            var exportTag = Services_7.Services.timer.mark('Export OBJ');
            var exporter = new OBJExporter_1.OBJExporter();
            var result = exporter.parse(this.model);
            var request = new XMLHttpRequest();
            var viewerUrl = window.location.href;
            var postUrl = viewerUrl.replace('Viewer', 'Save');
            request.open("POST", postUrl, true);
            request.onload = function (oEvent) {
                // uploaded...
            };
            var blob = new Blob([result], { type: 'text/plain' });
            request.send(blob);
            Services_7.Services.timer.logElapsedTime(exportTag);
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
     * ModelViewer Settings
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
define("Workbench/CameraTest", ["require", "exports", "three", "dat-gui", "Viewer/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, dat, Graphics_8, Services_9, Viewer_3) {
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
            var triad = Graphics_8.Graphics.createWorldAxesTriad(new THREE.Vector3(), 1, 0.25, 0.25);
            this._scene.add(triad);
            var box = Graphics_8.Graphics.createBoxMesh(new THREE.Vector3(4, 6, -2), 1, 2, 2, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
            box.rotation.set(Math.random(), Math.random(), Math.random());
            box.updateMatrixWorld(true);
            this.model.add(box);
            var sphere = Graphics_8.Graphics.createSphereMesh(new THREE.Vector3(-3, 10, -1), 1, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
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
            var boundingBoxView = Graphics_8.Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);
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
            var boundingBoxMesh = Graphics_8.Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);
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
            Graphics_8.Graphics.removeAllByName(this._viewer._scene, Graphics_8.ObjectNames.BoundingBox);
            Graphics_8.Graphics.removeAllByName(this._viewer._scene, Graphics_8.ObjectNames.ModelClone);
            // clone model (and geometry!)
            var modelView = Graphics_8.Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
            modelView.name = Graphics_8.ObjectNames.ModelClone;
            model.add(modelView);
            var boundingBoxView = this.createBoundingBox(modelView, 0xff00ff);
            model.add(boundingBoxView);
            // transform bounding box back from View to World
            var boundingBoxWorld = Graphics_8.Graphics.cloneAndTransformObject(boundingBoxView, cameraMatrixWorld);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvU3lzdGVtL0xvZ2dlci50cyIsIlNjcmlwdHMvU3lzdGVtL1N0b3BXYXRjaC50cyIsIlNjcmlwdHMvU3lzdGVtL1NlcnZpY2VzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvR3JhcGhpY3MudHMiLCJTY3JpcHRzL1N5c3RlbS9NYXRoLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlci50cyIsIlNjcmlwdHMvU3lzdGVtL1Rvb2xzLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlckZhY3RvcnkudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmEudHMiLCJTY3JpcHRzL1N5c3RlbS9FdmVudE1hbmFnZXIudHMiLCJTY3JpcHRzL01vZGVsTG9hZGVycy9PQkpMb2FkZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmFDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL01hdGVyaWFscy50cyIsIlNjcmlwdHMvVmlld2VyL1RyYWNrYmFsbENvbnRyb2xzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvVmlld2VyLnRzIiwiU2NyaXB0cy9Nb2RlbExvYWRlcnMvVGVzdE1vZGVsTG9hZGVyLnRzIiwiU2NyaXB0cy9Nb2RlbExvYWRlcnMvTG9hZGVyLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTWVzaFZpZXdlckNvbnRyb2xzLnRzIiwiU2NyaXB0cy9Nb2RlbEV4cG9ydGVycy9PQkpFeHBvcnRlci50cyIsIlNjcmlwdHMvVmlld2VyL01lc2hWaWV3ZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9Nb2RlbFZpZXdlckNvbnRyb2xzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTW9kZWxWaWV3ZXIudHMiLCJTY3JpcHRzL01vZGVsUmVsaWVmLnRzIiwiU2NyaXB0cy9Vbml0VGVzdHMvVW5pdFRlc3RzLnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvQ2FtZXJhVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0RlcHRoQnVmZmVyVGVzdC50cyIsIlNjcmlwdHMvV29ya2Jl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LEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUV0RSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFFZCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUU3QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDcEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFFNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUNwQixDQUFDLEdBQUcsS0FBSyxDQUNaLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFFL0QsSUFB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UUFDSCw4QkFBSSxHQUFKO1lBRUksSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVqQixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlELFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUV0QixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDTCxzQkFBQztJQUFELENBckJBLEFBcUJDLElBQUE7SUFyQlksMENBQWU7SUF1QjVCLElBQUksV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDO0lBQ3RDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJ3d3dyb290L2pzL21vZGVscmVsaWVmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogTG9nZ2luZyBJbnRlcmZhY2VcclxuICogRGlhZ25vc3RpYyBsb2dnaW5nXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIExvZ2dlciB7XHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZyk7XHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpO1xyXG4gICAgYWRkSW5mb01lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nKTtcclxuICAgIGFkZE1lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpO1xyXG5cclxuICAgIGFkZEVtcHR5TGluZSAoKTtcclxuXHJcbiAgICBjbGVhckxvZygpO1xyXG59XHJcbiAgICAgICAgIFxyXG5lbnVtIE1lc3NhZ2VDbGFzcyB7XHJcbiAgICBFcnJvciAgID0gJ2xvZ0Vycm9yJyxcclxuICAgIFdhcm5pbmcgPSAnbG9nV2FybmluZycsXHJcbiAgICBJbmZvICAgID0gJ2xvZ0luZm8nLFxyXG4gICAgTm9uZSAgICA9ICdsb2dOb25lJ1xyXG59XHJcblxyXG4vKipcclxuICogQ29uc29sZSBsb2dnaW5nXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbnNvbGVMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXJ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSBnZW5lcmFsIG1lc3NhZ2UgYW5kIGFkZCB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VDbGFzcyBNZXNzYWdlIGNsYXNzLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlRW50cnkgKG1lc3NhZ2UgOiBzdHJpbmcsIG1lc3NhZ2VDbGFzcyA6IE1lc3NhZ2VDbGFzcykgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJlZml4ID0gJ01SOiAnO1xyXG4gICAgICAgIGxldCBsb2dNZXNzYWdlID0gYCR7cHJlZml4fSR7bWVzc2FnZX1gO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VDbGFzcykge1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuRXJyb3I6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5XYXJuaW5nOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5JbmZvOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5Ob25lOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobG9nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIGVycm9yTWVzc2FnZSBFcnJvciBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEVycm9yTWVzc2FnZSAoZXJyb3JNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KGVycm9yTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHdhcm5pbmcgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIHdhcm5pbmdNZXNzYWdlIFdhcm5pbmcgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkod2FybmluZ01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5XYXJuaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBpbmZvTWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeShpbmZvTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIHN0eWxlIE9wdGlvbmFsIHN0eWxlLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlIChtZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkobWVzc2FnZSwgTWVzc2FnZUNsYXNzLk5vbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBlbXB0eSBsaW5lXHJcbiAgICAgKi9cclxuICAgIGFkZEVtcHR5TGluZSAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBsb2cgb3V0cHV0XHJcbiAgICAgKi9cclxuICAgIGNsZWFyTG9nICgpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5jbGVhcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEhUTUwgbG9nZ2luZ1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBIVE1MTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2Vye1xyXG5cclxuICAgIHJvb3RJZCAgICAgICAgICAgOiBzdHJpbmc7XHJcbiAgICByb290RWxlbWVudFRhZyAgIDogc3RyaW5nO1xyXG4gICAgcm9vdEVsZW1lbnQgICAgICA6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIG1lc3NhZ2VUYWcgICAgICAgOiBzdHJpbmc7XHJcbiAgICBiYXNlTWVzc2FnZUNsYXNzIDogc3RyaW5nXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yb290SWQgICAgICAgICA9ICdsb2dnZXJSb290J1xyXG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnRUYWcgPSAndWwnO1xyXG5cclxuICAgICAgICB0aGlzLm1lc3NhZ2VUYWcgICAgICAgPSAnbGknO1xyXG4gICAgICAgIHRoaXMuYmFzZU1lc3NhZ2VDbGFzcyA9ICdsb2dNZXNzYWdlJztcclxuXHJcbiAgICAgICAgdGhpcy5yb290RWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7dGhpcy5yb290SWR9YCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3RFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnJvb3RFbGVtZW50VGFnKTtcclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudC5pZCA9IHRoaXMucm9vdElkO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0IGEgZ2VuZXJhbCBtZXNzYWdlIGFuZCBhcHBlbmQgdG8gdGhlIGxvZyByb290LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VDbGFzcyBDU1MgY2xhc3MgdG8gYmUgYWRkZWQgdG8gbWVzc2FnZS5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZUVsZW1lbnQgKG1lc3NhZ2UgOiBzdHJpbmcsIG1lc3NhZ2VDbGFzcz8gOiBzdHJpbmcpIDogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBtZXNzYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5tZXNzYWdlVGFnKTtcclxuICAgICAgICBtZXNzYWdlRWxlbWVudC50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VFbGVtZW50LmNsYXNzTmFtZSAgID0gYCR7dGhpcy5iYXNlTWVzc2FnZUNsYXNzfSAke21lc3NhZ2VDbGFzcyA/IG1lc3NhZ2VDbGFzcyA6ICcnfWA7O1xyXG5cclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2VFbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2UgRXJyb3IgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KGVycm9yTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHdhcm5pbmcgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIHdhcm5pbmdNZXNzYWdlIFdhcm5pbmcgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRXYXJuaW5nTWVzc2FnZSAod2FybmluZ01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRWxlbWVudCh3YXJuaW5nTWVzc2FnZSwgTWVzc2FnZUNsYXNzLldhcm5pbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGluZm9ybWF0aW9uYWwgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIGluZm9NZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkSW5mb01lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQoaW5mb01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5JbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBzdHlsZSBPcHRpb25hbCBDU1Mgc3R5bGUuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2UgKG1lc3NhZ2UgOiBzdHJpbmcsIHN0eWxlPyA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZUVsZW1lbnQgPSB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KG1lc3NhZ2UpO1xyXG4gICAgICAgIGlmIChzdHlsZSlcclxuICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBlbXB0eSBsaW5lXHJcbiAgICAgKi9cclxuICAgIGFkZEVtcHR5TGluZSAoKSB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxNDA1NDcvbGluZS1icmVhay1pbnNpZGUtYS1saXN0LWl0ZW0tZ2VuZXJhdGVzLXNwYWNlLWJldHdlZW4tdGhlLWxpbmVzXHJcbi8vICAgICAgdGhpcy5hZGRNZXNzYWdlKCc8YnIvPjxici8+Jyk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2UoJy4nKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBsb2cgb3V0cHV0XHJcbiAgICAgKi9cclxuICAgIGNsZWFyTG9nICgpIHtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzk1NTIyOS9yZW1vdmUtYWxsLWNoaWxkLWVsZW1lbnRzLW9mLWEtZG9tLW5vZGUtaW4tamF2YXNjcmlwdFxyXG4gICAgICAgIHdoaWxlICh0aGlzLnJvb3RFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnJvb3RFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7TG9nZ2VyfSAgICAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBUaW1lciByZWNvcmQuXHJcbiAqIEBpbnRlcmZhY2UgVGltZXJFbnRyeVxyXG4gKi9cclxuaW50ZXJmYWNlIFRpbWVyRW50cnkge1xyXG5cclxuICAgIHN0YXJ0VGltZSA6IG51bWJlcjtcclxuICAgIGluZGVudCAgICA6IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFN0b3BXYXRjaFxyXG4gKiBHZW5lcmFsIGRlYnVnZ2VyIHRpbWVyLlxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTdG9wV2F0Y2gge1xyXG4gICAgXHJcbiAgICBzdGF0aWMgcHJlY2lzaW9uIDogbnVtYmVyID0gMztcclxuXHJcbiAgICBfbG9nZ2VyICAgICAgICAgICAgOiBMb2dnZXI7XHJcbiAgICBfbmFtZSAgICAgICAgICAgICAgOiBzdHJpbmc7XHJcblxyXG4gICAgX2V2ZW50cyAgICAgICAgICAgIDogYW55O1xyXG4gICAgX2Jhc2VsaW5lVGltZSAgICAgIDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVyTmFtZSBUaW1lciBpZGVudGlmaWVyXHJcbiAgICAgKiBAcGFyYW0ge0xvZ2dlcn0gbG9nZ2VyIExvZ2dlclxyXG4gICAgICogTi5CLiBMb2dnZXIgaXMgcGFzc2VkIGFzIGEgY29uc3RydWN0b3IgcGFyYW1ldGVyIGJlY2F1c2UgU3RvcFdhdGNoIGFuZCBTZXJ2aWNlLmNvbnNvbGVMb2dnZXIgYXJlIHN0YXRpYyBTZXJ2aWNlIHByb3BlcnRpZXMuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRpbWVyTmFtZSA6IHN0cmluZywgbG9nZ2VyIDogTG9nZ2VyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcclxuICAgICAgICB0aGlzLl9uYW1lICAgPSB0aW1lck5hbWU7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzICA9IHt9XHJcbiAgICAgICAgdGhpcy5fYmFzZWxpbmVUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIHRoZSBtdW1iZXIgb2YgcGVuZGluZyBldmVudHMuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBldmVudENvdW50ICgpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50cykubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIGN1cnJlbnQgaW5kZW50IGxldmVsLlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgaW5kZW50UHJlZml4KCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCBpbmRlbnQ6IHN0cmluZyA9ICcgICAgJztcclxuICAgICAgICByZXR1cm4gaW5kZW50LnJlcGVhdCh0aGlzLmV2ZW50Q291bnQpO1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVzZXRzIHRoZSB0aW1lci5cclxuICAgICAqL1xyXG4gICAgbWFyayhldmVudCA6IHN0cmluZykgOiBzdHJpbmcge1xyXG5cclxuICAgICAgICBsZXQgc3RhcnRNaWxsaXNlY29uZHMgOiBudW1iZXIgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIGxldCBpbmRlbnRQcmVmaXggICAgICA6IHN0cmluZyA9IHRoaXMuaW5kZW50UHJlZml4O1xyXG4gICAgICAgIGxldCB0aW1lckVudHJ5ICAgICAgICA6IFRpbWVyRW50cnkgPSB7IHN0YXJ0VGltZTogc3RhcnRNaWxsaXNlY29uZHMsIGluZGVudCA6IGluZGVudFByZWZpeH07XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IHRpbWVyRW50cnk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGAke2luZGVudFByZWZpeH0ke2V2ZW50fWApO1xyXG5cclxuICAgICAgICByZXR1cm4gZXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyB0aGUgZWxhcHN0ZWQgdGltZS5cclxuICAgICAqL1xyXG4gICAgbG9nRWxhcHNlZFRpbWUoZXZlbnQgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyRWxhcHNlZFRpbWUgICA6IG51bWJlciA9IERhdGUubm93KCk7XHJcbiAgICAgICAgbGV0IGV2ZW50RWxhcHNlZFRpbWUgICA6IG51bWJlciA9ICh0aW1lckVsYXBzZWRUaW1lIC0gKDxudW1iZXI+ICh0aGlzLl9ldmVudHNbZXZlbnRdLnN0YXJ0VGltZSkpKSAvIDEwMDA7XHJcbiAgICAgICAgbGV0IGVsYXBzZWRUaW1lTWVzc2FnZSA6IHN0cmluZyA9IGV2ZW50RWxhcHNlZFRpbWUudG9GaXhlZChTdG9wV2F0Y2gucHJlY2lzaW9uKTtcclxuICAgICAgICBsZXQgaW5kZW50UHJlZml4ICAgICAgIDogc3RyaW5nID0gdGhpcy5fZXZlbnRzW2V2ZW50XS5pbmRlbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgJHtpbmRlbnRQcmVmaXh9JHtldmVudH0gOiAke2VsYXBzZWRUaW1lTWVzc2FnZX0gc2VjYCk7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBldmVudCBmcm9tIGxvZ1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnRdO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXIsIEhUTUxMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7U3RvcFdhdGNofSAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnU3RvcFdhdGNoJ1xyXG4vKipcclxuICogU2VydmljZXNcclxuICogR2VuZXJhbCBydW50aW1lIHN1cHBvcnRcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZXMge1xyXG5cclxuICAgIHN0YXRpYyBjb25zb2xlTG9nZ2VyIDogQ29uc29sZUxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKCk7XHJcbiAgICBzdGF0aWMgaHRtbExvZ2dlciAgICA6IEhUTUxMb2dnZXIgICAgPSBuZXcgSFRNTExvZ2dlcigpO1xyXG4gICAgc3RhdGljIHRpbWVyICAgICAgICAgOiBTdG9wV2F0Y2ggICAgID0gbmV3IFN0b3BXYXRjaCgnTWFzdGVyJywgU2VydmljZXMuY29uc29sZUxvZ2dlcik7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01vZGVsUmVsaWVmfSAgICAgICAgICAgIGZyb20gJ01vZGVsUmVsaWVmJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuZXhwb3J0IGVudW0gT2JqZWN0TmFtZXMge1xyXG5cclxuICAgIFJvb3QgICAgICAgICAgPSAgJ1Jvb3QnLFxyXG5cclxuICAgIEJvdW5kaW5nQm94ICAgPSAnQm91bmRpbmcgQm94JyxcclxuICAgIEJveCAgICAgICAgICAgPSAnQm94JyxcclxuICAgIENhbWVyYUhlbHBlciAgPSAnQ2FtZXJhSGVscGVyJyxcclxuICAgIE1vZGVsQ2xvbmUgICAgPSAnTW9kZWwgQ2xvbmUnLFxyXG4gICAgUGxhbmUgICAgICAgICA9ICdQbGFuZScsXHJcbiAgICBTcGhlcmUgICAgICAgID0gJ1NwaGVyZScsXHJcbiAgICBUcmlhZCAgICAgICAgID0gJ1RyaWFkJ1xyXG59XHJcblxyXG4vKipcclxuICogIEdlbmVyYWwgVEhSRUUuanMvV2ViR0wgc3VwcG9ydCByb3V0aW5lc1xyXG4gKiAgR3JhcGhpY3MgTGlicmFyeVxyXG4gKiAgQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR3JhcGhpY3Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEdlb21ldHJ5XHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdEdlb21ldHJ5XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogQGRlc2NyaXB0aW9uIERpc3Bvc2Ugb2YgcmVzb3VyY2VzIGhlbGQgYnkgYSBncmFwaGljYWwgb2JqZWN0LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHthbnl9IG9iamVjdDNkIE9iamVjdCB0byBwcm9jZXNzLlxyXG4gICAgICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgzNTc1MjkvdGhyZWVqcy1yZW1vdmUtb2JqZWN0LWZyb20tc2NlbmVcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRpc3Bvc2VSZXNvdXJjZXMob2JqZWN0M2QpIDogdm9pZCB7XHJcbiBcclxuICAgICAgICAvLyBsb2dnZXIuYWRkSW5mb01lc3NhZ2UgKCdSZW1vdmluZzogJyArIG9iamVjdDNkLm5hbWUpO1xyXG4gICAgICAgIGlmIChvYmplY3QzZC5oYXNPd25Qcm9wZXJ0eSgnZ2VvbWV0cnknKSkge1xyXG4gICAgICAgICAgICBvYmplY3QzZC5nZW9tZXRyeS5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ21hdGVyaWFsJykpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IG9iamVjdDNkLm1hdGVyaWFsO1xyXG4gICAgICAgICAgICBpZiAobWF0ZXJpYWwuaGFzT3duUHJvcGVydHkoJ21hdGVyaWFscycpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFscyA9IG1hdGVyaWFsLm1hdGVyaWFscztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlNYXRlcmlhbCBpbiBtYXRlcmlhbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWxzLmhhc093blByb3BlcnR5KGlNYXRlcmlhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxzW2lNYXRlcmlhbF0uZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCd0ZXh0dXJlJykpIHtcclxuICAgICAgICAgICAgb2JqZWN0M2QudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbiBvYmplY3QgYW5kIGFsbCBjaGlsZHJlbiBmcm9tIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgaG9sZGluZyBvYmplY3QgdG8gYmUgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSByb290T2JqZWN0IFBhcmVudCBvYmplY3QgKHBvc3NpYmx5IHdpdGggY2hpbGRyZW4pLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVtb3ZlT2JqZWN0Q2hpbGRyZW4ocm9vdE9iamVjdCA6IFRIUkVFLk9iamVjdDNELCByZW1vdmVSb290IDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBpZiAoIXJvb3RPYmplY3QpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGxvZ2dlciAgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIGxldCByZW1vdmVyID0gZnVuY3Rpb24gKG9iamVjdDNkKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QgPT09IHJvb3RPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBHcmFwaGljcy5kaXNwb3NlUmVzb3VyY2VzKG9iamVjdDNkKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByb290T2JqZWN0LnRyYXZlcnNlKHJlbW92ZXIpO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgcm9vdCBjaGlsZHJlbiBmcm9tIHJvb3RPYmplY3QgKGJhY2t3YXJkcyEpXHJcbiAgICAgICAgZm9yIChsZXQgaUNoaWxkIDogbnVtYmVyID0gKHJvb3RPYmplY3QuY2hpbGRyZW4ubGVuZ3RoIC0gMSk7IGlDaGlsZCA+PSAwOyBpQ2hpbGQtLSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNoaWxkIDogVEhSRUUuT2JqZWN0M0QgPSByb290T2JqZWN0LmNoaWxkcmVuW2lDaGlsZF07XHJcbiAgICAgICAgICAgIHJvb3RPYmplY3QucmVtb3ZlIChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVtb3ZlUm9vdCAmJiByb290T2JqZWN0LnBhcmVudClcclxuICAgICAgICAgICAgcm9vdE9iamVjdC5wYXJlbnQucmVtb3ZlKHJvb3RPYmplY3QpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhbGwgb2JqZWN0cyBvZiBhIGdpdmVuIG5hbWUgZnJvbSB0aGUgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgdG8gcHJvY2Vzcy5cclxuICAgICAqIEBwYXJhbSBvYmplY3ROYW1lIE9iamVjdCBuYW1lIHRvIGZpbmQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW1vdmVBbGxCeU5hbWUgKHNjZW5lIDogVEhSRUUuU2NlbmUsIG9iamVjdE5hbWUgOiBzdHJpbmcpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBvYmplY3Q6IFRIUkVFLk9iamVjdDNEO1xyXG4gICAgICAgIHdoaWxlIChvYmplY3QgPSBzY2VuZS5nZXRPYmplY3RCeU5hbWUob2JqZWN0TmFtZSkpIHtcclxuXHJcbiAgICAgICAgICAgIEdyYXBoaWNzLmRpc3Bvc2VSZXNvdXJjZXMob2JqZWN0KTtcclxuICAgICAgICAgICAgc2NlbmUucmVtb3ZlKG9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xvbmUgYW5kIHRyYW5zZm9ybSBhbiBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0IE9iamVjdCB0byBjbG9uZSBhbmQgdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIG1hdHJpeCBUcmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjbG9uZUFuZFRyYW5zZm9ybU9iamVjdCAob2JqZWN0IDogVEhSRUUuT2JqZWN0M0QsIG1hdHJpeD8gOiBUSFJFRS5NYXRyaXg0KSA6IFRIUkVFLk9iamVjdDNEIHtcclxuXHJcbiAgICAgICAgbGV0IG1ldGhvZFRhZyA6IHN0cmluZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ2Nsb25lQW5kVHJhbnNmb3JtT2JqZWN0Jyk7XHJcbiAgICAgICAgaWYgKCFtYXRyaXgpXHJcbiAgICAgICAgICAgIG1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcblxyXG4gICAgICAgIC8vIGNsb25lIG9iamVjdCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgY2xvbmVUYWc6IHN0cmluZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ2Nsb25lJyk7XHJcbiAgICAgICAgbGV0IG9iamVjdENsb25lIDogVEhSRUUuT2JqZWN0M0QgPSBvYmplY3QuY2xvbmUoKTtcclxuICAgICAgICBvYmplY3RDbG9uZS50cmF2ZXJzZShvYmplY3QgPT4ge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YoVEhSRUUuTWVzaCkpXHJcbiAgICAgICAgICAgICAgICBvYmplY3QuZ2VvbWV0cnkgPSBvYmplY3QuZ2VvbWV0cnkuY2xvbmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZShjbG9uZVRhZyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTi5CLiBJbXBvcnRhbnQhIFRoZSBwb3N0aW9uLCByb3RhdGlvbiAocXVhdGVybmlvbikgYW5kIHNjYWxlIGFyZSBjb3JyZWN0IGJ1dCB0aGUgbWF0cml4IGhhcyBub3QgYmVlbiB1cGRhdGVkLlxyXG4gICAgICAgIC8vIFRIUkVFLmpzIHVwZGF0ZXMgdGhlIG1hdHJpeCBpbiB0aGUgcmVuZGVyKCkgbG9vcC5cclxuICAgICAgICBsZXQgdHJhbnNmb3JtVGFnOiBzdHJpbmcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCd0cmFuc2Zvcm0nKTtcclxuICAgICAgICBvYmplY3RDbG9uZS51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTsgICAgIFxyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm1cclxuICAgICAgICBvYmplY3RDbG9uZS5hcHBseU1hdHJpeChtYXRyaXgpO1xyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRyYW5zZm9ybVRhZyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUobWV0aG9kVGFnKTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0Q2xvbmU7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGJvdW5kaW5nIGJveCBvZiBhIHRyYW5zZm9ybWVkIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBvYmplY3QgT2JqZWN0IHRvIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSBtYXRyaXggVHJhbnNmb3JtYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveChvYmplY3Q6IFRIUkVFLk9iamVjdDNELCBtYXRyaXg6IFRIUkVFLk1hdHJpeDQpOiBUSFJFRS5Cb3gzIHtcclxuXHJcbiAgICAgICAgbGV0IG1ldGhvZFRhZzogc3RyaW5nID0gU2VydmljZXMudGltZXIubWFyaygnZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveCcpO1xyXG5cclxuICAgICAgICBvYmplY3QudXBkYXRlTWF0cml4V29ybGQodHJ1ZSk7XHJcbiAgICAgICAgb2JqZWN0LmFwcGx5TWF0cml4KG1hdHJpeCk7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94OiBUSFJFRS5Cb3gzID0gR3JhcGhpY3MuZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KG9iamVjdCk7XHJcblxyXG4gICAgICAgIC8vIHJlc3RvcmUgb2JqZWN0XHJcbiAgICAgICAgbGV0IG1hdHJpeElkZW50aXR5ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuICAgICAgICBsZXQgbWF0cml4SW52ZXJzZSA9IG1hdHJpeElkZW50aXR5LmdldEludmVyc2UobWF0cml4LCB0cnVlKTtcclxuICAgICAgICBvYmplY3QuYXBwbHlNYXRyaXgobWF0cml4SW52ZXJzZSk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKG1ldGhvZFRhZyk7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEBwYXJhbSBtZXNoIE1lc2ggZnJvbSB3aGljaCB0byBjcmVhdGUgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE1hdGVyaWFsIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgKiBAIHJldHVybnMgTWVzaCBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlQm91bmRpbmdCb3hNZXNoRnJvbUdlb21ldHJ5KHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgZ2VvbWV0cnkgOiBUSFJFRS5HZW9tZXRyeSwgbWF0ZXJpYWwgOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoe1xyXG5cclxuICAgICAgICB2YXIgYm91bmRpbmdCb3ggICAgIDogVEhSRUUuQm94MyxcclxuICAgICAgICAgICAgd2lkdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBoZWlnaHQgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGRlcHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgYm94TWVzaCAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgYm91bmRpbmdCb3ggPSBnZW9tZXRyeS5ib3VuZGluZ0JveDtcclxuXHJcbiAgICAgICAgYm94TWVzaCA9IHRoaXMuY3JlYXRlQm91bmRpbmdCb3hNZXNoRnJvbUJvdW5kaW5nQm94IChwb3NpdGlvbiwgYm91bmRpbmdCb3gsIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJveE1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgYm94LlxyXG4gICAgICogQHBhcmFtIGJveCBHZW9tZXRyeSBCb3ggZnJvbSB3aGljaCB0byBjcmVhdGUgYm94IG1lc2guXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwgb2YgdGhlIGJveC5cclxuICAgICAqIEAgcmV0dXJucyBNZXNoIG9mIHRoZSBib3guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBib3VuZGluZ0JveCA6IFRIUkVFLkJveDMsIG1hdGVyaWFsIDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGVwdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBib3hNZXNoICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICB3aWR0aCAgPSBib3VuZGluZ0JveC5tYXgueCAtIGJvdW5kaW5nQm94Lm1pbi54O1xyXG4gICAgICAgIGhlaWdodCA9IGJvdW5kaW5nQm94Lm1heC55IC0gYm91bmRpbmdCb3gubWluLnk7XHJcbiAgICAgICAgZGVwdGggID0gYm91bmRpbmdCb3gubWF4LnogLSBib3VuZGluZ0JveC5taW4uejtcclxuXHJcbiAgICAgICAgYm94TWVzaCA9IHRoaXMuY3JlYXRlQm94TWVzaCAocG9zaXRpb24sIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCBtYXRlcmlhbCk7XHJcbiAgICAgICAgYm94TWVzaC5uYW1lID0gT2JqZWN0TmFtZXMuQm91bmRpbmdCb3g7XHJcblxyXG4gICAgICAgIHJldHVybiBib3hNZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgZXh0ZW5kcyBvZiBhbiBvYmplY3Qgb3B0aW9uYWxseSBpbmNsdWRpbmcgYWxsIGNoaWxkcmVuLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KHJvb3RPYmplY3QgOiBUSFJFRS5PYmplY3QzRCkgOiBUSFJFRS5Cb3gzIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyVGFnID0gU2VydmljZXMudGltZXIubWFyayhgJHtyb290T2JqZWN0Lm5hbWV9OiBCb3VuZGluZ0JveGApOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTU0OTI4NTcvYW55LXdheS10by1nZXQtYS1ib3VuZGluZy1ib3gtZnJvbS1hLXRocmVlLWpzLW9iamVjdDNkXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94IDogVEhSRUUuQm94MyA9IG5ldyBUSFJFRS5Cb3gzKCk7XHJcbiAgICAgICAgYm91bmRpbmdCb3ggPSBib3VuZGluZ0JveC5zZXRGcm9tT2JqZWN0KHJvb3RPYmplY3QpO1xyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZyk7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGJveCBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIHRoZSBib3guXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGguXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodC5cclxuICAgICAqIEBwYXJhbSBkZXB0aCBEZXB0aC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBPcHRpb25hbCBtYXRlcmlhbC5cclxuICAgICAqIEByZXR1cm5zIEJveCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlQm94TWVzaChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOiBudW1iZXIsIGRlcHRoIDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBib3hHZW9tZXRyeSAgOiBUSFJFRS5Cb3hHZW9tZXRyeSxcclxuICAgICAgICAgICAgYm94TWF0ZXJpYWwgIDogVEhSRUUuTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIGJveCAgICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIGJveEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHdpZHRoLCBoZWlnaHQsIGRlcHRoKTtcclxuICAgICAgICBib3hHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgYm94TWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMGZmLCBvcGFjaXR5OiAxLjB9ICk7XHJcblxyXG4gICAgICAgIGJveCA9IG5ldyBUSFJFRS5NZXNoKCBib3hHZW9tZXRyeSwgYm94TWF0ZXJpYWwpO1xyXG4gICAgICAgIGJveC5uYW1lID0gT2JqZWN0TmFtZXMuQm94O1xyXG4gICAgICAgIGJveC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJveDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBwbGFuZSBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIHRoZSBwbGFuZS5cclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE9wdGlvbmFsIG1hdGVyaWFsLlxyXG4gICAgICogQHJldHVybnMgUGxhbmUgbWVzaC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVBsYW5lTWVzaChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBcclxuICAgICAgICAgICAgcGxhbmVHZW9tZXRyeSAgOiBUSFJFRS5QbGFuZUdlb21ldHJ5LFxyXG4gICAgICAgICAgICBwbGFuZU1hdGVyaWFsICA6IFRIUkVFLk1hdGVyaWFsLFxyXG4gICAgICAgICAgICBwbGFuZSAgICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSh3aWR0aCwgaGVpZ2h0KTsgICAgICAgXHJcbiAgICAgICAgcGxhbmVNYXRlcmlhbCA9IG1hdGVyaWFsIHx8IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwZmYsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChwbGFuZUdlb21ldHJ5LCBwbGFuZU1hdGVyaWFsKTtcclxuICAgICAgICBwbGFuZS5uYW1lID0gT2JqZWN0TmFtZXMuUGxhbmU7XHJcbiAgICAgICAgcGxhbmUucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBwbGFuZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHNwaGVyZSBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIE9yaWdpbiBvZiB0aGUgc3BoZXJlLlxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBSYWRpdXMuXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVTcGhlcmVNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgcmFkaXVzIDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICB2YXIgc3BoZXJlR2VvbWV0cnkgIDogVEhSRUUuU3BoZXJlR2VvbWV0cnksXHJcbiAgICAgICAgICAgIHNlZ21lbnRDb3VudCAgICA6IG51bWJlciA9IDMyLFxyXG4gICAgICAgICAgICBzcGhlcmVNYXRlcmlhbCAgOiBUSFJFRS5NYXRlcmlhbCxcclxuICAgICAgICAgICAgc3BoZXJlICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgc3BoZXJlR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkocmFkaXVzLCBzZWdtZW50Q291bnQsIHNlZ21lbnRDb3VudCk7XHJcbiAgICAgICAgc3BoZXJlR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcblxyXG4gICAgICAgIHNwaGVyZU1hdGVyaWFsID0gbWF0ZXJpYWwgfHwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4ZmYwMDAwLCBvcGFjaXR5OiAxLjB9ICk7XHJcblxyXG4gICAgICAgIHNwaGVyZSA9IG5ldyBUSFJFRS5NZXNoKCBzcGhlcmVHZW9tZXRyeSwgc3BoZXJlTWF0ZXJpYWwgKTtcclxuICAgICAgICBzcGhlcmUubmFtZSA9IE9iamVjdE5hbWVzLlNwaGVyZTtcclxuICAgICAgICBzcGhlcmUucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBzcGhlcmU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGxpbmUgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0YXJ0UG9zaXRpb24gU3RhcnQgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0gZW5kUG9zaXRpb24gRW5kIHBvaW50LlxyXG4gICAgICogQHBhcmFtIGNvbG9yIENvbG9yLlxyXG4gICAgICogQHJldHVybnMgTGluZSBlbGVtZW50LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlTGluZShzdGFydFBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgZW5kUG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBjb2xvciA6IG51bWJlcikgOiBUSFJFRS5MaW5lIHtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgICAgICAgICAgICA6IFRIUkVFLkxpbmUsXHJcbiAgICAgICAgICAgIGxpbmVHZW9tZXRyeSAgICA6IFRIUkVFLkdlb21ldHJ5LFxyXG4gICAgICAgICAgICBtYXRlcmlhbCAgICAgICAgOiBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbGluZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICAgICAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2ggKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IGNvbG9yfSApO1xyXG4gICAgICAgIGxpbmUgPSBuZXcgVEhSRUUuTGluZShsaW5lR2VvbWV0cnksIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXhlcyB0cmlhZC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBPcmlnaW4gb2YgdGhlIHRyaWFkLlxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBMZW5ndGggb2YgdGhlIGNvb3JkaW5hdGUgYXJyb3cuXHJcbiAgICAgKiBAcGFyYW0gaGVhZExlbmd0aCBMZW5ndGggb2YgdGhlIGFycm93IGhlYWQuXHJcbiAgICAgKiBAcGFyYW0gaGVhZFdpZHRoIFdpZHRoIG9mIHRoZSBhcnJvdyBoZWFkLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlV29ybGRBeGVzVHJpYWQocG9zaXRpb24/IDogVEhSRUUuVmVjdG9yMywgbGVuZ3RoPyA6IG51bWJlciwgaGVhZExlbmd0aD8gOiBudW1iZXIsIGhlYWRXaWR0aD8gOiBudW1iZXIpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgdHJpYWRHcm91cCAgICAgIDogVEhSRUUuT2JqZWN0M0QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKSxcclxuICAgICAgICAgICAgYXJyb3dQb3NpdGlvbiAgIDogVEhSRUUuVmVjdG9yMyAgPSBwb3NpdGlvbiB8fG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgICAgICAgIGFycm93TGVuZ3RoICAgICA6IG51bWJlciA9IGxlbmd0aCAgICAgfHwgMTUsXHJcbiAgICAgICAgICAgIGFycm93SGVhZExlbmd0aCA6IG51bWJlciA9IGhlYWRMZW5ndGggfHwgMSxcclxuICAgICAgICAgICAgYXJyb3dIZWFkV2lkdGggIDogbnVtYmVyID0gaGVhZFdpZHRoICB8fCAxO1xyXG5cclxuICAgICAgICB0cmlhZEdyb3VwLmFkZChuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMCksIGFycm93UG9zaXRpb24sIGFycm93TGVuZ3RoLCAweGZmMDAwMCwgYXJyb3dIZWFkTGVuZ3RoLCBhcnJvd0hlYWRXaWR0aCkpO1xyXG4gICAgICAgIHRyaWFkR3JvdXAuYWRkKG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgYXJyb3dQb3NpdGlvbiwgYXJyb3dMZW5ndGgsIDB4MDBmZjAwLCBhcnJvd0hlYWRMZW5ndGgsIGFycm93SGVhZFdpZHRoKSk7XHJcbiAgICAgICAgdHJpYWRHcm91cC5hZGQobmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBhcnJvd1Bvc2l0aW9uLCBhcnJvd0xlbmd0aCwgMHgwMDAwZmYsIGFycm93SGVhZExlbmd0aCwgYXJyb3dIZWFkV2lkdGgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyaWFkR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGF4ZXMgZ3JpZC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAgT3JpZ2luIG9mIHRoZSBheGVzIGdyaWQuXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSBTaXplIG9mIHRoZSBncmlkLlxyXG4gICAgICogQHBhcmFtIHN0ZXAgR3JpZCBsaW5lIGludGVydmFscy5cclxuICAgICAqIEByZXR1cm5zIEdyaWQgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlV29ybGRBeGVzR3JpZChwb3NpdGlvbj8gOiBUSFJFRS5WZWN0b3IzLCBzaXplPyA6IG51bWJlciwgc3RlcD8gOiBudW1iZXIpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgZ3JpZEdyb3VwICAgICAgIDogVEhSRUUuT2JqZWN0M0QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKSxcclxuICAgICAgICAgICAgZ3JpZFBvc2l0aW9uICAgIDogVEhSRUUuVmVjdG9yMyAgPSBwb3NpdGlvbiB8fG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgICAgICAgIGdyaWRTaXplICAgICAgICA6IG51bWJlciA9IHNpemUgfHwgMTAsXHJcbiAgICAgICAgICAgIGdyaWRTdGVwICAgICAgICA6IG51bWJlciA9IHN0ZXAgfHwgMSxcclxuICAgICAgICAgICAgY29sb3JDZW50ZXJsaW5lIDogbnVtYmVyID0gIDB4ZmYwMDAwMDAsXHJcbiAgICAgICAgICAgIHh5R3JpZCAgICAgICAgICAgOiBUSFJFRS5HcmlkSGVscGVyLFxyXG4gICAgICAgICAgICB5ekdyaWQgICAgICAgICAgIDogVEhSRUUuR3JpZEhlbHBlcixcclxuICAgICAgICAgICAgenhHcmlkICAgICAgICAgICA6IFRIUkVFLkdyaWRIZWxwZXI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHh5R3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKGdyaWRTaXplLCBncmlkU3RlcCk7XHJcbiAgICAgICAgeHlHcmlkLnNldENvbG9ycyhjb2xvckNlbnRlcmxpbmUsIDB4ZmYwMDAwKTtcclxuICAgICAgICB4eUdyaWQucG9zaXRpb24uY29weShncmlkUG9zaXRpb24uY2xvbmUoKSk7XHJcbiAgICAgICAgeHlHcmlkLnJvdGF0ZU9uQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSwgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi54ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi55ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIGdyaWRHcm91cC5hZGQoeHlHcmlkKTtcclxuXHJcbiAgICAgICAgeXpHcmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoZ3JpZFNpemUsIGdyaWRTdGVwKTtcclxuICAgICAgICB5ekdyaWQuc2V0Q29sb3JzKGNvbG9yQ2VudGVybGluZSwgMHgwMGZmMDApO1xyXG4gICAgICAgIHl6R3JpZC5wb3NpdGlvbi5jb3B5KGdyaWRQb3NpdGlvbi5jbG9uZSgpKTtcclxuICAgICAgICB5ekdyaWQucm90YXRlT25BeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLnkgKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLnogKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgZ3JpZEdyb3VwLmFkZCh5ekdyaWQpO1xyXG5cclxuICAgICAgICB6eEdyaWQgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcihncmlkU2l6ZSwgZ3JpZFN0ZXApO1xyXG4gICAgICAgIHp4R3JpZC5zZXRDb2xvcnMoY29sb3JDZW50ZXJsaW5lLCAweDAwMDBmZik7XHJcbiAgICAgICAgenhHcmlkLnBvc2l0aW9uLmNvcHkoZ3JpZFBvc2l0aW9uLmNsb25lKCkpO1xyXG4gICAgICAgIHp4R3JpZC5yb3RhdGVPbkF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24ueiArPSBncmlkU2l6ZTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24ueCArPSBncmlkU2l6ZTtcclxuICAgICAgICBncmlkR3JvdXAuYWRkKHp4R3JpZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBncmlkR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIEFkZHMgYSBjYW1lcmEgaGVscGVyIHRvIGEgc2NlbmUgdG8gdmlzdWFsaXplIHRoZSBjYW1lcmEgcG9zaXRpb24uXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhIHRvIGNvbnN0cnVjdCBoZWxwZXIgKG1heSBiZSBudWxsKS5cclxuICAgICAgKi9cclxuICAgIHN0YXRpYyBhZGRDYW1lcmFIZWxwZXIgKGNhbWVyYSA6IFRIUkVFLkNhbWVyYSwgc2NlbmUgOiBUSFJFRS5TY2VuZSwgbW9kZWwgOiBUSFJFRS5Hcm91cCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKCFjYW1lcmEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gY2FtZXJhIHByb3BlcnRpZXNcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGQgICAgICAgIDogVEhSRUUuTWF0cml4NCA9IGNhbWVyYS5tYXRyaXhXb3JsZDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY29uc3RydWN0IHJvb3Qgb2JqZWN0IG9mIHRoZSBoZWxwZXJcclxuICAgICAgICBsZXQgY2FtZXJhSGVscGVyICA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIGNhbWVyYUhlbHBlci5uYW1lID0gT2JqZWN0TmFtZXMuQ2FtZXJhSGVscGVyOyAgICAgICBcclxuICAgICAgICBjYW1lcmFIZWxwZXIudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIG1vZGVsIGJvdW5kaW5nIGJveCAoVmlldyBjb29yZGluYXRlcylcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDAwMCwgd2lyZWZyYW1lOiB0cnVlLCB0cmFuc3BhcmVudDogZmFsc2UsIG9wYWNpdHk6IDAuMiB9KVxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXc6IFRIUkVFLkJveDMgPSBHcmFwaGljcy5nZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpOyAgICAgICAgXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94Vmlld01lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3goYm91bmRpbmdCb3hWaWV3LmdldENlbnRlcigpLCBib3VuZGluZ0JveFZpZXcsIGJvdW5kaW5nQm94TWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZE1lc2ggPSBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChib3VuZGluZ0JveFZpZXdNZXNoLCBjYW1lcmFNYXRyaXhXb3JsZCk7XHJcbiAgICAgICAgY2FtZXJhSGVscGVyLmFkZChib3VuZGluZ0JveFdvcmxkTWVzaCk7XHJcblxyXG4gICAgICAgIC8vIHBvc2l0aW9uXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChjYW1lcmEucG9zaXRpb24sIDMpO1xyXG4gICAgICAgIGNhbWVyYUhlbHBlci5hZGQocG9zaXRpb24pO1xyXG5cclxuICAgICAgICAvLyBjYW1lcmEgdGFyZ2V0IGxpbmVcclxuICAgICAgICBsZXQgdW5pdFRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIC0xKTtcclxuICAgICAgICB1bml0VGFyZ2V0LmFwcGx5UXVhdGVybmlvbihjYW1lcmEucXVhdGVybmlvbik7XHJcbiAgICAgICAgbGV0IHNjYWxlZFRhcmdldCA6IFRIUkVFLlZlY3RvcjM7XHJcbiAgICAgICAgc2NhbGVkVGFyZ2V0ID0gdW5pdFRhcmdldC5tdWx0aXBseVNjYWxhcigtYm91bmRpbmdCb3hWaWV3Lm1heC56KTtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0UG9pbnQgOiBUSFJFRS5WZWN0b3IzID0gY2FtZXJhLnBvc2l0aW9uO1xyXG4gICAgICAgIGxldCBlbmRQb2ludCAgIDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICAgICAgZW5kUG9pbnQuYWRkVmVjdG9ycyhzdGFydFBvaW50LCBzY2FsZWRUYXJnZXQpO1xyXG4gICAgICAgIGxldCB0YXJnZXRMaW5lIDogVEhSRUUuTGluZSA9IEdyYXBoaWNzLmNyZWF0ZUxpbmUoc3RhcnRQb2ludCwgZW5kUG9pbnQsIDB4MDBmZjAwKTtcclxuICAgICAgICBjYW1lcmFIZWxwZXIuYWRkKHRhcmdldExpbmUpO1xyXG5cclxuICAgICAgICBzY2VuZS5hZGQoY2FtZXJhSGVscGVyKTtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQWRkcyBhIGNvb3JkaW5hdGUgYXhpcyBoZWxwZXIgdG8gYSBzY2VuZSB0byB2aXN1YWxpemUgdGhlIHdvcmxkIGF4ZXMuXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqL1xyXG4gICAgc3RhdGljIGFkZEF4aXNIZWxwZXIgKHNjZW5lIDogVEhSRUUuU2NlbmUsIHNpemUgOiBudW1iZXIpIDogdm9pZHtcclxuXHJcbiAgICAgICAgbGV0IGF4aXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhpc0hlbHBlcihzaXplKTtcclxuICAgICAgICBheGlzSGVscGVyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHNjZW5lLmFkZChheGlzSGVscGVyKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gQ29vcmRpbmF0ZSBDb252ZXJzaW9uXHJcbiAgICAvKlxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIENvb3JkaW5hdGUgU3lzdGVtc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgRlJBTUVcdCAgICAgICAgICAgIEVYQU1QTEVcdFx0XHRcdFx0XHRcdFx0XHRcdFNQQUNFICAgICAgICAgICAgICAgICAgICAgIFVOSVRTICAgICAgICAgICAgICAgICAgICAgICBOT1RFU1xyXG5cclxuICAgIE1vZGVsICAgICAgICAgICAgICAgQ2F0YWxvZyBXZWJHTDogTW9kZWwsIEJhbmRFbGVtZW50IEJsb2NrICAgICBvYmplY3QgICAgICAgICAgICAgICAgICAgICAgbW0gICAgICAgICAgICAgICAgICAgICAgICAgIFJoaW5vIGRlZmluaXRpb25zXHJcbiAgICBXb3JsZCAgICAgICAgICAgICAgIERlc2lnbiBNb2RlbFx0XHRcdFx0XHRcdFx0XHR3b3JsZCAgICAgICAgICAgICAgICAgICAgICAgbW0gXHJcbiAgICBWaWV3ICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldyAgICAgICAgICAgICAgICAgICAgICAgIG1tXHJcbiAgICBEZXZpY2UgICAgICAgICAgICAgIE5vcm1hbGl6ZWQgdmlld1x0XHRcdFx0XHRcdFx0ICAgIGRldmljZSAgICAgICAgICAgICAgICAgICAgICBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgIFNjcmVlbi5QYWdlICAgICAgICAgSFRNTCBwYWdlXHRcdFx0XHRcdFx0XHRcdFx0c2NyZWVuICAgICAgICAgICAgICAgICAgICAgIHB4ICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAgYXQgVG9wIExlZnQsICtZIGRvd24gICAgSFRNTCBwYWdlXHJcbiAgICBTY3JlZW4uQ2xpZW50ICAgICAgIEJyb3dzZXIgdmlldyBwb3J0IFx0XHRcdFx0XHRcdCAgICBzY3JlZW4gICAgICAgICAgICAgICAgICAgICAgcHggICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCBhdCBUb3AgTGVmdCwgK1kgZG93biAgICBicm93c2VyIHdpbmRvd1xyXG4gICAgU2NyZWVuLkNvbnRhaW5lciAgICBET00gY29udGFpbmVyXHRcdFx0XHRcdFx0XHRcdHNjcmVlbiAgICAgICAgICAgICAgICAgICAgICBweCAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwIGF0IFRvcCBMZWZ0LCArWSBkb3duICAgIEhUTUwgY2FudmFzXHJcblxyXG4gICAgTW91c2UgRXZlbnQgUHJvcGVydGllc1xyXG4gICAgaHR0cDovL3d3dy5qYWNrbG1vb3JlLmNvbS9ub3Rlcy9tb3VzZS1wb3NpdGlvbi9cclxuICAgICovXHJcbiAgICAgICAgXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFdvcmxkIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHdvcmxkQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMyB7XHJcblxyXG4gICAgICAgIHZhciB3b3JsZENvb3JkaW5hdGVzICAgIDogVEhSRUUuVmVjdG9yMyxcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMyRCA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBkZXZpY2VaICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gdGhpcy5kZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICBkZXZpY2VaID0gKGNhbWVyYSBpbnN0YW5jZW9mIFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSA/IDAuNSA6IDEuMDtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEID0gbmV3IFRIUkVFLlZlY3RvcjMoZGV2aWNlQ29vcmRpbmF0ZXMyRC54LCBkZXZpY2VDb29yZGluYXRlczJELnksIGRldmljZVopO1xyXG5cclxuICAgICAgICB3b3JsZENvb3JkaW5hdGVzID0gZGV2aWNlQ29vcmRpbmF0ZXMzRC51bnByb2plY3QoY2FtZXJhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHdvcmxkQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRWaWV3IENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB3b3JsZCBjb29yZGluYXRlcyB0byB2aWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciBXb3JsZCBjb29yZGluYXRlIHZlY3RvciB0byBjb252ZXJ0LlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdmlld0Nvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IzIHtcclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLCAgXHJcbiAgICAgICAgICAgIHZpZXdDb29yZGluYXRlcyAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgdmlld0Nvb3JkaW5hdGVzID0gcG9zaXRpb24uYXBwbHlNYXRyaXg0KGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlld0Nvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0RGV2aWNlIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIG5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEByZXR1cm5zIE5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5KSA6IFRIUkVFLlZlY3RvcjIge1xyXG5cclxuICAgICAgICB2YXIgZGV2aWNlQ29vcmRpbmF0ZXMgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgcmF0aW9YLCAgcmF0aW9ZICAgICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGV2aWNlWCwgZGV2aWNlWSAgICAgICAgICAgICA6IG51bWJlcjtcclxuXHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgPSB0aGlzLnNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgcmF0aW9YID0gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueCAvIGNvbnRhaW5lci53aWR0aCgpO1xyXG4gICAgICAgIHJhdGlvWSA9IHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnkgLyBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGRldmljZVggPSArKChyYXRpb1ggKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZVkgPSAtKChyYXRpb1kgKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlWCwgZGV2aWNlWSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXZpY2VDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIGRldmljZSBjb29yZGluYXRlcyBbLTEsIDFdLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciAgV29ybGQgY29vcmRpbmF0ZXMgdmVjdG9yLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcHJldHVybnMgRGV2aWNlIGNvb3JpbmRhdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2lzc3Vlcy83OFxyXG4gICAgICAgIHZhciBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICA6IFRIUkVFLlZlY3RvcjMgPSB2ZWN0b3IuY2xvbmUoKSwgIFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgICAgICAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCA9IHBvc2l0aW9uLnByb2plY3QoY2FtZXJhKTtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlQ29vcmRpbmF0ZXMzRC54LCBkZXZpY2VDb29yZGluYXRlczNELnkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGV2aWNlQ29vcmRpbmF0ZXMyRDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFNjcmVlbiBDb29yZGluYXRlc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLyoqXHJcbiAgICAgKiBQYWdlIGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIChwYWdlKSBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlblBhZ2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlblBhZ2VDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cclxuICAgICAgICBzY3JlZW5QYWdlQ29vcmRpbmF0ZXMueCA9IGV2ZW50LnBhZ2VYO1xyXG4gICAgICAgIHNjcmVlblBhZ2VDb29yZGluYXRlcy55ID0gZXZlbnQucGFnZVk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5QYWdlQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2xpZW50IGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSA8YnJvd3Nlcj4gdmlldyBwb3J0LiBJZiB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gc2Nyb2xsZWQgaXQgd2lsbFxyXG4gICAgICogYmUgZGlmZmVyZW50IHRoYW4gdGhlIHBhZ2UgY29vcmRpbmF0ZXMgd2hpY2ggYXJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGUgdG9wIGxlZnQgb2YgdGhlIDxlbnRpcmU+IEhUTUwgcGFnZSBkb2N1bWVudC5cclxuICAgICAqIGh0dHA6Ly93d3cuYmVubmFkZWwuY29tL2Jsb2cvMTg2OS1qcXVlcnktbW91c2UtZXZlbnRzLXBhZ2V4LXktdnMtY2xpZW50eC15Lmh0bVxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiBjbGllbnQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5DbGllbnRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnkgPSBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBKUXVlcnkgZXZlbnQgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnkpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXHJcbiAgICAgICAgICAgIGNvbnRhaW5lck9mZnNldCAgICAgICAgICAgIDogSlF1ZXJ5Q29vcmRpbmF0ZXMsXHJcbiAgICAgICAgICAgIHBhZ2VYLCBwYWdlWSAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBjb250YWluZXJPZmZzZXQgPSBjb250YWluZXIub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEpRdWVyeSBkb2VzIG5vdCBzZXQgcGFnZVgvcGFnZVkgZm9yIERyb3AgZXZlbnRzLiBUaGV5IGFyZSBkZWZpbmVkIGluIHRoZSBvcmlnaW5hbEV2ZW50IG1lbWJlci5cclxuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYIHx8ICg8YW55PihldmVudC5vcmlnaW5hbEV2ZW50KSkucGFnZVg7XHJcbiAgICAgICAgcGFnZVkgPSBldmVudC5wYWdlWSB8fCAoPGFueT4oZXZlbnQub3JpZ2luYWxFdmVudCkpLnBhZ2VZO1xyXG5cclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy54ID0gcGFnZVggLSBjb250YWluZXJPZmZzZXQubGVmdDtcclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy55ID0gcGFnZVkgLSBjb250YWluZXJPZmZzZXQudG9wO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yIFdvcmxkIHZlY3Rvci5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvaXNzdWVzLzc4XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlcyAgICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgbGVmdCAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIHRvcCAgICAgICAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICAvLyBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlcyA9IHRoaXMuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyhwb3NpdGlvbiwgY2FtZXJhKTtcclxuICAgICAgICBsZWZ0ID0gKCgrZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMikgKiBjb250YWluZXIud2lkdGgoKTtcclxuICAgICAgICB0b3AgID0gKCgtZGV2aWNlQ29vcmRpbmF0ZXMueSArIDEpIC8gMikgKiBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIobGVmdCwgdG9wKTtcclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEludGVyc2VjdGlvbnNcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vICBJbnRlcnNlY3Rpb25zXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBSYXljYXN0ZXIgdGhyb3VnaCB0aGUgbW91c2Ugd29ybGQgcG9zaXRpb24uXHJcbiAgICAgKiBAcGFyYW0gbW91c2VXb3JsZCBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgVEhSRUUuUmF5Y2FzdGVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmF5Y2FzdGVyRnJvbU1vdXNlIChtb3VzZVdvcmxkIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlJheWNhc3RlcntcclxuXHJcbiAgICAgICAgdmFyIHJheU9yaWdpbiAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMgKG1vdXNlV29ybGQueCwgbW91c2VXb3JsZC55LCBjYW1lcmEucG9zaXRpb24ueiksXHJcbiAgICAgICAgICAgIHdvcmxkUG9pbnQgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMobW91c2VXb3JsZC54LCBtb3VzZVdvcmxkLnksIG1vdXNlV29ybGQueik7XHJcblxyXG4gICAgICAgICAgICAvLyBUb29scy5jb25zb2xlTG9nKCdXb3JsZCBtb3VzZSBjb29yZGluYXRlczogJyArIHdvcmxkUG9pbnQueCArICcsICcgKyB3b3JsZFBvaW50LnkpO1xyXG5cclxuICAgICAgICAvLyBjb25zdHJ1Y3QgcmF5IGZyb20gY2FtZXJhIHRvIG1vdXNlIHdvcmxkXHJcbiAgICAgICAgdmFyIHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIgKHJheU9yaWdpbiwgd29ybGRQb2ludC5zdWIgKHJheU9yaWdpbikubm9ybWFsaXplKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF5Y2FzdGVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBJbnRlcnNlY3Rpb24gbG9jYXRlZCBieSB0aGUgY3Vyc29yLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHBhcmFtIHNjZW5lT2JqZWN0cyBBcnJheSBvZiBzY2VuZSBvYmplY3RzLlxyXG4gICAgICogQHBhcmFtIHJlY3Vyc2UgUmVjdXJzZSB0aHJvdWdoIG9iamVjdHMuXHJcbiAgICAgKiBAcmV0dXJucyBGaXJzdCBpbnRlcnNlY3Rpb24gd2l0aCBzY3JlZW4gb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEZpcnN0SW50ZXJzZWN0aW9uKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhLCBzY2VuZU9iamVjdHMgOiBUSFJFRS5PYmplY3QzRFtdLCByZWN1cnNlIDogYm9vbGVhbikgOiBUSFJFRS5JbnRlcnNlY3Rpb24ge1xyXG5cclxuICAgICAgICB2YXIgcmF5Y2FzdGVyICAgICAgICAgIDogVEhSRUUuUmF5Y2FzdGVyLFxyXG4gICAgICAgICAgICBtb3VzZVdvcmxkICAgICAgICAgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBpSW50ZXJzZWN0aW9uICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGludGVyc2VjdGlvbiAgICAgICA6IFRIUkVFLkludGVyc2VjdGlvbjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnN0cnVjdCByYXkgZnJvbSBjYW1lcmEgdG8gbW91c2Ugd29ybGRcclxuICAgICAgICBtb3VzZVdvcmxkID0gR3JhcGhpY3Mud29ybGRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIsIGNhbWVyYSk7XHJcbiAgICAgICAgcmF5Y2FzdGVyICA9IEdyYXBoaWNzLnJheWNhc3RlckZyb21Nb3VzZSAobW91c2VXb3JsZCwgY2FtZXJhKTtcclxuXHJcbiAgICAgICAgLy8gZmluZCBhbGwgb2JqZWN0IGludGVyc2VjdGlvbnNcclxuICAgICAgICB2YXIgaW50ZXJzZWN0cyA6IFRIUkVFLkludGVyc2VjdGlvbltdID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMgKHNjZW5lT2JqZWN0cywgcmVjdXJzZSk7XHJcblxyXG4gICAgICAgIC8vIG5vIGludGVyc2VjdGlvbj9cclxuICAgICAgICBpZiAoaW50ZXJzZWN0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1c2UgZmlyc3Q7IHJlamVjdCBsaW5lcyAoVHJhbnNmb3JtIEZyYW1lKVxyXG4gICAgICAgIGZvciAoaUludGVyc2VjdGlvbiA9IDA7IGlJbnRlcnNlY3Rpb24gPCBpbnRlcnNlY3RzLmxlbmd0aDsgaUludGVyc2VjdGlvbisrKSB7XHJcblxyXG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3RzW2lJbnRlcnNlY3Rpb25dO1xyXG4gICAgICAgICAgICBpZiAoIShpbnRlcnNlY3Rpb24ub2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuTGluZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSGVscGVyc1xyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIEhlbHBlcnNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIFdlYkdMIHRhcmdldCBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gaWQgRE9NIGlkIGZvciBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgY2FudmFzLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZUNhbnZhcyhpZCA6IHN0cmluZywgd2lkdGg/IDogbnVtYmVyLCBoZWlnaHQ/IDogbnVtYmVyKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgIFxyXG4gICAgICAgIGxldCBjYW52YXMgOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aWR9YCk7XHJcbiAgICAgICAgaWYgKCFjYW52YXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYENhbnZhcyBlbGVtZW50IGlkID0gJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ1NTIGNvbnRyb2xzIHRoZSBzaXplXHJcbiAgICAgICAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KVxyXG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgZGltZW5zaW9ucyAgICBcclxuICAgICAgICBjYW52YXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIHJldHVybiBjYW52YXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IiwiICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGggTGlicmFyeVxyXG4gKiBHZW5lcmFsIG1hdGhlbWF0aWNzIHJvdXRpbmVzXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1hdGhMaWJyYXJ5IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHR3byBudW1iZXJzIGFyZSBlcXVhbCB3aXRoaW4gdGhlIGdpdmVuIHRvbGVyYW5jZS5cclxuICAgICAqIEBwYXJhbSB2YWx1ZSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlLlxyXG4gICAgICogQHBhcmFtIG90aGVyIFNlY29uZCB2YWx1ZSB0byBjb21wYXJlLlxyXG4gICAgICogQHBhcmFtIHRvbGVyYW5jZSBUb2xlcmFuY2UgZm9yIGNvbXBhcmlzb24uXHJcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHdpdGhpbiB0b2xlcmFuY2UuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBudW1iZXJzRXF1YWxXaXRoaW5Ub2xlcmFuY2UodmFsdWUgOiBudW1iZXIsIG90aGVyIDogbnVtYmVyLCB0b2xlcmFuY2UgOiBudW1iZXIpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoKHZhbHVlID49IChvdGhlciAtIHRvbGVyYW5jZSkpICYmICh2YWx1ZSA8PSAob3RoZXIgKyB0b2xlcmFuY2UpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQge2Fzc2VydH0gICAgICAgICAgICAgZnJvbSAnY2hhaSdcclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmF9ICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1N0b3BXYXRjaH0gICAgICAgICAgZnJvbSAnU3RvcFdhdGNoJ1xyXG5cclxuaW50ZXJmYWNlIEZhY2VQYWlyIHtcclxuICAgICAgICBcclxuICAgIHZlcnRpY2VzIDogVEhSRUUuVmVjdG9yM1tdO1xyXG4gICAgZmFjZXMgICAgOiBUSFJFRS5GYWNlM1tdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRmFjZVBhaXIge1xyXG5cclxuICAgIHZlcnRpY2VzOiBUSFJFRS5WZWN0b3IzW107XHJcbiAgICBmYWNlczogVEhSRUUuRmFjZTNbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqICBNZXNoIGNhY2hlIHRvIG9wdGltaXplIG1lc2ggY3JlYXRpb24uXHJcbiAqIElmIGEgbWVzaCBleGlzdHMgaW4gdGhlIGNhY2hlIG9mIHRoZSByZXF1aXJlZCBkaW1lbnNpb25zLCBpdCBpcyB1c2VkIGFzIGEgdGVtcGxhdGUuXHJcbiAqICBAY2xhc3NcclxuICovXHJcbmNsYXNzIE1lc2hDYWNoZSB7XHJcbiAgICBfY2FjaGUgOiBNYXA8c3RyaW5nLCBUSFJFRS5NZXNoPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgICAgICBcclxuICAgICAgICB0aGlzLl9jYWNoZSA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZXMgdGhlIG1hcCBrZXkgZm9yIGEgbWVzaC5cclxuICAgICAqIEBwYXJhbSB7VEhSRUUuVmVjdG9yMn0gbW9kZWxFeHRlbnRzIEV4dGVudHMgb2YgdGhlIGNhbWVyYSBuZWFyIHBsYW5lOyBtb2RlbCB1bml0cy5cclxuICAgICAqIEBwYXJhbSB7VEhSRUUuVmVjdG9yMn0gcGl4ZWxFeHRlbnRzIEV4dGVudHMgb2YgdGhlIHBpeGVsIGFycmF5IHVzZWQgdG8gc3ViZGl2aWRlIHRoZSBtZXNoLlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2VuZXJhdGVLZXkobW9kZWxFeHRlbnRzIDogVEhSRUUuVmVjdG9yMiwgcGl4ZWxFeHRlbnRzIDogVEhSRUUuVmVjdG9yMikgOiBzdHJpbmd7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGFzcGVjdFJhdGlvID0gKG1vZGVsRXh0ZW50cy54IC8gbW9kZWxFeHRlbnRzLnkgKS50b0ZpeGVkKDIpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBgQXNwZWN0ID0gJHthc3BlY3RSYXRpb30gOiBQaXhlbHMgPSAoJHtNYXRoLnJvdW5kKHBpeGVsRXh0ZW50cy54KS50b1N0cmluZygpfSwgJHtNYXRoLnJvdW5kKHBpeGVsRXh0ZW50cy55KS50b1N0cmluZygpfSlgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgYSBtZXNoIGZyb20gdGhlIGNhY2hlIGFzIGEgdGVtcGxhdGUgKG9yIG51bGwpO1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5WZWN0b3IyfSBtb2RlbEV4dGVudHMgRXh0ZW50cyBvZiB0aGUgY2FtZXJhIG5lYXIgcGxhbmU7IG1vZGVsIHVuaXRzLlxyXG4gICAgICogQHBhcmFtIHtUSFJFRS5WZWN0b3IyfSBwaXhlbEV4dGVudHMgRXh0ZW50cyBvZiB0aGUgcGl4ZWwgYXJyYXkgdXNlZCB0byBzdWJkaXZpZGUgdGhlIG1lc2guXHJcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuTWVzaH1cclxuICAgICAqL1xyXG4gICAgZ2V0TWVzaChtb2RlbEV4dGVudHM6IFRIUkVFLlZlY3RvcjIsIHBpeGVsRXh0ZW50czogVEhSRUUuVmVjdG9yMikgOiBUSFJFRS5NZXNoe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9IHRoaXMuZ2VuZXJhdGVLZXkobW9kZWxFeHRlbnRzLCBwaXhlbEV4dGVudHMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZVtrZXldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIEFkZHMgYSBtZXNoIGluc3RhbmNlIHRvIHRoZSBjYWNoZS5cclxuICAgICAqIEBwYXJhbSB7VEhSRUUuVmVjdG9yMn0gbW9kZWxFeHRlbnRzIEV4dGVudHMgb2YgdGhlIGNhbWVyYSBuZWFyIHBsYW5lOyBtb2RlbCB1bml0cy5cclxuICAgICAqIEBwYXJhbSB7VEhSRUUuVmVjdG9yMn0gcGl4ZWxFeHRlbnRzIEV4dGVudHMgb2YgdGhlIHBpeGVsIGFycmF5IHVzZWQgdG8gc3ViZGl2aWRlIHRoZSBtZXNoLlxyXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBNZXNoIGluc3RhbmNlIHRvIGFkZC5cclxuICAgICAqIEByZXR1cm5zIHt2b2lkfSBcclxuICAgICAqL1xyXG4gICAgYWRkTWVzaChtb2RlbEV4dGVudHM6IFRIUkVFLlZlY3RvcjIsIHBpeGVsRXh0ZW50czogVEhSRUUuVmVjdG9yMiwgbWVzaCA6IFRIUkVFLk1lc2gpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9IHRoaXMuZ2VuZXJhdGVLZXkobW9kZWxFeHRlbnRzLCBwaXhlbEV4dGVudHMpO1xyXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZVtrZXldKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBtZXNoQ2xvbmUgPSBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChtZXNoKTtcclxuICAgICAgICB0aGlzLl9jYWNoZVtrZXldID0gbWVzaENsb25lO1xyXG4gICAgfVxyXG59ICAgXHJcblxyXG4vKipcclxuICogIERlcHRoQnVmZmVyIFxyXG4gKiAgQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXIge1xyXG5cclxuICAgIHN0YXRpYyBDYWNoZSAgICAgICAgICAgICAgICAgICAgICAgICAgOiBNZXNoQ2FjaGUgPSBuZXcgTWVzaENhY2hlKCk7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgTWVzaE1vZGVsTmFtZSAgICAgICAgIDogc3RyaW5nID0gJ01vZGVsTWVzaCc7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgTm9ybWFsaXplZFRvbGVyYW5jZSAgIDogbnVtYmVyID0gLjAwMTsgICAgXHJcblxyXG4gICAgc3RhdGljIERlZmF1bHRNZXNoUGhvbmdNYXRlcmlhbFBhcmFtZXRlcnMgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbFBhcmFtZXRlcnMgPSB7c2lkZTogVEhSRUUuRG91YmxlU2lkZSwgd2lyZWZyYW1lIDogZmFsc2UsIGNvbG9yIDogMHhmZjAwZmYsIHJlZmxlY3Rpdml0eSA6IDAuNzUsIHNoaW5pbmVzcyA6IDAuNzV9O1xyXG4gICAgXHJcbiAgICBfbG9nZ2VyIDogTG9nZ2VyO1xyXG5cclxuICAgIF9yZ2JhQXJyYXkgOiBVaW50OEFycmF5O1xyXG4gICAgZGVwdGhzICAgICA6IEZsb2F0MzJBcnJheTtcclxuICAgIHdpZHRoICAgICAgOiBudW1iZXI7XHJcbiAgICBoZWlnaHQgICAgIDogbnVtYmVyO1xyXG5cclxuICAgIGNhbWVyYSAgICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcclxuICAgIF9uZWFyQ2xpcFBsYW5lICAgOiBudW1iZXI7XHJcbiAgICBfZmFyQ2xpcFBsYW5lICAgIDogbnVtYmVyO1xyXG4gICAgX2NhbWVyYUNsaXBSYW5nZSA6IG51bWJlcjtcclxuICAgIFxyXG4gICAgX21pbmltdW1Ob3JtYWxpemVkIDogbnVtYmVyO1xyXG4gICAgX21heGltdW1Ob3JtYWxpemVkIDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gcmdiYUFycmF5IFJhdyBhcmF5IG9mIFJHQkEgYnl0ZXMgcGFja2VkIHdpdGggZmxvYXRzLlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoIG9mIG1hcC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0IG9mIG1hcC5cclxuICAgICAqIEBwYXJhbSBuZWFyQ2xpcFBsYW5lIENhbWVyYSBuZWFyIGNsaXBwaW5nIHBsYW5lLlxyXG4gICAgICogQHBhcmFtIGZhckNsaXBQbGFuZSBDYW1lcmEgZmFyIGNsaXBwaW5nIHBsYW5lLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihyZ2JhQXJyYXkgOiBVaW50OEFycmF5LCB3aWR0aCA6IG51bWJlciwgaGVpZ2h0IDpudW1iZXIsIGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcmdiYUFycmF5ID0gcmdiYUFycmF5O1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoICA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gY2FtZXJhO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBhc3BlY3QgcmF0aW9uIG9mIHRoZSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCBhc3BlY3RSYXRpbyAoKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtaW5pbXVtTm9ybWFsaXplZCAoKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pbmltdW1Ob3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWluaW11bSBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1pbmltdW0oKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgbGV0IG1pbmltdW0gPSB0aGlzLm5vcm1hbGl6ZWRUb01vZGVsRGVwdGgodGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWluaW11bTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1heGltdW1Ob3JtYWxpemVkICgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4aW11bSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgbWF4aW11bSA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aCh0aGlzLm1pbmltdW1Ob3JtYWxpemVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1heGltdW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpemVkIGRlcHRoIHJhbmdlIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCByYW5nZU5vcm1hbGl6ZWQoKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgbGV0IGRlcHRoTm9ybWFsaXplZCA6IG51bWJlciA9IHRoaXMuX21heGltdW1Ob3JtYWxpemVkIC0gdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQ7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXB0aE5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpemVkIGRlcHRoIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCByYW5nZSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgZGVwdGggOiBudW1iZXIgPSB0aGlzLm1heGltdW0gLSB0aGlzLm1pbmltdW07XHJcblxyXG4gICAgICAgIHJldHVybiBkZXB0aDtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIHRoZSBleHRlbnRzIG9mIHRoZSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi8gICAgICAgXHJcbiAgICBjYWxjdWxhdGVFeHRlbnRzICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNaW5pbXVtTm9ybWFsaXplZCgpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXRNYXhpbXVtTm9ybWFsaXplZCgpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplXHJcbiAgICAgKi8gICAgICAgXHJcbiAgICBpbml0aWFsaXplICgpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyOyAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5fbmVhckNsaXBQbGFuZSAgID0gdGhpcy5jYW1lcmEubmVhcjtcclxuICAgICAgICB0aGlzLl9mYXJDbGlwUGxhbmUgICAgPSB0aGlzLmNhbWVyYS5mYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhQ2xpcFJhbmdlID0gdGhpcy5fZmFyQ2xpcFBsYW5lIC0gdGhpcy5fbmVhckNsaXBQbGFuZTtcclxuXHJcbiAgICAgICAgLy8gUkdCQSAtPiBGbG9hdDMyXHJcbiAgICAgICAgdGhpcy5kZXB0aHMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX3JnYmFBcnJheS5idWZmZXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBleHRyZW1hIG9mIGRlcHRoIGJ1ZmZlciB2YWx1ZXNcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUV4dGVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnQgYSBub3JtYWxpemVkIGRlcHRoIFswLDFdIHRvIGRlcHRoIGluIG1vZGVsIHVuaXRzLlxyXG4gICAgICogQHBhcmFtIG5vcm1hbGl6ZWREZXB0aCBOb3JtYWxpemVkIGRlcHRoIFswLDFdLlxyXG4gICAgICovXHJcbiAgICBub3JtYWxpemVkVG9Nb2RlbERlcHRoKG5vcm1hbGl6ZWREZXB0aCA6IG51bWJlcikgOiBudW1iZXIge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NjUyMjUzL2dldHRpbmctdGhlLXRydWUtei12YWx1ZS1mcm9tLXRoZS1kZXB0aC1idWZmZXJcclxuICAgICAgICBub3JtYWxpemVkRGVwdGggPSAyLjAgKiBub3JtYWxpemVkRGVwdGggLSAxLjA7XHJcbiAgICAgICAgbGV0IHpMaW5lYXIgPSAyLjAgKiB0aGlzLmNhbWVyYS5uZWFyICogdGhpcy5jYW1lcmEuZmFyIC8gKHRoaXMuY2FtZXJhLmZhciArIHRoaXMuY2FtZXJhLm5lYXIgLSBub3JtYWxpemVkRGVwdGggKiAodGhpcy5jYW1lcmEuZmFyIC0gdGhpcy5jYW1lcmEubmVhcikpO1xyXG5cclxuICAgICAgICAvLyB6TGluZWFyIGlzIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjYW1lcmE7IHJldmVyc2UgdG8geWllbGQgaGVpZ2h0IGZyb20gbWVzaCBwbGFuZVxyXG4gICAgICAgIHpMaW5lYXIgPSAtKHpMaW5lYXIgLSB0aGlzLmNhbWVyYS5mYXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gekxpbmVhcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUgYXQgYSBwaXhlbCBpbmRleFxyXG4gICAgICogQHBhcmFtIHJvdyBCdWZmZXIgcm93LlxyXG4gICAgICogQHBhcmFtIGNvbHVtbiBCdWZmZXIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBkZXB0aE5vcm1hbGl6ZWQgKHJvdyA6IG51bWJlciwgY29sdW1uKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBpbmRleCA9IChNYXRoLnJvdW5kKHJvdykgKiB0aGlzLndpZHRoKSArIE1hdGgucm91bmQoY29sdW1uKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXB0aHNbaW5kZXhdXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBkZXB0aCB2YWx1ZSBhdCBhIHBpeGVsIGluZGV4LlxyXG4gICAgICogQHBhcmFtIHJvdyBNYXAgcm93LlxyXG4gICAgICogQHBhcmFtIHBpeGVsQ29sdW1uIE1hcCBjb2x1bW4uXHJcbiAgICAgKi9cclxuICAgIGRlcHRoKHJvdyA6IG51bWJlciwgY29sdW1uKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBkZXB0aE5vcm1hbGl6ZWQgPSB0aGlzLmRlcHRoTm9ybWFsaXplZChyb3csIGNvbHVtbik7XHJcbiAgICAgICAgbGV0IGRlcHRoID0gdGhpcy5ub3JtYWxpemVkVG9Nb2RlbERlcHRoKGRlcHRoTm9ybWFsaXplZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgbWluaW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBzZXRNaW5pbXVtTm9ybWFsaXplZCgpIHtcclxuXHJcbiAgICAgICAgbGV0IG1pbmltdW1Ob3JtYWxpemVkIDogbnVtYmVyID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleDogbnVtYmVyID0gMDsgaW5kZXggPCB0aGlzLmRlcHRocy5sZW5ndGg7IGluZGV4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoVmFsdWUgOiBudW1iZXIgPSB0aGlzLmRlcHRoc1tpbmRleF07XHJcblxyXG4gICAgICAgICAgICBpZiAoZGVwdGhWYWx1ZSA8IG1pbmltdW1Ob3JtYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgbWluaW11bU5vcm1hbGl6ZWQgPSBkZXB0aFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21pbmltdW1Ob3JtYWxpemVkID0gbWluaW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBtYXhpbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHNldE1heGltdW1Ob3JtYWxpemVkKCkge1xyXG5cclxuICAgICAgICBsZXQgbWF4aW11bU5vcm1hbGl6ZWQgOiBudW1iZXIgPSBOdW1iZXIuTUlOX1ZBTFVFO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4OiBudW1iZXIgPSAwOyBpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aDsgaW5kZXgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGhWYWx1ZSA6IG51bWJlciA9IHRoaXMuZGVwdGhzW2luZGV4XTtcclxuICAgICAgICAgICAgaWYgKGRlcHRoVmFsdWUgPiBtYXhpbXVtTm9ybWFsaXplZClcclxuICAgICAgICAgICAgICAgIG1heGltdW1Ob3JtYWxpemVkID0gZGVwdGhWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9tYXhpbXVtTm9ybWFsaXplZCA9IG1heGltdW1Ob3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbGluZWFyIGluZGV4IG9mIGEgbW9kZWwgcG9pbnQgaW4gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gd29ybGRWZXJ0ZXggVmVydGV4IG9mIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXRNb2RlbFZlcnRleEluZGljZXMgKHdvcmxkVmVydGV4IDogVEhSRUUuVmVjdG9yMywgcGxhbmVCb3VuZGluZ0JveCA6IFRIUkVFLkJveDMpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICBcclxuICAgICAgICBsZXQgYm94U2l6ZSAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHBsYW5lQm91bmRpbmdCb3guZ2V0U2l6ZSgpO1xyXG4gICAgICAgIGxldCBtZXNoRXh0ZW50cyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIgKGJveFNpemUueCwgYm94U2l6ZS55KTtcclxuXHJcbiAgICAgICAgLy8gIG1hcCBjb29yZGluYXRlcyB0byBvZmZzZXRzIGluIHJhbmdlIFswLCAxXVxyXG4gICAgICAgIGxldCBvZmZzZXRYIDogbnVtYmVyID0gKHdvcmxkVmVydGV4LnggKyAoYm94U2l6ZS54IC8gMikpIC8gYm94U2l6ZS54O1xyXG4gICAgICAgIGxldCBvZmZzZXRZIDogbnVtYmVyID0gKHdvcmxkVmVydGV4LnkgKyAoYm94U2l6ZS55IC8gMikpIC8gYm94U2l6ZS55O1xyXG5cclxuICAgICAgICBsZXQgcm93ICAgIDogbnVtYmVyID0gb2Zmc2V0WSAqICh0aGlzLmhlaWdodCAtIDEpO1xyXG4gICAgICAgIGxldCBjb2x1bW4gOiBudW1iZXIgPSBvZmZzZXRYICogKHRoaXMud2lkdGggLSAxKTtcclxuICAgICAgICByb3cgICAgPSBNYXRoLnJvdW5kKHJvdyk7XHJcbiAgICAgICAgY29sdW1uID0gTWF0aC5yb3VuZChjb2x1bW4pO1xyXG5cclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChyb3cgPj0gMCkgJiYgKHJvdyA8IHRoaXMuaGVpZ2h0KSwgKGBWZXJ0ZXggKCR7d29ybGRWZXJ0ZXgueH0sICR7d29ybGRWZXJ0ZXgueX0sICR7d29ybGRWZXJ0ZXguen0pIHlpZWxkZWQgcm93ID0gJHtyb3d9YCkpO1xyXG4gICAgICAgIGFzc2VydC5pc1RydWUoKGNvbHVtbj49IDApICYmIChjb2x1bW4gPCB0aGlzLndpZHRoKSwgKGBWZXJ0ZXggKCR7d29ybGRWZXJ0ZXgueH0sICR7d29ybGRWZXJ0ZXgueX0sICR7d29ybGRWZXJ0ZXguen0pIHlpZWxkZWQgY29sdW1uID0gJHtjb2x1bW59YCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjIocm93LCBjb2x1bW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBsaW5lYXIgaW5kZXggb2YgYSBtb2RlbCBwb2ludCBpbiB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSB3b3JsZFZlcnRleCBWZXJ0ZXggb2YgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldE1vZGVsVmVydGV4SW5kZXggKHdvcmxkVmVydGV4IDogVEhSRUUuVmVjdG9yMywgcGxhbmVCb3VuZGluZ0JveCA6IFRIUkVFLkJveDMpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZXMgOiBUSFJFRS5WZWN0b3IyID0gdGhpcy5nZXRNb2RlbFZlcnRleEluZGljZXMod29ybGRWZXJ0ZXgsIHBsYW5lQm91bmRpbmdCb3gpOyAgICBcclxuICAgICAgICBsZXQgcm93ICAgIDogbnVtYmVyID0gaW5kaWNlcy54O1xyXG4gICAgICAgIGxldCBjb2x1bW4gOiBudW1iZXIgPSBpbmRpY2VzLnk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4ID0gKHJvdyAqIHRoaXMud2lkdGgpICsgY29sdW1uO1xyXG4gICAgICAgIGluZGV4ID0gTWF0aC5yb3VuZChpbmRleCk7XHJcblxyXG4gICAgICAgIGFzc2VydC5pc1RydWUoKGluZGV4ID49IDApICYmIChpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIGluZGV4ID0gJHtpbmRleH1gKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQ29uc3RydWN0cyBhIHBhaXIgb2YgdHJpYW5ndWxhciBmYWNlcyBhdCB0aGUgZ2l2ZW4gb2Zmc2V0IGluIHRoZSBEZXB0aEJ1ZmZlci5cclxuICAgICAgKiBAcGFyYW0gcm93IFJvdyBvZmZzZXQgKExvd2VyIExlZnQpLlxyXG4gICAgICAqIEBwYXJhbSBjb2x1bW4gQ29sdW1uIG9mZnNldCAoTG93ZXIgTGVmdCkuXHJcbiAgICAgICogQHBhcmFtIGZhY2VTaXplIFNpemUgb2YgYSBmYWNlIGVkZ2UgKG5vdCBoeXBvdGVudXNlKS5cclxuICAgICAgKiBAcGFyYW0gYmFzZVZlcnRleEluZGV4IEJlZ2lubmluZyBvZmZzZXQgaW4gbWVzaCBnZW9tZXRyeSB2ZXJ0ZXggYXJyYXkuXHJcbiAgICAgICovXHJcbiAgICAgY29uc3RydWN0VHJpRmFjZXNBdE9mZnNldCAocm93IDogbnVtYmVyLCBjb2x1bW4gOiBudW1iZXIsIG1lc2hMb3dlckxlZnQgOiBUSFJFRS5WZWN0b3IyLCBmYWNlU2l6ZSA6IG51bWJlciwgYmFzZVZlcnRleEluZGV4IDogbnVtYmVyKSA6IEZhY2VQYWlyIHtcclxuICAgICAgICAgXHJcbiAgICAgICAgIGxldCBmYWNlUGFpciA6IEZhY2VQYWlyID0ge1xyXG4gICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgIGZhY2VzICAgIDogW11cclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICAgLy8gIFZlcnRpY2VzXHJcbiAgICAgICAgIC8vICAgMiAgICAzICAgICAgIFxyXG4gICAgICAgICAvLyAgIDAgICAgMVxyXG4gICAgIFxyXG4gICAgICAgICAvLyBjb21wbGV0ZSBtZXNoIGNlbnRlciB3aWxsIGJlIGF0IHRoZSB3b3JsZCBvcmlnaW5cclxuICAgICAgICAgbGV0IG9yaWdpblggOiBudW1iZXIgPSBtZXNoTG93ZXJMZWZ0LnggKyAoY29sdW1uICogZmFjZVNpemUpO1xyXG4gICAgICAgICBsZXQgb3JpZ2luWSA6IG51bWJlciA9IG1lc2hMb3dlckxlZnQueSArIChyb3cgICAgKiBmYWNlU2l6ZSk7XHJcbiBcclxuICAgICAgICAgbGV0IGxvd2VyTGVmdCAgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIDAsICAgICAgICAgb3JpZ2luWSArIDAsICAgICAgICB0aGlzLmRlcHRoKHJvdyArIDAsIGNvbHVtbisgMCkpOyAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAwXHJcbiAgICAgICAgIGxldCBsb3dlclJpZ2h0ICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyBmYWNlU2l6ZSwgIG9yaWdpblkgKyAwLCAgICAgICAgdGhpcy5kZXB0aChyb3cgKyAwLCBjb2x1bW4gKyAxKSk7ICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMVxyXG4gICAgICAgICBsZXQgdXBwZXJMZWZ0ICAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgMCwgICAgICAgICBvcmlnaW5ZICsgZmFjZVNpemUsIHRoaXMuZGVwdGgocm93ICsgMSwgY29sdW1uICsgMCkpOyAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDJcclxuICAgICAgICAgbGV0IHVwcGVyUmlnaHQgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIGZhY2VTaXplLCAgb3JpZ2luWSArIGZhY2VTaXplLCB0aGlzLmRlcHRoKHJvdyArIDEsIGNvbHVtbiArIDEpKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAzXHJcbiBcclxuICAgICAgICAgZmFjZVBhaXIudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgICBsb3dlckxlZnQsICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDBcclxuICAgICAgICAgICAgICBsb3dlclJpZ2h0LCAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDFcclxuICAgICAgICAgICAgICB1cHBlckxlZnQsICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDJcclxuICAgICAgICAgICAgICB1cHBlclJpZ2h0ICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDNcclxuICAgICAgICAgICk7XHJcbiBcclxuICAgICAgICAgIC8vIHJpZ2h0IGhhbmQgcnVsZSBmb3IgcG9seWdvbiB3aW5kaW5nXHJcbiAgICAgICAgICBmYWNlUGFpci5mYWNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMyhiYXNlVmVydGV4SW5kZXggKyAwLCBiYXNlVmVydGV4SW5kZXggKyAxLCBiYXNlVmVydGV4SW5kZXggKyAzKSxcclxuICAgICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoYmFzZVZlcnRleEluZGV4ICsgMCwgYmFzZVZlcnRleEluZGV4ICsgMywgYmFzZVZlcnRleEluZGV4ICsgMilcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgcmV0dXJuIGZhY2VQYWlyO1xyXG4gICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQGRlc2NyaXB0aW9uIENvbnN0cnVjdHMgYSBuZXcgbWVzaCBmcm9tIGFuIGV4aXN0aW5nIG1lc2ggb2YgdGhlIHNhbWUgZGltZW5zaW9ucy5cclxuICAgICAgKiBAcGFyYW0ge1RIUkVFLk1lc2h9IG1lc2ggVGVtcGxhdGUgbWVzaCBpZGVudGljYWwgaW4gbW9kZWwgPGFuZD4gcGl4ZWwgZXh0ZW50cy5cclxuICAgICAgKiBAcGFyYW0ge1RIUkVFLlZlY3RvcjJ9IG1lc2hFeHRlbnRzIEZpbmFsIG1lc2ggZXh0ZW50cy5cclxuICAgICAgKiBAcGFyYW0ge1RIUkVFLk1hdGVyaWFsfSBtYXRlcmlhbCBNYXRlcmlhbCB0byBhc3NpZ24gdG8gdGhlIG1lc2guXHJcbiAgICAgICogQHJldHVybnMge1RIUkVFLk1lc2h9IFxyXG4gICAgICAqL1xyXG4gICAgIGNvbnN0cnVjdE1lc2hGcm9tVGVtcGxhdGUobWVzaCA6IFRIUkVFLk1lc2gsIG1lc2hFeHRlbnRzOiBUSFJFRS5WZWN0b3IyLCBtYXRlcmlhbDogVEhSRUUuTWF0ZXJpYWwpOiBUSFJFRS5NZXNoIHtcclxuICAgICAgIFxyXG4gICAgICAgIC8vIFRoZSBtZXNoIHRlbXBsYXRlIG1hdGNoZXMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgdGVtcGxhdGUuXHJcbiAgICAgICAgLy8gTm93LCBzY2FsZSB0aGUgbWVzaCB0byB0aGUgZmluYWwgdGFyZ2V0IGRpbWVuc2lvbnMuXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gR3JhcGhpY3MuZ2V0Qm91bmRpbmdCb3hGcm9tT2JqZWN0KG1lc2gpO1xyXG4gICAgICAgIGxldCBzY2FsZSA9IG1lc2hFeHRlbnRzLnggLyBib3VuZGluZ0JveC5nZXRTaXplKCkueDtcclxuICAgICAgICBtZXNoLnNjYWxlLnggPSBzY2FsZTtcclxuICAgICAgICBtZXNoLnNjYWxlLnkgPSBzY2FsZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbWVzaFZlcnRpY2VzID0gKDxUSFJFRS5HZW9tZXRyeT5tZXNoLmdlb21ldHJ5KS52ZXJ0aWNlcztcclxuICAgICAgICBsZXQgZGVwdGhDb3VudCA9IHRoaXMuZGVwdGhzLmxlbmd0aDtcclxuICAgICAgICBhc3NlcnQobWVzaFZlcnRpY2VzLmxlbmd0aCA9PT0gZGVwdGhDb3VudCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGlEZXB0aCA9IDA7IGlEZXB0aCA8IGRlcHRoQ291bnQ7IGlEZXB0aCsrKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbW9kZWxEZXB0aCA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aCh0aGlzLmRlcHRoc1tpRGVwdGhdKTtcclxuICAgICAgICAgICAgbWVzaFZlcnRpY2VzW2lEZXB0aF0uc2V0KG1lc2hWZXJ0aWNlc1tpRGVwdGhdLngsIG1lc2hWZXJ0aWNlc1tpRGVwdGhdLnksIG1vZGVsRGVwdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWVzaEdlb21ldHJ5OiBUSFJFRS5HZW9tZXRyeSA9IDxUSFJFRS5HZW9tZXRyeT5tZXNoLmdlb21ldHJ5O1xyXG4gICAgICAgIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChtZXNoR2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbWVzaDtcclxuICAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBDb25zdHJ1Y3RzIGEgbmV3IG1lc2ggZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJpYW5nbGVzLlxyXG4gICAgICAqIEBwYXJhbSB7VEhSRUUuVmVjdG9yMn0gbWVzaFhZRXh0ZW50cyBFeHRlbnRzIG9mIHRoZSBtZXNoLlxyXG4gICAgICAqIEBwYXJhbSB7VEhSRUUuTWF0ZXJpYWx9IG1hdGVyaWFsIE1hdGVyaWFsIHRvIGFzc2lnbiB0byB0aGUgbWVzaC5cclxuICAgICAgKiBAcmV0dXJucyB7VEhSRUUuTWVzaH0gXHJcbiAgICAgICovXHJcbiAgICBjb25zdHJ1Y3RNZXNoKG1lc2hYWUV4dGVudHMgOiBUSFJFRS5WZWN0b3IyLCBtYXRlcmlhbCA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIGxldCBtZXNoR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgICAgICBsZXQgZmFjZVNpemU6IG51bWJlciA9IG1lc2hYWUV4dGVudHMueCAvICh0aGlzLndpZHRoIC0gMSk7XHJcbiAgICAgICAgbGV0IGJhc2VWZXJ0ZXhJbmRleDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hMb3dlckxlZnQ6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigtKG1lc2hYWUV4dGVudHMueCAvIDIpLCAtKG1lc2hYWUV4dGVudHMueSAvIDIpKVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpUm93ID0gMDsgaVJvdyA8ICh0aGlzLmhlaWdodCAtIDEpOyBpUm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaUNvbHVtbiA9IDA7IGlDb2x1bW4gPCAodGhpcy53aWR0aCAtIDEpOyBpQ29sdW1uKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZmFjZVBhaXIgPSB0aGlzLmNvbnN0cnVjdFRyaUZhY2VzQXRPZmZzZXQoaVJvdywgaUNvbHVtbiwgbWVzaExvd2VyTGVmdCwgZmFjZVNpemUsIGJhc2VWZXJ0ZXhJbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWVzaEdlb21ldHJ5LnZlcnRpY2VzLnB1c2goLi4uZmFjZVBhaXIudmVydGljZXMpO1xyXG4gICAgICAgICAgICAgICAgbWVzaEdlb21ldHJ5LmZhY2VzLnB1c2goLi4uZmFjZVBhaXIuZmFjZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJhc2VWZXJ0ZXhJbmRleCArPSA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5tZXJnZVZlcnRpY2VzKCk7XHJcbiAgICAgICAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChtZXNoR2VvbWV0cnksIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7IFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIG1lc2ggb2YgdGhlIGdpdmVuIGJhc2UgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIG1lc2hYWUV4dGVudHMgQmFzZSBkaW1lbnNpb25zIChtb2RlbCB1bml0cykuIEhlaWdodCBpcyBjb250cm9sbGVkIGJ5IERCIGFzcGVjdCByYXRpby5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbCB0byBhc3NpZ24gdG8gbWVzaC5cclxuICAgICAqL1xyXG4gICAgbWVzaChtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyVGFnID0gU2VydmljZXMudGltZXIubWFyaygnRGVwdGhCdWZmZXIubWVzaCcpOyAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlIG1lc2ggc2l6ZSBpcyBpbiByZWFsIHdvcmxkIHVuaXRzIHRvIG1hdGNoIHRoZSBkZXB0aCBidWZmZXIgb2Zmc2V0cyB3aGljaCBhcmUgYWxzbyBpbiByZWFsIHdvcmxkIHVuaXRzLlxyXG4gICAgICAgIC8vIEZpbmQgdGhlIHNpemUgb2YgdGhlIG5lYXIgcGxhbmUgdG8gc2l6ZSB0aGUgbWVzaCB0byB0aGUgbW9kZWwgdW5pdHMuXHJcbiAgICAgICAgbGV0IG1lc2hYWUV4dGVudHMgOiBUSFJFRS5WZWN0b3IyID0gQ2FtZXJhLmdldE5lYXJQbGFuZUV4dGVudHModGhpcy5jYW1lcmEpOyAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIW1hdGVyaWFsKVxyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbChEZXB0aEJ1ZmZlci5EZWZhdWx0TWVzaFBob25nTWF0ZXJpYWxQYXJhbWV0ZXJzKTtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hDYWNoZTogVEhSRUUuTWVzaCA9IERlcHRoQnVmZmVyLkNhY2hlLmdldE1lc2gobWVzaFhZRXh0ZW50cywgbmV3IFRIUkVFLlZlY3RvcjIodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpKTtcclxuICAgICAgICBsZXQgbWVzaDogVEhSRUUuTWVzaCA9IG1lc2hDYWNoZSA/IHRoaXMuY29uc3RydWN0TWVzaEZyb21UZW1wbGF0ZShtZXNoQ2FjaGUsIG1lc2hYWUV4dGVudHMsIG1hdGVyaWFsKSA6IHRoaXMuY29uc3RydWN0TWVzaChtZXNoWFlFeHRlbnRzLCBtYXRlcmlhbCk7ICAgXHJcbiAgICAgICAgbWVzaC5uYW1lID0gRGVwdGhCdWZmZXIuTWVzaE1vZGVsTmFtZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbWVzaEdlb21ldHJ5ID0gPFRIUkVFLkdlb21ldHJ5Pm1lc2guZ2VvbWV0cnk7XHJcbiAgICAgICAgbWVzaEdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgbWVzaEdlb21ldHJ5Lm5vcm1hbHNOZWVkVXBkYXRlICA9IHRydWU7XHJcbiAgICAgICAgbWVzaEdlb21ldHJ5LmVsZW1lbnRzTmVlZFVwZGF0ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCBmYWNlTm9ybWFsc1RhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ21lc2hHZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMnKTtcclxuICAgICAgICBtZXNoR2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcclxuICAgICAgICBtZXNoR2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUoZmFjZU5vcm1hbHNUYWcpO1xyXG5cclxuICAgICAgICAvLyBNZXNoIHdhcyBjb25zdHJ1Y3RlZCB3aXRoIFogPSBkZXB0aCBidWZmZXIoWCxZKS5cclxuICAgICAgICAvLyBOb3cgcm90YXRlIG1lc2ggdG8gYWxpZ24gd2l0aCB2aWV3ZXIgWFkgcGxhbmUgc28gVG9wIHZpZXcgaXMgbG9va2luZyBkb3duIG9uIHRoZSBtZXNoLlxyXG4gICAgICAgIG1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIERlcHRoQnVmZmVyLkNhY2hlLmFkZE1lc2gobWVzaFhZRXh0ZW50cywgbmV3IFRIUkVFLlZlY3RvcjIodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpLCBtZXNoKTtcclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZylcclxuXHJcbiAgICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZXMgcHJvcGVydGllcyBvZiBhIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmNsZWFyTG9nKCk7XHJcblxyXG4gICAgICAgIGxldCBtaWRkbGUgPSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICBsZXQgZGVjaW1hbFBsYWNlcyA9IDU7XHJcbiAgICAgICAgbGV0IGhlYWRlclN0eWxlICAgPSBcImZvbnQtZmFtaWx5IDogbW9ub3NwYWNlOyBmb250LXdlaWdodCA6IGJvbGQ7IGNvbG9yIDogYmx1ZTsgZm9udC1zaXplIDogMThweFwiO1xyXG4gICAgICAgIGxldCBtZXNzYWdlU3R5bGUgID0gXCJmb250LWZhbWlseSA6IG1vbm9zcGFjZTsgY29sb3IgOiBibGFjazsgZm9udC1zaXplIDogMTRweFwiO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZSgnQ2FtZXJhIFByb3BlcnRpZXMnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE5lYXIgUGxhbmUgPSAke3RoaXMuY2FtZXJhLm5lYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgRmFyIFBsYW5lICA9ICR7dGhpcy5jYW1lcmEuZmFyfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENsaXAgUmFuZ2UgPSAke3RoaXMuY2FtZXJhLmZhciAtIHRoaXMuY2FtZXJhLm5lYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRW1wdHlMaW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKCdOb3JtYWxpemVkJywgaGVhZGVyU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBDZW50ZXIgRGVwdGggPSAke3RoaXMuZGVwdGhOb3JtYWxpemVkKG1pZGRsZSwgbWlkZGxlKS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYFogUmFuZ2UgPSAke3RoaXMucmFuZ2VOb3JtYWxpemVkLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWluaW11bSA9ICR7dGhpcy5taW5pbXVtTm9ybWFsaXplZC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1heGltdW0gPSAke3RoaXMubWF4aW11bU5vcm1hbGl6ZWQudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFbXB0eUxpbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoJ01vZGVsIFVuaXRzJywgaGVhZGVyU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBDZW50ZXIgRGVwdGggPSAke3RoaXMuZGVwdGgobWlkZGxlLCBtaWRkbGUpLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgWiBSYW5nZSA9ICR7dGhpcy5yYW5nZS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1pbmltdW0gPSAke3RoaXMubWluaW11bS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1heGltdW0gPSAke3RoaXMubWF4aW11bS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICB9XHJcbn0iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuICAgICAgICAgXHJcbi8qKlxyXG4gKiBUb29sIExpYnJhcnlcclxuICogR2VuZXJhbCB1dGlsaXR5IHJvdXRpbmVzXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRvb2xzIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFV0aWxpdHlcclxuICAgIC8vLyA8c3VtbWFyeT4gICAgICAgIFxyXG4gICAgLy8gR2VuZXJhdGUgYSBwc2V1ZG8gR1VJRC5cclxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuICAgIHN0YXRpYyBnZW5lcmF0ZVBzZXVkb0dVSUQoKSB7XHJcbiAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcbiAgICAgXHJcbiAgICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbi8qXHJcbiAgUmVxdWlyZW1lbnRzXHJcbiAgICBObyBwZXJzaXN0ZW50IERPTSBlbGVtZW50LiBUaGUgY2FudmFzIGlzIGNyZWF0ZWQgZHluYW1pY2FsbHkuXHJcbiAgICAgICAgT3B0aW9uIGZvciBwZXJzaXN0aW5nIHRoZSBGYWN0b3J5IGluIHRoZSBjb25zdHJ1Y3RvclxyXG4gICAgSlNPTiBjb21wYXRpYmxlIGNvbnN0cnVjdG9yIHBhcmFtZXRlcnNcclxuICAgIEZpeGVkIHJlc29sdXRpb247IHJlc2l6aW5nIHN1cHBvcnQgaXMgbm90IHJlcXVpcmVkLlxyXG4qL1xyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmEsIENsaXBwaW5nUGxhbmVzfSBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9ICAgICAgICAgICAgZnJvbSAnRGVwdGhCdWZmZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7TW9kZWxSZWxpZWZ9ICAgICAgICAgICAgZnJvbSAnTW9kZWxSZWxpZWYnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7U3RvcFdhdGNofSAgICAgICAgICAgICAgZnJvbSAnU3RvcFdhdGNoJ1xyXG5pbXBvcnQge1Rvb2xzfSAgICAgICAgICAgICAgICAgIGZyb20gJ1Rvb2xzJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEZXB0aEJ1ZmZlckZhY3RvcnlQYXJhbWV0ZXJzIHtcclxuXHJcbiAgICB3aWR0aCAgICAgICAgICAgIDogbnVtYmVyLCAgICAgICAgICAgICAgICAgIC8vIHdpZHRoIG9mIERCXHJcbiAgICBoZWlnaHQgICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgIC8vIGhlaWdodCBvZiBEQiAgICAgICAgXHJcbiAgICBtb2RlbCAgICAgICAgICAgIDogVEhSRUUuR3JvdXAsICAgICAgICAgICAgIC8vIG1vZGVsIHJvb3RcclxuXHJcbiAgICBjYW1lcmE/ICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIC8vIGNhbWVyYVxyXG4gICAgXHJcbiAgICBsb2dEZXB0aEJ1ZmZlcj8gIDogYm9vbGVhbiwgICAgICAgICAgICAgICAgIC8vIHVzZSBsb2dhcml0aG1pYyBkZXB0aCBidWZmZXIgZm9yIGhpZ2hlciByZXNvbHV0aW9uIChiZXR0ZXIgZGlzdHJpYnV0aW9uKSBpbiBzY2VuZXMgd2l0aCBsYXJnZSBleHRlbnRzXHJcbiAgICBib3VuZGVkQ2xpcHBpbmc/IDogYm9vbGVhbiwgICAgICAgICAgICAgICAgIC8vIG92ZXJycmlkIGNhbWVyYSBjbGlwcGluZyBwbGFuZXMgdG8gYm91bmQgbW9kZWxcclxuICAgIFxyXG4gICAgYWRkQ2FudmFzVG9ET00/ICA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICAvLyB2aXNpYmxlIGNhbnZhczsgYWRkIHRvIEhUTUxcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNZXNoR2VuZXJhdGVQYXJhbWV0ZXJzIHtcclxuXHJcbiAgICBjYW1lcmE/ICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhOyAgICAgIC8vIG92ZXJyaWRlIG5vdCB5ZXQgaW1wbGVtZW50ZWQgXHJcbiAgICBtYXRlcmlhbD8gICA6IFRIUkVFLk1hdGVyaWFsO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlckZhY3RvcnlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlckZhY3Rvcnkge1xyXG5cclxuICAgIHN0YXRpYyBEZWZhdWx0UmVzb2x1dGlvbiA6IG51bWJlciAgICAgICAgICAgPSAxMDI0OyAgICAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgREIgcmVzb2x1dGlvblxyXG4gICAgc3RhdGljIE5lYXJQbGFuZUVwc2lsb24gIDogbnVtYmVyICAgICAgICAgICA9IC4wMDE7ICAgICAgICAgICAgICAgICAgICAgLy8gYWRqdXN0bWVudCB0byBhdm9pZCBjbGlwcGluZyBnZW9tZXRyeSBvbiB0aGUgbmVhciBwbGFuZVxyXG4gICAgXHJcbiAgICBzdGF0aWMgQ3NzQ2xhc3NOYW1lICAgICAgOiBzdHJpbmcgICAgICAgICAgID0gJ0RlcHRoQnVmZmVyRmFjdG9yeSc7ICAgICAvLyBDU1MgY2xhc3NcclxuICAgIHN0YXRpYyBSb290Q29udGFpbmVySWQgICA6IHN0cmluZyAgICAgICAgICAgPSAncm9vdENvbnRhaW5lcic7ICAgICAgICAgIC8vIHJvb3QgY29udGFpbmVyIGZvciB2aWV3ZXJzXHJcbiAgICBcclxuICAgIF9zY2VuZSAgICAgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gdGFyZ2V0IHNjZW5lXHJcbiAgICBfbW9kZWwgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHRhcmdldCBtb2RlbFxyXG5cclxuICAgIF9yZW5kZXJlciAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlcmVyICAgICAgPSBudWxsOyAgICAgLy8gc2NlbmUgcmVuZGVyZXJcclxuICAgIF9jYW52YXMgICAgICAgICAgOiBIVE1MQ2FudmFzRWxlbWVudCAgICAgICAgPSBudWxsOyAgICAgLy8gRE9NIGNhbnZhcyBzdXBwb3J0aW5nIHJlbmRlcmVyXHJcbiAgICBfd2lkdGggICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgID0gRGVwdGhCdWZmZXJGYWN0b3J5LkRlZmF1bHRSZXNvbHV0aW9uOyAgICAgLy8gd2lkdGggcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuICAgIF9oZWlnaHQgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgPSBEZXB0aEJ1ZmZlckZhY3RvcnkuRGVmYXVsdFJlc29sdXRpb247ICAgICAvLyBoZWlnaHQgcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuXHJcbiAgICBfY2FtZXJhICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgID0gbnVsbDsgICAgIC8vIHBlcnNwZWN0aXZlIGNhbWVyYSB0byBnZW5lcmF0ZSB0aGUgZGVwdGggYnVmZmVyXHJcblxyXG5cclxuICAgIF9sb2dEZXB0aEJ1ZmZlciAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdXNlIGEgbG9nYXJpdGhtaWMgYnVmZmVyIGZvciBtb3JlIGFjY3VyYWN5IGluIGxhcmdlIHNjZW5lc1xyXG4gICAgX2JvdW5kZWRDbGlwcGluZyA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICA9IGZhbHNlOyAgICAvLyBvdmVycmlkZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzOyBzZXQgbmVhciBhbmQgZmFyIHRvIGJvdW5kIG1vZGVsIGZvciBpbXByb3ZlZCBhY2N1cmFjeVxyXG5cclxuICAgIF9kZXB0aEJ1ZmZlciAgICAgOiBEZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gZGVwdGggYnVmZmVyIFxyXG4gICAgX3RhcmdldCAgICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBjcmVhdGluZyB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHdoZW4gcmVuZGVyaW5nIHRoZSBzY2VuZVxyXG4gICAgX2VuY29kZWRUYXJnZXQgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBlbmNvZGluIHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgaW50byBhIGZsb2F0aW5nIHBvaW50IChSR0JBIGZvcm1hdClcclxuXHJcbiAgICBfcG9zdFNjZW5lICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHNpbmdsZSBwb2x5Z29uIHNjZW5lIHVzZSB0byBnZW5lcmF0ZSB0aGUgZW5jb2RlZCBSR0JBIGJ1ZmZlclxyXG4gICAgX3Bvc3RDYW1lcmEgICAgICA6IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSA9IG51bGw7ICAgICAvLyBvcnRob2dyYXBoaWMgY2FtZXJhXHJcbiAgICBfcG9zdE1hdGVyaWFsICAgIDogVEhSRUUuU2hhZGVyTWF0ZXJpYWwgICAgID0gbnVsbDsgICAgIC8vIHNoYWRlciBtYXRlcmlhbCB0aGF0IGVuY29kZXMgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciBpbnRvIGEgZmxvYXRpbmcgcG9pbnQgUkdCQSBmb3JtYXRcclxuXHJcbiAgICBfbWluaW11bVdlYkdMICAgIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gdHJ1ZTsgICAgIC8vIHRydWUgaWYgbWluaW11bSBXZUdMIHJlcXVpcmVtZW50cyBhcmUgcHJlc2VudFxyXG4gICAgX2xvZ2dlciAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBsb2dnZXJcclxuICAgIF9hZGRDYW52YXNUb0RPTSAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MIHBhZ2VcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgSW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyAoRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVycyA6IERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgLy8gcmVxdWlyZWRcclxuICAgICAgICB0aGlzLl93aWR0aCAgICAgICAgICAgPSBwYXJhbWV0ZXJzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAgICAgICAgICA9IHBhcmFtZXRlcnMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX21vZGVsICAgICAgICAgICA9IHBhcmFtZXRlcnMubW9kZWwuY2xvbmUodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhICAgICAgICAgID0gcGFyYW1ldGVycy5jYW1lcmEgICAgICAgICAgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLl9sb2dEZXB0aEJ1ZmZlciAgPSBwYXJhbWV0ZXJzLmxvZ0RlcHRoQnVmZmVyICB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ib3VuZGVkQ2xpcHBpbmcgPSBwYXJhbWV0ZXJzLmJvdW5kZWRDbGlwcGluZyB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLl9hZGRDYW52YXNUb0RPTSAgPSBwYXJhbWV0ZXJzLmFkZENhbnZhc1RvRE9NICB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gdGhpcy5pbml0aWFsaXplQ2FudmFzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW5pdGlhbGl6YXRpb24gICAgXHJcbiAgICAvKipcclxuICAgICAqIFZlcmlmaWVzIHRoZSBtaW5pbXVtIFdlYkdMIGV4dGVuc2lvbnMgYXJlIHByZXNlbnQuXHJcbiAgICAgKiBAcGFyYW0gcmVuZGVyZXIgV2ViR0wgcmVuZGVyZXIuXHJcbiAgICAgKi9cclxuICAgIHZlcmlmeVdlYkdMRXh0ZW5zaW9ucygpIDogYm9vbGVhbiB7IFxyXG4gICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLl9yZW5kZXJlci5leHRlbnNpb25zLmdldCgnV0VCR0xfZGVwdGhfdGV4dHVyZScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21pbmltdW1XZWJHTCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRXJyb3JNZXNzYWdlKCdUaGUgbWluaW11bSBXZWJHTCBleHRlbnNpb25zIGFyZSBub3Qgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZSBhIG1vdXNlIGRvd24gZXZlbnQgb24gdGhlIGNhbnZhcy5cclxuICAgICAqL1xyXG4gICAgb25Nb3VzZURvd24oZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGRldmljZUNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IEdyYXBoaWNzLmRldmljZUNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsICQoZXZlbnQudGFyZ2V0KSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBkZXZpY2UgPSAke2RldmljZUNvb3JkaW5hdGVzLnh9LCAke2RldmljZUNvb3JkaW5hdGVzLnl9YCk7XHJcblxyXG4gICAgICAgIGxldCBkZWNpbWFsUGxhY2VzICAgOiBudW1iZXIgPSAyO1xyXG4gICAgICAgIGxldCByb3cgICAgICAgICAgICAgOiBudW1iZXIgPSAoZGV2aWNlQ29vcmRpbmF0ZXMueSArIDEpIC8gMiAqIHRoaXMuX2RlcHRoQnVmZmVyLmhlaWdodDtcclxuICAgICAgICBsZXQgY29sdW1uICAgICAgICAgIDogbnVtYmVyID0gKGRldmljZUNvb3JkaW5hdGVzLnggKyAxKSAvIDIgKiB0aGlzLl9kZXB0aEJ1ZmZlci53aWR0aDtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYE9mZnNldCA9IFske3Jvd30sICR7Y29sdW1ufV1gKTsgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBEZXB0aCA9ICR7dGhpcy5fZGVwdGhCdWZmZXIuZGVwdGgocm93LCBjb2x1bW4pLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCk7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgV2ViR0wgdGFyZ2V0IGNhbnZhcy5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNhbnZhcygpIDogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnNldEF0dHJpYnV0ZSgnbmFtZScsIFRvb2xzLmdlbmVyYXRlUHNldWRvR1VJRCgpKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsIERlcHRoQnVmZmVyRmFjdG9yeS5Dc3NDbGFzc05hbWUpO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgZGltZW5zaW9ucyAgICBcclxuICAgICAgICB0aGlzLl9jYW52YXMud2lkdGggID0gdGhpcy5fd2lkdGg7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLmhlaWdodCA9IHRoaXMuX2hlaWdodDsgXHJcblxyXG4gICAgICAgIC8vIERPTSBlbGVtZW50IGRpbWVuc2lvbnMgKG1heSBiZSBkaWZmZXJlbnQgdGhhbiByZW5kZXIgZGltZW5zaW9ucylcclxuICAgICAgICB0aGlzLl9jYW52YXMuc3R5bGUud2lkdGggID0gYCR7dGhpcy5fd2lkdGh9cHhgO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLl9oZWlnaHR9cHhgO1xyXG5cclxuICAgICAgICAvLyBhZGQgdG8gRE9NP1xyXG4gICAgICAgIGlmICh0aGlzLl9hZGRDYW52YXNUb0RPTSlcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7RGVwdGhCdWZmZXJGYWN0b3J5LlJvb3RDb250YWluZXJJZH1gKS5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRjYW52YXMgPSAkKHRoaXMuX2NhbnZhcykub24oJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYW52YXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbiBvZiB0aGUgcmVuZGVyIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplU2NlbmUgKCkgOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbClcclxuICAgICAgICAgICAgdGhpcy5fc2NlbmUuYWRkKHRoaXMuX21vZGVsKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGlnaHRpbmcodGhpcy5fc2NlbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgIG1vZGVsIHZpZXcuXHJcbiAgICAgKi9cclxuICAgICBpbml0aWFsaXplUmVuZGVyZXIoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoIHtjYW52YXMgOiB0aGlzLl9jYW52YXMsIGxvZ2FyaXRobWljRGVwdGhCdWZmZXIgOiB0aGlzLl9sb2dEZXB0aEJ1ZmZlcn0pO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFNpemUodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcblxyXG4gICAgICAgIC8vIE1vZGVsIFNjZW5lIC0+IChSZW5kZXIgVGV4dHVyZSwgRGVwdGggVGV4dHVyZSlcclxuICAgICAgICB0aGlzLl90YXJnZXQgPSB0aGlzLmNvbnN0cnVjdERlcHRoVGV4dHVyZVJlbmRlclRhcmdldCgpO1xyXG5cclxuICAgICAgICAvLyBFbmNvZGVkIFJHQkEgVGV4dHVyZSBmcm9tIERlcHRoIFRleHR1cmVcclxuICAgICAgICB0aGlzLl9lbmNvZGVkVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcmlmeVdlYkdMRXh0ZW5zaW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBkZWZhdWx0IGxpZ2h0aW5nIGluIHRoZSBzY2VuZS5cclxuICAgICAqIExpZ2h0aW5nIGRvZXMgbm90IGFmZmVjdCB0aGUgZGVwdGggYnVmZmVyLiBJdCBpcyBvbmx5IHVzZWQgaWYgdGhlIGNhbnZhcyBpcyBtYWRlIHZpc2libGUuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVMaWdodGluZyAoc2NlbmUgOiBUSFJFRS5TY2VuZSkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYsIDAuMik7XHJcbiAgICAgICAgc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0MS5wb3NpdGlvbi5zZXQoMSwgMSwgMSk7XHJcbiAgICAgICAgc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUHJpbWFyeSAoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSAoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVByaW1hcnkoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQb3N0KCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFBvc3RQcm9jZXNzaW5nXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSByZW5kZXIgdGFyZ2V0IDx3aXRoIGEgZGVwdGggdGV4dHVyZSBidWZmZXI+LlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3REZXB0aFRleHR1cmVSZW5kZXJUYXJnZXQoKSA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0IHtcclxuXHJcbiAgICAgICAgLy8gTW9kZWwgU2NlbmUgLT4gKFJlbmRlciBUZXh0dXJlLCBEZXB0aCBUZXh0dXJlKVxyXG4gICAgICAgIGxldCByZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcblxyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLmZvcm1hdCAgICAgICAgICAgPSBUSFJFRS5SR0JBRm9ybWF0O1xyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLnR5cGUgICAgICAgICAgICAgPSBUSFJFRS5VbnNpZ25lZEJ5dGVUeXBlO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLm1pbkZpbHRlciAgICAgICAgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLm1hZ0ZpbHRlciAgICAgICAgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnN0ZW5jaWxCdWZmZXIgICAgICAgICAgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZW5kZXJUYXJnZXQuZGVwdGhCdWZmZXIgICAgICAgICAgICAgID0gdHJ1ZTtcclxuICAgICAgICByZW5kZXJUYXJnZXQuZGVwdGhUZXh0dXJlICAgICAgICAgICAgID0gbmV3IFRIUkVFLkRlcHRoVGV4dHVyZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuICAgICAgICByZW5kZXJUYXJnZXQuZGVwdGhUZXh0dXJlLnR5cGUgICAgICAgID0gVEhSRUUuVW5zaWduZWRJbnRUeXBlO1xyXG4gICAgXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlclRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uIG9mIHRoZSBwb3N0IHNjZW5lIHVzZWQgdG8gY3JlYXRlIHRoZSBmaW5hbCBSR0JBIGVuY29kZWQgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUG9zdFNjZW5lICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBwb3N0TWVzaE1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmVydGV4U2hhZGVyOiAgIE1SLnNoYWRlclNvdXJjZVsnRGVwdGhCdWZmZXJWZXJ0ZXhTaGFkZXInXSxcclxuICAgICAgICAgICAgZnJhZ21lbnRTaGFkZXI6IE1SLnNoYWRlclNvdXJjZVsnRGVwdGhCdWZmZXJGcmFnbWVudFNoYWRlciddLFxyXG5cclxuICAgICAgICAgICAgdW5pZm9ybXM6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYU5lYXIgIDogICB7IHZhbHVlOiB0aGlzLl9jYW1lcmEubmVhciB9LFxyXG4gICAgICAgICAgICAgICAgY2FtZXJhRmFyICAgOiAgIHsgdmFsdWU6IHRoaXMuX2NhbWVyYS5mYXIgfSxcclxuICAgICAgICAgICAgICAgIHREaWZmdXNlICAgIDogICB7IHZhbHVlOiB0aGlzLl90YXJnZXQudGV4dHVyZSB9LFxyXG4gICAgICAgICAgICAgICAgdERlcHRoICAgICAgOiAgIHsgdmFsdWU6IHRoaXMuX3RhcmdldC5kZXB0aFRleHR1cmUgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHBvc3RNZXNoUGxhbmUgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyLCAyKTtcclxuICAgICAgICBsZXQgcG9zdE1lc2hRdWFkICA9IG5ldyBUSFJFRS5NZXNoKHBvc3RNZXNoUGxhbmUsIHBvc3RNZXNoTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICB0aGlzLl9wb3N0U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICB0aGlzLl9wb3N0U2NlbmUuYWRkKHBvc3RNZXNoUXVhZCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RDYW1lcmEoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZyh0aGlzLl9wb3N0U2NlbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyB0aGUgb3J0aG9ncmFwaGljIGNhbWVyYSB1c2VkIHRvIGNvbnZlcnQgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciB0byB0aGUgZW5jb2RlZCBSR0JBIGJ1ZmZlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUG9zdENhbWVyYSgpIHtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgcG9zdCBwcm9jZXNzaW5nIHN0YWdlXHJcbiAgICAgICAgbGV0IGxlZnQ6IG51bWJlciAgICAgID0gIC0xO1xyXG4gICAgICAgIGxldCByaWdodDogbnVtYmVyICAgICA9ICAgMTtcclxuICAgICAgICBsZXQgdG9wOiBudW1iZXIgICAgICAgPSAgIDE7XHJcbiAgICAgICAgbGV0IGJvdHRvbTogbnVtYmVyICAgID0gIC0xO1xyXG4gICAgICAgIGxldCBuZWFyOiBudW1iZXIgICAgICA9ICAgMDtcclxuICAgICAgICBsZXQgZmFyOiBudW1iZXIgICAgICAgPSAgIDE7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3RDYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgbmVhciwgZmFyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUG9zdCAoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQb3N0U2NlbmUoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQb3N0Q2FtZXJhKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEdlbmVyYXRpb25cclxuICAgIC8qKlxyXG4gICAgICogVmVyaWZpZXMgdGhlIHByZS1yZXF1aXNpdGUgc2V0dGluZ3MgYXJlIGRlZmluZWQgdG8gY3JlYXRlIGEgbWVzaC5cclxuICAgICAqL1xyXG4gICAgdmVyaWZ5TWVzaFNldHRpbmdzKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bVNldHRpbmdzIDogYm9vbGVhbiA9IHRydWVcclxuICAgICAgICBsZXQgZXJyb3JQcmVmaXggICAgIDogc3RyaW5nID0gJ0RlcHRoQnVmZmVyRmFjdG9yeTogJztcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRXJyb3JNZXNzYWdlKGAke2Vycm9yUHJlZml4fVRoZSBtb2RlbCBpcyBub3QgZGVmaW5lZC5gKTtcclxuICAgICAgICAgICAgbWluaW11bVNldHRpbmdzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRXJyb3JNZXNzYWdlKGAke2Vycm9yUHJlZml4fVRoZSBjYW1lcmEgaXMgbm90IGRlZmluZWQuYCk7XHJcbiAgICAgICAgICAgIG1pbmltdW1TZXR0aW5ncyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1pbmltdW1TZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYW4gUkdCQSBzdHJpbmcgd2l0aCB0aGUgYnl0ZSB2YWx1ZXMgb2YgYSBwaXhlbC5cclxuICAgICAqIEBwYXJhbSBidWZmZXIgVW5zaWduZWQgYnl0ZSByYXcgYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHJvdyBQaXhlbCByb3cuXHJcbiAgICAgKiBAcGFyYW0gY29sdW1uIENvbHVtbiByb3cuXHJcbiAgICAgKi9cclxuICAgICB1bnNpZ25lZEJ5dGVzVG9SR0JBIChidWZmZXIgOiBVaW50OEFycmF5LCByb3cgOiBudW1iZXIsIGNvbHVtbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvZmZzZXQgPSAocm93ICogdGhpcy5fd2lkdGgpICsgY29sdW1uO1xyXG4gICAgICAgIGxldCByVmFsdWUgPSBidWZmZXJbb2Zmc2V0ICsgMF0udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGxldCBnVmFsdWUgPSBidWZmZXJbb2Zmc2V0ICsgMV0udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGxldCBiVmFsdWUgPSBidWZmZXJbb2Zmc2V0ICsgMl0udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGxldCBhVmFsdWUgPSBidWZmZXJbb2Zmc2V0ICsgM10udG9TdHJpbmcoMTYpO1xyXG5cclxuICAgICAgICByZXR1cm4gYCMke3JWYWx1ZX0ke2dWYWx1ZX0ke2JWYWx1ZX0gJHthVmFsdWV9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuYWx5emVzIGEgcGl4ZWwgZnJvbSBhIHJlbmRlciBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGFuYWx5emVSZW5kZXJCdWZmZXIgKCkge1xyXG5cclxuICAgICAgICBsZXQgcmVuZGVyQnVmZmVyID0gIG5ldyBVaW50OEFycmF5KHRoaXMuX3dpZHRoICogdGhpcy5faGVpZ2h0ICogNCkuZmlsbCgwKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZWFkUmVuZGVyVGFyZ2V0UGl4ZWxzKHRoaXMuX3RhcmdldCwgMCwgMCwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgcmVuZGVyQnVmZmVyKTtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSBgUkdCQVswLCAwXSA9ICR7dGhpcy51bnNpZ25lZEJ5dGVzVG9SR0JBKHJlbmRlckJ1ZmZlciwgMCwgMCl9YDtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShtZXNzYWdlU3RyaW5nLCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuYWx5emUgdGhlIHJlbmRlciBhbmQgZGVwdGggdGFyZ2V0cy5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZVRhcmdldHMgKCkgIHtcclxuXHJcbi8vICAgICAgdGhpcy5hbmFseXplUmVuZGVyQnVmZmVyKCk7XHJcbi8vICAgICAgdGhpcy5fZGVwdGhCdWZmZXIuYW5hbHl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBjcmVhdGVEZXB0aEJ1ZmZlcigpIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyVGFnID0gU2VydmljZXMudGltZXIubWFyaygnRGVwdGhCdWZmZXJGYWN0b3J5LmNyZWF0ZURlcHRoQnVmZmVyJyk7ICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVuZGVyKHRoaXMuX3NjZW5lLCB0aGlzLl9jYW1lcmEsIHRoaXMuX3RhcmdldCk7ICAgIFxyXG4gICAgXHJcbiAgICAgICAgLy8gKG9wdGlvbmFsKSBwcmV2aWV3IGVuY29kZWQgUkdCQSB0ZXh0dXJlOyBkcmF3biBieSBzaGFkZXIgYnV0IG5vdCBwZXJzaXN0ZWRcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fcG9zdFNjZW5lLCB0aGlzLl9wb3N0Q2FtZXJhKTsgICAgXHJcblxyXG4gICAgICAgIC8vIFBlcnNpc3QgZW5jb2RlZCBSR0JBIHRleHR1cmU7IGNhbGN1bGF0ZWQgZnJvbSBkZXB0aCBidWZmZXJcclxuICAgICAgICAvLyBlbmNvZGVkVGFyZ2V0LnRleHR1cmUgICAgICA6IGVuY29kZWQgUkdCQSB0ZXh0dXJlXHJcbiAgICAgICAgLy8gZW5jb2RlZFRhcmdldC5kZXB0aFRleHR1cmUgOiBudWxsXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVuZGVyKHRoaXMuX3Bvc3RTY2VuZSwgdGhpcy5fcG9zdENhbWVyYSwgdGhpcy5fZW5jb2RlZFRhcmdldCk7IFxyXG5cclxuICAgICAgICAvLyBkZWNvZGUgUkdCQSB0ZXh0dXJlIGludG8gZGVwdGggZmxvYXRzXHJcbiAgICAgICAgbGV0IGRlcHRoQnVmZmVyUkdCQSA9ICBuZXcgVWludDhBcnJheSh0aGlzLl93aWR0aCAqIHRoaXMuX2hlaWdodCAqIDQpLmZpbGwoMCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVhZFJlbmRlclRhcmdldFBpeGVscyh0aGlzLl9lbmNvZGVkVGFyZ2V0LCAwLCAwLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCBkZXB0aEJ1ZmZlclJHQkEpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZXB0aEJ1ZmZlciA9IG5ldyBEZXB0aEJ1ZmZlcihkZXB0aEJ1ZmZlclJHQkEsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHRoaXMuX2NhbWVyYSk7ICAgIFxyXG5cclxuICAgICAgICB0aGlzLmFuYWx5emVUYXJnZXRzKCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzIGZvciBtZXNoIGdlbmVyYXRpb24uXHJcbiAgICAgKi9cclxuICAgIHNldENhbWVyYUNsaXBwaW5nUGxhbmVzICgpIHtcclxuXHJcbiAgICAgICAgLy8gY29weSBjYW1lcmE7IHNoYXJlZCB3aXRoIE1vZGVsVmlld2VyXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xyXG4gICAgICAgIGNhbWVyYS5jb3B5ICh0aGlzLl9jYW1lcmEpO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcclxuXHJcbiAgICAgICAgbGV0IGNsaXBwaW5nUGxhbmVzIDogQ2xpcHBpbmdQbGFuZXMgPSBDYW1lcmEuZ2V0Qm91bmRpbmdDbGlwcGluZ1BsYW5lcyh0aGlzLl9jYW1lcmEsIHRoaXMuX21vZGVsKTtcclxuICAgICAgICB0aGlzLl9jYW1lcmEubmVhciA9IGNsaXBwaW5nUGxhbmVzLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLmZhciAgPSBjbGlwcGluZ1BsYW5lcy5mYXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGEgbWVzaCBmcm9tIHRoZSBhY3RpdmUgbW9kZWwgYW5kIGNhbWVyYVxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgR2VuZXJhdGlvbiBwYXJhbWV0ZXJzIChNZXNoR2VuZXJhdGVQYXJhbWV0ZXJzKVxyXG4gICAgICovXHJcbiAgICBtZXNoR2VuZXJhdGUgKHBhcmFtZXRlcnMgOiBNZXNoR2VuZXJhdGVQYXJhbWV0ZXJzKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghdGhpcy52ZXJpZnlNZXNoU2V0dGluZ3MoKSkgXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLl9ib3VuZGVkQ2xpcHBpbmcgfHwgXHJcbiAgICAgICAgICAgICgodGhpcy5fY2FtZXJhLm5lYXIgPT09IENhbWVyYS5EZWZhdWx0TmVhckNsaXBwaW5nUGxhbmUpICYmICh0aGlzLl9jYW1lcmEuZmFyID09PSBDYW1lcmEuRGVmYXVsdEZhckNsaXBwaW5nUGxhbmUpKSlcclxuICAgICAgICAgICAgdGhpcy5zZXRDYW1lcmFDbGlwcGluZ1BsYW5lcygpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZURlcHRoQnVmZmVyKCk7XHJcbiAgICAgICAgbGV0IG1lc2ggPSB0aGlzLl9kZXB0aEJ1ZmZlci5tZXNoKHBhcmFtZXRlcnMubWF0ZXJpYWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGFuIGltYWdlIGZyb20gdGhlIGFjdGl2ZSBtb2RlbCBhbmQgY2FtZXJhXHJcbiAgICAgKiBAcGFyYW0gcGFyYW1ldGVycyBHZW5lcmF0aW9uIHBhcmFtZXRlcnMgKEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzKVxyXG4gICAgICovXHJcbiAgICBpbWFnZUdlbmVyYXRlIChwYXJhbWV0ZXJzIDogSW1hZ2VHZW5lcmF0ZVBhcmFtZXRlcnMpIDogVWludDhBcnJheSB7XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQgeyBEZXB0aEJ1ZmZlckZhY3RvcnkgfSBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtTdG9wV2F0Y2h9ICAgICAgICAgICAgZnJvbSAnU3RvcFdhdGNoJ1xyXG5cclxuZXhwb3J0IGVudW0gU3RhbmRhcmRWaWV3IHtcclxuICAgIE5vbmUsXHJcbiAgICBGcm9udCxcclxuICAgIEJhY2ssXHJcbiAgICBUb3AsXHJcbiAgICBCb3R0b20sXHJcbiAgICBMZWZ0LFxyXG4gICAgUmlnaHQsXHJcbiAgICBJc29tZXRyaWNcclxufVxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIENhbWVyYSBjbGlwcGluZyBwbGFuZXMgdHVwbGUuXHJcbiAqIEBleHBvcnRcclxuICogQGludGVyZmFjZSBDbGlwcGluZ1BsYW5lc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBDbGlwcGluZ1BsYW5lcyB7XHJcbiAgICBuZWFyIDogbnVtYmVyO1xyXG4gICAgZmFyICA6IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbWVyYVxyXG4gKiBHZW5lcmFsIGNhbWVyYSB1dGlsaXR5IG1ldGhvZHMuXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbWVyYSB7XHJcblxyXG4gICAgc3RhdGljIERlZmF1bHRGaWVsZE9mVmlldyAgICAgICA6IG51bWJlciA9IDM3OyAgICAgICAvLyAzNW1tIHZlcnRpY2FsIDogaHR0cHM6Ly93d3cubmlrb25pYW5zLm9yZy9yZXZpZXdzL2Zvdi10YWJsZXMgICAgICAgXHJcbiAgICBzdGF0aWMgRGVmYXVsdE5lYXJDbGlwcGluZ1BsYW5lIDogbnVtYmVyID0gMC4xOyBcclxuICAgIHN0YXRpYyBEZWZhdWx0RmFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXIgPSAxMDAwMDsgXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIENsaXBwaW5nIFBsYW5lc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZXh0ZW50cyBvZiB0aGUgbmVhciBjYW1lcmEgcGxhbmUuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhfSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMge1RIUkVFLlZlY3RvcjJ9IFxyXG4gICAgICogQG1lbWJlcm9mIEdyYXBoaWNzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXROZWFyUGxhbmVFeHRlbnRzKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFGT1ZSYWRpYW5zID0gY2FtZXJhLmZvdiAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgIFxyXG4gICAgICAgIGxldCBuZWFySGVpZ2h0ID0gMiAqIE1hdGgudGFuKGNhbWVyYUZPVlJhZGlhbnMgLyAyKSAqIGNhbWVyYS5uZWFyO1xyXG4gICAgICAgIGxldCBuZWFyV2lkdGggID0gY2FtZXJhLmFzcGVjdCAqIG5lYXJIZWlnaHQ7XHJcbiAgICAgICAgbGV0IGV4dGVudHMgPSBuZXcgVEhSRUUuVmVjdG9yMihuZWFyV2lkdGgsIG5lYXJIZWlnaHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBleHRlbnRzOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBGaW5kcyB0aGUgYm91bmRpbmcgY2xpcHBpbmcgcGxhbmVzIGZvciB0aGUgZ2l2ZW4gbW9kZWwuIFxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRCb3VuZGluZ0NsaXBwaW5nUGxhbmVzKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBtb2RlbCA6IFRIUkVFLk9iamVjdDNEKSA6IENsaXBwaW5nUGxhbmVze1xyXG5cclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3OiBUSFJFRS5Cb3gzID0gR3JhcGhpY3MuZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGJveCBpcyB3b3JsZC1heGlzIGFsaWduZWQuIFxyXG4gICAgICAgIC8vIEluIFZpZXcgY29vcmRpbmF0ZXMsIHRoZSBjYW1lcmEgaXMgYXQgdGhlIG9yaWdpbi5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgbmVhciBwbGFuZSBpcyB0aGUgbWF4aW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGZhciBwbGFuZSBpcyB0aGUgbWluaW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgbGV0IG5lYXJQbGFuZSA9IC1ib3VuZGluZ0JveFZpZXcubWF4Lno7XHJcbiAgICAgICAgbGV0IGZhclBsYW5lID0gLWJvdW5kaW5nQm94Vmlldy5taW4uejtcclxuXHJcbiAgICAgICAgbGV0IGNsaXBwaW5nUGxhbmVzIDogQ2xpcHBpbmdQbGFuZXMgPSB7XHJcblxyXG4gICAgICAgICAgICAvLyBhZGp1c3QgYnkgZXBzaWxvbiB0byBhdm9pZCBjbGlwcGluZyBnZW9tZXRyeSBhdCB0aGUgbmVhciBwbGFuZSBlZGdlXHJcbiAgICAgICAgICAgIG5lYXIgOiAgKDEgLSBEZXB0aEJ1ZmZlckZhY3RvcnkuTmVhclBsYW5lRXBzaWxvbikgKiBuZWFyUGxhbmUsXHJcbiAgICAgICAgICAgIGZhciAgOiBmYXJQbGFuZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xpcHBpbmdQbGFuZXM7XHJcbiAgICB9ICBcclxuXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFNldHRpbmdzXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgdGhlIGRlZmF1bHQgYm91bmRpbmcgYm94IGZvciBhIG1vZGVsLlxyXG4gICAgICogSWYgdGhlIG1vZGVsIGlzIGVtcHR5LCBhIHVuaXQgc3BoZXJlIGlzIHVzZXMgYXMgYSBwcm94eSB0byBwcm92aWRlIGRlZmF1bHRzLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5PYmplY3QzRH0gbW9kZWwgTW9kZWwgdG8gY2FsY3VsYXRlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5Cb3gzfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0RGVmYXVsdEJvdW5kaW5nQm94IChtb2RlbCA6IFRIUkVFLk9iamVjdDNEKSA6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpOyAgICAgICBcclxuICAgICAgICBpZiAobW9kZWwpIFxyXG4gICAgICAgICAgICBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChtb2RlbCk7IFxyXG5cclxuICAgICAgICBpZiAoIWJvdW5kaW5nQm94LmlzRW1wdHkoKSlcclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHVuaXQgc3BoZXJlIHByb3h5XHJcbiAgICAgICAgbGV0IHNwaGVyZVByb3h5ID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCAxKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChzcGhlcmVQcm94eSk7ICAgICAgICAgXHJcblxyXG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGVzIHRoZSBjYW1lcmEgdG8gZml0IHRoZSBtb2RlbCBpbiB0aGUgY3VycmVudCB2aWV3LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIENhbWVyYSB0byB1cGRhdGUuXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLkdyb3VwfSBtb2RlbCBNb2RlbCB0byBmaXQuXHJcbiAgICAgKiBAcmV0dXJucyB7Q2FtZXJhU2V0dGluZ3N9IFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Rml0Vmlld0NhbWVyYSAoY2FtZXJhVGVtcGxhdGUgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgbW9kZWwgOiBUSFJFRS5Hcm91cCwgKSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHsgXHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ0NhbWVyYS5nZXRGaXRWaWV3Q2FtZXJhJyk7ICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IGNhbWVyYVRlbXBsYXRlLmNsb25lKHRydWUpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFdvcmxkICAgICAgICAgOiBUSFJFRS5Cb3gzICAgID0gQ2FtZXJhLmdldERlZmF1bHRCb3VuZGluZ0JveChtb2RlbCk7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkICAgICAgICA6IFRIUkVFLk1hdHJpeDQgPSBjYW1lcmEubWF0cml4V29ybGQ7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSBjYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZpbmQgY2FtZXJhIHBvc2l0aW9uIGluIFZpZXcgY29vcmRpbmF0ZXMuLi5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3OiBUSFJFRS5Cb3gzID0gR3JhcGhpY3MuZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgbGV0IHZlcnRpY2FsRmllbGRPZlZpZXdSYWRpYW5zICAgOiBudW1iZXIgPSAoY2FtZXJhLmZvdiAvIDIpICogKE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgIGxldCBob3Jpem9udGFsRmllbGRPZlZpZXdSYWRpYW5zIDogbnVtYmVyID0gTWF0aC5hdGFuKGNhbWVyYS5hc3BlY3QgKiBNYXRoLnRhbih2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucykpOyAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGNhbWVyYVpWZXJ0aWNhbEV4dGVudHMgICA6IG51bWJlciA9IChib3VuZGluZ0JveFZpZXcuZ2V0U2l6ZSgpLnkgLyAyKSAvIE1hdGgudGFuICh2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucyk7ICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFaSG9yaXpvbnRhbEV4dGVudHMgOiBudW1iZXIgPSAoYm91bmRpbmdCb3hWaWV3LmdldFNpemUoKS54IC8gMikgLyBNYXRoLnRhbiAoaG9yaXpvbnRhbEZpZWxkT2ZWaWV3UmFkaWFucyk7ICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFaID0gTWF0aC5tYXgoY2FtZXJhWlZlcnRpY2FsRXh0ZW50cywgY2FtZXJhWkhvcml6b250YWxFeHRlbnRzKTtcclxuXHJcbiAgICAgICAgLy8gcHJlc2VydmUgWFk7IHNldCBaIHRvIGluY2x1ZGUgZXh0ZW50c1xyXG4gICAgICAgIGxldCBjYW1lcmFQb3NpdGlvblZpZXcgPSBjYW1lcmEucG9zaXRpb24uYXBwbHlNYXRyaXg0KGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbGV0IHBvc2l0aW9uVmlldyA9IG5ldyBUSFJFRS5WZWN0b3IzKGNhbWVyYVBvc2l0aW9uVmlldy54LCBjYW1lcmFQb3NpdGlvblZpZXcueSwgYm91bmRpbmdCb3hWaWV3Lm1heC56ICsgY2FtZXJhWik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTm93LCB0cmFuc2Zvcm0gYmFjayB0byBXb3JsZCBjb29yZGluYXRlcy4uLlxyXG4gICAgICAgIGxldCBwb3NpdGlvbldvcmxkID0gcG9zaXRpb25WaWV3LmFwcGx5TWF0cml4NChjYW1lcmFNYXRyaXhXb3JsZCk7XHJcblxyXG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChwb3NpdGlvbldvcmxkKTtcclxuICAgICAgICBjYW1lcmEubG9va0F0KGJvdW5kaW5nQm94V29ybGQuZ2V0Q2VudGVyKCkpO1xyXG5cclxuICAgICAgICAvLyBmb3JjZSBjYW1lcmEgbWF0cml4IHRvIHVwZGF0ZTsgbWF0cml4QXV0b1VwZGF0ZSBoYXBwZW5zIGluIHJlbmRlciBsb29wXHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpO1xyXG4gICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTsgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGNhbWVyYTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIGNhbWVyYSBzZXR0aW5ncyB0byBmaXQgdGhlIG1vZGVsIGluIGEgc3RhbmRhcmQgdmlldy5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7Q2FtZXJhLlN0YW5kYXJkVmlld30gdmlldyBTdGFuZGFyZCB2aWV3IChUb3AsIExlZnQsIGV0Yy4pXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLk9iamVjdDNEfSBtb2RlbCBNb2RlbCB0byBmaXQuXHJcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuUGVyc3BlY3RpdmVDYW1lcmF9IFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0U3RhbmRhcmRWaWV3Q2FtZXJhICh2aWV3OiBTdGFuZGFyZFZpZXcsIHZpZXdBc3BlY3QgOiBudW1iZXIsIG1vZGVsIDogVEhSRUUuR3JvdXApIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgeyBcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyVGFnID0gU2VydmljZXMudGltZXIubWFyaygnQ2FtZXJhLmdldFN0YW5kYXJkVmlldycpOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IENhbWVyYS5nZXREZWZhdWx0Q2FtZXJhKHZpZXdBc3BlY3QpOyAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChtb2RlbCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNlbnRlclggPSBib3VuZGluZ0JveC5nZXRDZW50ZXIoKS54O1xyXG4gICAgICAgIGxldCBjZW50ZXJZID0gYm91bmRpbmdCb3guZ2V0Q2VudGVyKCkueTtcclxuICAgICAgICBsZXQgY2VudGVyWiA9IGJvdW5kaW5nQm94LmdldENlbnRlcigpLno7XHJcblxyXG4gICAgICAgIGxldCBtaW5YID0gYm91bmRpbmdCb3gubWluLng7XHJcbiAgICAgICAgbGV0IG1pblkgPSBib3VuZGluZ0JveC5taW4ueTtcclxuICAgICAgICBsZXQgbWluWiA9IGJvdW5kaW5nQm94Lm1pbi56O1xyXG4gICAgICAgIGxldCBtYXhYID0gYm91bmRpbmdCb3gubWF4Lng7XHJcbiAgICAgICAgbGV0IG1heFkgPSBib3VuZGluZ0JveC5tYXgueTtcclxuICAgICAgICBsZXQgbWF4WiA9IGJvdW5kaW5nQm94Lm1heC56O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAodmlldykgeyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LkZyb250OiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMoY2VudGVyWCwgIGNlbnRlclksIG1heFopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5CYWNrOiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMoY2VudGVyWCwgIGNlbnRlclksIG1pblopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Ub3A6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhjZW50ZXJYLCAgbWF4WSwgY2VudGVyWikpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAwLCAtMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Cb3R0b206IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhjZW50ZXJYLCBtaW5ZLCBjZW50ZXJaKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KDAsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuTGVmdDoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKG1pblgsIGNlbnRlclksIGNlbnRlclopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5SaWdodDoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKG1heFgsIGNlbnRlclksIGNlbnRlclopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Jc29tZXRyaWM6IHtcclxuICAgICAgICAgICAgICAgIGxldCBzaWRlID0gTWF0aC5tYXgoTWF0aC5tYXgoYm91bmRpbmdCb3guZ2V0U2l6ZSgpLngsIGJvdW5kaW5nQm94LmdldFNpemUoKS55KSwgYm91bmRpbmdCb3guZ2V0U2l6ZSgpLnopO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKHNpZGUsICBzaWRlLCBzaWRlKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KC0xLCAxLCAtMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRm9yY2Ugb3JpZW50YXRpb24gYmVmb3JlIEZpdCBWaWV3IGNhbGN1bGF0aW9uXHJcbiAgICAgICAgY2FtZXJhLmxvb2tBdChib3VuZGluZ0JveC5nZXRDZW50ZXIoKSk7XHJcblxyXG4gICAgICAgIC8vIGZvcmNlIGNhbWVyYSBtYXRyaXggdG8gdXBkYXRlOyBtYXRyaXhBdXRvVXBkYXRlIGhhcHBlbnMgaW4gcmVuZGVyIGxvb3BcclxuICAgICAgICBjYW1lcmEudXBkYXRlTWF0cml4V29ybGQodHJ1ZSk7XHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgY2FtZXJhID0gQ2FtZXJhLmdldEZpdFZpZXdDYW1lcmEoY2FtZXJhLCBtb2RlbCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTtcclxuICAgICAgICByZXR1cm4gY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGRlZmF1bHQgc2NlbmUgY2FtZXJhLlxyXG4gICAgICogQHBhcmFtIHZpZXdBc3BlY3QgVmlldyBhc3BlY3QgcmF0aW8uXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXREZWZhdWx0Q2FtZXJhICh2aWV3QXNwZWN0IDogbnVtYmVyKSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVmYXVsdENhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMgKDAsIDAsIDApKTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAtMSkpO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEubmVhciAgID0gQ2FtZXJhLkRlZmF1bHROZWFyQ2xpcHBpbmdQbGFuZTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmZhciAgICA9IENhbWVyYS5EZWZhdWx0RmFyQ2xpcHBpbmdQbGFuZTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmZvdiAgICA9IENhbWVyYS5EZWZhdWx0RmllbGRPZlZpZXc7XHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS5hc3BlY3QgPSB2aWV3QXNwZWN0O1xyXG5cclxuICAgICAgICAvLyBmb3JjZSBjYW1lcmEgbWF0cml4IHRvIHVwZGF0ZTsgbWF0cml4QXV0b1VwZGF0ZSBoYXBwZW5zIGluIHJlbmRlciBsb29wXHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTsgICAgICAgXHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4O1xyXG5cclxuICAgICAgICByZXR1cm4gZGVmYXVsdENhbWVyYTtcclxuICAgIH0gXHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGRlZmF1bHQgc2NlbmUgY2FtZXJhLlxyXG4gICAgICogQ3JlYXRlcyBhIGRlZmF1bHQgaWYgdGhlIGN1cnJlbnQgY2FtZXJhIGhhcyBub3QgYmVlbiBjb25zdHJ1Y3RlZC5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQWN0aXZlIGNhbWVyYSAocG9zc2libHkgbnVsbCkuXHJcbiAgICAgKiBAcGFyYW0gdmlld0FzcGVjdCBWaWV3IGFzcGVjdCByYXRpby5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldFNjZW5lQ2FtZXJhIChjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCB2aWV3QXNwZWN0IDogbnVtYmVyKSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHtcclxuXHJcbiAgICAgICAgaWYgKGNhbWVyYSlcclxuICAgICAgICAgICAgcmV0dXJuIGNhbWVyYTtcclxuXHJcbiAgICAgICAgbGV0IGRlZmF1bHRDYW1lcmEgPSBDYW1lcmEuZ2V0RGVmYXVsdENhbWVyYSh2aWV3QXNwZWN0KTtcclxuICAgICAgICByZXR1cm4gZGVmYXVsdENhbWVyYTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uIFxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuZXhwb3J0IGludGVyZmFjZSBNUkV2ZW50IHtcclxuXHJcbiAgICB0eXBlICAgIDogRXZlbnRUeXBlO1xyXG4gICAgdGFyZ2V0ICA6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gRXZlbnRUeXBlIHtcclxuXHJcbiAgICBOb25lLFxyXG4gICAgTmV3TW9kZWwsXHJcbiAgICBNZXNoR2VuZXJhdGVcclxufVxyXG5cclxudHlwZSBMaXN0ZW5lciA9IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkO1xyXG50eXBlIExpc3RlbmVyQXJyYXkgPSBMaXN0ZW5lcltdW107ICAvLyBMaXN0ZW5lcltdW0V2ZW50VHlwZV07XHJcblxyXG4vKipcclxuICogRXZlbnQgTWFuYWdlclxyXG4gKiBHZW5lcmFsIGV2ZW50IG1hbmFnZW1lbnQgYW5kIGRpc3BhdGNoaW5nLlxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xyXG5cclxuICAgIF9saXN0ZW5lcnMgOiBMaXN0ZW5lckFycmF5O1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgIC8qXHJcbiAgICAgKiBDcmVhdGVzIEV2ZW50TWFuYWdlciBvYmplY3QuIEl0IG5lZWRzIHRvIGJlIGNhbGxlZCB3aXRoICcuY2FsbCcgdG8gYWRkIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGFuIG9iamVjdC5cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciB0byBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRoYXQgZ2V0cyBhZGRlZC5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdGhhdCBnZXRzIGFkZGVkLlxyXG4gICAgICovXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKHR5cGU6IEV2ZW50VHlwZSwgbGlzdGVuZXI6IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkICk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tFdmVudFR5cGUuTm9uZV0gPSBbXTtcclxuICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgZG9lcyBub3QgZXhpc3Q7IGNyZWF0ZVxyXG4gICAgICAgIGlmIChsaXN0ZW5lcnNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgbGlzdGVuZXJzW3R5cGVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBkbyBub3RoaW5nIGlmIGxpc3RlbmVyIHJlZ2lzdGVyZWRcclxuICAgICAgICBpZiAobGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgLy8gYWRkIG5ldyBsaXN0ZW5lciB0byB0aGlzIGV2ZW50XHJcbiAgICAgICAgICAgIGxpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYSBsaXN0ZW5lciBpcyByZWdpc3RlcmVkIGZvciBhbiBldmVudC5cclxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBjaGVjay5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdG8gY2hlY2suLlxyXG4gICAgICovXHJcbiAgICBoYXNFdmVudExpc3RlbmVyKHR5cGU6IEV2ZW50VHlwZSwgbGlzdGVuZXI6IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIC8vIG5vIGV2ZW50cyAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGV4aXN0cyBhbmQgbGlzdGVuZXIgcmVnaXN0ZXJlZCA9PiB0cnVlXHJcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyc1t0eXBlXSAhPT0gdW5kZWZpbmVkICYmIGxpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLSAxOyAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRoYXQgZ2V0cyByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lciBmdW5jdGlvbiB0aGF0IGdldHMgcmVtb3ZlZC5cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGUsIGxpc3RlbmVyOiAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZCk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHM7IGRvIG5vdGhpbmdcclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSBcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcbiAgICAgICAgbGV0IGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbdHlwZV07XHJcblxyXG4gICAgICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0ZW5lckFycmF5LmluZGV4T2YobGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGlmIGZvdW5kXHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lckFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRmlyZSBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHRhcmdldCBFdmVudCB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBldmVudCB0aGF0IGdldHMgZmlyZWQuXHJcbiAgICAgKi9cclxuICAgIGRpc3BhdGNoRXZlbnQodGFyZ2V0IDogYW55LCBldmVudFR5cGUgOiBFdmVudFR5cGUsIC4uLmFyZ3MgOiBhbnlbXSk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHMgZGVmaW5lZDsgZG8gbm90aGluZ1xyXG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGlzdGVuZXJzICAgICA9IHRoaXMuX2xpc3RlbmVyczsgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbZXZlbnRUeXBlXTtcclxuXHJcbiAgICAgICAgaWYgKGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRoZUV2ZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZSAgIDogZXZlbnRUeXBlLCAgICAgICAgIC8vIHR5cGVcclxuICAgICAgICAgICAgICAgIHRhcmdldCA6IHRhcmdldCAgICAgICAgICAgICAvLyBzZXQgdGFyZ2V0IHRvIGluc3RhbmNlIHRyaWdnZXJpbmcgdGhlIGV2ZW50XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGR1cGxpY2F0ZSBvcmlnaW5hbCBhcnJheSBvZiBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgbGV0IGFycmF5ID0gbGlzdGVuZXJBcnJheS5zbGljZSgwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdKHRoZUV2ZW50LCAuLi5hcmdzKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXHJcbi8vIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb20vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3NvaGFta2FtYW5pL3RocmVlLW9iamVjdC1sb2FkZXIvYmxvYi9tYXN0ZXIvc291cmNlL2luZGV4LmpzICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge1NlcnZpY2VzfSAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1N0b3BXYXRjaH0gIGZyb20gJ1N0b3BXYXRjaCdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBPQkpMb2FkZXIgKCBtYW5hZ2VyICkge1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9ICggbWFuYWdlciAhPT0gdW5kZWZpbmVkICkgPyBtYW5hZ2VyIDogVEhSRUUuRGVmYXVsdExvYWRpbmdNYW5hZ2VyO1xyXG5cclxuICAgIHRoaXMubWF0ZXJpYWxzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLnJlZ2V4cCA9IHtcclxuICAgICAgICAvLyB2IGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdmVydGV4X3BhdHRlcm4gICAgICAgICAgIDogL152XFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyB2biBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIG5vcm1hbF9wYXR0ZXJuICAgICAgICAgICA6IC9edm5cXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIHZ0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdXZfcGF0dGVybiAgICAgICAgICAgICAgIDogL152dFxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICBmYWNlX3ZlcnRleCAgICAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXHMrKC0/XFxkKylcXHMrKC0/XFxkKykoPzpcXHMrKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgIGZhY2VfdmVydGV4X3V2ICAgICAgICAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF91dl9ub3JtYWwgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF9ub3JtYWwgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBvIG9iamVjdF9uYW1lIHwgZyBncm91cF9uYW1lXHJcbiAgICAgICAgb2JqZWN0X3BhdHRlcm4gICAgICAgICAgIDogL15bb2ddXFxzKiguKyk/LyxcclxuICAgICAgICAvLyBzIGJvb2xlYW5cclxuICAgICAgICBzbW9vdGhpbmdfcGF0dGVybiAgICAgICAgOiAvXnNcXHMrKFxcZCt8b258b2ZmKS8sXHJcbiAgICAgICAgLy8gbXRsbGliIGZpbGVfcmVmZXJlbmNlXHJcbiAgICAgICAgbWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuIDogL15tdGxsaWIgLyxcclxuICAgICAgICAvLyB1c2VtdGwgbWF0ZXJpYWxfbmFtZVxyXG4gICAgICAgIG1hdGVyaWFsX3VzZV9wYXR0ZXJuICAgICA6IC9edXNlbXRsIC9cclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuT0JKTG9hZGVyLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogT0JKTG9hZGVyLFxyXG5cclxuICAgIGxvYWQ6IGZ1bmN0aW9uICggdXJsLCBvbkxvYWQsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKSB7XHJcblxyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRmlsZUxvYWRlciggc2NvcGUubWFuYWdlciApO1xyXG4gICAgICAgIGxvYWRlci5zZXRQYXRoKCB0aGlzLnBhdGggKTtcclxuICAgICAgICBsb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgICAgICBvbkxvYWQoIHNjb3BlLnBhcnNlKCB0ZXh0ICkgKTtcclxuXHJcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0UGF0aDogZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXRoID0gdmFsdWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNYXRlcmlhbHM6IGZ1bmN0aW9uICggbWF0ZXJpYWxzICkge1xyXG5cclxuICAgICAgICB0aGlzLm1hdGVyaWFscyA9IG1hdGVyaWFscztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIF9jcmVhdGVQYXJzZXJTdGF0ZSA6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlID0ge1xyXG4gICAgICAgICAgICBvYmplY3RzICA6IFtdLFxyXG4gICAgICAgICAgICBvYmplY3QgICA6IHt9LFxyXG5cclxuICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgdXZzICAgICAgOiBbXSxcclxuXHJcbiAgICAgICAgICAgIG1hdGVyaWFsTGlicmFyaWVzIDogW10sXHJcblxyXG4gICAgICAgICAgICBzdGFydE9iamVjdDogZnVuY3Rpb24gKCBuYW1lLCBmcm9tRGVjbGFyYXRpb24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgb2JqZWN0IChpbml0aWFsIGZyb20gcmVzZXQpIGlzIG5vdCBmcm9tIGEgZy9vIGRlY2xhcmF0aW9uIGluIHRoZSBwYXJzZWRcclxuICAgICAgICAgICAgICAgIC8vIGZpbGUuIFdlIG5lZWQgdG8gdXNlIGl0IGZvciB0aGUgZmlyc3QgcGFyc2VkIGcvbyB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPT09IGZhbHNlICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPSAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c01hdGVyaWFsID0gKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsID09PSAnZnVuY3Rpb24nID8gdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsKCkgOiB1bmRlZmluZWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSggdHJ1ZSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tRGVjbGFyYXRpb24gOiAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV2cyAgICAgIDogW11cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFscyA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TWF0ZXJpYWwgOiBmdW5jdGlvbiggbmFtZSwgbGlicmFyaWVzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5fZmluYWxpemUoIGZhbHNlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXcgdXNlbXRsIGRlY2xhcmF0aW9uIG92ZXJ3cml0ZXMgYW4gaW5oZXJpdGVkIG1hdGVyaWFsLCBleGNlcHQgaWYgZmFjZXMgd2VyZSBkZWNsYXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGUgbWF0ZXJpYWwsIHRoZW4gaXQgbXVzdCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBwcmV2aW91cyAmJiAoIHByZXZpb3VzLmluaGVyaXRlZCB8fCBwcmV2aW91cy5ncm91cENvdW50IDw9IDAgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5zcGxpY2UoIHByZXZpb3VzLmluZGV4LCAxICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogdGhpcy5tYXRlcmlhbHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogKCBBcnJheS5pc0FycmF5KCBsaWJyYXJpZXMgKSAmJiBsaWJyYXJpZXMubGVuZ3RoID4gMCA/IGxpYnJhcmllc1sgbGlicmFyaWVzLmxlbmd0aCAtIDEgXSA6ICcnICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbW9vdGggICAgIDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuc21vb3RoIDogdGhpcy5zbW9vdGggKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiAoIHByZXZpb3VzICE9PSB1bmRlZmluZWQgPyBwcmV2aW91cy5ncm91cEVuZCA6IDAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmVkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogKCB0eXBlb2YgaW5kZXggPT09ICdudW1iZXInID8gaW5kZXggOiB0aGlzLmluZGV4ICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG10bGxpYiAgICAgOiB0aGlzLm10bGxpYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21vb3RoICAgICA6IHRoaXMuc21vb3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0IDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZC5jbG9uZSA9IHRoaXMuY2xvbmUuYmluZChjbG9uZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKCBtYXRlcmlhbCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGVyaWFsc1sgdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBfZmluYWxpemUgOiBmdW5jdGlvbiggZW5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RNdWx0aU1hdGVyaWFsID0gdGhpcy5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBsYXN0TXVsdGlNYXRlcmlhbCAmJiBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9PT0gLTEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPSB0aGlzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cENvdW50ID0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgLSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cFN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuaW5oZXJpdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgb2JqZWN0cyB0YWlsIG1hdGVyaWFscyBpZiBubyBmYWNlIGRlY2xhcmF0aW9ucyBmb2xsb3dlZCB0aGVtIGJlZm9yZSBhIG5ldyBvL2cgc3RhcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSB0aGlzLm1hdGVyaWFscy5sZW5ndGggLSAxOyBtaSA+PSAwOyBtaS0tICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHNbbWldLmdyb3VwQ291bnQgPD0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMuc3BsaWNlKCBtaSwgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEd1YXJhbnRlZSBhdCBsZWFzdCBvbmUgZW1wdHkgbWF0ZXJpYWwsIHRoaXMgbWFrZXMgdGhlIGNyZWF0aW9uIGxhdGVyIG1vcmUgc3RyYWlnaHQgZm9yd2FyZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID09PSAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRoaXMuc21vb3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0TXVsdGlNYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJbmhlcml0IHByZXZpb3VzIG9iamVjdHMgbWF0ZXJpYWwuXHJcbiAgICAgICAgICAgICAgICAvLyBTcGVjIHRlbGxzIHVzIHRoYXQgYSBkZWNsYXJlZCBtYXRlcmlhbCBtdXN0IGJlIHNldCB0byBhbGwgb2JqZWN0cyB1bnRpbCBhIG5ldyBtYXRlcmlhbCBpcyBkZWNsYXJlZC5cclxuICAgICAgICAgICAgICAgIC8vIElmIGEgdXNlbXRsIGRlY2xhcmF0aW9uIGlzIGVuY291bnRlcmVkIHdoaWxlIHRoaXMgbmV3IG9iamVjdCBpcyBiZWluZyBwYXJzZWQsIGl0IHdpbGxcclxuICAgICAgICAgICAgICAgIC8vIG92ZXJ3cml0ZSB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLiBFeGNlcHRpb24gYmVpbmcgdGhhdCB0aGVyZSB3YXMgYWxyZWFkeSBmYWNlIGRlY2xhcmF0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGluaGVyaXRlZCBtYXRlcmlhbCwgdGhlbiBpdCB3aWxsIGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggcHJldmlvdXNNYXRlcmlhbCAmJiBwcmV2aW91c01hdGVyaWFsLm5hbWUgJiYgdHlwZW9mIHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUgPT09IFwiZnVuY3Rpb25cIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlY2xhcmVkID0gcHJldmlvdXNNYXRlcmlhbC5jbG9uZSggMCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlY2xhcmVkLmluaGVyaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QubWF0ZXJpYWxzLnB1c2goIGRlY2xhcmVkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKCB0aGlzLm9iamVjdCApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZpbmFsaXplIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VWZXJ0ZXhJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VOb3JtYWxJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VVVkluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMiApICogMjtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRWZXJ0ZXg6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVmVydGV4TGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGROb3JtYWwgOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMubm9ybWFscztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS5ub3JtYWxzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRVVjogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFVWTGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEZhY2U6IGZ1bmN0aW9uICggYSwgYiwgYywgZCwgdWEsIHViLCB1YywgdWQsIG5hLCBuYiwgbmMsIG5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlhID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBhLCB2TGVuICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWIgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGIsIHZMZW4gKTtcclxuICAgICAgICAgICAgICAgIHZhciBpYyA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYywgdkxlbiApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBkLCB2TGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB1YSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlhID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVhLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGliID0gdGhpcy5wYXJzZVVWSW5kZXgoIHViLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGljID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVjLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVkLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBuYSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBOb3JtYWxzIGFyZSBtYW55IHRpbWVzIHRoZSBzYW1lLiBJZiBzbywgc2tpcCBmdW5jdGlvbiBjYWxsIGFuZCBwYXJzZUludC5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbkxlbiA9IHRoaXMubm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWEgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5hLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGliID0gbmEgPT09IG5iID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5iLCBuTGVuICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWMgPSBuYSA9PT0gbmMgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmMsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5kLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZExpbmVHZW9tZXRyeTogZnVuY3Rpb24gKCB2ZXJ0aWNlcywgdXZzICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Lmdlb21ldHJ5LnR5cGUgPSAnTGluZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdmkgPSAwLCBsID0gdmVydGljZXMubGVuZ3RoOyB2aSA8IGw7IHZpICsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleExpbmUoIHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggdmVydGljZXNbIHZpIF0sIHZMZW4gKSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdXZpID0gMCwgbCA9IHV2cy5sZW5ndGg7IHV2aSA8IGw7IHV2aSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVVkxpbmUoIHRoaXMucGFyc2VVVkluZGV4KCB1dnNbIHV2aSBdLCB1dkxlbiApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzdGF0ZS5zdGFydE9iamVjdCggJycsIGZhbHNlICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlOiBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ09CSkxvYWRlci5wYXJzZScpOyAgICAgICAgXHJcblxyXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX2NyZWF0ZVBhcnNlclN0YXRlKCk7XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxyXFxuJyApICE9PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIFN0cmluZy5zcGxpdCB3aXRoIHJlZ2V4IHRoYXQgc3BsaXRzIG9uIGJvdGhcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggL1xcclxcbi9nLCAnXFxuJyApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxcXFxcbicgKSAhPT0gLSAxKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBqb2luIGxpbmVzIHNlcGFyYXRlZCBieSBhIGxpbmUgY29udGludWF0aW9uIGNoYXJhY3RlciAoXFwpXHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXFxcXFxuL2csICcnICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxpbmVzID0gdGV4dC5zcGxpdCggJ1xcbicgKTtcclxuICAgICAgICB2YXIgbGluZSA9ICcnLCBsaW5lRmlyc3RDaGFyID0gJycsIGxpbmVTZWNvbmRDaGFyID0gJyc7XHJcbiAgICAgICAgdmFyIGxpbmVMZW5ndGggPSAwO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gRmFzdGVyIHRvIGp1c3QgdHJpbSBsZWZ0IHNpZGUgb2YgdGhlIGxpbmUuIFVzZSBpZiBhdmFpbGFibGUuXHJcbiAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAvLyB2YXIgdHJpbUxlZnQgPSAoIHR5cGVvZiAnJy50cmltTGVmdCA9PT0gJ2Z1bmN0aW9uJyApO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF07XHJcblxyXG4gICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAvLyBsaW5lID0gdHJpbUxlZnQgPyBsaW5lLnRyaW1MZWZ0KCkgOiBsaW5lLnRyaW0oKTtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgbGluZUxlbmd0aCA9IGxpbmUubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsaW5lTGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBsaW5lRmlyc3RDaGFyID0gbGluZS5jaGFyQXQoIDAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEB0b2RvIGludm9rZSBwYXNzZWQgaW4gaGFuZGxlciBpZiBhbnlcclxuICAgICAgICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAnIycgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJ3YnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxpbmVTZWNvbmRDaGFyID0gbGluZS5jaGFyQXQoIDEgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAnICcgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC52ZXJ0ZXhfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInYgMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICduJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm5vcm1hbF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm5vcm1hbHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICd0JyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnV2X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAxICAgICAgMlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudXZzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIHZlcnRleC9ub3JtYWwvdXYgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwiZlwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91dl9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICAgNyAgICA4ICAgIDkgICAxMCAgICAgICAgIDExICAgICAgICAgMTJcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMS8xIDIvMi8yIDMvMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA3IF0sIHJlc3VsdFsgMTAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDggXSwgcmVzdWx0WyAxMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOSBdLCByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXYuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMSAyLzIgMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfbm9ybWFsLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxLy8xIDIvLzIgMy8vM1wiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgMSAgICAyICAgIDMgICA0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDIgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNCBdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBmYWNlIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lRmlyc3RDaGFyID09PSBcImxcIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVBhcnRzID0gbGluZS5zdWJzdHJpbmcoIDEgKS50cmltKCkuc3BsaXQoIFwiIFwiICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVZlcnRpY2VzID0gW10sIGxpbmVVVnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmUuaW5kZXhPZiggXCIvXCIgKSA9PT0gLSAxICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsaW5lVmVydGljZXMgPSBsaW5lUGFydHM7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGxpID0gMCwgbGxlbiA9IGxpbmVQYXJ0cy5sZW5ndGg7IGxpIDwgbGxlbjsgbGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBsaW5lUGFydHNbIGxpIF0uc3BsaXQoIFwiL1wiICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAwIF0gIT09IFwiXCIgKSBsaW5lVmVydGljZXMucHVzaCggcGFydHNbIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAxIF0gIT09IFwiXCIgKSBsaW5lVVZzLnB1c2goIHBhcnRzWyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXRlLmFkZExpbmVHZW9tZXRyeSggbGluZVZlcnRpY2VzLCBsaW5lVVZzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm9iamVjdF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG8gb2JqZWN0X25hbWVcclxuICAgICAgICAgICAgICAgIC8vIG9yXHJcbiAgICAgICAgICAgICAgICAvLyBnIGdyb3VwX25hbWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXT1JLQVJPVU5EOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yODY5XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgbmFtZSA9IHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gKCBcIiBcIiArIHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKSApLnN1YnN0ciggMSApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLnN0YXJ0T2JqZWN0KCBuYW1lICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF91c2VfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWF0ZXJpYWxcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5vYmplY3Quc3RhcnRNYXRlcmlhbCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCksIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG10bCBmaWxlXHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMucHVzaCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuc21vb3RoaW5nX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBIYW5kbGUgZmlsZXMgdGhhdCBoYXZlIHZhcnlpbmcgc21vb3RoIHZhbHVlcyBmb3IgYSBzZXQgb2YgZmFjZXMgaW5zaWRlIG9uZSBnZW9tZXRyeSxcclxuICAgICAgICAgICAgICAgIC8vIGJ1dCBkb2VzIG5vdCBkZWZpbmUgYSB1c2VtdGwgZm9yIGVhY2ggZmFjZSBzZXQuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhbmQgYSBkdW1teSBtYXRlcmlhbCBjcmVhdGVkIChsYXRlciBNdWx0aU1hdGVyaWFsIGFuZCBnZW9tZXRyeSBncm91cHMpLlxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyByZXF1aXJlcyBzb21lIGNhcmUgdG8gbm90IGNyZWF0ZSBleHRyYSBtYXRlcmlhbCBvbiBlYWNoIHNtb290aCB2YWx1ZSBmb3IgXCJub3JtYWxcIiBvYmogZmlsZXMuXHJcbiAgICAgICAgICAgICAgICAvLyB3aGVyZSBleHBsaWNpdCB1c2VtdGwgZGVmaW5lcyBnZW9tZXRyeSBncm91cHMuXHJcbiAgICAgICAgICAgICAgICAvLyBFeGFtcGxlIGFzc2V0OiBleGFtcGxlcy9tb2RlbHMvb2JqL2NlcmJlcnVzL0NlcmJlcnVzLm9ialxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdFsgMSBdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGh0dHA6Ly9wYXVsYm91cmtlLm5ldC9kYXRhZm9ybWF0cy9vYmovXHJcbiAgICAgICAgICAgICAgICAgKiBvclxyXG4gICAgICAgICAgICAgICAgICogaHR0cDovL3d3dy5jcy51dGFoLmVkdS9+Ym91bG9zL2NzMzUwNS9vYmpfc3BlYy5wZGZcclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBGcm9tIGNoYXB0ZXIgXCJHcm91cGluZ1wiIFN5bnRheCBleHBsYW5hdGlvbiBcInMgZ3JvdXBfbnVtYmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgKiBcImdyb3VwX251bWJlciBpcyB0aGUgc21vb3RoaW5nIGdyb3VwIG51bWJlci4gVG8gdHVybiBvZmYgc21vb3RoaW5nIGdyb3VwcywgdXNlIGEgdmFsdWUgb2YgMCBvciBvZmYuXHJcbiAgICAgICAgICAgICAgICAgKiBQb2x5Z29uYWwgZWxlbWVudHMgdXNlIGdyb3VwIG51bWJlcnMgdG8gcHV0IGVsZW1lbnRzIGluIGRpZmZlcmVudCBzbW9vdGhpbmcgZ3JvdXBzLiBGb3IgZnJlZS1mb3JtXHJcbiAgICAgICAgICAgICAgICAgKiBzdXJmYWNlcywgc21vb3RoaW5nIGdyb3VwcyBhcmUgZWl0aGVyIHR1cm5lZCBvbiBvciBvZmY7IHRoZXJlIGlzIG5vIGRpZmZlcmVuY2UgYmV0d2VlbiB2YWx1ZXMgZ3JlYXRlclxyXG4gICAgICAgICAgICAgICAgICogdGhhbiAwLlwiXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdC5zbW9vdGggPSAoIHZhbHVlICE9PSAnMCcgJiYgdmFsdWUgIT09ICdvZmYnICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gc3RhdGUub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc21vb3RoID0gc3RhdGUub2JqZWN0LnNtb290aDtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBudWxsIHRlcm1pbmF0ZWQgZmlsZXMgd2l0aG91dCBleGNlcHRpb25cclxuICAgICAgICAgICAgICAgIGlmICggbGluZSA9PT0gJ1xcMCcgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUuZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgLy9jb250YWluZXIubWF0ZXJpYWxMaWJyYXJpZXMgPSBbXS5jb25jYXQoIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcbiAgICAgICAgKDxhbnk+Y29udGFpbmVyKS5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsID0gc3RhdGUub2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG9iamVjdCA9IHN0YXRlLm9iamVjdHNbIGkgXTtcclxuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5O1xyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzID0gb2JqZWN0Lm1hdGVyaWFscztcclxuICAgICAgICAgICAgdmFyIGlzTGluZSA9ICggZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmUnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIG8vZyBsaW5lIGRlY2xhcmF0aW9ucyB0aGF0IGRpZCBub3QgZm9sbG93IHdpdGggYW55IGZhY2VzXHJcbiAgICAgICAgICAgIGlmICggZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnVmZmVyZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHJcbiAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudmVydGljZXMgKSwgMyApICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdub3JtYWwnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS5ub3JtYWxzICksIDMgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBnZW9tZXRyeS51dnMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnV2cyApLCAyICkgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBtYXRlcmlhbHNcclxuICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgLy92YXIgY3JlYXRlZE1hdGVyaWFscyA9IFtdOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjcmVhdGVkTWF0ZXJpYWxzIDogVEhSRUUuTWF0ZXJpYWxbXSA9IFtdOyAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VNYXRlcmlhbCA9IG1hdGVyaWFsc1ttaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscyAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFscy5jcmVhdGUoIHNvdXJjZU1hdGVyaWFsLm5hbWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbXRsIGV0Yy4gbG9hZGVycyBwcm9iYWJseSBjYW4ndCBjcmVhdGUgbGluZSBtYXRlcmlhbHMgY29ycmVjdGx5LCBjb3B5IHByb3BlcnRpZXMgdG8gYSBsaW5lIG1hdGVyaWFsLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNMaW5lICYmIG1hdGVyaWFsICYmICEgKCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWxMaW5lID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsTGluZS5jb3B5KCBtYXRlcmlhbCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IG1hdGVyaWFsTGluZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICEgbWF0ZXJpYWwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpIDogbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5uYW1lID0gc291cmNlTWF0ZXJpYWwubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2hhZGluZyA9IHNvdXJjZU1hdGVyaWFsLnNtb290aCA/IFRIUkVFLlNtb290aFNoYWRpbmcgOiBUSFJFRS5GbGF0U2hhZGluZztcclxuXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkTWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1lc2hcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBjcmVhdGVkTWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRHcm91cCggc291cmNlTWF0ZXJpYWwuZ3JvdXBTdGFydCwgc291cmNlTWF0ZXJpYWwuZ3JvdXBDb3VudCwgbWkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgLy9tZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFscyApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHMgKSApO1xyXG4gICAgICAgICAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbMF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsICkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgIC8vbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZU1hdGVyaWFscykgKTtcclxuICAgICAgICAgICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsKSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGQoIG1lc2ggKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZyk7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhLCBTdGFuZGFyZFZpZXd9ICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzLCBPYmplY3ROYW1lc30gICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIlZpZXdlclwiXHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIENhbWVyYUNvbnRyb2xzXHJcbiAqL1xyXG5jbGFzcyBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgZml0VmlldyAgICAgICAgICAgIDogKCkgPT4gdm9pZDtcclxuICAgIGFkZENhbWVyYUhlbHBlciAgICA6ICgpID0+IHZvaWQ7XHJcbiAgICBcclxuICAgIHN0YW5kYXJkVmlldyAgICAgICAgICA6IFN0YW5kYXJkVmlldztcclxuICAgIGZpZWxkT2ZWaWV3OiBudW1iZXIgICA7XHJcbiAgICBuZWFyQ2xpcHBpbmdQbGFuZSAgICAgOiBudW1iZXI7XHJcbiAgICBmYXJDbGlwcGluZ1BsYW5lICAgICAgOiBudW1iZXI7XHJcbiAgICBib3VuZENsaXBwaW5nUGxhbmVzICAgOiAoKSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBmaXRWaWV3OiAoKSA9PiBhbnksIGFkZEN3bWVyYUhlbHBlcjogKCkgPT4gYW55LCBib3VuZENsaXBwaW5nUGxhbmVzOiAoKSA9PiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5maXRWaWV3ICAgICAgICAgPSBmaXRWaWV3O1xyXG4gICAgICAgIHRoaXMuYWRkQ2FtZXJhSGVscGVyID0gYWRkQ3dtZXJhSGVscGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhbmRhcmRWaWV3ICAgICAgICAgID0gU3RhbmRhcmRWaWV3LkZyb250O1xyXG4gICAgICAgIHRoaXMuZmllbGRPZlZpZXcgICAgICAgICAgID0gY2FtZXJhLmZvdjtcclxuICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lICAgICA9IGNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSAgICAgID0gY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLmJvdW5kQ2xpcHBpbmdQbGFuZXMgPSBib3VuZENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogY2FtZXJhIFVJIENvbnRyb2xzLlxyXG4gKi8gICAgXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmFDb250cm9scyB7XHJcblxyXG4gICAgX3ZpZXdlciAgICAgICAgICAgICAgICAgICA6IFZpZXdlcjsgICAgICAgICAgICAgICAgICAgICAvLyBhc3NvY2lhdGVkIHZpZXdlclxyXG4gICAgX2NhbWVyYVNldHRpbmdzICAgICAgICAgICA6IENhbWVyYVNldHRpbmdzOyAgICAgICAgICAgICAvLyBVSSBzZXR0aW5nc1xyXG4gICAgX2NvbnRyb2xOZWFyQ2xpcHBpbmdQbGFuZSA6IGRhdC5HVUlDb250cm9sbGVyO1xyXG4gICAgX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lICA6IGRhdC5HVUlDb250cm9sbGVyO1xyXG4gICAgXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIENhbWVyYUNvbnRyb2xzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iodmlld2VyIDogVmlld2VyKSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyID0gdmlld2VyO1xyXG5cclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuICAgIC8qKlxyXG4gICAgICogRml0cyB0aGUgYWN0aXZlIHZpZXcuXHJcbiAgICAgKi9cclxuICAgIGZpdFZpZXcoKSA6IHZvaWQgeyBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92aWV3ZXIuZml0VmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIGNhbWVyYSB2aXN1YWxpemF0aW9uIGdyYXBoaWMgdG8gdGhlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBhZGRDYW1lcmFIZWxwZXIoKSA6IHZvaWQgeyBcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlQWxsQnlOYW1lKHRoaXMuX3ZpZXdlci5zY2VuZSwgT2JqZWN0TmFtZXMuQ2FtZXJhSGVscGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBXb3JsZFxyXG4gICAgICAgIEdyYXBoaWNzLmFkZENhbWVyYUhlbHBlcih0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLl92aWV3ZXIuc2NlbmUsIHRoaXMuX3ZpZXdlci5tb2RlbCk7XHJcblxyXG4gICAgICAgIC8vIFZpZXdcclxuICAgICAgICBsZXQgbW9kZWxWaWV3ID0gR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QodGhpcy5fdmlld2VyLm1vZGVsLCB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbGV0IGNhbWVyYVZpZXcgPSBDYW1lcmEuZ2V0RGVmYXVsdENhbWVyYSh0aGlzLl92aWV3ZXIuYXNwZWN0UmF0aW8pO1xyXG4gICAgICAgIEdyYXBoaWNzLmFkZENhbWVyYUhlbHBlcihjYW1lcmFWaWV3LCB0aGlzLl92aWV3ZXIuc2NlbmUsIG1vZGVsVmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3JjZSB0aGUgZmFyIGNsaXBwaW5nIHBsYW5lIHRvIHRoZSBtb2RlbCBleHRlbnRzLlxyXG4gICAgICovXHJcbiAgICBib3VuZENsaXBwaW5nUGxhbmVzKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY2xpcHBpbmdQbGFuZXMgPSBDYW1lcmEuZ2V0Qm91bmRpbmdDbGlwcGluZ1BsYW5lcyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLl92aWV3ZXIubW9kZWwpO1xyXG5cclxuICAgICAgICAvLyBjYW1lcmFcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSBjbGlwcGluZ1BsYW5lcy5uZWFyO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEuZmFyICA9IGNsaXBwaW5nUGxhbmVzLmZhcjtcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLy8gVUkgY29udHJvbHNcclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5uZWFyQ2xpcHBpbmdQbGFuZSA9IGNsaXBwaW5nUGxhbmVzLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lLm1pbihjbGlwcGluZ1BsYW5lcy5uZWFyKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sTmVhckNsaXBwaW5nUGxhbmUubWF4IChjbGlwcGluZ1BsYW5lcy5mYXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzLmZhckNsaXBwaW5nUGxhbmUgID0gY2xpcHBpbmdQbGFuZXMuZmFyO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lLm1pbihjbGlwcGluZ1BsYW5lcy5uZWFyKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sRmFyQ2xpcHBpbmdQbGFuZS5tYXgoY2xpcHBpbmdQbGFuZXMuZmFyKTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlldyBzZXR0aW5ncyB0aGF0IGFyZSBjb250cm9sbGFibGUgYnkgdGhlIHVzZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncyA9IG5ldyBDYW1lcmFTZXR0aW5ncyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLmZpdFZpZXcuYmluZCh0aGlzKSwgdGhpcy5hZGRDYW1lcmFIZWxwZXIuYmluZCh0aGlzKSwgdGhpcy5ib3VuZENsaXBwaW5nUGxhbmVzLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBJbml0IGRhdC5ndWkgYW5kIGNvbnRyb2xzIGZvciB0aGUgVUlcclxuICAgICAgICBsZXQgZ3VpID0gbmV3IGRhdC5HVUkoe1xyXG4gICAgICAgICAgICBhdXRvUGxhY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICB3aWR0aDogMzIwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBtZW51RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fdmlld2VyLmNvbnRhaW5lcklkKTtcclxuICAgICAgICBtZW51RGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IGNhbWVyYU9wdGlvbnMgPSBndWkuYWRkRm9sZGVyKCdDYW1lcmEgT3B0aW9ucycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZpdCBWaWV3XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGaXRWaWV3ID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdmaXRWaWV3JykubmFtZSgnRml0IFZpZXcnKTtcclxuXHJcbiAgICAgICAgLy8gQ2FtZXJhSGVscGVyXHJcbiAgICAgICAgbGV0IGNvbnRyb2xDYW1lcmFIZWxwZXIgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2FkZENhbWVyYUhlbHBlcicpLm5hbWUoJ0NhbWVyYSBIZWxwZXInKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBTdGFuZGFyZCBWaWV3c1xyXG4gICAgICAgIGxldCB2aWV3T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgRnJvbnQgICAgICAgOiBTdGFuZGFyZFZpZXcuRnJvbnQsXHJcbiAgICAgICAgICAgIEJhY2sgICAgICAgIDogU3RhbmRhcmRWaWV3LkJhY2ssXHJcbiAgICAgICAgICAgIFRvcCAgICAgICAgIDogU3RhbmRhcmRWaWV3LlRvcCxcclxuICAgICAgICAgICAgSXNvbWV0cmljICAgOiBTdGFuZGFyZFZpZXcuSXNvbWV0cmljLFxyXG4gICAgICAgICAgICBMZWZ0ICAgICAgICA6IFN0YW5kYXJkVmlldy5MZWZ0LFxyXG4gICAgICAgICAgICBSaWdodCAgICAgICA6IFN0YW5kYXJkVmlldy5SaWdodCxcclxuICAgICAgICAgICAgQm90dG9tICAgICAgOiBTdGFuZGFyZFZpZXcuQm90dG9tXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTdGFuZGFyZFZpZXdzID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdzdGFuZGFyZFZpZXcnLCB2aWV3T3B0aW9ucykubmFtZSgnU3RhbmRhcmQgVmlldycpLmxpc3RlbigpO1xyXG4gICAgICAgIGNvbnRyb2xTdGFuZGFyZFZpZXdzLm9uQ2hhbmdlICgodmlld1NldHRpbmcgOiBzdHJpbmcpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3IDogU3RhbmRhcmRWaWV3ID0gcGFyc2VJbnQodmlld1NldHRpbmcsIDEwKTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyh2aWV3KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIGxldCBtaW5pbXVtID0gMjU7XHJcbiAgICAgICAgbGV0IG1heGltdW0gPSA3NTtcclxuICAgICAgICBsZXQgc3RlcFNpemUgPSAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXcgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2ZpZWxkT2ZWaWV3JykubmFtZSgnRmllbGQgb2YgVmlldycpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7O1xyXG4gICAgICAgIGNvbnRyb2xGaWVsZE9mVmlldy5vbkNoYW5nZShmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZvdiA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gTmVhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAwLjE7XHJcbiAgICAgICAgbWF4aW11bSAgPSAxMDA7XHJcbiAgICAgICAgc3RlcFNpemUgPSAgIDAuMTtcclxuICAgICAgICB0aGlzLl9jb250cm9sTmVhckNsaXBwaW5nUGxhbmUgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ25lYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnTmVhciBDbGlwcGluZyBQbGFuZScpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAgIDE7XHJcbiAgICAgICAgbWF4aW11bSAgPSAxMDAwMDtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAgICAwLjE7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbEZhckNsaXBwaW5nUGxhbmUgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2ZhckNsaXBwaW5nUGxhbmUnKS5uYW1lKCdGYXIgQ2xpcHBpbmcgUGxhbmUnKS5taW4obWluaW11bSkubWF4KG1heGltdW0pLnN0ZXAoc3RlcFNpemUpLmxpc3RlbigpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gQm91bmQgQ2xpcHBpbmcgUGxhbmVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xCb3VuZENsaXBwaW5nUGxhbmVzID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdib3VuZENsaXBwaW5nUGxhbmVzJykubmFtZSgnQm91bmQgQ2xpcHBpbmcgUGxhbmVzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FtZXJhT3B0aW9ucy5vcGVuKCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3luY2hyb25pemUgdGhlIFVJIGNhbWVyYSBzZXR0aW5ncyB3aXRoIHRoZSB0YXJnZXQgY2FtZXJhLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBcclxuICAgICAqL1xyXG4gICAgc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncyAodmlldz8gOiBTdGFuZGFyZFZpZXcpIHtcclxuXHJcbiAgICAgICAgaWYgKHZpZXcpXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzLnN0YW5kYXJkVmlldyA9IHZpZXc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhU2V0dGluZ3MubmVhckNsaXBwaW5nUGxhbmUgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhU2V0dGluZ3MuZmFyQ2xpcHBpbmdQbGFuZSAgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5maWVsZE9mVmlldyAgICAgICA9IHRoaXMuX3ZpZXdlci5jYW1lcmEuZm92O1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcbiAgICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGVyaWFsc1xyXG4gKiBHZW5lcmFsIFRIUkVFLmpzIE1hdGVyaWFsIGNsYXNzZXMgYW5kIGhlbHBlcnNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBNYXRlcmlhbHNcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdGV4dHVyZSBtYXRlcmlhbCBmcm9tIGFuIGltYWdlIFVSTC5cclxuICAgICAqIEBwYXJhbSBpbWFnZSBJbWFnZSB0byB1c2UgaW4gdGV4dHVyZS5cclxuICAgICAqIEByZXR1cm5zIFRleHR1cmUgbWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVUZXh0dXJlTWF0ZXJpYWwgKGltYWdlIDogSFRNTEltYWdlRWxlbWVudCkgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0ZXh0dXJlICAgICAgICAgOiBUSFJFRS5UZXh0dXJlLFxyXG4gICAgICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShpbWFnZSk7XHJcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSAgICAgPSB0cnVlO1xyXG4gICAgICAgIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIG1hZ25pZmljYXRpb24gYW5kIG1pbmlmaWNhdGlvbiBmaWx0ZXJzIHNhbXBsZSB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMgd2hlbiBtYXBwaW5nIHRvIGEgcGl4ZWwuXHJcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIGRlZmF1bHQgbW9kZXMgb3ZlcnNhbXBsZSB3aGljaCBsZWFkcyB0byBibGVuZGluZyB3aXRoIHRoZSBibGFjayBiYWNrZ3JvdW5kLiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHByb2R1Y2VzIGNvbG9yZWQgKGJsYWNrKSBhcnRpZmFjdHMgYXJvdW5kIHRoZSBlZGdlcyBvZiB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMuXHJcbiAgICAgICAgdGV4dHVyZS5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAsIDEuMCk7XHJcblxyXG4gICAgICAgIHRleHR1cmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge21hcDogdGV4dHVyZX0gKTtcclxuICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGV4dHVyZU1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIENyZWF0ZSBhIGJ1bXAgbWFwIFBob25nIG1hdGVyaWFsIGZyb20gYSB0ZXh0dXJlIG1hcC5cclxuICAgICAqIEBwYXJhbSBkZXNpZ25UZXh0dXJlIEJ1bXAgbWFwIHRleHR1cmUuXHJcbiAgICAgKiBAcmV0dXJucyBQaG9uZyBidW1wIG1hcHBlZCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZU1lc2hQaG9uZ01hdGVyaWFsKGRlc2lnblRleHR1cmUgOiBUSFJFRS5UZXh0dXJlKSAgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgIGNvbG9yICAgOiAweGZmZmZmZixcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBidW1wTWFwICAgOiBkZXNpZ25UZXh0dXJlLFxyXG4gICAgICAgICAgICBidW1wU2NhbGUgOiAtMS4wLFxyXG5cclxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuU21vb3RoU2hhZGluZyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdHJhbnNwYXJlbnQgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBUcmFuc3BhcmVudCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVRyYW5zcGFyZW50TWF0ZXJpYWwoKSAgOiBUSFJFRS5NYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yIDogMHgwMDAwMDAsIG9wYWNpdHkgOiAwLjAsIHRyYW5zcGFyZW50IDogdHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuIiwiLyoqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ3Rzb3AvdGhyZWVqcy10cmFja2JhbGwtY29udHJvbHNcbiAqIEBhdXRob3IgRWJlcmhhcmQgR3JhZXRoZXIgLyBodHRwOi8vZWdyYWV0aGVyLmNvbS9cbiAqIEBhdXRob3IgTWFyayBMdW5kaW4gXHQvIGh0dHA6Ly9tYXJrLWx1bmRpbi5jb21cbiAqIEBhdXRob3IgU2ltb25lIE1hbmluaSAvIGh0dHA6Ly9kYXJvbjEzMzcuZ2l0aHViLmlvXG4gKiBAYXV0aG9yIEx1Y2EgQW50aWdhIFx0LyBodHRwOi8vbGFudGlnYS5naXRodWIuaW9cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmFja2JhbGxDb250cm9scyAoIG9iamVjdCwgZG9tRWxlbWVudCApIHtcblxuXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHR2YXIgU1RBVEUgPSB7IE5PTkU6IC0gMSwgUk9UQVRFOiAwLCBaT09NOiAxLCBQQU46IDIsIFRPVUNIX1JPVEFURTogMywgVE9VQ0hfWk9PTV9QQU46IDQgfTtcblxuXHR0aGlzLm9iamVjdCA9IG9iamVjdDtcblx0dGhpcy5kb21FbGVtZW50ID0gKCBkb21FbGVtZW50ICE9PSB1bmRlZmluZWQgKSA/IGRvbUVsZW1lbnQgOiBkb2N1bWVudDtcblxuXHQvLyBBUElcblxuXHR0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG5cdHRoaXMuc2NyZWVuID0geyBsZWZ0OiAwLCB0b3A6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcblxuXHR0aGlzLnJvdGF0ZVNwZWVkID0gMS4wO1xuXHR0aGlzLnpvb21TcGVlZCA9IDEuMjtcblx0dGhpcy5wYW5TcGVlZCA9IDAuMztcblxuXHR0aGlzLm5vUm90YXRlID0gZmFsc2U7XG5cdHRoaXMubm9ab29tID0gZmFsc2U7XG5cdHRoaXMubm9QYW4gPSBmYWxzZTtcblxuXHR0aGlzLnN0YXRpY01vdmluZyA9IHRydWU7XG5cdHRoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjI7XG5cblx0dGhpcy5taW5EaXN0YW5jZSA9IDA7XG5cdHRoaXMubWF4RGlzdGFuY2UgPSBJbmZpbml0eTtcblxuXHR0aGlzLmtleXMgPSBbIDY1IC8qQSovLCA4MyAvKlMqLywgNjggLypEKi8gXTtcblxuXHQvLyBpbnRlcm5hbHNcblxuXHR0aGlzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0dmFyIEVQUyA9IDAuMDAwMDAxO1xuXG5cdHZhciBsYXN0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdHZhciBfc3RhdGUgPSBTVEFURS5OT05FLFxuXHRfcHJldlN0YXRlID0gU1RBVEUuTk9ORSxcblxuXHRfZXllID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblxuXHRfbW92ZVByZXYgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfbW92ZUN1cnIgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXG5cdF9sYXN0QXhpcyA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdF9sYXN0QW5nbGUgPSAwLFxuXG5cdF96b29tU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfem9vbUVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cblx0X3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSAwLFxuXHRfdG91Y2hab29tRGlzdGFuY2VFbmQgPSAwLFxuXG5cdF9wYW5TdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF9wYW5FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdC8vIGZvciByZXNldFxuXG5cdHRoaXMudGFyZ2V0MCA9IHRoaXMudGFyZ2V0LmNsb25lKCk7XG5cdHRoaXMucG9zaXRpb24wID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0dGhpcy51cDAgPSB0aGlzLm9iamVjdC51cC5jbG9uZSgpO1xuXG5cdC8vIGV2ZW50c1xuXG5cdHZhciBjaGFuZ2VFdmVudCA9IHsgdHlwZTogJ2NoYW5nZScgfTtcblx0dmFyIHN0YXJ0RXZlbnQgPSB7IHR5cGU6ICdzdGFydCcgfTtcblx0dmFyIGVuZEV2ZW50ID0geyB0eXBlOiAnZW5kJyB9O1xuXG5cblx0Ly8gbWV0aG9kc1xuXG5cdHRoaXMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCB0aGlzLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ICkge1xuXG5cdFx0XHR0aGlzLnNjcmVlbi5sZWZ0ID0gMDtcblx0XHRcdHRoaXMuc2NyZWVuLnRvcCA9IDA7XG5cdFx0XHR0aGlzLnNjcmVlbi53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdFx0dGhpcy5zY3JlZW4uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIGJveCA9IHRoaXMuZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdC8vIGFkanVzdG1lbnRzIGNvbWUgZnJvbSBzaW1pbGFyIGNvZGUgaW4gdGhlIGpxdWVyeSBvZmZzZXQoKSBmdW5jdGlvblxuXHRcdFx0dmFyIGQgPSB0aGlzLmRvbUVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHR0aGlzLnNjcmVlbi5sZWZ0ID0gYm94LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgLSBkLmNsaWVudExlZnQ7XG5cdFx0XHR0aGlzLnNjcmVlbi50b3AgPSBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IC0gZC5jbGllbnRUb3A7XG5cdFx0XHR0aGlzLnNjcmVlbi53aWR0aCA9IGJveC53aWR0aDtcblx0XHRcdHRoaXMuc2NyZWVuLmhlaWdodCA9IGJveC5oZWlnaHQ7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24gKCBldmVudCApIHtcblxuXHRcdGlmICggdHlwZW9mIHRoaXNbIGV2ZW50LnR5cGUgXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblxuXHRcdFx0dGhpc1sgZXZlbnQudHlwZSBdKCBldmVudCApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dmFyIGdldE1vdXNlT25TY3JlZW4gPSAoIGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGdldE1vdXNlT25TY3JlZW4oIHBhZ2VYLCBwYWdlWSApIHtcblxuXHRcdFx0dmVjdG9yLnNldChcblx0XHRcdFx0KCBwYWdlWCAtIF90aGlzLnNjcmVlbi5sZWZ0ICkgLyBfdGhpcy5zY3JlZW4ud2lkdGgsXG5cdFx0XHRcdCggcGFnZVkgLSBfdGhpcy5zY3JlZW4udG9wICkgLyBfdGhpcy5zY3JlZW4uaGVpZ2h0XG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdmVjdG9yO1xuXG5cdFx0fTtcblxuXHR9KCkgKTtcblxuXHR2YXIgZ2V0TW91c2VPbkNpcmNsZSA9ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gZ2V0TW91c2VPbkNpcmNsZSggcGFnZVgsIHBhZ2VZICkge1xuXG5cdFx0XHR2ZWN0b3Iuc2V0KFxuXHRcdFx0XHQoICggcGFnZVggLSBfdGhpcy5zY3JlZW4ud2lkdGggKiAwLjUgLSBfdGhpcy5zY3JlZW4ubGVmdCApIC8gKCBfdGhpcy5zY3JlZW4ud2lkdGggKiAwLjUgKSApLFxuXHRcdFx0XHQoICggX3RoaXMuc2NyZWVuLmhlaWdodCArIDIgKiAoIF90aGlzLnNjcmVlbi50b3AgLSBwYWdlWSApICkgLyBfdGhpcy5zY3JlZW4ud2lkdGggKSAvLyBzY3JlZW4ud2lkdGggaW50ZW50aW9uYWxcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB2ZWN0b3I7XG5cblx0XHR9O1xuXG5cdH0oKSApO1xuXG5cdHRoaXMucm90YXRlQ2FtZXJhID0gKCBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBheGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdHF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLFxuXHRcdFx0ZXllRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG9iamVjdFVwRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG1vdmVEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0YW5nbGU7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gcm90YXRlQ2FtZXJhKCkge1xuXG5cdFx0XHRtb3ZlRGlyZWN0aW9uLnNldCggX21vdmVDdXJyLnggLSBfbW92ZVByZXYueCwgX21vdmVDdXJyLnkgLSBfbW92ZVByZXYueSwgMCApO1xuXHRcdFx0YW5nbGUgPSBtb3ZlRGlyZWN0aW9uLmxlbmd0aCgpO1xuXG5cdFx0XHRpZiAoIGFuZ2xlICkge1xuXG5cdFx0XHRcdF9leWUuY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkuc3ViKCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdFx0XHRleWVEaXJlY3Rpb24uY29weSggX2V5ZSApLm5vcm1hbGl6ZSgpO1xuXHRcdFx0XHRvYmplY3RVcERpcmVjdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QudXAgKS5ub3JtYWxpemUoKTtcblx0XHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24uY3Jvc3NWZWN0b3JzKCBvYmplY3RVcERpcmVjdGlvbiwgZXllRGlyZWN0aW9uICkubm9ybWFsaXplKCk7XG5cblx0XHRcdFx0b2JqZWN0VXBEaXJlY3Rpb24uc2V0TGVuZ3RoKCBfbW92ZUN1cnIueSAtIF9tb3ZlUHJldi55ICk7XG5cdFx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uLnNldExlbmd0aCggX21vdmVDdXJyLnggLSBfbW92ZVByZXYueCApO1xuXG5cdFx0XHRcdG1vdmVEaXJlY3Rpb24uY29weSggb2JqZWN0VXBEaXJlY3Rpb24uYWRkKCBvYmplY3RTaWRld2F5c0RpcmVjdGlvbiApICk7XG5cblx0XHRcdFx0YXhpcy5jcm9zc1ZlY3RvcnMoIG1vdmVEaXJlY3Rpb24sIF9leWUgKS5ub3JtYWxpemUoKTtcblxuXHRcdFx0XHRhbmdsZSAqPSBfdGhpcy5yb3RhdGVTcGVlZDtcblx0XHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKCBheGlzLCBhbmdsZSApO1xuXG5cdFx0XHRcdF9leWUuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cdFx0XHRcdF90aGlzLm9iamVjdC51cC5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblxuXHRcdFx0XHRfbGFzdEF4aXMuY29weSggYXhpcyApO1xuXHRcdFx0XHRfbGFzdEFuZ2xlID0gYW5nbGU7XG5cblx0XHRcdH0gZWxzZSBpZiAoICEgX3RoaXMuc3RhdGljTW92aW5nICYmIF9sYXN0QW5nbGUgKSB7XG5cblx0XHRcdFx0X2xhc3RBbmdsZSAqPSBNYXRoLnNxcnQoIDEuMCAtIF90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yICk7XG5cdFx0XHRcdF9leWUuY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkuc3ViKCBfdGhpcy50YXJnZXQgKTtcblx0XHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKCBfbGFzdEF4aXMsIF9sYXN0QW5nbGUgKTtcblx0XHRcdFx0X2V5ZS5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblx0XHRcdFx0X3RoaXMub2JqZWN0LnVwLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXG5cdFx0XHR9XG5cblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblxuXHRcdH07XG5cblx0fSgpICk7XG5cblxuXHR0aGlzLnpvb21DYW1lcmEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgZmFjdG9yO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLlRPVUNIX1pPT01fUEFOICkge1xuXG5cdFx0XHRmYWN0b3IgPSBfdG91Y2hab29tRGlzdGFuY2VTdGFydCAvIF90b3VjaFpvb21EaXN0YW5jZUVuZDtcblx0XHRcdF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gX3RvdWNoWm9vbURpc3RhbmNlRW5kO1xuXHRcdFx0X2V5ZS5tdWx0aXBseVNjYWxhciggZmFjdG9yICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRmYWN0b3IgPSAxLjAgKyAoIF96b29tRW5kLnkgLSBfem9vbVN0YXJ0LnkgKSAqIF90aGlzLnpvb21TcGVlZDtcblxuXHRcdFx0aWYgKCBmYWN0b3IgIT09IDEuMCAmJiBmYWN0b3IgPiAwLjAgKSB7XG5cblx0XHRcdFx0X2V5ZS5tdWx0aXBseVNjYWxhciggZmFjdG9yICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBfdGhpcy5zdGF0aWNNb3ZpbmcgKSB7XG5cblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdF96b29tU3RhcnQueSArPSAoIF96b29tRW5kLnkgLSBfem9vbVN0YXJ0LnkgKSAqIHRoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3I7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucGFuQ2FtZXJhID0gKCBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBtb3VzZUNoYW5nZSA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdFx0XHRvYmplY3RVcCA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRwYW4gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHBhbkNhbWVyYSgpIHtcblxuXHRcdFx0bW91c2VDaGFuZ2UuY29weSggX3BhbkVuZCApLnN1YiggX3BhblN0YXJ0ICk7XG5cblx0XHRcdGlmICggbW91c2VDaGFuZ2UubGVuZ3RoU3EoKSApIHtcblxuXHRcdFx0XHRtb3VzZUNoYW5nZS5tdWx0aXBseVNjYWxhciggX2V5ZS5sZW5ndGgoKSAqIF90aGlzLnBhblNwZWVkICk7XG5cblx0XHRcdFx0cGFuLmNvcHkoIF9leWUgKS5jcm9zcyggX3RoaXMub2JqZWN0LnVwICkuc2V0TGVuZ3RoKCBtb3VzZUNoYW5nZS54ICk7XG5cdFx0XHRcdHBhbi5hZGQoIG9iamVjdFVwLmNvcHkoIF90aGlzLm9iamVjdC51cCApLnNldExlbmd0aCggbW91c2VDaGFuZ2UueSApICk7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZCggcGFuICk7XG5cdFx0XHRcdF90aGlzLnRhcmdldC5hZGQoIHBhbiApO1xuXG5cdFx0XHRcdGlmICggX3RoaXMuc3RhdGljTW92aW5nICkge1xuXG5cdFx0XHRcdFx0X3BhblN0YXJ0LmNvcHkoIF9wYW5FbmQgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0X3BhblN0YXJ0LmFkZCggbW91c2VDaGFuZ2Uuc3ViVmVjdG9ycyggX3BhbkVuZCwgX3BhblN0YXJ0ICkubXVsdGlwbHlTY2FsYXIoIF90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yICkgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9KCkgKTtcblxuXHR0aGlzLmNoZWNrRGlzdGFuY2VzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCAhIF90aGlzLm5vWm9vbSB8fCAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRpZiAoIF9leWUubGVuZ3RoU3EoKSA+IF90aGlzLm1heERpc3RhbmNlICogX3RoaXMubWF4RGlzdGFuY2UgKSB7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZFZlY3RvcnMoIF90aGlzLnRhcmdldCwgX2V5ZS5zZXRMZW5ndGgoIF90aGlzLm1heERpc3RhbmNlICkgKTtcblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggX2V5ZS5sZW5ndGhTcSgpIDwgX3RoaXMubWluRGlzdGFuY2UgKiBfdGhpcy5taW5EaXN0YW5jZSApIHtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllLnNldExlbmd0aCggX3RoaXMubWluRGlzdGFuY2UgKSApO1xuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X2V5ZS5zdWJWZWN0b3JzKCBfdGhpcy5vYmplY3QucG9zaXRpb24sIF90aGlzLnRhcmdldCApO1xuXG5cdFx0aWYgKCAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfdGhpcy5yb3RhdGVDYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdGlmICggISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF90aGlzLnpvb21DYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdGlmICggISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3RoaXMucGFuQ2FtZXJhKCk7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllICk7XG5cblx0XHRfdGhpcy5jaGVja0Rpc3RhbmNlcygpO1xuXG5cdFx0X3RoaXMub2JqZWN0Lmxvb2tBdCggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRpZiAoIGxhc3RQb3NpdGlvbi5kaXN0YW5jZVRvU3F1YXJlZCggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkgPiBFUFMgKSB7XG5cblx0XHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cblx0XHRcdGxhc3RQb3NpdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXHRcdF9wcmV2U3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0X3RoaXMudGFyZ2V0LmNvcHkoIF90aGlzLnRhcmdldDAgKTtcblx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uY29weSggX3RoaXMucG9zaXRpb24wICk7XG5cdFx0X3RoaXMub2JqZWN0LnVwLmNvcHkoIF90aGlzLnVwMCApO1xuXG5cdFx0X2V5ZS5zdWJWZWN0b3JzKCBfdGhpcy5vYmplY3QucG9zaXRpb24sIF90aGlzLnRhcmdldCApO1xuXG5cdFx0X3RoaXMub2JqZWN0Lmxvb2tBdCggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXG5cdFx0bGFzdFBvc2l0aW9uLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApO1xuXG5cdH07XG5cblx0Ly8gbGlzdGVuZXJzXG5cblx0ZnVuY3Rpb24ga2V5ZG93biggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biApO1xuXG5cdFx0X3ByZXZTdGF0ZSA9IF9zdGF0ZTtcblxuXHRcdGlmICggX3N0YXRlICE9PSBTVEFURS5OT05FICkge1xuXG5cdFx0XHRyZXR1cm47XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5ST1RBVEUgXSAmJiAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5ST1RBVEU7XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5aT09NIF0gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlpPT007XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5QQU4gXSAmJiAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5QQU47XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGtleXVwKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRfc3RhdGUgPSBfcHJldlN0YXRlO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2Vkb3duKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLk5PTkUgKSB7XG5cblx0XHRcdF9zdGF0ZSA9IGV2ZW50LmJ1dHRvbjtcblxuXHRcdH1cblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5ST1RBVEUgJiYgISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlpPT00gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF96b29tU3RhcnQuY29weSggZ2V0TW91c2VPblNjcmVlbiggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblx0XHRcdF96b29tRW5kLmNvcHkoIF96b29tU3RhcnQgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUEFOICYmICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF9wYW5TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXHRcdFx0X3BhbkVuZC5jb3B5KCBfcGFuU3RhcnQgKTtcblxuXHRcdH1cblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUsIGZhbHNlICk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBtb3VzZXVwLCBmYWxzZSApO1xuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggc3RhcnRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZW1vdmUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUk9UQVRFICYmICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5aT09NICYmICEgX3RoaXMubm9ab29tICkge1xuXG5cdFx0XHRfem9vbUVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5QQU4gJiYgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3BhbkVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZXVwKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUgKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG1vdXNldXAgKTtcblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZXdoZWVsKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0c3dpdGNoICggZXZlbnQuZGVsdGFNb2RlICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpvb20gaW4gcGFnZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDI1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuXHRcdFx0Y2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBab29tIGluIGxpbmVzXG5cdFx0XHRcdF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAxO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Ly8gdW5kZWZpbmVkLCAwLCBhc3N1bWUgcGl4ZWxzXG5cdFx0XHRcdF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAwMDI1O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIHN0YXJ0RXZlbnQgKTtcblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaHN0YXJ0KCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKCBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9ST1RBVEU7XG5cdFx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSApICk7XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IC8vIDIgb3IgbW9yZVxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9aT09NX1BBTjtcblx0XHRcdFx0dmFyIGR4ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYO1xuXHRcdFx0XHR2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XG5cdFx0XHRcdF90b3VjaFpvb21EaXN0YW5jZUVuZCA9IF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRcdHZhciB4ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVggKSAvIDI7XG5cdFx0XHRcdHZhciB5ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVkgKSAvIDI7XG5cdFx0XHRcdF9wYW5TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCB4LCB5ICkgKTtcblx0XHRcdFx0X3BhbkVuZC5jb3B5KCBfcGFuU3RhcnQgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBzdGFydEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNobW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoICkge1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICkgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IC8vIDIgb3IgbW9yZVxuXHRcdFx0XHR2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG5cdFx0XHRcdHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcblx0XHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlRW5kID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRcdHZhciB4ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVggKSAvIDI7XG5cdFx0XHRcdHZhciB5ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVkgKSAvIDI7XG5cdFx0XHRcdF9wYW5FbmQuY29weSggZ2V0TW91c2VPblNjcmVlbiggeCwgeSApICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaGVuZCggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0c3dpdGNoICggZXZlbnQudG91Y2hlcy5sZW5ndGggKSB7XG5cblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuXHRcdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKSApO1xuXHRcdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggZW5kRXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gY29udGV4dG1lbnUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0fVxuXG5cdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIGNvbnRleHRtZW51LCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgbW91c2Vkb3duLCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBtb3VzZXdoZWVsLCBmYWxzZSApO1xuXG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgdG91Y2hlbmQsIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlICk7XG5cblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlLCBmYWxzZSApO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgbW91c2V1cCwgZmFsc2UgKTtcblxuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGtleWRvd24sIGZhbHNlICk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGtleXVwLCBmYWxzZSApO1xuXG5cdH07XG5cblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIGNvbnRleHRtZW51LCBmYWxzZSApOyBcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBtb3VzZWRvd24sIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBtb3VzZXdoZWVsLCBmYWxzZSApO1xuXG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoc3RhcnQsIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlICk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGtleXVwLCBmYWxzZSApO1xuXG5cdHRoaXMuaGFuZGxlUmVzaXplKCk7XG5cblx0Ly8gZm9yY2UgYW4gdXBkYXRlIGF0IHN0YXJ0XG5cdHRoaXMudXBkYXRlKCk7XG5cbn1cblxuVHJhY2tiYWxsQ29udHJvbHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVEhSRUUuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSApO1xuVHJhY2tiYWxsQ29udHJvbHMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVHJhY2tiYWxsQ29udHJvbHM7XG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcbmltcG9ydCB7Q2FtZXJhLCBTdGFuZGFyZFZpZXd9ICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0NhbWVyYUNvbnRyb2xzfSAgICAgICAgIGZyb20gJ0NhbWVyYUNvbnRyb2xzJ1xyXG5pbXBvcnQge0V2ZW50TWFuYWdlcn0gICAgICAgICAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtHcmFwaGljcywgT2JqZWN0TmFtZXN9ICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXJ9ICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0ZXJpYWxzfSAgICAgICAgICAgICAgZnJvbSAnTWF0ZXJpYWxzJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9WaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBWaWV3ZXIge1xyXG5cclxuICAgIF9uYW1lICAgICAgICAgICAgICAgICAgIDogc3RyaW5nICAgICAgICAgICAgICAgICAgICA9ICcnO1xyXG4gICAgX2V2ZW50TWFuYWdlciAgICAgICAgICAgOiBFdmVudE1hbmFnZXIgICAgICAgICAgICAgID0gbnVsbDtcclxuICAgIF9sb2dnZXIgICAgICAgICAgICAgICAgIDogTG9nZ2VyICAgICAgICAgICAgICAgICAgICA9IG51bGw7XHJcbiAgICBcclxuICAgIF9zY2VuZSAgICAgICAgICAgICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgICA9IG51bGw7XHJcbiAgICBfcm9vdCAgICAgICAgICAgICAgICAgICA6IFRIUkVFLk9iamVjdDNEICAgICAgICAgICAgPSBudWxsOyAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgX3JlbmRlcmVyICAgICAgICAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlcmVyICAgICAgID0gbnVsbDs7XHJcbiAgICBfY2FudmFzICAgICAgICAgICAgICAgICA6IEhUTUxDYW52YXNFbGVtZW50ICAgICAgICAgPSBudWxsO1xyXG4gICAgX3dpZHRoICAgICAgICAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgID0gMDtcclxuICAgIF9oZWlnaHQgICAgICAgICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgICA9IDA7XHJcblxyXG4gICAgX2NhbWVyYSAgICAgICAgICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSAgID0gbnVsbDtcclxuXHJcbiAgICBfY29udHJvbHMgICAgICAgICAgICAgICA6IFRyYWNrYmFsbENvbnRyb2xzICAgICAgICAgPSBudWxsO1xyXG4gICAgX2NhbWVyYUNvbnRyb2xzICAgICAgICAgOiBDYW1lcmFDb250cm9scyAgICAgICAgICAgID0gbnVsbDtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVmlld2VyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBuYW1lIFZpZXdlciBuYW1lLlxyXG4gICAgICogQHBhcmFtIGVsZW1lbnRUb0JpbmRUbyBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBtb2RlbENhbnZhc0lkIDogc3RyaW5nKSB7IFxyXG5cclxuICAgICAgICB0aGlzLl9uYW1lICAgICAgICAgPSBuYW1lOyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcigpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciAgICAgICA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IEdyYXBoaWNzLmluaXRpYWxpemVDYW52YXMobW9kZWxDYW52YXNJZCk7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggID0gdGhpcy5fY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBWaWV3ZXIgbmFtZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG5hbWUoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBWaWV3ZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGdldCBzY2VuZSgpIDogVEhSRUUuU2NlbmUge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBWaWV3ZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHNldCBzY2VuZSh2YWx1ZTogVEhSRUUuU2NlbmUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fc2NlbmUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZXQgY2FtZXJhKCkgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYXtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBzZXQgY2FtZXJhKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLm5hbWUgPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSW5wdXRDb250cm9scygpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhQ29udHJvbHMpXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzLnN5bmNocm9uaXplQ2FtZXJhU2V0dGluZ3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgYWN0aXZlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXQgbW9kZWwoKSA6IFRIUkVFLkdyb3VwIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBFdmVudE1hbmFnZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCBldmVudE1hbmFnZXIoKSA6IEV2ZW50TWFuYWdlciB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50TWFuYWdlcjtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgYWN0aXZlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIE5ldyBtb2RlbCB0byBhY3RpdmF0ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TW9kZWwodmFsdWUgOiBUSFJFRS5Hcm91cCkge1xyXG5cclxuICAgICAgICAvLyBOLkIuIFRoaXMgaXMgYSBtZXRob2Qgbm90IGEgcHJvcGVydHkgc28gYSBzdWIgY2xhc3MgY2FuIG92ZXJyaWRlLlxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvNDQ2NVxyXG5cclxuICAgICAgICBHcmFwaGljcy5yZW1vdmVPYmplY3RDaGlsZHJlbih0aGlzLl9yb290LCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSBjYW52YXMgYWZlciBhIHdpbmRvdyByZXNpemVcclxuICAgICAqL1xyXG4gICAgZ2V0IGFzcGVjdFJhdGlvKCkgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgYXNwZWN0UmF0aW8gOiBudW1iZXIgPSB0aGlzLl93aWR0aCAvIHRoaXMuX2hlaWdodDtcclxuICAgICAgICByZXR1cm4gYXNwZWN0UmF0aW87XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgRE9NIElkIG9mIHRoZSBWaWV3ZXIgcGFyZW50IGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRhaW5lcklkKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBwYXJlbnRFbGVtZW50IDogSFRNTEVsZW1lbnQgPSB0aGlzLl9jYW52YXMucGFyZW50RWxlbWVudDtcclxuICAgICAgICByZXR1cm4gcGFyZW50RWxlbWVudC5pZDtcclxuICAgIH0gXHJcbiAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdGVzdCBzcGhlcmUgdG8gYSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCAyKTtcclxuICAgICAgICBtZXNoLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9yb290LmFkZChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgU2NlbmVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVNjZW5lICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUm9vdCgpO1xyXG5cclxuICAgICAgICB0aGlzLnBvcHVsYXRlU2NlbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIFdlYkdMIHJlbmRlcmVyLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUmVuZGVyZXIgKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcclxuXHJcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXIgIDogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhbnZhcyAgICAgICAgICAgICAgICAgIDogdGhpcy5fY2FudmFzLFxyXG4gICAgICAgICAgICBhbnRpYWxpYXMgICAgICAgICAgICAgICA6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5hdXRvQ2xlYXIgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDApO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDYW1lcmEoKSB7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3Q2FtZXJhKFN0YW5kYXJkVmlldy5Gcm9udCwgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5tb2RlbCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBsaWdodGluZyB0byB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nKCkge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDQwNDA0MCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhDMEMwOTApO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCgtMTAwLCAtNTAsIDEwMCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDIgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEMwQzA5MCk7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDIucG9zaXRpb24uc2V0KDEwMCwgNTAsIC0xMDApO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIHVzZXIgaW5wdXQgY29udHJvbHMgKFRyYWNrYmFsbClcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzID0gbmV3IFRyYWNrYmFsbENvbnRyb2xzKHRoaXMuY2FtZXJhLCB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gTi5CLiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDMyNTA5NS90aHJlZWpzLWNhbWVyYS1sb29rYXQtaGFzLW5vLWVmZmVjdC1pcy10aGVyZS1zb21ldGhpbmctaW0tZG9pbmctd3JvbmdcclxuICAgICAgICB0aGlzLl9jb250cm9scy5wb3NpdGlvbjAuY29weSh0aGlzLmNhbWVyYS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdCh0aGlzLl9yb290KTtcclxuICAgICAgICB0aGlzLl9jb250cm9scy50YXJnZXQuY29weShib3VuZGluZ0JveC5nZXRDZW50ZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSB1c2VyIGlucHV0IGNvbnRyb2xzIChTZXR0aW5ncylcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzID0gbmV3IENhbWVyYUNvbnRyb2xzKHRoaXMpOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIGtleWJvYXJkIHNob3J0Y3V0cy5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUtleWJvYXJkU2hvcnRjdXRzKCkge1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCA6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvamF2YXNjcmlwdC9qYXZhc2NyaXB0LWtleWNvZGVzL1xyXG4gICAgICAgICAgICBsZXQga2V5Q29kZSA6IG51bWJlciA9IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNzA6ICAgICAgICAgICAgICAgIC8vIEYgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYSA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdDYW1lcmEoU3RhbmRhcmRWaWV3LkZyb250LCB0aGlzLmFzcGVjdFJhdGlvLCB0aGlzLm1vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBzY2VuZSB3aXRoIHRoZSBiYXNlIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDYW1lcmEoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZygpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplS2V5Ym9hcmRTaG9ydGN1dHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZVdpbmRvdygpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplV2luZG93LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2NlbmVcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc2NlbmUgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBjbGVhckFsbEFzc2VzdHMoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4odGhpcy5fcm9vdCwgZmFsc2UpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIHJvb3Qgb2JqZWN0IGluIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVSb290KCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5uYW1lID0gT2JqZWN0TmFtZXMuUm9vdDtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLl9yb290KTtcclxuICAgIH1cclxuXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIENhbWVyYVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBTZXRzIHRoZSB2aWV3IGNhbWVyYSBwcm9wZXJ0aWVzIHRvIHRoZSBnaXZlbiBzZXR0aW5ncy5cclxuICAgICAqIEBwYXJhbSB7U3RhbmRhcmRWaWV3fSB2aWV3IENhbWVyYSBzZXR0aW5ncyB0byBhcHBseS5cclxuICAgICAqL1xyXG4gICAgc2V0Q2FtZXJhVG9TdGFuZGFyZFZpZXcodmlldyA6IFN0YW5kYXJkVmlldykge1xyXG5cclxuICAgICAgICBsZXQgc3RhbmRhcmRWaWV3Q2FtZXJhID0gQ2FtZXJhLmdldFN0YW5kYXJkVmlld0NhbWVyYSh2aWV3LCB0aGlzLmFzcGVjdFJhdGlvLCB0aGlzLm1vZGVsKTtcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IHN0YW5kYXJkVmlld0NhbWVyYTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhQ29udHJvbHMuc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncyh2aWV3KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBGaXRzIHRoZSBhY3RpdmUgdmlldy5cclxuICAgICAqL1xyXG4gICAgZml0VmlldygpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBDYW1lcmEuZ2V0Rml0Vmlld0NhbWVyYSAoQ2FtZXJhLmdldFNjZW5lQ2FtZXJhKHRoaXMuY2FtZXJhLCB0aGlzLmFzcGVjdFJhdGlvKSwgdGhpcy5tb2RlbCk7XHJcbiAgICB9XHJcbiAgICAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFdpbmRvdyBSZXNpemVcclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgc2NlbmUgY2FtZXJhIHRvIG1hdGNoIHRoZSBuZXcgd2luZG93IHNpemVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQ2FtZXJhT25XaW5kb3dSZXNpemUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlcyB0aGUgV2ViR0wgcHJvY2Vzc2luZyBmb3IgYSBET00gd2luZG93ICdyZXNpemUnIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIHJlc2l6ZURpc3BsYXlXZWJHTCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSAgdGhpcy5fY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLmhhbmRsZVJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FtZXJhT25XaW5kb3dSZXNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgYSB3aW5kb3cgcmVzaXplIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uUmVzaXplV2luZG93ICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNpemVEaXNwbGF5V2ViR0woKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gUmVuZGVyIExvb3BcclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgdGhlIFdlYkdMIHJlbmRlciBvZiB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgcmVuZGVyV2ViR0woKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluIERPTSByZW5kZXIgbG9vcFxyXG4gICAgICovXHJcbiAgICBhbmltYXRlKCkge1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyV2ViR0woKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcblxyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IHRlc3RNb2RlbENvbG9yID0gJyM1NThkZTgnO1xyXG5cclxuZXhwb3J0IGVudW0gVGVzdE1vZGVsIHtcclxuICAgIFRvcnVzLFxyXG4gICAgU3BoZXJlLFxyXG4gICAgU2xvcGVkUGxhbmUsXHJcbiAgICBCb3gsXHJcbiAgICBDaGVja2VyYm9hcmRcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3RNb2RlbExvYWRlciB7XHJcblxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBUZXN0TW9kZWxMb2FkZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIExvYWRzIGEgcGFyYW1ldHJpYyB0ZXN0IG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHtWaWV3ZXJ9IHZpZXdlciBWaWV3ZXIgaW5zdGFuY2UgdG8gcmVjZWl2ZSBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB7VGVzdE1vZGVsfSBtb2RlbFR5cGUgTW9kZWwgdHlwZSAoQm94LCBTcGhlcmUsIGV0Yy4pXHJcbiAgICAgKi9cclxuICAgIGxvYWRUZXN0TW9kZWwgKHZpZXdlciA6IFZpZXdlciwgbW9kZWxUeXBlIDogVGVzdE1vZGVsKSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobW9kZWxUeXBlKXtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLlRvcnVzOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVG9ydXNNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5TcGhlcmU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTcGhlcmVNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5TbG9wZWRQbGFuZTogXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTbG9wZWRQbGFuZU1vZGVsKHZpZXdlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLkJveDpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEJveE1vZGVsKHZpZXdlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLkNoZWNrZXJib2FyZDpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENoZWNrZXJib2FyZE1vZGVsKHZpZXdlcik7ICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHRvcnVzIHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkVG9ydXNNb2RlbCh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdG9ydXNTY2VuZSA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAgICAgICAvLyBTZXR1cCBzb21lIGdlb21ldHJpZXNcclxuICAgICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNLbm90R2VvbWV0cnkoMSwgMC4zLCAxMjgsIDY0KTtcclxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSk7XHJcblxyXG4gICAgICAgIGxldCBjb3VudCA9IDUwO1xyXG4gICAgICAgIGxldCBzY2FsZSA9IDU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpICogMi4wICogTWF0aC5QSTtcclxuICAgICAgICAgICAgbGV0IHogPSAoTWF0aC5yYW5kb20oKSAqIDIuMCkgLSAxLjA7XHJcbiAgICAgICAgICAgIGxldCB6U2NhbGUgPSBNYXRoLnNxcnQoMS4wIC0geiAqIHopICogc2NhbGU7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIG1lc2gucG9zaXRpb24uc2V0KFxyXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MocikgKiB6U2NhbGUsXHJcbiAgICAgICAgICAgICAgICBNYXRoLnNpbihyKSAqIHpTY2FsZSxcclxuICAgICAgICAgICAgICAgIHogKiBzY2FsZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBtZXNoLnJvdGF0aW9uLnNldChNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKTtcclxuXHJcbiAgICAgICAgICAgIG1lc2gubmFtZSA9ICdUb3J1cyBDb21wb25lbnQnO1xyXG4gICAgICAgICAgICB0b3J1c1NjZW5lLmFkZChtZXNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsICh0b3J1c1NjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSB0ZXN0IHNwaGVyZSB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRTcGhlcmVNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCByYWRpdXMgPSAyOyAgICBcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVNwaGVyZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHJhZGl1cywgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pKVxyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHRlc3QgYm94IHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZEJveE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoICA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBoZWlnaHQgPSAyOyAgICBcclxuICAgICAgICBsZXQgZGVwdGggID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKG5ldyBUSFJFRS5WZWN0b3IzLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pKVxyXG5cclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBzbG9wZWQgcGxhbmUgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkU2xvcGVkUGxhbmVNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCAgPSAyOyAgICBcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVQbGFuZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHdpZHRoLCBoZWlnaHQsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSkgICAgICAgXHJcbiAgICAgICAgbWVzaC5yb3RhdGVYKE1hdGguUEkgLyA0KTtcclxuICAgICAgICBcclxuICAgICAgICBtZXNoLm5hbWUgPSAnU2xvcGVkUGxhbmUnO1xyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHRlc3QgbW9kZWwgY29uc2lzdGluZyBvZiBhIHRpZXJlZCBjaGVja2VyYm9hcmRcclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkQ2hlY2tlcmJvYXJkTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBncmlkTGVuZ3RoICAgICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ICAgIDogbnVtYmVyID0gMS4wOyAgICAgICAgXHJcbiAgICAgICAgbGV0IGdyaWREaXZpc2lvbnMgIDogbnVtYmVyID0gMjtcclxuICAgICAgICBsZXQgdG90YWxDZWxscyAgICAgOiBudW1iZXIgPSBNYXRoLnBvdyhncmlkRGl2aXNpb25zLCAyKTtcclxuXHJcbiAgICAgICAgbGV0IGNlbGxCYXNlICAgICAgIDogbnVtYmVyID0gZ3JpZExlbmd0aCAvIGdyaWREaXZpc2lvbnM7XHJcbiAgICAgICAgbGV0IGNlbGxIZWlnaHQgICAgIDogbnVtYmVyID0gdG90YWxIZWlnaHQgLyB0b3RhbENlbGxzO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luWCA6IG51bWJlciA9IC0oY2VsbEJhc2UgKiAoZ3JpZERpdmlzaW9ucyAvIDIpKSArIChjZWxsQmFzZSAvIDIpO1xyXG4gICAgICAgIGxldCBvcmlnaW5ZIDogbnVtYmVyID0gb3JpZ2luWDtcclxuICAgICAgICBsZXQgb3JpZ2luWiA6IG51bWJlciA9IC1jZWxsSGVpZ2h0IC8gMjtcclxuICAgICAgICBsZXQgb3JpZ2luICA6IFRIUkVFLlZlY3RvcjMgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YLCBvcmlnaW5ZLCBvcmlnaW5aKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYmFzZUNvbG9yICAgICAgOiBudW1iZXIgPSAweDAwNzA3MDtcclxuICAgICAgICBsZXQgY29sb3JEZWx0YSAgICAgOiBudW1iZXIgPSAoMjU2IC8gdG90YWxDZWxscykgKiBNYXRoLnBvdygyNTYsIDIpO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXAgICAgICA6IFRIUkVFLkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgbGV0IGNlbGxPcmlnaW4gOiBUSFJFRS5WZWN0b3IzID0gb3JpZ2luLmNsb25lKCk7XHJcbiAgICAgICAgbGV0IGNlbGxDb2xvciAgOiBudW1iZXIgPSBiYXNlQ29sb3I7XHJcbiAgICAgICAgZm9yIChsZXQgaVJvdyA6IG51bWJlciA9IDA7IGlSb3cgPCBncmlkRGl2aXNpb25zOyBpUm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaUNvbHVtbiA6IG51bWJlciA9IDA7IGlDb2x1bW4gPCBncmlkRGl2aXNpb25zOyBpQ29sdW1uKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3IgOiBjZWxsQ29sb3J9KTtcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsIDogVEhSRUUuTWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJveE1lc2goY2VsbE9yaWdpbiwgY2VsbEJhc2UsIGNlbGxCYXNlLCBjZWxsSGVpZ2h0LCBjZWxsTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuYWRkIChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjZWxsT3JpZ2luLnggKz0gY2VsbEJhc2U7XHJcbiAgICAgICAgICAgICAgICBjZWxsT3JpZ2luLnogKz0gY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGNlbGxDb2xvciAgICArPSBjb2xvckRlbHRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2VsbE9yaWdpbi54ID0gb3JpZ2luLng7XHJcbiAgICAgICAgY2VsbE9yaWdpbi55ICs9IGNlbGxCYXNlO1xyXG4gICAgICAgIH0gICAgICAgXHJcblxyXG4gICAgICAgIGdyb3VwLm5hbWUgPSAnQ2hlY2tlcmJvYXJkJztcclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwoZ3JvdXApO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuXHJcbmltcG9ydCB7U3RhbmRhcmRWaWV3fSAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge09CSkxvYWRlcn0gICAgICAgICAgICAgICAgICBmcm9tIFwiT0JKTG9hZGVyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VGVzdE1vZGVsTG9hZGVyLCBUZXN0TW9kZWx9IGZyb20gJ1Rlc3RNb2RlbExvYWRlcidcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuY29uc3QgdGVzdE1vZGVsQ29sb3IgPSAnIzU1OGRlOCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZGVyIHtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIExvYWRlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIG1vZGVsIGJhc2VkIG9uIHRoZSBtb2RlbCBuYW1lIGFuZCBwYXRoIGVtYmVkZGVkIGluIHRoZSBIVE1MIHBhZ2UuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi8gICAgXHJcbiAgICBsb2FkT0JKTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWxOYW1lRWxlbWVudCA6IEhUTUxFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RlbE5hbWUnKTtcclxuICAgICAgICBsZXQgbW9kZWxQYXRoRWxlbWVudCA6IEhUTUxFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RlbFBhdGgnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IG1vZGVsTmFtZSAgICA6IHN0cmluZyA9IG1vZGVsTmFtZUVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgbGV0IG1vZGVsUGF0aCAgICA6IHN0cmluZyA9IG1vZGVsUGF0aEVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgbGV0IGZpbGVOYW1lICAgICA6IHN0cmluZyA9IG1vZGVsUGF0aCArIG1vZGVsTmFtZTtcclxuXHJcbiAgICAgICAgbGV0IG1hbmFnZXIgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKTtcclxuICAgICAgICBsZXQgbG9hZGVyICA9IG5ldyBPQkpMb2FkZXIobWFuYWdlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoeGhyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoeGhyLmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGVyY2VudENvbXBsZXRlLnRvRml4ZWQoMikgKyAnJSBkb3dubG9hZGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgb25FcnJvciA9IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICB9OyAgICAgICAgXHJcblxyXG4gICAgICAgIGxvYWRlci5sb2FkKGZpbGVOYW1lLCBmdW5jdGlvbiAoZ3JvdXAgOiBUSFJFRS5Hcm91cCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmlld2VyLnNldE1vZGVsKGdyb3VwKTtcclxuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgcGFyYW1ldHJpYyB0ZXN0IG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIG1vZGVsVHlwZSBUZXN0IG1vZGVsIHR5cGUgKFNwaGVyLCBCb3gsIGV0Yy4pXHJcbiAgICAgKi8gICAgXHJcbiAgICBsb2FkUGFyYW1ldHJpY1Rlc3RNb2RlbCAodmlld2VyIDogVmlld2VyLCBtb2RlbFR5cGUgOiBUZXN0TW9kZWwpIHtcclxuXHJcbiAgICAgICAgbGV0IHRlc3RMb2FkZXIgPSBuZXcgVGVzdE1vZGVsTG9hZGVyKCk7XHJcbiAgICAgICAgdGVzdExvYWRlci5sb2FkVGVzdE1vZGVsKHZpZXdlciwgbW9kZWxUeXBlKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge01lc2hWaWV3ZXJ9ICAgICAgICAgICAgICAgICBmcm9tIFwiTWVzaFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBNZXNoVmlld2VyIFNldHRpbmdzXHJcbiAqL1xyXG5jbGFzcyBNZXNoVmlld2VyU2V0dGluZ3Mge1xyXG5cclxuICAgIHNhdmVSZWxpZWYgOiAoKSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihzYXZlUmVsaWVmIDogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zYXZlUmVsaWVmID0gc2F2ZVJlbGllZjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1lc2hWaWV3ZXIgVUkgQ29udHJvbHMuXHJcbiAqLyAgICBcclxuZXhwb3J0IGNsYXNzIE1lc2hWaWV3ZXJDb250cm9scyB7XHJcblxyXG4gICAgX21lc2hWaWV3ZXIgICAgICAgICAgOiBNZXNoVmlld2VyOyAgICAgICAgICAgICAgICAgICAgIC8vIGFzc29jaWF0ZWQgdmlld2VyXHJcbiAgICBfbWVzaFZpZXdlclNldHRpbmdzICA6IE1lc2hWaWV3ZXJTZXR0aW5nczsgICAgICAgICAgICAgLy8gVUkgc2V0dGluZ3NcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1lc2hWaWV3ZXJDb250cm9sc1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1lc2hWaWV3ZXIgOiBNZXNoVmlld2VyKSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fbWVzaFZpZXdlciA9IG1lc2hWaWV3ZXI7XHJcblxyXG4gICAgICAgIC8vIFVJIENvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ29udHJvbHMoKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4gICAgLyoqXHJcbiAgICAgKiBTYXZlcyB0aGUgcmVsaWVmIHRvIGEgZGlzayBmaWxlLlxyXG4gICAgICovXHJcbiAgICBzYXZlUmVsaWVmKCkgOiB2b2lkIHsgXHJcblxyXG4gICAgICAgIHRoaXMuX21lc2hWaWV3ZXIuc2F2ZVJlbGllZigpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHZpZXcgc2V0dGluZ3MgdGhhdCBhcmUgY29udHJvbGxhYmxlIGJ5IHRoZSB1c2VyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgbGV0IHNjb3BlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5fbWVzaFZpZXdlclNldHRpbmdzID0gbmV3IE1lc2hWaWV3ZXJTZXR0aW5ncyh0aGlzLnNhdmVSZWxpZWYuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIGxldCBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgbWVudURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuX21lc2hWaWV3ZXIuY29udGFpbmVySWQpO1xyXG4gICAgICAgIG1lbnVEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1lc2hWaWV3ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICBsZXQgbWVzaFZpZXdlck9wdGlvbnMgPSBndWkuYWRkRm9sZGVyKCdNZXNoVmlld2VyIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gU2F2ZSBSZWxpZWZcclxuICAgICAgICBsZXQgY29udHJvbFNhdmVSZWxpZWYgPSBtZXNoVmlld2VyT3B0aW9ucy5hZGQodGhpcy5fbWVzaFZpZXdlclNldHRpbmdzLCAnc2F2ZVJlbGllZicpLm5hbWUoJ1NhdmUgUmVsaWVmJyk7XHJcblxyXG4gICAgICAgIG1lc2hWaWV3ZXJPcHRpb25zLm9wZW4oKTtcclxuICAgIH0gICAgXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFxuLy8gQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL0FuZHJld1JheUNvZGUvdGhyZWUtb2JqLWV4cG9ydGVyL2Jsb2IvbWFzdGVyL2luZGV4LmpzICAgICAgIC8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJ1xuXG5pbXBvcnQgeyBTZXJ2aWNlcyB9IGZyb20gJ1NlcnZpY2VzJ1xuaW1wb3J0IHsgU3RvcFdhdGNoIH0gZnJvbSAnU3RvcFdhdGNoJ1xuXG5leHBvcnQgY2xhc3MgT0JKRXhwb3J0ZXIge1xuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdH1cblxuXHRwYXJzZSAoIG9iamVjdCApIHtcblxuXHRcdHZhciBvdXRwdXQgPSAnJztcblxuXHRcdHZhciBpbmRleFZlcnRleCA9IDA7XG5cdFx0dmFyIGluZGV4VmVydGV4VXZzID0gMDtcblx0XHR2YXIgaW5kZXhOb3JtYWxzID0gMDtcblxuXHRcdHZhciB2ZXJ0ZXggPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXHRcdHZhciBub3JtYWwgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXHRcdHZhciB1diA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHR2YXIgaSwgaiwgaywgbCwgbSwgZmFjZSA9IFtdO1xuXG5cdFx0dmFyIHBhcnNlTWVzaCA9IGZ1bmN0aW9uICggbWVzaCApIHtcblxuXHRcdFx0dmFyIG5iVmVydGV4ID0gMDtcblx0XHRcdHZhciBuYk5vcm1hbHMgPSAwO1xuXHRcdFx0dmFyIG5iVmVydGV4VXZzID0gMDtcblxuXHRcdFx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcblxuXHRcdFx0dmFyIG5vcm1hbE1hdHJpeFdvcmxkID0gbmV3IFRIUkVFLk1hdHJpeDMoKTtcblxuXHRcdFx0aWYgKCBnZW9tZXRyeSBpbnN0YW5jZW9mIFRIUkVFLkdlb21ldHJ5ICkge1xuXG5cdFx0XHRcdGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCkuc2V0RnJvbU9iamVjdCggbWVzaCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggZ2VvbWV0cnkgaW5zdGFuY2VvZiBUSFJFRS5CdWZmZXJHZW9tZXRyeSApIHtcblxuXHRcdFx0XHQvLyBzaG9ydGN1dHNcblx0XHRcdFx0dmFyIHZlcnRpY2VzID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCAncG9zaXRpb24nICk7XG5cdFx0XHRcdHZhciBub3JtYWxzID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCAnbm9ybWFsJyApO1xuXHRcdFx0XHR2YXIgdXZzID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCAndXYnICk7XG5cdFx0XHRcdHZhciBpbmRpY2VzID0gZ2VvbWV0cnkuZ2V0SW5kZXgoKTtcblxuXHRcdFx0XHQvLyBuYW1lIG9mIHRoZSBtZXNoIG9iamVjdFxuXHRcdFx0XHRvdXRwdXQgKz0gJ28gJyArIG1lc2gubmFtZSArICdcXG4nO1xuXG5cdFx0XHRcdC8vIG5hbWUgb2YgdGhlIG1lc2ggbWF0ZXJpYWxcblx0XHRcdFx0aWYgKCBtZXNoLm1hdGVyaWFsICYmIG1lc2gubWF0ZXJpYWwubmFtZSApIHtcblx0XHRcdFx0XHRvdXRwdXQgKz0gJ3VzZW10bCAnICsgbWVzaC5tYXRlcmlhbC5uYW1lICsgJ1xcbic7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB2ZXJ0aWNlc1xuXG5cdFx0XHRcdGlmKCB2ZXJ0aWNlcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdFx0Zm9yICggaSA9IDAsIGwgPSB2ZXJ0aWNlcy5jb3VudDsgaSA8IGw7IGkgKyssIG5iVmVydGV4KysgKSB7XG5cblx0XHRcdFx0XHRcdHZlcnRleC54ID0gdmVydGljZXMuZ2V0WCggaSApO1xuXHRcdFx0XHRcdFx0dmVydGV4LnkgPSB2ZXJ0aWNlcy5nZXRZKCBpICk7XG5cdFx0XHRcdFx0XHR2ZXJ0ZXgueiA9IHZlcnRpY2VzLmdldFooIGkgKTtcblxuXHRcdFx0XHRcdFx0Ly8gdHJhbnNmcm9tIHRoZSB2ZXJ0ZXggdG8gd29ybGQgc3BhY2Vcblx0XHRcdFx0XHRcdHZlcnRleC5hcHBseU1hdHJpeDQoIG1lc2gubWF0cml4V29ybGQgKTtcblxuXHRcdFx0XHRcdFx0Ly8gdHJhbnNmb3JtIHRoZSB2ZXJ0ZXggdG8gZXhwb3J0IGZvcm1hdFxuXHRcdFx0XHRcdFx0b3V0cHV0ICs9ICd2ICcgKyB2ZXJ0ZXgueCArICcgJyArIHZlcnRleC55ICsgJyAnICsgdmVydGV4LnogKyAnXFxuJztcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdXZzXG5cblx0XHRcdFx0aWYoIHV2cyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdFx0Zm9yICggaSA9IDAsIGwgPSB1dnMuY291bnQ7IGkgPCBsOyBpICsrLCBuYlZlcnRleFV2cysrICkge1xuXG5cdFx0XHRcdFx0XHR1di54ID0gdXZzLmdldFgoIGkgKTtcblx0XHRcdFx0XHRcdHV2LnkgPSB1dnMuZ2V0WSggaSApO1xuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zvcm0gdGhlIHV2IHRvIGV4cG9ydCBmb3JtYXRcblx0XHRcdFx0XHRcdG91dHB1dCArPSAndnQgJyArIHV2LnggKyAnICcgKyB1di55ICsgJ1xcbic7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG5vcm1hbHNcblxuXHRcdFx0XHRpZiggbm9ybWFscyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdFx0bm9ybWFsTWF0cml4V29ybGQuZ2V0Tm9ybWFsTWF0cml4KCBtZXNoLm1hdHJpeFdvcmxkICk7XG5cblx0XHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IG5vcm1hbHMuY291bnQ7IGkgPCBsOyBpICsrLCBuYk5vcm1hbHMrKyApIHtcblxuXHRcdFx0XHRcdFx0bm9ybWFsLnggPSBub3JtYWxzLmdldFgoIGkgKTtcblx0XHRcdFx0XHRcdG5vcm1hbC55ID0gbm9ybWFscy5nZXRZKCBpICk7XG5cdFx0XHRcdFx0XHRub3JtYWwueiA9IG5vcm1hbHMuZ2V0WiggaSApO1xuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zyb20gdGhlIG5vcm1hbCB0byB3b3JsZCBzcGFjZVxuXHRcdFx0XHRcdFx0bm9ybWFsLmFwcGx5TWF0cml4Myggbm9ybWFsTWF0cml4V29ybGQgKTtcblxuXHRcdFx0XHRcdFx0Ly8gdHJhbnNmb3JtIHRoZSBub3JtYWwgdG8gZXhwb3J0IGZvcm1hdFxuXHRcdFx0XHRcdFx0b3V0cHV0ICs9ICd2biAnICsgbm9ybWFsLnggKyAnICcgKyBub3JtYWwueSArICcgJyArIG5vcm1hbC56ICsgJ1xcbic7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGZhY2VzXG5cblx0XHRcdFx0aWYoIGluZGljZXMgIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IGluZGljZXMuY291bnQ7IGkgPCBsOyBpICs9IDMgKSB7XG5cblx0XHRcdFx0XHRcdGZvciggbSA9IDA7IG0gPCAzOyBtICsrICl7XG5cblx0XHRcdFx0XHRcdFx0aiA9IGluZGljZXMuZ2V0WCggaSArIG0gKSArIDE7XG5cblx0XHRcdFx0XHRcdFx0ZmFjZVsgbSBdID0gKCBpbmRleFZlcnRleCArIGogKSArICcvJyArICggdXZzID8gKCBpbmRleFZlcnRleFV2cyArIGogKSA6ICcnICkgKyAnLycgKyAoIGluZGV4Tm9ybWFscyArIGogKTtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zvcm0gdGhlIGZhY2UgdG8gZXhwb3J0IGZvcm1hdFxuXHRcdFx0XHRcdFx0b3V0cHV0ICs9ICdmICcgKyBmYWNlLmpvaW4oICcgJyApICsgXCJcXG5cIjtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Zm9yICggaSA9IDAsIGwgPSB2ZXJ0aWNlcy5jb3VudDsgaSA8IGw7IGkgKz0gMyApIHtcblxuXHRcdFx0XHRcdFx0Zm9yKCBtID0gMDsgbSA8IDM7IG0gKysgKXtcblxuXHRcdFx0XHRcdFx0XHRqID0gaSArIG0gKyAxO1xuXG5cdFx0XHRcdFx0XHRcdGZhY2VbIG0gXSA9ICggaW5kZXhWZXJ0ZXggKyBqICkgKyAnLycgKyAoIHV2cyA/ICggaW5kZXhWZXJ0ZXhVdnMgKyBqICkgOiAnJyApICsgJy8nICsgKCBpbmRleE5vcm1hbHMgKyBqICk7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gdHJhbnNmb3JtIHRoZSBmYWNlIHRvIGV4cG9ydCBmb3JtYXRcblx0XHRcdFx0XHRcdG91dHB1dCArPSAnZiAnICsgZmFjZS5qb2luKCAnICcgKSArIFwiXFxuXCI7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGNvbnNvbGUud2FybiggJ1RIUkVFLk9CSkV4cG9ydGVyLnBhcnNlTWVzaCgpOiBnZW9tZXRyeSB0eXBlIHVuc3VwcG9ydGVkJywgZ2VvbWV0cnkgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgaW5kZXhcblx0XHRcdGluZGV4VmVydGV4ICs9IG5iVmVydGV4O1xuXHRcdFx0aW5kZXhWZXJ0ZXhVdnMgKz0gbmJWZXJ0ZXhVdnM7XG5cdFx0XHRpbmRleE5vcm1hbHMgKz0gbmJOb3JtYWxzO1xuXG5cdFx0fTtcblxuXHRcdHZhciBwYXJzZUxpbmUgPSBmdW5jdGlvbiggbGluZSApIHtcblxuXHRcdFx0dmFyIG5iVmVydGV4ID0gMDtcblxuXHRcdFx0dmFyIGdlb21ldHJ5ID0gbGluZS5nZW9tZXRyeTtcblx0XHRcdHZhciB0eXBlID0gbGluZS50eXBlO1xuXG5cdFx0XHRpZiAoIGdlb21ldHJ5IGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKSB7XG5cblx0XHRcdFx0Z2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKS5zZXRGcm9tT2JqZWN0KCBsaW5lICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBnZW9tZXRyeSBpbnN0YW5jZW9mIFRIUkVFLkJ1ZmZlckdlb21ldHJ5ICkge1xuXG5cdFx0XHRcdC8vIHNob3J0Y3V0c1xuXHRcdFx0XHR2YXIgdmVydGljZXMgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoICdwb3NpdGlvbicgKTtcblx0XHRcdFx0dmFyIGluZGljZXMgPSBnZW9tZXRyeS5nZXRJbmRleCgpO1xuXG5cdFx0XHRcdC8vIG5hbWUgb2YgdGhlIGxpbmUgb2JqZWN0XG5cdFx0XHRcdG91dHB1dCArPSAnbyAnICsgbGluZS5uYW1lICsgJ1xcbic7XG5cblx0XHRcdFx0aWYoIHZlcnRpY2VzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IHZlcnRpY2VzLmNvdW50OyBpIDwgbDsgaSArKywgbmJWZXJ0ZXgrKyApIHtcblxuXHRcdFx0XHRcdFx0dmVydGV4LnggPSB2ZXJ0aWNlcy5nZXRYKCBpICk7XG5cdFx0XHRcdFx0XHR2ZXJ0ZXgueSA9IHZlcnRpY2VzLmdldFkoIGkgKTtcblx0XHRcdFx0XHRcdHZlcnRleC56ID0gdmVydGljZXMuZ2V0WiggaSApO1xuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zyb20gdGhlIHZlcnRleCB0byB3b3JsZCBzcGFjZVxuXHRcdFx0XHRcdFx0dmVydGV4LmFwcGx5TWF0cml4NCggbGluZS5tYXRyaXhXb3JsZCApO1xuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zvcm0gdGhlIHZlcnRleCB0byBleHBvcnQgZm9ybWF0XG5cdFx0XHRcdFx0XHRvdXRwdXQgKz0gJ3YgJyArIHZlcnRleC54ICsgJyAnICsgdmVydGV4LnkgKyAnICcgKyB2ZXJ0ZXgueiArICdcXG4nO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHR5cGUgPT09ICdMaW5lJyApIHtcblxuXHRcdFx0XHRcdG91dHB1dCArPSAnbCAnO1xuXG5cdFx0XHRcdFx0Zm9yICggaiA9IDEsIGwgPSB2ZXJ0aWNlcy5jb3VudDsgaiA8PSBsOyBqKysgKSB7XG5cblx0XHRcdFx0XHRcdG91dHB1dCArPSAoIGluZGV4VmVydGV4ICsgaiApICsgJyAnO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0b3V0cHV0ICs9ICdcXG4nO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHR5cGUgPT09ICdMaW5lU2VnbWVudHMnICkge1xuXG5cdFx0XHRcdFx0Zm9yICggaiA9IDEsIGsgPSBqICsgMSwgbCA9IHZlcnRpY2VzLmNvdW50OyBqIDwgbDsgaiArPSAyLCBrID0gaiArIDEgKSB7XG5cblx0XHRcdFx0XHRcdG91dHB1dCArPSAnbCAnICsgKCBpbmRleFZlcnRleCArIGogKSArICcgJyArICggaW5kZXhWZXJ0ZXggKyBrICkgKyAnXFxuJztcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKCdUSFJFRS5PQkpFeHBvcnRlci5wYXJzZUxpbmUoKTogZ2VvbWV0cnkgdHlwZSB1bnN1cHBvcnRlZCcsIGdlb21ldHJ5ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRlIGluZGV4XG5cdFx0XHRpbmRleFZlcnRleCArPSBuYlZlcnRleDtcblxuXHRcdH07XG5cblx0XHRvYmplY3QudHJhdmVyc2UoIGZ1bmN0aW9uICggY2hpbGQgKSB7XG5cblx0XHRcdGlmICggY2hpbGQgaW5zdGFuY2VvZiBUSFJFRS5NZXNoICkge1xuXG5cdFx0XHRcdHBhcnNlTWVzaCggY2hpbGQgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGNoaWxkIGluc3RhbmNlb2YgVEhSRUUuTGluZSApIHtcblxuXHRcdFx0XHRwYXJzZUxpbmUoIGNoaWxkICk7XG5cblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHRcdHJldHVybiBvdXRwdXQ7XG5cblx0fVxufSIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYSwgU3RhbmRhcmRWaWV3fSAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9ICAgICAgICAgICAgICAgIGZyb20gJ0RlcHRoQnVmZmVyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIEhUTUxMb2dnZXJ9ICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hWaWV3ZXJDb250cm9sc30gICAgICAgICBmcm9tICdNZXNoVmlld2VyQ29udHJvbHMnXHJcbmltcG9ydCB7T0JKRXhwb3J0ZXJ9ICAgICAgICAgICAgICAgIGZyb20gXCJPQkpFeHBvcnRlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBNZXNoVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWVzaFZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcbiAgICBcclxuICAgIF9tZXNoVmlld2VyQ29udHJvbHM6IE1lc2hWaWV3ZXJDb250cm9sczsgICAgICAgICAgICAgLy8gVUkgY29udHJvbHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNZXNoVmlld2VyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBuYW1lIFZpZXdlciBuYW1lLlxyXG4gICAgICogQHBhcmFtIHByZXZpZXdDYW52YXNJZCBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmV2aWV3Q2FudmFzSWQgOiBzdHJpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlcihuYW1lLCBwcmV2aWV3Q2FudmFzSWQpO1xyXG5cclxuICAgICAgICAvL292ZXJyaWRlXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gU2VydmljZXMuaHRtbExvZ2dlcjsgICAgICAgXHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3B1bGF0ZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7ICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMTtcclxuICAgICAgICBsZXQgd2lkdGggID0gMTtcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVBsYW5lTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCBoZWlnaHQsIHdpZHRoLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoRGVwdGhCdWZmZXIuRGVmYXVsdE1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycykpO1xyXG4gICAgICAgIG1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgICAgICB0aGlzLl9yb290LmFkZChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplTGlnaHRpbmcoKSB7XHJcblxyXG4gICAgICAgIGxldCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjIpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0MS5wb3NpdGlvbi5zZXQoNCwgNCwgNCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVSSBjb250cm9scyBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5fbWVzaFZpZXdlckNvbnRyb2xzID0gbmV3IE1lc2hWaWV3ZXJDb250cm9scyh0aGlzKTtcclxuICAgIH1cclxuICAgIFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBTYXZlIE9wZXJhdGlvbnNcclxuICAgIC8qKlxyXG4gICAgICogU2F2ZXMgYSByZWxpZWYgdG8gYSBkaXNrIGZpbGUuXHJcbiAgICAgKi9cclxuICAgIHNhdmVSZWxpZWYoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBleHBvcnRUYWcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdFeHBvcnQgT0JKJyk7XHJcbiAgICAgICAgbGV0IGV4cG9ydGVyID0gbmV3IE9CSkV4cG9ydGVyKCk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGV4cG9ydGVyLnBhcnNlKHRoaXMubW9kZWwpO1xyXG5cclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICBsZXQgdmlld2VyVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgbGV0IHBvc3RVcmwgICA9IHZpZXdlclVybC5yZXBsYWNlKCdWaWV3ZXInLCAnU2F2ZScpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbihcIlBPU1RcIiwgcG9zdFVybCwgdHJ1ZSk7XHJcbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAob0V2ZW50KSB7XHJcbiAgICAgICAgICAgIC8vIHVwbG9hZGVkLi4uXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGJsb2IgPSBuZXcgQmxvYihbcmVzdWx0XSwge3R5cGU6ICd0ZXh0L3BsYWluJ30pO1xyXG4gICAgICAgIHJlcXVlc3Quc2VuZChibG9iKSAgICAgICAgXHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKGV4cG9ydFRhZyk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgICAgIGZyb20gXCJEZXB0aEJ1ZmZlckZhY3RvcnlcIlxyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJ9ICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBNb2RlbFZpZXdlciBTZXR0aW5nc1xyXG4gKi9cclxuY2xhc3MgTW9kZWxWaWV3ZXJTZXR0aW5ncyB7XHJcblxyXG4gICAgZGlzcGxheUdyaWQgICAgOiBib29sZWFuO1xyXG4gICAgZ2VuZXJhdGVSZWxpZWYgOiAoKSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihnZW5lcmF0ZVJlbGllZiA6ICgpID0+IGFueSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZGlzcGxheUdyaWQgICAgPSB0cnVlOyBcclxuICAgICAgICB0aGlzLmdlbmVyYXRlUmVsaWVmID0gZ2VuZXJhdGVSZWxpZWY7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNb2RlbFZpZXdlciBVSSBDb250cm9scy5cclxuICovICAgIFxyXG5leHBvcnQgY2xhc3MgTW9kZWxWaWV3ZXJDb250cm9scyB7XHJcblxyXG4gICAgX21vZGVsVmlld2VyICAgICAgICAgOiBNb2RlbFZpZXdlcjsgICAgICAgICAgICAgICAgICAgICAvLyBhc3NvY2lhdGVkIHZpZXdlclxyXG4gICAgX21vZGVsVmlld2VyU2V0dGluZ3MgOiBNb2RlbFZpZXdlclNldHRpbmdzOyAgICAgICAgICAgICAvLyBVSSBzZXR0aW5nc1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTW9kZWxWaWV3ZXJDb250cm9sc1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGVsVmlld2VyIDogTW9kZWxWaWV3ZXIpIHsgIFxyXG5cclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlciA9IG1vZGVsVmlld2VyO1xyXG5cclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGEgcmVsaWVmIGZyb20gdGhlIGN1cnJlbnQgbW9kZWwgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZW5lcmF0ZVJlbGllZigpIDogdm9pZCB7IFxyXG5cclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlci5nZW5lcmF0ZVJlbGllZigpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHZpZXcgc2V0dGluZ3MgdGhhdCBhcmUgY29udHJvbGxhYmxlIGJ5IHRoZSB1c2VyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgbGV0IHNjb3BlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXJTZXR0aW5ncyA9IG5ldyBNb2RlbFZpZXdlclNldHRpbmdzKHRoaXMuZ2VuZXJhdGVSZWxpZWYuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIGxldCBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgbWVudURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuX21vZGVsVmlld2VyLmNvbnRhaW5lcklkKTtcclxuICAgICAgICBtZW51RGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNb2RlbFZpZXdlciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IG1vZGVsVmlld2VyT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ01vZGVsVmlld2VyIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gR3JpZFxyXG4gICAgICAgIGxldCBjb250cm9sRGlzcGxheUdyaWQgPSBtb2RlbFZpZXdlck9wdGlvbnMuYWRkKHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MsICdkaXNwbGF5R3JpZCcpLm5hbWUoJ0Rpc3BsYXkgR3JpZCcpO1xyXG4gICAgICAgIGNvbnRyb2xEaXNwbGF5R3JpZC5vbkNoYW5nZSAoKHZhbHVlIDogYm9vbGVhbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuX21vZGVsVmlld2VyLmRpc3BsYXlHcmlkKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gR2VuZXJhdGUgUmVsaWVmXHJcbiAgICAgICAgbGV0IGNvbnRyb2xHZW5lcmF0ZVJlbGllZiA9IG1vZGVsVmlld2VyT3B0aW9ucy5hZGQodGhpcy5fbW9kZWxWaWV3ZXJTZXR0aW5ncywgJ2dlbmVyYXRlUmVsaWVmJykubmFtZSgnR2VuZXJhdGUgUmVsaWVmJyk7XHJcblxyXG4gICAgICAgIG1vZGVsVmlld2VyT3B0aW9ucy5vcGVuKCk7XHJcbiAgICB9ICAgIFxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgICAgIGZyb20gXCJEZXB0aEJ1ZmZlckZhY3RvcnlcIlxyXG5pbXBvcnQge0V2ZW50TWFuYWdlciwgRXZlbnRUeXBlfSAgICAgICAgZnJvbSAnRXZlbnRNYW5hZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TWF0ZXJpYWxzfSAgICAgICAgICAgICAgICAgICAgICBmcm9tICdNYXRlcmlhbHMnXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJDb250cm9sc30gICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJDb250cm9sc1wiXHJcbmltcG9ydCB7TG9nZ2VyfSAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuY29uc3QgT2JqZWN0TmFtZXMgPSB7XHJcbiAgICBHcmlkIDogICdHcmlkJ1xyXG59XHJcblxyXG4vKipcclxuICogQGV4cG9ydHMgVmlld2VyL01vZGVsVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTW9kZWxWaWV3ZXIgZXh0ZW5kcyBWaWV3ZXIge1xyXG5cclxuICAgIF9tb2RlbFZpZXdlckNvbnRyb2xzIDogTW9kZWxWaWV3ZXJDb250cm9sczsgICAgICAgICAgICAgLy8gVUkgY29udHJvbHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNb2RlbFZpZXdlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBWaWV3ZXIgbmFtZS5cclxuICAgICAqIEBwYXJhbSBtb2RlbENhbnZhc0lkIEhUTUwgZWxlbWVudCB0byBob3N0IHRoZSB2aWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgOiBzdHJpbmcsIG1vZGVsQ2FudmFzSWQgOiBzdHJpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlciAobmFtZSwgbW9kZWxDYW52YXNJZCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHNldE1vZGVsKHZhbHVlIDogVEhSRUUuR3JvdXApIHtcclxuXHJcbiAgICAgICAgLy8gQ2FsbCBiYXNlIGNsYXNzIHByb3BlcnR5IHZpYSBzdXBlclxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvNDQ2NSAgICAgICAgXHJcbiAgICAgICAgc3VwZXIuc2V0TW9kZWwodmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBkaXNwYXRjaCBOZXdNb2RlbCBldmVudFxyXG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRoaXMsIEV2ZW50VHlwZS5OZXdNb2RlbCwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3B1bGF0ZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLnBvcHVsYXRlU2NlbmUoKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDMwMCwgMzAsIDB4ODZlNmZmLCAweDk5OTk5OSk7XHJcbiAgICAgICAgaGVscGVyLm5hbWUgPSBPYmplY3ROYW1lcy5HcmlkO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGhlbHBlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmFsIGluaXRpYWxpemF0aW9uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBVSSBjb250cm9scyBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlckNvbnRyb2xzID0gbmV3IE1vZGVsVmlld2VyQ29udHJvbHModGhpcyk7XHJcbiAgICB9XHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBTY2VuZVxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5IHRoZSByZWZlcmVuY2UgZ3JpZC5cclxuICAgICAqL1xyXG4gICAgZGlzcGxheUdyaWQodmlzaWJsZSA6IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgbGV0IGdyaWRHZW9tZXRyeSA6IFRIUkVFLk9iamVjdDNEID0gdGhpcy5zY2VuZS5nZXRPYmplY3RCeU5hbWUoT2JqZWN0TmFtZXMuR3JpZCk7XHJcbiAgICAgICAgZ3JpZEdlb21ldHJ5LnZpc2libGUgPSB2aXNpYmxlO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgRGlzcGxheSBncmlkID0gJHt2aXNpYmxlfWApO1xyXG4gICAgfSBcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gTWVzaCBHZW5lcmF0aW9uXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIHJlbGllZiBmcm9tIHRoZSBjdXJyZW50IG1vZGVsIGNhbWVyYS5cclxuICAgICAqL1xyXG4gICAgZ2VuZXJhdGVSZWxpZWYoKSA6IHZvaWQgeyBcclxuICAgICAgICBcclxuICAgICAgICAvLyBwaXhlbHNcclxuICAgICAgICBsZXQgd2lkdGggID0gNTEyO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB3aWR0aCAvIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgbGV0IGZhY3RvcnkgPSBuZXcgRGVwdGhCdWZmZXJGYWN0b3J5KHt3aWR0aCA6IHdpZHRoLCBoZWlnaHQgOiBoZWlnaHQsIG1vZGVsIDogdGhpcy5tb2RlbCwgY2FtZXJhIDogdGhpcy5jYW1lcmEsIGFkZENhbnZhc1RvRE9NIDogZmFsc2V9KTsgICBcclxuXHJcbiAgICAgICAgbGV0IHByZXZpZXdNZXNoIDogVEhSRUUuTWVzaCA9IGZhY3RvcnkubWVzaEdlbmVyYXRlKHt9KTsgICBcclxuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudCh0aGlzLCBFdmVudFR5cGUuTWVzaEdlbmVyYXRlLCBwcmV2aWV3TWVzaCk7XHJcblxyXG4gICAgICAgIC8vIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIuYWRkSW5mb01lc3NhZ2UoJ1JlbGllZiBnZW5lcmF0ZWQnKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiQ2FtZXJhXCJcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtFdmVudFR5cGUsIE1SRXZlbnQsIEV2ZW50TWFuYWdlcn0gICBmcm9tICdFdmVudE1hbmFnZXInXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge01lc2hWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNZXNoVmlld2VyXCJcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge09CSkxvYWRlcn0gICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJPQkpMb2FkZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1Rlc3RNb2RlbH0gICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1Rlc3RNb2RlbExvYWRlcidcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiVmlld2VyXCJcclxuICAgIFxyXG5leHBvcnQgY2xhc3MgTW9kZWxSZWxpZWYge1xyXG5cclxuICAgIF9tZXNoVmlld2VyICAgICAgICAgICAgIDogTWVzaFZpZXdlcjtcclxuICAgIF9tb2RlbFZpZXdlciAgICAgICAgICAgIDogTW9kZWxWaWV3ZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgICAgICAgICA6IExvYWRlcjtcclxuICAgIFxyXG4gICAgX2luaXRpYWxNZXNoR2VuZXJhdGlvbiAgOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsUmVsaWVmXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBtZXNoIGdlbmVyYXRpb24uXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgTWVzaCBnZW5lcmF0aW9uIGV2ZW50LlxyXG4gICAgICogQHBhcmFtcyBtZXNoIE5ld2x5LWdlbmVyYXRlZCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBvbk1lc2hHZW5lcmF0ZSAoZXZlbnQgOiBNUkV2ZW50LCBtZXNoIDogVEhSRUUuTWVzaCkge1xyXG5cclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyLnNldE1vZGVsKG1lc2gpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faW5pdGlhbE1lc2hHZW5lcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21lc2hWaWV3ZXIuZml0VmlldygpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsTWVzaEdlbmVyYXRpb24gPSBmYWxzZTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBuZXcgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgTmV3TW9kZWwgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgTmV3bHkgbG9hZGVkIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBvbk5ld01vZGVsIChldmVudCA6IE1SRXZlbnQsIG1vZGVsIDogVEhSRUUuR3JvdXApIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyhTdGFuZGFyZFZpZXcuRnJvbnQpOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbWVzaFZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyhTdGFuZGFyZFZpZXcuVG9wKTsgICAgICAgXHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoIHRoZSBtb2RlbCBWaWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIHJ1biAoKSB7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIuYWRkSW5mb01lc3NhZ2UgKCdNb2RlbFJlbGllZiBzdGFydGVkJyk7ICAgXHJcbiAgICAgICBcclxuICAgICAgICAvLyBNZXNoIFByZXZpZXdcclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyID0gIG5ldyBNZXNoVmlld2VyKCdNZXNoVmlld2VyJywgJ21lc2hDYW52YXMnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBNb2RlbCBWaWV3ZXIgICAgXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIgPSBuZXcgTW9kZWxWaWV3ZXIoJ01vZGVsVmlld2VyJywgJ21vZGVsQ2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIuZXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLk1lc2hHZW5lcmF0ZSwgdGhpcy5vbk1lc2hHZW5lcmF0ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlci5ldmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTmV3TW9kZWwsICAgICB0aGlzLm9uTmV3TW9kZWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTG9hZGVyXHJcbiAgICAgICAgdGhpcy5fbG9hZGVyID0gbmV3IExvYWRlcigpO1xyXG5cclxuICAgICAgICAvLyBPQkogTW9kZWxzXHJcbiAgICAgICAgdGhpcy5fbG9hZGVyLmxvYWRPQkpNb2RlbCAodGhpcy5fbW9kZWxWaWV3ZXIpO1xyXG5cclxuICAgICAgICAvLyBUZXN0IE1vZGVsc1xyXG4vLyAgICAgIHRoaXMuX2xvYWRlci5sb2FkUGFyYW1ldHJpY1Rlc3RNb2RlbCh0aGlzLl9tb2RlbFZpZXdlciwgVGVzdE1vZGVsLkNoZWNrZXJib2FyZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBtb2RlbFJlbGllZiA9IG5ldyBNb2RlbFJlbGllZigpO1xyXG5tb2RlbFJlbGllZi5ydW4oKTtcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHthc3NlcnR9ICAgZnJvbSAnY2hhaSdcclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0RlcHRoQnVmZmVyfSBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gZnJvbSAnTWF0aCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9WaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVbml0VGVzdHMge1xyXG4gICBcclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIFVuaXRUZXN0c1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIHN0YXRpYyBWZXJ0ZXhNYXBwaW5nIChkZXB0aEJ1ZmZlciA6IERlcHRoQnVmZmVyLCBtZXNoIDogVEhSRUUuTWVzaCkge1xyXG5cclxuICAgICAgICBsZXQgbWVzaEdlb21ldHJ5IDogVEhSRUUuR2VvbWV0cnkgPSA8VEhSRUUuR2VvbWV0cnk+IG1lc2guZ2VvbWV0cnk7XHJcbiAgICAgICAgbWVzaEdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IG1lc2hHZW9tZXRyeS5ib3VuZGluZ0JveDtcclxuXHJcbiAgICAgICAgLy8gd2lkdGggID0gMyAgICAgICAgICAgICAgMyAgIDQgICA1XHJcbiAgICAgICAgLy8gY29sdW1uID0gMiAgICAgICAgICAgICAgMCAgIDEgICAyXHJcbiAgICAgICAgLy8gYnVmZmVyIGxlbmd0aCA9IDZcclxuXHJcbiAgICAgICAgLy8gVGVzdCBQb2ludHMgICAgICAgICAgICBcclxuICAgICAgICBsZXQgbG93ZXJMZWZ0ICA9IGJvdW5kaW5nQm94Lm1pbjtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodCA9IG5ldyBUSFJFRS5WZWN0b3IzIChib3VuZGluZ0JveC5tYXgueCwgYm91bmRpbmdCb3gubWluLnksIDApO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0ID0gYm91bmRpbmdCb3gubWF4O1xyXG4gICAgICAgIGxldCB1cHBlckxlZnQgID0gbmV3IFRIUkVFLlZlY3RvcjMgKGJvdW5kaW5nQm94Lm1pbi54LCBib3VuZGluZ0JveC5tYXgueSwgMCk7XHJcbiAgICAgICAgbGV0IGNlbnRlciAgICAgPSBib3VuZGluZ0JveC5nZXRDZW50ZXIoKTtcclxuXHJcbiAgICAgICAgLy8gRXhwZWN0ZWQgVmFsdWVzXHJcbiAgICAgICAgbGV0IGJ1ZmZlckxlbmd0aCAgICA6IG51bWJlciA9IChkZXB0aEJ1ZmZlci53aWR0aCAqIGRlcHRoQnVmZmVyLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBmaXJzdENvbHVtbiAgIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbGFzdENvbHVtbiAgICA6IG51bWJlciA9IGRlcHRoQnVmZmVyLndpZHRoIC0gMTtcclxuICAgICAgICBsZXQgY2VudGVyQ29sdW1uICA6IG51bWJlciA9IE1hdGgucm91bmQoZGVwdGhCdWZmZXIud2lkdGggLyAyKTtcclxuICAgICAgICBsZXQgZmlyc3RSb3cgICAgICA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGxhc3RSb3cgICAgICAgOiBudW1iZXIgPSBkZXB0aEJ1ZmZlci5oZWlnaHQgLSAxO1xyXG4gICAgICAgIGxldCBjZW50ZXJSb3cgICAgIDogbnVtYmVyID0gTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci5oZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdEluZGV4ICA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHRJbmRleCA6IG51bWJlciA9IGRlcHRoQnVmZmVyLndpZHRoIC0gMTtcclxuICAgICAgICBsZXQgdXBwZXJSaWdodEluZGV4IDogbnVtYmVyID0gYnVmZmVyTGVuZ3RoIC0gMTtcclxuICAgICAgICBsZXQgdXBwZXJMZWZ0SW5kZXggIDogbnVtYmVyID0gYnVmZmVyTGVuZ3RoIC0gZGVwdGhCdWZmZXIud2lkdGg7XHJcbiAgICAgICAgbGV0IGNlbnRlckluZGV4ICAgICA6IG51bWJlciA9IChjZW50ZXJSb3cgKiBkZXB0aEJ1ZmZlci53aWR0aCkgKyAgTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci53aWR0aCAvIDIpO1xyXG5cclxuICAgICAgICBsZXQgbG93ZXJMZWZ0SW5kaWNlcyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoZmlyc3RSb3csIGZpcnN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodEluZGljZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoZmlyc3RSb3csIGxhc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0SW5kaWNlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihsYXN0Um93LCBsYXN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgdXBwZXJMZWZ0SW5kaWNlcyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIobGFzdFJvdywgZmlyc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCBjZW50ZXJJbmRpY2VzICAgICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihjZW50ZXJSb3csIGNlbnRlckNvbHVtbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4ICAgOiBudW1iZXJcclxuICAgICAgICBsZXQgaW5kaWNlcyA6IFRIUkVFLlZlY3RvcjI7XHJcblxyXG4gICAgICAgIC8vIExvd2VyIExlZnRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKGxvd2VyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgbG93ZXJMZWZ0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ICAgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KGxvd2VyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgbG93ZXJMZWZ0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBMb3dlciBSaWdodFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXMobG93ZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgbG93ZXJSaWdodEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgobG93ZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgbG93ZXJSaWdodEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gVXBwZXIgUmlnaHRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHVwcGVyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIHVwcGVyUmlnaHRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KHVwcGVyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIHVwcGVyUmlnaHRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIFVwcGVyIExlZnRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHVwcGVyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgdXBwZXJMZWZ0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleCh1cHBlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIHVwcGVyTGVmdEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gQ2VudGVyXHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyhjZW50ZXIsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIGNlbnRlckluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgoY2VudGVyLCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBjZW50ZXJJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgfSBcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmF9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3MsIE9iamVjdE5hbWVzfSAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0xvYWRlcidcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hWaWV3ZXJ9ICAgICAgICAgICAgICAgICBmcm9tIFwiTWVzaFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtVbml0VGVzdHN9ICAgICAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYW1lcmFTZXR0aW5ncyB7XHJcbiAgICBwb3NpdGlvbjogICAgICAgVEhSRUUuVmVjdG9yMzsgICAgICAgIC8vIGxvY2F0aW9uIG9mIGNhbWVyYVxyXG4gICAgdGFyZ2V0OiAgICAgICAgIFRIUkVFLlZlY3RvcjM7ICAgICAgICAvLyB0YXJnZXQgcG9pbnRcclxuICAgIG5lYXI6ICAgICAgICAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gbmVhciBjbGlwcGluZyBwbGFuZVxyXG4gICAgZmFyOiAgICAgICAgICAgIG51bWJlcjsgICAgICAgICAgICAgICAvLyBmYXIgY2xpcHBpbmcgcGxhbmVcclxuICAgIGZpZWxkT2ZWaWV3OiAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gZmllbGQgb2Ygdmlld1xyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIENhbWVyYVdvcmtiZW5jaFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbWVyYVZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcblxyXG4gICAgcG9wdWxhdGVTY2VuZSgpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyaWFkID0gR3JhcGhpY3MuY3JlYXRlV29ybGRBeGVzVHJpYWQobmV3IFRIUkVFLlZlY3RvcjMoKSwgMSwgMC4yNSwgMC4yNSk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKHRyaWFkKTtcclxuXHJcbiAgICAgICAgbGV0IGJveCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKDQsIDYsIC0yKSwgMSwgMiwgMiwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvciA6IDB4ZmYwMDAwfSkpO1xyXG4gICAgICAgIGJveC5yb3RhdGlvbi5zZXQoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgYm94LnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKGJveCk7XHJcblxyXG4gICAgICAgIGxldCBzcGhlcmUgOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygtMywgMTAsIC0xKSwgMSwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvciA6IDB4MDBmZjAwfSkpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKHNwaGVyZSk7XHJcbiAgICB9ICAgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICBzaG93Qm91bmRpbmdCb3hlcyA6ICgpID0+IHZvaWQ7XHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcyA6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgc2hvd0JvdW5kaW5nQm94ZXMgOiAoKSA9PiBhbnksIHNldENsaXBwaW5nUGxhbmVzIDogKCkgPT4gYW55KSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMgPSBzaG93Qm91bmRpbmdCb3hlcztcclxuICAgICAgICB0aGlzLnNldENsaXBwaW5nUGxhbmVzICA9IHNldENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEFwcFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBcclxuICAgIF9sb2dnZXIgICAgICAgICA6IENvbnNvbGVMb2dnZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgOiBMb2FkZXI7XHJcbiAgICBfdmlld2VyICAgICAgICAgOiBDYW1lcmFWaWV3ZXI7XHJcbiAgICBfdmlld2VyQ29udHJvbHMgOiBWaWV3ZXJDb250cm9scztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byB0aGUgbW9kZWwgZXh0ZW50cyBpbiBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsICAgICAgICAgICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgPSB0aGlzLl92aWV3ZXIubW9kZWw7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjbG9uZSBtb2RlbCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3OiBUSFJFRS5Cb3gzID0gR3JhcGhpY3MuZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTsgICAgICAgIFxyXG5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgYm94IGlzIHdvcmxkLWF4aXMgYWxpZ25lZC4gXHJcbiAgICAgICAgLy8gSU52IFZpZXcgY29vcmRpbmF0ZXMsIHRoZSBjYW1lcmEgaXMgYXQgdGhlIG9yaWdpbi5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgbmVhciBwbGFuZSBpcyB0aGUgbWF4aW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGZhciBwbGFuZSBpcyB0aGUgbWluaW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgbGV0IG5lYXJQbGFuZSA9IC1ib3VuZGluZ0JveFZpZXcubWF4Lno7XHJcbiAgICAgICAgbGV0IGZhclBsYW5lICA9IC1ib3VuZGluZ0JveFZpZXcubWluLno7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5fY2FtZXJhQ29udHJvbHMuX2NhbWVyYVNldHRpbmdzLm5lYXJDbGlwcGluZ1BsYW5lID0gbmVhclBsYW5lO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5fY2FtZXJhQ29udHJvbHMuX2NhbWVyYVNldHRpbmdzLmZhckNsaXBwaW5nUGxhbmUgID0gZmFyUGxhbmU7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEubmVhciA9IG5lYXJQbGFuZTtcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLmZhciAgPSBmYXJQbGFuZTtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBib3VuZGluZyBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBvYmplY3QgVGFyZ2V0IG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBjb2xvciBDb2xvciBvZiBib3VuZGluZyBib3ggbWVzaC5cclxuICAgICAqL1xyXG4gICAgY3JlYXRlQm91bmRpbmdCb3ggKG9iamVjdCA6IFRIUkVFLk9iamVjdDNELCBjb2xvciA6IG51bWJlcikgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGJvdW5kaW5nQm94IDogVEhSRUUuQm94MyA9IG5ldyBUSFJFRS5Cb3gzKCk7XHJcbiAgICAgICAgICAgIGJvdW5kaW5nQm94ID0gYm91bmRpbmdCb3guc2V0RnJvbU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7Y29sb3IgOiBjb2xvciwgb3BhY2l0eSA6IDEuMCwgd2lyZWZyYW1lIDogdHJ1ZX0pOyAgICAgICBcclxuICAgICAgICAgICAgbGV0IGJvdW5kaW5nQm94TWVzaCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3goYm91bmRpbmdCb3guZ2V0Q2VudGVyKCksIGJvdW5kaW5nQm94LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZGluZ0JveE1lc2g7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIGNsaXBwaW5nIHBsYW5lcyBvZiB0aGUgbW9kZWwgaW4gVmlldyBhbmQgV29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHNob3dCb3VuZGluZ0JveGVzKCkge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWwgICAgICAgICAgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICA9IHRoaXMuX3ZpZXdlci5tb2RlbDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGQgICAgICAgIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubWF0cml4V29ybGQ7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nIEJvdW5kaW5nQm94ZXMgYW5kIG1vZGVsIGNsb25lIChWaWV3IGNvb3JkaW5hdGVzKVxyXG4gICAgICAgIEdyYXBoaWNzLnJlbW92ZUFsbEJ5TmFtZSh0aGlzLl92aWV3ZXIuX3NjZW5lLCBPYmplY3ROYW1lcy5Cb3VuZGluZ0JveCk7XHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlQWxsQnlOYW1lKHRoaXMuX3ZpZXdlci5fc2NlbmUsIE9iamVjdE5hbWVzLk1vZGVsQ2xvbmUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNsb25lIG1vZGVsIChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBtb2RlbFZpZXcgID0gIEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIG1vZGVsVmlldy5uYW1lID0gT2JqZWN0TmFtZXMuTW9kZWxDbG9uZTtcclxuICAgICAgICBtb2RlbC5hZGQobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldyA6IFRIUkVFLk1lc2ggPSB0aGlzLmNyZWF0ZUJvdW5kaW5nQm94KG1vZGVsVmlldywgMHhmZjAwZmYpO1xyXG4gICAgICAgIG1vZGVsLmFkZChib3VuZGluZ0JveFZpZXcpO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gYm91bmRpbmcgYm94IGJhY2sgZnJvbSBWaWV3IHRvIFdvcmxkXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94V29ybGQgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QoYm91bmRpbmdCb3hWaWV3LCBjYW1lcmFNYXRyaXhXb3JsZCk7XHJcbiAgICAgICAgbW9kZWwuYWRkKGJvdW5kaW5nQm94V29ybGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlldyBzZXR0aW5ncyB0aGF0IGFyZSBjb250cm9sbGFibGUgYnkgdGhlIHVzZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVZpZXdlckNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scyA9IG5ldyBWaWV3ZXJDb250cm9scyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLnNob3dCb3VuZGluZ0JveGVzLmJpbmQodGhpcyksIHRoaXMuc2V0Q2xpcHBpbmdQbGFuZXMuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIHZhciBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgc2V0dGluZ3NEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3NDb250cm9scycpO1xyXG4gICAgICAgIHNldHRpbmdzRGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuICAgICAgICB2YXIgZm9sZGVyT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ0NhbWVyYVRlc3QgT3B0aW9ucycpO1xyXG5cclxuICAgICAgICAvLyBTaG93IEJvdW5kaW5nIEJveGVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTaG93Qm91bmRpbmdCb3hlcyA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnc2hvd0JvdW5kaW5nQm94ZXMnKS5uYW1lKCdTaG93IEJvdW5kaW5nIEJveGVzJyk7XHJcblxyXG4gICAgICAgIC8vIENsaXBwaW5nIFBsYW5lc1xyXG4gICAgICAgIGxldCBjb250cm9sU2V0Q2xpcHBpbmdQbGFuZXMgPSBmb2xkZXJPcHRpb25zLmFkZCh0aGlzLl92aWV3ZXJDb250cm9scywgJ3NldENsaXBwaW5nUGxhbmVzJykubmFtZSgnU2V0IENsaXBwaW5nIFBsYW5lcycpO1xyXG5cclxuICAgICAgICBmb2xkZXJPcHRpb25zLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW5cclxuICAgICAqL1xyXG4gICAgcnVuICgpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFZpZXdlciAgICBcclxuICAgICAgICB0aGlzLl92aWV3ZXIgPSBuZXcgQ2FtZXJhVmlld2VyKCdDYW1lcmFWaWV3ZXInLCAndmlld2VyQ2FudmFzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVUkgQ29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVWaWV3ZXJDb250cm9scygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgYXBwID0gbmV3IEFwcDtcclxuYXBwLnJ1bigpO1xyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgIGZyb20gJ0RlcHRoQnVmZmVyRmFjdG9yeSdcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIEhUTUxMb2dnZXJ9ICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1VuaXRUZXN0c30gICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogRGVwdGhCdWZmZXJUZXN0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXJUZXN0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW5cclxuICAgICAqL1xyXG4gICAgbWFpbiAoKSB7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBkZXB0aEJ1ZmZlclRlc3QgPSBuZXcgRGVwdGhCdWZmZXJUZXN0KCk7XHJcbmRlcHRoQnVmZmVyVGVzdC5tYWluKCk7XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1VuaXRUZXN0c30gICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuXHJcbmxldCBsb2dnZXIgPSBuZXcgSFRNTExvZ2dlcigpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBXaWRnZXRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBXaWRnZXQge1xyXG4gICAgXHJcbiAgICBuYW1lICA6IHN0cmluZztcclxuICAgIHByaWNlIDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgOiBzdHJpbmcsIHByaWNlIDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSAgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMucHJpY2UgPSBwcmljZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE9wZXJhdGVcclxuICAgICAqL1xyXG4gICAgb3BlcmF0ZSAoKSB7XHJcbiAgICAgICAgbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGAke3RoaXMubmFtZX0gb3BlcmF0aW5nLi4uLmApOyAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogU3VwZXJXaWRnZXRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb2xvcldpZGdldCBleHRlbmRzIFdpZGdldCB7XHJcblxyXG4gICAgY29sb3IgOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJpY2UgOiBudW1iZXIsIGNvbG9yIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHN1cGVyIChuYW1lLCBwcmljZSk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR3JhbmRQYXJlbnQge1xyXG5cclxuICAgIGdyYW5kcGFyZW50UHJvcGVydHkgIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFuZHBhcmVudFByb3BlcnR5ICA9IGdyYW5kcGFyZW50UHJvcGVydHkgO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyZW50IGV4dGVuZHMgR3JhbmRQYXJlbnR7XHJcbiAgICBcclxuICAgIHBhcmVudFByb3BlcnR5IDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmcsIHBhcmVudFByb3BlcnR5IDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKGdyYW5kcGFyZW50UHJvcGVydHkpO1xyXG4gICAgICAgIHRoaXMucGFyZW50UHJvcGVydHkgPSBwYXJlbnRQcm9wZXJ0eTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoaWxkIGV4dGVuZHMgUGFyZW50e1xyXG4gICAgXHJcbiAgICBjaGlsZFByb3BlcnR5IDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoZ3JhbmRwYXJlbnRQcm9wZXJ0eSA6IHN0cmluZywgcGFyZW50UHJvcGVydHkgOiBzdHJpbmcsIGNoaWxkUHJvcGVydHkgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoZ3JhbmRwYXJlbnRQcm9wZXJ0eSwgcGFyZW50UHJvcGVydHkpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRQcm9wZXJ0eSA9IGNoaWxkUHJvcGVydHk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogSW5oZXJpdGFuY2VcclxuICovXHJcbmV4cG9ydCBjbGFzcyBJbmhlcml0YW5jZVRlc3Qge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBtYWluICgpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgd2lkZ2V0ID0gbmV3IFdpZGdldCAoJ1dpZGdldCcsIDEuMCk7XHJcbiAgICAgICAgd2lkZ2V0Lm9wZXJhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbG9yV2lkZ2V0ID0gbmV3IENvbG9yV2lkZ2V0ICgnQ29sb3JXaWRnZXQnLCAxLjAsICdyZWQnKTtcclxuICAgICAgICBjb2xvcldpZGdldC5vcGVyYXRlKCk7XHJcblxyXG4gICAgICAgIGxldCBjaGlsZCA9IG5ldyBDaGlsZCgnR2FHYScsICdEYWQnLCAnU3RldmUnKTsgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBpbmhlcml0YW5jZSA9IG5ldyBJbmhlcml0YW5jZVRlc3Q7XHJcbmluaGVyaXRhbmNlLm1haW4oKTtcclxuIl19

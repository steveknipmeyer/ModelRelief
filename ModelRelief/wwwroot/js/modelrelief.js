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
define("Graphics/Graphics", ["require", "exports", "three", "System/Services"], function (require, exports, THREE, Services_1) {
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
define("DepthBuffer/DepthBuffer", ["require", "exports", "chai", "three", "Viewer/Camera", "Graphics/Graphics", "System/Services"], function (require, exports, chai_1, THREE, Camera_1, Graphics_1, Services_2) {
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
        DepthBuffer.DefaultMeshPhongMaterialParameters = {
            side: THREE.DoubleSide,
            wireframe: false,
            color: 0x42eef4,
            specular: 0xffffff,
            reflectivity: 0.75,
            shininess: 100
        };
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
define("DepthBuffer/DepthBufferFactory", ["require", "exports", "three", "Viewer/Camera", "DepthBuffer/DepthBuffer", "Graphics/Graphics", "System/Services", "System/Tools"], function (require, exports, THREE, Camera_2, DepthBuffer_1, Graphics_2, Services_3, Tools_1) {
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
define("Viewer/Camera", ["require", "exports", "three", "DepthBuffer/DepthBufferFactory", "Graphics/Graphics", "System/Services"], function (require, exports, THREE, DepthBufferFactory_1, Graphics_3, Services_4) {
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
define("Viewer/CameraControls", ["require", "exports", "dat-gui", "Viewer/Camera", "Graphics/Graphics"], function (require, exports, dat, Camera_3, Graphics_4) {
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
define("Graphics/Materials", ["require", "exports", "three"], function (require, exports, THREE) {
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
define("Viewer/Viewer", ["require", "exports", "three", "Viewer/Camera", "Viewer/CameraControls", "System/EventManager", "Graphics/Graphics", "System/Services", "Viewer/TrackballControls"], function (require, exports, THREE, Camera_4, CameraControls_1, EventManager_1, Graphics_5, Services_6, TrackballControls_1) {
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
        Object.defineProperty(Viewer.prototype, "eventManager", {
            /**
             * Gets the Event Manager.
             */
            get: function () {
                return this._eventManager;
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
define("ModelLoaders/TestModelLoader", ["require", "exports", "three", "Graphics/Graphics"], function (require, exports, THREE, Graphics_6) {
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
        function MeshViewerSettings() {
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
        //#endregion
        /**
         * Initialize the view settings that are controllable by the user
         */
        MeshViewerControls.prototype.initializeControls = function () {
            var scope = this;
            this._meshViewerSettings = new MeshViewerSettings();
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
            meshViewerOptions.open();
        };
        return MeshViewerControls;
    }());
    exports.MeshViewerControls = MeshViewerControls;
});
define("Viewer/MeshViewer", ["require", "exports", "three", "DepthBuffer/DepthBuffer", "Graphics/Graphics", "Viewer/MeshViewerControls", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, DepthBuffer_2, Graphics_7, MeshViewerControls_1, Services_7, Viewer_1) {
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
        function ModelViewerSettings() {
            this.displayGrid = true;
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
        //#endregion
        /**
         * Initialize the view settings that are controllable by the user
         */
        ModelViewerControls.prototype.initializeControls = function () {
            var scope = this;
            this._modelViewerSettings = new ModelViewerSettings();
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
            modelViewerOptions.open();
        };
        return ModelViewerControls;
    }());
    exports.ModelViewerControls = ModelViewerControls;
});
define("Viewer/ModelViewer", ["require", "exports", "three", "System/EventManager", "Viewer/ModelViewerControls", "Viewer/Viewer"], function (require, exports, THREE, EventManager_2, ModelViewerControls_1, Viewer_2) {
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
            this.eventManager.dispatchEvent(this, EventManager_2.EventType.NewModel, value);
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
        return ModelViewer;
    }(Viewer_2.Viewer));
    exports.ModelViewer = ModelViewer;
});
define("Controllers/ComposerController", ["require", "exports", "Viewer/Camera", "System/EventManager"], function (require, exports, Camera_5, EventManager_3) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ComposerController = (function () {
        /** Default constructor
         * @class ModelReliefController
         * @param composerView Mesh generation event.
         * @constructor
         */
        function ComposerController(composerView) {
            this._composerView = composerView;
            this.initialize();
        }
        //#region Initialization
        /**
         * Initialziation.
         */
        ComposerController.prototype.initialize = function () {
            this._composerView._modelView.modelViewer.eventManager.addEventListener(EventManager_3.EventType.NewModel, this.onNewModel.bind(this));
        };
        //#endregion
        //#region Event Handlers
        /**
         * Event handler for mesh generation.
         * @param event Mesh generation event.
         * @param mesh Newly-generated mesh.
         */
        ComposerController.prototype.onMeshGenerate = function (event, mesh) {
        };
        /**
         * Event handler for new model.
         * @param event NewModel event.
         * @param model Newly loaded model.
         */
        ComposerController.prototype.onNewModel = function (event, model) {
            this._composerView._modelView.modelViewer.setCameraToStandardView(Camera_5.StandardView.Front);
            this._composerView._meshView.meshViewer.setCameraToStandardView(Camera_5.StandardView.Top);
        };
        return ComposerController;
    }());
    exports.ComposerController = ComposerController;
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
define("Views/ComposerViewControls", ["require", "exports", "dat-gui", "DepthBuffer/DepthBufferFactory", "ModelExporters/OBJExporter", "System/Services"], function (require, exports, dat, DepthBufferFactory_2, OBJExporter_1, Services_8) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * ComposerViewSettings
     */
    var ComposerViewSettings = (function () {
        function ComposerViewSettings(generateRelief, saveRelief) {
            this.generateRelief = generateRelief;
            this.saveRelief = saveRelief;
        }
        return ComposerViewSettings;
    }());
    /**
     * ComposerView UI Controls.
     */
    var ComposerViewControls = (function () {
        /** Default constructor
         * @class ComposerViewControls
         * @constructor
         */
        function ComposerViewControls(composerView) {
            this._initialMeshGeneration = true;
            this._composerView = composerView;
            // UI Controls
            this.initializeControls();
        }
        //#region Event Handlers
        /**
         * Generates a relief from the current model camera.
         */
        ComposerViewControls.prototype.generateRelief = function () {
            // pixels
            var width = 512;
            var height = width / this._composerView.modelView.modelViewer.aspectRatio;
            var factory = new DepthBufferFactory_2.DepthBufferFactory({ width: width, height: height, model: this._composerView.modelView.modelViewer.model, camera: this._composerView.modelView.modelViewer.camera, addCanvasToDOM: false });
            var previewMesh = factory.meshGenerate({});
            this._composerView._meshView.meshViewer.setModel(previewMesh);
            if (this._initialMeshGeneration) {
                this._composerView._meshView.meshViewer.fitView();
                this._initialMeshGeneration = false;
            }
            // Services.consoleLogger.addInfoMessage('Relief generated');
        };
        /**
         * Saves the relief to a disk file.
         */
        ComposerViewControls.prototype.saveRelief = function () {
            var exportTag = Services_8.Services.timer.mark('Export OBJ');
            var exporter = new OBJExporter_1.OBJExporter();
            var result = exporter.parse(this._composerView.meshView.meshViewer.model);
            var request = new XMLHttpRequest();
            var viewerUrl = window.location.href;
            var postUrl = viewerUrl.replace('Viewer', 'Save');
            request.open("POST", postUrl, true);
            request.onload = function (oEvent) {
                // uploaded...
            };
            var blob = new Blob([result], { type: 'text/plain' });
            request.send(blob);
            Services_8.Services.timer.logElapsedTime(exportTag);
        };
        //#endregion
        /**
         * Initialize the view settings that are controllable by the user
         */
        ComposerViewControls.prototype.initializeControls = function () {
            var scope = this;
            this._composerViewSettings = new ComposerViewSettings(this.generateRelief.bind(this), this.saveRelief.bind(this));
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById(this._composerView.containerId);
            menuDiv.appendChild(gui.domElement);
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            //                                                                   ModelRelief                                                                //      
            // ---------------------------------------------------------------------------------------------------------------------------------------------//
            var composerViewOptions = gui.addFolder('Composer Options');
            // Generate Relief
            var controlGenerateRelief = composerViewOptions.add(this._composerViewSettings, 'generateRelief').name('Generate Relief');
            // Save Relief
            var controlSaveRelief = composerViewOptions.add(this._composerViewSettings, 'saveRelief').name('Save Relief');
            composerViewOptions.open();
        };
        return ComposerViewControls;
    }());
    exports.ComposerViewControls = ComposerViewControls;
});
define("Views/MeshView", ["require", "exports", "Viewer/MeshViewer"], function (require, exports, MeshViewer_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MeshView = (function () {
        /** Default constructor
         * @class MeshView
         * @constructor
         */
        function MeshView(containerId) {
            this._containerId = containerId;
            this.initialize();
        }
        Object.defineProperty(MeshView.prototype, "containerId", {
            //#region Properties
            /**
             * Gets the Container Id.
             */
            get: function () {
                return this._containerId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MeshView.prototype, "meshViewer", {
            /**
             * Gets the ModelViewer.
             */
            get: function () {
                return this._meshViewer;
            },
            enumerable: true,
            configurable: true
        });
        //#endregion
        //#region Event Handlers
        //#endregion
        //#region Initialization
        /**
         * Initialziation.
         */
        MeshView.prototype.initialize = function () {
            // Mesh Viewer    
            this._meshViewer = new MeshViewer_1.MeshViewer('ModelViewer', this.containerId);
        };
        return MeshView;
    }());
    exports.MeshView = MeshView;
});
define("Views/ModelView", ["require", "exports", "Viewer/ModelViewer"], function (require, exports, ModelViewer_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModelView = (function () {
        /** Default constructor
         * @class ModelView
         * @constructor
         */
        function ModelView(containerId) {
            this._containerId = containerId;
            this.initialize();
        }
        Object.defineProperty(ModelView.prototype, "containerId", {
            //#region Properties
            /**
             * Gets the Container Id.
             */
            get: function () {
                return this._containerId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelView.prototype, "modelViewer", {
            /**
             * Gets the ModelViewer.
             */
            get: function () {
                return this._modelViewer;
            },
            enumerable: true,
            configurable: true
        });
        //#endregion
        //#region Event Handlers
        //#endregion
        //#region Initialization
        /**
         * Initialziation.
         */
        ModelView.prototype.initialize = function () {
            // Model Viewer    
            this._modelViewer = new ModelViewer_1.ModelViewer('ModelViewer', this.containerId);
        };
        return ModelView;
    }());
    exports.ModelView = ModelView;
});
define("Views/ComposerView", ["require", "exports", "Controllers/ComposerController", "Views/ComposerViewControls", "ModelLoaders/Loader", "Views/MeshView", "ModelRelief", "Views/ModelView", "System/Services"], function (require, exports, ComposerController_1, ComposerViewControls_1, Loader_1, MeshView_1, ModelRelief_1, ModelView_1, Services_9) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ComposerView = (function () {
        /** Default constructor
         * @class ComposerView
         * @constructor
         */
        function ComposerView(containerId) {
            this._containerId = containerId;
            this.initialize();
        }
        Object.defineProperty(ComposerView.prototype, "containerId", {
            //#region Properties
            /**
             * Gets the Container Id.
             */
            get: function () {
                return this._containerId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComposerView.prototype, "modelView", {
            /**
             * Gets the ModelView.
             */
            get: function () {
                return this._modelView;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComposerView.prototype, "meshView", {
            /**
             * Gets the MeshViewer.
             */
            get: function () {
                return this._meshView;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComposerView.prototype, "loader", {
            /**
             * Gets the Loader.
             */
            get: function () {
                return this._loader;
            },
            enumerable: true,
            configurable: true
        });
        //#endregion
        //#region Event Handlers
        //#endregion
        //#region Initialization
        /**
         * Initialziation.
         */
        ComposerView.prototype.initialize = function () {
            Services_9.Services.consoleLogger.addInfoMessage('ModelRelief started');
            // Mesh View
            this._meshView = new MeshView_1.MeshView(ModelRelief_1.ContainerIds.MeshCanvas);
            // Model View
            this._modelView = new ModelView_1.ModelView(ModelRelief_1.ContainerIds.ModelCanvas);
            // Loader
            this._loader = new Loader_1.Loader();
            // OBJ Models
            this._loader.loadOBJModel(this._modelView.modelViewer);
            // Test Models
            //      this._loader.loadParametricTestModel(this._modelViewer, TestModel.Checkerboard);
            // View Controller
            this._composerController = new ComposerController_1.ComposerController(this);
            // View UI Controls
            this._composerViewControls = new ComposerViewControls_1.ComposerViewControls(this);
        };
        return ComposerView;
    }());
    exports.ComposerView = ComposerView;
});
define("ModelRelief", ["require", "exports", "Views/ComposerView"], function (require, exports, ComposerView_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContainerIds;
    (function (ContainerIds) {
        ContainerIds["RootContainer"] = "rootContainer";
        ContainerIds["ComposerView"] = "composerView";
        ContainerIds["ModelView"] = "modelView";
        ContainerIds["ModelCanvas"] = "modelCanvas";
        ContainerIds["MeshView"] = "meshView";
        ContainerIds["MeshCanvas"] = "meshCanvas";
    })(ContainerIds = exports.ContainerIds || (exports.ContainerIds = {}));
    var composerView = new ComposerView_1.ComposerView(ContainerIds.ComposerView);
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
define("Workbench/CameraTest", ["require", "exports", "three", "dat-gui", "Graphics/Graphics", "System/Services", "Viewer/Viewer"], function (require, exports, THREE, dat, Graphics_8, Services_10, Viewer_3) {
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
            this._logger = Services_10.Services.consoleLogger;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvU3lzdGVtL0xvZ2dlci50cyIsIlNjcmlwdHMvU3lzdGVtL1N0b3BXYXRjaC50cyIsIlNjcmlwdHMvU3lzdGVtL1NlcnZpY2VzLnRzIiwiU2NyaXB0cy9HcmFwaGljcy9HcmFwaGljcy50cyIsIlNjcmlwdHMvU3lzdGVtL01hdGgudHMiLCJTY3JpcHRzL0RlcHRoQnVmZmVyL0RlcHRoQnVmZmVyLnRzIiwiU2NyaXB0cy9TeXN0ZW0vVG9vbHMudHMiLCJTY3JpcHRzL0RlcHRoQnVmZmVyL0RlcHRoQnVmZmVyRmFjdG9yeS50cyIsIlNjcmlwdHMvVmlld2VyL0NhbWVyYS50cyIsIlNjcmlwdHMvU3lzdGVtL0V2ZW50TWFuYWdlci50cyIsIlNjcmlwdHMvTW9kZWxMb2FkZXJzL09CSkxvYWRlci50cyIsIlNjcmlwdHMvVmlld2VyL0NhbWVyYUNvbnRyb2xzLnRzIiwiU2NyaXB0cy9HcmFwaGljcy9NYXRlcmlhbHMudHMiLCJTY3JpcHRzL1ZpZXdlci9UcmFja2JhbGxDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL1ZpZXdlci50cyIsIlNjcmlwdHMvTW9kZWxMb2FkZXJzL1Rlc3RNb2RlbExvYWRlci50cyIsIlNjcmlwdHMvTW9kZWxMb2FkZXJzL0xvYWRlci50cyIsIlNjcmlwdHMvVmlld2VyL01lc2hWaWV3ZXJDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL01lc2hWaWV3ZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9Nb2RlbFZpZXdlckNvbnRyb2xzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTW9kZWxWaWV3ZXIudHMiLCJTY3JpcHRzL0NvbnRyb2xsZXJzL0NvbXBvc2VyQ29udHJvbGxlci50cyIsIlNjcmlwdHMvTW9kZWxFeHBvcnRlcnMvT0JKRXhwb3J0ZXIudHMiLCJTY3JpcHRzL1ZpZXdzL0NvbXBvc2VyVmlld0NvbnRyb2xzLnRzIiwiU2NyaXB0cy9WaWV3cy9NZXNoVmlldy50cyIsIlNjcmlwdHMvVmlld3MvTW9kZWxWaWV3LnRzIiwiU2NyaXB0cy9WaWV3cy9Db21wb3NlclZpZXcudHMiLCJTY3JpcHRzL01vZGVsUmVsaWVmLnRzIiwiU2NyaXB0cy9Vbml0VGVzdHMvVW5pdFRlc3RzLnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvQ2FtZXJhVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0RlcHRoQnVmZmVyVGVzdC50cyIsIlNjcmlwdHMvV29ya2JlbmNoL0luaGVyaXRhbmNlVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDhFQUE4RTtJQUM5RSw2RUFBNkU7SUFDN0UsdUpBQXVKO0lBQ3ZKLDZFQUE2RTtJQUM3RSw2RUFBNkU7SUFDN0UsWUFBWSxDQUFDOztJQWlCYixJQUFLLFlBS0o7SUFMRCxXQUFLLFlBQVk7UUFDYixrQ0FBb0IsQ0FBQTtRQUNwQixzQ0FBc0IsQ0FBQTtRQUN0QixnQ0FBbUIsQ0FBQTtRQUNuQixnQ0FBbUIsQ0FBQTtJQUN2QixDQUFDLEVBTEksWUFBWSxLQUFaLFlBQVksUUFLaEI7SUFFRDs7O09BR0c7SUFDSDtRQUVJOztXQUVHO1FBQ0g7UUFDQSxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILHVDQUFlLEdBQWYsVUFBaUIsT0FBZ0IsRUFBRSxZQUEyQjtZQUUxRCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxVQUFVLEdBQUcsS0FBRyxNQUFNLEdBQUcsT0FBUyxDQUFDO1lBRXZDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBRW5CLEtBQUssWUFBWSxDQUFDLEtBQUs7b0JBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzFCLEtBQUssQ0FBQztnQkFFVixLQUFLLFlBQVksQ0FBQyxPQUFPO29CQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN6QixLQUFLLENBQUM7Z0JBRVYsS0FBSyxZQUFZLENBQUMsSUFBSTtvQkFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENB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QVEsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUM7WUFDOUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDO1lBQzlCLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdEIsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQztZQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUM7WUFDOUIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV0QixNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3JCLENBQUM7UUFFQTs7OztXQUlHO1FBQ0csd0JBQWUsR0FBdEIsVUFBd0IsTUFBcUIs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QXJCWSwwQ0FBZTtJQXVCNUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQUM7SUFDdEMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDIiwiZmlsZSI6Ind3d3Jvb3QvanMvbW9kZWxyZWxpZWYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qKlxyXG4gKiBMb2dnaW5nIEludGVyZmFjZVxyXG4gKiBEaWFnbm9zdGljIGxvZ2dpbmdcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9nZ2VyIHtcclxuICAgIGFkZEVycm9yTWVzc2FnZSAoZXJyb3JNZXNzYWdlIDogc3RyaW5nKTtcclxuICAgIGFkZFdhcm5pbmdNZXNzYWdlICh3YXJuaW5nTWVzc2FnZSA6IHN0cmluZyk7XHJcbiAgICBhZGRJbmZvTWVzc2FnZSAoaW5mb01lc3NhZ2UgOiBzdHJpbmcpO1xyXG4gICAgYWRkTWVzc2FnZSAoaW5mb01lc3NhZ2UgOiBzdHJpbmcsIHN0eWxlPyA6IHN0cmluZyk7XHJcblxyXG4gICAgYWRkRW1wdHlMaW5lICgpO1xyXG5cclxuICAgIGNsZWFyTG9nKCk7XHJcbn1cclxuICAgICAgICAgXHJcbmVudW0gTWVzc2FnZUNsYXNzIHtcclxuICAgIEVycm9yICAgPSAnbG9nRXJyb3InLFxyXG4gICAgV2FybmluZyA9ICdsb2dXYXJuaW5nJyxcclxuICAgIEluZm8gICAgPSAnbG9nSW5mbycsXHJcbiAgICBOb25lICAgID0gJ2xvZ05vbmUnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb25zb2xlIGxvZ2dpbmdcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29uc29sZUxvZ2dlciBpbXBsZW1lbnRzIExvZ2dlcntcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdCBhIGdlbmVyYWwgbWVzc2FnZSBhbmQgYWRkIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRleHQuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZUNsYXNzIE1lc3NhZ2UgY2xhc3MuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2VFbnRyeSAobWVzc2FnZSA6IHN0cmluZywgbWVzc2FnZUNsYXNzIDogTWVzc2FnZUNsYXNzKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBjb25zdCBwcmVmaXggPSAnTVI6ICc7XHJcbiAgICAgICAgbGV0IGxvZ01lc3NhZ2UgPSBgJHtwcmVmaXh9JHttZXNzYWdlfWA7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobWVzc2FnZUNsYXNzKSB7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VDbGFzcy5FcnJvcjpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobG9nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZUNsYXNzLldhcm5pbmc6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4obG9nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZUNsYXNzLkluZm86XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8obG9nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZUNsYXNzLk5vbmU6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBlcnJvciBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlIEVycm9yIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkoZXJyb3JNZXNzYWdlLCBNZXNzYWdlQ2xhc3MuRXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgd2FybmluZyBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gd2FybmluZ01lc3NhZ2UgV2FybmluZyBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZFdhcm5pbmdNZXNzYWdlICh3YXJuaW5nTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeSh3YXJuaW5nTWVzc2FnZSwgTWVzc2FnZUNsYXNzLldhcm5pbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGluZm9ybWF0aW9uYWwgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIGluZm9NZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkSW5mb01lc3NhZ2UgKGluZm9NZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KGluZm9NZXNzYWdlLCBNZXNzYWdlQ2xhc3MuSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKiBAcGFyYW0gc3R5bGUgT3B0aW9uYWwgc3R5bGUuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2UgKG1lc3NhZ2UgOiBzdHJpbmcsIHN0eWxlPyA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeShtZXNzYWdlLCBNZXNzYWdlQ2xhc3MuTm9uZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGFuIGVtcHR5IGxpbmVcclxuICAgICAqL1xyXG4gICAgYWRkRW1wdHlMaW5lICgpIHtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZygnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIGxvZyBvdXRwdXRcclxuICAgICAqL1xyXG4gICAgY2xlYXJMb2cgKCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLmNsZWFyKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogSFRNTCBsb2dnaW5nXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEhUTUxMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXJ7XHJcblxyXG4gICAgcm9vdElkICAgICAgICAgICA6IHN0cmluZztcclxuICAgIHJvb3RFbGVtZW50VGFnICAgOiBzdHJpbmc7XHJcbiAgICByb290RWxlbWVudCAgICAgIDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgbWVzc2FnZVRhZyAgICAgICA6IHN0cmluZztcclxuICAgIGJhc2VNZXNzYWdlQ2xhc3MgOiBzdHJpbmdcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJvb3RJZCAgICAgICAgID0gJ2xvZ2dlclJvb3QnXHJcbiAgICAgICAgdGhpcy5yb290RWxlbWVudFRhZyA9ICd1bCc7XHJcblxyXG4gICAgICAgIHRoaXMubWVzc2FnZVRhZyAgICAgICA9ICdsaSc7XHJcbiAgICAgICAgdGhpcy5iYXNlTWVzc2FnZUNsYXNzID0gJ2xvZ01lc3NhZ2UnO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0aGlzLnJvb3RJZH1gKTtcclxuICAgICAgICBpZiAoIXRoaXMucm9vdEVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMucm9vdEVsZW1lbnRUYWcpO1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50LmlkID0gdGhpcy5yb290SWQ7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yb290RWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSBnZW5lcmFsIG1lc3NhZ2UgYW5kIGFwcGVuZCB0byB0aGUgbG9nIHJvb3QuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRleHQuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZUNsYXNzIENTUyBjbGFzcyB0byBiZSBhZGRlZCB0byBtZXNzYWdlLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlRWxlbWVudCAobWVzc2FnZSA6IHN0cmluZywgbWVzc2FnZUNsYXNzPyA6IHN0cmluZykgOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm1lc3NhZ2VUYWcpO1xyXG4gICAgICAgIG1lc3NhZ2VFbGVtZW50LnRleHRDb250ZW50ID0gbWVzc2FnZTtcclxuXHJcbiAgICAgICAgbWVzc2FnZUVsZW1lbnQuY2xhc3NOYW1lICAgPSBgJHt0aGlzLmJhc2VNZXNzYWdlQ2xhc3N9ICR7bWVzc2FnZUNsYXNzID8gbWVzc2FnZUNsYXNzIDogJyd9YDs7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWVzc2FnZUVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIGVycm9yTWVzc2FnZSBFcnJvciBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEVycm9yTWVzc2FnZSAoZXJyb3JNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQoZXJyb3JNZXNzYWdlLCBNZXNzYWdlQ2xhc3MuRXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgd2FybmluZyBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gd2FybmluZ01lc3NhZ2UgV2FybmluZyBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZFdhcm5pbmdNZXNzYWdlICh3YXJuaW5nTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KHdhcm5pbmdNZXNzYWdlLCBNZXNzYWdlQ2xhc3MuV2FybmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gaW5mb3JtYXRpb25hbCBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gaW5mb01lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRJbmZvTWVzc2FnZSAoaW5mb01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRWxlbWVudChpbmZvTWVzc2FnZSwgTWVzc2FnZUNsYXNzLkluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbWVzc2FnZSB0byB0aGUgbG9nLlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICogQHBhcmFtIHN0eWxlIE9wdGlvbmFsIENTUyBzdHlsZS5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZSAobWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlRWxlbWVudCA9IHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQobWVzc2FnZSk7XHJcbiAgICAgICAgaWYgKHN0eWxlKVxyXG4gICAgICAgICAgICBtZXNzYWdlRWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGFuIGVtcHR5IGxpbmVcclxuICAgICAqL1xyXG4gICAgYWRkRW1wdHlMaW5lICgpIHtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTE0MDU0Ny9saW5lLWJyZWFrLWluc2lkZS1hLWxpc3QtaXRlbS1nZW5lcmF0ZXMtc3BhY2UtYmV0d2Vlbi10aGUtbGluZXNcclxuLy8gICAgICB0aGlzLmFkZE1lc3NhZ2UoJzxici8+PGJyLz4nKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZSgnLicpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIGxvZyBvdXRwdXRcclxuICAgICAqL1xyXG4gICAgY2xlYXJMb2cgKCkge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zOTU1MjI5L3JlbW92ZS1hbGwtY2hpbGQtZWxlbWVudHMtb2YtYS1kb20tbm9kZS1pbi1qYXZhc2NyaXB0XHJcbiAgICAgICAgd2hpbGUgKHRoaXMucm9vdEVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMucm9vdEVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHtMb2dnZXJ9ICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIFRpbWVyIHJlY29yZC5cclxuICogQGludGVyZmFjZSBUaW1lckVudHJ5XHJcbiAqL1xyXG5pbnRlcmZhY2UgVGltZXJFbnRyeSB7XHJcblxyXG4gICAgc3RhcnRUaW1lIDogbnVtYmVyO1xyXG4gICAgaW5kZW50ICAgIDogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogU3RvcFdhdGNoXHJcbiAqIEdlbmVyYWwgZGVidWdnZXIgdGltZXIuXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFN0b3BXYXRjaCB7XHJcbiAgICBcclxuICAgIHN0YXRpYyBwcmVjaXNpb24gOiBudW1iZXIgPSAzO1xyXG5cclxuICAgIF9sb2dnZXIgICAgICAgICAgICA6IExvZ2dlcjtcclxuICAgIF9uYW1lICAgICAgICAgICAgICA6IHN0cmluZztcclxuXHJcbiAgICBfZXZlbnRzICAgICAgICAgICAgOiBhbnk7XHJcbiAgICBfYmFzZWxpbmVUaW1lICAgICAgOiBudW1iZXI7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZXJOYW1lIFRpbWVyIGlkZW50aWZpZXJcclxuICAgICAqIEBwYXJhbSB7TG9nZ2VyfSBsb2dnZXIgTG9nZ2VyXHJcbiAgICAgKiBOLkIuIExvZ2dlciBpcyBwYXNzZWQgYXMgYSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgYmVjYXVzZSBTdG9wV2F0Y2ggYW5kIFNlcnZpY2UuY29uc29sZUxvZ2dlciBhcmUgc3RhdGljIFNlcnZpY2UgcHJvcGVydGllcy5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGltZXJOYW1lIDogc3RyaW5nLCBsb2dnZXIgOiBMb2dnZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgICAgIHRoaXMuX25hbWUgICA9IHRpbWVyTmFtZTtcclxuICAgICAgICB0aGlzLl9ldmVudHMgID0ge31cclxuICAgICAgICB0aGlzLl9iYXNlbGluZVRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIG11bWJlciBvZiBwZW5kaW5nIGV2ZW50cy5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGV2ZW50Q291bnQgKCkgOiBudW1iZXIge1xyXG5cclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fZXZlbnRzKS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyB0aGUgY3VycmVudCBpbmRlbnQgbGV2ZWwuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBpbmRlbnRQcmVmaXgoKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGVudDogc3RyaW5nID0gJyAgICAnO1xyXG4gICAgICAgIHJldHVybiBpbmRlbnQucmVwZWF0KHRoaXMuZXZlbnRDb3VudCk7XHJcbiAgICB9XHJcbiAgICAgICAgICAgIFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXNldHMgdGhlIHRpbWVyLlxyXG4gICAgICovXHJcbiAgICBtYXJrKGV2ZW50IDogc3RyaW5nKSA6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCBzdGFydE1pbGxpc2Vjb25kcyA6IG51bWJlciA9IERhdGUubm93KCk7XHJcbiAgICAgICAgbGV0IGluZGVudFByZWZpeCAgICAgIDogc3RyaW5nID0gdGhpcy5pbmRlbnRQcmVmaXg7XHJcbiAgICAgICAgbGV0IHRpbWVyRW50cnkgICAgICAgIDogVGltZXJFbnRyeSA9IHsgc3RhcnRUaW1lOiBzdGFydE1pbGxpc2Vjb25kcywgaW5kZW50IDogaW5kZW50UHJlZml4fTtcclxuICAgICAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gdGltZXJFbnRyeTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYCR7aW5kZW50UHJlZml4fSR7ZXZlbnR9YCk7XHJcblxyXG4gICAgICAgIHJldHVybiBldmVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIHRoZSBlbGFwc3RlZCB0aW1lLlxyXG4gICAgICovXHJcbiAgICBsb2dFbGFwc2VkVGltZShldmVudCA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBsZXQgdGltZXJFbGFwc2VkVGltZSAgIDogbnVtYmVyID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBsZXQgZXZlbnRFbGFwc2VkVGltZSAgIDogbnVtYmVyID0gKHRpbWVyRWxhcHNlZFRpbWUgLSAoPG51bWJlcj4gKHRoaXMuX2V2ZW50c1tldmVudF0uc3RhcnRUaW1lKSkpIC8gMTAwMDtcclxuICAgICAgICBsZXQgZWxhcHNlZFRpbWVNZXNzYWdlIDogc3RyaW5nID0gZXZlbnRFbGFwc2VkVGltZS50b0ZpeGVkKFN0b3BXYXRjaC5wcmVjaXNpb24pO1xyXG4gICAgICAgIGxldCBpbmRlbnRQcmVmaXggICAgICAgOiBzdHJpbmcgPSB0aGlzLl9ldmVudHNbZXZlbnRdLmluZGVudDtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGAke2luZGVudFByZWZpeH0ke2V2ZW50fSA6ICR7ZWxhcHNlZFRpbWVNZXNzYWdlfSBzZWNgKTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGV2ZW50IGZyb20gbG9nXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudF07XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlciwgSFRNTExvZ2dlcn0gIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtTdG9wV2F0Y2h9ICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdTdG9wV2F0Y2gnXHJcbi8qKlxyXG4gKiBTZXJ2aWNlc1xyXG4gKiBHZW5lcmFsIHJ1bnRpbWUgc3VwcG9ydFxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlcyB7XHJcblxyXG4gICAgc3RhdGljIGNvbnNvbGVMb2dnZXIgOiBDb25zb2xlTG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIoKTtcclxuICAgIHN0YXRpYyBodG1sTG9nZ2VyICAgIDogSFRNTExvZ2dlciAgICA9IG5ldyBIVE1MTG9nZ2VyKCk7XHJcbiAgICBzdGF0aWMgdGltZXIgICAgICAgICA6IFN0b3BXYXRjaCAgICAgPSBuZXcgU3RvcFdhdGNoKCdNYXN0ZXInLCBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyKTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG5leHBvcnQgZW51bSBPYmplY3ROYW1lcyB7XHJcblxyXG4gICAgUm9vdCAgICAgICAgICA9ICAnUm9vdCcsXHJcblxyXG4gICAgQm91bmRpbmdCb3ggICA9ICdCb3VuZGluZyBCb3gnLFxyXG4gICAgQm94ICAgICAgICAgICA9ICdCb3gnLFxyXG4gICAgQ2FtZXJhSGVscGVyICA9ICdDYW1lcmFIZWxwZXInLFxyXG4gICAgTW9kZWxDbG9uZSAgICA9ICdNb2RlbCBDbG9uZScsXHJcbiAgICBQbGFuZSAgICAgICAgID0gJ1BsYW5lJyxcclxuICAgIFNwaGVyZSAgICAgICAgPSAnU3BoZXJlJyxcclxuICAgIFRyaWFkICAgICAgICAgPSAnVHJpYWQnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiAgR2VuZXJhbCBUSFJFRS5qcy9XZWJHTCBzdXBwb3J0IHJvdXRpbmVzXHJcbiAqICBHcmFwaGljcyBMaWJyYXJ5XHJcbiAqICBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHcmFwaGljcyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gR2VvbWV0cnlcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0R2VvbWV0cnlcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gRGlzcG9zZSBvZiByZXNvdXJjZXMgaGVsZCBieSBhIGdyYXBoaWNhbCBvYmplY3QuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gb2JqZWN0M2QgT2JqZWN0IHRvIHByb2Nlc3MuXHJcbiAgICAgKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODM1NzUyOS90aHJlZWpzLXJlbW92ZS1vYmplY3QtZnJvbS1zY2VuZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGlzcG9zZVJlc291cmNlcyhvYmplY3QzZCkgOiB2b2lkIHtcclxuIFxyXG4gICAgICAgIC8vIGxvZ2dlci5hZGRJbmZvTWVzc2FnZSAoJ1JlbW92aW5nOiAnICsgb2JqZWN0M2QubmFtZSk7XHJcbiAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCdnZW9tZXRyeScpKSB7XHJcbiAgICAgICAgICAgIG9iamVjdDNkLmdlb21ldHJ5LmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvYmplY3QzZC5oYXNPd25Qcm9wZXJ0eSgnbWF0ZXJpYWwnKSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gb2JqZWN0M2QubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgIGlmIChtYXRlcmlhbC5oYXNPd25Qcm9wZXJ0eSgnbWF0ZXJpYWxzJykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWxzID0gbWF0ZXJpYWwubWF0ZXJpYWxzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaU1hdGVyaWFsIGluIG1hdGVyaWFscykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRlcmlhbHMuaGFzT3duUHJvcGVydHkoaU1hdGVyaWFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHNbaU1hdGVyaWFsXS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob2JqZWN0M2QuaGFzT3duUHJvcGVydHkoJ3RleHR1cmUnKSkge1xyXG4gICAgICAgICAgICBvYmplY3QzZC50ZXh0dXJlLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFuIG9iamVjdCBhbmQgYWxsIGNoaWxkcmVuIGZyb20gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSBzY2VuZSBTY2VuZSBob2xkaW5nIG9iamVjdCB0byBiZSByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIHJvb3RPYmplY3QgUGFyZW50IG9iamVjdCAocG9zc2libHkgd2l0aCBjaGlsZHJlbikuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW1vdmVPYmplY3RDaGlsZHJlbihyb290T2JqZWN0IDogVEhSRUUuT2JqZWN0M0QsIHJlbW92ZVJvb3QgOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIGlmICghcm9vdE9iamVjdClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgbG9nZ2VyICA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgbGV0IHJlbW92ZXIgPSBmdW5jdGlvbiAob2JqZWN0M2QpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChvYmplY3QzZCA9PT0gcm9vdE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEdyYXBoaWNzLmRpc3Bvc2VSZXNvdXJjZXMob2JqZWN0M2QpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJvb3RPYmplY3QudHJhdmVyc2UocmVtb3Zlcik7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSByb290IGNoaWxkcmVuIGZyb20gcm9vdE9iamVjdCAoYmFja3dhcmRzISlcclxuICAgICAgICBmb3IgKGxldCBpQ2hpbGQgOiBudW1iZXIgPSAocm9vdE9iamVjdC5jaGlsZHJlbi5sZW5ndGggLSAxKTsgaUNoaWxkID49IDA7IGlDaGlsZC0tKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY2hpbGQgOiBUSFJFRS5PYmplY3QzRCA9IHJvb3RPYmplY3QuY2hpbGRyZW5baUNoaWxkXTtcclxuICAgICAgICAgICAgcm9vdE9iamVjdC5yZW1vdmUgKGNoaWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZW1vdmVSb290ICYmIHJvb3RPYmplY3QucGFyZW50KVxyXG4gICAgICAgICAgICByb290T2JqZWN0LnBhcmVudC5yZW1vdmUocm9vdE9iamVjdCk7XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGFsbCBvYmplY3RzIG9mIGEgZ2l2ZW4gbmFtZSBmcm9tIHRoZSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSBzY2VuZSBTY2VuZSB0byBwcm9jZXNzLlxyXG4gICAgICogQHBhcmFtIG9iamVjdE5hbWUgT2JqZWN0IG5hbWUgdG8gZmluZC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbW92ZUFsbEJ5TmFtZSAoc2NlbmUgOiBUSFJFRS5TY2VuZSwgb2JqZWN0TmFtZSA6IHN0cmluZykgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IG9iamVjdDogVEhSRUUuT2JqZWN0M0Q7XHJcbiAgICAgICAgd2hpbGUgKG9iamVjdCA9IHNjZW5lLmdldE9iamVjdEJ5TmFtZShvYmplY3ROYW1lKSkge1xyXG5cclxuICAgICAgICAgICAgR3JhcGhpY3MuZGlzcG9zZVJlc291cmNlcyhvYmplY3QpO1xyXG4gICAgICAgICAgICBzY2VuZS5yZW1vdmUob2JqZWN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9uZSBhbmQgdHJhbnNmb3JtIGFuIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBvYmplY3QgT2JqZWN0IHRvIGNsb25lIGFuZCB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0gbWF0cml4IFRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNsb25lQW5kVHJhbnNmb3JtT2JqZWN0IChvYmplY3QgOiBUSFJFRS5PYmplY3QzRCwgbWF0cml4PyA6IFRIUkVFLk1hdHJpeDQpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG5cclxuICAgICAgICBsZXQgbWV0aG9kVGFnIDogc3RyaW5nID0gU2VydmljZXMudGltZXIubWFyaygnY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QnKTtcclxuICAgICAgICBpZiAoIW1hdHJpeClcclxuICAgICAgICAgICAgbWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuXHJcbiAgICAgICAgLy8gY2xvbmUgb2JqZWN0IChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBjbG9uZVRhZzogc3RyaW5nID0gU2VydmljZXMudGltZXIubWFyaygnY2xvbmUnKTtcclxuICAgICAgICBsZXQgb2JqZWN0Q2xvbmUgOiBUSFJFRS5PYmplY3QzRCA9IG9iamVjdC5jbG9uZSgpO1xyXG4gICAgICAgIG9iamVjdENsb25lLnRyYXZlcnNlKG9iamVjdCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZihUSFJFRS5NZXNoKSlcclxuICAgICAgICAgICAgICAgIG9iamVjdC5nZW9tZXRyeSA9IG9iamVjdC5nZW9tZXRyeS5jbG9uZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKGNsb25lVGFnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBOLkIuIEltcG9ydGFudCEgVGhlIHBvc3Rpb24sIHJvdGF0aW9uIChxdWF0ZXJuaW9uKSBhbmQgc2NhbGUgYXJlIGNvcnJlY3QgYnV0IHRoZSBtYXRyaXggaGFzIG5vdCBiZWVuIHVwZGF0ZWQuXHJcbiAgICAgICAgLy8gVEhSRUUuanMgdXBkYXRlcyB0aGUgbWF0cml4IGluIHRoZSByZW5kZXIoKSBsb29wLlxyXG4gICAgICAgIGxldCB0cmFuc2Zvcm1UYWc6IHN0cmluZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ3RyYW5zZm9ybScpO1xyXG4gICAgICAgIG9iamVjdENsb25lLnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpOyAgICAgXHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybVxyXG4gICAgICAgIG9iamVjdENsb25lLmFwcGx5TWF0cml4KG1hdHJpeCk7XHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUodHJhbnNmb3JtVGFnKTtcclxuICAgICAgICBcclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZShtZXRob2RUYWcpO1xyXG4gICAgICAgIHJldHVybiBvYmplY3RDbG9uZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgYm91bmRpbmcgYm94IG9mIGEgdHJhbnNmb3JtZWQgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIG9iamVjdCBPYmplY3QgdG8gdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIG1hdHJpeCBUcmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94KG9iamVjdDogVEhSRUUuT2JqZWN0M0QsIG1hdHJpeDogVEhSRUUuTWF0cml4NCk6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICBsZXQgbWV0aG9kVGFnOiBzdHJpbmcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdnZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94Jyk7XHJcblxyXG4gICAgICAgIG9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTtcclxuICAgICAgICBvYmplY3QuYXBwbHlNYXRyaXgobWF0cml4KTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3g6IFRIUkVFLkJveDMgPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3Qob2JqZWN0KTtcclxuXHJcbiAgICAgICAgLy8gcmVzdG9yZSBvYmplY3RcclxuICAgICAgICBsZXQgbWF0cml4SWRlbnRpdHkgPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG4gICAgICAgIGxldCBtYXRyaXhJbnZlcnNlID0gbWF0cml4SWRlbnRpdHkuZ2V0SW52ZXJzZShtYXRyaXgsIHRydWUpO1xyXG4gICAgICAgIG9iamVjdC5hcHBseU1hdHJpeChtYXRyaXhJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUobWV0aG9kVGFnKTtcclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgYm91bmRpbmcgYm94LlxyXG4gICAgICogQHBhcmFtIG1lc2ggTWVzaCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3VuZGluZyBib3guXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwgb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEAgcmV0dXJucyBNZXNoIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tR2VvbWV0cnkocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBnZW9tZXRyeSA6IFRIUkVFLkdlb21ldHJ5LCBtYXRlcmlhbCA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2h7XHJcblxyXG4gICAgICAgIHZhciBib3VuZGluZ0JveCAgICAgOiBUSFJFRS5Cb3gzLFxyXG4gICAgICAgICAgICB3aWR0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGVwdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBib3hNZXNoICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGdlb21ldHJ5LmJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3ggKHBvc2l0aW9uLCBib3VuZGluZ0JveCwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94TWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiBib3guXHJcbiAgICAgKiBAcGFyYW0gYm94IEdlb21ldHJ5IEJveCBmcm9tIHdoaWNoIHRvIGNyZWF0ZSBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbCBvZiB0aGUgYm94LlxyXG4gICAgICogQCByZXR1cm5zIE1lc2ggb2YgdGhlIGJveC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGJvdW5kaW5nQm94IDogVEhSRUUuQm94MywgbWF0ZXJpYWwgOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBkZXB0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGJveE1lc2ggICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIHdpZHRoICA9IGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLng7XHJcbiAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdCb3gubWF4LnkgLSBib3VuZGluZ0JveC5taW4ueTtcclxuICAgICAgICBkZXB0aCAgPSBib3VuZGluZ0JveC5tYXgueiAtIGJvdW5kaW5nQm94Lm1pbi56O1xyXG5cclxuICAgICAgICBib3hNZXNoID0gdGhpcy5jcmVhdGVCb3hNZXNoIChwb3NpdGlvbiwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG1hdGVyaWFsKTtcclxuICAgICAgICBib3hNZXNoLm5hbWUgPSBPYmplY3ROYW1lcy5Cb3VuZGluZ0JveDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJveE1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBleHRlbmRzIG9mIGFuIG9iamVjdCBvcHRpb25hbGx5IGluY2x1ZGluZyBhbGwgY2hpbGRyZW4uXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRCb3VuZGluZ0JveEZyb21PYmplY3Qocm9vdE9iamVjdCA6IFRIUkVFLk9iamVjdDNEKSA6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICBsZXQgdGltZXJUYWcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKGAke3Jvb3RPYmplY3QubmFtZX06IEJvdW5kaW5nQm94YCk7ICAgICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTQ5Mjg1Ny9hbnktd2F5LXRvLWdldC1hLWJvdW5kaW5nLWJveC1mcm9tLWEtdGhyZWUtanMtb2JqZWN0M2RcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzID0gbmV3IFRIUkVFLkJveDMoKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGJvdW5kaW5nQm94LnNldEZyb21PYmplY3Qocm9vdE9iamVjdCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTtcclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICAgICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgYm94IG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgdGhlIGJveC5cclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIGRlcHRoIERlcHRoLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE9wdGlvbmFsIG1hdGVyaWFsLlxyXG4gICAgICogQHJldHVybnMgQm94IG1lc2guXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVCb3hNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgd2lkdGggOiBudW1iZXIsIGhlaWdodCA6IG51bWJlciwgZGVwdGggOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICB2YXIgXHJcbiAgICAgICAgICAgIGJveEdlb21ldHJ5ICA6IFRIUkVFLkJveEdlb21ldHJ5LFxyXG4gICAgICAgICAgICBib3hNYXRlcmlhbCAgOiBUSFJFRS5NYXRlcmlhbCxcclxuICAgICAgICAgICAgYm94ICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgYm94R2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2lkdGgsIGhlaWdodCwgZGVwdGgpO1xyXG4gICAgICAgIGJveEdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG5cclxuICAgICAgICBib3hNYXRlcmlhbCA9IG1hdGVyaWFsIHx8IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwZmYsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgYm94ID0gbmV3IFRIUkVFLk1lc2goIGJveEdlb21ldHJ5LCBib3hNYXRlcmlhbCk7XHJcbiAgICAgICAgYm94Lm5hbWUgPSBPYmplY3ROYW1lcy5Cb3g7XHJcbiAgICAgICAgYm94LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHBsYW5lIG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gTG9jYXRpb24gb2YgdGhlIHBsYW5lLlxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgT3B0aW9uYWwgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBQbGFuZSBtZXNoLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlUGxhbmVNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgd2lkdGggOiBudW1iZXIsIGhlaWdodCA6IG51bWJlciwgbWF0ZXJpYWw/IDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBwbGFuZUdlb21ldHJ5ICA6IFRIUkVFLlBsYW5lR2VvbWV0cnksXHJcbiAgICAgICAgICAgIHBsYW5lTWF0ZXJpYWwgIDogVEhSRUUuTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIHBsYW5lICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgcGxhbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHdpZHRoLCBoZWlnaHQpOyAgICAgICBcclxuICAgICAgICBwbGFuZU1hdGVyaWFsID0gbWF0ZXJpYWwgfHwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDBmZiwgb3BhY2l0eTogMS4wfSApO1xyXG5cclxuICAgICAgICBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBsYW5lTWF0ZXJpYWwpO1xyXG4gICAgICAgIHBsYW5lLm5hbWUgPSBPYmplY3ROYW1lcy5QbGFuZTtcclxuICAgICAgICBwbGFuZS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBsYW5lO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgc3BoZXJlIG1lc2guXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gT3JpZ2luIG9mIHRoZSBzcGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gcmFkaXVzIFJhZGl1cy5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVNwaGVyZU1lc2gocG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCByYWRpdXMgOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIHZhciBzcGhlcmVHZW9tZXRyeSAgOiBUSFJFRS5TcGhlcmVHZW9tZXRyeSxcclxuICAgICAgICAgICAgc2VnbWVudENvdW50ICAgIDogbnVtYmVyID0gMzIsXHJcbiAgICAgICAgICAgIHNwaGVyZU1hdGVyaWFsICA6IFRIUkVFLk1hdGVyaWFsLFxyXG4gICAgICAgICAgICBzcGhlcmUgICAgICAgICAgOiBUSFJFRS5NZXNoO1xyXG5cclxuICAgICAgICBzcGhlcmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShyYWRpdXMsIHNlZ21lbnRDb3VudCwgc2VnbWVudENvdW50KTtcclxuICAgICAgICBzcGhlcmVHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgc3BoZXJlTWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgc3BoZXJlID0gbmV3IFRIUkVFLk1lc2goIHNwaGVyZUdlb21ldHJ5LCBzcGhlcmVNYXRlcmlhbCApO1xyXG4gICAgICAgIHNwaGVyZS5uYW1lID0gT2JqZWN0TmFtZXMuU3BoZXJlO1xyXG4gICAgICAgIHNwaGVyZS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNwaGVyZTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgbGluZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gc3RhcnRQb3NpdGlvbiBTdGFydCBwb2ludC5cclxuICAgICAqIEBwYXJhbSBlbmRQb3NpdGlvbiBFbmQgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgQ29sb3IuXHJcbiAgICAgKiBAcmV0dXJucyBMaW5lIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVMaW5lKHN0YXJ0UG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBlbmRQb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGNvbG9yIDogbnVtYmVyKSA6IFRIUkVFLkxpbmUge1xyXG5cclxuICAgICAgICB2YXIgbGluZSAgICAgICAgICAgIDogVEhSRUUuTGluZSxcclxuICAgICAgICAgICAgbGluZUdlb21ldHJ5ICAgIDogVEhSRUUuR2VvbWV0cnksXHJcbiAgICAgICAgICAgIG1hdGVyaWFsICAgICAgICA6IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBsaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgICAgICBsaW5lR2VvbWV0cnkudmVydGljZXMucHVzaCAoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pO1xyXG5cclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogY29sb3J9ICk7XHJcbiAgICAgICAgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGxpbmVHZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBheGVzIHRyaWFkLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIE9yaWdpbiBvZiB0aGUgdHJpYWQuXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIExlbmd0aCBvZiB0aGUgY29vcmRpbmF0ZSBhcnJvdy5cclxuICAgICAqIEBwYXJhbSBoZWFkTGVuZ3RoIExlbmd0aCBvZiB0aGUgYXJyb3cgaGVhZC5cclxuICAgICAqIEBwYXJhbSBoZWFkV2lkdGggV2lkdGggb2YgdGhlIGFycm93IGhlYWQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVXb3JsZEF4ZXNUcmlhZChwb3NpdGlvbj8gOiBUSFJFRS5WZWN0b3IzLCBsZW5ndGg/IDogbnVtYmVyLCBoZWFkTGVuZ3RoPyA6IG51bWJlciwgaGVhZFdpZHRoPyA6IG51bWJlcikgOiBUSFJFRS5PYmplY3QzRCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0cmlhZEdyb3VwICAgICAgOiBUSFJFRS5PYmplY3QzRCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpLFxyXG4gICAgICAgICAgICBhcnJvd1Bvc2l0aW9uICAgOiBUSFJFRS5WZWN0b3IzICA9IHBvc2l0aW9uIHx8bmV3IFRIUkVFLlZlY3RvcjMoKSxcclxuICAgICAgICAgICAgYXJyb3dMZW5ndGggICAgIDogbnVtYmVyID0gbGVuZ3RoICAgICB8fCAxNSxcclxuICAgICAgICAgICAgYXJyb3dIZWFkTGVuZ3RoIDogbnVtYmVyID0gaGVhZExlbmd0aCB8fCAxLFxyXG4gICAgICAgICAgICBhcnJvd0hlYWRXaWR0aCAgOiBudW1iZXIgPSBoZWFkV2lkdGggIHx8IDE7XHJcblxyXG4gICAgICAgIHRyaWFkR3JvdXAuYWRkKG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSwgYXJyb3dQb3NpdGlvbiwgYXJyb3dMZW5ndGgsIDB4ZmYwMDAwLCBhcnJvd0hlYWRMZW5ndGgsIGFycm93SGVhZFdpZHRoKSk7XHJcbiAgICAgICAgdHJpYWRHcm91cC5hZGQobmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApLCBhcnJvd1Bvc2l0aW9uLCBhcnJvd0xlbmd0aCwgMHgwMGZmMDAsIGFycm93SGVhZExlbmd0aCwgYXJyb3dIZWFkV2lkdGgpKTtcclxuICAgICAgICB0cmlhZEdyb3VwLmFkZChuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSksIGFycm93UG9zaXRpb24sIGFycm93TGVuZ3RoLCAweDAwMDBmZiwgYXJyb3dIZWFkTGVuZ3RoLCBhcnJvd0hlYWRXaWR0aCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJpYWRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXhlcyBncmlkLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uICBPcmlnaW4gb2YgdGhlIGF4ZXMgZ3JpZC5cclxuICAgICAqIEBwYXJhbSBzaXplIFNpemUgb2YgdGhlIGdyaWQuXHJcbiAgICAgKiBAcGFyYW0gc3RlcCBHcmlkIGxpbmUgaW50ZXJ2YWxzLlxyXG4gICAgICogQHJldHVybnMgR3JpZCBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVXb3JsZEF4ZXNHcmlkKHBvc2l0aW9uPyA6IFRIUkVFLlZlY3RvcjMsIHNpemU/IDogbnVtYmVyLCBzdGVwPyA6IG51bWJlcikgOiBUSFJFRS5PYmplY3QzRCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciBncmlkR3JvdXAgICAgICAgOiBUSFJFRS5PYmplY3QzRCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpLFxyXG4gICAgICAgICAgICBncmlkUG9zaXRpb24gICAgOiBUSFJFRS5WZWN0b3IzICA9IHBvc2l0aW9uIHx8bmV3IFRIUkVFLlZlY3RvcjMoKSxcclxuICAgICAgICAgICAgZ3JpZFNpemUgICAgICAgIDogbnVtYmVyID0gc2l6ZSB8fCAxMCxcclxuICAgICAgICAgICAgZ3JpZFN0ZXAgICAgICAgIDogbnVtYmVyID0gc3RlcCB8fCAxLFxyXG4gICAgICAgICAgICBjb2xvckNlbnRlcmxpbmUgOiBudW1iZXIgPSAgMHhmZjAwMDAwMCxcclxuICAgICAgICAgICAgeHlHcmlkICAgICAgICAgICA6IFRIUkVFLkdyaWRIZWxwZXIsXHJcbiAgICAgICAgICAgIHl6R3JpZCAgICAgICAgICAgOiBUSFJFRS5HcmlkSGVscGVyLFxyXG4gICAgICAgICAgICB6eEdyaWQgICAgICAgICAgIDogVEhSRUUuR3JpZEhlbHBlcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgeHlHcmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoZ3JpZFNpemUsIGdyaWRTdGVwKTtcclxuICAgICAgICB4eUdyaWQuc2V0Q29sb3JzKGNvbG9yQ2VudGVybGluZSwgMHhmZjAwMDApO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi5jb3B5KGdyaWRQb3NpdGlvbi5jbG9uZSgpKTtcclxuICAgICAgICB4eUdyaWQucm90YXRlT25BeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDEsIDAsIDApLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgeHlHcmlkLnBvc2l0aW9uLnggKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgeHlHcmlkLnBvc2l0aW9uLnkgKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgZ3JpZEdyb3VwLmFkZCh4eUdyaWQpO1xyXG5cclxuICAgICAgICB5ekdyaWQgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcihncmlkU2l6ZSwgZ3JpZFN0ZXApO1xyXG4gICAgICAgIHl6R3JpZC5zZXRDb2xvcnMoY29sb3JDZW50ZXJsaW5lLCAweDAwZmYwMCk7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLmNvcHkoZ3JpZFBvc2l0aW9uLmNsb25lKCkpO1xyXG4gICAgICAgIHl6R3JpZC5yb3RhdGVPbkF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB5ekdyaWQucG9zaXRpb24ueSArPSBncmlkU2l6ZTtcclxuICAgICAgICB5ekdyaWQucG9zaXRpb24ueiArPSBncmlkU2l6ZTtcclxuICAgICAgICBncmlkR3JvdXAuYWRkKHl6R3JpZCk7XHJcblxyXG4gICAgICAgIHp4R3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKGdyaWRTaXplLCBncmlkU3RlcCk7XHJcbiAgICAgICAgenhHcmlkLnNldENvbG9ycyhjb2xvckNlbnRlcmxpbmUsIDB4MDAwMGZmKTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24uY29weShncmlkUG9zaXRpb24uY2xvbmUoKSk7XHJcbiAgICAgICAgenhHcmlkLnJvdGF0ZU9uQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHp4R3JpZC5wb3NpdGlvbi56ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIHp4R3JpZC5wb3NpdGlvbi54ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIGdyaWRHcm91cC5hZGQoenhHcmlkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdyaWRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQWRkcyBhIGNhbWVyYSBoZWxwZXIgdG8gYSBzY2VuZSB0byB2aXN1YWxpemUgdGhlIGNhbWVyYSBwb3NpdGlvbi5cclxuICAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgdG8gYW5ub3RhdGUuXHJcbiAgICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEgdG8gY29uc3RydWN0IGhlbHBlciAobWF5IGJlIG51bGwpLlxyXG4gICAgICAqL1xyXG4gICAgc3RhdGljIGFkZENhbWVyYUhlbHBlciAoY2FtZXJhIDogVEhSRUUuQ2FtZXJhLCBzY2VuZSA6IFRIUkVFLlNjZW5lLCBtb2RlbCA6IFRIUkVFLkdyb3VwKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoIWNhbWVyYSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBjYW1lcmEgcHJvcGVydGllc1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZCAgICAgICAgOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UgOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjb25zdHJ1Y3Qgcm9vdCBvYmplY3Qgb2YgdGhlIGhlbHBlclxyXG4gICAgICAgIGxldCBjYW1lcmFIZWxwZXIgID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgY2FtZXJhSGVscGVyLm5hbWUgPSBPYmplY3ROYW1lcy5DYW1lcmFIZWxwZXI7ICAgICAgIFxyXG4gICAgICAgIGNhbWVyYUhlbHBlci52aXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gbW9kZWwgYm91bmRpbmcgYm94IChWaWV3IGNvb3JkaW5hdGVzKVxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4ZmYwMDAwLCB3aXJlZnJhbWU6IHRydWUsIHRyYW5zcGFyZW50OiBmYWxzZSwgb3BhY2l0eTogMC4yIH0pXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldzogVEhSRUUuQm94MyA9IEdyYXBoaWNzLmdldFRyYW5zZm9ybWVkQm91bmRpbmdCb3gobW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7ICAgICAgICBcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3TWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveChib3VuZGluZ0JveFZpZXcuZ2V0Q2VudGVyKCksIGJvdW5kaW5nQm94VmlldywgYm91bmRpbmdCb3hNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFdvcmxkTWVzaCA9IEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KGJvdW5kaW5nQm94Vmlld01lc2gsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBjYW1lcmFIZWxwZXIuYWRkKGJvdW5kaW5nQm94V29ybGRNZXNoKTtcclxuXHJcbiAgICAgICAgLy8gcG9zaXRpb25cclxuICAgICAgICBsZXQgcG9zaXRpb24gPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKGNhbWVyYS5wb3NpdGlvbiwgMyk7XHJcbiAgICAgICAgY2FtZXJhSGVscGVyLmFkZChwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIC8vIGNhbWVyYSB0YXJnZXQgbGluZVxyXG4gICAgICAgIGxldCB1bml0VGFyZ2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xyXG4gICAgICAgIHVuaXRUYXJnZXQuYXBwbHlRdWF0ZXJuaW9uKGNhbWVyYS5xdWF0ZXJuaW9uKTtcclxuICAgICAgICBsZXQgc2NhbGVkVGFyZ2V0IDogVEhSRUUuVmVjdG9yMztcclxuICAgICAgICBzY2FsZWRUYXJnZXQgPSB1bml0VGFyZ2V0Lm11bHRpcGx5U2NhbGFyKC1ib3VuZGluZ0JveFZpZXcubWF4LnopO1xyXG5cclxuICAgICAgICBsZXQgc3RhcnRQb2ludCA6IFRIUkVFLlZlY3RvcjMgPSBjYW1lcmEucG9zaXRpb247XHJcbiAgICAgICAgbGV0IGVuZFBvaW50ICAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgICAgICBlbmRQb2ludC5hZGRWZWN0b3JzKHN0YXJ0UG9pbnQsIHNjYWxlZFRhcmdldCk7XHJcbiAgICAgICAgbGV0IHRhcmdldExpbmUgOiBUSFJFRS5MaW5lID0gR3JhcGhpY3MuY3JlYXRlTGluZShzdGFydFBvaW50LCBlbmRQb2ludCwgMHgwMGZmMDApO1xyXG4gICAgICAgIGNhbWVyYUhlbHBlci5hZGQodGFyZ2V0TGluZSk7XHJcblxyXG4gICAgICAgIHNjZW5lLmFkZChjYW1lcmFIZWxwZXIpO1xyXG4gICAgfVxyXG5cclxuICAgICAvKipcclxuICAgICAgKiBBZGRzIGEgY29vcmRpbmF0ZSBheGlzIGhlbHBlciB0byBhIHNjZW5lIHRvIHZpc3VhbGl6ZSB0aGUgd29ybGQgYXhlcy5cclxuICAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgdG8gYW5ub3RhdGUuXHJcbiAgICAgICovXHJcbiAgICBzdGF0aWMgYWRkQXhpc0hlbHBlciAoc2NlbmUgOiBUSFJFRS5TY2VuZSwgc2l6ZSA6IG51bWJlcikgOiB2b2lke1xyXG5cclxuICAgICAgICBsZXQgYXhpc0hlbHBlciA9IG5ldyBUSFJFRS5BeGlzSGVscGVyKHNpemUpO1xyXG4gICAgICAgIGF4aXNIZWxwZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgc2NlbmUuYWRkKGF4aXNIZWxwZXIpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBDb29yZGluYXRlIENvbnZlcnNpb25cclxuICAgIC8qXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvLyAgQ29vcmRpbmF0ZSBTeXN0ZW1zXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICBGUkFNRVx0ICAgICAgICAgICAgRVhBTVBMRVx0XHRcdFx0XHRcdFx0XHRcdFx0U1BBQ0UgICAgICAgICAgICAgICAgICAgICAgVU5JVFMgICAgICAgICAgICAgICAgICAgICAgIE5PVEVTXHJcblxyXG4gICAgTW9kZWwgICAgICAgICAgICAgICBDYXRhbG9nIFdlYkdMOiBNb2RlbCwgQmFuZEVsZW1lbnQgQmxvY2sgICAgIG9iamVjdCAgICAgICAgICAgICAgICAgICAgICBtbSAgICAgICAgICAgICAgICAgICAgICAgICAgUmhpbm8gZGVmaW5pdGlvbnNcclxuICAgIFdvcmxkICAgICAgICAgICAgICAgRGVzaWduIE1vZGVsXHRcdFx0XHRcdFx0XHRcdHdvcmxkICAgICAgICAgICAgICAgICAgICAgICBtbSBcclxuICAgIFZpZXcgICAgICAgICAgICAgICAgQ2FtZXJhICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3ICAgICAgICAgICAgICAgICAgICAgICAgbW1cclxuICAgIERldmljZSAgICAgICAgICAgICAgTm9ybWFsaXplZCB2aWV3XHRcdFx0XHRcdFx0XHQgICAgZGV2aWNlICAgICAgICAgICAgICAgICAgICAgIFsoLTEsIC0xKSwgKDEsIDEpXVxyXG4gICAgU2NyZWVuLlBhZ2UgICAgICAgICBIVE1MIHBhZ2VcdFx0XHRcdFx0XHRcdFx0XHRzY3JlZW4gICAgICAgICAgICAgICAgICAgICAgcHggICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCBhdCBUb3AgTGVmdCwgK1kgZG93biAgICBIVE1MIHBhZ2VcclxuICAgIFNjcmVlbi5DbGllbnQgICAgICAgQnJvd3NlciB2aWV3IHBvcnQgXHRcdFx0XHRcdFx0ICAgIHNjcmVlbiAgICAgICAgICAgICAgICAgICAgICBweCAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwIGF0IFRvcCBMZWZ0LCArWSBkb3duICAgIGJyb3dzZXIgd2luZG93XHJcbiAgICBTY3JlZW4uQ29udGFpbmVyICAgIERPTSBjb250YWluZXJcdFx0XHRcdFx0XHRcdFx0c2NyZWVuICAgICAgICAgICAgICAgICAgICAgIHB4ICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAgYXQgVG9wIExlZnQsICtZIGRvd24gICAgSFRNTCBjYW52YXNcclxuXHJcbiAgICBNb3VzZSBFdmVudCBQcm9wZXJ0aWVzXHJcbiAgICBodHRwOi8vd3d3LmphY2tsbW9vcmUuY29tL25vdGVzL21vdXNlLXBvc2l0aW9uL1xyXG4gICAgKi9cclxuICAgICAgICBcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0V29ybGQgQ29vcmRpbmF0ZXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYSBKUXVlcnkgZXZlbnQgdG8gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgRXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEByZXR1cm5zIFdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgd29ybGRDb29yZGluYXRlc0Zyb21KUUV2ZW50IChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnksIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IzIHtcclxuXHJcbiAgICAgICAgdmFyIHdvcmxkQ29vcmRpbmF0ZXMgICAgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCA6IFRIUkVFLlZlY3RvcjMsXHJcbiAgICAgICAgICAgIGRldmljZVogICAgICAgICAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzMkQgPSB0aGlzLmRldmljZUNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGRldmljZVogPSAoY2FtZXJhIGluc3RhbmNlb2YgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpID8gMC41IDogMS4wO1xyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgPSBuZXcgVEhSRUUuVmVjdG9yMyhkZXZpY2VDb29yZGluYXRlczJELngsIGRldmljZUNvb3JkaW5hdGVzMkQueSwgZGV2aWNlWik7XHJcblxyXG4gICAgICAgIHdvcmxkQ29vcmRpbmF0ZXMgPSBkZXZpY2VDb29yZGluYXRlczNELnVucHJvamVjdChjYW1lcmEpO1xyXG5cclxuICAgICAgICByZXR1cm4gd29ybGRDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFZpZXcgQ29vcmRpbmF0ZXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIHZpZXcgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yIFdvcmxkIGNvb3JkaW5hdGUgdmVjdG9yIHRvIGNvbnZlcnQuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEByZXR1cm5zIFZpZXcgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB2aWV3Q29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjMge1xyXG5cclxuICAgICAgICB2YXIgcG9zaXRpb24gICAgICAgICAgOiBUSFJFRS5WZWN0b3IzID0gdmVjdG9yLmNsb25lKCksICBcclxuICAgICAgICAgICAgdmlld0Nvb3JkaW5hdGVzICAgOiBUSFJFRS5WZWN0b3IzO1xyXG5cclxuICAgICAgICB2aWV3Q29vcmRpbmF0ZXMgPSBwb3NpdGlvbi5hcHBseU1hdHJpeDQoY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aWV3Q29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHREZXZpY2UgQ29vcmRpbmF0ZXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYSBKUXVlcnkgZXZlbnQgdG8gbm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHJldHVybnMgTm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50IChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnkpIDogVEhSRUUuVmVjdG9yMiB7XHJcblxyXG4gICAgICAgIHZhciBkZXZpY2VDb29yZGluYXRlcyAgICAgICAgICAgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcyAgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICByYXRpb1gsICByYXRpb1kgICAgICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBkZXZpY2VYLCBkZXZpY2VZICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcyA9IHRoaXMuc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCwgY29udGFpbmVyKTtcclxuICAgICAgICByYXRpb1ggPSBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy54IC8gY29udGFpbmVyLndpZHRoKCk7XHJcbiAgICAgICAgcmF0aW9ZID0gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueSAvIGNvbnRhaW5lci5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgZGV2aWNlWCA9ICsoKHJhdGlvWCAqIDIpIC0gMSk7ICAgICAgICAgICAgICAgICAvLyBbLTEsIDFdXHJcbiAgICAgICAgZGV2aWNlWSA9IC0oKHJhdGlvWSAqIDIpIC0gMSk7ICAgICAgICAgICAgICAgICAvLyBbLTEsIDFdXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMgPSBuZXcgVEhSRUUuVmVjdG9yMihkZXZpY2VYLCBkZXZpY2VZKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRldmljZUNvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgd29ybGQgY29vcmRpbmF0ZXMgdG8gZGV2aWNlIGNvb3JkaW5hdGVzIFstMSwgMV0uXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yICBXb3JsZCBjb29yZGluYXRlcyB2ZWN0b3IuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIENhbWVyYS5cclxuICAgICAqIEBwcmV0dXJucyBEZXZpY2UgY29vcmluZGF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkZXZpY2VDb29yZGluYXRlc0Zyb21Xb3JsZENvb3JkaW5hdGVzICh2ZWN0b3IgOiBUSFJFRS5WZWN0b3IzLCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvaXNzdWVzLzc4XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLCAgXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzMkQgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCAgICAgICAgOiBUSFJFRS5WZWN0b3IzO1xyXG5cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEID0gcG9zaXRpb24ucHJvamVjdChjYW1lcmEpO1xyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzMkQgPSBuZXcgVEhSRUUuVmVjdG9yMihkZXZpY2VDb29yZGluYXRlczNELngsIGRldmljZUNvb3JkaW5hdGVzM0QueSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXZpY2VDb29yZGluYXRlczJEO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0U2NyZWVuIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIFBhZ2UgY29vcmRpbmF0ZXMgZnJvbSBhIEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gKHBhZ2UpIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuUGFnZUNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2NyZWVuUGFnZUNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHNjcmVlblBhZ2VDb29yZGluYXRlcy54ID0gZXZlbnQucGFnZVg7XHJcbiAgICAgICAgc2NyZWVuUGFnZUNvb3JkaW5hdGVzLnkgPSBldmVudC5wYWdlWTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNjcmVlblBhZ2VDb29yZGluYXRlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgZnJvbSBhIEpRdWVyeSBldmVudC5cclxuICAgICAqIENsaWVudCBjb29yZGluYXRlcyBhcmUgcmVsYXRpdmUgdG8gdGhlIDxicm93c2VyPiB2aWV3IHBvcnQuIElmIHRoZSBkb2N1bWVudCBoYXMgYmVlbiBzY3JvbGxlZCBpdCB3aWxsXHJcbiAgICAgKiBiZSBkaWZmZXJlbnQgdGhhbiB0aGUgcGFnZSBjb29yZGluYXRlcyB3aGljaCBhcmUgYWx3YXlzIHJlbGF0aXZlIHRvIHRoZSB0b3AgbGVmdCBvZiB0aGUgPGVudGlyZT4gSFRNTCBwYWdlIGRvY3VtZW50LlxyXG4gICAgICogaHR0cDovL3d3dy5iZW5uYWRlbC5jb20vYmxvZy8xODY5LWpxdWVyeS1tb3VzZS1ldmVudHMtcGFnZXgteS12cy1jbGllbnR4LXkuaHRtXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIGNsaWVudCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXMueCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXMueSA9IGV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5DbGllbnRDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIEpRdWVyeSBldmVudCBjb29yZGluYXRlcyB0byBzY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5Db250YWluZXJDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSkgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcclxuICAgICAgICAgICAgY29udGFpbmVyT2Zmc2V0ICAgICAgICAgICAgOiBKUXVlcnlDb29yZGluYXRlcyxcclxuICAgICAgICAgICAgcGFnZVgsIHBhZ2VZICAgICAgICAgICAgICAgOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGNvbnRhaW5lck9mZnNldCA9IGNvbnRhaW5lci5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgLy8gSlF1ZXJ5IGRvZXMgbm90IHNldCBwYWdlWC9wYWdlWSBmb3IgRHJvcCBldmVudHMuIFRoZXkgYXJlIGRlZmluZWQgaW4gdGhlIG9yaWdpbmFsRXZlbnQgbWVtYmVyLlxyXG4gICAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVggfHwgKDxhbnk+KGV2ZW50Lm9yaWdpbmFsRXZlbnQpKS5wYWdlWDtcclxuICAgICAgICBwYWdlWSA9IGV2ZW50LnBhZ2VZIHx8ICg8YW55PihldmVudC5vcmlnaW5hbEV2ZW50KSkucGFnZVk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnggPSBwYWdlWCAtIGNvbnRhaW5lck9mZnNldC5sZWZ0O1xyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnkgPSBwYWdlWSAtIGNvbnRhaW5lck9mZnNldC50b3A7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcztcclxuICAgIH1cclxuICBcclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgd29ybGQgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSB2ZWN0b3IgV29ybGQgdmVjdG9yLlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9pc3N1ZXMvNzhcclxuICAgICAgICB2YXIgcG9zaXRpb24gICAgICAgICAgICAgICAgICAgOiBUSFJFRS5WZWN0b3IzID0gdmVjdG9yLmNsb25lKCksXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzICAgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyLFxyXG4gICAgICAgICAgICBsZWZ0ICAgICAgICAgICAgICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgdG9wICAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8vIFsoLTEsIC0xKSwgKDEsIDEpXVxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzID0gdGhpcy5kZXZpY2VDb29yZGluYXRlc0Zyb21Xb3JsZENvb3JkaW5hdGVzKHBvc2l0aW9uLCBjYW1lcmEpO1xyXG4gICAgICAgIGxlZnQgPSAoKCtkZXZpY2VDb29yZGluYXRlcy54ICsgMSkgLyAyKSAqIGNvbnRhaW5lci53aWR0aCgpO1xyXG4gICAgICAgIHRvcCAgPSAoKC1kZXZpY2VDb29yZGluYXRlcy55ICsgMSkgLyAyKSAqIGNvbnRhaW5lci5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgPSBuZXcgVEhSRUUuVmVjdG9yMihsZWZ0LCB0b3ApO1xyXG4gICAgICAgIHJldHVybiBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcztcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW50ZXJzZWN0aW9uc1xyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIEludGVyc2VjdGlvbnNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFJheWNhc3RlciB0aHJvdWdoIHRoZSBtb3VzZSB3b3JsZCBwb3NpdGlvbi5cclxuICAgICAqIEBwYXJhbSBtb3VzZVdvcmxkIFdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBUSFJFRS5SYXljYXN0ZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByYXljYXN0ZXJGcm9tTW91c2UgKG1vdXNlV29ybGQgOiBUSFJFRS5WZWN0b3IzLCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuUmF5Y2FzdGVye1xyXG5cclxuICAgICAgICB2YXIgcmF5T3JpZ2luICA6IFRIUkVFLlZlY3RvcjMgPSBuZXcgVEhSRUUuVmVjdG9yMyAobW91c2VXb3JsZC54LCBtb3VzZVdvcmxkLnksIGNhbWVyYS5wb3NpdGlvbi56KSxcclxuICAgICAgICAgICAgd29ybGRQb2ludCA6IFRIUkVFLlZlY3RvcjMgPSBuZXcgVEhSRUUuVmVjdG9yMyhtb3VzZVdvcmxkLngsIG1vdXNlV29ybGQueSwgbW91c2VXb3JsZC56KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRvb2xzLmNvbnNvbGVMb2coJ1dvcmxkIG1vdXNlIGNvb3JkaW5hdGVzOiAnICsgd29ybGRQb2ludC54ICsgJywgJyArIHdvcmxkUG9pbnQueSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0cnVjdCByYXkgZnJvbSBjYW1lcmEgdG8gbW91c2Ugd29ybGRcclxuICAgICAgICB2YXIgcmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlciAocmF5T3JpZ2luLCB3b3JsZFBvaW50LnN1YiAocmF5T3JpZ2luKS5ub3JtYWxpemUoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiByYXljYXN0ZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGZpcnN0IEludGVyc2VjdGlvbiBsb2NhdGVkIGJ5IHRoZSBjdXJzb3IuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcGFyYW0gc2NlbmVPYmplY3RzIEFycmF5IG9mIHNjZW5lIG9iamVjdHMuXHJcbiAgICAgKiBAcGFyYW0gcmVjdXJzZSBSZWN1cnNlIHRocm91Z2ggb2JqZWN0cy5cclxuICAgICAqIEByZXR1cm5zIEZpcnN0IGludGVyc2VjdGlvbiB3aXRoIHNjcmVlbiBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Rmlyc3RJbnRlcnNlY3Rpb24oZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEsIHNjZW5lT2JqZWN0cyA6IFRIUkVFLk9iamVjdDNEW10sIHJlY3Vyc2UgOiBib29sZWFuKSA6IFRIUkVFLkludGVyc2VjdGlvbiB7XHJcblxyXG4gICAgICAgIHZhciByYXljYXN0ZXIgICAgICAgICAgOiBUSFJFRS5SYXljYXN0ZXIsXHJcbiAgICAgICAgICAgIG1vdXNlV29ybGQgICAgICAgICA6IFRIUkVFLlZlY3RvcjMsXHJcbiAgICAgICAgICAgIGlJbnRlcnNlY3Rpb24gICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgaW50ZXJzZWN0aW9uICAgICAgIDogVEhSRUUuSW50ZXJzZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gY29uc3RydWN0IHJheSBmcm9tIGNhbWVyYSB0byBtb3VzZSB3b3JsZFxyXG4gICAgICAgIG1vdXNlV29ybGQgPSBHcmFwaGljcy53b3JsZENvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lciwgY2FtZXJhKTtcclxuICAgICAgICByYXljYXN0ZXIgID0gR3JhcGhpY3MucmF5Y2FzdGVyRnJvbU1vdXNlIChtb3VzZVdvcmxkLCBjYW1lcmEpO1xyXG5cclxuICAgICAgICAvLyBmaW5kIGFsbCBvYmplY3QgaW50ZXJzZWN0aW9uc1xyXG4gICAgICAgIHZhciBpbnRlcnNlY3RzIDogVEhSRUUuSW50ZXJzZWN0aW9uW10gPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyAoc2NlbmVPYmplY3RzLCByZWN1cnNlKTtcclxuXHJcbiAgICAgICAgLy8gbm8gaW50ZXJzZWN0aW9uP1xyXG4gICAgICAgIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHVzZSBmaXJzdDsgcmVqZWN0IGxpbmVzIChUcmFuc2Zvcm0gRnJhbWUpXHJcbiAgICAgICAgZm9yIChpSW50ZXJzZWN0aW9uID0gMDsgaUludGVyc2VjdGlvbiA8IGludGVyc2VjdHMubGVuZ3RoOyBpSW50ZXJzZWN0aW9uKyspIHtcclxuXHJcbiAgICAgICAgICAgIGludGVyc2VjdGlvbiA9IGludGVyc2VjdHNbaUludGVyc2VjdGlvbl07XHJcbiAgICAgICAgICAgIGlmICghKGludGVyc2VjdGlvbi5vYmplY3QgaW5zdGFuY2VvZiBUSFJFRS5MaW5lKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcnNlY3Rpb247XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBIZWxwZXJzXHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvLyAgSGVscGVyc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgV2ViR0wgdGFyZ2V0IGNhbnZhcy5cclxuICAgICAqIEBwYXJhbSBpZCBET00gaWQgZm9yIGNhbnZhcy5cclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aCBvZiBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodCBvZiBjYW52YXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0aWFsaXplQ2FudmFzKGlkIDogc3RyaW5nLCB3aWR0aD8gOiBudW1iZXIsIGhlaWdodD8gOiBudW1iZXIpIDogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgXHJcbiAgICAgICAgbGV0IGNhbnZhcyA6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKTtcclxuICAgICAgICBpZiAoIWNhbnZhcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyLmFkZEVycm9yTWVzc2FnZShgQ2FudmFzIGVsZW1lbnQgaWQgPSAke2lkfSBub3QgZm91bmRgKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBDU1MgY29udHJvbHMgdGhlIHNpemVcclxuICAgICAgICBpZiAoIXdpZHRoIHx8ICFoZWlnaHQpXHJcbiAgICAgICAgICAgIHJldHVybiBjYW52YXM7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciBkaW1lbnNpb25zICAgIFxyXG4gICAgICAgIGNhbnZhcy53aWR0aCAgPSB3aWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICAvLyBET00gZWxlbWVudCBkaW1lbnNpb25zIChtYXkgYmUgZGlmZmVyZW50IHRoYW4gcmVuZGVyIGRpbWVuc2lvbnMpXHJcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoICA9IGAke3dpZHRofXB4YDtcclxuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNhbnZhcztcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn0iLCIgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgIFxyXG4vKipcclxuICogTWF0aCBMaWJyYXJ5XHJcbiAqIEdlbmVyYWwgbWF0aGVtYXRpY3Mgcm91dGluZXNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0aExpYnJhcnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdHdvIG51bWJlcnMgYXJlIGVxdWFsIHdpdGhpbiB0aGUgZ2l2ZW4gdG9sZXJhbmNlLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIEZpcnN0IHZhbHVlIHRvIGNvbXBhcmUuXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIgU2Vjb25kIHZhbHVlIHRvIGNvbXBhcmUuXHJcbiAgICAgKiBAcGFyYW0gdG9sZXJhbmNlIFRvbGVyYW5jZSBmb3IgY29tcGFyaXNvbi5cclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgd2l0aGluIHRvbGVyYW5jZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIG51bWJlcnNFcXVhbFdpdGhpblRvbGVyYW5jZSh2YWx1ZSA6IG51bWJlciwgb3RoZXIgOiBudW1iZXIsIHRvbGVyYW5jZSA6IG51bWJlcikgOiBib29sZWFuIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuICgodmFsdWUgPj0gKG90aGVyIC0gdG9sZXJhbmNlKSkgJiYgKHZhbHVlIDw9IChvdGhlciArIHRvbGVyYW5jZSkpKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7YXNzZXJ0fSAgICAgICAgICAgICBmcm9tICdjaGFpJ1xyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYX0gICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7U3RvcFdhdGNofSAgICAgICAgICBmcm9tICdTdG9wV2F0Y2gnXHJcblxyXG5pbnRlcmZhY2UgRmFjZVBhaXIge1xyXG4gICAgICAgIFxyXG4gICAgdmVydGljZXMgOiBUSFJFRS5WZWN0b3IzW107XHJcbiAgICBmYWNlcyAgICA6IFRIUkVFLkZhY2UzW107XHJcbn1cclxuXHJcbmludGVyZmFjZSBGYWNlUGFpciB7XHJcblxyXG4gICAgdmVydGljZXM6IFRIUkVFLlZlY3RvcjNbXTtcclxuICAgIGZhY2VzOiBUSFJFRS5GYWNlM1tdO1xyXG59XHJcblxyXG4vKipcclxuICogIE1lc2ggY2FjaGUgdG8gb3B0aW1pemUgbWVzaCBjcmVhdGlvbi5cclxuICogSWYgYSBtZXNoIGV4aXN0cyBpbiB0aGUgY2FjaGUgb2YgdGhlIHJlcXVpcmVkIGRpbWVuc2lvbnMsIGl0IGlzIHVzZWQgYXMgYSB0ZW1wbGF0ZS5cclxuICogIEBjbGFzc1xyXG4gKi9cclxuY2xhc3MgTWVzaENhY2hlIHtcclxuICAgIF9jYWNoZSA6IE1hcDxzdHJpbmcsIFRIUkVFLk1lc2g+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NhY2hlID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlcyB0aGUgbWFwIGtleSBmb3IgYSBtZXNoLlxyXG4gICAgICogQHBhcmFtIHtUSFJFRS5WZWN0b3IyfSBtb2RlbEV4dGVudHMgRXh0ZW50cyBvZiB0aGUgY2FtZXJhIG5lYXIgcGxhbmU7IG1vZGVsIHVuaXRzLlxyXG4gICAgICogQHBhcmFtIHtUSFJFRS5WZWN0b3IyfSBwaXhlbEV4dGVudHMgRXh0ZW50cyBvZiB0aGUgcGl4ZWwgYXJyYXkgdXNlZCB0byBzdWJkaXZpZGUgdGhlIG1lc2guXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZW5lcmF0ZUtleShtb2RlbEV4dGVudHMgOiBUSFJFRS5WZWN0b3IyLCBwaXhlbEV4dGVudHMgOiBUSFJFRS5WZWN0b3IyKSA6IHN0cmluZ3tcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYXNwZWN0UmF0aW8gPSAobW9kZWxFeHRlbnRzLnggLyBtb2RlbEV4dGVudHMueSApLnRvRml4ZWQoMikudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGBBc3BlY3QgPSAke2FzcGVjdFJhdGlvfSA6IFBpeGVscyA9ICgke01hdGgucm91bmQocGl4ZWxFeHRlbnRzLngpLnRvU3RyaW5nKCl9LCAke01hdGgucm91bmQocGl4ZWxFeHRlbnRzLnkpLnRvU3RyaW5nKCl9KWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIG1lc2ggZnJvbSB0aGUgY2FjaGUgYXMgYSB0ZW1wbGF0ZSAob3IgbnVsbCk7XHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLlZlY3RvcjJ9IG1vZGVsRXh0ZW50cyBFeHRlbnRzIG9mIHRoZSBjYW1lcmEgbmVhciBwbGFuZTsgbW9kZWwgdW5pdHMuXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLlZlY3RvcjJ9IHBpeGVsRXh0ZW50cyBFeHRlbnRzIG9mIHRoZSBwaXhlbCBhcnJheSB1c2VkIHRvIHN1YmRpdmlkZSB0aGUgbWVzaC5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5NZXNofVxyXG4gICAgICovXHJcbiAgICBnZXRNZXNoKG1vZGVsRXh0ZW50czogVEhSRUUuVmVjdG9yMiwgcGl4ZWxFeHRlbnRzOiBUSFJFRS5WZWN0b3IyKSA6IFRIUkVFLk1lc2h7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nID0gdGhpcy5nZW5lcmF0ZUtleShtb2RlbEV4dGVudHMsIHBpeGVsRXh0ZW50cyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW2tleV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gQWRkcyBhIG1lc2ggaW5zdGFuY2UgdG8gdGhlIGNhY2hlLlxyXG4gICAgICogQHBhcmFtIHtUSFJFRS5WZWN0b3IyfSBtb2RlbEV4dGVudHMgRXh0ZW50cyBvZiB0aGUgY2FtZXJhIG5lYXIgcGxhbmU7IG1vZGVsIHVuaXRzLlxyXG4gICAgICogQHBhcmFtIHtUSFJFRS5WZWN0b3IyfSBwaXhlbEV4dGVudHMgRXh0ZW50cyBvZiB0aGUgcGl4ZWwgYXJyYXkgdXNlZCB0byBzdWJkaXZpZGUgdGhlIG1lc2guXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLk1lc2h9IE1lc2ggaW5zdGFuY2UgdG8gYWRkLlxyXG4gICAgICogQHJldHVybnMge3ZvaWR9IFxyXG4gICAgICovXHJcbiAgICBhZGRNZXNoKG1vZGVsRXh0ZW50czogVEhSRUUuVmVjdG9yMiwgcGl4ZWxFeHRlbnRzOiBUSFJFRS5WZWN0b3IyLCBtZXNoIDogVEhSRUUuTWVzaCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nID0gdGhpcy5nZW5lcmF0ZUtleShtb2RlbEV4dGVudHMsIHBpeGVsRXh0ZW50cyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhY2hlW2tleV0pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IG1lc2hDbG9uZSA9IEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KG1lc2gpO1xyXG4gICAgICAgIHRoaXMuX2NhY2hlW2tleV0gPSBtZXNoQ2xvbmU7XHJcbiAgICB9XHJcbn0gICBcclxuXHJcbi8qKlxyXG4gKiAgRGVwdGhCdWZmZXIgXHJcbiAqICBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlciB7XHJcblxyXG4gICAgc3RhdGljIENhY2hlICAgICAgICAgICAgICAgICAgICAgICAgICA6IE1lc2hDYWNoZSA9IG5ldyBNZXNoQ2FjaGUoKTtcclxuICAgIHN0YXRpYyByZWFkb25seSBNZXNoTW9kZWxOYW1lICAgICAgICAgOiBzdHJpbmcgPSAnTW9kZWxNZXNoJztcclxuICAgIHN0YXRpYyByZWFkb25seSBOb3JtYWxpemVkVG9sZXJhbmNlICAgOiBudW1iZXIgPSAuMDAxOyAgICBcclxuXHJcbiAgICBzdGF0aWMgRGVmYXVsdE1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycyA9IHtcclxuICAgIFxyXG4gICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsIFxyXG4gICAgICAgIHdpcmVmcmFtZSA6IGZhbHNlLCBcclxuXHJcbiAgICAgICAgY29sb3I6IDB4NDJlZWY0LCBcclxuICAgICAgICBzcGVjdWxhcjogMHhmZmZmZmYsIFxyXG5cclxuICAgICAgICByZWZsZWN0aXZpdHkgOiAwLjc1LCBcclxuICAgICAgICBzaGluaW5lc3MgOiAxMDBcclxuICAgIH07XHJcbiAgICBcclxuICAgIF9sb2dnZXIgOiBMb2dnZXI7XHJcblxyXG4gICAgX3JnYmFBcnJheSA6IFVpbnQ4QXJyYXk7XHJcbiAgICBkZXB0aHMgICAgIDogRmxvYXQzMkFycmF5O1xyXG4gICAgd2lkdGggICAgICA6IG51bWJlcjtcclxuICAgIGhlaWdodCAgICAgOiBudW1iZXI7XHJcblxyXG4gICAgY2FtZXJhICAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xyXG4gICAgX25lYXJDbGlwUGxhbmUgICA6IG51bWJlcjtcclxuICAgIF9mYXJDbGlwUGxhbmUgICAgOiBudW1iZXI7XHJcbiAgICBfY2FtZXJhQ2xpcFJhbmdlIDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBfbWluaW11bU5vcm1hbGl6ZWQgOiBudW1iZXI7XHJcbiAgICBfbWF4aW11bU5vcm1hbGl6ZWQgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSByZ2JhQXJyYXkgUmF3IGFyYXkgb2YgUkdCQSBieXRlcyBwYWNrZWQgd2l0aCBmbG9hdHMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgbWFwLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgbWFwLlxyXG4gICAgICogQHBhcmFtIG5lYXJDbGlwUGxhbmUgQ2FtZXJhIG5lYXIgY2xpcHBpbmcgcGxhbmUuXHJcbiAgICAgKiBAcGFyYW0gZmFyQ2xpcFBsYW5lIENhbWVyYSBmYXIgY2xpcHBpbmcgcGxhbmUuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHJnYmFBcnJheSA6IFVpbnQ4QXJyYXksIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOm51bWJlciwgY2FtZXJhIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9yZ2JhQXJyYXkgPSByZ2JhQXJyYXk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBjYW1lcmE7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGFzcGVjdCByYXRpb24gb2YgdGhlIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGFzcGVjdFJhdGlvICgpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1pbmltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1pbmltdW1Ob3JtYWxpemVkICgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWluaW11bSgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bSA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aCh0aGlzLl9tYXhpbXVtTm9ybWFsaXplZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtaW5pbXVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4aW11bU5vcm1hbGl6ZWQgKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhpbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXhpbXVtKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBtYXhpbXVtID0gdGhpcy5ub3JtYWxpemVkVG9Nb2RlbERlcHRoKHRoaXMubWluaW11bU5vcm1hbGl6ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF4aW11bTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggcmFuZ2Ugb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhbmdlTm9ybWFsaXplZCgpIDogbnVtYmVye1xyXG5cclxuICAgICAgICBsZXQgZGVwdGhOb3JtYWxpemVkIDogbnVtYmVyID0gdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQgLSB0aGlzLl9taW5pbXVtTm9ybWFsaXplZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGl6ZWQgZGVwdGggb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhbmdlKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBkZXB0aCA6IG51bWJlciA9IHRoaXMubWF4aW11bSAtIHRoaXMubWluaW11bTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcHRoO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGV4dGVudHMgb2YgdGhlIGRlcHRoIGJ1ZmZlci5cclxuICAgICAqLyAgICAgICBcclxuICAgIGNhbGN1bGF0ZUV4dGVudHMgKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNldE1pbmltdW1Ob3JtYWxpemVkKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLnNldE1heGltdW1Ob3JtYWxpemVkKCk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemVcclxuICAgICAqLyAgICAgICBcclxuICAgIGluaXRpYWxpemUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7ICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLl9uZWFyQ2xpcFBsYW5lICAgPSB0aGlzLmNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuX2ZhckNsaXBQbGFuZSAgICA9IHRoaXMuY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFDbGlwUmFuZ2UgPSB0aGlzLl9mYXJDbGlwUGxhbmUgLSB0aGlzLl9uZWFyQ2xpcFBsYW5lO1xyXG5cclxuICAgICAgICAvLyBSR0JBIC0+IEZsb2F0MzJcclxuICAgICAgICB0aGlzLmRlcHRocyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fcmdiYUFycmF5LmJ1ZmZlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGV4dHJlbWEgb2YgZGVwdGggYnVmZmVyIHZhbHVlc1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlRXh0ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCBhIG5vcm1hbGl6ZWQgZGVwdGggWzAsMV0gdG8gZGVwdGggaW4gbW9kZWwgdW5pdHMuXHJcbiAgICAgKiBAcGFyYW0gbm9ybWFsaXplZERlcHRoIE5vcm1hbGl6ZWQgZGVwdGggWzAsMV0uXHJcbiAgICAgKi9cclxuICAgIG5vcm1hbGl6ZWRUb01vZGVsRGVwdGgobm9ybWFsaXplZERlcHRoIDogbnVtYmVyKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY2NTIyNTMvZ2V0dGluZy10aGUtdHJ1ZS16LXZhbHVlLWZyb20tdGhlLWRlcHRoLWJ1ZmZlclxyXG4gICAgICAgIG5vcm1hbGl6ZWREZXB0aCA9IDIuMCAqIG5vcm1hbGl6ZWREZXB0aCAtIDEuMDtcclxuICAgICAgICBsZXQgekxpbmVhciA9IDIuMCAqIHRoaXMuY2FtZXJhLm5lYXIgKiB0aGlzLmNhbWVyYS5mYXIgLyAodGhpcy5jYW1lcmEuZmFyICsgdGhpcy5jYW1lcmEubmVhciAtIG5vcm1hbGl6ZWREZXB0aCAqICh0aGlzLmNhbWVyYS5mYXIgLSB0aGlzLmNhbWVyYS5uZWFyKSk7XHJcblxyXG4gICAgICAgIC8vIHpMaW5lYXIgaXMgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNhbWVyYTsgcmV2ZXJzZSB0byB5aWVsZCBoZWlnaHQgZnJvbSBtZXNoIHBsYW5lXHJcbiAgICAgICAgekxpbmVhciA9IC0oekxpbmVhciAtIHRoaXMuY2FtZXJhLmZhcik7XHJcblxyXG4gICAgICAgIHJldHVybiB6TGluZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9ybWFsaXplZCBkZXB0aCB2YWx1ZSBhdCBhIHBpeGVsIGluZGV4XHJcbiAgICAgKiBAcGFyYW0gcm93IEJ1ZmZlciByb3cuXHJcbiAgICAgKiBAcGFyYW0gY29sdW1uIEJ1ZmZlciBjb2x1bW4uXHJcbiAgICAgKi9cclxuICAgIGRlcHRoTm9ybWFsaXplZCAocm93IDogbnVtYmVyLCBjb2x1bW4pIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGV4ID0gKE1hdGgucm91bmQocm93KSAqIHRoaXMud2lkdGgpICsgTWF0aC5yb3VuZChjb2x1bW4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoc1tpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGRlcHRoIHZhbHVlIGF0IGEgcGl4ZWwgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gcm93IE1hcCByb3cuXHJcbiAgICAgKiBAcGFyYW0gcGl4ZWxDb2x1bW4gTWFwIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgZGVwdGgocm93IDogbnVtYmVyLCBjb2x1bW4pIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGRlcHRoTm9ybWFsaXplZCA9IHRoaXMuZGVwdGhOb3JtYWxpemVkKHJvdywgY29sdW1uKTtcclxuICAgICAgICBsZXQgZGVwdGggPSB0aGlzLm5vcm1hbGl6ZWRUb01vZGVsRGVwdGgoZGVwdGhOb3JtYWxpemVkKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZGVwdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBtaW5pbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHNldE1pbmltdW1Ob3JtYWxpemVkKCkge1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bU5vcm1hbGl6ZWQgOiBudW1iZXIgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4OiBudW1iZXIgPSAwOyBpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aDsgaW5kZXgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGhWYWx1ZSA6IG51bWJlciA9IHRoaXMuZGVwdGhzW2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZXB0aFZhbHVlIDwgbWluaW11bU5vcm1hbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICBtaW5pbXVtTm9ybWFsaXplZCA9IGRlcHRoVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWluaW11bU5vcm1hbGl6ZWQgPSBtaW5pbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG1heGltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TWF4aW11bU5vcm1hbGl6ZWQoKSB7XHJcblxyXG4gICAgICAgIGxldCBtYXhpbXVtTm9ybWFsaXplZCA6IG51bWJlciA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgdGhpcy5kZXB0aHMubGVuZ3RoOyBpbmRleCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aFZhbHVlIDogbnVtYmVyID0gdGhpcy5kZXB0aHNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoZGVwdGhWYWx1ZSA+IG1heGltdW1Ob3JtYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgbWF4aW11bU5vcm1hbGl6ZWQgPSBkZXB0aFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21heGltdW1Ob3JtYWxpemVkID0gbWF4aW11bU5vcm1hbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBsaW5lYXIgaW5kZXggb2YgYSBtb2RlbCBwb2ludCBpbiB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSB3b3JsZFZlcnRleCBWZXJ0ZXggb2YgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldE1vZGVsVmVydGV4SW5kaWNlcyAod29ybGRWZXJ0ZXggOiBUSFJFRS5WZWN0b3IzLCBwbGFuZUJvdW5kaW5nQm94IDogVEhSRUUuQm94MykgOiBUSFJFRS5WZWN0b3IyIHtcclxuICAgIFxyXG4gICAgICAgIGxldCBib3hTaXplICAgICAgOiBUSFJFRS5WZWN0b3IzID0gcGxhbmVCb3VuZGluZ0JveC5nZXRTaXplKCk7XHJcbiAgICAgICAgbGV0IG1lc2hFeHRlbnRzICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMiAoYm94U2l6ZS54LCBib3hTaXplLnkpO1xyXG5cclxuICAgICAgICAvLyAgbWFwIGNvb3JkaW5hdGVzIHRvIG9mZnNldHMgaW4gcmFuZ2UgWzAsIDFdXHJcbiAgICAgICAgbGV0IG9mZnNldFggOiBudW1iZXIgPSAod29ybGRWZXJ0ZXgueCArIChib3hTaXplLnggLyAyKSkgLyBib3hTaXplLng7XHJcbiAgICAgICAgbGV0IG9mZnNldFkgOiBudW1iZXIgPSAod29ybGRWZXJ0ZXgueSArIChib3hTaXplLnkgLyAyKSkgLyBib3hTaXplLnk7XHJcblxyXG4gICAgICAgIGxldCByb3cgICAgOiBudW1iZXIgPSBvZmZzZXRZICogKHRoaXMuaGVpZ2h0IC0gMSk7XHJcbiAgICAgICAgbGV0IGNvbHVtbiA6IG51bWJlciA9IG9mZnNldFggKiAodGhpcy53aWR0aCAtIDEpO1xyXG4gICAgICAgIHJvdyAgICA9IE1hdGgucm91bmQocm93KTtcclxuICAgICAgICBjb2x1bW4gPSBNYXRoLnJvdW5kKGNvbHVtbik7XHJcblxyXG4gICAgICAgIGFzc2VydC5pc1RydWUoKHJvdyA+PSAwKSAmJiAocm93IDwgdGhpcy5oZWlnaHQpLCAoYFZlcnRleCAoJHt3b3JsZFZlcnRleC54fSwgJHt3b3JsZFZlcnRleC55fSwgJHt3b3JsZFZlcnRleC56fSkgeWllbGRlZCByb3cgPSAke3Jvd31gKSk7XHJcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZSgoY29sdW1uPj0gMCkgJiYgKGNvbHVtbiA8IHRoaXMud2lkdGgpLCAoYFZlcnRleCAoJHt3b3JsZFZlcnRleC54fSwgJHt3b3JsZFZlcnRleC55fSwgJHt3b3JsZFZlcnRleC56fSkgeWllbGRlZCBjb2x1bW4gPSAke2NvbHVtbn1gKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMihyb3csIGNvbHVtbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGxpbmVhciBpbmRleCBvZiBhIG1vZGVsIHBvaW50IGluIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHdvcmxkVmVydGV4IFZlcnRleCBvZiBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgZ2V0TW9kZWxWZXJ0ZXhJbmRleCAod29ybGRWZXJ0ZXggOiBUSFJFRS5WZWN0b3IzLCBwbGFuZUJvdW5kaW5nQm94IDogVEhSRUUuQm94MykgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgaW5kaWNlcyA6IFRIUkVFLlZlY3RvcjIgPSB0aGlzLmdldE1vZGVsVmVydGV4SW5kaWNlcyh3b3JsZFZlcnRleCwgcGxhbmVCb3VuZGluZ0JveCk7ICAgIFxyXG4gICAgICAgIGxldCByb3cgICAgOiBudW1iZXIgPSBpbmRpY2VzLng7XHJcbiAgICAgICAgbGV0IGNvbHVtbiA6IG51bWJlciA9IGluZGljZXMueTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgaW5kZXggPSAocm93ICogdGhpcy53aWR0aCkgKyBjb2x1bW47XHJcbiAgICAgICAgaW5kZXggPSBNYXRoLnJvdW5kKGluZGV4KTtcclxuXHJcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZSgoaW5kZXggPj0gMCkgJiYgKGluZGV4IDwgdGhpcy5kZXB0aHMubGVuZ3RoKSwgKGBWZXJ0ZXggKCR7d29ybGRWZXJ0ZXgueH0sICR7d29ybGRWZXJ0ZXgueX0sICR7d29ybGRWZXJ0ZXguen0pIHlpZWxkZWQgaW5kZXggPSAke2luZGV4fWApKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgICAvKipcclxuICAgICAgKiBDb25zdHJ1Y3RzIGEgcGFpciBvZiB0cmlhbmd1bGFyIGZhY2VzIGF0IHRoZSBnaXZlbiBvZmZzZXQgaW4gdGhlIERlcHRoQnVmZmVyLlxyXG4gICAgICAqIEBwYXJhbSByb3cgUm93IG9mZnNldCAoTG93ZXIgTGVmdCkuXHJcbiAgICAgICogQHBhcmFtIGNvbHVtbiBDb2x1bW4gb2Zmc2V0IChMb3dlciBMZWZ0KS5cclxuICAgICAgKiBAcGFyYW0gZmFjZVNpemUgU2l6ZSBvZiBhIGZhY2UgZWRnZSAobm90IGh5cG90ZW51c2UpLlxyXG4gICAgICAqIEBwYXJhbSBiYXNlVmVydGV4SW5kZXggQmVnaW5uaW5nIG9mZnNldCBpbiBtZXNoIGdlb21ldHJ5IHZlcnRleCBhcnJheS5cclxuICAgICAgKi9cclxuICAgICBjb25zdHJ1Y3RUcmlGYWNlc0F0T2Zmc2V0IChyb3cgOiBudW1iZXIsIGNvbHVtbiA6IG51bWJlciwgbWVzaExvd2VyTGVmdCA6IFRIUkVFLlZlY3RvcjIsIGZhY2VTaXplIDogbnVtYmVyLCBiYXNlVmVydGV4SW5kZXggOiBudW1iZXIpIDogRmFjZVBhaXIge1xyXG4gICAgICAgICBcclxuICAgICAgICAgbGV0IGZhY2VQYWlyIDogRmFjZVBhaXIgPSB7XHJcbiAgICAgICAgICAgICB2ZXJ0aWNlcyA6IFtdLFxyXG4gICAgICAgICAgICAgZmFjZXMgICAgOiBbXVxyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICAvLyAgVmVydGljZXNcclxuICAgICAgICAgLy8gICAyICAgIDMgICAgICAgXHJcbiAgICAgICAgIC8vICAgMCAgICAxXHJcbiAgICAgXHJcbiAgICAgICAgIC8vIGNvbXBsZXRlIG1lc2ggY2VudGVyIHdpbGwgYmUgYXQgdGhlIHdvcmxkIG9yaWdpblxyXG4gICAgICAgICBsZXQgb3JpZ2luWCA6IG51bWJlciA9IG1lc2hMb3dlckxlZnQueCArIChjb2x1bW4gKiBmYWNlU2l6ZSk7XHJcbiAgICAgICAgIGxldCBvcmlnaW5ZIDogbnVtYmVyID0gbWVzaExvd2VyTGVmdC55ICsgKHJvdyAgICAqIGZhY2VTaXplKTtcclxuIFxyXG4gICAgICAgICBsZXQgbG93ZXJMZWZ0ICAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgMCwgICAgICAgICBvcmlnaW5ZICsgMCwgICAgICAgIHRoaXMuZGVwdGgocm93ICsgMCwgY29sdW1uKyAwKSk7ICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDBcclxuICAgICAgICAgbGV0IGxvd2VyUmlnaHQgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIGZhY2VTaXplLCAgb3JpZ2luWSArIDAsICAgICAgICB0aGlzLmRlcHRoKHJvdyArIDAsIGNvbHVtbiArIDEpKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAxXHJcbiAgICAgICAgIGxldCB1cHBlckxlZnQgICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyAwLCAgICAgICAgIG9yaWdpblkgKyBmYWNlU2l6ZSwgdGhpcy5kZXB0aChyb3cgKyAxLCBjb2x1bW4gKyAwKSk7ICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMlxyXG4gICAgICAgICBsZXQgdXBwZXJSaWdodCAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgZmFjZVNpemUsICBvcmlnaW5ZICsgZmFjZVNpemUsIHRoaXMuZGVwdGgocm93ICsgMSwgY29sdW1uICsgMSkpOyAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDNcclxuIFxyXG4gICAgICAgICBmYWNlUGFpci52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgIGxvd2VyTGVmdCwgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMFxyXG4gICAgICAgICAgICAgIGxvd2VyUmlnaHQsICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMVxyXG4gICAgICAgICAgICAgIHVwcGVyTGVmdCwgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMlxyXG4gICAgICAgICAgICAgIHVwcGVyUmlnaHQgICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgM1xyXG4gICAgICAgICAgKTtcclxuIFxyXG4gICAgICAgICAgLy8gcmlnaHQgaGFuZCBydWxlIGZvciBwb2x5Z29uIHdpbmRpbmdcclxuICAgICAgICAgIGZhY2VQYWlyLmZhY2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKGJhc2VWZXJ0ZXhJbmRleCArIDAsIGJhc2VWZXJ0ZXhJbmRleCArIDEsIGJhc2VWZXJ0ZXhJbmRleCArIDMpLFxyXG4gICAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMyhiYXNlVmVydGV4SW5kZXggKyAwLCBiYXNlVmVydGV4SW5kZXggKyAzLCBiYXNlVmVydGV4SW5kZXggKyAyKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICByZXR1cm4gZmFjZVBhaXI7XHJcbiAgICAgfVxyXG5cclxuICAgICAvKipcclxuICAgICAgKiBAZGVzY3JpcHRpb24gQ29uc3RydWN0cyBhIG5ldyBtZXNoIGZyb20gYW4gZXhpc3RpbmcgbWVzaCBvZiB0aGUgc2FtZSBkaW1lbnNpb25zLlxyXG4gICAgICAqIEBwYXJhbSB7VEhSRUUuTWVzaH0gbWVzaCBUZW1wbGF0ZSBtZXNoIGlkZW50aWNhbCBpbiBtb2RlbCA8YW5kPiBwaXhlbCBleHRlbnRzLlxyXG4gICAgICAqIEBwYXJhbSB7VEhSRUUuVmVjdG9yMn0gbWVzaEV4dGVudHMgRmluYWwgbWVzaCBleHRlbnRzLlxyXG4gICAgICAqIEBwYXJhbSB7VEhSRUUuTWF0ZXJpYWx9IG1hdGVyaWFsIE1hdGVyaWFsIHRvIGFzc2lnbiB0byB0aGUgbWVzaC5cclxuICAgICAgKiBAcmV0dXJucyB7VEhSRUUuTWVzaH0gXHJcbiAgICAgICovXHJcbiAgICAgY29uc3RydWN0TWVzaEZyb21UZW1wbGF0ZShtZXNoIDogVEhSRUUuTWVzaCwgbWVzaEV4dGVudHM6IFRIUkVFLlZlY3RvcjIsIG1hdGVyaWFsOiBUSFJFRS5NYXRlcmlhbCk6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgXHJcbiAgICAgICAgLy8gVGhlIG1lc2ggdGVtcGxhdGUgbWF0Y2hlcyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSB0ZW1wbGF0ZS5cclxuICAgICAgICAvLyBOb3csIHNjYWxlIHRoZSBtZXNoIHRvIHRoZSBmaW5hbCB0YXJnZXQgZGltZW5zaW9ucy5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QobWVzaCk7XHJcbiAgICAgICAgbGV0IHNjYWxlID0gbWVzaEV4dGVudHMueCAvIGJvdW5kaW5nQm94LmdldFNpemUoKS54O1xyXG4gICAgICAgIG1lc2guc2NhbGUueCA9IHNjYWxlO1xyXG4gICAgICAgIG1lc2guc2NhbGUueSA9IHNjYWxlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBtZXNoVmVydGljZXMgPSAoPFRIUkVFLkdlb21ldHJ5Pm1lc2guZ2VvbWV0cnkpLnZlcnRpY2VzO1xyXG4gICAgICAgIGxldCBkZXB0aENvdW50ID0gdGhpcy5kZXB0aHMubGVuZ3RoO1xyXG4gICAgICAgIGFzc2VydChtZXNoVmVydGljZXMubGVuZ3RoID09PSBkZXB0aENvdW50KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaURlcHRoID0gMDsgaURlcHRoIDwgZGVwdGhDb3VudDsgaURlcHRoKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBtb2RlbERlcHRoID0gdGhpcy5ub3JtYWxpemVkVG9Nb2RlbERlcHRoKHRoaXMuZGVwdGhzW2lEZXB0aF0pO1xyXG4gICAgICAgICAgICBtZXNoVmVydGljZXNbaURlcHRoXS5zZXQobWVzaFZlcnRpY2VzW2lEZXB0aF0ueCwgbWVzaFZlcnRpY2VzW2lEZXB0aF0ueSwgbW9kZWxEZXB0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtZXNoR2VvbWV0cnk6IFRIUkVFLkdlb21ldHJ5ID0gPFRIUkVFLkdlb21ldHJ5Pm1lc2guZ2VvbWV0cnk7XHJcbiAgICAgICAgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQGRlc2NyaXB0aW9uIENvbnN0cnVjdHMgYSBuZXcgbWVzaCBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmlhbmdsZXMuXHJcbiAgICAgICogQHBhcmFtIHtUSFJFRS5WZWN0b3IyfSBtZXNoWFlFeHRlbnRzIEV4dGVudHMgb2YgdGhlIG1lc2guXHJcbiAgICAgICogQHBhcmFtIHtUSFJFRS5NYXRlcmlhbH0gbWF0ZXJpYWwgTWF0ZXJpYWwgdG8gYXNzaWduIHRvIHRoZSBtZXNoLlxyXG4gICAgICAqIEByZXR1cm5zIHtUSFJFRS5NZXNofSBcclxuICAgICAgKi9cclxuICAgIGNvbnN0cnVjdE1lc2gobWVzaFhZRXh0ZW50cyA6IFRIUkVFLlZlY3RvcjIsIG1hdGVyaWFsIDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcbiAgICAgICAgbGV0IG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG4gICAgICAgIGxldCBmYWNlU2l6ZTogbnVtYmVyID0gbWVzaFhZRXh0ZW50cy54IC8gKHRoaXMud2lkdGggLSAxKTtcclxuICAgICAgICBsZXQgYmFzZVZlcnRleEluZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBsZXQgbWVzaExvd2VyTGVmdDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKC0obWVzaFhZRXh0ZW50cy54IC8gMiksIC0obWVzaFhZRXh0ZW50cy55IC8gMikpXHJcblxyXG4gICAgICAgIGZvciAobGV0IGlSb3cgPSAwOyBpUm93IDwgKHRoaXMuaGVpZ2h0IC0gMSk7IGlSb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpQ29sdW1uID0gMDsgaUNvbHVtbiA8ICh0aGlzLndpZHRoIC0gMSk7IGlDb2x1bW4rKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBmYWNlUGFpciA9IHRoaXMuY29uc3RydWN0VHJpRmFjZXNBdE9mZnNldChpUm93LCBpQ29sdW1uLCBtZXNoTG93ZXJMZWZ0LCBmYWNlU2l6ZSwgYmFzZVZlcnRleEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkudmVydGljZXMucHVzaCguLi5mYWNlUGFpci52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgICAgICBtZXNoR2VvbWV0cnkuZmFjZXMucHVzaCguLi5mYWNlUGFpci5mYWNlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmFzZVZlcnRleEluZGV4ICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbWVzaEdlb21ldHJ5Lm1lcmdlVmVydGljZXMoKTtcclxuICAgICAgICBsZXQgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWVzaDsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbWVzaCBvZiB0aGUgZ2l2ZW4gYmFzZSBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0gbWVzaFhZRXh0ZW50cyBCYXNlIGRpbWVuc2lvbnMgKG1vZGVsIHVuaXRzKS4gSGVpZ2h0IGlzIGNvbnRyb2xsZWQgYnkgREIgYXNwZWN0IHJhdGlvLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE1hdGVyaWFsIHRvIGFzc2lnbiB0byBtZXNoLlxyXG4gICAgICovXHJcbiAgICBtZXNoKG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICBsZXQgdGltZXJUYWcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdEZXB0aEJ1ZmZlci5tZXNoJyk7ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBUaGUgbWVzaCBzaXplIGlzIGluIHJlYWwgd29ybGQgdW5pdHMgdG8gbWF0Y2ggdGhlIGRlcHRoIGJ1ZmZlciBvZmZzZXRzIHdoaWNoIGFyZSBhbHNvIGluIHJlYWwgd29ybGQgdW5pdHMuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgc2l6ZSBvZiB0aGUgbmVhciBwbGFuZSB0byBzaXplIHRoZSBtZXNoIHRvIHRoZSBtb2RlbCB1bml0cy5cclxuICAgICAgICBsZXQgbWVzaFhZRXh0ZW50cyA6IFRIUkVFLlZlY3RvcjIgPSBDYW1lcmEuZ2V0TmVhclBsYW5lRXh0ZW50cyh0aGlzLmNhbWVyYSk7ICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghbWF0ZXJpYWwpXHJcbiAgICAgICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKERlcHRoQnVmZmVyLkRlZmF1bHRNZXNoUGhvbmdNYXRlcmlhbFBhcmFtZXRlcnMpO1xyXG5cclxuICAgICAgICBsZXQgbWVzaENhY2hlOiBUSFJFRS5NZXNoID0gRGVwdGhCdWZmZXIuQ2FjaGUuZ2V0TWVzaChtZXNoWFlFeHRlbnRzLCBuZXcgVEhSRUUuVmVjdG9yMih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCkpO1xyXG4gICAgICAgIGxldCBtZXNoOiBUSFJFRS5NZXNoID0gbWVzaENhY2hlID8gdGhpcy5jb25zdHJ1Y3RNZXNoRnJvbVRlbXBsYXRlKG1lc2hDYWNoZSwgbWVzaFhZRXh0ZW50cywgbWF0ZXJpYWwpIDogdGhpcy5jb25zdHJ1Y3RNZXNoKG1lc2hYWUV4dGVudHMsIG1hdGVyaWFsKTsgICBcclxuICAgICAgICBtZXNoLm5hbWUgPSBEZXB0aEJ1ZmZlci5NZXNoTW9kZWxOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBtZXNoR2VvbWV0cnkgPSA8VEhSRUUuR2VvbWV0cnk+bWVzaC5nZW9tZXRyeTtcclxuICAgICAgICBtZXNoR2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICBtZXNoR2VvbWV0cnkubm9ybWFsc05lZWRVcGRhdGUgID0gdHJ1ZTtcclxuICAgICAgICBtZXNoR2VvbWV0cnkuZWxlbWVudHNOZWVkVXBkYXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IGZhY2VOb3JtYWxzVGFnID0gU2VydmljZXMudGltZXIubWFyaygnbWVzaEdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscycpO1xyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG4gICAgICAgIG1lc2hHZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZShmYWNlTm9ybWFsc1RhZyk7XHJcblxyXG4gICAgICAgIC8vIE1lc2ggd2FzIGNvbnN0cnVjdGVkIHdpdGggWiA9IGRlcHRoIGJ1ZmZlcihYLFkpLlxyXG4gICAgICAgIC8vIE5vdyByb3RhdGUgbWVzaCB0byBhbGlnbiB3aXRoIHZpZXdlciBYWSBwbGFuZSBzbyBUb3AgdmlldyBpcyBsb29raW5nIGRvd24gb24gdGhlIG1lc2guXHJcbiAgICAgICAgbWVzaC5yb3RhdGVYKC1NYXRoLlBJIC8gMik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgRGVwdGhCdWZmZXIuQ2FjaGUuYWRkTWVzaChtZXNoWFlFeHRlbnRzLCBuZXcgVEhSRUUuVmVjdG9yMih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCksIG1lc2gpO1xyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKVxyXG5cclxuICAgICAgICByZXR1cm4gbWVzaDtcclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmFseXplcyBwcm9wZXJ0aWVzIG9mIGEgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplICgpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuY2xlYXJMb2coKTtcclxuXHJcbiAgICAgICAgbGV0IG1pZGRsZSA9IHRoaXMud2lkdGggLyAyO1xyXG4gICAgICAgIGxldCBkZWNpbWFsUGxhY2VzID0gNTtcclxuICAgICAgICBsZXQgaGVhZGVyU3R5bGUgICA9IFwiZm9udC1mYW1pbHkgOiBtb25vc3BhY2U7IGZvbnQtd2VpZ2h0IDogYm9sZDsgY29sb3IgOiBibHVlOyBmb250LXNpemUgOiAxOHB4XCI7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2VTdHlsZSAgPSBcImZvbnQtZmFtaWx5IDogbW9ub3NwYWNlOyBjb2xvciA6IGJsYWNrOyBmb250LXNpemUgOiAxNHB4XCI7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKCdDYW1lcmEgUHJvcGVydGllcycsIGhlYWRlclN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTmVhciBQbGFuZSA9ICR7dGhpcy5jYW1lcmEubmVhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBGYXIgUGxhbmUgID0gJHt0aGlzLmNhbWVyYS5mYXJ9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgQ2xpcCBSYW5nZSA9ICR7dGhpcy5jYW1lcmEuZmFyIC0gdGhpcy5jYW1lcmEubmVhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFbXB0eUxpbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoJ05vcm1hbGl6ZWQnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENlbnRlciBEZXB0aCA9ICR7dGhpcy5kZXB0aE5vcm1hbGl6ZWQobWlkZGxlLCBtaWRkbGUpLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgWiBSYW5nZSA9ICR7dGhpcy5yYW5nZU5vcm1hbGl6ZWQudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBNaW5pbXVtID0gJHt0aGlzLm1pbmltdW1Ob3JtYWxpemVkLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWF4aW11bSA9ICR7dGhpcy5tYXhpbXVtTm9ybWFsaXplZC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVtcHR5TGluZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZSgnTW9kZWwgVW5pdHMnLCBoZWFkZXJTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYENlbnRlciBEZXB0aCA9ICR7dGhpcy5kZXB0aChtaWRkbGUsIG1pZGRsZSkudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBaIFJhbmdlID0gJHt0aGlzLnJhbmdlLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWluaW11bSA9ICR7dGhpcy5taW5pbXVtLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgTWF4aW11bSA9ICR7dGhpcy5tYXhpbXVtLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgIH1cclxufSIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuLyoqXHJcbiAqIFRvb2wgTGlicmFyeVxyXG4gKiBHZW5lcmFsIHV0aWxpdHkgcm91dGluZXNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVG9vbHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gVXRpbGl0eVxyXG4gICAgLy8vIDxzdW1tYXJ5PiAgICAgICAgXHJcbiAgICAvLyBHZW5lcmF0ZSBhIHBzZXVkbyBHVUlELlxyXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgc3RhdGljIGdlbmVyYXRlUHNldWRvR1VJRCgpIHtcclxuICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuICAgICBcclxuICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuLypcclxuICBSZXF1aXJlbWVudHNcclxuICAgIE5vIHBlcnNpc3RlbnQgRE9NIGVsZW1lbnQuIFRoZSBjYW52YXMgaXMgY3JlYXRlZCBkeW5hbWljYWxseS5cclxuICAgICAgICBPcHRpb24gZm9yIHBlcnNpc3RpbmcgdGhlIEZhY3RvcnkgaW4gdGhlIGNvbnN0cnVjdG9yXHJcbiAgICBKU09OIGNvbXBhdGlibGUgY29uc3RydWN0b3IgcGFyYW1ldGVyc1xyXG4gICAgRml4ZWQgcmVzb2x1dGlvbjsgcmVzaXppbmcgc3VwcG9ydCBpcyBub3QgcmVxdWlyZWQuXHJcbiovXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYSwgQ2xpcHBpbmdQbGFuZXN9IGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlcn0gICAgICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtTdG9wV2F0Y2h9ICAgICAgICAgICAgICBmcm9tICdTdG9wV2F0Y2gnXHJcbmltcG9ydCB7VG9vbHN9ICAgICAgICAgICAgICAgICAgZnJvbSAnVG9vbHMnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMge1xyXG5cclxuICAgIHdpZHRoICAgICAgICAgICAgOiBudW1iZXIsICAgICAgICAgICAgICAgICAgLy8gd2lkdGggb2YgREJcclxuICAgIGhlaWdodCAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgLy8gaGVpZ2h0IG9mIERCICAgICAgICBcclxuICAgIG1vZGVsICAgICAgICAgICAgOiBUSFJFRS5Hcm91cCwgICAgICAgICAgICAgLy8gbW9kZWwgcm9vdFxyXG5cclxuICAgIGNhbWVyYT8gICAgICAgICAgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgLy8gY2FtZXJhXHJcbiAgICBcclxuICAgIGxvZ0RlcHRoQnVmZmVyPyAgOiBib29sZWFuLCAgICAgICAgICAgICAgICAgLy8gdXNlIGxvZ2FyaXRobWljIGRlcHRoIGJ1ZmZlciBmb3IgaGlnaGVyIHJlc29sdXRpb24gKGJldHRlciBkaXN0cmlidXRpb24pIGluIHNjZW5lcyB3aXRoIGxhcmdlIGV4dGVudHNcclxuICAgIGJvdW5kZWRDbGlwcGluZz8gOiBib29sZWFuLCAgICAgICAgICAgICAgICAgLy8gb3ZlcnJyaWQgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byBib3VuZCBtb2RlbFxyXG4gICAgXHJcbiAgICBhZGRDYW52YXNUb0RPTT8gIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgIC8vIHZpc2libGUgY2FudmFzOyBhZGQgdG8gSFRNTFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1lc2hHZW5lcmF0ZVBhcmFtZXRlcnMgeyBcclxuXHJcbiAgICBjYW1lcmE/ICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhOyAgICAgIC8vIG92ZXJyaWRlIG5vdCB5ZXQgaW1wbGVtZW50ZWQgXHJcbiAgICBtYXRlcmlhbD8gICA6IFRIUkVFLk1hdGVyaWFsO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlckZhY3RvcnlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlckZhY3Rvcnkge1xyXG5cclxuICAgIHN0YXRpYyBEZWZhdWx0UmVzb2x1dGlvbiA6IG51bWJlciAgICAgICAgICAgPSAxMDI0OyAgICAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgREIgcmVzb2x1dGlvblxyXG4gICAgc3RhdGljIE5lYXJQbGFuZUVwc2lsb24gIDogbnVtYmVyICAgICAgICAgICA9IC4wMDE7ICAgICAgICAgICAgICAgICAgICAgLy8gYWRqdXN0bWVudCB0byBhdm9pZCBjbGlwcGluZyBnZW9tZXRyeSBvbiB0aGUgbmVhciBwbGFuZVxyXG4gICAgXHJcbiAgICBzdGF0aWMgQ3NzQ2xhc3NOYW1lICAgICAgOiBzdHJpbmcgICAgICAgICAgID0gJ0RlcHRoQnVmZmVyRmFjdG9yeSc7ICAgICAvLyBDU1MgY2xhc3NcclxuICAgIHN0YXRpYyBSb290Q29udGFpbmVySWQgICA6IHN0cmluZyAgICAgICAgICAgPSAncm9vdENvbnRhaW5lcic7ICAgICAgICAgIC8vIHJvb3QgY29udGFpbmVyIGZvciB2aWV3ZXJzXHJcbiAgICBcclxuICAgIF9zY2VuZSAgICAgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gdGFyZ2V0IHNjZW5lXHJcbiAgICBfbW9kZWwgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHRhcmdldCBtb2RlbFxyXG5cclxuICAgIF9yZW5kZXJlciAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlcmVyICAgICAgPSBudWxsOyAgICAgLy8gc2NlbmUgcmVuZGVyZXJcclxuICAgIF9jYW52YXMgICAgICAgICAgOiBIVE1MQ2FudmFzRWxlbWVudCAgICAgICAgPSBudWxsOyAgICAgLy8gRE9NIGNhbnZhcyBzdXBwb3J0aW5nIHJlbmRlcmVyXHJcbiAgICBfd2lkdGggICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgID0gRGVwdGhCdWZmZXJGYWN0b3J5LkRlZmF1bHRSZXNvbHV0aW9uOyAgICAgLy8gd2lkdGggcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuICAgIF9oZWlnaHQgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgPSBEZXB0aEJ1ZmZlckZhY3RvcnkuRGVmYXVsdFJlc29sdXRpb247ICAgICAvLyBoZWlnaHQgcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuXHJcbiAgICBfY2FtZXJhICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgID0gbnVsbDsgICAgIC8vIHBlcnNwZWN0aXZlIGNhbWVyYSB0byBnZW5lcmF0ZSB0aGUgZGVwdGggYnVmZmVyXHJcblxyXG5cclxuICAgIF9sb2dEZXB0aEJ1ZmZlciAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdXNlIGEgbG9nYXJpdGhtaWMgYnVmZmVyIGZvciBtb3JlIGFjY3VyYWN5IGluIGxhcmdlIHNjZW5lc1xyXG4gICAgX2JvdW5kZWRDbGlwcGluZyA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICA9IGZhbHNlOyAgICAvLyBvdmVycmlkZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzOyBzZXQgbmVhciBhbmQgZmFyIHRvIGJvdW5kIG1vZGVsIGZvciBpbXByb3ZlZCBhY2N1cmFjeVxyXG5cclxuICAgIF9kZXB0aEJ1ZmZlciAgICAgOiBEZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gZGVwdGggYnVmZmVyIFxyXG4gICAgX3RhcmdldCAgICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBjcmVhdGluZyB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHdoZW4gcmVuZGVyaW5nIHRoZSBzY2VuZVxyXG4gICAgX2VuY29kZWRUYXJnZXQgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBlbmNvZGluIHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgaW50byBhIGZsb2F0aW5nIHBvaW50IChSR0JBIGZvcm1hdClcclxuXHJcbiAgICBfcG9zdFNjZW5lICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHNpbmdsZSBwb2x5Z29uIHNjZW5lIHVzZSB0byBnZW5lcmF0ZSB0aGUgZW5jb2RlZCBSR0JBIGJ1ZmZlclxyXG4gICAgX3Bvc3RDYW1lcmEgICAgICA6IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSA9IG51bGw7ICAgICAvLyBvcnRob2dyYXBoaWMgY2FtZXJhXHJcbiAgICBfcG9zdE1hdGVyaWFsICAgIDogVEhSRUUuU2hhZGVyTWF0ZXJpYWwgICAgID0gbnVsbDsgICAgIC8vIHNoYWRlciBtYXRlcmlhbCB0aGF0IGVuY29kZXMgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciBpbnRvIGEgZmxvYXRpbmcgcG9pbnQgUkdCQSBmb3JtYXRcclxuXHJcbiAgICBfbWluaW11bVdlYkdMICAgIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gdHJ1ZTsgICAgIC8vIHRydWUgaWYgbWluaW11bSBXZUdMIHJlcXVpcmVtZW50cyBhcmUgcHJlc2VudFxyXG4gICAgX2xvZ2dlciAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBsb2dnZXJcclxuICAgIF9hZGRDYW52YXNUb0RPTSAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MIHBhZ2VcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgSW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyAoRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVycyA6IERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgLy8gcmVxdWlyZWRcclxuICAgICAgICB0aGlzLl93aWR0aCAgICAgICAgICAgPSBwYXJhbWV0ZXJzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAgICAgICAgICA9IHBhcmFtZXRlcnMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX21vZGVsICAgICAgICAgICA9IHBhcmFtZXRlcnMubW9kZWwuY2xvbmUodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhICAgICAgICAgID0gcGFyYW1ldGVycy5jYW1lcmEgICAgICAgICAgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLl9sb2dEZXB0aEJ1ZmZlciAgPSBwYXJhbWV0ZXJzLmxvZ0RlcHRoQnVmZmVyICB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ib3VuZGVkQ2xpcHBpbmcgPSBwYXJhbWV0ZXJzLmJvdW5kZWRDbGlwcGluZyB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLl9hZGRDYW52YXNUb0RPTSAgPSBwYXJhbWV0ZXJzLmFkZENhbnZhc1RvRE9NICB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gdGhpcy5pbml0aWFsaXplQ2FudmFzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW5pdGlhbGl6YXRpb24gICAgXHJcbiAgICAvKipcclxuICAgICAqIFZlcmlmaWVzIHRoZSBtaW5pbXVtIFdlYkdMIGV4dGVuc2lvbnMgYXJlIHByZXNlbnQuXHJcbiAgICAgKiBAcGFyYW0gcmVuZGVyZXIgV2ViR0wgcmVuZGVyZXIuXHJcbiAgICAgKi9cclxuICAgIHZlcmlmeVdlYkdMRXh0ZW5zaW9ucygpIDogYm9vbGVhbiB7IFxyXG4gICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLl9yZW5kZXJlci5leHRlbnNpb25zLmdldCgnV0VCR0xfZGVwdGhfdGV4dHVyZScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21pbmltdW1XZWJHTCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRXJyb3JNZXNzYWdlKCdUaGUgbWluaW11bSBXZWJHTCBleHRlbnNpb25zIGFyZSBub3Qgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZSBhIG1vdXNlIGRvd24gZXZlbnQgb24gdGhlIGNhbnZhcy5cclxuICAgICAqL1xyXG4gICAgb25Nb3VzZURvd24oZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGRldmljZUNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IEdyYXBoaWNzLmRldmljZUNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsICQoZXZlbnQudGFyZ2V0KSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBkZXZpY2UgPSAke2RldmljZUNvb3JkaW5hdGVzLnh9LCAke2RldmljZUNvb3JkaW5hdGVzLnl9YCk7XHJcblxyXG4gICAgICAgIGxldCBkZWNpbWFsUGxhY2VzICAgOiBudW1iZXIgPSAyO1xyXG4gICAgICAgIGxldCByb3cgICAgICAgICAgICAgOiBudW1iZXIgPSAoZGV2aWNlQ29vcmRpbmF0ZXMueSArIDEpIC8gMiAqIHRoaXMuX2RlcHRoQnVmZmVyLmhlaWdodDtcclxuICAgICAgICBsZXQgY29sdW1uICAgICAgICAgIDogbnVtYmVyID0gKGRldmljZUNvb3JkaW5hdGVzLnggKyAxKSAvIDIgKiB0aGlzLl9kZXB0aEJ1ZmZlci53aWR0aDtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYE9mZnNldCA9IFske3Jvd30sICR7Y29sdW1ufV1gKTsgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBEZXB0aCA9ICR7dGhpcy5fZGVwdGhCdWZmZXIuZGVwdGgocm93LCBjb2x1bW4pLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCk7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgV2ViR0wgdGFyZ2V0IGNhbnZhcy5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNhbnZhcygpIDogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnNldEF0dHJpYnV0ZSgnbmFtZScsIFRvb2xzLmdlbmVyYXRlUHNldWRvR1VJRCgpKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsIERlcHRoQnVmZmVyRmFjdG9yeS5Dc3NDbGFzc05hbWUpO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgZGltZW5zaW9ucyAgICBcclxuICAgICAgICB0aGlzLl9jYW52YXMud2lkdGggID0gdGhpcy5fd2lkdGg7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLmhlaWdodCA9IHRoaXMuX2hlaWdodDsgXHJcblxyXG4gICAgICAgIC8vIERPTSBlbGVtZW50IGRpbWVuc2lvbnMgKG1heSBiZSBkaWZmZXJlbnQgdGhhbiByZW5kZXIgZGltZW5zaW9ucylcclxuICAgICAgICB0aGlzLl9jYW52YXMuc3R5bGUud2lkdGggID0gYCR7dGhpcy5fd2lkdGh9cHhgO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLl9oZWlnaHR9cHhgO1xyXG5cclxuICAgICAgICAvLyBhZGQgdG8gRE9NP1xyXG4gICAgICAgIGlmICh0aGlzLl9hZGRDYW52YXNUb0RPTSlcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7RGVwdGhCdWZmZXJGYWN0b3J5LlJvb3RDb250YWluZXJJZH1gKS5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRjYW52YXMgPSAkKHRoaXMuX2NhbnZhcykub24oJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYW52YXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbiBvZiB0aGUgcmVuZGVyIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplU2NlbmUgKCkgOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbClcclxuICAgICAgICAgICAgdGhpcy5fc2NlbmUuYWRkKHRoaXMuX21vZGVsKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGlnaHRpbmcodGhpcy5fc2NlbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgIG1vZGVsIHZpZXcuXHJcbiAgICAgKi9cclxuICAgICBpbml0aWFsaXplUmVuZGVyZXIoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoIHtjYW52YXMgOiB0aGlzLl9jYW52YXMsIGxvZ2FyaXRobWljRGVwdGhCdWZmZXIgOiB0aGlzLl9sb2dEZXB0aEJ1ZmZlcn0pO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFNpemUodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcblxyXG4gICAgICAgIC8vIE1vZGVsIFNjZW5lIC0+IChSZW5kZXIgVGV4dHVyZSwgRGVwdGggVGV4dHVyZSlcclxuICAgICAgICB0aGlzLl90YXJnZXQgPSB0aGlzLmNvbnN0cnVjdERlcHRoVGV4dHVyZVJlbmRlclRhcmdldCgpO1xyXG5cclxuICAgICAgICAvLyBFbmNvZGVkIFJHQkEgVGV4dHVyZSBmcm9tIERlcHRoIFRleHR1cmVcclxuICAgICAgICB0aGlzLl9lbmNvZGVkVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcmlmeVdlYkdMRXh0ZW5zaW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBkZWZhdWx0IGxpZ2h0aW5nIGluIHRoZSBzY2VuZS5cclxuICAgICAqIExpZ2h0aW5nIGRvZXMgbm90IGFmZmVjdCB0aGUgZGVwdGggYnVmZmVyLiBJdCBpcyBvbmx5IHVzZWQgaWYgdGhlIGNhbnZhcyBpcyBtYWRlIHZpc2libGUuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVMaWdodGluZyAoc2NlbmUgOiBUSFJFRS5TY2VuZSkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYsIDAuMik7XHJcbiAgICAgICAgc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0MS5wb3NpdGlvbi5zZXQoMSwgMSwgMSk7XHJcbiAgICAgICAgc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUHJpbWFyeSAoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtIHNldHVwIGFuZCBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSAoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVByaW1hcnkoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQb3N0KCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFBvc3RQcm9jZXNzaW5nXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSByZW5kZXIgdGFyZ2V0IDx3aXRoIGEgZGVwdGggdGV4dHVyZSBidWZmZXI+LlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3REZXB0aFRleHR1cmVSZW5kZXJUYXJnZXQoKSA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0IHtcclxuXHJcbiAgICAgICAgLy8gTW9kZWwgU2NlbmUgLT4gKFJlbmRlciBUZXh0dXJlLCBEZXB0aCBUZXh0dXJlKVxyXG4gICAgICAgIGxldCByZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcblxyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLmZvcm1hdCAgICAgICAgICAgPSBUSFJFRS5SR0JBRm9ybWF0O1xyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLnR5cGUgICAgICAgICAgICAgPSBUSFJFRS5VbnNpZ25lZEJ5dGVUeXBlO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLm1pbkZpbHRlciAgICAgICAgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLm1hZ0ZpbHRlciAgICAgICAgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC50ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnN0ZW5jaWxCdWZmZXIgICAgICAgICAgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZW5kZXJUYXJnZXQuZGVwdGhCdWZmZXIgICAgICAgICAgICAgID0gdHJ1ZTtcclxuICAgICAgICByZW5kZXJUYXJnZXQuZGVwdGhUZXh0dXJlICAgICAgICAgICAgID0gbmV3IFRIUkVFLkRlcHRoVGV4dHVyZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuICAgICAgICByZW5kZXJUYXJnZXQuZGVwdGhUZXh0dXJlLnR5cGUgICAgICAgID0gVEhSRUUuVW5zaWduZWRJbnRUeXBlO1xyXG4gICAgXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlclRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uIG9mIHRoZSBwb3N0IHNjZW5lIHVzZWQgdG8gY3JlYXRlIHRoZSBmaW5hbCBSR0JBIGVuY29kZWQgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUG9zdFNjZW5lICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBwb3N0TWVzaE1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmVydGV4U2hhZGVyOiAgIE1SLnNoYWRlclNvdXJjZVsnRGVwdGhCdWZmZXJWZXJ0ZXhTaGFkZXInXSxcclxuICAgICAgICAgICAgZnJhZ21lbnRTaGFkZXI6IE1SLnNoYWRlclNvdXJjZVsnRGVwdGhCdWZmZXJGcmFnbWVudFNoYWRlciddLFxyXG5cclxuICAgICAgICAgICAgdW5pZm9ybXM6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYU5lYXIgIDogICB7IHZhbHVlOiB0aGlzLl9jYW1lcmEubmVhciB9LFxyXG4gICAgICAgICAgICAgICAgY2FtZXJhRmFyICAgOiAgIHsgdmFsdWU6IHRoaXMuX2NhbWVyYS5mYXIgfSxcclxuICAgICAgICAgICAgICAgIHREaWZmdXNlICAgIDogICB7IHZhbHVlOiB0aGlzLl90YXJnZXQudGV4dHVyZSB9LFxyXG4gICAgICAgICAgICAgICAgdERlcHRoICAgICAgOiAgIHsgdmFsdWU6IHRoaXMuX3RhcmdldC5kZXB0aFRleHR1cmUgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHBvc3RNZXNoUGxhbmUgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyLCAyKTtcclxuICAgICAgICBsZXQgcG9zdE1lc2hRdWFkICA9IG5ldyBUSFJFRS5NZXNoKHBvc3RNZXNoUGxhbmUsIHBvc3RNZXNoTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICB0aGlzLl9wb3N0U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICB0aGlzLl9wb3N0U2NlbmUuYWRkKHBvc3RNZXNoUXVhZCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RDYW1lcmEoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZyh0aGlzLl9wb3N0U2NlbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyB0aGUgb3J0aG9ncmFwaGljIGNhbWVyYSB1c2VkIHRvIGNvbnZlcnQgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciB0byB0aGUgZW5jb2RlZCBSR0JBIGJ1ZmZlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUG9zdENhbWVyYSgpIHtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgcG9zdCBwcm9jZXNzaW5nIHN0YWdlXHJcbiAgICAgICAgbGV0IGxlZnQ6IG51bWJlciAgICAgID0gIC0xO1xyXG4gICAgICAgIGxldCByaWdodDogbnVtYmVyICAgICA9ICAgMTtcclxuICAgICAgICBsZXQgdG9wOiBudW1iZXIgICAgICAgPSAgIDE7XHJcbiAgICAgICAgbGV0IGJvdHRvbTogbnVtYmVyICAgID0gIC0xO1xyXG4gICAgICAgIGxldCBuZWFyOiBudW1iZXIgICAgICA9ICAgMDtcclxuICAgICAgICBsZXQgZmFyOiBudW1iZXIgICAgICAgPSAgIDE7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3RDYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgbmVhciwgZmFyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUG9zdCAoKSA6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQb3N0U2NlbmUoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVQb3N0Q2FtZXJhKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEdlbmVyYXRpb25cclxuICAgIC8qKlxyXG4gICAgICogVmVyaWZpZXMgdGhlIHByZS1yZXF1aXNpdGUgc2V0dGluZ3MgYXJlIGRlZmluZWQgdG8gY3JlYXRlIGEgbWVzaC5cclxuICAgICAqL1xyXG4gICAgdmVyaWZ5TWVzaFNldHRpbmdzKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBsZXQgbWluaW11bVNldHRpbmdzIDogYm9vbGVhbiA9IHRydWVcclxuICAgICAgICBsZXQgZXJyb3JQcmVmaXggICAgIDogc3RyaW5nID0gJ0RlcHRoQnVmZmVyRmFjdG9yeTogJztcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRXJyb3JNZXNzYWdlKGAke2Vycm9yUHJlZml4fVRoZSBtb2RlbCBpcyBub3QgZGVmaW5lZC5gKTtcclxuICAgICAgICAgICAgbWluaW11bVNldHRpbmdzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRXJyb3JNZXNzYWdlKGAke2Vycm9yUHJlZml4fVRoZSBjYW1lcmEgaXMgbm90IGRlZmluZWQuYCk7XHJcbiAgICAgICAgICAgIG1pbmltdW1TZXR0aW5ncyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1pbmltdW1TZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYW4gUkdCQSBzdHJpbmcgd2l0aCB0aGUgYnl0ZSB2YWx1ZXMgb2YgYSBwaXhlbC5cclxuICAgICAqIEBwYXJhbSBidWZmZXIgVW5zaWduZWQgYnl0ZSByYXcgYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHJvdyBQaXhlbCByb3cuXHJcbiAgICAgKiBAcGFyYW0gY29sdW1uIENvbHVtbiByb3cuXHJcbiAgICAgKi9cclxuICAgICB1bnNpZ25lZEJ5dGVzVG9SR0JBIChidWZmZXIgOiBVaW50OEFycmF5LCByb3cgOiBudW1iZXIsIGNvbHVtbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvZmZzZXQgPSAocm93ICogdGhpcy5fd2lkdGgpICsgY29sdW1uO1xyXG4gICAgICAgIGxldCByVmFsdWUgPSBidWZmZXJbb2Zmc2V0ICsgMF0udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGxldCBnVmFsdWUgPSBidWZmZXJbb2Zmc2V0ICsgMV0udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGxldCBiVmFsdWUgPSBidWZmZXJbb2Zmc2V0ICsgMl0udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGxldCBhVmFsdWUgPSBidWZmZXJbb2Zmc2V0ICsgM10udG9TdHJpbmcoMTYpO1xyXG5cclxuICAgICAgICByZXR1cm4gYCMke3JWYWx1ZX0ke2dWYWx1ZX0ke2JWYWx1ZX0gJHthVmFsdWV9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuYWx5emVzIGEgcGl4ZWwgZnJvbSBhIHJlbmRlciBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGFuYWx5emVSZW5kZXJCdWZmZXIgKCkge1xyXG5cclxuICAgICAgICBsZXQgcmVuZGVyQnVmZmVyID0gIG5ldyBVaW50OEFycmF5KHRoaXMuX3dpZHRoICogdGhpcy5faGVpZ2h0ICogNCkuZmlsbCgwKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZWFkUmVuZGVyVGFyZ2V0UGl4ZWxzKHRoaXMuX3RhcmdldCwgMCwgMCwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgcmVuZGVyQnVmZmVyKTtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSBgUkdCQVswLCAwXSA9ICR7dGhpcy51bnNpZ25lZEJ5dGVzVG9SR0JBKHJlbmRlckJ1ZmZlciwgMCwgMCl9YDtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShtZXNzYWdlU3RyaW5nLCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuYWx5emUgdGhlIHJlbmRlciBhbmQgZGVwdGggdGFyZ2V0cy5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZVRhcmdldHMgKCkgIHtcclxuXHJcbi8vICAgICAgdGhpcy5hbmFseXplUmVuZGVyQnVmZmVyKCk7XHJcbi8vICAgICAgdGhpcy5fZGVwdGhCdWZmZXIuYW5hbHl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBjcmVhdGVEZXB0aEJ1ZmZlcigpIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyVGFnID0gU2VydmljZXMudGltZXIubWFyaygnRGVwdGhCdWZmZXJGYWN0b3J5LmNyZWF0ZURlcHRoQnVmZmVyJyk7ICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVuZGVyKHRoaXMuX3NjZW5lLCB0aGlzLl9jYW1lcmEsIHRoaXMuX3RhcmdldCk7ICAgIFxyXG4gICAgXHJcbiAgICAgICAgLy8gKG9wdGlvbmFsKSBwcmV2aWV3IGVuY29kZWQgUkdCQSB0ZXh0dXJlOyBkcmF3biBieSBzaGFkZXIgYnV0IG5vdCBwZXJzaXN0ZWRcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fcG9zdFNjZW5lLCB0aGlzLl9wb3N0Q2FtZXJhKTsgICAgXHJcblxyXG4gICAgICAgIC8vIFBlcnNpc3QgZW5jb2RlZCBSR0JBIHRleHR1cmU7IGNhbGN1bGF0ZWQgZnJvbSBkZXB0aCBidWZmZXJcclxuICAgICAgICAvLyBlbmNvZGVkVGFyZ2V0LnRleHR1cmUgICAgICA6IGVuY29kZWQgUkdCQSB0ZXh0dXJlXHJcbiAgICAgICAgLy8gZW5jb2RlZFRhcmdldC5kZXB0aFRleHR1cmUgOiBudWxsXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVuZGVyKHRoaXMuX3Bvc3RTY2VuZSwgdGhpcy5fcG9zdENhbWVyYSwgdGhpcy5fZW5jb2RlZFRhcmdldCk7IFxyXG5cclxuICAgICAgICAvLyBkZWNvZGUgUkdCQSB0ZXh0dXJlIGludG8gZGVwdGggZmxvYXRzXHJcbiAgICAgICAgbGV0IGRlcHRoQnVmZmVyUkdCQSA9ICBuZXcgVWludDhBcnJheSh0aGlzLl93aWR0aCAqIHRoaXMuX2hlaWdodCAqIDQpLmZpbGwoMCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVhZFJlbmRlclRhcmdldFBpeGVscyh0aGlzLl9lbmNvZGVkVGFyZ2V0LCAwLCAwLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCBkZXB0aEJ1ZmZlclJHQkEpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZXB0aEJ1ZmZlciA9IG5ldyBEZXB0aEJ1ZmZlcihkZXB0aEJ1ZmZlclJHQkEsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHRoaXMuX2NhbWVyYSk7ICAgIFxyXG5cclxuICAgICAgICB0aGlzLmFuYWx5emVUYXJnZXRzKCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzIGZvciBtZXNoIGdlbmVyYXRpb24uXHJcbiAgICAgKi9cclxuICAgIHNldENhbWVyYUNsaXBwaW5nUGxhbmVzICgpIHtcclxuXHJcbiAgICAgICAgLy8gY29weSBjYW1lcmE7IHNoYXJlZCB3aXRoIE1vZGVsVmlld2VyXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xyXG4gICAgICAgIGNhbWVyYS5jb3B5ICh0aGlzLl9jYW1lcmEpO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcclxuXHJcbiAgICAgICAgbGV0IGNsaXBwaW5nUGxhbmVzIDogQ2xpcHBpbmdQbGFuZXMgPSBDYW1lcmEuZ2V0Qm91bmRpbmdDbGlwcGluZ1BsYW5lcyh0aGlzLl9jYW1lcmEsIHRoaXMuX21vZGVsKTtcclxuICAgICAgICB0aGlzLl9jYW1lcmEubmVhciA9IGNsaXBwaW5nUGxhbmVzLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLmZhciAgPSBjbGlwcGluZ1BsYW5lcy5mYXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGEgbWVzaCBmcm9tIHRoZSBhY3RpdmUgbW9kZWwgYW5kIGNhbWVyYVxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgR2VuZXJhdGlvbiBwYXJhbWV0ZXJzIChNZXNoR2VuZXJhdGVQYXJhbWV0ZXJzKVxyXG4gICAgICovXHJcbiAgICBtZXNoR2VuZXJhdGUgKHBhcmFtZXRlcnMgOiBNZXNoR2VuZXJhdGVQYXJhbWV0ZXJzKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghdGhpcy52ZXJpZnlNZXNoU2V0dGluZ3MoKSkgXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLl9ib3VuZGVkQ2xpcHBpbmcgfHwgXHJcbiAgICAgICAgICAgICgodGhpcy5fY2FtZXJhLm5lYXIgPT09IENhbWVyYS5EZWZhdWx0TmVhckNsaXBwaW5nUGxhbmUpICYmICh0aGlzLl9jYW1lcmEuZmFyID09PSBDYW1lcmEuRGVmYXVsdEZhckNsaXBwaW5nUGxhbmUpKSlcclxuICAgICAgICAgICAgdGhpcy5zZXRDYW1lcmFDbGlwcGluZ1BsYW5lcygpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZURlcHRoQnVmZmVyKCk7XHJcbiAgICAgICAgbGV0IG1lc2ggPSB0aGlzLl9kZXB0aEJ1ZmZlci5tZXNoKHBhcmFtZXRlcnMubWF0ZXJpYWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGFuIGltYWdlIGZyb20gdGhlIGFjdGl2ZSBtb2RlbCBhbmQgY2FtZXJhXHJcbiAgICAgKiBAcGFyYW0gcGFyYW1ldGVycyBHZW5lcmF0aW9uIHBhcmFtZXRlcnMgKEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzKVxyXG4gICAgICovXHJcbiAgICBpbWFnZUdlbmVyYXRlIChwYXJhbWV0ZXJzIDogSW1hZ2VHZW5lcmF0ZVBhcmFtZXRlcnMpIDogVWludDhBcnJheSB7XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQgeyBEZXB0aEJ1ZmZlckZhY3RvcnkgfSBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtTdG9wV2F0Y2h9ICAgICAgICAgICAgZnJvbSAnU3RvcFdhdGNoJ1xyXG5cclxuZXhwb3J0IGVudW0gU3RhbmRhcmRWaWV3IHtcclxuICAgIE5vbmUsXHJcbiAgICBGcm9udCxcclxuICAgIEJhY2ssXHJcbiAgICBUb3AsXHJcbiAgICBCb3R0b20sXHJcbiAgICBMZWZ0LFxyXG4gICAgUmlnaHQsXHJcbiAgICBJc29tZXRyaWNcclxufVxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIENhbWVyYSBjbGlwcGluZyBwbGFuZXMgdHVwbGUuXHJcbiAqIEBleHBvcnRcclxuICogQGludGVyZmFjZSBDbGlwcGluZ1BsYW5lc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBDbGlwcGluZ1BsYW5lcyB7XHJcbiAgICBuZWFyIDogbnVtYmVyO1xyXG4gICAgZmFyICA6IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbWVyYVxyXG4gKiBHZW5lcmFsIGNhbWVyYSB1dGlsaXR5IG1ldGhvZHMuXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbWVyYSB7XHJcblxyXG4gICAgc3RhdGljIERlZmF1bHRGaWVsZE9mVmlldyAgICAgICA6IG51bWJlciA9IDM3OyAgICAgICAvLyAzNW1tIHZlcnRpY2FsIDogaHR0cHM6Ly93d3cubmlrb25pYW5zLm9yZy9yZXZpZXdzL2Zvdi10YWJsZXMgICAgICAgXHJcbiAgICBzdGF0aWMgRGVmYXVsdE5lYXJDbGlwcGluZ1BsYW5lIDogbnVtYmVyID0gMC4xOyBcclxuICAgIHN0YXRpYyBEZWZhdWx0RmFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXIgPSAxMDAwMDsgXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIENsaXBwaW5nIFBsYW5lc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZXh0ZW50cyBvZiB0aGUgbmVhciBjYW1lcmEgcGxhbmUuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhfSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMge1RIUkVFLlZlY3RvcjJ9IFxyXG4gICAgICogQG1lbWJlcm9mIEdyYXBoaWNzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXROZWFyUGxhbmVFeHRlbnRzKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFGT1ZSYWRpYW5zID0gY2FtZXJhLmZvdiAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgIFxyXG4gICAgICAgIGxldCBuZWFySGVpZ2h0ID0gMiAqIE1hdGgudGFuKGNhbWVyYUZPVlJhZGlhbnMgLyAyKSAqIGNhbWVyYS5uZWFyO1xyXG4gICAgICAgIGxldCBuZWFyV2lkdGggID0gY2FtZXJhLmFzcGVjdCAqIG5lYXJIZWlnaHQ7XHJcbiAgICAgICAgbGV0IGV4dGVudHMgPSBuZXcgVEhSRUUuVmVjdG9yMihuZWFyV2lkdGgsIG5lYXJIZWlnaHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBleHRlbnRzOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBGaW5kcyB0aGUgYm91bmRpbmcgY2xpcHBpbmcgcGxhbmVzIGZvciB0aGUgZ2l2ZW4gbW9kZWwuIFxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRCb3VuZGluZ0NsaXBwaW5nUGxhbmVzKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBtb2RlbCA6IFRIUkVFLk9iamVjdDNEKSA6IENsaXBwaW5nUGxhbmVze1xyXG5cclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3OiBUSFJFRS5Cb3gzID0gR3JhcGhpY3MuZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGJveCBpcyB3b3JsZC1heGlzIGFsaWduZWQuIFxyXG4gICAgICAgIC8vIEluIFZpZXcgY29vcmRpbmF0ZXMsIHRoZSBjYW1lcmEgaXMgYXQgdGhlIG9yaWdpbi5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgbmVhciBwbGFuZSBpcyB0aGUgbWF4aW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGZhciBwbGFuZSBpcyB0aGUgbWluaW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgbGV0IG5lYXJQbGFuZSA9IC1ib3VuZGluZ0JveFZpZXcubWF4Lno7XHJcbiAgICAgICAgbGV0IGZhclBsYW5lID0gLWJvdW5kaW5nQm94Vmlldy5taW4uejtcclxuXHJcbiAgICAgICAgbGV0IGNsaXBwaW5nUGxhbmVzIDogQ2xpcHBpbmdQbGFuZXMgPSB7XHJcblxyXG4gICAgICAgICAgICAvLyBhZGp1c3QgYnkgZXBzaWxvbiB0byBhdm9pZCBjbGlwcGluZyBnZW9tZXRyeSBhdCB0aGUgbmVhciBwbGFuZSBlZGdlXHJcbiAgICAgICAgICAgIG5lYXIgOiAgKDEgLSBEZXB0aEJ1ZmZlckZhY3RvcnkuTmVhclBsYW5lRXBzaWxvbikgKiBuZWFyUGxhbmUsXHJcbiAgICAgICAgICAgIGZhciAgOiBmYXJQbGFuZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xpcHBpbmdQbGFuZXM7XHJcbiAgICB9ICBcclxuXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFNldHRpbmdzXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgdGhlIGRlZmF1bHQgYm91bmRpbmcgYm94IGZvciBhIG1vZGVsLlxyXG4gICAgICogSWYgdGhlIG1vZGVsIGlzIGVtcHR5LCBhIHVuaXQgc3BoZXJlIGlzIHVzZXMgYXMgYSBwcm94eSB0byBwcm92aWRlIGRlZmF1bHRzLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5PYmplY3QzRH0gbW9kZWwgTW9kZWwgdG8gY2FsY3VsYXRlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5Cb3gzfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0RGVmYXVsdEJvdW5kaW5nQm94IChtb2RlbCA6IFRIUkVFLk9iamVjdDNEKSA6IFRIUkVFLkJveDMge1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpOyAgICAgICBcclxuICAgICAgICBpZiAobW9kZWwpIFxyXG4gICAgICAgICAgICBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChtb2RlbCk7IFxyXG5cclxuICAgICAgICBpZiAoIWJvdW5kaW5nQm94LmlzRW1wdHkoKSlcclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kaW5nQm94O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHVuaXQgc3BoZXJlIHByb3h5XHJcbiAgICAgICAgbGV0IHNwaGVyZVByb3h5ID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCAxKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChzcGhlcmVQcm94eSk7ICAgICAgICAgXHJcblxyXG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGVzIHRoZSBjYW1lcmEgdG8gZml0IHRoZSBtb2RlbCBpbiB0aGUgY3VycmVudCB2aWV3LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHBhcmFtIHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIENhbWVyYSB0byB1cGRhdGUuXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLkdyb3VwfSBtb2RlbCBNb2RlbCB0byBmaXQuXHJcbiAgICAgKiBAcmV0dXJucyB7Q2FtZXJhU2V0dGluZ3N9IFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Rml0Vmlld0NhbWVyYSAoY2FtZXJhVGVtcGxhdGUgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgbW9kZWwgOiBUSFJFRS5Hcm91cCwgKSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHsgXHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ0NhbWVyYS5nZXRGaXRWaWV3Q2FtZXJhJyk7ICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IGNhbWVyYVRlbXBsYXRlLmNsb25lKHRydWUpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFdvcmxkICAgICAgICAgOiBUSFJFRS5Cb3gzICAgID0gQ2FtZXJhLmdldERlZmF1bHRCb3VuZGluZ0JveChtb2RlbCk7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkICAgICAgICA6IFRIUkVFLk1hdHJpeDQgPSBjYW1lcmEubWF0cml4V29ybGQ7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSBjYW1lcmEubWF0cml4V29ybGRJbnZlcnNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZpbmQgY2FtZXJhIHBvc2l0aW9uIGluIFZpZXcgY29vcmRpbmF0ZXMuLi5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3OiBUSFJFRS5Cb3gzID0gR3JhcGhpY3MuZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgbGV0IHZlcnRpY2FsRmllbGRPZlZpZXdSYWRpYW5zICAgOiBudW1iZXIgPSAoY2FtZXJhLmZvdiAvIDIpICogKE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgIGxldCBob3Jpem9udGFsRmllbGRPZlZpZXdSYWRpYW5zIDogbnVtYmVyID0gTWF0aC5hdGFuKGNhbWVyYS5hc3BlY3QgKiBNYXRoLnRhbih2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucykpOyAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGNhbWVyYVpWZXJ0aWNhbEV4dGVudHMgICA6IG51bWJlciA9IChib3VuZGluZ0JveFZpZXcuZ2V0U2l6ZSgpLnkgLyAyKSAvIE1hdGgudGFuICh2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucyk7ICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFaSG9yaXpvbnRhbEV4dGVudHMgOiBudW1iZXIgPSAoYm91bmRpbmdCb3hWaWV3LmdldFNpemUoKS54IC8gMikgLyBNYXRoLnRhbiAoaG9yaXpvbnRhbEZpZWxkT2ZWaWV3UmFkaWFucyk7ICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFaID0gTWF0aC5tYXgoY2FtZXJhWlZlcnRpY2FsRXh0ZW50cywgY2FtZXJhWkhvcml6b250YWxFeHRlbnRzKTtcclxuXHJcbiAgICAgICAgLy8gcHJlc2VydmUgWFk7IHNldCBaIHRvIGluY2x1ZGUgZXh0ZW50c1xyXG4gICAgICAgIGxldCBjYW1lcmFQb3NpdGlvblZpZXcgPSBjYW1lcmEucG9zaXRpb24uYXBwbHlNYXRyaXg0KGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbGV0IHBvc2l0aW9uVmlldyA9IG5ldyBUSFJFRS5WZWN0b3IzKGNhbWVyYVBvc2l0aW9uVmlldy54LCBjYW1lcmFQb3NpdGlvblZpZXcueSwgYm91bmRpbmdCb3hWaWV3Lm1heC56ICsgY2FtZXJhWik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTm93LCB0cmFuc2Zvcm0gYmFjayB0byBXb3JsZCBjb29yZGluYXRlcy4uLlxyXG4gICAgICAgIGxldCBwb3NpdGlvbldvcmxkID0gcG9zaXRpb25WaWV3LmFwcGx5TWF0cml4NChjYW1lcmFNYXRyaXhXb3JsZCk7XHJcblxyXG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChwb3NpdGlvbldvcmxkKTtcclxuICAgICAgICBjYW1lcmEubG9va0F0KGJvdW5kaW5nQm94V29ybGQuZ2V0Q2VudGVyKCkpO1xyXG5cclxuICAgICAgICAvLyBmb3JjZSBjYW1lcmEgbWF0cml4IHRvIHVwZGF0ZTsgbWF0cml4QXV0b1VwZGF0ZSBoYXBwZW5zIGluIHJlbmRlciBsb29wXHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpO1xyXG4gICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTsgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGNhbWVyYTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIGNhbWVyYSBzZXR0aW5ncyB0byBmaXQgdGhlIG1vZGVsIGluIGEgc3RhbmRhcmQgdmlldy5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7Q2FtZXJhLlN0YW5kYXJkVmlld30gdmlldyBTdGFuZGFyZCB2aWV3IChUb3AsIExlZnQsIGV0Yy4pXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLk9iamVjdDNEfSBtb2RlbCBNb2RlbCB0byBmaXQuXHJcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuUGVyc3BlY3RpdmVDYW1lcmF9IFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0U3RhbmRhcmRWaWV3Q2FtZXJhICh2aWV3OiBTdGFuZGFyZFZpZXcsIHZpZXdBc3BlY3QgOiBudW1iZXIsIG1vZGVsIDogVEhSRUUuR3JvdXApIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgeyBcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyVGFnID0gU2VydmljZXMudGltZXIubWFyaygnQ2FtZXJhLmdldFN0YW5kYXJkVmlldycpOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNhbWVyYSA9IENhbWVyYS5nZXREZWZhdWx0Q2FtZXJhKHZpZXdBc3BlY3QpOyAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChtb2RlbCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNlbnRlclggPSBib3VuZGluZ0JveC5nZXRDZW50ZXIoKS54O1xyXG4gICAgICAgIGxldCBjZW50ZXJZID0gYm91bmRpbmdCb3guZ2V0Q2VudGVyKCkueTtcclxuICAgICAgICBsZXQgY2VudGVyWiA9IGJvdW5kaW5nQm94LmdldENlbnRlcigpLno7XHJcblxyXG4gICAgICAgIGxldCBtaW5YID0gYm91bmRpbmdCb3gubWluLng7XHJcbiAgICAgICAgbGV0IG1pblkgPSBib3VuZGluZ0JveC5taW4ueTtcclxuICAgICAgICBsZXQgbWluWiA9IGJvdW5kaW5nQm94Lm1pbi56O1xyXG4gICAgICAgIGxldCBtYXhYID0gYm91bmRpbmdCb3gubWF4Lng7XHJcbiAgICAgICAgbGV0IG1heFkgPSBib3VuZGluZ0JveC5tYXgueTtcclxuICAgICAgICBsZXQgbWF4WiA9IGJvdW5kaW5nQm94Lm1heC56O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAodmlldykgeyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LkZyb250OiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMoY2VudGVyWCwgIGNlbnRlclksIG1heFopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5CYWNrOiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMoY2VudGVyWCwgIGNlbnRlclksIG1pblopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Ub3A6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhjZW50ZXJYLCAgbWF4WSwgY2VudGVyWikpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAwLCAtMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Cb3R0b206IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhjZW50ZXJYLCBtaW5ZLCBjZW50ZXJaKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KDAsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuTGVmdDoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKG1pblgsIGNlbnRlclksIGNlbnRlclopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5SaWdodDoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKG1heFgsIGNlbnRlclksIGNlbnRlclopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Jc29tZXRyaWM6IHtcclxuICAgICAgICAgICAgICAgIGxldCBzaWRlID0gTWF0aC5tYXgoTWF0aC5tYXgoYm91bmRpbmdCb3guZ2V0U2l6ZSgpLngsIGJvdW5kaW5nQm94LmdldFNpemUoKS55KSwgYm91bmRpbmdCb3guZ2V0U2l6ZSgpLnopO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKHNpZGUsICBzaWRlLCBzaWRlKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KC0xLCAxLCAtMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRm9yY2Ugb3JpZW50YXRpb24gYmVmb3JlIEZpdCBWaWV3IGNhbGN1bGF0aW9uXHJcbiAgICAgICAgY2FtZXJhLmxvb2tBdChib3VuZGluZ0JveC5nZXRDZW50ZXIoKSk7XHJcblxyXG4gICAgICAgIC8vIGZvcmNlIGNhbWVyYSBtYXRyaXggdG8gdXBkYXRlOyBtYXRyaXhBdXRvVXBkYXRlIGhhcHBlbnMgaW4gcmVuZGVyIGxvb3BcclxuICAgICAgICBjYW1lcmEudXBkYXRlTWF0cml4V29ybGQodHJ1ZSk7XHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgY2FtZXJhID0gQ2FtZXJhLmdldEZpdFZpZXdDYW1lcmEoY2FtZXJhLCBtb2RlbCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTtcclxuICAgICAgICByZXR1cm4gY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGRlZmF1bHQgc2NlbmUgY2FtZXJhLlxyXG4gICAgICogQHBhcmFtIHZpZXdBc3BlY3QgVmlldyBhc3BlY3QgcmF0aW8uXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXREZWZhdWx0Q2FtZXJhICh2aWV3QXNwZWN0IDogbnVtYmVyKSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVmYXVsdENhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMgKDAsIDAsIDApKTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAtMSkpO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEubmVhciAgID0gQ2FtZXJhLkRlZmF1bHROZWFyQ2xpcHBpbmdQbGFuZTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmZhciAgICA9IENhbWVyYS5EZWZhdWx0RmFyQ2xpcHBpbmdQbGFuZTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmZvdiAgICA9IENhbWVyYS5EZWZhdWx0RmllbGRPZlZpZXc7XHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS5hc3BlY3QgPSB2aWV3QXNwZWN0O1xyXG5cclxuICAgICAgICAvLyBmb3JjZSBjYW1lcmEgbWF0cml4IHRvIHVwZGF0ZTsgbWF0cml4QXV0b1VwZGF0ZSBoYXBwZW5zIGluIHJlbmRlciBsb29wXHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTsgICAgICAgXHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4O1xyXG5cclxuICAgICAgICByZXR1cm4gZGVmYXVsdENhbWVyYTtcclxuICAgIH0gXHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGRlZmF1bHQgc2NlbmUgY2FtZXJhLlxyXG4gICAgICogQ3JlYXRlcyBhIGRlZmF1bHQgaWYgdGhlIGN1cnJlbnQgY2FtZXJhIGhhcyBub3QgYmVlbiBjb25zdHJ1Y3RlZC5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQWN0aXZlIGNhbWVyYSAocG9zc2libHkgbnVsbCkuXHJcbiAgICAgKiBAcGFyYW0gdmlld0FzcGVjdCBWaWV3IGFzcGVjdCByYXRpby5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldFNjZW5lQ2FtZXJhIChjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCB2aWV3QXNwZWN0IDogbnVtYmVyKSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHtcclxuXHJcbiAgICAgICAgaWYgKGNhbWVyYSlcclxuICAgICAgICAgICAgcmV0dXJuIGNhbWVyYTtcclxuXHJcbiAgICAgICAgbGV0IGRlZmF1bHRDYW1lcmEgPSBDYW1lcmEuZ2V0RGVmYXVsdENhbWVyYSh2aWV3QXNwZWN0KTtcclxuICAgICAgICByZXR1cm4gZGVmYXVsdENhbWVyYTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uIFxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuZXhwb3J0IGludGVyZmFjZSBNUkV2ZW50IHtcclxuXHJcbiAgICB0eXBlICAgIDogRXZlbnRUeXBlO1xyXG4gICAgdGFyZ2V0ICA6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gRXZlbnRUeXBlIHtcclxuXHJcbiAgICBOb25lLFxyXG4gICAgTmV3TW9kZWwsXHJcbiAgICBNZXNoR2VuZXJhdGVcclxufVxyXG5cclxudHlwZSBMaXN0ZW5lciA9IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkO1xyXG50eXBlIExpc3RlbmVyQXJyYXkgPSBMaXN0ZW5lcltdW107ICAvLyBMaXN0ZW5lcltdW0V2ZW50VHlwZV07XHJcblxyXG4vKipcclxuICogRXZlbnQgTWFuYWdlclxyXG4gKiBHZW5lcmFsIGV2ZW50IG1hbmFnZW1lbnQgYW5kIGRpc3BhdGNoaW5nLlxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xyXG5cclxuICAgIF9saXN0ZW5lcnMgOiBMaXN0ZW5lckFycmF5O1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgIC8qXHJcbiAgICAgKiBDcmVhdGVzIEV2ZW50TWFuYWdlciBvYmplY3QuIEl0IG5lZWRzIHRvIGJlIGNhbGxlZCB3aXRoICcuY2FsbCcgdG8gYWRkIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGFuIG9iamVjdC5cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciB0byBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRoYXQgZ2V0cyBhZGRlZC5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdGhhdCBnZXRzIGFkZGVkLlxyXG4gICAgICovXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKHR5cGU6IEV2ZW50VHlwZSwgbGlzdGVuZXI6IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkICk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tFdmVudFR5cGUuTm9uZV0gPSBbXTtcclxuICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgZG9lcyBub3QgZXhpc3Q7IGNyZWF0ZVxyXG4gICAgICAgIGlmIChsaXN0ZW5lcnNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgbGlzdGVuZXJzW3R5cGVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBkbyBub3RoaW5nIGlmIGxpc3RlbmVyIHJlZ2lzdGVyZWRcclxuICAgICAgICBpZiAobGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgLy8gYWRkIG5ldyBsaXN0ZW5lciB0byB0aGlzIGV2ZW50XHJcbiAgICAgICAgICAgIGxpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYSBsaXN0ZW5lciBpcyByZWdpc3RlcmVkIGZvciBhbiBldmVudC5cclxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBjaGVjay5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdG8gY2hlY2suLlxyXG4gICAgICovXHJcbiAgICBoYXNFdmVudExpc3RlbmVyKHR5cGU6IEV2ZW50VHlwZSwgbGlzdGVuZXI6IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIC8vIG5vIGV2ZW50cyAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGV4aXN0cyBhbmQgbGlzdGVuZXIgcmVnaXN0ZXJlZCA9PiB0cnVlXHJcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyc1t0eXBlXSAhPT0gdW5kZWZpbmVkICYmIGxpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLSAxOyAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRoYXQgZ2V0cyByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lciBmdW5jdGlvbiB0aGF0IGdldHMgcmVtb3ZlZC5cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGUsIGxpc3RlbmVyOiAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZCk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHM7IGRvIG5vdGhpbmdcclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSBcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcbiAgICAgICAgbGV0IGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbdHlwZV07XHJcblxyXG4gICAgICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0ZW5lckFycmF5LmluZGV4T2YobGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGlmIGZvdW5kXHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lckFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRmlyZSBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHRhcmdldCBFdmVudCB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBldmVudCB0aGF0IGdldHMgZmlyZWQuXHJcbiAgICAgKi9cclxuICAgIGRpc3BhdGNoRXZlbnQodGFyZ2V0IDogYW55LCBldmVudFR5cGUgOiBFdmVudFR5cGUsIC4uLmFyZ3MgOiBhbnlbXSk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHMgZGVmaW5lZDsgZG8gbm90aGluZ1xyXG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGlzdGVuZXJzICAgICA9IHRoaXMuX2xpc3RlbmVyczsgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbZXZlbnRUeXBlXTtcclxuXHJcbiAgICAgICAgaWYgKGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRoZUV2ZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZSAgIDogZXZlbnRUeXBlLCAgICAgICAgIC8vIHR5cGVcclxuICAgICAgICAgICAgICAgIHRhcmdldCA6IHRhcmdldCAgICAgICAgICAgICAvLyBzZXQgdGFyZ2V0IHRvIGluc3RhbmNlIHRyaWdnZXJpbmcgdGhlIGV2ZW50XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGR1cGxpY2F0ZSBvcmlnaW5hbCBhcnJheSBvZiBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgbGV0IGFycmF5ID0gbGlzdGVuZXJBcnJheS5zbGljZSgwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdKHRoZUV2ZW50LCAuLi5hcmdzKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXHJcbi8vIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb20vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3NvaGFta2FtYW5pL3RocmVlLW9iamVjdC1sb2FkZXIvYmxvYi9tYXN0ZXIvc291cmNlL2luZGV4LmpzICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge1NlcnZpY2VzfSAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1N0b3BXYXRjaH0gIGZyb20gJ1N0b3BXYXRjaCdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBPQkpMb2FkZXIgKCBtYW5hZ2VyICkge1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9ICggbWFuYWdlciAhPT0gdW5kZWZpbmVkICkgPyBtYW5hZ2VyIDogVEhSRUUuRGVmYXVsdExvYWRpbmdNYW5hZ2VyO1xyXG5cclxuICAgIHRoaXMubWF0ZXJpYWxzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLnJlZ2V4cCA9IHtcclxuICAgICAgICAvLyB2IGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdmVydGV4X3BhdHRlcm4gICAgICAgICAgIDogL152XFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspLyxcclxuICAgICAgICAvLyB2biBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIG5vcm1hbF9wYXR0ZXJuICAgICAgICAgICA6IC9edm5cXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIHZ0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgdXZfcGF0dGVybiAgICAgICAgICAgICAgIDogL152dFxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICBmYWNlX3ZlcnRleCAgICAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXHMrKC0/XFxkKylcXHMrKC0/XFxkKykoPzpcXHMrKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgIGZhY2VfdmVydGV4X3V2ICAgICAgICAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF91dl9ub3JtYWwgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICBmYWNlX3ZlcnRleF9ub3JtYWwgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBvIG9iamVjdF9uYW1lIHwgZyBncm91cF9uYW1lXHJcbiAgICAgICAgb2JqZWN0X3BhdHRlcm4gICAgICAgICAgIDogL15bb2ddXFxzKiguKyk/LyxcclxuICAgICAgICAvLyBzIGJvb2xlYW5cclxuICAgICAgICBzbW9vdGhpbmdfcGF0dGVybiAgICAgICAgOiAvXnNcXHMrKFxcZCt8b258b2ZmKS8sXHJcbiAgICAgICAgLy8gbXRsbGliIGZpbGVfcmVmZXJlbmNlXHJcbiAgICAgICAgbWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuIDogL15tdGxsaWIgLyxcclxuICAgICAgICAvLyB1c2VtdGwgbWF0ZXJpYWxfbmFtZVxyXG4gICAgICAgIG1hdGVyaWFsX3VzZV9wYXR0ZXJuICAgICA6IC9edXNlbXRsIC9cclxuICAgIH07XHJcblxyXG59O1xyXG5cclxuT0JKTG9hZGVyLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogT0JKTG9hZGVyLFxyXG5cclxuICAgIGxvYWQ6IGZ1bmN0aW9uICggdXJsLCBvbkxvYWQsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKSB7XHJcblxyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRmlsZUxvYWRlciggc2NvcGUubWFuYWdlciApO1xyXG4gICAgICAgIGxvYWRlci5zZXRQYXRoKCB0aGlzLnBhdGggKTtcclxuICAgICAgICBsb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgICAgICBvbkxvYWQoIHNjb3BlLnBhcnNlKCB0ZXh0ICkgKTtcclxuXHJcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0UGF0aDogZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXRoID0gdmFsdWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNYXRlcmlhbHM6IGZ1bmN0aW9uICggbWF0ZXJpYWxzICkge1xyXG5cclxuICAgICAgICB0aGlzLm1hdGVyaWFscyA9IG1hdGVyaWFscztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIF9jcmVhdGVQYXJzZXJTdGF0ZSA6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlID0ge1xyXG4gICAgICAgICAgICBvYmplY3RzICA6IFtdLFxyXG4gICAgICAgICAgICBvYmplY3QgICA6IHt9LFxyXG5cclxuICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgdXZzICAgICAgOiBbXSxcclxuXHJcbiAgICAgICAgICAgIG1hdGVyaWFsTGlicmFyaWVzIDogW10sXHJcblxyXG4gICAgICAgICAgICBzdGFydE9iamVjdDogZnVuY3Rpb24gKCBuYW1lLCBmcm9tRGVjbGFyYXRpb24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgb2JqZWN0IChpbml0aWFsIGZyb20gcmVzZXQpIGlzIG5vdCBmcm9tIGEgZy9vIGRlY2xhcmF0aW9uIGluIHRoZSBwYXJzZWRcclxuICAgICAgICAgICAgICAgIC8vIGZpbGUuIFdlIG5lZWQgdG8gdXNlIGl0IGZvciB0aGUgZmlyc3QgcGFyc2VkIGcvbyB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPT09IGZhbHNlICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPSAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c01hdGVyaWFsID0gKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsID09PSAnZnVuY3Rpb24nID8gdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsKCkgOiB1bmRlZmluZWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSggdHJ1ZSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tRGVjbGFyYXRpb24gOiAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV2cyAgICAgIDogW11cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFscyA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TWF0ZXJpYWwgOiBmdW5jdGlvbiggbmFtZSwgbGlicmFyaWVzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5fZmluYWxpemUoIGZhbHNlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXcgdXNlbXRsIGRlY2xhcmF0aW9uIG92ZXJ3cml0ZXMgYW4gaW5oZXJpdGVkIG1hdGVyaWFsLCBleGNlcHQgaWYgZmFjZXMgd2VyZSBkZWNsYXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGUgbWF0ZXJpYWwsIHRoZW4gaXQgbXVzdCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBwcmV2aW91cyAmJiAoIHByZXZpb3VzLmluaGVyaXRlZCB8fCBwcmV2aW91cy5ncm91cENvdW50IDw9IDAgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5zcGxpY2UoIHByZXZpb3VzLmluZGV4LCAxICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogdGhpcy5tYXRlcmlhbHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogKCBBcnJheS5pc0FycmF5KCBsaWJyYXJpZXMgKSAmJiBsaWJyYXJpZXMubGVuZ3RoID4gMCA/IGxpYnJhcmllc1sgbGlicmFyaWVzLmxlbmd0aCAtIDEgXSA6ICcnICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbW9vdGggICAgIDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuc21vb3RoIDogdGhpcy5zbW9vdGggKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiAoIHByZXZpb3VzICE9PSB1bmRlZmluZWQgPyBwcmV2aW91cy5ncm91cEVuZCA6IDAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmVkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogKCB0eXBlb2YgaW5kZXggPT09ICdudW1iZXInID8gaW5kZXggOiB0aGlzLmluZGV4ICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG10bGxpYiAgICAgOiB0aGlzLm10bGxpYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21vb3RoICAgICA6IHRoaXMuc21vb3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0IDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZC5jbG9uZSA9IHRoaXMuY2xvbmUuYmluZChjbG9uZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKCBtYXRlcmlhbCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGVyaWFsc1sgdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBfZmluYWxpemUgOiBmdW5jdGlvbiggZW5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RNdWx0aU1hdGVyaWFsID0gdGhpcy5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBsYXN0TXVsdGlNYXRlcmlhbCAmJiBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9PT0gLTEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPSB0aGlzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cENvdW50ID0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgLSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cFN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuaW5oZXJpdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgb2JqZWN0cyB0YWlsIG1hdGVyaWFscyBpZiBubyBmYWNlIGRlY2xhcmF0aW9ucyBmb2xsb3dlZCB0aGVtIGJlZm9yZSBhIG5ldyBvL2cgc3RhcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSB0aGlzLm1hdGVyaWFscy5sZW5ndGggLSAxOyBtaSA+PSAwOyBtaS0tICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHNbbWldLmdyb3VwQ291bnQgPD0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMuc3BsaWNlKCBtaSwgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEd1YXJhbnRlZSBhdCBsZWFzdCBvbmUgZW1wdHkgbWF0ZXJpYWwsIHRoaXMgbWFrZXMgdGhlIGNyZWF0aW9uIGxhdGVyIG1vcmUgc3RyYWlnaHQgZm9yd2FyZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBlbmQgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID09PSAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtb290aCA6IHRoaXMuc21vb3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0TXVsdGlNYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJbmhlcml0IHByZXZpb3VzIG9iamVjdHMgbWF0ZXJpYWwuXHJcbiAgICAgICAgICAgICAgICAvLyBTcGVjIHRlbGxzIHVzIHRoYXQgYSBkZWNsYXJlZCBtYXRlcmlhbCBtdXN0IGJlIHNldCB0byBhbGwgb2JqZWN0cyB1bnRpbCBhIG5ldyBtYXRlcmlhbCBpcyBkZWNsYXJlZC5cclxuICAgICAgICAgICAgICAgIC8vIElmIGEgdXNlbXRsIGRlY2xhcmF0aW9uIGlzIGVuY291bnRlcmVkIHdoaWxlIHRoaXMgbmV3IG9iamVjdCBpcyBiZWluZyBwYXJzZWQsIGl0IHdpbGxcclxuICAgICAgICAgICAgICAgIC8vIG92ZXJ3cml0ZSB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLiBFeGNlcHRpb24gYmVpbmcgdGhhdCB0aGVyZSB3YXMgYWxyZWFkeSBmYWNlIGRlY2xhcmF0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGluaGVyaXRlZCBtYXRlcmlhbCwgdGhlbiBpdCB3aWxsIGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggcHJldmlvdXNNYXRlcmlhbCAmJiBwcmV2aW91c01hdGVyaWFsLm5hbWUgJiYgdHlwZW9mIHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUgPT09IFwiZnVuY3Rpb25cIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlY2xhcmVkID0gcHJldmlvdXNNYXRlcmlhbC5jbG9uZSggMCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlY2xhcmVkLmluaGVyaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QubWF0ZXJpYWxzLnB1c2goIGRlY2xhcmVkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKCB0aGlzLm9iamVjdCApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZpbmFsaXplIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VWZXJ0ZXhJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VOb3JtYWxJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFyc2VVVkluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMiApICogMjtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRWZXJ0ZXg6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVmVydGV4TGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGROb3JtYWwgOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMubm9ybWFscztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS5ub3JtYWxzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRVVjogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFVWTGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEZhY2U6IGZ1bmN0aW9uICggYSwgYiwgYywgZCwgdWEsIHViLCB1YywgdWQsIG5hLCBuYiwgbmMsIG5kICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlhID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBhLCB2TGVuICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWIgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGIsIHZMZW4gKTtcclxuICAgICAgICAgICAgICAgIHZhciBpYyA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYywgdkxlbiApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBkLCB2TGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB1YSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlhID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVhLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGliID0gdGhpcy5wYXJzZVVWSW5kZXgoIHViLCB1dkxlbiApO1xyXG4gICAgICAgICAgICAgICAgICAgIGljID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVjLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVkLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBuYSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBOb3JtYWxzIGFyZSBtYW55IHRpbWVzIHRoZSBzYW1lLiBJZiBzbywgc2tpcCBmdW5jdGlvbiBjYWxsIGFuZCBwYXJzZUludC5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbkxlbiA9IHRoaXMubm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWEgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5hLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGliID0gbmEgPT09IG5iID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5iLCBuTGVuICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWMgPSBuYSA9PT0gbmMgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmMsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5kLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZExpbmVHZW9tZXRyeTogZnVuY3Rpb24gKCB2ZXJ0aWNlcywgdXZzICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Lmdlb21ldHJ5LnR5cGUgPSAnTGluZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdmkgPSAwLCBsID0gdmVydGljZXMubGVuZ3RoOyB2aSA8IGw7IHZpICsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleExpbmUoIHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggdmVydGljZXNbIHZpIF0sIHZMZW4gKSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgdXZpID0gMCwgbCA9IHV2cy5sZW5ndGg7IHV2aSA8IGw7IHV2aSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVVkxpbmUoIHRoaXMucGFyc2VVVkluZGV4KCB1dnNbIHV2aSBdLCB1dkxlbiApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzdGF0ZS5zdGFydE9iamVjdCggJycsIGZhbHNlICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlOiBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ09CSkxvYWRlci5wYXJzZScpOyAgICAgICAgXHJcblxyXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX2NyZWF0ZVBhcnNlclN0YXRlKCk7XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxyXFxuJyApICE9PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIFN0cmluZy5zcGxpdCB3aXRoIHJlZ2V4IHRoYXQgc3BsaXRzIG9uIGJvdGhcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggL1xcclxcbi9nLCAnXFxuJyApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxcXFxcbicgKSAhPT0gLSAxKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBqb2luIGxpbmVzIHNlcGFyYXRlZCBieSBhIGxpbmUgY29udGludWF0aW9uIGNoYXJhY3RlciAoXFwpXHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXFxcXFxuL2csICcnICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxpbmVzID0gdGV4dC5zcGxpdCggJ1xcbicgKTtcclxuICAgICAgICB2YXIgbGluZSA9ICcnLCBsaW5lRmlyc3RDaGFyID0gJycsIGxpbmVTZWNvbmRDaGFyID0gJyc7XHJcbiAgICAgICAgdmFyIGxpbmVMZW5ndGggPSAwO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gRmFzdGVyIHRvIGp1c3QgdHJpbSBsZWZ0IHNpZGUgb2YgdGhlIGxpbmUuIFVzZSBpZiBhdmFpbGFibGUuXHJcbiAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAvLyB2YXIgdHJpbUxlZnQgPSAoIHR5cGVvZiAnJy50cmltTGVmdCA9PT0gJ2Z1bmN0aW9uJyApO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF07XHJcblxyXG4gICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAvLyBsaW5lID0gdHJpbUxlZnQgPyBsaW5lLnRyaW1MZWZ0KCkgOiBsaW5lLnRyaW0oKTtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgbGluZUxlbmd0aCA9IGxpbmUubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsaW5lTGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBsaW5lRmlyc3RDaGFyID0gbGluZS5jaGFyQXQoIDAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEB0b2RvIGludm9rZSBwYXNzZWQgaW4gaGFuZGxlciBpZiBhbnlcclxuICAgICAgICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAnIycgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJ3YnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxpbmVTZWNvbmRDaGFyID0gbGluZS5jaGFyQXQoIDEgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAnICcgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC52ZXJ0ZXhfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInYgMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICduJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm5vcm1hbF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm5vcm1hbHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICd0JyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnV2X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAxICAgICAgMlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudXZzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIHZlcnRleC9ub3JtYWwvdXYgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwiZlwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91dl9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICAgNyAgICA4ICAgIDkgICAxMCAgICAgICAgIDExICAgICAgICAgMTJcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMS8xIDIvMi8yIDMvMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA3IF0sIHJlc3VsdFsgMTAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDggXSwgcmVzdWx0WyAxMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOSBdLCByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXYuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMSAyLzIgMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfbm9ybWFsLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxLy8xIDIvLzIgMy8vM1wiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgMSAgICAyICAgIDMgICA0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDIgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNCBdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBmYWNlIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lRmlyc3RDaGFyID09PSBcImxcIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVBhcnRzID0gbGluZS5zdWJzdHJpbmcoIDEgKS50cmltKCkuc3BsaXQoIFwiIFwiICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGluZVZlcnRpY2VzID0gW10sIGxpbmVVVnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGxpbmUuaW5kZXhPZiggXCIvXCIgKSA9PT0gLSAxICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsaW5lVmVydGljZXMgPSBsaW5lUGFydHM7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGxpID0gMCwgbGxlbiA9IGxpbmVQYXJ0cy5sZW5ndGg7IGxpIDwgbGxlbjsgbGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBsaW5lUGFydHNbIGxpIF0uc3BsaXQoIFwiL1wiICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAwIF0gIT09IFwiXCIgKSBsaW5lVmVydGljZXMucHVzaCggcGFydHNbIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhcnRzWyAxIF0gIT09IFwiXCIgKSBsaW5lVVZzLnB1c2goIHBhcnRzWyAxIF0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXRlLmFkZExpbmVHZW9tZXRyeSggbGluZVZlcnRpY2VzLCBsaW5lVVZzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm9iamVjdF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG8gb2JqZWN0X25hbWVcclxuICAgICAgICAgICAgICAgIC8vIG9yXHJcbiAgICAgICAgICAgICAgICAvLyBnIGdyb3VwX25hbWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXT1JLQVJPVU5EOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yODY5XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgbmFtZSA9IHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gKCBcIiBcIiArIHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKSApLnN1YnN0ciggMSApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLnN0YXJ0T2JqZWN0KCBuYW1lICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF91c2VfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWF0ZXJpYWxcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5vYmplY3Quc3RhcnRNYXRlcmlhbCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCksIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG10bCBmaWxlXHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMucHVzaCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuc21vb3RoaW5nX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBIYW5kbGUgZmlsZXMgdGhhdCBoYXZlIHZhcnlpbmcgc21vb3RoIHZhbHVlcyBmb3IgYSBzZXQgb2YgZmFjZXMgaW5zaWRlIG9uZSBnZW9tZXRyeSxcclxuICAgICAgICAgICAgICAgIC8vIGJ1dCBkb2VzIG5vdCBkZWZpbmUgYSB1c2VtdGwgZm9yIGVhY2ggZmFjZSBzZXQuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhbmQgYSBkdW1teSBtYXRlcmlhbCBjcmVhdGVkIChsYXRlciBNdWx0aU1hdGVyaWFsIGFuZCBnZW9tZXRyeSBncm91cHMpLlxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyByZXF1aXJlcyBzb21lIGNhcmUgdG8gbm90IGNyZWF0ZSBleHRyYSBtYXRlcmlhbCBvbiBlYWNoIHNtb290aCB2YWx1ZSBmb3IgXCJub3JtYWxcIiBvYmogZmlsZXMuXHJcbiAgICAgICAgICAgICAgICAvLyB3aGVyZSBleHBsaWNpdCB1c2VtdGwgZGVmaW5lcyBnZW9tZXRyeSBncm91cHMuXHJcbiAgICAgICAgICAgICAgICAvLyBFeGFtcGxlIGFzc2V0OiBleGFtcGxlcy9tb2RlbHMvb2JqL2NlcmJlcnVzL0NlcmJlcnVzLm9ialxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdFsgMSBdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGh0dHA6Ly9wYXVsYm91cmtlLm5ldC9kYXRhZm9ybWF0cy9vYmovXHJcbiAgICAgICAgICAgICAgICAgKiBvclxyXG4gICAgICAgICAgICAgICAgICogaHR0cDovL3d3dy5jcy51dGFoLmVkdS9+Ym91bG9zL2NzMzUwNS9vYmpfc3BlYy5wZGZcclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBGcm9tIGNoYXB0ZXIgXCJHcm91cGluZ1wiIFN5bnRheCBleHBsYW5hdGlvbiBcInMgZ3JvdXBfbnVtYmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgKiBcImdyb3VwX251bWJlciBpcyB0aGUgc21vb3RoaW5nIGdyb3VwIG51bWJlci4gVG8gdHVybiBvZmYgc21vb3RoaW5nIGdyb3VwcywgdXNlIGEgdmFsdWUgb2YgMCBvciBvZmYuXHJcbiAgICAgICAgICAgICAgICAgKiBQb2x5Z29uYWwgZWxlbWVudHMgdXNlIGdyb3VwIG51bWJlcnMgdG8gcHV0IGVsZW1lbnRzIGluIGRpZmZlcmVudCBzbW9vdGhpbmcgZ3JvdXBzLiBGb3IgZnJlZS1mb3JtXHJcbiAgICAgICAgICAgICAgICAgKiBzdXJmYWNlcywgc21vb3RoaW5nIGdyb3VwcyBhcmUgZWl0aGVyIHR1cm5lZCBvbiBvciBvZmY7IHRoZXJlIGlzIG5vIGRpZmZlcmVuY2UgYmV0d2VlbiB2YWx1ZXMgZ3JlYXRlclxyXG4gICAgICAgICAgICAgICAgICogdGhhbiAwLlwiXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdC5zbW9vdGggPSAoIHZhbHVlICE9PSAnMCcgJiYgdmFsdWUgIT09ICdvZmYnICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gc3RhdGUub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc21vb3RoID0gc3RhdGUub2JqZWN0LnNtb290aDtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBudWxsIHRlcm1pbmF0ZWQgZmlsZXMgd2l0aG91dCBleGNlcHRpb25cclxuICAgICAgICAgICAgICAgIGlmICggbGluZSA9PT0gJ1xcMCcgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGUuZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgLy9jb250YWluZXIubWF0ZXJpYWxMaWJyYXJpZXMgPSBbXS5jb25jYXQoIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcbiAgICAgICAgKDxhbnk+Y29udGFpbmVyKS5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsID0gc3RhdGUub2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG9iamVjdCA9IHN0YXRlLm9iamVjdHNbIGkgXTtcclxuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5O1xyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzID0gb2JqZWN0Lm1hdGVyaWFscztcclxuICAgICAgICAgICAgdmFyIGlzTGluZSA9ICggZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmUnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIG8vZyBsaW5lIGRlY2xhcmF0aW9ucyB0aGF0IGRpZCBub3QgZm9sbG93IHdpdGggYW55IGZhY2VzXHJcbiAgICAgICAgICAgIGlmICggZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnVmZmVyZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHJcbiAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudmVydGljZXMgKSwgMyApICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdub3JtYWwnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS5ub3JtYWxzICksIDMgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBnZW9tZXRyeS51dnMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnV2cyApLCAyICkgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBtYXRlcmlhbHNcclxuICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgLy92YXIgY3JlYXRlZE1hdGVyaWFscyA9IFtdOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjcmVhdGVkTWF0ZXJpYWxzIDogVEhSRUUuTWF0ZXJpYWxbXSA9IFtdOyAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VNYXRlcmlhbCA9IG1hdGVyaWFsc1ttaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscyAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFscy5jcmVhdGUoIHNvdXJjZU1hdGVyaWFsLm5hbWUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbXRsIGV0Yy4gbG9hZGVycyBwcm9iYWJseSBjYW4ndCBjcmVhdGUgbGluZSBtYXRlcmlhbHMgY29ycmVjdGx5LCBjb3B5IHByb3BlcnRpZXMgdG8gYSBsaW5lIG1hdGVyaWFsLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNMaW5lICYmIG1hdGVyaWFsICYmICEgKCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWxMaW5lID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsTGluZS5jb3B5KCBtYXRlcmlhbCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IG1hdGVyaWFsTGluZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICEgbWF0ZXJpYWwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpIDogbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5uYW1lID0gc291cmNlTWF0ZXJpYWwubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2hhZGluZyA9IHNvdXJjZU1hdGVyaWFsLnNtb290aCA/IFRIUkVFLlNtb290aFNoYWRpbmcgOiBUSFJFRS5GbGF0U2hhZGluZztcclxuXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkTWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1lc2hcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBjcmVhdGVkTWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRHcm91cCggc291cmNlTWF0ZXJpYWwuZ3JvdXBTdGFydCwgc291cmNlTWF0ZXJpYWwuZ3JvdXBDb3VudCwgbWkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgLy9tZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFscyApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHMgKSApO1xyXG4gICAgICAgICAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbMF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsICkgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAgICAgICAgIC8vbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZU1hdGVyaWFscykgKTtcclxuICAgICAgICAgICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSA6IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoIGJ1ZmZlcmdlb21ldHJ5LCBudWxsKSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGQoIG1lc2ggKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZyk7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhLCBTdGFuZGFyZFZpZXd9ICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzLCBPYmplY3ROYW1lc30gICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIlZpZXdlclwiXHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIENhbWVyYUNvbnRyb2xzXHJcbiAqL1xyXG5jbGFzcyBDYW1lcmFTZXR0aW5ncyB7XHJcblxyXG4gICAgZml0VmlldyAgICAgICAgICAgIDogKCkgPT4gdm9pZDtcclxuICAgIGFkZENhbWVyYUhlbHBlciAgICA6ICgpID0+IHZvaWQ7XHJcbiAgICBcclxuICAgIHN0YW5kYXJkVmlldyAgICAgICAgICA6IFN0YW5kYXJkVmlldztcclxuICAgIGZpZWxkT2ZWaWV3OiBudW1iZXIgICA7XHJcbiAgICBuZWFyQ2xpcHBpbmdQbGFuZSAgICAgOiBudW1iZXI7XHJcbiAgICBmYXJDbGlwcGluZ1BsYW5lICAgICAgOiBudW1iZXI7XHJcbiAgICBib3VuZENsaXBwaW5nUGxhbmVzICAgOiAoKSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCBmaXRWaWV3OiAoKSA9PiBhbnksIGFkZEN3bWVyYUhlbHBlcjogKCkgPT4gYW55LCBib3VuZENsaXBwaW5nUGxhbmVzOiAoKSA9PiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5maXRWaWV3ICAgICAgICAgPSBmaXRWaWV3O1xyXG4gICAgICAgIHRoaXMuYWRkQ2FtZXJhSGVscGVyID0gYWRkQ3dtZXJhSGVscGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhbmRhcmRWaWV3ICAgICAgICAgID0gU3RhbmRhcmRWaWV3LkZyb250O1xyXG4gICAgICAgIHRoaXMuZmllbGRPZlZpZXcgICAgICAgICAgID0gY2FtZXJhLmZvdjtcclxuICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lICAgICA9IGNhbWVyYS5uZWFyO1xyXG4gICAgICAgIHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSAgICAgID0gY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLmJvdW5kQ2xpcHBpbmdQbGFuZXMgPSBib3VuZENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogY2FtZXJhIFVJIENvbnRyb2xzLlxyXG4gKi8gICAgXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmFDb250cm9scyB7XHJcblxyXG4gICAgX3ZpZXdlciAgICAgICAgICAgICAgICAgICA6IFZpZXdlcjsgICAgICAgICAgICAgICAgICAgICAvLyBhc3NvY2lhdGVkIHZpZXdlclxyXG4gICAgX2NhbWVyYVNldHRpbmdzICAgICAgICAgICA6IENhbWVyYVNldHRpbmdzOyAgICAgICAgICAgICAvLyBVSSBzZXR0aW5nc1xyXG4gICAgX2NvbnRyb2xOZWFyQ2xpcHBpbmdQbGFuZSA6IGRhdC5HVUlDb250cm9sbGVyO1xyXG4gICAgX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lICA6IGRhdC5HVUlDb250cm9sbGVyO1xyXG4gICAgXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIENhbWVyYUNvbnRyb2xzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iodmlld2VyIDogVmlld2VyKSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyID0gdmlld2VyO1xyXG5cclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuICAgIC8qKlxyXG4gICAgICogRml0cyB0aGUgYWN0aXZlIHZpZXcuXHJcbiAgICAgKi9cclxuICAgIGZpdFZpZXcoKSA6IHZvaWQgeyBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92aWV3ZXIuZml0VmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIGNhbWVyYSB2aXN1YWxpemF0aW9uIGdyYXBoaWMgdG8gdGhlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBhZGRDYW1lcmFIZWxwZXIoKSA6IHZvaWQgeyBcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlQWxsQnlOYW1lKHRoaXMuX3ZpZXdlci5zY2VuZSwgT2JqZWN0TmFtZXMuQ2FtZXJhSGVscGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBXb3JsZFxyXG4gICAgICAgIEdyYXBoaWNzLmFkZENhbWVyYUhlbHBlcih0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLl92aWV3ZXIuc2NlbmUsIHRoaXMuX3ZpZXdlci5tb2RlbCk7XHJcblxyXG4gICAgICAgIC8vIFZpZXdcclxuICAgICAgICBsZXQgbW9kZWxWaWV3ID0gR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QodGhpcy5fdmlld2VyLm1vZGVsLCB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbGV0IGNhbWVyYVZpZXcgPSBDYW1lcmEuZ2V0RGVmYXVsdENhbWVyYSh0aGlzLl92aWV3ZXIuYXNwZWN0UmF0aW8pO1xyXG4gICAgICAgIEdyYXBoaWNzLmFkZENhbWVyYUhlbHBlcihjYW1lcmFWaWV3LCB0aGlzLl92aWV3ZXIuc2NlbmUsIG1vZGVsVmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3JjZSB0aGUgZmFyIGNsaXBwaW5nIHBsYW5lIHRvIHRoZSBtb2RlbCBleHRlbnRzLlxyXG4gICAgICovXHJcbiAgICBib3VuZENsaXBwaW5nUGxhbmVzKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgY2xpcHBpbmdQbGFuZXMgPSBDYW1lcmEuZ2V0Qm91bmRpbmdDbGlwcGluZ1BsYW5lcyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLl92aWV3ZXIubW9kZWwpO1xyXG5cclxuICAgICAgICAvLyBjYW1lcmFcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSBjbGlwcGluZ1BsYW5lcy5uZWFyO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEuZmFyICA9IGNsaXBwaW5nUGxhbmVzLmZhcjtcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLy8gVUkgY29udHJvbHNcclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5uZWFyQ2xpcHBpbmdQbGFuZSA9IGNsaXBwaW5nUGxhbmVzLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lLm1pbihjbGlwcGluZ1BsYW5lcy5uZWFyKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sTmVhckNsaXBwaW5nUGxhbmUubWF4IChjbGlwcGluZ1BsYW5lcy5mYXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzLmZhckNsaXBwaW5nUGxhbmUgID0gY2xpcHBpbmdQbGFuZXMuZmFyO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lLm1pbihjbGlwcGluZ1BsYW5lcy5uZWFyKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sRmFyQ2xpcHBpbmdQbGFuZS5tYXgoY2xpcHBpbmdQbGFuZXMuZmFyKTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlldyBzZXR0aW5ncyB0aGF0IGFyZSBjb250cm9sbGFibGUgYnkgdGhlIHVzZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncyA9IG5ldyBDYW1lcmFTZXR0aW5ncyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLmZpdFZpZXcuYmluZCh0aGlzKSwgdGhpcy5hZGRDYW1lcmFIZWxwZXIuYmluZCh0aGlzKSwgdGhpcy5ib3VuZENsaXBwaW5nUGxhbmVzLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBJbml0IGRhdC5ndWkgYW5kIGNvbnRyb2xzIGZvciB0aGUgVUlcclxuICAgICAgICBsZXQgZ3VpID0gbmV3IGRhdC5HVUkoe1xyXG4gICAgICAgICAgICBhdXRvUGxhY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICB3aWR0aDogMzIwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBtZW51RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fdmlld2VyLmNvbnRhaW5lcklkKTtcclxuICAgICAgICBtZW51RGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IGNhbWVyYU9wdGlvbnMgPSBndWkuYWRkRm9sZGVyKCdDYW1lcmEgT3B0aW9ucycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZpdCBWaWV3XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGaXRWaWV3ID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdmaXRWaWV3JykubmFtZSgnRml0IFZpZXcnKTtcclxuXHJcbiAgICAgICAgLy8gQ2FtZXJhSGVscGVyXHJcbiAgICAgICAgbGV0IGNvbnRyb2xDYW1lcmFIZWxwZXIgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2FkZENhbWVyYUhlbHBlcicpLm5hbWUoJ0NhbWVyYSBIZWxwZXInKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBTdGFuZGFyZCBWaWV3c1xyXG4gICAgICAgIGxldCB2aWV3T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgRnJvbnQgICAgICAgOiBTdGFuZGFyZFZpZXcuRnJvbnQsXHJcbiAgICAgICAgICAgIEJhY2sgICAgICAgIDogU3RhbmRhcmRWaWV3LkJhY2ssXHJcbiAgICAgICAgICAgIFRvcCAgICAgICAgIDogU3RhbmRhcmRWaWV3LlRvcCxcclxuICAgICAgICAgICAgSXNvbWV0cmljICAgOiBTdGFuZGFyZFZpZXcuSXNvbWV0cmljLFxyXG4gICAgICAgICAgICBMZWZ0ICAgICAgICA6IFN0YW5kYXJkVmlldy5MZWZ0LFxyXG4gICAgICAgICAgICBSaWdodCAgICAgICA6IFN0YW5kYXJkVmlldy5SaWdodCxcclxuICAgICAgICAgICAgQm90dG9tICAgICAgOiBTdGFuZGFyZFZpZXcuQm90dG9tXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTdGFuZGFyZFZpZXdzID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdzdGFuZGFyZFZpZXcnLCB2aWV3T3B0aW9ucykubmFtZSgnU3RhbmRhcmQgVmlldycpLmxpc3RlbigpO1xyXG4gICAgICAgIGNvbnRyb2xTdGFuZGFyZFZpZXdzLm9uQ2hhbmdlICgodmlld1NldHRpbmcgOiBzdHJpbmcpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2aWV3IDogU3RhbmRhcmRWaWV3ID0gcGFyc2VJbnQodmlld1NldHRpbmcsIDEwKTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyh2aWV3KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gRmllbGQgb2YgVmlld1xyXG4gICAgICAgIGxldCBtaW5pbXVtID0gMjU7XHJcbiAgICAgICAgbGV0IG1heGltdW0gPSA3NTtcclxuICAgICAgICBsZXQgc3RlcFNpemUgPSAxO1xyXG4gICAgICAgIGxldCBjb250cm9sRmllbGRPZlZpZXcgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2ZpZWxkT2ZWaWV3JykubmFtZSgnRmllbGQgb2YgVmlldycpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7O1xyXG4gICAgICAgIGNvbnRyb2xGaWVsZE9mVmlldy5vbkNoYW5nZShmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZvdiA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gTmVhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAwLjE7XHJcbiAgICAgICAgbWF4aW11bSAgPSAxMDA7XHJcbiAgICAgICAgc3RlcFNpemUgPSAgIDAuMTtcclxuICAgICAgICB0aGlzLl9jb250cm9sTmVhckNsaXBwaW5nUGxhbmUgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ25lYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnTmVhciBDbGlwcGluZyBQbGFuZScpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAgIDE7XHJcbiAgICAgICAgbWF4aW11bSAgPSAxMDAwMDtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAgICAwLjE7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbEZhckNsaXBwaW5nUGxhbmUgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2ZhckNsaXBwaW5nUGxhbmUnKS5uYW1lKCdGYXIgQ2xpcHBpbmcgUGxhbmUnKS5taW4obWluaW11bSkubWF4KG1heGltdW0pLnN0ZXAoc3RlcFNpemUpLmxpc3RlbigpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xGYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gQm91bmQgQ2xpcHBpbmcgUGxhbmVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xCb3VuZENsaXBwaW5nUGxhbmVzID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdib3VuZENsaXBwaW5nUGxhbmVzJykubmFtZSgnQm91bmQgQ2xpcHBpbmcgUGxhbmVzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FtZXJhT3B0aW9ucy5vcGVuKCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3luY2hyb25pemUgdGhlIFVJIGNhbWVyYSBzZXR0aW5ncyB3aXRoIHRoZSB0YXJnZXQgY2FtZXJhLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBcclxuICAgICAqL1xyXG4gICAgc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncyAodmlldz8gOiBTdGFuZGFyZFZpZXcpIHtcclxuXHJcbiAgICAgICAgaWYgKHZpZXcpXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzLnN0YW5kYXJkVmlldyA9IHZpZXc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhU2V0dGluZ3MubmVhckNsaXBwaW5nUGxhbmUgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhU2V0dGluZ3MuZmFyQ2xpcHBpbmdQbGFuZSAgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5maWVsZE9mVmlldyAgICAgICA9IHRoaXMuX3ZpZXdlci5jYW1lcmEuZm92O1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcbiAgICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGVyaWFsc1xyXG4gKiBHZW5lcmFsIFRIUkVFLmpzIE1hdGVyaWFsIGNsYXNzZXMgYW5kIGhlbHBlcnNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBNYXRlcmlhbHNcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdGV4dHVyZSBtYXRlcmlhbCBmcm9tIGFuIGltYWdlIFVSTC5cclxuICAgICAqIEBwYXJhbSBpbWFnZSBJbWFnZSB0byB1c2UgaW4gdGV4dHVyZS5cclxuICAgICAqIEByZXR1cm5zIFRleHR1cmUgbWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVUZXh0dXJlTWF0ZXJpYWwgKGltYWdlIDogSFRNTEltYWdlRWxlbWVudCkgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0ZXh0dXJlICAgICAgICAgOiBUSFJFRS5UZXh0dXJlLFxyXG4gICAgICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShpbWFnZSk7XHJcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSAgICAgPSB0cnVlO1xyXG4gICAgICAgIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIG1hZ25pZmljYXRpb24gYW5kIG1pbmlmaWNhdGlvbiBmaWx0ZXJzIHNhbXBsZSB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMgd2hlbiBtYXBwaW5nIHRvIGEgcGl4ZWwuXHJcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIGRlZmF1bHQgbW9kZXMgb3ZlcnNhbXBsZSB3aGljaCBsZWFkcyB0byBibGVuZGluZyB3aXRoIHRoZSBibGFjayBiYWNrZ3JvdW5kLiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHByb2R1Y2VzIGNvbG9yZWQgKGJsYWNrKSBhcnRpZmFjdHMgYXJvdW5kIHRoZSBlZGdlcyBvZiB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMuXHJcbiAgICAgICAgdGV4dHVyZS5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAsIDEuMCk7XHJcblxyXG4gICAgICAgIHRleHR1cmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge21hcDogdGV4dHVyZX0gKTtcclxuICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGV4dHVyZU1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIENyZWF0ZSBhIGJ1bXAgbWFwIFBob25nIG1hdGVyaWFsIGZyb20gYSB0ZXh0dXJlIG1hcC5cclxuICAgICAqIEBwYXJhbSBkZXNpZ25UZXh0dXJlIEJ1bXAgbWFwIHRleHR1cmUuXHJcbiAgICAgKiBAcmV0dXJucyBQaG9uZyBidW1wIG1hcHBlZCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZU1lc2hQaG9uZ01hdGVyaWFsKGRlc2lnblRleHR1cmUgOiBUSFJFRS5UZXh0dXJlKSAgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgIGNvbG9yICAgOiAweGZmZmZmZixcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBidW1wTWFwICAgOiBkZXNpZ25UZXh0dXJlLFxyXG4gICAgICAgICAgICBidW1wU2NhbGUgOiAtMS4wLFxyXG5cclxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuU21vb3RoU2hhZGluZyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdHJhbnNwYXJlbnQgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBUcmFuc3BhcmVudCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVRyYW5zcGFyZW50TWF0ZXJpYWwoKSAgOiBUSFJFRS5NYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yIDogMHgwMDAwMDAsIG9wYWNpdHkgOiAwLjAsIHRyYW5zcGFyZW50IDogdHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuIiwiLyoqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ3Rzb3AvdGhyZWVqcy10cmFja2JhbGwtY29udHJvbHNcbiAqIEBhdXRob3IgRWJlcmhhcmQgR3JhZXRoZXIgLyBodHRwOi8vZWdyYWV0aGVyLmNvbS9cbiAqIEBhdXRob3IgTWFyayBMdW5kaW4gXHQvIGh0dHA6Ly9tYXJrLWx1bmRpbi5jb21cbiAqIEBhdXRob3IgU2ltb25lIE1hbmluaSAvIGh0dHA6Ly9kYXJvbjEzMzcuZ2l0aHViLmlvXG4gKiBAYXV0aG9yIEx1Y2EgQW50aWdhIFx0LyBodHRwOi8vbGFudGlnYS5naXRodWIuaW9cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmFja2JhbGxDb250cm9scyAoIG9iamVjdCwgZG9tRWxlbWVudCApIHtcblxuXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHR2YXIgU1RBVEUgPSB7IE5PTkU6IC0gMSwgUk9UQVRFOiAwLCBaT09NOiAxLCBQQU46IDIsIFRPVUNIX1JPVEFURTogMywgVE9VQ0hfWk9PTV9QQU46IDQgfTtcblxuXHR0aGlzLm9iamVjdCA9IG9iamVjdDtcblx0dGhpcy5kb21FbGVtZW50ID0gKCBkb21FbGVtZW50ICE9PSB1bmRlZmluZWQgKSA/IGRvbUVsZW1lbnQgOiBkb2N1bWVudDtcblxuXHQvLyBBUElcblxuXHR0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG5cdHRoaXMuc2NyZWVuID0geyBsZWZ0OiAwLCB0b3A6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcblxuXHR0aGlzLnJvdGF0ZVNwZWVkID0gMS4wO1xuXHR0aGlzLnpvb21TcGVlZCA9IDEuMjtcblx0dGhpcy5wYW5TcGVlZCA9IDAuMztcblxuXHR0aGlzLm5vUm90YXRlID0gZmFsc2U7XG5cdHRoaXMubm9ab29tID0gZmFsc2U7XG5cdHRoaXMubm9QYW4gPSBmYWxzZTtcblxuXHR0aGlzLnN0YXRpY01vdmluZyA9IHRydWU7XG5cdHRoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjI7XG5cblx0dGhpcy5taW5EaXN0YW5jZSA9IDA7XG5cdHRoaXMubWF4RGlzdGFuY2UgPSBJbmZpbml0eTtcblxuXHR0aGlzLmtleXMgPSBbIDY1IC8qQSovLCA4MyAvKlMqLywgNjggLypEKi8gXTtcblxuXHQvLyBpbnRlcm5hbHNcblxuXHR0aGlzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0dmFyIEVQUyA9IDAuMDAwMDAxO1xuXG5cdHZhciBsYXN0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdHZhciBfc3RhdGUgPSBTVEFURS5OT05FLFxuXHRfcHJldlN0YXRlID0gU1RBVEUuTk9ORSxcblxuXHRfZXllID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblxuXHRfbW92ZVByZXYgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfbW92ZUN1cnIgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXG5cdF9sYXN0QXhpcyA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdF9sYXN0QW5nbGUgPSAwLFxuXG5cdF96b29tU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfem9vbUVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cblx0X3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgPSAwLFxuXHRfdG91Y2hab29tRGlzdGFuY2VFbmQgPSAwLFxuXG5cdF9wYW5TdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdF9wYW5FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdC8vIGZvciByZXNldFxuXG5cdHRoaXMudGFyZ2V0MCA9IHRoaXMudGFyZ2V0LmNsb25lKCk7XG5cdHRoaXMucG9zaXRpb24wID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0dGhpcy51cDAgPSB0aGlzLm9iamVjdC51cC5jbG9uZSgpO1xuXG5cdC8vIGV2ZW50c1xuXG5cdHZhciBjaGFuZ2VFdmVudCA9IHsgdHlwZTogJ2NoYW5nZScgfTtcblx0dmFyIHN0YXJ0RXZlbnQgPSB7IHR5cGU6ICdzdGFydCcgfTtcblx0dmFyIGVuZEV2ZW50ID0geyB0eXBlOiAnZW5kJyB9O1xuXG5cblx0Ly8gbWV0aG9kc1xuXG5cdHRoaXMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCB0aGlzLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ICkge1xuXG5cdFx0XHR0aGlzLnNjcmVlbi5sZWZ0ID0gMDtcblx0XHRcdHRoaXMuc2NyZWVuLnRvcCA9IDA7XG5cdFx0XHR0aGlzLnNjcmVlbi53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdFx0dGhpcy5zY3JlZW4uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIGJveCA9IHRoaXMuZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdC8vIGFkanVzdG1lbnRzIGNvbWUgZnJvbSBzaW1pbGFyIGNvZGUgaW4gdGhlIGpxdWVyeSBvZmZzZXQoKSBmdW5jdGlvblxuXHRcdFx0dmFyIGQgPSB0aGlzLmRvbUVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHR0aGlzLnNjcmVlbi5sZWZ0ID0gYm94LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgLSBkLmNsaWVudExlZnQ7XG5cdFx0XHR0aGlzLnNjcmVlbi50b3AgPSBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IC0gZC5jbGllbnRUb3A7XG5cdFx0XHR0aGlzLnNjcmVlbi53aWR0aCA9IGJveC53aWR0aDtcblx0XHRcdHRoaXMuc2NyZWVuLmhlaWdodCA9IGJveC5oZWlnaHQ7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24gKCBldmVudCApIHtcblxuXHRcdGlmICggdHlwZW9mIHRoaXNbIGV2ZW50LnR5cGUgXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblxuXHRcdFx0dGhpc1sgZXZlbnQudHlwZSBdKCBldmVudCApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dmFyIGdldE1vdXNlT25TY3JlZW4gPSAoIGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGdldE1vdXNlT25TY3JlZW4oIHBhZ2VYLCBwYWdlWSApIHtcblxuXHRcdFx0dmVjdG9yLnNldChcblx0XHRcdFx0KCBwYWdlWCAtIF90aGlzLnNjcmVlbi5sZWZ0ICkgLyBfdGhpcy5zY3JlZW4ud2lkdGgsXG5cdFx0XHRcdCggcGFnZVkgLSBfdGhpcy5zY3JlZW4udG9wICkgLyBfdGhpcy5zY3JlZW4uaGVpZ2h0XG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdmVjdG9yO1xuXG5cdFx0fTtcblxuXHR9KCkgKTtcblxuXHR2YXIgZ2V0TW91c2VPbkNpcmNsZSA9ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gZ2V0TW91c2VPbkNpcmNsZSggcGFnZVgsIHBhZ2VZICkge1xuXG5cdFx0XHR2ZWN0b3Iuc2V0KFxuXHRcdFx0XHQoICggcGFnZVggLSBfdGhpcy5zY3JlZW4ud2lkdGggKiAwLjUgLSBfdGhpcy5zY3JlZW4ubGVmdCApIC8gKCBfdGhpcy5zY3JlZW4ud2lkdGggKiAwLjUgKSApLFxuXHRcdFx0XHQoICggX3RoaXMuc2NyZWVuLmhlaWdodCArIDIgKiAoIF90aGlzLnNjcmVlbi50b3AgLSBwYWdlWSApICkgLyBfdGhpcy5zY3JlZW4ud2lkdGggKSAvLyBzY3JlZW4ud2lkdGggaW50ZW50aW9uYWxcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB2ZWN0b3I7XG5cblx0XHR9O1xuXG5cdH0oKSApO1xuXG5cdHRoaXMucm90YXRlQ2FtZXJhID0gKCBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBheGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdHF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLFxuXHRcdFx0ZXllRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG9iamVjdFVwRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdG1vdmVEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0YW5nbGU7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gcm90YXRlQ2FtZXJhKCkge1xuXG5cdFx0XHRtb3ZlRGlyZWN0aW9uLnNldCggX21vdmVDdXJyLnggLSBfbW92ZVByZXYueCwgX21vdmVDdXJyLnkgLSBfbW92ZVByZXYueSwgMCApO1xuXHRcdFx0YW5nbGUgPSBtb3ZlRGlyZWN0aW9uLmxlbmd0aCgpO1xuXG5cdFx0XHRpZiAoIGFuZ2xlICkge1xuXG5cdFx0XHRcdF9leWUuY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkuc3ViKCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdFx0XHRleWVEaXJlY3Rpb24uY29weSggX2V5ZSApLm5vcm1hbGl6ZSgpO1xuXHRcdFx0XHRvYmplY3RVcERpcmVjdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QudXAgKS5ub3JtYWxpemUoKTtcblx0XHRcdFx0b2JqZWN0U2lkZXdheXNEaXJlY3Rpb24uY3Jvc3NWZWN0b3JzKCBvYmplY3RVcERpcmVjdGlvbiwgZXllRGlyZWN0aW9uICkubm9ybWFsaXplKCk7XG5cblx0XHRcdFx0b2JqZWN0VXBEaXJlY3Rpb24uc2V0TGVuZ3RoKCBfbW92ZUN1cnIueSAtIF9tb3ZlUHJldi55ICk7XG5cdFx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uLnNldExlbmd0aCggX21vdmVDdXJyLnggLSBfbW92ZVByZXYueCApO1xuXG5cdFx0XHRcdG1vdmVEaXJlY3Rpb24uY29weSggb2JqZWN0VXBEaXJlY3Rpb24uYWRkKCBvYmplY3RTaWRld2F5c0RpcmVjdGlvbiApICk7XG5cblx0XHRcdFx0YXhpcy5jcm9zc1ZlY3RvcnMoIG1vdmVEaXJlY3Rpb24sIF9leWUgKS5ub3JtYWxpemUoKTtcblxuXHRcdFx0XHRhbmdsZSAqPSBfdGhpcy5yb3RhdGVTcGVlZDtcblx0XHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKCBheGlzLCBhbmdsZSApO1xuXG5cdFx0XHRcdF9leWUuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cdFx0XHRcdF90aGlzLm9iamVjdC51cC5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblxuXHRcdFx0XHRfbGFzdEF4aXMuY29weSggYXhpcyApO1xuXHRcdFx0XHRfbGFzdEFuZ2xlID0gYW5nbGU7XG5cblx0XHRcdH0gZWxzZSBpZiAoICEgX3RoaXMuc3RhdGljTW92aW5nICYmIF9sYXN0QW5nbGUgKSB7XG5cblx0XHRcdFx0X2xhc3RBbmdsZSAqPSBNYXRoLnNxcnQoIDEuMCAtIF90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yICk7XG5cdFx0XHRcdF9leWUuY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkuc3ViKCBfdGhpcy50YXJnZXQgKTtcblx0XHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tQXhpc0FuZ2xlKCBfbGFzdEF4aXMsIF9sYXN0QW5nbGUgKTtcblx0XHRcdFx0X2V5ZS5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblx0XHRcdFx0X3RoaXMub2JqZWN0LnVwLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXG5cdFx0XHR9XG5cblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblxuXHRcdH07XG5cblx0fSgpICk7XG5cblxuXHR0aGlzLnpvb21DYW1lcmEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgZmFjdG9yO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLlRPVUNIX1pPT01fUEFOICkge1xuXG5cdFx0XHRmYWN0b3IgPSBfdG91Y2hab29tRGlzdGFuY2VTdGFydCAvIF90b3VjaFpvb21EaXN0YW5jZUVuZDtcblx0XHRcdF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gX3RvdWNoWm9vbURpc3RhbmNlRW5kO1xuXHRcdFx0X2V5ZS5tdWx0aXBseVNjYWxhciggZmFjdG9yICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRmYWN0b3IgPSAxLjAgKyAoIF96b29tRW5kLnkgLSBfem9vbVN0YXJ0LnkgKSAqIF90aGlzLnpvb21TcGVlZDtcblxuXHRcdFx0aWYgKCBmYWN0b3IgIT09IDEuMCAmJiBmYWN0b3IgPiAwLjAgKSB7XG5cblx0XHRcdFx0X2V5ZS5tdWx0aXBseVNjYWxhciggZmFjdG9yICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBfdGhpcy5zdGF0aWNNb3ZpbmcgKSB7XG5cblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdF96b29tU3RhcnQueSArPSAoIF96b29tRW5kLnkgLSBfem9vbVN0YXJ0LnkgKSAqIHRoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3I7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucGFuQ2FtZXJhID0gKCBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBtb3VzZUNoYW5nZSA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXG5cdFx0XHRvYmplY3RVcCA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRwYW4gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHBhbkNhbWVyYSgpIHtcblxuXHRcdFx0bW91c2VDaGFuZ2UuY29weSggX3BhbkVuZCApLnN1YiggX3BhblN0YXJ0ICk7XG5cblx0XHRcdGlmICggbW91c2VDaGFuZ2UubGVuZ3RoU3EoKSApIHtcblxuXHRcdFx0XHRtb3VzZUNoYW5nZS5tdWx0aXBseVNjYWxhciggX2V5ZS5sZW5ndGgoKSAqIF90aGlzLnBhblNwZWVkICk7XG5cblx0XHRcdFx0cGFuLmNvcHkoIF9leWUgKS5jcm9zcyggX3RoaXMub2JqZWN0LnVwICkuc2V0TGVuZ3RoKCBtb3VzZUNoYW5nZS54ICk7XG5cdFx0XHRcdHBhbi5hZGQoIG9iamVjdFVwLmNvcHkoIF90aGlzLm9iamVjdC51cCApLnNldExlbmd0aCggbW91c2VDaGFuZ2UueSApICk7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZCggcGFuICk7XG5cdFx0XHRcdF90aGlzLnRhcmdldC5hZGQoIHBhbiApO1xuXG5cdFx0XHRcdGlmICggX3RoaXMuc3RhdGljTW92aW5nICkge1xuXG5cdFx0XHRcdFx0X3BhblN0YXJ0LmNvcHkoIF9wYW5FbmQgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0X3BhblN0YXJ0LmFkZCggbW91c2VDaGFuZ2Uuc3ViVmVjdG9ycyggX3BhbkVuZCwgX3BhblN0YXJ0ICkubXVsdGlwbHlTY2FsYXIoIF90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yICkgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9KCkgKTtcblxuXHR0aGlzLmNoZWNrRGlzdGFuY2VzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCAhIF90aGlzLm5vWm9vbSB8fCAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRpZiAoIF9leWUubGVuZ3RoU3EoKSA+IF90aGlzLm1heERpc3RhbmNlICogX3RoaXMubWF4RGlzdGFuY2UgKSB7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZFZlY3RvcnMoIF90aGlzLnRhcmdldCwgX2V5ZS5zZXRMZW5ndGgoIF90aGlzLm1heERpc3RhbmNlICkgKTtcblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggX2V5ZS5sZW5ndGhTcSgpIDwgX3RoaXMubWluRGlzdGFuY2UgKiBfdGhpcy5taW5EaXN0YW5jZSApIHtcblxuXHRcdFx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllLnNldExlbmd0aCggX3RoaXMubWluRGlzdGFuY2UgKSApO1xuXHRcdFx0XHRfem9vbVN0YXJ0LmNvcHkoIF96b29tRW5kICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X2V5ZS5zdWJWZWN0b3JzKCBfdGhpcy5vYmplY3QucG9zaXRpb24sIF90aGlzLnRhcmdldCApO1xuXG5cdFx0aWYgKCAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfdGhpcy5yb3RhdGVDYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdGlmICggISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF90aGlzLnpvb21DYW1lcmEoKTtcblxuXHRcdH1cblxuXHRcdGlmICggISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3RoaXMucGFuQ2FtZXJhKCk7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uYWRkVmVjdG9ycyggX3RoaXMudGFyZ2V0LCBfZXllICk7XG5cblx0XHRfdGhpcy5jaGVja0Rpc3RhbmNlcygpO1xuXG5cdFx0X3RoaXMub2JqZWN0Lmxvb2tBdCggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRpZiAoIGxhc3RQb3NpdGlvbi5kaXN0YW5jZVRvU3F1YXJlZCggX3RoaXMub2JqZWN0LnBvc2l0aW9uICkgPiBFUFMgKSB7XG5cblx0XHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cblx0XHRcdGxhc3RQb3NpdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfc3RhdGUgPSBTVEFURS5OT05FO1xuXHRcdF9wcmV2U3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0X3RoaXMudGFyZ2V0LmNvcHkoIF90aGlzLnRhcmdldDAgKTtcblx0XHRfdGhpcy5vYmplY3QucG9zaXRpb24uY29weSggX3RoaXMucG9zaXRpb24wICk7XG5cdFx0X3RoaXMub2JqZWN0LnVwLmNvcHkoIF90aGlzLnVwMCApO1xuXG5cdFx0X2V5ZS5zdWJWZWN0b3JzKCBfdGhpcy5vYmplY3QucG9zaXRpb24sIF90aGlzLnRhcmdldCApO1xuXG5cdFx0X3RoaXMub2JqZWN0Lmxvb2tBdCggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXG5cdFx0bGFzdFBvc2l0aW9uLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApO1xuXG5cdH07XG5cblx0Ly8gbGlzdGVuZXJzXG5cblx0ZnVuY3Rpb24ga2V5ZG93biggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biApO1xuXG5cdFx0X3ByZXZTdGF0ZSA9IF9zdGF0ZTtcblxuXHRcdGlmICggX3N0YXRlICE9PSBTVEFURS5OT05FICkge1xuXG5cdFx0XHRyZXR1cm47XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5ST1RBVEUgXSAmJiAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5ST1RBVEU7XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5aT09NIF0gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF9zdGF0ZSA9IFNUQVRFLlpPT007XG5cblx0XHR9IGVsc2UgaWYgKCBldmVudC5rZXlDb2RlID09PSBfdGhpcy5rZXlzWyBTVEFURS5QQU4gXSAmJiAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5QQU47XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGtleXVwKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRfc3RhdGUgPSBfcHJldlN0YXRlO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2Vkb3duKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLk5PTkUgKSB7XG5cblx0XHRcdF9zdGF0ZSA9IGV2ZW50LmJ1dHRvbjtcblxuXHRcdH1cblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5ST1RBVEUgJiYgISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlpPT00gJiYgISBfdGhpcy5ub1pvb20gKSB7XG5cblx0XHRcdF96b29tU3RhcnQuY29weSggZ2V0TW91c2VPblNjcmVlbiggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblx0XHRcdF96b29tRW5kLmNvcHkoIF96b29tU3RhcnQgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUEFOICYmICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF9wYW5TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXHRcdFx0X3BhbkVuZC5jb3B5KCBfcGFuU3RhcnQgKTtcblxuXHRcdH1cblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUsIGZhbHNlICk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBtb3VzZXVwLCBmYWxzZSApO1xuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggc3RhcnRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZW1vdmUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUk9UQVRFICYmICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5aT09NICYmICEgX3RoaXMubm9ab29tICkge1xuXG5cdFx0XHRfem9vbUVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5QQU4gJiYgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3BhbkVuZC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZXVwKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBtb3VzZW1vdmUgKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG1vdXNldXAgKTtcblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZXdoZWVsKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0c3dpdGNoICggZXZlbnQuZGVsdGFNb2RlICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpvb20gaW4gcGFnZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3pvb21TdGFydC55IC09IGV2ZW50LmRlbHRhWSAqIDAuMDI1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuXHRcdFx0Y2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBab29tIGluIGxpbmVzXG5cdFx0XHRcdF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAxO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Ly8gdW5kZWZpbmVkLCAwLCBhc3N1bWUgcGl4ZWxzXG5cdFx0XHRcdF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAwMDI1O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIHN0YXJ0RXZlbnQgKTtcblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBlbmRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaHN0YXJ0KCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKCBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9ST1RBVEU7XG5cdFx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSApICk7XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IC8vIDIgb3IgbW9yZVxuXHRcdFx0XHRfc3RhdGUgPSBTVEFURS5UT1VDSF9aT09NX1BBTjtcblx0XHRcdFx0dmFyIGR4ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYO1xuXHRcdFx0XHR2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XG5cdFx0XHRcdF90b3VjaFpvb21EaXN0YW5jZUVuZCA9IF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRcdHZhciB4ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVggKSAvIDI7XG5cdFx0XHRcdHZhciB5ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVkgKSAvIDI7XG5cdFx0XHRcdF9wYW5TdGFydC5jb3B5KCBnZXRNb3VzZU9uU2NyZWVuKCB4LCB5ICkgKTtcblx0XHRcdFx0X3BhbkVuZC5jb3B5KCBfcGFuU3RhcnQgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBzdGFydEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHRvdWNobW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoICkge1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdF9tb3ZlUHJldi5jb3B5KCBfbW92ZUN1cnIgKTtcblx0XHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICkgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IC8vIDIgb3IgbW9yZVxuXHRcdFx0XHR2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG5cdFx0XHRcdHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcblx0XHRcdFx0X3RvdWNoWm9vbURpc3RhbmNlRW5kID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRcdHZhciB4ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVggKSAvIDI7XG5cdFx0XHRcdHZhciB5ID0gKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKyBldmVudC50b3VjaGVzWyAxIF0ucGFnZVkgKSAvIDI7XG5cdFx0XHRcdF9wYW5FbmQuY29weSggZ2V0TW91c2VPblNjcmVlbiggeCwgeSApICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaGVuZCggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0c3dpdGNoICggZXZlbnQudG91Y2hlcy5sZW5ndGggKSB7XG5cblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuXHRcdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKSApO1xuXHRcdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggZW5kRXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gY29udGV4dG1lbnUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0fVxuXG5cdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIGNvbnRleHRtZW51LCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgbW91c2Vkb3duLCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBtb3VzZXdoZWVsLCBmYWxzZSApO1xuXG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgdG91Y2hlbmQsIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlICk7XG5cblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlLCBmYWxzZSApO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgbW91c2V1cCwgZmFsc2UgKTtcblxuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGtleWRvd24sIGZhbHNlICk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGtleXVwLCBmYWxzZSApO1xuXG5cdH07XG5cblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIGNvbnRleHRtZW51LCBmYWxzZSApOyBcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBtb3VzZWRvd24sIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBtb3VzZXdoZWVsLCBmYWxzZSApO1xuXG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoc3RhcnQsIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UgKTtcblx0dGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlICk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywga2V5ZG93biwgZmFsc2UgKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGtleXVwLCBmYWxzZSApO1xuXG5cdHRoaXMuaGFuZGxlUmVzaXplKCk7XG5cblx0Ly8gZm9yY2UgYW4gdXBkYXRlIGF0IHN0YXJ0XG5cdHRoaXMudXBkYXRlKCk7XG5cbn1cblxuVHJhY2tiYWxsQ29udHJvbHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVEhSRUUuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSApO1xuVHJhY2tiYWxsQ29udHJvbHMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVHJhY2tiYWxsQ29udHJvbHM7XG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcbmltcG9ydCB7Q2FtZXJhLCBTdGFuZGFyZFZpZXd9ICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0NhbWVyYUNvbnRyb2xzfSAgICAgICAgIGZyb20gJ0NhbWVyYUNvbnRyb2xzJ1xyXG5pbXBvcnQge0V2ZW50TWFuYWdlcn0gICAgICAgICAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtHcmFwaGljcywgT2JqZWN0TmFtZXN9ICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXJ9ICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0ZXJpYWxzfSAgICAgICAgICAgICAgZnJvbSAnTWF0ZXJpYWxzJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9WaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBWaWV3ZXIge1xyXG5cclxuICAgIF9uYW1lICAgICAgICAgICAgICAgICAgIDogc3RyaW5nICAgICAgICAgICAgICAgICAgICA9ICcnO1xyXG4gICAgX2V2ZW50TWFuYWdlciAgICAgICAgICA6IEV2ZW50TWFuYWdlciAgICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgX2xvZ2dlciAgICAgICAgICAgICAgICAgOiBMb2dnZXIgICAgICAgICAgICAgICAgICAgID0gbnVsbDtcclxuICAgIFxyXG4gICAgX3NjZW5lICAgICAgICAgICAgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgID0gbnVsbDtcclxuICAgIF9yb290ICAgICAgICAgICAgICAgICAgIDogVEhSRUUuT2JqZWN0M0QgICAgICAgICAgICA9IG51bGw7ICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICBfcmVuZGVyZXIgICAgICAgICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyZXIgICAgICAgPSBudWxsOztcclxuICAgIF9jYW52YXMgICAgICAgICAgICAgICAgIDogSFRNTENhbnZhc0VsZW1lbnQgICAgICAgICA9IG51bGw7XHJcbiAgICBfd2lkdGggICAgICAgICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICAgPSAwO1xyXG4gICAgX2hlaWdodCAgICAgICAgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgID0gMDtcclxuXHJcbiAgICBfY2FtZXJhICAgICAgICAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhICAgPSBudWxsO1xyXG5cclxuICAgIF9jb250cm9scyAgICAgICAgICAgICAgIDogVHJhY2tiYWxsQ29udHJvbHMgICAgICAgICA9IG51bGw7XHJcbiAgICBfY2FtZXJhQ29udHJvbHMgICAgICAgICA6IENhbWVyYUNvbnRyb2xzICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBWaWV3ZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIG5hbWUgVmlld2VyIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvQmluZFRvIEhUTUwgZWxlbWVudCB0byBob3N0IHRoZSB2aWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgOiBzdHJpbmcsIG1vZGVsQ2FudmFzSWQgOiBzdHJpbmcpIHsgXHJcblxyXG4gICAgICAgIHRoaXMuX25hbWUgICAgICAgICA9IG5hbWU7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIgID0gbmV3IEV2ZW50TWFuYWdlcigpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciAgICAgICA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IEdyYXBoaWNzLmluaXRpYWxpemVDYW52YXMobW9kZWxDYW52YXNJZCk7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggID0gdGhpcy5fY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBWaWV3ZXIgbmFtZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG5hbWUoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBWaWV3ZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGdldCBzY2VuZSgpIDogVEhSRUUuU2NlbmUge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBWaWV3ZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHNldCBzY2VuZSh2YWx1ZTogVEhSRUUuU2NlbmUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fc2NlbmUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZXQgY2FtZXJhKCkgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYXtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBzZXQgY2FtZXJhKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLm5hbWUgPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSW5wdXRDb250cm9scygpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhQ29udHJvbHMpXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzLnN5bmNocm9uaXplQ2FtZXJhU2V0dGluZ3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBhY3RpdmUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldCBtb2RlbCgpIDogVEhSRUUuR3JvdXAge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGFjdGl2ZSBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB2YWx1ZSBOZXcgbW9kZWwgdG8gYWN0aXZhdGUuXHJcbiAgICAgKi9cclxuICAgIHNldE1vZGVsKHZhbHVlIDogVEhSRUUuR3JvdXApIHtcclxuXHJcbiAgICAgICAgLy8gTi5CLiBUaGlzIGlzIGEgbWV0aG9kIG5vdCBhIHByb3BlcnR5IHNvIGEgc3ViIGNsYXNzIGNhbiBvdmVycmlkZS5cclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzQ0NjVcclxuXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4odGhpcy5fcm9vdCwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuX3Jvb3QuYWRkKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgY2FudmFzIGFmZXIgYSB3aW5kb3cgcmVzaXplXHJcbiAgICAgKi9cclxuICAgIGdldCBhc3BlY3RSYXRpbygpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGFzcGVjdFJhdGlvIDogbnVtYmVyID0gdGhpcy5fd2lkdGggLyB0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIGFzcGVjdFJhdGlvO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIERPTSBJZCBvZiB0aGUgVmlld2VyIHBhcmVudCBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCBjb250YWluZXJJZCgpIDogc3RyaW5nIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcGFyZW50RWxlbWVudCA6IEhUTUxFbGVtZW50ID0gdGhpcy5fY2FudmFzLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgcmV0dXJuIHBhcmVudEVsZW1lbnQuaWQ7XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgRXZlbnQgTWFuYWdlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGV2ZW50TWFuYWdlcigpOiBFdmVudE1hbmFnZXIge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRNYW5hZ2VyO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHRlc3Qgc3BoZXJlIHRvIGEgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHBvcHVsYXRlU2NlbmUgKCkge1xyXG5cclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVNwaGVyZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMoKSwgMik7XHJcbiAgICAgICAgbWVzaC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5hZGQobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIFNjZW5lXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVJvb3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZVNjZW5lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBXZWJHTCByZW5kZXJlci5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVJlbmRlcmVyICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XHJcblxyXG4gICAgICAgICAgICBsb2dhcml0aG1pY0RlcHRoQnVmZmVyICA6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYW52YXMgICAgICAgICAgICAgICAgICA6IHRoaXMuX2NhbnZhcyxcclxuICAgICAgICAgICAgYW50aWFsaWFzICAgICAgICAgICAgICAgOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuYXV0b0NsZWFyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwKTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlld2VyIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhKCkge1xyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gQ2FtZXJhLmdldFN0YW5kYXJkVmlld0NhbWVyYShTdGFuZGFyZFZpZXcuRnJvbnQsIHRoaXMuYXNwZWN0UmF0aW8sIHRoaXMubW9kZWwpOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVMaWdodGluZygpIHtcclxuXHJcbiAgICAgICAgbGV0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg0MDQwNDApO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4QzBDMDkwKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0MS5wb3NpdGlvbi5zZXQoLTEwMCwgLTUwLCAxMDApO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQxKTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQyID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhDMEMwOTApO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQyLnBvc2l0aW9uLnNldCgxMDAsIDUwLCAtMTAwKTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0Mik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSB1c2VyIGlucHV0IGNvbnRyb2xzIChUcmFja2JhbGwpXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVJbnB1dENvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scyA9IG5ldyBUcmFja2JhbGxDb250cm9scyh0aGlzLmNhbWVyYSwgdGhpcy5fcmVuZGVyZXIuZG9tRWxlbWVudCk7XHJcblxyXG4gICAgICAgIC8vIE4uQi4gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAzMjUwOTUvdGhyZWVqcy1jYW1lcmEtbG9va2F0LWhhcy1uby1lZmZlY3QtaXMtdGhlcmUtc29tZXRoaW5nLWltLWRvaW5nLXdyb25nXHJcbiAgICAgICAgdGhpcy5fY29udHJvbHMucG9zaXRpb24wLmNvcHkodGhpcy5jYW1lcmEucG9zaXRpb24pO1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QodGhpcy5fcm9vdCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbHMudGFyZ2V0LmNvcHkoYm91bmRpbmdCb3guZ2V0Q2VudGVyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB1cCB0aGUgdXNlciBpbnB1dCBjb250cm9scyAoU2V0dGluZ3MpXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVVSUNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmFDb250cm9scyA9IG5ldyBDYW1lcmFDb250cm9scyh0aGlzKTsgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSBrZXlib2FyZCBzaG9ydGN1dHMuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVLZXlib2FyZFNob3J0Y3V0cygpIHtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQgOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAvLyBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2phdmFzY3JpcHQvamF2YXNjcmlwdC1rZXljb2Rlcy9cclxuICAgICAgICAgICAgbGV0IGtleUNvZGUgOiBudW1iZXIgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDcwOiAgICAgICAgICAgICAgICAvLyBGICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEgPSBDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3Q2FtZXJhKFN0YW5kYXJkVmlldy5Gcm9udCwgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5tb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgc2NlbmUgd2l0aCB0aGUgYmFzZSBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemUgKCkge1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2FtZXJhKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTGlnaHRpbmcoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVJbnB1dENvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplVUlDb250cm9scygpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUtleWJvYXJkU2hvcnRjdXRzKCk7XHJcblxyXG4gICAgICAgIHRoaXMub25SZXNpemVXaW5kb3coKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vblJlc2l6ZVdpbmRvdy5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFNjZW5lXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHNjZW5lIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgY2xlYXJBbGxBc3Nlc3RzKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIEdyYXBoaWNzLnJlbW92ZU9iamVjdENoaWxkcmVuKHRoaXMuX3Jvb3QsIGZhbHNlKTtcclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSByb290IG9iamVjdCBpbiB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUm9vdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xyXG4gICAgICAgIHRoaXMuX3Jvb3QubmFtZSA9IE9iamVjdE5hbWVzLlJvb3Q7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5fcm9vdCk7XHJcbiAgICB9XHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBDYW1lcmFcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gU2V0cyB0aGUgdmlldyBjYW1lcmEgcHJvcGVydGllcyB0byB0aGUgZ2l2ZW4gc2V0dGluZ3MuXHJcbiAgICAgKiBAcGFyYW0ge1N0YW5kYXJkVmlld30gdmlldyBDYW1lcmEgc2V0dGluZ3MgdG8gYXBwbHkuXHJcbiAgICAgKi9cclxuICAgIHNldENhbWVyYVRvU3RhbmRhcmRWaWV3KHZpZXcgOiBTdGFuZGFyZFZpZXcpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YW5kYXJkVmlld0NhbWVyYSA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdDYW1lcmEodmlldywgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5tb2RlbCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBzdGFuZGFyZFZpZXdDYW1lcmE7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzLnN5bmNocm9uaXplQ2FtZXJhU2V0dGluZ3Modmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gRml0cyB0aGUgYWN0aXZlIHZpZXcuXHJcbiAgICAgKi9cclxuICAgIGZpdFZpZXcoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gQ2FtZXJhLmdldEZpdFZpZXdDYW1lcmEgKENhbWVyYS5nZXRTY2VuZUNhbWVyYSh0aGlzLmNhbWVyYSwgdGhpcy5hc3BlY3RSYXRpbyksIHRoaXMubW9kZWwpO1xyXG4gICAgfVxyXG4gICAgICAgICAgIFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBXaW5kb3cgUmVzaXplXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHNjZW5lIGNhbWVyYSB0byBtYXRjaCB0aGUgbmV3IHdpbmRvdyBzaXplXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUNhbWVyYU9uV2luZG93UmVzaXplKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNhbWVyYS5hc3BlY3QgPSB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgdGhlIFdlYkdMIHByb2Nlc3NpbmcgZm9yIGEgRE9NIHdpbmRvdyAncmVzaXplJyBldmVudFxyXG4gICAgICovXHJcbiAgICByZXNpemVEaXNwbGF5V2ViR0woKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gIHRoaXMuX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLl9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFNpemUodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scy5oYW5kbGVSZXNpemUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbWVyYU9uV2luZG93UmVzaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIGEgd2luZG93IHJlc2l6ZSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblJlc2l6ZVdpbmRvdyAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucmVzaXplRGlzcGxheVdlYkdMKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFJlbmRlciBMb29wXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIHRoZSBXZWJHTCByZW5kZXIgb2YgdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcldlYkdMKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scy51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpbiBET00gcmVuZGVyIGxvb3BcclxuICAgICAqL1xyXG4gICAgYW5pbWF0ZSgpIHtcclxuXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnJlbmRlcldlYkdMKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IFxyXG5cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5cclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5jb25zdCB0ZXN0TW9kZWxDb2xvciA9ICcjNTU4ZGU4JztcclxuXHJcbmV4cG9ydCBlbnVtIFRlc3RNb2RlbCB7XHJcbiAgICBUb3J1cyxcclxuICAgIFNwaGVyZSxcclxuICAgIFNsb3BlZFBsYW5lLFxyXG4gICAgQm94LFxyXG4gICAgQ2hlY2tlcmJvYXJkXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0TW9kZWxMb2FkZXIge1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgVGVzdE1vZGVsTG9hZGVyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2FkcyBhIHBhcmFtZXRyaWMgdGVzdCBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB7Vmlld2VyfSB2aWV3ZXIgVmlld2VyIGluc3RhbmNlIHRvIHJlY2VpdmUgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0ge1Rlc3RNb2RlbH0gbW9kZWxUeXBlIE1vZGVsIHR5cGUgKEJveCwgU3BoZXJlLCBldGMuKVxyXG4gICAgICovXHJcbiAgICBsb2FkVGVzdE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIsIG1vZGVsVHlwZSA6IFRlc3RNb2RlbCkge1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG1vZGVsVHlwZSl7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5Ub3J1czpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFRvcnVzTW9kZWwodmlld2VyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuU3BoZXJlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU3BoZXJlTW9kZWwodmlld2VyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuU2xvcGVkUGxhbmU6IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU2xvcGVkUGxhbmVNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5Cb3g6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRCb3hNb2RlbCh2aWV3ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFRlc3RNb2RlbC5DaGVja2VyYm9hcmQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDaGVja2VyYm9hcmRNb2RlbCh2aWV3ZXIpOyAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSB0b3J1cyB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZFRvcnVzTW9kZWwodmlld2VyIDogVmlld2VyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcnVzU2NlbmUgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgc29tZSBnZW9tZXRyaWVzXHJcbiAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzS25vdEdlb21ldHJ5KDEsIDAuMywgMTI4LCA2NCk7XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pO1xyXG5cclxuICAgICAgICBsZXQgY291bnQgPSA1MDtcclxuICAgICAgICBsZXQgc2NhbGUgPSA1O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XHJcbiAgICAgICAgICAgIGxldCB6ID0gKE1hdGgucmFuZG9tKCkgKiAyLjApIC0gMS4wO1xyXG4gICAgICAgICAgICBsZXQgelNjYWxlID0gTWF0aC5zcXJ0KDEuMCAtIHogKiB6KSAqIHNjYWxlO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnNldChcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKHIpICogelNjYWxlLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4ocikgKiB6U2NhbGUsXHJcbiAgICAgICAgICAgICAgICB6ICogc2NhbGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbWVzaC5yb3RhdGlvbi5zZXQoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSk7XHJcblxyXG4gICAgICAgICAgICBtZXNoLm5hbWUgPSAnVG9ydXMgQ29tcG9uZW50JztcclxuICAgICAgICAgICAgdG9ydXNTY2VuZS5hZGQobWVzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbCAodG9ydXNTY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdGVzdCBzcGhlcmUgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkU3BoZXJlTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgcmFkaXVzID0gMjsgICAgXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzLCByYWRpdXMsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSlcclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB0ZXN0IGJveCB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRCb3hNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCAgPSAyOyAgICBcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMjsgICAgXHJcbiAgICAgICAgbGV0IGRlcHRoICA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlQm94TWVzaChuZXcgVEhSRUUuVmVjdG9yMywgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KSlcclxuXHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsKG1lc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgc2xvcGVkIHBsYW5lIHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZFNsb3BlZFBsYW5lTW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgd2lkdGggID0gMjsgICAgXHJcbiAgICAgICAgbGV0IGhlaWdodCA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlUGxhbmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzLCB3aWR0aCwgaGVpZ2h0LCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSkpICAgICAgIFxyXG4gICAgICAgIG1lc2gucm90YXRlWChNYXRoLlBJIC8gNCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVzaC5uYW1lID0gJ1Nsb3BlZFBsYW5lJztcclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwobWVzaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB0ZXN0IG1vZGVsIGNvbnNpc3Rpbmcgb2YgYSB0aWVyZWQgY2hlY2tlcmJvYXJkXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZENoZWNrZXJib2FyZE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZ3JpZExlbmd0aCAgICAgOiBudW1iZXIgPSAyO1xyXG4gICAgICAgIGxldCB0b3RhbEhlaWdodCAgICA6IG51bWJlciA9IDEuMDsgICAgICAgIFxyXG4gICAgICAgIGxldCBncmlkRGl2aXNpb25zICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHRvdGFsQ2VsbHMgICAgIDogbnVtYmVyID0gTWF0aC5wb3coZ3JpZERpdmlzaW9ucywgMik7XHJcblxyXG4gICAgICAgIGxldCBjZWxsQmFzZSAgICAgICA6IG51bWJlciA9IGdyaWRMZW5ndGggLyBncmlkRGl2aXNpb25zO1xyXG4gICAgICAgIGxldCBjZWxsSGVpZ2h0ICAgICA6IG51bWJlciA9IHRvdGFsSGVpZ2h0IC8gdG90YWxDZWxscztcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpblggOiBudW1iZXIgPSAtKGNlbGxCYXNlICogKGdyaWREaXZpc2lvbnMgLyAyKSkgKyAoY2VsbEJhc2UgLyAyKTtcclxuICAgICAgICBsZXQgb3JpZ2luWSA6IG51bWJlciA9IG9yaWdpblg7XHJcbiAgICAgICAgbGV0IG9yaWdpblogOiBudW1iZXIgPSAtY2VsbEhlaWdodCAvIDI7XHJcbiAgICAgICAgbGV0IG9yaWdpbiAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCwgb3JpZ2luWSwgb3JpZ2luWik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGJhc2VDb2xvciAgICAgIDogbnVtYmVyID0gMHgwMDcwNzA7XHJcbiAgICAgICAgbGV0IGNvbG9yRGVsdGEgICAgIDogbnVtYmVyID0gKDI1NiAvIHRvdGFsQ2VsbHMpICogTWF0aC5wb3coMjU2LCAyKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwICAgICAgOiBUSFJFRS5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIGxldCBjZWxsT3JpZ2luIDogVEhSRUUuVmVjdG9yMyA9IG9yaWdpbi5jbG9uZSgpO1xyXG4gICAgICAgIGxldCBjZWxsQ29sb3IgIDogbnVtYmVyID0gYmFzZUNvbG9yO1xyXG4gICAgICAgIGZvciAobGV0IGlSb3cgOiBudW1iZXIgPSAwOyBpUm93IDwgZ3JpZERpdmlzaW9uczsgaVJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlDb2x1bW4gOiBudW1iZXIgPSAwOyBpQ29sdW1uIDwgZ3JpZERpdmlzaW9uczsgaUNvbHVtbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe2NvbG9yIDogY2VsbENvbG9yfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKGNlbGxPcmlnaW4sIGNlbGxCYXNlLCBjZWxsQmFzZSwgY2VsbEhlaWdodCwgY2VsbE1hdGVyaWFsKTtcclxuICAgICAgICAgICAgICAgIGdyb3VwLmFkZCAoY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2VsbE9yaWdpbi54ICs9IGNlbGxCYXNlO1xyXG4gICAgICAgICAgICAgICAgY2VsbE9yaWdpbi56ICs9IGNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBjZWxsQ29sb3IgICAgKz0gY29sb3JEZWx0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNlbGxPcmlnaW4ueCA9IG9yaWdpbi54O1xyXG4gICAgICAgIGNlbGxPcmlnaW4ueSArPSBjZWxsQmFzZTtcclxuICAgICAgICB9ICAgICAgIFxyXG5cclxuICAgICAgICBncm91cC5uYW1lID0gJ0NoZWNrZXJib2FyZCc7XHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsKGdyb3VwKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcblxyXG5pbXBvcnQge1N0YW5kYXJkVmlld30gICAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtPQkpMb2FkZXJ9ICAgICAgICAgICAgICAgICAgZnJvbSBcIk9CSkxvYWRlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1Rlc3RNb2RlbExvYWRlciwgVGVzdE1vZGVsfSBmcm9tICdUZXN0TW9kZWxMb2FkZXInXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IHRlc3RNb2RlbENvbG9yID0gJyM1NThkZTgnO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRlciB7XHJcblxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBMb2FkZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYSBtb2RlbCBiYXNlZCBvbiB0aGUgbW9kZWwgbmFtZSBhbmQgcGF0aCBlbWJlZGRlZCBpbiB0aGUgSFRNTCBwYWdlLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovICAgIFxyXG4gICAgbG9hZE9CSk1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsTmFtZUVsZW1lbnQgOiBIVE1MRWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZWxOYW1lJyk7XHJcbiAgICAgICAgbGV0IG1vZGVsUGF0aEVsZW1lbnQgOiBIVE1MRWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZWxQYXRoJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGxldCBtb2RlbE5hbWUgICAgOiBzdHJpbmcgPSBtb2RlbE5hbWVFbGVtZW50LnRleHRDb250ZW50O1xyXG4gICAgICAgIGxldCBtb2RlbFBhdGggICAgOiBzdHJpbmcgPSBtb2RlbFBhdGhFbGVtZW50LnRleHRDb250ZW50O1xyXG4gICAgICAgIGxldCBmaWxlTmFtZSAgICAgOiBzdHJpbmcgPSBtb2RlbFBhdGggKyBtb2RlbE5hbWU7XHJcblxyXG4gICAgICAgIGxldCBtYW5hZ2VyID0gbmV3IFRIUkVFLkxvYWRpbmdNYW5hZ2VyKCk7XHJcbiAgICAgICAgbGV0IGxvYWRlciAgPSBuZXcgT0JKTG9hZGVyKG1hbmFnZXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvblByb2dyZXNzID0gZnVuY3Rpb24gKHhocikge1xyXG5cclxuICAgICAgICAgICAgaWYgKHhoci5sZW5ndGhDb21wdXRhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0geGhyLmxvYWRlZCAvIHhoci50b3RhbCAqIDEwMDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBlcmNlbnRDb21wbGV0ZS50b0ZpeGVkKDIpICsgJyUgZG93bmxvYWRlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IG9uRXJyb3IgPSBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgfTsgICAgICAgIFxyXG5cclxuICAgICAgICBsb2FkZXIubG9hZChmaWxlTmFtZSwgZnVuY3Rpb24gKGdyb3VwIDogVEhSRUUuR3JvdXApIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXdlci5zZXRNb2RlbChncm91cCk7XHJcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIHBhcmFtZXRyaWMgdGVzdCBtb2RlbC5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqIEBwYXJhbSBtb2RlbFR5cGUgVGVzdCBtb2RlbCB0eXBlIChTcGhlciwgQm94LCBldGMuKVxyXG4gICAgICovICAgIFxyXG4gICAgbG9hZFBhcmFtZXRyaWNUZXN0TW9kZWwgKHZpZXdlciA6IFZpZXdlciwgbW9kZWxUeXBlIDogVGVzdE1vZGVsKSB7XHJcblxyXG4gICAgICAgIGxldCB0ZXN0TG9hZGVyID0gbmV3IFRlc3RNb2RlbExvYWRlcigpO1xyXG4gICAgICAgIHRlc3RMb2FkZXIubG9hZFRlc3RNb2RlbCh2aWV3ZXIsIG1vZGVsVHlwZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtNZXNoVmlld2VyfSAgICAgICAgICAgICAgICAgZnJvbSBcIk1lc2hWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogTWVzaFZpZXdlciBTZXR0aW5nc1xyXG4gKi9cclxuY2xhc3MgTWVzaFZpZXdlclNldHRpbmdzIHtcclxuICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXNoVmlld2VyIFVJIENvbnRyb2xzLlxyXG4gKi8gICAgXHJcbmV4cG9ydCBjbGFzcyBNZXNoVmlld2VyQ29udHJvbHMge1xyXG5cclxuICAgIF9tZXNoVmlld2VyICAgICAgICAgIDogTWVzaFZpZXdlcjsgICAgICAgICAgICAgICAgICAgICAvLyBhc3NvY2lhdGVkIHZpZXdlclxyXG4gICAgX21lc2hWaWV3ZXJTZXR0aW5ncyAgOiBNZXNoVmlld2VyU2V0dGluZ3M7ICAgICAgICAgICAgIC8vIFVJIHNldHRpbmdzXHJcblxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNZXNoVmlld2VyQ29udHJvbHNcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNoVmlld2VyIDogTWVzaFZpZXdlcikgeyAgXHJcblxyXG4gICAgICAgIHRoaXMuX21lc2hWaWV3ZXIgPSBtZXNoVmlld2VyO1xyXG5cclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX21lc2hWaWV3ZXJTZXR0aW5ncyA9IG5ldyBNZXNoVmlld2VyU2V0dGluZ3MoKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgbGV0IGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtZW51RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fbWVzaFZpZXdlci5jb250YWluZXJJZCk7XHJcbiAgICAgICAgbWVudURpdi5hcHBlbmRDaGlsZChndWkuZG9tRWxlbWVudCk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWVzaFZpZXdlciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICBcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgICAgIGxldCBtZXNoVmlld2VyT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ01lc2hWaWV3ZXIgT3B0aW9ucycpO1xyXG5cclxuICAgICAgICBtZXNoVmlld2VyT3B0aW9ucy5vcGVuKCk7XHJcbiAgICB9ICAgIFxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYSwgU3RhbmRhcmRWaWV3fSAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9ICAgICAgICAgICAgICAgIGZyb20gJ0RlcHRoQnVmZmVyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIEhUTUxMb2dnZXJ9ICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hWaWV3ZXJDb250cm9sc30gICAgICAgICBmcm9tICdNZXNoVmlld2VyQ29udHJvbHMnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBNZXNoVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWVzaFZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcbiAgICBcclxuICAgIF9tZXNoVmlld2VyQ29udHJvbHM6IE1lc2hWaWV3ZXJDb250cm9sczsgICAgICAgICAgICAgLy8gVUkgY29udHJvbHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNZXNoVmlld2VyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBuYW1lIFZpZXdlciBuYW1lLlxyXG4gICAgICogQHBhcmFtIHByZXZpZXdDYW52YXNJZCBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmV2aWV3Q2FudmFzSWQgOiBzdHJpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlcihuYW1lLCBwcmV2aWV3Q2FudmFzSWQpO1xyXG5cclxuICAgICAgICAvL292ZXJyaWRlXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gU2VydmljZXMuaHRtbExvZ2dlcjsgICAgICAgXHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3B1bGF0ZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7ICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMTtcclxuICAgICAgICBsZXQgd2lkdGggID0gMTtcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVBsYW5lTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCBoZWlnaHQsIHdpZHRoLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoRGVwdGhCdWZmZXIuRGVmYXVsdE1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycykpO1xyXG4gICAgICAgIG1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgICAgICB0aGlzLl9yb290LmFkZChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplTGlnaHRpbmcoKSB7XHJcblxyXG4gICAgICAgIGxldCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjIpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0MS5wb3NpdGlvbi5zZXQoNCwgNCwgNCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVSSBjb250cm9scyBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5fbWVzaFZpZXdlckNvbnRyb2xzID0gbmV3IE1lc2hWaWV3ZXJDb250cm9scyh0aGlzKTtcclxuICAgIH0gICBcclxuLy8jZW5kcmVnaW9uXHJcbn0iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgZnJvbSBcIkRlcHRoQnVmZmVyRmFjdG9yeVwiXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld2VyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIE1vZGVsVmlld2VyIFNldHRpbmdzXHJcbiAqL1xyXG5jbGFzcyBNb2RlbFZpZXdlclNldHRpbmdzIHtcclxuXHJcbiAgICBkaXNwbGF5R3JpZCAgICA6IGJvb2xlYW47XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZGlzcGxheUdyaWQgICAgPSB0cnVlOyBcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1vZGVsVmlld2VyIFVJIENvbnRyb2xzLlxyXG4gKi8gICAgXHJcbmV4cG9ydCBjbGFzcyBNb2RlbFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICBfbW9kZWxWaWV3ZXIgICAgICAgICA6IE1vZGVsVmlld2VyOyAgICAgICAgICAgICAgICAgICAgIC8vIGFzc29jaWF0ZWQgdmlld2VyXHJcbiAgICBfbW9kZWxWaWV3ZXJTZXR0aW5ncyA6IE1vZGVsVmlld2VyU2V0dGluZ3M7ICAgICAgICAgICAgIC8vIFVJIHNldHRpbmdzXHJcblxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNb2RlbFZpZXdlckNvbnRyb2xzXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kZWxWaWV3ZXIgOiBNb2RlbFZpZXdlcikgeyAgXHJcblxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyID0gbW9kZWxWaWV3ZXI7XHJcblxyXG4gICAgICAgIC8vIFVJIENvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ29udHJvbHMoKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHZpZXcgc2V0dGluZ3MgdGhhdCBhcmUgY29udHJvbGxhYmxlIGJ5IHRoZSB1c2VyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgbGV0IHNjb3BlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXJTZXR0aW5ncyA9IG5ldyBNb2RlbFZpZXdlclNldHRpbmdzKCk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIGxldCBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgbWVudURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuX21vZGVsVmlld2VyLmNvbnRhaW5lcklkKTtcclxuICAgICAgICBtZW51RGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNb2RlbFZpZXdlciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IG1vZGVsVmlld2VyT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ01vZGVsVmlld2VyIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gR3JpZFxyXG4gICAgICAgIGxldCBjb250cm9sRGlzcGxheUdyaWQgPSBtb2RlbFZpZXdlck9wdGlvbnMuYWRkKHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MsICdkaXNwbGF5R3JpZCcpLm5hbWUoJ0Rpc3BsYXkgR3JpZCcpO1xyXG4gICAgICAgIGNvbnRyb2xEaXNwbGF5R3JpZC5vbkNoYW5nZSAoKHZhbHVlIDogYm9vbGVhbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuX21vZGVsVmlld2VyLmRpc3BsYXlHcmlkKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RlbFZpZXdlck9wdGlvbnMub3BlbigpO1xyXG4gICAgfSAgICBcclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7U3RhbmRhcmRWaWV3fSAgICAgICAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtFdmVudE1hbmFnZXIsIEV2ZW50VHlwZX0gICAgICAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge01hdGVyaWFsc30gICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTWF0ZXJpYWxzJ1xyXG5pbXBvcnQge01vZGVsVmlld2VyQ29udHJvbHN9ICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld2VyQ29udHJvbHNcIlxyXG5pbXBvcnQge0xvZ2dlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbmNvbnN0IE9iamVjdE5hbWVzID0ge1xyXG4gICAgR3JpZCA6ICAnR3JpZCdcclxufVxyXG5cclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9Nb2RlbFZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1vZGVsVmlld2VyIGV4dGVuZHMgVmlld2VyIHtcclxuXHJcbiAgICBfbW9kZWxWaWV3ZXJDb250cm9scyA6IE1vZGVsVmlld2VyQ29udHJvbHM7ICAgICAgICAgICAgIC8vIFVJIGNvbnRyb2xzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTW9kZWxWaWV3ZXJcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIG5hbWUgVmlld2VyIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gbW9kZWxDYW52YXNJZCBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBtb2RlbENhbnZhc0lkIDogc3RyaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIgKG5hbWUsIG1vZGVsQ2FudmFzSWQpOyAgICAgICBcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBzZXRNb2RlbCh2YWx1ZSA6IFRIUkVFLkdyb3VwKSB7XHJcblxyXG4gICAgICAgIC8vIENhbGwgYmFzZSBjbGFzcyBwcm9wZXJ0eSB2aWEgc3VwZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzQ0NjUgICAgICAgIFxyXG4gICAgICAgIHN1cGVyLnNldE1vZGVsKHZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gZGlzcGF0Y2ggTmV3TW9kZWwgZXZlbnRcclxuICAgICAgICB0aGlzLmV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRoaXMsIEV2ZW50VHlwZS5OZXdNb2RlbCwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3B1bGF0ZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLnBvcHVsYXRlU2NlbmUoKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDMwMCwgMzAsIDB4ODZlNmZmLCAweDk5OTk5OSk7XHJcbiAgICAgICAgaGVscGVyLm5hbWUgPSBPYmplY3ROYW1lcy5HcmlkO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGhlbHBlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmFsIGluaXRpYWxpemF0aW9uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBVSSBjb250cm9scyBpbml0aWFsaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlckNvbnRyb2xzID0gbmV3IE1vZGVsVmlld2VyQ29udHJvbHModGhpcyk7XHJcbiAgICB9XHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBTY2VuZVxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5IHRoZSByZWZlcmVuY2UgZ3JpZC5cclxuICAgICAqL1xyXG4gICAgZGlzcGxheUdyaWQodmlzaWJsZSA6IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgbGV0IGdyaWRHZW9tZXRyeSA6IFRIUkVFLk9iamVjdDNEID0gdGhpcy5zY2VuZS5nZXRPYmplY3RCeU5hbWUoT2JqZWN0TmFtZXMuR3JpZCk7XHJcbiAgICAgICAgZ3JpZEdlb21ldHJ5LnZpc2libGUgPSB2aXNpYmxlO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgRGlzcGxheSBncmlkID0gJHt2aXNpYmxlfWApO1xyXG4gICAgfSBcclxuLy8jZW5kcmVnaW9uXHJcbn0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiQ2FtZXJhXCJcclxuaW1wb3J0IHtDb21wb3NlclZpZXd9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiQ29tcG9zZXJWaWV3XCJcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtFdmVudE1hbmFnZXIsIEV2ZW50VHlwZSwgTVJFdmVudH0gICBmcm9tICdFdmVudE1hbmFnZXInXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNZXNoVmlld2VyfSAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiTWVzaFZpZXdlclwiXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld2VyXCJcclxuaW1wb3J0IHtPQkpMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiT0JKTG9hZGVyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiVmlld2VyXCJcclxuICAgIFxyXG5leHBvcnQgY2xhc3MgQ29tcG9zZXJDb250cm9sbGVyIHsgIFxyXG5cclxuICAgIF9jb21wb3NlclZpZXcgICAgICAgICAgICA6IENvbXBvc2VyVmlldztcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsUmVsaWVmQ29udHJvbGxlclxyXG4gICAgICogQHBhcmFtIGNvbXBvc2VyVmlldyBNZXNoIGdlbmVyYXRpb24gZXZlbnQuXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoY29tcG9zZXJWaWV3IDogQ29tcG9zZXJWaWV3KSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fY29tcG9zZXJWaWV3ID0gY29tcG9zZXJWaWV3O1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWx6aWF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb21wb3NlclZpZXcuX21vZGVsVmlldy5tb2RlbFZpZXdlci5ldmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTmV3TW9kZWwsIHRoaXMub25OZXdNb2RlbC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuICAgIC8qKlxyXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgbWVzaCBnZW5lcmF0aW9uLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IE1lc2ggZ2VuZXJhdGlvbiBldmVudC5cclxuICAgICAqIEBwYXJhbSBtZXNoIE5ld2x5LWdlbmVyYXRlZCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBvbk1lc2hHZW5lcmF0ZSAoZXZlbnQgOiBNUkV2ZW50LCBtZXNoIDogVEhSRUUuTWVzaCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIG5ldyBtb2RlbC5cclxuICAgICAqIEBwYXJhbSBldmVudCBOZXdNb2RlbCBldmVudC5cclxuICAgICAqIEBwYXJhbSBtb2RlbCBOZXdseSBsb2FkZWQgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIG9uTmV3TW9kZWwgKGV2ZW50IDogTVJFdmVudCwgbW9kZWwgOiBUSFJFRS5Hcm91cCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NvbXBvc2VyVmlldy5fbW9kZWxWaWV3Lm1vZGVsVmlld2VyLnNldENhbWVyYVRvU3RhbmRhcmRWaWV3KFN0YW5kYXJkVmlldy5Gcm9udCk7ICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl9jb21wb3NlclZpZXcuX21lc2hWaWV3Lm1lc2hWaWV3ZXIuc2V0Q2FtZXJhVG9TdGFuZGFyZFZpZXcoU3RhbmRhcmRWaWV3LlRvcCk7ICAgICAgIFxyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXG4vLyBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXG4vLyBodHRwczovL2dpdGh1Yi5jb20vQW5kcmV3UmF5Q29kZS90aHJlZS1vYmotZXhwb3J0ZXIvYmxvYi9tYXN0ZXIvaW5kZXguanMgICAgICAgLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXG5cbmltcG9ydCB7IFNlcnZpY2VzIH0gZnJvbSAnU2VydmljZXMnXG5pbXBvcnQgeyBTdG9wV2F0Y2ggfSBmcm9tICdTdG9wV2F0Y2gnXG5cbmV4cG9ydCBjbGFzcyBPQkpFeHBvcnRlciB7XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0fVxuXG5cdHBhcnNlICggb2JqZWN0ICkge1xuXG5cdFx0dmFyIG91dHB1dCA9ICcnO1xuXG5cdFx0dmFyIGluZGV4VmVydGV4ID0gMDtcblx0XHR2YXIgaW5kZXhWZXJ0ZXhVdnMgPSAwO1xuXHRcdHZhciBpbmRleE5vcm1hbHMgPSAwO1xuXG5cdFx0dmFyIHZlcnRleCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cdFx0dmFyIG5vcm1hbCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cdFx0dmFyIHV2ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuXHRcdHZhciBpLCBqLCBrLCBsLCBtLCBmYWNlID0gW107XG5cblx0XHR2YXIgcGFyc2VNZXNoID0gZnVuY3Rpb24gKCBtZXNoICkge1xuXG5cdFx0XHR2YXIgbmJWZXJ0ZXggPSAwO1xuXHRcdFx0dmFyIG5iTm9ybWFscyA9IDA7XG5cdFx0XHR2YXIgbmJWZXJ0ZXhVdnMgPSAwO1xuXG5cdFx0XHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xuXG5cdFx0XHR2YXIgbm9ybWFsTWF0cml4V29ybGQgPSBuZXcgVEhSRUUuTWF0cml4MygpO1xuXG5cdFx0XHRpZiAoIGdlb21ldHJ5IGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKSB7XG5cblx0XHRcdFx0Z2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKS5zZXRGcm9tT2JqZWN0KCBtZXNoICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBnZW9tZXRyeSBpbnN0YW5jZW9mIFRIUkVFLkJ1ZmZlckdlb21ldHJ5ICkge1xuXG5cdFx0XHRcdC8vIHNob3J0Y3V0c1xuXHRcdFx0XHR2YXIgdmVydGljZXMgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoICdwb3NpdGlvbicgKTtcblx0XHRcdFx0dmFyIG5vcm1hbHMgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoICdub3JtYWwnICk7XG5cdFx0XHRcdHZhciB1dnMgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoICd1dicgKTtcblx0XHRcdFx0dmFyIGluZGljZXMgPSBnZW9tZXRyeS5nZXRJbmRleCgpO1xuXG5cdFx0XHRcdC8vIG5hbWUgb2YgdGhlIG1lc2ggb2JqZWN0XG5cdFx0XHRcdG91dHB1dCArPSAnbyAnICsgbWVzaC5uYW1lICsgJ1xcbic7XG5cblx0XHRcdFx0Ly8gbmFtZSBvZiB0aGUgbWVzaCBtYXRlcmlhbFxuXHRcdFx0XHRpZiAoIG1lc2gubWF0ZXJpYWwgJiYgbWVzaC5tYXRlcmlhbC5uYW1lICkge1xuXHRcdFx0XHRcdG91dHB1dCArPSAndXNlbXRsICcgKyBtZXNoLm1hdGVyaWFsLm5hbWUgKyAnXFxuJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHZlcnRpY2VzXG5cblx0XHRcdFx0aWYoIHZlcnRpY2VzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IHZlcnRpY2VzLmNvdW50OyBpIDwgbDsgaSArKywgbmJWZXJ0ZXgrKyApIHtcblxuXHRcdFx0XHRcdFx0dmVydGV4LnggPSB2ZXJ0aWNlcy5nZXRYKCBpICk7XG5cdFx0XHRcdFx0XHR2ZXJ0ZXgueSA9IHZlcnRpY2VzLmdldFkoIGkgKTtcblx0XHRcdFx0XHRcdHZlcnRleC56ID0gdmVydGljZXMuZ2V0WiggaSApO1xuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zyb20gdGhlIHZlcnRleCB0byB3b3JsZCBzcGFjZVxuXHRcdFx0XHRcdFx0dmVydGV4LmFwcGx5TWF0cml4NCggbWVzaC5tYXRyaXhXb3JsZCApO1xuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zvcm0gdGhlIHZlcnRleCB0byBleHBvcnQgZm9ybWF0XG5cdFx0XHRcdFx0XHRvdXRwdXQgKz0gJ3YgJyArIHZlcnRleC54ICsgJyAnICsgdmVydGV4LnkgKyAnICcgKyB2ZXJ0ZXgueiArICdcXG4nO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB1dnNcblxuXHRcdFx0XHRpZiggdXZzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IHV2cy5jb3VudDsgaSA8IGw7IGkgKyssIG5iVmVydGV4VXZzKysgKSB7XG5cblx0XHRcdFx0XHRcdHV2LnggPSB1dnMuZ2V0WCggaSApO1xuXHRcdFx0XHRcdFx0dXYueSA9IHV2cy5nZXRZKCBpICk7XG5cblx0XHRcdFx0XHRcdC8vIHRyYW5zZm9ybSB0aGUgdXYgdG8gZXhwb3J0IGZvcm1hdFxuXHRcdFx0XHRcdFx0b3V0cHV0ICs9ICd2dCAnICsgdXYueCArICcgJyArIHV2LnkgKyAnXFxuJztcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gbm9ybWFsc1xuXG5cdFx0XHRcdGlmKCBub3JtYWxzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0XHRub3JtYWxNYXRyaXhXb3JsZC5nZXROb3JtYWxNYXRyaXgoIG1lc2gubWF0cml4V29ybGQgKTtcblxuXHRcdFx0XHRcdGZvciAoIGkgPSAwLCBsID0gbm9ybWFscy5jb3VudDsgaSA8IGw7IGkgKyssIG5iTm9ybWFscysrICkge1xuXG5cdFx0XHRcdFx0XHRub3JtYWwueCA9IG5vcm1hbHMuZ2V0WCggaSApO1xuXHRcdFx0XHRcdFx0bm9ybWFsLnkgPSBub3JtYWxzLmdldFkoIGkgKTtcblx0XHRcdFx0XHRcdG5vcm1hbC56ID0gbm9ybWFscy5nZXRaKCBpICk7XG5cblx0XHRcdFx0XHRcdC8vIHRyYW5zZnJvbSB0aGUgbm9ybWFsIHRvIHdvcmxkIHNwYWNlXG5cdFx0XHRcdFx0XHRub3JtYWwuYXBwbHlNYXRyaXgzKCBub3JtYWxNYXRyaXhXb3JsZCApO1xuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zvcm0gdGhlIG5vcm1hbCB0byBleHBvcnQgZm9ybWF0XG5cdFx0XHRcdFx0XHRvdXRwdXQgKz0gJ3ZuICcgKyBub3JtYWwueCArICcgJyArIG5vcm1hbC55ICsgJyAnICsgbm9ybWFsLnogKyAnXFxuJztcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZmFjZXNcblxuXHRcdFx0XHRpZiggaW5kaWNlcyAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdGZvciAoIGkgPSAwLCBsID0gaW5kaWNlcy5jb3VudDsgaSA8IGw7IGkgKz0gMyApIHtcblxuXHRcdFx0XHRcdFx0Zm9yKCBtID0gMDsgbSA8IDM7IG0gKysgKXtcblxuXHRcdFx0XHRcdFx0XHRqID0gaW5kaWNlcy5nZXRYKCBpICsgbSApICsgMTtcblxuXHRcdFx0XHRcdFx0XHRmYWNlWyBtIF0gPSAoIGluZGV4VmVydGV4ICsgaiApICsgJy8nICsgKCB1dnMgPyAoIGluZGV4VmVydGV4VXZzICsgaiApIDogJycgKSArICcvJyArICggaW5kZXhOb3JtYWxzICsgaiApO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIHRyYW5zZm9ybSB0aGUgZmFjZSB0byBleHBvcnQgZm9ybWF0XG5cdFx0XHRcdFx0XHRvdXRwdXQgKz0gJ2YgJyArIGZhY2Uuam9pbiggJyAnICkgKyBcIlxcblwiO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IHZlcnRpY2VzLmNvdW50OyBpIDwgbDsgaSArPSAzICkge1xuXG5cdFx0XHRcdFx0XHRmb3IoIG0gPSAwOyBtIDwgMzsgbSArKyApe1xuXG5cdFx0XHRcdFx0XHRcdGogPSBpICsgbSArIDE7XG5cblx0XHRcdFx0XHRcdFx0ZmFjZVsgbSBdID0gKCBpbmRleFZlcnRleCArIGogKSArICcvJyArICggdXZzID8gKCBpbmRleFZlcnRleFV2cyArIGogKSA6ICcnICkgKyAnLycgKyAoIGluZGV4Tm9ybWFscyArIGogKTtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyB0cmFuc2Zvcm0gdGhlIGZhY2UgdG8gZXhwb3J0IGZvcm1hdFxuXHRcdFx0XHRcdFx0b3V0cHV0ICs9ICdmICcgKyBmYWNlLmpvaW4oICcgJyApICsgXCJcXG5cIjtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuT0JKRXhwb3J0ZXIucGFyc2VNZXNoKCk6IGdlb21ldHJ5IHR5cGUgdW5zdXBwb3J0ZWQnLCBnZW9tZXRyeSApO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSBpbmRleFxuXHRcdFx0aW5kZXhWZXJ0ZXggKz0gbmJWZXJ0ZXg7XG5cdFx0XHRpbmRleFZlcnRleFV2cyArPSBuYlZlcnRleFV2cztcblx0XHRcdGluZGV4Tm9ybWFscyArPSBuYk5vcm1hbHM7XG5cblx0XHR9O1xuXG5cdFx0dmFyIHBhcnNlTGluZSA9IGZ1bmN0aW9uKCBsaW5lICkge1xuXG5cdFx0XHR2YXIgbmJWZXJ0ZXggPSAwO1xuXG5cdFx0XHR2YXIgZ2VvbWV0cnkgPSBsaW5lLmdlb21ldHJ5O1xuXHRcdFx0dmFyIHR5cGUgPSBsaW5lLnR5cGU7XG5cblx0XHRcdGlmICggZ2VvbWV0cnkgaW5zdGFuY2VvZiBUSFJFRS5HZW9tZXRyeSApIHtcblxuXHRcdFx0XHRnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpLnNldEZyb21PYmplY3QoIGxpbmUgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGdlb21ldHJ5IGluc3RhbmNlb2YgVEhSRUUuQnVmZmVyR2VvbWV0cnkgKSB7XG5cblx0XHRcdFx0Ly8gc2hvcnRjdXRzXG5cdFx0XHRcdHZhciB2ZXJ0aWNlcyA9IGdlb21ldHJ5LmdldEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJyApO1xuXHRcdFx0XHR2YXIgaW5kaWNlcyA9IGdlb21ldHJ5LmdldEluZGV4KCk7XG5cblx0XHRcdFx0Ly8gbmFtZSBvZiB0aGUgbGluZSBvYmplY3Rcblx0XHRcdFx0b3V0cHV0ICs9ICdvICcgKyBsaW5lLm5hbWUgKyAnXFxuJztcblxuXHRcdFx0XHRpZiggdmVydGljZXMgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHRcdGZvciAoIGkgPSAwLCBsID0gdmVydGljZXMuY291bnQ7IGkgPCBsOyBpICsrLCBuYlZlcnRleCsrICkge1xuXG5cdFx0XHRcdFx0XHR2ZXJ0ZXgueCA9IHZlcnRpY2VzLmdldFgoIGkgKTtcblx0XHRcdFx0XHRcdHZlcnRleC55ID0gdmVydGljZXMuZ2V0WSggaSApO1xuXHRcdFx0XHRcdFx0dmVydGV4LnogPSB2ZXJ0aWNlcy5nZXRaKCBpICk7XG5cblx0XHRcdFx0XHRcdC8vIHRyYW5zZnJvbSB0aGUgdmVydGV4IHRvIHdvcmxkIHNwYWNlXG5cdFx0XHRcdFx0XHR2ZXJ0ZXguYXBwbHlNYXRyaXg0KCBsaW5lLm1hdHJpeFdvcmxkICk7XG5cblx0XHRcdFx0XHRcdC8vIHRyYW5zZm9ybSB0aGUgdmVydGV4IHRvIGV4cG9ydCBmb3JtYXRcblx0XHRcdFx0XHRcdG91dHB1dCArPSAndiAnICsgdmVydGV4LnggKyAnICcgKyB2ZXJ0ZXgueSArICcgJyArIHZlcnRleC56ICsgJ1xcbic7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggdHlwZSA9PT0gJ0xpbmUnICkge1xuXG5cdFx0XHRcdFx0b3V0cHV0ICs9ICdsICc7XG5cblx0XHRcdFx0XHRmb3IgKCBqID0gMSwgbCA9IHZlcnRpY2VzLmNvdW50OyBqIDw9IGw7IGorKyApIHtcblxuXHRcdFx0XHRcdFx0b3V0cHV0ICs9ICggaW5kZXhWZXJ0ZXggKyBqICkgKyAnICc7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvdXRwdXQgKz0gJ1xcbic7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggdHlwZSA9PT0gJ0xpbmVTZWdtZW50cycgKSB7XG5cblx0XHRcdFx0XHRmb3IgKCBqID0gMSwgayA9IGogKyAxLCBsID0gdmVydGljZXMuY291bnQ7IGogPCBsOyBqICs9IDIsIGsgPSBqICsgMSApIHtcblxuXHRcdFx0XHRcdFx0b3V0cHV0ICs9ICdsICcgKyAoIGluZGV4VmVydGV4ICsgaiApICsgJyAnICsgKCBpbmRleFZlcnRleCArIGsgKSArICdcXG4nO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1RIUkVFLk9CSkV4cG9ydGVyLnBhcnNlTGluZSgpOiBnZW9tZXRyeSB0eXBlIHVuc3VwcG9ydGVkJywgZ2VvbWV0cnkgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgaW5kZXhcblx0XHRcdGluZGV4VmVydGV4ICs9IG5iVmVydGV4O1xuXG5cdFx0fTtcblxuXHRcdG9iamVjdC50cmF2ZXJzZSggZnVuY3Rpb24gKCBjaGlsZCApIHtcblxuXHRcdFx0aWYgKCBjaGlsZCBpbnN0YW5jZW9mIFRIUkVFLk1lc2ggKSB7XG5cblx0XHRcdFx0cGFyc2VNZXNoKCBjaGlsZCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggY2hpbGQgaW5zdGFuY2VvZiBUSFJFRS5MaW5lICkge1xuXG5cdFx0XHRcdHBhcnNlTGluZSggY2hpbGQgKTtcblxuXHRcdFx0fVxuXG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIG91dHB1dDtcblxuXHR9XG59IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7IENvbXBvc2VyVmlldyB9IGZyb20gXCJDb21wb3NlclZpZXdcIlxyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge09CSkV4cG9ydGVyfSAgICAgICAgICAgICAgICBmcm9tIFwiT0JKRXhwb3J0ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQ29tcG9zZXJWaWV3U2V0dGluZ3NcclxuICovXHJcbmNsYXNzIENvbXBvc2VyVmlld1NldHRpbmdzIHtcclxuXHJcbiAgICBnZW5lcmF0ZVJlbGllZiA6ICgpID0+IHZvaWQ7XHJcbiAgICBzYXZlUmVsaWVmICAgICA6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2VuZXJhdGVSZWxpZWY6ICgpID0+IGFueSwgc2F2ZVJlbGllZjogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVJlbGllZiA9IGdlbmVyYXRlUmVsaWVmO1xyXG4gICAgICAgIHRoaXMuc2F2ZVJlbGllZiAgICAgPSBzYXZlUmVsaWVmO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29tcG9zZXJWaWV3IFVJIENvbnRyb2xzLlxyXG4gKi8gICAgXHJcbmV4cG9ydCBjbGFzcyBDb21wb3NlclZpZXdDb250cm9scyB7XHJcblxyXG4gICAgX2NvbXBvc2VyVmlldyAgICAgICAgIDogQ29tcG9zZXJWaWV3OyAgICAgICAgICAgICAgICAgICAgICAgLy8gYXBwbGljYXRpb24gdmlld1xyXG4gICAgX2NvbXBvc2VyVmlld1NldHRpbmdzIDogQ29tcG9zZXJWaWV3U2V0dGluZ3M7ICAgICAgICAgICAgICAgLy8gVUkgc2V0dGluZ3NcclxuXHJcbiAgICBfaW5pdGlhbE1lc2hHZW5lcmF0aW9uOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIFxyXG4gICAgLyoqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBDb21wb3NlclZpZXdDb250cm9sc1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGNvbXBvc2VyVmlldyA6IENvbXBvc2VyVmlldykgeyAgXHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXBvc2VyVmlldyA9IGNvbXBvc2VyVmlldztcclxuXHJcbiAgICAgICAgLy8gVUkgQ29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDb250cm9scygpO1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIEV2ZW50IEhhbmRsZXJzXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIHJlbGllZiBmcm9tIHRoZSBjdXJyZW50IG1vZGVsIGNhbWVyYS5cclxuICAgICAqL1xyXG4gICAgZ2VuZXJhdGVSZWxpZWYoKSA6IHZvaWQgeyBcclxuXHJcbiAgICAgICAgLy8gcGl4ZWxzXHJcbiAgICAgICAgbGV0IHdpZHRoID0gNTEyO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB3aWR0aCAvIHRoaXMuX2NvbXBvc2VyVmlldy5tb2RlbFZpZXcubW9kZWxWaWV3ZXIuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgbGV0IGZhY3RvcnkgPSBuZXcgRGVwdGhCdWZmZXJGYWN0b3J5KHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCwgbW9kZWw6IHRoaXMuX2NvbXBvc2VyVmlldy5tb2RlbFZpZXcubW9kZWxWaWV3ZXIubW9kZWwsIGNhbWVyYTogdGhpcy5fY29tcG9zZXJWaWV3Lm1vZGVsVmlldy5tb2RlbFZpZXdlci5jYW1lcmEsIGFkZENhbnZhc1RvRE9NOiBmYWxzZSB9KTtcclxuXHJcbiAgICAgICAgbGV0IHByZXZpZXdNZXNoOiBUSFJFRS5NZXNoID0gZmFjdG9yeS5tZXNoR2VuZXJhdGUoe30pO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21wb3NlclZpZXcuX21lc2hWaWV3Lm1lc2hWaWV3ZXIuc2V0TW9kZWwocHJldmlld01lc2gpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbml0aWFsTWVzaEdlbmVyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fY29tcG9zZXJWaWV3Ll9tZXNoVmlldy5tZXNoVmlld2VyLmZpdFZpZXcoKTtcclxuICAgICAgICAgICAgdGhpcy5faW5pdGlhbE1lc2hHZW5lcmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICAgLy8gU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRJbmZvTWVzc2FnZSgnUmVsaWVmIGdlbmVyYXRlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2F2ZXMgdGhlIHJlbGllZiB0byBhIGRpc2sgZmlsZS5cclxuICAgICAqL1xyXG4gICAgc2F2ZVJlbGllZigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGV4cG9ydFRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ0V4cG9ydCBPQkonKTtcclxuICAgICAgICBsZXQgZXhwb3J0ZXIgPSBuZXcgT0JKRXhwb3J0ZXIoKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZXhwb3J0ZXIucGFyc2UodGhpcy5fY29tcG9zZXJWaWV3Lm1lc2hWaWV3Lm1lc2hWaWV3ZXIubW9kZWwpO1xyXG5cclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICBsZXQgdmlld2VyVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgbGV0IHBvc3RVcmwgPSB2aWV3ZXJVcmwucmVwbGFjZSgnVmlld2VyJywgJ1NhdmUnKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oXCJQT1NUXCIsIHBvc3RVcmwsIHRydWUpO1xyXG4gICAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24gKG9FdmVudCkge1xyXG4gICAgICAgICAgICAvLyB1cGxvYWRlZC4uLlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBibG9iID0gbmV3IEJsb2IoW3Jlc3VsdF0sIHsgdHlwZTogJ3RleHQvcGxhaW4nIH0pO1xyXG4gICAgICAgIHJlcXVlc3Quc2VuZChibG9iKVxyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZShleHBvcnRUYWcpO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXBvc2VyVmlld1NldHRpbmdzID0gbmV3IENvbXBvc2VyVmlld1NldHRpbmdzKHRoaXMuZ2VuZXJhdGVSZWxpZWYuYmluZCh0aGlzKSwgdGhpcy5zYXZlUmVsaWVmLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBJbml0IGRhdC5ndWkgYW5kIGNvbnRyb2xzIGZvciB0aGUgVUlcclxuICAgICAgICBsZXQgZ3VpID0gbmV3IGRhdC5HVUkoe1xyXG4gICAgICAgICAgICBhdXRvUGxhY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICB3aWR0aDogMzIwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IG1lbnVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLl9jb21wb3NlclZpZXcuY29udGFpbmVySWQpO1xyXG4gICAgICAgIG1lbnVEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICBsZXQgY29tcG9zZXJWaWV3T3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ0NvbXBvc2VyIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gR2VuZXJhdGUgUmVsaWVmXHJcbiAgICAgICAgbGV0IGNvbnRyb2xHZW5lcmF0ZVJlbGllZiA9IGNvbXBvc2VyVmlld09wdGlvbnMuYWRkKHRoaXMuX2NvbXBvc2VyVmlld1NldHRpbmdzLCAnZ2VuZXJhdGVSZWxpZWYnKS5uYW1lKCdHZW5lcmF0ZSBSZWxpZWYnKTtcclxuXHJcbiAgICAgICAgLy8gU2F2ZSBSZWxpZWZcclxuICAgICAgICBsZXQgY29udHJvbFNhdmVSZWxpZWYgPSBjb21wb3NlclZpZXdPcHRpb25zLmFkZCh0aGlzLl9jb21wb3NlclZpZXdTZXR0aW5ncywgJ3NhdmVSZWxpZWYnKS5uYW1lKCdTYXZlIFJlbGllZicpO1xyXG5cclxuICAgICAgICBjb21wb3NlclZpZXdPcHRpb25zLm9wZW4oKTtcclxuICAgIH0gICAgXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0NvbnRhaW5lcklkc30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFJlbGllZlwiXHJcbmltcG9ydCB7TWVzaFZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk1lc2hWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJWaWV3ZXJcIlxyXG4gICAgXHJcbmV4cG9ydCBjbGFzcyBNZXNoVmlldyB7XHJcblxyXG4gICAgX2NvbnRhaW5lcklkICAgICAgICAgICAgICAgOiBzdHJpbmc7XHJcbiAgICBfbWVzaFZpZXdlciAgICAgICAgICAgICAgICA6IE1lc2hWaWV3ZXI7XHJcbiAgICBcclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTWVzaFZpZXdcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovIFxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVySWQgOiBzdHJpbmcpIHsgIFxyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXJJZCA9IGNvbnRhaW5lcklkOyAgICBcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH0gXHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBDb250YWluZXIgSWQuXHJcbiAgICAgKi9cclxuICAgIGdldCBjb250YWluZXJJZCgpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVySWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBNb2RlbFZpZXdlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1lc2hWaWV3ZXIoKTogTWVzaFZpZXdlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXNoVmlld2VyO1xyXG4gICAgfSAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEV2ZW50IEhhbmRsZXJzXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWx6aWF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG5cclxuICAgICAgICAvLyBNZXNoIFZpZXdlciAgICBcclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyID0gbmV3IE1lc2hWaWV3ZXIoJ01vZGVsVmlld2VyJywgdGhpcy5jb250YWluZXJJZCk7XHJcbiAgICB9XHJcbiAgICBcclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuaW1wb3J0ICogYXMgZGF0ICAgIGZyb20gJ2RhdC1ndWknXHJcblxyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtDb250YWluZXJJZHN9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiTW9kZWxSZWxpZWZcIlxyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIlZpZXdlclwiXHJcbiAgICBcclxuZXhwb3J0IGNsYXNzIE1vZGVsVmlldyB7XHJcblxyXG4gICAgX2NvbnRhaW5lcklkICAgICAgICAgICAgICAgIDogc3RyaW5nO1xyXG4gICAgX21vZGVsVmlld2VyICAgICAgICAgICAgICAgIDogTW9kZWxWaWV3ZXI7XHJcbiAgICBcclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTW9kZWxWaWV3XHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqLyBcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcklkIDogc3RyaW5nKSB7ICBcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVySWQgPSBjb250YWluZXJJZDsgICAgXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XHJcbiAgICB9IFxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgQ29udGFpbmVyIElkLlxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGFpbmVySWQoKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcklkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgTW9kZWxWaWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIGdldCBtb2RlbFZpZXdlcigpOiBNb2RlbFZpZXdlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbFZpZXdlcjtcclxuICAgIH0gICAgICAgIFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsemlhdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuXHJcbiAgICAgICAgLy8gTW9kZWwgVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX21vZGVsVmlld2VyID0gbmV3IE1vZGVsVmlld2VyKCdNb2RlbFZpZXdlcicsIHRoaXMuY29udGFpbmVySWQpO1xyXG4gICAgfVxyXG4gICAgXHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtDb21wb3NlckNvbnRyb2xsZXJ9ICAgICAgICAgICAgICAgICBmcm9tIFwiQ29tcG9zZXJDb250cm9sbGVyXCJcclxuaW1wb3J0IHtDb21wb3NlclZpZXdDb250cm9sc30gICAgICAgICAgICAgICBmcm9tIFwiQ29tcG9zZXJWaWV3Q29udHJvbHNcIlxyXG5pbXBvcnQge0V2ZW50VHlwZSwgTVJFdmVudCwgRXZlbnRNYW5hZ2VyfSAgIGZyb20gJ0V2ZW50TWFuYWdlcidcclxuaW1wb3J0IHtMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdMb2FkZXInXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01lc2hWaWV3fSAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNZXNoVmlld1wiXHJcbmltcG9ydCB7TWVzaFZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk1lc2hWaWV3ZXJcIlxyXG5pbXBvcnQge0NvbnRhaW5lcklkc30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFJlbGllZlwiXHJcbmltcG9ydCB7TW9kZWxWaWV3fSAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld1wiXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIk1vZGVsVmlld2VyXCJcclxuaW1wb3J0IHtPQkpMb2FkZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiT0JKTG9hZGVyXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUZXN0TW9kZWx9ICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdUZXN0TW9kZWxMb2FkZXInXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBcIlZpZXdlclwiXHJcbiAgICBcclxuZXhwb3J0IGNsYXNzIENvbXBvc2VyVmlldyB7XHJcblxyXG4gICAgX2NvbnRhaW5lcklkICAgICAgICAgICAgICAgIDogc3RyaW5nO1xyXG4gICAgX21lc2hWaWV3ICAgICAgICAgICAgICAgICAgIDogTWVzaFZpZXc7XHJcbiAgICBfbW9kZWxWaWV3ICAgICAgICAgICAgICAgICAgOiBNb2RlbFZpZXc7XHJcbiAgICBfbG9hZGVyICAgICAgICAgICAgICAgICAgICAgOiBMb2FkZXI7XHJcblxyXG4gICAgX2NvbXBvc2VyQ29udHJvbGxlciAgICAgICAgIDogQ29tcG9zZXJDb250cm9sbGVyO1xyXG4gICAgX2NvbXBvc2VyVmlld0NvbnRyb2xzICAgICAgIDogQ29tcG9zZXJWaWV3Q29udHJvbHM7IFxyXG4gICAgXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIENvbXBvc2VyVmlld1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi8gXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJJZCA6IHN0cmluZykgeyAgXHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lcklkID0gY29udGFpbmVySWQ7ICAgIFxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfSBcclxuXHJcbi8vI3JlZ2lvbiBQcm9wZXJ0aWVzXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIENvbnRhaW5lciBJZC5cclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRhaW5lcklkKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXJJZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIE1vZGVsVmlldy5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1vZGVsVmlldygpOiBNb2RlbFZpZXcge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWxWaWV3O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgTWVzaFZpZXdlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1lc2hWaWV3KCk6IE1lc2hWaWV3IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21lc2hWaWV3O1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgTG9hZGVyLlxyXG4gICAgICovXHJcbiAgICBnZXQgbG9hZGVyKCk6IExvYWRlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkZXI7XHJcbiAgICB9XHJcbiAgICAgICAgICAgIFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsemlhdGlvbi5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuXHJcbiAgICAgICAgU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRJbmZvTWVzc2FnZSgnTW9kZWxSZWxpZWYgc3RhcnRlZCcpO1xyXG5cclxuICAgICAgICAvLyBNZXNoIFZpZXdcclxuICAgICAgICB0aGlzLl9tZXNoVmlldyA9IG5ldyBNZXNoVmlldyhDb250YWluZXJJZHMuTWVzaENhbnZhcyk7XHJcblxyXG4gICAgICAgIC8vIE1vZGVsIFZpZXdcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXcgPSBuZXcgTW9kZWxWaWV3KENvbnRhaW5lcklkcy5Nb2RlbENhbnZhcyk7XHJcblxyXG4gICAgICAgIC8vIExvYWRlclxyXG4gICAgICAgIHRoaXMuX2xvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgLy8gT0JKIE1vZGVsc1xyXG4gICAgICAgIHRoaXMuX2xvYWRlci5sb2FkT0JKTW9kZWwodGhpcy5fbW9kZWxWaWV3Lm1vZGVsVmlld2VyKTtcclxuXHJcbiAgICAgICAgLy8gVGVzdCBNb2RlbHNcclxuLy8gICAgICB0aGlzLl9sb2FkZXIubG9hZFBhcmFtZXRyaWNUZXN0TW9kZWwodGhpcy5fbW9kZWxWaWV3ZXIsIFRlc3RNb2RlbC5DaGVja2VyYm9hcmQpO1xyXG5cclxuICAgICAgICAvLyBWaWV3IENvbnRyb2xsZXJcclxuICAgICAgICB0aGlzLl9jb21wb3NlckNvbnRyb2xsZXIgPSBuZXcgQ29tcG9zZXJDb250cm9sbGVyKHRoaXMpO1xyXG5cclxuICAgICAgICAvLyBWaWV3IFVJIENvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5fY29tcG9zZXJWaWV3Q29udHJvbHMgPSBuZXcgQ29tcG9zZXJWaWV3Q29udHJvbHModGhpcyk7XHJcbiAgICB9XHJcbiAgICBcclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuZXhwb3J0IGVudW0gQ29udGFpbmVySWRzIHtcclxuXHJcbiAgICBSb290Q29udGFpbmVyID0gXCJyb290Q29udGFpbmVyXCIsXHJcbiAgICBDb21wb3NlclZpZXcgID0gXCJjb21wb3NlclZpZXdcIixcclxuICAgIE1vZGVsVmlldyAgICAgPSBcIm1vZGVsVmlld1wiLFxyXG4gICAgTW9kZWxDYW52YXMgICA9IFwibW9kZWxDYW52YXNcIixcclxuICAgIE1lc2hWaWV3ICAgICAgPSBcIm1lc2hWaWV3XCIsXHJcbiAgICBNZXNoQ2FudmFzICAgID0gXCJtZXNoQ2FudmFzXCIsXHJcbn1cclxuXHJcbmltcG9ydCB7Q29tcG9zZXJWaWV3fSAgZnJvbSBcIkNvbXBvc2VyVmlld1wiXHJcblxyXG5sZXQgY29tcG9zZXJWaWV3ID0gbmV3IENvbXBvc2VyVmlldyhDb250YWluZXJJZHMuQ29tcG9zZXJWaWV3KTtcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHthc3NlcnR9ICAgZnJvbSAnY2hhaSdcclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0RlcHRoQnVmZmVyfSBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gZnJvbSAnTWF0aCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9WaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVbml0VGVzdHMge1xyXG4gICBcclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIFVuaXRUZXN0c1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIHN0YXRpYyBWZXJ0ZXhNYXBwaW5nIChkZXB0aEJ1ZmZlciA6IERlcHRoQnVmZmVyLCBtZXNoIDogVEhSRUUuTWVzaCkge1xyXG5cclxuICAgICAgICBsZXQgbWVzaEdlb21ldHJ5IDogVEhSRUUuR2VvbWV0cnkgPSA8VEhSRUUuR2VvbWV0cnk+IG1lc2guZ2VvbWV0cnk7XHJcbiAgICAgICAgbWVzaEdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IG1lc2hHZW9tZXRyeS5ib3VuZGluZ0JveDtcclxuXHJcbiAgICAgICAgLy8gd2lkdGggID0gMyAgICAgICAgICAgICAgMyAgIDQgICA1XHJcbiAgICAgICAgLy8gY29sdW1uID0gMiAgICAgICAgICAgICAgMCAgIDEgICAyXHJcbiAgICAgICAgLy8gYnVmZmVyIGxlbmd0aCA9IDZcclxuXHJcbiAgICAgICAgLy8gVGVzdCBQb2ludHMgICAgICAgICAgICBcclxuICAgICAgICBsZXQgbG93ZXJMZWZ0ICA9IGJvdW5kaW5nQm94Lm1pbjtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodCA9IG5ldyBUSFJFRS5WZWN0b3IzIChib3VuZGluZ0JveC5tYXgueCwgYm91bmRpbmdCb3gubWluLnksIDApO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0ID0gYm91bmRpbmdCb3gubWF4O1xyXG4gICAgICAgIGxldCB1cHBlckxlZnQgID0gbmV3IFRIUkVFLlZlY3RvcjMgKGJvdW5kaW5nQm94Lm1pbi54LCBib3VuZGluZ0JveC5tYXgueSwgMCk7XHJcbiAgICAgICAgbGV0IGNlbnRlciAgICAgPSBib3VuZGluZ0JveC5nZXRDZW50ZXIoKTtcclxuXHJcbiAgICAgICAgLy8gRXhwZWN0ZWQgVmFsdWVzXHJcbiAgICAgICAgbGV0IGJ1ZmZlckxlbmd0aCAgICA6IG51bWJlciA9IChkZXB0aEJ1ZmZlci53aWR0aCAqIGRlcHRoQnVmZmVyLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBmaXJzdENvbHVtbiAgIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbGFzdENvbHVtbiAgICA6IG51bWJlciA9IGRlcHRoQnVmZmVyLndpZHRoIC0gMTtcclxuICAgICAgICBsZXQgY2VudGVyQ29sdW1uICA6IG51bWJlciA9IE1hdGgucm91bmQoZGVwdGhCdWZmZXIud2lkdGggLyAyKTtcclxuICAgICAgICBsZXQgZmlyc3RSb3cgICAgICA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGxhc3RSb3cgICAgICAgOiBudW1iZXIgPSBkZXB0aEJ1ZmZlci5oZWlnaHQgLSAxO1xyXG4gICAgICAgIGxldCBjZW50ZXJSb3cgICAgIDogbnVtYmVyID0gTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci5oZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdEluZGV4ICA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHRJbmRleCA6IG51bWJlciA9IGRlcHRoQnVmZmVyLndpZHRoIC0gMTtcclxuICAgICAgICBsZXQgdXBwZXJSaWdodEluZGV4IDogbnVtYmVyID0gYnVmZmVyTGVuZ3RoIC0gMTtcclxuICAgICAgICBsZXQgdXBwZXJMZWZ0SW5kZXggIDogbnVtYmVyID0gYnVmZmVyTGVuZ3RoIC0gZGVwdGhCdWZmZXIud2lkdGg7XHJcbiAgICAgICAgbGV0IGNlbnRlckluZGV4ICAgICA6IG51bWJlciA9IChjZW50ZXJSb3cgKiBkZXB0aEJ1ZmZlci53aWR0aCkgKyAgTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci53aWR0aCAvIDIpO1xyXG5cclxuICAgICAgICBsZXQgbG93ZXJMZWZ0SW5kaWNlcyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoZmlyc3RSb3csIGZpcnN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodEluZGljZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoZmlyc3RSb3csIGxhc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0SW5kaWNlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihsYXN0Um93LCBsYXN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgdXBwZXJMZWZ0SW5kaWNlcyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIobGFzdFJvdywgZmlyc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCBjZW50ZXJJbmRpY2VzICAgICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihjZW50ZXJSb3csIGNlbnRlckNvbHVtbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4ICAgOiBudW1iZXJcclxuICAgICAgICBsZXQgaW5kaWNlcyA6IFRIUkVFLlZlY3RvcjI7XHJcblxyXG4gICAgICAgIC8vIExvd2VyIExlZnRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKGxvd2VyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgbG93ZXJMZWZ0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ICAgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KGxvd2VyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgbG93ZXJMZWZ0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBMb3dlciBSaWdodFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXMobG93ZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgbG93ZXJSaWdodEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgobG93ZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgbG93ZXJSaWdodEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gVXBwZXIgUmlnaHRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHVwcGVyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIHVwcGVyUmlnaHRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KHVwcGVyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIHVwcGVyUmlnaHRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIFVwcGVyIExlZnRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHVwcGVyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgdXBwZXJMZWZ0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleCh1cHBlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIHVwcGVyTGVmdEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gQ2VudGVyXHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyhjZW50ZXIsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIGNlbnRlckluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgoY2VudGVyLCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBjZW50ZXJJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgfSBcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmF9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3MsIE9iamVjdE5hbWVzfSAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0xvYWRlcidcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hWaWV3ZXJ9ICAgICAgICAgICAgICAgICBmcm9tIFwiTWVzaFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtVbml0VGVzdHN9ICAgICAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYW1lcmFTZXR0aW5ncyB7XHJcbiAgICBwb3NpdGlvbjogICAgICAgVEhSRUUuVmVjdG9yMzsgICAgICAgIC8vIGxvY2F0aW9uIG9mIGNhbWVyYVxyXG4gICAgdGFyZ2V0OiAgICAgICAgIFRIUkVFLlZlY3RvcjM7ICAgICAgICAvLyB0YXJnZXQgcG9pbnRcclxuICAgIG5lYXI6ICAgICAgICAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gbmVhciBjbGlwcGluZyBwbGFuZVxyXG4gICAgZmFyOiAgICAgICAgICAgIG51bWJlcjsgICAgICAgICAgICAgICAvLyBmYXIgY2xpcHBpbmcgcGxhbmVcclxuICAgIGZpZWxkT2ZWaWV3OiAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gZmllbGQgb2Ygdmlld1xyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIENhbWVyYVdvcmtiZW5jaFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbWVyYVZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcblxyXG4gICAgcG9wdWxhdGVTY2VuZSgpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyaWFkID0gR3JhcGhpY3MuY3JlYXRlV29ybGRBeGVzVHJpYWQobmV3IFRIUkVFLlZlY3RvcjMoKSwgMSwgMC4yNSwgMC4yNSk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKHRyaWFkKTtcclxuXHJcbiAgICAgICAgbGV0IGJveCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKDQsIDYsIC0yKSwgMSwgMiwgMiwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvciA6IDB4ZmYwMDAwfSkpO1xyXG4gICAgICAgIGJveC5yb3RhdGlvbi5zZXQoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgYm94LnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKGJveCk7XHJcblxyXG4gICAgICAgIGxldCBzcGhlcmUgOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygtMywgMTAsIC0xKSwgMSwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvciA6IDB4MDBmZjAwfSkpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKHNwaGVyZSk7XHJcbiAgICB9ICAgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICBzaG93Qm91bmRpbmdCb3hlcyA6ICgpID0+IHZvaWQ7XHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcyA6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgc2hvd0JvdW5kaW5nQm94ZXMgOiAoKSA9PiBhbnksIHNldENsaXBwaW5nUGxhbmVzIDogKCkgPT4gYW55KSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMgPSBzaG93Qm91bmRpbmdCb3hlcztcclxuICAgICAgICB0aGlzLnNldENsaXBwaW5nUGxhbmVzICA9IHNldENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEFwcFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBcclxuICAgIF9sb2dnZXIgICAgICAgICA6IENvbnNvbGVMb2dnZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgOiBMb2FkZXI7XHJcbiAgICBfdmlld2VyICAgICAgICAgOiBDYW1lcmFWaWV3ZXI7XHJcbiAgICBfdmlld2VyQ29udHJvbHMgOiBWaWV3ZXJDb250cm9scztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byB0aGUgbW9kZWwgZXh0ZW50cyBpbiBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsICAgICAgICAgICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgPSB0aGlzLl92aWV3ZXIubW9kZWw7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjbG9uZSBtb2RlbCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3OiBUSFJFRS5Cb3gzID0gR3JhcGhpY3MuZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTsgICAgICAgIFxyXG5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgYm94IGlzIHdvcmxkLWF4aXMgYWxpZ25lZC4gXHJcbiAgICAgICAgLy8gSU52IFZpZXcgY29vcmRpbmF0ZXMsIHRoZSBjYW1lcmEgaXMgYXQgdGhlIG9yaWdpbi5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgbmVhciBwbGFuZSBpcyB0aGUgbWF4aW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGZhciBwbGFuZSBpcyB0aGUgbWluaW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgbGV0IG5lYXJQbGFuZSA9IC1ib3VuZGluZ0JveFZpZXcubWF4Lno7XHJcbiAgICAgICAgbGV0IGZhclBsYW5lICA9IC1ib3VuZGluZ0JveFZpZXcubWluLno7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5fY2FtZXJhQ29udHJvbHMuX2NhbWVyYVNldHRpbmdzLm5lYXJDbGlwcGluZ1BsYW5lID0gbmVhclBsYW5lO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5fY2FtZXJhQ29udHJvbHMuX2NhbWVyYVNldHRpbmdzLmZhckNsaXBwaW5nUGxhbmUgID0gZmFyUGxhbmU7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEubmVhciA9IG5lYXJQbGFuZTtcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLmZhciAgPSBmYXJQbGFuZTtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBib3VuZGluZyBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBvYmplY3QgVGFyZ2V0IG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBjb2xvciBDb2xvciBvZiBib3VuZGluZyBib3ggbWVzaC5cclxuICAgICAqL1xyXG4gICAgY3JlYXRlQm91bmRpbmdCb3ggKG9iamVjdCA6IFRIUkVFLk9iamVjdDNELCBjb2xvciA6IG51bWJlcikgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGJvdW5kaW5nQm94IDogVEhSRUUuQm94MyA9IG5ldyBUSFJFRS5Cb3gzKCk7XHJcbiAgICAgICAgICAgIGJvdW5kaW5nQm94ID0gYm91bmRpbmdCb3guc2V0RnJvbU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7Y29sb3IgOiBjb2xvciwgb3BhY2l0eSA6IDEuMCwgd2lyZWZyYW1lIDogdHJ1ZX0pOyAgICAgICBcclxuICAgICAgICAgICAgbGV0IGJvdW5kaW5nQm94TWVzaCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3goYm91bmRpbmdCb3guZ2V0Q2VudGVyKCksIGJvdW5kaW5nQm94LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZGluZ0JveE1lc2g7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIGNsaXBwaW5nIHBsYW5lcyBvZiB0aGUgbW9kZWwgaW4gVmlldyBhbmQgV29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHNob3dCb3VuZGluZ0JveGVzKCkge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWwgICAgICAgICAgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICA9IHRoaXMuX3ZpZXdlci5tb2RlbDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGQgICAgICAgIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubWF0cml4V29ybGQ7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nIEJvdW5kaW5nQm94ZXMgYW5kIG1vZGVsIGNsb25lIChWaWV3IGNvb3JkaW5hdGVzKVxyXG4gICAgICAgIEdyYXBoaWNzLnJlbW92ZUFsbEJ5TmFtZSh0aGlzLl92aWV3ZXIuX3NjZW5lLCBPYmplY3ROYW1lcy5Cb3VuZGluZ0JveCk7XHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlQWxsQnlOYW1lKHRoaXMuX3ZpZXdlci5fc2NlbmUsIE9iamVjdE5hbWVzLk1vZGVsQ2xvbmUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNsb25lIG1vZGVsIChhbmQgZ2VvbWV0cnkhKVxyXG4gICAgICAgIGxldCBtb2RlbFZpZXcgID0gIEdyYXBoaWNzLmNsb25lQW5kVHJhbnNmb3JtT2JqZWN0KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIG1vZGVsVmlldy5uYW1lID0gT2JqZWN0TmFtZXMuTW9kZWxDbG9uZTtcclxuICAgICAgICBtb2RlbC5hZGQobW9kZWxWaWV3KTtcclxuXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldyA6IFRIUkVFLk1lc2ggPSB0aGlzLmNyZWF0ZUJvdW5kaW5nQm94KG1vZGVsVmlldywgMHhmZjAwZmYpO1xyXG4gICAgICAgIG1vZGVsLmFkZChib3VuZGluZ0JveFZpZXcpO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gYm91bmRpbmcgYm94IGJhY2sgZnJvbSBWaWV3IHRvIFdvcmxkXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94V29ybGQgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QoYm91bmRpbmdCb3hWaWV3LCBjYW1lcmFNYXRyaXhXb3JsZCk7XHJcbiAgICAgICAgbW9kZWwuYWRkKGJvdW5kaW5nQm94V29ybGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlldyBzZXR0aW5ncyB0aGF0IGFyZSBjb250cm9sbGFibGUgYnkgdGhlIHVzZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVZpZXdlckNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXJDb250cm9scyA9IG5ldyBWaWV3ZXJDb250cm9scyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLnNob3dCb3VuZGluZ0JveGVzLmJpbmQodGhpcyksIHRoaXMuc2V0Q2xpcHBpbmdQbGFuZXMuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIHZhciBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgc2V0dGluZ3NEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3NDb250cm9scycpO1xyXG4gICAgICAgIHNldHRpbmdzRGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuICAgICAgICB2YXIgZm9sZGVyT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ0NhbWVyYVRlc3QgT3B0aW9ucycpO1xyXG5cclxuICAgICAgICAvLyBTaG93IEJvdW5kaW5nIEJveGVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTaG93Qm91bmRpbmdCb3hlcyA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnc2hvd0JvdW5kaW5nQm94ZXMnKS5uYW1lKCdTaG93IEJvdW5kaW5nIEJveGVzJyk7XHJcblxyXG4gICAgICAgIC8vIENsaXBwaW5nIFBsYW5lc1xyXG4gICAgICAgIGxldCBjb250cm9sU2V0Q2xpcHBpbmdQbGFuZXMgPSBmb2xkZXJPcHRpb25zLmFkZCh0aGlzLl92aWV3ZXJDb250cm9scywgJ3NldENsaXBwaW5nUGxhbmVzJykubmFtZSgnU2V0IENsaXBwaW5nIFBsYW5lcycpO1xyXG5cclxuICAgICAgICBmb2xkZXJPcHRpb25zLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW5cclxuICAgICAqL1xyXG4gICAgcnVuICgpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFZpZXdlciAgICBcclxuICAgICAgICB0aGlzLl92aWV3ZXIgPSBuZXcgQ2FtZXJhVmlld2VyKCdDYW1lcmFWaWV3ZXInLCAndmlld2VyQ2FudmFzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVUkgQ29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVWaWV3ZXJDb250cm9scygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgYXBwID0gbmV3IEFwcDtcclxuYXBwLnJ1bigpO1xyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgIGZyb20gJ0RlcHRoQnVmZmVyRmFjdG9yeSdcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIEhUTUxMb2dnZXJ9ICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7TWF0aExpYnJhcnl9ICAgICAgICAgICAgZnJvbSAnTWF0aCdcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1VuaXRUZXN0c30gICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogRGVwdGhCdWZmZXJUZXN0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGVwdGhCdWZmZXJUZXN0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW5cclxuICAgICAqL1xyXG4gICAgbWFpbiAoKSB7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBkZXB0aEJ1ZmZlclRlc3QgPSBuZXcgRGVwdGhCdWZmZXJUZXN0KCk7XHJcbmRlcHRoQnVmZmVyVGVzdC5tYWluKCk7XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgIGZyb20gJ1RyYWNrYmFsbENvbnRyb2xzJ1xyXG5pbXBvcnQge1VuaXRUZXN0c30gICAgICAgICAgICAgIGZyb20gJ1VuaXRUZXN0cydcclxuXHJcbmxldCBsb2dnZXIgPSBuZXcgSFRNTExvZ2dlcigpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBXaWRnZXRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBXaWRnZXQge1xyXG4gICAgXHJcbiAgICBuYW1lICA6IHN0cmluZztcclxuICAgIHByaWNlIDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgOiBzdHJpbmcsIHByaWNlIDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSAgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMucHJpY2UgPSBwcmljZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE9wZXJhdGVcclxuICAgICAqL1xyXG4gICAgb3BlcmF0ZSAoKSB7XHJcbiAgICAgICAgbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGAke3RoaXMubmFtZX0gb3BlcmF0aW5nLi4uLmApOyAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogU3VwZXJXaWRnZXRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb2xvcldpZGdldCBleHRlbmRzIFdpZGdldCB7XHJcblxyXG4gICAgY29sb3IgOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJpY2UgOiBudW1iZXIsIGNvbG9yIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHN1cGVyIChuYW1lLCBwcmljZSk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR3JhbmRQYXJlbnQge1xyXG5cclxuICAgIGdyYW5kcGFyZW50UHJvcGVydHkgIDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFuZHBhcmVudFByb3BlcnR5ICA9IGdyYW5kcGFyZW50UHJvcGVydHkgO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyZW50IGV4dGVuZHMgR3JhbmRQYXJlbnR7XHJcbiAgICBcclxuICAgIHBhcmVudFByb3BlcnR5IDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmcsIHBhcmVudFByb3BlcnR5IDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKGdyYW5kcGFyZW50UHJvcGVydHkpO1xyXG4gICAgICAgIHRoaXMucGFyZW50UHJvcGVydHkgPSBwYXJlbnRQcm9wZXJ0eTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoaWxkIGV4dGVuZHMgUGFyZW50e1xyXG4gICAgXHJcbiAgICBjaGlsZFByb3BlcnR5IDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoZ3JhbmRwYXJlbnRQcm9wZXJ0eSA6IHN0cmluZywgcGFyZW50UHJvcGVydHkgOiBzdHJpbmcsIGNoaWxkUHJvcGVydHkgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoZ3JhbmRwYXJlbnRQcm9wZXJ0eSwgcGFyZW50UHJvcGVydHkpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRQcm9wZXJ0eSA9IGNoaWxkUHJvcGVydHk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogSW5oZXJpdGFuY2VcclxuICovXHJcbmV4cG9ydCBjbGFzcyBJbmhlcml0YW5jZVRlc3Qge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBtYWluICgpIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgd2lkZ2V0ID0gbmV3IFdpZGdldCAoJ1dpZGdldCcsIDEuMCk7XHJcbiAgICAgICAgd2lkZ2V0Lm9wZXJhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbG9yV2lkZ2V0ID0gbmV3IENvbG9yV2lkZ2V0ICgnQ29sb3JXaWRnZXQnLCAxLjAsICdyZWQnKTtcclxuICAgICAgICBjb2xvcldpZGdldC5vcGVyYXRlKCk7XHJcblxyXG4gICAgICAgIGxldCBjaGlsZCA9IG5ldyBDaGlsZCgnR2FHYScsICdEYWQnLCAnU3RldmUnKTsgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBpbmhlcml0YW5jZSA9IG5ldyBJbmhlcml0YW5jZVRlc3Q7XHJcbmluaGVyaXRhbmNlLm1haW4oKTtcclxuIl19

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
            var timerTag = Services_1.Services.timer.mark('BoundingBox');
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
            // remove existing
            var existingCameraHelper = scene.getObjectByName(ObjectNames.CameraHelper);
            if (existingCameraHelper)
                scene.remove(existingCameraHelper);
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
define("Viewer/Camera", ["require", "exports", "three", "Viewer/Graphics", "System/Services"], function (require, exports, THREE, Graphics_1, Services_2) {
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
            var timerTag = Services_2.Services.timer.mark('Camera.getFitViewCamera');
            var camera = cameraTemplate.clone(true);
            var boundingBoxWorld = Camera.getDefaultBoundingBox(model);
            var cameraMatrixWorld = camera.matrixWorld;
            var cameraMatrixWorldInverse = camera.matrixWorldInverse;
            // Find camera position in View coordinates...
            var boundingBoxView = Graphics_1.Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);
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
            Services_2.Services.timer.logElapsedTime(timerTag);
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
            var timerTag = Services_2.Services.timer.mark('Camera.getStandardView');
            var camera = Camera.getDefaultCamera(viewAspect);
            var boundingBox = Graphics_1.Graphics.getBoundingBoxFromObject(model);
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
            Services_2.Services.timer.logElapsedTime(timerTag);
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
define("DepthBuffer/DepthBuffer", ["require", "exports", "chai", "three", "Viewer/Camera", "System/Services"], function (require, exports, chai_1, THREE, Camera_1, Services_3) {
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
            this._logger = Services_3.Services.htmlLogger;
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
            var timerTag = Services_3.Services.timer.mark('DepthBuffer.mesh');
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
            Services_3.Services.timer.logElapsedTime(timerTag);
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
define("DepthBuffer/DepthBufferFactory", ["require", "exports", "three", "DepthBuffer/DepthBuffer", "Viewer/Graphics", "System/Services", "System/Tools"], function (require, exports, THREE, DepthBuffer_1, Graphics_2, Services_4, Tools_1) {
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
            this._logger = Services_4.Services.consoleLogger;
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
            var timerTag = Services_4.Services.timer.mark('DepthBufferFactory.createDepthBuffer');
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
            Services_4.Services.timer.logElapsedTime(timerTag);
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
            var boundingBoxView = Graphics_2.Graphics.getTransformedBoundingBox(this._model, cameraMatrixWorldInverse);
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
define("Viewer/CameraControls", ["require", "exports", "dat-gui", "Viewer/Camera", "Viewer/Graphics"], function (require, exports, dat, Camera_2, Graphics_3) {
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
        function CameraSettings(camera, fitView, addCwmeraHelper) {
            this.fitView = fitView;
            this.addCameraHelper = addCwmeraHelper;
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
        /**
         * Adds a camera visualization graphic to the scene.
         */
        CameraControls.prototype.addCameraHelper = function () {
            Graphics_3.Graphics.addCameraHelper(this._viewer.camera, this._viewer._scene, this._viewer.model);
        };
        //#endregion
        /**
         * Initialize the view settings that are controllable by the user
         */
        CameraControls.prototype.initializeControls = function () {
            var scope = this;
            this._cameraSettings = new CameraSettings(this._viewer.camera, this.fitView.bind(this), this.addCameraHelper.bind(this));
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
                Front: Camera_2.StandardView.Front,
                Back: Camera_2.StandardView.Back,
                Top: Camera_2.StandardView.Top,
                Isometric: Camera_2.StandardView.Isometric,
                Left: Camera_2.StandardView.Left,
                Right: Camera_2.StandardView.Right,
                Bottom: Camera_2.StandardView.Bottom
            };
            var controlStandardViews = cameraOptions.add(this._cameraSettings, 'standardView', viewOptions).name('Standard View').listen();
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
define("Viewer/Viewer", ["require", "exports", "three", "Viewer/Camera", "Viewer/CameraControls", "System/EventManager", "Viewer/Graphics", "System/Services", "Viewer/TrackballControls"], function (require, exports, THREE, Camera_3, CameraControls_1, EventManager_1, Graphics_4, Services_6, TrackballControls_1) {
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
            Graphics_4.Graphics.removeObjectChildren(this._root, false);
        };
        /**
         * Creates the root object in the scene
         */
        Viewer.prototype.createRoot = function () {
            this._root = new THREE.Object3D();
            this._root.name = Graphics_4.ObjectNames.Root;
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
            this._cameraControls.synchronizeCameraSettings(view);
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
define("Viewer/ModelViewer", ["require", "exports", "three", "DepthBuffer/DepthBufferFactory", "System/EventManager", "Viewer/ModelViewerControls", "Viewer/Viewer"], function (require, exports, THREE, DepthBufferFactory_1, EventManager_2, ModelViewerControls_1, Viewer_2) {
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
            // Services.consoleLogger.addInfoMessage('Relief generated');
        };
        return ModelViewer;
    }(Viewer_2.Viewer));
    exports.ModelViewer = ModelViewer;
});
define("ModelRelief", ["require", "exports", "Viewer/Camera", "System/EventManager", "ModelLoaders/Loader", "Viewer/MeshViewer", "Viewer/ModelViewer", "System/Services"], function (require, exports, Camera_4, EventManager_3, Loader_1, MeshViewer_1, ModelViewer_1, Services_8) {
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
            this._modelViewer.setCameraToStandardView(Camera_4.StandardView.Front);
            this._meshViewer.setCameraToStandardView(Camera_4.StandardView.Top);
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
            model.remove(model.getObjectByName(Graphics_7.ObjectNames.BoundingBox));
            model.remove(model.getObjectByName(Graphics_7.ObjectNames.BoundingBox));
            model.remove(model.getObjectByName(Graphics_7.ObjectNames.ModelClone));
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvU3lzdGVtL0xvZ2dlci50cyIsIlNjcmlwdHMvU3lzdGVtL1N0b3BXYXRjaC50cyIsIlNjcmlwdHMvU3lzdGVtL1NlcnZpY2VzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvR3JhcGhpY3MudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmEudHMiLCJTY3JpcHRzL1N5c3RlbS9NYXRoLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlci50cyIsIlNjcmlwdHMvU3lzdGVtL1Rvb2xzLnRzIiwiU2NyaXB0cy9EZXB0aEJ1ZmZlci9EZXB0aEJ1ZmZlckZhY3RvcnkudHMiLCJTY3JpcHRzL1N5c3RlbS9FdmVudE1hbmFnZXIudHMiLCJTY3JpcHRzL01vZGVsTG9hZGVycy9PQkpMb2FkZXIudHMiLCJTY3JpcHRzL1ZpZXdlci9DYW1lcmFDb250cm9scy50cyIsIlNjcmlwdHMvVmlld2VyL01hdGVyaWFscy50cyIsIlNjcmlwdHMvVmlld2VyL1RyYWNrYmFsbENvbnRyb2xzLnRzIiwiU2NyaXB0cy9WaWV3ZXIvVmlld2VyLnRzIiwiU2NyaXB0cy9Nb2RlbExvYWRlcnMvVGVzdE1vZGVsTG9hZGVyLnRzIiwiU2NyaXB0cy9Nb2RlbExvYWRlcnMvTG9hZGVyLnRzIiwiU2NyaXB0cy9WaWV3ZXIvTWVzaFZpZXdlci50cyIsIlNjcmlwdHMvVmlld2VyL01vZGVsVmlld2VyQ29udHJvbHMudHMiLCJTY3JpcHRzL1ZpZXdlci9Nb2RlbFZpZXdlci50cyIsIlNjcmlwdHMvTW9kZWxSZWxpZWYudHMiLCJTY3JpcHRzL1VuaXRUZXN0cy9Vbml0VGVzdHMudHMiLCJTY3JpcHRzL1dvcmtiZW5jaC9DYW1lcmFUZXN0LnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvRGVwdGhCdWZmZXJUZXN0LnRzIiwiU2NyaXB0cy9Xb3JrYmVuY2gvSW5oZXJpdGFuY2VUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsOEVBQThFO0lBQzlFLDZF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LENBQUMsQ0FBQztZQUM5RCxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0wsc0JBQUM7SUFBRCxDQXJCQSxBQXFCQyxJQUFBO0lBckJZLDBDQUFlO0lBdUI1QixJQUFJLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBQztJQUN0QyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoid3d3cm9vdC9qcy9tb2RlbHJlbGllZi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIExvZ2dpbmcgSW50ZXJmYWNlXHJcbiAqIERpYWdub3N0aWMgbG9nZ2luZ1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBMb2dnZXIge1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpO1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKTtcclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZyk7XHJcbiAgICBhZGRNZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKTtcclxuXHJcbiAgICBhZGRFbXB0eUxpbmUgKCk7XHJcblxyXG4gICAgY2xlYXJMb2coKTtcclxufVxyXG4gICAgICAgICBcclxuZW51bSBNZXNzYWdlQ2xhc3Mge1xyXG4gICAgRXJyb3IgICA9ICdsb2dFcnJvcicsXHJcbiAgICBXYXJuaW5nID0gJ2xvZ1dhcm5pbmcnLFxyXG4gICAgSW5mbyAgICA9ICdsb2dJbmZvJyxcclxuICAgIE5vbmUgICAgPSAnbG9nTm9uZSdcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnNvbGUgbG9nZ2luZ1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25zb2xlTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2Vye1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0IGEgZ2VuZXJhbCBtZXNzYWdlIGFuZCBhZGQgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlQ2xhc3MgTWVzc2FnZSBjbGFzcy5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZUVudHJ5IChtZXNzYWdlIDogc3RyaW5nLCBtZXNzYWdlQ2xhc3MgOiBNZXNzYWdlQ2xhc3MpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByZWZpeCA9ICdNUjogJztcclxuICAgICAgICBsZXQgbG9nTWVzc2FnZSA9IGAke3ByZWZpeH0ke21lc3NhZ2V9YDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlQ2xhc3MpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZUNsYXNzLkVycm9yOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuV2FybmluZzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuSW5mbzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhsb2dNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlQ2xhc3MuTm9uZTpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2UgRXJyb3IgbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UgKGVycm9yTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbnRyeShlcnJvck1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSB3YXJuaW5nTWVzc2FnZSBXYXJuaW5nIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KHdhcm5pbmdNZXNzYWdlLCBNZXNzYWdlQ2xhc3MuV2FybmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gaW5mb3JtYXRpb25hbCBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gaW5mb01lc3NhZ2UgSW5mb3JtYXRpb24gbWVzc2FnZSB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBhZGRJbmZvTWVzc2FnZSAoaW5mb01lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRW50cnkoaW5mb01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5JbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIEluZm9ybWF0aW9uIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBzdHlsZSBPcHRpb25hbCBzdHlsZS5cclxuICAgICAqL1xyXG4gICAgYWRkTWVzc2FnZSAobWVzc2FnZSA6IHN0cmluZywgc3R5bGU/IDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVudHJ5KG1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5Ob25lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gZW1wdHkgbGluZVxyXG4gICAgICovXHJcbiAgICBhZGRFbXB0eUxpbmUgKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbG9nIG91dHB1dFxyXG4gICAgICovXHJcbiAgICBjbGVhckxvZyAoKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBIVE1MIGxvZ2dpbmdcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSFRNTExvZ2dlciBpbXBsZW1lbnRzIExvZ2dlcntcclxuXHJcbiAgICByb290SWQgICAgICAgICAgIDogc3RyaW5nO1xyXG4gICAgcm9vdEVsZW1lbnRUYWcgICA6IHN0cmluZztcclxuICAgIHJvb3RFbGVtZW50ICAgICAgOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBtZXNzYWdlVGFnICAgICAgIDogc3RyaW5nO1xyXG4gICAgYmFzZU1lc3NhZ2VDbGFzcyA6IHN0cmluZ1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucm9vdElkICAgICAgICAgPSAnbG9nZ2VyUm9vdCdcclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50VGFnID0gJ3VsJztcclxuXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlVGFnICAgICAgID0gJ2xpJztcclxuICAgICAgICB0aGlzLmJhc2VNZXNzYWdlQ2xhc3MgPSAnbG9nTWVzc2FnZSc7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RoaXMucm9vdElkfWApO1xyXG4gICAgICAgIGlmICghdGhpcy5yb290RWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5yb290RWxlbWVudFRhZyk7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQuaWQgPSB0aGlzLnJvb3RJZDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJvb3RFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdCBhIGdlbmVyYWwgbWVzc2FnZSBhbmQgYXBwZW5kIHRvIHRoZSBsb2cgcm9vdC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdGV4dC5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlQ2xhc3MgQ1NTIGNsYXNzIHRvIGJlIGFkZGVkIHRvIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIGFkZE1lc3NhZ2VFbGVtZW50IChtZXNzYWdlIDogc3RyaW5nLCBtZXNzYWdlQ2xhc3M/IDogc3RyaW5nKSA6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbWVzc2FnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMubWVzc2FnZVRhZyk7XHJcbiAgICAgICAgbWVzc2FnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG5cclxuICAgICAgICBtZXNzYWdlRWxlbWVudC5jbGFzc05hbWUgICA9IGAke3RoaXMuYmFzZU1lc3NhZ2VDbGFzc30gJHttZXNzYWdlQ2xhc3MgPyBtZXNzYWdlQ2xhc3MgOiAnJ31gOztcclxuXHJcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBlcnJvciBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlIEVycm9yIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkRXJyb3JNZXNzYWdlIChlcnJvck1lc3NhZ2UgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRWxlbWVudChlcnJvck1lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSB3YXJuaW5nTWVzc2FnZSBXYXJuaW5nIG1lc3NhZ2UgdGV4dC5cclxuICAgICAqL1xyXG4gICAgYWRkV2FybmluZ01lc3NhZ2UgKHdhcm5pbmdNZXNzYWdlIDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUVsZW1lbnQod2FybmluZ01lc3NhZ2UsIE1lc3NhZ2VDbGFzcy5XYXJuaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2UgdG8gdGhlIGxvZy5cclxuICAgICAqIEBwYXJhbSBpbmZvTWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFkZEluZm9NZXNzYWdlIChpbmZvTWVzc2FnZSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VFbGVtZW50KGluZm9NZXNzYWdlLCBNZXNzYWdlQ2xhc3MuSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBtZXNzYWdlIHRvIHRoZSBsb2cuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBJbmZvcm1hdGlvbiBtZXNzYWdlIHRleHQuXHJcbiAgICAgKiBAcGFyYW0gc3R5bGUgT3B0aW9uYWwgQ1NTIHN0eWxlLlxyXG4gICAgICovXHJcbiAgICBhZGRNZXNzYWdlIChtZXNzYWdlIDogc3RyaW5nLCBzdHlsZT8gOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc3NhZ2VFbGVtZW50ID0gdGhpcy5hZGRNZXNzYWdlRWxlbWVudChtZXNzYWdlKTtcclxuICAgICAgICBpZiAoc3R5bGUpXHJcbiAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gZW1wdHkgbGluZVxyXG4gICAgICovXHJcbiAgICBhZGRFbXB0eUxpbmUgKCkge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTQwNTQ3L2xpbmUtYnJlYWstaW5zaWRlLWEtbGlzdC1pdGVtLWdlbmVyYXRlcy1zcGFjZS1iZXR3ZWVuLXRoZS1saW5lc1xyXG4vLyAgICAgIHRoaXMuYWRkTWVzc2FnZSgnPGJyLz48YnIvPicpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlKCcuJyk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbG9nIG91dHB1dFxyXG4gICAgICovXHJcbiAgICBjbGVhckxvZyAoKSB7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM5NTUyMjkvcmVtb3ZlLWFsbC1jaGlsZC1lbGVtZW50cy1vZi1hLWRvbS1ub2RlLWluLWphdmFzY3JpcHRcclxuICAgICAgICB3aGlsZSAodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQge0xvZ2dlcn0gICAgICAgICAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gVGltZXIgcmVjb3JkLlxyXG4gKiBAaW50ZXJmYWNlIFRpbWVyRW50cnlcclxuICovXHJcbmludGVyZmFjZSBUaW1lckVudHJ5IHtcclxuXHJcbiAgICBzdGFydFRpbWUgOiBudW1iZXI7XHJcbiAgICBpbmRlbnQgICAgOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTdG9wV2F0Y2hcclxuICogR2VuZXJhbCBkZWJ1Z2dlciB0aW1lci5cclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU3RvcFdhdGNoIHtcclxuICAgIFxyXG4gICAgc3RhdGljIHByZWNpc2lvbiA6IG51bWJlciA9IDM7XHJcblxyXG4gICAgX2xvZ2dlciAgICAgICAgICAgIDogTG9nZ2VyO1xyXG4gICAgX25hbWUgICAgICAgICAgICAgIDogc3RyaW5nO1xyXG5cclxuICAgIF9ldmVudHMgICAgICAgICAgICA6IGFueTtcclxuICAgIF9iYXNlbGluZVRpbWUgICAgICA6IG51bWJlcjtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lck5hbWUgVGltZXIgaWRlbnRpZmllclxyXG4gICAgICogQHBhcmFtIHtMb2dnZXJ9IGxvZ2dlciBMb2dnZXJcclxuICAgICAqIE4uQi4gTG9nZ2VyIGlzIHBhc3NlZCBhcyBhIGNvbnN0cnVjdG9yIHBhcmFtZXRlciBiZWNhdXNlIFN0b3BXYXRjaCBhbmQgU2VydmljZS5jb25zb2xlTG9nZ2VyIGFyZSBzdGF0aWMgU2VydmljZSBwcm9wZXJ0aWVzLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0aW1lck5hbWUgOiBzdHJpbmcsIGxvZ2dlciA6IExvZ2dlcikge1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy5fbmFtZSAgID0gdGltZXJOYW1lO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cyAgPSB7fVxyXG4gICAgICAgIHRoaXMuX2Jhc2VsaW5lVGltZSA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyB0aGUgbXVtYmVyIG9mIHBlbmRpbmcgZXZlbnRzLlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgZXZlbnRDb3VudCAoKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9ldmVudHMpLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIHRoZSBjdXJyZW50IGluZGVudCBsZXZlbC5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IGluZGVudFByZWZpeCgpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICBsZXQgaW5kZW50OiBzdHJpbmcgPSAnICAgICc7XHJcbiAgICAgICAgcmV0dXJuIGluZGVudC5yZXBlYXQodGhpcy5ldmVudENvdW50KTtcclxuICAgIH1cclxuICAgICAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIFJlc2V0cyB0aGUgdGltZXIuXHJcbiAgICAgKi9cclxuICAgIG1hcmsoZXZlbnQgOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0TWlsbGlzZWNvbmRzIDogbnVtYmVyID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBsZXQgaW5kZW50UHJlZml4ICAgICAgOiBzdHJpbmcgPSB0aGlzLmluZGVudFByZWZpeDtcclxuICAgICAgICBsZXQgdGltZXJFbnRyeSAgICAgICAgOiBUaW1lckVudHJ5ID0geyBzdGFydFRpbWU6IHN0YXJ0TWlsbGlzZWNvbmRzLCBpbmRlbnQgOiBpbmRlbnRQcmVmaXh9O1xyXG4gICAgICAgIHRoaXMuX2V2ZW50c1tldmVudF0gPSB0aW1lckVudHJ5O1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgJHtpbmRlbnRQcmVmaXh9JHtldmVudH1gKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgdGhlIGVsYXBzdGVkIHRpbWUuXHJcbiAgICAgKi9cclxuICAgIGxvZ0VsYXBzZWRUaW1lKGV2ZW50IDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lckVsYXBzZWRUaW1lICAgOiBudW1iZXIgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIGxldCBldmVudEVsYXBzZWRUaW1lICAgOiBudW1iZXIgPSAodGltZXJFbGFwc2VkVGltZSAtICg8bnVtYmVyPiAodGhpcy5fZXZlbnRzW2V2ZW50XS5zdGFydFRpbWUpKSkgLyAxMDAwO1xyXG4gICAgICAgIGxldCBlbGFwc2VkVGltZU1lc3NhZ2UgOiBzdHJpbmcgPSBldmVudEVsYXBzZWRUaW1lLnRvRml4ZWQoU3RvcFdhdGNoLnByZWNpc2lvbik7XHJcbiAgICAgICAgbGV0IGluZGVudFByZWZpeCAgICAgICA6IHN0cmluZyA9IHRoaXMuX2V2ZW50c1tldmVudF0uaW5kZW50O1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYCR7aW5kZW50UHJlZml4fSR7ZXZlbnR9IDogJHtlbGFwc2VkVGltZU1lc3NhZ2V9IHNlY2ApO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgZXZlbnQgZnJvbSBsb2dcclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50XTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyLCBIVE1MTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge1N0b3BXYXRjaH0gICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1N0b3BXYXRjaCdcclxuLyoqXHJcbiAqIFNlcnZpY2VzXHJcbiAqIEdlbmVyYWwgcnVudGltZSBzdXBwb3J0XHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VzIHtcclxuXHJcbiAgICBzdGF0aWMgY29uc29sZUxvZ2dlciA6IENvbnNvbGVMb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcigpO1xyXG4gICAgc3RhdGljIGh0bWxMb2dnZXIgICAgOiBIVE1MTG9nZ2VyICAgID0gbmV3IEhUTUxMb2dnZXIoKTtcclxuICAgIHN0YXRpYyB0aW1lciAgICAgICAgIDogU3RvcFdhdGNoICAgICA9IG5ldyBTdG9wV2F0Y2goJ01hc3RlcicsIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIpO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNb2RlbFJlbGllZn0gICAgICAgICAgICBmcm9tICdNb2RlbFJlbGllZidcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuXHJcbmV4cG9ydCBlbnVtIE9iamVjdE5hbWVzIHtcclxuXHJcbiAgICBSb290ICAgICAgICAgID0gICdSb290JyxcclxuXHJcbiAgICBCb3VuZGluZ0JveCAgID0gJ0JvdW5kaW5nIEJveCcsXHJcbiAgICBCb3ggICAgICAgICAgID0gJ0JveCcsXHJcbiAgICBDYW1lcmFIZWxwZXIgID0gJ0NhbWVyYUhlbHBlcicsXHJcbiAgICBNb2RlbENsb25lICAgID0gJ01vZGVsIENsb25lJyxcclxuICAgIFBsYW5lICAgICAgICAgPSAnUGxhbmUnLFxyXG4gICAgU3BoZXJlICAgICAgICA9ICdTcGhlcmUnLFxyXG4gICAgVHJpYWQgICAgICAgICA9ICdUcmlhZCdcclxufVxyXG5cclxuLyoqXHJcbiAqICBHZW5lcmFsIFRIUkVFLmpzL1dlYkdMIHN1cHBvcnQgcm91dGluZXNcclxuICogIEdyYXBoaWNzIExpYnJhcnlcclxuICogIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEdyYXBoaWNzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBHZW9tZXRyeVxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRHZW9tZXRyeVxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbiBvYmplY3QgYW5kIGFsbCBjaGlsZHJlbiBmcm9tIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgU2NlbmUgaG9sZGluZyBvYmplY3QgdG8gYmUgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSByb290T2JqZWN0IFBhcmVudCBvYmplY3QgKHBvc3NpYmx5IHdpdGggY2hpbGRyZW4pLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVtb3ZlT2JqZWN0Q2hpbGRyZW4ocm9vdE9iamVjdCA6IFRIUkVFLk9iamVjdDNELCByZW1vdmVSb290IDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBpZiAoIXJvb3RPYmplY3QpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGxvZ2dlciAgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG4gICAgICAgIGxldCByZW1vdmVyID0gZnVuY3Rpb24gKG9iamVjdDNkKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob2JqZWN0M2QgPT09IHJvb3RPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gbG9nZ2VyLmFkZEluZm9NZXNzYWdlICgnUmVtb3Zpbmc6ICcgKyBvYmplY3QzZC5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCdnZW9tZXRyeScpKSB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QzZC5nZW9tZXRyeS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvYmplY3QzZC5oYXNPd25Qcm9wZXJ0eSgnbWF0ZXJpYWwnKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IG9iamVjdDNkLm1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGVyaWFsLmhhc093blByb3BlcnR5KCdtYXRlcmlhbHMnKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWxzID0gbWF0ZXJpYWwubWF0ZXJpYWxzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlNYXRlcmlhbCBpbiBtYXRlcmlhbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGVyaWFscy5oYXNPd25Qcm9wZXJ0eShpTWF0ZXJpYWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHNbaU1hdGVyaWFsXS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iamVjdDNkLmhhc093blByb3BlcnR5KCd0ZXh0dXJlJykpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDNkLnRleHR1cmUuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcm9vdE9iamVjdC50cmF2ZXJzZShyZW1vdmVyKTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHJvb3QgY2hpbGRyZW4gZnJvbSByb290IChiYWNrd2FyZHMhKVxyXG4gICAgICAgIGZvciAobGV0IGlDaGlsZCA6IG51bWJlciA9IChyb290T2JqZWN0LmNoaWxkcmVuLmxlbmd0aCAtIDEpOyBpQ2hpbGQgPj0gMDsgaUNoaWxkLS0pIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA6IFRIUkVFLk9iamVjdDNEID0gcm9vdE9iamVjdC5jaGlsZHJlbltpQ2hpbGRdO1xyXG4gICAgICAgICAgICByb290T2JqZWN0LnJlbW92ZSAoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlbW92ZVJvb3QgJiYgcm9vdE9iamVjdC5wYXJlbnQpXHJcbiAgICAgICAgICAgIHJvb3RPYmplY3QucGFyZW50LnJlbW92ZShyb290T2JqZWN0KTtcclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9uZSBhbmQgdHJhbnNmb3JtIGFuIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBvYmplY3QgT2JqZWN0IHRvIGNsb25lIGFuZCB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0gbWF0cml4IFRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNsb25lQW5kVHJhbnNmb3JtT2JqZWN0IChvYmplY3QgOiBUSFJFRS5PYmplY3QzRCwgbWF0cml4IDogVEhSRUUuTWF0cml4NCkgOiBUSFJFRS5PYmplY3QzRCB7XHJcblxyXG4gICAgICAgIGxldCBtZXRob2RUYWcgOiBzdHJpbmcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdjbG9uZUFuZFRyYW5zZm9ybU9iamVjdCcpO1xyXG5cclxuICAgICAgICAvLyBjbG9uZSBvYmplY3QgKGFuZCBnZW9tZXRyeSEpXHJcbiAgICAgICAgbGV0IGNsb25lVGFnOiBzdHJpbmcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdjbG9uZScpO1xyXG4gICAgICAgIGxldCBvYmplY3RDbG9uZSA6IFRIUkVFLk9iamVjdDNEID0gb2JqZWN0LmNsb25lKCk7XHJcbiAgICAgICAgb2JqZWN0Q2xvbmUudHJhdmVyc2Uob2JqZWN0ID0+IHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mKFRIUkVFLk1lc2gpKVxyXG4gICAgICAgICAgICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5LmNsb25lKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUoY2xvbmVUYWcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE4uQi4gSW1wb3J0YW50ISBUaGUgcG9zdGlvbiwgcm90YXRpb24gKHF1YXRlcm5pb24pIGFuZCBzY2FsZSBhcmUgY29ycmVjdCBidXQgdGhlIG1hdHJpeCBoYXMgbm90IGJlZW4gdXBkYXRlZC5cclxuICAgICAgICAvLyBUSFJFRS5qcyB1cGRhdGVzIHRoZSBtYXRyaXggaW4gdGhlIHJlbmRlcigpIGxvb3AuXHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybVRhZzogc3RyaW5nID0gU2VydmljZXMudGltZXIubWFyaygndHJhbnNmb3JtJyk7XHJcbiAgICAgICAgb2JqZWN0Q2xvbmUudXBkYXRlTWF0cml4V29ybGQodHJ1ZSk7ICAgICBcclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtXHJcbiAgICAgICAgb2JqZWN0Q2xvbmUuYXBwbHlNYXRyaXgobWF0cml4KTtcclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0cmFuc2Zvcm1UYWcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKG1ldGhvZFRhZyk7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdENsb25lO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBib3VuZGluZyBib3ggb2YgYSB0cmFuc2Zvcm1lZCBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0IE9iamVjdCB0byB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0gbWF0cml4IFRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldFRyYW5zZm9ybWVkQm91bmRpbmdCb3gob2JqZWN0OiBUSFJFRS5PYmplY3QzRCwgbWF0cml4OiBUSFJFRS5NYXRyaXg0KTogVEhSRUUuQm94MyB7XHJcblxyXG4gICAgICAgIGxldCBtZXRob2RUYWc6IHN0cmluZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ2dldFRyYW5zZm9ybWVkQm91bmRpbmdCb3gnKTtcclxuXHJcbiAgICAgICAgb2JqZWN0LnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpO1xyXG4gICAgICAgIG9iamVjdC5hcHBseU1hdHJpeChtYXRyaXgpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveDogVEhSRUUuQm94MyA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdChvYmplY3QpO1xyXG5cclxuICAgICAgICAvLyByZXN0b3JlIG9iamVjdFxyXG4gICAgICAgIGxldCBtYXRyaXhJZGVudGl0eSA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcbiAgICAgICAgbGV0IG1hdHJpeEludmVyc2UgPSBtYXRyaXhJZGVudGl0eS5nZXRJbnZlcnNlKG1hdHJpeCwgdHJ1ZSk7XHJcbiAgICAgICAgb2JqZWN0LmFwcGx5TWF0cml4KG1hdHJpeEludmVyc2UpO1xyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZShtZXRob2RUYWcpO1xyXG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBMb2NhdGlvbiBvZiBib3VuZGluZyBib3guXHJcbiAgICAgKiBAcGFyYW0gbWVzaCBNZXNoIGZyb20gd2hpY2ggdG8gY3JlYXRlIGJvdW5kaW5nIGJveC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBNYXRlcmlhbCBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICogQCByZXR1cm5zIE1lc2ggb2YgdGhlIGJvdW5kaW5nIGJveC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21HZW9tZXRyeShwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIGdlb21ldHJ5IDogVEhSRUUuR2VvbWV0cnksIG1hdGVyaWFsIDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaHtcclxuXHJcbiAgICAgICAgdmFyIGJvdW5kaW5nQm94ICAgICA6IFRIUkVFLkJveDMsXHJcbiAgICAgICAgICAgIHdpZHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBkZXB0aCAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGJveE1lc2ggICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgICAgIGJvdW5kaW5nQm94ID0gZ2VvbWV0cnkuYm91bmRpbmdCb3g7XHJcblxyXG4gICAgICAgIGJveE1lc2ggPSB0aGlzLmNyZWF0ZUJvdW5kaW5nQm94TWVzaEZyb21Cb3VuZGluZ0JveCAocG9zaXRpb24sIGJvdW5kaW5nQm94LCBtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBib3hNZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIGJveC5cclxuICAgICAqIEBwYXJhbSBib3ggR2VvbWV0cnkgQm94IGZyb20gd2hpY2ggdG8gY3JlYXRlIGJveCBtZXNoLlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE1hdGVyaWFsIG9mIHRoZSBib3guXHJcbiAgICAgKiBAIHJldHVybnMgTWVzaCBvZiB0aGUgYm94LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlQm91bmRpbmdCb3hNZXNoRnJvbUJvdW5kaW5nQm94KHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgYm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzLCBtYXRlcmlhbCA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggICAgICAgICAgIDogbnVtYmVyLFxyXG4gICAgICAgICAgICBoZWlnaHQgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGRlcHRoICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgYm94TWVzaCAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgd2lkdGggID0gYm91bmRpbmdCb3gubWF4LnggLSBib3VuZGluZ0JveC5taW4ueDtcclxuICAgICAgICBoZWlnaHQgPSBib3VuZGluZ0JveC5tYXgueSAtIGJvdW5kaW5nQm94Lm1pbi55O1xyXG4gICAgICAgIGRlcHRoICA9IGJvdW5kaW5nQm94Lm1heC56IC0gYm91bmRpbmdCb3gubWluLno7XHJcblxyXG4gICAgICAgIGJveE1lc2ggPSB0aGlzLmNyZWF0ZUJveE1lc2ggKHBvc2l0aW9uLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgbWF0ZXJpYWwpO1xyXG4gICAgICAgIGJveE1lc2gubmFtZSA9IE9iamVjdE5hbWVzLkJvdW5kaW5nQm94O1xyXG5cclxuICAgICAgICByZXR1cm4gYm94TWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGV4dGVuZHMgb2YgYW4gb2JqZWN0IG9wdGlvbmFsbHkgaW5jbHVkaW5nIGFsbCBjaGlsZHJlbi5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEJvdW5kaW5nQm94RnJvbU9iamVjdChyb290T2JqZWN0IDogVEhSRUUuT2JqZWN0M0QpIDogVEhSRUUuQm94MyB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ0JvdW5kaW5nQm94Jyk7ICAgICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTQ5Mjg1Ny9hbnktd2F5LXRvLWdldC1hLWJvdW5kaW5nLWJveC1mcm9tLWEtdGhyZWUtanMtb2JqZWN0M2RcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggOiBUSFJFRS5Cb3gzID0gbmV3IFRIUkVFLkJveDMoKTtcclxuICAgICAgICBib3VuZGluZ0JveCA9IGJvdW5kaW5nQm94LnNldEZyb21PYmplY3Qocm9vdE9iamVjdCk7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTtcclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGJveCBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIHRoZSBib3guXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGguXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodC5cclxuICAgICAqIEBwYXJhbSBkZXB0aCBEZXB0aC5cclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBPcHRpb25hbCBtYXRlcmlhbC5cclxuICAgICAqIEByZXR1cm5zIEJveCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlQm94TWVzaChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOiBudW1iZXIsIGRlcHRoIDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuXHJcbiAgICAgICAgdmFyIFxyXG4gICAgICAgICAgICBib3hHZW9tZXRyeSAgOiBUSFJFRS5Cb3hHZW9tZXRyeSxcclxuICAgICAgICAgICAgYm94TWF0ZXJpYWwgIDogVEhSRUUuTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIGJveCAgICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIGJveEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHdpZHRoLCBoZWlnaHQsIGRlcHRoKTtcclxuICAgICAgICBib3hHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAgICAgYm94TWF0ZXJpYWwgPSBtYXRlcmlhbCB8fCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMGZmLCBvcGFjaXR5OiAxLjB9ICk7XHJcblxyXG4gICAgICAgIGJveCA9IG5ldyBUSFJFRS5NZXNoKCBib3hHZW9tZXRyeSwgYm94TWF0ZXJpYWwpO1xyXG4gICAgICAgIGJveC5uYW1lID0gT2JqZWN0TmFtZXMuQm94O1xyXG4gICAgICAgIGJveC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJveDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBwbGFuZSBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIExvY2F0aW9uIG9mIHRoZSBwbGFuZS5cclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIE9wdGlvbmFsIG1hdGVyaWFsLlxyXG4gICAgICogQHJldHVybnMgUGxhbmUgbWVzaC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVBsYW5lTWVzaChwb3NpdGlvbiA6IFRIUkVFLlZlY3RvcjMsIHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOiBudW1iZXIsIG1hdGVyaWFsPyA6IFRIUkVFLk1hdGVyaWFsKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBcclxuICAgICAgICAgICAgcGxhbmVHZW9tZXRyeSAgOiBUSFJFRS5QbGFuZUdlb21ldHJ5LFxyXG4gICAgICAgICAgICBwbGFuZU1hdGVyaWFsICA6IFRIUkVFLk1hdGVyaWFsLFxyXG4gICAgICAgICAgICBwbGFuZSAgICAgICAgICA6IFRIUkVFLk1lc2g7XHJcblxyXG4gICAgICAgIHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSh3aWR0aCwgaGVpZ2h0KTsgICAgICAgXHJcbiAgICAgICAgcGxhbmVNYXRlcmlhbCA9IG1hdGVyaWFsIHx8IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwZmYsIG9wYWNpdHk6IDEuMH0gKTtcclxuXHJcbiAgICAgICAgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChwbGFuZUdlb21ldHJ5LCBwbGFuZU1hdGVyaWFsKTtcclxuICAgICAgICBwbGFuZS5uYW1lID0gT2JqZWN0TmFtZXMuUGxhbmU7XHJcbiAgICAgICAgcGxhbmUucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBwbGFuZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHNwaGVyZSBtZXNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIE9yaWdpbiBvZiB0aGUgc3BoZXJlLlxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBSYWRpdXMuXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVTcGhlcmVNZXNoKHBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgcmFkaXVzIDogbnVtYmVyLCBtYXRlcmlhbD8gOiBUSFJFRS5NYXRlcmlhbCkgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICB2YXIgc3BoZXJlR2VvbWV0cnkgIDogVEhSRUUuU3BoZXJlR2VvbWV0cnksXHJcbiAgICAgICAgICAgIHNlZ21lbnRDb3VudCAgICA6IG51bWJlciA9IDMyLFxyXG4gICAgICAgICAgICBzcGhlcmVNYXRlcmlhbCAgOiBUSFJFRS5NYXRlcmlhbCxcclxuICAgICAgICAgICAgc3BoZXJlICAgICAgICAgIDogVEhSRUUuTWVzaDtcclxuXHJcbiAgICAgICAgc3BoZXJlR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkocmFkaXVzLCBzZWdtZW50Q291bnQsIHNlZ21lbnRDb3VudCk7XHJcbiAgICAgICAgc3BoZXJlR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcblxyXG4gICAgICAgIHNwaGVyZU1hdGVyaWFsID0gbWF0ZXJpYWwgfHwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4ZmYwMDAwLCBvcGFjaXR5OiAxLjB9ICk7XHJcblxyXG4gICAgICAgIHNwaGVyZSA9IG5ldyBUSFJFRS5NZXNoKCBzcGhlcmVHZW9tZXRyeSwgc3BoZXJlTWF0ZXJpYWwgKTtcclxuICAgICAgICBzcGhlcmUubmFtZSA9IE9iamVjdE5hbWVzLlNwaGVyZTtcclxuICAgICAgICBzcGhlcmUucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBzcGhlcmU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGxpbmUgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0YXJ0UG9zaXRpb24gU3RhcnQgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0gZW5kUG9zaXRpb24gRW5kIHBvaW50LlxyXG4gICAgICogQHBhcmFtIGNvbG9yIENvbG9yLlxyXG4gICAgICogQHJldHVybnMgTGluZSBlbGVtZW50LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlTGluZShzdGFydFBvc2l0aW9uIDogVEhSRUUuVmVjdG9yMywgZW5kUG9zaXRpb24gOiBUSFJFRS5WZWN0b3IzLCBjb2xvciA6IG51bWJlcikgOiBUSFJFRS5MaW5lIHtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgICAgICAgICAgICA6IFRIUkVFLkxpbmUsXHJcbiAgICAgICAgICAgIGxpbmVHZW9tZXRyeSAgICA6IFRIUkVFLkdlb21ldHJ5LFxyXG4gICAgICAgICAgICBtYXRlcmlhbCAgICAgICAgOiBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgbGluZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICAgICAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2ggKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IGNvbG9yfSApO1xyXG4gICAgICAgIGxpbmUgPSBuZXcgVEhSRUUuTGluZShsaW5lR2VvbWV0cnksIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXhlcyB0cmlhZC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBPcmlnaW4gb2YgdGhlIHRyaWFkLlxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBMZW5ndGggb2YgdGhlIGNvb3JkaW5hdGUgYXJyb3cuXHJcbiAgICAgKiBAcGFyYW0gaGVhZExlbmd0aCBMZW5ndGggb2YgdGhlIGFycm93IGhlYWQuXHJcbiAgICAgKiBAcGFyYW0gaGVhZFdpZHRoIFdpZHRoIG9mIHRoZSBhcnJvdyBoZWFkLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlV29ybGRBeGVzVHJpYWQocG9zaXRpb24/IDogVEhSRUUuVmVjdG9yMywgbGVuZ3RoPyA6IG51bWJlciwgaGVhZExlbmd0aD8gOiBudW1iZXIsIGhlYWRXaWR0aD8gOiBudW1iZXIpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgdHJpYWRHcm91cCAgICAgIDogVEhSRUUuT2JqZWN0M0QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKSxcclxuICAgICAgICAgICAgYXJyb3dQb3NpdGlvbiAgIDogVEhSRUUuVmVjdG9yMyAgPSBwb3NpdGlvbiB8fG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgICAgICAgIGFycm93TGVuZ3RoICAgICA6IG51bWJlciA9IGxlbmd0aCAgICAgfHwgMTUsXHJcbiAgICAgICAgICAgIGFycm93SGVhZExlbmd0aCA6IG51bWJlciA9IGhlYWRMZW5ndGggfHwgMSxcclxuICAgICAgICAgICAgYXJyb3dIZWFkV2lkdGggIDogbnVtYmVyID0gaGVhZFdpZHRoICB8fCAxO1xyXG5cclxuICAgICAgICB0cmlhZEdyb3VwLmFkZChuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMCksIGFycm93UG9zaXRpb24sIGFycm93TGVuZ3RoLCAweGZmMDAwMCwgYXJyb3dIZWFkTGVuZ3RoLCBhcnJvd0hlYWRXaWR0aCkpO1xyXG4gICAgICAgIHRyaWFkR3JvdXAuYWRkKG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgYXJyb3dQb3NpdGlvbiwgYXJyb3dMZW5ndGgsIDB4MDBmZjAwLCBhcnJvd0hlYWRMZW5ndGgsIGFycm93SGVhZFdpZHRoKSk7XHJcbiAgICAgICAgdHJpYWRHcm91cC5hZGQobmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBhcnJvd1Bvc2l0aW9uLCBhcnJvd0xlbmd0aCwgMHgwMDAwZmYsIGFycm93SGVhZExlbmd0aCwgYXJyb3dIZWFkV2lkdGgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyaWFkR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGF4ZXMgZ3JpZC5cclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAgT3JpZ2luIG9mIHRoZSBheGVzIGdyaWQuXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSBTaXplIG9mIHRoZSBncmlkLlxyXG4gICAgICogQHBhcmFtIHN0ZXAgR3JpZCBsaW5lIGludGVydmFscy5cclxuICAgICAqIEByZXR1cm5zIEdyaWQgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlV29ybGRBeGVzR3JpZChwb3NpdGlvbj8gOiBUSFJFRS5WZWN0b3IzLCBzaXplPyA6IG51bWJlciwgc3RlcD8gOiBudW1iZXIpIDogVEhSRUUuT2JqZWN0M0Qge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB2YXIgZ3JpZEdyb3VwICAgICAgIDogVEhSRUUuT2JqZWN0M0QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKSxcclxuICAgICAgICAgICAgZ3JpZFBvc2l0aW9uICAgIDogVEhSRUUuVmVjdG9yMyAgPSBwb3NpdGlvbiB8fG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgICAgICAgIGdyaWRTaXplICAgICAgICA6IG51bWJlciA9IHNpemUgfHwgMTAsXHJcbiAgICAgICAgICAgIGdyaWRTdGVwICAgICAgICA6IG51bWJlciA9IHN0ZXAgfHwgMSxcclxuICAgICAgICAgICAgY29sb3JDZW50ZXJsaW5lIDogbnVtYmVyID0gIDB4ZmYwMDAwMDAsXHJcbiAgICAgICAgICAgIHh5R3JpZCAgICAgICAgICAgOiBUSFJFRS5HcmlkSGVscGVyLFxyXG4gICAgICAgICAgICB5ekdyaWQgICAgICAgICAgIDogVEhSRUUuR3JpZEhlbHBlcixcclxuICAgICAgICAgICAgenhHcmlkICAgICAgICAgICA6IFRIUkVFLkdyaWRIZWxwZXI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHh5R3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKGdyaWRTaXplLCBncmlkU3RlcCk7XHJcbiAgICAgICAgeHlHcmlkLnNldENvbG9ycyhjb2xvckNlbnRlcmxpbmUsIDB4ZmYwMDAwKTtcclxuICAgICAgICB4eUdyaWQucG9zaXRpb24uY29weShncmlkUG9zaXRpb24uY2xvbmUoKSk7XHJcbiAgICAgICAgeHlHcmlkLnJvdGF0ZU9uQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSwgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi54ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIHh5R3JpZC5wb3NpdGlvbi55ICs9IGdyaWRTaXplO1xyXG4gICAgICAgIGdyaWRHcm91cC5hZGQoeHlHcmlkKTtcclxuXHJcbiAgICAgICAgeXpHcmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoZ3JpZFNpemUsIGdyaWRTdGVwKTtcclxuICAgICAgICB5ekdyaWQuc2V0Q29sb3JzKGNvbG9yQ2VudGVybGluZSwgMHgwMGZmMDApO1xyXG4gICAgICAgIHl6R3JpZC5wb3NpdGlvbi5jb3B5KGdyaWRQb3NpdGlvbi5jbG9uZSgpKTtcclxuICAgICAgICB5ekdyaWQucm90YXRlT25BeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLnkgKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgeXpHcmlkLnBvc2l0aW9uLnogKz0gZ3JpZFNpemU7XHJcbiAgICAgICAgZ3JpZEdyb3VwLmFkZCh5ekdyaWQpO1xyXG5cclxuICAgICAgICB6eEdyaWQgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcihncmlkU2l6ZSwgZ3JpZFN0ZXApO1xyXG4gICAgICAgIHp4R3JpZC5zZXRDb2xvcnMoY29sb3JDZW50ZXJsaW5lLCAweDAwMDBmZik7XHJcbiAgICAgICAgenhHcmlkLnBvc2l0aW9uLmNvcHkoZ3JpZFBvc2l0aW9uLmNsb25lKCkpO1xyXG4gICAgICAgIHp4R3JpZC5yb3RhdGVPbkF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24ueiArPSBncmlkU2l6ZTtcclxuICAgICAgICB6eEdyaWQucG9zaXRpb24ueCArPSBncmlkU2l6ZTtcclxuICAgICAgICBncmlkR3JvdXAuYWRkKHp4R3JpZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBncmlkR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIEFkZHMgYSBjYW1lcmEgaGVscGVyIHRvIGEgc2NlbmUgdG8gdmlzdWFsaXplIHRoZSBjYW1lcmEgcG9zaXRpb24uXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhIHRvIGNvbnN0cnVjdCBoZWxwZXIgKG1heSBiZSBudWxsKS5cclxuICAgICAgKi9cclxuICAgIHN0YXRpYyBhZGRDYW1lcmFIZWxwZXIgKGNhbWVyYSA6IFRIUkVFLkNhbWVyYSwgc2NlbmUgOiBUSFJFRS5TY2VuZSwgbW9kZWwgOiBUSFJFRS5Hcm91cCwgKSA6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmdcclxuICAgICAgICBsZXQgZXhpc3RpbmdDYW1lcmFIZWxwZXIgOiBUSFJFRS5Hcm91cCA9IHNjZW5lLmdldE9iamVjdEJ5TmFtZShPYmplY3ROYW1lcy5DYW1lcmFIZWxwZXIpO1xyXG4gICAgICAgIGlmIChleGlzdGluZ0NhbWVyYUhlbHBlcilcclxuICAgICAgICAgICAgc2NlbmUucmVtb3ZlKGV4aXN0aW5nQ2FtZXJhSGVscGVyKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYW1lcmEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gY2FtZXJhIHByb3BlcnRpZXNcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGQgICAgICAgIDogVEhSRUUuTWF0cml4NCA9IGNhbWVyYS5tYXRyaXhXb3JsZDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY29uc3RydWN0IHJvb3Qgb2JqZWN0IG9mIHRoZSBoZWxwZXJcclxuICAgICAgICBsZXQgY2FtZXJhSGVscGVyICA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIGNhbWVyYUhlbHBlci5uYW1lID0gT2JqZWN0TmFtZXMuQ2FtZXJhSGVscGVyOyAgICAgICBcclxuICAgICAgICBjYW1lcmFIZWxwZXIudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIG1vZGVsIGJvdW5kaW5nIGJveCAoVmlldyBjb29yZGluYXRlcylcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDAwMCwgd2lyZWZyYW1lOiB0cnVlLCB0cmFuc3BhcmVudDogZmFsc2UsIG9wYWNpdHk6IDAuMiB9KVxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveFZpZXc6IFRIUkVFLkJveDMgPSBHcmFwaGljcy5nZXRUcmFuc2Zvcm1lZEJvdW5kaW5nQm94KG1vZGVsLCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpOyAgICAgICAgXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94Vmlld01lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3goYm91bmRpbmdCb3hWaWV3LmdldENlbnRlcigpLCBib3VuZGluZ0JveFZpZXcsIGJvdW5kaW5nQm94TWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZE1lc2ggPSBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChib3VuZGluZ0JveFZpZXdNZXNoLCBjYW1lcmFNYXRyaXhXb3JsZCk7XHJcbiAgICAgICAgY2FtZXJhSGVscGVyLmFkZChib3VuZGluZ0JveFdvcmxkTWVzaCk7XHJcblxyXG4gICAgICAgIC8vIHBvc2l0aW9uXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChjYW1lcmEucG9zaXRpb24sIDMpO1xyXG4gICAgICAgIGNhbWVyYUhlbHBlci5hZGQocG9zaXRpb24pO1xyXG5cclxuICAgICAgICAvLyBjYW1lcmEgdGFyZ2V0IGxpbmVcclxuICAgICAgICBsZXQgdW5pdFRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIC0xKTtcclxuICAgICAgICB1bml0VGFyZ2V0LmFwcGx5UXVhdGVybmlvbihjYW1lcmEucXVhdGVybmlvbik7XHJcbiAgICAgICAgbGV0IHNjYWxlZFRhcmdldCA6IFRIUkVFLlZlY3RvcjM7XHJcbiAgICAgICAgc2NhbGVkVGFyZ2V0ID0gdW5pdFRhcmdldC5tdWx0aXBseVNjYWxhcigtYm91bmRpbmdCb3hWaWV3Lm1heC56KTtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0UG9pbnQgOiBUSFJFRS5WZWN0b3IzID0gY2FtZXJhLnBvc2l0aW9uO1xyXG4gICAgICAgIGxldCBlbmRQb2ludCAgIDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICAgICAgZW5kUG9pbnQuYWRkVmVjdG9ycyhzdGFydFBvaW50LCBzY2FsZWRUYXJnZXQpO1xyXG4gICAgICAgIGxldCB0YXJnZXRMaW5lIDogVEhSRUUuTGluZSA9IEdyYXBoaWNzLmNyZWF0ZUxpbmUoc3RhcnRQb2ludCwgZW5kUG9pbnQsIDB4MDBmZjAwKTtcclxuICAgICAgICBjYW1lcmFIZWxwZXIuYWRkKHRhcmdldExpbmUpO1xyXG5cclxuICAgICAgICBzY2VuZS5hZGQoY2FtZXJhSGVscGVyKTtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQWRkcyBhIGNvb3JkaW5hdGUgYXhpcyBoZWxwZXIgdG8gYSBzY2VuZSB0byB2aXN1YWxpemUgdGhlIHdvcmxkIGF4ZXMuXHJcbiAgICAgICogQHBhcmFtIHNjZW5lIFNjZW5lIHRvIGFubm90YXRlLlxyXG4gICAgICAqL1xyXG4gICAgc3RhdGljIGFkZEF4aXNIZWxwZXIgKHNjZW5lIDogVEhSRUUuU2NlbmUsIHNpemUgOiBudW1iZXIpIDogdm9pZHtcclxuXHJcbiAgICAgICAgbGV0IGF4aXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhpc0hlbHBlcihzaXplKTtcclxuICAgICAgICBheGlzSGVscGVyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHNjZW5lLmFkZChheGlzSGVscGVyKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gQ29vcmRpbmF0ZSBDb252ZXJzaW9uXHJcbiAgICAvKlxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIENvb3JkaW5hdGUgU3lzdGVtc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgRlJBTUVcdCAgICAgICAgICAgIEVYQU1QTEVcdFx0XHRcdFx0XHRcdFx0XHRcdFNQQUNFICAgICAgICAgICAgICAgICAgICAgIFVOSVRTICAgICAgICAgICAgICAgICAgICAgICBOT1RFU1xyXG5cclxuICAgIE1vZGVsICAgICAgICAgICAgICAgQ2F0YWxvZyBXZWJHTDogTW9kZWwsIEJhbmRFbGVtZW50IEJsb2NrICAgICBvYmplY3QgICAgICAgICAgICAgICAgICAgICAgbW0gICAgICAgICAgICAgICAgICAgICAgICAgIFJoaW5vIGRlZmluaXRpb25zXHJcbiAgICBXb3JsZCAgICAgICAgICAgICAgIERlc2lnbiBNb2RlbFx0XHRcdFx0XHRcdFx0XHR3b3JsZCAgICAgICAgICAgICAgICAgICAgICAgbW0gXHJcbiAgICBWaWV3ICAgICAgICAgICAgICAgIENhbWVyYSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldyAgICAgICAgICAgICAgICAgICAgICAgIG1tXHJcbiAgICBEZXZpY2UgICAgICAgICAgICAgIE5vcm1hbGl6ZWQgdmlld1x0XHRcdFx0XHRcdFx0ICAgIGRldmljZSAgICAgICAgICAgICAgICAgICAgICBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgIFNjcmVlbi5QYWdlICAgICAgICAgSFRNTCBwYWdlXHRcdFx0XHRcdFx0XHRcdFx0c2NyZWVuICAgICAgICAgICAgICAgICAgICAgIHB4ICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAgYXQgVG9wIExlZnQsICtZIGRvd24gICAgSFRNTCBwYWdlXHJcbiAgICBTY3JlZW4uQ2xpZW50ICAgICAgIEJyb3dzZXIgdmlldyBwb3J0IFx0XHRcdFx0XHRcdCAgICBzY3JlZW4gICAgICAgICAgICAgICAgICAgICAgcHggICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCBhdCBUb3AgTGVmdCwgK1kgZG93biAgICBicm93c2VyIHdpbmRvd1xyXG4gICAgU2NyZWVuLkNvbnRhaW5lciAgICBET00gY29udGFpbmVyXHRcdFx0XHRcdFx0XHRcdHNjcmVlbiAgICAgICAgICAgICAgICAgICAgICBweCAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwIGF0IFRvcCBMZWZ0LCArWSBkb3duICAgIEhUTUwgY2FudmFzXHJcblxyXG4gICAgTW91c2UgRXZlbnQgUHJvcGVydGllc1xyXG4gICAgaHR0cDovL3d3dy5qYWNrbG1vb3JlLmNvbS9ub3Rlcy9tb3VzZS1wb3NpdGlvbi9cclxuICAgICovXHJcbiAgICAgICAgXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFdvcmxkIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBET00gY29udGFpbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHdvcmxkQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5LCBjYW1lcmEgOiBUSFJFRS5DYW1lcmEpIDogVEhSRUUuVmVjdG9yMyB7XHJcblxyXG4gICAgICAgIHZhciB3b3JsZENvb3JkaW5hdGVzICAgIDogVEhSRUUuVmVjdG9yMyxcclxuICAgICAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMyRCA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBkZXZpY2VaICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gdGhpcy5kZXZpY2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICBkZXZpY2VaID0gKGNhbWVyYSBpbnN0YW5jZW9mIFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSA/IDAuNSA6IDEuMDtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczNEID0gbmV3IFRIUkVFLlZlY3RvcjMoZGV2aWNlQ29vcmRpbmF0ZXMyRC54LCBkZXZpY2VDb29yZGluYXRlczJELnksIGRldmljZVopO1xyXG5cclxuICAgICAgICB3b3JsZENvb3JkaW5hdGVzID0gZGV2aWNlQ29vcmRpbmF0ZXMzRC51bnByb2plY3QoY2FtZXJhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHdvcmxkQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy9cdFx0XHRWaWV3IENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB3b3JsZCBjb29yZGluYXRlcyB0byB2aWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciBXb3JsZCBjb29yZGluYXRlIHZlY3RvciB0byBjb252ZXJ0LlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcmV0dXJucyBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdmlld0Nvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNhbWVyYSA6IFRIUkVFLkNhbWVyYSkgOiBUSFJFRS5WZWN0b3IzIHtcclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLCAgXHJcbiAgICAgICAgICAgIHZpZXdDb29yZGluYXRlcyAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgdmlld0Nvb3JkaW5hdGVzID0gcG9zaXRpb24uYXBwbHlNYXRyaXg0KGNhbWVyYS5tYXRyaXhXb3JsZEludmVyc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlld0Nvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vXHRcdFx0RGV2aWNlIENvb3JkaW5hdGVzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgSlF1ZXJ5IGV2ZW50IHRvIG5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEByZXR1cm5zIE5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudCAoZXZlbnQgOiBKUXVlcnlFdmVudE9iamVjdCwgY29udGFpbmVyIDogSlF1ZXJ5KSA6IFRIUkVFLlZlY3RvcjIge1xyXG5cclxuICAgICAgICB2YXIgZGV2aWNlQ29vcmRpbmF0ZXMgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgcmF0aW9YLCAgcmF0aW9ZICAgICAgICAgICAgICA6IG51bWJlcixcclxuICAgICAgICAgICAgZGV2aWNlWCwgZGV2aWNlWSAgICAgICAgICAgICA6IG51bWJlcjtcclxuXHJcbiAgICAgICAgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMgPSB0aGlzLnNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbUpRRXZlbnQoZXZlbnQsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgcmF0aW9YID0gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXMueCAvIGNvbnRhaW5lci53aWR0aCgpO1xyXG4gICAgICAgIHJhdGlvWSA9IHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzLnkgLyBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGRldmljZVggPSArKChyYXRpb1ggKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZVkgPSAtKChyYXRpb1kgKiAyKSAtIDEpOyAgICAgICAgICAgICAgICAgLy8gWy0xLCAxXVxyXG4gICAgICAgIGRldmljZUNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlWCwgZGV2aWNlWSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZXZpY2VDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIGRldmljZSBjb29yZGluYXRlcyBbLTEsIDFdLlxyXG4gICAgICogQHBhcmFtIHZlY3RvciAgV29ybGQgY29vcmRpbmF0ZXMgdmVjdG9yLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBDYW1lcmEuXHJcbiAgICAgKiBAcHJldHVybnMgRGV2aWNlIGNvb3JpbmRhdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyAodmVjdG9yIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2lzc3Vlcy83OFxyXG4gICAgICAgIHZhciBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICA6IFRIUkVFLlZlY3RvcjMgPSB2ZWN0b3IuY2xvbmUoKSwgIFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIGRldmljZUNvb3JkaW5hdGVzM0QgICAgICAgIDogVEhSRUUuVmVjdG9yMztcclxuXHJcbiAgICAgICAgZGV2aWNlQ29vcmRpbmF0ZXMzRCA9IHBvc2l0aW9uLnByb2plY3QoY2FtZXJhKTtcclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlczJEID0gbmV3IFRIUkVFLlZlY3RvcjIoZGV2aWNlQ29vcmRpbmF0ZXMzRC54LCBkZXZpY2VDb29yZGluYXRlczNELnkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGV2aWNlQ29vcmRpbmF0ZXMyRDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAvL1x0XHRcdFNjcmVlbiBDb29yZGluYXRlc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLyoqXHJcbiAgICAgKiBQYWdlIGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgSlF1ZXJ5IGV2ZW50LlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIChwYWdlKSBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlblBhZ2VDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlblBhZ2VDb29yZGluYXRlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cclxuICAgICAgICBzY3JlZW5QYWdlQ29vcmRpbmF0ZXMueCA9IGV2ZW50LnBhZ2VYO1xyXG4gICAgICAgIHNjcmVlblBhZ2VDb29yZGluYXRlcy55ID0gZXZlbnQucGFnZVk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5QYWdlQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2xpZW50IGNvb3JkaW5hdGVzIGZyb20gYSBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSA8YnJvd3Nlcj4gdmlldyBwb3J0LiBJZiB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gc2Nyb2xsZWQgaXQgd2lsbFxyXG4gICAgICogYmUgZGlmZmVyZW50IHRoYW4gdGhlIHBhZ2UgY29vcmRpbmF0ZXMgd2hpY2ggYXJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGUgdG9wIGxlZnQgb2YgdGhlIDxlbnRpcmU+IEhUTUwgcGFnZSBkb2N1bWVudC5cclxuICAgICAqIGh0dHA6Ly93d3cuYmVubmFkZWwuY29tL2Jsb2cvMTg2OS1qcXVlcnktbW91c2UtZXZlbnRzLXBhZ2V4LXktdnMtY2xpZW50eC15Lmh0bVxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEByZXR1cm5zIFNjcmVlbiBjbGllbnQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5DbGllbnRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgIHNjcmVlbkNsaWVudENvb3JkaW5hdGVzLnkgPSBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ2xpZW50Q29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBKUXVlcnkgZXZlbnQgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBldmVudCBKUXVlcnkgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIERPTSBjb250YWluZXIuXHJcbiAgICAgKiBAcmV0dXJucyBTY3JlZW4gY29udGFpbmVyIGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0LCBjb250YWluZXIgOiBKUXVlcnkpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKCksXHJcbiAgICAgICAgICAgIGNvbnRhaW5lck9mZnNldCAgICAgICAgICAgIDogSlF1ZXJ5Q29vcmRpbmF0ZXMsXHJcbiAgICAgICAgICAgIHBhZ2VYLCBwYWdlWSAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBjb250YWluZXJPZmZzZXQgPSBjb250YWluZXIub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEpRdWVyeSBkb2VzIG5vdCBzZXQgcGFnZVgvcGFnZVkgZm9yIERyb3AgZXZlbnRzLiBUaGV5IGFyZSBkZWZpbmVkIGluIHRoZSBvcmlnaW5hbEV2ZW50IG1lbWJlci5cclxuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYIHx8ICg8YW55PihldmVudC5vcmlnaW5hbEV2ZW50KSkucGFnZVg7XHJcbiAgICAgICAgcGFnZVkgPSBldmVudC5wYWdlWSB8fCAoPGFueT4oZXZlbnQub3JpZ2luYWxFdmVudCkpLnBhZ2VZO1xyXG5cclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy54ID0gcGFnZVggLSBjb250YWluZXJPZmZzZXQubGVmdDtcclxuICAgICAgICBzY3JlZW5Db250YWluZXJDb29yZGluYXRlcy55ID0gcGFnZVkgLSBjb250YWluZXJPZmZzZXQudG9wO1xyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHdvcmxkIGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb250YWluZXIgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gdmVjdG9yIFdvcmxkIHZlY3Rvci5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgU2NyZWVuIGNvbnRhaW5lciBjb29yZGluYXRlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzRnJvbVdvcmxkQ29vcmRpbmF0ZXMgKHZlY3RvciA6IFRIUkVFLlZlY3RvcjMsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvaXNzdWVzLzc4XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHZlY3Rvci5jbG9uZSgpLFxyXG4gICAgICAgICAgICBkZXZpY2VDb29yZGluYXRlcyAgICAgICAgICA6IFRIUkVFLlZlY3RvcjIsXHJcbiAgICAgICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzIDogVEhSRUUuVmVjdG9yMixcclxuICAgICAgICAgICAgbGVmdCAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIHRvcCAgICAgICAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xyXG5cclxuICAgICAgICAvLyBbKC0xLCAtMSksICgxLCAxKV1cclxuICAgICAgICBkZXZpY2VDb29yZGluYXRlcyA9IHRoaXMuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tV29ybGRDb29yZGluYXRlcyhwb3NpdGlvbiwgY2FtZXJhKTtcclxuICAgICAgICBsZWZ0ID0gKCgrZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMikgKiBjb250YWluZXIud2lkdGgoKTtcclxuICAgICAgICB0b3AgID0gKCgtZGV2aWNlQ29vcmRpbmF0ZXMueSArIDEpIC8gMikgKiBjb250YWluZXIuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvbnRhaW5lckNvb3JkaW5hdGVzID0gbmV3IFRIUkVFLlZlY3RvcjIobGVmdCwgdG9wKTtcclxuICAgICAgICByZXR1cm4gc2NyZWVuQ29udGFpbmVyQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEludGVyc2VjdGlvbnNcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgIC8vICBJbnRlcnNlY3Rpb25zXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBSYXljYXN0ZXIgdGhyb3VnaCB0aGUgbW91c2Ugd29ybGQgcG9zaXRpb24uXHJcbiAgICAgKiBAcGFyYW0gbW91c2VXb3JsZCBXb3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMgVEhSRUUuUmF5Y2FzdGVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmF5Y2FzdGVyRnJvbU1vdXNlIChtb3VzZVdvcmxkIDogVEhSRUUuVmVjdG9yMywgY2FtZXJhIDogVEhSRUUuQ2FtZXJhKSA6IFRIUkVFLlJheWNhc3RlcntcclxuXHJcbiAgICAgICAgdmFyIHJheU9yaWdpbiAgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMgKG1vdXNlV29ybGQueCwgbW91c2VXb3JsZC55LCBjYW1lcmEucG9zaXRpb24ueiksXHJcbiAgICAgICAgICAgIHdvcmxkUG9pbnQgOiBUSFJFRS5WZWN0b3IzID0gbmV3IFRIUkVFLlZlY3RvcjMobW91c2VXb3JsZC54LCBtb3VzZVdvcmxkLnksIG1vdXNlV29ybGQueik7XHJcblxyXG4gICAgICAgICAgICAvLyBUb29scy5jb25zb2xlTG9nKCdXb3JsZCBtb3VzZSBjb29yZGluYXRlczogJyArIHdvcmxkUG9pbnQueCArICcsICcgKyB3b3JsZFBvaW50LnkpO1xyXG5cclxuICAgICAgICAvLyBjb25zdHJ1Y3QgcmF5IGZyb20gY2FtZXJhIHRvIG1vdXNlIHdvcmxkXHJcbiAgICAgICAgdmFyIHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIgKHJheU9yaWdpbiwgd29ybGRQb2ludC5zdWIgKHJheU9yaWdpbikubm9ybWFsaXplKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF5Y2FzdGVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBJbnRlcnNlY3Rpb24gbG9jYXRlZCBieSB0aGUgY3Vyc29yLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IEpRdWVyeSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjb250YWluZXIgRE9NIGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHBhcmFtIHNjZW5lT2JqZWN0cyBBcnJheSBvZiBzY2VuZSBvYmplY3RzLlxyXG4gICAgICogQHBhcmFtIHJlY3Vyc2UgUmVjdXJzZSB0aHJvdWdoIG9iamVjdHMuXHJcbiAgICAgKiBAcmV0dXJucyBGaXJzdCBpbnRlcnNlY3Rpb24gd2l0aCBzY3JlZW4gb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEZpcnN0SW50ZXJzZWN0aW9uKGV2ZW50IDogSlF1ZXJ5RXZlbnRPYmplY3QsIGNvbnRhaW5lciA6IEpRdWVyeSwgY2FtZXJhIDogVEhSRUUuQ2FtZXJhLCBzY2VuZU9iamVjdHMgOiBUSFJFRS5PYmplY3QzRFtdLCByZWN1cnNlIDogYm9vbGVhbikgOiBUSFJFRS5JbnRlcnNlY3Rpb24ge1xyXG5cclxuICAgICAgICB2YXIgcmF5Y2FzdGVyICAgICAgICAgIDogVEhSRUUuUmF5Y2FzdGVyLFxyXG4gICAgICAgICAgICBtb3VzZVdvcmxkICAgICAgICAgOiBUSFJFRS5WZWN0b3IzLFxyXG4gICAgICAgICAgICBpSW50ZXJzZWN0aW9uICAgICAgOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGludGVyc2VjdGlvbiAgICAgICA6IFRIUkVFLkludGVyc2VjdGlvbjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnN0cnVjdCByYXkgZnJvbSBjYW1lcmEgdG8gbW91c2Ugd29ybGRcclxuICAgICAgICBtb3VzZVdvcmxkID0gR3JhcGhpY3Mud29ybGRDb29yZGluYXRlc0Zyb21KUUV2ZW50KGV2ZW50LCBjb250YWluZXIsIGNhbWVyYSk7XHJcbiAgICAgICAgcmF5Y2FzdGVyICA9IEdyYXBoaWNzLnJheWNhc3RlckZyb21Nb3VzZSAobW91c2VXb3JsZCwgY2FtZXJhKTtcclxuXHJcbiAgICAgICAgLy8gZmluZCBhbGwgb2JqZWN0IGludGVyc2VjdGlvbnNcclxuICAgICAgICB2YXIgaW50ZXJzZWN0cyA6IFRIUkVFLkludGVyc2VjdGlvbltdID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMgKHNjZW5lT2JqZWN0cywgcmVjdXJzZSk7XHJcblxyXG4gICAgICAgIC8vIG5vIGludGVyc2VjdGlvbj9cclxuICAgICAgICBpZiAoaW50ZXJzZWN0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1c2UgZmlyc3Q7IHJlamVjdCBsaW5lcyAoVHJhbnNmb3JtIEZyYW1lKVxyXG4gICAgICAgIGZvciAoaUludGVyc2VjdGlvbiA9IDA7IGlJbnRlcnNlY3Rpb24gPCBpbnRlcnNlY3RzLmxlbmd0aDsgaUludGVyc2VjdGlvbisrKSB7XHJcblxyXG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3RzW2lJbnRlcnNlY3Rpb25dO1xyXG4gICAgICAgICAgICBpZiAoIShpbnRlcnNlY3Rpb24ub2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuTGluZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSGVscGVyc1xyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgLy8gIEhlbHBlcnNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIFdlYkdMIHRhcmdldCBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gaWQgRE9NIGlkIGZvciBjYW52YXMuXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgY2FudmFzLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2YgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZUNhbnZhcyhpZCA6IHN0cmluZywgd2lkdGg/IDogbnVtYmVyLCBoZWlnaHQ/IDogbnVtYmVyKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgIFxyXG4gICAgICAgIGxldCBjYW52YXMgOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aWR9YCk7XHJcbiAgICAgICAgaWYgKCFjYW52YXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgU2VydmljZXMuY29uc29sZUxvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYENhbnZhcyBlbGVtZW50IGlkID0gJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQ1NTIGNvbnRyb2xzIHRoZSBzaXplXHJcbiAgICAgICAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KVxyXG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgZGltZW5zaW9ucyAgICBcclxuICAgICAgICBjYW52YXMud2lkdGggID0gd2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIHJldHVybiBjYW52YXM7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtTdG9wV2F0Y2h9ICAgICAgIGZyb20gJ1N0b3BXYXRjaCdcclxuXHJcbmV4cG9ydCBlbnVtIFN0YW5kYXJkVmlldyB7XHJcbiAgICBGcm9udCxcclxuICAgIEJhY2ssXHJcbiAgICBUb3AsXHJcbiAgICBCb3R0b20sXHJcbiAgICBMZWZ0LFxyXG4gICAgUmlnaHQsXHJcbiAgICBJc29tZXRyaWNcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbWVyYVxyXG4gKiBHZW5lcmFsIGNhbWVyYSB1dGlsaXR5IG1ldGhvZHMuXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbWVyYSB7XHJcblxyXG4gICAgc3RhdGljIERlZmF1bHRGaWVsZE9mVmlldyAgICAgICA6IG51bWJlciA9IDM3OyAgICAgICAvLyAzNW1tIHZlcnRpY2FsIDogaHR0cHM6Ly93d3cubmlrb25pYW5zLm9yZy9yZXZpZXdzL2Zvdi10YWJsZXMgICAgICAgXHJcbiAgICBzdGF0aWMgRGVmYXVsdE5lYXJDbGlwcGluZ1BsYW5lIDogbnVtYmVyID0gMC4xOyBcclxuICAgIHN0YXRpYyBEZWZhdWx0RmFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXIgPSAxMDAwMDsgXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIENsaXBwaW5nIFBsYW5lc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZXh0ZW50cyBvZiB0aGUgbmVhciBjYW1lcmEgcGxhbmUuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge1RIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhfSBjYW1lcmEgQ2FtZXJhLlxyXG4gICAgICogQHJldHVybnMge1RIUkVFLlZlY3RvcjJ9IFxyXG4gICAgICogQG1lbWJlcm9mIEdyYXBoaWNzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXROZWFyUGxhbmVFeHRlbnRzKGNhbWVyYSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKSA6IFRIUkVFLlZlY3RvcjIge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmFGT1ZSYWRpYW5zID0gY2FtZXJhLmZvdiAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgIFxyXG4gICAgICAgIGxldCBuZWFySGVpZ2h0ID0gMiAqIE1hdGgudGFuKGNhbWVyYUZPVlJhZGlhbnMgLyAyKSAqIGNhbWVyYS5uZWFyO1xyXG4gICAgICAgIGxldCBuZWFyV2lkdGggID0gY2FtZXJhLmFzcGVjdCAqIG5lYXJIZWlnaHQ7XHJcbiAgICAgICAgbGV0IGV4dGVudHMgPSBuZXcgVEhSRUUuVmVjdG9yMihuZWFyV2lkdGgsIG5lYXJIZWlnaHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBleHRlbnRzO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBTZXR0aW5nc1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlIHRoZSBkZWZhdWx0IGJvdW5kaW5nIGJveCBmb3IgYSBtb2RlbC5cclxuICAgICAqIElmIHRoZSBtb2RlbCBpcyBlbXB0eSwgYSB1bml0IHNwaGVyZSBpcyB1c2VzIGFzIGEgcHJveHkgdG8gcHJvdmlkZSBkZWZhdWx0cy5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7VEhSRUUuT2JqZWN0M0R9IG1vZGVsIE1vZGVsIHRvIGNhbGN1bGF0ZSBib3VuZGluZyBib3guXHJcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuQm94M31cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldERlZmF1bHRCb3VuZGluZ0JveCAobW9kZWwgOiBUSFJFRS5PYmplY3QzRCkgOiBUSFJFRS5Cb3gzIHtcclxuXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gbmV3IFRIUkVFLkJveDMoKTsgICAgICAgXHJcbiAgICAgICAgaWYgKG1vZGVsKSBcclxuICAgICAgICAgICAgYm91bmRpbmdCb3ggPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QobW9kZWwpOyBcclxuXHJcbiAgICAgICAgaWYgKCFib3VuZGluZ0JveC5pc0VtcHR5KCkpXHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcclxuICAgICAgICBcclxuICAgICAgICAvLyB1bml0IHNwaGVyZSBwcm94eVxyXG4gICAgICAgIGxldCBzcGhlcmVQcm94eSA9IEdyYXBoaWNzLmNyZWF0ZVNwaGVyZU1lc2gobmV3IFRIUkVFLlZlY3RvcjMoKSwgMSk7XHJcbiAgICAgICAgYm91bmRpbmdCb3ggPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3Qoc3BoZXJlUHJveHkpOyAgICAgICAgIFxyXG5cclxuICAgICAgICByZXR1cm4gYm91bmRpbmdCb3g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gVXBkYXRlcyB0aGUgY2FtZXJhIHRvIGZpdCB0aGUgbW9kZWwgaW4gdGhlIGN1cnJlbnQgdmlldy5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwYXJhbSB7VEhSRUUuUGVyc3BlY3RpdmVDYW1lcmF9IGNhbWVyYSBDYW1lcmEgdG8gdXBkYXRlLlxyXG4gICAgICogQHBhcmFtIHtUSFJFRS5Hcm91cH0gbW9kZWwgTW9kZWwgdG8gZml0LlxyXG4gICAgICogQHJldHVybnMge0NhbWVyYVNldHRpbmdzfSBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEZpdFZpZXdDYW1lcmEgKGNhbWVyYVRlbXBsYXRlIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIG1vZGVsIDogVEhSRUUuR3JvdXAsICkgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSB7IFxyXG5cclxuICAgICAgICBsZXQgdGltZXJUYWcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdDYW1lcmEuZ2V0Rml0Vmlld0NhbWVyYScpOyAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIGxldCBjYW1lcmEgPSBjYW1lcmFUZW1wbGF0ZS5jbG9uZSh0cnVlKTtcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZCAgICAgICAgIDogVEhSRUUuQm94MyAgICA9IENhbWVyYS5nZXREZWZhdWx0Qm91bmRpbmdCb3gobW9kZWwpO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZCAgICAgICAgOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkO1xyXG4gICAgICAgIGxldCBjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UgOiBUSFJFRS5NYXRyaXg0ID0gY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBGaW5kIGNhbWVyYSBwb3NpdGlvbiBpbiBWaWV3IGNvb3JkaW5hdGVzLi4uXHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldzogVEhSRUUuQm94MyA9IEdyYXBoaWNzLmdldFRyYW5zZm9ybWVkQm91bmRpbmdCb3gobW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcblxyXG4gICAgICAgIGxldCB2ZXJ0aWNhbEZpZWxkT2ZWaWV3UmFkaWFucyAgIDogbnVtYmVyID0gKGNhbWVyYS5mb3YgLyAyKSAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICBsZXQgaG9yaXpvbnRhbEZpZWxkT2ZWaWV3UmFkaWFucyA6IG51bWJlciA9IE1hdGguYXRhbihjYW1lcmEuYXNwZWN0ICogTWF0aC50YW4odmVydGljYWxGaWVsZE9mVmlld1JhZGlhbnMpKTsgICAgICAgXHJcblxyXG4gICAgICAgIGxldCBjYW1lcmFaVmVydGljYWxFeHRlbnRzICAgOiBudW1iZXIgPSAoYm91bmRpbmdCb3hWaWV3LmdldFNpemUoKS55IC8gMikgLyBNYXRoLnRhbiAodmVydGljYWxGaWVsZE9mVmlld1JhZGlhbnMpOyAgICAgICBcclxuICAgICAgICBsZXQgY2FtZXJhWkhvcml6b250YWxFeHRlbnRzIDogbnVtYmVyID0gKGJvdW5kaW5nQm94Vmlldy5nZXRTaXplKCkueCAvIDIpIC8gTWF0aC50YW4gKGhvcml6b250YWxGaWVsZE9mVmlld1JhZGlhbnMpOyAgICAgICBcclxuICAgICAgICBsZXQgY2FtZXJhWiA9IE1hdGgubWF4KGNhbWVyYVpWZXJ0aWNhbEV4dGVudHMsIGNhbWVyYVpIb3Jpem9udGFsRXh0ZW50cyk7XHJcblxyXG4gICAgICAgIC8vIHByZXNlcnZlIFhZOyBzZXQgWiB0byBpbmNsdWRlIGV4dGVudHNcclxuICAgICAgICBsZXQgY2FtZXJhUG9zaXRpb25WaWV3ID0gY2FtZXJhLnBvc2l0aW9uLmFwcGx5TWF0cml4NChjYW1lcmFNYXRyaXhXb3JsZEludmVyc2UpO1xyXG4gICAgICAgIGxldCBwb3NpdGlvblZpZXcgPSBuZXcgVEhSRUUuVmVjdG9yMyhjYW1lcmFQb3NpdGlvblZpZXcueCwgY2FtZXJhUG9zaXRpb25WaWV3LnksIGJvdW5kaW5nQm94Vmlldy5tYXgueiArIGNhbWVyYVopO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE5vdywgdHJhbnNmb3JtIGJhY2sgdG8gV29ybGQgY29vcmRpbmF0ZXMuLi5cclxuICAgICAgICBsZXQgcG9zaXRpb25Xb3JsZCA9IHBvc2l0aW9uVmlldy5hcHBseU1hdHJpeDQoY2FtZXJhTWF0cml4V29ybGQpO1xyXG5cclxuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAocG9zaXRpb25Xb3JsZCk7XHJcbiAgICAgICAgY2FtZXJhLmxvb2tBdChib3VuZGluZ0JveFdvcmxkLmdldENlbnRlcigpKTtcclxuXHJcbiAgICAgICAgLy8gZm9yY2UgY2FtZXJhIG1hdHJpeCB0byB1cGRhdGU7IG1hdHJpeEF1dG9VcGRhdGUgaGFwcGVucyBpbiByZW5kZXIgbG9vcFxyXG4gICAgICAgIGNhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCh0cnVlKTtcclxuICAgICAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZyk7ICAgICAgIFxyXG4gICAgICAgIHJldHVybiBjYW1lcmE7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIHRoZSBjYW1lcmEgc2V0dGluZ3MgdG8gZml0IHRoZSBtb2RlbCBpbiBhIHN0YW5kYXJkIHZpZXcuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcGFyYW0ge0NhbWVyYS5TdGFuZGFyZFZpZXd9IHZpZXcgU3RhbmRhcmQgdmlldyAoVG9wLCBMZWZ0LCBldGMuKVxyXG4gICAgICogQHBhcmFtIHtUSFJFRS5PYmplY3QzRH0gbW9kZWwgTW9kZWwgdG8gZml0LlxyXG4gICAgICogQHJldHVybnMge1RIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhfSBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldFN0YW5kYXJkVmlld0NhbWVyYSAodmlldzogU3RhbmRhcmRWaWV3LCB2aWV3QXNwZWN0IDogbnVtYmVyLCBtb2RlbCA6IFRIUkVFLkdyb3VwKSA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHsgXHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ0NhbWVyYS5nZXRTdGFuZGFyZFZpZXcnKTsgICAgICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjYW1lcmEgPSBDYW1lcmEuZ2V0RGVmYXVsdENhbWVyYSh2aWV3QXNwZWN0KTsgICAgICAgICAgICAgICBcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSBHcmFwaGljcy5nZXRCb3VuZGluZ0JveEZyb21PYmplY3QobW9kZWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjZW50ZXJYID0gYm91bmRpbmdCb3guZ2V0Q2VudGVyKCkueDtcclxuICAgICAgICBsZXQgY2VudGVyWSA9IGJvdW5kaW5nQm94LmdldENlbnRlcigpLnk7XHJcbiAgICAgICAgbGV0IGNlbnRlclogPSBib3VuZGluZ0JveC5nZXRDZW50ZXIoKS56O1xyXG5cclxuICAgICAgICBsZXQgbWluWCA9IGJvdW5kaW5nQm94Lm1pbi54O1xyXG4gICAgICAgIGxldCBtaW5ZID0gYm91bmRpbmdCb3gubWluLnk7XHJcbiAgICAgICAgbGV0IG1pblogPSBib3VuZGluZ0JveC5taW4uejtcclxuICAgICAgICBsZXQgbWF4WCA9IGJvdW5kaW5nQm94Lm1heC54O1xyXG4gICAgICAgIGxldCBtYXhZID0gYm91bmRpbmdCb3gubWF4Lnk7XHJcbiAgICAgICAgbGV0IG1heFogPSBib3VuZGluZ0JveC5tYXguejtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKHZpZXcpIHsgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIFN0YW5kYXJkVmlldy5Gcm9udDoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKGNlbnRlclgsICBjZW50ZXJZLCBtYXhaKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KDAsIDEsIDApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuQmFjazoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzKGNlbnRlclgsICBjZW50ZXJZLCBtaW5aKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KDAsIDEsIDApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuVG9wOiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMoY2VudGVyWCwgIG1heFksIGNlbnRlclopKTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS51cC5zZXQoMCwgMCwgLTEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuQm90dG9tOiB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weSAobmV3IFRIUkVFLlZlY3RvcjMoY2VudGVyWCwgbWluWSwgY2VudGVyWikpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgwLCAwLCAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgU3RhbmRhcmRWaWV3LkxlZnQ6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhtaW5YLCBjZW50ZXJZLCBjZW50ZXJaKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KDAsIDEsIDApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuUmlnaHQ6IHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhtYXhYLCBjZW50ZXJZLCBjZW50ZXJaKSk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEudXAuc2V0KDAsIDEsIDApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBTdGFuZGFyZFZpZXcuSXNvbWV0cmljOiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2lkZSA9IE1hdGgubWF4KE1hdGgubWF4KGJvdW5kaW5nQm94LmdldFNpemUoKS54LCBib3VuZGluZ0JveC5nZXRTaXplKCkueSksIGJvdW5kaW5nQm94LmdldFNpemUoKS56KTtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5IChuZXcgVEhSRUUuVmVjdG9yMyhzaWRlLCAgc2lkZSwgc2lkZSkpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnVwLnNldCgtMSwgMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEZvcmNlIG9yaWVudGF0aW9uIGJlZm9yZSBGaXQgVmlldyBjYWxjdWxhdGlvblxyXG4gICAgICAgIGNhbWVyYS5sb29rQXQoYm91bmRpbmdCb3guZ2V0Q2VudGVyKCkpO1xyXG5cclxuICAgICAgICAvLyBmb3JjZSBjYW1lcmEgbWF0cml4IHRvIHVwZGF0ZTsgbWF0cml4QXV0b1VwZGF0ZSBoYXBwZW5zIGluIHJlbmRlciBsb29wXHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpO1xyXG4gICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgIGNhbWVyYSA9IENhbWVyYS5nZXRGaXRWaWV3Q2FtZXJhKGNhbWVyYSwgbW9kZWwpO1xyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZyk7XHJcbiAgICAgICAgcmV0dXJuIGNhbWVyYTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBkZWZhdWx0IHNjZW5lIGNhbWVyYS5cclxuICAgICAqIEBwYXJhbSB2aWV3QXNwZWN0IFZpZXcgYXNwZWN0IHJhdGlvLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0RGVmYXVsdENhbWVyYSAodmlld0FzcGVjdCA6IG51bWJlcikgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRlZmF1bHRDYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoKTtcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLnBvc2l0aW9uLmNvcHkgKG5ldyBUSFJFRS5WZWN0b3IzICgwLCAwLCAxKSk7XHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoKSk7XHJcbiAgICAgICAgZGVmYXVsdENhbWVyYS5uZWFyICAgPSBDYW1lcmEuRGVmYXVsdE5lYXJDbGlwcGluZ1BsYW5lO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEuZmFyICAgID0gQ2FtZXJhLkRlZmF1bHRGYXJDbGlwcGluZ1BsYW5lO1xyXG4gICAgICAgIGRlZmF1bHRDYW1lcmEuZm92ICAgID0gQ2FtZXJhLkRlZmF1bHRGaWVsZE9mVmlldztcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLmFzcGVjdCA9IHZpZXdBc3BlY3Q7XHJcblxyXG4gICAgICAgIC8vIGZvcmNlIGNhbWVyYSBtYXRyaXggdG8gdXBkYXRlOyBtYXRyaXhBdXRvVXBkYXRlIGhhcHBlbnMgaW4gcmVuZGVyIGxvb3BcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpOyAgICAgICBcclxuICAgICAgICBkZWZhdWx0Q2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXg7XHJcblxyXG4gICAgICAgIHJldHVybiBkZWZhdWx0Q2FtZXJhO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBkZWZhdWx0IHNjZW5lIGNhbWVyYS5cclxuICAgICAqIENyZWF0ZXMgYSBkZWZhdWx0IGlmIHRoZSBjdXJyZW50IGNhbWVyYSBoYXMgbm90IGJlZW4gY29uc3RydWN0ZWQuXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIEFjdGl2ZSBjYW1lcmEgKHBvc3NpYmx5IG51bGwpLlxyXG4gICAgICogQHBhcmFtIHZpZXdBc3BlY3QgVmlldyBhc3BlY3QgcmF0aW8uXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRTY2VuZUNhbWVyYSAoY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgdmlld0FzcGVjdCA6IG51bWJlcikgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSB7XHJcblxyXG4gICAgICAgIGlmIChjYW1lcmEpXHJcbiAgICAgICAgICAgIHJldHVybiBjYW1lcmE7XHJcblxyXG4gICAgICAgIGxldCBkZWZhdWx0Q2FtZXJhID0gQ2FtZXJhLmdldERlZmF1bHRDYW1lcmEodmlld0FzcGVjdCk7XHJcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRDYW1lcmE7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59XHJcbiIsIiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuICAgICAgICAgXHJcbi8qKlxyXG4gKiBNYXRoIExpYnJhcnlcclxuICogR2VuZXJhbCBtYXRoZW1hdGljcyByb3V0aW5lc1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNYXRoTGlicmFyeSB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2hldGhlciB0d28gbnVtYmVycyBhcmUgZXF1YWwgd2l0aGluIHRoZSBnaXZlbiB0b2xlcmFuY2UuXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgRmlyc3QgdmFsdWUgdG8gY29tcGFyZS5cclxuICAgICAqIEBwYXJhbSBvdGhlciBTZWNvbmQgdmFsdWUgdG8gY29tcGFyZS5cclxuICAgICAqIEBwYXJhbSB0b2xlcmFuY2UgVG9sZXJhbmNlIGZvciBjb21wYXJpc29uLlxyXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB3aXRoaW4gdG9sZXJhbmNlLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbnVtYmVyc0VxdWFsV2l0aGluVG9sZXJhbmNlKHZhbHVlIDogbnVtYmVyLCBvdGhlciA6IG51bWJlciwgdG9sZXJhbmNlIDogbnVtYmVyKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4gKCh2YWx1ZSA+PSAob3RoZXIgLSB0b2xlcmFuY2UpKSAmJiAodmFsdWUgPD0gKG90aGVyICsgdG9sZXJhbmNlKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHthc3NlcnR9ICAgICAgICAgICAgIGZyb20gJ2NoYWknXHJcbmltcG9ydCAqIGFzIFRIUkVFICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhfSAgICAgICAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIEhUTUxMb2dnZXJ9IGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtTdG9wV2F0Y2h9ICAgICAgICAgIGZyb20gJ1N0b3BXYXRjaCdcclxuXHJcbmludGVyZmFjZSBGYWNlUGFpciB7XHJcbiAgICAgICAgXHJcbiAgICB2ZXJ0aWNlcyA6IFRIUkVFLlZlY3RvcjNbXTtcclxuICAgIGZhY2VzICAgIDogVEhSRUUuRmFjZTNbXTtcclxufVxyXG4gICAgICAgICAgXHJcbi8qKlxyXG4gKiAgRGVwdGhCdWZmZXIgXHJcbiAqICBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlciB7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IE1lc2hNb2RlbE5hbWUgICAgICAgICA6IHN0cmluZyA9ICdNb2RlbE1lc2gnO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IE5vcm1hbGl6ZWRUb2xlcmFuY2UgICA6IG51bWJlciA9IC4wMDE7ICAgIFxyXG5cclxuICAgIHN0YXRpYyBEZWZhdWx0TWVzaFBob25nTWF0ZXJpYWxQYXJhbWV0ZXJzIDogVEhSRUUuTWVzaFBob25nTWF0ZXJpYWxQYXJhbWV0ZXJzID0ge3NpZGU6IFRIUkVFLkRvdWJsZVNpZGUsIHdpcmVmcmFtZSA6IGZhbHNlLCBjb2xvciA6IDB4ZmYwMGZmLCByZWZsZWN0aXZpdHkgOiAwLjc1LCBzaGluaW5lc3MgOiAwLjc1fTtcclxuICAgIFxyXG4gICAgX2xvZ2dlciA6IExvZ2dlcjtcclxuXHJcbiAgICBfcmdiYUFycmF5IDogVWludDhBcnJheTtcclxuICAgIGRlcHRocyAgICAgOiBGbG9hdDMyQXJyYXk7XHJcbiAgICB3aWR0aCAgICAgIDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0ICAgICA6IG51bWJlcjtcclxuXHJcbiAgICBjYW1lcmEgICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XHJcbiAgICBfbmVhckNsaXBQbGFuZSAgIDogbnVtYmVyO1xyXG4gICAgX2ZhckNsaXBQbGFuZSAgICA6IG51bWJlcjtcclxuICAgIF9jYW1lcmFDbGlwUmFuZ2UgOiBudW1iZXI7XHJcbiAgICBcclxuICAgIF9taW5pbXVtTm9ybWFsaXplZCA6IG51bWJlcjtcclxuICAgIF9tYXhpbXVtTm9ybWFsaXplZCA6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHJnYmFBcnJheSBSYXcgYXJheSBvZiBSR0JBIGJ5dGVzIHBhY2tlZCB3aXRoIGZsb2F0cy5cclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aCBvZiBtYXAuXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodCBvZiBtYXAuXHJcbiAgICAgKiBAcGFyYW0gbmVhckNsaXBQbGFuZSBDYW1lcmEgbmVhciBjbGlwcGluZyBwbGFuZS5cclxuICAgICAqIEBwYXJhbSBmYXJDbGlwUGxhbmUgQ2FtZXJhIGZhciBjbGlwcGluZyBwbGFuZS5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocmdiYUFycmF5IDogVWludDhBcnJheSwgd2lkdGggOiBudW1iZXIsIGhlaWdodCA6bnVtYmVyLCBjYW1lcmEgOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3JnYmFBcnJheSA9IHJnYmFBcnJheTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCAgPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IGNhbWVyYTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgYXNwZWN0IHJhdGlvbiBvZiB0aGUgZGVwdGggYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBnZXQgYXNwZWN0UmF0aW8gKCkgOiBudW1iZXIge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWluaW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBnZXQgbWluaW11bU5vcm1hbGl6ZWQgKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9taW5pbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1pbmltdW0gZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtaW5pbXVtKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBtaW5pbXVtID0gdGhpcy5ub3JtYWxpemVkVG9Nb2RlbERlcHRoKHRoaXMuX21heGltdW1Ob3JtYWxpemVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1pbmltdW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIG5vcm1hbGl6ZWQgZGVwdGggdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXhpbXVtTm9ybWFsaXplZCAoKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heGltdW1Ob3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1heGltdW0oKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgbGV0IG1heGltdW0gPSB0aGlzLm5vcm1hbGl6ZWRUb01vZGVsRGVwdGgodGhpcy5taW5pbXVtTm9ybWFsaXplZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtYXhpbXVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9ybWFsaXplZCBkZXB0aCByYW5nZSBvZiB0aGUgYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBnZXQgcmFuZ2VOb3JtYWxpemVkKCkgOiBudW1iZXJ7XHJcblxyXG4gICAgICAgIGxldCBkZXB0aE5vcm1hbGl6ZWQgOiBudW1iZXIgPSB0aGlzLl9tYXhpbXVtTm9ybWFsaXplZCAtIHRoaXMuX21pbmltdW1Ob3JtYWxpemVkO1xyXG5cclxuICAgICAgICByZXR1cm4gZGVwdGhOb3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9ybWFsaXplZCBkZXB0aCBvZiB0aGUgYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBnZXQgcmFuZ2UoKSA6IG51bWJlcntcclxuXHJcbiAgICAgICAgbGV0IGRlcHRoIDogbnVtYmVyID0gdGhpcy5tYXhpbXVtIC0gdGhpcy5taW5pbXVtO1xyXG5cclxuICAgICAgICByZXR1cm4gZGVwdGg7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSB0aGUgZXh0ZW50cyBvZiB0aGUgZGVwdGggYnVmZmVyLlxyXG4gICAgICovICAgICAgIFxyXG4gICAgY2FsY3VsYXRlRXh0ZW50cyAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWluaW11bU5vcm1hbGl6ZWQoKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0TWF4aW11bU5vcm1hbGl6ZWQoKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZVxyXG4gICAgICovICAgICAgIFxyXG4gICAgaW5pdGlhbGl6ZSAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gU2VydmljZXMuaHRtbExvZ2dlcjsgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuX25lYXJDbGlwUGxhbmUgICA9IHRoaXMuY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fZmFyQ2xpcFBsYW5lICAgID0gdGhpcy5jYW1lcmEuZmFyO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYUNsaXBSYW5nZSA9IHRoaXMuX2ZhckNsaXBQbGFuZSAtIHRoaXMuX25lYXJDbGlwUGxhbmU7XHJcblxyXG4gICAgICAgIC8vIFJHQkEgLT4gRmxvYXQzMlxyXG4gICAgICAgIHRoaXMuZGVwdGhzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9yZ2JhQXJyYXkuYnVmZmVyKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjYWxjdWxhdGUgZXh0cmVtYSBvZiBkZXB0aCBidWZmZXIgdmFsdWVzXHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVFeHRlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0IGEgbm9ybWFsaXplZCBkZXB0aCBbMCwxXSB0byBkZXB0aCBpbiBtb2RlbCB1bml0cy5cclxuICAgICAqIEBwYXJhbSBub3JtYWxpemVkRGVwdGggTm9ybWFsaXplZCBkZXB0aCBbMCwxXS5cclxuICAgICAqL1xyXG4gICAgbm9ybWFsaXplZFRvTW9kZWxEZXB0aChub3JtYWxpemVkRGVwdGggOiBudW1iZXIpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjY1MjI1My9nZXR0aW5nLXRoZS10cnVlLXotdmFsdWUtZnJvbS10aGUtZGVwdGgtYnVmZmVyXHJcbiAgICAgICAgbm9ybWFsaXplZERlcHRoID0gMi4wICogbm9ybWFsaXplZERlcHRoIC0gMS4wO1xyXG4gICAgICAgIGxldCB6TGluZWFyID0gMi4wICogdGhpcy5jYW1lcmEubmVhciAqIHRoaXMuY2FtZXJhLmZhciAvICh0aGlzLmNhbWVyYS5mYXIgKyB0aGlzLmNhbWVyYS5uZWFyIC0gbm9ybWFsaXplZERlcHRoICogKHRoaXMuY2FtZXJhLmZhciAtIHRoaXMuY2FtZXJhLm5lYXIpKTtcclxuXHJcbiAgICAgICAgLy8gekxpbmVhciBpcyB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2FtZXJhOyByZXZlcnNlIHRvIHlpZWxkIGhlaWdodCBmcm9tIG1lc2ggcGxhbmVcclxuICAgICAgICB6TGluZWFyID0gLSh6TGluZWFyIC0gdGhpcy5jYW1lcmEuZmFyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHpMaW5lYXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpemVkIGRlcHRoIHZhbHVlIGF0IGEgcGl4ZWwgaW5kZXhcclxuICAgICAqIEBwYXJhbSByb3cgQnVmZmVyIHJvdy5cclxuICAgICAqIEBwYXJhbSBjb2x1bW4gQnVmZmVyIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgZGVwdGhOb3JtYWxpemVkIChyb3cgOiBudW1iZXIsIGNvbHVtbikgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgaW5kZXggPSAoTWF0aC5yb3VuZChyb3cpICogdGhpcy53aWR0aCkgKyBNYXRoLnJvdW5kKGNvbHVtbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGhzW2luZGV4XVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZGVwdGggdmFsdWUgYXQgYSBwaXhlbCBpbmRleC5cclxuICAgICAqIEBwYXJhbSByb3cgTWFwIHJvdy5cclxuICAgICAqIEBwYXJhbSBwaXhlbENvbHVtbiBNYXAgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBkZXB0aChyb3cgOiBudW1iZXIsIGNvbHVtbikgOiBudW1iZXIge1xyXG5cclxuICAgICAgICBsZXQgZGVwdGhOb3JtYWxpemVkID0gdGhpcy5kZXB0aE5vcm1hbGl6ZWQocm93LCBjb2x1bW4pO1xyXG4gICAgICAgIGxldCBkZXB0aCA9IHRoaXMubm9ybWFsaXplZFRvTW9kZWxEZXB0aChkZXB0aE5vcm1hbGl6ZWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBkZXB0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG1pbmltdW0gbm9ybWFsaXplZCBkZXB0aCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgc2V0TWluaW11bU5vcm1hbGl6ZWQoKSB7XHJcblxyXG4gICAgICAgIGxldCBtaW5pbXVtTm9ybWFsaXplZCA6IG51bWJlciA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgdGhpcy5kZXB0aHMubGVuZ3RoOyBpbmRleCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aFZhbHVlIDogbnVtYmVyID0gdGhpcy5kZXB0aHNbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRlcHRoVmFsdWUgPCBtaW5pbXVtTm9ybWFsaXplZClcclxuICAgICAgICAgICAgICAgIG1pbmltdW1Ob3JtYWxpemVkID0gZGVwdGhWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9taW5pbXVtTm9ybWFsaXplZCA9IG1pbmltdW1Ob3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgbWF4aW11bSBub3JtYWxpemVkIGRlcHRoIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBzZXRNYXhpbXVtTm9ybWFsaXplZCgpIHtcclxuXHJcbiAgICAgICAgbGV0IG1heGltdW1Ob3JtYWxpemVkIDogbnVtYmVyID0gTnVtYmVyLk1JTl9WQUxVRTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleDogbnVtYmVyID0gMDsgaW5kZXggPCB0aGlzLmRlcHRocy5sZW5ndGg7IGluZGV4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoVmFsdWUgOiBudW1iZXIgPSB0aGlzLmRlcHRoc1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmIChkZXB0aFZhbHVlID4gbWF4aW11bU5vcm1hbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICBtYXhpbXVtTm9ybWFsaXplZCA9IGRlcHRoVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWF4aW11bU5vcm1hbGl6ZWQgPSBtYXhpbXVtTm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbi8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbGluZWFyIGluZGV4IG9mIGEgbW9kZWwgcG9pbnQgaW4gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAcGFyYW0gd29ybGRWZXJ0ZXggVmVydGV4IG9mIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBnZXRNb2RlbFZlcnRleEluZGljZXMgKHdvcmxkVmVydGV4IDogVEhSRUUuVmVjdG9yMywgcGxhbmVCb3VuZGluZ0JveCA6IFRIUkVFLkJveDMpIDogVEhSRUUuVmVjdG9yMiB7XHJcbiAgICBcclxuICAgICAgICBsZXQgYm94U2l6ZSAgICAgIDogVEhSRUUuVmVjdG9yMyA9IHBsYW5lQm91bmRpbmdCb3guZ2V0U2l6ZSgpO1xyXG4gICAgICAgIGxldCBtZXNoRXh0ZW50cyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIgKGJveFNpemUueCwgYm94U2l6ZS55KTtcclxuXHJcbiAgICAgICAgLy8gIG1hcCBjb29yZGluYXRlcyB0byBvZmZzZXRzIGluIHJhbmdlIFswLCAxXVxyXG4gICAgICAgIGxldCBvZmZzZXRYIDogbnVtYmVyID0gKHdvcmxkVmVydGV4LnggKyAoYm94U2l6ZS54IC8gMikpIC8gYm94U2l6ZS54O1xyXG4gICAgICAgIGxldCBvZmZzZXRZIDogbnVtYmVyID0gKHdvcmxkVmVydGV4LnkgKyAoYm94U2l6ZS55IC8gMikpIC8gYm94U2l6ZS55O1xyXG5cclxuICAgICAgICBsZXQgcm93ICAgIDogbnVtYmVyID0gb2Zmc2V0WSAqICh0aGlzLmhlaWdodCAtIDEpO1xyXG4gICAgICAgIGxldCBjb2x1bW4gOiBudW1iZXIgPSBvZmZzZXRYICogKHRoaXMud2lkdGggLSAxKTtcclxuICAgICAgICByb3cgICAgPSBNYXRoLnJvdW5kKHJvdyk7XHJcbiAgICAgICAgY29sdW1uID0gTWF0aC5yb3VuZChjb2x1bW4pO1xyXG5cclxuICAgICAgICBhc3NlcnQuaXNUcnVlKChyb3cgPj0gMCkgJiYgKHJvdyA8IHRoaXMuaGVpZ2h0KSwgKGBWZXJ0ZXggKCR7d29ybGRWZXJ0ZXgueH0sICR7d29ybGRWZXJ0ZXgueX0sICR7d29ybGRWZXJ0ZXguen0pIHlpZWxkZWQgcm93ID0gJHtyb3d9YCkpO1xyXG4gICAgICAgIGFzc2VydC5pc1RydWUoKGNvbHVtbj49IDApICYmIChjb2x1bW4gPCB0aGlzLndpZHRoKSwgKGBWZXJ0ZXggKCR7d29ybGRWZXJ0ZXgueH0sICR7d29ybGRWZXJ0ZXgueX0sICR7d29ybGRWZXJ0ZXguen0pIHlpZWxkZWQgY29sdW1uID0gJHtjb2x1bW59YCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjIocm93LCBjb2x1bW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBsaW5lYXIgaW5kZXggb2YgYSBtb2RlbCBwb2ludCBpbiB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEBwYXJhbSB3b3JsZFZlcnRleCBWZXJ0ZXggb2YgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldE1vZGVsVmVydGV4SW5kZXggKHdvcmxkVmVydGV4IDogVEhSRUUuVmVjdG9yMywgcGxhbmVCb3VuZGluZ0JveCA6IFRIUkVFLkJveDMpIDogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZXMgOiBUSFJFRS5WZWN0b3IyID0gdGhpcy5nZXRNb2RlbFZlcnRleEluZGljZXMod29ybGRWZXJ0ZXgsIHBsYW5lQm91bmRpbmdCb3gpOyAgICBcclxuICAgICAgICBsZXQgcm93ICAgIDogbnVtYmVyID0gaW5kaWNlcy54O1xyXG4gICAgICAgIGxldCBjb2x1bW4gOiBudW1iZXIgPSBpbmRpY2VzLnk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4ID0gKHJvdyAqIHRoaXMud2lkdGgpICsgY29sdW1uO1xyXG4gICAgICAgIGluZGV4ID0gTWF0aC5yb3VuZChpbmRleCk7XHJcblxyXG4gICAgICAgIGFzc2VydC5pc1RydWUoKGluZGV4ID49IDApICYmIChpbmRleCA8IHRoaXMuZGVwdGhzLmxlbmd0aCksIChgVmVydGV4ICgke3dvcmxkVmVydGV4Lnh9LCAke3dvcmxkVmVydGV4Lnl9LCAke3dvcmxkVmVydGV4Lnp9KSB5aWVsZGVkIGluZGV4ID0gJHtpbmRleH1gKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQ29uc3RydWN0cyBhIHBhaXIgb2YgdHJpYW5ndWxhciBmYWNlcyBhdCB0aGUgZ2l2ZW4gb2Zmc2V0IGluIHRoZSBEZXB0aEJ1ZmZlci5cclxuICAgICAgKiBAcGFyYW0gcm93IFJvdyBvZmZzZXQgKExvd2VyIExlZnQpLlxyXG4gICAgICAqIEBwYXJhbSBjb2x1bW4gQ29sdW1uIG9mZnNldCAoTG93ZXIgTGVmdCkuXHJcbiAgICAgICogQHBhcmFtIGZhY2VTaXplIFNpemUgb2YgYSBmYWNlIGVkZ2UgKG5vdCBoeXBvdGVudXNlKS5cclxuICAgICAgKiBAcGFyYW0gYmFzZVZlcnRleEluZGV4IEJlZ2lubmluZyBvZmZzZXQgaW4gbWVzaCBnZW9tZXRyeSB2ZXJ0ZXggYXJyYXkuXHJcbiAgICAgICovXHJcbiAgICAgY29uc3RydWN0VHJpRmFjZXNBdE9mZnNldCAocm93IDogbnVtYmVyLCBjb2x1bW4gOiBudW1iZXIsIG1lc2hMb3dlckxlZnQgOiBUSFJFRS5WZWN0b3IyLCBmYWNlU2l6ZSA6IG51bWJlciwgYmFzZVZlcnRleEluZGV4IDogbnVtYmVyKSA6IEZhY2VQYWlyIHtcclxuICAgICAgICAgXHJcbiAgICAgICAgIGxldCBmYWNlUGFpciA6IEZhY2VQYWlyID0ge1xyXG4gICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgIGZhY2VzICAgIDogW11cclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICAgLy8gIFZlcnRpY2VzXHJcbiAgICAgICAgIC8vICAgMiAgICAzICAgICAgIFxyXG4gICAgICAgICAvLyAgIDAgICAgMVxyXG4gICAgIFxyXG4gICAgICAgICAvLyBjb21wbGV0ZSBtZXNoIGNlbnRlciB3aWxsIGJlIGF0IHRoZSB3b3JsZCBvcmlnaW5cclxuICAgICAgICAgbGV0IG9yaWdpblggOiBudW1iZXIgPSBtZXNoTG93ZXJMZWZ0LnggKyAoY29sdW1uICogZmFjZVNpemUpO1xyXG4gICAgICAgICBsZXQgb3JpZ2luWSA6IG51bWJlciA9IG1lc2hMb3dlckxlZnQueSArIChyb3cgICAgKiBmYWNlU2l6ZSk7XHJcbiBcclxuICAgICAgICAgbGV0IGxvd2VyTGVmdCAgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIDAsICAgICAgICAgb3JpZ2luWSArIDAsICAgICAgICB0aGlzLmRlcHRoKHJvdyArIDAsIGNvbHVtbisgMCkpOyAgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAwXHJcbiAgICAgICAgIGxldCBsb3dlclJpZ2h0ICA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblggKyBmYWNlU2l6ZSwgIG9yaWdpblkgKyAwLCAgICAgICAgdGhpcy5kZXB0aChyb3cgKyAwLCBjb2x1bW4gKyAxKSk7ICAgICAgICAgICAgLy8gYmFzZVZlcnRleEluZGV4ICsgMVxyXG4gICAgICAgICBsZXQgdXBwZXJMZWZ0ICAgPSBuZXcgVEhSRUUuVmVjdG9yMyhvcmlnaW5YICsgMCwgICAgICAgICBvcmlnaW5ZICsgZmFjZVNpemUsIHRoaXMuZGVwdGgocm93ICsgMSwgY29sdW1uICsgMCkpOyAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDJcclxuICAgICAgICAgbGV0IHVwcGVyUmlnaHQgID0gbmV3IFRIUkVFLlZlY3RvcjMob3JpZ2luWCArIGZhY2VTaXplLCAgb3JpZ2luWSArIGZhY2VTaXplLCB0aGlzLmRlcHRoKHJvdyArIDEsIGNvbHVtbiArIDEpKTsgICAgICAgICAgICAvLyBiYXNlVmVydGV4SW5kZXggKyAzXHJcbiBcclxuICAgICAgICAgZmFjZVBhaXIudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgICBsb3dlckxlZnQsICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDBcclxuICAgICAgICAgICAgICBsb3dlclJpZ2h0LCAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDFcclxuICAgICAgICAgICAgICB1cHBlckxlZnQsICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDJcclxuICAgICAgICAgICAgICB1cHBlclJpZ2h0ICAgICAgICAgICAgIC8vIGJhc2VWZXJ0ZXhJbmRleCArIDNcclxuICAgICAgICAgICk7XHJcbiBcclxuICAgICAgICAgIC8vIHJpZ2h0IGhhbmQgcnVsZSBmb3IgcG9seWdvbiB3aW5kaW5nXHJcbiAgICAgICAgICBmYWNlUGFpci5mYWNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMyhiYXNlVmVydGV4SW5kZXggKyAwLCBiYXNlVmVydGV4SW5kZXggKyAxLCBiYXNlVmVydGV4SW5kZXggKyAzKSxcclxuICAgICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoYmFzZVZlcnRleEluZGV4ICsgMCwgYmFzZVZlcnRleEluZGV4ICsgMywgYmFzZVZlcnRleEluZGV4ICsgMilcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgcmV0dXJuIGZhY2VQYWlyO1xyXG4gICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSBtZXNoIG9mIHRoZSBnaXZlbiBiYXNlIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSBtZXNoWFlFeHRlbnRzIEJhc2UgZGltZW5zaW9ucyAobW9kZWwgdW5pdHMpLiBIZWlnaHQgaXMgY29udHJvbGxlZCBieSBEQiBhc3BlY3QgcmF0aW8uXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgTWF0ZXJpYWwgdG8gYXNzaWduIHRvIG1lc2guXHJcbiAgICAgKi9cclxuICAgIG1lc2gobWF0ZXJpYWw/IDogVEhSRUUuTWF0ZXJpYWwpIDogVEhSRUUuTWVzaCB7XHJcblxyXG4gICAgICAgIGxldCB0aW1lclRhZyA9IFNlcnZpY2VzLnRpbWVyLm1hcmsoJ0RlcHRoQnVmZmVyLm1lc2gnKTsgICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgbWVzaFhZRXh0ZW50cyA6IFRIUkVFLlZlY3RvcjIgPSBDYW1lcmEuZ2V0TmVhclBsYW5lRXh0ZW50cyh0aGlzLmNhbWVyYSk7ICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghbWF0ZXJpYWwpXHJcbiAgICAgICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKERlcHRoQnVmZmVyLkRlZmF1bHRNZXNoUGhvbmdNYXRlcmlhbFBhcmFtZXRlcnMpO1xyXG5cclxuICAgICAgICBsZXQgbWVzaEdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGZhY2VTaXplICAgICAgICA6IG51bWJlciA9IG1lc2hYWUV4dGVudHMueCAvICh0aGlzLndpZHRoIC0gMSk7XHJcbiAgICAgICAgbGV0IGJhc2VWZXJ0ZXhJbmRleCA6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIGxldCBtZXNoTG93ZXJMZWZ0IDogVEhSRUUuVmVjdG9yMiA9IG5ldyBUSFJFRS5WZWN0b3IyKC0obWVzaFhZRXh0ZW50cy54IC8gMiksIC0obWVzaFhZRXh0ZW50cy55IC8gMikgKVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpUm93ID0gMDsgaVJvdyA8ICh0aGlzLmhlaWdodCAtIDEpOyBpUm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaUNvbHVtbiA9IDA7IGlDb2x1bW4gPCAodGhpcy53aWR0aCAtIDEpOyBpQ29sdW1uKyspIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IGZhY2VQYWlyID0gdGhpcy5jb25zdHJ1Y3RUcmlGYWNlc0F0T2Zmc2V0KGlSb3csIGlDb2x1bW4sIG1lc2hMb3dlckxlZnQsIGZhY2VTaXplLCBiYXNlVmVydGV4SW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1lc2hHZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKC4uLmZhY2VQYWlyLnZlcnRpY2VzKTtcclxuICAgICAgICAgICAgICAgIG1lc2hHZW9tZXRyeS5mYWNlcy5wdXNoKC4uLmZhY2VQYWlyLmZhY2VzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBiYXNlVmVydGV4SW5kZXggKz0gNDtcclxuICAgICAgICAgICAgfSAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVzaEdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpOyAgICAgICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgbWVzaCAgPSBuZXcgVEhSRUUuTWVzaChtZXNoR2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgICAgICBtZXNoLm5hbWUgPSBEZXB0aEJ1ZmZlci5NZXNoTW9kZWxOYW1lO1xyXG5cclxuICAgICAgICAvLyBNZXNoIHdhcyBjb25zdHJ1Y3RlZCB3aXRoIFogPSBkZXB0aCBidWZmZXIoWCxZKS5cclxuICAgICAgICAvLyBOb3cgcm90YXRlIG1lc2ggdG8gYWxpZ24gd2l0aCB2aWV3ZXIgWFkgcGxhbmUgc28gVG9wIHZpZXcgaXMgbG9va2luZyBkb3duIG9uIHRoZSBtZXNoLlxyXG4gICAgICAgIG1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgICAgICBTZXJ2aWNlcy50aW1lci5sb2dFbGFwc2VkVGltZSh0aW1lclRhZylcclxuICAgICAgICByZXR1cm4gbWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuYWx5emVzIHByb3BlcnRpZXMgb2YgYSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGFuYWx5emUgKCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5jbGVhckxvZygpO1xyXG5cclxuICAgICAgICBsZXQgbWlkZGxlID0gdGhpcy53aWR0aCAvIDI7XHJcbiAgICAgICAgbGV0IGRlY2ltYWxQbGFjZXMgPSA1O1xyXG4gICAgICAgIGxldCBoZWFkZXJTdHlsZSAgID0gXCJmb250LWZhbWlseSA6IG1vbm9zcGFjZTsgZm9udC13ZWlnaHQgOiBib2xkOyBjb2xvciA6IGJsdWU7IGZvbnQtc2l6ZSA6IDE4cHhcIjtcclxuICAgICAgICBsZXQgbWVzc2FnZVN0eWxlICA9IFwiZm9udC1mYW1pbHkgOiBtb25vc3BhY2U7IGNvbG9yIDogYmxhY2s7IGZvbnQtc2l6ZSA6IDE0cHhcIjtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoJ0NhbWVyYSBQcm9wZXJ0aWVzJywgaGVhZGVyU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBOZWFyIFBsYW5lID0gJHt0aGlzLmNhbWVyYS5uZWFyfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYEZhciBQbGFuZSAgPSAke3RoaXMuY2FtZXJhLmZhcn1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBDbGlwIFJhbmdlID0gJHt0aGlzLmNhbWVyYS5mYXIgLSB0aGlzLmNhbWVyYS5uZWFyfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEVtcHR5TGluZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZSgnTm9ybWFsaXplZCcsIGhlYWRlclN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgQ2VudGVyIERlcHRoID0gJHt0aGlzLmRlcHRoTm9ybWFsaXplZChtaWRkbGUsIG1pZGRsZSkudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBaIFJhbmdlID0gJHt0aGlzLnJhbmdlTm9ybWFsaXplZC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYE1pbmltdW0gPSAke3RoaXMubWluaW11bU5vcm1hbGl6ZWQudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBNYXhpbXVtID0gJHt0aGlzLm1heGltdW1Ob3JtYWxpemVkLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyl9YCwgbWVzc2FnZVN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkRW1wdHlMaW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKCdNb2RlbCBVbml0cycsIGhlYWRlclN0eWxlKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkTWVzc2FnZShgQ2VudGVyIERlcHRoID0gJHt0aGlzLmRlcHRoKG1pZGRsZSwgbWlkZGxlKS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpfWAsIG1lc3NhZ2VTdHlsZSk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZE1lc3NhZ2UoYFogUmFuZ2UgPSAke3RoaXMucmFuZ2UudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBNaW5pbXVtID0gJHt0aGlzLm1pbmltdW0udG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKGBNYXhpbXVtID0gJHt0aGlzLm1heGltdW0udG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gLCBtZXNzYWdlU3R5bGUpO1xyXG4gICAgfVxyXG59IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgIFxyXG4vKipcclxuICogVG9vbCBMaWJyYXJ5XHJcbiAqIEdlbmVyYWwgdXRpbGl0eSByb3V0aW5lc1xyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUb29scyB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBVdGlsaXR5XHJcbiAgICAvLy8gPHN1bW1hcnk+ICAgICAgICBcclxuICAgIC8vIEdlbmVyYXRlIGEgcHNldWRvIEdVSUQuXHJcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTAzNC9ob3ctdG8tY3JlYXRlLWEtZ3VpZC11dWlkLWluLWphdmFzY3JpcHRcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBzdGF0aWMgZ2VuZXJhdGVQc2V1ZG9HVUlEKCkge1xyXG4gICAgICBcclxuICAgICAgICBmdW5jdGlvbiBzNCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG4gICAgIFxyXG4gICAgICAgIHJldHVybiBzNCgpICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICtcclxuICAgICAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4vKlxyXG4gIFJlcXVpcmVtZW50c1xyXG4gICAgTm8gcGVyc2lzdGVudCBET00gZWxlbWVudC4gVGhlIGNhbnZhcyBpcyBjcmVhdGVkIGR5bmFtaWNhbGx5LlxyXG4gICAgICAgIE9wdGlvbiBmb3IgcGVyc2lzdGluZyB0aGUgRmFjdG9yeSBpbiB0aGUgY29uc3RydWN0b3JcclxuICAgIEpTT04gY29tcGF0aWJsZSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJzXHJcbiAgICBGaXhlZCByZXNvbHV0aW9uOyByZXNpemluZyBzdXBwb3J0IGlzIG5vdCByZXF1aXJlZC5cclxuKi9cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7Q2FtZXJhfSAgICAgICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0RlcHRoQnVmZmVyfSAgICAgICAgICAgIGZyb20gJ0RlcHRoQnVmZmVyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01vZGVsUmVsaWVmfSAgICAgICAgICAgIGZyb20gJ01vZGVsUmVsaWVmJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1N0b3BXYXRjaH0gICAgICAgICAgICAgIGZyb20gJ1N0b3BXYXRjaCdcclxuaW1wb3J0IHtUb29sc30gICAgICAgICAgICAgICAgICBmcm9tICdUb29scydcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycyB7XHJcblxyXG4gICAgd2lkdGggICAgICAgICAgICA6IG51bWJlciwgICAgICAgICAgICAgICAgICAvLyB3aWR0aCBvZiBEQlxyXG4gICAgaGVpZ2h0ICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICAvLyBoZWlnaHQgb2YgREIgICAgICAgIFxyXG4gICAgbW9kZWwgICAgICAgICAgICA6IFRIUkVFLkdyb3VwLCAgICAgICAgICAgICAvLyBtb2RlbCByb290XHJcblxyXG4gICAgY2FtZXJhPyAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhLCAvLyBjYW1lcmFcclxuICAgIFxyXG4gICAgbG9nRGVwdGhCdWZmZXI/ICA6IGJvb2xlYW4sICAgICAgICAgICAgICAgICAvLyB1c2UgbG9nYXJpdGhtaWMgZGVwdGggYnVmZmVyIGZvciBoaWdoZXIgcmVzb2x1dGlvbiAoYmV0dGVyIGRpc3RyaWJ1dGlvbikgaW4gc2NlbmVzIHdpdGggbGFyZ2UgZXh0ZW50c1xyXG4gICAgYm91bmRlZENsaXBwaW5nPyA6IGJvb2xlYW4sICAgICAgICAgICAgICAgICAvLyBvdmVycnJpZCBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzIHRvIGJvdW5kIG1vZGVsXHJcbiAgICBcclxuICAgIGFkZENhbnZhc1RvRE9NPyAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVzaEdlbmVyYXRlUGFyYW1ldGVycyB7XHJcblxyXG4gICAgY2FtZXJhPyAgICAgICAgICA6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xyXG4gICAgbWF0ZXJpYWw/ICAgICAgICA6IFRIUkVFLk1hdGVyaWFsO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlckZhY3RvcnlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlckZhY3Rvcnkge1xyXG5cclxuICAgIHN0YXRpYyBEZWZhdWx0UmVzb2x1dGlvbiA6IG51bWJlciAgICAgICAgICAgPSAxMDI0OyAgICAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgREIgcmVzb2x1dGlvblxyXG4gICAgc3RhdGljIE5lYXJQbGFuZUVwc2lsb25lIDogbnVtYmVyICAgICAgICAgICA9IC4wMDE7ICAgICAgICAgICAgICAgICAgICAgLy8gYWRqdXN0bWVudCB0byBhdm9pZCBjbGlwcGluZyBnZW9tZXRyeSBvbiB0aGUgbmVhciBwbGFuZVxyXG4gICAgXHJcbiAgICBzdGF0aWMgQ3NzQ2xhc3NOYW1lICAgICAgOiBzdHJpbmcgICAgICAgICAgID0gJ0RlcHRoQnVmZmVyRmFjdG9yeSc7ICAgICAvLyBDU1MgY2xhc3NcclxuICAgIHN0YXRpYyBSb290Q29udGFpbmVySWQgICA6IHN0cmluZyAgICAgICAgICAgPSAncm9vdENvbnRhaW5lcic7ICAgICAgICAgIC8vIHJvb3QgY29udGFpbmVyIGZvciB2aWV3ZXJzXHJcbiAgICBcclxuICAgIF9zY2VuZSAgICAgICAgICAgOiBUSFJFRS5TY2VuZSAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gdGFyZ2V0IHNjZW5lXHJcbiAgICBfbW9kZWwgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHRhcmdldCBtb2RlbFxyXG5cclxuICAgIF9yZW5kZXJlciAgICAgICAgOiBUSFJFRS5XZWJHTFJlbmRlcmVyICAgICAgPSBudWxsOyAgICAgLy8gc2NlbmUgcmVuZGVyZXJcclxuICAgIF9jYW52YXMgICAgICAgICAgOiBIVE1MQ2FudmFzRWxlbWVudCAgICAgICAgPSBudWxsOyAgICAgLy8gRE9NIGNhbnZhcyBzdXBwb3J0aW5nIHJlbmRlcmVyXHJcbiAgICBfd2lkdGggICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgID0gRGVwdGhCdWZmZXJGYWN0b3J5LkRlZmF1bHRSZXNvbHV0aW9uOyAgICAgLy8gd2lkdGggcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuICAgIF9oZWlnaHQgICAgICAgICAgOiBudW1iZXIgICAgICAgICAgICAgICAgICAgPSBEZXB0aEJ1ZmZlckZhY3RvcnkuRGVmYXVsdFJlc29sdXRpb247ICAgICAvLyBoZWlnaHQgcmVzb2x1dGlvbiBvZiB0aGUgREJcclxuXHJcbiAgICBfY2FtZXJhICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgID0gbnVsbDsgICAgIC8vIHBlcnNwZWN0aXZlIGNhbWVyYSB0byBnZW5lcmF0ZSB0aGUgZGVwdGggYnVmZmVyXHJcblxyXG5cclxuICAgIF9sb2dEZXB0aEJ1ZmZlciAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdXNlIGEgbG9nYXJpdGhtaWMgYnVmZmVyIGZvciBtb3JlIGFjY3VyYWN5IGluIGxhcmdlIHNjZW5lc1xyXG4gICAgX2JvdW5kZWRDbGlwcGluZyA6IGJvb2xlYW4gICAgICAgICAgICAgICAgICA9IHRydWU7ICAgICAvLyBvdmVycmlkZSBjYW1lcmEgY2xpcHBpbmcgcGxhbmVzOyBzZXQgbmVhciBhbmQgZmFyIHRvIGJvdW5kIG1vZGVsIGZvciBpbXByb3ZlZCBhY2N1cmFjeVxyXG5cclxuICAgIF9kZXB0aEJ1ZmZlciAgICAgOiBEZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSBudWxsOyAgICAgLy8gZGVwdGggYnVmZmVyIFxyXG4gICAgX3RhcmdldCAgICAgICAgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBjcmVhdGluZyB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHdoZW4gcmVuZGVyaW5nIHRoZSBzY2VuZVxyXG4gICAgX2VuY29kZWRUYXJnZXQgICA6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0ICA9IG51bGw7ICAgICAvLyBXZWJHTCByZW5kZXIgdGFyZ2V0IGZvciBlbmNvZGluIHRoZSBXZWJHTCBkZXB0aCBidWZmZXIgaW50byBhIGZsb2F0aW5nIHBvaW50IChSR0JBIGZvcm1hdClcclxuXHJcbiAgICBfcG9zdFNjZW5lICAgICAgIDogVEhSRUUuU2NlbmUgICAgICAgICAgICAgID0gbnVsbDsgICAgIC8vIHNpbmdsZSBwb2x5Z29uIHNjZW5lIHVzZSB0byBnZW5lcmF0ZSB0aGUgZW5jb2RlZCBSR0JBIGJ1ZmZlclxyXG4gICAgX3Bvc3RDYW1lcmEgICAgICA6IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSA9IG51bGw7ICAgICAvLyBvcnRob2dyYXBoaWMgY2FtZXJhXHJcbiAgICBfcG9zdE1hdGVyaWFsICAgIDogVEhSRUUuU2hhZGVyTWF0ZXJpYWwgICAgID0gbnVsbDsgICAgIC8vIHNoYWRlciBtYXRlcmlhbCB0aGF0IGVuY29kZXMgdGhlIFdlYkdMIGRlcHRoIGJ1ZmZlciBpbnRvIGEgZmxvYXRpbmcgcG9pbnQgUkdCQSBmb3JtYXRcclxuXHJcbiAgICBfbWluaW11bVdlYkdMICAgIDogYm9vbGVhbiAgICAgICAgICAgICAgICAgID0gdHJ1ZTsgICAgIC8vIHRydWUgaWYgbWluaW11bSBXZUdMIHJlcXVpcmVtZW50cyBhcmUgcHJlc2VudFxyXG4gICAgX2xvZ2dlciAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICA9IG51bGw7ICAgICAvLyBsb2dnZXJcclxuICAgIF9hZGRDYW52YXNUb0RPTSAgOiBib29sZWFuICAgICAgICAgICAgICAgICAgPSBmYWxzZTsgICAgLy8gdmlzaWJsZSBjYW52YXM7IGFkZCB0byBIVE1MIHBhZ2VcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgSW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyAoRGVwdGhCdWZmZXJGYWN0b3J5UGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVycyA6IERlcHRoQnVmZmVyRmFjdG9yeVBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgLy8gcmVxdWlyZWRcclxuICAgICAgICB0aGlzLl93aWR0aCAgICAgICAgICAgPSBwYXJhbWV0ZXJzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAgICAgICAgICA9IHBhcmFtZXRlcnMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX21vZGVsICAgICAgICAgICA9IHBhcmFtZXRlcnMubW9kZWwuY2xvbmUodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhICAgICAgICAgID0gcGFyYW1ldGVycy5jYW1lcmEgICAgICAgICAgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLl9sb2dEZXB0aEJ1ZmZlciAgPSBwYXJhbWV0ZXJzLmxvZ0RlcHRoQnVmZmVyICB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ib3VuZGVkQ2xpcHBpbmcgPSBwYXJhbWV0ZXJzLmJvdW5kZWRDbGlwcGluZyB8fCB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2FkZENhbnZhc1RvRE9NICA9IHBhcmFtZXRlcnMuYWRkQ2FudmFzVG9ET00gIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSB0aGlzLmluaXRpYWxpemVDYW52YXMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVmVyaWZpZXMgdGhlIG1pbmltdW0gV2ViR0wgZXh0ZW5zaW9ucyBhcmUgcHJlc2VudC5cclxuICAgICAqIEBwYXJhbSByZW5kZXJlciBXZWJHTCByZW5kZXJlci5cclxuICAgICAqL1xyXG4gICAgdmVyaWZ5V2ViR0xFeHRlbnNpb25zKCkgOiBib29sZWFuIHsgXHJcbiAgICBcclxuICAgICAgICBpZiAoIXRoaXMuX3JlbmRlcmVyLmV4dGVuc2lvbnMuZ2V0KCdXRUJHTF9kZXB0aF90ZXh0dXJlJykpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWluaW11bVdlYkdMID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoJ1RoZSBtaW5pbXVtIFdlYkdMIGV4dGVuc2lvbnMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXIuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlIGEgbW91c2UgZG93biBldmVudCBvbiB0aGUgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBvbk1vdXNlRG93bihldmVudCA6IEpRdWVyeUV2ZW50T2JqZWN0KSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgZGV2aWNlQ29vcmRpbmF0ZXMgOiBUSFJFRS5WZWN0b3IyID0gR3JhcGhpY3MuZGV2aWNlQ29vcmRpbmF0ZXNGcm9tSlFFdmVudChldmVudCwgJChldmVudC50YXJnZXQpKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYGRldmljZSA9ICR7ZGV2aWNlQ29vcmRpbmF0ZXMueH0sICR7ZGV2aWNlQ29vcmRpbmF0ZXMueX1gKTtcclxuXHJcbiAgICAgICAgbGV0IGRlY2ltYWxQbGFjZXMgICA6IG51bWJlciA9IDI7XHJcbiAgICAgICAgbGV0IHJvdyAgICAgICAgICAgICA6IG51bWJlciA9IChkZXZpY2VDb29yZGluYXRlcy55ICsgMSkgLyAyICogdGhpcy5fZGVwdGhCdWZmZXIuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBjb2x1bW4gICAgICAgICAgOiBudW1iZXIgPSAoZGV2aWNlQ29vcmRpbmF0ZXMueCArIDEpIC8gMiAqIHRoaXMuX2RlcHRoQnVmZmVyLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRJbmZvTWVzc2FnZShgT2Zmc2V0ID0gWyR7cm93fSwgJHtjb2x1bW59XWApOyAgICAgICBcclxuICAgICAgICB0aGlzLl9sb2dnZXIuYWRkSW5mb01lc3NhZ2UoYERlcHRoID0gJHt0aGlzLl9kZXB0aEJ1ZmZlci5kZXB0aChyb3csIGNvbHVtbikudG9GaXhlZChkZWNpbWFsUGxhY2VzKX1gKTsgICAgICAgXHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSBXZWJHTCB0YXJnZXQgY2FudmFzLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FudmFzKCkgOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICBcclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMuc2V0QXR0cmlidXRlKCduYW1lJywgVG9vbHMuZ2VuZXJhdGVQc2V1ZG9HVUlEKCkpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgRGVwdGhCdWZmZXJGYWN0b3J5LkNzc0NsYXNzTmFtZSk7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciBkaW1lbnNpb25zICAgIFxyXG4gICAgICAgIHRoaXMuX2NhbnZhcy53aWR0aCAgPSB0aGlzLl93aWR0aDtcclxuICAgICAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0OyBcclxuXHJcbiAgICAgICAgLy8gRE9NIGVsZW1lbnQgZGltZW5zaW9ucyAobWF5IGJlIGRpZmZlcmVudCB0aGFuIHJlbmRlciBkaW1lbnNpb25zKVxyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS53aWR0aCAgPSBgJHt0aGlzLl93aWR0aH1weGA7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuX2hlaWdodH1weGA7XHJcblxyXG4gICAgICAgIC8vIGFkZCB0byBET00/XHJcbiAgICAgICAgaWYgKHRoaXMuX2FkZENhbnZhc1RvRE9NKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtEZXB0aEJ1ZmZlckZhY3RvcnkuUm9vdENvbnRhaW5lcklkfWApLmFwcGVuZENoaWxkKHRoaXMuX2NhbnZhcyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgJGNhbnZhcyA9ICQodGhpcy5fY2FudmFzKS5vbignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uIG9mIHRoZSByZW5kZXIgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTY2VuZSAoKSA6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsKVxyXG4gICAgICAgICAgICB0aGlzLl9zY2VuZS5hZGQodGhpcy5fbW9kZWwpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZyh0aGlzLl9zY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSAgbW9kZWwgdmlldy5cclxuICAgICAqL1xyXG4gICAgIGluaXRpYWxpemVSZW5kZXJlcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigge2NhbnZhcyA6IHRoaXMuX2NhbnZhcywgbG9nYXJpdGhtaWNEZXB0aEJ1ZmZlciA6IHRoaXMuX2xvZ0RlcHRoQnVmZmVyfSk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gTW9kZWwgU2NlbmUgLT4gKFJlbmRlciBUZXh0dXJlLCBEZXB0aCBUZXh0dXJlKVxyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRoaXMuY29uc3RydWN0RGVwdGhUZXh0dXJlUmVuZGVyVGFyZ2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEVuY29kZWQgUkdCQSBUZXh0dXJlIGZyb20gRGVwdGggVGV4dHVyZVxyXG4gICAgICAgIHRoaXMuX2VuY29kZWRUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcblxyXG4gICAgICAgIHRoaXMudmVyaWZ5V2ViR0xFeHRlbnNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGRlZmF1bHQgbGlnaHRpbmcgaW4gdGhlIHNjZW5lLlxyXG4gICAgICogTGlnaHRpbmcgZG9lcyBub3QgYWZmZWN0IHRoZSBkZXB0aCBidWZmZXIuIEl0IGlzIG9ubHkgdXNlZCBpZiB0aGUgY2FudmFzIGlzIG1hZGUgdmlzaWJsZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nIChzY2VuZSA6IFRIUkVFLlNjZW5lKSA6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC4yKTtcclxuICAgICAgICBzY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQxID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQxLnBvc2l0aW9uLnNldCgxLCAxLCAxKTtcclxuICAgICAgICBzY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQcmltYXJ5ICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm0gc2V0dXAgYW5kIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUHJpbWFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3QoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gUG9zdFByb2Nlc3NpbmdcclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIHJlbmRlciB0YXJnZXQgPHdpdGggYSBkZXB0aCB0ZXh0dXJlIGJ1ZmZlcj4uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdERlcHRoVGV4dHVyZVJlbmRlclRhcmdldCgpIDogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQge1xyXG5cclxuICAgICAgICAvLyBNb2RlbCBTY2VuZSAtPiAoUmVuZGVyIFRleHR1cmUsIERlcHRoIFRleHR1cmUpXHJcbiAgICAgICAgbGV0IHJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUuZm9ybWF0ICAgICAgICAgICA9IFRIUkVFLlJHQkFGb3JtYXQ7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUudHlwZSAgICAgICAgICAgICA9IFRIUkVFLlVuc2lnbmVkQnl0ZVR5cGU7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUubWluRmlsdGVyICAgICAgICA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUubWFnRmlsdGVyICAgICAgICA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0LnRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzICA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZW5kZXJUYXJnZXQuc3RlbmNpbEJ1ZmZlciAgICAgICAgICAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aEJ1ZmZlciAgICAgICAgICAgICAgPSB0cnVlO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aFRleHR1cmUgICAgICAgICAgICAgPSBuZXcgVEhSRUUuRGVwdGhUZXh0dXJlKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xyXG4gICAgICAgIHJlbmRlclRhcmdldC5kZXB0aFRleHR1cmUudHlwZSAgICAgICAgPSBUSFJFRS5VbnNpZ25lZEludFR5cGU7XHJcbiAgICBcclxuICAgICAgICByZXR1cm4gcmVuZGVyVGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHBvc3Qgc2NlbmUgdXNlZCB0byBjcmVhdGUgdGhlIGZpbmFsIFJHQkEgZW5jb2RlZCBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0U2NlbmUgKCkgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHBvc3RNZXNoTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2ZXJ0ZXhTaGFkZXI6ICAgTVIuc2hhZGVyU291cmNlWydEZXB0aEJ1ZmZlclZlcnRleFNoYWRlciddLFxyXG4gICAgICAgICAgICBmcmFnbWVudFNoYWRlcjogTVIuc2hhZGVyU291cmNlWydEZXB0aEJ1ZmZlckZyYWdtZW50U2hhZGVyJ10sXHJcblxyXG4gICAgICAgICAgICB1bmlmb3Jtczoge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhTmVhciAgOiAgIHsgdmFsdWU6IHRoaXMuX2NhbWVyYS5uZWFyIH0sXHJcbiAgICAgICAgICAgICAgICBjYW1lcmFGYXIgICA6ICAgeyB2YWx1ZTogdGhpcy5fY2FtZXJhLmZhciB9LFxyXG4gICAgICAgICAgICAgICAgdERpZmZ1c2UgICAgOiAgIHsgdmFsdWU6IHRoaXMuX3RhcmdldC50ZXh0dXJlIH0sXHJcbiAgICAgICAgICAgICAgICB0RGVwdGggICAgICA6ICAgeyB2YWx1ZTogdGhpcy5fdGFyZ2V0LmRlcHRoVGV4dHVyZSB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgcG9zdE1lc2hQbGFuZSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDIsIDIpO1xyXG4gICAgICAgIGxldCBwb3N0TWVzaFF1YWQgID0gbmV3IFRIUkVFLk1lc2gocG9zdE1lc2hQbGFuZSwgcG9zdE1lc2hNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3RTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuX3Bvc3RTY2VuZS5hZGQocG9zdE1lc2hRdWFkKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9zdENhbWVyYSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpZ2h0aW5nKHRoaXMuX3Bvc3RTY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIHRoZSBvcnRob2dyYXBoaWMgY2FtZXJhIHVzZWQgdG8gY29udmVydCB0aGUgV2ViR0wgZGVwdGggYnVmZmVyIHRvIHRoZSBlbmNvZGVkIFJHQkEgYnVmZmVyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0Q2FtZXJhKCkge1xyXG5cclxuICAgICAgICAvLyBTZXR1cCBwb3N0IHByb2Nlc3Npbmcgc3RhZ2VcclxuICAgICAgICBsZXQgbGVmdDogbnVtYmVyICAgICAgPSAgLTE7XHJcbiAgICAgICAgbGV0IHJpZ2h0OiBudW1iZXIgICAgID0gICAxO1xyXG4gICAgICAgIGxldCB0b3A6IG51bWJlciAgICAgICA9ICAgMTtcclxuICAgICAgICBsZXQgYm90dG9tOiBudW1iZXIgICAgPSAgLTE7XHJcbiAgICAgICAgbGV0IG5lYXI6IG51bWJlciAgICAgID0gICAwO1xyXG4gICAgICAgIGxldCBmYXI6IG51bWJlciAgICAgICA9ICAgMTtcclxuXHJcbiAgICAgICAgdGhpcy5fcG9zdENhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybSBzZXR1cCBhbmQgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVQb3N0ICgpIDogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBvc3RDYW1lcmEoKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gR2VuZXJhdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBWZXJpZmllcyB0aGUgcHJlLXJlcXVpc2l0ZSBzZXR0aW5ncyBhcmUgZGVmaW5lZCB0byBjcmVhdGUgYSBtZXNoLlxyXG4gICAgICovXHJcbiAgICB2ZXJpZnlNZXNoU2V0dGluZ3MoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGxldCBtaW5pbXVtU2V0dGluZ3MgOiBib29sZWFuID0gdHJ1ZVxyXG4gICAgICAgIGxldCBlcnJvclByZWZpeCAgICAgOiBzdHJpbmcgPSAnRGVwdGhCdWZmZXJGYWN0b3J5OiAnO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYCR7ZXJyb3JQcmVmaXh9VGhlIG1vZGVsIGlzIG5vdCBkZWZpbmVkLmApO1xyXG4gICAgICAgICAgICBtaW5pbXVtU2V0dGluZ3MgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5hZGRFcnJvck1lc3NhZ2UoYCR7ZXJyb3JQcmVmaXh9VGhlIGNhbWVyYSBpcyBub3QgZGVmaW5lZC5gKTtcclxuICAgICAgICAgICAgbWluaW11bVNldHRpbmdzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWluaW11bVNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhbiBSR0JBIHN0cmluZyB3aXRoIHRoZSBieXRlIHZhbHVlcyBvZiBhIHBpeGVsLlxyXG4gICAgICogQHBhcmFtIGJ1ZmZlciBVbnNpZ25lZCBieXRlIHJhdyBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0gcm93IFBpeGVsIHJvdy5cclxuICAgICAqIEBwYXJhbSBjb2x1bW4gQ29sdW1uIHJvdy5cclxuICAgICAqL1xyXG4gICAgIHVuc2lnbmVkQnl0ZXNUb1JHQkEgKGJ1ZmZlciA6IFVpbnQ4QXJyYXksIHJvdyA6IG51bWJlciwgY29sdW1uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IChyb3cgKiB0aGlzLl93aWR0aCkgKyBjb2x1bW47XHJcbiAgICAgICAgbGV0IHJWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAwXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGdWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAxXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGJWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAyXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgbGV0IGFWYWx1ZSA9IGJ1ZmZlcltvZmZzZXQgKyAzXS50b1N0cmluZygxNik7XHJcblxyXG4gICAgICAgIHJldHVybiBgIyR7clZhbHVlfSR7Z1ZhbHVlfSR7YlZhbHVlfSAke2FWYWx1ZX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZXMgYSBwaXhlbCBmcm9tIGEgcmVuZGVyIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgYW5hbHl6ZVJlbmRlckJ1ZmZlciAoKSB7XHJcblxyXG4gICAgICAgIGxldCByZW5kZXJCdWZmZXIgPSAgbmV3IFVpbnQ4QXJyYXkodGhpcy5fd2lkdGggKiB0aGlzLl9oZWlnaHQgKiA0KS5maWxsKDApO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlYWRSZW5kZXJUYXJnZXRQaXhlbHModGhpcy5fdGFyZ2V0LCAwLCAwLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCByZW5kZXJCdWZmZXIpO1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZVN0cmluZyA9IGBSR0JBWzAsIDBdID0gJHt0aGlzLnVuc2lnbmVkQnl0ZXNUb1JHQkEocmVuZGVyQnVmZmVyLCAwLCAwKX1gO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5hZGRNZXNzYWdlKG1lc3NhZ2VTdHJpbmcsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5hbHl6ZSB0aGUgcmVuZGVyIGFuZCBkZXB0aCB0YXJnZXRzLlxyXG4gICAgICovXHJcbiAgICBhbmFseXplVGFyZ2V0cyAoKSAge1xyXG5cclxuLy8gICAgICB0aGlzLmFuYWx5emVSZW5kZXJCdWZmZXIoKTtcclxuLy8gICAgICB0aGlzLl9kZXB0aEJ1ZmZlci5hbmFseXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkZXB0aCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZURlcHRoQnVmZmVyKCkge1xyXG5cclxuICAgICAgICBsZXQgdGltZXJUYWcgPSBTZXJ2aWNlcy50aW1lci5tYXJrKCdEZXB0aEJ1ZmZlckZhY3RvcnkuY3JlYXRlRGVwdGhCdWZmZXInKTsgICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fc2NlbmUsIHRoaXMuX2NhbWVyYSwgdGhpcy5fdGFyZ2V0KTsgICAgXHJcbiAgICBcclxuICAgICAgICAvLyAob3B0aW9uYWwpIHByZXZpZXcgZW5jb2RlZCBSR0JBIHRleHR1cmU7IGRyYXduIGJ5IHNoYWRlciBidXQgbm90IHBlcnNpc3RlZFxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9wb3N0U2NlbmUsIHRoaXMuX3Bvc3RDYW1lcmEpOyAgICBcclxuXHJcbiAgICAgICAgLy8gUGVyc2lzdCBlbmNvZGVkIFJHQkEgdGV4dHVyZTsgY2FsY3VsYXRlZCBmcm9tIGRlcHRoIGJ1ZmZlclxyXG4gICAgICAgIC8vIGVuY29kZWRUYXJnZXQudGV4dHVyZSAgICAgIDogZW5jb2RlZCBSR0JBIHRleHR1cmVcclxuICAgICAgICAvLyBlbmNvZGVkVGFyZ2V0LmRlcHRoVGV4dHVyZSA6IG51bGxcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fcG9zdFNjZW5lLCB0aGlzLl9wb3N0Q2FtZXJhLCB0aGlzLl9lbmNvZGVkVGFyZ2V0KTsgXHJcblxyXG4gICAgICAgIC8vIGRlY29kZSBSR0JBIHRleHR1cmUgaW50byBkZXB0aCBmbG9hdHNcclxuICAgICAgICBsZXQgZGVwdGhCdWZmZXJSR0JBID0gIG5ldyBVaW50OEFycmF5KHRoaXMuX3dpZHRoICogdGhpcy5faGVpZ2h0ICogNCkuZmlsbCgwKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZWFkUmVuZGVyVGFyZ2V0UGl4ZWxzKHRoaXMuX2VuY29kZWRUYXJnZXQsIDAsIDAsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIGRlcHRoQnVmZmVyUkdCQSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlcHRoQnVmZmVyID0gbmV3IERlcHRoQnVmZmVyKGRlcHRoQnVmZmVyUkdCQSwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgdGhpcy5fY2FtZXJhKTsgICAgXHJcblxyXG4gICAgICAgIHRoaXMuYW5hbHl6ZVRhcmdldHMoKTtcclxuXHJcbiAgICAgICAgU2VydmljZXMudGltZXIubG9nRWxhcHNlZFRpbWUodGltZXJUYWcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNhbWVyYSBjbGlwcGluZyBwbGFuZXMgZm9yIG1lc2ggZ2VuZXJhdGlvbi5cclxuICAgICAqL1xyXG4gICAgc2V0Q2FtZXJhQ2xpcHBpbmdQbGFuZXMgKCkge1xyXG5cclxuICAgICAgICAvLyBjb3B5IGNhbWVyYTsgc2hhcmVkIHdpdGggTW9kZWxWaWV3ZXJcclxuICAgICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XHJcbiAgICAgICAgY2FtZXJhLmNvcHkgKHRoaXMuX2NhbWVyYSk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xyXG5cclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX2NhbWVyYS5tYXRyaXhXb3JsZEludmVyc2U7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94VmlldzogVEhSRUUuQm94MyA9IEdyYXBoaWNzLmdldFRyYW5zZm9ybWVkQm91bmRpbmdCb3godGhpcy5fbW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBib3ggaXMgd29ybGQtYXhpcyBhbGlnbmVkLiBcclxuICAgICAgICAvLyBJbiBWaWV3IGNvb3JkaW5hdGVzLCB0aGUgY2FtZXJhIGlzIGF0IHRoZSBvcmlnaW4uXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIG5lYXIgcGxhbmUgaXMgdGhlIG1heGltdW0gWiBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICAgIC8vIFRoZSBib3VuZGluZyBmYXIgcGxhbmUgaXMgdGhlIG1pbmltdW0gWiBvZiB0aGUgYm91bmRpbmcgYm94LlxyXG4gICAgICAgIGxldCBuZWFyUGxhbmUgPSAtYm91bmRpbmdCb3hWaWV3Lm1heC56O1xyXG4gICAgICAgIGxldCBmYXJQbGFuZSAgPSAtYm91bmRpbmdCb3hWaWV3Lm1pbi56O1xyXG5cclxuICAgICAgICAvLyBhZGp1c3QgYnkgZXBzaWxvbiB0byBhdm9pZCBjbGlwcGluZyBnZW9tZXRyeSBhdCB0aGUgbmVhciBwbGFuZSBlZGdlXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLm5lYXIgPSAoMSAtIERlcHRoQnVmZmVyRmFjdG9yeS5OZWFyUGxhbmVFcHNpbG9uZSkgKiBuZWFyUGxhbmU7XHJcblxyXG4gICAgICAgIC8vIGFsbG93IHVzZXIgdG8gb3ZlcnJpZGUgY2FsY3VsYXRlZCBmYXIgcGxhbmVcclxuICAgICAgICB0aGlzLl9jYW1lcmEuZmFyICA9IE1hdGgubWluKHRoaXMuX2NhbWVyYS5mYXIsIGZhclBsYW5lKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGEgbWVzaCBmcm9tIHRoZSBhY3RpdmUgbW9kZWwgYW5kIGNhbWVyYVxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgR2VuZXJhdGlvbiBwYXJhbWV0ZXJzIChNZXNoR2VuZXJhdGVQYXJhbWV0ZXJzKVxyXG4gICAgICovXHJcbiAgICBtZXNoR2VuZXJhdGUgKHBhcmFtZXRlcnMgOiBNZXNoR2VuZXJhdGVQYXJhbWV0ZXJzKSA6IFRIUkVFLk1lc2gge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghdGhpcy52ZXJpZnlNZXNoU2V0dGluZ3MoKSkgXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLl9ib3VuZGVkQ2xpcHBpbmcpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q2FtZXJhQ2xpcHBpbmdQbGFuZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVEZXB0aEJ1ZmZlcigpO1xyXG4gICAgICAgIGxldCBtZXNoID0gdGhpcy5fZGVwdGhCdWZmZXIubWVzaChwYXJhbWV0ZXJzLm1hdGVyaWFsKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhbiBpbWFnZSBmcm9tIHRoZSBhY3RpdmUgbW9kZWwgYW5kIGNhbWVyYVxyXG4gICAgICogQHBhcmFtIHBhcmFtZXRlcnMgR2VuZXJhdGlvbiBwYXJhbWV0ZXJzIChJbWFnZUdlbmVyYXRlUGFyYW1ldGVycylcclxuICAgICAqL1xyXG4gICAgaW1hZ2VHZW5lcmF0ZSAocGFyYW1ldGVycyA6IEltYWdlR2VuZXJhdGVQYXJhbWV0ZXJzKSA6IFVpbnQ4QXJyYXkge1xyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICBcclxuZXhwb3J0IGludGVyZmFjZSBNUkV2ZW50IHtcclxuXHJcbiAgICB0eXBlICAgIDogRXZlbnRUeXBlO1xyXG4gICAgdGFyZ2V0ICA6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gRXZlbnRUeXBlIHtcclxuXHJcbiAgICBOb25lLFxyXG4gICAgTmV3TW9kZWwsXHJcbiAgICBNZXNoR2VuZXJhdGVcclxufVxyXG5cclxudHlwZSBMaXN0ZW5lciA9IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkO1xyXG50eXBlIExpc3RlbmVyQXJyYXkgPSBMaXN0ZW5lcltdW107ICAvLyBMaXN0ZW5lcltdW0V2ZW50VHlwZV07XHJcblxyXG4vKipcclxuICogRXZlbnQgTWFuYWdlclxyXG4gKiBHZW5lcmFsIGV2ZW50IG1hbmFnZW1lbnQgYW5kIGRpc3BhdGNoaW5nLlxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xyXG5cclxuICAgIF9saXN0ZW5lcnMgOiBMaXN0ZW5lckFycmF5O1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgIC8qXHJcbiAgICAgKiBDcmVhdGVzIEV2ZW50TWFuYWdlciBvYmplY3QuIEl0IG5lZWRzIHRvIGJlIGNhbGxlZCB3aXRoICcuY2FsbCcgdG8gYWRkIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGFuIG9iamVjdC5cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciB0byBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRoYXQgZ2V0cyBhZGRlZC5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdGhhdCBnZXRzIGFkZGVkLlxyXG4gICAgICovXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKHR5cGU6IEV2ZW50VHlwZSwgbGlzdGVuZXI6IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkICk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tFdmVudFR5cGUuTm9uZV0gPSBbXTtcclxuICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgZG9lcyBub3QgZXhpc3Q7IGNyZWF0ZVxyXG4gICAgICAgIGlmIChsaXN0ZW5lcnNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgbGlzdGVuZXJzW3R5cGVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBkbyBub3RoaW5nIGlmIGxpc3RlbmVyIHJlZ2lzdGVyZWRcclxuICAgICAgICBpZiAobGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgLy8gYWRkIG5ldyBsaXN0ZW5lciB0byB0aGlzIGV2ZW50XHJcbiAgICAgICAgICAgIGxpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYSBsaXN0ZW5lciBpcyByZWdpc3RlcmVkIGZvciBhbiBldmVudC5cclxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBjaGVjay5cclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdG8gY2hlY2suLlxyXG4gICAgICovXHJcbiAgICBoYXNFdmVudExpc3RlbmVyKHR5cGU6IEV2ZW50VHlwZSwgbGlzdGVuZXI6IChldmVudDogTVJFdmVudCwgLi4uYXJncyA6IGFueVtdKSA9PiB2b2lkKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIC8vIG5vIGV2ZW50cyAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGV4aXN0cyBhbmQgbGlzdGVuZXIgcmVnaXN0ZXJlZCA9PiB0cnVlXHJcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyc1t0eXBlXSAhPT0gdW5kZWZpbmVkICYmIGxpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLSAxOyAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRoYXQgZ2V0cyByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lciBmdW5jdGlvbiB0aGF0IGdldHMgcmVtb3ZlZC5cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGUsIGxpc3RlbmVyOiAoZXZlbnQ6IE1SRXZlbnQsIC4uLmFyZ3MgOiBhbnlbXSkgPT4gdm9pZCk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHM7IGRvIG5vdGhpbmdcclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSBcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcbiAgICAgICAgbGV0IGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbdHlwZV07XHJcblxyXG4gICAgICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0ZW5lckFycmF5LmluZGV4T2YobGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGlmIGZvdW5kXHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lckFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRmlyZSBhbiBldmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHRhcmdldCBFdmVudCB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBldmVudCB0aGF0IGdldHMgZmlyZWQuXHJcbiAgICAgKi9cclxuICAgIGRpc3BhdGNoRXZlbnQodGFyZ2V0IDogYW55LCBldmVudFR5cGUgOiBFdmVudFR5cGUsIC4uLmFyZ3MgOiBhbnlbXSk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBubyBldmVudHMgZGVmaW5lZDsgZG8gbm90aGluZ1xyXG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGlzdGVuZXJzICAgICA9IHRoaXMuX2xpc3RlbmVyczsgICAgICAgXHJcbiAgICAgICAgbGV0IGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbZXZlbnRUeXBlXTtcclxuXHJcbiAgICAgICAgaWYgKGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRoZUV2ZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZSAgIDogZXZlbnRUeXBlLCAgICAgICAgIC8vIHR5cGVcclxuICAgICAgICAgICAgICAgIHRhcmdldCA6IHRhcmdldCAgICAgICAgICAgICAvLyBzZXQgdGFyZ2V0IHRvIGluc3RhbmNlIHRyaWdnZXJpbmcgdGhlIGV2ZW50XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGR1cGxpY2F0ZSBvcmlnaW5hbCBhcnJheSBvZiBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgbGV0IGFycmF5ID0gbGlzdGVuZXJBcnJheS5zbGljZSgwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdKHRoZUV2ZW50LCAuLi5hcmdzKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFxyXG4vLyBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7U2VydmljZXN9ICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7U3RvcFdhdGNofSAgZnJvbSAnU3RvcFdhdGNoJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE9CSkxvYWRlciAoIG1hbmFnZXIgKSB7XHJcblxyXG4gICAgdGhpcy5tYW5hZ2VyID0gKCBtYW5hZ2VyICE9PSB1bmRlZmluZWQgKSA/IG1hbmFnZXIgOiBUSFJFRS5EZWZhdWx0TG9hZGluZ01hbmFnZXI7XHJcblxyXG4gICAgdGhpcy5tYXRlcmlhbHMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMucmVnZXhwID0ge1xyXG4gICAgICAgIC8vIHYgZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgICAgICB2ZXJ0ZXhfcGF0dGVybiAgICAgICAgICAgOiAvXnZcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKVxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKykvLFxyXG4gICAgICAgIC8vIHZuIGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICAgICAgbm9ybWFsX3BhdHRlcm4gICAgICAgICAgIDogL152blxccysoW1xcZFxcLlxcK1xcLWVFXSspXFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKS8sXHJcbiAgICAgICAgLy8gdnQgZmxvYXQgZmxvYXRcclxuICAgICAgICB1dl9wYXR0ZXJuICAgICAgICAgICAgICAgOiAvXnZ0XFxzKyhbXFxkXFwuXFwrXFwtZUVdKylcXHMrKFtcXGRcXC5cXCtcXC1lRV0rKS8sXHJcbiAgICAgICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgICAgIGZhY2VfdmVydGV4ICAgICAgICAgICAgICA6IC9eZlxccysoLT9cXGQrKVxccysoLT9cXGQrKVxccysoLT9cXGQrKSg/OlxccysoLT9cXGQrKSk/LyxcclxuICAgICAgICAvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2XHJcbiAgICAgICAgZmFjZV92ZXJ0ZXhfdXYgICAgICAgICAgIDogL15mXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbFxyXG4gICAgICAgIGZhY2VfdmVydGV4X3V2X25vcm1hbCAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICAgICAgLy8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbFxyXG4gICAgICAgIGZhY2VfdmVydGV4X25vcm1hbCAgICAgICA6IC9eZlxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspKT8vLFxyXG4gICAgICAgIC8vIG8gb2JqZWN0X25hbWUgfCBnIGdyb3VwX25hbWVcclxuICAgICAgICBvYmplY3RfcGF0dGVybiAgICAgICAgICAgOiAvXltvZ11cXHMqKC4rKT8vLFxyXG4gICAgICAgIC8vIHMgYm9vbGVhblxyXG4gICAgICAgIHNtb290aGluZ19wYXR0ZXJuICAgICAgICA6IC9ec1xccysoXFxkK3xvbnxvZmYpLyxcclxuICAgICAgICAvLyBtdGxsaWIgZmlsZV9yZWZlcmVuY2VcclxuICAgICAgICBtYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4gOiAvXm10bGxpYiAvLFxyXG4gICAgICAgIC8vIHVzZW10bCBtYXRlcmlhbF9uYW1lXHJcbiAgICAgICAgbWF0ZXJpYWxfdXNlX3BhdHRlcm4gICAgIDogL151c2VtdGwgL1xyXG4gICAgfTtcclxuXHJcbn07XHJcblxyXG5PQkpMb2FkZXIucHJvdG90eXBlID0ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yOiBPQkpMb2FkZXIsXHJcblxyXG4gICAgbG9hZDogZnVuY3Rpb24gKCB1cmwsIG9uTG9hZCwgb25Qcm9ncmVzcywgb25FcnJvciApIHtcclxuXHJcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5GaWxlTG9hZGVyKCBzY29wZS5tYW5hZ2VyICk7XHJcbiAgICAgICAgbG9hZGVyLnNldFBhdGgoIHRoaXMucGF0aCApO1xyXG4gICAgICAgIGxvYWRlci5sb2FkKCB1cmwsIGZ1bmN0aW9uICggdGV4dCApIHtcclxuXHJcbiAgICAgICAgICAgIG9uTG9hZCggc2NvcGUucGFyc2UoIHRleHQgKSApO1xyXG5cclxuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yICk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRQYXRoOiBmdW5jdGlvbiAoIHZhbHVlICkge1xyXG5cclxuICAgICAgICB0aGlzLnBhdGggPSB2YWx1ZTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1hdGVyaWFsczogZnVuY3Rpb24gKCBtYXRlcmlhbHMgKSB7XHJcblxyXG4gICAgICAgIHRoaXMubWF0ZXJpYWxzID0gbWF0ZXJpYWxzO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgX2NyZWF0ZVBhcnNlclN0YXRlIDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG9iamVjdHMgIDogW10sXHJcbiAgICAgICAgICAgIG9iamVjdCAgIDoge30sXHJcblxyXG4gICAgICAgICAgICB2ZXJ0aWNlcyA6IFtdLFxyXG4gICAgICAgICAgICBub3JtYWxzICA6IFtdLFxyXG4gICAgICAgICAgICB1dnMgICAgICA6IFtdLFxyXG5cclxuICAgICAgICAgICAgbWF0ZXJpYWxMaWJyYXJpZXMgOiBbXSxcclxuXHJcbiAgICAgICAgICAgIHN0YXJ0T2JqZWN0OiBmdW5jdGlvbiAoIG5hbWUsIGZyb21EZWNsYXJhdGlvbiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBvYmplY3QgKGluaXRpYWwgZnJvbSByZXNldCkgaXMgbm90IGZyb20gYSBnL28gZGVjbGFyYXRpb24gaW4gdGhlIHBhcnNlZFxyXG4gICAgICAgICAgICAgICAgLy8gZmlsZS4gV2UgbmVlZCB0byB1c2UgaXQgZm9yIHRoZSBmaXJzdCBwYXJzZWQgZy9vIHRvIGtlZXAgdGhpbmdzIGluIHN5bmMuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHRoaXMub2JqZWN0LmZyb21EZWNsYXJhdGlvbiA9PT0gZmFsc2UgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Lm5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0LmZyb21EZWNsYXJhdGlvbiA9ICggZnJvbURlY2xhcmF0aW9uICE9PSBmYWxzZSApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzTWF0ZXJpYWwgPSAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwgPT09ICdmdW5jdGlvbicgPyB0aGlzLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwoKSA6IHVuZGVmaW5lZCApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3QuX2ZpbmFsaXplKCB0cnVlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgOiBuYW1lIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyb21EZWNsYXJhdGlvbiA6ICggZnJvbURlY2xhcmF0aW9uICE9PSBmYWxzZSApLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeSA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXZzICAgICAgOiBbXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxzIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgc21vb3RoIDogdHJ1ZSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRNYXRlcmlhbCA6IGZ1bmN0aW9uKCBuYW1lLCBsaWJyYXJpZXMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXMgPSB0aGlzLl9maW5hbGl6ZSggZmFsc2UgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldyB1c2VtdGwgZGVjbGFyYXRpb24gb3ZlcndyaXRlcyBhbiBpbmhlcml0ZWQgbWF0ZXJpYWwsIGV4Y2VwdCBpZiBmYWNlcyB3ZXJlIGRlY2xhcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRoZSBtYXRlcmlhbCwgdGhlbiBpdCBtdXN0IGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHByZXZpb3VzICYmICggcHJldmlvdXMuaW5oZXJpdGVkIHx8IHByZXZpb3VzLmdyb3VwQ291bnQgPD0gMCApICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnNwbGljZSggcHJldmlvdXMuaW5kZXgsIDEgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICAgICAgOiB0aGlzLm1hdGVyaWFscy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG10bGxpYiAgICAgOiAoIEFycmF5LmlzQXJyYXkoIGxpYnJhcmllcyApICYmIGxpYnJhcmllcy5sZW5ndGggPiAwID8gbGlicmFyaWVzWyBsaWJyYXJpZXMubGVuZ3RoIC0gMSBdIDogJycgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtb290aCAgICAgOiAoIHByZXZpb3VzICE9PSB1bmRlZmluZWQgPyBwcmV2aW91cy5zbW9vdGggOiB0aGlzLnNtb290aCApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBTdGFydCA6ICggcHJldmlvdXMgIT09IHVuZGVmaW5lZCA/IHByZXZpb3VzLmdyb3VwRW5kIDogMCApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBDb3VudCA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5oZXJpdGVkICA6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lIDogZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbG9uZWQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICAgICAgOiAoIHR5cGVvZiBpbmRleCA9PT0gJ251bWJlcicgPyBpbmRleCA6IHRoaXMuaW5kZXggKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IHRoaXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXRsbGliICAgICA6IHRoaXMubXRsbGliLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbW9vdGggICAgIDogdGhpcy5zbW9vdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEVuZCAgIDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5oZXJpdGVkICA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVkLmNsb25lID0gdGhpcy5jbG9uZS5iaW5kKGNsb25lZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb25lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goIG1hdGVyaWFsICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRNYXRlcmlhbCA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0ZXJpYWxzWyB0aGlzLm1hdGVyaWFscy5sZW5ndGggLSAxIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF9maW5hbGl6ZSA6IGZ1bmN0aW9uKCBlbmQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdE11bHRpTWF0ZXJpYWwgPSB0aGlzLmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGxhc3RNdWx0aU1hdGVyaWFsICYmIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kID09PSAtMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoIC8gMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwQ291bnQgPSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCAtIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwU3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5pbmhlcml0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElnbm9yZSBvYmplY3RzIHRhaWwgbWF0ZXJpYWxzIGlmIG5vIGZhY2UgZGVjbGFyYXRpb25zIGZvbGxvd2VkIHRoZW0gYmVmb3JlIGEgbmV3IG8vZyBzdGFydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGVuZCAmJiB0aGlzLm1hdGVyaWFscy5sZW5ndGggPiAxICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoIHZhciBtaSA9IHRoaXMubWF0ZXJpYWxzLmxlbmd0aCAtIDE7IG1pID49IDA7IG1pLS0gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFsc1ttaV0uZ3JvdXBDb3VudCA8PSAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5zcGxpY2UoIG1pLCAxICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3VhcmFudGVlIGF0IGxlYXN0IG9uZSBlbXB0eSBtYXRlcmlhbCwgdGhpcyBtYWtlcyB0aGUgY3JlYXRpb24gbGF0ZXIgbW9yZSBzdHJhaWdodCBmb3J3YXJkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGVuZCAmJiB0aGlzLm1hdGVyaWFscy5sZW5ndGggPT09IDAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSAgIDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21vb3RoIDogdGhpcy5zbW9vdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RNdWx0aU1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEluaGVyaXQgcHJldmlvdXMgb2JqZWN0cyBtYXRlcmlhbC5cclxuICAgICAgICAgICAgICAgIC8vIFNwZWMgdGVsbHMgdXMgdGhhdCBhIGRlY2xhcmVkIG1hdGVyaWFsIG11c3QgYmUgc2V0IHRvIGFsbCBvYmplY3RzIHVudGlsIGEgbmV3IG1hdGVyaWFsIGlzIGRlY2xhcmVkLlxyXG4gICAgICAgICAgICAgICAgLy8gSWYgYSB1c2VtdGwgZGVjbGFyYXRpb24gaXMgZW5jb3VudGVyZWQgd2hpbGUgdGhpcyBuZXcgb2JqZWN0IGlzIGJlaW5nIHBhcnNlZCwgaXQgd2lsbFxyXG4gICAgICAgICAgICAgICAgLy8gb3ZlcndyaXRlIHRoZSBpbmhlcml0ZWQgbWF0ZXJpYWwuIEV4Y2VwdGlvbiBiZWluZyB0aGF0IHRoZXJlIHdhcyBhbHJlYWR5IGZhY2UgZGVjbGFyYXRpb25zXHJcbiAgICAgICAgICAgICAgICAvLyB0byB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLCB0aGVuIGl0IHdpbGwgYmUgcHJlc2VydmVkIGZvciBwcm9wZXIgTXVsdGlNYXRlcmlhbCBjb250aW51YXRpb24uXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBwcmV2aW91c01hdGVyaWFsICYmIHByZXZpb3VzTWF0ZXJpYWwubmFtZSAmJiB0eXBlb2YgcHJldmlvdXNNYXRlcmlhbC5jbG9uZSA9PT0gXCJmdW5jdGlvblwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVjbGFyZWQgPSBwcmV2aW91c01hdGVyaWFsLmNsb25lKCAwICk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyZWQuaW5oZXJpdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC5tYXRlcmlhbHMucHVzaCggZGVjbGFyZWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3RzLnB1c2goIHRoaXMub2JqZWN0ICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZmluYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSggdHJ1ZSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBwYXJzZVZlcnRleEluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMyApICogMztcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBwYXJzZU5vcm1hbEluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMyApICogMztcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBwYXJzZVVWSW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAyICkgKiAyO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFZlcnRleDogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAyIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICAgICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAyIF0gKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRWZXJ0ZXhMaW5lOiBmdW5jdGlvbiAoIGEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMudmVydGljZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudmVydGljZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZE5vcm1hbCA6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy5ub3JtYWxzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5Lm5vcm1hbHM7XHJcblxyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDIgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG4gICAgICAgICAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDIgXSApO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFVWOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMudXZzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnV2cztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkVVZMaW5lOiBmdW5jdGlvbiAoIGEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMudXZzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnV2cztcclxuXHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkRmFjZTogZnVuY3Rpb24gKCBhLCBiLCBjLCBkLCB1YSwgdWIsIHVjLCB1ZCwgbmEsIG5iLCBuYywgbmQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaWEgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGEsIHZMZW4gKTtcclxuICAgICAgICAgICAgICAgIHZhciBpYiA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYiwgdkxlbiApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGljID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBjLCB2TGVuICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGQsIHZMZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHVhICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWEgPSB0aGlzLnBhcnNlVVZJbmRleCggdWEsIHV2TGVuICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWIgPSB0aGlzLnBhcnNlVVZJbmRleCggdWIsIHV2TGVuICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWMgPSB0aGlzLnBhcnNlVVZJbmRleCggdWMsIHV2TGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlVVZJbmRleCggdWQsIHV2TGVuICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWKCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVVYoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIG5hICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vcm1hbHMgYXJlIG1hbnkgdGltZXMgdGhlIHNhbWUuIElmIHNvLCBza2lwIGZ1bmN0aW9uIGNhbGwgYW5kIHBhcnNlSW50LlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuTGVuID0gdGhpcy5ub3JtYWxzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBpYSA9IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmEsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWIgPSBuYSA9PT0gbmIgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmIsIG5MZW4gKTtcclxuICAgICAgICAgICAgICAgICAgICBpYyA9IG5hID09PSBuYyA/IGlhIDogdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYywgbkxlbiApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTm9ybWFsKCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmQsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTm9ybWFsKCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTm9ybWFsKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkTGluZUdlb21ldHJ5OiBmdW5jdGlvbiAoIHZlcnRpY2VzLCB1dnMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3QuZ2VvbWV0cnkudHlwZSA9ICdMaW5lJztcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdkxlbiA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgdmFyIHV2TGVuID0gdGhpcy51dnMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoIHZhciB2aSA9IDAsIGwgPSB2ZXJ0aWNlcy5sZW5ndGg7IHZpIDwgbDsgdmkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4TGluZSggdGhpcy5wYXJzZVZlcnRleEluZGV4KCB2ZXJ0aWNlc1sgdmkgXSwgdkxlbiApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoIHZhciB1dmkgPSAwLCBsID0gdXZzLmxlbmd0aDsgdXZpIDwgbDsgdXZpICsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFVWTGluZSggdGhpcy5wYXJzZVVWSW5kZXgoIHV2c1sgdXZpIF0sIHV2TGVuICkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHN0YXRlLnN0YXJ0T2JqZWN0KCAnJywgZmFsc2UgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcGFyc2U6IGZ1bmN0aW9uICggdGV4dCApIHtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyVGFnID0gU2VydmljZXMudGltZXIubWFyaygnT0JKTG9hZGVyLnBhcnNlJyk7ICAgICAgICBcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5fY3JlYXRlUGFyc2VyU3RhdGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCB0ZXh0LmluZGV4T2YoICdcXHJcXG4nICkgIT09IC0gMSApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgZmFzdGVyIHRoYW4gU3RyaW5nLnNwbGl0IHdpdGggcmVnZXggdGhhdCBzcGxpdHMgb24gYm90aFxyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXFxyXFxuL2csICdcXG4nICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB0ZXh0LmluZGV4T2YoICdcXFxcXFxuJyApICE9PSAtIDEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGpvaW4gbGluZXMgc2VwYXJhdGVkIGJ5IGEgbGluZSBjb250aW51YXRpb24gY2hhcmFjdGVyIChcXClcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggL1xcXFxcXG4vZywgJycgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGluZXMgPSB0ZXh0LnNwbGl0KCAnXFxuJyApO1xyXG4gICAgICAgIHZhciBsaW5lID0gJycsIGxpbmVGaXJzdENoYXIgPSAnJywgbGluZVNlY29uZENoYXIgPSAnJztcclxuICAgICAgICB2YXIgbGluZUxlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICAvLyBGYXN0ZXIgdG8ganVzdCB0cmltIGxlZnQgc2lkZSBvZiB0aGUgbGluZS4gVXNlIGlmIGF2YWlsYWJsZS5cclxuICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgIC8vIHZhciB0cmltTGVmdCA9ICggdHlwZW9mICcnLnRyaW1MZWZ0ID09PSAnZnVuY3Rpb24nICk7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICBsaW5lID0gbGluZXNbIGkgXTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgICAgIC8vIGxpbmUgPSB0cmltTGVmdCA/IGxpbmUudHJpbUxlZnQoKSA6IGxpbmUudHJpbSgpO1xyXG4gICAgICAgICAgICBsaW5lID0gbGluZS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBsaW5lTGVuZ3RoID0gbGluZS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpbmVMZW5ndGggPT09IDAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGxpbmVGaXJzdENoYXIgPSBsaW5lLmNoYXJBdCggMCApO1xyXG5cclxuICAgICAgICAgICAgLy8gQHRvZG8gaW52b2tlIHBhc3NlZCBpbiBoYW5kbGVyIGlmIGFueVxyXG4gICAgICAgICAgICBpZiAoIGxpbmVGaXJzdENoYXIgPT09ICcjJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAndicgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGluZVNlY29uZENoYXIgPSBsaW5lLmNoYXJBdCggMSApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbGluZVNlY29uZENoYXIgPT09ICcgJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnZlcnRleF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widiAxLjAgMi4wIDMuMFwiLCBcIjEuMFwiLCBcIjIuMFwiLCBcIjMuMFwiXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ24nICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAubm9ybWFsX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widm4gMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUubm9ybWFscy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ3QnICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAudXZfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMCAgICAgICAgICAgICAgIDEgICAgICAyXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gW1widnQgMC4xIDAuMlwiLCBcIjAuMVwiLCBcIjAuMlwiXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS51dnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgdmVydGV4L25vcm1hbC91diBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggbGluZUZpcnN0Q2hhciA9PT0gXCJmXCIgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4X3V2X25vcm1hbC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgICA3ICAgIDggICAgOSAgIDEwICAgICAgICAgMTEgICAgICAgICAxMlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcImYgMS8xLzEgMi8yLzIgMy8zLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDcgXSwgcmVzdWx0WyAxMCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgOCBdLCByZXN1bHRbIDExIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMyBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA5IF0sIHJlc3VsdFsgMTIgXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91di5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgIDcgICAgICAgICAgOFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFtcImYgMS8xIDIvMiAzLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEvLzEgMi8vMiAzLy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDAgICAgICAgICAgICAxICAgIDIgICAgMyAgIDRcclxuICAgICAgICAgICAgICAgICAgICAvLyBbXCJmIDEgMiAzXCIsIFwiMVwiLCBcIjJcIiwgXCIzXCIsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMiBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA0IF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGZhY2UgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwibFwiICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBsaW5lUGFydHMgPSBsaW5lLnN1YnN0cmluZyggMSApLnRyaW0oKS5zcGxpdCggXCIgXCIgKTtcclxuICAgICAgICAgICAgICAgIHZhciBsaW5lVmVydGljZXMgPSBbXSwgbGluZVVWcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbGluZS5pbmRleE9mKCBcIi9cIiApID09PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVWZXJ0aWNlcyA9IGxpbmVQYXJ0cztcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbGkgPSAwLCBsbGVuID0gbGluZVBhcnRzLmxlbmd0aDsgbGkgPCBsbGVuOyBsaSArKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IGxpbmVQYXJ0c1sgbGkgXS5zcGxpdCggXCIvXCIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcGFydHNbIDAgXSAhPT0gXCJcIiApIGxpbmVWZXJ0aWNlcy5wdXNoKCBwYXJ0c1sgMCBdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcGFydHNbIDEgXSAhPT0gXCJcIiApIGxpbmVVVnMucHVzaCggcGFydHNbIDEgXSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkTGluZUdlb21ldHJ5KCBsaW5lVmVydGljZXMsIGxpbmVVVnMgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAub2JqZWN0X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbyBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgLy8gb3JcclxuICAgICAgICAgICAgICAgIC8vIGcgZ3JvdXBfbmFtZVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFdPUktBUk9VTkQ6IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTI4NjlcclxuICAgICAgICAgICAgICAgIC8vIHZhciBuYW1lID0gcmVzdWx0WyAwIF0uc3Vic3RyKCAxICkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAoIFwiIFwiICsgcmVzdWx0WyAwIF0uc3Vic3RyKCAxICkudHJpbSgpICkuc3Vic3RyKCAxICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUuc3RhcnRPYmplY3QoIG5hbWUgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX3VzZV9wYXR0ZXJuLnRlc3QoIGxpbmUgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYXRlcmlhbFxyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdC5zdGFydE1hdGVyaWFsKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSwgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX2xpYnJhcnlfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbXRsIGZpbGVcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcy5wdXNoKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5zbW9vdGhpbmdfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzbW9vdGggc2hhZGluZ1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEB0b2RvIEhhbmRsZSBmaWxlcyB0aGF0IGhhdmUgdmFyeWluZyBzbW9vdGggdmFsdWVzIGZvciBhIHNldCBvZiBmYWNlcyBpbnNpZGUgb25lIGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgLy8gYnV0IGRvZXMgbm90IGRlZmluZSBhIHVzZW10bCBmb3IgZWFjaCBmYWNlIHNldC5cclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGRldGVjdGVkIGFuZCBhIGR1bW15IG1hdGVyaWFsIGNyZWF0ZWQgKGxhdGVyIE11bHRpTWF0ZXJpYWwgYW5kIGdlb21ldHJ5IGdyb3VwcykuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHJlcXVpcmVzIHNvbWUgY2FyZSB0byBub3QgY3JlYXRlIGV4dHJhIG1hdGVyaWFsIG9uIGVhY2ggc21vb3RoIHZhbHVlIGZvciBcIm5vcm1hbFwiIG9iaiBmaWxlcy5cclxuICAgICAgICAgICAgICAgIC8vIHdoZXJlIGV4cGxpY2l0IHVzZW10bCBkZWZpbmVzIGdlb21ldHJ5IGdyb3Vwcy5cclxuICAgICAgICAgICAgICAgIC8vIEV4YW1wbGUgYXNzZXQ6IGV4YW1wbGVzL21vZGVscy9vYmovY2VyYmVydXMvQ2VyYmVydXMub2JqXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0WyAxIF0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogaHR0cDovL3BhdWxib3Vya2UubmV0L2RhdGFmb3JtYXRzL29iai9cclxuICAgICAgICAgICAgICAgICAqIG9yXHJcbiAgICAgICAgICAgICAgICAgKiBodHRwOi8vd3d3LmNzLnV0YWguZWR1L35ib3Vsb3MvY3MzNTA1L29ial9zcGVjLnBkZlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIEZyb20gY2hhcHRlciBcIkdyb3VwaW5nXCIgU3ludGF4IGV4cGxhbmF0aW9uIFwicyBncm91cF9udW1iZXJcIjpcclxuICAgICAgICAgICAgICAgICAqIFwiZ3JvdXBfbnVtYmVyIGlzIHRoZSBzbW9vdGhpbmcgZ3JvdXAgbnVtYmVyLiBUbyB0dXJuIG9mZiBzbW9vdGhpbmcgZ3JvdXBzLCB1c2UgYSB2YWx1ZSBvZiAwIG9yIG9mZi5cclxuICAgICAgICAgICAgICAgICAqIFBvbHlnb25hbCBlbGVtZW50cyB1c2UgZ3JvdXAgbnVtYmVycyB0byBwdXQgZWxlbWVudHMgaW4gZGlmZmVyZW50IHNtb290aGluZyBncm91cHMuIEZvciBmcmVlLWZvcm1cclxuICAgICAgICAgICAgICAgICAqIHN1cmZhY2VzLCBzbW9vdGhpbmcgZ3JvdXBzIGFyZSBlaXRoZXIgdHVybmVkIG9uIG9yIG9mZjsgdGhlcmUgaXMgbm8gZGlmZmVyZW5jZSBiZXR3ZWVuIHZhbHVlcyBncmVhdGVyXHJcbiAgICAgICAgICAgICAgICAgKiB0aGFuIDAuXCJcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgc3RhdGUub2JqZWN0LnNtb290aCA9ICggdmFsdWUgIT09ICcwJyAmJiB2YWx1ZSAhPT0gJ29mZicgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSBzdGF0ZS5vYmplY3QuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5zbW9vdGggPSBzdGF0ZS5vYmplY3Quc21vb3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIG51bGwgdGVybWluYXRlZCBmaWxlcyB3aXRob3V0IGV4Y2VwdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKCBsaW5lID09PSAnXFwwJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0ZS5maW5hbGl6ZSgpO1xyXG5cclxuICAgICAgICB2YXIgY29udGFpbmVyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgLy8gTW9kZWxSZWxpZWZcclxuICAgICAgICAvL2NvbnRhaW5lci5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuICAgICAgICAoPGFueT5jb250YWluZXIpLm1hdGVyaWFsTGlicmFyaWVzID0gW10uY29uY2F0KCBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcyApO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBzdGF0ZS5vYmplY3RzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gc3RhdGUub2JqZWN0c1sgaSBdO1xyXG4gICAgICAgICAgICB2YXIgZ2VvbWV0cnkgPSBvYmplY3QuZ2VvbWV0cnk7XHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbHMgPSBvYmplY3QubWF0ZXJpYWxzO1xyXG4gICAgICAgICAgICB2YXIgaXNMaW5lID0gKCBnZW9tZXRyeS50eXBlID09PSAnTGluZScgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNraXAgby9nIGxpbmUgZGVjbGFyYXRpb25zIHRoYXQgZGlkIG5vdCBmb2xsb3cgd2l0aCBhbnkgZmFjZXNcclxuICAgICAgICAgICAgaWYgKCBnZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGggPT09IDAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidWZmZXJnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cclxuICAgICAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS52ZXJ0aWNlcyApLCAzICkgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggZ2VvbWV0cnkubm9ybWFscy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ25vcm1hbCcsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5Lm5vcm1hbHMgKSwgMyApICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdlb21ldHJ5LnV2cy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3V2JywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudXZzICksIDIgKSApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1hdGVyaWFsc1xyXG4gICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAvL3ZhciBjcmVhdGVkTWF0ZXJpYWxzID0gW107ICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGNyZWF0ZWRNYXRlcmlhbHMgOiBUSFJFRS5NYXRlcmlhbFtdID0gW107ICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGZvciAoIHZhciBtaSA9IDAsIG1pTGVuID0gbWF0ZXJpYWxzLmxlbmd0aDsgbWkgPCBtaUxlbiA7IG1pKysgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWxzLmNyZWF0ZSggc291cmNlTWF0ZXJpYWwubmFtZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtdGwgZXRjLiBsb2FkZXJzIHByb2JhYmx5IGNhbid0IGNyZWF0ZSBsaW5lIG1hdGVyaWFscyBjb3JyZWN0bHksIGNvcHkgcHJvcGVydGllcyB0byBhIGxpbmUgbWF0ZXJpYWwuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpc0xpbmUgJiYgbWF0ZXJpYWwgJiYgISAoIG1hdGVyaWFsIGluc3RhbmNlb2YgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbExpbmUgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxMaW5lLmNvcHkoIG1hdGVyaWFsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gbWF0ZXJpYWxMaW5lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggISBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCkgOiBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoKSApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLm5hbWUgPSBzb3VyY2VNYXRlcmlhbC5uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5zaGFkaW5nID0gc291cmNlTWF0ZXJpYWwuc21vb3RoID8gVEhSRUUuU21vb3RoU2hhZGluZyA6IFRIUkVFLkZsYXRTaGFkaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRNYXRlcmlhbHMucHVzaChtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbWVzaFxyXG5cclxuICAgICAgICAgICAgdmFyIG1lc2g7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGNyZWF0ZWRNYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEdyb3VwKCBzb3VyY2VNYXRlcmlhbC5ncm91cFN0YXJ0LCBzb3VyY2VNYXRlcmlhbC5ncm91cENvdW50LCBtaSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIE1vZGVsUmVsaWVmXHJcbiAgICAgICAgICAgICAgICAvL21lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzICkgOiBuZXcgVEhSRUUuTGluZVNlZ21lbnRzKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFscyApICk7XHJcbiAgICAgICAgICAgICAgICBtZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1swXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIG51bGwgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNb2RlbFJlbGllZlxyXG4gICAgICAgICAgICAgICAgLy9tZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1sgMCBdICkgOiBuZXcgVEhSRUUuTGluZVNlZ21lbnRzKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlTWF0ZXJpYWxzKSApO1xyXG4gICAgICAgICAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmVTZWdtZW50cyggYnVmZmVyZ2VvbWV0cnksIG51bGwpICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1lc2gubmFtZSA9IG9iamVjdC5uYW1lO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLmFkZCggbWVzaCApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLnRpbWVyLmxvZ0VsYXBzZWRUaW1lKHRpbWVyVGFnKTtcclxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgZnJvbSBcIkNhbWVyYVwiXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgZnJvbSBcIkdyYXBoaWNzXCJcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJWaWV3ZXJcIlxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBDYW1lcmFDb250cm9sc1xyXG4gKi9cclxuY2xhc3MgQ2FtZXJhU2V0dGluZ3Mge1xyXG5cclxuICAgIGZpdFZpZXcgICAgICAgICAgICA6ICgpID0+IHZvaWQ7XHJcbiAgICBhZGRDYW1lcmFIZWxwZXIgICAgOiAoKSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBzdGFuZGFyZFZpZXcgICAgICAgOiBTdGFuZGFyZFZpZXc7XHJcbiAgICBuZWFyQ2xpcHBpbmdQbGFuZSAgOiBudW1iZXI7XHJcbiAgICBmYXJDbGlwcGluZ1BsYW5lICAgOiBudW1iZXI7XHJcbiAgICBmaWVsZE9mVmlldyAgICAgICAgOiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEsIGZpdFZpZXcgOiAoKSA9PiBhbnksIGFkZEN3bWVyYUhlbHBlciA6ICgpID0+IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLmZpdFZpZXcgICAgICAgICA9IGZpdFZpZXc7XHJcbiAgICAgICAgdGhpcy5hZGRDYW1lcmFIZWxwZXIgPSBhZGRDd21lcmFIZWxwZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdGFuZGFyZFZpZXcgICAgICA9IFN0YW5kYXJkVmlldy5Gcm9udDtcclxuICAgICAgICB0aGlzLm5lYXJDbGlwcGluZ1BsYW5lID0gY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5mYXJDbGlwcGluZ1BsYW5lICA9IGNhbWVyYS5mYXI7XHJcbiAgICAgICAgdGhpcy5maWVsZE9mVmlldyAgICAgICA9IGNhbWVyYS5mb3Y7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBjYW1lcmEgVUkgQ29udHJvbHMuXHJcbiAqLyAgICBcclxuZXhwb3J0IGNsYXNzIENhbWVyYUNvbnRyb2xzIHtcclxuXHJcbiAgICBfdmlld2VyICAgICAgICAgOiBWaWV3ZXI7ICAgICAgICAgICAgICAgICAgICAgLy8gYXNzb2NpYXRlZCB2aWV3ZXJcclxuICAgIF9jYW1lcmFTZXR0aW5ncyA6IENhbWVyYVNldHRpbmdzOyAgICAgICAgICAgICAvLyBVSSBzZXR0aW5nc1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgQ2FtZXJhQ29udHJvbHNcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih2aWV3ZXIgOiBWaWV3ZXIpIHsgIFxyXG5cclxuICAgICAgICB0aGlzLl92aWV3ZXIgPSB2aWV3ZXI7XHJcblxyXG4gICAgICAgIC8vIFVJIENvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ29udHJvbHMoKTtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4gICAgLyoqXHJcbiAgICAgKiBGaXRzIHRoZSBhY3RpdmUgdmlldy5cclxuICAgICAqL1xyXG4gICAgZml0VmlldygpIDogdm9pZCB7IFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5maXRWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgY2FtZXJhIHZpc3VhbGl6YXRpb24gZ3JhcGhpYyB0byB0aGUgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGFkZENhbWVyYUhlbHBlcigpIDogdm9pZCB7IFxyXG4gICAgICAgIFxyXG4gICAgICAgIEdyYXBoaWNzLmFkZENhbWVyYUhlbHBlcih0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLl92aWV3ZXIuX3NjZW5lLCB0aGlzLl92aWV3ZXIubW9kZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdmlldyBzZXR0aW5ncyB0aGF0IGFyZSBjb250cm9sbGFibGUgYnkgdGhlIHVzZXJcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncyA9IG5ldyBDYW1lcmFTZXR0aW5ncyh0aGlzLl92aWV3ZXIuY2FtZXJhLCB0aGlzLmZpdFZpZXcuYmluZCh0aGlzKSwgdGhpcy5hZGRDYW1lcmFIZWxwZXIuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIGxldCBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IG1lbnVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLl92aWV3ZXIuY29udGFpbmVySWQpO1xyXG4gICAgICAgIG1lbnVEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FtZXJhICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICBsZXQgY2FtZXJhT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ0NhbWVyYSBPcHRpb25zJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRml0IFZpZXdcclxuICAgICAgICBsZXQgY29udHJvbEZpdFZpZXcgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ2ZpdFZpZXcnKS5uYW1lKCdGaXQgVmlldycpO1xyXG5cclxuICAgICAgICAvLyBDYW1lcmFIZWxwZXJcclxuICAgICAgICBsZXQgY29udHJvbENhbWVyYUhlbHBlciA9IGNhbWVyYU9wdGlvbnMuYWRkKHRoaXMuX2NhbWVyYVNldHRpbmdzLCAnYWRkQ2FtZXJhSGVscGVyJykubmFtZSgnQ2FtZXJhIEhlbHBlcicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFN0YW5kYXJkIFZpZXdzXHJcbiAgICAgICAgbGV0IHZpZXdPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBGcm9udCAgICAgICA6IFN0YW5kYXJkVmlldy5Gcm9udCxcclxuICAgICAgICAgICAgQmFjayAgICAgICAgOiBTdGFuZGFyZFZpZXcuQmFjayxcclxuICAgICAgICAgICAgVG9wICAgICAgICAgOiBTdGFuZGFyZFZpZXcuVG9wLFxyXG4gICAgICAgICAgICBJc29tZXRyaWMgICA6IFN0YW5kYXJkVmlldy5Jc29tZXRyaWMsXHJcbiAgICAgICAgICAgIExlZnQgICAgICAgIDogU3RhbmRhcmRWaWV3LkxlZnQsXHJcbiAgICAgICAgICAgIFJpZ2h0ICAgICAgIDogU3RhbmRhcmRWaWV3LlJpZ2h0LFxyXG4gICAgICAgICAgICBCb3R0b20gICAgICA6IFN0YW5kYXJkVmlldy5Cb3R0b21cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgY29udHJvbFN0YW5kYXJkVmlld3MgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ3N0YW5kYXJkVmlldycsIHZpZXdPcHRpb25zKS5uYW1lKCdTdGFuZGFyZCBWaWV3JykubGlzdGVuKCk7XHJcbiAgICAgICAgY29udHJvbFN0YW5kYXJkVmlld3Mub25DaGFuZ2UgKCh2aWV3U2V0dGluZyA6IHN0cmluZykgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IHZpZXcgOiBTdGFuZGFyZFZpZXcgPSBwYXJzZUludCh2aWV3U2V0dGluZywgMTApO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLnNldENhbWVyYVRvU3RhbmRhcmRWaWV3KHZpZXcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBOZWFyIENsaXBwaW5nIFBsYW5lXHJcbiAgICAgICAgbGV0IG1pbmltdW0gID0gICAwLjE7XHJcbiAgICAgICAgbGV0IG1heGltdW0gID0gMTAwO1xyXG4gICAgICAgIGxldCBzdGVwU2l6ZSA9ICAgMC4xO1xyXG4gICAgICAgIGxldCBjb250cm9sTmVhckNsaXBwaW5nUGxhbmUgPSBjYW1lcmFPcHRpb25zLmFkZCh0aGlzLl9jYW1lcmFTZXR0aW5ncywgJ25lYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnTmVhciBDbGlwcGluZyBQbGFuZScpLm1pbihtaW5pbXVtKS5tYXgobWF4aW11bSkuc3RlcChzdGVwU2l6ZSkubGlzdGVuKCk7XHJcbiAgICAgICAgY29udHJvbE5lYXJDbGlwcGluZ1BsYW5lLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLm5lYXIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEZhciBDbGlwcGluZyBQbGFuZVxyXG4gICAgICAgIG1pbmltdW0gID0gICAgIDE7XHJcbiAgICAgICAgbWF4aW11bSAgPSAxMDAwMDtcclxuICAgICAgICBzdGVwU2l6ZSA9ICAgICAwLjE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGYXJDbGlwcGluZ1BsYW5lID0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdmYXJDbGlwcGluZ1BsYW5lJykubmFtZSgnRmFyIENsaXBwaW5nIFBsYW5lJykubWluKG1pbmltdW0pLm1heChtYXhpbXVtKS5zdGVwKHN0ZXBTaXplKS5saXN0ZW4oKTs7XHJcbiAgICAgICAgY29udHJvbEZhckNsaXBwaW5nUGxhbmUub25DaGFuZ2UgKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuX3ZpZXdlci5jYW1lcmEuZmFyID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBGaWVsZCBvZiBWaWV3XHJcbiAgICAgICAgbWluaW11bSAgPSAyNTtcclxuICAgICAgICBtYXhpbXVtICA9IDc1O1xyXG4gICAgICAgIHN0ZXBTaXplID0gIDE7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xGaWVsZE9mVmlldz0gY2FtZXJhT3B0aW9ucy5hZGQodGhpcy5fY2FtZXJhU2V0dGluZ3MsICdmaWVsZE9mVmlldycpLm5hbWUoJ0ZpZWxkIG9mIFZpZXcnKS5taW4obWluaW11bSkubWF4KG1heGltdW0pLnN0ZXAoc3RlcFNpemUpLmxpc3RlbigpOztcclxuICAgICAgICBjb250cm9sRmllbGRPZlZpZXcgLm9uQ2hhbmdlIChmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLl92aWV3ZXIuY2FtZXJhLmZvdiA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzY29wZS5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgY2FtZXJhT3B0aW9ucy5vcGVuKCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3luY2hyb25pemUgdGhlIFVJIGNhbWVyYSBzZXR0aW5ncyB3aXRoIHRoZSB0YXJnZXQgY2FtZXJhLlxyXG4gICAgICogQHBhcmFtIGNhbWVyYSBcclxuICAgICAqL1xyXG4gICAgc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncyAodmlldz8gOiBTdGFuZGFyZFZpZXcpIHtcclxuXHJcbiAgICAgICAgaWYgKHZpZXcpXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYVNldHRpbmdzLnN0YW5kYXJkVmlldyA9IHZpZXc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fY2FtZXJhU2V0dGluZ3MubmVhckNsaXBwaW5nUGxhbmUgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm5lYXI7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhU2V0dGluZ3MuZmFyQ2xpcHBpbmdQbGFuZSAgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLmZhcjtcclxuICAgICAgICB0aGlzLl9jYW1lcmFTZXR0aW5ncy5maWVsZE9mVmlldyAgICAgICA9IHRoaXMuX3ZpZXdlci5jYW1lcmEuZm92O1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcbiAgICAgICAgICBcclxuLyoqXHJcbiAqIE1hdGVyaWFsc1xyXG4gKiBHZW5lcmFsIFRIUkVFLmpzIE1hdGVyaWFsIGNsYXNzZXMgYW5kIGhlbHBlcnNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBNYXRlcmlhbHNcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdGV4dHVyZSBtYXRlcmlhbCBmcm9tIGFuIGltYWdlIFVSTC5cclxuICAgICAqIEBwYXJhbSBpbWFnZSBJbWFnZSB0byB1c2UgaW4gdGV4dHVyZS5cclxuICAgICAqIEByZXR1cm5zIFRleHR1cmUgbWF0ZXJpYWwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVUZXh0dXJlTWF0ZXJpYWwgKGltYWdlIDogSFRNTEltYWdlRWxlbWVudCkgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciB0ZXh0dXJlICAgICAgICAgOiBUSFJFRS5UZXh0dXJlLFxyXG4gICAgICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwgOiBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShpbWFnZSk7XHJcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSAgICAgPSB0cnVlO1xyXG4gICAgICAgIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIG1hZ25pZmljYXRpb24gYW5kIG1pbmlmaWNhdGlvbiBmaWx0ZXJzIHNhbXBsZSB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMgd2hlbiBtYXBwaW5nIHRvIGEgcGl4ZWwuXHJcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyOyAgICAgLy8gVGhlIGRlZmF1bHQgbW9kZXMgb3ZlcnNhbXBsZSB3aGljaCBsZWFkcyB0byBibGVuZGluZyB3aXRoIHRoZSBibGFjayBiYWNrZ3JvdW5kLiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHByb2R1Y2VzIGNvbG9yZWQgKGJsYWNrKSBhcnRpZmFjdHMgYXJvdW5kIHRoZSBlZGdlcyBvZiB0aGUgdGV4dHVyZSBtYXAgZWxlbWVudHMuXHJcbiAgICAgICAgdGV4dHVyZS5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAsIDEuMCk7XHJcblxyXG4gICAgICAgIHRleHR1cmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge21hcDogdGV4dHVyZX0gKTtcclxuICAgICAgICB0ZXh0dXJlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGV4dHVyZU1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIENyZWF0ZSBhIGJ1bXAgbWFwIFBob25nIG1hdGVyaWFsIGZyb20gYSB0ZXh0dXJlIG1hcC5cclxuICAgICAqIEBwYXJhbSBkZXNpZ25UZXh0dXJlIEJ1bXAgbWFwIHRleHR1cmUuXHJcbiAgICAgKiBAcmV0dXJucyBQaG9uZyBidW1wIG1hcHBlZCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZU1lc2hQaG9uZ01hdGVyaWFsKGRlc2lnblRleHR1cmUgOiBUSFJFRS5UZXh0dXJlKSAgOiBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA6IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgIGNvbG9yICAgOiAweGZmZmZmZixcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBidW1wTWFwICAgOiBkZXNpZ25UZXh0dXJlLFxyXG4gICAgICAgICAgICBidW1wU2NhbGUgOiAtMS4wLFxyXG5cclxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuU21vb3RoU2hhZGluZyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgdHJhbnNwYXJlbnQgbWF0ZXJpYWwuXHJcbiAgICAgKiBAcmV0dXJucyBUcmFuc3BhcmVudCBtYXRlcmlhbC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVRyYW5zcGFyZW50TWF0ZXJpYWwoKSAgOiBUSFJFRS5NYXRlcmlhbCB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yIDogMHgwMDAwMDAsIG9wYWNpdHkgOiAwLjAsIHRyYW5zcGFyZW50IDogdHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcbn1cclxuIiwiLyoqXG4gKiBAYXV0aG9yIEViZXJoYXJkIEdyYWV0aGVyIC8gaHR0cDovL2VncmFldGhlci5jb20vXG4gKiBAYXV0aG9yIE1hcmsgTHVuZGluIFx0LyBodHRwOi8vbWFyay1sdW5kaW4uY29tXG4gKiBAYXV0aG9yIFNpbW9uZSBNYW5pbmkgLyBodHRwOi8vZGFyb24xMzM3LmdpdGh1Yi5pb1xuICogQGF1dGhvciBMdWNhIEFudGlnYSBcdC8gaHR0cDovL2xhbnRpZ2EuZ2l0aHViLmlvXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnO1xuXG5leHBvcnQgZnVuY3Rpb24gVHJhY2tiYWxsQ29udHJvbHMgKCBvYmplY3QsIGRvbUVsZW1lbnQgKSB7XG5cblx0dmFyIF90aGlzID0gdGhpcztcblx0dmFyIFNUQVRFID0geyBOT05FOiAtIDEsIFJPVEFURTogMCwgWk9PTTogMSwgUEFOOiAyLCBUT1VDSF9ST1RBVEU6IDMsIFRPVUNIX1pPT01fUEFOOiA0IH07XG5cblx0dGhpcy5vYmplY3QgPSBvYmplY3Q7XG5cdHRoaXMuZG9tRWxlbWVudCA9ICggZG9tRWxlbWVudCAhPT0gdW5kZWZpbmVkICkgPyBkb21FbGVtZW50IDogZG9jdW1lbnQ7XG5cblx0Ly8gQVBJXG5cblx0dGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuXHR0aGlzLnNjcmVlbiA9IHsgbGVmdDogMCwgdG9wOiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XG5cblx0dGhpcy5yb3RhdGVTcGVlZCA9IDEuMDtcblx0dGhpcy56b29tU3BlZWQgPSAxLjI7XG5cdHRoaXMucGFuU3BlZWQgPSAwLjM7XG5cblx0dGhpcy5ub1JvdGF0ZSA9IGZhbHNlO1xuXHR0aGlzLm5vWm9vbSA9IGZhbHNlO1xuXHR0aGlzLm5vUGFuID0gZmFsc2U7XG5cblx0dGhpcy5zdGF0aWNNb3ZpbmcgPSB0cnVlO1xuXHR0aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4yO1xuXG5cdHRoaXMubWluRGlzdGFuY2UgPSAwO1xuXHR0aGlzLm1heERpc3RhbmNlID0gSW5maW5pdHk7XG5cblx0dGhpcy5rZXlzID0gWyA2NSAvKkEqLywgODMgLypTKi8sIDY4IC8qRCovIF07XG5cblx0Ly8gaW50ZXJuYWxzXG5cblx0dGhpcy50YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdHZhciBFUFMgPSAwLjAwMDAwMTtcblxuXHR2YXIgbGFzdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHR2YXIgX3N0YXRlID0gU1RBVEUuTk9ORSxcblx0X3ByZXZTdGF0ZSA9IFNUQVRFLk5PTkUsXG5cblx0X2V5ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cblx0X21vdmVQcmV2ID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblx0X21vdmVDdXJyID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblxuXHRfbGFzdEF4aXMgPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRfbGFzdEFuZ2xlID0gMCxcblxuXHRfem9vbVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKSxcblx0X3pvb21FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXG5cdF90b3VjaFpvb21EaXN0YW5jZVN0YXJ0ID0gMCxcblx0X3RvdWNoWm9vbURpc3RhbmNlRW5kID0gMCxcblxuXHRfcGFuU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRfcGFuRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuXHQvLyBmb3IgcmVzZXRcblxuXHR0aGlzLnRhcmdldDAgPSB0aGlzLnRhcmdldC5jbG9uZSgpO1xuXHR0aGlzLnBvc2l0aW9uMCA9IHRoaXMub2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XG5cdHRoaXMudXAwID0gdGhpcy5vYmplY3QudXAuY2xvbmUoKTtcblxuXHQvLyBldmVudHNcblxuXHR2YXIgY2hhbmdlRXZlbnQgPSB7IHR5cGU6ICdjaGFuZ2UnIH07XG5cdHZhciBzdGFydEV2ZW50ID0geyB0eXBlOiAnc3RhcnQnIH07XG5cdHZhciBlbmRFdmVudCA9IHsgdHlwZTogJ2VuZCcgfTtcblxuXG5cdC8vIG1ldGhvZHNcblxuXHR0aGlzLmhhbmRsZVJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggdGhpcy5kb21FbGVtZW50ID09PSBkb2N1bWVudCApIHtcblxuXHRcdFx0dGhpcy5zY3JlZW4ubGVmdCA9IDA7XG5cdFx0XHR0aGlzLnNjcmVlbi50b3AgPSAwO1xuXHRcdFx0dGhpcy5zY3JlZW4ud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRcdHRoaXMuc2NyZWVuLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHZhciBib3ggPSB0aGlzLmRvbUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHQvLyBhZGp1c3RtZW50cyBjb21lIGZyb20gc2ltaWxhciBjb2RlIGluIHRoZSBqcXVlcnkgb2Zmc2V0KCkgZnVuY3Rpb25cblx0XHRcdHZhciBkID0gdGhpcy5kb21FbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXHRcdFx0dGhpcy5zY3JlZW4ubGVmdCA9IGJveC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0IC0gZC5jbGllbnRMZWZ0O1xuXHRcdFx0dGhpcy5zY3JlZW4udG9wID0gYm94LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCAtIGQuY2xpZW50VG9wO1xuXHRcdFx0dGhpcy5zY3JlZW4ud2lkdGggPSBib3gud2lkdGg7XG5cdFx0XHR0aGlzLnNjcmVlbi5oZWlnaHQgPSBib3guaGVpZ2h0O1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uICggZXZlbnQgKSB7XG5cblx0XHRpZiAoIHR5cGVvZiB0aGlzWyBldmVudC50eXBlIF0gPT09ICdmdW5jdGlvbicgKSB7XG5cblx0XHRcdHRoaXNbIGV2ZW50LnR5cGUgXSggZXZlbnQgKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHZhciBnZXRNb3VzZU9uU2NyZWVuID0gKCBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiBnZXRNb3VzZU9uU2NyZWVuKCBwYWdlWCwgcGFnZVkgKSB7XG5cblx0XHRcdHZlY3Rvci5zZXQoXG5cdFx0XHRcdCggcGFnZVggLSBfdGhpcy5zY3JlZW4ubGVmdCApIC8gX3RoaXMuc2NyZWVuLndpZHRoLFxuXHRcdFx0XHQoIHBhZ2VZIC0gX3RoaXMuc2NyZWVuLnRvcCApIC8gX3RoaXMuc2NyZWVuLmhlaWdodFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHZlY3RvcjtcblxuXHRcdH07XG5cblx0fSgpICk7XG5cblx0dmFyIGdldE1vdXNlT25DaXJjbGUgPSAoIGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGdldE1vdXNlT25DaXJjbGUoIHBhZ2VYLCBwYWdlWSApIHtcblxuXHRcdFx0dmVjdG9yLnNldChcblx0XHRcdFx0KCAoIHBhZ2VYIC0gX3RoaXMuc2NyZWVuLndpZHRoICogMC41IC0gX3RoaXMuc2NyZWVuLmxlZnQgKSAvICggX3RoaXMuc2NyZWVuLndpZHRoICogMC41ICkgKSxcblx0XHRcdFx0KCAoIF90aGlzLnNjcmVlbi5oZWlnaHQgKyAyICogKCBfdGhpcy5zY3JlZW4udG9wIC0gcGFnZVkgKSApIC8gX3RoaXMuc2NyZWVuLndpZHRoICkgLy8gc2NyZWVuLndpZHRoIGludGVudGlvbmFsXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdmVjdG9yO1xuXG5cdFx0fTtcblxuXHR9KCkgKTtcblxuXHR0aGlzLnJvdGF0ZUNhbWVyYSA9ICggZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgYXhpcyA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRxdWF0ZXJuaW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKSxcblx0XHRcdGV5ZURpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRvYmplY3RVcERpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRvYmplY3RTaWRld2F5c0RpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCksXG5cdFx0XHRtb3ZlRGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKSxcblx0XHRcdGFuZ2xlO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHJvdGF0ZUNhbWVyYSgpIHtcblxuXHRcdFx0bW92ZURpcmVjdGlvbi5zZXQoIF9tb3ZlQ3Vyci54IC0gX21vdmVQcmV2LngsIF9tb3ZlQ3Vyci55IC0gX21vdmVQcmV2LnksIDAgKTtcblx0XHRcdGFuZ2xlID0gbW92ZURpcmVjdGlvbi5sZW5ndGgoKTtcblxuXHRcdFx0aWYgKCBhbmdsZSApIHtcblxuXHRcdFx0XHRfZXllLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApLnN1YiggX3RoaXMudGFyZ2V0ICk7XG5cblx0XHRcdFx0ZXllRGlyZWN0aW9uLmNvcHkoIF9leWUgKS5ub3JtYWxpemUoKTtcblx0XHRcdFx0b2JqZWN0VXBEaXJlY3Rpb24uY29weSggX3RoaXMub2JqZWN0LnVwICkubm9ybWFsaXplKCk7XG5cdFx0XHRcdG9iamVjdFNpZGV3YXlzRGlyZWN0aW9uLmNyb3NzVmVjdG9ycyggb2JqZWN0VXBEaXJlY3Rpb24sIGV5ZURpcmVjdGlvbiApLm5vcm1hbGl6ZSgpO1xuXG5cdFx0XHRcdG9iamVjdFVwRGlyZWN0aW9uLnNldExlbmd0aCggX21vdmVDdXJyLnkgLSBfbW92ZVByZXYueSApO1xuXHRcdFx0XHRvYmplY3RTaWRld2F5c0RpcmVjdGlvbi5zZXRMZW5ndGgoIF9tb3ZlQ3Vyci54IC0gX21vdmVQcmV2LnggKTtcblxuXHRcdFx0XHRtb3ZlRGlyZWN0aW9uLmNvcHkoIG9iamVjdFVwRGlyZWN0aW9uLmFkZCggb2JqZWN0U2lkZXdheXNEaXJlY3Rpb24gKSApO1xuXG5cdFx0XHRcdGF4aXMuY3Jvc3NWZWN0b3JzKCBtb3ZlRGlyZWN0aW9uLCBfZXllICkubm9ybWFsaXplKCk7XG5cblx0XHRcdFx0YW5nbGUgKj0gX3RoaXMucm90YXRlU3BlZWQ7XG5cdFx0XHRcdHF1YXRlcm5pb24uc2V0RnJvbUF4aXNBbmdsZSggYXhpcywgYW5nbGUgKTtcblxuXHRcdFx0XHRfZXllLmFwcGx5UXVhdGVybmlvbiggcXVhdGVybmlvbiApO1xuXHRcdFx0XHRfdGhpcy5vYmplY3QudXAuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cblx0XHRcdFx0X2xhc3RBeGlzLmNvcHkoIGF4aXMgKTtcblx0XHRcdFx0X2xhc3RBbmdsZSA9IGFuZ2xlO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCAhIF90aGlzLnN0YXRpY01vdmluZyAmJiBfbGFzdEFuZ2xlICkge1xuXG5cdFx0XHRcdF9sYXN0QW5nbGUgKj0gTWF0aC5zcXJ0KCAxLjAgLSBfdGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvciApO1xuXHRcdFx0XHRfZXllLmNvcHkoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApLnN1YiggX3RoaXMudGFyZ2V0ICk7XG5cdFx0XHRcdHF1YXRlcm5pb24uc2V0RnJvbUF4aXNBbmdsZSggX2xhc3RBeGlzLCBfbGFzdEFuZ2xlICk7XG5cdFx0XHRcdF9leWUuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ZXJuaW9uICk7XG5cdFx0XHRcdF90aGlzLm9iamVjdC51cC5hcHBseVF1YXRlcm5pb24oIHF1YXRlcm5pb24gKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cblx0XHR9O1xuXG5cdH0oKSApO1xuXG5cblx0dGhpcy56b29tQ2FtZXJhID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIGZhY3RvcjtcblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5UT1VDSF9aT09NX1BBTiApIHtcblxuXHRcdFx0ZmFjdG9yID0gX3RvdWNoWm9vbURpc3RhbmNlU3RhcnQgLyBfdG91Y2hab29tRGlzdGFuY2VFbmQ7XG5cdFx0XHRfdG91Y2hab29tRGlzdGFuY2VTdGFydCA9IF90b3VjaFpvb21EaXN0YW5jZUVuZDtcblx0XHRcdF9leWUubXVsdGlwbHlTY2FsYXIoIGZhY3RvciApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0ZmFjdG9yID0gMS4wICsgKCBfem9vbUVuZC55IC0gX3pvb21TdGFydC55ICkgKiBfdGhpcy56b29tU3BlZWQ7XG5cblx0XHRcdGlmICggZmFjdG9yICE9PSAxLjAgJiYgZmFjdG9yID4gMC4wICkge1xuXG5cdFx0XHRcdF9leWUubXVsdGlwbHlTY2FsYXIoIGZhY3RvciApO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggX3RoaXMuc3RhdGljTW92aW5nICkge1xuXG5cdFx0XHRcdF96b29tU3RhcnQuY29weSggX3pvb21FbmQgKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRfem9vbVN0YXJ0LnkgKz0gKCBfem9vbUVuZC55IC0gX3pvb21TdGFydC55ICkgKiB0aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnBhbkNhbWVyYSA9ICggZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgbW91c2VDaGFuZ2UgPSBuZXcgVEhSRUUuVmVjdG9yMigpLFxuXHRcdFx0b2JqZWN0VXAgPSBuZXcgVEhSRUUuVmVjdG9yMygpLFxuXHRcdFx0cGFuID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiBwYW5DYW1lcmEoKSB7XG5cblx0XHRcdG1vdXNlQ2hhbmdlLmNvcHkoIF9wYW5FbmQgKS5zdWIoIF9wYW5TdGFydCApO1xuXG5cdFx0XHRpZiAoIG1vdXNlQ2hhbmdlLmxlbmd0aFNxKCkgKSB7XG5cblx0XHRcdFx0bW91c2VDaGFuZ2UubXVsdGlwbHlTY2FsYXIoIF9leWUubGVuZ3RoKCkgKiBfdGhpcy5wYW5TcGVlZCApO1xuXG5cdFx0XHRcdHBhbi5jb3B5KCBfZXllICkuY3Jvc3MoIF90aGlzLm9iamVjdC51cCApLnNldExlbmd0aCggbW91c2VDaGFuZ2UueCApO1xuXHRcdFx0XHRwYW4uYWRkKCBvYmplY3RVcC5jb3B5KCBfdGhpcy5vYmplY3QudXAgKS5zZXRMZW5ndGgoIG1vdXNlQ2hhbmdlLnkgKSApO1xuXG5cdFx0XHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5hZGQoIHBhbiApO1xuXHRcdFx0XHRfdGhpcy50YXJnZXQuYWRkKCBwYW4gKTtcblxuXHRcdFx0XHRpZiAoIF90aGlzLnN0YXRpY01vdmluZyApIHtcblxuXHRcdFx0XHRcdF9wYW5TdGFydC5jb3B5KCBfcGFuRW5kICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdF9wYW5TdGFydC5hZGQoIG1vdXNlQ2hhbmdlLnN1YlZlY3RvcnMoIF9wYW5FbmQsIF9wYW5TdGFydCApLm11bHRpcGx5U2NhbGFyKCBfdGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvciApICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fSgpICk7XG5cblx0dGhpcy5jaGVja0Rpc3RhbmNlcyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggISBfdGhpcy5ub1pvb20gfHwgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0aWYgKCBfZXllLmxlbmd0aFNxKCkgPiBfdGhpcy5tYXhEaXN0YW5jZSAqIF90aGlzLm1heERpc3RhbmNlICkge1xuXG5cdFx0XHRcdF90aGlzLm9iamVjdC5wb3NpdGlvbi5hZGRWZWN0b3JzKCBfdGhpcy50YXJnZXQsIF9leWUuc2V0TGVuZ3RoKCBfdGhpcy5tYXhEaXN0YW5jZSApICk7XG5cdFx0XHRcdF96b29tU3RhcnQuY29weSggX3pvb21FbmQgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIF9leWUubGVuZ3RoU3EoKSA8IF90aGlzLm1pbkRpc3RhbmNlICogX3RoaXMubWluRGlzdGFuY2UgKSB7XG5cblx0XHRcdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZFZlY3RvcnMoIF90aGlzLnRhcmdldCwgX2V5ZS5zZXRMZW5ndGgoIF90aGlzLm1pbkRpc3RhbmNlICkgKTtcblx0XHRcdFx0X3pvb21TdGFydC5jb3B5KCBfem9vbUVuZCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF9leWUuc3ViVmVjdG9ycyggX3RoaXMub2JqZWN0LnBvc2l0aW9uLCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdGlmICggISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X3RoaXMucm90YXRlQ2FtZXJhKCk7XG5cblx0XHR9XG5cblx0XHRpZiAoICEgX3RoaXMubm9ab29tICkge1xuXG5cdFx0XHRfdGhpcy56b29tQ2FtZXJhKCk7XG5cblx0XHR9XG5cblx0XHRpZiAoICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF90aGlzLnBhbkNhbWVyYSgpO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmFkZFZlY3RvcnMoIF90aGlzLnRhcmdldCwgX2V5ZSApO1xuXG5cdFx0X3RoaXMuY2hlY2tEaXN0YW5jZXMoKTtcblxuXHRcdF90aGlzLm9iamVjdC5sb29rQXQoIF90aGlzLnRhcmdldCApO1xuXG5cdFx0aWYgKCBsYXN0UG9zaXRpb24uZGlzdGFuY2VUb1NxdWFyZWQoIF90aGlzLm9iamVjdC5wb3NpdGlvbiApID4gRVBTICkge1xuXG5cdFx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXG5cdFx0XHRsYXN0UG9zaXRpb24uY29weSggX3RoaXMub2JqZWN0LnBvc2l0aW9uICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X3N0YXRlID0gU1RBVEUuTk9ORTtcblx0XHRfcHJldlN0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdF90aGlzLnRhcmdldC5jb3B5KCBfdGhpcy50YXJnZXQwICk7XG5cdFx0X3RoaXMub2JqZWN0LnBvc2l0aW9uLmNvcHkoIF90aGlzLnBvc2l0aW9uMCApO1xuXHRcdF90aGlzLm9iamVjdC51cC5jb3B5KCBfdGhpcy51cDAgKTtcblxuXHRcdF9leWUuc3ViVmVjdG9ycyggX3RoaXMub2JqZWN0LnBvc2l0aW9uLCBfdGhpcy50YXJnZXQgKTtcblxuXHRcdF90aGlzLm9iamVjdC5sb29rQXQoIF90aGlzLnRhcmdldCApO1xuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggY2hhbmdlRXZlbnQgKTtcblxuXHRcdGxhc3RQb3NpdGlvbi5jb3B5KCBfdGhpcy5vYmplY3QucG9zaXRpb24gKTtcblxuXHR9O1xuXG5cdC8vIGxpc3RlbmVyc1xuXG5cdGZ1bmN0aW9uIGtleWRvd24oIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGtleWRvd24gKTtcblxuXHRcdF9wcmV2U3RhdGUgPSBfc3RhdGU7XG5cblx0XHRpZiAoIF9zdGF0ZSAhPT0gU1RBVEUuTk9ORSApIHtcblxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0fSBlbHNlIGlmICggZXZlbnQua2V5Q29kZSA9PT0gX3RoaXMua2V5c1sgU1RBVEUuUk9UQVRFIF0gJiYgISBfdGhpcy5ub1JvdGF0ZSApIHtcblxuXHRcdFx0X3N0YXRlID0gU1RBVEUuUk9UQVRFO1xuXG5cdFx0fSBlbHNlIGlmICggZXZlbnQua2V5Q29kZSA9PT0gX3RoaXMua2V5c1sgU1RBVEUuWk9PTSBdICYmICEgX3RoaXMubm9ab29tICkge1xuXG5cdFx0XHRfc3RhdGUgPSBTVEFURS5aT09NO1xuXG5cdFx0fSBlbHNlIGlmICggZXZlbnQua2V5Q29kZSA9PT0gX3RoaXMua2V5c1sgU1RBVEUuUEFOIF0gJiYgISBfdGhpcy5ub1BhbiApIHtcblxuXHRcdFx0X3N0YXRlID0gU1RBVEUuUEFOO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBrZXl1cCggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0X3N0YXRlID0gX3ByZXZTdGF0ZTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGtleWRvd24sIGZhbHNlICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlZG93biggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdGlmICggX3N0YXRlID09PSBTVEFURS5OT05FICkge1xuXG5cdFx0XHRfc3RhdGUgPSBldmVudC5idXR0b247XG5cblx0XHR9XG5cblx0XHRpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUk9UQVRFICYmICEgX3RoaXMubm9Sb3RhdGUgKSB7XG5cblx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkgKSApO1xuXHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXG5cdFx0fSBlbHNlIGlmICggX3N0YXRlID09PSBTVEFURS5aT09NICYmICEgX3RoaXMubm9ab29tICkge1xuXG5cdFx0XHRfem9vbVN0YXJ0LmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApICk7XG5cdFx0XHRfem9vbUVuZC5jb3B5KCBfem9vbVN0YXJ0ICk7XG5cblx0XHR9IGVsc2UgaWYgKCBfc3RhdGUgPT09IFNUQVRFLlBBTiAmJiAhIF90aGlzLm5vUGFuICkge1xuXG5cdFx0XHRfcGFuU3RhcnQuY29weSggZ2V0TW91c2VPblNjcmVlbiggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblx0XHRcdF9wYW5FbmQuY29weSggX3BhblN0YXJ0ICk7XG5cblx0XHR9XG5cblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlLCBmYWxzZSApO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgbW91c2V1cCwgZmFsc2UgKTtcblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIHN0YXJ0RXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2Vtb3ZlKCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0aWYgKCBfc3RhdGUgPT09IFNUQVRFLlJPVEFURSAmJiAhIF90aGlzLm5vUm90YXRlICkge1xuXG5cdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuWk9PTSAmJiAhIF90aGlzLm5vWm9vbSApIHtcblxuXHRcdFx0X3pvb21FbmQuY29weSggZ2V0TW91c2VPblNjcmVlbiggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblxuXHRcdH0gZWxzZSBpZiAoIF9zdGF0ZSA9PT0gU1RBVEUuUEFOICYmICEgX3RoaXMubm9QYW4gKSB7XG5cblx0XHRcdF9wYW5FbmQuY29weSggZ2V0TW91c2VPblNjcmVlbiggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICkgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2V1cCggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdF9zdGF0ZSA9IFNUQVRFLk5PTkU7XG5cblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlICk7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBtb3VzZXVwICk7XG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggZW5kRXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2V3aGVlbCggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LmRlbHRhTW9kZSApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBab29tIGluIHBhZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF96b29tU3RhcnQueSAtPSBldmVudC5kZWx0YVkgKiAwLjAyNTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cblx0XHRcdGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWm9vbSBpbiBsaW5lc1xuXHRcdFx0XHRfem9vbVN0YXJ0LnkgLT0gZXZlbnQuZGVsdGFZICogMC4wMTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8vIHVuZGVmaW5lZCwgMCwgYXNzdW1lIHBpeGVsc1xuXHRcdFx0XHRfem9vbVN0YXJ0LnkgLT0gZXZlbnQuZGVsdGFZICogMC4wMDAyNTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRfdGhpcy5kaXNwYXRjaEV2ZW50KCBzdGFydEV2ZW50ICk7XG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggZW5kRXZlbnQgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gdG91Y2hzdGFydCggZXZlbnQgKSB7XG5cblx0XHRpZiAoIF90aGlzLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0c3dpdGNoICggZXZlbnQudG91Y2hlcy5sZW5ndGggKSB7XG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuXHRcdFx0XHRfbW92ZUN1cnIuY29weSggZ2V0TW91c2VPbkNpcmNsZSggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgKSApO1xuXHRcdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OiAvLyAyIG9yIG1vcmVcblx0XHRcdFx0X3N0YXRlID0gU1RBVEUuVE9VQ0hfWk9PTV9QQU47XG5cdFx0XHRcdHZhciBkeCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWDtcblx0XHRcdFx0dmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xuXHRcdFx0XHRfdG91Y2hab29tRGlzdGFuY2VFbmQgPSBfdG91Y2hab29tRGlzdGFuY2VTdGFydCA9IE1hdGguc3FydCggZHggKiBkeCArIGR5ICogZHkgKTtcblxuXHRcdFx0XHR2YXIgeCA9ICggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYICsgZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYICkgLyAyO1xuXHRcdFx0XHR2YXIgeSA9ICggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICsgZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZICkgLyAyO1xuXHRcdFx0XHRfcGFuU3RhcnQuY29weSggZ2V0TW91c2VPblNjcmVlbiggeCwgeSApICk7XG5cdFx0XHRcdF9wYW5FbmQuY29weSggX3BhblN0YXJ0ICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0X3RoaXMuZGlzcGF0Y2hFdmVudCggc3RhcnRFdmVudCApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3VjaG1vdmUoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRzd2l0Y2ggKCBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRfbW92ZVByZXYuY29weSggX21vdmVDdXJyICk7XG5cdFx0XHRcdF9tb3ZlQ3Vyci5jb3B5KCBnZXRNb3VzZU9uQ2lyY2xlKCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSApICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OiAvLyAyIG9yIG1vcmVcblx0XHRcdFx0dmFyIGR4ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYO1xuXHRcdFx0XHR2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XG5cdFx0XHRcdF90b3VjaFpvb21EaXN0YW5jZUVuZCA9IE1hdGguc3FydCggZHggKiBkeCArIGR5ICogZHkgKTtcblxuXHRcdFx0XHR2YXIgeCA9ICggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYICsgZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYICkgLyAyO1xuXHRcdFx0XHR2YXIgeSA9ICggZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICsgZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZICkgLyAyO1xuXHRcdFx0XHRfcGFuRW5kLmNvcHkoIGdldE1vdXNlT25TY3JlZW4oIHgsIHkgKSApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gdG91Y2hlbmQoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCBfdGhpcy5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdHN3aXRjaCAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoICkge1xuXG5cdFx0XHRjYXNlIDA6XG5cdFx0XHRcdF9zdGF0ZSA9IFNUQVRFLk5PTkU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdF9zdGF0ZSA9IFNUQVRFLlRPVUNIX1JPVEFURTtcblx0XHRcdFx0X21vdmVDdXJyLmNvcHkoIGdldE1vdXNlT25DaXJjbGUoIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZICkgKTtcblx0XHRcdFx0X21vdmVQcmV2LmNvcHkoIF9tb3ZlQ3VyciApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdF90aGlzLmRpc3BhdGNoRXZlbnQoIGVuZEV2ZW50ICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGNvbnRleHRtZW51KCBldmVudCApIHtcblxuXHRcdGlmICggX3RoaXMuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdH1cblxuXHR0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcblxuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnY29udGV4dG1lbnUnLCBjb250ZXh0bWVudSwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIG1vdXNlZG93biwgZmFsc2UgKTtcblx0XHR0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3doZWVsJywgbW91c2V3aGVlbCwgZmFsc2UgKTtcblxuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoc3RhcnQsIGZhbHNlICk7XG5cdFx0dGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaGVuZCcsIHRvdWNoZW5kLCBmYWxzZSApO1xuXHRcdHRoaXMuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2htb3ZlJywgdG91Y2htb3ZlLCBmYWxzZSApO1xuXG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIG1vdXNlbW92ZSwgZmFsc2UgKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIG1vdXNldXAsIGZhbHNlICk7XG5cblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBrZXlkb3duLCBmYWxzZSApO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5dXAnLCBrZXl1cCwgZmFsc2UgKTtcblxuXHR9O1xuXG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnY29udGV4dG1lbnUnLCBjb250ZXh0bWVudSwgZmFsc2UgKTsgXG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgbW91c2Vkb3duLCBmYWxzZSApO1xuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3doZWVsJywgbW91c2V3aGVlbCwgZmFsc2UgKTtcblxuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaHN0YXJ0LCBmYWxzZSApO1xuXHR0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgdG91Y2hlbmQsIGZhbHNlICk7XG5cdHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2htb3ZlJywgdG91Y2htb3ZlLCBmYWxzZSApO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGtleWRvd24sIGZhbHNlICk7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAna2V5dXAnLCBrZXl1cCwgZmFsc2UgKTtcblxuXHR0aGlzLmhhbmRsZVJlc2l6ZSgpO1xuXG5cdC8vIGZvcmNlIGFuIHVwZGF0ZSBhdCBzdGFydFxuXHR0aGlzLnVwZGF0ZSgpO1xuXG59XG5cblRyYWNrYmFsbENvbnRyb2xzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFRIUkVFLkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUgKTtcblRyYWNrYmFsbENvbnRyb2xzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRyYWNrYmFsbENvbnRyb2xzO1xuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5pbXBvcnQge0NhbWVyYSwgU3RhbmRhcmRWaWV3fSAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtDYW1lcmFDb250cm9sc30gICAgICAgICBmcm9tICdDYW1lcmFDb250cm9scydcclxuaW1wb3J0IHtFdmVudE1hbmFnZXJ9ICAgICAgICAgICBmcm9tICdFdmVudE1hbmFnZXInXHJcbmltcG9ydCB7R3JhcGhpY3MsIE9iamVjdE5hbWVzfSAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyfSAgICAgICAgICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGVyaWFsc30gICAgICAgICAgICAgIGZyb20gJ01hdGVyaWFscydcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUcmFja2JhbGxDb250cm9sc30gICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuXHJcbi8qKlxyXG4gKiBAZXhwb3J0cyBWaWV3ZXIvVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVmlld2VyIHtcclxuXHJcbiAgICBfbmFtZSAgICAgICAgICAgICAgICAgICA6IHN0cmluZyAgICAgICAgICAgICAgICAgICAgPSAnJztcclxuICAgIF9ldmVudE1hbmFnZXIgICAgICAgICAgIDogRXZlbnRNYW5hZ2VyICAgICAgICAgICAgICA9IG51bGw7XHJcbiAgICBfbG9nZ2VyICAgICAgICAgICAgICAgICA6IExvZ2dlciAgICAgICAgICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgXHJcbiAgICBfc2NlbmUgICAgICAgICAgICAgICAgICA6IFRIUkVFLlNjZW5lICAgICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgX3Jvb3QgICAgICAgICAgICAgICAgICAgOiBUSFJFRS5PYmplY3QzRCAgICAgICAgICAgID0gbnVsbDsgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgIF9yZW5kZXJlciAgICAgICAgICAgICAgIDogVEhSRUUuV2ViR0xSZW5kZXJlciAgICAgICA9IG51bGw7O1xyXG4gICAgX2NhbnZhcyAgICAgICAgICAgICAgICAgOiBIVE1MQ2FudmFzRWxlbWVudCAgICAgICAgID0gbnVsbDtcclxuICAgIF93aWR0aCAgICAgICAgICAgICAgICAgIDogbnVtYmVyICAgICAgICAgICAgICAgICAgICA9IDA7XHJcbiAgICBfaGVpZ2h0ICAgICAgICAgICAgICAgICA6IG51bWJlciAgICAgICAgICAgICAgICAgICAgPSAwO1xyXG5cclxuICAgIF9jYW1lcmEgICAgICAgICAgICAgICAgIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgICA9IG51bGw7XHJcblxyXG4gICAgX2NvbnRyb2xzICAgICAgICAgICAgICAgOiBUcmFja2JhbGxDb250cm9scyAgICAgICAgID0gbnVsbDtcclxuICAgIF9jYW1lcmFDb250cm9scyAgICAgICAgIDogQ2FtZXJhQ29udHJvbHMgICAgICAgICAgICA9IG51bGw7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIFZpZXdlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBWaWV3ZXIgbmFtZS5cclxuICAgICAqIEBwYXJhbSBlbGVtZW50VG9CaW5kVG8gSFRNTCBlbGVtZW50IHRvIGhvc3QgdGhlIHZpZXdlci5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgbW9kZWxDYW52YXNJZCA6IHN0cmluZykgeyBcclxuXHJcbiAgICAgICAgdGhpcy5fbmFtZSAgICAgICAgID0gbmFtZTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlciA9IG5ldyBFdmVudE1hbmFnZXIoKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgICAgICAgPSBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBHcmFwaGljcy5pbml0aWFsaXplQ2FudmFzKG1vZGVsQ2FudmFzSWQpO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoICA9IHRoaXMuX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLl9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgVmlld2VyIG5hbWUuXHJcbiAgICAgKi9cclxuICAgIGdldCBuYW1lKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZXQgY2FtZXJhKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjYW1lcmEuXHJcbiAgICAgKi9cclxuICAgIHNldCBjYW1lcmEoY2FtZXJhIDogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9jYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEubmFtZSA9IHRoaXMubmFtZTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVJbnB1dENvbnRyb2xzKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmFDb250cm9scylcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhQ29udHJvbHMuc3luY2hyb25pemVDYW1lcmFTZXR0aW5ncygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBhY3RpdmUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIGdldCBtb2RlbCgpIDogVEhSRUUuR3JvdXAge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIEV2ZW50TWFuYWdlci5cclxuICAgICAqL1xyXG4gICAgZ2V0IGV2ZW50TWFuYWdlcigpIDogRXZlbnRNYW5hZ2VyIHtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRNYW5hZ2VyO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBhY3RpdmUgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgTmV3IG1vZGVsIHRvIGFjdGl2YXRlLlxyXG4gICAgICovXHJcbiAgICBzZXRNb2RlbCh2YWx1ZSA6IFRIUkVFLkdyb3VwKSB7XHJcblxyXG4gICAgICAgIC8vIE4uQi4gVGhpcyBpcyBhIG1ldGhvZCBub3QgYSBwcm9wZXJ0eSBzbyBhIHN1YiBjbGFzcyBjYW4gb3ZlcnJpZGUuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy80NDY1XHJcblxyXG4gICAgICAgIEdyYXBoaWNzLnJlbW92ZU9iamVjdENoaWxkcmVuKHRoaXMuX3Jvb3QsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLl9yb290LmFkZCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGNhbnZhcyBhZmVyIGEgd2luZG93IHJlc2l6ZVxyXG4gICAgICovXHJcbiAgICBnZXQgYXNwZWN0UmF0aW8oKSA6IG51bWJlciB7XHJcblxyXG4gICAgICAgIGxldCBhc3BlY3RSYXRpbyA6IG51bWJlciA9IHRoaXMuX3dpZHRoIC8gdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgIHJldHVybiBhc3BlY3RSYXRpbztcclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBET00gSWQgb2YgdGhlIFZpZXdlciBwYXJlbnQgY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGFpbmVySWQoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHBhcmVudEVsZW1lbnQgOiBIVE1MRWxlbWVudCA9IHRoaXMuX2NhbnZhcy5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIHJldHVybiBwYXJlbnRFbGVtZW50LmlkO1xyXG4gICAgfSBcclxuICAgICAgICBcclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gSW5pdGlhbGl6YXRpb24gICAgXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSB0ZXN0IHNwaGVyZSB0byBhIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBwb3B1bGF0ZVNjZW5lICgpIHtcclxuXHJcbiAgICAgICAgbGV0IG1lc2ggPSBHcmFwaGljcy5jcmVhdGVTcGhlcmVNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKCksIDIpO1xyXG4gICAgICAgIG1lc2gudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3Jvb3QuYWRkKG1lc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBTY2VuZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplU2NlbmUgKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUm9vdCgpO1xyXG5cclxuICAgICAgICB0aGlzLnBvcHVsYXRlU2NlbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIFdlYkdMIHJlbmRlcmVyLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUmVuZGVyZXIgKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcclxuXHJcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXIgIDogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhbnZhcyAgICAgICAgICAgICAgICAgIDogdGhpcy5fY2FudmFzLFxyXG4gICAgICAgICAgICBhbnRpYWxpYXMgICAgICAgICAgICAgICA6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5hdXRvQ2xlYXIgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDApO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3ZXIgY2FtZXJhXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDYW1lcmEoKSB7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBDYW1lcmEuZ2V0U3RhbmRhcmRWaWV3Q2FtZXJhKFN0YW5kYXJkVmlldy5Gcm9udCwgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5tb2RlbCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBsaWdodGluZyB0byB0aGUgc2NlbmVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUxpZ2h0aW5nKCkge1xyXG5cclxuICAgICAgICBsZXQgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDQwNDA0MCk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4QzBDMDkwKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0MS5wb3NpdGlvbi5zZXQoLTEwMCwgLTUwLCAxMDApO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0MSk7XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0MiA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4QzBDMDkwKTtcclxuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0Mi5wb3NpdGlvbi5zZXQoMTAwLCA1MCwgLTEwMCk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIHVzZXIgaW5wdXQgY29udHJvbHMgKFRyYWNrYmFsbClcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzID0gbmV3IFRyYWNrYmFsbENvbnRyb2xzKHRoaXMuY2FtZXJhLCB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gTi5CLiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDMyNTA5NS90aHJlZWpzLWNhbWVyYS1sb29rYXQtaGFzLW5vLWVmZmVjdC1pcy10aGVyZS1zb21ldGhpbmctaW0tZG9pbmctd3JvbmdcclxuICAgICAgICB0aGlzLl9jb250cm9scy5wb3NpdGlvbjAuY29weSh0aGlzLmNhbWVyYS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IEdyYXBoaWNzLmdldEJvdW5kaW5nQm94RnJvbU9iamVjdCh0aGlzLl9yb290KTtcclxuICAgICAgICB0aGlzLl9jb250cm9scy50YXJnZXQuY29weShib3VuZGluZ0JveC5nZXRDZW50ZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIHRoZSB1c2VyIGlucHV0IGNvbnRyb2xzIChTZXR0aW5ncylcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzID0gbmV3IENhbWVyYUNvbnRyb2xzKHRoaXMpOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgdGhlIGtleWJvYXJkIHNob3J0Y3V0cy5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUtleWJvYXJkU2hvcnRjdXRzKCkge1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCA6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvamF2YXNjcmlwdC9qYXZhc2NyaXB0LWtleWNvZGVzL1xyXG4gICAgICAgICAgICBsZXQga2V5Q29kZSA6IG51bWJlciA9IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNzA6ICAgICAgICAgICAgICAgIC8vIEYgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYSA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdDYW1lcmEoU3RhbmRhcmRWaWV3LkZyb250LCB0aGlzLmFzcGVjdFJhdGlvLCB0aGlzLm1vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBzY2VuZSB3aXRoIHRoZSBiYXNlIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZSAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDYW1lcmEoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVMaWdodGluZygpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUlucHV0Q29udHJvbHMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVVSUNvbnRyb2xzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplS2V5Ym9hcmRTaG9ydGN1dHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZVdpbmRvdygpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplV2luZG93LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgIH1cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2NlbmVcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc2NlbmUgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBjbGVhckFsbEFzc2VzdHMoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgR3JhcGhpY3MucmVtb3ZlT2JqZWN0Q2hpbGRyZW4odGhpcy5fcm9vdCwgZmFsc2UpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIHJvb3Qgb2JqZWN0IGluIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVSb290KCkge1xyXG5cclxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcbiAgICAgICAgdGhpcy5fcm9vdC5uYW1lID0gT2JqZWN0TmFtZXMuUm9vdDtcclxuICAgICAgICB0aGlzLl9zY2VuZS5hZGQodGhpcy5fcm9vdCk7XHJcbiAgICB9XHJcblxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBDYW1lcmFcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gU2V0cyB0aGUgdmlldyBjYW1lcmEgcHJvcGVydGllcyB0byB0aGUgZ2l2ZW4gc2V0dGluZ3MuXHJcbiAgICAgKiBAcGFyYW0ge1N0YW5kYXJkVmlld30gdmlldyBDYW1lcmEgc2V0dGluZ3MgdG8gYXBwbHkuXHJcbiAgICAgKi9cclxuICAgIHNldENhbWVyYVRvU3RhbmRhcmRWaWV3KHZpZXcgOiBTdGFuZGFyZFZpZXcpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YW5kYXJkVmlld0NhbWVyYSA9IENhbWVyYS5nZXRTdGFuZGFyZFZpZXdDYW1lcmEodmlldywgdGhpcy5hc3BlY3RSYXRpbywgdGhpcy5tb2RlbCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBzdGFuZGFyZFZpZXdDYW1lcmE7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUNvbnRyb2xzLnN5bmNocm9uaXplQ2FtZXJhU2V0dGluZ3Modmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gRml0cyB0aGUgYWN0aXZlIHZpZXcuXHJcbiAgICAgKi9cclxuICAgIGZpdFZpZXcoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gQ2FtZXJhLmdldEZpdFZpZXdDYW1lcmEgKENhbWVyYS5nZXRTY2VuZUNhbWVyYSh0aGlzLmNhbWVyYSwgdGhpcy5hc3BlY3RSYXRpbyksIHRoaXMubW9kZWwpO1xyXG4gICAgfVxyXG4gICAgICAgICAgIFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBXaW5kb3cgUmVzaXplXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHNjZW5lIGNhbWVyYSB0byBtYXRjaCB0aGUgbmV3IHdpbmRvdyBzaXplXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUNhbWVyYU9uV2luZG93UmVzaXplKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNhbWVyYS5hc3BlY3QgPSB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgdGhlIFdlYkdMIHByb2Nlc3NpbmcgZm9yIGEgRE9NIHdpbmRvdyAncmVzaXplJyBldmVudFxyXG4gICAgICovXHJcbiAgICByZXNpemVEaXNwbGF5V2ViR0woKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gIHRoaXMuX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLl9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFNpemUodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scy5oYW5kbGVSZXNpemUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbWVyYU9uV2luZG93UmVzaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIGEgd2luZG93IHJlc2l6ZSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblJlc2l6ZVdpbmRvdyAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucmVzaXplRGlzcGxheVdlYkdMKCk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIFJlbmRlciBMb29wXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIHRoZSBXZWJHTCByZW5kZXIgb2YgdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcldlYkdMKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9scy51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW5kZXIodGhpcy5fc2NlbmUsIHRoaXMuY2FtZXJhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1haW4gRE9NIHJlbmRlciBsb29wXHJcbiAgICAgKi9cclxuICAgIGFuaW1hdGUoKSB7XHJcblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJXZWJHTCgpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxufSBcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgIGZyb20gJ3RocmVlJyBcclxuXHJcbmltcG9ydCB7TG9nZ2VyLCBDb25zb2xlTG9nZ2VyfSAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuY29uc3QgdGVzdE1vZGVsQ29sb3IgPSAnIzU1OGRlOCc7XHJcblxyXG5leHBvcnQgZW51bSBUZXN0TW9kZWwge1xyXG4gICAgVG9ydXMsXHJcbiAgICBTcGhlcmUsXHJcbiAgICBTbG9wZWRQbGFuZSxcclxuICAgIEJveCxcclxuICAgIENoZWNrZXJib2FyZFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGVzdE1vZGVsTG9hZGVyIHtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIFRlc3RNb2RlbExvYWRlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9hZHMgYSBwYXJhbWV0cmljIHRlc3QgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0ge1ZpZXdlcn0gdmlld2VyIFZpZXdlciBpbnN0YW5jZSB0byByZWNlaXZlIG1vZGVsLlxyXG4gICAgICogQHBhcmFtIHtUZXN0TW9kZWx9IG1vZGVsVHlwZSBNb2RlbCB0eXBlIChCb3gsIFNwaGVyZSwgZXRjLilcclxuICAgICAqL1xyXG4gICAgbG9hZFRlc3RNb2RlbCAodmlld2VyIDogVmlld2VyLCBtb2RlbFR5cGUgOiBUZXN0TW9kZWwpIHtcclxuXHJcbiAgICAgICAgc3dpdGNoIChtb2RlbFR5cGUpe1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuVG9ydXM6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRUb3J1c01vZGVsKHZpZXdlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLlNwaGVyZTpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFNwaGVyZU1vZGVsKHZpZXdlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVGVzdE1vZGVsLlNsb3BlZFBsYW5lOiBcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFNsb3BlZFBsYW5lTW9kZWwodmlld2VyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuQm94OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQm94TW9kZWwodmlld2VyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBUZXN0TW9kZWwuQ2hlY2tlcmJvYXJkOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ2hlY2tlcmJvYXJkTW9kZWwodmlld2VyKTsgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgdG9ydXMgdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRUb3J1c01vZGVsKHZpZXdlciA6IFZpZXdlcikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB0b3J1c1NjZW5lID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gICAgICAgIC8vIFNldHVwIHNvbWUgZ2VvbWV0cmllc1xyXG4gICAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0tub3RHZW9tZXRyeSgxLCAwLjMsIDEyOCwgNjQpO1xyXG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiB0ZXN0TW9kZWxDb2xvciB9KTtcclxuXHJcbiAgICAgICAgbGV0IGNvdW50ID0gNTA7XHJcbiAgICAgICAgbGV0IHNjYWxlID0gNTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGgucmFuZG9tKCkgKiAyLjAgKiBNYXRoLlBJO1xyXG4gICAgICAgICAgICBsZXQgeiA9IChNYXRoLnJhbmRvbSgpICogMi4wKSAtIDEuMDtcclxuICAgICAgICAgICAgbGV0IHpTY2FsZSA9IE1hdGguc3FydCgxLjAgLSB6ICogeikgKiBzY2FsZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgICAgICAgICAgbWVzaC5wb3NpdGlvbi5zZXQoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyhyKSAqIHpTY2FsZSxcclxuICAgICAgICAgICAgICAgIE1hdGguc2luKHIpICogelNjYWxlLFxyXG4gICAgICAgICAgICAgICAgeiAqIHNjYWxlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIG1lc2gucm90YXRpb24uc2V0KE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpO1xyXG5cclxuICAgICAgICAgICAgbWVzaC5uYW1lID0gJ1RvcnVzIENvbXBvbmVudCc7XHJcbiAgICAgICAgICAgIHRvcnVzU2NlbmUuYWRkKG1lc2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2aWV3ZXIuc2V0TW9kZWwgKHRvcnVzU2NlbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHRlc3Qgc3BoZXJlIHRvIGEgc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZFNwaGVyZU1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBtZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMywgcmFkaXVzLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSkpXHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsKG1lc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgdGVzdCBib3ggdG8gYSBzY2VuZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkQm94TW9kZWwgKHZpZXdlciA6IFZpZXdlcikge1xyXG5cclxuICAgICAgICBsZXQgd2lkdGggID0gMjsgICAgXHJcbiAgICAgICAgbGV0IGhlaWdodCA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBkZXB0aCAgPSAyOyAgICBcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZUJveE1lc2gobmV3IFRIUkVFLlZlY3RvcjMsIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogdGVzdE1vZGVsQ29sb3IgfSkpXHJcblxyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHNsb3BlZCBwbGFuZSB0byBhIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRTbG9wZWRQbGFuZU1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIpIHtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoICA9IDI7ICAgIFxyXG4gICAgICAgIGxldCBoZWlnaHQgPSAyOyAgICBcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVBsYW5lTWVzaChuZXcgVEhSRUUuVmVjdG9yMywgd2lkdGgsIGhlaWdodCwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IHRlc3RNb2RlbENvbG9yIH0pKSAgICAgICBcclxuICAgICAgICBtZXNoLnJvdGF0ZVgoTWF0aC5QSSAvIDQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG1lc2gubmFtZSA9ICdTbG9wZWRQbGFuZSc7XHJcbiAgICAgICAgdmlld2VyLnNldE1vZGVsKG1lc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgdGVzdCBtb2RlbCBjb25zaXN0aW5nIG9mIGEgdGllcmVkIGNoZWNrZXJib2FyZFxyXG4gICAgICogQHBhcmFtIHZpZXdlciBJbnN0YW5jZSBvZiB0aGUgVmlld2VyIHRvIGRpc3BsYXkgdGhlIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRDaGVja2VyYm9hcmRNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGdyaWRMZW5ndGggICAgIDogbnVtYmVyID0gMjtcclxuICAgICAgICBsZXQgdG90YWxIZWlnaHQgICAgOiBudW1iZXIgPSAxLjA7ICAgICAgICBcclxuICAgICAgICBsZXQgZ3JpZERpdmlzaW9ucyAgOiBudW1iZXIgPSAyO1xyXG4gICAgICAgIGxldCB0b3RhbENlbGxzICAgICA6IG51bWJlciA9IE1hdGgucG93KGdyaWREaXZpc2lvbnMsIDIpO1xyXG5cclxuICAgICAgICBsZXQgY2VsbEJhc2UgICAgICAgOiBudW1iZXIgPSBncmlkTGVuZ3RoIC8gZ3JpZERpdmlzaW9ucztcclxuICAgICAgICBsZXQgY2VsbEhlaWdodCAgICAgOiBudW1iZXIgPSB0b3RhbEhlaWdodCAvIHRvdGFsQ2VsbHM7XHJcblxyXG4gICAgICAgIGxldCBvcmlnaW5YIDogbnVtYmVyID0gLShjZWxsQmFzZSAqIChncmlkRGl2aXNpb25zIC8gMikpICsgKGNlbGxCYXNlIC8gMik7XHJcbiAgICAgICAgbGV0IG9yaWdpblkgOiBudW1iZXIgPSBvcmlnaW5YO1xyXG4gICAgICAgIGxldCBvcmlnaW5aIDogbnVtYmVyID0gLWNlbGxIZWlnaHQgLyAyO1xyXG4gICAgICAgIGxldCBvcmlnaW4gIDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzKG9yaWdpblgsIG9yaWdpblksIG9yaWdpblopO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBiYXNlQ29sb3IgICAgICA6IG51bWJlciA9IDB4MDA3MDcwO1xyXG4gICAgICAgIGxldCBjb2xvckRlbHRhICAgICA6IG51bWJlciA9ICgyNTYgLyB0b3RhbENlbGxzKSAqIE1hdGgucG93KDI1NiwgMik7XHJcblxyXG4gICAgICAgIGxldCBncm91cCAgICAgIDogVEhSRUUuR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgICAgICBsZXQgY2VsbE9yaWdpbiA6IFRIUkVFLlZlY3RvcjMgPSBvcmlnaW4uY2xvbmUoKTtcclxuICAgICAgICBsZXQgY2VsbENvbG9yICA6IG51bWJlciA9IGJhc2VDb2xvcjtcclxuICAgICAgICBmb3IgKGxldCBpUm93IDogbnVtYmVyID0gMDsgaVJvdyA8IGdyaWREaXZpc2lvbnM7IGlSb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpQ29sdW1uIDogbnVtYmVyID0gMDsgaUNvbHVtbiA8IGdyaWREaXZpc2lvbnM7IGlDb2x1bW4rKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgY2VsbE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvciA6IGNlbGxDb2xvcn0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlQm94TWVzaChjZWxsT3JpZ2luLCBjZWxsQmFzZSwgY2VsbEJhc2UsIGNlbGxIZWlnaHQsIGNlbGxNYXRlcmlhbCk7XHJcbiAgICAgICAgICAgICAgICBncm91cC5hZGQgKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNlbGxPcmlnaW4ueCArPSBjZWxsQmFzZTtcclxuICAgICAgICAgICAgICAgIGNlbGxPcmlnaW4ueiArPSBjZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgY2VsbENvbG9yICAgICs9IGNvbG9yRGVsdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjZWxsT3JpZ2luLnggPSBvcmlnaW4ueDtcclxuICAgICAgICBjZWxsT3JpZ2luLnkgKz0gY2VsbEJhc2U7XHJcbiAgICAgICAgfSAgICAgICBcclxuXHJcbiAgICAgICAgZ3JvdXAubmFtZSA9ICdDaGVja2VyYm9hcmQnO1xyXG4gICAgICAgIHZpZXdlci5zZXRNb2RlbChncm91cCk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7T0JKTG9hZGVyfSAgICAgICAgICAgICAgICAgIGZyb20gXCJPQkpMb2FkZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUZXN0TW9kZWxMb2FkZXIsIFRlc3RNb2RlbH0gZnJvbSAnVGVzdE1vZGVsTG9hZGVyJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5jb25zdCB0ZXN0TW9kZWxDb2xvciA9ICcjNTU4ZGU4JztcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkZXIge1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTG9hZGVyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgbW9kZWwgYmFzZWQgb24gdGhlIG1vZGVsIG5hbWUgYW5kIHBhdGggZW1iZWRkZWQgaW4gdGhlIEhUTUwgcGFnZS5cclxuICAgICAqIEBwYXJhbSB2aWV3ZXIgSW5zdGFuY2Ugb2YgdGhlIFZpZXdlciB0byBkaXNwbGF5IHRoZSBtb2RlbC5cclxuICAgICAqLyAgICBcclxuICAgIGxvYWRPQkpNb2RlbCAodmlld2VyIDogVmlld2VyKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbE5hbWVFbGVtZW50IDogSFRNTEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVsTmFtZScpO1xyXG4gICAgICAgIGxldCBtb2RlbFBhdGhFbGVtZW50IDogSFRNTEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVsUGF0aCcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBsZXQgbW9kZWxOYW1lICAgIDogc3RyaW5nID0gbW9kZWxOYW1lRWxlbWVudC50ZXh0Q29udGVudDtcclxuICAgICAgICBsZXQgbW9kZWxQYXRoICAgIDogc3RyaW5nID0gbW9kZWxQYXRoRWxlbWVudC50ZXh0Q29udGVudDtcclxuICAgICAgICBsZXQgZmlsZU5hbWUgICAgIDogc3RyaW5nID0gbW9kZWxQYXRoICsgbW9kZWxOYW1lO1xyXG5cclxuICAgICAgICBsZXQgbWFuYWdlciA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpO1xyXG4gICAgICAgIGxldCBsb2FkZXIgID0gbmV3IE9CSkxvYWRlcihtYW5hZ2VyKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgb25Qcm9ncmVzcyA9IGZ1bmN0aW9uICh4aHIpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh4aHIubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IHhoci5sb2FkZWQgLyB4aHIudG90YWwgKiAxMDA7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwZXJjZW50Q29tcGxldGUudG9GaXhlZCgyKSArICclIGRvd25sb2FkZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBvbkVycm9yID0gZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgIH07ICAgICAgICBcclxuXHJcbiAgICAgICAgbG9hZGVyLmxvYWQoZmlsZU5hbWUsIGZ1bmN0aW9uIChncm91cCA6IFRIUkVFLkdyb3VwKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3ZXIuc2V0TW9kZWwoZ3JvdXApO1xyXG4gICAgICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYSBwYXJhbWV0cmljIHRlc3QgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0gdmlld2VyIEluc3RhbmNlIG9mIHRoZSBWaWV3ZXIgdG8gZGlzcGxheSB0aGUgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0gbW9kZWxUeXBlIFRlc3QgbW9kZWwgdHlwZSAoU3BoZXIsIEJveCwgZXRjLilcclxuICAgICAqLyAgICBcclxuICAgIGxvYWRQYXJhbWV0cmljVGVzdE1vZGVsICh2aWV3ZXIgOiBWaWV3ZXIsIG1vZGVsVHlwZSA6IFRlc3RNb2RlbCkge1xyXG5cclxuICAgICAgICBsZXQgdGVzdExvYWRlciA9IG5ldyBUZXN0TW9kZWxMb2FkZXIoKTtcclxuICAgICAgICB0ZXN0TG9hZGVyLmxvYWRUZXN0TW9kZWwodmlld2VyLCBtb2RlbFR5cGUpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0NhbWVyYSwgU3RhbmRhcmRWaWV3fSAgICAgICBmcm9tICdDYW1lcmEnXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJ9ICAgICAgICAgICAgICAgIGZyb20gJ0RlcHRoQnVmZmVyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICBmcm9tICdHcmFwaGljcydcclxuaW1wb3J0IHtMb2dnZXIsIEhUTUxMb2dnZXJ9ICAgICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICBmcm9tICdTZXJ2aWNlcydcclxuaW1wb3J0IHtUcmFja2JhbGxDb250cm9sc30gICAgICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7Vmlld2VyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1ZpZXdlcidcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogTWVzaFZpZXdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1lc2hWaWV3ZXIgZXh0ZW5kcyBWaWV3ZXIge1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNZXNoVmlld2VyXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBuYW1lIFZpZXdlciBuYW1lLlxyXG4gICAgICogQHBhcmFtIHByZXZpZXdDYW52YXNJZCBIVE1MIGVsZW1lbnQgdG8gaG9zdCB0aGUgdmlld2VyLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmV2aWV3Q2FudmFzSWQgOiBzdHJpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlcihuYW1lLCBwcmV2aWV3Q2FudmFzSWQpO1xyXG5cclxuICAgICAgICAvL292ZXJyaWRlXHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gU2VydmljZXMuaHRtbExvZ2dlcjsgICAgICAgXHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gUHJvcGVydGllc1xyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBJbml0aWFsaXphdGlvblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3B1bGF0ZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7ICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgaGVpZ2h0ID0gMTtcclxuICAgICAgICBsZXQgd2lkdGggID0gMTtcclxuICAgICAgICBsZXQgbWVzaCA9IEdyYXBoaWNzLmNyZWF0ZVBsYW5lTWVzaChuZXcgVEhSRUUuVmVjdG9yMygpLCBoZWlnaHQsIHdpZHRoLCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoRGVwdGhCdWZmZXIuRGVmYXVsdE1lc2hQaG9uZ01hdGVyaWFsUGFyYW1ldGVycykpO1xyXG4gICAgICAgIG1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xyXG5cclxuICAgICAgICB0aGlzLl9yb290LmFkZChtZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgbGlnaHRpbmcgdG8gdGhlIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplTGlnaHRpbmcoKSB7XHJcblxyXG4gICAgICAgIGxldCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjIpO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uYWxMaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodDEucG9zaXRpb24uc2V0KDQsIDQsIDQpO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0MSk7XHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG59IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgZnJvbSAndGhyZWUnIFxyXG5pbXBvcnQgKiBhcyBkYXQgICAgZnJvbSAnZGF0LWd1aSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgICAgIGZyb20gXCJEZXB0aEJ1ZmZlckZhY3RvcnlcIlxyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgICAgIGZyb20gXCJHcmFwaGljc1wiXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJ9ICAgICAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBWaWV3ZXJDb250cm9sc1xyXG4gKi9cclxuY2xhc3MgTW9kZWxWaWV3ZXJTZXR0aW5ncyB7XHJcblxyXG4gICAgZGlzcGxheUdyaWQgICAgOiBib29sZWFuO1xyXG4gICAgZ2VuZXJhdGVSZWxpZWYgOiAoKSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihnZW5lcmF0ZVJlbGllZiA6ICgpID0+IGFueSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZGlzcGxheUdyaWQgICAgPSB0cnVlOyBcclxuICAgICAgICB0aGlzLmdlbmVyYXRlUmVsaWVmID0gZ2VuZXJhdGVSZWxpZWY7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNb2RlbFZpZXdlciBVSSBDb250cm9scy5cclxuICovICAgIFxyXG5leHBvcnQgY2xhc3MgTW9kZWxWaWV3ZXJDb250cm9scyB7XHJcblxyXG4gICAgX21vZGVsVmlld2VyICAgICAgICAgOiBNb2RlbFZpZXdlcjsgICAgICAgICAgICAgICAgICAgICAvLyBhc3NvY2lhdGVkIHZpZXdlclxyXG4gICAgX21vZGVsVmlld2VyU2V0dGluZ3MgOiBNb2RlbFZpZXdlclNldHRpbmdzOyAgICAgICAgICAgICAvLyBVSSBzZXR0aW5nc1xyXG5cclxuICAgIC8qKiBEZWZhdWx0IGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAY2xhc3MgTW9kZWxWaWV3ZXJDb250cm9sc1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGVsVmlld2VyIDogTW9kZWxWaWV3ZXIpIHsgIFxyXG5cclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlciA9IG1vZGVsVmlld2VyO1xyXG5cclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4vLyNyZWdpb24gRXZlbnQgSGFuZGxlcnNcclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGEgcmVsaWVmIGZyb20gdGhlIGN1cnJlbnQgbW9kZWwgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZW5lcmF0ZVJlbGllZigpIDogdm9pZCB7IFxyXG5cclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlci5nZW5lcmF0ZVJlbGllZigpO1xyXG4gICAgfVxyXG4vLyNlbmRyZWdpb25cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHZpZXcgc2V0dGluZ3MgdGhhdCBhcmUgY29udHJvbGxhYmxlIGJ5IHRoZSB1c2VyXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDb250cm9scygpIHtcclxuXHJcbiAgICAgICAgbGV0IHNjb3BlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXJTZXR0aW5ncyA9IG5ldyBNb2RlbFZpZXdlclNldHRpbmdzKHRoaXMuZ2VuZXJhdGVSZWxpZWYuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgZGF0Lmd1aSBhbmQgY29udHJvbHMgZm9yIHRoZSBVSVxyXG4gICAgICAgIGxldCBndWkgPSBuZXcgZGF0LkdVSSh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMjBcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgbWVudURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuX21vZGVsVmlld2VyLmNvbnRhaW5lcklkKTtcclxuICAgICAgICBtZW51RGl2LmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNb2RlbFZpZXdlciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcbiAgICAgICAgbGV0IG1vZGVsVmlld2VyT3B0aW9ucyA9IGd1aS5hZGRGb2xkZXIoJ01vZGVsVmlld2VyIE9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgLy8gR3JpZFxyXG4gICAgICAgIGxldCBjb250cm9sRGlzcGxheUdyaWQgPSBtb2RlbFZpZXdlck9wdGlvbnMuYWRkKHRoaXMuX21vZGVsVmlld2VyU2V0dGluZ3MsICdkaXNwbGF5R3JpZCcpLm5hbWUoJ0Rpc3BsYXkgR3JpZCcpO1xyXG4gICAgICAgIGNvbnRyb2xEaXNwbGF5R3JpZC5vbkNoYW5nZSAoKHZhbHVlIDogYm9vbGVhbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuX21vZGVsVmlld2VyLmRpc3BsYXlHcmlkKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gR2VuZXJhdGUgUmVsaWVmXHJcbiAgICAgICAgbGV0IGNvbnRyb2xHZW5lcmF0ZVJlbGllZiA9IG1vZGVsVmlld2VyT3B0aW9ucy5hZGQodGhpcy5fbW9kZWxWaWV3ZXJTZXR0aW5ncywgJ2dlbmVyYXRlUmVsaWVmJykubmFtZSgnR2VuZXJhdGUgUmVsaWVmJyk7XHJcblxyXG4gICAgICAgIG1vZGVsVmlld2VyT3B0aW9ucy5vcGVuKCk7XHJcbiAgICB9ICAgIFxyXG59XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgICAgIGZyb20gJ0NhbWVyYSdcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgICAgIGZyb20gXCJEZXB0aEJ1ZmZlckZhY3RvcnlcIlxyXG5pbXBvcnQge0V2ZW50TWFuYWdlciwgRXZlbnRUeXBlfSAgICAgICAgZnJvbSAnRXZlbnRNYW5hZ2VyJ1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TWF0ZXJpYWxzfSAgICAgICAgICAgICAgICAgICAgICBmcm9tICdNYXRlcmlhbHMnXHJcbmltcG9ydCB7TW9kZWxWaWV3ZXJDb250cm9sc30gICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJDb250cm9sc1wiXHJcbmltcG9ydCB7TG9nZ2VyfSAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tICdMb2dnZXInXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtTZXJ2aWNlc30gICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnVmlld2VyJ1xyXG5cclxuY29uc3QgT2JqZWN0TmFtZXMgPSB7XHJcbiAgICBHcmlkIDogICdHcmlkJ1xyXG59XHJcblxyXG4vKipcclxuICogQGV4cG9ydHMgVmlld2VyL01vZGVsVmlld2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTW9kZWxWaWV3ZXIgZXh0ZW5kcyBWaWV3ZXIge1xyXG5cclxuICAgIF9tb2RlbFZpZXdlckNvbnRyb2xzIDogTW9kZWxWaWV3ZXJDb250cm9sczsgICAgICAgICAgICAgLy8gVUkgY29udHJvbHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29uc3RydWN0b3JcclxuICAgICAqIEBjbGFzcyBNb2RlbFZpZXdlclxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBWaWV3ZXIgbmFtZS5cclxuICAgICAqIEBwYXJhbSBtb2RlbENhbnZhc0lkIEhUTUwgZWxlbWVudCB0byBob3N0IHRoZSB2aWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgOiBzdHJpbmcsIG1vZGVsQ2FudmFzSWQgOiBzdHJpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlciAobmFtZSwgbW9kZWxDYW52YXNJZCk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuLy8jcmVnaW9uIFByb3BlcnRpZXNcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbW9kZWwuXHJcbiAgICAgKi9cclxuICAgIHNldE1vZGVsKHZhbHVlIDogVEhSRUUuR3JvdXApIHtcclxuXHJcbiAgICAgICAgLy8gQ2FsbCBiYXNlIGNsYXNzIHByb3BlcnR5IHZpYSBzdXBlclxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvNDQ2NSAgICAgICAgXHJcbiAgICAgICAgc3VwZXIuc2V0TW9kZWwodmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBkaXNwYXRjaCBOZXdNb2RlbCBldmVudFxyXG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRoaXMsIEV2ZW50VHlwZS5OZXdNb2RlbCwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLy8jcmVnaW9uIEluaXRpYWxpemF0aW9uICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3B1bGF0ZSBzY2VuZS5cclxuICAgICAqL1xyXG4gICAgcG9wdWxhdGVTY2VuZSAoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLnBvcHVsYXRlU2NlbmUoKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDMwMCwgMzAsIDB4ODZlNmZmLCAweDk5OTk5OSk7XHJcbiAgICAgICAgaGVscGVyLm5hbWUgPSBPYmplY3ROYW1lcy5HcmlkO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZChoZWxwZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhbCBpbml0aWFsaXphdGlvblxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICogVUkgY29udHJvbHMgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVVSUNvbnRyb2xzKCkge1xyXG5cclxuICAgICAgICBzdXBlci5pbml0aWFsaXplVUlDb250cm9scygpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXJDb250cm9scyA9IG5ldyBNb2RlbFZpZXdlckNvbnRyb2xzKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vLyNyZWdpb24gU2NlbmVcclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSB0aGUgcmVmZXJlbmNlIGdyaWQuXHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlHcmlkKHZpc2libGUgOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIGxldCBncmlkR2VvbWV0cnkgOiBUSFJFRS5PYmplY3QzRCA9IHRoaXMuX3NjZW5lLmdldE9iamVjdEJ5TmFtZShPYmplY3ROYW1lcy5HcmlkKTtcclxuICAgICAgICBncmlkR2VvbWV0cnkudmlzaWJsZSA9IHZpc2libGU7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmFkZEluZm9NZXNzYWdlKGBEaXNwbGF5IGdyaWQgPSAke3Zpc2libGV9YCk7XHJcbiAgICB9IFxyXG4vLyNlbmRyZWdpb25cclxuXHJcbi8vI3JlZ2lvbiBNZXNoIEdlbmVyYXRpb25cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGEgcmVsaWVmIGZyb20gdGhlIGN1cnJlbnQgbW9kZWwgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBnZW5lcmF0ZVJlbGllZigpIDogdm9pZCB7IFxyXG4gICAgICAgIFxyXG4gICAgLy8gcGl4ZWxzXHJcbiAgICBsZXQgd2lkdGggID0gNTEyO1xyXG4gICAgbGV0IGhlaWdodCA9IHdpZHRoIC8gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgIGxldCBmYWN0b3J5ID0gbmV3IERlcHRoQnVmZmVyRmFjdG9yeSh7d2lkdGggOiB3aWR0aCwgaGVpZ2h0IDogaGVpZ2h0LCBtb2RlbCA6IHRoaXMubW9kZWwsIGNhbWVyYSA6IHRoaXMuY2FtZXJhLCBhZGRDYW52YXNUb0RPTSA6IGZhbHNlfSk7ICAgXHJcblxyXG4gICAgbGV0IHByZXZpZXdNZXNoIDogVEhSRUUuTWVzaCA9IGZhY3RvcnkubWVzaEdlbmVyYXRlKHt9KTsgICBcclxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRoaXMsIEV2ZW50VHlwZS5NZXNoR2VuZXJhdGUsIHByZXZpZXdNZXNoKTtcclxuXHJcbiAgICAvLyBTZXJ2aWNlcy5jb25zb2xlTG9nZ2VyLmFkZEluZm9NZXNzYWdlKCdSZWxpZWYgZ2VuZXJhdGVkJyk7XHJcbn1cclxuLy8jZW5kcmVnaW9uXHJcbn0gXHJcblxyXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLyBcclxuLy8gTW9kZWxSZWxpZWYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDwyMDE3PiBTdGV2ZSBLbmlwbWV5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFICBmcm9tICd0aHJlZScgXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtTdGFuZGFyZFZpZXd9ICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiQ2FtZXJhXCJcclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICAgICAgICAgICAgICBmcm9tIFwiRGVwdGhCdWZmZXJGYWN0b3J5XCJcclxuaW1wb3J0IHtFdmVudFR5cGUsIE1SRXZlbnQsIEV2ZW50TWFuYWdlcn0gICBmcm9tICdFdmVudE1hbmFnZXInXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAnTG9hZGVyJ1xyXG5pbXBvcnQge0xvZ2dlciwgQ29uc29sZUxvZ2dlcn0gICAgICAgICAgICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtHcmFwaGljc30gICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiR3JhcGhpY3NcIlxyXG5pbXBvcnQge01lc2hWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJNZXNoVmlld2VyXCJcclxuaW1wb3J0IHtNb2RlbFZpZXdlcn0gICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiTW9kZWxWaWV3ZXJcIlxyXG5pbXBvcnQge09CSkxvYWRlcn0gICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gXCJPQkpMb2FkZXJcIlxyXG5pbXBvcnQge1NlcnZpY2VzfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1Rlc3RNb2RlbH0gICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gJ1Rlc3RNb2RlbExvYWRlcidcclxuaW1wb3J0IHtWaWV3ZXJ9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIFwiVmlld2VyXCJcclxuICAgIFxyXG5leHBvcnQgY2xhc3MgTW9kZWxSZWxpZWYge1xyXG5cclxuICAgIF9tZXNoVmlld2VyICAgICAgICAgICAgIDogTWVzaFZpZXdlcjtcclxuICAgIF9tb2RlbFZpZXdlciAgICAgICAgICAgIDogTW9kZWxWaWV3ZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgICAgICAgICA6IExvYWRlcjtcclxuICAgIFxyXG4gICAgX2luaXRpYWxNZXNoR2VuZXJhdGlvbiAgOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIE1vZGVsUmVsaWVmXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgIH1cclxuXHJcbi8vI3JlZ2lvbiBFdmVudCBIYW5kbGVyc1xyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBtZXNoIGdlbmVyYXRpb24uXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgTWVzaCBnZW5lcmF0aW9uIGV2ZW50LlxyXG4gICAgICogQHBhcmFtcyBtZXNoIE5ld2x5LWdlbmVyYXRlZCBtZXNoLlxyXG4gICAgICovXHJcbiAgICBvbk1lc2hHZW5lcmF0ZSAoZXZlbnQgOiBNUkV2ZW50LCBtZXNoIDogVEhSRUUuTWVzaCkge1xyXG5cclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyLnNldE1vZGVsKG1lc2gpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faW5pdGlhbE1lc2hHZW5lcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21lc2hWaWV3ZXIuZml0VmlldygpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsTWVzaEdlbmVyYXRpb24gPSBmYWxzZTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBuZXcgbW9kZWwuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgTmV3TW9kZWwgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgTmV3bHkgbG9hZGVkIG1vZGVsLlxyXG4gICAgICovXHJcbiAgICBvbk5ld01vZGVsIChldmVudCA6IE1SRXZlbnQsIG1vZGVsIDogVEhSRUUuR3JvdXApIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyhTdGFuZGFyZFZpZXcuRnJvbnQpOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbWVzaFZpZXdlci5zZXRDYW1lcmFUb1N0YW5kYXJkVmlldyhTdGFuZGFyZFZpZXcuVG9wKTsgICAgICAgXHJcbiAgICB9XHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoIHRoZSBtb2RlbCBWaWV3ZXIuXHJcbiAgICAgKi9cclxuICAgIHJ1biAoKSB7XHJcblxyXG4gICAgICAgIFNlcnZpY2VzLmNvbnNvbGVMb2dnZXIuYWRkSW5mb01lc3NhZ2UgKCdNb2RlbFJlbGllZiBzdGFydGVkJyk7ICAgXHJcbiAgICAgICBcclxuICAgICAgICAvLyBNZXNoIFByZXZpZXdcclxuICAgICAgICB0aGlzLl9tZXNoVmlld2VyID0gIG5ldyBNZXNoVmlld2VyKCdNZXNoVmlld2VyJywgJ21lc2hDYW52YXMnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBNb2RlbCBWaWV3ZXIgICAgXHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIgPSBuZXcgTW9kZWxWaWV3ZXIoJ01vZGVsVmlld2VyJywgJ21vZGVsQ2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxWaWV3ZXIuZXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLk1lc2hHZW5lcmF0ZSwgdGhpcy5vbk1lc2hHZW5lcmF0ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9tb2RlbFZpZXdlci5ldmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTmV3TW9kZWwsICAgICB0aGlzLm9uTmV3TW9kZWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTG9hZGVyXHJcbiAgICAgICAgdGhpcy5fbG9hZGVyID0gbmV3IExvYWRlcigpO1xyXG5cclxuICAgICAgICAvLyBPQkogTW9kZWxzXHJcbiAgICAgICAgdGhpcy5fbG9hZGVyLmxvYWRPQkpNb2RlbCAodGhpcy5fbW9kZWxWaWV3ZXIpO1xyXG5cclxuICAgICAgICAvLyBUZXN0IE1vZGVsc1xyXG4vLyAgICAgIHRoaXMuX2xvYWRlci5sb2FkUGFyYW1ldHJpY1Rlc3RNb2RlbCh0aGlzLl9tb2RlbFZpZXdlciwgVGVzdE1vZGVsLkNoZWNrZXJib2FyZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBtb2RlbFJlbGllZiA9IG5ldyBNb2RlbFJlbGllZigpO1xyXG5tb2RlbFJlbGllZi5ydW4oKTtcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHthc3NlcnR9ICAgZnJvbSAnY2hhaSdcclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXHJcblxyXG5pbXBvcnQge0RlcHRoQnVmZmVyfSBmcm9tICdEZXB0aEJ1ZmZlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gZnJvbSAnTWF0aCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLyoqXHJcbiAqIEBleHBvcnRzIFZpZXdlci9WaWV3ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVbml0VGVzdHMge1xyXG4gICBcclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCBjb25zdHJ1Y3RvclxyXG4gICAgICogQGNsYXNzIFVuaXRUZXN0c1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgICAgICBcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIHN0YXRpYyBWZXJ0ZXhNYXBwaW5nIChkZXB0aEJ1ZmZlciA6IERlcHRoQnVmZmVyLCBtZXNoIDogVEhSRUUuTWVzaCkge1xyXG5cclxuICAgICAgICBsZXQgbWVzaEdlb21ldHJ5IDogVEhSRUUuR2VvbWV0cnkgPSA8VEhSRUUuR2VvbWV0cnk+IG1lc2guZ2VvbWV0cnk7XHJcbiAgICAgICAgbWVzaEdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IG1lc2hHZW9tZXRyeS5ib3VuZGluZ0JveDtcclxuXHJcbiAgICAgICAgLy8gd2lkdGggID0gMyAgICAgICAgICAgICAgMyAgIDQgICA1XHJcbiAgICAgICAgLy8gY29sdW1uID0gMiAgICAgICAgICAgICAgMCAgIDEgICAyXHJcbiAgICAgICAgLy8gYnVmZmVyIGxlbmd0aCA9IDZcclxuXHJcbiAgICAgICAgLy8gVGVzdCBQb2ludHMgICAgICAgICAgICBcclxuICAgICAgICBsZXQgbG93ZXJMZWZ0ICA9IGJvdW5kaW5nQm94Lm1pbjtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodCA9IG5ldyBUSFJFRS5WZWN0b3IzIChib3VuZGluZ0JveC5tYXgueCwgYm91bmRpbmdCb3gubWluLnksIDApO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0ID0gYm91bmRpbmdCb3gubWF4O1xyXG4gICAgICAgIGxldCB1cHBlckxlZnQgID0gbmV3IFRIUkVFLlZlY3RvcjMgKGJvdW5kaW5nQm94Lm1pbi54LCBib3VuZGluZ0JveC5tYXgueSwgMCk7XHJcbiAgICAgICAgbGV0IGNlbnRlciAgICAgPSBib3VuZGluZ0JveC5nZXRDZW50ZXIoKTtcclxuXHJcbiAgICAgICAgLy8gRXhwZWN0ZWQgVmFsdWVzXHJcbiAgICAgICAgbGV0IGJ1ZmZlckxlbmd0aCAgICA6IG51bWJlciA9IChkZXB0aEJ1ZmZlci53aWR0aCAqIGRlcHRoQnVmZmVyLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGxldCBmaXJzdENvbHVtbiAgIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgbGFzdENvbHVtbiAgICA6IG51bWJlciA9IGRlcHRoQnVmZmVyLndpZHRoIC0gMTtcclxuICAgICAgICBsZXQgY2VudGVyQ29sdW1uICA6IG51bWJlciA9IE1hdGgucm91bmQoZGVwdGhCdWZmZXIud2lkdGggLyAyKTtcclxuICAgICAgICBsZXQgZmlyc3RSb3cgICAgICA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGxhc3RSb3cgICAgICAgOiBudW1iZXIgPSBkZXB0aEJ1ZmZlci5oZWlnaHQgLSAxO1xyXG4gICAgICAgIGxldCBjZW50ZXJSb3cgICAgIDogbnVtYmVyID0gTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci5oZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdEluZGV4ICA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHRJbmRleCA6IG51bWJlciA9IGRlcHRoQnVmZmVyLndpZHRoIC0gMTtcclxuICAgICAgICBsZXQgdXBwZXJSaWdodEluZGV4IDogbnVtYmVyID0gYnVmZmVyTGVuZ3RoIC0gMTtcclxuICAgICAgICBsZXQgdXBwZXJMZWZ0SW5kZXggIDogbnVtYmVyID0gYnVmZmVyTGVuZ3RoIC0gZGVwdGhCdWZmZXIud2lkdGg7XHJcbiAgICAgICAgbGV0IGNlbnRlckluZGV4ICAgICA6IG51bWJlciA9IChjZW50ZXJSb3cgKiBkZXB0aEJ1ZmZlci53aWR0aCkgKyAgTWF0aC5yb3VuZChkZXB0aEJ1ZmZlci53aWR0aCAvIDIpO1xyXG5cclxuICAgICAgICBsZXQgbG93ZXJMZWZ0SW5kaWNlcyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoZmlyc3RSb3csIGZpcnN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgbG93ZXJSaWdodEluZGljZXMgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoZmlyc3RSb3csIGxhc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCB1cHBlclJpZ2h0SW5kaWNlcyA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihsYXN0Um93LCBsYXN0Q29sdW1uKTtcclxuICAgICAgICBsZXQgdXBwZXJMZWZ0SW5kaWNlcyAgOiBUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIobGFzdFJvdywgZmlyc3RDb2x1bW4pO1xyXG4gICAgICAgIGxldCBjZW50ZXJJbmRpY2VzICAgICA6IFRIUkVFLlZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMihjZW50ZXJSb3csIGNlbnRlckNvbHVtbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4ICAgOiBudW1iZXJcclxuICAgICAgICBsZXQgaW5kaWNlcyA6IFRIUkVFLlZlY3RvcjI7XHJcblxyXG4gICAgICAgIC8vIExvd2VyIExlZnRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKGxvd2VyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgbG93ZXJMZWZ0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ICAgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KGxvd2VyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgbG93ZXJMZWZ0SW5kZXgpO1xyXG5cclxuICAgICAgICAvLyBMb3dlciBSaWdodFxyXG4gICAgICAgIGluZGljZXMgPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGljZXMobG93ZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgbG93ZXJSaWdodEluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgobG93ZXJSaWdodCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbmRleCwgbG93ZXJSaWdodEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gVXBwZXIgUmlnaHRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHVwcGVyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIHVwcGVyUmlnaHRJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgaW5kZXggPSBkZXB0aEJ1ZmZlci5nZXRNb2RlbFZlcnRleEluZGV4KHVwcGVyUmlnaHQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIHVwcGVyUmlnaHRJbmRleCk7XHJcblxyXG4gICAgICAgIC8vIFVwcGVyIExlZnRcclxuICAgICAgICBpbmRpY2VzID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRpY2VzKHVwcGVyTGVmdCwgYm91bmRpbmdCb3gpO1xyXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5kaWNlcywgdXBwZXJMZWZ0SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGluZGV4ID0gZGVwdGhCdWZmZXIuZ2V0TW9kZWxWZXJ0ZXhJbmRleCh1cHBlckxlZnQsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5kZXgsIHVwcGVyTGVmdEluZGV4KTtcclxuXHJcbiAgICAgICAgLy8gQ2VudGVyXHJcbiAgICAgICAgaW5kaWNlcyA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kaWNlcyhjZW50ZXIsIGJvdW5kaW5nQm94KTtcclxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluZGljZXMsIGNlbnRlckluZGljZXMpO1xyXG5cclxuICAgICAgICBpbmRleCA9IGRlcHRoQnVmZmVyLmdldE1vZGVsVmVydGV4SW5kZXgoY2VudGVyLCBib3VuZGluZ0JveCk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluZGV4LCBjZW50ZXJJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgfSBcclxuXHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICAgICAgZnJvbSAndGhyZWUnXHJcbmltcG9ydCAqIGFzIGRhdCAgICBmcm9tICdkYXQtZ3VpJ1xyXG5cclxuaW1wb3J0IHtDYW1lcmF9ICAgICAgICAgICAgICAgICAgICAgZnJvbSAnQ2FtZXJhJ1xyXG5pbXBvcnQge0RlcHRoQnVmZmVyRmFjdG9yeX0gICAgICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3MsIE9iamVjdE5hbWVzfSAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9hZGVyfSAgICAgICAgICAgICAgICAgICAgIGZyb20gJ0xvYWRlcidcclxuaW1wb3J0IHtMb2dnZXIsIENvbnNvbGVMb2dnZXJ9ICAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01lc2hWaWV3ZXJ9ICAgICAgICAgICAgICAgICBmcm9tIFwiTWVzaFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgICAgIGZyb20gJ1NlcnZpY2VzJ1xyXG5pbXBvcnQge1RyYWNrYmFsbENvbnRyb2xzfSAgICAgICAgICBmcm9tICdUcmFja2JhbGxDb250cm9scydcclxuaW1wb3J0IHtVbml0VGVzdHN9ICAgICAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5pbXBvcnQge1ZpZXdlcn0gICAgICAgICAgICAgICAgICAgICBmcm9tICdWaWV3ZXInXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYW1lcmFTZXR0aW5ncyB7XHJcbiAgICBwb3NpdGlvbjogICAgICAgVEhSRUUuVmVjdG9yMzsgICAgICAgIC8vIGxvY2F0aW9uIG9mIGNhbWVyYVxyXG4gICAgdGFyZ2V0OiAgICAgICAgIFRIUkVFLlZlY3RvcjM7ICAgICAgICAvLyB0YXJnZXQgcG9pbnRcclxuICAgIG5lYXI6ICAgICAgICAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gbmVhciBjbGlwcGluZyBwbGFuZVxyXG4gICAgZmFyOiAgICAgICAgICAgIG51bWJlcjsgICAgICAgICAgICAgICAvLyBmYXIgY2xpcHBpbmcgcGxhbmVcclxuICAgIGZpZWxkT2ZWaWV3OiAgICBudW1iZXI7ICAgICAgICAgICAgICAgLy8gZmllbGQgb2Ygdmlld1xyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIENhbWVyYVdvcmtiZW5jaFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbWVyYVZpZXdlciBleHRlbmRzIFZpZXdlciB7XHJcblxyXG4gICAgcG9wdWxhdGVTY2VuZSgpIHtcclxuXHJcbiAgICAgICAgbGV0IHRyaWFkID0gR3JhcGhpY3MuY3JlYXRlV29ybGRBeGVzVHJpYWQobmV3IFRIUkVFLlZlY3RvcjMoKSwgMSwgMC4yNSwgMC4yNSk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkKHRyaWFkKTtcclxuXHJcbiAgICAgICAgbGV0IGJveCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3hNZXNoKG5ldyBUSFJFRS5WZWN0b3IzKDQsIDYsIC0yKSwgMSwgMiwgMiwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvciA6IDB4ZmYwMDAwfSkpO1xyXG4gICAgICAgIGJveC5yb3RhdGlvbi5zZXQoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgYm94LnVwZGF0ZU1hdHJpeFdvcmxkKHRydWUpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKGJveCk7XHJcblxyXG4gICAgICAgIGxldCBzcGhlcmUgOiBUSFJFRS5NZXNoID0gR3JhcGhpY3MuY3JlYXRlU3BoZXJlTWVzaChuZXcgVEhSRUUuVmVjdG9yMygtMywgMTAsIC0xKSwgMSwgbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvciA6IDB4MDBmZjAwfSkpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuYWRkKHNwaGVyZSk7XHJcbiAgICB9ICAgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVmlld2VyQ29udHJvbHNcclxuICovXHJcbmNsYXNzIFZpZXdlckNvbnRyb2xzIHtcclxuXHJcbiAgICBzaG93Qm91bmRpbmdCb3hlcyA6ICgpID0+IHZvaWQ7XHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcyA6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSwgc2hvd0JvdW5kaW5nQm94ZXMgOiAoKSA9PiBhbnksIHNldENsaXBwaW5nUGxhbmVzIDogKCkgPT4gYW55KSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMgPSBzaG93Qm91bmRpbmdCb3hlcztcclxuICAgICAgICB0aGlzLnNldENsaXBwaW5nUGxhbmVzICA9IHNldENsaXBwaW5nUGxhbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEFwcFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBcclxuICAgIF9sb2dnZXIgICAgICAgICA6IENvbnNvbGVMb2dnZXI7XHJcbiAgICBfbG9hZGVyICAgICAgICAgOiBMb2FkZXI7XHJcbiAgICBfdmlld2VyICAgICAgICAgOiBDYW1lcmFWaWV3ZXI7XHJcbiAgICBfdmlld2VyQ29udHJvbHMgOiBWaWV3ZXJDb250cm9scztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgY2FtZXJhIGNsaXBwaW5nIHBsYW5lcyB0byB0aGUgbW9kZWwgZXh0ZW50cyBpbiBWaWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICovXHJcbiAgICBzZXRDbGlwcGluZ1BsYW5lcygpIHtcclxuXHJcbiAgICAgICAgbGV0IG1vZGVsICAgICAgICAgICAgICAgICAgICA6IFRIUkVFLkdyb3VwICAgPSB0aGlzLl92aWV3ZXIubW9kZWw7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjbG9uZSBtb2RlbCAoYW5kIGdlb21ldHJ5ISlcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3OiBUSFJFRS5Cb3gzID0gR3JhcGhpY3MuZ2V0VHJhbnNmb3JtZWRCb3VuZGluZ0JveChtb2RlbCwgY2FtZXJhTWF0cml4V29ybGRJbnZlcnNlKTsgICAgICAgIFxyXG5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgYm94IGlzIHdvcmxkLWF4aXMgYWxpZ25lZC4gXHJcbiAgICAgICAgLy8gSU52IFZpZXcgY29vcmRpbmF0ZXMsIHRoZSBjYW1lcmEgaXMgYXQgdGhlIG9yaWdpbi5cclxuICAgICAgICAvLyBUaGUgYm91bmRpbmcgbmVhciBwbGFuZSBpcyB0aGUgbWF4aW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGZhciBwbGFuZSBpcyB0aGUgbWluaW11bSBaIG9mIHRoZSBib3VuZGluZyBib3guXHJcbiAgICAgICAgbGV0IG5lYXJQbGFuZSA9IC1ib3VuZGluZ0JveFZpZXcubWF4Lno7XHJcbiAgICAgICAgbGV0IGZhclBsYW5lICA9IC1ib3VuZGluZ0JveFZpZXcubWluLno7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5fY2FtZXJhQ29udHJvbHMuX2NhbWVyYVNldHRpbmdzLm5lYXJDbGlwcGluZ1BsYW5lID0gbmVhclBsYW5lO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5fY2FtZXJhQ29udHJvbHMuX2NhbWVyYVNldHRpbmdzLmZhckNsaXBwaW5nUGxhbmUgID0gZmFyUGxhbmU7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlci5jYW1lcmEubmVhciA9IG5lYXJQbGFuZTtcclxuICAgICAgICB0aGlzLl92aWV3ZXIuY2FtZXJhLmZhciAgPSBmYXJQbGFuZTtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlld2VyLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBib3VuZGluZyBib3ggbWVzaC5cclxuICAgICAqIEBwYXJhbSBvYmplY3QgVGFyZ2V0IG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBjb2xvciBDb2xvciBvZiBib3VuZGluZyBib3ggbWVzaC5cclxuICAgICAqL1xyXG4gICAgY3JlYXRlQm91bmRpbmdCb3ggKG9iamVjdCA6IFRIUkVFLk9iamVjdDNELCBjb2xvciA6IG51bWJlcikgOiBUSFJFRS5NZXNoIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGJvdW5kaW5nQm94IDogVEhSRUUuQm94MyA9IG5ldyBUSFJFRS5Cb3gzKCk7XHJcbiAgICAgICAgICAgIGJvdW5kaW5nQm94ID0gYm91bmRpbmdCb3guc2V0RnJvbU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7Y29sb3IgOiBjb2xvciwgb3BhY2l0eSA6IDEuMCwgd2lyZWZyYW1lIDogdHJ1ZX0pOyAgICAgICBcclxuICAgICAgICAgICAgbGV0IGJvdW5kaW5nQm94TWVzaCA6IFRIUkVFLk1lc2ggPSBHcmFwaGljcy5jcmVhdGVCb3VuZGluZ0JveE1lc2hGcm9tQm91bmRpbmdCb3goYm91bmRpbmdCb3guZ2V0Q2VudGVyKCksIGJvdW5kaW5nQm94LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZGluZ0JveE1lc2g7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIGNsaXBwaW5nIHBsYW5lcyBvZiB0aGUgbW9kZWwgaW4gVmlldyBhbmQgV29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKi9cclxuICAgIHNob3dCb3VuZGluZ0JveGVzKCkge1xyXG5cclxuICAgICAgICBsZXQgbW9kZWwgICAgICAgICAgICAgICAgICAgIDogVEhSRUUuR3JvdXAgICA9IHRoaXMuX3ZpZXdlci5tb2RlbDtcclxuICAgICAgICBsZXQgY2FtZXJhTWF0cml4V29ybGQgICAgICAgIDogVEhSRUUuTWF0cml4NCA9IHRoaXMuX3ZpZXdlci5jYW1lcmEubWF0cml4V29ybGQ7XHJcbiAgICAgICAgbGV0IGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSA6IFRIUkVFLk1hdHJpeDQgPSB0aGlzLl92aWV3ZXIuY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nIEJvdW5kaW5nQm94ZXMgYW5kIG1vZGVsIGNsb25lIChWaWV3IGNvb3JkaW5hdGVzKVxyXG4gICAgICAgIG1vZGVsLnJlbW92ZShtb2RlbC5nZXRPYmplY3RCeU5hbWUoT2JqZWN0TmFtZXMuQm91bmRpbmdCb3gpKTtcclxuICAgICAgICBtb2RlbC5yZW1vdmUobW9kZWwuZ2V0T2JqZWN0QnlOYW1lKE9iamVjdE5hbWVzLkJvdW5kaW5nQm94KSk7XHJcbiAgICAgICAgbW9kZWwucmVtb3ZlKG1vZGVsLmdldE9iamVjdEJ5TmFtZShPYmplY3ROYW1lcy5Nb2RlbENsb25lKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY2xvbmUgbW9kZWwgKGFuZCBnZW9tZXRyeSEpXHJcbiAgICAgICAgbGV0IG1vZGVsVmlldyAgPSAgR3JhcGhpY3MuY2xvbmVBbmRUcmFuc2Zvcm1PYmplY3QobW9kZWwsIGNhbWVyYU1hdHJpeFdvcmxkSW52ZXJzZSk7XHJcbiAgICAgICAgbW9kZWxWaWV3Lm5hbWUgPSBPYmplY3ROYW1lcy5Nb2RlbENsb25lO1xyXG4gICAgICAgIG1vZGVsLmFkZChtb2RlbFZpZXcpO1xyXG5cclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hWaWV3IDogVEhSRUUuTWVzaCA9IHRoaXMuY3JlYXRlQm91bmRpbmdCb3gobW9kZWxWaWV3LCAweGZmMDBmZik7XHJcbiAgICAgICAgbW9kZWwuYWRkKGJvdW5kaW5nQm94Vmlldyk7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBib3VuZGluZyBib3ggYmFjayBmcm9tIFZpZXcgdG8gV29ybGRcclxuICAgICAgICBsZXQgYm91bmRpbmdCb3hXb3JsZCA9ICBHcmFwaGljcy5jbG9uZUFuZFRyYW5zZm9ybU9iamVjdChib3VuZGluZ0JveFZpZXcsIGNhbWVyYU1hdHJpeFdvcmxkKTtcclxuICAgICAgICBtb2RlbC5hZGQoYm91bmRpbmdCb3hXb3JsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSB2aWV3IHNldHRpbmdzIHRoYXQgYXJlIGNvbnRyb2xsYWJsZSBieSB0aGUgdXNlclxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplVmlld2VyQ29udHJvbHMoKSB7XHJcblxyXG4gICAgICAgIGxldCBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXdlckNvbnRyb2xzID0gbmV3IFZpZXdlckNvbnRyb2xzKHRoaXMuX3ZpZXdlci5jYW1lcmEsIHRoaXMuc2hvd0JvdW5kaW5nQm94ZXMuYmluZCh0aGlzKSwgdGhpcy5zZXRDbGlwcGluZ1BsYW5lcy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBkYXQuZ3VpIGFuZCBjb250cm9scyBmb3IgdGhlIFVJXHJcbiAgICAgICAgdmFyIGd1aSA9IG5ldyBkYXQuR1VJKHtcclxuICAgICAgICAgICAgYXV0b1BsYWNlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBzZXR0aW5nc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5nc0NvbnRyb2xzJyk7XHJcbiAgICAgICAgc2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQoZ3VpLmRvbUVsZW1lbnQpO1xyXG4gICAgICAgIHZhciBmb2xkZXJPcHRpb25zID0gZ3VpLmFkZEZvbGRlcignQ2FtZXJhVGVzdCBPcHRpb25zJyk7XHJcblxyXG4gICAgICAgIC8vIFNob3cgQm91bmRpbmcgQm94ZXNcclxuICAgICAgICBsZXQgY29udHJvbFNob3dCb3VuZGluZ0JveGVzID0gZm9sZGVyT3B0aW9ucy5hZGQodGhpcy5fdmlld2VyQ29udHJvbHMsICdzaG93Qm91bmRpbmdCb3hlcycpLm5hbWUoJ1Nob3cgQm91bmRpbmcgQm94ZXMnKTtcclxuXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgUGxhbmVzXHJcbiAgICAgICAgbGV0IGNvbnRyb2xTZXRDbGlwcGluZ1BsYW5lcyA9IGZvbGRlck9wdGlvbnMuYWRkKHRoaXMuX3ZpZXdlckNvbnRyb2xzLCAnc2V0Q2xpcHBpbmdQbGFuZXMnKS5uYW1lKCdTZXQgQ2xpcHBpbmcgUGxhbmVzJyk7XHJcblxyXG4gICAgICAgIGZvbGRlck9wdGlvbnMub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBydW4gKCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IFNlcnZpY2VzLmNvbnNvbGVMb2dnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVmlld2VyICAgIFxyXG4gICAgICAgIHRoaXMuX3ZpZXdlciA9IG5ldyBDYW1lcmFWaWV3ZXIoJ0NhbWVyYVZpZXdlcicsICd2aWV3ZXJDYW52YXMnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBVSSBDb250cm9sc1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXdlckNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBhcHAgPSBuZXcgQXBwO1xyXG5hcHAucnVuKCk7XHJcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vIFxyXG4vLyBNb2RlbFJlbGllZiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIENvcHlyaWdodCAoYykgPDIwMTc+IFN0ZXZlIEtuaXBtZXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0ICogYXMgVEhSRUUgICAgICAgICAgICAgICBmcm9tICd0aHJlZSdcclxuXHJcbmltcG9ydCB7RGVwdGhCdWZmZXJGYWN0b3J5fSAgICAgZnJvbSAnRGVwdGhCdWZmZXJGYWN0b3J5J1xyXG5pbXBvcnQge0dyYXBoaWNzfSAgICAgICAgICAgICAgIGZyb20gJ0dyYXBoaWNzJ1xyXG5pbXBvcnQge0xvZ2dlciwgSFRNTExvZ2dlcn0gICAgIGZyb20gJ0xvZ2dlcidcclxuaW1wb3J0IHtNYXRoTGlicmFyeX0gICAgICAgICAgICBmcm9tICdNYXRoJ1xyXG5pbXBvcnQge01vZGVsVmlld2VyfSAgICAgICAgICAgIGZyb20gXCJNb2RlbFZpZXdlclwiXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBEZXB0aEJ1ZmZlclRlc3RcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZXB0aEJ1ZmZlclRlc3Qge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpblxyXG4gICAgICovXHJcbiAgICBtYWluICgpIHtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGRlcHRoQnVmZmVyVGVzdCA9IG5ldyBEZXB0aEJ1ZmZlclRlc3QoKTtcclxuZGVwdGhCdWZmZXJUZXN0Lm1haW4oKTtcclxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy8gXHJcbi8vIE1vZGVsUmVsaWVmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gQ29weXJpZ2h0IChjKSA8MjAxNz4gU3RldmUgS25pcG1leWVyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgKiBhcyBUSFJFRSAgICAgICAgICAgICAgIGZyb20gJ3RocmVlJ1xyXG5cclxuaW1wb3J0IHtEZXB0aEJ1ZmZlckZhY3Rvcnl9ICAgICBmcm9tICdEZXB0aEJ1ZmZlckZhY3RvcnknXHJcbmltcG9ydCB7R3JhcGhpY3N9ICAgICAgICAgICAgICAgZnJvbSAnR3JhcGhpY3MnXHJcbmltcG9ydCB7TG9nZ2VyLCBIVE1MTG9nZ2VyfSAgICAgZnJvbSAnTG9nZ2VyJ1xyXG5pbXBvcnQge01hdGhMaWJyYXJ5fSAgICAgICAgICAgIGZyb20gJ01hdGgnXHJcbmltcG9ydCB7U2VydmljZXN9ICAgICAgICAgICAgICAgZnJvbSAnU2VydmljZXMnXHJcbmltcG9ydCB7VHJhY2tiYWxsQ29udHJvbHN9ICAgICAgZnJvbSAnVHJhY2tiYWxsQ29udHJvbHMnXHJcbmltcG9ydCB7VW5pdFRlc3RzfSAgICAgICAgICAgICAgZnJvbSAnVW5pdFRlc3RzJ1xyXG5cclxubGV0IGxvZ2dlciA9IG5ldyBIVE1MTG9nZ2VyKCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIFdpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFdpZGdldCB7XHJcbiAgICBcclxuICAgIG5hbWUgIDogc3RyaW5nO1xyXG4gICAgcHJpY2UgOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA6IHN0cmluZywgcHJpY2UgOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lICA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlcmF0ZVxyXG4gICAgICovXHJcbiAgICBvcGVyYXRlICgpIHtcclxuICAgICAgICBsb2dnZXIuYWRkSW5mb01lc3NhZ2UoYCR7dGhpcy5uYW1lfSBvcGVyYXRpbmcuLi4uYCk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBTdXBlcldpZGdldFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbG9yV2lkZ2V0IGV4dGVuZHMgV2lkZ2V0IHtcclxuXHJcbiAgICBjb2xvciA6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nLCBwcmljZSA6IG51bWJlciwgY29sb3IgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIgKG5hbWUsIHByaWNlKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFuZFBhcmVudCB7XHJcblxyXG4gICAgZ3JhbmRwYXJlbnRQcm9wZXJ0eSAgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLmdyYW5kcGFyZW50UHJvcGVydHkgID0gZ3JhbmRwYXJlbnRQcm9wZXJ0eSA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJlbnQgZXh0ZW5kcyBHcmFuZFBhcmVudHtcclxuICAgIFxyXG4gICAgcGFyZW50UHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5ICA6IHN0cmluZywgcGFyZW50UHJvcGVydHkgOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoZ3JhbmRwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRQcm9wZXJ0eSA9IHBhcmVudFByb3BlcnR5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBQYXJlbnR7XHJcbiAgICBcclxuICAgIGNoaWxkUHJvcGVydHkgOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihncmFuZHBhcmVudFByb3BlcnR5IDogc3RyaW5nLCBwYXJlbnRQcm9wZXJ0eSA6IHN0cmluZywgY2hpbGRQcm9wZXJ0eSA6IHN0cmluZykge1xyXG5cclxuICAgICAgICBzdXBlcihncmFuZHBhcmVudFByb3BlcnR5LCBwYXJlbnRQcm9wZXJ0eSk7XHJcbiAgICAgICAgdGhpcy5jaGlsZFByb3BlcnR5ID0gY2hpbGRQcm9wZXJ0eTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBJbmhlcml0YW5jZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluaGVyaXRhbmNlVGVzdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWluXHJcbiAgICAgKi9cclxuICAgIG1haW4gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3aWRnZXQgPSBuZXcgV2lkZ2V0ICgnV2lkZ2V0JywgMS4wKTtcclxuICAgICAgICB3aWRnZXQub3BlcmF0ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY29sb3JXaWRnZXQgPSBuZXcgQ29sb3JXaWRnZXQgKCdDb2xvcldpZGdldCcsIDEuMCwgJ3JlZCcpO1xyXG4gICAgICAgIGNvbG9yV2lkZ2V0Lm9wZXJhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkID0gbmV3IENoaWxkKCdHYUdhJywgJ0RhZCcsICdTdGV2ZScpOyAgICBcclxuICAgIH1cclxufVxyXG5cclxubGV0IGluaGVyaXRhbmNlID0gbmV3IEluaGVyaXRhbmNlVGVzdDtcclxuaW5oZXJpdGFuY2UubWFpbigpO1xyXG4iXX0=

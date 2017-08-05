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
        /**
         * Create the shader material used for generating the DepthBuffer.
         * @param designColor Material color.
         * @returns Shader material.
         */
        Materials.createDepthBufferMaterial = function (designColor) {
            var textureLoader = new THREE.TextureLoader();
            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    designColor: {
                        type: 'c',
                        value: new THREE.Color(designColor)
                    },
                },
                vertexShader: MR.shaderSource['DepthBufferVertexShader'],
                fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],
                shading: THREE.SmoothShading
            });
            return shaderMaterial;
        };
        return Materials;
    }());
    exports.Materials = Materials;
});
define("Viewer/Viewer", ["require", "exports", "three", "dat-gui", "Viewer/TrackballControls", "Viewer/Materials"], function (require, exports, THREE, dat, TrackballControls_1, Materials_1) {
    // ------------------------------------------------------------------------// 
    // ModelRelief                                                             //
    //                                                                         //                                                                          
    // Copyright (c) <2017> Steve Knipmeyer                                    //
    // ------------------------------------------------------------------------//
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectNames = {
        Root: 'Root',
        Grid: 'Grid'
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
        function Viewer(elementToBindTo) {
            this.renderer = null;
            this.canvas = elementToBindTo;
            this.aspectRatio = 1;
            this.recalcAspectRatio();
            this.scene = null;
            this.root = null;
            this.controls = null;
            this.initializeScene();
            this.initializeViewerControls();
            this.initializeGL();
            // start render loop
            this.render();
        }
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
         * Initialize the viewer camera
         */
        Viewer.prototype.initializeCamera = function () {
            this.cameraDefaults = {
                // Baseline : near = 0.1, far = 10000
                // ZBuffer  : near = 100, far = 300
                position: new THREE.Vector3(0.0, 175.0, 500.0),
                target: new THREE.Vector3(0, 0, 0),
                near: 0.1,
                far: 10000,
                fov: 45
            };
            this.camera = null;
            this.cameraTarget = this.cameraDefaults.target;
            this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
            this.resetCamera();
        };
        /**
         * Initialize the scene with the base objects
         */
        Viewer.prototype.initializeScene = function () {
            this.scene = new THREE.Scene();
            this.createRoot();
            var helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
            helper.name = ObjectNames.Grid;
            this.scene.add(helper);
        };
        /**
         * Initialize the WebGL settings
         */
        Viewer.prototype.initializeGL = function () {
            this.renderer = new THREE.WebGLRenderer({
                logarithmicDepthBuffer: false,
                canvas: this.canvas,
                antialias: true
            });
            this.renderer.autoClear = true;
            this.renderer.setClearColor(0x000000);
            this.initializeCamera();
            this.initializeLighting();
            this.initializeInputControls();
            this.resizeDisplayGL();
            window.addEventListener('resize', this.resizeWindow.bind(this), false);
        };
        /**
         * Handles a window resize event
         */
        Viewer.prototype.resizeWindow = function () {
            this.resizeDisplayGL();
        };
        /**
         * Creates the root object in the scene
         */
        Viewer.prototype.createRoot = function () {
            this.root = new THREE.Object3D();
            this.root.name = ObjectNames.Root;
            this.scene.add(this.root);
        };
        /**
         * Handles the WebGL processing for a DOM window 'resize' event
         */
        Viewer.prototype.resizeDisplayGL = function () {
            this.controls.handleResize();
            this.recalcAspectRatio();
            this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);
            this.updateCamera();
        };
        /**
         * Calculates the aspect ration of the canvas afer a window resize
         */
        Viewer.prototype.recalcAspectRatio = function () {
            this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
        };
        /**
         * Resets all camera properties to the defaults
         */
        Viewer.prototype.resetCamera = function () {
            this.camera.position.copy(this.cameraDefaults.position);
            this.cameraTarget.copy(this.cameraDefaults.target);
            this.updateCamera();
        };
        /**
         * Updates the scene camera to match the new window size
         */
        Viewer.prototype.updateCamera = function () {
            this.camera.aspect = this.aspectRatio;
            this.camera.lookAt(this.cameraTarget);
            this.camera.updateProjectionMatrix();
        };
        /**
         * Performs the WebGL render of the scene
         */
        Viewer.prototype.renderGL = function () {
            if (!this.renderer.autoClear)
                this.renderer.clear();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        /**
         * Main DOM render loop
         */
        Viewer.prototype.render = function () {
            requestAnimationFrame(this.render.bind(this));
            this.renderGL();
        };
        /**
         * Sets up the user input controls (Trackball)
         */
        Viewer.prototype.initializeInputControls = function () {
            this.controls = new TrackballControls_1.TrackballControls(this.camera, this.renderer.domElement);
        };
        /**
         * Removes all scene objects
         */
        Viewer.prototype.clearAllAssests = function () {
            var scope = this;
            var remover = function (object3d) {
                if (object3d === scope.root) {
                    return;
                }
                console.log('Removing: ' + object3d.name);
                scope.scene.remove(object3d);
                if (object3d.hasOwnProperty('geometry')) {
                    object3d.geometry.dispose();
                }
                if (object3d.hasOwnProperty('material')) {
                    var mat = object3d.material;
                    if (mat.hasOwnProperty('materials')) {
                        var materials = mat.materials;
                        for (var name in materials) {
                            if (materials.hasOwnProperty(name))
                                materials[name].dispose();
                        }
                    }
                }
                if (object3d.hasOwnProperty('texture')) {
                    object3d.texture.dispose();
                }
            };
            this.scene.remove(this.root);
            this.root.traverse(remover);
            this.createRoot();
        };
        /**
         * Initialize the view settings that are controllable by the user
         */
        Viewer.prototype.initializeViewerControls = function () {
            var ViewerControls = (function () {
                function ViewerControls() {
                    this.displayGrid = true;
                    this.depthBuffer = false;
                }
                return ViewerControls;
            }());
            var scope = this;
            var viewerControls = new ViewerControls();
            // Init dat.gui and controls for the UI
            var gui = new dat.GUI({
                autoPlace: false,
                width: 320
            });
            var menuDiv = document.getElementById('dat');
            menuDiv.appendChild(gui.domElement);
            var folderOptions = gui.addFolder('ModelViewer Options');
            // Grid
            var controlDisplayGrid = folderOptions.add(viewerControls, 'displayGrid').name('Display Grid');
            controlDisplayGrid.onChange(function (value) {
                scope.displayGrid = value;
                var gridGeometry = this.scene.getObjectByName(ObjectNames.Grid);
                gridGeometry.visible = scope.displayGrid;
                console.log('Setting displayGrid to: ' + value);
            }.bind(this));
            // Depth Buffer
            var depthBufferMaterial = Materials_1.Materials.createDepthBufferMaterial(0x5555ff);
            var whiteMaterial = new THREE.MeshPhongMaterial();
            whiteMaterial.color = new THREE.Color(0xffffff);
            var controlDepthBuffer = folderOptions.add(viewerControls, 'depthBuffer').name('Depth Buffer');
            controlDepthBuffer.onChange(function (value) {
                scope.depthBuffer = value;
                var newMaterial = scope.depthBuffer ? depthBufferMaterial : whiteMaterial;
                scope.changeObjectMaterials(newMaterial);
                console.log('Setting depthBuffer to: ' + value);
            }.bind(this));
            folderOptions.open();
        };
        /**
         * Change materials of all scene objects
         */
        Viewer.prototype.changeObjectMaterials = function (material) {
            var scope = this;
            var applyMaterial = function (object) {
                if (!(object instanceof THREE.Mesh))
                    return;
                console.log('Applying material: ' + object.name);
                object.material = material;
                object.material.needsUpdate = true;
            };
            this.root.traverse(applyMaterial);
        };
        return Viewer;
    }());
    exports.Viewer = Viewer;
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
define("main", ["require", "exports", "three", "Viewer/Viewer", "ModelLoaders/OBJLoader"], function (require, exports, THREE, Viewer_1, OBJLoader_1) {
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
         * Loads a model based on the model name and path embedded in the HTML page.
         * @param viewer Instance of the Viewer to display the model
         */
        ModelRelief.prototype.loadModel = function (viewer) {
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
                viewer.root.add(group);
            }, onProgress, onError);
        };
        /**
         * Launch the model Viewer.
         */
        ModelRelief.prototype.run = function () {
            console.log('ModelRelief started');
            var viewer = new Viewer_1.Viewer(document.getElementById('model3D'));
            this.loadModel(viewer);
        };
        return ModelRelief;
    }());
    exports.ModelRelief = ModelRelief;
    var modelRelief = new ModelRelief();
    modelRelief.run();
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
    })(MessageClass || (MessageClass = {}));
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
define("Viewer/DepthBuffer", ["require", "exports", "System/Logger", "System/Math"], function (require, exports, Logger_1, Math_1) {
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
        function DepthBuffer(rgbaArray, width, height, nearClipPlane, farClipPlane) {
            this.rgbaArray = rgbaArray;
            this.width = width;
            this.height = height;
            this.nearClipPlane = nearClipPlane;
            this.farClipPlane = farClipPlane;
            this.initialize();
        }
        /**
         * Initialize
         */
        DepthBuffer.prototype.initialize = function () {
            this.logger = new Logger_1.HTMLLogger();
            this.values = new Float32Array(this.rgbaArray.buffer);
            this.cameraRange = this.farClipPlane - this.nearClipPlane;
        };
        /**
         * Returns the normalized depth value at a pixel index
         * @param pixelRow Map row.
         * @param pixelColumn Map column.
         */
        DepthBuffer.prototype.valueNormalized = function (pixelRow, pixelColumn) {
            var index = (pixelRow * this.width) + pixelColumn;
            return this.values[index];
        };
        /**
         * Returns the depth value at a pixel index
         * @param pixelRow Map row.
         * @param pixelColumn Map column.
         */
        DepthBuffer.prototype.value = function (pixelRow, pixelColumn) {
            var value = this.valueNormalized(pixelRow, pixelColumn) * this.cameraRange;
            return value;
        };
        Object.defineProperty(DepthBuffer.prototype, "minimumNormalized", {
            /**
            * Returns the minimum normalized depth value.
            */
            get: function () {
                var minimumNormalized = Number.MAX_VALUE;
                for (var index = 0; index < this.values.length; index++) {
                    var depthValue = this.values[index];
                    if (depthValue < minimumNormalized)
                        minimumNormalized = depthValue;
                }
                return minimumNormalized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "minimum", {
            /**
            * Returns the minimum depth value.
            */
            get: function () {
                var minimum = this.minimumNormalized * this.cameraRange;
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
                var maximumNormalized = Number.MIN_VALUE;
                for (var index = 0; index < this.values.length; index++) {
                    var depthValue = this.values[index];
                    // skip values at far plane
                    if (Math_1.MathLibrary.numbersEqualWithinTolerance(depthValue, 1.0, DepthBuffer.normalizedTolerance))
                        continue;
                    if (depthValue > maximumNormalized)
                        maximumNormalized = depthValue;
                }
                return maximumNormalized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "maximum", {
            /**
            * Returns the maximum depth value.
            */
            get: function () {
                var maximum = this.maximumNormalized * this.cameraRange;
                return maximum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "depthNormalized", {
            /**
            * Returns the normalized depth of the buffer.
            */
            get: function () {
                var depthNormalized = this.maximumNormalized - this.minimumNormalized;
                return depthNormalized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepthBuffer.prototype, "depth", {
            /**
            * Returns the normalized depth of the buffer.
            */
            get: function () {
                var depth = this.depthNormalized * this.cameraRange;
                return depth;
            },
            enumerable: true,
            configurable: true
        });
        DepthBuffer.normalizedTolerance = .001;
        return DepthBuffer;
    }());
    exports.DepthBuffer = DepthBuffer;
});
define("Workbench/DepthBufferTest", ["require", "exports", "three", "Viewer/TrackballControls", "Viewer/DepthBuffer", "System/Logger"], function (require, exports, THREE, TrackballControls_2, DepthBuffer_1, Logger_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var modelCanvas;
    var modelRenderer;
    var modelCamera;
    var modelControls;
    var modelScene;
    var postCanvas;
    var postRenderer;
    var postCamera;
    var postScene;
    var target;
    var encodedTarget;
    var meshCanvas;
    var meshRenderer;
    var meshCamera;
    var meshControls;
    var meshScene;
    var meshPostScene;
    var meshMaterial;
    var meshTarget;
    var meshEncodedTarget;
    var supportsWebGLExtensions = true;
    var logger;
    var uselogDepthBuffer = false;
    var cameraZPosition = 4;
    var cameraNearPlane = 2;
    var cameraFarPlane = 10.0;
    var fieldOfView = 37; // https://www.nikonians.org/reviews/fov-tables
    var Resolution;
    (function (Resolution) {
        Resolution[Resolution["viewModel"] = 512] = "viewModel";
        Resolution[Resolution["viewPost"] = 512] = "viewPost";
        Resolution[Resolution["viewMesh"] = 512] = "viewMesh";
        Resolution[Resolution["textureDepthBuffer"] = 512] = "textureDepthBuffer";
    })(Resolution || (Resolution = {}));
    init();
    animate();
    /**
     * Verifies the minimum WebGL extensions are present.
     * @param renderer WebGL renderer.
     */
    function verifyExtensions(renderer) {
        if (!renderer.extensions.get('WEBGL_depth_texture'))
            return false;
        return true;
    }
    /**
     * Initialize the primary model view.
     */
    function initializeModelRenderer() {
        modelCanvas = initializeCanvas('modelCanvas', Resolution.viewModel);
        modelRenderer = new THREE.WebGLRenderer({ canvas: modelCanvas, logarithmicDepthBuffer: uselogDepthBuffer });
        modelRenderer.setPixelRatio(window.devicePixelRatio);
        modelRenderer.setSize(Resolution.viewModel, Resolution.viewModel);
        supportsWebGLExtensions = verifyExtensions(modelRenderer);
        modelCamera = new THREE.PerspectiveCamera(fieldOfView, Resolution.viewModel / Resolution.viewModel, cameraNearPlane, cameraFarPlane);
        modelCamera.position.z = cameraZPosition;
        modelControls = new TrackballControls_2.TrackballControls(modelCamera, modelRenderer.domElement);
        // scene
        modelScene = new THREE.Scene();
        setupTorusScene(modelScene);
        //  setupSphereScene(modelScene);
        setupBoxScene(modelScene);
        initializeLighting(modelScene);
        initializeModelHelpers(modelScene, null, false);
    }
    /**
     * Constructs a render target <with a depth texture buffer>.
     * @param width Width of render target.
     * @param height Height of render target.
     */
    function constructDepthTextureRenderTarget(width, height) {
        // Model Scene -> (Render Texture, Depth Texture)
        var renderTarget = new THREE.WebGLRenderTarget(width, height);
        renderTarget.texture.format = THREE.RGBAFormat;
        renderTarget.texture.type = THREE.UnsignedByteType;
        renderTarget.texture.minFilter = THREE.NearestFilter;
        renderTarget.texture.magFilter = THREE.NearestFilter;
        renderTarget.texture.generateMipmaps = false;
        renderTarget.stencilBuffer = false;
        renderTarget.depthBuffer = true;
        renderTarget.depthTexture = new THREE.DepthTexture(Resolution.textureDepthBuffer, Resolution.textureDepthBuffer);
        renderTarget.depthTexture.type = THREE.UnsignedIntType;
        return renderTarget;
    }
    /**
     * Initializes the post renderer used to visualize the encoded depth texture.
     */
    function initializePostRenderer() {
        postCanvas = initializeCanvas('postCanvas', Resolution.viewPost);
        postRenderer = new THREE.WebGLRenderer({ canvas: postCanvas, logarithmicDepthBuffer: uselogDepthBuffer });
        postRenderer.setPixelRatio(window.devicePixelRatio);
        postRenderer.setSize(Resolution.viewPost, Resolution.viewPost);
        // click handler
        postCanvas.onclick = onClick;
        // Model Scene -> (Render Texture, Depth Texture)
        target = constructDepthTextureRenderTarget(Resolution.viewPost, Resolution.viewPost);
        // Encoded RGBA Texture from Depth Texture
        encodedTarget = new THREE.WebGLRenderTarget(Resolution.viewPost, Resolution.viewPost);
        // Setup post-processing step
        setupPostScene();
    }
    /**
     * Initializes the mesh renderer used to view the 3D mesh.
     */
    function initializeMeshRenderer() {
        meshCanvas = initializeCanvas('meshCanvas', Resolution.viewMesh);
        meshRenderer = new THREE.WebGLRenderer({ canvas: meshCanvas, logarithmicDepthBuffer: uselogDepthBuffer });
        meshRenderer.setPixelRatio(window.devicePixelRatio);
        meshRenderer.setSize(Resolution.viewMesh, Resolution.viewMesh);
        meshCamera = new THREE.PerspectiveCamera(fieldOfView, Resolution.viewMesh / Resolution.viewMesh, cameraNearPlane, cameraFarPlane);
        meshCamera.position.z = 2;
        meshControls = new TrackballControls_2.TrackballControls(meshCamera, meshRenderer.domElement);
        // Model Scene -> (Render Texture, Depth Texture)
        meshTarget = constructDepthTextureRenderTarget(Resolution.viewMesh, Resolution.viewMesh);
        // Encoded RGBA Texture from Depth Texture
        meshEncodedTarget = new THREE.WebGLRenderTarget(Resolution.viewMesh, Resolution.viewMesh);
        setupMeshScene();
        setupPostMeshScene();
        initializeLighting(meshScene);
    }
    /**
     * Initialize the application.
     */
    function init() {
        logger = new Logger_2.HTMLLogger();
        initializeModelRenderer();
        initializePostRenderer();
        initializeMeshRenderer();
        onWindowResize();
        window.addEventListener('resize', onWindowResize, false);
        onClick();
    }
    /**
     * Updates a renderer target properties.
     * Event handler called on window resize.
     * @param renderer Renderer that owns the target.
     * @param renderTarget Render target to update.
     * @param width Width of the renderer.
     * @param height Height of the renderer.
     */
    function updateRenderTargetOnResize(renderer, renderTarget, width, height) {
        var pixelRatio = renderer.getPixelRatio();
        renderTarget.setSize(width * pixelRatio, height * pixelRatio);
    }
    /**
     * Updates a renderer properties.
     * Event handler called on window resize.
     * @param renderer Renderer to update.
     * @param width Width of the renderer.
     * @param height Height of the renderer.
     * @param camera Renderer's camera.
     */
    function updateViewOnWindowResize(renderer, width, height, camera) {
        var aspect = width / height;
        if (camera) {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
        }
        renderer.setSize(width, height);
    }
    /**
     * Event handler called on window resize.
     */
    function onWindowResize() {
        updateViewOnWindowResize(modelRenderer, Resolution.viewModel, Resolution.viewModel, modelCamera);
        updateViewOnWindowResize(postRenderer, Resolution.viewPost, Resolution.viewPost, null);
        updateViewOnWindowResize(meshRenderer, Resolution.viewMesh, Resolution.viewMesh, meshCamera);
        updateRenderTargetOnResize(postRenderer, target, Resolution.viewModel, Resolution.viewModel);
        updateRenderTargetOnResize(postRenderer, encodedTarget, Resolution.viewModel, Resolution.viewModel);
        updateRenderTargetOnResize(meshRenderer, meshTarget, Resolution.viewMesh, Resolution.viewMesh);
        updateRenderTargetOnResize(meshRenderer, meshEncodedTarget, Resolution.viewMesh, Resolution.viewMesh);
    }
    /**
     * Adds lighting to the scene.
     * param theScene Scene to add lighting.
     */
    function initializeLighting(theScene) {
        var ambientLight = new THREE.AmbientLight(0xffffff);
        theScene.add(ambientLight);
        var directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(50, 50, 50);
        theScene.add(directionalLight1);
    }
    /**
     * Adds helpers to the scene to visualize camera, coordinates, etc.
     * @param scene Scene to annotate.
     * @param camera Camera to construct helper (may be null).
     * @param addAxisHelper Add a helper for the cartesian axes.
     */
    function initializeModelHelpers(scene, camera, addAxisHelper) {
        if (camera) {
            var cameraHelper = new THREE.CameraHelper(camera);
            cameraHelper.visible = true;
            scene.add(cameraHelper);
        }
        if (addAxisHelper) {
            var axisHelper = new THREE.AxisHelper(2);
            axisHelper.visible = true;
            scene.add(axisHelper);
        }
    }
    /**
     * Adds a torus to a scene.
     * @param scene Target scene.
     */
    function setupTorusScene(scene) {
        // Setup some geometries
        var geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
        var material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });
        var count = 50;
        var scale = 5;
        for (var i = 0; i < count; i++) {
            var r = Math.random() * 2.0 * Math.PI;
            var z = (Math.random() * 2.0) - 1.0;
            var zScale = Math.sqrt(1.0 - z * z) * scale;
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(Math.cos(r) * zScale, Math.sin(r) * zScale, z * scale);
            mesh.rotation.set(Math.random(), Math.random(), Math.random());
            scene.add(mesh);
        }
    }
    /**
     * Adds a test sphere to a scene.
     * @param scene Target scene.
     */
    function setupSphereScene(scene) {
        // geometry
        var radius = 2;
        var segments = 64;
        var geometry = new THREE.SphereGeometry(radius, segments, segments);
        var material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });
        var mesh = new THREE.Mesh(geometry, material);
        var center = new THREE.Vector3(0.0, 0.0, 0.0);
        mesh.position.set(center.x, center.y, center.z);
        scene.add(mesh);
    }
    /**
     * Add a test box to a scene.
     * @param scene Target scene.
     */
    function setupBoxScene(scene) {
        // box
        var dimensions = 2.0;
        var width = dimensions;
        var height = dimensions;
        var depth = dimensions;
        var geometry = new THREE.BoxGeometry(width, height, depth);
        var material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });
        var mesh = new THREE.Mesh(geometry, material);
        var center = new THREE.Vector3(0.0, 0.0, 0.0);
        mesh.position.set(center.x, center.y, center.z);
        scene.add(mesh);
    }
    /**
     * Adds a backgroun plane at the origin.
     * @param scene Target scene.
     */
    function addBackgroundPlane(scene) {
        // background plane
        var width = 4;
        var height = 4;
        var geometry = new THREE.PlaneGeometry(width, height);
        var material = new THREE.MeshPhongMaterial({ color: 0x5555cc });
        var mesh = new THREE.Mesh(geometry, material);
        var center = new THREE.Vector3(0.0, 0.0, 0.0);
        mesh.position.set(center.x, center.y, center.z);
        scene.add(mesh);
    }
    /**
     * Constructs the scene used to visualize textures.
     */
    function setupPostScene() {
        // Setup post processing stage
        var left = -1;
        var right = 1;
        var top = 1;
        var bottom = -1;
        var near = 0;
        var far = 1;
        postCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        var postMaterial = new THREE.ShaderMaterial({
            vertexShader: MR.shaderSource['DepthBufferVertexShader'],
            fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],
            uniforms: {
                cameraNear: { value: modelCamera.near },
                cameraFar: { value: modelCamera.far },
                tDiffuse: { value: target.texture },
                tDepth: { value: target.depthTexture }
            }
        });
        var postPlane = new THREE.PlaneGeometry(2, 2);
        var postQuad = new THREE.Mesh(postPlane, postMaterial);
        postScene = new THREE.Scene();
        postScene.add(postQuad);
    }
    /**
     * Constructs the scene used to visualize the 3D mesh.
     */
    function setupMeshScene() {
        meshMaterial = new THREE.ShaderMaterial({
            vertexShader: MR.shaderSource['MeshVertexShader'],
            fragmentShader: MR.shaderSource['MeshFragmentShader'],
            uniforms: {
                cameraNear: { value: modelCamera.near },
                cameraFar: { value: modelCamera.far },
                tDiffuse: { value: meshEncodedTarget.texture },
                tDepth: { value: meshTarget.depthTexture }
            }
        });
        var meshPlane = new THREE.PlaneGeometry(2, 2, Resolution.viewMesh, Resolution.viewMesh);
        var meshQuad = new THREE.Mesh(meshPlane, meshMaterial);
        meshScene = new THREE.Scene();
        meshScene.add(meshQuad);
    }
    /**
     * Constructs the scene used to construct a depth buffer.
     */
    function setupPostMeshScene() {
        var postMeshMaterial = new THREE.ShaderMaterial({
            vertexShader: MR.shaderSource['DepthBufferVertexShader'],
            fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],
            uniforms: {
                cameraNear: { value: modelCamera.near },
                cameraFar: { value: modelCamera.far },
                tDiffuse: { value: meshTarget.texture },
                tDepth: { value: meshTarget.depthTexture }
            }
        });
        var postMeshPlane = new THREE.PlaneGeometry(2, 2);
        var postMeshQuad = new THREE.Mesh(postMeshPlane, postMeshMaterial);
        meshPostScene = new THREE.Scene();
        meshPostScene.add(postMeshQuad);
    }
    /**
     * Constructs an RGBA string with the byte values of a pixel.
     * @param buffer Unsigned byte raw buffer.
     * @param width Width of texture.
     * @param height Height of texture.
     * @param row Pixel row.
     * @param column Column row.
     */
    function unsignedBytesToRGBA(buffer, width, height, row, column) {
        var offset = (row * width) + column;
        var rValue = buffer[offset + 0].toString(16);
        var gValue = buffer[offset + 1].toString(16);
        var bValue = buffer[offset + 2].toString(16);
        var aValue = buffer[offset + 3].toString(16);
        return "#" + rValue + gValue + bValue + " " + aValue;
    }
    /**
     * Analyzes a pixel from a render buffer.
     * @param renderer Renderer that created render target.
     * @param renderTarget Render target (texture buffer).
     * @param width Width of target.
     * @param height Height of target.
     */
    function analyzeRenderBuffer(renderer, renderTarget, width, height) {
        var renderBuffer = new Uint8Array(width * height * 4).fill(0);
        renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, renderBuffer);
        var messageString = "RGBA[0, 0] = " + unsignedBytesToRGBA(renderBuffer, width, height, 0, 0);
        logger.addMessage(messageString, null);
    }
    /**
     * Analyzes properties of a depth buffer.
     * @param renderer Renderer that created encoded render target.
     * @param encodedRenderTarget RGBA encoded values of depth buffer
     * @param width Width of target.
     * @param height Height of target.
     * @param camera Perspective camera used to create render target.
     */
    function analyzeDepthBuffer(renderer, encodedRenderTarget, width, height, camera) {
        // decode RGBA texture into depth floats
        var depthBufferRGBA = new Uint8Array(width * height * 4).fill(0);
        renderer.readRenderTargetPixels(encodedRenderTarget, 0, 0, width, height, depthBufferRGBA);
        var depthBuffer = new DepthBuffer_1.DepthBuffer(depthBufferRGBA, width, height, camera.near, camera.far);
        var middle = width / 2;
        var decimalPlaces = 5;
        var headerStyle = "font-family : monospace; font-weight : bold; color : blue; font-size : 18px";
        var messageStyle = "font-family : monospace; color : black; font-size : 14px";
        logger.addMessage('Camera Properties', headerStyle);
        logger.addMessage("Near Plane = " + camera.near, messageStyle);
        logger.addMessage("Far Plane  = " + camera.far, messageStyle);
        logger.addMessage("Clip Range = " + (camera.far - camera.near), messageStyle);
        logger.addEmptyLine();
        logger.addMessage('Normalized', headerStyle);
        logger.addMessage("Center Depth = " + depthBuffer.valueNormalized(middle, middle).toFixed(decimalPlaces), messageStyle);
        logger.addMessage("Z Depth = " + depthBuffer.depthNormalized.toFixed(decimalPlaces), messageStyle);
        logger.addMessage("Minimum = " + depthBuffer.minimumNormalized.toFixed(decimalPlaces), messageStyle);
        logger.addMessage("Maximum = " + depthBuffer.maximumNormalized.toFixed(decimalPlaces), messageStyle);
        logger.addEmptyLine();
        logger.addMessage('Model Units', headerStyle);
        logger.addMessage("Center Depth = " + depthBuffer.value(middle, middle).toFixed(decimalPlaces), messageStyle);
        logger.addMessage("Z Depth = " + depthBuffer.depth.toFixed(decimalPlaces), messageStyle);
        logger.addMessage("Minimum = " + depthBuffer.minimum.toFixed(decimalPlaces), messageStyle);
        logger.addMessage("Maximum = " + depthBuffer.maximum.toFixed(decimalPlaces), messageStyle);
    }
    /**
     * Analyze the render and depth targets.
     * @param renderer Renderer that owns the targets.
     * @param renderTarget Render buffer target.
     * @param encodedRenderTarget Encoded RGBA depth target.
     * @param camera Perspective camera used to create targets.
     * @param width Width of targets.
     * @param height Height of targets.
     */
    function analyzeTargets(renderer, renderTarget, encodedRenderTarget, camera, width, height) {
        //  analyzeRenderBuffer(renderer, renderTarget,        width, height);
        analyzeDepthBuffer(renderer, encodedRenderTarget, width, height, camera);
    }
    /**
     * Create a depth buffer.
     * @param renderer Renderer to create the depth buffer.
     * @param width Width of renderer.
     * @param height Height of renderer.
     * @param modelScene 3D model scene to create depth buffer.
     * @param postScene Polygon scene used to create encoded target of depth buffer.
     * @param modelCamera Perspective camera for scene.
     * @param postCamera Orthographic camera for post scene.
     * @param renderTarget Render target.
     * @param encodedTarget Encoded RGBA target of depth buffer.
     */
    function createDepthBuffer(renderer, width, height, modelScene, postScene, modelCamera, postCamera, renderTarget, encodedTarget) {
        // N.B. Danger! Parameters hide global variables...
        // renderTarget.texture      : render buffer
        // renderTarget.depthTexture : depth buffer
        renderer.render(modelScene, modelCamera, renderTarget);
        // (optional) preview encoded RGBA texture; drawn by shader but not persisted
        renderer.render(postScene, postCamera);
        // Persist encoded RGBA texture; calculated from depth buffer
        // encodedTarget.texture      : encoded RGBA texture
        // encodedTarget.depthTexture : null
        renderer.render(postScene, postCamera, encodedTarget);
    }
    /**
     *  Event handler to create depth buffers.
     */
    function onClick() {
        logger.clearLog();
        createDepthBuffer(postRenderer, Resolution.viewPost, Resolution.viewPost, modelScene, postScene, modelCamera, postCamera, target, encodedTarget);
        //  analyzeTargets (postRenderer, target, encodedTarget, modelCamera, Resolution.viewPost, Resolution.viewPost);
        createDepthBuffer(meshRenderer, Resolution.viewMesh, Resolution.viewMesh, modelScene, meshPostScene, modelCamera, postCamera, meshTarget, meshEncodedTarget);
        analyzeTargets(meshRenderer, meshTarget, meshEncodedTarget, modelCamera, Resolution.viewMesh, Resolution.viewMesh);
    }
    /**
     * Constructs a WebGL target canvas.
     * @param id DOM id for canvas.
     * @param resolution Resolution (square) for canvas.
     */
    function initializeCanvas(id, resolution) {
        var canvas = document.querySelector("#" + id);
        if (!canvas) {
            console.error("Canvas element id = " + id + " not found");
            return null;
        }
        // render dimensions    
        canvas.width = resolution;
        canvas.height = resolution;
        // DOM element dimensions (may be different than render dimensions)
        canvas.style.width = resolution + "px";
        canvas.style.height = resolution + "px";
        return canvas;
    }
    /**
     * Animation loop.
     */
    function animate() {
        if (!supportsWebGLExtensions)
            return;
        requestAnimationFrame(animate);
        modelControls.update();
        meshControls.update();
        modelRenderer.render(modelScene, modelCamera);
        meshRenderer.render(meshScene, meshCamera);
        //  meshRenderer.render(meshScene, postCamera); 
    }
});
define("Viewer/Graphics", ["require", "exports", "three"], function (require, exports, THREE) {
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
        // --------------------------------------------------------------------------------------------------------------------------------------//
        //			Geometry
        // --------------------------------------------------------------------------------------------------------------------------------------//
        /**
         * @param position Location of bounding box.
         * @param mesh Mesh from which to create bounding box.
         * @ returns Mesh of the bounding box.
         */
        Graphics.createTransparentBoundingBox = function (position, mesh) {
            var targetGeometry, boundingBox, width, height, depth, material, box;
            targetGeometry = mesh.geometry;
            targetGeometry.computeBoundingBox();
            boundingBox = targetGeometry.boundingBox;
            width = boundingBox.max.x - boundingBox.min.x;
            height = boundingBox.max.y - boundingBox.min.y;
            depth = boundingBox.max.z - boundingBox.min.z;
            material = new THREE.MeshBasicMaterial({ color: 0x0000ff, opacity: 1.0, transparent: true, wireframe: true });
            box = this.createBox(position, width, height, depth, material);
            box.name = Graphics.BoundingBoxName;
            box.visible = false;
            return box;
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
        Graphics.createBox = function (position, width, height, depth, material) {
            var boxGeometry, boxMaterial, box;
            boxGeometry = new THREE.BoxGeometry(width, height, depth);
            boxGeometry.computeBoundingBox();
            boxMaterial = material || new THREE.MeshPhongMaterial({ color: 0x0000ff, opacity: 1.0 });
            box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.copy(position);
            return box;
        };
        /**
         * Creates a sphere mesh.
         * @param position Origin of the sphere.
         * @param radius Radius.
         * @param color Color.
         * @param segments Mesh segments.
         */
        Graphics.createSphere = function (position, radius, color, segments) {
            var sphereGeometry, material, segmentCount = segments || 32, sphere;
            Graphics.createBox;
            sphereGeometry = new THREE.SphereGeometry(radius, segmentCount, segmentCount);
            sphereGeometry.computeBoundingBox();
            material = new THREE.MeshPhongMaterial({ color: color, opacity: 1.0, transparent: false, wireframe: false });
            sphere = new THREE.Mesh(sphereGeometry, material);
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
        Graphics.BoundingBoxName = 'Bounding Box';
        return Graphics;
    }());
    exports.Graphics = Graphics;
});
//# sourceMappingURL=modelrelief.js.map
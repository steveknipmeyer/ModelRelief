"use strict";

import * as THREE               from 'three'
import {TrackballControls}      from 'TrackballControls'
import {DepthBuffer}            from 'DepthBuffer'
import {MathLibrary}            from 'Math'
import {Logger, HTMLLogger}     from 'Logger'
import {UnitTests}              from 'UnitTests'

var modelCanvas         : HTMLCanvasElement;
var modelRenderer       : THREE.WebGLRenderer;
var modelCamera         : THREE.PerspectiveCamera;
var modelControls       : TrackballControls;
var modelScene          : THREE. Scene;

var postCanvas          : HTMLCanvasElement;
var postRenderer        : THREE.WebGLRenderer;
var postCamera          : THREE.OrthographicCamera;
var postScene           : THREE.Scene;
var target              : THREE.WebGLRenderTarget;
var encodedTarget       : THREE.WebGLRenderTarget;

var meshCanvas          : HTMLCanvasElement;
var meshRenderer        : THREE.WebGLRenderer;
var meshCamera          : THREE.PerspectiveCamera;
var meshControls        : TrackballControls;
var meshScene           : THREE.Scene;
var meshPostScene       : THREE.Scene;
var meshMaterial        : THREE.ShaderMaterial;
var meshTarget          : THREE.WebGLRenderTarget;
var meshEncodedTarget   : THREE.WebGLRenderTarget;

var supportsWebGLExtensions : boolean = true;
var logger                  : Logger;

var uselogDepthBuffer     : boolean = false;
var physicalMeshTransform : boolean = true;
var MeshModelName         : string = 'ModelMesh';

var cameraZPosition     : number = 4
var cameraNearPlane     : number = 2;
var cameraFarPlane      : number = 10.0;
var fieldOfView         : number = 37;              // https://www.nikonians.org/reviews/fov-tables

enum Resolution {
    viewModel          = 512,
    viewPost           = 512,
    viewMesh           = 512,

    textureDepthBuffer = 512
}

init();
animate();

/**
 * Verifies the minimum WebGL extensions are present.
 * @param renderer WebGL renderer.
 */
function verifyExtensions(renderer : THREE.WebGLRenderer) : boolean {
    
    if (!renderer.extensions.get('WEBGL_depth_texture')) 
        return false;

    return true;
}

/**
 * Initialize the primary model view.
 */
function initializeModelRenderer() {

    modelCanvas = initializeCanvas('modelCanvas', Resolution.viewModel);
    modelRenderer = new THREE.WebGLRenderer( {canvas : modelCanvas, logarithmicDepthBuffer : uselogDepthBuffer});
    modelRenderer.setPixelRatio(window.devicePixelRatio);
    modelRenderer.setSize(Resolution.viewModel, Resolution.viewModel);

    supportsWebGLExtensions = verifyExtensions(modelRenderer);

    modelCamera = new THREE.PerspectiveCamera(fieldOfView, Resolution.viewModel / Resolution.viewModel, cameraNearPlane, cameraFarPlane);
    modelCamera.position.z = cameraZPosition;

    modelControls = new TrackballControls(modelCamera, modelRenderer.domElement);

    // scene
    modelScene = new THREE.Scene();

    setupTorusScene(modelScene);
//  setupSphereScene(modelScene);
//  setupBoxScene(modelScene);

    initializeLighting(modelScene);
    initializeModelHelpers(modelScene, null, false);
}

/**
 * Constructs a render target <with a depth texture buffer>.
 * @param width Width of render target.
 * @param height Height of render target.
 */
function constructDepthTextureRenderTarget(width : number, height : number) : THREE.WebGLRenderTarget {

    // Model Scene -> (Render Texture, Depth Texture)
    let renderTarget = new THREE.WebGLRenderTarget(width, height);

    renderTarget.texture.format           = THREE.RGBAFormat;
    renderTarget.texture.type             = THREE.UnsignedByteType;
    renderTarget.texture.minFilter        = THREE.NearestFilter;
    renderTarget.texture.magFilter        = THREE.NearestFilter;
    renderTarget.texture.generateMipmaps  = false;

    renderTarget.stencilBuffer            = false;

    renderTarget.depthBuffer              = true;
    renderTarget.depthTexture             = new THREE.DepthTexture(Resolution.textureDepthBuffer, Resolution.textureDepthBuffer);
    renderTarget.depthTexture.type        = THREE.UnsignedIntType;
    
    return renderTarget;
}

/**
 * Initializes the post renderer used to visualize the encoded depth texture.
 */
function initializePostRenderer() {

    postCanvas = initializeCanvas('postCanvas', Resolution.viewPost);
    postRenderer = new THREE.WebGLRenderer({ canvas: postCanvas, logarithmicDepthBuffer : uselogDepthBuffer });
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
    meshRenderer = new THREE.WebGLRenderer( {canvas : meshCanvas, logarithmicDepthBuffer : uselogDepthBuffer});
    meshRenderer.setPixelRatio(window.devicePixelRatio);
    meshRenderer.setSize(Resolution.viewMesh, Resolution.viewMesh);

    meshCamera = new THREE.PerspectiveCamera(fieldOfView, Resolution.viewMesh / Resolution.viewMesh, cameraNearPlane, cameraFarPlane);
    meshCamera.position.z = cameraZPosition;

    meshControls = new TrackballControls(meshCamera, meshRenderer.domElement);

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
    
    logger = new HTMLLogger();

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
function updateRenderTargetOnResize  (renderer : THREE.WebGLRenderer, renderTarget : THREE.WebGLRenderTarget, width : number, height : number) {

    let pixelRatio = renderer.getPixelRatio();
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
function updateViewOnWindowResize(renderer : THREE.Renderer, width : number, height : number, camera? : THREE.PerspectiveCamera) {

    let aspect : number = width / height;
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
    updateViewOnWindowResize(postRenderer,  Resolution.viewPost,  Resolution.viewPost,  null);
    updateViewOnWindowResize(meshRenderer,  Resolution.viewMesh,  Resolution.viewMesh,  meshCamera);

    updateRenderTargetOnResize(postRenderer, target,        Resolution.viewModel, Resolution.viewModel);
    updateRenderTargetOnResize(postRenderer, encodedTarget, Resolution.viewModel, Resolution.viewModel);

    updateRenderTargetOnResize(meshRenderer, meshTarget,        Resolution.viewMesh, Resolution.viewMesh);
    updateRenderTargetOnResize(meshRenderer, meshEncodedTarget,  Resolution.viewMesh, Resolution.viewMesh);
}

/**
 * Adds lighting to the scene.
 * param theScene Scene to add lighting.
 */
function initializeLighting(theScene : THREE.Scene) {

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    theScene.add(ambientLight);

    let directionalLight1 = new THREE.DirectionalLight(0xffffff);
    directionalLight1.position.set(4, 4, 4);
    theScene.add(directionalLight1);
}

 /**
  * Adds helpers to the scene to visualize camera, coordinates, etc. 
  * @param scene Scene to annotate.
  * @param camera Camera to construct helper (may be null).
  * @param addAxisHelper Add a helper for the cartesian axes.
  */
function initializeModelHelpers(scene : THREE.Scene, camera : THREE.Camera, addAxisHelper : boolean) {

    if (camera) {
        let cameraHelper = new THREE.CameraHelper(camera );
        cameraHelper.visible = true;
        scene.add(cameraHelper);
    }

    if (addAxisHelper) {
        let axisHelper = new THREE.AxisHelper(2);
        axisHelper.visible = true;
        scene.add(axisHelper);
    }
}
/**
 * Adds a torus to a scene.
 * @param scene Target scene.
 */
function setupTorusScene(scene : THREE.Scene) {

    // Setup some geometries
    let geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
    let material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });

    let count = 50;
    let scale = 5;

    for (let i = 0; i < count; i++) {

        let r = Math.random() * 2.0 * Math.PI;
        let z = (Math.random() * 2.0) - 1.0;
        let zScale = Math.sqrt(1.0 - z * z) * scale;

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            Math.cos(r) * zScale,
            Math.sin(r) * zScale,
            z * scale
        );
        mesh.rotation.set(Math.random(), Math.random(), Math.random());

        scene.add(mesh);
    }
}

/**
 * Adds a test sphere to a scene.
 * @param scene Target scene.
 */
function setupSphereScene(scene : THREE.Scene) {

    // geometry
    let radius   : number = 2;
    let segments : number = 64;
    let geometry = new THREE.SphereGeometry(radius, segments, segments);

    let material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });

    let mesh = new THREE.Mesh(geometry, material);
    let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    scene.add(mesh);
}

/**
 * Add a test box to a scene.
 * @param scene Target scene.
 */
function setupBoxScene(scene : THREE.Scene) {

    // box
    let dimensions : number = 2.0
    let width  : number = dimensions;
    let height : number = dimensions;
    let depth  : number = dimensions;

    let geometry : THREE.Geometry = new THREE.BoxGeometry(width, height, depth);
    let material : THREE.Material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    let mesh = new THREE.Mesh(geometry, material);
    let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    scene.add(mesh);
}

/**
 * Adds a backgroun plane at the origin.
 * @param scene Target scene.
 */
function addBackgroundPlane (scene : THREE.Scene) {

    // background plane
    let width  = 4;
    let height = 4;

    let geometry = new THREE.PlaneGeometry(width, height);
    let material = new THREE.MeshPhongMaterial({ color: 0x5555cc });

    let mesh = new THREE.Mesh(geometry, material);
    let center = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    scene.add(mesh);
}

/**
 * Constructs the scene used to visualize textures.
 */
function setupPostScene() {

    // Setup post processing stage
    let left: number      =  -1;
    let right: number     =   1;
    let top: number       =   1;
    let bottom: number    =  -1;
    let near: number      =   0;
    let far: number       =   1;
    postCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

    let postMaterial = new THREE.ShaderMaterial({
        
        vertexShader:   MR.shaderSource['DepthBufferVertexShader'],
        fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],

        uniforms: {
            cameraNear  :   { value: modelCamera.near },
            cameraFar   :   { value: modelCamera.far },
            tDiffuse    :   { value: target.texture },
            tDepth      :   { value: target.depthTexture }
        }
    });
    let postPlane = new THREE.PlaneGeometry(2, 2);
    let postQuad  = new THREE.Mesh(postPlane, postMaterial);

    postScene = new THREE.Scene();
    postScene.add(postQuad);
}

/**
 * Constructs the scene used to visualize the 3D mesh.
 */
function setupMeshScene() {
    
    var meshMaterial : THREE.Material;

    if (physicalMeshTransform) {

        meshMaterial = new THREE.MeshPhongMaterial({ color: 0xb35bcc });

    } else {

        meshMaterial = new THREE.ShaderMaterial({
                
            vertexShader:   MR.shaderSource['MeshVertexShader'],
            fragmentShader: MR.shaderSource['MeshFragmentShader'],

            uniforms : {
                cameraNear  :   { value: modelCamera.near },
                cameraFar   :   { value: modelCamera.far },
                tDiffuse    :   { value: meshEncodedTarget.texture },
                tDepth      :   { value: meshTarget.depthTexture }
            }
        });
    }

    let meshPlane = new THREE.PlaneGeometry(2, 2, Resolution.viewMesh, Resolution.viewMesh);
    let meshQuad  = new THREE.Mesh(meshPlane, meshMaterial);
    meshQuad.name = MeshModelName;

    meshScene = new THREE.Scene();
    meshScene.add(meshQuad);
}

/**
 * Constructs the scene used to construct a depth buffer.
 */
function setupPostMeshScene() {

    let postMeshMaterial = new THREE.ShaderMaterial({
        
        vertexShader:   MR.shaderSource['DepthBufferVertexShader'],
        fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],

        uniforms: {
            cameraNear  :   { value: modelCamera.near },
            cameraFar   :   { value: modelCamera.far },
            tDiffuse    :   { value: meshTarget.texture },
            tDepth      :   { value: meshTarget.depthTexture }
        }
    });
    let postMeshPlane = new THREE.PlaneGeometry(2, 2);
    let postMeshQuad  = new THREE.Mesh(postMeshPlane, postMeshMaterial);

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
function unsignedBytesToRGBA (buffer : Uint8Array, width: number, height : number, row : number, column : number) : string {
        
    let offset = (row * width) + column;
    let rValue = buffer[offset + 0].toString(16);
    let gValue = buffer[offset + 1].toString(16);
    let bValue = buffer[offset + 2].toString(16);
    let aValue = buffer[offset + 3].toString(16);

    return `#${rValue}${gValue}${bValue} ${aValue}`;
}

/**
 * Analyzes a pixel from a render buffer.
 * @param renderer Renderer that created render target.
 * @param renderTarget Render target (texture buffer).
 * @param width Width of target.
 * @param height Height of target.
 */
function analyzeRenderBuffer (renderer: THREE.WebGLRenderer, renderTarget : THREE.RenderTarget, width : number, height : number) {

    let renderBuffer =  new Uint8Array(width * height * 4).fill(0);
    renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, renderBuffer);

    let messageString = `RGBA[0, 0] = ${unsignedBytesToRGBA(renderBuffer, width, height, 0, 0)}`;
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
function analyzeDepthBuffer (renderer: THREE.WebGLRenderer, encodedRenderTarget : THREE.RenderTarget, width : number, height : number, camera : THREE.PerspectiveCamera) {

    // decode RGBA texture into depth floats
    let depthBufferRGBA =  new Uint8Array(width * height * 4).fill(0);
    renderer.readRenderTargetPixels(encodedRenderTarget, 0, 0, width, height, depthBufferRGBA);

    let depthBuffer = new DepthBuffer(depthBufferRGBA, width, height, camera);
    
    let middle = width / 2;
    let decimalPlaces = 5;
    let headerStyle   = "font-family : monospace; font-weight : bold; color : blue; font-size : 18px";
    let messageStyle  = "font-family : monospace; color : black; font-size : 14px";

    logger.addMessage('Camera Properties', headerStyle);
    logger.addMessage(`Near Plane = ${camera.near}`, messageStyle);
    logger.addMessage(`Far Plane  = ${camera.far}`, messageStyle);
    logger.addMessage(`Clip Range = ${camera.far - camera.near}`, messageStyle);
    logger.addEmptyLine();

    logger.addMessage('Normalized', headerStyle);
    logger.addMessage(`Center Depth = ${depthBuffer.depthNormalized(middle, middle).toFixed(decimalPlaces)}`, messageStyle);
    logger.addMessage(`Z Depth = ${depthBuffer.rangeNormalized.toFixed(decimalPlaces)}`, messageStyle);
    logger.addMessage(`Minimum = ${depthBuffer.minimumNormalized.toFixed(decimalPlaces)}`, messageStyle);
    logger.addMessage(`Maximum = ${depthBuffer.maximumNormalized.toFixed(decimalPlaces)}`, messageStyle);
    logger.addEmptyLine();

    logger.addMessage('Model Units', headerStyle);
    logger.addMessage(`Center Depth = ${depthBuffer.depth(middle, middle).toFixed(decimalPlaces)}`, messageStyle);
    logger.addMessage(`Z Depth = ${depthBuffer.range.toFixed(decimalPlaces)}`, messageStyle);
    logger.addMessage(`Minimum = ${depthBuffer.minimum.toFixed(decimalPlaces)}`, messageStyle);
    logger.addMessage(`Maximum = ${depthBuffer.maximum.toFixed(decimalPlaces)}`, messageStyle);
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
function analyzeTargets (renderer: THREE.WebGLRenderer, renderTarget : THREE.RenderTarget, encodedRenderTarget : THREE.RenderTarget, camera : THREE.PerspectiveCamera, width : number, height : number)  {

//  analyzeRenderBuffer(renderer, renderTarget,        width, height);
    analyzeDepthBuffer(renderer,  encodedRenderTarget, width, height, camera);
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
function createDepthBuffer(
        renderer        : THREE.WebGLRenderer, 
        width           : number,
        height          : number,
        modelScene      : THREE.Scene, 
        postScene       : THREE.Scene, 
        modelCamera     : THREE.PerspectiveCamera, 
        postCamera      : THREE.OrthographicCamera, 
        renderTarget    : THREE.RenderTarget, 
        encodedTarget   : THREE.RenderTarget) {

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
  * Transform the vertices of the model mesh to match the depth buffer. 
  * @param renderer WebGL renderer that owns the render target.
  * @param meshScene Scene containing the target mesh.
  * @param meshEncodedTarget Encoded RGBA depth buffer;
  * @param width Width of render target.
  * @param height Height of render target.
  * @param camera Render camera.
  */
function transformMeshSceneFromDepthBuffer (renderer : THREE.WebGLRenderer, meshScene : THREE.Scene, meshEncodedTarget : THREE.WebGLRenderTarget, width : number, height : number, camera : THREE.PerspectiveCamera) {

    let previousMesh : THREE.Mesh = <THREE.Mesh> meshScene.getObjectByName(MeshModelName);
    if (!previousMesh) {
        console.error ('Model mesh not found in scene.');
        return;
     }      
     meshScene.remove(previousMesh);

    // decode RGBA texture into depth floats
    let depthBufferRGBA =  new Uint8Array(width * height * 4).fill(0);
    renderer.readRenderTargetPixels(meshEncodedTarget, 0, 0, width, height, depthBufferRGBA);
    let depthBuffer = new DepthBuffer(depthBufferRGBA, width, height, camera);    

    let mesh = depthBuffer.mesh(2);
    meshScene.add(mesh);

//  UnitTests.VertexMapping(depthBuffer, mesh);
}


/**
 *  Event handler to create depth buffers.
 */
function onClick() {

    logger.clearLog();

    createDepthBuffer (postRenderer, Resolution.viewPost, Resolution.viewPost, modelScene, postScene,     modelCamera, postCamera, target,     encodedTarget);
//  analyzeTargets (postRenderer, target, encodedTarget, modelCamera, Resolution.viewPost, Resolution.viewPost);

    createDepthBuffer (meshRenderer, Resolution.viewMesh, Resolution.viewMesh, modelScene, meshPostScene, modelCamera, postCamera, meshTarget, meshEncodedTarget);
    analyzeTargets (meshRenderer, meshTarget, meshEncodedTarget, modelCamera, Resolution.viewMesh, Resolution.viewMesh);

    transformMeshSceneFromDepthBuffer (meshRenderer, meshScene, meshEncodedTarget, Resolution.viewMesh, Resolution.viewMesh, modelCamera);
}

/**
 * Constructs a WebGL target canvas.
 * @param id DOM id for canvas.
 * @param resolution Resolution (square) for canvas.
 */
function initializeCanvas(id : string, resolution : number) : HTMLCanvasElement {
    
    let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.querySelector(`#${id}`);
    if (!canvas)
        {
        console.error(`Canvas element id = ${id} not found`);
        return null;
        }

    // render dimensions    
    canvas.width  = resolution;
    canvas.height = resolution;

    // DOM element dimensions (may be different than render dimensions)
    canvas.style.width  = `${resolution}px`;
    canvas.style.height = `${resolution}px`;

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
    meshRenderer.render(meshScene,   meshCamera); 
}

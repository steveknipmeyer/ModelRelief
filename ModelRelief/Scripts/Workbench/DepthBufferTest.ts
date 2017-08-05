"use strict";

import * as THREE               from 'three'
import {TrackballControls}      from 'TrackballControls'
import {DepthBuffer}            from 'DepthBuffer'
import {MathLibrary}            from 'Math'
import {Logger, HTMLLogger}     from 'Logger'

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

var uselogDepthBuffer   : boolean = true;
var cameraNearPlane     : number =  0.01;
var cameraFarPlane      : number = 50.00;
var fieldOfView         : number = 70;

enum Resolution {
    viewModel          = 512,
    viewPost           = 512,
    viewMesh           = 512,

    textureDepthBuffer = 512
}

init();
animate();

function verifyExtensions(renderer : THREE.WebGLRenderer) : boolean {
    
    if (!renderer.extensions.get('WEBGL_depth_texture')) 
        return false;

    return true;
}

function initializeModelRenderer() {

    modelCanvas = initializeCanvas('modelCanvas', Resolution.viewModel);
    modelRenderer = new THREE.WebGLRenderer( {canvas : modelCanvas, logarithmicDepthBuffer : uselogDepthBuffer});
    modelRenderer.setPixelRatio(window.devicePixelRatio);
    modelRenderer.setSize(Resolution.viewModel, Resolution.viewModel);

    supportsWebGLExtensions = verifyExtensions(modelRenderer);

    modelCamera = new THREE.PerspectiveCamera(fieldOfView, Resolution.viewModel / Resolution.viewModel, cameraNearPlane, cameraFarPlane);
    modelCamera.position.z = 5;

    modelControls = new TrackballControls(modelCamera, modelRenderer.domElement);

    // scene
    modelScene = new THREE.Scene();

//  setupModelTorusScene(modelScene);
//  setupModelSphereScene(modelScene);
    setupBoxScene(modelScene);

    initializeLighting(modelScene);
    initializeModelHelpers(modelScene, null, true);
}

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

function initializePostRenderer() {

    // DepthBuffer Renderer
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

function initializeMeshRenderer() {

    meshCanvas = initializeCanvas('meshCanvas', Resolution.viewMesh);
    meshRenderer = new THREE.WebGLRenderer( {canvas : meshCanvas, logarithmicDepthBuffer : uselogDepthBuffer});
    meshRenderer.setPixelRatio(window.devicePixelRatio);
    meshRenderer.setSize(Resolution.viewMesh, Resolution.viewMesh);

    meshCamera = new THREE.PerspectiveCamera(fieldOfView, Resolution.viewMesh / Resolution.viewMesh, cameraNearPlane, cameraFarPlane);
    meshCamera.position.z = 5;

    meshControls = new TrackballControls(meshCamera, meshRenderer.domElement);

    // Model Scene -> (Render Texture, Depth Texture)
    meshTarget = constructDepthTextureRenderTarget(Resolution.viewMesh, Resolution.viewMesh);

    // Encoded RGBA Texture from Depth Texture
    meshEncodedTarget = new THREE.WebGLRenderTarget(Resolution.viewMesh, Resolution.viewMesh);

    setupMeshScene();
    setupPostMeshScene();

   initializeLighting(meshScene);
}

function init() {
    
    logger = new HTMLLogger();

    initializeModelRenderer();
    initializePostRenderer();
    initializeMeshRenderer();

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}

function updateRenderTargetOnResize  (renderer : THREE.WebGLRenderer, renderTarget : THREE.WebGLRenderTarget, width : number, height : number) {

    let pixelRatio = renderer.getPixelRatio();
    renderTarget.setSize(width * pixelRatio, height * pixelRatio);
}

function updateViewOnWindowResize(renderer : THREE.Renderer, width : number, height : number, camera? : THREE.PerspectiveCamera) {

    let aspect : number = width / height;
    if (camera) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }

    renderer.setSize(width, height);
}

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
 * Adds lighting to the scene
 */
function initializeLighting(theScene : THREE.Scene) {

    let ambientLight = new THREE.AmbientLight(0xffffff);
    theScene.add(ambientLight);

    let directionalLight1 = new THREE.DirectionalLight(0xffffff);
    directionalLight1.position.set(50, 50, 50);
    theScene.add(directionalLight1);
}

/**
 * Adds helpers to the scene to visualize camera, coordinates, etc.
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

function setupSphereScene(scene : THREE.Scene) {

    // geometry
    let radius   : number = 2;
    let segments : number = 64;
    let geometry = new THREE.SphereGeometry(radius, segments, segments);

    let material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });
//  let material = new THREE.MeshDepthMaterial();

    let mesh = new THREE.Mesh(geometry, material);
    let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    scene.add(mesh);
}

function setupBoxScene(scene : THREE.Scene) {

    // box
    let width  : number = 2;
    let height : number = 2;
    let depth  : number = 2;

    let geometry : THREE.Geometry = new THREE.BoxGeometry(width, height, depth);
    let material : THREE.Material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });

    let mesh = new THREE.Mesh(geometry, material);
    let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    scene.add(mesh);

    // background plane
    width  = 4;
    height = 4;

    geometry = new THREE.PlaneGeometry(width, height);
    material = new THREE.MeshPhongMaterial({ color: 0x5555cc });

    mesh = new THREE.Mesh(geometry, material);
    center = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    scene.add(mesh);
}

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

function setupMeshScene() {

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

    let meshPlane = new THREE.PlaneGeometry(2, 2);
    let meshQuad  = new THREE.Mesh(meshPlane, meshMaterial);

    meshScene = new THREE.Scene();
    meshScene.add(meshQuad);
}

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

function unsignedBytesToRGBA (buffer : Uint8Array, width: number, height : number, row : number, column : number) : string {
        
    let offset = (row * width) + column;
    let rValue = buffer[offset + 0].toString(16);
    let gValue = buffer[offset + 1].toString(16);
    let bValue = buffer[offset + 2].toString(16);
    let aValue = buffer[offset + 3].toString(16);

    return `#${rValue}${gValue}${bValue} ${aValue}`;
}

function analyzeRenderBuffer (renderer: THREE.WebGLRenderer, renderTarget : THREE.RenderTarget, width : number, height : number, color : string) {

    let renderBuffer =  new Uint8Array(width * height * 4).fill(0);
    renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, renderBuffer);

    let messageString = `RGBA[0, 0] = ${unsignedBytesToRGBA(renderBuffer, width, height, 0, 0)}`;
    logger.addMessage(messageString, color);
}

function analyzeDepthBuffer (renderer: THREE.WebGLRenderer, encodedRenderTarget : THREE.RenderTarget, width : number, height : number, color : string, camera : THREE.PerspectiveCamera) {

    // decode RGBA texture into depth floats
    let depthBufferRGBA =  new Uint8Array(width * height * 4).fill(0);
    renderer.readRenderTargetPixels(encodedRenderTarget, 0, 0, width, height, depthBufferRGBA);

    let depthBuffer = new DepthBuffer(depthBufferRGBA, width, height, camera.near, camera.far);
    
    let middle = width / 2;
    let depthNormalized = depthBuffer.valueNormalized(middle, middle);
    logger.addMessage(`${depthNormalized}`, color);

    let decimalPlaces = 2;
    let messageString : string = `Scene Depth = ${depthBuffer.depth.toFixed(2)} [Normalized] depth = ${depthNormalized.toFixed(decimalPlaces)}, min = ${depthBuffer.minimumNormalized.toFixed(decimalPlaces)}, max = ${depthBuffer.maximumNormalized.toFixed(decimalPlaces)}, [Absolute] depth = ${depthBuffer.depth.toFixed(decimalPlaces)}, min = ${depthBuffer.minimum.toFixed(decimalPlaces)}, max = ${depthBuffer.maximum.toFixed(decimalPlaces)}`;
    logger.addMessage(messageString, color);
}

function analyzeTargets (renderer: THREE.WebGLRenderer, renderTarget : THREE.RenderTarget, encodedRenderTarget : THREE.RenderTarget, camera : THREE.PerspectiveCamera, width : number, height : number, color : string)  {

    analyzeRenderBuffer(renderer, renderTarget,        width, height, color);
    analyzeDepthBuffer(renderer,  encodedRenderTarget, width, height, color, camera);
}

function createDepthBuffer(
        renderer        : THREE.WebGLRenderer, 
        width           : number,
        height          : number,
        modelScene      : THREE.Scene, 
        postScene       : THREE.Scene, 
        modelCamera     : THREE.PerspectiveCamera, 
        postCamera      : THREE.OrthographicCamera, 
        renderTarget    : THREE.RenderTarget, 
        encodedTarget   : THREE.RenderTarget,
        color           : string) {

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

    analyzeTargets (renderer, renderTarget, encodedTarget, modelCamera, width, height, color);
}

function onClick() {

    logger.clearLog();

    createDepthBuffer (postRenderer, Resolution.viewPost, Resolution.viewPost, modelScene, postScene,     modelCamera, postCamera, target,     encodedTarget,     'red');
    createDepthBuffer (meshRenderer, Resolution.viewMesh, Resolution.viewMesh, modelScene, meshPostScene, modelCamera, postCamera, meshTarget, meshEncodedTarget, 'blue');
}

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

function animate() {

    if (!supportsWebGLExtensions) 
        return;

    requestAnimationFrame(animate);

    modelControls.update();
    meshControls.update();

    modelRenderer.render(modelScene, modelCamera); 
    meshRenderer.render(meshScene,   meshCamera); 

//  meshRenderer.render(meshScene, postCamera); 
}

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
var meshMaterial        : THREE.ShaderMaterial;
var meshTarget          : THREE.WebGLRenderTarget;
var meshEncodedTarget   : THREE.WebGLRenderTarget;

var supportsExtensions  : boolean = true;

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
    modelRenderer = new THREE.WebGLRenderer( {canvas : modelCanvas, logarithmicDepthBuffer : true});
    modelRenderer.setPixelRatio(window.devicePixelRatio);
    modelRenderer.setSize(Resolution.viewModel, Resolution.viewModel);

    supportsExtensions = verifyExtensions(modelRenderer);

    modelCamera = new THREE.PerspectiveCamera(70, Resolution.viewModel / Resolution.viewModel, .01, 50);
    modelCamera.position.z = 5;

    modelControls = new TrackballControls(modelCamera, modelRenderer.domElement);

    // scene
    modelScene = new THREE.Scene();

//  setupModelTorusScene(modelScene);
//  setupModelSphereScene(modelScene);
    setupBoxScene(modelScene);

    initializeLighting(modelScene);
    initializeModelHelpers();
}

function constructDepthTextureRenderTarget(width : number, height : number) : THREE.WebGLRenderTarget {

    // Model Scene -> (Render Texture, Depth Texture)
    var renderTarget = new THREE.WebGLRenderTarget(width, height);

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
    postRenderer = new THREE.WebGLRenderer({ canvas: postCanvas });
    postRenderer.setPixelRatio(window.devicePixelRatio);
    postRenderer.setSize(Resolution.viewPost, Resolution.viewPost);

    // click handler
    postCanvas.onclick = createDepthBuffer;

    // Model Scene -> (Render Texture, Depth Texture)
    target = constructDepthTextureRenderTarget(Resolution.viewPost, Resolution.viewPost);

    // Encoded RGBA Texture from Depth Texture
    encodedTarget = new THREE.WebGLRenderTarget(Resolution.viewPost, Resolution.viewPost);

    // Setup post-processing step
    setupPostScene();
}

function initializeMeshRenderer() {

    meshCanvas = initializeCanvas('meshCanvas', Resolution.viewMesh);
    meshRenderer = new THREE.WebGLRenderer( {canvas : meshCanvas, logarithmicDepthBuffer : true});
    meshRenderer.setPixelRatio(window.devicePixelRatio);
    meshRenderer.setSize(Resolution.viewMesh, Resolution.viewMesh);

    meshCamera = new THREE.PerspectiveCamera(70, Resolution.viewMesh / Resolution.viewMesh, .01, 50);
    meshCamera.position.z = 5;

    meshControls = new TrackballControls(meshCamera, meshRenderer.domElement);

    // Model Scene -> (Render Texture, Depth Texture)
    meshTarget = constructDepthTextureRenderTarget(Resolution.viewMesh, Resolution.viewMesh);

    // Encoded RGBA Texture from Depth Texture
    meshEncodedTarget = new THREE.WebGLRenderTarget(Resolution.viewMesh, Resolution.viewMesh);

    setupMeshScene();

    initializeLighting(meshScene);
}

function init() {
    
    initializeModelRenderer();
    initializePostRenderer();
    initializeMeshRenderer();

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

    let aspect : number = Resolution.viewModel / Resolution.viewModel;
    modelCamera.aspect = aspect;
    modelCamera.updateProjectionMatrix();

    modelRenderer.setSize(Resolution.viewModel, Resolution.viewModel);

    // size target DepthTexture
    var postPixelRatio = postRenderer.getPixelRatio();
    target.setSize(postCanvas.width * postPixelRatio, postCanvas.height * postPixelRatio);
    encodedTarget.setSize(postCanvas.width * postPixelRatio, postCanvas.height * postPixelRatio);

    postRenderer.setSize(postCanvas.width, postCanvas.height);
}

/**
  * Adds lighting to the scene
*/
function initializeLighting(theScene : THREE.Scene) {

    let ambientLight = new THREE.AmbientLight(0x404040);
    theScene.add(ambientLight);

    let directionalLight1 = new THREE.DirectionalLight(0xC0C0C0);
    directionalLight1.position.set(50, 50, 50);
    theScene.add(directionalLight1);
}

/**
 * Adds helpers to the scene to visualize camera, coordinates, etc.
*/
function initializeModelHelpers() {

    var cameraHelper = new THREE.CameraHelper(modelCamera );
    cameraHelper.visible = true;
//  scene.add(cameraHelper);

    var axisHelper = new THREE.AxisHelper(2);
    axisHelper.visible = true;
    modelScene.add(axisHelper);
}

function setupTorusScene(theScene : THREE.Scene) {

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
        mesh.position.set(
            Math.cos(r) * zScale,
            Math.sin(r) * zScale,
            z * scale
        );
        mesh.rotation.set(Math.random(), Math.random(), Math.random());

        theScene.add(mesh);
    }
}

function setupSphereScene(theScene : THREE.Scene) {

    // Setup some geometries
    let radius  : number = 2;
    let segments : number = 64;
    let geometry = new THREE.SphereGeometry(radius, segments, segments);
    let material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });
//  let material = new THREE.MeshDepthMaterial();

    let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(center.x, center.y, center.z);

    theScene.add(mesh);
}

function setupBoxScene(theScene : THREE.Scene) {

    // box
    let width  : number = 2;
    let height : number = 2;
    let depth  : number = 2;

    let geometry : THREE.Geometry = new THREE.BoxGeometry(width, height, depth);
    let material : THREE.Material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });

    let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(center.x, center.y, center.z);

    theScene.add(mesh);

    // background plane
    width  = 4;
    height = 4;

    geometry = new THREE.PlaneGeometry(width, height);
    material = new THREE.MeshPhongMaterial({ color: 0x5555cc });

    center = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(center.x, center.y, center.z);

    theScene.add(mesh);
}

function setMeshMaterialUnforms () {

    meshMaterial.uniforms = {
        cameraNear  :   { value: modelCamera.near },
        cameraFar   :   { value: modelCamera.far },
        tDiffuse    :   { value: meshTarget.texture },
        tDepth      :   { value: meshTarget.depthTexture }
    }
}

function setupMeshScene() {

    meshMaterial = new THREE.ShaderMaterial({
        
        vertexShader:   MR.shaderSource['MeshVertexShader'],
        fragmentShader: MR.shaderSource['MeshFragmentShader'],
    });
    setMeshMaterialUnforms();

    var meshPlane = new THREE.PlaneGeometry(2, 2);
    var meshQuad  = new THREE.Mesh(meshPlane, meshMaterial);

    meshScene = new THREE.Scene();
    meshScene.add(meshQuad);
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

    var postMaterial = new THREE.ShaderMaterial({
        
        vertexShader:   MR.shaderSource['DepthBufferVertexShader'],
        fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],

        uniforms: {
            designColor :   { value: 0xC0C090},
            cameraNear  :   { value: modelCamera.near },
            cameraFar   :   { value: modelCamera.far },
            tDiffuse    :   { value: target.texture },
            tDepth      :   { value: target.depthTexture }
        }
    });
    var postPlane = new THREE.PlaneGeometry(2, 2);
    var postQuad  = new THREE.Mesh(postPlane, postMaterial);

    postScene = new THREE.Scene();
    postScene.add(postQuad);
}

function createDepthBuffer() {
    
    let logger = new HTMLLogger();

    // create depth texture
    postRenderer.render(modelScene, modelCamera, target);    
//  let primaryImageBuffer =  new Uint8Array(Resolution.viewModel * Resolution.viewModel * 4).fill(0);
//  renderer.readRenderTargetPixels(target, 0, 0, Resolution.viewModel, Resolution.viewModel, primaryImageBuffer);

    // (optional) display float encoding in depth buffer preview
    postRenderer.render(postScene, postCamera);    

    // write depth values as RGBA texture
    // target.depthTexture -> postTarget (encoded RGBA texture)
    postRenderer.render(postScene, postCamera, encodedTarget); 

    // decode RGBA texture into depth floats
    let depthBufferRaw =  new Uint8Array(Resolution.viewPost * Resolution.viewPost * 4).fill(0);
    postRenderer.readRenderTargetPixels(encodedTarget, 0, 0, Resolution.viewPost, Resolution.viewPost, depthBufferRaw);

    let depthBuffer = new DepthBuffer(depthBufferRaw, Resolution.viewPost, Resolution.viewPost, modelCamera.near, modelCamera.far);
    
    let middle = Resolution.viewPost / 2;
    let depthNormalized = depthBuffer.valueNormalized(middle, middle);
    logger.addMessage(`${depthNormalized}`, 'red');

    let decimalPlaces = 2;
    let messageString : string = `Scene Depth = ${depthBuffer.depth.toFixed(2)} [Normalized] depth = ${depthNormalized.toFixed(decimalPlaces)}, min = ${depthBuffer.minimumNormalized.toFixed(decimalPlaces)}, max = ${depthBuffer.maximumNormalized.toFixed(decimalPlaces)}, [Absolute] depth = ${depthBuffer.depth.toFixed(decimalPlaces)}, min = ${depthBuffer.minimum.toFixed(decimalPlaces)}, max = ${depthBuffer.maximum.toFixed(decimalPlaces)}`;
    logger.addMessage(messageString, 'blue');
    
    updateMeshMaterial();

}

function updateMeshMaterial() {

    meshRenderer.render(modelScene, modelCamera, meshTarget);    
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

    if (!supportsExtensions) 
        return;

    requestAnimationFrame(animate);

    modelControls.update();
    meshControls.update();

    modelRenderer.render(modelScene, modelCamera); 
    meshRenderer.render(meshScene, meshCamera); 
}

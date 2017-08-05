// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2012-2017> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

//#define MAXIMUMPRECISION
#if defined(MAXIMUMPRECISION)
    precision highp float;
    precision highp int;
#else
    precision mediump float;
#endif

// THREE.js pre-defined vertex shader uniforms and attributes
// http://threejs.org/docs/#Reference/Renderers.WebGL/WebGLProgram
#if defined(NOOP)
uniform mat4 modelMatrix;					// = object.matrixWorld
uniform mat4 modelViewMatrix;				// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 projectionMatrix;				// = camera.projectionMatrix
uniform mat4 viewMatrix;					// = camera.matrixWorldInverse
uniform mat3 normalMatrix;					// = inverse transpose of modelViewMatrix
uniform vec3 cameraPosition;				// = camera position in world space

// default vertex attributes provided by Geometry and BufferGeometry
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
#endif

uniform float       cameraNear;             // near clipping plane
uniform float       cameraFar;              // far clipping plane
uniform sampler2D   tDiffuse;               // RGBA float depth
uniform sampler2D   tDepth;                 // depth texture

varying vec2 vUV;                           // UV coordinates of vertex

/// <summary>
///  Main entry point
/// </summary>
void main() {

    vUV = uv;

    // adjust Z position by depth
    vec3 positionPrime = position;

    float depth = texture2D(tDepth, vUV).x;
    depth = depth * (cameraFar - cameraNear);
    positionPrime.z = -depth;

    vec4 mvPosition;
    mvPosition = modelViewMatrix * vec4(positionPrime, 1.0);

    gl_Position = projectionMatrix * mvPosition;
}
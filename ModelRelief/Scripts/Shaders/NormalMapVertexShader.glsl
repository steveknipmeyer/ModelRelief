// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
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

varying vec2 vUV;							// UV coordinates of vertex
varying vec3 vNormal;						// vertex normal
varying vec3 vWorldPosition;				// vertex world position
varying vec3 vViewPosition;					// vertex view position (flipped)
varying float vDepth;						// Z depth

/// <summary>
///  Main entry point
/// </summary>
void main() {

	vUV = uv;

	vec3 transformedNormal = normalMatrix * normal;
	vNormal = normalize(transformedNormal);

	vec4 worldPosition = modelMatrix * vec4(position, 1.0);
	vWorldPosition = worldPosition.xyz;

	vec4 mvPosition;
	mvPosition = modelViewMatrix * vec4(position, 1.0);
	vViewPosition = -mvPosition.xyz;

	gl_Position = projectionMatrix * mvPosition;

	vDepth = gl_Position.z;
}
// ------------------------------------------------------------------------//
// NormalMapFragmentShader                                                 //
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2019> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
// This extension is not supported.
// #extension GL_EXT_frag_depth : enable

#define MAXIMUMPRECISION
#if defined(MAXIMUMPRECISION)
    precision highp float;
    precision highp int;
#else
    precision mediump float;
#endif

#include <packing>

// THREE.js pre-defined fragment shader uniforms and attributes
#if defined(NOOP)
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif
uniform float       cameraNear;         // near clipping plane
uniform float       cameraFar;          // far clipping plane

varying vec2 vUV;                       // UV coordinates of vertex
varying vec3 vNormal;                   // vertex normal
varying vec3 vWorldPosition;            // vertex world position
varying vec3 vViewPosition;             // vertex view position (flipped)
varying float vDepth;                   // Z depth

const vec3 noColor = vec3(0.0, 0.0, 0.0);

/// <summary>
///  Main entry point
/// </summary>
void main() {

	vec3 normal = normalize(vNormal);

    float redComponent   = (normal.x + 1.0) / 2.0;
    float greenComponent = (normal.y + 1.0) / 2.0;
    float blueComponent  = normal.z;
    gl_FragColor = vec4(redComponent, greenComponent, blueComponent, 1.0);

    // experimental
    float z = (vDepth - cameraNear) / (cameraFar - cameraNear);
//  gl_FragDepthEXT = z;
}

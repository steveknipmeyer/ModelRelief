// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
// enable extensions (e.g. dFdx, dFdy)
#extension GL_OES_standard_derivatives : enable

#include <packing>

// THREE.js pre-defined fragment shader uniforms and attributes
#if defined(NOOP)
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

varying vec2 vUV;								// UV coordinates of vertex
varying vec3 vNormal;							// vertex normal
varying vec3 vWorldPosition;					// vertex world position
varying vec3 vViewPosition;						// vertex view position (flipped)

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
}

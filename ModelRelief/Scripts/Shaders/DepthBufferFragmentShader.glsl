// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2012-2017> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
// enable extensions (e.g. dFdx, dFdy)
#extension GL_OES_standard_derivatives : enable

#include <packing>

// THREE.js pre-defined fragment shader uniforms and attributes
#if defined(NOOP)
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

uniform vec3        designColor;				// color
uniform float       cameraNear;                 // near clipping plane
uniform float       cameraFar;                  // far clipping plane
uniform sampler2D   tDiffuse;                   // diffuse texture (not used)
uniform sampler2D   tDepth;                     // depth texture

varying vec2 vUV;								// UV coordinates of vertex
varying vec3 vNormal;							// vertex normal
varying vec3 vWorldPosition;					// vertex world position
varying vec3 vViewPosition;						// vertex view position (flipped)

const vec3 noColor = vec3(0.0, 0.0, 0.0);

/// <summary>
///  Read depth from buffer.
//   Adjusts back to world (orthographic) coordinates.
/// </summary>
float readDepth (sampler2D depthSampler, vec2 uvCoordinate) {

    float fragCoordZ = texture2D(depthSampler, uvCoordinate).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );

    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

/// <summary>
///  Main entry point
/// </summary>
void main() {

	vec3 normal = normalize(vNormal);
	vec3 viewPosition = normalize(vViewPosition);

    vec3 diffuse = texture2D(tDiffuse, vUV).rgb;
    float depth = readDepth(tDepth, vUV);

    gl_FragColor.rgb = vec3(depth);
    gl_FragColor.a = 1.0;
}

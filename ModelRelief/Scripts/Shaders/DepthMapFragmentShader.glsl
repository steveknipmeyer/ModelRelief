// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2012-2017> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

// THREE.js pre-defined fragment shader uniforms and attributes
#if defined(NOOP)
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

// enable extensions (e.g. dFdx, dFdy)
#extension GL_OES_standard_derivatives : enable

uniform vec3        designColor;				// color

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
	vec3 viewPosition = normalize(vViewPosition);

    gl_FragColor.xyz = designColor.xyz;
	gl_FragColor.a   = 1.0;
}

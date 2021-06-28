// ------------------------------------------------------------------------//
// TemplateFragmentShader                                                  //
// ModelRelief                                                             //
// ------------------------------------------------------------------------//

// enable extensions (e.g. dFdx, dFdy)
// #extension GL_OES_standard_derivatives : enable

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

uniform vec3        designColor;                // color
uniform sampler2D   tDiffuse;                   // diffuse texture (not used)

varying vec2 vUV;                               // UV coordinates of vertex
varying vec3 vNormal;                           // vertex normal
varying vec3 vWorldPosition;                    // vertex world position
varying vec3 vViewPosition;                     // vertex view position (flipped)

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

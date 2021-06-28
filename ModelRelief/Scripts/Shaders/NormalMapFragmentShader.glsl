// ------------------------------------------------------------------------//
// NormalMapFragmentShader                                                 //
// ModelRelief                                                             //
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

varying vec3 vNormal;                   // vertex normal

const vec3 noColor = vec3(0.0, 0.0, 0.0);

/// <summary>
///  Main entry point
/// </summary>
void main() {

    float redComponent   = (vNormal.x + 1.0) / 2.0;
    float greenComponent = (vNormal.y + 1.0) / 2.0;
    float blueComponent  = vNormal.z;

    gl_FragColor = vec4(redComponent, greenComponent, blueComponent, 1.0);
}

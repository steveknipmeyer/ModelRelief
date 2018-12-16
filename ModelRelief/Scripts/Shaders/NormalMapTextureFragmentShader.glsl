// ------------------------------------------------------------------------//
// NormalMapTexureFragmentShader                                           //
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2019> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

#define MAXIMUMPRECISION
#if defined(MAXIMUMPRECISION)
    precision highp float;
    precision highp int;
#else
    precision mediump float;
#endif

// THREE.js pre-defined fragment shader uniforms and attributes
#if defined(NOOP)
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

varying vec2 vUV;                           // UV coordinates of vertex

uniform sampler2D tNormalMap;               // normal map

/// <summary>
///  Main entry point
/// </summary>
void main() {

    gl_FragColor = texture2D(tNormalMap, vUV);
}

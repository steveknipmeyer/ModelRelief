// ------------------------------------------------------------------------//
// NormalMapVertexShader                                                   //
// ModelRelief                                                             //
// ------------------------------------------------------------------------//

#define MAXIMUMPRECISION
#if defined(MAXIMUMPRECISION)
    precision highp float;
    precision highp int;
#else
    precision mediump float;
#endif

// THREE.js pre-defined vertex shader uniforms and attributes
// http://threejs.org/docs/#Reference/Renderers.WebGL/WebGLProgram
#if defined(NOOP)
uniform mat4 modelMatrix;                   // = object.matrixWorld
uniform mat4 modelViewMatrix;               // = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 projectionMatrix;              // = camera.projectionMatrix
uniform mat4 viewMatrix;                    // = camera.matrixWorldInverse
uniform mat3 normalMatrix;                  // = inverse transpose of modelViewMatrix
uniform vec3 cameraPosition;                // = camera position in world space

// default vertex attributes provided by Geometry and BufferGeometry
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
#endif

varying vec3 vNormal;                       // vertex normal

/// <summary>
///  Main entry point
/// </summary>
void main() {

    // position
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // normal
    vec3 transformedNormal = normalMatrix * normal;
    vNormal = normalize(transformedNormal);
}
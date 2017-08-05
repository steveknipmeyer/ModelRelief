// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2012-2017> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

// enable extensions (e.g. dFdx, dFdy)
// #extension GL_OES_standard_derivatives : enable

//#define MAXIMUMPRECISION
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

uniform float       cameraNear;                 // near clipping plane
uniform float       cameraFar;                  // far clipping plane
uniform sampler2D   tDiffuse;                   // diffuse texture 
uniform sampler2D   tDepth;                     // depth texture

varying vec2 vUV;								// UV coordinates of vertex
varying vec3 vNormal;							// vertex normal
varying vec3 vWorldPosition;					// vertex world position
varying vec3 vViewPosition;						// vertex view position (flipped)

const vec3 noColor = vec3(0.0, 0.0, 0.0);

// http://concord-consortium.github.io/lab/experiments/webgl-gpgpu/webgl.html
// https://stackoverflow.com/questions/17981163/webgl-read-pixels-from-floating-point-render-target
    float shift_right (float v, float amt) { 
        v = floor(v) + 0.5; 
        return floor(v / exp2(amt)); 
    }

    float shift_left (float v, float amt) { 
        return floor(v * exp2(amt) + 0.5); 
    }

    float mask_last (float v, float bits) { 
        return mod(v, shift_left(1.0, bits)); 
    }

    float extract_bits (float num, float from, float to) { 
        from = floor(from + 0.5); to = floor(to + 0.5); 
        return mask_last(shift_right(num, from), to - from); 
    }

    vec4 encode_float (float val) { 
        if (val == 0.0) 
            return vec4(0, 0, 0, 0); 

        float sign = val > 0.0 ? 0.0 : 1.0; 
        val = abs(val); 
        float exponent = floor(log2(val)); 
        float biased_exponent = exponent + 127.0; 
        float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0; 
        float t = biased_exponent / 2.0; 
        float last_bit_of_biased_exponent = fract(t) * 2.0; 
        float remaining_bits_of_biased_exponent = floor(t); 
        float byte4 = extract_bits(fraction, 0.0, 8.0) / 255.0; 
        float byte3 = extract_bits(fraction, 8.0, 16.0) / 255.0; 
        float byte2 = (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0; 
        float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0; 
        return vec4(byte4, byte3, byte2, byte1); 
    }

/// <summary>
///  Read depth from buffer.
//   Adjusts back to world (orthographic) coordinates.
//   N.B. normalized clip coordinates [0,1]
/// </summary>
float readDepth (sampler2D depthSampler, vec2 uvCoordinate) {

    float fragCoordZ = texture2D(depthSampler, uvCoordinate).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );

    // normalized clip coordinates
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

/// <summary>
///  Main entry point
/// </summary>
void main() {

    vec3 normal = normalize(vNormal);
    vec3 viewPosition = normalize(vViewPosition);

    gl_FragColor = texture2D(tDepth, vUV);

#if defined (DEBUG)
    // raw depth buffer
    gl_FragColor = texture2D(tDepth, vUV);
#endif
}

#if defined(NOOP)
    vec3 packNormalToRGB( const in vec3 normal ) {
        return normalize( normal ) * 0.5 + 0.5;
    }

    vec3 unpackRGBToNormal( const in vec3 rgb ) {
        return 1.0 - 2.0 * rgb.xyz;
    }

    const float PackUpscale = 256. / 255.;
    const float UnpackDownscale = 255. / 256.;
    const vec3  PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
    const vec4  UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
    const float ShiftRight8 = 1. / 256.;

    vec4 packDepthToRGBA( const in float v ) {

        vec4 r = vec4( fract( v * PackFactors ), v );
        r.yzw -= r.xyz * ShiftRight8;	
        return r * PackUpscale;
    }

    float unpackRGBAToDepth( const in vec4 v ) {
        return dot( v, UnpackFactors );
    }

    float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
        return ( viewZ + near ) / ( near - far );
    }

    float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
        return linearClipZ * ( near - far ) - near;
    }

    float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
        return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
    }

    float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
        return ( near * far ) / ( ( far - near ) * invClipZ - far );
    }
#endif
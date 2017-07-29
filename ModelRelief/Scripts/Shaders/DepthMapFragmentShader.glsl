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

uniform sampler2D   designTexture;				// texture map (DesignMaterial)
uniform vec3        designColor;				// enamel color
uniform sampler2D   tMatCap;					// SEM reflection map

varying vec2 vUV;								// UV coordinates of vertex
varying vec3 vNormal;							// vertex normal
varying vec3 vWorldPosition;					// vertex world position
varying vec3 vViewPosition;						// vertex view position (flipped)

const vec3 noColor = vec3(0.0, 0.0, 0.0);

float bumpScale = -0.5; 

float opacity = 1.0;
vec3  emissive = vec3(0.0, 0.0, 0.0);

float shininess = 0.5;

float specularStrength = 1.0;
vec3  specular = vec3(1.0, 1.0, 1.0);

vec3 ambient = vec3(0.1, 0.1, 0.1);
vec3 ambientLightColor = vec3(1.0, 1.0, 1.0);

const int LightCount = 3;
vec3 directionalLightColor[3];
vec3 directionalLightDirection[3];

// ------------------------------------------------------------------------// 
// Bump Maps															   //
// ------------------------------------------------------------------------//
// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen
//	http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html 

// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)

/// <summary>
///  Derivative
/// </summary>
vec2 dHdxy_fwd() {

	vec2 dSTdx = dFdx(vUV);
	vec2 dSTdy = dFdy(vUV);

#define ORIGINAL 1

#if defined (ALPHA)	
	float HllComponent = texture2D(designTexture, vUV).a;
	float dBxComponent = texture2D(designTexture, vUV + dSTdx).a;
	float dByComponent = texture2D(designTexture, vUV + dSTdy).a;

	float Hll = bumpScale * HllComponent;
	float dBx = bumpScale * dBxComponent - HllComponent;
	float dBy = bumpScale * dByComponent - HllComponent;
#endif

#if defined (COLOR)	
	vec3 HllColor = texture2D(designTexture, vUV).rgb;
	vec3 dBxColor = texture2D(designTexture, vUV + dSTdx).rgb;
	vec3 dByColor = texture2D(designTexture, vUV + dSTdy).rgb;

	float HllComponent = any(greaterThan(HllColor, noColor)) ? 255.0 : 0.0;
	float dBxComponent = any(greaterThan(dBxColor, noColor)) ? 255.0 : 0.0;
	float dByComponent = any(greaterThan(dByColor, noColor)) ? 255.0 : 0.0;

	float Hll = bumpScale * HllComponent;
	float dBx = bumpScale * dBxComponent - HllComponent;
	float dBy = bumpScale * dByComponent - HllComponent;
#endif

#if defined (ORIGINAL)
	float Hll = bumpScale * texture2D(designTexture, vUV).x;
	float dBx = bumpScale * texture2D(designTexture, vUV + dSTdx).x - Hll;
	float dBy = bumpScale * texture2D(designTexture, vUV + dSTdy).x - Hll;
#endif

	return vec2(dBx, dBy);
}

/// <summary>
///  Bump map normal
/// </summary>
vec3 perturbNormalArb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {

	vec3 vSigmaX = dFdx(surf_pos);
	vec3 vSigmaY = dFdy(surf_pos);
	vec3 vN = surf_norm;			// normalized

	vec3 R1 = cross(vSigmaY, vN);
	vec3 R2 = cross(vN, vSigmaX);

	float fDet = dot(vSigmaX, R1);

	vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
	return normalize(abs(fDet) * surf_norm - vGrad);
}

/// <summary>
///  Define the scene lighting.
/// </summary>
void setupLighting() {

	directionalLightColor[0] = vec3(1.0, 1.0, 1.0);
	directionalLightColor[1] = vec3(1.0, 1.0, 1.0);
	directionalLightColor[2] = vec3(1.0, 1.0, 1.0);

	directionalLightDirection[0] = vec3(  0.0,  30.0, 30.0);
	directionalLightDirection[1] = vec3( 30.0, -10.0,  30.0); 
	directionalLightDirection[2] = vec3(-30.0, -10.0,  30.0);
}

/// <summary>
///  Returns whether a design texture is defined.
///  if false, the body is being rendered.
/// </summary>
bool designTextureValid() {

	return (noColor != designColor);
}

/// <summary>
///  Look up the environment color.
/// </summary>
vec3 calculateEnvironmentColor() {

	// SEM: Spherical Environment Mapping
	vec3 e = normalize(-vViewPosition.xyz);

	vec3  r = reflect(e, vNormal);
	float m = 2.0 * sqrt(pow(r.x, 2.0) + pow(r.y, 2.0) + pow(r.z + 1.0, 2.0));
	vec2 uvSEM = r.xy / m + 0.5;

	vec3 environmentColor = texture2D(tMatCap, uvSEM).rgb;
	
	return environmentColor;
}

/// <summary>
///  Compute the blended color based on the environment map and the design texture.
/// </summary>
vec3 calculateBlendedColor() {
	
	// SEM
	vec3 environmentColor = calculateEnvironmentColor ();

	if (vec3(0.0) == designColor)
		return environmentColor;

	float  minimumAlpha = 0.0;
	float  maximumAlpha = 0.8;				// < 1.0; necessary to blend a component of the reflection map into the enamel color

	// calculate alpha component from designTexture
	float textureAlpha = texture2D(designTexture, vUV).a;
	float blendFactor = (textureAlpha == 0.0) ? 0.0 : clamp(textureAlpha, minimumAlpha, maximumAlpha);
          
          // WIP
          blendFactor = 0.4;

	// blend environment map with designColor 
	vec3 textureColor = texture2D(designTexture, vUV).rgb;
	vec3 blendedColor = (designColor.rgb * blendFactor) + (environmentColor * (1.0 - blendFactor));

	return blendedColor;
}

/// <summary>
///  Main entry point
/// </summary>
void main() {

	setupLighting();

	vec3 normal = normalize(vNormal);
	vec3 viewPosition = normalize(vViewPosition);

	// bump map
	if (designTextureValid())
  		normal = perturbNormalArb(-vViewPosition, normal, dHdxy_fwd());

	// base color
	vec3 blendedColor = calculateBlendedColor();

	vec3 directionalDiffuse  = vec3(0.0);
	vec3 directionalSpecular = vec3(0.0);
	for (int iLight = 0; iLight < LightCount; iLight++) {

		vec4 lightDirection = viewMatrix * vec4(directionalLightDirection[iLight], 0.0);
		vec3 directionalVector = normalize(lightDirection.xyz);

		// diffuse
		float dotProduct = dot(normal, directionalVector);

		float directionalDiffuseWeight = max(dotProduct, 0.0);
		directionalDiffuse += blendedColor * directionalLightColor[iLight] * directionalDiffuseWeight;

		// specular
		vec3 directionalHalfVector = normalize(directionalVector + viewPosition);
		float directionalDotNormalHalf = max(dot(normal, directionalHalfVector), 0.0);
		float directionalSpecularWeight = specularStrength * max(pow(directionalDotNormalHalf, shininess), 0.0);

		float specularNormalization = (shininess + 2.0) / 8.0;
		vec3 schlick = specular + vec3(1.0 - specular) * pow(max(1.0 - dot(directionalVector, directionalHalfVector), 0.0), 5.0);
		directionalSpecular += schlick * directionalLightColor[iLight] * directionalSpecularWeight * directionalDiffuseWeight * specularNormalization;
	}

	vec3 totalDiffuse  = vec3(0.0);
	vec3 totalSpecular = vec3(0.0);

	totalDiffuse  += directionalDiffuse;
	totalSpecular += directionalSpecular;

	gl_FragColor.xyz = blendedColor.xyz * (emissive + totalDiffuse + ambientLightColor * ambient) + totalSpecular;
	gl_FragColor.a   = 1.0;
}

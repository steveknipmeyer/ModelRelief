// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from 'three'
          
/**
 * Materials
 * General THREE.js Material classes and helpers
 * @class
 */
export class Materials {

    /**
     * @constructor
     */
    constructor() {
    }

//#region Materials
    /**
     * Create a texture material from an image URL.
     * @param image - Image to use in texture
     * @returns Texture material
     */
    static createTextureMaterial (image : HTMLImageElement) : THREE.MeshBasicMaterial {
            
        var texture         : THREE.Texture,
            textureMaterial : THREE.MeshBasicMaterial;
                
        texture = new THREE.Texture(image);
        texture.needsUpdate     = true;
        texture.generateMipmaps = false;
                    
        texture.magFilter = THREE.NearestFilter;     // The magnification and minification filters sample the texture map elements when mapping to a pixel.
        texture.minFilter = THREE.NearestFilter;     // The default modes oversample which leads to blending with the black background. 
                                                        // This produces colored (black) artifacts around the edges of the texture map elements.
        texture.repeat = new THREE.Vector2(1.0, 1.0);

        textureMaterial = new THREE.MeshBasicMaterial( {map: texture} );
        textureMaterial.transparent = true;
            
        return textureMaterial;
    }

    /**
     *  Create a bump map Phong material from a texture map.
     * @param designTexture - Bump map texture
     * @returns Phong bump mapped material
     */
    static createMeshPhongMaterial(designTexture : THREE.Texture)  : THREE.MeshPhongMaterial {

        var material : THREE.MeshPhongMaterial;
            
        material = new THREE.MeshPhongMaterial({
            color   : 0xffffff,
                
            bumpMap   : designTexture,
            bumpScale : -1.0,

            shading: THREE.SmoothShading,
        });

        return material;
    }

    /**
     * Create a transparent material.
     * @returns Transparent material
     */
    static createTransparentMaterial()  : THREE.Material {

        return new THREE.MeshBasicMaterial({color : 0x000000, opacity : 0.0, transparent : true});
    }
    /**
     * Create the shader material used for generating the DepthBuffer.
     * @param designColor - Material color
     * @returns Shader material
     */
    static createDepthBufferMaterial(designColor : number) : THREE.ShaderMaterial {
            
        var textureLoader  = new THREE.TextureLoader();               
        var shaderMaterial = new THREE.ShaderMaterial({

            uniforms: { 
                designColor : { 
                    type: 'c', 
                    value: new THREE.Color(designColor)
                },
            },

            vertexShader:   MR.shaderSource['DepthMapVertexShader'],
            fragmentShader: MR.shaderSource['DepthMapFragmentShader'],

            shading: THREE.SmoothShading
            });
            
        return shaderMaterial;
    }       
//#endregion
}

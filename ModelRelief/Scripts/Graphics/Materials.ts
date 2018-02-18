// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from 'three';
          
/**
 * @description General THREE.js Material classes and helpers
 * @export
 * @class Materials
 */
export class Materials {

    /**
     * Creates an instance of Materials.
     */
    constructor() {
    }

//#region Materials
    /**
     * @description Create a texture material from an image URL.
     * @static
     * @param {HTMLImageElement} image Image to use in texture.
     * @returns {THREE.MeshBasicMaterial} Texture material.
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
     * @description Create a bump map Phong material from a texture map.
     * @static
     * @param {THREE.Texture} designTexture Bump map texture.
     * @returns {THREE.MeshPhongMaterial} Phong bump mapped material.
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
     * @description Create a transparent material.
     * @static
     * @returns {THREE.Material} 
     */
    static createTransparentMaterial()  : THREE.Material {

        return new THREE.MeshBasicMaterial({color : 0x000000, opacity : 0.0, transparent : true});
    }

//#endregion
}

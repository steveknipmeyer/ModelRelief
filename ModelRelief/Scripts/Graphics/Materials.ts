// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

// Three.js may handle materials as a single instance or an array of instances.
export type ThreeMaterial = THREE.Material | THREE.Material[];

/**
 * @description General THREE.js Material classes and helpers
 * @export
 * @class Materials
 */
export class Materials {

//#region Materials
    /**
     * Creates an instance of Materials.
     */
    constructor() {
        // NOP
    }

    /**
     * @description Create a texture material from an image URL.
     * @static
     * @param {HTMLImageElement} image Image to use in texture.
     * @returns {THREE.MeshBasicMaterial} Texture material.
     */
    public static createTextureMaterial(image: HTMLImageElement): THREE.MeshBasicMaterial {

        const texture = new THREE.Texture(image);
        texture.needsUpdate     = true;
        texture.generateMipmaps = false;

        texture.magFilter = THREE.NearestFilter;        // The magnification and minification filters sample the texture map elements when mapping to a pixel.
        texture.minFilter = THREE.NearestFilter;        // The default modes oversample which leads to blending with the black background.
                                                        // This produces colored (black) artifacts around the edges of the texture map elements.
        texture.repeat = new THREE.Vector2(1.0, 1.0);

        const textureMaterial = new THREE.MeshBasicMaterial( {map: texture} );
        textureMaterial.transparent = true;

        return textureMaterial;
    }

    /**
     * @description Create a bump map Phong material from a texture map.
     * @static
     * @param {THREE.Texture} bumpMapTexture Bump map texture.
     * @returns {THREE.MeshPhongMaterial} Phong bump mapped material.
     */
    public static createMeshPhongBumpMaterial(bumpMapTexture: THREE.Texture): THREE.MeshPhongMaterial {

        const material = new THREE.MeshPhongMaterial({
            color   : 0xffffff,

            bumpMap   : bumpMapTexture,
            bumpScale : -1.0,
        });
        material.flatShading = false;

        return material;
    }

    /**
     * @description Create a transparent material.
     * @static
     * @returns {THREE.Material}
     */
    public static createTransparentMaterial(): THREE.Material {

        return new THREE.MeshBasicMaterial({color : 0x000000, opacity : 0.0, transparent : true});
    }

    /**
     * @description Returns whether an object is a Texture.
     * @static
     * @param value Property value.
     */
    private static isTexture(value): boolean {
        if (!value)
            return false;

        if (typeof value !== "object")
            return false;

        if (!("minFilter" in value))
            return false;

        return true;
    }

    /**
     * @description Dispose of a material and its textures.
     * @static
     * @param {THREE.Material} material Material to free.
     */
    private static dispose(material: THREE.Material): void {

        //Services.defaultLogger.addInfoMessage ("\tdispose Material: " + material.name);
        material.dispose();

        // dispose textures
        for (const key of Object.keys(material)) {

            const value = material[key];
            if (Materials.isTexture(value)) {
                //Services.defaultLogger.addInfoMessage ("\tdispose Texture: " + value.name);
                value.dispose();
            }
        }
    }

    /**
     * @description Clone a material and its textures.
     * @static
     * @param {THREE.Material} material Material to clone.
     */
    private static cloneTextures(material: THREE.Material): void {

        //Services.defaultLogger.addInfoMessage ("\tclone Material: " + material.name);

        // clone textures
        for (const key of Object.keys(material)) {

            const value = material[key];
            if (Materials.isTexture(value)) {
                //Services.defaultLogger.addInfoMessage ("\tclone Texture: " + value.name);
                material[key] = value.clone();
            }
        }
    }

    /**
     * @description Process a material (or array of materials) by applying a callback function.
     * @static
     * @param {*} material Material to process.
     * @param {(material: THREE.Material) => void} processFunction
     */
    private static processMaterial(material, processFunction: (material: THREE.Material) => void ): void {

        // single material
        if (material.isMaterial) {
            processFunction(material);
        // array of materials
        } else {
            for (const iMaterial of material)
                processFunction(iMaterial);
        }
    }

    /**
     * @description Dispose of a material and its textures.
     * @static
     * @param {*} material Material to free.
     */
    public static disposeMaterial(material: ThreeMaterial): void {
        Materials.processMaterial(material, Materials.dispose);
    }

    /**
     * @description Clone a material and its textures.
     * @static
     * @param {*} material Material to clone.
     */
    public static cloneMaterial(material: ThreeMaterial): THREE.Material {

        const cloneMaterial = material instanceof THREE.Material ? material.clone() : material[0];

        Materials.processMaterial(cloneMaterial, Materials.cloneTextures);
        return cloneMaterial;
    }
//#endregion
}

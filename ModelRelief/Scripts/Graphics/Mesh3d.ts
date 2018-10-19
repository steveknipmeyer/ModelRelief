// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {Mesh3dCache} from "Scripts/Graphics/Mesh3dCache";

/**
 * @description Mesh generation parameters.
 * @export
 * @interface MeshGenerateParameters
 */
export interface IMeshGenerateParameters {

    name: string;
    material?: THREE.Material;
}

/**
 * @description Represents a subdivided rectangular face consisting of two triagnular faces.
 * @interface FacePair
 */
export interface IFacePair {

    vertices: THREE.Vector3[];
    faces: THREE.Face3[];
}

/**
 * @description Helper class for construction of THREE Meshes.
 * @export
 * @class Mesh3d
 */
export class Mesh3d {

    public static Cache: Mesh3dCache = new Mesh3dCache();
    public static DefaultMeshPhongMaterialParameters: THREE.MeshPhongMaterialParameters = {

        side: THREE.DoubleSide,
        wireframe : false,

        color: 0x42eef4,
        specular: 0xffffff,

        reflectivity : 0.75,
        shininess : 100,
    };
}

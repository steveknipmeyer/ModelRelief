// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto             from 'DtoModels';

import {IMeshTransform}     from 'IMeshTransform';
import { Project }          from 'Project';
import {Services}           from 'Services';

/**
 * @description Represents a mesh transform. 
 * The settings are applied to a DepthBuffer to create a Mesh.
 * @export
 * @class MeshTransform
 */
export class MeshTransform extends Dto.Model<MeshTransform> {

    width               : number;
    height              : number;
    depth               : number;
    
    tau                 : number;
    sigmaGaussianBlur   : number;
    sigmaGaussianSmooth : number;
    lambdaLinearScaling : number;

    // Navigation Properties
    projectId  : number;
    project    : Project;

    /**
     * @constructor
     */
    constructor() {
        super({
            name: 'MeshTransform', 
            description: 'MeshTransform',
        });
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {MeshTransform} 
     */
    static fromDtoModel(dtoMeshTransform : Dto.MeshTransform) : MeshTransform {

        // constructor
        let meshTransform = new MeshTransform ();

        meshTransform.id          = dtoMeshTransform.id;
        meshTransform.name        = dtoMeshTransform.name;
        meshTransform.description = dtoMeshTransform.description;       

        meshTransform.width       = dtoMeshTransform.width;              
        meshTransform.height      = dtoMeshTransform.height;              
        meshTransform.depth       = dtoMeshTransform.depth;              
        
        meshTransform.tau                 = dtoMeshTransform.tau;       
        meshTransform.sigmaGaussianBlur   = dtoMeshTransform.sigmaGaussianBlur;       
        meshTransform.sigmaGaussianSmooth = dtoMeshTransform.sigmaGaussianSmooth;       
        meshTransform.lambdaLinearScaling = dtoMeshTransform.lambdaLinearScaling;       

        meshTransform.projectId = dtoMeshTransform.projectId;       

        return meshTransform;
    }

    /**
     * @description Returns a DTO MeshTransform from the instance.
     * @returns {Dto.MeshTransform} 
     */
    toDtoModel() : Dto.MeshTransform {

        let meshTransform = new Dto.MeshTransform({
            id              : this.id,
            name            : this.name,
            description     : this.description,    

            width       : this.width,              
            height      : this.height,
            depth       : this.depth,              
            
            tau                 :  this.tau,       
            sigmaGaussianBlur   :  this.sigmaGaussianBlur,       
            sigmaGaussianSmooth :  this.sigmaGaussianSmooth,       
            lambdaLinearScaling :  this.lambdaLinearScaling,       
            
            projectId       : this.projectId,
        });

        return meshTransform;
    }        
}

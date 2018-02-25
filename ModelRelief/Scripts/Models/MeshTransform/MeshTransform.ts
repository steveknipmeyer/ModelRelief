// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto             from 'DtoModels';

import { HttpLibrary, ServerEndPoints } from 'Http'
import { IMeshTransform }               from 'IMeshTransform';
import { IModel }                       from 'IModel';
import { Model }                        from 'Model';
import { Project }                      from 'Project';
import { Services }                     from 'Services';

/**
 * @description Represents a mesh transform. 
 * The settings are applied to a DepthBuffer to create a Mesh.
 * @export
 * @class MeshTransform
 */
export class MeshTransform extends Model<MeshTransform> {

    width               : number;
    height              : number;
    depth               : number;
    
    tau                 : number;
    sigmaGaussianBlur   : number;
    sigmaGaussianSmooth : number;
    lambdaLinearScaling : number;

    // Navigation Properties
    project    : Project;

    /**
     * @constructor
     * Creates an instance of MeshTransform.
     * @param {IModel} [parameters={}] IModel properties.
     */
    constructor(parameters: IModel = {}) {

        parameters.name        = parameters.name        || "MeshTransform"; 
        parameters.description = parameters.description || "MeshTransform";
        
        super(parameters);

        this.initialize();
    }

    /**
     * @description Perform setup and initialization.
     */
    initialize(): void {

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiMeshTransforms}`;
    }

    /**
     * @description Returns a MeshTransform instance through an HTTP query of the Id.
     * @static
     * @param {number} id MeshTransform Id.
     * @returns {Promise<MeshTransform>} 
     */
    static async fromIdAsync(id : number ) : Promise<MeshTransform> {
        
        if (!id)
            return undefined;

        let meshTransform = new Dto.MeshTransform ({
            id : id
        });
        let meshTransformModel = await meshTransform.getAsync();
        return MeshTransform.fromDtoModelAsync(meshTransformModel);
    }   

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {MeshTransform} 
     */
    static async fromDtoModelAsync(dtoMeshTransform : Dto.MeshTransform) : Promise<MeshTransform> {

        // constructor
        let meshTransform = new MeshTransform ({
            id          : dtoMeshTransform.id,
            name        : dtoMeshTransform.name,
            description : dtoMeshTransform.description,       
        });

        meshTransform.width       = dtoMeshTransform.width;              
        meshTransform.height      = dtoMeshTransform.height;              
        meshTransform.depth       = dtoMeshTransform.depth;              
        
        meshTransform.tau                 = dtoMeshTransform.tau;       
        meshTransform.sigmaGaussianBlur   = dtoMeshTransform.sigmaGaussianBlur;       
        meshTransform.sigmaGaussianSmooth = dtoMeshTransform.sigmaGaussianSmooth;       
        meshTransform.lambdaLinearScaling = dtoMeshTransform.lambdaLinearScaling;       

        meshTransform.project = await Project.fromIdAsync(dtoMeshTransform.projectId);       

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
            
            projectId           : this.project ? this.project.id : undefined,
        });

        return meshTransform;
    }        
}

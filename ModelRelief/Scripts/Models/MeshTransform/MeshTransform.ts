// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto                         from 'DtoModels';

import { HttpLibrary, ServerEndPoints } from 'Http'
import { IMeshTransform }               from 'IMeshTransform';
import { IModel }                       from 'IModel';
import { Model }                        from 'Model';
import { Project }                      from 'Project';
import { Services }                     from 'Services';

/**
 * @description Represents a mesh transform. 
 * @export
 * @class MeshTransform
 * @extends {Model}
 */
export class MeshTransform extends Model {

    width               : number;
    height              : number;
    depth               : number;

    gradientThreshold         : number;
    attenuationFactor         : number;
    attenuationDecay          : number;
    unsharpGaussianLow        : number;
    unsharpGaussianHigh       : number;
    unsharpHighFrequencyScale : number;
    p1                        : number;
    p2                        : number;
    p3                        : number;
    p4                        : number;
    p5                        : number;
    p6                        : number;
    p7                        : number;
    p8                        : number;

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

        meshTransform.gradientThreshold         = dtoMeshTransform.gradientThreshold;
        meshTransform.attenuationFactor         = dtoMeshTransform.attenuationFactor;
        meshTransform.attenuationDecay          = dtoMeshTransform.attenuationDecay;
        meshTransform.unsharpGaussianLow        = dtoMeshTransform.unsharpGaussianLow;
        meshTransform.unsharpGaussianHigh       = dtoMeshTransform.unsharpGaussianHigh;
        meshTransform.unsharpHighFrequencyScale = dtoMeshTransform.unsharpHighFrequencyScale;
        meshTransform.p1                        = dtoMeshTransform.p1;
        meshTransform.p2                        = dtoMeshTransform.p2;        
        meshTransform.p3                        = dtoMeshTransform.p3;        
        meshTransform.p4                        = dtoMeshTransform.p4;        
        meshTransform.p5                        = dtoMeshTransform.p5;        
        meshTransform.p6                        = dtoMeshTransform.p6;        
        meshTransform.p7                        = dtoMeshTransform.p7;        
        meshTransform.p8                        = dtoMeshTransform.p8;        

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

            gradientThreshold          : this.gradientThreshold,
            attenuationFactor          : this.attenuationFactor,
            attenuationDecay           : this.attenuationDecay,
            unsharpGaussianLow         : this.unsharpGaussianLow,
            unsharpGaussianHigh        : this.unsharpGaussianHigh,
            unsharpHighFrequencyScale  : this.unsharpHighFrequencyScale,
            p1                         : this.p1,
            p2                         : this.p2,
            p3                         : this.p3,
            p4                         : this.p4,
            p5                         : this.p5,
            p6                         : this.p6,
            p7                         : this.p7,
            p8                         : this.p8,
            
            projectId           : this.project ? this.project.id : undefined,
        });

        return meshTransform;
    }        
}

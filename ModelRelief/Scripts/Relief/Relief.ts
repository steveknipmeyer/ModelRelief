// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import {Services}                           from 'Services'

/**
 * @description UI settings that control relief generation.
 * @export
 * @interface ReliefSettings
 */
export interface ReliefSettings {
    
        width                   : number;               // width of mesh (model units)
        height                  : number;               // height of mesh (model units)
        depth                   : number;               // depth of mesh (model units)
    
        tauThreshold            : number;               // attenutation
        sigmaGaussianBlur       : number;               // Gaussian blur
        sigmaGaussianSmooth     : number;               // Gaussian smoothing
        lambdaLinearScaling     : number;               // scaling
    }

/**
 * Relief
 * @class Relief
 */
export class Relief {

    /**
     * @constructor
     */
    constructor() {
    }
}

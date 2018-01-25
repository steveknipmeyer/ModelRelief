// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {IMeshTransform}     from 'IMeshTransform';
import {Services}           from 'Services'

/**
 * MeshTransform
 * @class MeshTransform
 */
export class MeshTransform {

    depth               : number;
    width               : number;
    height              : number;
    tau                 : number;

    sigmaGaussianBlur   : number;
    sigmaGaussianSmooth : number;
    lambdaLinearScaling : number;

    /**
     * @constructor
     */
    constructor() {
    }
}

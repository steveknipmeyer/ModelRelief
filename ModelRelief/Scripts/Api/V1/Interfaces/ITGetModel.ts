// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

 /**
 *  Common interface for all DTO TGetModel types.
 *  @interface
 */
export interface ITGetModel {

    id: number;

    name: string;
    description: string;
    }

/**
 *  Common interface for all generated file DTOs (e.g. Mesh, DepthBuffer).
 *  Not exposed in UX; API only.
 *  @interface
 */
export interface IGeneratedFile {

    fileTimeStamp: Date;                   //  time stamp of file 
    fileIsSynchronized: boolean;           // associated file is synchronized with the model (AND all of the the model's dependencies)
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {ContentType, HttpLibrary, 
    MethodType, ServerEndPoints}        from 'Http'
    import { RequestResponse }                  from 'RequestResponse'

 /**
 *  Common interface for all DTO model types.
 *  @interface
 */
export interface IModel {

    id?: number;
    name?: string;
    description?: string;

    submitRequestAsync?(endPoint: string, requestType : MethodType, contentType : ContentType, requestData : any) : Promise<RequestResponse>;
    factory?(parameters : IModel) : any;
    postAsync?() : Promise<any>;
    getAsync?()  : Promise<any>;
    putAsync?()  : Promise<any>;
}


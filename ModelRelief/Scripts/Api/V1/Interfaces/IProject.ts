// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { assert }           from 'chai'
import { ITGetModel }       from 'ITGetModel'

export interface IProject extends ITGetModel {
    id: number;

    name: string;
    description: string;
     
}



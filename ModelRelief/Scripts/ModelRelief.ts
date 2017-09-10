// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

export enum ContainerIds {

    RootContainer = "rootContainer",
    ComposerView  = "composerView",
    ModelView     = "modelView",
    ModelCanvas   = "modelCanvas",
    MeshView      = "meshView",
    MeshCanvas    = "meshCanvas",
}

import {ModelReliefView}  from "ModelReliefView"

let modelReliefView = new ModelReliefView(ContainerIds.ComposerView);


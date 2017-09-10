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

import {ComposerView}  from "ComposerView"

let composerView = new ComposerView(ContainerIds.ComposerView);


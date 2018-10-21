﻿// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {ComposerController} from "Scripts/Controllers/ComposerController";
import {EventType} from "Scripts/System/EventManager";
import {ElementIds} from "Scripts/System/Html";
import {ComposerView} from "Scripts/Views/ComposerView";

const composerView = new ComposerView(ElementIds.ComposerView);
composerView.eventManager.addEventListener(EventType.ComposerViewInitialized, () => {
        const composerController = new ComposerController(composerView);
    });

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'

import {Camera}                     from 'Camera'
import {DepthBufferFactory}         from 'DepthBufferFactory'
import {CameraSettings, Graphics}   from 'Graphics'
import {Loader}                     from 'Loader'
import {Logger, HTMLLogger}         from 'Logger'
import {MathLibrary}                from 'Math'
import {MeshPreviewViewer}          from "MeshPreviewViewer"
import {Services}                   from 'Services'
import {TrackballControls}          from 'TrackballControls'
import {UnitTests}                  from 'UnitTests'
import {Viewer}                     from 'Viewer'

let logger = new HTMLLogger();

/**
 * @class
 * CameraWorkbench
 */
export class CameraViewer extends Viewer {

    /**
     * Initialize the viewer camera
     */
    initializeDefaultCameraSettings () : CameraSettings {

        let settings : CameraSettings = {

            position:       new THREE.Vector3(0.0, 0.0, 6.0),
            target:         new THREE.Vector3(0, 0, 0),
            near:           2.0,
            far:            10.0,
            fieldOfView:    37                                  // https://www.nikonians.org/reviews/fov-tables
        };

        return settings;    
    }

}

/**
 * @class
 * App
 */
export class App {
    
    _loader : Loader;
    _viewer : CameraViewer;

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Main
     */
    run () {

        // Viewer    
        this._viewer = new CameraViewer('viewerCanvas');
        
        // Loader
        this._loader = new Loader();

        this._loader.loadBoxModel (this._viewer);
    }
}

let app = new App;
app.run();

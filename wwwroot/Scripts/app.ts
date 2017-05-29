﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

module MR {
    "use strict";

    export function run() {

        'use strict';
        
        var app = new MR.OBJViewer(<HTMLCanvasElement> document.getElementById('example'));

        // Init dat.gui and controls
        var elemFileInput = document.getElementById('fileUploadInput');
        var WWOBJLoader2Control = function () {
            this.smoothShading  = app.smoothShading;
            this.doubleSide     = app.doubleSide;
            this.streamMeshes   = app.streamMeshes;
        };
        var wwObjLoader2Control = new WWOBJLoader2Control();
        var gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        var menuDiv = document.getElementById('dat');
        menuDiv.appendChild(gui.domElement);
        var folderOptions = gui.addFolder('WWOBJLoader2 Options');

        var controlSmooth = folderOptions.add(wwObjLoader2Control, 'smoothShading').name('Smooth Shading');
        controlSmooth.onChange(function (value) {
            console.log('Setting smoothShading to: ' + value);
            app.alterSmoothShading();
        });

        var controlDouble = folderOptions.add(wwObjLoader2Control, 'doubleSide').name('Double Side Materials');
        controlDouble.onChange(function (value) {
            console.log('Setting doubleSide to: ' + value);
            app.alterDouble();
        });

        var controlStreamMeshes = folderOptions.add(wwObjLoader2Control, 'streamMeshes').name('Stream Meshes');
        controlStreamMeshes.onChange(function (value) {
            console.log('Setting streamMeshes to: ' + value);
            app.streamMeshes = value;
        });

        if (app.fileApiAvailable) {
            wwObjLoader2Control.pathTexture = 'obj/female02/';
            var controlPathTexture = folderOptions.add(wwObjLoader2Control, 'pathTexture').name('Relative path to textures');
            controlPathTexture.onChange(function (value) {
                console.log('Setting pathTexture to: ' + value);
                app.pathTexture = value + '/';
            });
            wwObjLoader2Control.loadObjFile = function () {
                elemFileInput.click();
            };
            folderOptions.add(wwObjLoader2Control, 'loadObjFile').name('Load OBJ/MTL Files');
            var handleFileSelect = function (object3d) {
                app._handleFileSelect(object3d, wwObjLoader2Control.pathTexture);
            };
            elemFileInput.addEventListener('change', handleFileSelect, false);
            wwObjLoader2Control.clearAllAssests = function () {
                app.clearAllAssests();
            };
            folderOptions.add(wwObjLoader2Control, 'clearAllAssests').name('Clear Scene');
        }
        folderOptions.open();
        // init three.js example application
        var resizeWindow = function () {
            app.resizeDisplayGL();
        };
        var render = function () {
            requestAnimationFrame(render);
            app.render();
        };
        window.addEventListener('resize', resizeWindow, false);
        console.log('Starting initialisation phase...');

        app.initGL();
        app.resizeDisplayGL();
        app.initPostGL();
        var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            'male02',
            'obj/male02/',
            'male02.obj',
            'obj/male02/',
            'male02.mtl'
        );
        app.loadFiles(prepData);

        // start render loop
        render();
    }
}

window.onload = MR.run;
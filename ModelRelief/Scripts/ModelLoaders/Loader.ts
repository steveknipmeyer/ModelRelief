// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 

import {Logger, ConsoleLogger}  from 'Logger'
import {Graphics}               from "Graphics"
import {OBJLoader}              from "OBJLoader"
import {Services}               from 'Services'
import {Viewer}                 from 'Viewer'

const testModelColor = '#558de8';

export class Loader {

    /** Default constructor
     * @class Loader
     * @constructor
     */
    constructor() {  
    }

    /**
     * Loads a model based on the model name and path embedded in the HTML page.
     * @param viewer Instance of the Viewer to display the model.
     */    
    loadOBJModel (viewer : Viewer) {

        let modelNameElement : HTMLElement = window.document.getElementById('modelName');
        let modelPathElement : HTMLElement = window.document.getElementById('modelPath');

        let modelName    : string = modelNameElement.textContent;
        let modelPath    : string = modelPathElement.textContent;
        let fileName     : string = modelPath + modelName;

        let manager = new THREE.LoadingManager();
        let loader  = new OBJLoader(manager);
        
        let onProgress = function (xhr) {

            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(percentComplete.toFixed(2) + '% downloaded');
            }
        };

        let onError = function (xhr) {
        };        

        loader.load(fileName, function (group : THREE.Group) {
            
            viewer.model = group;

        }, onProgress, onError);
    }

    /**
     * Adds a torus to a scene.
     * @param viewer Instance of the Viewer to display the model
     */
    loadTorusModel(viewer : Viewer) {
        
        let torusScene = new THREE.Group();

        // Setup some geometries
        let geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
        let material = new THREE.MeshPhongMaterial({ color: testModelColor });

        let count = 50;
        let scale = 5;

        for (let i = 0; i < count; i++) {

            let r = Math.random() * 2.0 * Math.PI;
            let z = (Math.random() * 2.0) - 1.0;
            let zScale = Math.sqrt(1.0 - z * z) * scale;

            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                Math.cos(r) * zScale,
                Math.sin(r) * zScale,
                z * scale
            );
            mesh.rotation.set(Math.random(), Math.random(), Math.random());

            mesh.name = 'Torus Component';
            torusScene.add(mesh);
        }
        viewer.model = torusScene;
    }

    /**
     * Adds a test sphere to a scene.
     * @param viewer Instance of the Viewer to display the model.
     */
    loadSphereModel (viewer : Viewer) {

        // geometry
        let radius   : number = 2;
        let segments : number = 64;
        let geometry = new THREE.SphereGeometry(radius, segments, segments);

        let material = new THREE.MeshPhongMaterial({ color: testModelColor });

        let mesh = new THREE.Mesh(geometry, material);
        let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
        mesh.position.set(center.x, center.y, center.z);

        mesh.name = 'Sphere';
        viewer.model = mesh;
    }

    /**
     * Add a test box to a scene.
     * @param viewer Instance of the Viewer to display the model.
     */
    loadBoxModel (viewer : Viewer) {

        // box
        let dimensions : number = 2.0
        let width  : number = dimensions;
        let height : number = dimensions;
        let depth  : number = dimensions;

        let geometry : THREE.Geometry = new THREE.BoxGeometry(width, height, depth);
        let material : THREE.Material = new THREE.MeshPhongMaterial({ color: testModelColor });

        let mesh = new THREE.Mesh(geometry, material);
        let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
        mesh.position.set(center.x, center.y, center.z);

        mesh.name = 'Box';
        viewer.model = mesh;
    }

    /**
     * Add a test model consisting of a tiered checkerboard
     * @param viewer Instance of the Viewer to display the model.
     */
    loadCheckerboardModel (viewer : Viewer) {
        
        let gridLength     : number = 2
        let totalHeight    : number = 1;       
        let gridDivisions  : number = 4;
        let totalCells     : number = Math.pow(gridDivisions, 2);

        let cellBase       : number = gridLength / gridDivisions;
        let cellHeight     : number = totalHeight / totalCells;

        let originX : number = -(cellBase * (gridDivisions / 2)) + (cellBase / 2);
        let originY : number = originX;
        let originZ : number = cellHeight / 2;
        let origin  : THREE.Vector3 = new THREE.Vector3(originX, originY, originZ);

        let baseColor      : number = 0x007070;
        let colorDelta     : number = (256 / totalCells) * Math.pow(256, 2);

        let group      : THREE.Group = new THREE.Group();
        let cellOrigin : THREE.Vector3 = origin.clone();
        let cellColor  : number = baseColor;
        for (let iRow : number = 0; iRow < gridDivisions; iRow++) {
            for (let iColumn : number = 0; iColumn < gridDivisions; iColumn++) {
                               
                let cellMaterial = new THREE.MeshPhongMaterial({color : cellColor});
                let cell : THREE.Mesh = Graphics.createBoxMesh(cellOrigin, cellBase, cellBase, cellHeight, cellMaterial);
                group.add (cell);

                cellOrigin.x += cellBase;
                cellOrigin.z += cellHeight;
                cellColor    += colorDelta;
            }
        cellOrigin.x = origin.x;
        cellOrigin.y += cellBase;
        }       
        viewer.model = group;
    }
}

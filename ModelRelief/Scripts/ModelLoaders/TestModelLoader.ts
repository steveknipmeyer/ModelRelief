// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 

import {ILogger, ConsoleLogger}  from 'Logger'
import {Graphics}               from "Graphics"
import {Services}               from 'Services'
import {Viewer}                 from 'Viewer'

const testModelColor = '#558de8';

export enum TestModel {
    Torus,
    Sphere,
    SlopedPlane,
    Box,
    Checkerboard
}

export class TestModelLoader {

    /** Default constructor
     * @class TestModelLoader
     * @constructor
     */
    constructor() {  
    }

    /**
     * @description Loads a parametric test model.
     * @param {Viewer} viewer Viewer instance to receive model.
     * @param {TestModel} modelType Model type (Box, Sphere, etc.)
     */
    loadTestModel (viewer : Viewer, modelType : TestModel) {

        switch (modelType){

            case TestModel.Torus:
                this.loadTorusModel(viewer);
                break;

            case TestModel.Sphere:
                this.loadSphereModel(viewer);
                break;

            case TestModel.SlopedPlane: 
                this.loadSlopedPlaneModel(viewer);
                break;

            case TestModel.Box:
                this.loadBoxModel(viewer);
                break;

            case TestModel.Checkerboard:
                this.loadCheckerboardModel(viewer);          
                break;
        }
    }

    /**
     * Adds a torus to a scene.
     * @param viewer Instance of the Viewer to display the model
     */
    private loadTorusModel(viewer : Viewer) {
        
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
        viewer.setModel (torusScene);
    }

    /**
     * Adds a test sphere to a scene.
     * @param viewer Instance of the Viewer to display the model.
     */
    private loadSphereModel (viewer : Viewer) {

        let radius = 2;    
        let mesh = Graphics.createSphereMesh(new THREE.Vector3, radius, new THREE.MeshPhongMaterial({ color: testModelColor }))
        viewer.setModel(mesh);
    }

    /**
     * Add a test box to a scene.
     * @param viewer Instance of the Viewer to display the model.
     */
    private loadBoxModel (viewer : Viewer) {

        let width  = 2;    
        let height = 2;    
        let depth  = 2;    
        let mesh = Graphics.createBoxMesh(new THREE.Vector3, width, height, depth, new THREE.MeshPhongMaterial({ color: testModelColor }))

        viewer.setModel(mesh);
    }

    /**
     * Add a sloped plane to a scene.
     * @param viewer Instance of the Viewer to display the model.
     */
    private loadSlopedPlaneModel (viewer : Viewer) {

        let width  = 2;    
        let height = 2;    
        let mesh = Graphics.createPlaneMesh(new THREE.Vector3, width, height, new THREE.MeshPhongMaterial({ color: testModelColor }))       
        mesh.rotateX(Math.PI / 4);
        
        mesh.name = 'SlopedPlane';
        viewer.setModel(mesh);
    }

    /**
     * Add a test model consisting of a tiered checkerboard
     * @param viewer Instance of the Viewer to display the model.
     */
    private loadCheckerboardModel (viewer : Viewer) {
        
        let gridLength     : number = 2;
        let totalHeight    : number = 1.0;        
        let gridDivisions  : number = 2;
        let totalCells     : number = Math.pow(gridDivisions, 2);

        let cellBase       : number = gridLength / gridDivisions;
        let cellHeight     : number = totalHeight / totalCells;

        let originX : number = -(cellBase * (gridDivisions / 2)) + (cellBase / 2);
        let originY : number = originX;
        let originZ : number = -cellHeight / 2;
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

        group.name = 'Checkerboard';
        viewer.setModel(group);
    }
}

// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";

const testModelColor = "#558de8";

export enum TestModel {
    Torus,
    Sphere,
    SlopedPlane,
    Box,
    Checkerboard,
}

export class TestModelLoader {

    /** Default constructor
     * @class TestModelLoader
     * @constructor
     */
    constructor() {
        // NOP
    }

    /**
     * @description Loads a model.
     * @param {TestModel} modelType Model type (Box, Sphere, etc.)
     * @returns {Promise<THREE.Group>}
     */
    public async loadModelAsync(modelType: TestModel): Promise<THREE.Group> {

        const modelGroup = this.loadTestModel (modelType);
        return modelGroup;
    }

    /**
     * @description Loads a parametric test model.
     * @param {TestModel} modelType Model type (Box, Sphere, etc.)
     */
    public loadTestModel(modelType: TestModel): THREE.Group {

        let modelGroup: THREE.Group;
        switch (modelType) {

            case TestModel.Torus:
                modelGroup = this.loadTorusModel();
                break;

            case TestModel.Sphere:
                modelGroup = this.loadSphereModel();
                break;

            case TestModel.SlopedPlane:
                modelGroup = this.loadSlopedPlaneModel();
                break;

            case TestModel.Box:
                modelGroup = this.loadBoxModel();
                break;

            case TestModel.Checkerboard:
                modelGroup = this.loadCheckerboardModel();
                break;
        }
        return modelGroup;
    }

    /**
     * Constructs a torus.
     */
    private loadTorusModel(): THREE.Group {

        const modelGroup = new THREE.Group();
        modelGroup.name = ObjectNames.ModelGroup;

        // Setup some geometries
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
        const material = new THREE.MeshPhongMaterial({ color: testModelColor });

        const count = 50;
        const scale = 5;

        for (let i = 0; i < count; i++) {

            const r = Math.random() * 2.0 * Math.PI;
            const z = (Math.random() * 2.0) - 1.0;
            const zScale = Math.sqrt(1.0 - z * z) * scale;

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                Math.cos(r) * zScale,
                Math.sin(r) * zScale,
                z * scale,
            );
            mesh.rotation.set(Math.random(), Math.random(), Math.random());

            mesh.name = "Torus Component";
            modelGroup.add(mesh);
        }
        return modelGroup;
    }

    /**
     * Constructs a test sphere.
     */
    private loadSphereModel(): THREE.Group {

        const radius = 2;
        const mesh = Graphics.createSphereMesh(new THREE.Vector3(), radius, new THREE.MeshPhongMaterial({ color: testModelColor }));

        const modelGroup = new THREE.Group();
        modelGroup.name = ObjectNames.ModelGroup;
        modelGroup.add(mesh);

        return modelGroup;
    }

    /**
     * Constructs a test box.
     */
    private loadBoxModel(): THREE.Group {

        const width  = 2;
        const height = 2;
        const depth  = 2;
        const mesh = Graphics.createBoxMesh(new THREE.Vector3(), width, height, depth, new THREE.MeshPhongMaterial({ color: testModelColor }));

        const modelGroup = new THREE.Group();
        modelGroup.name = ObjectNames.ModelGroup;
        modelGroup.add(mesh);

        return modelGroup;
    }

    /**
     * Add a sloped plane to a scene.
     */
    private loadSlopedPlaneModel(): THREE.Group {

        const width  = 2;
        const height = 2;
        const mesh = Graphics.createPlaneMesh(new THREE.Vector3(), width, height, new THREE.MeshPhongMaterial({ color: testModelColor }));
        mesh.rotateX(Math.PI / 4);

        mesh.name = "SlopedPlane";

        const modelGroup = new THREE.Group();
        modelGroup.name = ObjectNames.ModelGroup;
        modelGroup.add(mesh);

        return modelGroup;
    }

    /**
     * Add a test model consisting of a tiered checkerboard
     */
    private loadCheckerboardModel(): THREE.Group {

        const gridLength: number = 100.0;
        const totalHeight: number =  50.0;
        const gridDivisions: number = 2;
        const totalCells: number = Math.pow(gridDivisions, 2);

        const cellBase: number = gridLength / gridDivisions;
        const cellHeight: number = totalHeight / totalCells;

        const originX: number = -(cellBase * (gridDivisions / 2)) + (cellBase / 2);
        const originY: number = originX;
        const originZ: number = -cellHeight / 2;
        const origin: THREE.Vector3 = new THREE.Vector3(originX, originY, originZ);

        const baseColor: number = 0x007070;
        const colorDelta: number = (256 / totalCells) * Math.pow(256, 2);

        const modelGroup: THREE.Group = new THREE.Group();
        modelGroup.name = ObjectNames.ModelGroup;
        const cellOrigin: THREE.Vector3 = origin.clone();
        let cellColor: number = baseColor;
        for (let iRow: number = 0; iRow < gridDivisions; iRow++) {
            for (let iColumn: number = 0; iColumn < gridDivisions; iColumn++) {

                const cellMaterial = new THREE.MeshPhongMaterial({color : cellColor});
                const cell: THREE.Mesh = Graphics.createBoxMesh(cellOrigin, cellBase, cellBase, cellHeight, cellMaterial);
                modelGroup.add (cell);

                cellOrigin.x += cellBase;
                cellOrigin.z += cellHeight;
                cellColor    += colorDelta;
            }
            cellOrigin.x = origin.x;
            cellOrigin.y += cellBase;
        }

        modelGroup.name = "Checkerboard";
        return modelGroup;
    }
}

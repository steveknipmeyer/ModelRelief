// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE               from 'three'

import {DepthBufferFactory}     from 'DepthBufferFactory'
import {Graphics}               from 'Graphics'
import {Logger, HTMLLogger}     from 'Logger'
import {MathLibrary}            from 'Math'
import {MeshPreviewViewer}      from "MeshPreviewViewer"
import {Services}               from 'Services'
import {TrackballControls}      from 'TrackballControls'
import {UnitTests}              from 'UnitTests'

let logger = new HTMLLogger();

/**
 * @class
 * Widget
 */
export class Widget {
    
    name  : string;
    price : number;

    /**
     * @constructor
     */
    constructor(name : string, price : number) {

        this.name  = name;
        this.price = price;
    }

    /**
     * Operate
     */
    operate () {
        logger.addInfoMessage(`${this.name} operating....`);        
    }
}

/**
 * @class
 * SuperWidget
 */
export class ColorWidget extends Widget {

    color : string;

    /**
     * @constructor
     */
    constructor(name : string, price : number, color : string) {

        super (name, price);
        this.color = color;
    }
}

export class GrandParent {

    grandparentProperty  : string;
    constructor(grandparentProperty  : string) {

        this.grandparentProperty  = grandparentProperty ;
    }
}

export class Parent extends GrandParent{
    
    parentProperty : string;
    constructor(grandparentProperty  : string, parentProperty : string) {

        super(grandparentProperty);
        this.parentProperty = parentProperty;
    }
}

export class Child extends Parent{
    
    childProperty : string;
    constructor(grandparentProperty : string, parentProperty : string, childProperty : string) {

        super(grandparentProperty, parentProperty);
        this.childProperty = childProperty;
    }
}

/**
 * @class
 * Inheritance
 */
export class InheritanceTest {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Main
     */
    main () {
        
        let widget = new Widget ('Widget', 1.0);
        widget.operate();

        let colorWidget = new ColorWidget ('ColorWidget', 1.0, 'red');
        colorWidget.operate();

        let child = new Child('GaGa', 'Dad', 'Steve');    
    }
}

let inheritance = new InheritanceTest;
inheritance.main();

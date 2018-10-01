// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE               from 'three'

import {DepthBufferFactory}     from 'DepthBufferFactory'
import {Graphics}               from 'Graphics'
import {ILogger, HTMLLogger}     from 'Logger'
import {MathLibrary}            from 'Math'
import {Services}               from 'Services'
import {UnitTests}              from 'UnitTests'

let logger = new HTMLLogger();

/**
 * @description Widget
 * @export
 * @class Widget
 */
export class Widget {
    
    name  : string;
    price : number;

    /**
     * Creates an instance of Widget.
     * @param {string} name Name of widget.
     * @param {number} price Price of widget.
     */
    constructor(name : string, price : number) {

        this.name  = name;
        this.price = price;
    }

    /**
     * @description Operate
     */
    operate () {
        logger.addInfoMessage(`${this.name} operating....`);        
    }
}

/**
 * @description SuperWidget
 * @export
 * @class ColorWidget
 * @extends {Widget}
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

/**
 * @description Grandparent.
 * @export
 * @class GrandParent
 */
export class GrandParent {

    grandparentProperty  : string;

    /**
     * Creates an instance of GrandParent.
     * @param {string} grandparentProperty 
     */
    constructor(grandparentProperty  : string) {

        this.grandparentProperty  = grandparentProperty ;
    }
}
/**
 * @description Parent.
 * @export
 * @class Parent
 * @extends {GrandParent}
 */
export class Parent extends GrandParent{
    
    parentProperty : string;

    /**
     * Creates an instance of Parent.
     * @param {string} grandparentProperty 
     * @param {string} parentProperty 
     */
    constructor(grandparentProperty  : string, parentProperty : string) {

        super(grandparentProperty);
        this.parentProperty = parentProperty;
    }
}
/**
 * @description Child.
 * @export
 * @class Child
 * @extends {Parent}
 */
export class Child extends Parent{
    
    childProperty : string;

    /**
     * Creates an instance of Child.
     * @param {string} grandparentProperty 
     * @param {string} parentProperty 
     * @param {string} childProperty 
     */
    constructor(grandparentProperty : string, parentProperty : string, childProperty : string) {

        super(grandparentProperty, parentProperty);
        this.childProperty = childProperty;
    }
}

/**
 * @description 
 * @export Inheritance
 * @class InheritanceTest
 */
export class InheritanceTest {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @description Main
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

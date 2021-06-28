
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
// MRHome; cd ModelRelief
// npx tsc -t ES2020 -m commonjs Scripts/Workbench/InheritanceTest.ts

"use strict";

/**
 * @description Widget
 * @export
 * @class Widget
 */
export class Widget {

    public name: string;
    public price: number;

    /**
     * Creates an instance of Widget.
     * @param {string} name Name of widget.
     * @param {number} price Price of widget.
     */
    constructor(name: string, price: number) {

        this.name  = name;
        this.price = price;
    }

    /**
     * @description Operate
     */
    public operate(): void {
        console.log(`${this.name} operating....`);
    }
}

/**
 * @description ColorWidget
 * @export
 * @class ColorWidget
 * @extends {Widget}
 */
export class ColorWidget extends Widget {

    public color: string;

    /**
     * @constructor
     */
    constructor(name: string, price: number, color: string) {

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

    public grandparentProperty: string;

    /**
     * Creates an instance of GrandParent.
     * @param {string} grandparentProperty
     */
    constructor(grandparentProperty: string) {

        this.grandparentProperty  = grandparentProperty ;
    }
}
/**
 * @description Parent.
 * @export
 * @class Parent
 * @extends {GrandParent}
 */
export class Parent extends GrandParent {

    public parentProperty: string;

    /**
     * Creates an instance of Parent.
     * @param {string} grandparentProperty
     * @param {string} parentProperty
     */
    constructor(grandparentProperty: string, parentProperty: string) {

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
export class Child extends Parent {

    public childProperty: string;

    /**
     * Creates an instance of Child.
     * @param {string} grandparentProperty
     * @param {string} parentProperty
     * @param {string} childProperty
     */
    constructor(grandparentProperty: string, parentProperty: string, childProperty: string) {

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
        // NOP
    }

    /**
     * @description Main
     */
    public main(): void {

        const widget = new Widget ("Widget", 1.0);
        widget.operate();

        const colorWidget = new ColorWidget ("ColorWidget", 1.0, "red");
        colorWidget.operate();

        const child = new Child("Grandfather", "Father", "Child");
    }
}

const inheritance = new InheritanceTest();
inheritance.main();

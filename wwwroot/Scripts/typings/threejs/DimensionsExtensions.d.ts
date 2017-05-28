// Type definitions 

declare class Stats {       

    domElement : HTMLElement;

    constructor ();
    update () : any;
}

declare namespace THREE {
    export class OBJLoader2 {
        _getValidator();
    }
}

/*
declare namespace THREE.OBJLoader2 {

    export class WWOBJLoader2{
        PrepDataArrayBuffer() : any;
        PrepDataFile() : any;
    }
}
*/

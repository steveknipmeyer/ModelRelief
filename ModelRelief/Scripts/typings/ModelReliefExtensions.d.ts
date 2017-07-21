// Type definitions 
import * as THREE from 'THREE';

export as namespace THREE;

declare class Stats {       

    domElement : HTMLElement;

    constructor ();
    update () : any;
}

export interface Validator {

	/**
		* If given input is null or undefined, false is returned otherwise true.
		*
		* @param input Anything
		* @returns {boolean}
		*/
	isValid : (input : any) => boolean;

	/**
		* If given input is null or undefined, the defaultValue is returned otherwise the given input.
		*
		* @param input Anything
		* @param defaultValue Anything
		* @returns {*}
		*/
	verifyInput: (input : any, defaultValue: any ) => any;
}

export class OBJLoader {
    constructor ();
    load (fileName : string, callback : (object : THREE.Object3D) => any) : any;
}

export class OBJLoader2 {
    _getValidator() : Validator;
}

export class WWOBJLoader2 {

        prepareRun (any) : void;
        run () : void;

        registerCallbackProgress(callback: (content : any) => void) : void;
        registerCallbackCompletedLoading(callback: (content : any) => void) : void;
        registerCallbackMaterialsLoaded(callback: (materials : any) => void) : void;
        registerCallbackMeshLoaded(callback: (name : string, bufferGeometry : any, material : THREE.Material) => void) : void;
            
        setCrossOrigin (policy : string) : void;
}


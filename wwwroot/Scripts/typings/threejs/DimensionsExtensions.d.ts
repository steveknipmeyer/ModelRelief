// Type definitions 

declare class Stats {       

    domElement : HTMLElement;

    constructor ();
    update () : any;
}

declare namespace THREE {
	interface Validator {

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

    export class OBJLoader2 {
        _getValidator() : Validator;
    }
}

declare namespace THREE.OBJLoader2 {

    export class WWOBJLoader2 {

            prepareRun (any) : void;
            run () : void;

            registerCallbackProgress(callback: (content : any) => void) : void;
            registerCallbackCompletedLoading(callback: (content : any) => void) : void;
            registerCallbackMaterialsLoaded(callback: (materials : any) => void) : void;
            registerCallbackMeshLoaded(callback: (name : string, bufferGeometry : any, material : Material) => void) : void;
            
            setCrossOrigin (policy : string) : void;
    }
}

declare namespace THREE.OBJLoader2.WWOBJLoader2 {

    export class PrepDataArrayBuffer{

        constructor (modelName : string, buffer : Uint8Array, pathTexture : string, material : string);
        
        setSceneGraphBaseNode(node : THREE.Object3D) : void;
        setStreamMeshes(streamMeshes : boolean);
    }

    export class PrepDataFile{

        constructor (modelName : string, path : string, file : string, texturePath : string, materialFile : string);
    }
    export class LoadedMeshUserOverride {

     /*
     * @param {boolean} disregardMesh=false Tell WWOBJLoader2 to completely disregard this mesh
     * @param {THREE.BufferGeometry} bufferGeometry The {@link THREE.BufferGeometry} to be used
     * @param {THREE.Material} material The {@link THREE.Material} to be used
     */
     constructor (disregardMesh : boolean, bufferGeometry : THREE.BufferGeometry, material : THREE.Material);
    }
}


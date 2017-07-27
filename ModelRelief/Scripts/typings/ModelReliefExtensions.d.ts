// Type definitions (currently omitted from THREE definitions)

declare class Stats {

    domElement: HTMLElement;

    constructor();
    update(): any;
}

declare interface Validator {

    /**
        * If given input is null or undefined, false is returned otherwise true.
        *
        * @param input Anything
        * @returns {boolean}
        */
    isValid: (input: any) => boolean;

    /**
        * If given input is null or undefined, the defaultValue is returned otherwise the given input.
        *
        * @param input Anything
        * @param defaultValue Anything
        * @returns {*}
        */
    verifyInput: (input: any, defaultValue: any) => any;
}

declare class OBJLoader2 {
    _getValidator(): Validator;
}

declare class WWOBJLoader2 {

    prepareRun(any): void;
    run(): void;

    registerCallbackProgress(callback: (content: any) => void): void;
    registerCallbackCompletedLoading(callback: (content: any) => void): void;
    registerCallbackMaterialsLoaded(callback: (materials: any) => void): void;
    registerCallbackMeshLoaded(callback: (name: string, bufferGeometry: any, material: THREE.Material) => void): void;

    setCrossOrigin(policy: string): void;
}

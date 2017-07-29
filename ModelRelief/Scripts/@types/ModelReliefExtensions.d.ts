// Type definitions (currently omitted from THREE definitions)

declare class MR {
    
    static shaderSource : any;
}

declare class Stats {

    domElement: HTMLElement;

    constructor();
    update(): any;
}

declare class TrackballControls extends THREE.EventDispatcher {
    constructor(object: THREE.Camera, domElement?: HTMLElement);

    object: THREE.Camera;
    domElement: HTMLElement;

    // API
    enabled: boolean;
    screen: {left: number; top: number; width: number; height: number};
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
    noRotate: boolean;
    noZoom: boolean;
    noPan: boolean;
    noRoll: boolean;
    staticMoving: boolean;
    dynamicDampingFactor: number;
    minDistance: number;
    maxDistance: number;
    keys: number[];

    target: THREE.Vector3;
    position0: THREE.Vector3;
    target0: THREE.Vector3;
    up0: THREE.Vector3;

    update(): void;

    reset(): void;

    checkDistances(): void;

    zoomCamera(): void;

    panCamera(): void;

    rotateCamera(): void;

    handleResize(): void;

    handleEvent(event: any): void;
}

declare class OBJLoader {

    constructor(manager?: THREE.LoadingManager);

    manager: THREE.LoadingManager;
    regexp: any;
    materials: THREE.Material[];
    path: string;

    load(url: string, onLoad: (group: THREE.Group) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
    parse(data: string) : THREE.Group;
    setPath(value: string) : void;
    setMaterials(materials: any) : void;
    _createParserState() : any;
}

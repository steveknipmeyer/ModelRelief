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
    staticMoving: boolean;
    dynamicDampingFactor: number;
    minDistance: number;
    maxDistance: number;
    keys: number[];

    target: THREE.Vector3;
    lastPosition: THREE.Vector3;
    target0: THREE.Vector3;
    position0: THREE.Vector3;
    up0: THREE.Vector3;

    eye: THREE.Vector3;
    lookAt: THREE.Vector3;

    handleResize(): void;
    handleEvent(event: any): void;
    getMouseOnScreen(): THREE.Vector2;
    getMouseOnCircle(): THREE.Vector2;
    rotateCamera(): void;
    zoomCamera(): void;
    panCamera(): void;
    checkDistances(): void;
    update(): void;
    reset(): void;
    dispose(): void;
}

declare class OrthographicTrackballControls extends THREE.EventDispatcher {
    constructor(object: THREE.Camera, domElement?: HTMLElement);

    object: THREE.Camera;
    domElement: HTMLElement;

    // API
    enabled: boolean;
    screen: {left: number; top: number; width: number; height: number};
    radius: number;

    rotateSpeed: number;
    zoomSpeed: number;
    noRotate: boolean;
    noZoom: boolean;
    noPan: boolean;
    noRoll: boolean;
    staticMoving: boolean;
    dynamicDampingFactor: number;
    keys: number[];

    target: THREE.Vector3;
    target0: THREE.Vector3;
    position0: THREE.Vector3;
    up0: THREE.Vector3;

    eye: THREE.Vector3;
    lookAt: THREE.Vector3;

    handleResize(): void;
    handleEvent(event: any): void;
    getMouseOnScreen(): THREE.Vector2;
    getMouseProjectionOnBall(): THREE.Vector3;
    rotateCamera(): void;
    zoomCamera(): void;
    panCamera(): void;
    update(): void;
    reset(): void;
    dispose(): void;
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

const fetch = require('node-fetch')

 /**
 *  Common interface for all DTO model types.
 *  @interface
 */

 /**
 * Server Endpoints
 */
export enum ServerEndPoints {
    ApiMeshes        = 'api/v1/meshes',
    ApiDepthBuffers  = 'api/v1/depth-buffers'
}

export interface IModel {

    id: number;

    name: string;
    description: string;
    }

/**
 * HTTP Content-type
 */
enum ContentType {
    Json          = 'application/json',
    OctetStream   = 'application/octet-stream'
}

/**
 * HTTP Method
 */
enum MethodType {
    Get = 'GET',
    Delete = 'DELETE',
    Patch = 'PUT',
    Post  = 'POST',
    Put = 'PUT',
}

/**
 * Represents the result of a client request.
 */
export class RequestResponse {

    response: Response;
    contentString: string;

    /**
     * Constructs an instance of a RequestResponse.
     * @param {Response} response Raw response from the request.
     * @param {string} contentString Response body content;
     */
    constructor(response: Response, contentString : string) {

        this.response = response;
        this.contentString = contentString;
    }

    /**
     * Gets the JSON representation of the response.
     */
    get model(): IModel {

        return JSON.parse(this.contentString) as IModel;
    }

    /**
     * Gets the raw Uint8Array representation of the response.
     */
    get byteArray(): Uint8Array {

        // https://jsperf.com/string-to-uint8array
        let stringLength = this.contentString.length;
        let array = new Uint8Array(stringLength);
        for (var iByte = 0; iByte < stringLength; ++iByte) {
            array[iByte] = this.contentString.charCodeAt(iByte);
        }
        return array;
    }
}

async function submitHttpRequestAsync(endpoint: string, methodType: MethodType, contentType: ContentType, requestData: any) : Promise<RequestResponse>{

    let headers = {
        'Content-Type': contentType
    };
    
    let requestMode: RequestMode = 'cors';
    let cacheMode: RequestCache = 'default';

    let init = {
        method: methodType,
        body: requestData,
        headers: headers,
        mode: requestMode,
        cache: cacheMode,
    };

    let response = await fetch(endpoint, init);
    let contentString = await response.text();

    let result = new RequestResponse(response, contentString);
    return result;
}

let endpoint = "http://localhost:60655/api/v1/projects/1";
let resultPromise = submitHttpRequestAsync(endpoint, MethodType.Get, ContentType.Json, null);
resultPromise.then(resolution => {
    resolution
});




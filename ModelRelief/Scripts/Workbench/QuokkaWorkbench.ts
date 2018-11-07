// tslint:disable-next-line:no-var-requires
const fetch = require("node-fetch");

 /**
  *  Common interface for all DTO model types.
  *  @interface
  */

 /**
  * Server Endpoints
  */
export enum ServerEndPoints {
    ApiMeshes        = "api/v1/meshes",
    ApiDepthBuffers  = "api/v1/depth-buffers",
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
    Json          = "application/json",
    OctetStream   = "application/octet-stream",
}

/**
 * HTTP Method
 */
enum MethodType {
    Get = "GET",
    Delete = "DELETE",
    Patch = "PUT",
    Post  = "POST",
    Put = "PUT",
}

/**
 * Represents the result of a client request.
 */
export class RequestResponse {

    public response: Response;
    public contentString: string;

    /**
     * Constructs an instance of a RequestResponse.
     * @param {Response} response Raw response from the request.
     * @param {string} contentString Response body content;
     */
    constructor(response: Response, contentString: string) {

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
        const stringLength = this.contentString.length;
        const array = new Uint8Array(stringLength);
        for (let iByte = 0; iByte < stringLength; ++iByte) {
            array[iByte] = this.contentString.charCodeAt(iByte);
        }
        return array;
    }
}

async function submitHttpRequestAsync(theEndpoint: string, methodType: MethodType, contentType: ContentType, requestData: any): Promise<RequestResponse> {

    const headers = {
        "Content-Type": contentType,
    };

    const requestMode: RequestMode = "cors";
    const cacheMode: RequestCache = "default";

    const init = {
        method: methodType,
        body: requestData,
        headers,
        mode: requestMode,
        cache: cacheMode,
    };

    const response = await fetch(theEndpoint, init);
    const contentString = await response.text();

    const result = new RequestResponse(response, contentString);
    return result;
}

const endpoint = "http://localhost:60655/api/v1/projects/1";
const resultPromise = submitHttpRequestAsync(endpoint, MethodType.Get, ContentType.Json, null);
resultPromise.then((resolution) => {
    console.log (resolution);
});




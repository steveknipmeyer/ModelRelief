// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto                             from 'DtoModels'

import { ConvertBase64 }                    from 'ConvertBase64'
import { Exception }                        from 'Exception'
import { HttpStatusCode, HttpStatusMessage }from 'HttpStatus'
import { DepthBufferFormat }                from 'IDepthBuffer'
import { IModel }                           from 'IModel'
import { Services }                         from 'Services'
import { MeshTransform }                    from 'MeshTransform'

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
     * https://jsperf.com/string-to-uint8array
     */
    get byteArray(): Uint8Array {

        let base64String = this.fileContent;

        let stringLength = base64String.length;
        let array = new Uint8Array(stringLength);
        for (var iByte = 0; iByte < stringLength; ++iByte) {
            array[iByte] = base64String.charCodeAt(iByte);
        }
        return array;
    }

    /**
     * Gets the decoded Uint8Array representation of the response.
     * // https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
     */
    get byteArrayDecoded(): Uint8Array {

        let base64String = this.fileContent;

        let binaryString =  window.atob(base64String);
        let length = binaryString.length;
        let bytes = new Uint8Array(length);
        for (var i = 0; i < length; i++)        {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Gets the decoded Uint8Array representation of the response.
     * https://gist.github.com/borismus/1032746
     */
    get byteArrayDecodedPrime() : Uint8Array{

        let base64String = this.fileContent;

        let BASE64_MARKER = ';base64,';
        var base64Index = base64String.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = base64String.substring(base64Index);
        var raw = window.atob(base64);       
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for(let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    /**
     * Gets the decoded Uint8Array representation of the response.
     */
    get byteArrayDecodedDoublePrime() : Uint8Array{

        let base64String = this.fileContent;

        let converter = new ConvertBase64();
        let byteArray = converter.toByteArray(base64String);
        return byteArray;
    }

    /**
     * @description Returns the Base64-encoded contents of a FileContentResult IActionItem.
     * @returns {string} 
     */
    get fileContent() : string {

        let resultJson = JSON.parse(this.contentString);
        let contents = resultJson.fileContents;
        return contents as string;
    }
}

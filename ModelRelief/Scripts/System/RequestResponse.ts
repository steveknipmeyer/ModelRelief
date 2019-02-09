// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {ConvertBase64} from "Scripts/System/ConvertBase64";

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
     * https://jsperf.com/string-to-uint8array
     */
    get byteArray(): Uint8Array {

        const base64String = this.fileContent;

        const stringLength = base64String.length;
        const array = new Uint8Array(stringLength);
        for (let iByte = 0; iByte < stringLength; ++iByte) {
            array[iByte] = base64String.charCodeAt(iByte);
        }
        return array;
    }

    /**
     * Gets the decoded Uint8Array representation of the response.
     * // https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
     */
    get byteArrayDecoded(): Uint8Array {

        const base64String = this.fileContent;

        const binaryString =  window.atob(base64String);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++)        {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Gets the decoded Uint8Array representation of the response.
     * https://gist.github.com/borismus/1032746
     */
    get byteArrayDecodedPrime(): Uint8Array {

        const base64String = this.fileContent;

        const BASE64_MARKER = ";base64,";
        const base64Index = base64String.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const base64 = base64String.substring(base64Index);
        const raw = window.atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    /**
     * Gets the decoded Uint8Array representation of the response.
     */
    get byteArrayDecodedDoublePrime(): Uint8Array {

        const base64String = this.fileContent;

        const converter = new ConvertBase64();
        const byteArray = converter.toByteArray(base64String) as Uint8Array;
        return byteArray;
    }

    /**
     * @description Returns the Base64-encoded contents of a FileContentResult IActionItem.
     * @returns {string}
     */
    get fileContent(): string {

        const resultJson = JSON.parse(this.contentString);
        const contents = resultJson.fileContents;
        return contents as string;
    }
}

// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {ConvertBase64} from "Scripts/System/ConvertBase64";

/**
 * Represents the result of a client request.
 */
export class RequestResponse {

    public response: Response;

    /**
     * Constructs an instance of a RequestResponse.
     * @param {Response} response Raw response from the request.
     */
    constructor(response: Response) {

        this.response = response;
    }

    /**
     * Gets the JSON representation of the response.
     */
    public async modelAsync(): Promise<IModel> {

        return JSON.parse(await this.stringAsync()) as IModel;
    }

    /**
     * Gets the Uint8Array representation of the response.
     */
    public async arrayAsync(): Promise<Uint8Array> {

        const buffer =  await this.response.arrayBuffer();
        return new Uint8Array(buffer);
    }

    /**
     * Gets the string representation of the response.
     */
    public async stringAsync(): Promise<string> {

        return await this.response.text();
    }

    /**
     * Gets the decoded Uint8Array representation of the response.
     * The string must have been encoded with windows.btoa.
     * // https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
     */
    public async byteArrayFromabtoaAsync(): Promise<Uint8Array> {

        const base64String = await this.stringAsync();

        // N.B. string must have been encoded with window.btoa
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
     * The string must have been encoded with windows.btoa.
     * Expects a ';base64,' marker at the beginning of the encoded string.
     * https://gist.github.com/borismus/1032746
     */
    public async byteArrayFrombtoaWithMarkerAsync(): Promise<Uint8Array> {

        const base64String = await this.stringAsync();

        // N.B. string must have been encoded with window.btoa
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
    public async  byteArrayFromBase64Async(): Promise<Uint8Array> {

        const base64String = await this.stringAsync();

        const converter = new ConvertBase64();
        const byteArray = converter.toByteArray(base64String) as Uint8Array;
        return byteArray;
    }
}
